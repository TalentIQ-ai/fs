import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

type AnimationDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "fade";

export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
) => {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -50px 0px",
  } = options;

  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.innerWidth < 768) {
      setIsVisible(true);
      return;
    }

    const currentElement = ref.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentElement);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};

export const animClass = (
  isVisible: boolean,
  direction: AnimationDirection = "up"
): string => {
  const baseClass =
    "transition-[opacity,transform] duration-700 ease-out";

  const hiddenClassMap: Record<AnimationDirection, string> = {
    up: "opacity-0 translate-y-6",
    down: "opacity-0 -translate-y-6",
    left: "opacity-0 translate-x-6",
    right: "opacity-0 -translate-x-6",
    fade: "opacity-0",
  };

  const visibleClass = "opacity-100 translate-x-0 translate-y-0";

  return `${baseClass} ${isVisible ? visibleClass : hiddenClassMap[direction]}`;
};

export type { AnimationDirection };