import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore write errors (e.g., private mode)
    }
  }, [key, state]);

  const set = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        if (typeof value === 'function') {
          // TypeScript knows value is a function returning T here
          return (value as (prev: T) => T)(prev);
        }
        return value;
      });
    },
    []
  );

  return [state, set] as const;
}
