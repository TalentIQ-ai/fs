import React from "react";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties["animationDuration"];
    thickness?: number;
  };

const StarBorder = <T extends React.ElementType = "div">({
  as,
  className = "",
  color = "#62AAEA",
  speed = "6s",
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "div";

  return (
    <Component
      className={`
        relative inline-block overflow-hidden
        rounded-[28px]
        ${className}
      `}
      {...(rest as any)}
      style={{
        padding: `${thickness}px`,
        ...(rest as any).style,
      }}
    >
      {/* TOP GLOW */}
      <div
        className="
          absolute
          top-0
          left-[-120%]
          w-[220%]
          h-[2px]
          blur-[2px]
          opacity-90
          animate-star-movement-top
          pointer-events-none
        "
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${color},
            white,
            ${color},
            transparent
          )`,
          animationDuration: speed,
        }}
      />

      {/* BOTTOM GLOW */}
      <div
        className="
          absolute
          bottom-0
          right-[-120%]
          w-[220%]
          h-[2px]
          blur-[2px]
          opacity-90
          animate-star-movement-bottom
          pointer-events-none
        "
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${color},
            white,
            ${color},
            transparent
          )`,
          animationDuration: speed,
        }}
      />

      {/* LEFT GLOW */}
      <div
        className="
          absolute
          top-[-120%]
          left-0
          h-[220%]
          w-[2px]
          blur-[2px]
          opacity-80
          animate-star-movement-left
          pointer-events-none
        "
        style={{
          background: `linear-gradient(
            180deg,
            transparent,
            ${color},
            white,
            ${color},
            transparent
          )`,
          animationDuration: speed,
        }}
      />

      {/* RIGHT GLOW */}
      <div
        className="
          absolute
          bottom-[-120%]
          right-0
          h-[220%]
          w-[2px]
          blur-[2px]
          opacity-80
          animate-star-movement-right
          pointer-events-none
        "
        style={{
          background: `linear-gradient(
            180deg,
            transparent,
            ${color},
            white,
            ${color},
            transparent
          )`,
          animationDuration: speed,
        }}
      />

      {/* CONTENT */}
      <div
        className="
          relative z-10
          rounded-[28px]
          bg-white/90
          backdrop-blur-xl
        "
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;