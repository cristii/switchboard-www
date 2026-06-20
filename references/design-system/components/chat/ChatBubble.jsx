import React from "react";

/**
 * ChatBubble — a single message in the assistant widget.
 *  - bot: white bubble, ink hairline, square bottom-left corner, "Assistant" label.
 *  - user: orange fill, white text, square bottom-right corner.
 */
export function ChatBubble({ children, from = "bot", showLabel = true, style = {} }) {
  const isBot = from === "bot";
  return (
    <div
      style={{
        maxWidth: "84%",
        padding: "10px 13px",
        borderRadius: "13px",
        fontSize: ".9rem",
        lineHeight: 1.45,
        alignSelf: isBot ? "flex-start" : "flex-end",
        background: isBot ? "var(--white)" : "var(--orange)",
        color: isBot ? "var(--ink)" : "#fff",
        border: isBot ? "1.5px solid var(--line)" : "none",
        borderBottomLeftRadius: isBot ? "4px" : "13px",
        borderBottomRightRadius: isBot ? "13px" : "4px",
        ...style,
      }}
    >
      {isBot && showLabel ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: ".7rem",
            color: "var(--ink-soft)",
            marginBottom: "5px",
            fontWeight: 600,
          }}
        >
          <i
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "5px",
              background: "var(--orange)",
              display: "inline-block",
            }}
          />
          Assistant
        </div>
      ) : null}
      {children}
    </div>
  );
}
