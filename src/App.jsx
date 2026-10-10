import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
  useReducer,
  createContext,
} from "react";
import ForgotPasswordFlow from "./components/ForgotPasswordFlow.jsx";
import GoogleSignInButton from "./components/GoogleSignInButton.jsx";
import AdminStockManagement from "./components/AdminStockManagement.jsx";
import QrPickupPassCard, { QrPickupPassModal } from "./components/QrPickupPassCard.jsx";
import QrScannerPage from "./components/QrScannerPage.jsx";
import RefactoredHomePage from "./components/RefactoredHomePage.jsx";
import RefactoredTopNav from "./components/RefactoredTopNav.jsx";
import RefactoredOrderPage from "./components/RefactoredOrderPage.jsx";
import RefactoredCrowdPage from "./components/RefactoredCrowdPage.jsx";
import RefactoredFeedbackPage from "./components/RefactoredFeedbackPage.jsx";
import RefactoredCartPage from "./components/RefactoredCartPage.jsx";
import RefactoredTrackingPage from "./components/RefactoredTrackingPage.jsx";
import PaymentPage from "./components/PaymentPage.jsx";
import OrderSuccessPage from "./components/OrderSuccessPage.jsx";
import RefactoredChefDrawer from "./components/RefactoredChefDrawer.jsx";
import FloatingChefButton from "./components/FloatingChefButton.jsx";
import RefactoredAdminDashboard from "./components/RefactoredAdminDashboard.jsx";
import AdminHomePage from "./components/AdminHomePage.jsx";
import AdminOrdersPage from "./components/AdminOrdersPage.jsx";
import AdminMenuPage from "./components/AdminMenuPage.jsx";
import "./components/RefactoredHomePage.css";
import "./components/RefactoredOrderPage.css";
import "./components/RefactoredCrowdPage.css";
import "./components/RefactoredFeedbackPage.css";
import "./components/RefactoredCartPage.css";
import "./components/RefactoredTrackingPage.css";
import "./components/PaymentPage.css";
import "./components/OrderSuccessPage.css";
import "./components/RefactoredChefDrawer.css";
import "./components/FloatingChefButton.css";
import "./components/RefactoredAdminDashboard.css";
import "./components/AdminHomePage.css";
import "./components/AdminOrdersPage.css";
import "./components/AdminMenuPage.css";

/* ================================================================== */
/* Inline SVG icons — no external icon package required                */
/* ================================================================== */
const ic = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});
const Bell = ({ size = 17 }) => (
  <svg {...ic(size)}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const CartIcon = ({ size = 17 }) => (
  <svg {...ic(size)}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
);
const Minus = ({ size = 14 }) => (<svg {...ic(size)}><path d="M5 12h14" /></svg>);
const Plus = ({ size = 14 }) => (<svg {...ic(size)}><path d="M5 12h14M12 5v14" /></svg>);
const Check = ({ size = 14 }) => (<svg {...ic(size)}><path d="M20 6 9 17l-5-5" /></svg>);
const ArrowLeft = ({ size = 18 }) => (<svg {...ic(size)}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>);
const Wallet = ({ size = 16 }) => (
  <svg {...ic(size)}><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" /><path d="M18 12a2 2 0 0 0 0 4h3v-4Z" /></svg>
);
const Ticket = ({ size = 16 }) => (
  <svg {...ic(size)}><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4Z" /><path d="M9 7v10" strokeDasharray="2 2" /></svg>
);
const Utensils = ({ size = 15 }) => (
  <svg {...ic(size)}><path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2" /><path d="M5 12v10" /><path d="M19 2c-1.5 0-3 1.5-3 4v6a2 2 0 0 0 2 2h1" /><path d="M19 2v20" /></svg>
);
const Bowl = ({ size = 18 }) => (
  <svg {...ic(size)}><ellipse cx="12" cy="14" rx="9" ry="3" /><path d="M5 14c0-3 3-5 7-5s7 2 7 5" /><path d="M9 6c0-1 .5-1.8 1-2.4M12 5c0-1 .3-1.8.8-2.4M15 6c0-1-.3-1.8-.9-2.4" /></svg>
);
const Wrap = ({ size = 18 }) => (
  <svg {...ic(size)}><rect x="3" y="8" width="18" height="8" rx="4" /><path d="M8 8v8M13 8v8" strokeDasharray="1.5 2" /></svg>
);
const Cup = ({ size = 18 }) => (
  <svg {...ic(size)}><path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z" /><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" /><path d="M9 5c0-.8.5-1 .5-1.8M13 5c0-.8.5-1 .5-1.8" /></svg>
);
const JuiceGlass = ({ size = 18 }) => (
  <svg {...ic(size)}>
    <path d="M6 4h12l-1.8 14.2a2.5 2.5 0 0 1-2.5 2.2h-3.4a2.5 2.5 0 0 1-2.5-2.2L6 4z" />
    <path d="M6 10h12" strokeDasharray="2 1.5" />
    <line x1="14" y1="1" x2="11" y2="12" />
    <circle cx="17.5" cy="5" r="2.5" />
  </svg>
);
const Bird = ({ size = 18 }) => (
  <svg {...ic(size)}><path d="M4 11h16a8 8 0 0 1-16 0z" /><path d="M9 11V9a3 3 0 0 1 6 0v2" /><path d="M8 5c.5-1 1-1.4 1-2M12 4c.4-1 .9-1.4.9-2.2M16 5c.5-1 1-1.4 1-2" /></svg>
);
const User = ({ size = 20 }) => (
  <svg {...ic(size)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></svg>
);
const UserPlus = ({ size = 20 }) => (
  <svg {...ic(size)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="17" y1="11" x2="23" y2="11" />
  </svg>
);
const LogOut = ({ size = 16 }) => (
  <svg {...ic(size)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);
const People = ({ size = 17 }) => (
  <svg {...ic(size)}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const AlertTriangle = ({ size = 18 }) => (
  <svg {...ic(size)}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const StarIcon = ({ size = 16, filled = false }) => (
  <svg {...ic(size)} fill={filled ? "var(--coral)" : "none"} stroke={filled ? "var(--coral)" : "currentColor"}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const ThumbsUpIcon = ({ size = 14 }) => (
  <svg {...ic(size)}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
);
const MessageSquareIcon = ({ size = 16 }) => (
  <svg {...ic(size)}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
const SendIcon = ({ size = 16 }) => (
  <svg {...ic(size)}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
);
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const Mail = ({ size = 18 }) => (
  <svg {...ic(size)}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);
const Lock = ({ size = 18 }) => (
  <svg {...ic(size)}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const Eye = ({ size = 18 }) => (
  <svg {...ic(size)}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const EyeOff = ({ size = 18 }) => (
  <svg {...ic(size)}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
);
const Hash = ({ size = 18 }) => (
  <svg {...ic(size)}><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>
);
const Database = ({ size = 18 }) => (
  <svg {...ic(size)}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
);

const MicIcon = ({ size = 18 }) => (
  <svg {...ic(size)}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
);
const MicOffIcon = ({ size = 18 }) => (
  <svg {...ic(size)}><line x1="2" x2="22" y1="2" y2="22" /><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 5" /><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
);
const Volume2Icon = ({ size = 18 }) => (
  <svg {...ic(size)}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
);
const VolumeXIcon = ({ size = 18 }) => (
  <svg {...ic(size)}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="22" x2="16" y1="9" y2="15" /><line x1="16" x2="22" y1="9" y2="15" /></svg>
);
const InfoIcon = ({ size = 16 }) => (
  <svg {...ic(size)}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
);
const XIcon = ({ size = 18 }) => (
  <svg {...ic(size)}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const FlameIcon = ({ size = 14 }) => (
  <svg {...ic(size)} fill="none"><path d="M12 2c0 0-3 3-3 7a4 4 0 0 0 8 0c0-2-1-4-2-5 0 1.5-1 2.5-2 3 0-2-1-5-1-5z" strokeLinejoin="round" /></svg>
);

const FOOD_ICONS = { thali: Bowl, wrap: Wrap, cup: Cup, biryani: Bird, juice: JuiceGlass };

/* ================================================================== */
/* 3D Interactive Hooks & Visual Components                           */
/* ================================================================== */
function use3DTilt(maxTilt = 8, maxScale = 1.02) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const onMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (((y - centerY) / centerY) * -maxTilt).toFixed(2);
      const rotateY = (((x - centerX) / centerX) * maxTilt).toFixed(2);

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${maxScale}, ${maxScale}, ${maxScale})`,
        transition: "transform 0.08s ease-out",
      });
    },
    [maxTilt, maxScale]
  );

  const onMouseLeave = useCallback(() => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
    });
  }, []);

  return { ref, style, onMouseMove, onMouseLeave };
}

function Floating3DFood({ icon, top, left, right, bottom, delay = 0, duration = 6, size = 28 }) {
  return (
    <div
      className="floating-3d-item"
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        zIndex: 3,
        pointerEvents: "none",
      }}
    >
      <div className="floating-3d-inner" style={{ fontSize: size }}>
        {icon}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Design tokens (kept in one place so the whole app stays consistent) */
/* ================================================================== */
const LEVELS = {
  low: { label: "Low", key: "low", color: "var(--basil)", bg: "rgba(62,122,79,.12)" },
  med: { label: "Med", key: "med", color: "var(--amber)", bg: "rgba(204,122,0,.12)" },
  high: { label: "High", key: "high", color: "var(--chili)", bg: "rgba(196,62,28,.12)" },
};

/* ================================================================== */
/* Translations (English & Tamil)                                      */
/* ================================================================== */
const TRANSLATIONS = {
  en: {
    home: "Home",
    order: "Order",
    crowd: "Crowd",
    stock: "Stock",
    cart: "Cart",
    track: "Track",
    brand: "Campus Canteen",
    canteen_login: "Canteen Login",
    college_email_roll: "College Email / Roll No",
    password: "Password",
    remember_me: "Remember me",
    forgot_password: "Forgot Password?",
    login_btn: "LOGIN",
    register_title: "New User Registration",
    full_name: "Full Name",
    full_name_placeholder: "e.g. Rahul Sharma",
    department: "Department",
    year_of_study: "Year of Study",
    confirm_password: "Confirm Password",
    create_account_btn: "CREATE ACCOUNT",
    new_user_question: "New user? Create an account",
    already_have_account: "Already registered? Sign in",
    passwords_dont_match: "Passwords do not match!",
    total_orders_tracker: "Total Orders Tracker",
    orders_taken: "Orders Taken",
    orders_delivered: "Delivered & Served",
    active_orders: "In Preparation",
    total_revenue_served: "Total Value Served",
    order_history_log: "Order Log & History",
    email_roll_placeholder: "21CSE045 or you@college.edu",
    password_placeholder: "••••••••••",
    cse_canteen: "CSE CANTEEN",
    block_a: "BLOCK A",
    busy: "Busy",
    low: "Low",
    med: "Med",
    high: "High",
    quick_actions: "Quick Actions",
    order_now: "Order now",
    waitlist: "Waitlist",
    wallet: "wallet",
    happening_now: "Happening now",
    lunch_rush: "Lunch rush is on 🍽️",
    students_eating: "42 students eating together right now",
    recommended: "Recommended for you",
    see_all: "See all",
    add: "ADD",
    added: "Added",
    whats_fresh: "What's fresh today?",
    browse_order: "Browse & Order",
    add_new_product: "Add new product",
    product_name: "Product name",
    price: "Price",
    calories: "Calories",
    stock_qty: "Stock",
    category: "Category",
    add_product_btn: "Add product",
    sold_out: "Sold out",
    available: "Available",
    left: "left",
    items: "items",
    item: "item",
    remove: "Remove",
    view_cart: "View Cart",
    your_cart: "Your cart",
    review_pay: "Review & Pay",
    almost_there: "Almost there!",
    cart_empty: "Your cart is empty.",
    browse_menu: "Browse the menu",
    promo_code: "Promo code",
    apply: "Apply",
    coupon_applied: "Coupon applied — 10% off",
    invalid_code: "Invalid code — try CANTEEN10",
    pay_with: "Pay with",
    summary: "Summary",
    subtotal: "Subtotal",
    coupon: "Coupon CANTEEN10",
    fee: "Platform fee",
    taxes: "Taxes",
    to_pay: "To pay",
    place_order: "Place order",
    order_tracking: "Order tracking",
    pickup_token: "Your pickup token",
    issued: "Issued",
    counter: "Counter",
    paid_via: "Paid via",
    simulate_update: "Simulate next update →",
    order_picked_up: "Order picked up! Enjoy 🎉",
    order_summary: "Order summary",
    notify_ready: "Notify when ready",
    cancel_order: "Cancel order",
    no_active_order: "No active order yet.",
    order_something: "Order something",
    step_received: "Order Placed",
    step_preparing: "Preparing",
    step_ready: "Ready for Pickup",
    step_completed: "Completed",
    live_status: "Real-time Monitor",
    update_crowd: "Update crowd levels",
    crowd_status: "Live Status",
    live: "LIVE",
    min_ago: "min ago",
    just_now: "just now",
    hr_ago: "hr ago",
    min: "min",
    update_btn: "Update",
    cancel_btn: "Cancel",
    crowd_tip_title: "How crowd prediction works",
    crowd_tip_text: "Crowd levels are updated live by canteen staff and student check-ins to save your waiting time.",
    low_stock_alert: "Low Stock Alert!",
    low_stock_badge: "LOW STOCK",
    hurry_only: "Hurry! Stock is running low for",
    feedback: "Feedback",
    give_feedback: "Give Feedback",
    overall_rating: "Overall Rating",
    rate_your_experience: "Rate Your Experience",
    select_category: "Category",
    quick_tags: "Quick Tags",
    write_comment: "Write your feedback or suggestion...",
    submit_feedback: "Submit Feedback",
    feedback_submitted: "Thank you for your feedback!",
    rate_order: "Rate your order",
    helpful: "Helpful",
    staff_response: "Canteen Manager Response",
    all_reviews: "All Reviews",
    food_quality: "Food Quality",
    service_speed: "Service & Speed",
    hygiene: "Hygiene & Cleanliness",
    app_experience: "App Experience",
    juice_pairing_title: "Pair with Fresh Juice! 🥤",
    juice_pairing_sub: "Freshly squeezed & chilled drinks to complement your food",
    add_juice: "Add Juice",
    nutrition_facts: "Nutrition Facts",
    auto_calculate_macros: "Auto-Calculate Macros",
    protein_label: "Protein",
    carbs_label: "Carbohydrates",
    fat_label: "Total Fat",
    fiber_label: "Dietary Fiber",
    sugar_label: "Sugars",
    sodium_label: "Sodium",
    allergens_label: "Allergens",
    diet_type_label: "Diet Type",
    categories: {
      meals: "Food (Meals)",
      juice: "Fresh Juice",
      snacks: "Snacks",
      beverages: "Beverages",
      desserts: "Desserts",
    },
  },
  ta: {
    home: "முகப்பு",
    order: "உணவு",
    crowd: "கூட்டம்",
    stock: "இருப்பு",
    cart: "வண்டி",
    track: "நிலை",
    brand: "கல்லூரி உணவகம்",
    canteen_login: "உணவக உள்நுழைவு",
    college_email_roll: "மின்னஞ்சல் / பதிவு எண்",
    password: "கடவுச்சொல்",
    remember_me: "என்னை நினைவில் கொள்",
    forgot_password: "கடவுச்சொல் மறந்துவிட்டதா?",
    login_btn: "உள்நுழை",
    register_title: "புதிய பயனர் பதிவு",
    full_name: "முழு பெயர்",
    full_name_placeholder: "எ.கா. ராகுல் சர்மா",
    department: "துறை",
    year_of_study: "பிலும் ஆண்டு",
    confirm_password: "கடவுச்சொல்லை உறுதிசெய்",
    create_account_btn: "கணக்கை உருவாக்கு",
    new_user_question: "புதிய பயனரா? கணக்கு உருவாக்கவும்",
    already_have_account: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக",
    passwords_dont_match: "கடவுச்சொற்கள் பொருந்தவில்லை!",
    total_orders_tracker: "மொத்த ஆர்டர்கள் கண்காணிப்பு",
    orders_taken: "எடுக்கப்பட்ட ஆர்டர்கள்",
    orders_delivered: "வழங்கப்பட்டவை",
    active_orders: "தயாரிப்பில் உள்ளன",
    total_revenue_served: "மொத்த விநியோக மதிப்பு",
    order_history_log: "ஆர்டர் வரலாறு மற்றும் பதிவு",
    email_roll_placeholder: "21CSE045 அல்லது நீங்கள்@college.edu",
    password_placeholder: "••••••••••",
    cse_canteen: "சி.எஸ்.இ உணவகம்",
    block_a: "பிளாக் ஏ",
    busy: "பிஸி",
    low: "குறைவு",
    med: "மிதமானது",
    high: "அதிகம்",
    quick_actions: "விரைவு சேவைகள்",
    order_now: "ஆர்டர் செய்",
    waitlist: "காத்திருப்பு பட்டியல்",
    wallet: "வாலட்",
    happening_now: "தற்போது",
    lunch_rush: "மதிய உணவு நேரம் 🍽️",
    students_eating: "42 மாணவர்கள் தற்போது உணவருந்துகின்றனர்",
    recommended: "உங்களுக்கான பரிந்துரை",
    see_all: "அனைத்தும்",
    add: "சேர்",
    added: "சேர்க்கப்பட்டது",
    whats_fresh: "இன்று புதிய உணவுகள்",
    browse_order: "தேர்ந்தெடுத்து ஆர்டர் செய்க",
    add_new_product: "புதிய உணவு சேர்க்க",
    product_name: "உணவு பெயர்",
    price: "விலை",
    calories: "கலோரி",
    stock_qty: "இருப்பு",
    category: "வகை",
    add_product_btn: "உணவு சேர்",
    sold_out: "இருப்பு இல்லை",
    available: "கிடைக்கிறது",
    left: "மீதி",
    items: "பொருட்கள்",
    item: "பொருள்",
    remove: "நீக்கு",
    view_cart: "கூடையைப் பார்",
    your_cart: "உங்கள் கூடை",
    review_pay: "சரிபார்த்து செலுத்தவும்",
    almost_there: "தயாராகிறது!",
    cart_empty: "உங்கள் கூடை காலியாக உள்ளது.",
    browse_menu: "உணவுப் பட்டியலைப் பார்",
    promo_code: "கூப்பன் குறியீடு",
    apply: "பயன்படுத்து",
    coupon_applied: "கூப்பன் பயன்படுத்தப்பட்டது — 10% தள்ளுபடி",
    invalid_code: "தவறான குறியீடு — CANTEEN10 முயற்சிக்கவும்",
    pay_with: "பணமளிப்பு முறை",
    summary: "சுருக்கம்",
    subtotal: "மொத்த தொகை",
    coupon: "கூப்பன் CANTEEN10",
    fee: "சேவை கட்டணம்",
    taxes: "வரி",
    to_pay: "செலுத்த வேண்டிய தொகை",
    place_order: "ஆர்டர் உறுதிசெய்",
    order_tracking: "ஆர்டர் கண்காணிப்பு",
    pickup_token: "உங்கள் டோக்கன் எண்",
    issued: "நேரம்",
    counter: "கவுண்டர்",
    paid_via: "செலுத்திய முறை",
    simulate_update: "அடுத்த நிலைக்குச் செல் →",
    order_picked_up: "ஆர்டர் பெறப்பட்டது! சுவையுங்கள் 🎉",
    order_summary: "ஆர்டர் விவரம்",
    notify_ready: "தயாரானதும் அறிவிக்கவும்",
    cancel_order: "ஆர்டரை ரத்துசெய்",
    no_active_order: "செயலில் உள்ள ஆர்டர்கள் எதுவும் இல்லை.",
    order_something: "உணவு ஆர்டர் செய்யுங்கள்",
    step_received: "ஆர்டர் செய்யப்பட்டது",
    step_preparing: "தயாராகிறது",
    step_ready: "பெறத் தயாராக உள்ளது",
    step_completed: "நிறைவடைந்தது",
    live_status: "நேரலை கண்காணிப்பு",
    update_crowd: "கூட்ட நிலையை புதுப்பி",
    crowd_status: "நேரலை நிலை",
    live: "நேரலை",
    min_ago: "நிமிடம் முன்",
    just_now: "இப்போது",
    hr_ago: "மணி நேரம் முன்",
    min: "நிமிடம்",
    update_btn: "புதுப்பி",
    cancel_btn: "ரத்து செய்",
    crowd_tip_title: "கூட்ட கணிப்பு எவ்வாறு இயங்குகிறது",
    crowd_tip_text: "உங்கள் காத்திருப்பு நேரத்தைக் குறைக்க உணவகப் பணியாளர்களால் நேரலையாகப் புதுப்பிக்கப்படுகிறது.",
    low_stock_alert: "குறைந்த இருப்பு எச்சரிக்கை!",
    low_stock_badge: "குறைந்த இருப்பு",
    hurry_only: "சீக்கிரம்! இருப்பு குறைவாக உள்ளது:",
    feedback: "கருத்து",
    give_feedback: "கருத்து வழங்கவும்",
    overall_rating: "ஒட்டுமொத்த மதிப்பீடு",
    rate_your_experience: "உங்கள் அனுபவத்தை மதிப்பிடவும்",
    select_category: "வகை",
    quick_tags: "விரைவு குறிச்சொற்கள்",
    write_comment: "உங்கள் கருத்து அல்லது பரிந்துரையை எழுதவும்...",
    submit_feedback: "கருத்தை சமர்ப்பிக்கவும்",
    feedback_submitted: "உங்கள் கருத்துக்கு நன்றி!",
    rate_order: "ஆர்டரை மதிப்பிடவும்",
    helpful: "பயனுள்ளது",
    staff_response: "உணவக மேலாளர் பதில்",
    all_reviews: "அனைத்து விமர்சனங்கள்",
    food_quality: "உணவு தரம்",
    service_speed: "சேவை வேகம்",
    hygiene: "சுகாதாரம்",
    app_experience: "செயலி அனுபவம்",
    juice_pairing_title: "உணவுடன் குளிர்ச்சியான ஜூஸ்! 🥤",
    juice_pairing_sub: "உங்கள் உணவை மேலும் சுவையாக்க புதிய பழச்சாறுகள்",
    add_juice: "ஜூஸ் சேர்க்க",
    nutrition_facts: "ஊட்டச்சத்து விவரங்கள்",
    auto_calculate_macros: "தானியங்கி கணக்கீடு",
    protein_label: "புரதம்",
    carbs_label: "கார்போஹைட்ரேட்",
    fat_label: "கொழுப்பு",
    fiber_label: "நார்ச்சத்து",
    sugar_label: "சர்க்கரை",
    sodium_label: "சோடியம்",
    allergens_label: "ஒவ்வாமை பொருட்கள்",
    diet_type_label: "உணவு வகை",
    categories: {
      meals: "உணவுகள்",
      juice: "ஜூஸ்",
      snacks: "சிற்றுண்டிகள்",
      beverages: "பானங்கள்",
      desserts: "இனிப்புகள்",
    },
  }
};

/* ================================================================== */
/* Mock data                                                            */
/* ================================================================== */
const INITIAL_FEEDBACKS = [
  {
    id: "fb-1",
    author: "Kavya R.",
    roll: "22CSE012",
    rating: 5,
    category: "food_quality",
    item: "Chicken biryani",
    tags: ["🔥 Hot & Fresh", "🥗 Great Portion"],
    comment: "The chicken biryani today was incredible! Spiced just right and served piping hot. Best lunch experience this week.",
    date: "10 mins ago",
    helpful: 14,
    managerReply: "Thank you Kavya! Glad you loved today's batch. We'll keep the standard high! 🔥"
  },
  {
    id: "fb-2",
    author: "Siddharth M.",
    roll: "21ECE088",
    rating: 4,
    category: "service_speed",
    item: "Masala chai",
    tags: ["⚡ Fast Service", "💰 Value for Money"],
    comment: "Token counter #2 was moving super fast even during peak lunch rush. Tea was refreshing!",
    date: "1 hour ago",
    helpful: 9,
    managerReply: null
  },
  {
    id: "fb-3",
    author: "Priya S.",
    roll: "23IT041",
    rating: 5,
    category: "hygiene",
    item: "Veg thali",
    tags: ["🧹 Clean Area", "🔥 Hot & Fresh"],
    comment: "Super clean dining tables and friendly staff. Veg thali subzi was fresh and wholesome.",
    date: "3 hours ago",
    helpful: 21,
    managerReply: "Appreciate your kind words Priya! Cleanliness is our #1 priority."
  },
  {
    id: "fb-4",
    author: "Vikram N.",
    roll: "21MECH005",
    rating: 4,
    category: "app_experience",
    item: null,
    tags: ["⚡ Fast Service"],
    comment: "Live crowd tracking indicator helped me avoid the peak 1:15 PM queue. Token system works seamlessly!",
    date: "Yesterday",
    helpful: 7,
    managerReply: null
  }
];

const WAIT_BY_LEVEL = { low: 3, med: 7, high: 14 };
const CANTEENS_DEFAULT = [
  { id: "main", name: "CS Canteen", name_ta: "சி.எஸ் உணவகம்", loc: "Block A · Ground Floor", loc_ta: "பிளாக் ஏ · தரைத்தளம்", level: "low", wait: 3, status: "active", lastUpdated: new Date() },
  { id: "hostel", name: "S&H Canteen", name_ta: "எஸ் & ஹெச் உணவகம்", loc: "Block D · Ground Floor", loc_ta: "பிளாக் டி · தரைத்தளம்", level: "med", wait: 8, status: "active", lastUpdated: new Date() },
  { id: "library", name: "Mech Canteen", name_ta: "மெக் உணவகம்", loc: "Block C · 1st Floor", loc_ta: "பிளாக் சி · 1ஆம் தளம்", level: "high", wait: 15, status: "active", lastUpdated: new Date() },
];

const MENU = [
  {
    id: "veg_thali", name: "Veg thali", name_ta: "காய்கறி உணவு", price: 90, kcal: 320,
    category: "meals", icon: "thali", stock: 18, available: true,
    nutrition: { protein: 12, carbs: 48, fat: 9, fiber: 6, sugar: 5, sodium: 420 },
    allergens: ["Gluten", "Dairy"], dietTag: "veg",
    desc: "A wholesome balanced thali with dal, sabzi, rice, roti and pickle."
  },
  {
    id: "chicken_biryani", name: "Chicken biryani", name_ta: "கோழி பிரியாணி", price: 130, kcal: 480,
    category: "meals", icon: "biryani", stock: 12, available: true,
    nutrition: { protein: 28, carbs: 52, fat: 18, fiber: 3, sugar: 4, sodium: 680 },
    allergens: ["Gluten"], dietTag: "non-veg",
    desc: "Aromatic basmati rice slow-cooked with tender chicken and whole spices."
  },
  {
    id: "orange_juice", name: "Fresh Orange Juice", name_ta: "ஆரஞ்சு ஜூஸ்", price: 40, kcal: 110,
    category: "juice", icon: "juice", stock: 25, available: true,
    nutrition: { protein: 2, carbs: 26, fat: 0, fiber: 1, sugar: 22, sodium: 5 },
    allergens: [], dietTag: "veg",
    desc: "Freshly squeezed sweet orange juice packed with natural Vitamin C and citrus pulp."
  },
  {
    id: "mango_juice", name: "Mango Juice", name_ta: "மாம்பழ ஜூஸ்", price: 50, kcal: 150,
    category: "juice", icon: "juice", stock: 20, available: true,
    nutrition: { protein: 1, carbs: 36, fat: 1, fiber: 2, sugar: 32, sodium: 10 },
    allergens: [], dietTag: "veg",
    desc: "Thick and luscious Alphonso mango blend, naturally sweet and perfectly chilled."
  },
  {
    id: "watermelon_juice", name: "Watermelon Juice", name_ta: "தர்பூசணி ஜூஸ்", price: 35, kcal: 80,
    category: "juice", icon: "juice", stock: 30, available: true,
    nutrition: { protein: 1, carbs: 19, fat: 0, fiber: 1, sugar: 16, sodium: 5 },
    allergens: [], dietTag: "veg",
    desc: "Crisp and hydrating crushed watermelon juice with a subtle touch of black salt."
  },
  {
    id: "lime_mint", name: "Lime Mint Cooler", name_ta: "எலுமிச்சை புதினா ஜூஸ்", price: 30, kcal: 45,
    category: "juice", icon: "juice", stock: 25, available: true,
    nutrition: { protein: 0, carbs: 12, fat: 0, fiber: 0, sugar: 10, sodium: 40 },
    allergens: [], dietTag: "veg",
    desc: "Tangy fresh lime cooler with muddled garden mint and crushed ice."
  },
  {
    id: "paneer_wrap", name: "Paneer wrap", name_ta: "பன்னீர் ரோல்", price: 60, kcal: 260,
    category: "snacks", icon: "wrap", stock: 22, available: true,
    nutrition: { protein: 11, carbs: 30, fat: 10, fiber: 2, sugar: 3, sodium: 310 },
    allergens: ["Gluten", "Dairy"], dietTag: "veg",
    desc: "Grilled paneer with mint chutney and crunchy veggies in a soft wheat wrap."
  },
  {
    id: "masala_chai", name: "Masala chai", name_ta: "மசாலா டீ", price: 15, kcal: 40,
    category: "beverages", icon: "cup", stock: 30, available: true,
    nutrition: { protein: 1, carbs: 7, fat: 1, fiber: 0, sugar: 6, sodium: 15 },
    allergens: ["Dairy"], dietTag: "veg",
    desc: "Freshly brewed spiced tea with ginger, cardamom and cinnamon."
  },
  {
    id: "filter_coffee", name: "Filter coffee", name_ta: "பில்டர் காபி", price: 20, kcal: 35,
    category: "beverages", icon: "cup", stock: 18, available: true,
    nutrition: { protein: 1, carbs: 5, fat: 1, fiber: 0, sugar: 4, sodium: 10 },
    allergens: ["Dairy"], dietTag: "veg",
    desc: "Traditional South Indian drip coffee with creamy milk and decoction."
  },
  {
    id: "brownie", name: "Brownie slice", name_ta: "பிரவுனி கேக்", price: 60, kcal: 310,
    category: "desserts", icon: "cup", stock: 0, available: false,
    nutrition: { protein: 4, carbs: 42, fat: 14, fiber: 2, sugar: 28, sodium: 190 },
    allergens: ["Gluten", "Dairy", "Eggs"], dietTag: "veg",
    desc: "Rich fudgy dark chocolate brownie baked fresh every morning."
  },
];

const CATEGORIES = ["meals", "juice", "snacks", "beverages", "desserts"];

const INITIAL_ORDER_HISTORY = [
  {
    id: "ORD-9281",
    items: [
      { id: "veg_thali", name: "Veg thali", name_ta: "காய்கறி உணவு", price: 90, qty: 1 },
      { id: "masala_chai", name: "Masala chai", name_ta: "மசாலா டீ", price: 15, qty: 2 },
    ],
    total: 120,
    paymentMode: "UPI / GPay",
    token: "A-12",
    issuedTime: new Date(Date.now() - 1000 * 60 * 45),
    completedTime: new Date(Date.now() - 1000 * 60 * 25),
    status: 3,
    counter: 2,
  },
  {
    id: "ORD-8410",
    items: [
      { id: "chicken_biryani", name: "Chicken biryani", name_ta: "கோழி பிரியாணி", price: 130, qty: 1 },
      { id: "orange_juice", name: "Fresh Orange Juice", name_ta: "ஆரஞ்சு ஜூஸ்", price: 40, qty: 1 },
    ],
    total: 170,
    paymentMode: "Campus Wallet",
    token: "A-08",
    issuedTime: new Date(Date.now() - 1000 * 60 * 120),
    completedTime: new Date(Date.now() - 1000 * 60 * 100),
    status: 3,
    counter: 1,
  },
  {
    id: "ORD-7532",
    items: [
      { id: "paneer_wrap", name: "Paneer wrap", name_ta: "பன்னீர் ரோல்", price: 60, qty: 2 },
      { id: "filter_coffee", name: "Filter coffee", name_ta: "பில்டர் காபி", price: 20, qty: 1 },
    ],
    total: 140,
    paymentMode: "UPI / PhonePe",
    token: "A-05",
    issuedTime: new Date(Date.now() - 1000 * 60 * 210),
    completedTime: new Date(Date.now() - 1000 * 60 * 190),
    status: 3,
    counter: 3,
  },
];

/* ================================================================== */
/* Context — shared app state (cart, wallet, crowd, current order)      */
/* ================================================================== */
const CanteenContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "add": {
      const next = { ...state };
      next[action.id] = (next[action.id] || 0) + action.qty;
      return next;
    }
    case "setQty": {
      const next = { ...state };
      if (action.qty <= 0) delete next[action.id];
      else next[action.id] = action.qty;
      return next;
    }
    case "clear":
      return {};
    default:
      return state;
  }
};

const INITIAL_REGISTERED_USERS = [
  { id: "STAFF-01", name: "Canteen Manager", email: "admin@canteen.edu", role: "admin", dept: "Management", year: 0, password: "admin", registeredAt: "2026-01-10T08:00:00.000Z" },
  { id: "STAFF-02", name: "Chef Murugan", email: "chef@canteen.edu", role: "admin", dept: "Kitchen Operations", year: 0, password: "admin", registeredAt: "2026-01-10T08:00:00.000Z" },
  { id: "21CSE045", name: "Ananya Sharma", email: "ananya@college.edu", role: "customer", dept: "CSE", year: 3, password: "123", registeredAt: "2026-01-15T09:30:00.000Z" },
  { id: "22ECE018", name: "Karthik Raja", email: "karthik@college.edu", role: "customer", dept: "ECE", year: 2, password: "123", registeredAt: "2026-01-16T10:15:00.000Z" },
  { id: "23IT009", name: "Priya Sundar", email: "priya@college.edu", role: "customer", dept: "IT", year: 1, password: "123", registeredAt: "2026-01-18T11:00:00.000Z" },
];

const STORAGE_REGISTERED_USERS = "canteen_registered_users";
const STORAGE_REGISTERED_EMAILS = "canteen_registered_emails";
const STORAGE_LAST_EMAIL = "canteen_last_registered_email";

const getInitialRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_REGISTERED_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map();
        INITIAL_REGISTERED_USERS.forEach((u) => map.set((u.email || u.id).toLowerCase(), u));
        parsed.forEach((u) => {
          const k = (u.email || u.id || "").toLowerCase();
          if (k) map.set(k, { ...(map.get(k) || {}), ...u });
        });
        return Array.from(map.values());
      }
    }
  } catch (err) {
    console.warn("Failed to load registered users from localStorage:", err);
  }
  return INITIAL_REGISTERED_USERS;
};

const saveRegisteredUsersToStorage = (users) => {
  try {
    localStorage.setItem(STORAGE_REGISTERED_USERS, JSON.stringify(users));
    const emails = users
      .map((u) => (u.email || "").trim().toLowerCase())
      .filter((e) => e.length > 0);
    const uniqueEmails = Array.from(new Set(emails));
    localStorage.setItem(STORAGE_REGISTERED_EMAILS, JSON.stringify(uniqueEmails));
    console.log(`💾 Stored ${uniqueEmails.length} registered email(s) in localStorage (${STORAGE_REGISTERED_EMAILS})`);
  } catch (err) {
    console.error("Failed to save registered users to localStorage:", err);
  }
};

/* ── Menu & Order History Persistence Helpers ────────────────────────── */
const STORAGE_MENU = "canteen_menu_items_v2";
const STORAGE_ORDER_HISTORY = "canteen_order_history_v2";
const STORAGE_ACTIVE_ORDER = "canteen_active_order_v2";

const getInitialMenu = () => {
  try {
    const raw = localStorage.getItem(STORAGE_MENU);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const storedIds = new Set(parsed.map((item) => item && item.id));
        const merged = [...parsed];
        // Ensure default items (such as the 4 juices and staples) are present if missing
        MENU.forEach((defItem) => {
          if (!storedIds.has(defItem.id)) {
            merged.push(defItem);
          }
        });
        return merged;
      }
    }
  } catch (err) {
    console.warn("Failed to load menu from localStorage:", err);
  }
  return MENU;
};

const saveMenuToStorage = (items) => {
  try {
    if (Array.isArray(items)) {
      localStorage.setItem(STORAGE_MENU, JSON.stringify(items));
    }
  } catch (err) {
    console.error("Failed to save menu to localStorage:", err);
  }
};

const getInitialOrderHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_ORDER_HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load order history from localStorage:", err);
  }
  return INITIAL_ORDER_HISTORY;
};

const saveOrderHistoryToStorage = (history) => {
  try {
    if (Array.isArray(history)) {
      localStorage.setItem(STORAGE_ORDER_HISTORY, JSON.stringify(history));
    }
  } catch (err) {
    console.error("Failed to save order history to localStorage:", err);
  }
};

const getInitialActiveOrder = () => {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_ORDER);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load active order from localStorage:", err);
  }
  return null;
};

const saveActiveOrderToStorage = (order) => {
  try {
    if (order) {
      localStorage.setItem(STORAGE_ACTIVE_ORDER, JSON.stringify(order));
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_ORDER);
    }
  } catch (err) {
    console.error("Failed to save active order to localStorage:", err);
  }
};

/* ── Raw Material Stock & Recipe Ingredients Persistence Helpers ────── */
const STORAGE_RAW_STOCKS = "canteen_raw_stocks_v1";
const STORAGE_STOCK_TRANSACTIONS = "canteen_stock_transactions_v1";
const STORAGE_RECIPE_INGREDIENTS = "canteen_recipe_ingredients_v1";

const INITIAL_RAW_STOCKS = [
  { id: 1, stockId: "STK-1001", stockName: "Rice", category: "Grains", quantity: 50, unit: "kg", minimumStockLevel: 10, purchasePrice: 2500, supplierName: "ABC Suppliers", purchaseDate: "2026-09-10", expiryDate: "2027-03-21" },
  { id: 2, stockId: "STK-1002", stockName: "Tomato", category: "Vegetables", quantity: 2, unit: "kg", minimumStockLevel: 5, purchasePrice: 80, supplierName: "Fresh Farms", purchaseDate: "2026-09-18", expiryDate: "2026-09-23" },
  { id: 3, stockId: "STK-1003", stockName: "Onion", category: "Vegetables", quantity: 0, unit: "kg", minimumStockLevel: 5, purchasePrice: 0, supplierName: "Fresh Farms", purchaseDate: "2026-09-10", expiryDate: "2026-10-10" },
  { id: 4, stockId: "STK-1004", stockName: "Potato", category: "Vegetables", quantity: 25, unit: "kg", minimumStockLevel: 8, purchasePrice: 750, supplierName: "Agro Foods", purchaseDate: "2026-09-15", expiryDate: "2026-10-15" },
  { id: 5, stockId: "STK-1005", stockName: "Carrot", category: "Vegetables", quantity: 8, unit: "kg", minimumStockLevel: 3, purchasePrice: 400, supplierName: "Agro Foods", purchaseDate: "2026-09-15", expiryDate: "2026-09-28" },
  { id: 6, stockId: "STK-1006", stockName: "Milk", category: "Dairy", quantity: 3, unit: "litre", minimumStockLevel: 5, purchasePrice: 180, supplierName: "Dairy Fresh", purchaseDate: "2026-09-20", expiryDate: "2026-09-23" },
  { id: 7, stockId: "STK-1007", stockName: "Oil", category: "Oils", quantity: 30, unit: "litre", minimumStockLevel: 5, purchasePrice: 3600, supplierName: "Gold Drop Refineries", purchaseDate: "2026-09-01", expiryDate: "2027-01-10" },
  { id: 8, stockId: "STK-1008", stockName: "Flour", category: "Grains", quantity: 40, unit: "kg", minimumStockLevel: 10, purchasePrice: 1600, supplierName: "Royal Mills", purchaseDate: "2026-09-05", expiryDate: "2026-12-15" },
  { id: 9, stockId: "STK-1009", stockName: "Eggs", category: "Dairy", quantity: 100, unit: "piece", minimumStockLevel: 20, purchasePrice: 600, supplierName: "Poultry King", purchaseDate: "2026-09-16", expiryDate: "2026-10-01" },
  { id: 10, stockId: "STK-1010", stockName: "Chicken", category: "Meat", quantity: 20, unit: "kg", minimumStockLevel: 5, purchasePrice: 4400, supplierName: "Fresh Meat Co", purchaseDate: "2026-09-20", expiryDate: "2026-09-22" },
  { id: 11, stockId: "STK-1011", stockName: "Spices", category: "Spices", quantity: 10, unit: "kg", minimumStockLevel: 2, purchasePrice: 2000, supplierName: "Spice Valley", purchaseDate: "2026-08-15", expiryDate: "2027-06-30" },
  { id: 12, stockId: "STK-1012", stockName: "Sugar", category: "Sweeteners", quantity: 25, unit: "kg", minimumStockLevel: 5, purchasePrice: 1125, supplierName: "Sweet Sugars Ltd", purchaseDate: "2026-08-20", expiryDate: "2027-05-15" },
];

const INITIAL_STOCK_TRANSACTIONS = [
  { id: 1, stockId: 1, stockName: "Rice", type: "PURCHASE", quantity: 50, unit: "kg", previousStock: 0, newStock: 50, reason: "Supplier purchase from ABC Suppliers", supplierName: "ABC Suppliers", purchasePrice: 2500, performedBy: "Canteen Manager", date: "2026-09-10T10:00:00.000Z" },
  { id: 2, stockId: 6, stockName: "Milk", type: "PURCHASE", quantity: 10, unit: "litre", previousStock: 0, newStock: 10, reason: "Morning milk batch delivery", supplierName: "Dairy Fresh", purchasePrice: 600, performedBy: "Chef Murugan", date: "2026-09-20T06:30:00.000Z" },
  { id: 3, stockId: 6, stockName: "Milk", type: "USED", quantity: -5, unit: "litre", previousStock: 10, newStock: 5, reason: "Morning tea and coffee batches", supplierName: "Dairy Fresh", purchasePrice: 0, performedBy: "Chef Murugan", date: "2026-09-20T09:00:00.000Z" },
  { id: 4, stockId: 6, stockName: "Milk", type: "WASTAGE", quantity: -2, unit: "litre", previousStock: 5, newStock: 3, reason: "Spilled container during prep", supplierName: "Dairy Fresh", purchasePrice: 0, performedBy: "Chef Murugan", date: "2026-09-20T11:15:00.000Z" },
  { id: 5, stockId: 7, stockName: "Oil", type: "PURCHASE", quantity: 30, unit: "litre", previousStock: 0, newStock: 30, reason: "Monthly cooking oil bulk procurement", supplierName: "Gold Drop Refineries", purchasePrice: 3600, performedBy: "Canteen Manager", date: "2026-09-01T08:00:00.000Z" },
];

const INITIAL_RECIPE_INGREDIENTS = [
  { id: 1, menuItemId: "veg_thali", stockId: 1, quantity: 0.2, unit: "kg", notes: "Basmati rice" },
  { id: 2, menuItemId: "veg_thali", stockId: 4, quantity: 0.1, unit: "kg", notes: "Potato sabzi" },
  { id: 3, menuItemId: "veg_thali", stockId: 7, quantity: 0.02, unit: "litre", notes: "Tadka cooking oil" },
  { id: 4, menuItemId: "veg_thali", stockId: 11, quantity: 0.01, unit: "kg", notes: "Thali spices" },
  { id: 5, menuItemId: "chicken_biryani", stockId: 1, quantity: 0.25, unit: "kg", notes: "Biryani rice" },
  { id: 6, menuItemId: "chicken_biryani", stockId: 10, quantity: 0.15, unit: "kg", notes: "Chicken cuts" },
  { id: 7, menuItemId: "chicken_biryani", stockId: 7, quantity: 0.03, unit: "litre", notes: "Refined oil" },
  { id: 8, menuItemId: "chicken_biryani", stockId: 11, quantity: 0.02, unit: "kg", notes: "Biryani spices" },
  { id: 9, menuItemId: "masala_chai", stockId: 6, quantity: 0.1, unit: "litre", notes: "Milk" },
  { id: 10, menuItemId: "masala_chai", stockId: 12, quantity: 0.01, unit: "kg", notes: "Sugar" },
  { id: 11, menuItemId: "masala_chai", stockId: 11, quantity: 0.005, unit: "kg", notes: "Tea spices" },
  { id: 12, menuItemId: "filter_coffee", stockId: 6, quantity: 0.12, unit: "litre", notes: "Milk" },
  { id: 13, menuItemId: "filter_coffee", stockId: 12, quantity: 0.01, unit: "kg", notes: "Sugar" },
  { id: 14, menuItemId: "paneer_wrap", stockId: 8, quantity: 0.08, unit: "kg", notes: "Wrap flour" },
  { id: 15, menuItemId: "paneer_wrap", stockId: 5, quantity: 0.05, unit: "kg", notes: "Carrot filling" },
  { id: 16, menuItemId: "paneer_wrap", stockId: 7, quantity: 0.01, unit: "litre", notes: "Tawa oil" },
];

const getInitialRawStocks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_RAW_STOCKS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Failed to load raw stocks from storage:", err);
  }
  return INITIAL_RAW_STOCKS;
};

const saveRawStocksToStorage = (stocks) => {
  try {
    localStorage.setItem(STORAGE_RAW_STOCKS, JSON.stringify(stocks));
  } catch (err) {
    console.error("Failed to save raw stocks to storage:", err);
  }
};

const getInitialStockTransactions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_STOCK_TRANSACTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Failed to load stock transactions from storage:", err);
  }
  return INITIAL_STOCK_TRANSACTIONS;
};

const saveStockTransactionsToStorage = (txs) => {
  try {
    localStorage.setItem(STORAGE_STOCK_TRANSACTIONS, JSON.stringify(txs));
  } catch (err) {
    console.error("Failed to save stock transactions to storage:", err);
  }
};

const getInitialRecipeIngredients = () => {
  try {
    const raw = localStorage.getItem(STORAGE_RECIPE_INGREDIENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Failed to load recipe ingredients from storage:", err);
  }
  return INITIAL_RECIPE_INGREDIENTS;
};

const saveRecipeIngredientsToStorage = (recipes) => {
  try {
    localStorage.setItem(STORAGE_RECIPE_INGREDIENTS, JSON.stringify(recipes));
  } catch (err) {
    console.error("Failed to save recipe ingredients to storage:", err);
  }
};

function CanteenProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      if (window.location.search.includes("testUser=student")) {
        return {
          id: "21CSE045",
          name: "Ananya Sharma",
          roll: "21CSE045",
          email: "ananya@college.edu",
          dept: "CSE",
          year: 3,
          role: "customer",
        };
      }
      const sessionUser = sessionStorage.getItem("canteen_session_user");
      if (sessionUser) return JSON.parse(sessionUser);
    } catch (e) {}
    return null;
  });

  // Keep active user synced in sessionStorage during active tab session, and clear when logged out
  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem("canteen_session_user", JSON.stringify(user));
      } else {
        sessionStorage.removeItem("canteen_session_user");
        localStorage.removeItem("canteen_current_user");
      }
    } catch (e) {}
  }, [user]);

  // Clean up any stale persistent user on startup so app never auto-bypasses login
  useEffect(() => {
    try {
      localStorage.removeItem("canteen_current_user");
    } catch (e) {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem("canteen_session_user");
      localStorage.removeItem("canteen_current_user");
    } catch (e) {}
  }, []);

  const [registeredUsers, setRegisteredUsers] = useState(getInitialRegisteredUsers);

  // Sync to localStorage on mount so initial registered emails are available immediately
  useEffect(() => {
    saveRegisteredUsersToStorage(registeredUsers);
  }, []);

  const registerUser = useCallback((newUser) => {
    const cleanedEmail = (newUser.email || "").trim().toLowerCase();
    const userToSave = {
      ...newUser,
      email: cleanedEmail,
      registeredAt: newUser.registeredAt || new Date().toISOString(),
    };

    setRegisteredUsers((prev) => {
      const existingIdx = prev.findIndex(
        (u) =>
          (u.email && cleanedEmail && u.email.toLowerCase() === cleanedEmail) ||
          (u.id && userToSave.id && u.id.toLowerCase() === userToSave.id.toLowerCase())
      );
      let updated;
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...userToSave };
      } else {
        updated = [userToSave, ...prev];
      }
      saveRegisteredUsersToStorage(updated);
      try {
        localStorage.setItem(STORAGE_LAST_EMAIL, cleanedEmail);
      } catch (e) {}
      return updated;
    });

    // Fire-and-forget async POST to backend MySQL API if running
    if (cleanedEmail && userToSave.password) {
      fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userToSave.id || userToSave.roll || cleanedEmail,
          name: userToSave.name,
          email: cleanedEmail,
          password: userToSave.password,
          role: userToSave.role || "customer",
          dept: userToSave.dept || "CSE",
          year: userToSave.year || 1,
        }),
      })
        .then(async (res) => {
          if (res.ok) {
            console.log("✅ Synced registered email to MySQL database:", cleanedEmail);
          }
        })
        .catch(() => {
          // Backend offline is normal during client-side dev
        });
    }
  }, []);

  const resetRegisteredUsers = useCallback(() => {
    setRegisteredUsers(INITIAL_REGISTERED_USERS);
    saveRegisteredUsersToStorage(INITIAL_REGISTERED_USERS);
  }, []);

  const updateUserPassword = useCallback((emailToUpdate, newPass) => {
    const cleaned = (emailToUpdate || "").trim().toLowerCase();
    if (!cleaned) return;
    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.email && u.email.toLowerCase() === cleaned) {
          return { ...u, password: newPass };
        }
        return u;
      });
      saveRegisteredUsersToStorage(updated);
      try {
        localStorage.setItem(STORAGE_LAST_EMAIL, cleaned);
      } catch (e) {}
      return updated;
    });
  }, []);

  const [walletBalance] = useState(340);
  const [cart, dispatchCart] = useReducer(cartReducer, { veg_thali: 1 }); // Pre-loaded with 1 Veg thali matching mockup Image 5
  const [menu, setMenu] = useState(getInitialMenu);
  const [canteens, setCanteens] = useState(CANTEENS_DEFAULT);
  const [selectedCanteen, setSelectedCanteenState] = useState(() => {
    try {
      return localStorage.getItem("canteen_selected_canteen") || "main";
    } catch {
      return "main";
    }
  });
  const setSelectedCanteen = useCallback((id) => {
    setSelectedCanteenState(id);
    try {
      localStorage.setItem("canteen_selected_canteen", id);
    } catch {}
  }, []);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your order is ready — Token A-14 at Counter 2", read: false },
    { id: 2, text: "CSE Canteen is now Busy. Consider North Block Café.", read: false },
  ]);
  const [order, setOrder] = useState(getInitialActiveOrder); // active order once placed, persisted
  const [orderHistory, setOrderHistory] = useState(getInitialOrderHistory);
  const [lang, setLang] = useState("en");
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);

  // Sync menu, orderHistory, and active order to localStorage whenever they change
  useEffect(() => {
    saveMenuToStorage(menu);
  }, [menu]);

  useEffect(() => {
    saveOrderHistoryToStorage(orderHistory);
  }, [orderHistory]);

  useEffect(() => {
    saveActiveOrderToStorage(order);
  }, [order]);

  const [rawStocks, setRawStocks] = useState(getInitialRawStocks);
  const [stockTransactions, setStockTransactions] = useState(getInitialStockTransactions);
  const [recipeIngredients, setRecipeIngredients] = useState(getInitialRecipeIngredients);

  useEffect(() => {
    saveRawStocksToStorage(rawStocks);
  }, [rawStocks]);

  useEffect(() => {
    saveStockTransactionsToStorage(stockTransactions);
  }, [stockTransactions]);

  useEffect(() => {
    saveRecipeIngredientsToStorage(recipeIngredients);
  }, [recipeIngredients]);

  // Synchronize with backend API if online
  useEffect(() => {
    fetch("http://localhost:5000/api/canteens")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setCanteens(data);
        }
      })
      .catch(() => {});

    fetch("http://localhost:5000/api/admin/stock")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setRawStocks(data);
          saveRawStocksToStorage(data);
        }
      })
      .catch(() => {});

    fetch("http://localhost:5000/api/admin/stock/history")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setStockTransactions(data);
          saveStockTransactionsToStorage(data);
        }
      })
      .catch(() => {});

    fetch("http://localhost:5000/api/admin/menu-ingredients")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setRecipeIngredients(data);
          saveRecipeIngredientsToStorage(data);
        }
      })
      .catch(() => {});
  }, []);

  const resetMenuToDefaults = useCallback(() => {
    setMenu(MENU);
    saveMenuToStorage(MENU);
  }, []);

  const resetOrderHistory = useCallback(() => {
    setOrderHistory(INITIAL_ORDER_HISTORY);
    saveOrderHistoryToStorage(INITIAL_ORDER_HISTORY);
  }, []);

  const toggleLang = useCallback(() => setLang((prev) => (prev === "en" ? "ta" : "en")), []);

  const t = useCallback(
    (key) => {
      const keys = key.split(".");
      let val = TRANSLATIONS[lang];
      for (const k of keys) {
        val = val?.[k];
      }
      return val || key;
    },
    [lang]
  );

  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = useCallback((msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 4500);
  }, []);

  const addFeedback = useCallback(
    (fbData) => {
      const newFb = {
        id: "fb-" + Date.now(),
        author: fbData.author || user?.name || "Student",
        roll: user?.roll || "Student",
        rating: fbData.rating || 5,
        category: fbData.category || "food_quality",
        item: fbData.item || null,
        tags: fbData.tags || [],
        comment: fbData.comment || "",
        date: lang === "ta" ? "இப்போது" : "Just now",
        helpful: 0,
        managerReply: null,
      };
      setFeedbacks((prev) => [newFb, ...prev]);
      showAlert(
        lang === "ta"
          ? "🌟 உங்கள் கருத்துக்கு நன்றி! சமர்ப்பிக்கப்பட்டது."
          : "🌟 Thank you for your feedback! Review submitted."
      );
    },
    [user, lang, showAlert]
  );

  const addManagerReply = useCallback(
    (feedbackId, replyText) => {
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === feedbackId ? { ...f, managerReply: replyText } : f))
      );
      showAlert(
        lang === "ta"
          ? "✅ மேலாளர் பதில் வெளியிடப்பட்டது!"
          : "✅ Official manager response published!"
      );
    },
    [lang, showAlert]
  );

  const upvoteFeedback = useCallback((id) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, helpful: f.helpful + 1 } : f))
    );
  }, []);

  const lowStockItems = useMemo(
    () => menu.filter((m) => m.stock > 0 && m.stock <= 5),
    [menu]
  );

  useEffect(() => {
    lowStockItems.forEach((item) => {
      setNotifications((prev) => {
        const notifText = `⚠️ Low Stock Alert: Only ${item.stock} left for ${item.name}!`;
        if (prev.some((n) => n.text.includes(item.name) && n.text.includes("Low Stock"))) return prev;
        return [
          { id: Date.now() + Math.random(), text: notifText, read: false },
          ...prev,
        ];
      });
    });
  }, [lowStockItems]);

  const addToCart = useCallback(
    (id, qty = 1) => {
      const item = menu.find((m) => m.id === id);
      if (!item) return;

      const currentQty = cart[id] || 0;
      const availableStock = Math.max(0, (item.stock ?? 0) - currentQty);
      if (availableStock <= 0) return;

      const nextQty = Math.min(qty, availableStock);
      dispatchCart({ type: "add", id, qty: nextQty });

      const remainingAfterAdd = availableStock - nextQty;
      if (remainingAfterAdd <= 5 && remainingAfterAdd > 0) {
        showAlert(
          lang === "ta"
            ? `⚠️ குறைந்த இருப்பு எச்சரிக்கை: ${item.name_ta || item.name} ${remainingAfterAdd} மட்டுமே மீதி உள்ளது!`
            : `⚠️ Low Stock Alert: Only ${remainingAfterAdd} left for ${item.name}!`
        );
      }
    },
    [cart, menu, lang, showAlert]
  );

  const setQty = useCallback(
    (id, qty) => {
      const item = menu.find((m) => m.id === id);
      if (!item) return;

      const maxQty = item.stock ?? 0;
      const nextQty = Math.max(0, Math.min(qty, maxQty));
      dispatchCart({ type: "setQty", id, qty: nextQty });
    },
    [menu]
  );

  const clearCart = useCallback(() => dispatchCart({ type: "clear" }), []);

  const updateStock = useCallback(
    (id, nextStock) => {
      setMenu((prev) => {
        const updated = prev.map((item) => {
          if (item.id !== id) return item;
          const safeStock = Math.max(0, Number(nextStock) || 0);
          if (safeStock <= 5 && safeStock > 0) {
            showAlert(
              lang === "ta"
                ? `⚠️ குறைந்த இருப்பு எச்சரிக்கை: ${item.name_ta || item.name} ${safeStock} மட்டுமே மீதி உள்ளது!`
                : `⚠️ Low Stock Alert: Only ${safeStock} left for ${item.name}!`
            );
          }
          return { ...item, stock: safeStock, available: safeStock > 0 };
        });
        saveMenuToStorage(updated);
        return updated;
      });

      fetch(`http://localhost:5000/api/menu/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: nextStock }),
      }).catch(() => {});
    },
    [lang, showAlert]
  );

  const addProduct = useCallback(
    (product) => {
      const itemToAdd = {
        ...product,
        stock: Math.max(0, Number(product.stock) || 0),
        available: (Number(product.stock) || 0) > 0,
      };
      setMenu((prev) => {
        const updated = [...prev, itemToAdd];
        saveMenuToStorage(updated);
        return updated;
      });

      showAlert(
        lang === "ta"
          ? `✅ "${itemToAdd.name_ta || itemToAdd.name}" சேர்க்கப்பட்டு நிரந்தரமாக சேமிக்கப்பட்டது!`
          : `✅ "${itemToAdd.name}" added and saved permanently to Menu & Orders!`
      );

      // Async sync to backend MySQL API if running
      fetch("http://localhost:5000/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToAdd),
      }).catch(() => {
        // Backend offline is normal during client-side dev
      });
    },
    [lang, showAlert]
  );

  const removeProduct = useCallback((id) => {
    setMenu((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveMenuToStorage(updated);
      return updated;
    });
    dispatchCart({ type: "setQty", id, qty: 0 });

    fetch(`http://localhost:5000/api/menu/${id}`, {
      method: "DELETE",
    }).catch(() => {});
  }, []);

  const updateProduct = useCallback(
    (updatedProduct) => {
      setMenu((prev) => {
        const updated = prev.map((item) =>
          item.id === updatedProduct.id ? { ...item, ...updatedProduct } : item
        );
        saveMenuToStorage(updated);
        return updated;
      });

      showAlert(
        lang === "ta"
          ? `✅ "${updatedProduct.name_ta || updatedProduct.name}" புதுப்பிக்கப்பட்டது!`
          : `✅ "${updatedProduct.name}" updated successfully!`
      );

      fetch(`http://localhost:5000/api/menu/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      }).catch(() => {});
    },
    [lang, showAlert]
  );

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ ...menu.find((m) => m.id === id), qty }))
        .filter((l) => l.id),
    [cart, menu]
  );

  const cartCount = useMemo(() => cartLines.reduce((s, l) => s + l.qty, 0), [cartLines]);
  const cartTotal = useMemo(() => cartLines.reduce((s, l) => s + l.qty * l.price, 0), [cartLines]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const fetchCanteens = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/canteens");
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setCanteens(data);
          return data;
        }
      }
    } catch (e) {
      console.warn("fetchCanteens error:", e);
    }
    return null;
  }, []);

  const updateCrowdLevel = useCallback((id, level) => {
    setCanteens((prev) =>
      prev.map((c) =>
        c.id !== id ? c : { ...c, level, wait: WAIT_BY_LEVEL[level], lastUpdated: new Date() }
      )
    );
  }, []);

  const updateCanteenStatus = useCallback(
    async (id, newStatus) => {
      // Optimistic state update
      setCanteens((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus, lastUpdated: new Date() } : c
        )
      );

      try {
        const token = user?.token;
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        if (user) {
          headers["x-user-id"] = user.id || "STAFF-01";
          headers["x-user-name"] = user.name || "Canteen Manager";
          headers["x-user-email"] = user.email || "admin@canteen.edu";
          headers["x-user-role"] = user.role || "admin";
        }

        const res = await fetch(`http://localhost:5000/api/canteens/${id}/status`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: newStatus }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || data.error || "Failed to update canteen status");
        }

        if (data.canteen) {
          setCanteens((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...data.canteen } : c))
          );
        }
        return data;
      } catch (err) {
        console.error("updateCanteenStatus error:", err);
        fetchCanteens();
        throw err;
      }
    },
    [user, fetchCanteens]
  );

  const placeOrder = useCallback(
    (paymentMode, total, canteenId, canteenName, canteenLoc) => {
      // Verify canteen status before placing order
      const targetCanteen = canteens.find((c) => c.id === canteenId);
      if (targetCanteen && targetCanteen.status === "inactive") {
        const inactiveMsg = lang === "ta"
          ? "இந்த உணவகம் தற்போது செயல்படவில்லை. தயவுசெய்து மற்றொரு உணவகத்தை தேர்வு செய்யவும்."
          : "This canteen is currently inactive. Please choose another canteen.";
        if (showAlert) showAlert(inactiveMsg);
        return false;
      }

      const token = "A-" + (10 + Math.floor(Math.random() * 89));
      const newOrder = {
        id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
        items: cartLines,
        total,
        paymentMode,
        token,
        issuedTime: new Date().toISOString(),
        completedTime: null,
        status: 0, // 0 placed, 1 preparing, 2 ready, 3 picked up
        counter: 2,
        canteenId: canteenId || null,
        canteenName: canteenName || null,
        canteenLoc: canteenLoc || null,
      };

      setOrder(newOrder);
      saveActiveOrderToStorage(newOrder);

      setOrderHistory((prev) => {
        const updated = [newOrder, ...prev];
        saveOrderHistoryToStorage(updated);
        return updated;
      });

      setMenu((prev) => {
        const updated = prev.map((item) => {
          const match = cartLines.find((line) => line.id === item.id);
          if (!match) return item;

          const updatedStock = Math.max(0, (item.stock ?? 0) - match.qty);
          if (updatedStock <= 5 && updatedStock > 0) {
            showAlert(
              lang === "ta"
                ? `⚠️ குறைந்த இருப்பு எச்சரிக்கை: ${item.name_ta || item.name} ${updatedStock} மட்டுமே மீதி உள்ளது!`
                : `⚠️ Low Stock Alert: Only ${updatedStock} left for ${item.name}!`
            );
          }
          return { ...item, stock: updatedStock, available: updatedStock > 0 };
        });
        saveMenuToStorage(updated);
        return updated;
      });

      clearCart();
    },
    [cartLines, clearCart, lang, showAlert]
  );

  const deductStockForOrder = useCallback((orderToDeduct) => {
    if (!orderToDeduct || !orderToDeduct.items || orderToDeduct.items.length === 0) return;

    setRawStocks((currStocks) => {
      let updatedStocks = [...currStocks];
      const newTxs = [];

      orderToDeduct.items.forEach((item) => {
        const mappings = (recipeIngredients || []).filter((r) => r.menuItemId === item.id);
        mappings.forEach((m) => {
          const stock = updatedStocks.find((s) => String(s.id) === String(m.stockId));
          if (stock) {
            const rawNeeded = item.qty * m.quantity;
            let convertedNeeded = rawNeeded;
            const fromU = (m.unit || "").toLowerCase();
            const toU = (stock.unit || "").toLowerCase();
            if (fromU === "gram" && toU === "kg") convertedNeeded = rawNeeded / 1000;
            else if (fromU === "kg" && toU === "gram") convertedNeeded = rawNeeded * 1000;
            else if (fromU === "ml" && toU === "litre") convertedNeeded = rawNeeded / 1000;
            else if (fromU === "litre" && toU === "ml") convertedNeeded = rawNeeded * 1000;

            const needed = Math.round(convertedNeeded * 1000) / 1000;
            const prevQty = stock.quantity;
            const newQty = Math.max(0, Math.round((prevQty - needed) * 1000) / 1000);

            updatedStocks = updatedStocks.map((s) => (s.id === stock.id ? { ...s, quantity: newQty } : s));

            newTxs.push({
              id: Date.now() + Math.random(),
              stockId: stock.id,
              stockName: stock.stockName,
              type: "FOOD_PREPARATION",
              quantity: -needed,
              unit: stock.unit,
              previousStock: prevQty,
              newStock: newQty,
              reason: `Food preparation: ${item.qty}× ${item.name} for order ${orderToDeduct.id}`,
              performedBy: user?.name || "Canteen Admin",
              orderId: orderToDeduct.id,
              date: new Date().toISOString(),
            });

            if (newQty <= stock.minimumStockLevel) {
              setNotifications((prevNotifs) => [
                {
                  id: Date.now() + Math.random(),
                  text: newQty === 0
                    ? `🚨 Out of Stock Alert: ${stock.stockName} is out of stock!`
                    : `⚠️ Low Stock Alert: Only ${newQty} ${stock.unit} remaining for ${stock.stockName}!`,
                  read: false,
                },
                ...prevNotifs,
              ]);
            }
          }
        });
      });

      if (newTxs.length > 0) {
        saveRawStocksToStorage(updatedStocks);
        setStockTransactions((prevTxs) => {
          const merged = [...newTxs, ...prevTxs];
          saveStockTransactionsToStorage(merged);
          return merged;
        });
      }

      return updatedStocks;
    });
  }, [recipeIngredients, user]);

  const advanceOrderStatus = useCallback(() => {
    setOrder((prev) => {
      if (!prev) return prev;
      const nextStatus = Math.min(3, prev.status + 1);
      const isFirstPrep = nextStatus >= 1 && !prev.ingredientsDeducted;

      if (isFirstPrep) {
        deductStockForOrder(prev);
      }

      const updated = {
        ...prev,
        status: nextStatus,
        ingredientsDeducted: true,
        completedTime: nextStatus === 3 ? new Date().toISOString() : prev.completedTime,
      };
      saveActiveOrderToStorage(updated);
      setOrderHistory((history) => {
        const updatedHistory = history.map((o) => (o.id === prev.id ? updated : o));
        saveOrderHistoryToStorage(updatedHistory);
        return updatedHistory;
      });
      return updated;
    });
  }, [deductStockForOrder]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrderHistory((prevList) => {
      const target = prevList.find((o) => o.id === orderId);
      if (target && newStatus >= 1 && !target.ingredientsDeducted) {
        deductStockForOrder(target);
      }
      const updatedList = prevList.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              ingredientsDeducted: true,
              completedTime: newStatus === 3 ? new Date().toISOString() : o.completedTime,
            }
          : o
      );
      saveOrderHistoryToStorage(updatedList);
      return updatedList;
    });
  }, [deductStockForOrder]);

  const addRawStock = useCallback((stockData) => {
    const nextId = (rawStocks.length > 0 ? Math.max(...rawStocks.map((s) => Number(s.id) || 0)) : 0) + 1;
    const newStock = {
      ...stockData,
      id: nextId,
      stockId: stockData.stockId || `STK-${1000 + nextId}`,
      quantity: Number(stockData.quantity) || 0,
      minimumStockLevel: Number(stockData.minimumStockLevel) || 0,
      purchasePrice: Number(stockData.purchasePrice) || 0,
      createdAt: new Date().toISOString(),
    };

    setRawStocks((prev) => {
      const updated = [newStock, ...prev];
      saveRawStocksToStorage(updated);
      return updated;
    });

    if (newStock.quantity > 0) {
      const initTx = {
        id: Date.now() + Math.random(),
        stockId: newStock.id,
        stockName: newStock.stockName,
        type: "PURCHASE",
        quantity: newStock.quantity,
        unit: newStock.unit,
        previousStock: 0,
        newStock: newStock.quantity,
        reason: "Initial stock registration",
        supplierName: newStock.supplierName || "Initial Inventory",
        purchasePrice: newStock.purchasePrice,
        performedBy: user?.name || "Canteen Admin",
        date: new Date().toISOString(),
      };
      setStockTransactions((prev) => {
        const updated = [initTx, ...prev];
        saveStockTransactionsToStorage(updated);
        return updated;
      });
    }

    fetch("http://localhost:5000/api/admin/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStock),
    }).catch(() => {});
  }, [rawStocks, user]);

  const updateRawStock = useCallback((id, stockData) => {
    setRawStocks((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...stockData } : item));
      saveRawStocksToStorage(updated);
      return updated;
    });

    fetch(`http://localhost:5000/api/admin/stock/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stockData),
    }).catch(() => {});
  }, []);

  const deleteRawStock = useCallback((id) => {
    setRawStocks((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveRawStocksToStorage(updated);
      return updated;
    });
    setRecipeIngredients((prev) => {
      const updated = prev.filter((r) => r.stockId !== id);
      saveRecipeIngredientsToStorage(updated);
      return updated;
    });

    fetch(`http://localhost:5000/api/admin/stock/${id}`, {
      method: "DELETE",
    }).catch(() => {});
  }, []);

  const purchaseRawStock = useCallback((id, purchaseData) => {
    const qty = Number(purchaseData.quantity) || 0;
    let targetItem = null;

    setRawStocks((prev) => {
      const updated = prev.map((item) => {
        if (item.id !== id) return item;
        targetItem = item;
        const newQty = Math.round((item.quantity + qty) * 1000) / 1000;
        return {
          ...item,
          quantity: newQty,
          supplierName: purchaseData.supplierName || item.supplierName,
          purchasePrice: purchaseData.purchasePrice !== undefined ? Number(purchaseData.purchasePrice) : item.purchasePrice,
          purchaseDate: purchaseData.purchaseDate || item.purchaseDate,
          expiryDate: purchaseData.expiryDate || item.expiryDate,
        };
      });
      saveRawStocksToStorage(updated);
      return updated;
    });

    if (targetItem) {
      const tx = {
        id: Date.now() + Math.random(),
        stockId: targetItem.id,
        stockName: targetItem.stockName,
        type: "PURCHASE",
        quantity: qty,
        unit: targetItem.unit,
        previousStock: targetItem.quantity,
        newStock: Math.round((targetItem.quantity + qty) * 1000) / 1000,
        reason: purchaseData.reason || `Purchased ${qty} ${targetItem.unit} from ${purchaseData.supplierName || targetItem.supplierName}`,
        supplierName: purchaseData.supplierName || targetItem.supplierName,
        purchasePrice: purchaseData.purchasePrice !== undefined ? Number(purchaseData.purchasePrice) : targetItem.purchasePrice,
        performedBy: user?.name || "Canteen Admin",
        date: new Date().toISOString(),
      };
      setStockTransactions((prev) => {
        const updated = [tx, ...prev];
        saveStockTransactionsToStorage(updated);
        return updated;
      });
    }

    fetch(`http://localhost:5000/api/admin/stock/${id}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(purchaseData),
    }).catch(() => {});
  }, [user]);

  const reduceRawStock = useCallback((id, reduceData) => {
    const qty = Number(reduceData.quantity) || 0;
    let targetItem = rawStocks.find((s) => s.id === id);
    if (!targetItem) return { error: "Stock item not found." };
    if (qty > targetItem.quantity) {
      return {
        error: `Insufficient stock. Only ${targetItem.quantity} ${targetItem.unit} of ${targetItem.stockName} is available.`,
      };
    }

    const prevQty = targetItem.quantity;
    const newQty = Math.max(0, Math.round((prevQty - qty) * 1000) / 1000);

    setRawStocks((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item));
      saveRawStocksToStorage(updated);
      return updated;
    });

    let txType = "USED";
    const r = (reduceData.reason || "").toLowerCase();
    if (r.includes("wastage") || r.includes("spoil")) txType = "WASTAGE";
    else if (r.includes("damage")) txType = "DAMAGED";
    else if (r.includes("expir")) txType = "EXPIRED";
    else if (r.includes("prep") || r.includes("cook")) txType = "FOOD_PREPARATION";
    else if (r.includes("adjust")) txType = "ADJUSTMENT";

    const tx = {
      id: Date.now() + Math.random(),
      stockId: targetItem.id,
      stockName: targetItem.stockName,
      type: txType,
      quantity: -qty,
      unit: targetItem.unit,
      previousStock: prevQty,
      newStock: newQty,
      reason: [reduceData.reason, reduceData.notes].filter(Boolean).join(" — ") || "Manual reduction",
      supplierName: targetItem.supplierName,
      purchasePrice: targetItem.purchasePrice,
      performedBy: user?.name || "Canteen Admin",
      date: new Date().toISOString(),
    };

    setStockTransactions((prev) => {
      const updated = [tx, ...prev];
      saveStockTransactionsToStorage(updated);
      return updated;
    });

    if (newQty <= targetItem.minimumStockLevel) {
      setNotifications((prev) => [
        {
          id: Date.now() + Math.random(),
          text: newQty === 0
            ? `🚨 Out of Stock Alert: ${targetItem.stockName} is completely out of stock!`
            : `⚠️ Low Stock Alert: Only ${newQty} ${targetItem.unit} remaining for ${targetItem.stockName}!`,
          read: false,
        },
        ...prev,
      ]);
    }

    fetch(`http://localhost:5000/api/admin/stock/${id}/reduce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reduceData),
    }).catch(() => {});

    return { success: true };
  }, [rawStocks, user]);

  const saveRecipeMapping = useCallback((mappingData) => {
    const nextId = (recipeIngredients.length > 0 ? Math.max(...recipeIngredients.map((r) => Number(r.id) || 0)) : 0) + 1;
    const newMapping = {
      ...mappingData,
      id: nextId,
      quantity: Number(mappingData.quantity) || 0,
    };

    setRecipeIngredients((prev) => {
      const existingIdx = prev.findIndex(
        (r) => r.menuItemId === newMapping.menuItemId && String(r.stockId) === String(newMapping.stockId)
      );
      let updated;
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newMapping };
      } else {
        updated = [...prev, newMapping];
      }
      saveRecipeIngredientsToStorage(updated);
      return updated;
    });

    fetch("http://localhost:5000/api/admin/menu-ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mappingData),
    }).catch(() => {});
  }, [recipeIngredients]);

  const deleteRecipeMapping = useCallback((id) => {
    setRecipeIngredients((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveRecipeIngredientsToStorage(updated);
      return updated;
    });

    fetch(`http://localhost:5000/api/admin/menu-ingredients/${id}`, {
      method: "DELETE",
    }).catch(() => {});
  }, []);

  const cancelOrder = useCallback(() => {
    setOrder((prev) => {
      if (!prev) return null;
      saveActiveOrderToStorage(null);
      setOrderHistory((history) => {
        const updatedHistory = history.map((o) => (o.id === prev.id ? { ...o, status: -1 } : o));
        saveOrderHistoryToStorage(updatedHistory);
        return updatedHistory;
      });
      return null;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      walletBalance,
      cart,
      cartLines,
      cartCount,
      cartTotal,
      addToCart,
      setQty,
      clearCart,
      updateStock,
      addProduct,
      updateProduct,
      removeProduct,
      notifications,
      unreadCount,
      markAllRead,
      order,
      orderHistory,
      setOrderHistory,
      placeOrder,
      advanceOrderStatus,
      cancelOrder,
      canteens,
      updateCrowdLevel,
      menu,
      resetMenuToDefaults,
      resetOrderHistory,
      lang,
      toggleLang,
      setLang,
      t,
      lowStockItems,
      alertMessage,
      showAlert,
      feedbacks,
      addFeedback,
      addManagerReply,
      upvoteFeedback,
      registeredUsers,
      registerUser,
      resetRegisteredUsers,
      updateUserPassword,
      rawStocks,
      stockTransactions,
      recipeIngredients,
      addRawStock,
      updateRawStock,
      deleteRawStock,
      purchaseRawStock,
      reduceRawStock,
      saveRecipeMapping,
      deleteRecipeMapping,
      updateOrderStatus,
      selectedCanteen,
      setSelectedCanteen,
      fetchCanteens,
      updateCanteenStatus,
    }),
    [
      user,
      setUser,
      logout,
      walletBalance,
      cart,
      cartLines,
      cartCount,
      cartTotal,
      addToCart,
      setQty,
      clearCart,
      updateStock,
      addProduct,
      updateProduct,
      removeProduct,
      notifications,
      unreadCount,
      markAllRead,
      order,
      orderHistory,
      placeOrder,
      advanceOrderStatus,
      cancelOrder,
      canteens,
      updateCrowdLevel,
      menu,
      resetMenuToDefaults,
      resetOrderHistory,
      lang,
      toggleLang,
      setLang,
      t,
      lowStockItems,
      alertMessage,
      showAlert,
      feedbacks,
      addFeedback,
      addManagerReply,
      upvoteFeedback,
      registeredUsers,
      registerUser,
      resetRegisteredUsers,
      updateUserPassword,
      rawStocks,
      stockTransactions,
      recipeIngredients,
      addRawStock,
      updateRawStock,
      deleteRawStock,
      purchaseRawStock,
      reduceRawStock,
      saveRecipeMapping,
      deleteRecipeMapping,
      updateOrderStatus,
      selectedCanteen,
      setSelectedCanteen,
      fetchCanteens,
      updateCanteenStatus,
    ]
  );

  return <CanteenContext.Provider value={value}>{children}</CanteenContext.Provider>;
}

export function useCanteen() {
  const ctx = useContext(CanteenContext);
  if (!ctx) throw new Error("useCanteen must be used inside <CanteenProvider>");
  return ctx;
}

/* ================================================================== */
/* Shared bits: phone frame, status bar, bottom nav                     */
/* ================================================================== */
function AppFrame({ children }) {
  return <div className="app-shell">{children}</div>;
}

function TopNav({ page, onNavigate, theme, toggleTheme, onOpenChat }) {
  return (
    <RefactoredTopNav
      page={page}
      onNavigate={onNavigate}
      theme={theme}
      toggleTheme={toggleTheme}
      onOpenChat={onOpenChat}
      useCanteenHook={useCanteen}
    />
  );
}

/* ================================================================== */
/* ================================================================== */
function LoginPage({ onLogin, onNavigate }) {
  const { lang, toggleLang, t, setUser, showAlert, registeredUsers, registerUser, resetRegisteredUsers } = useCanteen();
  const [mode, setMode] = useState(() =>
    typeof window !== "undefined" && (window.location.hash.includes("register") || window.location.search.includes("mode=register"))
      ? "register"
      : "login"
  ); // "login" | "register"
  const [showPassword, setShowPassword] = useState(false);

  // 3D Card Interactive Tilt Hook
  const tiltCard = use3DTilt(8, 1.02);

  // Login states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  // Register states
  const [regRole, setRegRole] = useState("customer"); // "customer" | "admin"
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regIdentifier, setRegIdentifier] = useState("");
  const [dept, setDept] = useState("CSE");
  const [year, setYear] = useState("3");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [popupError, setPopupError] = useState("");
  const identifierRef = useRef(null);
  const popupTimerRef = useRef(null);

  // Auto-fill identifier with the most recently registered/saved email
  useEffect(() => {
    try {
      const lastEmail = localStorage.getItem("canteen_last_registered_email");
      if (lastEmail && !identifier) {
        setIdentifier(lastEmail);
      }
    } catch (e) {}
  }, []);

  // Show a popup for any error, auto-dismiss after 4 s
  const showPopup = useCallback((msg) => {
    setPopupError(msg);
    clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => setPopupError(""), 4000);
  }, []);

  useEffect(() => {
    identifierRef.current?.focus();
  }, [mode]);

  // Whenever the plain `error` state is set, route it to the popup instead
  useEffect(() => {
    if (error) {
      showPopup(error);
      setError("");
    }
  }, [error, showPopup]);

  // Strict login — ONLY registered users can log in. No auto-creation.
  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanId = identifier.trim().toLowerCase();

    if (!cleanId) {
      setError(lang === "ta" ? "மின்னஞ்சல் அல்லது பதிவெண் உள்ளிடவும்" : "Please enter your Email or Roll No.");
      return;
    }
    if (!password) {
      setError(lang === "ta" ? "கடவுச்சொல் உள்ளிடவும்" : "Please enter your password.");
      return;
    }

    // 1. Look up ONLY in the registered users list (by email, id, or roll)
    const matched = (registeredUsers || []).find(
      (u) =>
        (u.email && u.email.toLowerCase() === cleanId) ||
        (u.id && u.id.toLowerCase() === cleanId) ||
        (u.roll && u.roll.toLowerCase() === cleanId)
    );

    // 2. User not found → hard stop, tell them to register
    if (!matched) {
      setError(
        lang === "ta"
          ? "இந்த மின்னஞ்சல் / பதிவு எண் பதிவு செய்யப்படவில்லை. தயவுசெய்து புதிய கணக்கு உருவாக்கவும்."
          : `Email or Roll No "${identifier.trim()}" is not registered. Please create an account first.`
      );
      return;
    }

    // 3. Password check (plain-text comparison for in-memory mock data)
    if (matched.password && password !== matched.password) {
      setError(lang === "ta" ? "தவறான கடவுச்சொல். மீண்டும் முயற்சிக்கவும்." : "Incorrect password. Please try again.");
      return;
    }

    // 4. Success — log in with the registered user's data
    const userObj = { ...matched };
    setUser(userObj);
    setError("");

    try {
      if (userObj.email) {
        localStorage.setItem("canteen_last_registered_email", userObj.email);
      }
    } catch (e) {}

    const isAdmin = userObj.role === "admin";
    showAlert(
      lang === "ta"
        ? `🎉 நல்வரவு ${userObj.name}! ${isAdmin ? "🛡️ நிர்வாகியாக" : "👨‍🎓 மாணவராக"} உள்நுழைந்தீர்கள்.`
        : `🎉 Welcome back, ${userObj.name}! Logged in as ${isAdmin ? "🛡️ Canteen Admin" : "👨‍🎓 Student"}.`
    );
    onLogin(isAdmin ? "admin-dashboard" : "order");
  };

  const handleQuickRoleLogin = (targetRole) => {
    if (targetRole === "admin") {
      const adminUser = {
        id: "STAFF-01",
        name: "Canteen Manager",
        roll: "STAFF-01",
        email: "admin@canteen.edu",
        dept: "Management",
        year: 0,
        role: "admin",
      };
      setUser(adminUser);
      showAlert(lang === "ta" ? "🛡️ உணவக நிர்வாகியாக அடையாளம் காணப்பட்டு உள்நுழைந்துவிட்டீர்கள்!" : "🛡️ Identified & Logged in as Canteen Admin!");
      onLogin("admin-dashboard");
    } else {
      const studentUser = {
        id: "21CSE045",
        name: "Ananya Sharma",
        roll: "21CSE045",
        email: "ananya@college.edu",
        dept: "CSE",
        year: 3,
        role: "customer",
      };
      setUser(studentUser);
      showAlert(lang === "ta" ? "👨‍🎓 மாணவராக அடையாளம் காணப்பட்டு உள்நுழைந்துவிட்டீர்கள்!" : "👨‍🎓 Identified & Logged in as Student Customer!");
      onLogin("order");
    }
  };

  const handleRegisterSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanName = fullName.trim();
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanRoll = regIdentifier.trim();

    if (!cleanName) {
      setError(lang === "ta" ? "உங்கள் முழு பெயரை உள்ளிடவும்" : "Please enter your full name.");
      return;
    }
    if (!cleanEmail) {
      setError(lang === "ta" ? "மின்னஞ்சல் முகவரியை உள்ளிடவும்" : "Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError(
        lang === "ta"
          ? "சரியான மின்னஞ்சல் முகவரி உள்ளிடவும் (எ.கா: name@college.edu)"
          : "Please enter a valid email address (e.g. name@college.edu or name@gmail.com)."
      );
      return;
    }

    // Duplicate email check
    const emailExists = (registeredUsers || []).some(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (emailExists) {
      setError(
        lang === "ta"
          ? `மின்னஞ்சல் "${cleanEmail}" ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. தயவுசெய்து உள்நுழையவும்.`
          : `Email "${cleanEmail}" is already registered. Please log in instead.`
      );
      return;
    }

    if (!regPassword) {
      setError(lang === "ta" ? "கடவுச்சொல் உள்ளிடவும்" : "Please enter your password.");
      return;
    }
    if (regPassword.length < 3) {
      setError(lang === "ta" ? "கடவுச்சொல் குறைந்தது 3 எழுத்துக்கள் இருக்க வேண்டும்" : "Password must be at least 3 characters.");
      return;
    }
    if (regPassword !== confirmPassword) {
      setError(t("passwords_dont_match") || "Passwords do not match!");
      return;
    }

    const finalId = cleanRoll || cleanEmail.split("@")[0].toUpperCase();

    const newUser = {
      id: finalId,
      name: cleanName,
      roll: finalId,
      email: cleanEmail,
      dept: regRole === "admin" ? (dept === "CSE" ? "Management" : dept) : dept,
      year: regRole === "admin" ? 0 : (Number(year) || 1),
      role: regRole,
      password: regPassword,
      registeredAt: new Date().toISOString(),
    };

    // Store the registered email and user permanently in localStorage & trigger DB sync
    if (registerUser) registerUser(newUser);
    setUser(newUser);
    setError("");

    // Also pre-fill the login input
    setIdentifier(cleanEmail);

    const isAdmin = regRole === "admin";
    showAlert(
      lang === "ta"
        ? `🎉 பதிவு செய்யப்பட்டது! மின்னஞ்சல் "${cleanEmail}" நிரந்தரமாக சேமிக்கப்பட்டது.`
        : `🎉 Registered & Stored! Email "${cleanEmail}" is saved permanently in database.`
    );
    onLogin(isAdmin ? "admin-dashboard" : "home");
  };

  const handleGoogleSuccess = ({ token, user: authedUser, message }) => {
    const userWithToken = { ...authedUser, token };
    setUser(userWithToken);

    try {
      sessionStorage.setItem("canteen_session_user", JSON.stringify(userWithToken));
      if (token) sessionStorage.setItem("canteen_token", token);
      if (userWithToken.email) {
        localStorage.setItem("canteen_last_registered_email", userWithToken.email);
      }
    } catch (e) {}

    if (registerUser) {
      registerUser(userWithToken);
    }

    const isAdmin = userWithToken.role === "admin";
    showAlert(
      lang === "ta"
        ? `🎉 நல்வரவு ${userWithToken.name}! ${isAdmin ? "🛡️ நிர்வாகியாக" : "👨‍🎓 மாணவராக"} கூகிள் மூலம் உள்நுழைந்தீர்கள்.`
        : `🎉 Welcome, ${userWithToken.name}! Signed in with Google as ${isAdmin ? "🛡️ Canteen Admin" : "👨‍🎓 Student"}.`
    );
    onLogin(isAdmin ? "admin-dashboard" : "order");
  };

  const handleGoogleError = (errMsg) => {
    showPopup(
      errMsg ||
        (lang === "ta"
          ? "கூகிள் உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்."
          : "Google sign-in failed. Please try again.")
    );
  };

  return (
    <div className="ref-login-canvas">
      {/* Background Video Player */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="ref-login-bg-video"
      >
        <source src="/login-bg.mp4" type="video/mp4" />
        <source src="/270557_medium.mp4" type="video/mp4" />
      </video>
      <div className="ref-login-video-overlay" />

      {/* ── Error Popup Toast ─────────────────────────────────────── */}
      {popupError && (
        <div className="login-popup-error" role="alert">
          <span className="login-popup-icon">⚠️</span>
          <span className="login-popup-msg">{popupError}</span>
          <button
            className="login-popup-close"
            type="button"
            aria-label="Dismiss"
            onClick={() => { clearTimeout(popupTimerRef.current); setPopupError(""); }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 3D Interactive Floating Food Props */}
      <Floating3DFood icon="🍕" top="15%" left="7%" delay={0} duration={6} size={30} />
      <Floating3DFood icon="🍔" top="68%" left="6%" delay={1.5} duration={6.5} size={28} />
      <Floating3DFood icon="🥤" top="18%" right="7%" delay={0.8} duration={5.8} size={28} />
      <Floating3DFood icon="🍩" top="70%" right="6%" delay={2.2} duration={6.2} size={28} />
      <Floating3DFood icon="🍜" top="84%" left="46%" delay={1.8} duration={5.5} size={30} />

      {/* Top bar with Brand Badge & Controls */}
      <div className="ref-topbar">
        <div className="ref-brand-badge">
          <div className="ref-badge-seal">
            <span className="ref-badge-icon">🍕</span>
            <div className="ref-badge-ring">
              <span className="ref-badge-text-top">CANTEEN</span>
              <span className="ref-badge-text-bot">CAMPUS FOOD</span>
            </div>
          </div>
        </div>

        <div className="ref-top-controls">
          <button className="lang-toggle ref-lang-btn" type="button" onClick={toggleLang}>
            🌐 {lang === "en" ? "தமிழ்" : "English"}
          </button>
          <span className="role-pill customer" style={{ background: "#fff7ed", color: "#ea580c", borderColor: "#fed7aa" }}>
            ✨ SMART LOGIN
          </span>
        </div>
      </div>

      {/* Main Center Content & Card */}
      <div className="ref-center-container">
        <div className="ref-header-group">
          <h1 className="ref-page-title">{mode === "login" ? "Login" : "Register"}</h1>
          <p className="ref-page-subtitle">
            {lang === "ta" ? (
              <>சுவையான உணவு, <span className="ref-highlight">25+ உடனடி வகைகள்</span> மற்றும் நேரலை டோக்கன்கள்!</>
            ) : (
              <>More than <span className="ref-highlight">25,000+ campus orders</span> served fresh daily!</>
            )}
          </p>
        </div>

        {mode === "login" ? (
          <form
            className="ref-card"
            ref={tiltCard.ref}
            style={tiltCard.style}
            onMouseMove={tiltCard.onMouseMove}
            onMouseLeave={tiltCard.onMouseLeave}
            onSubmit={handleLoginSubmit}
          >
            {/* Unified Email / Roll / Staff ID input pill */}
            <div className="ref-input-pill-wrap">
              <span className="ref-input-icon">
                <Mail size={17} />
              </span>
              <input
                ref={identifierRef}
                type="text"
                className="ref-pill-input"
                value={identifier}
                placeholder="Enter Email / Roll No / Staff ID"
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            {/* Password input pill with show/hide eye */}
            <div className="ref-input-pill-wrap" style={{ marginTop: 14 }}>
              <span className="ref-input-icon">
                <Lock size={17} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="ref-pill-input"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="ref-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* error is now shown as popup — see popupError below */}

            {/* Remember Me & Forgot Password */}
            <div className="ref-meta-row">
              <label className="ref-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>{t("remember_me")}</span>
              </label>
              <button
                type="button"
                className="ref-forgot-link"
                onClick={() => onNavigate && onNavigate("forgot-password")}
              >
                {t("forgot_password")}
              </button>
            </div>

            {/* Vibrant Solid Orange Action Button */}
            <button
              className="ref-cta-btn"
              type="submit"
            >
              LOGIN
            </button>

            {/* Divider */}
            <div className="ref-divider">
              <span>{lang === "ta" ? "அல்லது இதன் மூலம் தொடரவும்" : "or continue with"}</span>
            </div>

            {/* Official Google Sign-In Button */}
            <GoogleSignInButton
              mode="login"
              lang={lang}
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            {/* Switch to Register */}
            <div className="ref-switch-wrap">
              <button
                type="button"
                className="ref-switch-link"
                onClick={() => { setError(""); setMode("register"); }}
              >
                ✨ {t("new_user_question")}
              </button>
            </div>
          </form>
        ) : (
          <form
            className="ref-card"
            ref={tiltCard.ref}
            style={tiltCard.style}
            onMouseMove={tiltCard.onMouseMove}
            onMouseLeave={tiltCard.onMouseLeave}
            onSubmit={handleRegisterSubmit}
          >
            {/* Account Type selection during Registration */}
            <div className="ref-role-tabs">
              <button
                type="button"
                className={"ref-role-btn" + (regRole === "customer" ? " active" : "")}
                onClick={() => { setRegRole("customer"); setError(""); }}
              >
                👨‍🎓 {lang === "ta" ? "மாணவர் கணக்கு" : "Student Customer"}
              </button>
              <button
                type="button"
                className={"ref-role-btn" + (regRole === "admin" ? " active" : "")}
                onClick={() => { setRegRole("admin"); setError(""); }}
              >
                🛡️ {lang === "ta" ? "பணியாளர் கணக்கு" : "Canteen Staff / Admin"}
              </button>
            </div>

            <div className="ref-input-pill-wrap">
              <span className="ref-input-icon">
                <User size={17} />
              </span>
              <input
                ref={identifierRef}
                type="text"
                className="ref-pill-input"
                value={fullName}
                placeholder={t("full_name_placeholder")}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Explicit Registered Email Input */}
            <div className="ref-input-pill-wrap" style={{ marginTop: 12 }}>
              <span className="ref-input-icon">
                <Mail size={17} />
              </span>
              <input
                type="email"
                className="ref-pill-input"
                value={regEmail}
                placeholder={regRole === "admin" ? "Staff Email (e.g. staff@canteen.edu)" : "College / Personal Email (e.g. student@college.edu)"}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            {/* Roll Number or Staff ID */}
            <div className="ref-input-pill-wrap" style={{ marginTop: 12 }}>
              <span className="ref-input-icon">
                <Hash size={17} />
              </span>
              <input
                type="text"
                className="ref-pill-input"
                value={regIdentifier}
                placeholder={regRole === "admin" ? "Staff ID (STAFF-02)" : "Roll Number (24CSE101) — Optional"}
                onChange={(e) => setRegIdentifier(e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              <select
                className="ref-pill-select"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option value="CSE">CSE Dept</option>
                <option value="ECE">ECE Dept</option>
                <option value="MECH">MECH Dept</option>
                <option value="IT">IT Dept</option>
                <option value="EEE">EEE Dept</option>
                <option value="CIVIL">CIVIL</option>
                <option value="AIDS">AI & DS</option>
                <option value="Management">Canteen Operations</option>
              </select>

              {regRole === "customer" ? (
                <select
                  className="ref-pill-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              ) : (
                <div className="ref-pill-static">🛡️ Canteen Staff</div>
              )}
            </div>

            <div className="ref-input-pill-wrap" style={{ marginTop: 12 }}>
              <span className="ref-input-icon">
                <Lock size={17} />
              </span>
              <input
                type="password"
                className="ref-pill-input"
                value={regPassword}
                placeholder={t("password_placeholder")}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            <div className="ref-input-pill-wrap" style={{ marginTop: 12 }}>
              <span className="ref-input-icon">
                <Lock size={17} />
              </span>
              <input
                type="password"
                className="ref-pill-input"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* error is now shown as popup — see popupError below */}

            <button
              className="ref-cta-btn"
              type="submit"
              style={{ marginTop: 16 }}
            >
              {t("create_account_btn")}
            </button>

            {/* Divider */}
            <div className="ref-divider">
              <span>{lang === "ta" ? "அல்லது இதன் மூலம் பதிவு செய்யவும்" : "or sign up with"}</span>
            </div>

            {/* Official Google Sign-In Button on Registration */}
            <GoogleSignInButton
              mode="register"
              lang={lang}
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            <div className="ref-switch-wrap">
              <button
                type="button"
                className="ref-switch-link"
                onClick={() => { setError(""); setMode("login"); }}
              >
                👈 {t("already_have_account")}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bottom Footer Bar */}
      <footer className="ref-footer">
        <div className="ref-footer-nav">
          <span className="ref-foot-link">Explore</span>
          <span className="ref-foot-link">Menu</span>
          <span className="ref-foot-link">Help & Feedback</span>
          <span className="ref-foot-link">Contact</span>
        </div>
        <div className="ref-footer-right">
          <div className="ref-social-minis">
            <span style={{ fontWeight: 800, color: '#1877f2' }}>f</span>
            <span style={{ color: '#ea4335' }}>G+</span>
            <span style={{ color: '#0f172a', fontWeight: 800 }}>𝕏</span>
          </div>
          <div className="ref-copyright">
            © 2026 Campus Canteen. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================== */
/* Home page                                                             */
/* ================================================================== */
function EatingIllustration() {
  return (
    <div className="dining-illustration-wrap" style={{ position: "relative", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
      <svg
        viewBox="0 0 400 170"
        width="100%"
        style={{ display: "block", background: "linear-gradient(180deg, #2A2F3D 0%, #171A23 100%)" }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A2F3D" />
            <stop offset="60%" stopColor="#1E222D" />
            <stop offset="100%" stopColor="#151821" />
          </linearGradient>
          <linearGradient id="woodTable" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="35%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="tableBevel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
          <linearGradient id="lampGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.45)" />
            <stop offset="50%" stopColor="rgba(251, 191, 36, 0.15)" />
            <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
          </linearGradient>
          <linearGradient id="charGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="charAmber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="charCoral" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
          <linearGradient id="plateShine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="teaCupGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Cafe Wall Background */}
        <rect x="0" y="0" width="400" height="170" fill="url(#wallGrad)" />

        {/* Background Posters / Neon Sign */}
        <rect x="35" y="18" width="44" height="30" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <path d="M44 33 Q57 23 70 33" stroke="rgba(251,191,36,0.6)" strokeWidth="1.5" fill="none" />
        <circle cx="57" cy="26" r="3" fill="rgba(251,191,36,0.7)" />

        <rect x="320" y="18" width="46" height="32" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <text x="343" y="34" fontSize="8" fontWeight="800" fill="rgba(255,255,255,0.5)" textAnchor="middle" fontFamily="sans-serif">FRESH</text>
        <text x="343" y="44" fontSize="6.5" fontWeight="700" fill="rgba(245,158,11,0.8)" textAnchor="middle" fontFamily="sans-serif">CAFÉ 24/7</text>

        {/* Ambient Light Cones from Pendant Lamps */}
        <polygon points="75,25 25,120 125,120" fill="url(#lampGlow)" />
        <polygon points="200,20 145,120 255,120" fill="url(#lampGlow)" />
        <polygon points="325,25 275,120 375,120" fill="url(#lampGlow)" />

        {/* Hanging Industrial Pendant Lamps */}
        <line x1="75" y1="0" x2="75" y2="20" stroke="#718096" strokeWidth="1.5" />
        <path d="M63 25 Q75 16 87 25 Z" fill="#E2E8F0" />
        <circle cx="75" cy="27" r="4.5" fill="#FDE047" filter="url(#glowFilter)" />

        <line x1="200" y1="0" x2="200" y2="16" stroke="#718096" strokeWidth="1.5" />
        <path d="M188 21 Q200 12 212 21 Z" fill="#E2E8F0" />
        <circle cx="200" cy="23" r="5" fill="#FDE047" filter="url(#glowFilter)" />

        <line x1="325" y1="0" x2="325" y2="20" stroke="#718096" strokeWidth="1.5" />
        <path d="M313 25 Q325 16 337 25 Z" fill="#E2E8F0" />
        <circle cx="325" cy="27" r="4.5" fill="#FDE047" filter="url(#glowFilter)" />

        {/* --- CHARACTER 1 (Left): Student with Headphones & Pizza --- */}
        <g className="char-left">
          {/* Body / Hoodie */}
          <path d="M48 95 C48 76, 102 76, 102 95 L106 122 L44 122 Z" fill="url(#charGreen)" />
          {/* Hoodie Collar & Drawstrings */}
          <path d="M66 84 Q75 92 84 84" stroke="#047857" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M71 88 L71 106" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M79 88 L79 104" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="71" cy="106" r="1.5" fill="#fff" />
          <circle cx="79" cy="104" r="1.5" fill="#fff" />

          {/* Neck */}
          <rect x="70" y="74" width="10" height="12" rx="3" fill="#E6BD9E" />
          
          {/* Ears */}
          <circle cx="57" cy="64" r="3.8" fill="#F3D0B5" />
          <circle cx="93" cy="64" r="3.8" fill="#F3D0B5" />

          {/* Head */}
          <circle cx="75" cy="62" r="18" fill="#F3D0B5" />

          {/* Modern Textured Hair / Fade */}
          <path d="M57 60 C57 44, 93 44, 93 60 C90 50, 60 50, 57 60 Z" fill="#1E293B" />
          <path d="M60 54 Q72 48 82 55" fill="#1E293B" />
          <path d="M70 47 Q75 42 82 46" stroke="#334155" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Sleek Over-Ear Headphones */}
          <path d="M55 60 C55 42, 95 42, 95 60" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="52" y="58" width="6" height="11" rx="3" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
          <rect x="92" y="58" width="6" height="11" rx="3" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
          
          {/* Eyebrows */}
          <path d="M64 56 Q68 54 72 56" stroke="#1E293B" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M78 56 Q82 54 86 56" stroke="#1E293B" strokeWidth="1.4" fill="none" strokeLinecap="round" />

          {/* Eyes with white sparkle reflection */}
          <circle cx="68" cy="62" r="2.2" fill="#0F172A" />
          <circle cx="67.3" cy="61.2" r="0.7" fill="#FFFFFF" />
          <circle cx="82" cy="62" r="2.2" fill="#0F172A" />
          <circle cx="81.3" cy="61.2" r="0.7" fill="#FFFFFF" />

          {/* Cute Nose */}
          <path d="M75 64 Q76.5 66 75 67" stroke="#C58F68" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Soft Blushing Cheeks */}
          <circle cx="63" cy="66" r="3" fill="rgba(244,114,182,0.3)" />
          <circle cx="87" cy="66" r="3" fill="rgba(244,114,182,0.3)" />

          {/* Cheerful Smile with teeth */}
          <path d="M69 68 Q75 75 81 68 Z" fill="#E11D48" />
          <path d="M71 68 Q75 71 79 68" fill="#FFFFFF" />
          <path d="M69 68 Q75 75 81 68" stroke="#0F172A" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Plate & Cheesy Pizza Slice */}
          <ellipse cx="75" cy="120" rx="22" ry="7" fill="url(#plateShine)" />
          <ellipse cx="75" cy="120" rx="18" ry="5" fill="#F8FAFC" />
          <path d="M64 121 L85 116 L80 125 Z" fill="#F59E0B" />
          <path d="M85 116 Q84 122 80 125" stroke="#B45309" strokeWidth="2" fill="none" />
          <circle cx="72" cy="120" r="1.8" fill="#DC2626" />
          <circle cx="78" cy="121" r="1.5" fill="#DC2626" />
          <circle cx="75" cy="123" r="1.2" fill="#10B981" />
        </g>

        {/* --- CHARACTER 2 (Center): Cheerful Student with Glasses, Chai & Hot Biryani --- */}
        <g className="char-center">
          {/* Body / Mustard College Varsity Jacket */}
          <path d="M172 90 C172 70, 228 70, 228 90 L232 122 L168 122 Z" fill="url(#charAmber)" />
          <path d="M192 80 Q200 88 208 80" stroke="#B45309" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M200 84 L200 122" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="185" cy="94" r="3" fill="#FFFFFF" />
          <text x="185" y="96" fontSize="3.5" fontWeight="900" fill="#D97706" textAnchor="middle" fontFamily="sans-serif">CS</text>

          {/* Neck */}
          <rect x="195" y="70" width="10" height="12" rx="3" fill="#B87742" />

          {/* Ears */}
          <circle cx="180" cy="58" r="4" fill="#CF8E57" />
          <circle cx="220" cy="58" r="4" fill="#CF8E57" />

          {/* Head */}
          <circle cx="200" cy="56" r="20" fill="#CF8E57" />

          {/* Volumetric Textured Curly Hair */}
          <path d="M180 50 C176 38, 224 38, 220 50 C216 42, 184 42, 180 50 Z" fill="#2B1B17" />
          <circle cx="183" cy="44" r="6" fill="#2B1B17" />
          <circle cx="193" cy="38" r="7.5" fill="#2B1B17" />
          <circle cx="206" cy="38" r="7.5" fill="#2B1B17" />
          <circle cx="217" cy="44" r="6" fill="#2B1B17" />

          {/* Eyebrows */}
          <path d="M187 47 Q192 45 197 47" stroke="#2B1B17" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M203 47 Q208 45 213 47" stroke="#2B1B17" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Circular Glasses */}
          <circle cx="192" cy="57" r="6.2" fill="rgba(255,255,255,0.18)" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="208" cy="57" r="6.2" fill="rgba(255,255,255,0.18)" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M198 56 Q200 54 202 56" stroke="#1E293B" strokeWidth="1.5" fill="none" />
          <circle cx="192" cy="57" r="2.2" fill="#0F172A" />
          <circle cx="191.3" cy="56.2" r="0.7" fill="#FFFFFF" />
          <circle cx="208" cy="57" r="2.2" fill="#0F172A" />
          <circle cx="207.3" cy="56.2" r="0.7" fill="#FFFFFF" />

          {/* Nose */}
          <path d="M200 60 Q201.5 62 200 63" stroke="#9A5B2D" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="185" cy="62" r="3.2" fill="rgba(244,63,94,0.3)" />
          <circle cx="215" cy="62" r="3.2" fill="rgba(244,63,94,0.3)" />
          {/* Smile */}
          <path d="M193 65 Q200 74 207 65 Z" fill="#E11D48" />
          <path d="M195 65 Q200 68 205 65" fill="#FFFFFF" />
          <path d="M193 65 Q200 74 207 65" stroke="#0F172A" strokeWidth="1.3" fill="none" strokeLinecap="round" />

          {/* Biryani Platter */}
          <ellipse cx="200" cy="120" rx="26" ry="8" fill="url(#plateShine)" />
          <ellipse cx="200" cy="119" rx="22" ry="6" fill="#F8FAFC" />
          <ellipse cx="198" cy="118" rx="15" ry="4" fill="#F59E0B" />
          <circle cx="193" cy="117" r="2" fill="#DC2626" />
          <circle cx="204" cy="118" r="2.2" fill="#B45309" />
          <circle cx="199" cy="116" r="1.5" fill="#16A34A" />
          <ellipse cx="213" cy="119" rx="4" ry="2.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
          <circle cx="186" cy="119" r="2.5" fill="#FFFFFF" />
          <circle cx="186" cy="119" r="1.2" fill="#F59E0B" />

          {/* Chai Mug */}
          <rect x="228" y="112" width="9" height="10" rx="2" fill="url(#teaCupGrad)" />
          <path className="steam-line-1" d="M231 110 Q233 105 231 100" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path className="steam-line-2" d="M234 109 Q236 103 234 98" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
        {/* --- CHARACTER 3 (Right): Student with Bun, Sandwich & Bubble Tea --- */}
        <g className="char-right">
          <path d="M298 95 C298 76, 352 76, 352 95 L356 122 L294 122 Z" fill="url(#charCoral)" />
          <polygon points="325,80 318,90 332,90" fill="#FFFFFF" />
          <rect x="320" y="74" width="10" height="12" rx="3" fill="#E6BD9E" />
          <circle cx="307" cy="64" r="3.5" fill="#F5D0B5" />
          <circle cx="343" cy="64" r="3.5" fill="#F5D0B5" />
          <circle cx="325" cy="62" r="18" fill="#F5D0B5" />
          <circle cx="325" cy="40" r="9" fill="#2E1B10" />
          <ellipse cx="325" cy="47" rx="8" ry="3" fill="#F59E0B" />
          <path d="M307 60 C307 46, 343 46, 343 60 C338 52, 312 52, 307 60 Z" fill="#2E1B10" />
          <path d="M308 58 Q312 66 310 70" stroke="#2E1B10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M342 58 Q338 66 340 70" stroke="#2E1B10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M314 56 Q318 54 322 56" stroke="#2E1B10" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M328 56 Q332 54 336 56" stroke="#2E1B10" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <circle cx="318" cy="62" r="2.2" fill="#0F172A" />
          <circle cx="317.3" cy="61.2" r="0.7" fill="#FFFFFF" />
          <path d="M328 62 Q332 58 336 62" stroke="#0F172A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M336 60 L338 58" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M325 64 Q326.5 66 325 67" stroke="#C58F68" strokeWidth="1.1" fill="none" strokeLinecap="round" />
          <circle cx="313" cy="66" r="3" fill="rgba(244,114,182,0.3)" />
          <circle cx="337" cy="66" r="3" fill="rgba(244,114,182,0.3)" />
          <path d="M320 68 Q325 74 330 68" stroke="#0F172A" strokeWidth="1.8" fill="#F43F5E" strokeLinecap="round" />
          <ellipse cx="325" cy="120" rx="22" ry="7" fill="url(#plateShine)" />
          <polygon points="317,121 333,115 330,124" fill="#FDE047" stroke="#D97706" strokeWidth="0.8" />
          <line x1="319" y1="120" x2="331" y2="117" stroke="#16A34A" strokeWidth="1.5" />
          <line x1="320" y1="122" x2="329" y2="119" stroke="#DC2626" strokeWidth="1.5" />
          <rect x="350" y="108" width="10" height="14" rx="2" fill="rgba(255,255,255,0.75)" stroke="rgba(255,255,255,0.9)" strokeWidth="0.8" />
          <rect x="351" y="112" width="8" height="9" rx="1" fill="#F472B6" opacity="0.8" />
          <circle cx="353" cy="119" r="1.2" fill="#3B1E08" />
          <circle cx="356" cy="119" r="1.2" fill="#3B1E08" />
          <circle cx="355" cy="116" r="1.2" fill="#3B1E08" />
          <line x1="355" y1="104" x2="359" y2="118" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* --- FRONT COUNTER TABLE (Natural Oak Wood with 3D Depth) --- */}
        <rect x="10" y="122" width="380" height="14" rx="4" fill="url(#woodTable)" />
        <rect x="10" y="122" width="380" height="2" fill="rgba(255,255,255,0.35)" />
        <rect x="10" y="136" width="380" height="6" rx="2" fill="url(#tableBevel)" />
        <line x1="0" y1="152" x2="400" y2="152" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Condiment Shakers on Table */}
        <rect x="135" y="118" width="6" height="8" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.6" />
        <rect x="143" y="118" width="6" height="8" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.6" />
        <circle cx="138" cy="119" r="0.8" fill="#1E293B" />
        <circle cx="146" cy="119" r="0.8" fill="#DC2626" />
      </svg>
    </div>
  );
}

function HomePage({ onNavigate, onOpenChat }) {
  return (
    <RefactoredHomePage
      onNavigate={onNavigate}
      onOpenChat={onOpenChat}
      useCanteenHook={useCanteen}
    />
  );
}

/* ================================================================== */
/* Nutrition Modal Component                                             */
/* ================================================================== */
const DAILY_VALUES = { protein: 50, carbs: 300, fat: 65, fiber: 25, sugar: 50, sodium: 2300 };
const MACRO_COLORS = {
  protein: { color: "#6366f1", bg: "rgba(99,102,241,0.15)", label: "Protein" },
  carbs:   { color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  label: "Carbs" },
  fat:     { color: "#ef4444", bg: "rgba(239,68,68,0.15)",   label: "Fat" },
  fiber:   { color: "#10b981", bg: "rgba(16,185,129,0.15)",  label: "Fiber" },
  sugar:   { color: "#ec4899", bg: "rgba(236,72,153,0.15)",  label: "Sugar" },
  sodium:  { color: "#8b5cf6", bg: "rgba(139,92,246,0.15)",  label: "Sodium", unit: "mg" },
};

function NutritionModal({ item, onClose, lang }) {
  const n = item.nutrition || {};
  const itemName = lang === "ta" ? (item.name_ta || item.name) : item.name;
  const Icon = FOOD_ICONS[item.icon] || FOOD_ICONS.thali;

  // Macro ring: protein/carbs/fat in kcal proportions
  const proteinKcal = (n.protein || 0) * 4;
  const carbsKcal   = (n.carbs   || 0) * 4;
  const fatKcal     = (n.fat     || 0) * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || 1;
  const pPct = Math.round((proteinKcal / totalMacroKcal) * 100);
  const cPct = Math.round((carbsKcal   / totalMacroKcal) * 100);
  const fPct = 100 - pPct - cPct;

  // SVG donut ring
  const R = 48, C = 2 * Math.PI * R;
  const pDash = (pPct / 100) * C;
  const cDash = (cPct / 100) * C;
  const fDash = (fPct / 100) * C;
  const pOffset = 0;
  const cOffset = -pDash;
  const fOffset = -(pDash + cDash);

  return (
    <div className="nutri-overlay" onClick={onClose}>
      <div className="nutri-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="nutri-modal-header">
          <div className="nutri-modal-title-row">
            <div className="nutri-food-icon-wrap"><Icon size={22} /></div>
            <div>
              <div className="nutri-modal-name">{itemName}</div>
              <div className="nutri-modal-sub">
                {item.desc || (lang === "ta" ? "ஊட்டச்சத்து தகவல்" : "Nutrition Information")}
              </div>
            </div>
          </div>
          <button className="nutri-close-btn" onClick={onClose}><XIcon size={16} /></button>
        </div>

        <div className="nutri-modal-body">
          {/* Calories Hero + Donut */}
          <div className="nutri-hero-row">
            <div className="nutri-kcal-hero">
              <div className="nutri-kcal-number">{item.kcal}</div>
              <div className="nutri-kcal-label">kcal</div>
              {item.dietTag && (
                <div className={`nutri-diet-tag ${item.dietTag === "veg" ? "veg" : "nonveg"}`}>
                  <span className="nutri-diet-dot" />
                  {item.dietTag === "veg" ? "Veg" : "Non-Veg"}
                </div>
              )}
            </div>

            {/* Macro Donut */}
            <div className="nutri-donut-wrap">
              <svg width="112" height="112" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r={R} fill="none" stroke="var(--steel)" strokeWidth="12" />
                <circle cx="56" cy="56" r={R} fill="none" stroke="#6366f1" strokeWidth="12"
                  strokeDasharray={`${pDash} ${C - pDash}`}
                  strokeDashoffset={C * 0.25 + pOffset}
                  strokeLinecap="butt" style={{ transition: "stroke-dasharray 0.8s ease" }}
                />
                <circle cx="56" cy="56" r={R} fill="none" stroke="#f59e0b" strokeWidth="12"
                  strokeDasharray={`${cDash} ${C - cDash}`}
                  strokeDashoffset={C * 0.25 + cOffset}
                  strokeLinecap="butt" style={{ transition: "stroke-dasharray 0.8s ease" }}
                />
                <circle cx="56" cy="56" r={R} fill="none" stroke="#ef4444" strokeWidth="12"
                  strokeDasharray={`${fDash} ${C - fDash}`}
                  strokeDashoffset={C * 0.25 + fOffset}
                  strokeLinecap="butt" style={{ transition: "stroke-dasharray 0.8s ease" }}
                />
                <text x="56" y="52" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--ink)" fontFamily="var(--font-mono)">{item.kcal}</text>
                <text x="56" y="65" textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="var(--font-body)">KCAL</text>
              </svg>
              <div className="nutri-donut-legend">
                <div className="nutri-legend-item"><span style={{ background: "#6366f1" }} /><span>P {pPct}%</span></div>
                <div className="nutri-legend-item"><span style={{ background: "#f59e0b" }} /><span>C {cPct}%</span></div>
                <div className="nutri-legend-item"><span style={{ background: "#ef4444" }} /><span>F {fPct}%</span></div>
              </div>
            </div>
          </div>

          {/* Macro quick chips */}
          <div className="nutri-macro-chips">
            {["protein","carbs","fat"].map((k) => {
              const m = MACRO_COLORS[k];
              return (
                <div key={k} className="nutri-macro-chip" style={{ background: m.bg, borderColor: m.color + "55" }}>
                  <div className="nutri-chip-val" style={{ color: m.color }}>{n[k] || 0}<span>g</span></div>
                  <div className="nutri-chip-key">{m.label}</div>
                </div>
              );
            })}
          </div>

          {/* Detailed bar rows */}
          <div className="nutri-section-label">{lang === "ta" ? "விரிவான ஊட்டச்சத்துக்கள்" : "Detailed Nutrients"}</div>
          <div className="nutri-bars">
            {Object.entries(MACRO_COLORS).map(([k, m]) => {
              const val   = n[k] || 0;
              const dv    = DAILY_VALUES[k];
              const pct   = Math.min(100, Math.round((val / dv) * 100));
              const unit  = m.unit || "g";
              return (
                <div key={k} className="nutri-bar-row">
                  <div className="nutri-bar-label-wrap">
                    <span className="nutri-bar-name">{m.label}</span>
                    <span className="nutri-bar-val" style={{ color: m.color }}>{val}{unit}</span>
                  </div>
                  <div className="nutri-bar-track">
                    <div
                      className="nutri-bar-fill"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${m.color}88, ${m.color})` }}
                    />
                  </div>
                  <span className="nutri-dv-label">{pct}% DV</span>
                </div>
              );
            })}
          </div>

          {/* Allergens */}
          {item.allergens?.length > 0 && (
            <div className="nutri-allergen-wrap">
              <div className="nutri-section-label" style={{ marginBottom: 8 }}>
                {lang === "ta" ? "ஒவ்வாமை பொருட்கள்" : "Allergens"}
              </div>
              <div className="nutri-allergen-chips">
                {item.allergens.map((a) => (
                  <span key={a} className="nutri-allergen-chip">{a}</span>
                ))}
              </div>
            </div>
          )}

          <div className="nutri-dv-note">
            {lang === "ta"
              ? "* % DV என்பது ஒரு நாளைக்கு 2000 kcal உணவின் அடிப்படையில் கணக்கிடப்பட்டது."
              : "* % Daily Values are based on a 2,000 kcal diet."}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Helper: Estimate realistic nutrition macros from calories & category */
/* ================================================================== */
function estimateNutrition(kcal, category = "meals") {
  const c = Math.max(15, Number(kcal) || 250);
  let pRatio, cRatio, fRatio;
  if (category === "juice") {
    pRatio = 0.04; cRatio = 0.92; fRatio = 0.04;
  } else if (category === "beverages") {
    pRatio = 0.08; cRatio = 0.72; fRatio = 0.20;
  } else if (category === "desserts") {
    pRatio = 0.06; cRatio = 0.54; fRatio = 0.40;
  } else if (category === "snacks") {
    pRatio = 0.16; cRatio = 0.48; fRatio = 0.36;
  } else {
    // meals / default
    pRatio = 0.22; cRatio = 0.54; fRatio = 0.24;
  }
  const protein = Math.max(1, Math.round((c * pRatio) / 4));
  const carbs = Math.max(1, Math.round((c * cRatio) / 4));
  const fat = Math.max(0, Math.round((c * fRatio) / 9));
  const fiber = category === "juice" ? 1 : Math.max(1, Math.round(carbs * 0.12));
  const sugar = category === "juice" ? Math.round(carbs * 0.8) : Math.max(1, Math.round(carbs * 0.1));
  const sodium = category === "juice" || category === "desserts" ? 25 : Math.round(c * 1.2);
  return { protein, carbs, fat, fiber, sugar, sodium };
}

const COMMON_ALLERGENS = ["Gluten", "Dairy", "Eggs", "Nuts", "Soy"];

/* ================================================================== */
/* Add Product Component with Complete Nutrition Facts & Auto-Estimate */
/* ================================================================== */
function AddProductCard({ defaultCategory = "meals" }) {
  const { addProduct, lang, t } = useCanteen();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNameTa, setNewNameTa] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newKcal, setNewKcal] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newCategory, setNewCategory] = useState(defaultCategory);
  const [newIcon, setNewIcon] = useState(defaultCategory === "juice" ? "juice" : "thali");
  const [newDietTag, setNewDietTag] = useState("veg");
  const [newDesc, setNewDesc] = useState("");

  // Nutrition Facts State
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [sugar, setSugar] = useState("");
  const [sodium, setSodium] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const handleCategoryChange = (cat) => {
    setNewCategory(cat);
    if (cat === "juice") setNewIcon("juice");
    else if (cat === "beverages" || cat === "desserts") setNewIcon("cup");
    else if (cat === "snacks") setNewIcon("wrap");
    else setNewIcon("thali");
  };

  const handleAutoCalculate = () => {
    const c = Number(newKcal);
    if (!c || c <= 0) {
      setAddError(lang === "ta" ? "முதலில் கலோரி (kcal) அளவை உள்ளிடவும்." : "Please enter calories (kcal) first.");
      return;
    }
    setAddError("");
    const est = estimateNutrition(c, newCategory);
    setProtein(String(est.protein));
    setCarbs(String(est.carbs));
    setFat(String(est.fat));
    setFiber(String(est.fiber));
    setSugar(String(est.sugar));
    setSodium(String(est.sodium));
  };

  const toggleAllergen = (alg) => {
    setSelectedAllergens((prev) =>
      prev.includes(alg) ? prev.filter((a) => a !== alg) : [...prev, alg]
    );
  };

  const handleAddProduct = () => {
    const name = newName.trim();
    const price = Number(newPrice);
    const kcal = Number(newKcal);
    const stock = Number(newStock);

    if (!name) {
      setAddError(lang === "ta" ? "உணவு பெயரை உள்ளிடவும்." : "Enter a product name.");
      return;
    }
    if (!price || price <= 0) {
      setAddError(lang === "ta" ? "சரியான விலையை உள்ளிடவும்." : "Enter a valid price.");
      return;
    }
    if (!kcal || kcal <= 0) {
      setAddError(lang === "ta" ? "சரியான கலோரி அளவை உள்ளிடவும்." : "Enter a valid calorie value.");
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setAddError(lang === "ta" ? "சரியான இருப்பை உள்ளிடவும்." : "Enter a valid stock count.");
      return;
    }

    // Ensure ALL nutrition facts are populated (intelligently defaulting any empty fields)
    const est = estimateNutrition(kcal, newCategory);
    const finalNutrition = {
      protein: protein !== "" && !isNaN(Number(protein)) ? Number(protein) : est.protein,
      carbs:   carbs !== "" && !isNaN(Number(carbs)) ? Number(carbs) : est.carbs,
      fat:     fat !== "" && !isNaN(Number(fat)) ? Number(fat) : est.fat,
      fiber:   fiber !== "" && !isNaN(Number(fiber)) ? Number(fiber) : est.fiber,
      sugar:   sugar !== "" && !isNaN(Number(sugar)) ? Number(sugar) : est.sugar,
      sodium:  sodium !== "" && !isNaN(Number(sodium)) ? Number(sodium) : est.sodium,
    };

    addProduct({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_" + Date.now(),
      name,
      name_ta: newNameTa.trim() || undefined,
      price,
      kcal,
      category: newCategory,
      icon: newIcon,
      stock,
      available: stock > 0,
      nutrition: finalNutrition,
      allergens: selectedAllergens,
      dietTag: newDietTag,
      desc: newDesc.trim() || undefined,
    });

    setNewName("");
    setNewNameTa("");
    setNewPrice("");
    setNewKcal("");
    setNewStock("");
    setProtein("");
    setCarbs("");
    setFat("");
    setFiber("");
    setSugar("");
    setSodium("");
    setSelectedAllergens([]);
    setNewDesc("");
    setAddError("");
    setAddSuccess(lang === "ta" ? "உணவு சேர்க்கப்பட்டு மெனு & ஆர்டரில் நிரந்தரமாக சேமிக்கப்பட்டது! ✅" : "Product added & permanently saved to Menu and Orders! ✅");
    setTimeout(() => setAddSuccess(""), 4500);
  };

  const previewEst = newKcal ? estimateNutrition(newKcal, newCategory) : null;
  const currentProtein = protein !== "" ? protein : (previewEst ? previewEst.protein : "--");
  const currentCarbs = carbs !== "" ? carbs : (previewEst ? previewEst.carbs : "--");
  const currentFat = fat !== "" ? fat : (previewEst ? previewEst.fat : "--");
  const currentFiber = fiber !== "" ? fiber : (previewEst ? previewEst.fiber : "--");
  const currentSugar = sugar !== "" ? sugar : (previewEst ? previewEst.sugar : "--");
  const currentSodium = sodium !== "" ? sodium : (previewEst ? previewEst.sodium : "--");

  return (
    <div className="card add-product-card advanced-form-card" style={{ marginBottom: 18 }}>
      <div className="add-product-header" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }} onClick={() => setShowAddForm(!showAddForm)}>
        <div>
          <div className="add-product-title">
            <span className="add-product-icon">✨</span>
            <span>{lang === "ta" ? "+ புதிய உணவு சேர்க்க (ஊட்டச்சத்துடன்)" : "+ Add Product with Nutrition Facts"}</span>
          </div>
          <div className="add-product-subtitle" style={{ marginTop: 2 }}>
            {lang === "ta" ? "விலை, கலோரி, புரதம், கார்ப்ஸ், கொழுப்பு மற்றும் முழு ஊட்டச்சத்து விவரங்கள்" : "Includes calories, protein, carbs, fat, fiber, allergens and full nutrition facts"}
          </div>
        </div>
        <button type="button" className="cta-mini" style={{ fontSize: 11, padding: "5px 12px", flexShrink: 0 }}>
          {showAddForm ? "▲ Hide Form" : "▼ + Add Product"}
        </button>
      </div>

      {showAddForm && (
        <div style={{ marginTop: 14 }}>
          <div style={{
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            borderRadius: 8,
            padding: "8px 12px",
            marginBottom: 14,
            fontSize: 12,
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span>💾</span>
            <span>
              {lang === "ta"
                ? "நிரந்தர சேமிப்பு இயக்கத்தில் உள்ளது: சேர்க்கப்படும் உணவுகள் மறுஏற்றத்திலும் மெனு மற்றும் ஆர்டரில் நிலைத்திருக்கும்."
                : "Permanent Storage Active: Newly added products stay saved in Menu & Orders across page refreshes and browser restarts."}
            </span>
          </div>

          {/* Row 1: Name (EN) & Name (TA) */}
          <div className="form-row-grid">
            <div className="form-row" style={{ marginBottom: 0 }}>
              <label className="adv-label">
                <span>🍔 {t("product_name")} (English) *</span>
              </label>
              <input
                className="adv-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Masala Dosa or Mango Juice"
              />
            </div>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <label className="adv-label">
                <span>🌐 {lang === "ta" ? "உணவு பெயர் (தமிழ்)" : "Tamil Name (Optional)"}</span>
              </label>
              <input
                className="adv-input"
                value={newNameTa}
                onChange={(e) => setNewNameTa(e.target.value)}
                placeholder="எ.கா. மசாலா தோசை"
              />
            </div>
          </div>

          {/* Row 2: Price, Stock, Category */}
          <div className="form-row-grid" style={{ marginTop: 14 }}>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <label className="adv-label">
                <span>💰 {t("price")} (₹) *</span>
              </label>
              <div className="input-prefix-wrap">
                <span className="prefix-badge">₹</span>
                <input
                  type="number"
                  className="adv-input prefixed"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="60"
                />
              </div>
            </div>

            <div className="form-row" style={{ marginBottom: 0 }}>
              <label className="adv-label">
                <span>📦 {t("stock_qty")} *</span>
              </label>
              <div className="input-prefix-wrap">
                <span className="prefix-badge">Qty</span>
                <input
                  type="number"
                  className="adv-input prefixed"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="form-row" style={{ marginBottom: 0 }}>
              <label className="adv-label">
                <span>🏷️ {t("category")}</span>
              </label>
              <select
                className="adv-select"
                value={newCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t("categories." + c)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Diet Tag & Icon Picker */}
          <div className="form-row-grid" style={{ marginTop: 14 }}>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <label className="adv-label">
                <span>🥗 {lang === "ta" ? "உணவு வகை" : "Diet Type"}</span>
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setNewDietTag("veg")}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 14,
                    border: newDietTag === "veg" ? "2px solid var(--basil)" : "1.5px solid var(--input-border)",
                    background: newDietTag === "veg" ? "rgba(22, 163, 74, 0.12)" : "var(--input-bg)",
                    color: newDietTag === "veg" ? "var(--basil)" : "var(--muted)",
                    fontWeight: 800, fontSize: 12.5, cursor: "pointer", transition: "all 0.15s"
                  }}
                >
                  🟢 Veg
                </button>
                <button
                  type="button"
                  onClick={() => setNewDietTag("non-veg")}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 14,
                    border: newDietTag === "non-veg" ? "2px solid #ef4444" : "1.5px solid var(--input-border)",
                    background: newDietTag === "non-veg" ? "rgba(239, 68, 68, 0.12)" : "var(--input-bg)",
                    color: newDietTag === "non-veg" ? "#ef4444" : "var(--muted)",
                    fontWeight: 800, fontSize: 12.5, cursor: "pointer", transition: "all 0.15s"
                  }}
                >
                  🔴 Non-Veg
                </button>
              </div>
            </div>

            <div className="form-row" style={{ marginBottom: 0 }}>
              <label className="adv-label">
                <span>🎨 {lang === "ta" ? "உணவு சின்னம்" : "Display Icon"}</span>
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { key: "thali", label: "🍛 Thali" },
                  { key: "juice", label: "🥤 Juice" },
                  { key: "wrap", label: "🌯 Wrap" },
                  { key: "cup", label: "☕ Cup" },
                  { key: "biryani", label: "🍗 Biryani" },
                ].map((ic) => (
                  <button
                    key={ic.key}
                    type="button"
                    onClick={() => setNewIcon(ic.key)}
                    style={{
                      flex: 1, padding: "9px 4px", borderRadius: 12,
                      border: newIcon === ic.key ? "2px solid var(--coral)" : "1.5px solid var(--input-border)",
                      background: newIcon === ic.key ? "rgba(226, 163, 16, 0.15)" : "var(--input-bg)",
                      color: newIcon === ic.key ? "var(--coral-d)" : "var(--text)",
                      fontWeight: 700, fontSize: 11, cursor: "pointer", transition: "all 0.15s"
                    }}
                  >
                    {ic.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-row" style={{ marginTop: 14, marginBottom: 0 }}>
            <label className="adv-label">
              <span>📝 {lang === "ta" ? "விளக்கம்" : "Dish Description"}</span>
            </label>
            <input
              className="adv-input"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="e.g. Crisp golden dosa with potato masala filling and fresh coconut chutney."
            />
          </div>

          {/* ======================================================= */}
          {/* COMPREHENSIVE NUTRITION FACTS SECTION                  */}
          {/* ======================================================= */}
          <div style={{
            marginTop: 18,
            padding: "16px",
            borderRadius: 20,
            background: "linear-gradient(180deg, rgba(99,102,241,0.04) 0%, rgba(245,158,11,0.04) 100%)",
            border: "1.5px solid rgba(99,102,241,0.22)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🥗</span>
                  <span>{lang === "ta" ? "முழு ஊட்டச்சத்து விவரங்கள் (Nutrition Facts)" : "Complete Nutrition Facts"}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                  {lang === "ta"
                    ? "ஒவ்வொரு ஊட்டச்சத்தையும் உள்ளிடவும் அல்லது தானாக கணக்கிடவும்"
                    : "Enter custom macros or click Auto-Calculate to compute from calories"}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoCalculate}
                className="cta-mini"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "#fff",
                  fontSize: 11.5,
                  padding: "6px 14px",
                  borderRadius: 14,
                  boxShadow: "0 2px 8px rgba(99,102,241,0.3)"
                }}
                title="Calculate protein, carbs, fat, fiber, sugar & sodium automatically"
              >
                ⚡ {lang === "ta" ? "தானியங்கி கணக்கீடு" : "Auto-Calculate Macros"}
              </button>
            </div>

            {/* Calories (Primary Anchor) */}
            <div className="form-row" style={{ marginBottom: 12 }}>
              <label className="adv-label">
                <span>🔥 {t("calories")} (kcal) *</span>
              </label>
              <div className="input-suffix-wrap">
                <input
                  type="number"
                  className="adv-input suffixed"
                  value={newKcal}
                  onChange={(e) => setNewKcal(e.target.value)}
                  placeholder="e.g. 280"
                />
                <span className="suffix-badge" style={{ fontWeight: 800, color: "var(--coral-d)" }}>kcal</span>
              </div>
            </div>

            {/* 6 Macro Grid: Protein, Carbs, Fat, Fiber, Sugar, Sodium */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {/* Protein */}
              <div className="form-row" style={{ marginBottom: 0 }}>
                <label className="adv-label" style={{ fontSize: 11.5, color: "#6366f1" }}>
                  <span>💪 {lang === "ta" ? "புரதம்" : "Protein"}</span>
                </label>
                <div className="input-suffix-wrap">
                  <input
                    type="number"
                    className="adv-input suffixed"
                    style={{ borderColor: "rgba(99,102,241,0.4)" }}
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder={previewEst ? String(previewEst.protein) : "12"}
                  />
                  <span className="suffix-badge">g</span>
                </div>
              </div>

              {/* Carbs */}
              <div className="form-row" style={{ marginBottom: 0 }}>
                <label className="adv-label" style={{ fontSize: 11.5, color: "#d97706" }}>
                  <span>🌾 {lang === "ta" ? "கார்ப்ஸ்" : "Carbohydrates"}</span>
                </label>
                <div className="input-suffix-wrap">
                  <input
                    type="number"
                    className="adv-input suffixed"
                    style={{ borderColor: "rgba(245,158,11,0.4)" }}
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder={previewEst ? String(previewEst.carbs) : "45"}
                  />
                  <span className="suffix-badge">g</span>
                </div>
              </div>

              {/* Fat */}
              <div className="form-row" style={{ marginBottom: 0 }}>
                <label className="adv-label" style={{ fontSize: 11.5, color: "#ef4444" }}>
                  <span>🥑 {lang === "ta" ? "கொழுப்பு" : "Total Fat"}</span>
                </label>
                <div className="input-suffix-wrap">
                  <input
                    type="number"
                    className="adv-input suffixed"
                    style={{ borderColor: "rgba(239,68,68,0.4)" }}
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder={previewEst ? String(previewEst.fat) : "8"}
                  />
                  <span className="suffix-badge">g</span>
                </div>
              </div>

              {/* Fiber */}
              <div className="form-row" style={{ marginBottom: 0, marginTop: 8 }}>
                <label className="adv-label" style={{ fontSize: 11.5, color: "#10b981" }}>
                  <span>🌱 {lang === "ta" ? "நார்ச்சத்து" : "Dietary Fiber"}</span>
                </label>
                <div className="input-suffix-wrap">
                  <input
                    type="number"
                    className="adv-input suffixed"
                    style={{ borderColor: "rgba(16,185,129,0.4)" }}
                    value={fiber}
                    onChange={(e) => setFiber(e.target.value)}
                    placeholder={previewEst ? String(previewEst.fiber) : "4"}
                  />
                  <span className="suffix-badge">g</span>
                </div>
              </div>

              {/* Sugar */}
              <div className="form-row" style={{ marginBottom: 0, marginTop: 8 }}>
                <label className="adv-label" style={{ fontSize: 11.5, color: "#ec4899" }}>
                  <span>🍬 {lang === "ta" ? "சர்க்கரை" : "Sugars"}</span>
                </label>
                <div className="input-suffix-wrap">
                  <input
                    type="number"
                    className="adv-input suffixed"
                    style={{ borderColor: "rgba(236,72,153,0.4)" }}
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                    placeholder={previewEst ? String(previewEst.sugar) : "3"}
                  />
                  <span className="suffix-badge">g</span>
                </div>
              </div>

              {/* Sodium */}
              <div className="form-row" style={{ marginBottom: 0, marginTop: 8 }}>
                <label className="adv-label" style={{ fontSize: 11.5, color: "#8b5cf6" }}>
                  <span>🧂 {lang === "ta" ? "சோடியம்" : "Sodium"}</span>
                </label>
                <div className="input-suffix-wrap">
                  <input
                    type="number"
                    className="adv-input suffixed"
                    style={{ borderColor: "rgba(139,92,246,0.4)" }}
                    value={sodium}
                    onChange={(e) => setSodium(e.target.value)}
                    placeholder={previewEst ? String(previewEst.sodium) : "320"}
                  />
                  <span className="suffix-badge">mg</span>
                </div>
              </div>
            </div>

            {/* Live Macro Preview Card */}
            <div style={{
              background: "var(--surface)",
              borderRadius: 14,
              padding: "10px 14px",
              marginTop: 12,
              border: "1px solid var(--surface-border)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>
                  📊 {lang === "ta" ? "நேரலை ஊட்டச்சத்து முன்னோட்டம்" : "Live Nutrition Card Preview"}
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "var(--coral-d)" }}>
                  🔥 {newKcal || 0} kcal
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span className="nutri-mini-chip protein" style={{ fontSize: 11 }}>💪 {currentProtein}g Protein</span>
                <span className="nutri-mini-chip carbs" style={{ fontSize: 11 }}>🌾 {currentCarbs}g Carbs</span>
                <span className="nutri-mini-chip fat" style={{ fontSize: 11 }}>🥑 {currentFat}g Fat</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "2px 7px", borderRadius: 8 }}>🌱 {currentFiber}g Fiber</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#ec4899", background: "rgba(236,72,153,0.12)", padding: "2px 7px", borderRadius: 8 }}>🍬 {currentSugar}g Sugar</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6", background: "rgba(139,92,246,0.12)", padding: "2px 7px", borderRadius: 8 }}>🧂 {currentSodium}mg Sodium</span>
              </div>
            </div>

            {/* Allergens Selection */}
            <div style={{ marginTop: 12 }}>
              <label className="adv-label" style={{ fontSize: 12 }}>
                <span>⚠️ {lang === "ta" ? "ஒவ்வாமை பொருட்கள் (Allergens)" : "Select Allergens (Optional)"}</span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {COMMON_ALLERGENS.map((alg) => {
                  const isSelected = selectedAllergens.includes(alg);
                  return (
                    <button
                      key={alg}
                      type="button"
                      onClick={() => toggleAllergen(alg)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 10,
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        border: isSelected ? "1.5px solid #ef4444" : "1px solid var(--input-border)",
                        background: isSelected ? "rgba(239,68,68,0.14)" : "var(--surface)",
                        color: isSelected ? "#ef4444" : "var(--muted)"
                      }}
                    >
                      {isSelected ? `✓ ${alg}` : `+ ${alg}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feedback Hints */}
          {addError && <div className="hint error" style={{ marginTop: 14 }}>⚠️ {addError}</div>}
          {addSuccess && <div className="hint success" style={{ marginTop: 14 }}>✅ {addSuccess}</div>}

          {/* Submit Button */}
          <button
            className="adv-submit-btn"
            type="button"
            onClick={handleAddProduct}
            style={{ marginTop: 16 }}
          >
            <span>➕ {lang === "ta" ? "முழு ஊட்டச்சத்துடன் உணவை சேர்க்கவும்" : "Publish Dish with All Nutrition Facts"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/* Menu / Order page                                                     */
/* ================================================================== */
function MenuPage({ onNavigate }) {
  return (
    <RefactoredOrderPage
      onNavigate={onNavigate}
      useCanteenHook={useCanteen}
      NutritionModal={NutritionModal}
      AddProductCard={AddProductCard}
    />
  );
}

/* ================================================================== */
/* Cart page                                                             */
/* ================================================================== */
function CartPage({ onNavigate }) {
  return (
    <RefactoredCartPage
      onNavigate={onNavigate}
      useCanteenHook={useCanteen}
    />
  );
}


/* ================================================================== */
/* Canteen Selection Page — step between Cart and Order Confirmation    */
/* ================================================================== */
function CanteenSelectPage({ onNavigate }) {
  const { canteens, placeOrder, lang, t, selectedCanteen, fetchCanteens } = useCanteen();
  const [selectedId, setSelectedId] = useState(selectedCanteen || null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  // Re-fetch latest canteen status from backend whenever student visits the Choose Canteen page
  useEffect(() => {
    if (typeof fetchCanteens === "function") {
      fetchCanteens();
    }
  }, [fetchCanteens]);

  // If currently selected canteen became inactive, clear selection and show guidance
  const selectedCanteenObj = canteens.find((c) => c.id === selectedId);
  const isSelectedInactive = selectedCanteenObj && selectedCanteenObj.status === "inactive";

  // Recover payMode & total that CartPage stored before navigating here
  const payMode = (() => { try { return sessionStorage.getItem("canteen_checkout_payMode") || "UPI"; } catch { return "UPI"; } })();
  const total = (() => { try { return Number(sessionStorage.getItem("canteen_checkout_total")) || 0; } catch { return 0; } })();

  const crowdEmoji = { low: "😌", med: "😐", high: "😰" };
  const crowdDesc = {
    en: { low: "Plenty of seats • Short wait", med: "Moderate crowd • Short wait", high: "Very busy • Long wait" },
    ta: { low: "இடங்கள் உள்ளன • குறுகிய காத்திருப்பு", med: "மிதமான கூட்டம்", high: "அதிக கூட்டம் • நீண்ட காத்திருப்பு" },
  };

  const handleConfirm = () => {
    if (!selectedId) {
      setError(lang === "ta" ? "தயவுசெய்து ஒரு உணவகத்தை தேர்ந்தெடுங்கள்." : "Please select a canteen to continue.");
      return;
    }
    const canteen = canteens.find((c) => c.id === selectedId);
    if (!canteen || canteen.status === "inactive") {
      setError(lang === "ta" ? "இந்த உணவகம் தற்போது செயல்படவில்லை. தயவுசெய்து மற்றொரு உணவகத்தை தேர்வு செய்யவும்." : "This canteen is currently inactive. Please choose another canteen.");
      return;
    }
    setError("");
    setConfirming(true);

    const canteenName = lang === "ta" ? (canteen.name_ta || canteen.name) : canteen.name;
    const canteenLoc  = lang === "ta" ? (canteen.loc_ta  || canteen.loc)  : canteen.loc;

    // Clean up sessionStorage
    try { sessionStorage.removeItem("canteen_checkout_payMode"); sessionStorage.removeItem("canteen_checkout_total"); } catch {}

    const success = placeOrder(payMode, total, canteen.id, canteen.name, canteenLoc);
    if (success !== false) {
      onNavigate("tracking");
    } else {
      setConfirming(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, minHeight: 0, position: "relative" }}>
      {/* Compact Hero banner */}
      <div style={{ position: "relative", minHeight: 110, overflow: "hidden", flexShrink: 0, background: "#1f1d19" }}>
        <img
          src="/anime-canteen-bg.jpg"
          alt="Canteen"
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, filter: "brightness(0.7) saturate(1.15)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,15,10,0.5) 0%, rgba(20,15,10,0.85) 100%)" }} />
        
        <div style={{ position: "relative", zIndex: 2, padding: "14px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="back" onClick={() => onNavigate("cart")} style={{ color: "var(--coral)", background: "rgba(0,0,0,0.35)", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowLeft />
              </button>
              <div>
                <div className="eyebrow" style={{ color: "rgba(255,220,120,0.9)", marginTop: 0, fontSize: 10.5, letterSpacing: 1.5, fontWeight: 700 }}>
                  {lang === "ta" ? "ஆர்டர் உறுதிப்படுத்தல் · கட்டாய படி" : "ORDER CHECKOUT · STEP 2 OF 2"}
                </div>
                <div className="h-title" style={{ color: "#fff", margin: 0, fontSize: 20, fontWeight: 800 }}>
                  {lang === "ta" ? "உணவகத்தை தேர்ந்தெடு" : "Choose Your Canteen"}
                </div>
              </div>
            </div>

            <span className="crowd-live-badge" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <i /> {t("live")}
            </span>
          </div>

          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 6, fontWeight: 500 }}>
            {lang === "ta"
              ? "நீங்கள் எங்கிருந்து உணவை எடுக்க விரும்புகிறீர்கள்? (செயலில் உள்ள உணவகங்களைத் தேர்வு செய்யவும்)"
              : "Where would you like to pick up your order? Select an active campus canteen"}
          </div>
        </div>
      </div>

      <div className="scroll" style={{ flex: 1, overflowY: "auto", paddingTop: 16, paddingBottom: 130 }}>
        {/* Step indicator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "0 18px 16px",
          fontSize: 11.5, fontWeight: 600, color: "var(--muted)", maxWidth: 960, margin: "0 auto"
        }}>
          <span style={{ color: "var(--basil)", fontWeight: 800, cursor: "pointer" }} onClick={() => onNavigate("cart")}>✓ Cart</span>
          <span style={{ flex: 1, height: 1.5, background: "var(--line)", borderRadius: 2 }} />
          <span style={{ color: "var(--coral-d)", fontWeight: 800, padding: "3px 10px", background: "rgba(196,62,28,0.12)", borderRadius: 10 }}>
            ● {lang === "ta" ? "உணவகம் தேர்வு" : "Select Canteen"}
          </span>
          <span style={{ flex: 1, height: 1.5, background: "var(--line)", borderRadius: 2 }} />
          <span style={{ color: "var(--muted)" }}>{lang === "ta" ? "உறுதிப்படுத்தல்" : "Confirm"}</span>
        </div>

        {/* Section title & count */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "var(--fg)" }}>
            🏢 {lang === "ta" ? "வளாக உணவகங்கள்" : "Campus Canteens"}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
            {selectedId && !isSelectedInactive
              ? (lang === "ta" ? "1 தேர்ந்தெடுக்கப்பட்டது" : "1 selected")
              : (lang === "ta" ? "செயலில் உள்ள ஒன்றை தேர்ந்தெடுக்கவும்" : "Select an active canteen below")}
          </div>
        </div>

        {/* Canteen cards in responsive grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
          padding: "0 18px",
          maxWidth: 960,
          margin: "0 auto"
        }}>
          {canteens.map((c) => {
            const lv = LEVELS[c.level] || LEVELS.low;
            const isInactive = c.status === "inactive";
            const isSelected = selectedId === c.id && !isInactive;
            const cName = lang === "ta" ? (c.name_ta || c.name) : c.name;
            const cLoc  = lang === "ta" ? (c.loc_ta  || c.loc)  : c.loc;

            return (
              <div
                key={c.id}
                id={`canteen-card-${c.id}`}
                onClick={() => {
                  if (isInactive) return;
                  setSelectedId(c.id);
                  setError("");
                }}
                role="button"
                tabIndex={isInactive ? -1 : 0}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 0,
                  borderRadius: 18,
                  cursor: isInactive ? "not-allowed" : "pointer",
                  background: "transparent",
                  outline: "none",
                  opacity: isInactive ? 0.68 : 1,
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  filter: isInactive ? "grayscale(0.4)" : "none",
                }}
              >
                <div style={{
                  width: "100%", height: "100%",
                  borderRadius: 18, overflow: "hidden",
                  border: isInactive
                    ? "2px dashed rgba(239,68,68,0.4)"
                    : isSelected
                    ? `2.5px solid ${lv.color}`
                    : "2px solid var(--line)",
                  background: isInactive
                    ? "rgba(240, 240, 240, 0.6)"
                    : isSelected
                    ? `linear-gradient(135deg, ${lv.bg}, var(--surface))`
                    : "var(--surface)",
                  boxShadow: isSelected
                    ? `0 6px 24px ${lv.color}33, 0 0 0 4px ${lv.color}18`
                    : "0 2px 10px rgba(0,0,0,0.06)",
                  transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                  display: "flex", flexDirection: "column", justifyContent: "space-between"
                }}>
                  {/* Card top accent bar */}
                  <div style={{
                    height: 4,
                    background: isInactive
                      ? "#ef4444"
                      : `linear-gradient(90deg, ${lv.color}99, ${lv.color})`
                  }} />

                  <div style={{ padding: "16px 18px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      {/* Canteen Header & Active/Inactive Badge */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 16.5, color: "var(--fg)", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 20 }}>{c.id === "main" ? "🏫" : c.id === "hostel" ? "🏢" : "🔧"}</span>
                            <span>{cName}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, fontWeight: 500 }}>
                            📍 {cLoc}
                          </div>
                        </div>

                        {/* Status Badge: Green Active or Red/Gray Inactive */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                          <span
                            id={`canteen-status-badge-${c.id}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "4px 9px",
                              borderRadius: 12,
                              fontSize: 11.5,
                              fontWeight: 800,
                              letterSpacing: 0.2,
                              background: isInactive ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.14)",
                              color: isInactive ? "#dc2626" : "#059669",
                              border: isInactive ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(16,185,129,0.3)",
                            }}
                          >
                            <span style={{
                              width: 7, height: 7, borderRadius: "50%",
                              background: isInactive ? "#ef4444" : "#10b981",
                              display: "inline-block",
                              boxShadow: isInactive ? "0 0 6px #ef4444" : "0 0 6px #10b981"
                            }} />
                            {isInactive ? "Inactive" : "Active"}
                          </span>

                          {/* Radio Selection Indicator */}
                          {!isInactive && (
                            <div style={{
                              width: 22, height: 22, borderRadius: "50%",
                              border: `2.5px solid ${isSelected ? lv.color : "var(--line)"}`,
                              background: isSelected ? lv.color : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.2s",
                            }}>
                              {isSelected && (
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Crowd description */}
                      <div style={{ fontSize: 12, color: isInactive ? "#94a3b8" : lv.color, marginTop: 10, fontWeight: 600 }}>
                        {isInactive
                          ? (lang === "ta" ? "⚠️ இந்த உணவகம் தற்போது மூடப்பட்டுள்ளது" : "⚠️ Canteen is currently closed for orders")
                          : `${crowdEmoji[c.level] || "😌"} ${crowdDesc[lang]?.[c.level] || ""}`}
                      </div>

                      {/* Crowd pill + wait time */}
                      {!isInactive && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 8 }}>
                          <span className="pill" style={{ color: lv.color, background: lv.bg, fontSize: 11, fontWeight: 700, padding: "3px 9px" }}>
                            <i className="dot" style={{ background: lv.color }} />
                            {t(lv.key)}
                          </span>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                            <span style={{ fontSize: 20, fontWeight: 900, color: lv.color, lineHeight: 1 }}>{c.wait}</span>
                            <span style={{ fontSize: 9.5, color: "var(--muted)", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
                              {t("min")} wait
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button: [ Select Canteen ] vs [ Currently Unavailable ] */}
                    <div style={{ marginTop: 14 }}>
                      {isInactive ? (
                        <button
                          type="button"
                          disabled
                          id={`canteen-unavailable-btn-${c.id}`}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: 10,
                            border: "1px solid #cbd5e1",
                            background: "#e2e8f0",
                            color: "#64748b",
                            fontSize: 12.5,
                            fontWeight: 700,
                            cursor: "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6
                          }}
                        >
                          <span>🔒</span>
                          <span>{lang === "ta" ? "தற்போது கிடைக்கவில்லை" : "Currently Unavailable"}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          id={`canteen-select-btn-${c.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(c.id);
                            setError("");
                          }}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: 10,
                            border: isSelected ? `1.5px solid ${lv.color}` : "1.5px solid #073B30",
                            background: isSelected ? lv.color : "#073B30",
                            color: "#ffffff",
                            fontSize: 12.5,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            transition: "all 0.2s ease"
                          }}
                        >
                          <span>{isSelected ? "✓" : "→"}</span>
                          <span>
                            {isSelected
                              ? (lang === "ta" ? "தேர்ந்தெடுக்கப்பட்டது" : "Selected")
                              : (lang === "ta" ? "உணவகத்தை தேர்ந்தெடு" : "Select Canteen")}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Selected footer ribbon */}
                  {isSelected && (
                    <div style={{
                      padding: "8px 18px", background: `${lv.color}18`,
                      borderTop: `1px solid ${lv.color}33`,
                      display: "flex", alignItems: "center", gap: 6,
                      fontSize: 11.5, fontWeight: 700, color: lv.color,
                    }}>
                      ✓ {lang === "ta" ? "தேர்ந்தெடுக்கப்பட்டது — இங்கிருந்து ஆர்டர் எடுக்கப்படும்" : "Selected — order will be routed here"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div style={{
          maxWidth: 960, margin: "20px auto 0", padding: "12px 18px",
          background: "rgba(62,122,79,0.08)", borderRadius: 14,
          border: "1px dashed rgba(62,122,79,0.3)",
          display: "flex", gap: 10, alignItems: "flex-start"
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, color: "var(--basil)" }}>
              {lang === "ta" ? "செயலில் உள்ள உணவகங்கள்" : "Canteen Availability Status"}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
              {lang === "ta"
                ? "பச்சை நிற புள்ளியுள்ள உணவகங்கள் தற்போது திறக்கப்பட்டுள்ளன. ஆர்டர் செய்ய செயலில் உள்ள உணவகத்தை தேர்வு செய்யவும்."
                : "Canteens marked Active are open for student orders. Inactive canteens cannot accept new orders."}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom confirm bar */}
      <div style={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "var(--surface)",
        borderTop: "1.5px solid var(--surface-border)",
        padding: "14px 20px 18px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{ width: "100%", maxWidth: 540, display: "flex", flexDirection: "column", gap: 6 }}>
          {(error || isSelectedInactive) && (
            <div style={{
              fontSize: 12, fontWeight: 600, color: "var(--chili)",
              background: "rgba(196,62,28,0.1)", borderRadius: 8,
              padding: "6px 12px", textAlign: "center", width: "100%",
            }}>
              ⚠️ {error || (lang === "ta" ? "இந்த உணவகம் தற்போது செயல்படவில்லை. தயவுசெய்து மற்றொரு உணவகத்தை தேர்வு செய்யவும்." : "This canteen is currently inactive. Please choose another canteen.")}
            </div>
          )}
          <button
            id="canteen-confirm-btn"
            className="place-btn"
            disabled={confirming || !selectedId || isSelectedInactive}
            onClick={handleConfirm}
            style={{
              opacity: (selectedId && !isSelectedInactive) ? 1 : 0.55,
              cursor: (selectedId && !isSelectedInactive) ? "pointer" : "not-allowed",
              width: "100%",
              padding: "15px 0",
              fontSize: 16
            }}
          >
            {confirming
              ? (lang === "ta" ? "ஆர்டர் செய்கிறது..." : "Placing order...")
              : isSelectedInactive
                ? (lang === "ta" ? "செயலில் உள்ள உணவகத்தை தேர்ந்தெடுக்கவும்" : "Select an Active Canteen to Continue")
                : selectedId
                  ? (lang === "ta" ? `ஆர்டர் உறுதிசெய் · ₹${total}` : `Confirm Order · ₹${total}`)
                  : (lang === "ta" ? "உணவகத்தை தேர்ந்தெடு" : "Select a Canteen Above to Continue")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Tracking page                                                         */
/* ================================================================== */
const STATUS_LABELS = ["Placed", "Preparing", "Ready", "Picked up"];


function StockPage({ onNavigate }) {
  const { menu, updateStock, removeProduct, lang, toggleLang, t, lowStockItems } = useCanteen();
  const [filterCat, setFilterCat] = useState("all");
  const [nutritionItem, setNutritionItem] = useState(null);

  const handleRemoveItem = (id, name) => {
    if (window.confirm(lang === "ta" ? `"${name}" உணவை மெனுவிலிருந்து நீக்கவா?` : `Remove "${name}" from canteen menu?`)) {
      removeProduct(id);
    }
  };

  return (
    <>
      <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
        <img
          src="/anime-canteen-bg.jpg"
          alt="Canteen"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.88) saturate(1.15)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(20,15,10,0.55) 75%, rgba(20,15,10,0.82) 100%)" }} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <button className="back" onClick={() => onNavigate("admin-dashboard")} style={{ color: "var(--coral)" }}>
            <ArrowLeft />
          </button>
          <div>
            <div className="eyebrow" style={{ color: "rgba(255,220,120,0.9)", marginTop: 0 }}>{t("cse_canteen")} · ADMIN</div>
            <div className="h-title" style={{ color: "#fff", margin: 0 }}>{t("stock")} & Menu</div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 18 }}>
          <div style={{ color: "rgba(255,220,120,0.85)", fontSize: 10, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>ADMIN MANAGER</div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginTop: 3 }}>{lang === "ta" ? "இருப்பு & மெனு மேலாண்மை" : "Stock & Menu Manager"}</div>
        </div>
      </div>

      <div className="scroll" style={{ paddingTop: 16 }}>
        {lowStockItems.length > 0 && (
          <div className="low-stock-alert-banner">
            <AlertTriangle size={20} />
            <div>
              <div style={{ fontWeight: 800 }}>{t("low_stock_alert")}</div>
              <div style={{ fontSize: 11.5, marginTop: 2 }}>
                {t("hurry_only")}{" "}
                {lowStockItems.map((i) => `${lang === "ta" ? (i.name_ta || i.name) : i.name} (${i.stock} ${t("left")})`).join(", ")}
              </div>
            </div>
          </div>
        )}

        {/* Admin Add New Product Card with Full Nutrition Facts */}
        <AddProductCard defaultCategory="meals" />

        <div className="section-title">
          <span>{lang === "ta" ? "உணவுப் பொருட்கள் மற்றும் நேரலை இருப்பு" : "All Menu Items & Stock Controller"} ({menu.length})</span>
        </div>

        {menu.map((item) => {
          const Icon = FOOD_ICONS[item.icon] || FOOD_ICONS.thali;
          const itemName = lang === "ta" ? (item.name_ta || item.name) : item.name;
          const isLowStock = item.stock > 0 && item.stock <= 5;
          return (
            <div className="card" key={item.id} style={{ borderColor: isLowStock ? "rgba(196, 62, 28, 0.4)" : undefined, marginBottom: 10 }}>
              <div className="list-row" style={{ paddingTop: 0 }}>
                <div className="list-left">
                  <div className="food-thumb" style={{ background: isLowStock ? "linear-gradient(135deg,rgba(196,62,28,0.4),var(--chili))" : undefined }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="bold" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                      {itemName}
                      {isLowStock && (
                        <span className="low-stock-badge">
                          <AlertTriangle size={10} /> {t("low_stock_badge")}
                        </span>
                      )}
                    </div>
                    <div className="small muted" style={{ marginTop: 2 }}>
                      {t("categories." + item.category)} · ₹{item.price} · {item.kcal} kcal
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <div className="stepper" style={{ padding: "4px 6px" }}>
                    <button onClick={() => updateStock(item.id, (item.stock ?? 0) - 1)} title="Decrease stock">
                      <Minus size={13} />
                    </button>
                    <input
                      type="number"
                      className="stock-input"
                      min="0"
                      max="999"
                      value={item.stock ?? 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        updateStock(item.id, isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      onFocus={(e) => e.target.select()}
                      title="Click or type stock number directly"
                    />
                    <button onClick={() => updateStock(item.id, (item.stock ?? 0) + 1)} title="Increase stock">
                      <Plus size={13} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="stock-quick-add"
                    onClick={() => updateStock(item.id, (item.stock ?? 0) + 10)}
                    title="Add +10 stock"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    className="stock-quick-add"
                    onClick={() => updateStock(item.id, (item.stock ?? 0) + 50)}
                    title="Add +50 stock"
                  >
                    +50
                  </button>
                  <button
                    type="button"
                    className="cta-mini"
                    style={{ background: "rgba(196,62,28,0.12)", color: "var(--rose)", fontSize: 11, padding: "5px 8px" }}
                    onClick={() => handleRemoveItem(item.id, itemName)}
                    title="Delete dish from canteen menu"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ================================================================== */
/* Crowd page — live crowd monitoring & update                          */
/* ================================================================== */
function CrowdPage({ onNavigate }) {
  return (
    <RefactoredCrowdPage
      onNavigate={onNavigate}
      useCanteenHook={useCanteen}
    />
  );
}
function OrderTrackerDashboard() {
  const { orderHistory, lang, t } = useCanteen();

  const totalOrders = orderHistory.length;
  const deliveredOrders = orderHistory.filter((o) => o.status === 3).length;
  const inProgressOrders = orderHistory.filter((o) => o.status >= 0 && o.status < 3).length;
  const totalValue = orderHistory
    .filter((o) => o.status === 3)
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="order-tracker-dashboard">
      <div className="ot-header">
        <div className="ot-title">📊 {t("total_orders_tracker")}</div>
        <div className="ot-subtitle">
          {lang === "ta"
            ? "நேரலை உணவு விநியோகம் மற்றும் ஆர்டர்களின் பதிவு"
            : "Real-time order intake and delivery analytics"}
        </div>
      </div>

      <div className="ot-stats-grid">
        <div className="ot-stat-card">
          <div className="ot-stat-value" style={{ color: "var(--coral-d)" }}>{totalOrders}</div>
          <div className="ot-stat-label">{t("orders_taken")}</div>
        </div>
        <div className="ot-stat-card">
          <div className="ot-stat-value" style={{ color: "var(--emerald)" }}>{deliveredOrders}</div>
          <div className="ot-stat-label">{t("orders_delivered")}</div>
        </div>
        <div className="ot-stat-card">
          <div className="ot-stat-value" style={{ color: "var(--amber)" }}>{inProgressOrders}</div>
          <div className="ot-stat-label">{t("active_orders")}</div>
        </div>
        <div className="ot-stat-card">
          <div className="ot-stat-value" style={{ color: "var(--violet)" }}>₹{totalValue}</div>
          <div className="ot-stat-label">{t("total_revenue_served")}</div>
        </div>
      </div>

      <div className="ot-history-section">
        <div className="ot-history-title">📜 {t("order_history_log")}</div>
        <div className="ot-history-list">
          {orderHistory.map((item) => {
            const isDelivered = item.status === 3;
            const isCancelled = item.status === -1;
            const statusLabel = isDelivered
              ? (lang === "ta" ? "✅ வழங்கப்பட்டது" : "✅ Delivered")
              : isCancelled
              ? (lang === "ta" ? "❌ ரத்து செய்யப்பட்டது" : "❌ Cancelled")
              : (lang === "ta" ? "⏳ தயாரிப்பில்" : "⏳ In Progress");

            return (
              <div className="ot-history-card" key={item.id}>
                <div className="ot-card-top">
                  <div>
                    <span className="ot-token">{item.token}</span>
                    <span className="ot-id">{item.id}</span>
                  </div>
                  <span
                    className="ot-badge"
                    style={{
                      background: isDelivered ? "rgba(62,122,79,0.12)" : isCancelled ? "rgba(196,62,28,0.12)" : "rgba(204,122,0,0.12)",
                      color: isDelivered ? "var(--emerald)" : isCancelled ? "var(--rose)" : "var(--amber)",
                    }}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="ot-card-items">
                  {item.canteenName && (
                    <span style={{ display: "block", fontSize: 10.5, color: "var(--coral-d)", fontWeight: 600, marginBottom: 3 }}>📍 {item.canteenName}</span>
                  )}
                  {item.items.map((it, idx) => (
                    <span key={idx}>
                      {it.qty}× {lang === "ta" ? (it.name_ta || it.name) : it.name}
                      {idx < item.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>

                <div className="ot-card-bottom">
                  <span className="ot-time">
                    🕒 {new Date(item.issuedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="ot-price">₹{item.total} ({item.paymentMode})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TrackingPage({ onNavigate }) {
  const { user, order, orderHistory, advanceOrderStatus, cancelOrder, lang, t, toggleLang } = useCanteen();
  const [notify, setNotify] = useState(true);

  // 3D Tilt for Token Card
  const tiltToken = use3DTilt(8, 1.02);

  const STATUS_KEYS = ["step_received", "step_preparing", "step_ready", "step_completed"];

  if (!order) {
    return (
      <>
        <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
          <img
            src="/anime-canteen-bg.jpg"
            alt="Canteen"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.88) saturate(1.15)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(20,15,10,0.55) 75%, rgba(20,15,10,0.82) 100%)" }} />
          <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <button className="back" onClick={() => onNavigate("home")} style={{ color: "var(--coral)" }}>
              <ArrowLeft />
            </button>
            <div>
              <div className="eyebrow" style={{ color: "var(--coral-d)", marginTop: 0 }}>
                {lang === "ta" ? "கல்லூரி உணவகம்" : "CAMPUS CANTEEN"}
              </div>
              <div className="h-title" style={{ color: "#fff", margin: 0 }}>{t("order_tracking")}</div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 32, left: 18 }}>
            <div style={{ color: "var(--coral)", fontSize: 10, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>LIVE STATUS</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginTop: 3 }}>Track your order 📦</div>
          </div>
        </div>
        <div className="scroll" style={{ paddingTop: 20 }}>
          <div className="empty-state cart-empty-state" style={{ minHeight: "auto", padding: "40px 20px" }}>
            <div className="empty-badge">📦</div>
            <div className="empty-title">{t("no_active_order")}</div>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: "8px 0 16px", maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
              {lang === "ta"
                ? "நீங்கள் உணவு ஆர்டர் செய்தவுடன் உங்கள் நேரலை டோக்கன் மற்றும் தயாரிப்பு நிலை இங்கே கண்காணிக்கப்படும்."
                : "Once you place an order, your live pickup token and preparation status will appear here."}
            </p>
            <button className="empty-link" onClick={() => onNavigate("menu")}>
              {t("order_something")} <span>→</span>
            </button>
          </div>

          {/* Customer's own previous order receipts if any */}
          {orderHistory.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div className="section-title">
                <span>🧾 {lang === "ta" ? "உங்கள் முந்தைய ஆர்டர்கள்" : "Your Recent Orders"}</span>
              </div>
              <div className="ot-history-list">
                {orderHistory.slice(0, 3).map((item) => {
                  const isDelivered = item.status === 3;
                  const isCancelled = item.status === -1;
                  const statusLabel = isDelivered
                    ? (lang === "ta" ? "✅ வழங்கப்பட்டது" : "✅ Delivered")
                    : isCancelled
                    ? (lang === "ta" ? "❌ ரத்து செய்யப்பட்டது" : "❌ Cancelled")
                    : (lang === "ta" ? "⏳ தயாரிப்பில்" : "⏳ In Progress");

                  return (
                    <div className="ot-history-card" key={item.id}>
                      <div className="ot-card-top">
                        <div>
                          <span className="ot-token">{item.token}</span>
                          <span className="ot-id">{item.id}</span>
                        </div>
                        <span
                          className="ot-badge"
                          style={{
                            background: isDelivered ? "rgba(62,122,79,0.12)" : isCancelled ? "rgba(196,62,28,0.12)" : "rgba(204,122,0,0.12)",
                            color: isDelivered ? "var(--emerald)" : isCancelled ? "var(--rose)" : "var(--amber)",
                          }}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="ot-card-items">
                        {item.canteenName && (
                          <span style={{ display: "block", fontSize: 10.5, color: "var(--coral-d)", fontWeight: 600, marginBottom: 3 }}>📍 {item.canteenName}</span>
                        )}
                        {item.items.map((it, idx) => (
                          <span key={idx}>
                            {it.qty}× {lang === "ta" ? (it.name_ta || it.name) : it.name}
                            {idx < item.items.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>

                      <div className="ot-card-bottom">
                        <span className="ot-time">
                          🕒 {new Date(item.issuedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="ot-price">₹{item.total} ({item.paymentMode})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  const handleCancel = () => {
    if (window.confirm(lang === "ta" ? "இந்த ஆர்டரை ரத்துசெய்யவா?" : "Cancel this order?")) {
      cancelOrder();
      onNavigate("home");
    }
  };

  return (
    <>
      <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
        <img
          src="/anime-canteen-bg.jpg"
          alt="Canteen"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.88) saturate(1.15)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(20,15,10,0.55) 75%, rgba(20,15,10,0.82) 100%)" }} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <button className="back" onClick={() => onNavigate("home")} style={{ color: "var(--coral)" }}>
            <ArrowLeft />
          </button>
          <div>
            <div className="eyebrow" style={{ color: "var(--coral-d)", marginTop: 0 }}>{order?.canteenName || "CAMPUS CANTEEN"}</div>
            <div className="h-title" style={{ color: "#fff", margin: 0 }}>{t("order_tracking")}</div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 32, left: 18 }}>
          <div style={{ color: "var(--coral)", fontSize: 10, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>LIVE STATUS</div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginTop: 3 }}>{order.id} · COUNTER {order.counter}</div>
        </div>
      </div>

      <div
        className="token-card"
        ref={tiltToken.ref}
        style={tiltToken.style}
        onMouseMove={tiltToken.onMouseMove}
        onMouseLeave={tiltToken.onMouseLeave}
      >
        <div className="token-label">{t("pickup_token")}</div>
        <div className="token-number">{order.token}</div>
        <div className="token-tear" />
        <div className="token-meta">
          <div>
            {t("issued")}
            <br />
            <b>{new Date(order.issuedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</b>
          </div>
          <div>
            {t("counter")}
            <br />
            <b>#{order.counter}</b>
          </div>
          <div>
            {t("paid_via")}
            <br />
            <b>{order.paymentMode}</b>
          </div>
        </div>
      </div>

      <div className="scroll" style={{ paddingTop: 22 }}>
        <div className="status-track">
          {STATUS_KEYS.map((key, i) => (
            <div className={"step" + (i > order.status ? " pending" : "")} key={key}>
              <div className="bar" />
              <div className="node">{i < order.status ? <Check size={12} /> : i + 1}</div>
              <div className="lbl">{t(key)}</div>
            </div>
          ))}
        </div>

        {order.status < 3 ? (
          <button className="simulate-btn" onClick={advanceOrderStatus}>
            {t("simulate_update")}
          </button>
        ) : (
          <>
            <div className="done-banner">{t("order_picked_up")}</div>
            <div className="order-rate-card">
              <div className="order-rate-title">
                ⭐ {lang === "ta" ? "உங்கள் உணவை மதிப்பிடுங்கள்!" : "Rate your meal & experience!"}
              </div>
              <div className="order-rate-sub">
                {lang === "ta"
                  ? "உங்கள் கருத்து உணவக சேவையை மேம்படுத்த உதவுகிறது."
                  : "Help us improve canteen quality & service."}
              </div>
              <button
                className="order-rate-btn"
                onClick={() => onNavigate("feedback")}
              >
                💬 {lang === "ta" ? "கருத்து வழங்கவும் →" : "Leave Feedback →"}
              </button>
            </div>
          </>
        )}

        <div className="section-title">{t("order_summary")}</div>
        <div className="card">
          {order.items.map((l) => {
            const itemName = lang === "ta" ? (l.name_ta || l.name) : l.name;
            return (
              <div className="r-row" key={l.id}>
                <span>
                  {l.qty}× {itemName}
                </span>
                <span className="mono">₹{l.qty * l.price}</span>
              </div>
            );
          })}
          {order.canteenName && (
            <div className="r-row">
              <span>📍 {lang === "ta" ? "உணவகம்" : "Canteen"}</span>
              <span style={{ fontWeight: 700, color: "var(--coral-d)" }}>{order.canteenName}{order.canteenLoc ? ` · ${order.canteenLoc}` : ""}</span>
            </div>
          )}
          <div className="r-row total">
            <span>{t("paid_via")} {order.paymentMode}</span>
            <span className="mono">₹{order.total}</span>
          </div>
        </div>

        <div className="toggle-row">
          <div>
            <div className="t-label">{t("notify_ready")}</div>
            <div className="t-sub">{notify ? (lang === "ta" ? "அறிவிப்பு இயக்கப்பட்ட உள்ளது" : "Push alert + counter display") : (lang === "ta" ? "அறிவிப்பு முடக்கப்பட்டது" : "Notifications muted")}</div>
          </div>
          <button className={"switch" + (notify ? " on" : "")} onClick={() => setNotify((n) => !n)} />
        </div>

        {order.status < 3 && (
          <div className="cancel-link" onClick={handleCancel}>
            {t("cancel_order")}
          </div>
        )}
      </div>
    </>
  );
}
/* ================================================================== */
/* Feedback page                                                         */
/* ================================================================== */
function FeedbackPage({ onNavigate }) {
  return (
    <RefactoredFeedbackPage
      onNavigate={onNavigate}
      useCanteenHook={useCanteen}
    />
  );
}
/* ================================================================== */
/* Admin Dashboard Page                                                */
/* ================================================================== */
function AdminDashboardPage({ onNavigate }) {
  return (
    <RefactoredAdminDashboard
      onNavigate={onNavigate}
      useCanteenHook={useCanteen}
    />
  );
}

/* ================================================================== */
/* Kitchen Display System (KDS) Page                                    */
/* ================================================================== */
function KitchenOrdersPage({ onNavigate }) {
  const { orderHistory, setOrderHistory, updateOrderStatus, lang, t } = useCanteen();
  const [filter, setFilter] = useState("active");

  const STATUS_LABELS = {
    0: { en: "Placed", ta: "ஆர்டர் செய்யப்பட்டது", bg: "rgba(204,122,0,0.14)", color: "var(--amber)" },
    1: { en: "Preparing", ta: "தயாராகிறது", bg: "rgba(139,92,246,0.14)", color: "var(--violet)" },
    2: { en: "Ready for Pickup", ta: "பெறத் தயார்", bg: "rgba(62,122,79,0.14)", color: "var(--basil)" },
    3: { en: "Completed", ta: "நிறைவடைந்தது", bg: "rgba(16,185,129,0.14)", color: "var(--emerald)" },
    "-1": { en: "Cancelled", ta: "ரத்து செய்யப்பட்டது", bg: "rgba(196,62,28,0.14)", color: "var(--rose)" },
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    if (updateOrderStatus) {
      updateOrderStatus(orderId, newStatus);
    } else {
      setOrderHistory((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  const filteredOrders = useMemo(() => {
    if (filter === "active") return orderHistory.filter((o) => o.status >= 0 && o.status < 3);
    if (filter === "0") return orderHistory.filter((o) => o.status === 0);
    if (filter === "1") return orderHistory.filter((o) => o.status === 1);
    if (filter === "2") return orderHistory.filter((o) => o.status === 2);
    if (filter === "3") return orderHistory.filter((o) => o.status === 3);
    return orderHistory;
  }, [orderHistory, filter]);

  return (
    <>
      <div className="header cart-header" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="back" onClick={() => onNavigate("admin-dashboard")}>
          <ArrowLeft />
        </button>
        <div className="cart-head-copy" style={{ flex: 1 }}>
          <div className="h-title">👨‍🍳 {lang === "ta" ? "சமையலறை ஆர்டர்கள் KDS" : "Kitchen Display System"}</div>
          <div className="eyebrow">{t("cse_canteen")} · COUNTER #2</div>
        </div>
      </div>

      <div className="scroll" style={{ paddingTop: 16 }}>
        <div className="cats" style={{ marginBottom: 16 }}>
          {[
            { id: "active", label: lang === "ta" ? "செயலில் உள்ளவை ⏳" : "Active Kitchen Queue ⏳" },
            { id: "0", label: lang === "ta" ? "புதியவை (Placed)" : "Placed Orders" },
            { id: "1", label: lang === "ta" ? "தயாரிப்பில்" : "Preparing" },
            { id: "2", label: lang === "ta" ? "பெறத் தயார்" : "Ready for Pickup" },
            { id: "3", label: lang === "ta" ? "முடிந்தவை" : "Completed" },
            { id: "all", label: lang === "ta" ? "அனைத்து ஆர்டர்களும்" : "All Orders Log" },
          ].map((c) => (
            <button
              key={c.id}
              className={"chip" + (filter === c.id ? " active" : "")}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state cart-empty-state" style={{ minHeight: "auto", padding: "40px 20px" }}>
            <div className="empty-badge">👨‍🍳</div>
            <div className="empty-title">{lang === "ta" ? "ஆர்டர்கள் எதுவும் இல்லை" : "No orders found in this view."}</div>
          </div>
        ) : (
          <div className="admin-orders-grid">
            {filteredOrders.map((ord) => {
              const st = STATUS_LABELS[ord.status] || STATUS_LABELS[0];
              return (
                <div key={ord.id} className="card admin-kds-card">
                  <div className="admin-order-top">
                    <div>
                      <span className="ot-token">{ord.token}</span>
                      <span className="ot-id">{ord.id}</span>
                    </div>
                    <span className="ot-badge" style={{ background: st.bg, color: st.color }}>
                      {st[lang]}
                    </span>
                  </div>

                  <div className="admin-order-items" style={{ margin: "14px 0" }}>
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="admin-order-item-row">
                        <span className="bold" style={{ color: "var(--coral-d)" }}>{it.qty}×</span> {lang === "ta" ? (it.name_ta || it.name) : it.name}
                        <span className="mono muted"> — ₹{it.price * it.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="admin-order-bottom">
                    <div className="muted small">
                      🕒 {new Date(ord.issuedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      <br />
                      <b>{ord.paymentMode}</b> · ₹{ord.total}
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {ord.status === 0 && (
                        <button
                          className="cta-mini"
                          style={{ background: "var(--violet)", color: "#fff", fontSize: 11, padding: "6px 12px" }}
                          onClick={() => handleUpdateOrderStatus(ord.id, 1)}
                        >
                          ▶ {lang === "ta" ? "தயாரி" : "Start Prep"}
                        </button>
                      )}
                      {ord.status === 1 && (
                        <button
                          className="cta-mini"
                          style={{ background: "var(--basil)", color: "#fff", fontSize: 11, padding: "6px 12px" }}
                          onClick={() => handleUpdateOrderStatus(ord.id, 2)}
                        >
                          🔔 {lang === "ta" ? "தயாரானது" : "Mark Ready"}
                        </button>
                      )}
                      {ord.status === 2 && (
                        <button
                          className="cta-mini"
                          style={{ background: "var(--emerald)", color: "#fff", fontSize: 11, padding: "6px 12px" }}
                          onClick={() => handleUpdateOrderStatus(ord.id, 3)}
                        >
                          ✅ {lang === "ta" ? "வழங்கப்பட்டது" : "Complete"}
                        </button>
                      )}
                      {ord.status < 3 && ord.status >= 0 && (
                        <button
                          className="cta-mini"
                          style={{ background: "rgba(196,62,28,0.15)", color: "var(--rose)", fontSize: 11, padding: "6px 10px" }}
                          onClick={() => handleUpdateOrderStatus(ord.id, -1)}
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ================================================================== */
/* Helper to strip markdown and symbols for natural voice synthesis   */
/* ================================================================== */
function stripMarkdownForSpeech(mdText, targetLang = "en") {
  if (!mdText) return "";
  let text = mdText
    .replace(/[*#_~`>|•]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/\s+/g, " ");

  if (targetLang === "ta") {
    text = text
      .replace(/₹\s*(\d+)/g, "$1 ரூபாய்")
      .replace(/₹/g, "ரூபாய் ")
      .replace(/:/g, " ")
      .replace(/~/g, " ஏறத்தாழ ")
      .replace(/mins/gi, " நிமிடங்கள்")
      .replace(/min/gi, " நிமிடம்")
      .replace(/kcal/gi, " கலோரி")
      .replace(/qty/gi, " எண்ணிக்கை")
      .replace(/stock/gi, " இருப்பு");
  } else {
    text = text
      .replace(/₹\s*(\d+)/g, "$1 rupees")
      .replace(/₹/g, "rupees ")
      .replace(/mins/gi, "minutes")
      .replace(/min/gi, "minute")
      .replace(/kcal/gi, "calories");
  }

  return text.trim();
}

/* ================================================================== */
/* Helper to parse quantity numbers in English & Tamil                */
/* ================================================================== */
function parseVoiceQty(word) {
  if (!word) return 1;
  const num = parseInt(word, 10);
  if (!isNaN(num) && num > 0) return num;
  const map = {
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    "ஒரு": 1, "இரண்டு": 2, "ரெண்டு": 2, "மூன்று": 3, "நான்கு": 4, "ஐந்து": 5, "ஆறு": 6, "ஏழு": 7, "எட்டு": 8, "ஒன்பது": 9, "பத்து": 10
  };
  return map[String(word).toLowerCase().trim()] || 1;
}

/* ================================================================== */
/* Canteen Chef AI Chatbot Engine & Voice Action Processor             */
/* ================================================================== */
function generateBotResponse(userText, contextState, appState) {
  const {
    menu,
    canteens,
    order,
    orderHistory,
    addToCart,
    setQty,
    clearCart,
    cart,
    cartLines,
    cartCount,
    cartTotal,
    walletBalance,
    placeOrder,
    cancelOrder,
    lang,
    setLang,
    toggleLang,
    t,
    onNavigate,
    showAlert,
    setAutoSpeak,
    stopSpeaking
  } = appState;

  const rawLower = (userText || "").toLowerCase().trim();
  const lower = rawLower.replace(/[.,/#!$%^&*;:{}=`~()?\-]/g, " ").replace(/\s+/g, " ").trim();
  const isTa = lang === "ta";

  // Helper to match a menu item by spoken words or keywords
  const findMenuItem = (str) => {
    if (!str) return null;
    const clean = str.toLowerCase().trim();
    // Direct match against known names and IDs
    for (const m of menu) {
      const enName = m.name.toLowerCase();
      const taName = (m.name_ta || "").toLowerCase();
      const idClean = m.id.replace(/_/g, " ").toLowerCase();

      if (clean.includes(enName) || clean.includes(taName) || clean.includes(idClean)) return m;
      if (enName.includes(clean) || (taName && taName.includes(clean))) return m;
    }
    // Keyword aliases
    if (/biryani|briyani|biriyani|chicken rice|பிரியாணி|கோழி பிரியாணி/i.test(clean)) {
      return menu.find((m) => m.id === "chicken_biryani") || menu[1];
    }
    if (/thali|meals|lunch|curry meals|சாப்பாடு|காய்கறி உணவு|மீல்ஸ்/i.test(clean)) {
      return menu.find((m) => m.id === "veg_thali") || menu[0];
    }
    if (/paneer|wrap|roll|frankie|பன்னீர்|ரோல்|ராப்/i.test(clean)) {
      return menu.find((m) => m.id === "paneer_wrap") || menu[2];
    }
    if (/masala chai|chai|tea|masala tea|டீ|மசாலா டீ|தேநீர்/i.test(clean)) {
      return menu.find((m) => m.id === "masala_chai") || menu[3];
    }
    if (/filter coffee|coffee|kaapi|காபி|பில்டர் காபி/i.test(clean)) {
      return menu.find((m) => m.id === "filter_coffee") || menu[4];
    }
    if (/brownie|brownies|cake|pastry|dessert|chocolate|பிரவுனி/i.test(clean)) {
      return menu.find((m) => m.id === "brownie") || menu[5];
    }
    if (/orange juice|orange|ஆரஞ்சு ஜூஸ்|ஆரஞ்சு/i.test(clean)) {
      return menu.find((m) => m.id === "orange_juice");
    }
    if (/mango juice|mango shake|mango|மாம்பழ ஜூஸ்|மாம்பழம்/i.test(clean)) {
      return menu.find((m) => m.id === "mango_juice");
    }
    if (/watermelon juice|watermelon|தர்பூசணி ஜூஸ்|தர்பூசணி/i.test(clean)) {
      return menu.find((m) => m.id === "watermelon_juice");
    }
    if (/lime mint|lime cooler|lemon juice|lime juice|எலுமிச்சை புதினா/i.test(clean)) {
      return menu.find((m) => m.id === "lime_mint");
    }
    if (/juice|fresh juice|ஜூஸ்|பழச்சாறு/i.test(clean)) {
      return menu.find((m) => m.category === "juice") || menu.find((m) => m.id === "orange_juice");
    }
    return null;
  };

  // =========================================================================
  // 1. LANGUAGE SWITCHING VIA VOICE COMMAND
  // =========================================================================
  if (
    /^(switch to tamil|speak in tamil|speak tamil|change to tamil|tamil please|tamil|தமிழுக்கு மாற்று|தமிழில் பேசு|தமிழ்|தமிழுக்கு போ)$/i.test(lower) ||
    lower.includes("switch to tamil") || lower.includes("speak in tamil") || lower.includes("தமிழில் பேசு") || lower.includes("தமிழுக்கு மாற்று")
  ) {
    if (setLang) setLang("ta");
    return {
      text: "வணக்கம்! 👨‍🍳✨ இப்போது நான் தமிழில் பேசுவேன். என்ன உணவு சாப்பிட விரும்புகிறீர்கள்?",
      suggestions: ["🎙️ 2 மசாலா டீ ஆர்டர் செய்", "🍽️ இன்றைய மெனு", "👥 கூட்டம் எப்படி இருக்கு?", "📦 பிரியாணி இருக்கா?"]
    };
  }

  if (
    /^(switch to english|speak in english|speak english|change to english|english please|english|ஆங்கிலத்தில் பேசு|ஆங்கிலத்திற்கு மாற்று)$/i.test(lower) ||
    lower.includes("switch to english") || lower.includes("speak in english") || lower.includes("ஆங்கிலத்தில் பேசு")
  ) {
    if (setLang) setLang("en");
    return {
      text: "Hello! 👨‍🍳✨ Switched to English. What would you like to order today?",
      suggestions: ["🎙️ Order 2 Masala Chai", "🍽️ Today's Menu", "👥 Check Crowd", "🛒 View Cart"]
    };
  }

  // =========================================================================
  // 2. VOICE MUTE / UNMUTE / AUDIO CONTROLS
  // =========================================================================
  if (
    /^(mute|stop talking|stop speaking|be quiet|turn off voice|disable voice|sound off|சத்தம் நிறுத்து|குரலை நிறுத்து)$/i.test(lower) ||
    lower.includes("stop speaking") || lower.includes("turn off voice") || lower.includes("mute voice")
  ) {
    if (stopSpeaking) stopSpeaking();
    if (setAutoSpeak) setAutoSpeak(false);
    return {
      text: isTa
        ? "🔇 குரல் ஒலி முடக்கப்பட்டது. இனி உரையாக மட்டுமே பதில் அளிப்பேன். மீண்டும் இயக்க 'Turn on voice' என்று சொல்லவும்."
        : "🔇 Voice output muted. I will now respond with text only. Say 'Turn on voice' whenever you'd like me to speak again.",
      suggestions: ["🔊 Turn on voice", "🍽️ Today's Menu", "🛒 View Cart"]
    };
  }

  if (
    /^(unmute|turn on voice|enable voice|speak again|sound on|குரலை இயக்கு|பேசு)$/i.test(lower) ||
    lower.includes("turn on voice") || lower.includes("enable voice") || lower.includes("unmute")
  ) {
    if (setAutoSpeak) setAutoSpeak(true);
    return {
      text: isTa
        ? "🔊 குரல் ஒலி இயக்கப்பட்டது! 👨‍🍳 நான் இப்போது உங்களுடன் பேசுகிறேன்!"
        : "🔊 Voice output is now ON! 👨‍🍳 I'm ready to speak all responses aloud.",
      suggestions: ["🍽️ Today's Menu", "🎙️ Order Masala Dosa", "👥 Check Crowd"]
    };
  }

  // =========================================================================
  // 3. DIRECT APP NAVIGATION COMMANDS
  // =========================================================================
  if (
    /^(go to menu|open menu|show menu|browse food|browse menu|take me to menu|menu page|மெனுவுக்கு போ|மெனு திற|மெனு பக்கம்)$/i.test(lower) ||
    lower.includes("go to menu") || lower.includes("open menu") || lower.includes("browse menu") || lower.includes("மெனுவுக்கு போ")
  ) {
    if (onNavigate) onNavigate("menu");
    return {
      text: isTa
        ? "🍽️ மெனு பக்கத்திற்கு செல்கிறோம்! கேண்டீனில் கிடைக்கும் அனைத்து உணவுகளையும் இங்கே பார்க்கலாம்."
        : "🍽️ Navigating to the Canteen Menu! Here are all the fresh items and categories ready to order.",
      actions: [{ label: "🍽️ Browse Menu", navigate: "menu" }],
      suggestions: ["🛒 View Cart", "👥 Check Crowd", "💡 Food Recommendations"]
    };
  }

  if (
    /^(go to cart|open cart|show cart|view cart|my cart|cart page|checkout page|கார்ட்டுக்கு போ|கார்ட் காட்டு|கார்ட் திற|கார்ட் பக்கம்)$/i.test(lower) ||
    lower.includes("go to cart") || lower.includes("open cart") || lower.includes("view cart") || lower.includes("கார்ட்டுக்கு போ")
  ) {
    if (onNavigate) onNavigate("cart");
    return {
      text: isTa
        ? `🛒 கார்ட் பக்கத்திற்கு செல்கிறோம்! உங்களிடம் **${cartCount}** பொருட்கள் உள்ளன (மொத்தம்: ₹${cartTotal}).`
        : `🛒 Taking you to your cart! You currently have **${cartCount} items** with a total of **₹${cartTotal}**.`,
      actions: [{ label: "🛒 View Cart & Pay", navigate: "cart" }],
      suggestions: ["🍽️ Add More Food", "🎫 Track Order"]
    };
  }

  if (
    /^(check crowd|go to crowd|open crowd|crowd page|live crowd|campus board|கூட்டம் பார்க்க|கூட்ட பக்கம்|கூட்டம் போ)$/i.test(lower) ||
    lower.includes("go to crowd") || lower.includes("open crowd") || lower.includes("crowd page") || lower.includes("கூட்ட பக்கம்")
  ) {
    if (onNavigate) onNavigate("crowd");
    return {
      text: isTa
        ? "👥 நேரலை கூட்ட பக்கத்திற்கு செல்கிறோம்! அனைத்து உணவகங்களின் காத்திருப்பு நேரத்தை இங்கே பார்க்கலாம்."
        : "👥 Opening Campus Live Crowd Board! Check live wait times and queue statuses across all campus canteens.",
      actions: [{ label: "👥 Live Crowd Board", navigate: "crowd" }],
      suggestions: ["🍽️ Today's Menu", "🛒 View Cart"]
    };
  }

  if (
    /^(track order|track my order|where is my order|tracking page|track token|டிராக்கிங் போ|ஆர்டரை டிராக் செய்|டோக்கன் பக்கம்)$/i.test(lower) ||
    lower.includes("track my order") || lower.includes("go to tracking") || lower.includes("tracking page")
  ) {
    if (onNavigate) onNavigate("tracking");
    return {
      text: isTa
        ? "🎫 ஆர்டர் டிராக்கிங் பக்கத்திற்கு செல்கிறோம்! உங்கள் டோக்கன் நிலையை நிகழ்நேரத்தில் கண்காணிக்கலாம்."
        : "🎫 Taking you to the live Order Tracking page! Track your token preparation and counter status.",
      actions: [{ label: "🎫 Track Order", navigate: "tracking" }],
      suggestions: ["🍽️ Today's Menu", "👥 Check Crowd"]
    };
  }

  if (
    /^(go to feedback|give feedback|feedback page|reviews|ratings|கருத்து பக்கம்|ரிவியூ பக்கம்)$/i.test(lower) ||
    lower.includes("go to feedback") || lower.includes("feedback page") || lower.includes("give review")
  ) {
    if (onNavigate) onNavigate("feedback");
    return {
      text: isTa
        ? "⭐ கருத்துக்கள் மற்றும் மதிப்புரைகள் பக்கத்திற்கு செல்கிறோம்! உங்கள் உணவின் அனுபவத்தை பகிருங்கள்."
        : "⭐ Opening the Reviews & Feedback page! Share your food ratings and campus dining feedback.",
      actions: [{ label: "⭐ View Feedback", navigate: "feedback" }],
      suggestions: ["🍽️ Today's Menu", "🛒 View Cart"]
    };
  }

  if (
    /^(go to home|go home|home page|back to home|ஹோம் போ|முகப்பு|ஹோம்)$/i.test(lower) ||
    lower.includes("go to home") || lower.includes("back to home") || lower.includes("go home")
  ) {
    if (onNavigate) onNavigate("home");
    return {
      text: isTa
        ? "🏠 முதன்மை முகப்பு பக்கத்திற்கு செல்கிறோம்! உங்களுக்கு உதவ நான் எப்போதும் தயார்."
        : "🏠 Navigating back to the Home Dashboard! Let me know if you'd like to order anything.",
      actions: [{ label: "🏠 Home", navigate: "home" }],
      suggestions: ["🍽️ Today's Menu", "👥 Crowd Status", "🛒 View Cart"]
    };
  }

  // =========================================================================
  // 4. CART OPERATIONS: CLEAR CART / REMOVE ITEMS / VIEW CART
  // =========================================================================
  if (
    /^(clear cart|empty cart|clear my cart|delete all items|empty my cart|remove all|கார்ட்டை காலி செய்|கார்ட்டை அழி|எல்லாத்தையும் நீக்கு)$/i.test(lower) ||
    lower.includes("clear my cart") || lower.includes("clear cart") || lower.includes("empty cart") || lower.includes("கார்ட்டை காலி செய்")
  ) {
    if (clearCart) clearCart();
    return {
      text: isTa
        ? "🗑️ உங்கள் கார்ட் முற்றிலும் காலி செய்யப்பட்டது! புதிய உணவுகளை சேர்க்க மெனுவை பார்க்கவும்."
        : "🗑️ Your cart has been completely cleared! Would you like to check the menu for fresh items?",
      actions: [{ label: "🍽️ Browse Menu", navigate: "menu" }],
      suggestions: ["🍽️ Today's Menu", "🌶️ Spicy food", "👥 Crowd Status"]
    };
  }

  if (
    lower.startsWith("remove") || lower.startsWith("delete") || lower.startsWith("take out") ||
    lower.includes("remove from cart") || lower.includes("delete from cart") || lower.includes("நீக்கு")
  ) {
    const itemToRemove = findMenuItem(lower);
    if (itemToRemove && setQty) {
      setQty(itemToRemove.id, 0);
      const itemName = isTa ? (itemToRemove.name_ta || itemToRemove.name) : itemToRemove.name;
      return {
        text: isTa
          ? `🗑️ **${itemName}** உங்கள் கார்ட்டிலிருந்து நீக்கப்பட்டது.`
          : `🗑️ Removed **${itemName}** from your cart.`,
        actions: [{ label: "🛒 View Cart", navigate: "cart" }, { label: "🍽️ Browse Menu", navigate: "menu" }],
        suggestions: ["🛒 View Cart", "🍽️ Today's Menu"]
      };
    }
  }

  if (
    /^(what is in my cart|show my cart|whats in my cart|view my cart|cart summary|how much is my bill|cart total|என் கார்ட்டில் என்ன இருக்கு|கார்ட் காட்டு)$/i.test(lower) ||
    lower.includes("what is in my cart") || lower.includes("whats in my cart") || lower.includes("in my cart") || lower.includes("cart total")
  ) {
    if (!cartLines || cartLines.length === 0) {
      return {
        text: isTa
          ? "🛒 உங்கள் கார்ட் தற்போது காலியாக உள்ளது. சுவையான உணவை கார்ட்டில் சேர்க்க '2 மசாலா டீ ஆர்டர் செய்' என்று பேசவும்!"
          : "🛒 Your cart is currently empty! Speak an order like 'Add 2 Masala Chai' or 'Order Veg Thali' to get started.",
        actions: [{ label: "🍽️ Browse Menu", navigate: "menu" }],
        suggestions: ["🎙️ Order Masala Chai", "🎙️ Order Biryani", "🍽️ Today's Menu"]
      };
    }

    const linesSummary = cartLines.map((l) => `• **${l.qty}x** ${isTa ? (l.name_ta || l.name) : l.name} — ₹${l.qty * l.price}`).join("\n");
    return {
      text: isTa
        ? `🛒 **உங்கள் கார்ட் விவரம்** (${cartCount} பொருட்கள்):\n\n${linesSummary}\n\n💰 **மொத்த தொகை**: **₹${cartTotal}**\n\nஆர்டரை முடிக்க விரும்புகிறீர்களா?`
        : `🛒 **Your Current Cart** (${cartCount} items):\n\n${linesSummary}\n\n💰 **Total Bill**: **₹${cartTotal}**\n\nReady to proceed to checkout?`,
      actions: [
        { label: "🛒 Checkout & Pay", navigate: "cart" },
        { label: "🍽️ Add More Items", navigate: "menu" }
      ],
      suggestions: ["🛒 Checkout Now", "🗑️ Clear Cart", "👥 Check Crowd"]
    };
  }

  // =========================================================================
  // 5. CHECKOUT & PAYMENT COMMANDS
  // =========================================================================
  if (
    /^(checkout|place order|pay now|pay bill|pay with wallet|pay with upi|complete order|ஆர்டரை முடி|பணம் செலுத்து|ஆர்டர் செய்)$/i.test(lower) ||
    lower.includes("proceed to checkout") || lower.includes("pay now") || lower.includes("pay bill")
  ) {
    if (!cartLines || cartLines.length === 0) {
      return {
        text: isTa
          ? "🛒 உங்கள் கார்ட் காலியாக உள்ளது! ஆர்டர் செய்ய முதலில் உணவை கார்ட்டில் சேர்க்கவும்."
          : "🛒 Your cart is currently empty! Please add some delicious food to your cart before checking out.",
        actions: [{ label: "🍽️ Browse Menu", navigate: "menu" }],
        suggestions: ["🎙️ Order 2 Masala Chai", "🍽️ Today's Menu"]
      };
    }

    if (onNavigate) onNavigate("cart");
    return {
      text: isTa
        ? `✅ உங்கள் ஆர்டர் தயார்! கார்ட்டில் **${cartCount}** பொருட்கள் உள்ளன (மொத்தம்: **₹${cartTotal}**). கார்ட் பக்கத்தில் உங்கள் கட்டண முறையை தேர்வு செய்து முடிக்கவும்.`
        : `✅ Ready for checkout! You have **${cartCount} items** totalling **₹${cartTotal}**. Please select your payment method on the Cart page to receive your token.`,
      actions: [{ label: "🛒 Open Cart & Pay", navigate: "cart" }],
      suggestions: ["🎫 Track Order", "🍽️ Add More Food"]
    };
  }

  // =========================================================================
  // 6. MULTI-ITEM & DIRECT VOICE ORDERING ("Add 2 biryani and 1 tea", "Order veg thali", "2 samosa")
  // =========================================================================
  const orderKeywords = /(?:add|order|get|buy|want|give me|take|put|சேர்|ஆர்டர்|வாங்கு|போடு|வேணும்)/i;
  const isOrderIntent = orderKeywords.test(lower) ||
    menu.some((m) => lower.includes(m.name.toLowerCase()) || (m.name_ta && lower.includes(m.name_ta.toLowerCase())));

  if (isOrderIntent && !lower.includes("remove") && !lower.includes("delete") && !lower.includes("price") && !lower.includes("cost") && !lower.includes("stock") && !lower.includes("available") && !lower.includes("do you have") && !lower.includes("have you got") && !lower.includes("is there")) {
    // Split by commas, "and", "&", "மற்றும்", "கூட" to detect multi-item orders
    const segments = lower.split(/(?:,|\sand\s|\s&\s|\sமற்றும்\s|\sகூட\s|\s\+\s)/i);
    const addedItems = [];
    const outOfStockItems = [];

    for (const seg of segments) {
      const segTrimmed = seg.trim();
      if (!segTrimmed) continue;

      // Extract number or word quantity
      const qtyMatch = segTrimmed.match(/(?:^|\s)(\d+|one|two|three|four|five|six|seven|eight|nine|ten|ஒரு|இரண்டு|ரெண்டு|மூன்று|நான்கு|ஐந்து)(?:\s|$)/i);
      const qtyWord = qtyMatch ? qtyMatch[1] : "1";
      const parsedQty = parseVoiceQty(qtyWord);

      // Clean item query
      const cleanSeg = segTrimmed
        .replace(/(?:add|order|get|buy|want|give me|take|put|please|to cart|in cart|portion|portions|plate|plates|cup|cups|item|items|சேர்|ஆர்டர்|வாங்கு|போடு|வேணும்)/gi, "")
        .replace(new RegExp(`\\b${qtyWord}\\b`, "gi"), "")
        .trim();

      const matchedItem = findMenuItem(cleanSeg) || findMenuItem(segTrimmed);
      if (matchedItem) {
        if (matchedItem.stock > 0) {
          const finalAddQty = Math.min(parsedQty, matchedItem.stock);
          if (addToCart) addToCart(matchedItem.id, finalAddQty);
          addedItems.push({ item: matchedItem, qty: finalAddQty });
        } else {
          outOfStockItems.push(matchedItem);
        }
      }
    }

    if (addedItems.length > 0) {
      const itemDesc = addedItems.map((ai) => {
        const name = isTa ? (ai.item.name_ta || ai.item.name) : ai.item.name;
        return `**${ai.qty}x ${name}** (₹${ai.qty * ai.item.price})`;
      }).join(isTa ? " மற்றும் " : ", ");

      const totalAddedPrice = addedItems.reduce((acc, curr) => acc + curr.qty * curr.item.price, 0);

      let outMsg = "";
      if (outOfStockItems.length > 0) {
        const outNames = outOfStockItems.map((oi) => isTa ? (oi.name_ta || oi.name) : oi.name).join(", ");
        outMsg = isTa
          ? `\n⚠️ (குறிப்பு: **${outNames}** தற்போது இருப்பில் இல்லை).`
          : `\n⚠️ (Note: **${outNames}** is currently out of stock).`;
      }

      return {
        text: isTa
          ? `✅ கார்ட்டில் ${itemDesc} சேர்க்கப்பட்டது! 🛒 (மதிப்பு: ₹${totalAddedPrice}).${outMsg}\nகார்ட்டை பார்த்து பணம் செலுத்த விரும்புகிறீர்களா?`
          : `✅ Added ${itemDesc} to your cart! 🛒 (Added Value: ₹${totalAddedPrice}).${outMsg}\nWould you like to checkout now or add more items?`,
        cards: addedItems.map((ai) => ai.item),
        actions: [
          { label: "🛒 View Cart & Pay", navigate: "cart" },
          { label: "🍽️ Add More Food", navigate: "menu" }
        ],
        suggestions: ["🛒 View Cart", "👥 Check Crowd", "🍽️ Today's Menu"],
        newContext: { lastItem: addedItems[0].item }
      };
    }
  }

  // =========================================================================
  // 7. GREETINGS & INTRODUCTIONS
  // =========================================================================
  if (
    /^(hi+|hello+|hey+|hii+|hiii+|good\s*(morning|afternoon|evening|night)|vanakkam|வணக்கம்|ஹாய்|நமஸ்காரம்)/i.test(lower) ||
    lower.includes("hi chef") || lower.includes("hey chef") || lower.includes("hello chef") || lower.includes("greetings")
  ) {
    if (lower.includes("morning")) {
      return {
        text: isTa
          ? "காலை வணக்கம்! ☀️👨‍🍳 சுவையான காலை உணவு மற்றும் சூடான டீ தயார்! நீங்கள் என்ன சாப்பிட விரும்புகிறீர்கள்?"
          : "Good morning! ☀️👨‍🍳 Fresh breakfast and hot chai are ready in the kitchen! Speak your order or ask about the menu.",
        suggestions: ["🍽️ Today's Menu", "🎙️ Order 2 Masala Chai", "👥 Check Crowd", "💡 Food Recommendation"],
        newContext: { awaiting: "menu_or_rec" }
      };
    }
    return {
      text: isTa
        ? "வணக்கம்! 👨‍🍳✨ நான் உங்கள் கேண்டீன் வாய்ஸ் உதவியாளர். உணவு ஆர்டர் செய்ய, மெனு பார்க்க அல்லது கூட்ட நிலை அறிய என்னிடம் பேசவும்!"
        : "Hey there! 👋 I'm your Canteen Voice Assistant. Speak your order naturally (e.g. 'Order 2 Masala Chai', 'Is Biryani in stock?', 'Check Crowd')!",
      suggestions: ["🎙️ Order 2 Masala Chai", "🍽️ Today's Menu", "👥 Check Crowd", "📦 Stock Info"]
    };
  }

  // =========================================================================
  // 8. HELP & VOICE COMMANDS CHEATSHEET
  // =========================================================================
  if (
    /^(help|what can i ask|commands|voice commands|options|what should i ask you|what can you do|how to use|உதவி|கட்டளைகள்)/i.test(lower) ||
    lower.includes("what can i ask") || lower.includes("voice command") || lower.includes("how to use")
  ) {
    return {
      text: isTa
        ? `🎙️ **வாய்ஸ் அசிஸ்டண்ட் குரல் கட்டளைகள்**:
• 🗣️ *"2 மசாலா டீ ஆர்டர் செய்"*
• 🗣️ *"பிரியாணி இருப்பு இருக்கா?"*
• 🗣️ *"கூட்டம் எப்படி இருக்கு?"*
• 🗣️ *"என் கார்ட் காட்டு"*
• 🗣️ *"மெனுவுக்கு போ"*
• 🗣️ *"என் டோக்கனை டிராக் செய்"*
• 🗣️ *"வாலட் பேலன்ஸ் எவ்வளவு?"*`
        : `🎙️ **Voice Assistant Commands**:
• 🗣️ *"Order 2 Masala Chai and 1 Biryani"*
• 🗣️ *"Is Chicken Biryani in stock?"*
• 🗣️ *"How busy is CSE Canteen?"*
• 🗣️ *"Show my cart / Checkout"*
• 🗣️ *"Go to menu / crowd / tracking"*
• 🗣️ *"Show vegetarian options under ₹60"*
• 🗣️ *"What is my wallet balance?"*`,
      suggestions: ["🎙️ Order 2 Masala Chai", "👥 Check Crowd", "📦 Stock Info", "🛒 View Cart"]
    };
  }

  // =========================================================================
  // 9. LIVE CROWD & QUEUE STATUS INQUIRIES
  // =========================================================================
  if (
    lower.includes("crowd") || lower.includes("busy") || lower.includes("queue") || lower.includes("wait") ||
    lower.includes("rush") || lower.includes("line") || lower.includes("கூட்டம்") || lower.includes("ரஷ்")
  ) {
    const crowdInfo = canteens.map((c) => {
      const emoji = c.level === "low" ? "🟢" : c.level === "med" ? "🟡" : "🔴";
      const cName = isTa ? (c.name_ta || c.name) : c.name;
      const cLoc = isTa ? (c.loc_ta || c.loc) : c.loc;
      return `• **${cName}** (${cLoc}): **${c.level.toUpperCase()}** (~${c.wait} mins wait) ${emoji}`;
    }).join("\n");

    const lowestWaitCanteen = [...canteens].sort((a, b) => a.wait - b.wait)[0];
    const lowestName = isTa ? (lowestWaitCanteen.name_ta || lowestWaitCanteen.name) : lowestWaitCanteen.name;

    return {
      text: isTa
        ? `👥 **நேரலை கேண்டீன் கூட்ட நிலை**:\n\n${crowdInfo}\n\n💡 **பரிந்துரை**: தற்போது **${lowestName}**-ல் மிகக் குறைந்த கூட்டம் மற்றும் விரைவான சேவை (~${lowestWaitCanteen.wait} நிமிடங்கள்) உள்ளது!`
        : `👥 **Live Campus Canteen Crowd Status**:\n\n${crowdInfo}\n\n💡 **Recommendation**: **${lowestName}** currently has the shortest line with only ~${lowestWaitCanteen.wait} mins wait time!`,
      actions: [{ label: "👥 Open Live Crowd Board", navigate: "crowd" }, { label: "🍽️ Order Now", navigate: "menu" }],
      suggestions: ["🍽️ Today's Menu", "🎙️ Order Masala Chai", "🛒 View Cart"]
    };
  }

  // =========================================================================
  // 10. STOCK & SPECIFIC FOOD AVAILABILITY
  // =========================================================================
  if (
    /avail|stock|left|remained|left in stock|do you have|have you got|got any|is.*ready|is there|உங்களிடம்|இருப்பு|கிடைக்குமா|இருக்கா/i.test(lower) ||
    /is.*(in stock|available|ready|there)/i.test(lower) ||
    (findMenuItem(lower) && (lower.includes("have") || lower.includes("got") || lower.includes("any") || lower.includes("ready") || lower.includes("available") || lower.includes("there") || lower.includes("stock") || lower.includes("இருக்கா")))
  ) {
    const matchedItem = findMenuItem(lower);
    if (matchedItem) {
      const itemName = isTa ? (matchedItem.name_ta || matchedItem.name) : matchedItem.name;
      if (matchedItem.stock > 0) {
        return {
          text: isTa
            ? `✅ **${itemName}** தற்போது இருப்பு உள்ளது! 🍽️ (${matchedItem.stock} பகுதிகள் உள்ளன, விலை: ₹${matchedItem.price}, ${matchedItem.kcal} கலோரி).\nஇதை கார்ட்டில் சேர்க்கவா?`
            : `✅ **${itemName}** is **IN STOCK**! 🍽️ (${matchedItem.stock} portions available, ₹${matchedItem.price}, ${matchedItem.kcal} kcal).\nWould you like me to add this to your cart?`,
          cards: [matchedItem],
          actions: [{ label: `🛒 Add ${itemName}`, text: `Add 1 ${matchedItem.name}` }],
          suggestions: [`🎙️ Order 1 ${matchedItem.name}`, "🍽️ Today's Menu"],
          newContext: { lastItem: matchedItem }
        };
      } else {
        return {
          text: isTa
            ? `❌ மன்னிக்கவும்! **${itemName}** தற்போது கையிருப்பில் இல்லை (Sold Out). மாற்று உணவை பரிந்துரைக்கவா?`
            : `❌ Sorry! **${itemName}** is currently **OUT OF STOCK** (Sold Out). Would you like me to recommend a fresh alternative?`,
          suggestions: ["💡 Recommend food", "🍽️ Today's Menu", "👥 Check Crowd"]
        };
      }
    }
  }

  // =========================================================================
  // 11. PRICE & COST QUESTIONS
  // =========================================================================
  if (lower.includes("how much") || lower.includes("price") || lower.includes("cost") || lower.includes("விலை") || lower.includes("எவ்வளவு")) {
    const matchedItem = findMenuItem(lower) || contextState.lastItem || menu[0];
    const itemName = isTa ? (matchedItem.name_ta || matchedItem.name) : matchedItem.name;
    return {
      text: isTa
        ? `📌 **${itemName}** விலை: **₹${matchedItem.price}** (${matchedItem.kcal} கலோரி).\nஇருப்பு: ${matchedItem.stock} பகுதிகள் உள்ளன.`
        : `📌 **${itemName}** costs **₹${matchedItem.price}** (${matchedItem.kcal} kcal per portion).\nCurrent stock: ${matchedItem.stock} portions available.`,
      cards: [matchedItem],
      actions: [{ label: `🛒 Add ${itemName}`, text: `Add 1 ${matchedItem.name}` }],
      suggestions: [`🎙️ Add 1 ${matchedItem.name}`, "🍽️ Full Menu"],
      newContext: { lastItem: matchedItem }
    };
  }

  // =========================================================================
  // 12. DIETARY & BUDGET FILTERS (Vegetarian, Non-Veg, Snacks, Under ₹60, Healthy)
  // =========================================================================
  if (lower.includes("veg") && !lower.includes("non")) {
    const vegItems = menu.filter((m) => m.id !== "chicken_biryani");
    return {
      text: isTa
        ? `🥗 **100% தூய சைவ உணவுகள்** (${vegItems.length} பொருட்கள் கிடைக்கின்றன):`
        : `🥗 **Pure Vegetarian Items** (${vegItems.length} fresh options ready):`,
      cards: vegItems,
      actions: [{ label: "🍽️ Open Menu", navigate: "menu" }],
      suggestions: ["🎙️ Order Veg Thali", "🎙️ Order Paneer Wrap", "🛒 View Cart"]
    };
  }

  if (lower.includes("non veg") || lower.includes("chicken") || lower.includes("meat") || lower.includes("அசைவம்")) {
    const nonVegItems = menu.filter((m) => m.id === "chicken_biryani");
    return {
      text: isTa
        ? "🍗 **அசைவ உணவுகள்**:"
        : "🍗 **Non-Vegetarian Items**:",
      cards: nonVegItems,
      actions: [{ label: "🍽️ Open Menu", navigate: "menu" }],
      suggestions: ["🎙️ Order Chicken Biryani", "👥 Check Crowd"]
    };
  }

  if (lower.includes("under 50") || lower.includes("under 60") || lower.includes("under 100") || lower.includes("budget") || lower.includes("cheap") || lower.includes("விலை குறைவு")) {
    const budgetItems = menu.filter((m) => m.price <= 60 && m.available);
    return {
      text: isTa
        ? "💰 **சிறந்த பட்ஜெட் உணவுகள் (₹60 க்குள்)**:"
        : "💰 **Top Budget-Friendly Items Under ₹60**:",
      cards: budgetItems,
      actions: [{ label: "🍽️ Open Menu", navigate: "menu" }],
      suggestions: ["🎙️ Order Masala Chai", "🎙️ Order Paneer Wrap", "🛒 View Cart"]
    };
  }

  if (lower.includes("healthy") || lower.includes("diet") || lower.includes("low calorie") || lower.includes("calories") || lower.includes("ஆரோக்கியமான")) {
    const healthyItems = menu.filter((m) => m.kcal <= 300 && m.available);
    return {
      text: isTa
        ? "🥗 **குறைந்த கலோரி கொண்ட ஆரோக்கியமான உணவுகள் (300 கலோரிக்குள்)**:"
        : "🥗 **Healthy & Low-Calorie Choices (<300 kcal)**:",
      cards: healthyItems,
      actions: [{ label: "🍽️ Open Menu", navigate: "menu" }],
      suggestions: ["🎙️ Order Paneer Wrap", "🎙️ Order Filter Coffee", "🛒 View Cart"]
    };
  }

  if (lower.includes("snack") || lower.includes("drink") || lower.includes("beverage") || lower.includes("tea") || lower.includes("coffee") || lower.includes("சிற்றுண்டி") || lower.includes("பானம்")) {
    const quickItems = menu.filter((m) => m.category === "beverages" || m.category === "snacks");
    return {
      text: isTa
        ? "⚡ **விரைவான சிற்றுண்டிகள் மற்றும் பானங்கள்**:"
        : "⚡ **Quick Snacks & Refreshing Beverages**:",
      cards: quickItems,
      actions: [{ label: "🍽️ Open Menu", navigate: "menu" }],
      suggestions: ["🎙️ Order Masala Chai", "🎙️ Order Paneer Wrap", "🛒 View Cart"]
    };
  }

  // =========================================================================
  // 13. ACTIVE ORDER TRACKING & TOKEN STATUS
  // =========================================================================
  if (lower.includes("track") || lower.includes("token") || lower.includes("status of order") || lower.includes("where is my food") || lower.includes("ஆர்டர் நிலை") || lower.includes("டோக்கன்")) {
    if (order) {
      const statusText = order.status === 0 ? "Order Placed" : order.status === 1 ? "In Preparation" : order.status === 2 ? "Ready for Pickup" : "Completed";
      const statusTextTa = order.status === 0 ? "பதிவு செய்யப்பட்டது" : order.status === 1 ? "தயாராகிறது" : order.status === 2 ? "வாங்க தயார்" : "வழங்கப்பட்டது";

      return {
        text: isTa
          ? `📦 **செயலில் உள்ள ஆர்டர் விவரம்**:\n• டோக்கன்: **${order.token}**\n• நிலை: **${statusTextTa}** 🍳\n• கவுண்டர்: **கவுண்டர் ${order.counter}**\n• மதிப்பு: **₹${order.total}** (${order.items.length} பொருட்கள்)`
          : `📦 **Active Live Order Update**:\n• Token: **${order.token}**\n• Status: **${statusText}** 🍳\n• Counter: **Counter ${order.counter}**\n• Total: **₹${order.total}** (${order.items.length} items)`,
        actions: [{ label: "🎫 Open Order Tracker", navigate: "tracking" }],
        suggestions: ["🎫 Track Order", "🍽️ Today's Menu"]
      };
    } else {
      const last = (orderHistory && orderHistory.length > 0) ? orderHistory[0] : null;
      return {
        text: isTa
          ? `உங்களிடம் தற்போது செயலில் ஆர்டர்கள் இல்லை. 📦 உங்கள் முந்தைய ஆர்டர் **${last ? last.id : 'ORD-9281'}** (டோக்கன் ${last ? last.token : 'A-12'}) முடிந்தது. புதிய உணவு ஆர்டர் செய்ய விரும்புகிறீர்களா?`
          : `You don't have an active order in progress right now. 📦 Your last completed order was **${last ? last.id : 'ORD-9281'}** (Token ${last ? last.token : 'A-12'}). Would you like to order something fresh?`,
        actions: [{ label: "🍽️ Browse Menu", navigate: "menu" }],
        suggestions: ["🍽️ Today's Menu", "🎙️ Order 2 Masala Chai", "👥 Check Crowd"]
      };
    }
  }

  // =========================================================================
  // 14. CANCEL ACTIVE ORDER
  // =========================================================================
  if (lower.includes("cancel order") || lower.includes("cancel my order") || lower.includes("ஆர்டரை ரத்து செய்")) {
    if (order && cancelOrder) {
      cancelOrder();
      return {
        text: isTa
          ? `❌ உங்கள் ஆர்டர் **${order.id}** (டோக்கன் ${order.token}) வெற்றிகரமாக ரத்து செய்யப்பட்டது. பணம் உங்கள் வாலட்டிற்கு திரும்ப செலுத்தப்படும்.`
          : `❌ Your active order **${order.id}** (Token ${order.token}) has been cancelled. Any amount paid will be refunded to your wallet.`,
        actions: [{ label: "🍽️ Browse Menu", navigate: "menu" }],
        suggestions: ["🍽️ Today's Menu", "👥 Check Crowd"]
      };
    } else {
      return {
        text: isTa
          ? "ரத்து செய்வதற்கு உங்களிடம் தற்போது எந்த செயலில் உள்ள ஆர்டரும் இல்லை."
          : "You don't have any active orders to cancel right now.",
        suggestions: ["🍽️ Today's Menu", "🛒 View Cart"]
      };
    }
  }

  // =========================================================================
  // 15. WALLET & PAYMENTS
  // =========================================================================
  if (lower.includes("wallet") || lower.includes("balance") || lower.includes("money") || lower.includes("வாலட்") || lower.includes("பேலன்ஸ்")) {
    const bal = walletBalance || 340;
    return {
      text: isTa
        ? `💳 **கேம்பஸ் வாலட் விவரம்**:\n• நடப்பு இருப்பு: **₹${bal}**\n• கட்டண முறைகள்: கேம்பஸ் வாலட், யுபிஐ / ஜிபே, ரொக்கம்.\n\nகார்ட்டில் உள்ள பொருட்களுக்கு வாலட் மூலம் நேரடியாக பணம் செலுத்தலாம்!`
        : `💳 **Campus Wallet Details**:\n• Current Balance: **₹${bal}**\n• Accepted Payment Methods: Campus Wallet, UPI / GPay, Cash Counters.\n\nYou can use your wallet balance for instant 1-tap checkout in your cart!`,
      actions: [{ label: "🛒 View Cart & Pay", navigate: "cart" }],
      suggestions: ["🛒 View Cart", "🍽️ Today's Menu"]
    };
  }

  // =========================================================================
  // 16. OFFERS & COUPONS
  // =========================================================================
  if (lower.includes("coupon") || lower.includes("offer") || lower.includes("discount") || lower.includes("promo") || lower.includes("தள்ளுபடி") || lower.includes("ஆபர்")) {
    return {
      text: isTa
        ? "🎉 **இன்றைய சிறப்பு சலுகை**:\nகூப்பன் குறியீடு **CANTEEN10** ஐப் பயன்படுத்தி உங்கள் ஆர்டரில் **10% உடனடி தள்ளுபடி** பெறுங்கள்!"
        : "🎉 **Special Campus Offer Today**:\nUse coupon code **CANTEEN10** at checkout to get an **instant 10% discount** on your order!",
      actions: [{ label: "🛒 Go to Cart to Apply", navigate: "cart" }],
      suggestions: ["🛒 View Cart", "🍽️ Today's Menu"]
    };
  }

  // =========================================================================
  // 17. FULL MENU & POPULAR ITEMS
  // =========================================================================
  if (
    /menu|items|food|what.*(have|got|sell|serve|cooking)|மெனு|உணவு பட்டியல்/i.test(lower)
  ) {
    const availableItems = menu.filter((m) => m.available);
    return {
      text: isTa
        ? `🍽️ **இன்றைய கேண்டீன் மெனு பட்டியல்** (${availableItems.length} சுவையான உணவுகள் தயார்):`
        : `🍽️ **Today's Fresh Canteen Menu** (${availableItems.length} delicious items ready):`,
      cards: availableItems,
      actions: [{ label: "🍽️ Open Full Menu Page", navigate: "menu" }],
      suggestions: ["🎙️ Order 2 Masala Chai", "🌶️ Spicy food", "👥 Check Crowd", "🛒 View Cart"]
    };
  }

  // =========================================================================
  // 18. CANTEEN TIMINGS, LOCATION & FAQS
  // =========================================================================
  if (lower.includes("time") || lower.includes("open") || lower.includes("hour") || lower.includes("location") || lower.includes("where is canteen") || lower.includes("நேரம்") || lower.includes("இடம்")) {
    return {
      text: isTa
        ? `ℹ️ **கேண்டீன் தகவல்கள்**:
⏰ **நேரம்**: காலை 7:30 - இரவு 8:00 (திங்கள் - சனி)
📍 **இடம்**: பிளாக் ஏ - தரைத்தளம் (CSE Canteen)
💳 **கட்டணம்**: கேம்பஸ் வாலட், யுபிஐ / ஜிபே, ரொக்கம்`
        : `ℹ️ **Campus Canteen Info**:
⏰ **Operating Hours**: 7:30 AM - 8:00 PM (Monday to Saturday)
📍 **Location**: Block A - Ground Floor (CSE Canteen)
💳 **Payment**: Campus Wallet, UPI / GPay, Cash Counters`,
      suggestions: ["🍽️ Today's Menu", "👥 Check Crowd", "🛒 View Cart"]
    };
  }

  // =========================================================================
  // 19. CASUAL CHIT-CHAT, COMPLIMENTS & JOKES
  // =========================================================================
  if (lower.includes("how are you") || lower.includes("how r u") || lower.includes("எப்படி இருக்கீங்க")) {
    return {
      text: isTa
        ? "நான் மிகவும் மகிழ்ச்சியாக இருக்கிறேன்! 👨‍🍳🔥 சமையலறை சுடச்சுட தயார், உங்கள் குரல் ஆர்டருக்கு காத்திருக்கிறேன்!"
        : "I'm doing fantastic! 👨‍🍳🔥 Fresh food is sizzling in the kitchen and I'm ready to take your voice orders!",
      suggestions: ["🍽️ What's cooking?", "👥 Check Crowd", "💡 Recommend food"]
    };
  }

  if (lower.includes("who are you") || lower.includes("your name") || lower.includes("who made you") || lower.includes("யார் நீங்கள்")) {
    return {
      text: isTa
        ? "நான் கேண்டீன் ஷெஃப் 👨‍🍳, உங்கள் ஸ்மார்ட் AI வாய்ஸ் உதவியாளர். குரல் மூலமே உணவை ஆர்டர் செய்து, கூட்ட நிலையை அறிய என்னிடம் பேசலாம்!"
        : "I'm Canteen Chef 👨‍🍳, your smart AI voice assistant. Speak naturally to place orders, check wait times, and track food!",
      suggestions: ["🍽️ Show Menu", "👥 Check Crowd", "🎙️ Order Masala Chai"]
    };
  }

  if (lower.includes("joke") || lower.includes("funny") || lower.includes("சிரிப்பு")) {
    return {
      text: isTa
        ? "😄 இதோ ஒரு கேண்டீன் ஜோக்:\nகேண்டீன் டீயும் இன்டர்நெட் ஸ்பீடும் ஒன்னு... ரெண்டும் சூடா இருக்கும்போது தான் வேகம்! ☕💨"
        : "😄 Here's a quick canteen joke:\nWhy did the dosa go to college? To become a hot roll model! 🥞🎓",
      suggestions: ["🍽️ Today's Menu", "🎙️ Order Masala Chai"]
    };
  }

  if (lower.includes("thank") || lower.includes("thanks") || lower.includes("நன்றி")) {
    return {
      text: isTa
        ? "மகிழ்ச்சி! 👨‍🍳 உணவை ருசித்து சாப்பிடுங்கள்! மீண்டும் பசித்தால் என்னிடம் பேசுங்கள்."
        : "You're most welcome! 👨‍🍳 Enjoy your meal! Feel free to speak to me anytime you're hungry.",
      suggestions: ["🍽️ Today's Menu", "👥 Check Crowd"]
    };
  }

  if (/^(bye|goodbye|see\s*you|cya|tata|வரேன்)/i.test(lower)) {
    return {
      text: isTa
        ? "வரேன்! 👋 நல்ல நாளாக அமையட்டும், உணவை ரசியுங்கள்! 🍽️"
        : "Goodbye! 👋 Have a wonderful day and enjoy your food! 🍽️"
    };
  }

  // =========================================================================
  // 20. CONTEXTUAL YES / CONFIRMATION
  // =========================================================================
  if (/^(yes|yeah|sure|okay|ok|sounds good|ஆமாம்|சரி)$/i.test(lower)) {
    if (contextState.lastItem && addToCart) {
      addToCart(contextState.lastItem.id, 1);
      const itemName = isTa ? (contextState.lastItem.name_ta || contextState.lastItem.name) : contextState.lastItem.name;
      return {
        text: isTa
          ? `✅ **${itemName}** கார்ட்டில் சேர்க்கப்பட்டது! 🛒 கார்ட்டை பார்த்து ஆர்டரை முடிக்கவா?`
          : `✅ Added **${itemName}** to your cart! 🛒 Would you like to view your cart and proceed to checkout?`,
        actions: [{ label: "🛒 View Cart & Pay", navigate: "cart" }, { label: "🍽️ Browse Menu", navigate: "menu" }],
        suggestions: ["🛒 View Cart", "🍽️ Today's Menu"]
      };
    }
  }

  // =========================================================================
  // 21. FALLBACK INTELLIGENT RESPONSE
  // =========================================================================
  return {
    text: isTa
      ? "மன்னிக்கவும்! 👨‍🍳 அதைப்பற்றி எனக்கு இன்னும் தெளிவாக தெரியவில்லை. உணவு ஆர்டர் செய்ய, மெனு பார்க்க, கூட்ட நிலை அறிய அல்லது ஆர்டரை கண்காணிக்க என்னிடம் பேசவும்.\n\nநீங்கள் இவற்றை முயற்சி செய்யலாம்:"
      : "I heard you! 👨‍🍳 I can help you order food, check stock, view live crowd levels, track tokens, or navigate the app.\n\nHere are some popular voice commands you can try:",
    suggestions: ["🎙️ Order 2 Masala Chai", "🍽️ Today's Menu", "📦 Is Biryani in stock?", "👥 Check Crowd Status", "🛒 Show My Cart"]
  };
}

/* ================================================================== */
/* Chef AI Vector Avatar Component (Robot with Chef Toque)            */
/* ================================================================== */
function ChefAiAvatar({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        <linearGradient id="chefHatGrad" x1="32" y1="2" x2="32" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="robotBodyGrad" x1="16" y1="22" x2="48" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="20" y1="30" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="eyeGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="earNode" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
        <linearGradient id="scarfGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#000" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Side Antennas / Ear Nodes */}
      <circle cx="12" cy="38" r="4" fill="url(#earNode)" />
      <rect x="14" y="36.5" width="4" height="3" fill="#94A3B8" />
      <circle cx="52" cy="38" r="4" fill="url(#earNode)" />
      <rect x="46" y="36.5" width="4" height="3" fill="#94A3B8" />

      {/* Antenna Tops */}
      <line x1="16" y1="30" x2="11" y2="24" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="23" r="2.5" fill="#F43F5E" />
      <line x1="48" y1="30" x2="53" y2="24" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
      <circle cx="54" cy="23" r="2.5" fill="#F43F5E" />

      {/* Robot Head Body */}
      <rect x="15" y="24" width="34" height="28" rx="10" fill="url(#robotBodyGrad)" stroke="#94A3B8" strokeWidth="1.2" filter="url(#softShadow)" />

      {/* Glossy Visor Screen */}
      <rect x="19" y="30" width="26" height="15" rx="5" fill="url(#visorGrad)" stroke="#334155" strokeWidth="0.8" />

      {/* Friendly Glowing Cyan Eyes */}
      <rect x="23" y="33.5" width="5.5" height="8" rx="2.5" fill="url(#eyeGlow)" />
      <circle cx="24.5" cy="35" r="1" fill="#FFFFFF" />
      
      <rect x="35.5" y="33.5" width="5.5" height="8" rx="2.5" fill="url(#eyeGlow)" />
      <circle cx="37" cy="35" r="1" fill="#FFFFFF" />

      {/* Cute LED Smile/Mouth */}
      <path d="M29 48 Q32 50.5 35 48" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Red Chef Neckerchief / Ascot Knot */}
      <path d="M26 53 L38 53 L35 60 L32 56 L29 60 Z" fill="url(#scarfGrad)" />
      <circle cx="32" cy="54" r="2.2" fill="#F59E0B" />

      {/* Chef Hat (Toque Blanche) on Robot Head */}
      <g filter="url(#softShadow)">
        {/* Hat Puffs */}
        <circle cx="24" cy="11" r="7.5" fill="url(#chefHatGrad)" />
        <circle cx="32" cy="8" r="8.5" fill="url(#chefHatGrad)" />
        <circle cx="40" cy="11" r="7.5" fill="url(#chefHatGrad)" />
        <rect x="22" y="11" width="20" height="10" fill="url(#chefHatGrad)" />
        
        {/* Hat Band */}
        <path d="M20 20 C20 18, 44 18, 44 20 L45 25.5 C45 26.5, 19 26.5, 19 25.5 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
        <rect x="21" y="22" width="22" height="2" rx="1" fill="#F59E0B" />
      </g>
    </svg>
  );
}

/* ================================================================== */
/* Helper to check if a SpeechSynthesisVoice is an authentic Tamil voice */
/* ================================================================== */
function isRealTamilVoice(voice) {
  if (!voice) return false;
  const vLang = (voice.lang || "").toLowerCase();
  const vName = (voice.name || "").toLowerCase();
  const isTaLang =
    vLang === "ta-in" ||
    vLang === "ta_in" ||
    vLang.startsWith("ta-") ||
    vLang.startsWith("ta_") ||
    vLang === "ta";
  const isTaName =
    vName.includes("tamil") ||
    vName.includes("தமிழ்") ||
    vName.includes("valluvar") ||
    vName.includes("pallavi") ||
    vName.includes("latha") ||
    vName.includes("google தமிழ்") ||
    vName.includes("google tamil");
  return isTaLang || isTaName;
}

/* ================================================================== */
/* Canteen Chef Voice Assistant Component                              */
/* ================================================================== */
function CanteenChefChatbot({ isOpen, onClose, onNavigate }) {
  const {
    menu,
    canteens,
    order,
    orderHistory,
    addToCart,
    setQty,
    clearCart,
    cart,
    cartLines,
    cartCount,
    cartTotal,
    walletBalance,
    placeOrder,
    cancelOrder,
    lang,
    setLang,
    toggleLang,
    t,
    showAlert
  } = useCanteen();

  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: lang === "ta"
        ? "வணக்கம்! 👨‍🍳✨ நான் உங்கள் AI செஃப் சாட்பாட். இன்றைய சிறப்பு உணவு அறிய, உடனடி ஆர்டர் செய்ய, அல்லது கூட்ட நிலையை சரிபார்க்க என்னிடம் கேட்கலாம்!"
        : "Hello! 👨‍🍳✨ I'm your AI Chef Chatbot. I can recommend today's specials, order meals for you, check live crowd, and answer canteen questions!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: lang === "ta"
        ? ["🍛 இன்றைய சிறப்பு உணவு", "🛒 2 மசாலா டீ ஆர்டர் செய்", "👥 கூட்டம் எப்படி இருக்கு?", "📦 பிரியாணி இருப்பு எவ்ளோ?", "🍽️ இன்றைய மெனு"]
        : ["🍛 Today's Special Dish", "🛒 Order 2 Masala Chai", "👥 Check Live Crowd", "📦 Is Biryani in stock?", "🍽️ Show Full Menu"]
    }
  ]);

  const [input, setInput] = useState("");
  const [contextState, setContextState] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [activeSpeakingId, setActiveSpeakingId] = useState(null);
  const [voiceNotice, setVoiceNotice] = useState(null);
  const [systemVoices, setSystemVoices] = useState([]);
  const [noTamilVoice, setNoTamilVoice] = useState(false);
  const [activeVoiceName, setActiveVoiceName] = useState("");

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
  const liveTranscriptRef = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load and cache all browser system voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const vList = window.speechSynthesis.getVoices();
      if (vList && vList.length > 0) {
        setSystemVoices(vList);
        const hasTamil = vList.some(isRealTamilVoice);
        setNoTamilVoice(!hasTamil);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isListening]);

  // Clean up speech on unmount or close
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    };
  }, []);

  // Find best matching voice for Tamil (ta-IN) or English (en-IN)
  const findBestVoice = useCallback((targetLang) => {
    const availVoices = systemVoices.length > 0 ? systemVoices : (synthRef.current ? synthRef.current.getVoices() : []);
    if (!availVoices || availVoices.length === 0) return null;

    if (targetLang === "ta") {
      // 1. Exact/prefix BCP-47 codes: ta-IN, ta_IN, ta-*, ta
      const directTa = availVoices.find((v) => {
        const vLang = (v.lang || "").toLowerCase();
        return (
          vLang === "ta-in" ||
          vLang === "ta_in" ||
          vLang.startsWith("ta-") ||
          vLang.startsWith("ta_") ||
          vLang === "ta"
        );
      });
      if (directTa) return directTa;

      // 2. Known voice names (case-insensitive):
      // tamil, தமிழ், valluvar (Microsoft Edge), pallavi (Microsoft), latha (Android/legacy), google தமிழ், google tamil
      const nameTa = availVoices.find((v) => {
        const vName = (v.name || "").toLowerCase();
        return (
          vName.includes("tamil") ||
          vName.includes("தமிழ்") ||
          vName.includes("valluvar") ||
          vName.includes("pallavi") ||
          vName.includes("latha") ||
          vName.includes("google தமிழ்") ||
          vName.includes("google tamil")
        );
      });
      if (nameTa) return nameTa;

      // 3. Fallback: any voice whose lang contains -IN (India region)
      const inFallback = availVoices.find((v) => {
        const vLang = (v.lang || "").toLowerCase();
        return vLang.includes("-in") || vLang.includes("_in");
      });
      if (inFallback) return inFallback;

      // 4. Explicitly return null if nothing matches rather than guessing
      return null;
    } else {
      const inEn = availVoices.find((v) => {
        const vLang = (v.lang || "").toLowerCase();
        return (vLang === "en-in" || vLang === "en_in") && !(v.name || "").includes("Generic");
      });
      if (inEn) return inEn;

      const naturalEn = availVoices.find((v) => {
        const vLang = (v.lang || "").toLowerCase();
        const vName = (v.name || "").toLowerCase();
        return vLang.startsWith("en") && (vName.includes("natural") || vName.includes("google") || vName.includes("online"));
      });
      if (naturalEn) return naturalEn;

      const genericEn = availVoices.find((v) => (v.lang || "").toLowerCase().startsWith("en"));
      if (genericEn) return genericEn;
    }

    return null;
  }, [systemVoices]);

  // Text-To-Speech (TTS) Voice Synthesis
  const speakText = useCallback((text, msgId, forcedLang) => {
    if (!synthRef.current) return;
    try {
      synthRef.current.cancel();
      const currentLang = forcedLang || lang;
      const plainText = stripMarkdownForSpeech(text, currentLang);
      if (!plainText) return;

      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = currentLang === "ta" ? 0.92 : 1.02;
      utterance.pitch = 1.0;

      if (currentLang === "ta") {
        utterance.lang = "ta-IN";
        const taVoice = findBestVoice("ta");
        const isReal = isRealTamilVoice(taVoice);
        if (taVoice && isReal) {
          utterance.voice = taVoice;
          setNoTamilVoice(false);
          setActiveVoiceName(`${taVoice.name} (${taVoice.lang})`);
        } else {
          // No Tamil voice found on this device/browser
          setNoTamilVoice(true);
          if (taVoice) {
            utterance.voice = taVoice;
            setActiveVoiceName(`${taVoice.name} (${taVoice.lang}) [Fallback - No Tamil TTS]`);
          } else {
            setActiveVoiceName("System Default (No Tamil TTS Voice)");
          }
          // Surface short bilingual warning notice without blocking speech
          setVoiceNotice(
            "⚠️ சாதனத்தில் தமிழ் TTS குரல் இல்லை (ஒலி ஆங்கிலம் போல் ஒலிக்கலாம்). OS அமைப்புகளில் தமிழ் குரலை நிறுவவும். / No Tamil TTS voice on device (audio may sound English). Please install a Tamil voice pack in your OS/browser settings."
          );
        }
      } else {
        utterance.lang = "en-IN";
        const enVoice = findBestVoice("en");
        if (enVoice) {
          utterance.voice = enVoice;
          setActiveVoiceName(`${enVoice.name} (${enVoice.lang})`);
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setActiveSpeakingId(msgId);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setActiveSpeakingId(null);
      };
      utterance.onerror = (e) => {
        console.warn("Speech synthesis utterance error:", e);
        setIsSpeaking(false);
        setActiveSpeakingId(null);
      };

      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
      setIsSpeaking(false);
      setActiveSpeakingId(null);
    }
  }, [lang, findBestVoice]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setActiveSpeakingId(null);
    }
  }, []);

  // Process user message and execute voice actions
  const processUserInput = useCallback((userText) => {
    const trimmed = (userText || "").trim();
    if (!trimmed) return;

    stopSpeaking();

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: trimmed,
      timestamp: time
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setVoiceNotice(null);
    liveTranscriptRef.current = "";

    setTimeout(() => {
      const response = generateBotResponse(trimmed, contextState, {
        menu,
        canteens,
        order,
        orderHistory,
        addToCart,
        setQty,
        clearCart,
        cart,
        cartLines,
        cartCount,
        cartTotal,
        walletBalance,
        placeOrder,
        cancelOrder,
        lang,
        setLang,
        toggleLang,
        t,
        onNavigate,
        showAlert,
        setAutoSpeak,
        stopSpeaking
      });

      if (response.newContext) {
        setContextState(response.newContext);
      }

      const botMsgId = "bot-" + Date.now();
      const botMsg = {
        id: botMsgId,
        sender: "bot",
        text: response.text,
        cards: response.cards || null,
        actions: response.actions || null,
        suggestions: response.suggestions || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);

      // Automatically speak bot response
      if (autoSpeak) {
        speakText(response.text, botMsgId);
      }
    }, 280);
  }, [
    contextState,
    menu,
    canteens,
    order,
    orderHistory,
    addToCart,
    setQty,
    clearCart,
    cart,
    cartLines,
    cartCount,
    cartTotal,
    walletBalance,
    placeOrder,
    cancelOrder,
    lang,
    setLang,
    toggleLang,
    t,
    onNavigate,
    showAlert,
    autoSpeak,
    speakText,
    stopSpeaking
  ]);

  // Language toggle handler with immediate voice notice
  const handleToggleLang = () => {
    stopSpeaking();
    const newLang = lang === "ta" ? "en" : "ta";
    if (setLang) setLang(newLang);

    if (newLang === "ta") {
      const availVoices = systemVoices.length > 0 ? systemVoices : (synthRef.current ? synthRef.current.getVoices() : []);
      const hasTamil = availVoices.some(isRealTamilVoice);
      setNoTamilVoice(!hasTamil);
      if (!hasTamil) {
        setVoiceNotice(
          "⚠️ சாதனத்தில் தமிழ் TTS குரல் இல்லை (ஒலி ஆங்கிலம் போல் ஒலிக்கலாம்). OS அமைப்புகளில் தமிழ் குரலை நிறுவவும். / No Tamil TTS voice on device (audio may sound English). Please install a Tamil voice pack in your OS/browser settings."
        );
      }
    } else {
      setVoiceNotice(null);
    }

    const switchNotice = newLang === "ta"
      ? "வணக்கம்! 👨‍🍳✨ இப்போது நான் தமிழில் பேசுவேன். என்ன சாப்பிட ஆசை?"
      : "Hello! 👨‍🍳✨ Language switched to English. How can I help you today?";

    const botMsgId = "lang-switch-" + Date.now();
    const switchMsg = {
      id: botMsgId,
      sender: "bot",
      text: switchNotice,
      suggestions: newLang === "ta"
        ? ["🎙️ 2 மசாலா டீ ஆர்டர் செய்", "🍽️ இன்றைய மெனு", "📦 பிரியாணி இருக்கா?", "👥 கூட்டம் எப்படி இருக்கு?", "🛒 என் கார்ட் காட்டு"]
        : ["🎙️ Order 2 Masala Chai", "🍽️ Today's Menu", "📦 Is Biryani in stock?", "👥 Check Crowd", "🛒 Show My Cart"],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, switchMsg]);

    if (autoSpeak) {
      speakText(switchNotice, botMsgId, newLang);
    }
  };

  // Robust Speech-To-Text (STT) Voice Recognition
  const toggleVoiceRecognition = () => {
    const SpeechRecognition = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

    if (!SpeechRecognition) {
      setVoiceNotice(lang === "ta" ? "⚠️ உங்கள் பிரவுசரில் குரல் அறிதல் ஆதரிக்கப்படவில்லை (Chrome/Edge பயன்படுத்தவும்)." : "⚠️ Voice recognition not supported in this browser. Please use Chrome or Edge.");
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setIsListening(false);
      return;
    }

    try {
      stopSpeaking();
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === "ta" ? "ta-IN" : "en-IN";

      liveTranscriptRef.current = "";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice(lang === "ta" ? "🎙️ கேட்கிறது... இப்போது பேசவும் (எ.கா: '2 மசாலா டீ', 'கூட்டம் எவ்ளோ')" : "🎙️ Listening... Speak your command (e.g. 'Order 2 Masala Chai', 'Check Crowd')");
      };

      recognition.onresult = (event) => {
        let fullTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        liveTranscriptRef.current = fullTranscript;
        setInput(fullTranscript);

        const lastResult = event.results[event.results.length - 1];
        if (lastResult && lastResult.isFinal) {
          setIsListening(false);
          setVoiceNotice(null);
          processUserInput(fullTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setVoiceNotice(lang === "ta" ? "⚠️ மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. பிரவுசரில் மைக்கை அனுமதிக்கவும்." : "⚠️ Microphone permission denied. Please allow mic access in your browser.");
        } else if (event.error !== "no-speech") {
          setVoiceNotice(lang === "ta" ? "⚠️ குரல் கேட்கவில்லை. மீண்டும் மைக் பட்டனை அழுத்தி பேசவும்." : "⚠️ Didn't catch that. Please click the mic and try again.");
        }
        setTimeout(() => setVoiceNotice(null), 4000);
      };

      recognition.onspeechend = () => {
        setIsListening(false);
        const finalCandidate = liveTranscriptRef.current || input;
        if (finalCandidate && finalCandidate.trim()) {
          setVoiceNotice(null);
          processUserInput(finalCandidate);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition start failed:", err);
      setIsListening(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      processUserInput(input);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chef-chat-modal">
          <div className="chef-chat-header">
            <div className="chef-header-info">
              <div className="chef-avatar-wrap">
                <ChefAiAvatar size={38} />
                <span className="chef-status-dot" />
              </div>
              <div>
                <div className="chef-title">{lang === "ta" ? "🤖 AI செஃப் ரோபோட்" : "🤖 Chef AI Assistant"}</div>
                <div className="chef-status-text">
                  {isSpeaking ? (
                    <span style={{ color: "#ea580c", fontWeight: 800 }}>🔊 {lang === "ta" ? "பதில் பேசுகிறது..." : "Speaking response..."}</span>
                  ) : isListening ? (
                    <span style={{ color: "#16a34a", fontWeight: 800 }}>🎙️ {lang === "ta" ? "உங்கள் குரலை கேட்கிறது..." : "Listening to your voice..."}</span>
                  ) : (
                    lang === "ta" ? "ஆன்லைன் • உணவு & கேண்டீன் வழிகாட்டி" : "Online • Smart Orders & Food Specials"
                  )}
                </div>
              </div>
            </div>
            <div className="chef-header-actions">
              {/* Language Switcher Button with missing voice warning badge */}
              <div className="chef-lang-btn-wrap">
                <button
                  className="chef-lang-toggle-btn"
                  title={lang === "ta" ? "Switch to English" : "தமிழுக்கு மாற்றவும்"}
                  onClick={handleToggleLang}
                >
                  🗣️ {lang === "ta" ? "தமிழ்" : "English"}
                </button>
                {lang === "ta" && noTamilVoice && (
                  <span
                    className="chef-voice-warn-badge"
                    title="சாதனத்தில் தமிழ் TTS குரல் இல்லை (குரல் ஆங்கிலம் போல் ஒலிக்கலாம்). அமைப்புகளில் தமிழ் குரலை நிறுவவும். / No Tamil TTS voice installed on this device (audio may sound English). Please install a Tamil voice pack in your OS/browser settings."
                  >
                    !
                  </span>
                )}
              </div>

              {/* Auto Voice Output Toggle */}
              <button
                className={`chef-voice-toggle-btn ${autoSpeak ? "active" : ""}`}
                title={autoSpeak ? (lang === "ta" ? "குரல் ஒலி இயக்கம் (முடக்க கிளிக் செய்யவும்)" : "Voice Output ON (Click to Mute)") : (lang === "ta" ? "குரல் ஒலி முடக்கப்பட்டது" : "Voice Output Muted (Click to Enable)")}
                onClick={() => {
                  if (autoSpeak) stopSpeaking();
                  setAutoSpeak(!autoSpeak);
                }}
              >
                {autoSpeak ? <Volume2Icon size={14} /> : <VolumeXIcon size={14} />}
                <span>{autoSpeak ? (lang === "ta" ? "ஒலி ON" : "Voice ON") : (lang === "ta" ? "முடக்கம்" : "Muted")}</span>
              </button>

              <button
                className="chef-icon-btn"
                title={lang === "ta" ? "அரட்டையை அழிக்கவும்" : "Clear Chat"}
                onClick={() => {
                  stopSpeaking();
                  setMessages([
                    {
                      id: "welcome-reset",
                      sender: "bot",
                      text: lang === "ta"
                        ? "வணக்கம்! 👨‍🍳✨ நான் உங்கள் கேண்டீன் வாய்ஸ் உதவியாளர். என்ன உணவு வேண்டும்?"
                        : "Hey! 👨‍🍳 I'm ready for your voice commands. What would you like to do?",
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      suggestions: lang === "ta"
                        ? ["🎙️ 2 மசாலா டீ ஆர்டர் செய்", "🍽️ இன்றைய மெனு", "📦 பிரியாணி இருக்கா?", "👥 கூட்டம் எப்படி இருக்கு?", "🛒 என் கார்ட் காட்டு"]
                        : ["🎙️ Order 2 Masala Chai", "🍽️ Today's Menu", "📦 Is Biryani in stock?", "👥 Check Crowd", "🛒 Show My Cart"]
                    }
                  ]);
                  setContextState({});
                }}
              >
                🗑️
              </button>
              <button className="chef-icon-btn" title="Close" onClick={() => { stopSpeaking(); onClose(true); }}>
                ✕
              </button>
            </div>
          </div>

          {/* Active Voice Listening / Speaking / Notice Banner */}
          {(isListening || voiceNotice || isSpeaking) && (
            <div className="chef-voice-status-bar">
              <div className="chef-voice-left">
                {isListening && (
                  <div className="chef-wave-container">
                    <div className="chef-wave-bar" />
                    <div className="chef-wave-bar" />
                    <div className="chef-wave-bar" />
                    <div className="chef-wave-bar" />
                    <div className="chef-wave-bar" />
                  </div>
                )}
                {isSpeaking && <span style={{ fontSize: 14 }}>🔊</span>}
                <span>{voiceNotice || (isListening ? (lang === "ta" ? "🎙️ பேசவும்... ('2 மசாலா டீ', 'கூட்டம்')" : "🎙️ Listening... Speak your food command!") : (lang === "ta" ? "குரலில் வாசிக்கிறது..." : "Speaking response aloud..."))}</span>
              </div>
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  style={{ background: "#ea580c", color: "#fff", border: "none", borderRadius: 10, padding: "2px 8px", fontSize: 10, fontWeight: 800, cursor: "pointer" }}
                >
                  ⏹️ Stop
                </button>
              )}
            </div>
          )}

          {/* Quick Voice Demo Helper Strip */}
          <div style={{ padding: "8px 14px 4px", background: "var(--surface)", borderBottom: "1px solid var(--surface-border)", display: "flex", alignItems: "center", gap: 6, overflowX: "auto", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "var(--coral-d)", flexShrink: 0 }}>⚡ {lang === "ta" ? "குரல் கட்டளைகள்:" : "Voice Commands:"}</span>
            {(lang === "ta" ? [
              "🎙️ 2 மசாலா டீ",
              "📦 பிரியாணி இருக்கா?",
              "👥 கூட்டம் காட்டு",
              "🛒 கார்ட் காட்டு",
              "🎫 டோக்கன் டிராக் செய்",
              "🍽️ மெனு திற",
              "💳 வாலட் பேலன்ஸ்"
            ] : [
              "🎙️ Order 2 Masala Chai",
              "📦 Is Biryani in stock?",
              "👥 Check Crowd",
              "🛒 Show My Cart",
              "🎫 Track My Order",
              "🍽️ Open Menu",
              "💳 Wallet Balance"
            ]).map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => processUserInput(cmd.replace(/^🎙️\s*/, ""))}
                style={{
                  background: "rgba(226,163,16,0.12)",
                  border: "1px solid rgba(226,163,16,0.35)",
                  color: "var(--text)",
                  borderRadius: 12,
                  padding: "3px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0
                }}
              >
                {cmd}
              </button>
            ))}
          </div>

          <div className="chef-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chef-msg-row ${msg.sender}`}>
                {msg.sender === "bot" && <div className="chef-msg-avatar">👨‍🍳</div>}
                <div className="chef-msg-content">
                  <div className="chef-msg-bubble">
                    <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>
                    
                    {msg.cards && (
                      <div className="chef-cards-container">
                        {msg.cards.map((card) => (
                          <div key={card.id} className="chef-item-card">
                            <div className="chef-item-header">
                              <span className="chef-item-name">{lang === "ta" ? (card.name_ta || card.name) : card.name}</span>
                              <span className="chef-item-price">₹{card.price}</span>
                            </div>
                            <div className="chef-item-sub">
                              <span>{card.kcal} kcal</span>
                              <span className={`stock-tag ${card.stock > 0 ? 'in' : 'out'}`}>
                                {card.stock > 0 ? (lang === "ta" ? `${card.stock} உள்ளது` : `${card.stock} in stock`) : (lang === "ta" ? "இருப்பில்லை" : "Out of stock")}
                              </span>
                            </div>
                            {card.stock > 0 && (
                              <button
                                className="chef-add-btn"
                                onClick={() => {
                                  if (addToCart) addToCart(card.id, 1);
                                  processUserInput(lang === "ta" ? `${card.name_ta || card.name} 1 கார்ட்டில் சேர்` : `Add 1 ${card.name} to cart`);
                                }}
                              >
                                🛒 {lang === "ta" ? "கார்ட்டில் சேர் (+1)" : "Add to Cart (+1)"}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.actions && (
                      <div className="chef-actions-row">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            className="chef-action-btn"
                            onClick={() => {
                              if (act.navigate && onNavigate) {
                                onNavigate(act.navigate);
                                if (onClose) onClose(true); // close chatbot so the navigated page is visible
                              }
                              if (act.text) processUserInput(act.text);
                            }}
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", gap: 6, marginTop: 3 }}>
                    <span className="chef-msg-time">{msg.timestamp}</span>
                    {msg.sender === "bot" && (
                      <button
                        type="button"
                        className={`chef-speak-btn ${activeSpeakingId === msg.id ? "speaking" : ""}`}
                        title={activeSpeakingId === msg.id ? "Stop voice" : "Read aloud with voice"}
                        onClick={() => {
                          if (activeSpeakingId === msg.id) {
                            stopSpeaking();
                          } else {
                            speakText(msg.text, msg.id);
                          }
                        }}
                      >
                        {activeSpeakingId === msg.id ? "⏹️" : "🔊"}
                      </button>
                    )}
                  </div>

                  {msg.suggestions && (
                    <div className="chef-msg-suggestions">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          className="chef-sug-chip"
                          onClick={() => processUserInput(sug.replace(/^🎙️\s*/, ""))}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chef-chat-footer">
            <div className="chef-chat-input-row">
              {/* Modern Animated Microphone Button */}
              <button
                type="button"
                className={`chef-mic-btn ${isListening ? "listening" : ""}`}
                onClick={toggleVoiceRecognition}
                title={isListening ? "Listening... Click to stop" : "Click to speak voice command"}
              >
                {isListening ? <MicOffIcon size={18} /> : <MicIcon size={18} />}
              </button>

              <input
                type="text"
                className="chef-input"
                placeholder={isListening ? (lang === "ta" ? "🎙️ கேட்கிறது... இப்போது பேசவும்" : "🎙️ Listening to your voice...") : (lang === "ta" ? "ஷெஃப்பிடம் பேசவும் / கேட்கவும்..." : "Speak or type command... ('Order 2 Masala Chai', 'Check Crowd')")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button
                className="chef-send-btn"
                onClick={() => processUserInput(input)}
                disabled={!input.trim()}
                title="Send"
              >
                <SendIcon size={16} />
              </button>
            </div>
          </div>
        </div>
  );
}


function isPasswordResetRoute(p) {
  const clean = (p || "").replace("#", "").replace(/^\//, "");
  return clean === "forgot-password" || clean === "verify-otp" || clean === "reset-password";
}

function AppShell({ theme, toggleTheme }) {
  const { alertMessage, user, lang, toggleLang, showAlert, updateUserPassword, registeredUsers } = useCanteen();
  const [page, setPage] = useState(() => {
    try {
      const hash = window.location.hash.replace("#", "").replace(/^\//, "");
      if (isPasswordResetRoute(hash)) return hash;
      if (user && hash) return hash;
    } catch (e) {}
    return user ? (user.role === "admin" ? "admin-dashboard" : "order") : "login";
  });
  const [chatOpen, setChatOpen] = useState(false);
  const onNavigate = useCallback((p) => {
    const clean = (p || "").replace("#", "").replace(/^\//, "");
    setPage(clean);
    try {
      window.location.hash = clean;
    } catch (e) {}
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "").replace(/^\//, "");
      if (hash) {
        if (!user && !isPasswordResetRoute(hash)) {
          setPage("login");
        } else {
          setPage(hash);
        }
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [user]);

  // Auth Guard: If no user is logged in (and not on password reset flow) or page is explicitly "login", show LoginPage
  if (page === "login" || (!user && !isPasswordResetRoute(page))) {
    return (
      <AppFrame>
        {alertMessage && (
          <div className="alert-toast">
            <AlertTriangle size={18} />
            <span>{alertMessage}</span>
          </div>
        )}
        <div className="page-col page-col-login">
          <LoginPage
            theme={theme}
            toggleTheme={toggleTheme}
            onNavigate={onNavigate}
            onLogin={(targetPage) => onNavigate(targetPage || (user?.role === "admin" ? "admin-dashboard" : "order"))}
          />
        </div>
      </AppFrame>
    );
  }

  if (isPasswordResetRoute(page)) {
    return (
      <AppFrame>
        {alertMessage && (
          <div className="alert-toast">
            <AlertTriangle size={18} />
            <span>{alertMessage}</span>
          </div>
        )}
        <div className="page-col page-col-login">
          <ForgotPasswordFlow
            onNavigate={onNavigate}
            initialRoute={page}
            lang={lang}
            toggleLang={toggleLang}
            showAlert={showAlert}
            onPasswordResetSuccess={(resetEmail, newPass) => {
              if (updateUserPassword) updateUserPassword(resetEmail, newPass);
            }}
            registeredUsers={registeredUsers}
          />
        </div>
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      {alertMessage && (
        <div className="alert-toast">
          <AlertTriangle size={18} />
          <span>{alertMessage}</span>
        </div>
      )}
      <TopNav page={page} onNavigate={onNavigate} theme={theme} toggleTheme={toggleTheme} onOpenChat={() => setChatOpen(true)} />
      <div className="page-col">
        {page === "admin-dashboard" && <AdminDashboardPage onNavigate={onNavigate} />}
        {page === "admin-home" && <AdminHomePage onNavigate={onNavigate} useCanteenHook={useCanteen} />}
        {(page === "admin-orders" || page === "kitchen-orders") && (
          <AdminOrdersPage onNavigate={onNavigate} useCanteenHook={useCanteen} />
        )}
        {page === "admin-crowd" && (
          <RefactoredCrowdPage onNavigate={onNavigate} useCanteenHook={useCanteen} />
        )}
        {page === "admin-stock" && <AdminStockManagement onNavigate={onNavigate} />}
        {page === "admin-menu" && <AdminMenuPage onNavigate={onNavigate} useCanteenHook={useCanteen} />}
        {page === "qr-scanner" && <QrScannerPage onNavigate={onNavigate} useCanteenHook={useCanteen} />}

        {/* Student Routes */}
        {page === "home" && <HomePage onNavigate={onNavigate} onOpenChat={() => setChatOpen(true)} />}
        {(page === "menu" || page === "order") && <MenuPage onNavigate={onNavigate} />}
        {page === "crowd" && <CrowdPage onNavigate={onNavigate} />}
        {page === "stock" && <StockPage onNavigate={onNavigate} />}
        {page === "feedback" && <FeedbackPage onNavigate={onNavigate} />}
        {page === "cart" && <CartPage onNavigate={onNavigate} />}
        {page === "canteen-select" && <CanteenSelectPage onNavigate={onNavigate} />}
        {page === "payment" && <PaymentPage onNavigate={onNavigate} useCanteenHook={useCanteen} />}
        {page === "order-success" && <OrderSuccessPage onNavigate={onNavigate} useCanteenHook={useCanteen} />}
        {page === "tracking" && <RefactoredTrackingPage onNavigate={onNavigate} useCanteenHook={useCanteen} />}
      </div>
      <RefactoredChefDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onNavigate={onNavigate}
        useCanteenHook={useCanteen}
      />
      {!chatOpen && page !== "login" && page !== "forgot-password" && (
        <FloatingChefButton onClick={() => setChatOpen(true)} />
      )}
    </AppFrame>
  );
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = useCallback(() => setTheme((prev) => (prev === "dark" ? "light" : "dark")), []);

  useEffect(() => {
    document.documentElement.classList.remove("theme-dark", "theme-light");
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <CanteenProvider>
      <AppShell theme={theme} toggleTheme={toggleTheme} />
      <style>{css}</style>
    </CanteenProvider>
  );
}

/* ================================================================== */
/* Styles — Campus Canteen Earthy Palette                             */
/* ================================================================== */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Work+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap');

:root{
  --forest-green: #073B30;
  --forest-green-d: #052b23;
  --gold: #F5B800;
  --gold-hover: #E0A700;
  --cream-bg: #F4EDE0;
  --chalk:#262922; --chalk-2:#33372D; --steel:#ECE8DE; --paper:#FFFFFF;
  --coral:#F5B800; --coral-d:#D9A000; --rose:#C43E1C; --amber:#CC7A00; --emerald:#3E7A4F; --violet:#8B5CF6;
  --turmeric:#F5B800; --turmeric-d:#D9A000; --chili:#C43E1C; --basil:#073B30;
  --ink:#111827; --muted:#64748B; --line:#E2E8F0;
  --font-display:'Work Sans',sans-serif; --font-body:'Work Sans',sans-serif; --font-mono:'IBM Plex Mono',monospace;

  --page-bg: #F4EDE0;
  --surface: #FFFFFF;
  --surface-border: rgba(7,59,48,.08);
  --text: #111827;
  --text-muted: rgba(17,24,39,.65);
  --input-bg: #FFFFFF;
  --input-border: #E2E8F0;
  --button-bg: linear-gradient(135deg, #F5B800 0%, #D9A000 100%);
  --button-bg-flat: #F5B800;
  --button-text: #111827;
  --pill-bg: rgba(7,59,48,.06);
  --pill-border: rgba(7,59,48,.12);
  --pill-active-bg: #F5B800;
  --pill-active-text: #111827;
  --card-shadow: 0 4px 20px rgba(7,59,48,0.05);
  --card-shadow-hover: 0 10px 28px rgba(7,59,48,0.1);
}
:root.theme-dark{
  --page-bg: #0b1a16;
  --surface: #0f2721;
  --surface-border: rgba(245,184,0,.25);
  --text: #f7ecd4;
  --text-muted: rgba(247,236,212,.72);
  --input-bg: rgba(7,59,48,.4);
  --input-border: rgba(255,255,255,.14);
  --button-bg: linear-gradient(135deg, #F5B800 0%, #D9A000 100%);
  --button-bg-flat: #F5B800;
  --button-text: #111827;
  --pill-bg: rgba(255,255,255,.05);
  --pill-border: rgba(245,184,0,.25);
  --pill-active-bg: #F5B800;
  --pill-active-text: #111827;
  --card-shadow: 0 10px 36px rgba(0,0,0,0.35);
  --card-shadow-hover: 0 20px 54px rgba(0,0,0,0.5);
}
:root.theme-light{
  --page-bg: #F4EDE0;
  --surface: #FFFFFF;
  --surface-border: rgba(7,59,48,.08);
  --text: #111827;
  --text-muted: rgba(17,24,39,.65);
  --input-bg: #FFFFFF;
  --input-border: #E2E8F0;
  --button-bg: linear-gradient(135deg, #F5B800 0%, #D9A000 100%);
  --button-bg-flat: #F5B800;
  --button-text: #111827;
  --pill-bg: rgba(7,59,48,.06);
  --pill-border: rgba(7,59,48,.12);
  --pill-active-bg: #F5B800;
  --pill-active-text: #27231b;
  --card-shadow: 0 10px 32px rgba(15,23,42,0.06);
  --card-shadow-hover: 0 18px 48px rgba(15,23,42,0.12);
}

*{ box-sizing:border-box; margin:0; padding:0; }
body{ font-family:var(--font-body); background:var(--page-bg); color:var(--text); -webkit-font-smoothing:antialiased; }
::selection{ background:rgba(226,163,16,0.35); color:var(--ink); }

/* Custom Scrollbars */
::-webkit-scrollbar { width:7px; height:7px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:rgba(226,163,16,0.35); border-radius:10px; }
::-webkit-scrollbar-thumb:hover { background:var(--coral); }

html, #root{ height:100%; }
.app-shell{ min-height:100vh; width:100vw; overflow-x:hidden; background:var(--page-bg); display:flex; flex-direction:column; }
.page-col{ flex:1; display:flex; flex-direction:column; min-height:0; width:100%; margin:0; background:transparent; box-shadow:none; }
.page-col-login{ min-height:100vh; width:100%; background:transparent; box-shadow:none; display:flex; flex-direction:column; }

/* ---- Reference Login Layout matching User Mockup with Vivid Background Image ---- */
/* ── Login Error Popup Toast ────────────────────────────────────────── */
@keyframes loginPopupIn {
  0%   { opacity: 0; transform: translateY(-28px) scale(0.95); }
  60%  { transform: translateY(4px) scale(1.01); }
  80%  { transform: translateY(-3px) scale(1); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes loginPopupShake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
.login-popup-error {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 300px;
  max-width: 420px;
  padding: 14px 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(200, 30, 30, 0.92), rgba(160, 20, 20, 0.88));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 120, 120, 0.35);
  box-shadow: 0 8px 32px rgba(180, 30, 30, 0.38), 0 2px 8px rgba(0,0,0,0.18);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
  animation: loginPopupIn 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards,
             loginPopupShake 0.45s 0.3s ease both;
}
.login-popup-icon {
  font-size: 18px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4));
}
.login-popup-msg {
  flex: 1;
  letter-spacing: 0.01em;
}
.login-popup-close {
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s;
}
.login-popup-close:hover {
  background: rgba(255,255,255,0.28);
}

.ref-login-canvas {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #0f172a;
  overflow-x: hidden;
  font-family: var(--font-body);
}

.ref-login-bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
  filter: brightness(1.15) contrast(1.05) saturate(1.25);
}

.ref-login-video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.04) 0%,
    rgba(0, 0, 0, 0.08) 60%,
    rgba(0, 0, 0, 0.22) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.ref-watermark-login {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(85px, 14vw, 170px);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.4);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  letter-spacing: -3px;
  pointer-events: none;
  z-index: 1;
  user-select: none;
  text-transform: capitalize;
}

.ref-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px;
  position: relative;
  z-index: 10;
}

.ref-brand-badge {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ref-badge-seal {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  border: 2px dashed #ea580c;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(234, 88, 12, 0.18);
  position: relative;
  padding: 4px;
}
.ref-badge-icon {
  font-size: 20px;
  line-height: 1;
}
.ref-badge-ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 1px;
}
.ref-badge-text-top {
  font-size: 6.5px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #ea580c;
  text-transform: uppercase;
  font-family: var(--font-mono);
}
.ref-badge-text-bot {
  font-size: 5.5px;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.ref-top-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.ref-lang-btn {
  background: #ffffff !important;
  color: #374151 !important;
  border: 1px solid #e5e7eb !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.ref-center-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  margin: 10px auto 36px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ref-header-group {
  text-align: center;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  padding: 12px 28px;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.9);
}
.ref-page-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 38px;
  font-weight: 900;
  color: #ea580c;
  background: linear-gradient(135deg, #ff7a00 0%, #ea580c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}
.ref-page-subtitle {
  font-size: 13px;
  color: #374151;
  font-weight: 600;
}
.ref-highlight {
  color: #ea580c;
  font-weight: 800;
}

.ref-card {
  width: 100%;
  background: #ffffff;
  border-radius: 24px;
  padding: 34px 34px 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.07);
  border: 1px solid #f1f5f9;
  backdrop-filter: blur(16px);
  animation: cardFadeIn 0.35s ease;
}
@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.ref-role-tabs {
  display: flex;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 30px;
  gap: 4px;
  margin-bottom: 20px;
}
.ref-role-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 9px 12px;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-body);
}
.ref-role-btn.active {
  background: #ffffff;
  color: #111827;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.ref-input-pill-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  padding: 12px 18px;
  transition: all 0.2s ease;
}
.ref-input-pill-wrap:focus-within {
  border-color: #ea580c;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.15);
}
.ref-input-icon {
  color: #9ca3af;
  display: flex;
  align-items: center;
}
.ref-pill-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13.5px;
  color: #111827;
  font-family: var(--font-body);
  font-weight: 500;
}
.ref-pill-input::placeholder {
  color: #9ca3af;
}
.ref-eye-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.ref-eye-btn:hover {
  color: #4b5563;
}

.ref-pill-select {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  background: #f3f4f6;
  padding: 11px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  outline: none;
  font-family: var(--font-body);
}
.ref-pill-static {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  background: #f3f4f6;
  padding: 11px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #4b5563;
}

.ref-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 4px 20px;
  font-size: 12.5px;
}
.ref-remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
}
.ref-remember input {
  accent-color: #ea580c;
  width: 15px;
  height: 15px;
}
.ref-forgot-link {
  background: none;
  border: none;
  color: #6b7280;
  font-weight: 600;
  font-size: 12.5px;
  cursor: pointer;
  transition: color 0.15s;
}
.ref-forgot-link:hover {
  color: #ea580c;
  text-decoration: underline;
}

button,
button * {
  user-select: none;
  -webkit-user-select: none;
  caret-color: transparent !important;
}

.ref-cta-btn {
  width: 100%;
  border: none;
  border-radius: 30px;
  padding: 14px 0;
  background: #ea580c;
  background: linear-gradient(135deg, #ff7a00 0%, #ea580c 100%);
  color: #ffffff;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 13.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(234, 88, 12, 0.42);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.ref-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 34px rgba(234, 88, 12, 0.55);
}
.ref-cta-btn:active {
  transform: scale(0.99);
}

.ref-quick-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 20px;
  border: 1px dashed #e5e7eb;
}
.ref-quick-demo-lbl {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
}
.ref-demo-chip {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}
.ref-demo-chip:hover {
  border-color: #ea580c;
  color: #ea580c;
}
.ref-demo-chip.admin {
  border-color: #fdba74;
  color: #c2410c;
}

.ref-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 18px 0 14px;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
}
.ref-divider::before,
.ref-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}
.ref-divider span {
  padding: 0 12px;
}

.ref-social-row {
  display: flex;
  justify-content: center;
  gap: 14px;
}
.ref-social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.ref-social-btn:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}
.ref-social-btn.fb { color: #3b5998; font-weight: 900; }
.ref-social-btn.gp { color: #ea4335; }
.ref-social-btn.tw { color: #1da1f2; }

.ref-switch-wrap {
  text-align: center;
  margin-top: 18px;
}
.ref-switch-link {
  background: none;
  border: none;
  color: #4b5563;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s;
}
.ref-switch-link:hover {
  color: #ea580c;
  text-decoration: underline;
}

.ref-footer {
  width: 100%;
  padding: 18px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  border-top: 1px solid #e5e7eb;
  background: rgba(249, 250, 251, 0.9);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 10;
}
.ref-footer-nav {
  display: flex;
  gap: 22px;
}
.ref-foot-link {
  font-size: 12.5px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: color 0.15s;
}
.ref-foot-link:hover {
  color: #111827;
}
.ref-footer-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.ref-social-minis {
  display: flex;
  gap: 10px;
  font-size: 13px;
  cursor: pointer;
}
.ref-copyright {
  font-size: 11.5px;
  color: #94a3b8;
  font-weight: 500;
}

@media (max-width: 640px) {
  .ref-topbar { padding: 18px 20px; }
  .ref-footer { padding: 16px 20px; justify-content: center; text-align: center; }
  .ref-footer-nav { justify-content: center; }
  .ref-card { padding: 26px 20px 22px; border-radius: 22px; }
  .ref-page-title { font-size: 30px; }
}

/* ---- Home hero + Campus Board ---- */
.home-hero{ background:linear-gradient(180deg, #FFF6E3 0%, #FDEEd2 60%, var(--steel) 100%); padding:18px 0 24px; flex-shrink:0; }
.eyebrow{ font-family:var(--font-mono); font-size:10px; letter-spacing:.16em; color:var(--muted); text-transform:uppercase; margin-top:6px; font-weight:800; }
.icon-btn{ position:relative; width:36px; height:36px; border-radius:50%; border:none; display:flex; align-items:center;
  justify-content:center; cursor:pointer; background:rgba(255,255,255,.08); color:var(--paper); transition:transform .15s, background .15s; }
.icon-btn:hover{ transform:scale(1.08); }
.icon-btn.on-light{ background:linear-gradient(135deg, var(--coral), #b8830b); color:#1f1a0f; box-shadow:0 6px 16px rgba(226,163,16,.4); }
.icon-dot{ position:absolute; top:-2px; right:-2px; width:9px; height:9px; border-radius:50%; background:var(--rose); border:2px solid var(--coral); }
.notif-wrap{ position:relative; }
.notif-drop{ position:absolute; right:0; top:46px; width:min(360px, calc(100vw - 28px)); min-width:280px; background:var(--surface); border-radius:22px;
  box-shadow:0 20px 50px rgba(15,23,42,.22); padding:14px 16px; z-index:25; border:1.5px solid var(--surface-border); backdrop-filter:blur(20px); }
.notif-item{ font-size:12.5px; line-height:1.5; color:var(--ink); padding:10px 8px; border-bottom:1px dashed var(--line); }
.notif-item:last-child{ border-bottom:none; }

.hero-thesis{ padding:10px 20px 16px; }
.hero-thesis h1{ font-family:var(--font-display); color:var(--ink); font-size:28px; line-height:1.08; margin:0; letter-spacing:.04em; text-transform:uppercase; text-shadow:0 2px 4px rgba(255,255,255,.5); }
.hero-thesis .sub{ font-family:var(--font-mono); font-size:10.5px; color:var(--coral-d); margin-top:9px; letter-spacing:.12em; font-weight:800; text-transform:uppercase; }

.flapboard{ background:var(--surface); border-radius:24px; padding:10px; margin:0 20px; box-shadow:0 16px 40px rgba(15,23,42,.1); border:1.5px solid var(--surface-border); backdrop-filter:blur(16px); }
.fb-head{ display:flex; justify-content:space-between; align-items:center; padding:10px 12px 12px; }
.fb-title{ font-family:var(--font-display); font-size:12px; color:var(--ink); text-transform:uppercase; letter-spacing:0.06em; }
.fb-live{ display:flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:9.5px; color:var(--emerald); font-weight:800; letter-spacing:.08em; }
.fb-live i{ width:7px; height:7px; border-radius:50%; background:var(--emerald); box-shadow:0 0 0 3px rgba(16,185,129,.2); display:block; animation:crowd-pulse 2s infinite; }
.flap-row{ display:flex; justify-content:space-between; align-items:center; gap:10px; padding:14px 16px; margin-bottom:8px; border-radius:16px; background:var(--steel); transition:transform .15s; }
.flap-row:hover{ transform:translateY(-1px); }
.flap-row:last-child{ margin-bottom:0; }
.flap-name{ font-weight:800; font-size:13.5px; color:var(--ink); }
.flap-loc{ font-family:var(--font-mono); font-size:9.5px; color:var(--muted); margin-top:3px; }
.flap-right{ display:flex; align-items:center; gap:10px; }
.flap-wait{ font-family:var(--font-mono); font-weight:800; font-size:14px; color:var(--coral-d); min-width:44px; text-align:right; }
.pill{ display:inline-flex; align-items:center; gap:5px; font-family:var(--font-mono); font-weight:700; font-size:10.5px; padding:4px 10px; border-radius:20px; }
.pill .dot{ width:6px; height:6px; border-radius:50%; }

.qa-row{ display:flex; gap:10px; padding:18px 20px 4px; flex-shrink:0; }
.qa-chip{ flex:1; background:var(--surface); border:1.5px solid var(--surface-border); border-radius:16px; padding:12px 8px;
  text-align:center; cursor:pointer; font-family:var(--font-body); transition:all .2s ease; box-shadow:0 4px 16px rgba(15,23,42,0.04); }
.qa-chip:hover{ transform:translateY(-3px); box-shadow:0 10px 24px rgba(15,23,42,.12); border-color:var(--coral); }
.qa-chip .qa-ic{ display:flex; align-items:center; justify-content:center; color:var(--ink); transition:transform .2s; }
.qa-chip:hover .qa-ic{ transform:scale(1.15); }
.qa-lbl{ font-size:10px; font-weight:800; margin-top:6px; color:var(--ink); white-space:nowrap; letter-spacing:0.02em; }
.qa-chip.accent{ background:linear-gradient(135deg, var(--coral), #b8830b); border-color:transparent; box-shadow:0 6px 20px rgba(226,163,16,0.35); }
.qa-chip.accent .qa-ic{ color:#1f1a0f; }
.qa-chip.accent .qa-lbl{ color:#1f1a0f; }

/* ---- Generic layout bits reused across pages ---- */
.header{ background:var(--chalk); padding:16px 20px; flex-shrink:0; display:flex; align-items:center; gap:12px; }
.header .back{ background:none; border:none; color:var(--paper); cursor:pointer; display:flex; transition:transform .15s; }
.header .back:hover{ transform:scale(1.15); }
.header .h-title{ font-family:var(--font-display); color:var(--paper); font-size:16px; letter-spacing:.08em; text-transform:uppercase; }
.header .eyebrow{ color:#A9A498; letter-spacing:.18em; }
.scroll{ flex:1; overflow-y:auto; padding:0 20px 24px; }
.section-title{ font-family:var(--font-display); font-size:13px; color:var(--ink); margin:20px 0 14px; text-transform:uppercase; letter-spacing:.12em; display:flex; justify-content:space-between; align-items:center; }
.see-all{ color:var(--coral-d); font-size:11.5px; font-weight:700; text-transform:none; letter-spacing:0; cursor:pointer; }
.card{ background:var(--surface); border-radius:20px; padding:16px; border:1.5px solid var(--surface-border); margin-bottom:16px; backdrop-filter:blur(16px); box-shadow:var(--card-shadow); transition:transform .2s ease, box-shadow .2s ease; }
.card:hover{ box-shadow:var(--card-shadow-hover); }
.grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.bold{ font-weight:800; } .muted{ color:var(--muted); } .small{ font-size:11.5px; } .mono{ font-family:var(--font-mono); }

.food-thumb{ width:44px; height:44px; border-radius:14px; flex-shrink:0; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 6px 18px rgba(245,158,11,0.35); }
.food-thumb.lg{ width:60px; height:60px; border-radius:16px; }

/* ---- Menu / Order ---- */
.cats{ display:flex; gap:8px; overflow-x:auto; margin-bottom:18px; padding-bottom:4px; }
.chip{ flex:0 0 auto; padding:9px 16px; border-radius:24px; font-size:12.5px; font-weight:700; border:1.5px solid var(--line);
  color:var(--muted); background:var(--surface); cursor:pointer; font-family:var(--font-body); transition:all .2s ease; }
.chip.active{ background:var(--chalk); border-color:var(--chalk); color:#fff; box-shadow:0 6px 18px rgba(38,41,34,0.25); }
.chip:hover:not(.active){ border-color:var(--coral); color:var(--ink); transform:translateY(-1px); }
.ticket{ background:var(--surface); border-radius:20px; margin-bottom:14px; padding:16px; display:flex; gap:14px; border:1.5px solid var(--surface-border); transition:transform .2s ease, box-shadow .2s ease; box-shadow:var(--card-shadow); backdrop-filter:blur(12px); }
.ticket:hover{ transform:translateY(-3px); box-shadow:var(--card-shadow-hover); border-color:rgba(226,163,16,0.35); }
.item-info{ flex:1; } .item-name{ font-weight:800; font-size:14.5px; color:var(--ink); }
.item-tag{ font-size:10.5px; font-weight:700; margin-top:3px; }
.item-bottom{ display:flex; align-items:center; justify-content:space-between; margin-top:10px; }
.price{ font-family:var(--font-mono); font-weight:800; font-size:15px; color:var(--ink); }
.stepper{ display:flex; align-items:center; gap:8px; background:var(--steel); border-radius:10px; padding:4px 6px; }
.stepper button{ border:none; background:none; width:22px; height:22px; display:flex; align-items:center; justify-content:center; color:var(--chalk); cursor:pointer; transition:transform .1s; }
.stepper button:hover{ transform:scale(1.2); }
.stepper span{ font-family:var(--font-mono); font-size:13px; min-width:16px; text-align:center; font-weight:800; }
.add-btn{ background:linear-gradient(135deg, var(--coral), #b8830b); color:#1f1a0f; padding:9px 18px; border:none; border-radius:10px; font-weight:800; font-size:12px; cursor:pointer; box-shadow:0 4px 14px rgba(226,163,16,0.35); transition:transform .15s, box-shadow .15s; }
.add-btn:hover{ transform:scale(1.05); box-shadow:0 6px 20px rgba(226,163,16,0.5); }
.cartbar{ position:absolute; left:16px; right:16px; bottom:78px; background:var(--chalk); border-radius:18px; padding:14px 20px;
  display:flex; align-items:center; justify-content:space-between; box-shadow:0 14px 40px rgba(15,23,42,.4); border:1px solid rgba(255,255,255,0.15); backdrop-filter:blur(20px); }
.cartbar .left{ color:#E2E8F0; font-size:13px; font-weight:600; }
.cta-mini{ background:linear-gradient(135deg, var(--coral), #b8830b); color:#1f1a0f; border:none; border-radius:10px; padding:10px 18px; font-weight:800; font-size:13px; cursor:pointer; box-shadow:0 4px 14px rgba(226,163,16,0.35); transition:transform .15s; }
.cta-mini:hover{ transform:scale(1.03); }

/* ---- Cart / checkout ---- */
.list-row{ display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px dashed var(--line); }
.list-row:last-child{ border-bottom:none; }
.list-left{ display:flex; align-items:center; gap:10px; flex:1; font-size:13.5px; }
.promo{ display:flex; gap:8px; margin-bottom:8px; }
.promo input{ flex:1; border:1.5px dashed var(--line); background:var(--surface); border-radius:12px; padding:12px 14px; font-family:var(--font-mono); font-size:13px; outline:none; transition:border-color .2s; }
.promo input:focus{ border-color:var(--coral); }
.promo button{ border:none; background:var(--chalk); color:#E2E8F0; border-radius:12px; padding:0 18px; font-weight:800; font-size:12.5px; cursor:pointer; transition:background .15s; }
.promo button:hover{ background:var(--chalk-2); }
.hint{ font-size:12px; margin:6px 2px 16px; font-weight:700; }
.hint.success{ color:var(--emerald); } .hint.error{ color:var(--rose); }
.mode-row{ display:flex; gap:8px; margin-bottom:8px; }
.mode{ flex:1; text-align:center; padding:14px 6px; border-radius:12px; border:1.5px solid var(--line); background:var(--surface);
  font-size:12px; font-weight:800; color:var(--muted); cursor:pointer; font-family:var(--font-body); transition:all .2s ease; }
.mode.active{ border-color:var(--coral); background:rgba(226,163,16,0.14); color:var(--coral-d); box-shadow:0 4px 16px rgba(226,163,16,0.2); }
.r-row{ display:flex; justify-content:space-between; font-size:13px; color:var(--muted); padding:7px 0; }
.r-row.total{ color:var(--ink); font-weight:800; font-size:15px; border-top:1px dashed var(--line); padding-top:12px; margin-top:8px; }
.checkoutbar{ position:absolute; left:0; right:0; bottom:0; background:var(--surface); border-top:1.5px solid var(--surface-border); padding:18px 24px 28px; backdrop-filter:blur(20px); box-shadow:0 -10px 40px rgba(0,0,0,0.08); display:flex; align-items:center; }
.flapboard.home-canteen-cta{ cursor:default; }
.place-btn{ width:100%; background:linear-gradient(135deg, var(--coral), #b8830b); color:#1f1a0f; border:none; border-radius:16px; padding:16px 0;
  font-weight:800; font-size:16px; letter-spacing:0.04em; box-shadow:0 8px 24px rgba(226,163,16,0.4); cursor:pointer; transition:transform .15s, box-shadow .15s; }
.place-btn:hover{ transform:translateY(-2px); box-shadow:0 12px 32px rgba(226,163,16,0.55); }
.empty-state{ text-align:center; padding:60px 20px; color:var(--muted); font-size:13px; line-height:2; }
.cart-header{ background:var(--chalk); border-bottom:1px solid var(--line); }
.cart-head-copy{ display:flex; flex-direction:column; gap:4px; }
.cart-empty-state{ display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:56vh; gap:16px; }
.empty-badge{ width:72px; height:72px; border-radius:22px; display:flex; align-items:center; justify-content:center; background:rgba(226,163,16,.14); font-size:32px; box-shadow:inset 0 0 0 1.5px rgba(226,163,16,.3); }
.empty-title{ color:var(--ink); font-size:20px; font-weight:800; }
.empty-link{ border:2px solid var(--coral); background:transparent; color:var(--coral-d); border-radius:14px; padding:14px 22px; font-size:15px; font-weight:800; cursor:pointer; transition:all .2s ease; }
.empty-link:hover{ background:rgba(226,163,16,.12); transform:translateY(-2px); }
.empty-link span{ display:inline-block; margin-left:6px; }

/* ---- Tracking ---- */
.token-card{ background:var(--surface); margin:-16px 20px 0; border-radius:22px; padding:24px 22px; text-align:center;
  position:relative; z-index:3; box-shadow:0 16px 44px rgba(15,23,42,.14); border:1.5px solid var(--surface-border); backdrop-filter:blur(16px); }
.token-label{ font-family:var(--font-mono); font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.12em; font-weight:700; }
.token-number{ font-family:var(--font-display); font-size:48px; color:var(--coral-d); margin:6px 0 10px; text-shadow:0 2px 10px rgba(226,163,16,0.25); }
.token-tear{ border-top:2px dashed var(--line); margin:16px 0; }
.token-meta{ display:flex; justify-content:space-between; font-size:12px; color:var(--muted); }
.token-meta b{ color:var(--ink); font-family:var(--font-mono); display:block; font-size:13.5px; margin-top:2px; font-weight:800; }
.status-track{ display:flex; margin-bottom:20px; }
.step{ flex:1; text-align:center; position:relative; }
.step .node{ width:28px; height:28px; border-radius:50%; background:var(--chalk); color:#E2E8F0; display:flex;
  align-items:center; justify-content:center; margin:0 auto 6px; font-size:12px; font-weight:800; position:relative; z-index:2; box-shadow:0 4px 12px rgba(0,0,0,0.15); }
.step.pending .node{ background:var(--surface); color:var(--muted); border:2px solid var(--line); box-shadow:none; }
.step .bar{ position:absolute; top:14px; left:-50%; width:100%; height:3px; background:var(--chalk); z-index:1; }
.step:first-child .bar{ display:none; } .step.pending .bar{ background:var(--line); }
.step .lbl{ font-size:10px; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em; }
.step:not(.pending) .lbl{ color:var(--ink); }
.simulate-btn{ width:100%; background:var(--chalk); color:#E2E8F0; border:none; border-radius:12px; padding:13px 0;
  font-weight:800; font-size:13px; margin-bottom:8px; cursor:pointer; transition:background .15s; }
.simulate-btn:hover{ background:var(--chalk-2); }
.done-banner{ background:linear-gradient(135deg,var(--emerald),#059669); color:#fff; text-align:center; border-radius:12px; padding:14px; font-weight:800; margin-bottom:10px; box-shadow:0 6px 20px rgba(5,150,105,0.3); }
.toggle-row{ display:flex; align-items:center; justify-content:space-between; background:var(--surface); border:1.5px solid var(--surface-border);
  border-radius:16px; padding:14px 18px; margin:18px 0; }
.t-label{ font-size:13px; font-weight:700; color:var(--ink); }
.t-sub{ font-size:11px; color:var(--muted); margin-top:2px; }
.switch{ width:42px; height:24px; background:var(--line); border-radius:20px; position:relative; border:none; cursor:pointer; transition:background .2s; }
.switch::after{ content:""; position:absolute; width:20px; height:20px; background:#fff; border-radius:50%; top:2px; left:2px; transition:.2s; box-shadow:0 2px 6px rgba(0,0,0,.2); }
.switch.on{ background:var(--coral); }
.switch.on::after{ left:20px; }
.cancel-link{ text-align:center; color:var(--rose); font-size:13px; font-weight:800; padding:8px 0 24px; cursor:pointer; }

/* ---- Top nav (web) ---- */
.topnav{ position:sticky; top:0; z-index:40; width:100%; background:rgba(38,41,34,0.92); backdrop-filter:blur(20px); flex-shrink:0;
  box-shadow:0 4px 20px rgba(0,0,0,.15); border-bottom:1px solid rgba(226,163,16,0.2); box-sizing:border-box; }
.topnav-inner{ width:100%; max-width:100%; box-sizing:border-box; margin:0; display:flex; align-items:center; justify-content:space-between;
  gap:8px; padding:8px 16px; }
.topnav-left{ display:flex; align-items:center; gap:8px; flex-shrink:0; }
.topnav-brand{ display:flex; align-items:center; gap:6px; font-family:var(--font-display); color:var(--paper);
  font-size:14px; letter-spacing:.02em; white-space:nowrap; flex-shrink:0; }
.topnav-dot{ width:8px; height:8px; border-radius:50%; background:#4ade80; flex-shrink:0; box-shadow:0 0 0 3px rgba(74,222,128,0.25); animation:chefPulse 2s infinite; }
.topnav-items{ display:flex; align-items:center; justify-content:center; gap:4px; flex:1; min-width:0;
  overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; padding:2px 4px; }
.topnav-items::-webkit-scrollbar{ display:none; }
.topnav-right{ display:flex; align-items:center; justify-content:flex-end; gap:8px; flex-shrink:0; margin-left:auto; }
.navitem{ display:inline-flex; align-items:center; justify-content:center; gap:5px; font-size:12px; color:#A9A498; font-weight:700;
  background:none; border:none; cursor:pointer; font-family:var(--font-body); padding:6px 11px; border-radius:18px;
  white-space:nowrap; text-align:center; flex-shrink:0; transition:background .2s, color .2s, transform .15s; }
.navitem:hover{ color:var(--paper); background:rgba(255,255,255,.08); transform:translateY(-1px); }
.navitem.active{ color:#1f1a0f; background:linear-gradient(135deg, var(--coral), #b8830b); box-shadow:0 4px 14px rgba(226,163,16,0.35); }
.navicon{ display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; font-size:13px; }
.navitem span:last-child{ display:none; white-space:nowrap; }
.logout-btn{ flex-shrink:0 !important; }
@media (min-width:520px){
  .navitem span:last-child{ display:inline; }
}
@media (max-width:960px){
  .topnav-inner{ padding:8px 10px; gap:6px; }
  .topnav-brand span:last-child{ display:none; }
}

/* ---- Crowd page ---- */
@keyframes crowd-flash{ 0%{ box-shadow:0 0 0 0 rgba(226,163,16,.5); } 100%{ box-shadow:0 0 0 12px rgba(226,163,16,0); } }
.crowd-live-badge{ display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:10.5px;
  color:#4ade80; font-weight:800; letter-spacing:.06em; background:rgba(15,23,42,.6); backdrop-filter:blur(10px);
  padding:6px 14px; border-radius:20px; border:1px solid rgba(74,222,128,.3); }
.crowd-live-badge i{ width:8px; height:8px; border-radius:50%; background:#4ade80;
  box-shadow:0 0 0 3px rgba(74,222,128,.2); display:block; animation:crowd-pulse 2s infinite; }
@keyframes crowd-pulse{ 0%,100%{ box-shadow:0 0 0 3px rgba(74,222,128,.2); } 50%{ box-shadow:0 0 0 7px rgba(74,222,128,.4); } }

.crowd-summary-strip{ display:flex; gap:10px; margin-bottom:20px; }
.crowd-summary-chip{ flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
  background:var(--surface); border:1.5px solid var(--surface-border); border-radius:16px; padding:12px 10px;
  font-family:var(--font-mono); font-size:13.5px; backdrop-filter:blur(12px); box-shadow:0 4px 16px rgba(0,0,0,0.04); }
.crowd-summary-chip .dot{ width:8px; height:8px; border-radius:50%; flex-shrink:0; }

.crowd-card{ background:var(--surface); border-radius:24px; padding:22px; margin-bottom:18px;
  border:1.5px solid var(--surface-border); box-shadow:0 8px 28px rgba(15,23,42,.08); transition:all .3s ease; backdrop-filter:blur(16px); }
.crowd-card-flash{ animation:crowd-flash .6s ease-out; }
.crowd-card-header{ display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:16px; }
.crowd-card-info{ flex:1; }
.crowd-card-name{ font-weight:800; font-size:17px; color:var(--ink); }
.crowd-card-loc{ font-family:var(--font-mono); font-size:11px; color:var(--muted); margin-top:3px; }
.crowd-card-ago{ font-size:10.5px; color:var(--coral-d); font-weight:700; margin-top:6px;
  display:inline-flex; align-items:center; gap:5px; }
.crowd-card-ago::before{ content:""; width:6px; height:6px; border-radius:50%; background:var(--coral-d); }
.crowd-card-status{ display:flex; flex-direction:column; align-items:flex-end; gap:6px; }
.crowd-emoji{ font-size:32px; line-height:1; }

.crowd-bar-wrap{ margin-bottom:18px; }
.crowd-bar-label{ display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.crowd-bar-label span:first-child{ font-size:12.5px; color:var(--muted); font-weight:600; }
.crowd-wait-tag{ font-family:var(--font-mono); font-size:11.5px; font-weight:800; color:var(--coral-d);
  background:rgba(226,163,16,.14); padding:4px 12px; border-radius:10px; }
.crowd-bar-track{ width:100%; height:10px; border-radius:10px; background:var(--steel); overflow:hidden; }
.crowd-bar-fill{ height:100%; border-radius:10px; transition:width .5s ease, background .5s ease; }

.crowd-update-btn{ width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
  padding:14px 0; border:1.5px dashed var(--line); border-radius:16px; background:transparent;
  color:var(--muted); font-size:13.5px; font-weight:800; cursor:pointer; transition:all .2s;
  font-family:var(--font-body); }
.crowd-update-btn:hover{ border-color:var(--coral); color:var(--coral-d); background:rgba(226,163,16,.06); }

.crowd-picker{ background:var(--steel); border-radius:20px; padding:18px; }
.crowd-picker-title{ font-size:13px; font-weight:800; color:var(--ink); margin-bottom:14px; text-align:center; }
.crowd-picker-options{ display:flex; gap:10px; margin-bottom:14px; }
.crowd-pick-btn{ flex:1; display:flex; flex-direction:column; align-items:center; gap:5px;
  padding:16px 10px; border-radius:16px; border:2px solid transparent;
  background:var(--surface); cursor:pointer; transition:all .2s;
  font-family:var(--font-body); }
.crowd-pick-btn:hover{ border-color:var(--pick-color); transform:translateY(-3px); box-shadow:0 8px 20px rgba(15,23,42,.12); }
.crowd-pick-btn.active{ border-color:var(--pick-color); background:var(--pick-bg); }
.crowd-pick-emoji{ font-size:26px; line-height:1; }
.crowd-pick-label{ font-size:13.5px; font-weight:800; color:var(--ink); }
.crowd-pick-desc{ font-size:10px; color:var(--muted); text-align:center; line-height:1.3; }
.crowd-pick-current{ font-family:var(--font-mono); font-size:9px; color:var(--pick-color); font-weight:800;
  background:var(--pick-bg); padding:3px 10px; border-radius:8px; margin-top:4px; letter-spacing:.04em; }
.crowd-cancel-btn{ width:100%; padding:10px 0; border:none; border-radius:12px; background:transparent;
  color:var(--muted); font-size:12.5px; font-weight:800; cursor:pointer; font-family:var(--font-body); }
.crowd-cancel-btn:hover{ color:var(--rose); }

.crowd-tip-card{ display:flex; gap:14px; align-items:flex-start; background:rgba(226,163,16,.08);
  border:1px solid rgba(226,163,16,.2); border-radius:18px; padding:18px 20px; margin-top:10px; }
.crowd-tip-icon{ font-size:24px; flex-shrink:0; margin-top:2px; }
.crowd-tip-title{ font-size:13.5px; font-weight:800; color:var(--ink); margin-bottom:4px; }
.crowd-tip-text{ font-size:12px; color:var(--muted); line-height:1.5; }

/* ---- Theme & Language toggles ---- */
.theme-toggle{ background:rgba(226,163,16,.18); border:1px solid rgba(226,163,16,.3); color:var(--muted);
  font-size:11.5px; font-weight:800; padding:7px 16px; border-radius:24px; cursor:pointer; font-family:var(--font-body);
  transition:all .2s ease; }
.theme-toggle:hover{ background:rgba(226,163,16,.3); color:var(--ink); transform:translateY(-1px); }

/* ---- Low Stock Alerts ---- */
.low-stock-alert-banner{ background:rgba(196,62,28,.09); border:1.5px solid rgba(196,62,28,.32); color:var(--chili);
  border-radius:16px; padding:14px 18px; margin-bottom:18px; display:flex; align-items:center; gap:14px; font-size:13.5px;
  animation:lowStockPulse 2.5s infinite ease-in-out; }
@keyframes lowStockPulse{ 0%,100%{ border-color:rgba(196,62,28,.32); box-shadow:0 0 0 0 rgba(196,62,28,0); }
  50%{ border-color:rgba(196,62,28,.7); box-shadow:0 0 16px 0 rgba(196,62,28,.25); } }

.low-stock-badge{ background:rgba(196,62,28,.16); color:var(--chili); font-weight:800; font-size:9.5px;
  padding:3px 9px; border-radius:8px; display:inline-flex; align-items:center; gap:4px; margin-left:8px; letter-spacing:.04em; }

.alert-toast{ position:fixed; top:75px; left:50%; transform:translateX(-50%); z-index:9999;
  background:linear-gradient(135deg, #c43e1c, #991b1b); color:#fff; padding:14px 24px; border-radius:30px; font-size:13px; font-weight:800;
  box-shadow:0 12px 32px rgba(196,62,28,.45); display:flex; align-items:center; gap:12px;
  animation:toastSlideDown .4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border:1px solid rgba(255,255,255,0.2); }
@keyframes toastSlideDown{ from{ opacity:0; transform:translate(-50%,-24px); } to{ opacity:1; transform:translate(-50%,0); } }

/* ---- Feedback & Rating Page Styles ---- */
.fb-summary-card { background: var(--surface); border-radius: 24px; padding: 22px; border: 1.5px solid var(--surface-border); display: flex; gap: 24px; align-items: center; box-shadow: var(--card-shadow); backdrop-filter: blur(16px); }
.fb-score-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-right: 22px; border-right: 1.5px dashed var(--line); min-width: 120px; }
.fb-score-number { font-family: var(--font-display); font-size: 42px; color: var(--ink); line-height: 1; }
.fb-stars-row { display: flex; gap: 4px; margin: 6px 0; color: var(--coral); }
.fb-total-text { font-size: 11px; color: var(--muted); font-family: var(--font-mono); font-weight: 700; }
.fb-bars-box { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.fb-bar-row { display: flex; align-items: center; gap: 10px; font-size: 11.5px; }
.fb-bar-label { font-family: var(--font-mono); font-weight: 800; width: 28px; color: var(--muted); }
.fb-bar-track { flex: 1; height: 7px; background: var(--steel); border-radius: 8px; overflow: hidden; }
.fb-bar-fill { height: 100%; background: linear-gradient(90deg, var(--coral), #b8830b); border-radius: 8px; transition: width .5s ease; }
.fb-bar-count { font-family: var(--font-mono); font-size: 10.5px; color: var(--muted); width: 20px; text-align: right; font-weight:700; }

.star-picker { display: flex; align-items: center; gap: 6px; background: var(--steel); padding: 12px 16px; border-radius: 18px; flex-wrap: wrap; }
.star-pick-btn { background: none; border: none; cursor: pointer; padding: 2px; color: var(--muted); transition: transform .15s, color .15s; }
.star-pick-btn:hover, .star-pick-btn.filled { color: var(--coral); transform: scale(1.2); }
.star-rating-label { margin-left: 12px; font-weight: 800; font-size: 13.5px; color: var(--coral-d); }

.tag-chips-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-chip-btn { background: var(--surface); border: 1.5px solid var(--line); border-radius: 18px; padding: 7px 14px; font-size: 12px; font-weight: 700; color: var(--muted); cursor: pointer; font-family: var(--font-body); transition: all .15s; }
.tag-chip-btn:hover { border-color: var(--coral); color: var(--ink); transform:translateY(-1px); }
.tag-chip-btn.active { background: rgba(226,163,16,.18); border-color: var(--coral); color: var(--coral-d); font-weight: 800; }

.fb-textarea { width: 100%; border: 1.5px solid var(--input-border); border-radius: 16px; padding: 14px 16px; background: var(--input-bg); color: var(--text); font-size: 14px; font-family: var(--font-body); resize: vertical; outline:none; transition: border-color .2s, box-shadow .2s; }
.fb-textarea:focus { border-color: var(--coral); box-shadow: 0 0 0 3px rgba(226,163,16,0.2); }

.fb-feed { display: flex; flex-direction: column; gap: 14px; }
.fb-card { padding: 18px; margin-bottom: 0; }
.fb-card-top { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
.fb-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--coral), #b8830b); color: #fff; font-weight: 800; font-size: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(226,163,16,.4); flex-shrink: 0; }
.fb-author-info { flex: 1; }
.fb-author-name { font-weight: 800; font-size: 14px; color: var(--ink); }
.fb-author-roll { font-size: 11.5px; color: var(--muted); font-weight: 600; font-family: var(--font-mono); }
.fb-meta-sub { display: flex; align-items: center; gap: 6px; margin-top: 3px; flex-wrap: wrap; }
.fb-cat-pill { font-size: 9.5px; font-weight: 800; font-family: var(--font-mono); background: var(--steel); color: var(--ink); padding: 3px 8px; border-radius: 8px; text-transform: uppercase; }
.fb-dish-pill { font-size: 9.5px; font-weight: 800; background: rgba(62,122,79,.14); color: var(--basil); padding: 3px 8px; border-radius: 8px; }
.fb-time { font-size: 10.5px; color: var(--muted); font-family: var(--font-mono); }
.fb-stars-badge { display: flex; align-items: center; gap: 3px; background: rgba(226,163,16,.18); border: 1px solid rgba(226,163,16,.35); color: var(--coral-d); font-family: var(--font-mono); font-weight: 800; font-size: 13.5px; padding: 5px 10px; border-radius: 12px; }

.fb-card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.fb-tag-pill { font-size: 11px; background: rgba(226,163,16,.1); border: 1px solid rgba(226,163,16,.22); color: var(--ink); padding: 4px 10px; border-radius: 10px; font-weight: 700; }
.fb-comment-text { font-size: 13.5px; color: var(--ink); line-height: 1.55; margin-bottom: 14px; }

.fb-manager-reply { background: rgba(226,163,16,.08); border-left: 4px solid var(--coral); border-radius: 0 14px 14px 0; padding: 12px 14px; margin-bottom: 12px; }
.fb-manager-head { font-size: 11.5px; font-weight: 800; color: var(--coral-d); display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.fb-manager-text { font-size: 12.5px; color: var(--ink); line-height: 1.45; }

.fb-card-bottom { display: flex; justify-content: flex-end; }
.helpful-btn { background: var(--steel); border: none; border-radius: 10px; padding: 6px 14px; font-size: 11.5px; font-weight: 800; color: var(--muted); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all .15s; font-family: var(--font-body); }
.helpful-btn:hover { background: rgba(226,163,16,.2); color: var(--coral-d); }

.order-rate-card { background: linear-gradient(135deg, rgba(226,163,16,.14), rgba(226,163,16,.05)); border: 1.5px solid rgba(226,163,16,.35); border-radius: 20px; padding: 18px; margin: 14px 0 18px; text-align: center; }
.order-rate-title { font-size: 16px; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
.order-rate-sub { font-size: 12px; color: var(--muted); margin-bottom: 14px; }
.order-rate-btn { background: linear-gradient(135deg, var(--coral), #b8830b); color: #1f1a0f; border: none; border-radius: 12px; padding: 11px 22px; font-weight: 800; font-size: 13.5px; cursor: pointer; transition: transform .15s, box-shadow .15s; font-family: var(--font-body); box-shadow:0 4px 14px rgba(226,163,16,0.3); }
.order-rate-btn:hover { transform: translateY(-2px); box-shadow:0 8px 20px rgba(226,163,16,0.45); }

/* ---- Order Tracker Dashboard ---- */
.order-tracker-dashboard{ margin:24px 0 32px; padding:24px; background:var(--surface); border:1.5px solid var(--surface-border); border-radius:28px; box-shadow:var(--card-shadow); backdrop-filter:blur(16px); }
.ot-header{ margin-bottom:20px; }
.ot-title{ font-size:18px; font-weight:800; color:var(--text); letter-spacing:.02em; }
.ot-subtitle{ font-size:12.5px; color:var(--text-muted); margin-top:4px; }
.ot-stats-grid{ display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:14px; margin-bottom:26px; }
.ot-stat-card{ background:rgba(39,35,27,.04); border:1.5px solid var(--line); border-radius:20px; padding:16px; text-align:center; }
.ot-stat-value{ font-size:24px; font-weight:800; font-family:var(--font-mono); margin-bottom:4px; }
.ot-stat-label{ font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:.06em; }
.ot-history-section{ margin-top:12px; }
.ot-history-title{ font-size:15px; font-weight:800; color:var(--text); margin-bottom:14px; }
.ot-history-list{ display:flex; flex-direction:column; gap:12px; }
.ot-history-card{ background:var(--surface); border:1.5px solid var(--line); border-radius:18px; padding:16px 18px; display:flex; flex-direction:column; gap:10px; transition:transform .2s ease; }
.ot-history-card:hover{ transform:translateY(-2px); border-color:var(--coral); }
.ot-card-top{ display:flex; justify-content:space-between; align-items:center; }
.ot-token{ font-size:15px; font-weight:800; color:var(--coral-d); font-family:var(--font-mono); margin-right:8px; }
.ot-id{ font-size:12.5px; color:var(--text-muted); font-family:var(--font-mono); }
.ot-badge{ font-size:11.5px; font-weight:800; padding:5px 12px; border-radius:14px; }
.ot-card-items{ font-size:13.5px; color:var(--text); line-height:1.45; }
.ot-card-bottom{ display:flex; justify-content:space-between; align-items:center; font-size:12.5px; color:var(--text-muted); border-top:1px dashed var(--line); padding-top:10px; margin-top:6px; }
.ot-price{ font-weight:800; font-family:var(--font-mono); color:var(--text); }

/* ---- Canteen Chef AI Chatbot Styles ---- */
.chef-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 12px 30px rgba(217, 119, 6, 0.48), 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease;
  backdrop-filter: blur(12px);
  padding: 0;
}
.chef-fab:hover {
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 18px 40px rgba(217, 119, 6, 0.7), 0 6px 16px rgba(0, 0, 0, 0.2);
}
.chef-fab:active {
  transform: translateY(-1px) scale(0.96);
}
.chef-fab-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chef-fab-pulse {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.35);
  animation: chefPulse 2s infinite;
}
@keyframes chefPulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.35); }
  50% { box-shadow: 0 0 0 7px rgba(34, 197, 94, 0.6); }
}

.chef-chat-modal {
  position: fixed;
  bottom: 90px;
  right: 26px;
  width: 420px;
  max-width: calc(100vw - 32px);
  height: 580px;
  max-height: calc(100vh - 110px);
  border-radius: 28px;
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  box-shadow: 0 28px 80px rgba(15,23,42,0.28);
  backdrop-filter: blur(24px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: chefPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes chefPop {
  from { opacity: 0; transform: scale(0.85) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.chef-chat-header {
  padding: 18px 22px;
  background: var(--chalk);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.12);
}
.chef-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.chef-avatar-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(226,163,16,0.22);
  border: 1.5px solid var(--coral);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.chef-status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4ade80;
  border: 2px solid var(--chalk);
}
.chef-title {
  font-family: var(--font-display);
  font-size: 15.5px;
  color: #fff;
}
.chef-status-text {
  font-size: 11px;
  color: rgba(255,255,255,0.7);
}

.chef-header-actions {
  display: flex;
  gap: 8px;
}
.chef-icon-btn {
  background: rgba(255,255,255,0.14);
  border: none;
  color: #fff;
  border-radius: 10px;
  padding: 7px 11px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s;
}
.chef-icon-btn:hover {
  background: rgba(255,255,255,0.28);
}

.chef-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: var(--page-bg);
}

.chef-msg-row {
  display: flex;
  gap: 10px;
  max-width: 88%;
}
.chef-msg-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}
.chef-msg-row.bot {
  align-self: flex-start;
}

.chef-msg-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--coral);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(226,163,16,0.3);
}

.chef-msg-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.chef-msg-bubble {
  padding: 13px 18px;
  border-radius: 20px;
  font-size: 13.5px;
  line-height: 1.55;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.chef-msg-row.bot .chef-msg-bubble {
  background: var(--surface);
  color: var(--text);
  border: 1.5px solid var(--surface-border);
  border-top-left-radius: 4px;
}
.chef-msg-row.user .chef-msg-bubble {
  background: linear-gradient(135deg, var(--coral), #b8830b);
  color: #1f1a0f;
  font-weight: 700;
  border-top-right-radius: 4px;
}

.chef-msg-time {
  font-size: 10px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  padding: 0 4px;
}
.chef-msg-row.user .chef-msg-time {
  text-align: right;
}

.chef-cards-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
.chef-item-card {
  background: var(--surface);
  border: 1.5px solid var(--line);
  border-radius: 16px;
  padding: 12px 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.chef-item-header {
  display: flex;
  justify-content: space-between;
  font-weight: 800;
  font-size: 13.5px;
  color: var(--text);
}
.chef-item-price {
  color: var(--coral-d);
  font-family: var(--font-mono);
}
.chef-item-sub {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--text-muted);
  margin-top: 4px;
  margin-bottom: 10px;
}
.stock-tag {
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
}
.stock-tag.in {
  background: rgba(62,122,79,0.14);
  color: var(--basil);
}
.stock-tag.out {
  background: rgba(196,62,28,0.14);
  color: var(--chili);
}

.chef-add-btn {
  width: 100%;
  padding: 8px 0;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--coral), #b8830b);
  color: #1f1a0f;
  font-weight: 800;
  font-size: 12.5px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
}
.chef-add-btn:hover {
  opacity: 0.95;
  transform: scale(1.02);
}

.chef-actions-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.chef-action-btn {
  background: rgba(226,163,16,0.16);
  border: 1.5px solid var(--coral);
  color: var(--coral-d);
  font-weight: 800;
  font-size: 12px;
  padding: 7px 14px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.chef-action-btn:hover {
  background: var(--coral);
  color: #1f1a0f;
}

.chef-msg-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.chef-sug-chip {
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
}
.chef-sug-chip:hover {
  border-color: var(--coral);
  background: rgba(226,163,16,0.12);
  color: var(--coral-d);
}

.chef-chat-footer {
  padding: 14px 16px;
  background: var(--surface);
  border-top: 1.5px solid var(--surface-border);
}
.chef-chat-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.chef-input {
  flex: 1;
  border: 1.5px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text);
  border-radius: 22px;
  padding: 11px 18px;
  font-size: 14px;
  outline: none;
  font-family: var(--font-body);
  transition: border-color 0.2s;
}
.chef-input:focus {
  border-color: var(--coral);
}
.chef-send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--coral), #b8830b);
  color: #1f1a0f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s;
  box-shadow: 0 4px 12px rgba(226,163,16,0.3);
}
.chef-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.chef-send-btn:not(:disabled):hover {
  transform: scale(1.1);
}

/* ---- Voice Assistant Interactive & Visualizer Styles ---- */
.chef-voice-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: linear-gradient(135deg, rgba(234, 88, 12, 0.12), rgba(255, 122, 0, 0.08));
  border-bottom: 1px solid rgba(234, 88, 12, 0.2);
  font-size: 12px;
  font-weight: 700;
  color: #ea580c;
  animation: fadeIn 0.2s ease;
}
.chef-voice-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.chef-voice-toggle-btn {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  border-radius: 14px;
  padding: 4px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s ease;
}
.chef-voice-toggle-btn.active {
  background: #ea580c;
  color: #ffffff;
  border-color: #ea580c;
  box-shadow: 0 2px 8px rgba(234, 88, 12, 0.4);
}
.chef-lang-btn-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.chef-lang-toggle-btn {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  border-radius: 14px;
  padding: 4px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
}
.chef-lang-toggle-btn:hover {
  background: rgba(255,255,255,0.28);
}
.chef-voice-warn-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ef4444;
  color: #ffffff;
  font-size: 11px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.5);
  cursor: help;
  animation: badgePulse 1.8s infinite ease-in-out;
  pointer-events: auto;
  z-index: 2;
}
@keyframes badgePulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  50% { transform: scale(1.18); box-shadow: 0 0 0 4px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
.chef-mic-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid #fed7aa;
  background: var(--surface);
  color: #ea580c;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.chef-mic-btn:hover {
  background: rgba(234, 88, 12, 0.12);
  border-color: #ea580c;
  transform: scale(1.06);
}
.chef-mic-btn.listening {
  background: #ea580c;
  color: #ffffff;
  border-color: #ea580c;
  box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.3), 0 0 18px rgba(234, 88, 12, 0.6);
  animation: micPulse 1.2s infinite;
}
@keyframes micPulse {
  0% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.5); }
  70% { box-shadow: 0 0 0 10px rgba(234, 88, 12, 0); }
  100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0); }
}

.chef-wave-container {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 14px;
}
.chef-wave-bar {
  width: 3px;
  height: 100%;
  background: #ea580c;
  border-radius: 3px;
  animation: waveBounce 0.8s ease-in-out infinite alternate;
}
.chef-wave-bar:nth-child(1) { animation-delay: 0.1s; height: 30%; }
.chef-wave-bar:nth-child(2) { animation-delay: 0.3s; height: 80%; }
.chef-wave-bar:nth-child(3) { animation-delay: 0.2s; height: 100%; }
.chef-wave-bar:nth-child(4) { animation-delay: 0.4s; height: 60%; }
.chef-wave-bar:nth-child(5) { animation-delay: 0.15s; height: 40%; }
@keyframes waveBounce {
  0% { transform: scaleY(0.3); }
  100% { transform: scaleY(1); }
}

.chef-speak-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 6px;
  border-radius: 12px;
  font-size: 13px;
  transition: all 0.15s;
}
.chef-speak-btn:hover {
  color: #ea580c;
  background: rgba(234, 88, 12, 0.12);
  transform: scale(1.1);
}
.chef-speak-btn.speaking {
  color: #ea580c;
  animation: speakPulse 1s infinite alternate;
}
@keyframes speakPulse {
  from { transform: scale(1); }
  to { transform: scale(1.25); }
}

/* ---- Direct Editable Stock Input Styles ---- */
.stepper input.stock-input {
  font-family: var(--font-mono);
  font-size: 13.5px;
  font-weight: 800;
  width: 50px;
  text-align: center;
  border: 1.5px solid var(--input-border);
  background: var(--paper);
  color: var(--text);
  border-radius: 8px;
  padding: 4px 2px;
  outline: none;
  transition: all 0.15s ease;
}
.stepper input.stock-input:focus {
  border-color: var(--coral);
  box-shadow: 0 0 0 3px rgba(226,163,16,0.3);
  background: var(--surface);
}
.stepper input.stock-input::-webkit-inner-spin-button,
.stepper input.stock-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.stepper input.stock-input[type=number] {
  -moz-appearance: textfield;
}

.stock-quick-add {
  background: rgba(226,163,16,0.14);
  border: 1.5px solid rgba(226,163,16,0.35);
  color: var(--coral-d);
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 11.5px;
  padding: 6px 9px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.stock-quick-add:hover {
  background: var(--coral);
  color: #1f1a0f;
  border-color: var(--coral);
}

/* ---- Google Login Button Styles ---- */
.login-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: var(--text-muted);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
}
.login-divider::before,
.login-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1.5px solid var(--line);
}
.login-divider span {
  padding: 0 12px;
}

.google-login-btn {
  width: 100%;
  padding: 15px 0;
  border: 1.5px solid var(--line);
  border-radius: 22px;
  background: var(--paper);
  color: var(--text);
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
  transition: transform 0.15s, background 0.15s, box-shadow 0.15s;
  font-family: var(--font-body);
}
.google-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  background: var(--surface);
}

/* ---- Advanced Form & Input Control Styles ---- */
.advanced-form-card {
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 28px;
  padding: 26px;
  box-shadow: 0 16px 44px rgba(15,23,42,0.1);
  backdrop-filter: blur(20px);
  margin-bottom: 26px;
  transition: all 0.3s ease;
}
.add-product-header {
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1.5px dashed var(--line);
}
.add-product-title {
  font-family: var(--font-display);
  font-size: 19px;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 8px;
}
.add-product-icon {
  font-size: 22px;
}
.add-product-subtitle {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-top: 4px;
}

.adv-label {
  display: block;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}
.adv-input,
.adv-select,
.form-row input,
.form-row select,
.form-row-grid input,
.form-row-grid select {
  width: 100%;
  border: 1.5px solid var(--input-border);
  border-radius: 18px;
  padding: 13px 18px;
  background: var(--input-bg);
  color: var(--text);
  font-size: 14px;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.adv-input:focus,
.adv-select:focus,
.form-row input:focus,
.form-row select:focus,
.form-row-grid input:focus,
.form-row-grid select:focus {
  border-color: var(--coral);
  box-shadow: 0 0 0 3px rgba(226,163,16,0.25);
  background: var(--paper);
}

.input-prefix-wrap,
.input-suffix-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.prefix-badge {
  position: absolute;
  left: 16px;
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 14px;
  color: var(--coral-d);
  pointer-events: none;
}
.adv-input.prefixed {
  padding-left: 48px;
}

.suffix-badge {
  position: absolute;
  right: 14px;
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 11.5px;
  color: var(--text-muted);
  pointer-events: none;
  background: var(--steel);
  padding: 4px 10px;
  border-radius: 10px;
}
.adv-input.suffixed {
  padding-right: 62px;
}

.adv-submit-btn {
  width: 100%;
  padding: 16px 0;
  margin-top: 20px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--coral), #b8830b);
  color: #1f1a0f;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(226,163,16,0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.adv-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(226,163,16,0.55);
}

/* ---- Admin Dashboard & KDS Styles ---- */
.admin-header-banner {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #fff;
  padding: 24px 24px;
  border-bottom: 2px solid var(--coral);
}
.admin-badge-top {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  color: var(--coral);
  letter-spacing: 0.14em;
  margin-bottom: 6px;
}
.admin-banner-title {
  font-family: var(--font-display);
  font-size: 22px;
  margin-bottom: 6px;
}
.admin-banner-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  line-height: 1.4;
}

.admin-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
}
.admin-kpi-card {
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--card-shadow);
}
.admin-kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.admin-kpi-num {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 800;
  color: var(--ink);
}
.admin-kpi-label {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.admin-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}
.admin-action-card {
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 22px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: var(--card-shadow);
  transition: transform 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}
.admin-action-card:hover {
  transform: translateY(-3px);
  border-color: var(--coral);
}
.admin-act-icon {
  font-size: 28px;
}
.admin-act-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink);
}
.admin-act-desc {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.4;
  flex: 1;
}
.admin-act-btn {
  margin-top: 6px;
  background: rgba(226,163,16,0.14);
  border: 1px solid var(--coral);
  color: var(--coral-d);
  padding: 8px 14px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 12px;
  cursor: pointer;
  align-self: flex-start;
  transition: all 0.15s;
}
.admin-action-card:hover .admin-act-btn {
  background: var(--coral);
  color: #1f1a0f;
}

.admin-orders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.admin-order-card {
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--card-shadow);
}
.admin-order-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.admin-order-items {
  font-size: 13.5px;
  line-height: 1.5;
}
.admin-order-item-row {
  padding: 3px 0;
  border-bottom: 1px dashed var(--line);
}
.admin-order-item-row:last-child {
  border-bottom: none;
}
.admin-order-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed var(--line);
  padding-top: 10px;
}

.admin-orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}
.admin-kds-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.role-pill {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 8px;
  letter-spacing: 0.06em;
}
.role-pill.admin {
  background: rgba(244,63,94,0.18);
  color: #f43f5e;
  border: 1px solid rgba(244,63,94,0.3);
}
.role-pill.customer {
  background: rgba(74,222,128,0.18);
  color: #4ade80;
  border: 1px solid rgba(74,222,128,0.3);
}

.role-select-tabs {
  display: flex;
  background: var(--steel);
  padding: 4px;
  border-radius: 16px;
  gap: 4px;
  margin-bottom: 20px;
}
.role-select-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-body);
}
.role-select-btn.active {
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
}

.quick-demo-box {
  background: rgba(226,163,16,0.08);
  border: 1.5px dashed rgba(226,163,16,0.35);
  border-radius: 18px;
  padding: 14px;
  margin-top: 18px;
  text-align: center;
}
.quick-demo-title {
  font-size: 11px;
  font-weight: 800;
  color: var(--coral-d);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.quick-demo-btns {
  display: flex;
  gap: 8px;
}
.quick-demo-btn {
  flex: 1;
  background: var(--surface);
  border: 1.5px solid var(--line);
  border-radius: 12px;
  padding: 10px 8px;
  font-size: 12px;
  font-weight: 800;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-body);
}
.quick-demo-btn:hover {
  border-color: var(--coral);
  background: rgba(226,163,16,0.12);
  transform: translateY(-1px);
}

/* ================================================================== */
/* 3D Visual Effects & Dining Scene Animations                        */
/* ================================================================== */
.floating-3d-item {
  animation: float3D 6s ease-in-out infinite alternate;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.18));
}
.floating-3d-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.6);
  transition: transform 0.2s ease;
}

@keyframes float3D {
  0% { transform: translateY(0px) rotate(0deg) scale(1); }
  50% { transform: translateY(-14px) rotate(6deg) scale(1.05); }
  100% { transform: translateY(-6px) rotate(-6deg) scale(0.98); }
}

.ref-cta-btn, .place-btn, .adv-submit-btn {
  transform: translateZ(0);
  box-shadow: 0 6px 0 #92400e, 0 12px 24px rgba(226, 163, 16, 0.45);
  transition: transform 0.1s ease, box-shadow 0.1s ease !important;
}
.ref-cta-btn:active, .place-btn:active, .adv-submit-btn:active {
  transform: translateY(4px) !important;
  box-shadow: 0 2px 0 #92400e, 0 4px 12px rgba(226, 163, 16, 0.3) !important;
}

.token-card {
  transform-style: preserve-3d;
  box-shadow: 0 18px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08);
}

.chef-3d-gyro {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  animation: gyroSpin 8s linear infinite;
  pointer-events: none;
}
@keyframes gyroSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.steam-line-1 {
  animation: steamRise 2.4s ease-in-out infinite;
}
.steam-line-2 {
  animation: steamRise 2.8s ease-in-out infinite 0.7s;
}
@keyframes steamRise {
  0% { transform: translateY(0) scaleX(1); opacity: 0.2; }
  50% { transform: translateY(-4px) scaleX(1.4); opacity: 0.8; }
  100% { transform: translateY(-9px) scaleX(0.8); opacity: 0; }
}

.char-left, .char-center, .char-right {
  transition: transform 0.25s ease;
  transform-origin: bottom center;
}
.dining-illustration-wrap:hover .char-left {
  transform: translateY(-2px) rotate(-1deg);
}
.dining-illustration-wrap:hover .char-center {
  transform: translateY(-3px);
}
.dining-illustration-wrap:hover .char-right {
  transform: translateY(-2px) rotate(1deg);
}

/* ================================================================== */
/* Nutrition Modal Styles                                                */
/* ================================================================== */
.nutri-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(10, 8, 5, 0.72);
  backdrop-filter: blur(6px);
  display: flex; align-items: flex-end; justify-content: center;
  animation: nutriOverlayIn 0.25s ease;
}
@keyframes nutriOverlayIn { from { opacity: 0; } to { opacity: 1; } }

.nutri-modal {
  width: 100%; max-width: 520px;
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 28px 28px 0 0;
  box-shadow: 0 -24px 80px rgba(0,0,0,0.32);
  overflow: hidden;
  animation: nutriSlideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 92vh;
  display: flex; flex-direction: column;
}
@keyframes nutriSlideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.nutri-modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 20px 20px 16px;
  background: linear-gradient(135deg, rgba(226,163,16,0.12), rgba(99,102,241,0.06));
  border-bottom: 1.5px solid var(--line);
  flex-shrink: 0;
}
.nutri-modal-title-row {
  display: flex; align-items: center; gap: 12;
}
.nutri-food-icon-wrap {
  width: 44px; height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(226,163,16,0.22), rgba(226,163,16,0.08));
  border: 1.5px solid rgba(226,163,16,0.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--coral-d); flex-shrink: 0; margin-right: 12px;
}
.nutri-modal-name {
  font-size: 16px; font-weight: 800; color: var(--ink);
  font-family: var(--font-display); line-height: 1.2;
}
.nutri-modal-sub {
  font-size: 11.5px; color: var(--muted); margin-top: 3px;
  max-width: 240px; line-height: 1.4;
}
.nutri-close-btn {
  background: var(--steel); border: none; border-radius: 50%;
  width: 32px; height: 32px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--muted);
  transition: background 0.15s, color 0.15s;
}
.nutri-close-btn:hover { background: rgba(196,62,28,0.2); color: var(--chili); }

.nutri-modal-body {
  padding: 20px; overflow-y: auto; flex: 1;
  display: flex; flex-direction: column; gap: 16px;
}

/* Calories Hero + Donut Row */
.nutri-hero-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px;
}
.nutri-kcal-hero {
  flex: 1;
  background: linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04));
  border: 1.5px solid rgba(245,158,11,0.25);
  border-radius: 20px; padding: 18px 20px;
  text-align: center;
}
.nutri-kcal-number {
  font-family: var(--font-display); font-size: 44px; line-height: 1;
  color: var(--coral-d); font-weight: 800;
}
.nutri-kcal-label {
  font-size: 11.5px; font-weight: 800; color: var(--muted);
  letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px;
}
.nutri-diet-tag {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 800; border-radius: 10px;
  padding: 4px 10px; margin-top: 10px;
}
.nutri-diet-tag.veg {
  background: rgba(16,185,129,0.14); color: var(--basil);
}
.nutri-diet-tag.nonveg {
  background: rgba(239,68,68,0.14); color: #ef4444;
}
.nutri-diet-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: currentColor; display: inline-block;
}

.nutri-donut-wrap {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.nutri-donut-legend {
  display: flex; gap: 10px;
}
.nutri-legend-item {
  display: flex; align-items: center; gap: 4px;
  font-size: 10.5px; font-weight: 800; color: var(--muted);
  font-family: var(--font-mono);
}
.nutri-legend-item span:first-child {
  width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0;
}

/* Macro Chips */
.nutri-macro-chips {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
}
.nutri-macro-chip {
  border: 1.5px solid; border-radius: 14px; padding: 10px 8px;
  text-align: center;
}
.nutri-chip-val {
  font-size: 18px; font-weight: 800; font-family: var(--font-mono); line-height: 1;
}
.nutri-chip-val span { font-size: 11px; font-weight: 700; }
.nutri-chip-key {
  font-size: 10.5px; font-weight: 700; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px;
}

/* Nutrient bars */
.nutri-section-label {
  font-size: 11px; font-weight: 800; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--muted);
  padding-bottom: 4px; border-bottom: 1px solid var(--line);
}
.nutri-bars {
  display: flex; flex-direction: column; gap: 10px;
}
.nutri-bar-row {
  display: flex; align-items: center; gap: 8px; flex-wrap: nowrap;
}
.nutri-bar-label-wrap {
  display: flex; justify-content: space-between; align-items: center;
  width: 105px; flex-shrink: 0;
}
.nutri-bar-name {
  font-size: 12px; font-weight: 700; color: var(--ink);
}
.nutri-bar-val {
  font-size: 11.5px; font-weight: 800; font-family: var(--font-mono);
}
.nutri-bar-track {
  flex: 1; height: 8px; background: var(--steel);
  border-radius: 99px; overflow: hidden;
}
.nutri-bar-fill {
  height: 100%; border-radius: 99px;
  transition: width 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.nutri-dv-label {
  font-size: 10px; font-family: var(--font-mono); font-weight: 800;
  color: var(--muted); width: 44px; text-align: right; flex-shrink: 0;
}

/* Allergens */
.nutri-allergen-wrap { }
.nutri-allergen-chips {
  display: flex; flex-wrap: wrap; gap: 6px;
}
.nutri-allergen-chip {
  font-size: 11.5px; font-weight: 800; padding: 5px 12px;
  border-radius: 10px;
  background: rgba(239,68,68,0.1); color: #ef4444;
  border: 1.5px solid rgba(239,68,68,0.25);
}

.nutri-dv-note {
  font-size: 10.5px; color: var(--muted); line-height: 1.4;
  padding: 10px 12px; background: var(--steel); border-radius: 10px;
}

/* Mini nutrition info button on cards */
.nutri-info-btn {
  background: rgba(99,102,241,0.12); border: 1.5px solid rgba(99,102,241,0.28);
  color: #6366f1; border-radius: 50%; width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: background 0.15s, transform 0.15s;
}
.nutri-info-btn:hover {
  background: rgba(99,102,241,0.25); transform: scale(1.1);
}

/* Mini nutrition chips on menu rows */
.nutri-mini-row {
  display: flex; flex-wrap: wrap; gap: 4px; margin: 4px 0;
}
.nutri-mini-chip {
  font-size: 10.5px; font-weight: 800; padding: 2px 7px;
  border-radius: 8px; font-family: var(--font-mono);
}
.nutri-mini-chip.kcal   { background: rgba(245,158,11,0.14); color: #b45309; }
.nutri-mini-chip.protein { background: rgba(99,102,241,0.13); color: #4f46e5; }
.nutri-mini-chip.carbs  { background: rgba(245,158,11,0.12); color: #92400e; }
.nutri-mini-chip.fat    { background: rgba(239,68,68,0.12);  color: #dc2626; }

/* Stored DB & Emails button on LoginPage */
.ref-stored-db-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(234, 88, 12, 0.35);
  color: #ea580c;
  padding: 8px 18px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(234, 88, 12, 0.12);
  transition: all 0.2s ease;
}
.ref-stored-db-btn:hover {
  background: #ffffff;
  border-color: #ea580c;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(234, 88, 12, 0.2);
}
.ref-db-count-chip {
  background: #ea580c;
  color: #ffffff;
  font-size: 11px;
  font-weight: 900;
  padding: 2px 7px;
  border-radius: 12px;
}

/* Stored Database Modal Overlay */
.ref-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: modalFadeIn 0.25s ease;
}
@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ref-modal-card {
  width: 100%;
  max-width: 660px;
  max-height: 88vh;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(226, 232, 240, 0.9);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalSlideUp 0.25s ease;
}
@keyframes modalSlideUp {
  from { transform: translateY(20px) scale(0.97); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.ref-modal-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.ref-modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ref-modal-sub {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}
.ref-modal-close {
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.ref-modal-close:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.ref-db-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 14px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}
.ref-db-stat {
  background: #ffffff;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ref-db-stat-num {
  font-size: 18px;
  font-weight: 900;
  color: #ea580c;
  font-family: var(--font-mono);
}
.ref-db-stat-label {
  font-size: 10.5px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}
.ref-db-stat-badge {
  font-size: 11px;
  font-weight: 800;
  color: #16a34a;
  padding: 2px 6px;
  border-radius: 8px;
  background: rgba(22, 163, 74, 0.1);
}

.ref-db-table-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 8px 24px;
}
.ref-db-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.ref-db-table th {
  text-align: left;
  padding: 10px 8px;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  border-bottom: 1.5px solid #e2e8f0;
}
.ref-db-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}
.ref-db-table tr:hover {
  background: #fcfdfe;
}
.ref-db-table tr.highlight-row {
  background: #fff7ed;
}

.email-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}
.email-code {
  font-family: var(--font-mono);
  font-size: 12px;
  background: #f1f5f9;
  padding: 2px 7px;
  border-radius: 6px;
  color: #0369a1;
  border: 1px solid #e2e8f0;
}
.copy-mini-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #64748b;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.15s;
}
.copy-mini-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}
.muted-dept {
  font-size: 10.5px;
  color: #94a3b8;
  font-weight: 600;
}
.id-badge {
  font-family: var(--font-mono);
  font-size: 11px;
  background: #e0e7ff;
  color: #4338ca;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 700;
}

.ref-use-email-btn {
  background: linear-gradient(135deg, #ff7a00, #ea580c);
  border: none;
  color: #ffffff;
  padding: 5px 12px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 6px rgba(234, 88, 12, 0.25);
}
.ref-use-email-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(234, 88, 12, 0.35);
}

.ref-modal-footer {
  padding: 14px 24px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.ref-modal-act-btn {
  background: #ea580c;
  border: none;
  color: #ffffff;
  padding: 9px 16px;
  border-radius: 18px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.ref-modal-act-btn:hover {
  background: #c2410c;
}
.ref-modal-reset-btn {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #b91c1c;
  padding: 9px 14px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.ref-modal-reset-btn:hover {
  background: #fecaca;
}
.ref-modal-dismiss-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 9px 16px;
  border-radius: 18px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.ref-modal-dismiss-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* ================================================================== */
/* Admin Stock Management Styles                                      */
/* ================================================================== */
.admin-stock-container {
  width: 100%;
  padding-bottom: 40px;
}
.stk-banner {
  background: linear-gradient(135deg, rgba(226,163,16,0.18) 0%, rgba(184,131,11,0.25) 100%), var(--page-bg);
  border-bottom: 1px solid var(--surface-border);
}
.stk-back-btn {
  background: var(--surface) !important;
  border: 1px solid var(--surface-border) !important;
  color: var(--coral-d) !important;
  box-shadow: var(--card-shadow);
}
.stk-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}
.stk-kpi-card {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: var(--card-shadow);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}
.stk-kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--card-shadow-hover);
  border-color: var(--coral);
}
.stk-kpi-card.active {
  border-color: var(--coral);
  background: linear-gradient(180deg, var(--surface) 0%, rgba(226,163,16,0.08) 100%);
}
.stk-kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.stk-kpi-title {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--muted);
}
.stk-kpi-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}
.stk-kpi-num {
  font-size: 28px;
  font-weight: 900;
  font-family: var(--font-display);
  color: var(--text);
  line-height: 1.1;
}
.stk-kpi-desc {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}

/* Tabs */
.stk-tabs-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 12px;
}
.stk-tab-btn {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  color: var(--text);
  padding: 10px 18px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.stk-tab-btn:hover {
  background: rgba(226,163,16,0.12);
  border-color: var(--coral);
}
.stk-tab-btn.active {
  background: var(--button-bg);
  color: var(--button-text);
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(226,163,16,0.35);
}

/* Filter bar */
.stk-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.stk-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  padding: 8px 14px;
  border-radius: 24px;
  flex: 1;
  min-width: 240px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.stk-search-box input {
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  outline: none;
  width: 100%;
}
.stk-clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--muted);
  font-size: 12px;
}
.stk-filters-group {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.stk-select {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  color: var(--text);
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}

/* Table */
.stk-table-card {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}
.stk-table-wrapper {
  overflow-x: auto;
  width: 100%;
}
.stk-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
}
.stk-table th {
  background: rgba(0,0,0,0.03);
  color: var(--muted);
  padding: 14px 16px;
  font-weight: 700;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  border-bottom: 1px solid var(--surface-border);
}
.stk-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--surface-border);
  vertical-align: middle;
}
.stk-table tbody tr:hover {
  background: rgba(226,163,16,0.04);
}
.stk-table tbody tr.row-expired {
  background: rgba(196,62,28,0.04);
}
.stk-item-name {
  font-weight: 800;
  color: var(--text);
  font-size: 14px;
}
.stk-item-id {
  font-size: 11px;
  color: var(--muted);
  font-family: var(--font-mono);
}
.stk-cat-pill {
  background: rgba(226,163,16,0.12);
  color: var(--coral-d);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11.5px;
  font-weight: 700;
}
.stk-qty-cell {
  min-width: 110px;
}
.stk-qty-num {
  font-size: 14px;
  color: var(--text);
  margin-bottom: 4px;
}
.stk-progress-bar {
  width: 100%;
  height: 5px;
  background: rgba(0,0,0,0.08);
  border-radius: 4px;
  overflow: hidden;
}
.stk-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}
.stk-progress-fill.in-stock { background: var(--emerald); }
.stk-progress-fill.low-stock { background: var(--amber); }
.stk-progress-fill.out-of-stock { background: var(--rose); }
.stk-progress-fill.expired { background: #991b1b; }

.stk-min-level {
  color: var(--muted);
  font-size: 12px;
}
.stk-supplier-text {
  font-size: 12.5px;
  color: var(--text);
}
.stk-expiry-cell {
  font-size: 12.5px;
}
.badge-micro-expired {
  display: inline-block;
  background: #fee2e2;
  color: #991b1b;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 6px;
  margin-top: 2px;
}
.badge-micro-soon {
  display: inline-block;
  background: #ffedd5;
  color: #c2410c;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 6px;
  margin-top: 2px;
}

/* Badges */
.stk-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.3px;
}
.stk-badge-in { background: rgba(62,122,79,0.15); color: var(--basil); }
.stk-badge-low { background: rgba(204,122,0,0.15); color: var(--amber); }
.stk-badge-out { background: rgba(196,62,28,0.15); color: var(--rose); }
.stk-badge-soon { background: rgba(234,88,12,0.15); color: #ea580c; }
.stk-badge-expired { background: rgba(153,27,27,0.18); color: #991b1b; }

/* Action buttons */
.stk-actions-cell {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
}
.stk-btn-action {
  border: none;
  padding: 6px 12px;
  border-radius: 14px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
}
.stk-btn-add {
  background: rgba(62,122,79,0.15);
  color: var(--basil);
}
.stk-btn-add:hover {
  background: var(--basil);
  color: #fff;
}
.stk-btn-reduce {
  background: rgba(196,62,28,0.15);
  color: var(--rose);
}
.stk-btn-reduce:hover {
  background: var(--rose);
  color: #fff;
}
.stk-btn-icon {
  background: transparent;
  border: 1px solid var(--surface-border);
  color: var(--muted);
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}
.stk-btn-icon:hover {
  color: var(--text);
  border-color: var(--coral);
}
.stk-btn-icon.danger:hover {
  color: var(--rose);
  border-color: var(--rose);
  background: rgba(196,62,28,0.08);
}
.stk-cta-btn {
  background: var(--button-bg);
  border: none;
  color: var(--button-text);
  padding: 10px 18px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(226,163,16,0.3);
  transition: all 0.15s ease;
}
.stk-cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(226,163,16,0.45);
}

/* Modals */
.stk-modal {
  max-width: 580px;
  width: 92vw;
}
.stk-modal-item-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(226,163,16,0.08);
  border: 1px solid rgba(226,163,16,0.2);
  border-radius: 12px;
  margin-bottom: 16px;
}
.stk-modal-item-summary .item-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
}
.stk-modal-item-summary .item-sub {
  font-size: 11.5px;
  color: var(--muted);
}
.stk-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.stk-form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.stk-form-group label {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text);
}
.stk-input {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--text);
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;
}
.stk-input:focus {
  border-color: var(--coral);
}
.stk-calc-preview {
  background: rgba(0,0,0,0.04);
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 12.5px;
}
.stk-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

/* Recipe Layout */
.stk-recipe-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
}
@media (max-width: 850px) {
  .stk-recipe-layout {
    grid-template-columns: 1fr;
  }
}
.stk-recipe-dishes-col {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: 18px;
  padding: 16px;
  box-shadow: var(--card-shadow);
  height: fit-content;
}
.stk-dishes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  max-height: 520px;
  overflow-y: auto;
}
.stk-dish-item {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--surface-border);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s;
}
.stk-dish-item:hover {
  background: rgba(226,163,16,0.08);
  border-color: var(--coral);
}
.stk-dish-item.selected {
  background: rgba(226,163,16,0.14);
  border-color: var(--coral);
}
.stk-dish-name {
  font-weight: 800;
  font-size: 13.5px;
  color: var(--text);
}
.stk-dish-meta {
  font-size: 11px;
  color: var(--muted);
}
.stk-dish-badge {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--coral-d);
}
.stk-recipe-content-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.stk-dish-detail-header {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: 18px;
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--card-shadow);
}
.stk-dish-detail-title {
  font-size: 20px;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 2px;
}
.stk-dish-detail-sub {
  font-size: 12px;
  color: var(--muted);
}
.stk-dish-detail-price {
  font-size: 24px;
  font-weight: 900;
  font-family: var(--font-display);
  color: var(--coral-d);
}
.stk-mapped-ingredients-box, .stk-add-ingredient-form-card, .stk-simulator-card {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: 18px;
  padding: 20px;
  box-shadow: var(--card-shadow);
}
.stk-recipe-empty {
  padding: 24px;
  text-align: center;
  background: rgba(0,0,0,0.02);
  border-radius: 12px;
  border: 1px dashed var(--surface-border);
}
.stk-recipe-ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stk-recipe-ing-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  background: rgba(226,163,16,0.03);
}
.stk-recipe-ing-name {
  font-weight: 800;
  font-size: 13.5px;
}
.stk-recipe-ing-qty {
  font-size: 12px;
}
.stk-recipe-ing-notes {
  font-size: 11px;
  color: var(--muted);
}
.stk-sim-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.stk-sim-pill {
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
}
.stk-sim-pill.ok {
  background: rgba(62,122,79,0.12);
  color: var(--basil);
  border: 1px solid rgba(62,122,79,0.25);
}
.stk-sim-pill.short {
  background: rgba(196,62,28,0.12);
  color: var(--rose);
  border: 1px solid rgba(196,62,28,0.25);
}

/* ---- QR Pickup Pass & Scanner Styles ---- */
.qr-pass-card {
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 24px;
  padding: 20px;
  margin-top: 18px;
  box-shadow: 0 12px 36px rgba(15,23,42,0.08);
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}
.qr-pass-card.ready-pulse {
  border-color: var(--basil);
  box-shadow: 0 0 0 3px rgba(62,122,79,0.25), 0 16px 40px rgba(62,122,79,0.15);
  animation: qrGlow 2.5s infinite;
}
@keyframes qrGlow {
  0%, 100% { box-shadow: 0 0 0 3px rgba(62,122,79,0.25), 0 16px 40px rgba(62,122,79,0.15); }
  50% { box-shadow: 0 0 0 6px rgba(62,122,79,0.4), 0 20px 50px rgba(62,122,79,0.25); }
}
.qr-pass-card.picked-up {
  opacity: 0.92;
  border-color: var(--emerald);
  background: rgba(16,185,129,0.03);
}
.qr-pass-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}
.qr-pass-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  color: var(--coral-d);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.qr-pass-canteen {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
  margin-top: 2px;
}
.qr-pass-loc {
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
}
.qr-status-pill {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.3px;
}
.qr-status-pill.ready { background: rgba(62,122,79,0.15); color: var(--basil); border: 1px solid rgba(62,122,79,0.3); }
.qr-status-pill.done { background: rgba(16,185,129,0.15); color: var(--emerald); border: 1px solid rgba(16,185,129,0.3); }
.qr-status-pill.prep { background: rgba(204,122,0,0.15); color: var(--amber); border: 1px solid rgba(204,122,0,0.3); }

.qr-ready-alert {
  background: rgba(62,122,79,0.12);
  border: 1.5px solid var(--basil);
  border-radius: 14px;
  padding: 10px 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.pulse-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--basil);
  box-shadow: 0 0 0 rgba(62,122,79,0.6);
  animation: pulseAnim 1.8s infinite;
  flex-shrink: 0;
}
@keyframes pulseAnim {
  0% { box-shadow: 0 0 0 0 rgba(62,122,79,0.7); }
  70% { box-shadow: 0 0 0 10px rgba(62,122,79,0); }
  100% { box-shadow: 0 0 0 0 rgba(62,122,79,0); }
}

.qr-code-box {
  background: #ffffff;
  border: 1.5px solid var(--surface-border);
  border-radius: 20px;
  padding: 16px;
  text-align: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.qr-img-wrapper {
  display: inline-block;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.qr-img-wrapper:hover {
  transform: scale(1.02);
}
.qr-img {
  width: 220px;
  height: 220px;
  display: block;
  margin: 0 auto;
  border-radius: 12px;
}
.qr-collected-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
.qr-stamp-text {
  border: 3px solid var(--emerald);
  color: var(--emerald);
  font-family: var(--font-mono);
  font-weight: 900;
  font-size: 18px;
  letter-spacing: 2px;
  padding: 8px 18px;
  border-radius: 8px;
  transform: rotate(-12deg);
  box-shadow: 0 4px 14px rgba(16,185,129,0.25);
}
.qr-scan-hint {
  margin-top: 10px;
  font-size: 11.5px;
  color: var(--muted);
  font-weight: 600;
}

.qr-meta-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 12px 14px;
  background: rgba(0,0,0,0.025);
  border-radius: 14px;
  margin-bottom: 14px;
}
.qr-meta-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.qr-meta-label {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 0.05em;
}
.qr-meta-val {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 12.5px;
  color: var(--text);
}
.qr-meta-val.token-val { color: var(--coral-d); font-size: 14px; }
.qr-meta-val.counter-val { color: var(--basil); font-size: 14px; }
.qr-meta-val.pay-hl { color: var(--basil); font-size: 11px; }

.qr-items-summary {
  font-size: 12px;
}
.qr-items-head {
  color: var(--muted);
  font-weight: 700;
  margin-bottom: 6px;
  font-size: 11.5px;
}
.qr-items-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.qr-item-pill {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11.5px;
}

/* Modal styles */
.qr-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.7);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.qr-modal-content {
  background: var(--surface);
  border-radius: 28px;
  max-width: 440px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0,0,0,0.3);
  border: 1.5px solid var(--surface-border);
  position: relative;
}
.qr-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px 10px;
}
.qr-modal-title {
  font-weight: 800;
  font-size: 16px;
  color: var(--text);
}
.qr-modal-close {
  background: rgba(0,0,0,0.06);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 700;
}

/* Scanner styles */
.scanner-container-card, .manual-entry-card, .order-inspect-card {
  background: var(--surface);
  border: 1.5px solid var(--surface-border);
  border-radius: 22px;
  padding: 18px;
  box-shadow: var(--card-shadow);
}
.scanner-viewfinder-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #0f172a;
}
.scanner-laser-beam {
  position: absolute;
  top: 0;
  left: 5%;
  right: 5%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #10b981, transparent);
  box-shadow: 0 0 12px #10b981;
  animation: laserScan 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  pointer-events: none;
  z-index: 10;
}
@keyframes laserScan {
  0% { top: 10%; opacity: 0.2; }
  50% { top: 90%; opacity: 1; }
  100% { top: 10%; opacity: 0.2; }
}
.camera-error-banner {
  background: rgba(204,122,0,0.12);
  border: 1px solid var(--amber);
  padding: 12px;
  border-radius: 12px;
  font-size: 12px;
}
.canteen-mismatch-banner {
  background: rgba(196,62,28,0.12);
  border: 2px solid var(--rose);
  padding: 14px 18px;
  border-radius: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.already-collected-banner {
  background: rgba(204,122,0,0.12);
  border: 2px solid var(--amber);
  padding: 14px 18px;
  border-radius: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.qr-success-card {
  background: rgba(62,122,79,0.12);
  border: 2px solid var(--basil);
  padding: 16px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.inspect-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1.5px dashed var(--line);
}

/* History Badges */
.tx-badge {
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.3px;
}
.tx-purchase { background: rgba(62,122,79,0.15); color: var(--basil); }
.tx-food_preparation { background: rgba(139,92,246,0.15); color: var(--violet); }
.tx-used { background: rgba(204,122,0,0.15); color: var(--amber); }
.tx-wastage, .tx-damaged, .tx-expired { background: rgba(196,62,28,0.15); color: var(--rose); }
.tx-adjustment { background: rgba(100,116,139,0.15); color: #475569; }

.tx-qty {
  font-weight: 800;
  font-size: 13px;
}
.tx-qty.pos { color: var(--basil); }
.tx-qty.neg { color: var(--rose); }
.stk-reason-text { font-size: 12.5px; color: var(--text); }
.stk-order-badge {
  background: rgba(0,0,0,0.06);
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 10px;
  margin-left: 6px;
  font-family: var(--font-mono);
}
.stk-user-tag {
  background: rgba(226,163,16,0.12);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  color: var(--coral-d);
}

/* Admin Dashboard Raw Stock Alert Card */
.raw-stock-alerts-card {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: 18px;
  padding: 18px 22px;
  box-shadow: var(--card-shadow);
  margin-top: 16px;
}
.raw-stock-alerts-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.raw-stock-alerts-title {
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
}
.raw-stock-badges-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.raw-stock-alert-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}
.raw-stock-alert-pill.low {
  background: rgba(204,122,0,0.12);
  border: 1px solid rgba(204,122,0,0.25);
  color: var(--amber);
}
.raw-stock-alert-pill.out {
  background: rgba(196,62,28,0.12);
  border: 1px solid rgba(196,62,28,0.25);
  color: var(--rose);
}
.raw-stock-alert-pill.soon {
  background: rgba(234,88,12,0.12);
  border: 1px solid rgba(234,88,12,0.25);
  color: #ea580c;
}
`;
