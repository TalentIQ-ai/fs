//src/hooks/use-scroll-animation.ts

import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
) => {
  const { threshold = 0.15, rootMargin = "0px 0px -50px 0px" } = options;

  const ref = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};

export const animClass = (
  isVisible: boolean,
  direction: "up" | "down" | "left" | "right" | "fade" = "up"
) => {
  const base = "transition-all duration-700 ease-out";

  const hiddenMap = {
    up: "opacity-0 translate-y-10",
    down: "opacity-0 -translate-y-10",
    left: "opacity-0 translate-x-10",
    right: "opacity-0 -translate-x-10",
    fade: "opacity-0",
  };

  return `${base} ${isVisible
      ? "opacity-100 translate-x-0 translate-y-0"
      : hiddenMap[direction]
    }`;
};