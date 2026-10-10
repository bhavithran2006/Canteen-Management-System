import React, { useState, useRef, useEffect, useCallback } from "react";
import "./FloatingChefButton.css";

// ── Position Cache & Clamping Helpers ─────────────────────────────────────────
let cachedIconPos = null;
try {
  const saved = typeof window !== "undefined" && window.sessionStorage ? window.sessionStorage.getItem("canteen_floating_icon_pos") : null;
  if (saved) {
    cachedIconPos = JSON.parse(saved);
  }
} catch (e) {
  // ignore
}

function getDefaultIconPosition() {
  if (typeof window === "undefined") return { x: 100, y: 100 };
  const iconW = 70;
  const iconH = 75;
  const marginX = window.innerWidth <= 600 ? 16 : 24;
  const marginY = window.innerWidth <= 600 ? 16 : 24;
  return {
    x: Math.max(0, window.innerWidth - iconW - marginX),
    y: Math.max(0, window.innerHeight - iconH - marginY),
  };
}

function clampIconPosition(pos, el) {
  if (!pos || typeof window === "undefined") return getDefaultIconPosition();
  const iconW = el && el.offsetWidth ? el.offsetWidth : 70;
  const iconH = el && el.offsetHeight ? el.offsetHeight : 75;
  return {
    x: Math.min(Math.max(0, pos.x), Math.max(0, window.innerWidth - iconW)),
    y: Math.min(Math.max(0, pos.y), Math.max(0, window.innerHeight - iconH)),
  };
}

export default function FloatingChefButton({ onClick }) {
  const containerRef = useRef(null);
  const dragOffsetRef = useRef({ offsetX: 0, offsetY: 0 });
  const startPointerRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const justDraggedRef = useRef(false);

  // Remember position in React state across page navigation and open/close
  const [position, setPosition] = useState(() => {
    if (cachedIconPos) {
      return clampIconPosition(cachedIconPos);
    }
    return getDefaultIconPosition();
  });
  const [isDragging, setIsDragging] = useState(false);

  // Sync to module-level cache and sessionStorage
  useEffect(() => {
    cachedIconPos = position;
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem("canteen_floating_icon_pos", JSON.stringify(position));
      }
    } catch (e) {
      // ignore
    }
  }, [position]);

  // Window resize: re-clamp so icon never gets pushed outside viewport
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => clampIconPosition(prev, containerRef.current));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pointer drag handling: supports both mouse and touch events
  const handlePointerDown = useCallback((e) => {
    // Only primary left mouse click or touch/pen
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    dragOffsetRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    startPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    hasMovedRef.current = false;

    const onPointerMove = (ev) => {
      const dist = Math.hypot(
        ev.clientX - startPointerRef.current.x,
        ev.clientY - startPointerRef.current.y
      );

      // Standard drag threshold (5px) to differentiate click vs intentional drag
      if (dist > 5) {
        if (!hasMovedRef.current) {
          hasMovedRef.current = true;
          setIsDragging(true);
        }

        const c = containerRef.current;
        const iconW = c && c.offsetWidth ? c.offsetWidth : 70;
        const iconH = c && c.offsetHeight ? c.offsetHeight : 75;

        const rawX = ev.clientX - dragOffsetRef.current.offsetX;
        const rawY = ev.clientY - dragOffsetRef.current.offsetY;

        const minX = 0;
        const maxX = Math.max(0, window.innerWidth - iconW);
        const minY = 0;
        const maxY = Math.max(0, window.innerHeight - iconH);

        const clampedX = Math.min(Math.max(minX, rawX), maxX);
        const clampedY = Math.min(Math.max(minY, rawY), maxY);

        setPosition({ x: clampedX, y: clampedY });
      }
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      if (hasMovedRef.current) {
        // Drag occurred: flag justDragged to prevent accidental chatbot opening
        justDraggedRef.current = true;
        setIsDragging(false);
        setTimeout(() => {
          justDraggedRef.current = false;
          hasMovedRef.current = false;
        }, 120);
      } else {
        setIsDragging(false);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  }, []);

  const handleClick = (e) => {
    // If dragging occurred, prevent opening the chatbot
    if (justDraggedRef.current || hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <div
      ref={containerRef}
      className={`floating-chef-ai-container ${isDragging ? "is-dragging" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="Ask Campus Chef AI (Drag to move)"
      aria-label="Ask Campus Chef AI"
    >
      <div className="floating-chef-avatar">
        {/* Cute Robot Chef Avatar matching mockup */}
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          {/* Chef Hat */}
          <path
            d="M11 13C9.5 13 8 11.5 8 10C8 8.5 9.5 7 11.5 7C12 5 14.5 3 18 3C21.5 3 24 5 24.5 7C26.5 7 28 8.5 28 10C28 11.5 26.5 13 25 13H11Z"
            fill="#FFFFFF"
            stroke="#111827"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M12 13H24V15H12V13Z" fill="#F3F4F6" stroke="#111827" strokeWidth="1.4" />
          {/* Robot Head Body */}
          <rect x="9" y="15" width="18" height="15" rx="5" fill="#FFFFFF" stroke="#111827" strokeWidth="1.8" />
          {/* Robot Side Ears/Antenna nubs */}
          <rect x="6.5" y="20" width="2.5" height="5" rx="1" fill="#111827" />
          <rect x="27" y="20" width="2.5" height="5" rx="1" fill="#111827" />
          {/* Visor / Eye Screen */}
          <rect x="12" y="18" width="12" height="6" rx="2" fill="#073B30" />
          {/* Glowing Eyes */}
          <circle cx="15" cy="21" r="1.5" fill="#4ADE80" />
          <circle cx="21" cy="21" r="1.5" fill="#4ADE80" />
          {/* Smile / Mouth */}
          <path d="M15 26C16 27 20 27 21 26" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" />
        </svg>

        {/* Live Green Online Dot */}
        <span className="floating-chef-online-dot" />
      </div>

      {/* Pill Badge */}
      <div className="floating-chef-pill">
        Chef AI
      </div>
    </div>
  );
}
