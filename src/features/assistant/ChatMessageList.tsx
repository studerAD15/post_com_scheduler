/**
 * ChatMessageList.tsx - Message Stream with Alien Avatar Rendering & Suggestion Chips.
 *
 * Utilizes `font-switzer` for enhanced chat readability and renders the dynamically
 * selected alien avatar next to every assistant message.
 */

import React, { useEffect, useRef, useCallback } from "react";
import { ChatMessage } from "./assistantSlice";
import { getAlienConfig } from "./alienRegistry";
import { User as UserIcon, Bot, ArrowRight } from "lucide-react";

interface ChatMessageListProps {
  messages: ChatMessage[];
  selectedAvatarId: string;
  isTyping: boolean;
  onSelectSuggestion: (prompt: string) => void;
}

/**
 * Lightweight helper to format markdown bold and line breaks cleanly.
 */
function formatMessageContent(text: string): React.ReactNode {
  const lines = text.split("\n");

  return lines.map((line, lIdx) => {
    // Process markdown bold (**text**)
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formattedLine = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="font-bold text-[#0A0A0A]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    return (
      <React.Fragment key={lIdx}>
        {formattedLine}
        {lIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export const ChatMessageList: React.FC<ChatMessageListProps> = React.memo(
  ({ messages, selectedAvatarId, isTyping, onSelectSuggestion }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const alienConfig = getAlienConfig(selectedAvatarId);
    const AlienAvatarComponent = alienConfig.Component;

    // Auto-scroll to bottom on new message
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-switzer bg-[#FFFFFF]">
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isAssistant ? "justify-start" : "justify-end"
              }`}
            >
              {/* Left Avatar for Assistant */}
              {isAssistant && (
                <div
                  className="w-8 h-8 rounded-sm p-1 bg-[#FFFFFF] border-2 border-[#0A0A0A] text-[#0A0A0A] shrink-0 mt-0.5 shadow-sm"
                  title={`${alienConfig.name} (${alienConfig.codename})`}
                >
                  <AlienAvatarComponent className="w-full h-full" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-sm p-3 text-xs leading-relaxed ${
                  isAssistant
                    ? "bg-[#F4F4F5] text-[#0A0A0A] border border-[#E5E7EB]"
                    : "bg-[#3DDC10] text-[#0A0A0A] font-medium border-2 border-[#0A0A0A]"
                }`}
              >
                {/* Header info in bubble */}
                <div className="flex items-center justify-between gap-2 mb-1 text-[10px] font-mono opacity-60">
                  <span className="font-bold uppercase">
                    {isAssistant ? alienConfig.name : "You"}
                  </span>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1 break-words">
                  {formatMessageContent(msg.content)}
                </div>

                {/* Optional Suggestions */}
                {isAssistant && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#15803D] font-bold block">
                      SUGGESTED QUERIES:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => onSelectSuggestion(sug)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A] border border-[#0A0A0A] text-[10.5px] font-mono font-bold transition-colors text-left"
                        >
                          <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                          <span>{sug}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Avatar for User */}
              {!isAssistant && (
                <div className="w-8 h-8 rounded-sm p-1.5 bg-[#0A0A0A] border border-[#0A0A0A] text-[#FFFFFF] shrink-0 mt-0.5 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#71717A] font-mono pl-10 animate-pulse">
            <span className="w-1.5 h-1.5 bg-[#3DDC10] rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-[#3DDC10] rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-[#3DDC10] rounded-full animate-bounce [animation-delay:0.4s]"></span>
            <span className="text-[11px] text-[#3DDC10] font-bold">
              {alienConfig.name} is processing...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    );
  }
);

ChatMessageList.displayName = "ChatMessageList";
