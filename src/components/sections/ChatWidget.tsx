"use client";

import * as React from "react";
import { ChatBubble } from "@/components/ui";
import {
  chatGreeting,
  quickReplies,
  scriptedReply,
  intakeGreeting,
  intakeQuickReplies,
  intakeReply,
  type QuickReply,
} from "@/lib/chat";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
}

export interface ChatWidgetProps {
  /**
   * Which scripted persona to use. `demo` is the hero assistant; `intake` is the
   * contact-page scope agent. Selects the greeting, quick replies and reply
   * function internally (a function can't cross the server→client boundary).
   * @default "demo"
   */
  variant?: "demo" | "intake";
  /** Opening bot message. @default the variant's greeting */
  greeting?: string;
  /** Quick-reply chips. @default the variant's set */
  quickReplies?: QuickReply[];
  /** Header title. @default "Switchboard Assistant" */
  title?: string;
  /** Header status line (after the green dot). @default "Online" */
  status?: React.ReactNode;
  /** Footer note. @default "Built by Switchboard AI Systems" */
  foot?: React.ReactNode;
  /** Input placeholder. @default "Type your message…" */
  placeholder?: string;
  /** Tailwind class controlling the widget height. @default "max-h-[560px]" */
  heightClass?: string;
  /** Element id (for in-page anchors). @default "chat" */
  id?: string;
}

/**
 * The scripted demo assistant. Scripted only (AGENTS.md), keyword-matched
 * replies from src/lib/chat.ts with a short typing delay, so the demo always
 * works with no AI backend. The DS <ChatBubble> renders each message. Props
 * default to the hero demo; the contact page passes the intake-agent script.
 */
export function ChatWidget({
  variant = "demo",
  greeting: greetingProp,
  quickReplies: quickRepliesProp,
  title = "Switchboard Assistant",
  status = "Online",
  foot,
  placeholder = "Type your message…",
  heightClass = "max-h-[560px]",
  id = "chat",
}: ChatWidgetProps = {}) {
  const isIntake = variant === "intake";
  const greeting = greetingProp ?? (isIntake ? intakeGreeting : chatGreeting);
  const quickReplyChips = quickRepliesProp ?? (isIntake ? intakeQuickReplies : quickReplies);
  const reply = isIntake ? intakeReply : scriptedReply;

  const [messages, setMessages] = React.useState<Message[]>([
    { id: 0, role: "bot", text: greeting },
  ]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const nextId = React.useRef(1);

  React.useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((m) => [...m, { id: nextId.current++, role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const replyText = reply(trimmed);
      setMessages((m) => [...m, { id: nextId.current++, role: "bot", text: replyText }]);
      setTyping(false);
    }, 600);
  };

  return (
    <div
      id={id}
      className={`flex ${heightClass} flex-col overflow-hidden rounded-lg border-strong border-ink bg-white shadow-pop`}
    >
      {/* head */}
      <div className="flex items-center gap-[11px] bg-dark px-4 py-[14px] text-on-dark">
        <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-sm bg-orange">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <rect x="4" y="8" width="16" height="11" rx="2.5" />
            <path d="M12 8V5M9 3.5h6" />
            <circle cx="9" cy="13" r="1.2" fill="#fff" stroke="none" />
            <circle cx="15" cy="13" r="1.2" fill="#fff" stroke="none" />
          </svg>
        </span>
        <div>
          <div className="font-display text-[.95rem] font-bold leading-tight">{title}</div>
          <div className="flex items-center gap-[5px] text-[.72rem] text-on-dark-strong">
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#5fcf7a]" /> {status}
          </div>
        </div>
      </div>

      {/* messages */}
      <div
        ref={bodyRef}
        className="flex min-h-[230px] flex-1 flex-col gap-3 overflow-y-auto bg-paper p-4"
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} from={m.role}>
            {m.text}
          </ChatBubble>
        ))}
        {typing && (
          <ChatBubble from="bot">
            <span className="inline-flex items-center gap-1" aria-label="Assistant is typing">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-soft" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-soft [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-soft [animation-delay:300ms]" />
            </span>
          </ChatBubble>
        )}
      </div>

      {/* quick replies */}
      <div className="flex flex-wrap gap-[7px] bg-paper px-4 pb-2">
        {quickReplyChips.map((q) => (
          <button
            key={q.query}
            type="button"
            onClick={() => send(q.query)}
            className="rounded-pill border border-line bg-white px-[13px] py-[7px] text-[.8rem] text-ink transition-colors hover:border-orange hover:text-orange"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* input */}
      <form
        className="flex gap-2 border-t border-line bg-white px-[14px] py-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder={placeholder}
          aria-label="Message the assistant"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-sm border border-line bg-white px-3 py-[10px] text-[.9rem] text-ink outline-none focus:border-orange"
        />
        <button
          type="submit"
          aria-label="Send"
          className="grid w-[42px] flex-none place-items-center rounded-sm bg-orange"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px]"
          >
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>

      {/* foot */}
      <div className="border-t border-line-soft bg-white py-[7px] text-center text-[.68rem] text-ink-soft">
        {foot ?? (
          <>
            Built by <b className="text-ink">Switchboard AI Systems</b>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatWidget;
