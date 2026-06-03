import { ReactNode } from "react";

import {
  useScrollAnimation,
  animClass,
  AnimationDirection,
} from "@/hooks/use-scroll-animation";

interface MotionBlockProps {
  children: ReactNode;
  direction?: AnimationDirection;
  className?: string;
}

const MotionBlock = ({
  children,
  direction = "up",
  className = "",
}: MotionBlockProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`${animClass(
        isVisible,
        direction
      )} ${className}`}
    >
      {children}
    </div>
  );
};

export default MotionBlock;