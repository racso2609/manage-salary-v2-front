/**
 * @name useIsOnViewPort
 * @description A custom React hook that returns an array containing a ref and the intersection observer entry for a given element. It sets up an Intersection Observer to check if the specified element is within the viewport based on the provided threshold, root and rootMargin.
 * @param {Object} options - Configuration object for the Intersection Observer.
 * @param {number} [options.threshold=1] - The intersection ratio triggering a callback (default: 1).
 * @param {Element|null} [options.root=null] - The reference element to be used as the bounding rectangle for determining intersection of targets with the target element (default: null).
 * @param {string} [options.rootMargin="0px"] - A string representing the margin around the root element that should not be taken into account when checking if the target element is intersecting it (default: "0px").
 * @returns {[LegacyRef<T>|undefined, IntersectionObserverEntry|null]} An array containing a ref for the specified element and the current intersection observer entry.
 */

import { useState, useRef, useCallback, LegacyRef } from "react";

const useIsOnViewPort = <T>({
  threshold = 1,
  root = null,
  rootMargin = "0px",
}: {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
} = {}) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const previousObserver = useRef<IntersectionObserver | null>(null);

  const customRef = useCallback(
    (node) => {
      if (previousObserver.current) {
        previousObserver?.current.disconnect();
        previousObserver.current = null;
      }

      if (node?.nodeType === Node.ELEMENT_NODE) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setEntry(entry as IntersectionObserverEntry);
          },
          { threshold, root, rootMargin },
        );

        observer.observe(node);
        previousObserver.current = observer;
      }
    },
    [threshold, root, rootMargin],
  );

  // const delayedEntry = useDebounce(entry, 500);

  return [
    customRef as LegacyRef<T> | undefined,
    entry as IntersectionObserverEntry,
  ] as [LegacyRef<T> | undefined, IntersectionObserverEntry | null];
};

export default useIsOnViewPort;
