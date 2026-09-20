/**
 * AssistantWidget.tsx - Floating Omnitrix AI Assistant with 10 Animated Ben 10 Alien Avatars.
 *
 * Fully styled with Tailwind CSS, features a 10-alien quick-switch carousel bar,
 * first-time alien selection prompt, context-aware intelligence, and keyboard shortcuts.
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectIsAssistantOpen,
  selectSelectedAvatarId,
  selectHasChosenAlien,
  selectAssistantMessages,
  selectIsAssistantTyping,
  toggleAssistant,
  closeAssistant,
  toggleAvatarPicker,
  selectAvatar,
  sendAssistantPrompt,
  clearChatHistory,
} from "./assistantSlice";
import { ALIEN_REGISTRY, AlienAvatarConfig, getAlienConfig } from "./alienRegistry";
import { ChatMessageList } from "./ChatMessageList";
import { AvatarPickerModal } from "./AvatarPickerModal";
import { selectCurrentUser } from "../auth/authSlice";
import {
  X,
  Send,
  Sparkles,
  RotateCcw,
  Zap,
  Check,
  ChevronRight,
  Shield,
} from "lucide-react";

export const AssistantWidget: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsAssistantOpen);
  const selectedAvatarId = useAppSelector(selectSelectedAvatarId);
  const hasChosenAlien = useAppSelector(selectHasChosenAlien);
  const messages = useAppSelector(selectAssistantMessages);
  const isTyping = useAppSelector(selectIsAssistantTyping);
  const currentUser = useAppSelector(selectCurrentUser);

  const [inputPrompt, setInputPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const alienConfig = getAlienConfig(selectedAvatarId);
  const AlienAvatar = alienConfig.Component;

  const handleToggle = useCallback(() => {
    dispatch(toggleAssistant());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(closeAssistant());
    launcherRef.current?.focus();
  }, [dispatch]);

  const handleTogglePicker = useCallback(() => {
    dispatch(toggleAvatarPicker());
  }, [dispatch]);

  const handleQuickSelectAlien = useCallback(
    (alienId: string) => {
      dispatch(selectAvatar(alienId));
    },
    [dispatch]
  );

  const handleClear = useCallback(() => {
    dispatch(clearChatHistory());
  }, [dispatch]);

  const handleSendPrompt = useCallback(
    (promptText: string) => {
      const clean = promptText.trim();
      if (!clean || isTyping) return;
      dispatch(sendAssistantPrompt(clean));
      setInputPrompt("");
    },
    [dispatch, isTyping]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSendPrompt(inputPrompt);
    },
    [handleSendPrompt, inputPrompt]
  );

  // Focus input when opened if alien chosen
  useEffect(() => {
    if (isOpen && hasChosenAlien) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, hasChosenAlien]);

  // Keyboard accessibility: Escape key closes assistant
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <>
      {/* 1. Floating Launcher Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        {!isOpen && (
          <button
            ref={launcherRef}
            type="button"
            onClick={handleToggle}
            aria-label="Open Omnitrix AI Assistant"
            title={`Omnitrix AI Assistant (${alienConfig.name}) - Click for help`}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#0A0A0A] border-2 border-[#3DDC10] hover:border-[#34C20C] text-[#3DDC10] shadow-omni hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#3DDC10]"
          >
            {/* Animated Pulse Wave */}
            <span className="absolute -inset-1 rounded-full bg-[#3DDC10]/25 animate-ping pointer-events-none" />

            {/* Active Alien Vector Icon */}
            <div className="w-9 h-9 p-0.5 flex items-center justify-center">
              <AlienAvatar className="w-full h-full transform group-hover:scale-110 transition-transform" />
            </div>

            {/* Online Status Dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#3DDC10] rounded-full border-2 border-[#0A0A0A]" />
          </button>
        )}
      </div>

      {/* 2. Floating Assistant Chat Window */}
      {isOpen && (
        <div
          role="region"
          aria-label="Omnitrix AI Assistant Window"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[calc(100vh-2rem)] bg-[#141414] text-[#FFFFFF] border-2 border-[#3DDC10] rounded-sm shadow-omni-lg flex flex-col overflow-hidden animate-fadeIn"
        >
          {/* Header */}
          <div className="bg-[#0A0A0A] border-b border-[#2A2A2A] px-3.5 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Clickable Animated Alien Avatar Thumbnail */}
              <button
                type="button"
                onClick={handleTogglePicker}
                title="Click to switch alien hero"
                className="w-9 h-9 rounded-sm bg-[#1C1C1C] border border-[#3DDC10] p-1 text-[#3DDC10] hover:bg-[#3DDC10] hover:text-[#0A0A0A] transition-colors shrink-0 flex items-center justify-center relative group shadow-sm"
              >
                <AlienAvatar className="w-full h-full" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#3DDC10] border border-[#0A0A0A]" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-tempting text-lg text-[#3DDC10] leading-none">
                    OmniAssistant
                  </h3>
                  <span className="text-[10px] font-space text-[#A1A1AA] uppercase font-bold truncate">
                    // {alienConfig.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-[#3DDC10] rounded-full animate-pulse" />
                  <span className="text-[9px] font-mono text-[#71717A] uppercase tracking-wider truncate">
                    {currentUser ? `ROLE: ${currentUser.role}` : "GUEST MODE"} • {alienConfig.element}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1 shrink-0 text-[#71717A]">
              <button
                type="button"
                onClick={handleTogglePicker}
                title="Choose Alien Hero (10 Forms)"
                aria-label="Choose Alien Hero"
                className="p-1.5 rounded-sm hover:text-[#3DDC10] hover:bg-[#1C1C1C] transition-colors"
              >
                <Sparkles className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleClear}
                title="Reset Conversation"
                aria-label="Reset Conversation"
                className="p-1.5 rounded-sm hover:text-[#FF7A00] hover:bg-[#1C1C1C] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleClose}
                title="Close Assistant (Esc)"
                aria-label="Close Assistant"
                className="p-1.5 rounded-sm hover:text-[#FFFFFF] hover:bg-[#1C1C1C] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick-Select Alien Hero Carousel Strip (Choose alien directly) */}
          <div className="bg-[#0D0D0D] border-b border-[#2A2A2A] px-2.5 py-1.5 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
            <span className="text-[9px] font-mono text-[#71717A] font-bold uppercase tracking-wider shrink-0 pr-1">
              HERO:
            </span>
            {ALIEN_REGISTRY.map((alien: AlienAvatarConfig) => {
              const isCurrent = alien.id === selectedAvatarId;
              const MiniAlien = alien.Component;
              return (
                <button
                  key={alien.id}
                  type="button"
                  onClick={() => handleQuickSelectAlien(alien.id)}
                  title={`${alien.name} (${alien.element})`}
                  className={`w-7 h-7 rounded-sm p-0.5 shrink-0 flex items-center justify-center border transition-all ${
                    isCurrent
                      ? "bg-[#0A0A0A] border-[#3DDC10] shadow-[0_0_6px_#3DDC10] scale-110"
                      : "bg-[#181818] border-[#2A2A2A] hover:border-[#3DDC10]/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <MiniAlien className="w-full h-full" />
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleTogglePicker}
              className="text-[9px] font-mono text-[#3DDC10] hover:underline font-bold uppercase shrink-0 pl-1"
            >
              ALL 10 →
            </button>
          </div>

          {/* If user hasn't chosen an alien hero yet, show prominent Choice Prompt */}
          {!hasChosenAlien ? (
            <div className="flex-1 p-5 flex flex-col items-center justify-center text-center space-y-4 bg-[#0A0A0A]">
              <div className="w-16 h-16 rounded-sm bg-[#141414] border-2 border-[#3DDC10] p-2 flex items-center justify-center shadow-omni">
                <AlienAvatar className="w-full h-full" />
              </div>

              <div className="space-y-1 max-w-xs">
                <h4 className="text-sm font-space font-extrabold uppercase tracking-wide text-[#FFFFFF]">
                  CALIBRATE OMNITRIX COPILOT
                </h4>
                <p className="text-xs font-inter text-[#A1A1AA]">
                  Please choose your alien transformation form first to activate specialized publishing powers.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTogglePicker}
                className="py-2 px-5 bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] font-space font-extrabold uppercase tracking-wider text-xs rounded-sm shadow-omni transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                CHOOSE ALIEN HERO (10 FORMS)
              </button>
            </div>
          ) : (
            <>
              {/* Message Stream */}
              <ChatMessageList
                messages={messages}
                selectedAvatarId={selectedAvatarId}
                isTyping={isTyping}
                onSelectSuggestion={handleSendPrompt}
              />

              {/* Input Form Bar */}
              <form
                onSubmit={handleSubmit}
                className="p-2.5 bg-[#0A0A0A] border-t border-[#2A2A2A] flex items-center gap-2 shrink-0 font-switzer"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder={`Ask ${alienConfig.name} about limits, scheduling, roles...`}
                  disabled={isTyping}
                  className="flex-1 bg-[#141414] border border-[#2A2A2A] focus:border-[#3DDC10] rounded-sm px-3 py-2 text-xs text-[#FFFFFF] placeholder-[#71717A] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isTyping}
                  aria-label="Send message"
                  className="p-2 rounded-sm bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* 3. Alien Avatar Picker Modal */}
      <AvatarPickerModal />
    </>
  );
});

AssistantWidget.displayName = "AssistantWidget";
