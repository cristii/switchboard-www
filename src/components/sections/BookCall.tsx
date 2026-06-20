import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui";
import { bookingHref } from "@/lib/nav";

export type BookCallProps = Omit<ButtonProps, "href">;

/**
 * The "Book a 15-min call" CTA. Opens the Cal.com booking page when
 * NEXT_PUBLIC_CALCOM_LINK is set (e.g. "switchboard/15min"), otherwise falls
 * back to the contact route — so the button always works, even with no env.
 * (Upgrading to an inline Cal.com modal embed is backlogged.)
 */
export function BookCall({ children = "Book a 15-min call", ...props }: BookCallProps) {
  const link = process.env.NEXT_PUBLIC_CALCOM_LINK;
  const external = Boolean(link);
  const href = link ? `https://cal.com/${link}` : bookingHref;

  return (
    <Button
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </Button>
  );
}

export default BookCall;
