/**
 * assistantSlice.ts - Redux Toolkit slice for the Omnitrix AI Assistant Widget.
 *
 * Manages:
 * 1. Widget open/closed visibility state.
 * 2. Alien Avatar Selection (persisted per user in localStorage).
 * 3. First-time onboarding: Prompts the user to choose an alien FIRST before chatting.
 * 4. Chat conversation message history and dynamic suggestion pills.
 * 5. Asynchronous prompt handling with contextual awareness.
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_ALIEN_ID, getAlienConfig } from "./alienRegistry";
import { getItem, setItem } from "../../utils/storage";
import { getAssistantResponse } from "./assistantService";
import type { RootState } from "../../app/store";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface AssistantState {
  isOpen: boolean;
  isPickerOpen: boolean;
  hasChosenAlien: boolean;
  selectedAvatarId: string;
  isTyping: boolean;
  messages: ChatMessage[];
}

const STORAGE_AVATAR_KEY = "omni_assistant_avatar";
const STORAGE_HAS_CHOSEN_KEY = "omni_assistant_has_chosen";

const initialAvatarId = getItem<string>(STORAGE_AVATAR_KEY, DEFAULT_ALIEN_ID);
const initialHasChosen = getItem<boolean>(STORAGE_HAS_CHOSEN_KEY, false);

const initialAlien = getAlienConfig(initialAvatarId);

const createGreetingMessage = (alienId: string): ChatMessage => {
  const alien = getAlienConfig(alienId);
  return {
    id: `msg-welcome-${Date.now()}`,
    role: "assistant",
    content: `${alien.greeting} I am your Omnitrix copilot for composing, scheduling, and managing multi-platform posts. Ask me about character limits, draft auto-saving, drag-and-drop scheduling, or role permissions!`,
    timestamp: new Date().toISOString(),
    suggestions: [
      "What can my current role do?",
      "How do I schedule a post?",
      "What are the platform character limits?",
      "How does draft auto-saving work?",
    ],
  };
};

const initialState: AssistantState = {
  isOpen: false,
  isPickerOpen: !initialHasChosen,
  hasChosenAlien: initialHasChosen,
  selectedAvatarId: initialAvatarId,
  isTyping: false,
  messages: [createGreetingMessage(initialAvatarId)],
};

export const sendAssistantPrompt = createAsyncThunk<
  { content: string; suggestions?: string[] },
  string,
  { state: RootState }
>("assistant/sendPrompt", async (userPrompt, { getState }) => {
  const state = getState();
  const currentRole = state.auth.user?.role || "guest";

  // Short realistic response delay
  await new Promise((resolve) => setTimeout(resolve, 350));

  const result = await getAssistantResponse(userPrompt, {
    role: currentRole,
    userName: state.auth.user?.name,
    postsCount: Object.keys(state.posts.entities).length,
    draftsCount: state.drafts.items.length,
  });

  return result;
});

export const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    toggleAssistant(state) {
      state.isOpen = !state.isOpen;
      // If user hasn't chosen an alien yet, automatically open the picker first
      if (state.isOpen && !state.hasChosenAlien) {
        state.isPickerOpen = true;
      }
    },
    openAssistant(state) {
      state.isOpen = true;
      if (!state.hasChosenAlien) {
        state.isPickerOpen = true;
      }
    },
    closeAssistant(state) {
      state.isOpen = false;
      state.isPickerOpen = false;
    },
    toggleAvatarPicker(state) {
      state.isPickerOpen = !state.isPickerOpen;
    },
    setAvatarPickerOpen(state, action: PayloadAction<boolean>) {
      state.isPickerOpen = action.payload;
    },
    selectAvatar(state, action: PayloadAction<string>) {
      state.selectedAvatarId = action.payload;
      state.hasChosenAlien = true;
      state.isPickerOpen = false;
      setItem(STORAGE_AVATAR_KEY, action.payload);
      setItem(STORAGE_HAS_CHOSEN_KEY, true);

      // If there's only the default greeting, replace with personalized chosen alien greeting
      if (state.messages.length <= 1) {
        state.messages = [createGreetingMessage(action.payload)];
      } else {
        const alien = getAlienConfig(action.payload);
        state.messages.push({
          id: `msg-transform-${Date.now()}`,
          role: "assistant",
          content: `*DNA sequence transformed:* **${alien.name}** (${alien.species}) activated! ${alien.greeting}`,
          timestamp: new Date().toISOString(),
          suggestions: [
            "What can my current role do?",
            "What are the platform character limits?",
            "How do I schedule a post?",
          ],
        });
      }
    },
    resetAlienChoice(state) {
      state.hasChosenAlien = false;
      state.isPickerOpen = true;
      setItem(STORAGE_HAS_CHOSEN_KEY, false);
    },
    clearChatHistory(state) {
      state.messages = [createGreetingMessage(state.selectedAvatarId)];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAssistantPrompt.pending, (state, action) => {
        state.isTyping = true;
        state.messages.push({
          id: `usr-${Date.now()}`,
          role: "user",
          content: action.meta.arg,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendAssistantPrompt.fulfilled, (state, action) => {
        state.isTyping = false;
        state.messages.push({
          id: `ast-${Date.now()}`,
          role: "assistant",
          content: action.payload.content,
          timestamp: new Date().toISOString(),
          suggestions: action.payload.suggestions,
        });
      })
      .addCase(sendAssistantPrompt.rejected, (state) => {
        state.isTyping = false;
        state.messages.push({
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "Omnitrix communications link disrupted. Please retry or pick a quick suggestion topic.",
          timestamp: new Date().toISOString(),
          suggestions: ["How do I schedule a post?", "What can my current role do?"],
        });
      });
  },
});

export const {
  toggleAssistant,
  openAssistant,
  closeAssistant,
  toggleAvatarPicker,
  setAvatarPickerOpen,
  selectAvatar,
  resetAlienChoice,
  clearChatHistory,
} = assistantSlice.actions;

export const selectIsAssistantOpen = (state: RootState) => state.assistant.isOpen;
export const selectIsPickerOpen = (state: RootState) => state.assistant.isPickerOpen;
export const selectHasChosenAlien = (state: RootState) => state.assistant.hasChosenAlien;
export const selectSelectedAvatarId = (state: RootState) => state.assistant.selectedAvatarId;
export const selectAssistantMessages = (state: RootState) => state.assistant.messages;
export const selectIsAssistantTyping = (state: RootState) => state.assistant.isTyping;

export default assistantSlice.reducer;
