import React from "react";
import canteenBg from "../assets/canteen-banner-bg.png";
import "./RefactoredHeroBanner.css";

const ArrowLeftIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function RefactoredHeroBanner({
  label,
  title,
  highlightWord,
  subtitle,
  bgImage,
  onBack,
  backLabel = "Back to Home",
  showUnderline = false,
  badgeText,
  isLive = false,
  className = "",
}) {
  const imageSource = bgImage || canteenBg;

  // Split title if highlightWord is provided to wrap in golden text span
  const renderTitle = () => {
    if (!highlightWord || !title) return title;
    const parts = title.split(new RegExp(`(${highlightWord})`, "i"));
    return parts.map((part, idx) => {
      if (part.toLowerCase() === highlightWord.toLowerCase()) {
        return (
          <span key={idx} className="gold-text">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section className={`ref-global-hero ${className}`}>
      {/* Background image */}
      <img
        src={imageSource}
        alt={title || "Campus Canteen"}
        className="ref-global-hero-bg"
        draggable={false}
      />

      {/* Dark forest green gradient overlay */}
      <div className="ref-global-hero-overlay" />

      {/* Optional Top-Left Back Button */}
      {onBack && (
        <button
          type="button"
          className="ref-hero-back-pill"
          onClick={onBack}
          aria-label={backLabel}
        >
          <ArrowLeftIcon size={14} color="#ffffff" />
          <span>{backLabel}</span>
        </button>
      )}

      {/* Optional Top-Right Badge (e.g., ● LIVE) */}
      {(badgeText || isLive) && (
        <div className="ref-hero-badge-wrap">
          <div className="ref-hero-live-pill">
            <span className="ref-hero-live-dot" />
            <span>{badgeText || "LIVE"}</span>
          </div>
        </div>
      )}

      {/* Banner Content */}
      <div className="ref-global-hero-content" style={onBack ? { paddingTop: 38 } : {}}>
        {label && <div className="ref-hero-label">{label}</div>}
        {title && <h1 className="ref-hero-heading">{renderTitle()}</h1>}
        {subtitle && <p className="ref-hero-desc">{subtitle}</p>}
        {showUnderline && <div className="ref-hero-accent-bar" />}
      </div>
    </section>
  );
}
