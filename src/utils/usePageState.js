import { useEffect, useState } from "react";

const PAGE_STATE_PREFIX = "finaxis_page_state:";

const storageKeyFor = (pageKey) => `${PAGE_STATE_PREFIX}${pageKey}`;

export function usePageState(pageKey, initialValue) {
  const storageKey = storageKeyFor(pageKey);

  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = sessionStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // ignore persistence failures
    }
  }, [storageKey, value]);

  return [value, setValue];
}
