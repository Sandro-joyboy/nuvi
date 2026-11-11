"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorVariant = "default" | "button" | "component" | "input";

export function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Física de mola suave estilo Framer / estrellagracia.com
  const springConfig = { stiffness: 750, damping: 38, mass: 0.28 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateDeviceType = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateDeviceType();
    mediaQuery.addEventListener("change", updateDeviceType);
    return () => mediaQuery.removeEventListener("change", updateDeviceType);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const resolveCursorVariant = (target: Element | null): CursorVariant => {
      if (!target) return "default";

      if (
        target.closest(
          'input:not([type="button"]):not([type="submit"]):not([type="reset"]), textarea, [data-cursor="input"]'
        )
      ) {
        return "input";
      }

      if (
        target.closest(
          'a, button, [role="button"], [data-cursor="button"], label, select'
        )
      ) {
        return "button";
      }

      if (target.closest('[data-cursor="component"]')) {
        return "component";
      }

      return "default";
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as Element | null;
      setVariant(resolveCursorVariant(target));
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsPressed(true);
      const target = e.target as Element | null;
      setVariant(resolveCursorVariant(target));
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsPressed(false);
      // Reavaliar elemento sob o cursor caso o DOM tenha mudado após o clique
      requestAnimationFrame(() => {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        setVariant(resolveCursorVariant(el));
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsPressed(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isDesktop, isVisible, mouseX, mouseY]);

  if (!isDesktop) return null;

  const variants = {
    default: {
      width: 14,
      height: 14,
      borderRadius: 9999,
      backgroundColor: "#0A0A0A",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      scale: isPressed ? 0.76 : 1,
    },
    button: {
      width: 44,
      height: 44,
      borderRadius: 9999,
      backgroundColor: isPressed
        ? "rgba(10, 10, 10, 0.28)"
        : "rgba(10, 10, 10, 0.14)",
      border: "1.5px solid rgba(10, 10, 10, 0.72)",
      scale: isPressed ? 0.86 : 1,
    },
    component: {
      width: 28,
      height: 28,
      borderRadius: 9999,
      backgroundColor: isPressed
        ? "rgba(10, 10, 10, 0.3)"
        : "rgba(10, 10, 10, 0.2)",
      border: "1.5px solid rgba(10, 10, 10, 0.6)",
      scale: isPressed ? 0.86 : 1,
    },
    input: {
      width: 4,
      height: 22,
      borderRadius: 9999,
      backgroundColor: "#0A0A0A",
      border: "0px solid rgba(10, 10, 10, 0)",
      scale: isPressed ? 0.85 : 1,
    },
  };

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="nuvi-custom-cursor"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={variants[variant]}
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 28,
          mass: 0.35,
        }}
      />
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          html,
          body,
          a,
          button,
          input,
          textarea,
          select,
          label,
          [role="button"],
          [data-cursor] {
            cursor: none !important;
          }
        }

        .nuvi-custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 99999;
          pointer-events: none;
          user-select: none;
          box-sizing: border-box;
          backdrop-filter: blur(1.5px);
          -webkit-backdrop-filter: blur(1.5px);
          will-change: transform, width, height, background-color, border;
          transition: opacity 0.18s ease;
        }
      `}</style>
    </>
  );
}
