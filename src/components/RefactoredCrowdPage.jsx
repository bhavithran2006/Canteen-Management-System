import React, { useState, useEffect, useMemo } from "react";
import csCanteenImg from "../assets/cs-canteen.jpg";
import shCanteenImg from "../assets/sh-canteen.jpg";
import mechCanteenImg from "../assets/mech-canteen.jpg";
import heroBannerImg from "../assets/crowd-hero-banner.png";
import "./RefactoredCrowdPage.css";

// ── Icons ────────────────────────────────────────────────────────────────────
const UsersIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ChevronRightIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const MapPinIcon = ({ size = 13, color = "#64748b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = ({ size = 13, color = "#64748b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChairIcon = ({ size = 14, color = "#64748b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
    <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1H7v-1a2 2 0 0 0-4 0v5Z" />
    <path d="M5 18v3" />
    <path d="M19 18v3" />
  </svg>
);

const RadioIcon = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
    <circle cx="12" cy="12" r="2" />
    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
    <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
  </svg>
);

// Photo mapping for canteens
const CANTEEN_IMAGES = {
  main: csCanteenImg,
  law: shCanteenImg,
  library: mechCanteenImg,
};

export default function RefactoredCrowdPage({ onNavigate, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const {
    user,
    canteens = [],
    updateCrowdLevel,
    lang = "en",
    t = (k) => k,
  } = canteenData;

  const isAdmin = user?.role === "admin";
  const [filterLevel, setFilterLevel] = useState("all"); // "all" | "low" | "med" | "high"
  const [liveCanteens, setLiveCanteens] = useState(canteens);

  // Fetch updated crowd from API
  useEffect(() => {
    let isMounted = true;
    const fetchCrowd = () => {
      fetch("http://localhost:5000/api/canteens")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setLiveCanteens(data);
          }
        })
        .catch(() => {
          if (isMounted && canteens.length > 0) {
            setLiveCanteens(canteens);
          }
        });
    };
    fetchCrowd();
    const interval = setInterval(fetchCrowd, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [canteens]);

  // Fallback metadata config matching mockup
  const CANTEEN_METADATA = [
    {
      id: "main",
      name: "CS Canteen",
      nameTa: "சிஎஸ் உணவகம்",
      loc: "Block A · Ground floor",
      locTa: "பிளாக் ஏ · தரைத்தளம்",
      img: csCanteenImg,
      level: "low",
      wait: 3,
      occupancy: 25,
      seatsText: "Plenty of seats",
      seatsTextTa: "தாராளமாக இடங்கள் உள்ளன",
    },
    {
      id: "law",
      name: "S&H Canteen",
      nameTa: "எஸ் & எச் உணவகம்",
      loc: "Block D · Ground floor",
      locTa: "பிளாக் டி · தரைத்தளம்",
      img: shCanteenImg,
      level: "high",
      wait: 14,
      occupancy: 85,
      seatsText: "Very crowded",
      seatsTextTa: "அதிக கூட்டம், இடமில்லை",
    },
    {
      id: "library",
      name: "Mech Canteen",
      nameTa: "மெக் உணவகம்",
      loc: "Block C · 1st floor",
      locTa: "பிளாக் சி · 1ஆம் தளம்",
      img: mechCanteenImg,
      level: "med",
      wait: 7,
      occupancy: 60,
      seatsText: "Some seats available",
      seatsTextTa: "சில இடங்கள் கிடைக்கின்றன",
    },
  ];

  // Merge live status from backend/state with UI metadata
  const displayCanteens = useMemo(() => {
    return CANTEEN_METADATA.map((meta) => {
      const live = (liveCanteens || []).find((c) => c.id === meta.id) || {};
      const currentLevel = live.level || meta.level;
      let occupancy = meta.occupancy;
      let wait = live.wait || meta.wait;
      let seatsText = meta.seatsText;
      let seatsTextTa = meta.seatsTextTa;

      if (currentLevel === "low") {
        occupancy = 25;
        wait = 3;
        seatsText = "Plenty of seats";
        seatsTextTa = "தாராளமாக இடங்கள் உள்ளன";
      } else if (currentLevel === "med") {
        occupancy = 60;
        wait = 7;
        seatsText = "Some seats available";
        seatsTextTa = "சில இடங்கள் கிடைக்கின்றன";
      } else {
        occupancy = 85;
        wait = 14;
        seatsText = "Very crowded";
        seatsTextTa = "அதிக கூட்டம்";
      }

      return {
        ...meta,
        level: currentLevel,
        occupancy,
        wait,
        seatsText,
        seatsTextTa,
        lastUpdated: live.lastUpdated || new Date(),
      };
    });
  }, [liveCanteens]);

  // Counts for the 3 summary stat cards
  const lowCount = displayCanteens.filter((c) => c.level === "low").length;
  const medCount = displayCanteens.filter((c) => c.level === "med").length;
  const highCount = displayCanteens.filter((c) => c.level === "high").length;

  const filteredCanteens = useMemo(() => {
    if (filterLevel === "all") return displayCanteens;
    return displayCanteens.filter((c) => c.level === filterLevel);
  }, [displayCanteens, filterLevel]);

  const formatTime = (date) => {
    try {
      const d = new Date(date);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " · " + d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "10:42 AM · 24 Sep 2025";
    }
  };

  return (
    <div className="ref-crowd-container">
      {/* ── 1. HERO BANNER ────────────────────────────────────────────── */}
      <section className="ref-crowd-hero">
        <img
          src={heroBannerImg}
          alt={lang === "ta" ? "நேரலை கூட்ட நெரிசல் & காத்திருப்பு நேரம்" : "Live Crowd Density & Wait Times"}
          className="ref-crowd-hero-img"
          draggable={false}
        />

        {/* Contrast Gradient Overlay */}
        <div className="ref-crowd-hero-gradient-overlay" />

        {/* Live Status Pill in Top-Right */}
        <div className="ref-crowd-live-badge">
          <span className="ref-crowd-live-pulse" />
          <span className="ref-crowd-live-text">LIVE</span>
        </div>

        {/* Banner Text Content */}
        <div className="ref-crowd-hero-text-wrap">
          <div className="ref-crowd-hero-label">
            {lang === "ta" ? "நேரலை கண்காணிப்பு" : "REAL-TIME MONITOR"}
          </div>
          <h1 className="ref-crowd-hero-title">
            {lang === "ta" ? (
              <>நேரலை <span className="ref-hero-gold">கூட்ட நெரிசல் &amp; காத்திருப்பு</span> நேரம்</>
            ) : (
              <>Live Crowd Density &amp; <span className="ref-hero-gold">Wait Times</span></>
            )}
          </h1>
          <p className="ref-crowd-hero-subtitle">
            {lang === "ta"
              ? "அனைத்து உணவகங்களின் தற்போதைய கூட்ட நெரிசலை அறிந்து உங்கள் வருகையை திட்டமிடுங்கள்."
              : "Check current crowd levels at all canteens and plan your visit."}
          </p>
        </div>
      </section>

      {/* ── 2. 3 SUMMARY STAT CARDS ───────────────────────────────────── */}
      <section className="ref-crowd-stats-row">
        {/* Low Card */}
        <div
          className="ref-crowd-stat-card"
          onClick={() => setFilterLevel((prev) => (prev === "low" ? "all" : "low"))}
        >
          <div className="ref-stat-left">
            <div className="ref-stat-avatar low">
              <UsersIcon size={24} color="#10b981" />
            </div>
            <span className="ref-stat-count">{lowCount}</span>
            <div className="ref-stat-info">
              <span className="ref-stat-title low">
                {lang === "ta" ? "குறைந்த கூட்டம்" : "Low"}
              </span>
              <span className="ref-stat-subtitle">
                {lang === "ta" ? "குறைந்த கூட்டம் உள்ள உணவகம்" : "Canteen with low crowd"}
              </span>
            </div>
          </div>
          <div className="ref-stat-chevron">
            <ChevronRightIcon size={18} />
          </div>
        </div>

        {/* Medium Card */}
        <div
          className="ref-crowd-stat-card"
          onClick={() => setFilterLevel((prev) => (prev === "med" ? "all" : "med"))}
        >
          <div className="ref-stat-left">
            <div className="ref-stat-avatar med">
              <UsersIcon size={24} color="#f59e0b" />
            </div>
            <span className="ref-stat-count">{medCount}</span>
            <div className="ref-stat-info">
              <span className="ref-stat-title med">
                {lang === "ta" ? "மிதமான கூட்டம்" : "Medium"}
              </span>
              <span className="ref-stat-subtitle">
                {lang === "ta" ? "மிதமான கூட்டம் உள்ள உணவகம்" : "Canteen with moderate crowd"}
              </span>
            </div>
          </div>
          <div className="ref-stat-chevron">
            <ChevronRightIcon size={18} />
          </div>
        </div>

        {/* High Card */}
        <div
          className="ref-crowd-stat-card"
          onClick={() => setFilterLevel((prev) => (prev === "high" ? "all" : "high"))}
        >
          <div className="ref-stat-left">
            <div className="ref-stat-avatar high">
              <UsersIcon size={24} color="#ef4444" />
            </div>
            <span className="ref-stat-count">{highCount}</span>
            <div className="ref-stat-info">
              <span className="ref-stat-title high">
                {lang === "ta" ? "அதிக கூட்டம்" : "High"}
              </span>
              <span className="ref-stat-subtitle">
                {lang === "ta" ? "அதிக கூட்டம் உள்ள உணவகம்" : "Canteen with high crowd"}
              </span>
            </div>
          </div>
          <div className="ref-stat-chevron">
            <ChevronRightIcon size={18} />
          </div>
        </div>
      </section>

      {/* ── 3. 3-COLUMN CANTEEN CARDS GRID ─────────────────────────────── */}
      <main className="ref-crowd-canteen-grid">
        {filteredCanteens.map((canteen) => {
          const levelKey = canteen.level;
          const levelLabel =
            levelKey === "low"
              ? (lang === "ta" ? "குறைந்த கூட்டம்" : "Low Crowd")
              : levelKey === "med"
              ? (lang === "ta" ? "மிதமான கூட்டம்" : "Medium Crowd")
              : (lang === "ta" ? "அதிக கூட்டம்" : "High Crowd");

          return (
            <article key={canteen.id} className="ref-canteen-card">
              {/* Top Row: Inset Photo Thumbnail + Details */}
              <div className="ref-canteen-head-row">
                <div className="ref-canteen-img-wrap">
                  <img
                    src={canteen.img}
                    alt={canteen.name}
                    className="ref-canteen-img"
                    loading="lazy"
                  />
                </div>

                <div className="ref-canteen-details-col">
                  <h2 className="ref-canteen-name">
                    {lang === "ta" ? canteen.nameTa : canteen.name}
                  </h2>
                  <div className="ref-canteen-loc">
                    <MapPinIcon size={12} color="#64748b" />
                    <span>{lang === "ta" ? canteen.locTa : canteen.loc}</span>
                  </div>
                  <div className={`ref-canteen-status-badge ${levelKey}`}>
                    <UsersIcon size={12} color="currentColor" />
                    <span>{levelLabel}</span>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="ref-canteen-body">

                {/* Wait & Seats */}
                <div className="ref-canteen-metrics">
                  <div className="ref-canteen-metric-item">
                    <ClockIcon size={13} color="#64748b" />
                    <span>~ {canteen.wait} {lang === "ta" ? "நிமிட காத்திருப்பு" : "min wait"}</span>
                  </div>
                  <div className="ref-canteen-metric-item">
                    <ChairIcon size={14} color="#64748b" />
                    <span>{lang === "ta" ? canteen.seatsTextTa : canteen.seatsText}</span>
                  </div>
                </div>

                {/* Occupancy Progress */}
                <div className="ref-canteen-occupancy-wrap">
                  <div className="ref-occupancy-header">
                    <span>{lang === "ta" ? "இருக்கை நிரம்பிய அளவு" : "Occupancy"}</span>
                    <span>{canteen.occupancy}%</span>
                  </div>
                  <div className="ref-occupancy-track">
                    <div
                      className={`ref-occupancy-bar ${levelKey}`}
                      style={{ width: `${canteen.occupancy}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="ref-canteen-footer">
                  <div className="ref-canteen-time-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ClockIcon size={12} color="#64748b" />
                      <span>{lang === "ta" ? "கடைசியாக புதுப்பிக்கப்பட்டது" : "Last updated"} {formatTime(canteen.lastUpdated)}</span>
                    </div>
                    <div className={`ref-canteen-live-tag ${levelKey}`}>
                      <span className="ref-canteen-live-tag-dot" />
                      <span>LIVE</span>
                    </div>
                  </div>

                  <div className={`ref-canteen-update-notice ${levelKey}`}>
                    <RadioIcon size={13} color="currentColor" />
                    <span>
                      {lang === "ta"
                        ? "உணவக பணியாளர்களால் புதுப்பிக்கப்பட்ட நேரலை கணிப்பு"
                        : "Live estimate updated by canteen staff"}
                    </span>
                  </div>

                  {/* Admin controls to update crowd */}
                  {isAdmin && updateCrowdLevel && (
                    <div className="ref-admin-crowd-controls">
                      {["low", "med", "high"].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          className={`ref-admin-crowd-btn ${canteen.level === lvl ? "active" : ""}`}
                          onClick={() => updateCrowdLevel(canteen.id, lvl)}
                        >
                          {lvl === "low" ? "Set Low" : lvl === "med" ? "Set Med" : "Set High"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
