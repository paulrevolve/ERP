const STORAGE_KEY = "finaxis_recent_pages";
const MAX_RECENT = 5;

export const loadRecentPages = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRecentPages = (pages) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch {
    // ignore storage errors in older browsers or incognito mode
  }
};

export const appendRecentPage = ({ path, label }) => {
  const page = {
    path,
    label: label || path.replace(/^\/dashboard\/|\//g, " ").replace(/\b\w/g, (char) => char.toUpperCase()).trim() || "Dashboard",
  };

  const existing = loadRecentPages();
  const filtered = existing.filter((item) => item.path !== path);
  const next = [page, ...filtered].slice(0, MAX_RECENT);
  saveRecentPages(next);
  return next;
};
