import React, { useState, useMemo } from "react";
import heroBannerImg from "../assets/feedback-hero-banner.png";
import "./RefactoredFeedbackPage.css";

// ── Icons ────────────────────────────────────────────────────────────────────
const ChatBubbleIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

const UtensilsIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2v20M21 2v4a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V2" />
    <path d="M3 2v7c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V2M5 11v11" />
  </svg>
);

const BowlIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
    <path d="M7 8V5" />
    <path d="M12 8V3" />
    <path d="M17 8V5" />
  </svg>
);

const ChevronDownIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const PencilIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const SendIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ThumbsUpIcon = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

const QUICK_TAGS = [
  { id: "hot_fresh", label: "Hot & Fresh", icon: "🔥", labelTa: "சூடான & புதிய" },
  { id: "fast_service", label: "Fast Service", icon: "⚡", labelTa: "விரைவான சேவை" },
  { id: "great_portion", label: "Great Portion", icon: "🍲", labelTa: "நல்ல அளவு" },
  { id: "value_money", label: "Value for Money", icon: "💰", labelTa: "பணத்திற்கு மதிப்பு" },
  { id: "clean_area", label: "Clean Area", icon: "🍃", labelTa: "சுத்தமான பகுதி" },
  { id: "super_tasty", label: "Super Tasty", icon: "👨‍🍳", labelTa: "மிகவும் சுவையானது" },
  { id: "short_wait", label: "Short Wait Time", icon: "🕒", labelTa: "குறைந்த காத்திருப்பு" },
];

export default function RefactoredFeedbackPage({ onNavigate, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const {
    user,
    lang = "en",
    t = (k) => k,
    feedbacks = [],
    addFeedback,
    addManagerReply,
    upvoteFeedback,
    menu = [],
  } = canteenData;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("Food Quality");
  const [selectedDish, setSelectedDish] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [comments, setComments] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Toggle quick tag selection
  const handleToggleTag = (tagLabel) => {
    setSelectedTags((prev) =>
      prev.includes(tagLabel) ? prev.filter((t) => t !== tagLabel) : [...prev, tagLabel]
    );
  };

  // Submit feedback
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim() && rating === 0) return;

    if (addFeedback) {
      addFeedback({
        rating,
        category: category.toLowerCase().replace(/\s+/g, "_"),
        item: selectedDish || null,
        tags: selectedTags,
        comment: comments.trim() || `${rating} star rating submitted by student.`,
      });
    }

    setSubmittedMessage(true);
    setComments("");
    setSelectedTags([]);
    setSelectedDish("");
    setRating(5);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  // Rating metrics calculations
  const totalReviews = feedbacks.length || 4;
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + (f.rating || 5), 0) / feedbacks.length).toFixed(1)
    : "4.5";

  // Rating distribution counts
  const distribution = useMemo(() => {
    const counts = { 5: 2, 4: 1, 3: 1, 2: 0, 1: 0 };
    if (feedbacks.length > 0) {
      counts[5] = 0;
      counts[4] = 0;
      counts[3] = 0;
      counts[2] = 0;
      counts[1] = 0;
      feedbacks.forEach((f) => {
        const r = Math.min(5, Math.max(1, Math.round(f.rating || 5)));
        counts[r] = (counts[r] || 0) + 1;
      });
    }
    return counts;
  }, [feedbacks]);

  return (
    <div className="ref-fb-container">
      {/* ── 1. HERO BANNER ────────────────────────────────────────────── */}
      <section className="ref-fb-hero">
        <img
          src={heroBannerImg}
          alt="Student Reviews"
          className="ref-fb-hero-img"
        />
        <div className="ref-fb-hero-gradient" />

        <div className="ref-fb-hero-content">
          <div className="ref-fb-eyebrow">
            {lang === "ta" ? "மாணவர் கருத்துக்கள்" : "STUDENT REVIEWS"}
          </div>
          <h1 className="ref-fb-title">
            <span>{lang === "ta" ? "உங்கள் அனுபவத்தை பகிருங்கள்" : "Share your experience"}</span>
            <span>⭐</span>
          </h1>
          <p className="ref-fb-subtitle">
            {lang === "ta"
              ? "உங்கள் கருத்துக்கள் எங்களை சிறப்பாக பணியாற்ற உதவுகின்றன!"
              : "Your feedback helps us serve you better!"}
          </p>
        </div>
      </section>

      {/* ── 2. TOP SECTION: SCORE & DISTRIBUTION ───────────────────────── */}
      <section className="ref-fb-top-grid">
        {/* Left: Overall Score Card */}
        <div className="ref-fb-score-card">
          <div className="ref-fb-big-score">{avgRating}</div>
          <div className="ref-fb-stars-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>★</span>
            ))}
          </div>
          <div className="ref-fb-review-count">
            {lang === "ta"
              ? `${totalReviews} மாணவர் கருத்துக்களின் அடிப்படையில்`
              : `Based on ${totalReviews} student reviews`}
          </div>
        </div>

        {/* Right: Rating Distribution Card */}
        <div className="ref-fb-distrib-card">
          <div className="ref-distrib-title">
            {lang === "ta" ? "மதிப்பீடு பரவல்" : "Rating Distribution"}
          </div>
          <div className="ref-distrib-list">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars] || 0;
              const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={stars} className="ref-distrib-row">
                  <div className="ref-distrib-label">
                    <span>{stars}</span>
                    <span style={{ color: "#f5b738" }}>★</span>
                  </div>
                  <div className="ref-distrib-track">
                    <div
                      className="ref-distrib-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="ref-distrib-val">
                    {count} ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. FORM CARD: "RATE YOUR EXPERIENCE" ──────────────────────── */}
      <section className="ref-fb-form-card">
        <div className="ref-fb-form-header">
          <div className="ref-fb-form-icon-wrap">
            <ChatBubbleIcon size={22} color="#ffffff" />
          </div>
          <div>
            <h2 className="ref-fb-form-title">
              {lang === "ta" ? "உங்கள் அனுபவத்தை மதிப்பிடுங்கள்" : "Rate Your Experience"}
            </h2>
            <div className="ref-fb-form-sub">
              {lang === "ta"
                ? "உங்கள் அடுத்த வருகையை இன்னும் சிறந்ததாக்க நாங்கள் எவ்வாறு மேம்படுத்தலாம் என்பதை தெரிவியுங்கள்!"
                : "Let us know how we can make your next visit even better!"}
            </div>
          </div>
        </div>

        {/* Overall Rating * */}
        <div className="ref-fb-rating-group">
          <label className="ref-fb-group-label">
            {lang === "ta" ? "ஒட்டுமொத்த மதிப்பீடு" : "Overall Rating"} <span className="req">*</span>
          </label>
          <div className="ref-fb-stars-picker">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  className={`ref-star-btn ${active ? "is-active" : ""}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star`}
                >
                  {active ? "★" : "☆"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category * and Dish Item Dropdowns */}
        <div className="ref-fb-dropdowns-row">
          {/* Category Dropdown */}
          <div className="ref-fb-field">
            <label className="ref-fb-group-label">
              {lang === "ta" ? "பிரிவு" : "Category"} <span className="req">*</span>
            </label>
            <div className="ref-fb-select-wrap">
              <span className="ref-select-icon">
                <UtensilsIcon size={16} />
              </span>
              <select
                className="ref-fb-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Select Category">{lang === "ta" ? "பிரிவை தேர்ந்தெடுக்கவும்" : "Select Category"}</option>
                <option value="Food Quality">{lang === "ta" ? "உணவு தரம்" : "Food Quality"}</option>
                <option value="Service Speed">{lang === "ta" ? "சேவை வேகம்" : "Service Speed"}</option>
                <option value="Cleanliness & Hygiene">{lang === "ta" ? "சுகாதாரம் மற்றும் தூய்மை" : "Cleanliness & Hygiene"}</option>
                <option value="Value for Money">{lang === "ta" ? "விலைக்கு தகுந்த மதிப்பு" : "Value for Money"}</option>
                <option value="Seating & Ambience">{lang === "ta" ? "இருக்கை மற்றும் சூழல்" : "Seating & Ambience"}</option>
              </select>
              <span className="ref-select-chevron">
                <ChevronDownIcon size={14} />
              </span>
            </div>
          </div>

          {/* Dish Item Dropdown */}
          <div className="ref-fb-field">
            <label className="ref-fb-group-label">
              {lang === "ta" ? "உணவு உருப்படி (விருப்பமானது)" : "Dish Item (Optional)"}
            </label>
            <div className="ref-fb-select-wrap">
              <span className="ref-select-icon">
                <BowlIcon size={16} />
              </span>
              <select
                className="ref-fb-select"
                value={selectedDish}
                onChange={(e) => setSelectedDish(e.target.value)}
              >
                <option value="">{lang === "ta" ? "உணவு உருப்படியைத் தேர்ந்தெடுக்கவும்" : "Select Dish Item"}</option>
                {menu.map((m) => (
                  <option key={m.id} value={m.name}>
                    {lang === "ta" ? (m.name_ta || m.name) : m.name} (₹{m.price})
                  </option>
                ))}
              </select>
              <span className="ref-select-chevron">
                <ChevronDownIcon size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="ref-fb-field">
          <label className="ref-fb-group-label">
            {lang === "ta" ? "விரைவு குறிச்சொற்கள்" : "Quick Tags"}
          </label>
          <div className="ref-fb-tags-wrap">
            {QUICK_TAGS.map((tag) => {
              const active = selectedTags.includes(tag.label);
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={`ref-tag-pill ${active ? "is-active" : ""}`}
                  onClick={() => handleToggleTag(tag.label)}
                >
                  <span>{tag.icon}</span>
                  <span>{lang === "ta" ? tag.labelTa : tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comments Box */}
        <div className="ref-fb-field">
          <label className="ref-fb-group-label">
            {lang === "ta" ? "உங்கள் கருத்துக்கள் (விருப்பமானது)" : "Your Comments (Optional)"}
          </label>
          <div className="ref-fb-textarea-wrap">
            <span className="ref-textarea-icon">
              <PencilIcon size={15} />
            </span>
            <textarea
              className="ref-fb-textarea"
              maxLength={500}
              placeholder={lang === "ta" ? "உங்கள் அனுபவத்தை பற்றி சொல்லுங்கள்..." : "Tell us about your experience..."}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        {/* Form Footer */}
        <div className="ref-fb-form-footer">
          <div className="ref-fb-char-count">{comments.length}/500</div>
          <button
            type="button"
            className="ref-fb-submit-btn"
            onClick={handleSubmit}
          >
            <SendIcon size={14} color="#14221a" />
            <span>{lang === "ta" ? "கருத்தை சமர்ப்பிக்கவும்" : "Submit Feedback"}</span>
          </button>
        </div>

        {submittedMessage && (
          <div style={{ color: "#16a34a", fontWeight: 700, fontSize: 13.5, textAlign: "right" }}>
            ✓ {lang === "ta" ? "உங்கள் கருத்துக்கு நன்றி!" : "Thank you for your valuable feedback!"}
          </div>
        )}
      </section>

      {/* ── 4. RECENT STUDENT REVIEWS ──────────────────────────────────── */}
      {feedbacks && feedbacks.length > 0 && (
        <section className="ref-fb-reviews-sec">
          <h2 className="ref-fb-sec-title">
            {lang === "ta" ? "சமீபத்திய மாணவர் கருத்துக்கள்" : "Recent Student Reviews"}
          </h2>
          {feedbacks.slice(0, 5).map((fb, idx) => (
            <div key={fb.id || idx} className="ref-review-card">
              <div className="ref-review-top">
                <div className="ref-review-user">
                  <div className="ref-review-avatar">
                    {(fb.userName || "Student")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="ref-review-name">{fb.userName || "Student"}</div>
                    <div className="ref-review-time">
                      {fb.item ? `Ordered ${fb.item}` : "Campus Dining"}
                    </div>
                  </div>
                </div>
                <div style={{ color: "#f5b738", fontSize: 16 }}>
                  {"★".repeat(fb.rating || 5)}{"☆".repeat(5 - (fb.rating || 5))}
                </div>
              </div>

              <div className="ref-review-comment">{fb.comment}</div>

              {fb.tags && fb.tags.length > 0 && (
                <div className="ref-review-tags">
                  {fb.tags.map((tg, i) => (
                    <span key={i} className="ref-review-tag-chip">
                      {tg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
