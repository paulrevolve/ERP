import { create } from "zustand";

export const useRecentStore = create((set, get) => ({
  recentPages: [],
  isQuickSwitcherOpen: false,

  setQuickSwitcherOpen: (isOpen) => set({ isQuickSwitcherOpen: isOpen }),
  toggleQuickSwitcher: () =>
    set((state) => ({ isQuickSwitcherOpen: !state.isQuickSwitcherOpen })),

  addRecentPage: (page) => {
    if (!page || !page.path || page.path === "/login" || page.path === "/")
      return;
    set((state) => {
      const filtered = state.recentPages.filter((p) => p.path !== page.path);
      const updated = [
        {
          title: page.title || "Page",
          path: page.path,
          category: page.category || "General",
          timestamp: Date.now(),
        },
        ...filtered,
      ].slice(0, 12);

      try {
        localStorage.setItem("erp_recent_pages", JSON.stringify(updated));
      } catch {}
      return { recentPages: updated };
    });
  },

  removeRecentPage: (path) => {
    if (!path) return;
    set((state) => {
      const updated = state.recentPages.filter((p) => p.path !== path);
      try {
        localStorage.setItem("erp_recent_pages", JSON.stringify(updated));
      } catch {}
      return { recentPages: updated };
    });
  },

  clearRecentPages: () => {
    try {
      localStorage.removeItem("erp_recent_pages");
    } catch {}
    set({ recentPages: [] });
  },

  initRecentPages: () => {
    try {
      const saved = localStorage.getItem("erp_recent_pages");
      if (saved) {
        set({ recentPages: JSON.parse(saved) });
      }
    } catch {}
  },
}));
