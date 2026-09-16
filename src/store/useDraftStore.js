import { create } from "zustand";

export const useDraftStore = create((set, get) => ({
  drafts: {},

  // Save a draft for a specific screen (e.g. "manage-fiscal-year")
  saveDraft: (screenKey, draftData) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [screenKey]: {
          ...draftData,
          timestamp: Date.now(),
        },
      },
    })),

  // Retrieve a draft for a specific screen
  getDraft: (screenKey) => get().drafts[screenKey] || null,

  // Clear draft once saved or explicitly discarded
  clearDraft: (screenKey) =>
    set((state) => {
      const updated = { ...state.drafts };
      delete updated[screenKey];
      return { drafts: updated };
    }),

  // Check if dirty draft exists
  hasDraft: (screenKey) => Boolean(get().drafts[screenKey]?.isDirty),
}));
