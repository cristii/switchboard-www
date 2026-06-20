import * as React from "react";

/**
 * A single message bubble in the assistant widget. Bot bubbles are white with
 * an ink hairline and an "Assistant" label; user bubbles are orange.
 */
export interface ChatBubbleProps {
  children: React.ReactNode;
  /** @default "bot" */
  from?: "bot" | "user";
  /** Show the "Assistant" label on bot bubbles. @default true */
  showLabel?: boolean;
  style?: React.CSSProperties;
}

export function ChatBubble(props: ChatBubbleProps): JSX.Element;
