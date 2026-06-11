import { useEffect, useState } from 'react';

/**
 * Hydration-safe prefers-reduced-motion hook.
 *
 * Returns false on the server AND on the first client render so hydration
 * always matches the server markup (motion's useReducedMotion returns the
 * real value during hydration, which mismatches and can kill the island).
 * Immediately after mount it reflects the user's preference and tracks
 * changes.
 */
export default function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return reduced;
}
