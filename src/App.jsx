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

const FOOD_ICONS = { thali: Bowl, wrap: Wrap, cup: Cup, biryani: Bird };

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
    categories: {
      meals: "Meals",
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
    categories: {
      meals: "உணவுகள்",
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
  { id: "main", name: "CSE Canteen", name_ta: "சி.எஸ்.இ உணவகம்", loc: "Block A · Ground floor", loc_ta: "பிளாக் ஏ · தரைத்தளம்", level: "low", wait: 3, lastUpdated: new Date() },
  { id: "hostel", name: "S&H Canteen", name_ta: "எஸ் & ஹெச் உணவகம்", loc: "Block D", loc_ta: "பிளாக் டி", level: "high", wait: 14, lastUpdated: new Date() },
  { id: "library", name: "Mech Canteen", name_ta: "மெக் உணவகம்", loc: "Block C · 1st floor", loc_ta: "பிளாக் சி · 1ஆம் தளம்", level: "med", wait: 7, lastUpdated: new Date() },
];

const MENU = [
  { id: "veg_thali", name: "Veg thali", name_ta: "காய்கறி உணவு", price: 90, kcal: 320, category: "meals", icon: "thali", stock: 18, available: true },
  { id: "chicken_biryani", name: "Chicken biryani", name_ta: "கோழி பிரியாணி", price: 130, kcal: 480, category: "meals", icon: "biryani", stock: 12, available: true },
  { id: "paneer_wrap", name: "Paneer wrap", name_ta: "பன்னீர் ரோல்", price: 60, kcal: 260, category: "snacks", icon: "wrap", stock: 22, available: true },
  { id: "masala_chai", name: "Masala chai", name_ta: "மசாலா டீ", price: 15, kcal: 40, category: "beverages", icon: "cup", stock: 30, available: true },
  { id: "filter_coffee", name: "Filter coffee", name_ta: "பில்டர் காபி", price: 20, kcal: 35, category: "beverages", icon: "cup", stock: 18, available: true },
  { id: "brownie", name: "Brownie slice", name_ta: "பிரவுனி கேக்", price: 60, kcal: 310, category: "desserts", icon: "cup", stock: 0, available: false },
];

const CATEGORIES = ["meals", "snacks", "beverages", "desserts"];

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
    ],
    total: 130,
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
  { id: "STAFF-01", name: "Canteen Manager", email: "admin@canteen.edu", role: "admin", dept: "Management", year: 0, password: "admin" },
  { id: "STAFF-02", name: "Chef Murugan", email: "chef@canteen.edu", role: "admin", dept: "Kitchen Operations", year: 0, password: "admin" },
  { id: "21CSE045", name: "Ananya Sharma", email: "ananya@college.edu", role: "customer", dept: "CSE", year: 3, password: "123" },
  { id: "22ECE018", name: "Karthik Raja", email: "karthik@college.edu", role: "customer", dept: "ECE", year: 2, password: "123" },
  { id: "23IT009", name: "Priya Sundar", email: "priya@college.edu", role: "customer", dept: "IT", year: 1, password: "123" },
];

function CanteenProvider({ children }) {
  const [user, setUser] = useState({ name: "Ananya", roll: "21CSE045", dept: "CSE", year: 3, role: "customer" });
  const [registeredUsers, setRegisteredUsers] = useState(INITIAL_REGISTERED_USERS);

  const registerUser = useCallback((newUser) => {
    setRegisteredUsers((prev) => {
      const existingIdx = prev.findIndex(
        (u) =>
          u.id.toLowerCase() === newUser.id.toLowerCase() ||
          (u.email && newUser.email && u.email.toLowerCase() === newUser.email.toLowerCase())
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newUser };
        return updated;
      }
      return [newUser, ...prev];
    });
  }, []);

  const [walletBalance] = useState(340);
  const [cart, dispatchCart] = useReducer(cartReducer, {}); // { [itemId]: qty }
  const [menu, setMenu] = useState(MENU);
  const [canteens, setCanteens] = useState(CANTEENS_DEFAULT);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your order is ready — Token A-14 at Counter 2", read: false },
    { id: 2, text: "CSE Canteen is now Busy. Consider North Block Café.", read: false },
  ]);
  const [order, setOrder] = useState(null); // active order once placed
  const [orderHistory, setOrderHistory] = useState(INITIAL_ORDER_HISTORY);
  const [lang, setLang] = useState("en");
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);

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
        author: fbData.author || user.name,
        roll: user.roll,
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

  const updateStock = useCallback((id, nextStock) => {
    setMenu((prev) =>
      prev.map((item) => {
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
      })
    );
  }, [lang, showAlert]);

  const addProduct = useCallback((product) => {
    setMenu((prev) => [...prev, { ...product, stock: Math.max(0, Number(product.stock) || 0), available: (Number(product.stock) || 0) > 0 }]);
  }, []);

  const removeProduct = useCallback((id) => {
    setMenu((prev) => prev.filter((item) => item.id !== id));
    dispatchCart({ type: "setQty", id, qty: 0 });
  }, []);

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

  const updateCrowdLevel = useCallback((id, level) => {
    setCanteens((prev) =>
      prev.map((c) =>
        c.id !== id ? c : { ...c, level, wait: WAIT_BY_LEVEL[level], lastUpdated: new Date() }
      )
    );
  }, []);

  const placeOrder = useCallback(
    (paymentMode, total) => {
      const token = "A-" + (10 + Math.floor(Math.random() * 89));
      const newOrder = {
        id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
        items: cartLines,
        total,
        paymentMode,
        token,
        issuedTime: new Date(),
        completedTime: null,
        status: 0, // 0 placed, 1 preparing, 2 ready, 3 picked up
        counter: 2,
      };

      setOrder(newOrder);
      setOrderHistory((prev) => [newOrder, ...prev]);

      setMenu((prev) =>
        prev.map((item) => {
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
        })
      );

      clearCart();
    },
    [cartLines, clearCart, lang, showAlert]
  );

  const advanceOrderStatus = useCallback(() => {
    setOrder((prev) => {
      if (!prev) return prev;
      const nextStatus = Math.min(3, prev.status + 1);
      const updated = {
        ...prev,
        status: nextStatus,
        completedTime: nextStatus === 3 ? new Date() : prev.completedTime,
      };
      setOrderHistory((history) =>
        history.map((o) => (o.id === prev.id ? updated : o))
      );
      return updated;
    });
  }, []);

  const cancelOrder = useCallback(() => {
    setOrder((prev) => {
      if (!prev) return null;
      setOrderHistory((history) =>
        history.map((o) => (o.id === prev.id ? { ...o, status: -1 } : o))
      );
      return null;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
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
    }),
    [
      user,
      setUser,
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
    ]
  );

  return <CanteenContext.Provider value={value}>{children}</CanteenContext.Provider>;
}

function useCanteen() {
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
  const { user, lang, toggleLang, t } = useCanteen();
  const isAdmin = user?.role === "admin";

  const items = isAdmin
    ? [
        { key: "admin-dashboard", label: lang === "ta" ? "டாஷ்போர்டு" : "Dashboard", icon: "📊" },
        { key: "kitchen-orders", label: lang === "ta" ? "சமையலறை" : "Kitchen Orders", icon: "👨‍🍳" },
        { key: "stock", label: lang === "ta" ? "இருப்பு & மெனு" : "Stock & Menu", icon: "📦" },
        { key: "crowd", label: lang === "ta" ? "கூட்டம்" : "Crowd Control", icon: <People /> },
        { key: "feedback", label: lang === "ta" ? "விமர்சனங்கள்" : "Reviews", icon: <StarIcon size={16} filled /> },
      ]
    : [
        { key: "home", label: t("home"), icon: "🏠" },
        { key: "menu", label: t("order"), icon: <Utensils /> },
        { key: "crowd", label: t("crowd"), icon: <People /> },
        { key: "feedback", label: t("feedback"), icon: <StarIcon size={16} filled /> },
        { key: "cart", label: t("cart"), icon: <CartIcon /> },
        { key: "tracking", label: t("track"), icon: <Ticket /> },
      ];

  return (
    <div className="topnav">
      <div className="topnav-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="lang-toggle" type="button" onClick={toggleLang}>
            🌐 {lang === "en" ? "தமிழ்" : "English"}
          </button>
          <div className="topnav-brand">
            <span className="topnav-dot" />
            {t("brand")}
          </div>
          <span className={`role-pill ${isAdmin ? "admin" : "customer"}`}>
            {isAdmin ? "🛡️ ADMIN" : "👤 STUDENT"}
          </span>
        </div>
        <div className="topnav-items">
          {items.map((it) => (
            <button
              key={it.key}
              className={"navitem" + (page === it.key ? " active" : "")}
              onClick={() => onNavigate(it.key)}
            >
              <span className="navicon">{it.icon}</span>
              <span>{it.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="theme-toggle"
            type="button"
            onClick={onOpenChat}
            style={{ background: "rgba(226,163,16,0.2)", color: "var(--coral-d)", borderColor: "var(--coral)", display: "flex", alignItems: "center", gap: 5 }}
            title="Chat with Canteen Chef AI"
          >
            <span>👨‍🍳</span>
            <span>{lang === "ta" ? "ஷெஃப் AI" : "Chef AI"}</span>
          </button>
          <button className="theme-toggle" type="button" onClick={toggleTheme}>
            {theme === "dark" ? (lang === "ta" ? "வெளிச்சம்" : "Light mode") : (lang === "ta" ? "இருள்" : "Dark mode")}
          </button>
          <button
            className="navitem"
            style={{ padding: "6px 12px", background: "rgba(226,163,16,0.15)", borderRadius: 10, border: "1px solid var(--coral)" }}
            onClick={() => onNavigate("login")}
            title="Logout / Switch Account"
          >
            <span className="navicon"><LogOut size={16} /></span>
            <span>{lang === "ta" ? "வெளியேறு" : "Logout"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Login / Register page                                                 */
/* ================================================================== */
/* ================================================================== */
/* Login / Register page with Automatic Role Identification           */
/* ================================================================== */
function LoginPage({ onLogin }) {
  const { lang, toggleLang, t, setUser, showAlert, registeredUsers, registerUser } = useCanteen();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [showPassword, setShowPassword] = useState(false);

  // Login states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  // Register states
  const [regRole, setRegRole] = useState("customer"); // "customer" | "admin"
  const [fullName, setFullName] = useState("");
  const [regIdentifier, setRegIdentifier] = useState("");
  const [dept, setDept] = useState("CSE");
  const [year, setYear] = useState("3");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const identifierRef = useRef(null);

  useEffect(() => {
    identifierRef.current?.focus();
  }, [mode]);

  // Unified single login with automatic customer vs admin role detection
  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId) {
      setError(lang === "ta" ? "மின்னஞ்சல் அல்லது பதிவெண் உள்ளிடவும்" : "Please enter your Email, Roll No or Staff ID");
      return;
    }

    // 1. Identify user from registered database
    const matched = (registeredUsers || []).find(
      (u) =>
        u.id.toLowerCase() === cleanId.toLowerCase() ||
        (u.email && u.email.toLowerCase() === cleanId.toLowerCase())
    );

    let userObj;
    if (matched) {
      userObj = { ...matched };
    } else {
      // 2. Automatically identify role from identifier pattern
      const isAdmin =
        cleanId.toLowerCase().includes("admin") ||
        cleanId.toLowerCase().includes("staff") ||
        cleanId.toLowerCase().includes("manager") ||
        cleanId.toLowerCase().includes("chef") ||
        cleanId.toUpperCase().startsWith("STAFF");

      const extractedName = cleanId.includes("@") ? cleanId.split("@")[0] : cleanId;
      const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

      userObj = {
        id: cleanId,
        name: formattedName || (isAdmin ? "Canteen Staff" : "Student User"),
        roll: cleanId,
        email: cleanId.includes("@") ? cleanId : `${cleanId.toLowerCase()}@college.edu`,
        dept: isAdmin ? "Management" : "CSE",
        year: isAdmin ? 0 : 3,
        role: isAdmin ? "admin" : "customer",
        password: password || "123",
      };
      if (registerUser) registerUser(userObj);
    }

    setUser(userObj);
    setError("");

    const isAdmin = userObj.role === "admin";
    showAlert(
      lang === "ta"
        ? `🎉 நல்வரவு ${userObj.name}! நீங்கள் ${isAdmin ? "🛡️ உணவக நிர்வாகியாக" : "👨‍🎓 மாணவராக"} அடையாளம் காணப்பட்டுள்ளீர்கள்.`
        : `🎉 Welcome ${userObj.name}! Identified as ${isAdmin ? "🛡️ Canteen Admin" : "👨‍🎓 Student Customer"}.`
    );
    onLogin(isAdmin ? "admin-dashboard" : "home");
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
      onLogin("home");
    }
  };

  const handleRegisterSubmit = (e) => {
    if (e) e.preventDefault();
    if (!fullName.trim() || !regIdentifier.trim()) {
      setError(lang === "ta" ? "அனைத்து விவரங்களையும் நிரப்பவும்" : "Please fill in all details");
      return;
    }
    if (regPassword && confirmPassword && regPassword !== confirmPassword) {
      setError(t("passwords_dont_match"));
      return;
    }

    const newUser = {
      id: regIdentifier.trim(),
      name: fullName.trim(),
      roll: regIdentifier.trim(),
      email: regIdentifier.includes("@") ? regIdentifier.trim() : `${regIdentifier.trim().toLowerCase()}@college.edu`,
      dept: regRole === "admin" ? (dept === "CSE" ? "Management" : dept) : dept,
      year: regRole === "admin" ? 0 : (Number(year) || 1),
      role: regRole,
      password: regPassword,
    };

    if (registerUser) registerUser(newUser);
    setUser(newUser);
    setError("");

    const isAdmin = regRole === "admin";
    showAlert(
      lang === "ta"
        ? `🎉 கணக்கு உருவாக்கப்பட்டது! நல்வரவு ${newUser.name} (${isAdmin ? "நிர்வாகி" : "மாணவர்"}).`
        : `🎉 Account created! Welcome ${newUser.name} (${isAdmin ? "🛡️ Canteen Admin" : "👨‍🎓 Student Customer"}).`
    );
    onLogin(isAdmin ? "admin-dashboard" : "home");
  };

  const handleGoogleLogin = () => {
    const googleUser = {
      id: "21CSE045",
      name: "Ananya Sharma",
      roll: "21CSE045",
      email: "ananya@college.edu",
      dept: "CSE",
      year: 3,
      role: "customer",
    };
    setUser(googleUser);
    showAlert(
      lang === "ta"
        ? "🌐 கூகிள் மூலம் மாணவராக வெற்றிகரமாக உள்நுழைந்துவிட்டீர்கள்!"
        : "🌐 Signed in with Google as Student Customer!"
    );
    onLogin("home");
  };

  return (
    <div className="ref-login-canvas">
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
          <form className="ref-card" onSubmit={handleLoginSubmit}>
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

            {error && <div className="login-error" style={{ marginTop: 12 }}>{error}</div>}

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
              <button type="button" className="ref-forgot-link">
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

            {/* Quick Demo Role Switcher */}
            <div className="ref-quick-demo">
              <span className="ref-quick-demo-lbl">⚡ {lang === "ta" ? "சோதனை" : "Quick Demo"}:</span>
              <button type="button" className="ref-demo-chip" onClick={() => handleQuickRoleLogin("customer")}>
                👨‍🎓 Student Demo
              </button>
              <button type="button" className="ref-demo-chip admin" onClick={() => handleQuickRoleLogin("admin")}>
                🛡️ Admin Demo
              </button>
            </div>

            {/* "Login with" divider */}
            <div className="ref-divider">
              <span>{lang === "ta" ? "இதன் மூலம் உள்நுழைக" : "Login with"}</span>
            </div>

            {/* Social Icons row */}
            <div className="ref-social-row">
              <button type="button" className="ref-social-btn fb" onClick={handleGoogleLogin} title="Facebook Login">
                <span style={{ fontSize: 16, fontWeight: 900, fontFamily: "sans-serif" }}>f</span>
              </button>
              <button type="button" className="ref-social-btn gp" onClick={handleGoogleLogin} title="Google Login">
                <span style={{ fontSize: 13.5, fontWeight: 800, color: "#ea4335", fontFamily: "sans-serif" }}>G+</span>
              </button>
              <button type="button" className="ref-social-btn tw" onClick={handleGoogleLogin} title="Twitter Login">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1da1f2">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </button>
            </div>

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
          <form className="ref-card" onSubmit={handleRegisterSubmit}>
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

            <div className="ref-input-pill-wrap" style={{ marginTop: 12 }}>
              <span className="ref-input-icon">
                <Mail size={17} />
              </span>
              <input
                type="text"
                className="ref-pill-input"
                value={regIdentifier}
                placeholder={regRole === "admin" ? "Staff ID / Email (STAFF-02)" : "College Email / Roll No (24CSE101)"}
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

            {error && <div className="login-error" style={{ marginTop: 12 }}>{error}</div>}

            <button
              className="ref-cta-btn"
              type="submit"
              style={{ marginTop: 16 }}
            >
              {t("create_account_btn")}
            </button>

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
    <svg viewBox="0 0 340 150" width="100%" style={{ display: "block", background: "linear-gradient(180deg,#FBF6E9 0%,#F3ECD8 100%)" }}>
      <line x1="70" y1="0" x2="70" y2="14" stroke="var(--line)" strokeWidth="2" />
      <circle cx="70" cy="20" r="7" fill="var(--chalk-2)" />
      <circle cx="70" cy="20" r="7" fill="none" stroke="var(--turmeric)" strokeWidth="1.4" />
      <line x1="270" y1="0" x2="270" y2="10" stroke="var(--line)" strokeWidth="2" />
      <circle cx="270" cy="16" r="7" fill="var(--chalk-2)" />
      <circle cx="270" cy="16" r="7" fill="none" stroke="var(--turmeric)" strokeWidth="1.4" />

      <rect x="14" y="98" width="312" height="13" rx="6" fill="#C99A5B" />
      <rect x="14" y="108" width="312" height="4" rx="2" fill="#B98847" />
      <rect x="0" y="132" width="340" height="2" fill="var(--line)" />

      <rect x="42" y="64" width="42" height="36" rx="15" fill="var(--basil)" />
      <circle cx="63" cy="46" r="18" fill="#E8B382" />
      <circle cx="57" cy="45" r="1.6" fill="var(--ink)" />
      <circle cx="69" cy="45" r="1.6" fill="var(--ink)" />
      <path d="M56 51q7 6 14 0" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <ellipse cx="63" cy="103" rx="17" ry="6" fill="#fff" stroke="var(--line)" />
      <circle cx="58" cy="102" r="2.6" fill="var(--turmeric)" />
      <circle cx="66" cy="103" r="2.2" fill="var(--chili)" />
      <circle cx="62" cy="105" r="2" fill="var(--basil)" />

      <rect x="149" y="58" width="44" height="42" rx="16" fill="var(--turmeric)" />
      <circle cx="171" cy="40" r="19" fill="#C88750" />
      <circle cx="164" cy="39" r="1.7" fill="var(--ink)" />
      <circle cx="178" cy="39" r="1.7" fill="var(--ink)" />
      <ellipse cx="171" cy="47" rx="4" ry="3" fill="var(--chalk)" />
      <ellipse cx="171" cy="103" rx="18" ry="6.5" fill="#fff" stroke="var(--line)" />
      <circle cx="165" cy="102" r="2.6" fill="var(--chili)" />
      <circle cx="174" cy="103" r="2.4" fill="var(--turmeric)" />
      <circle cx="178" cy="101" r="2" fill="var(--basil)" />

      <rect x="256" y="64" width="42" height="36" rx="15" fill="var(--chili)" />
      <circle cx="277" cy="46" r="18" fill="#F0C9A0" />
      <circle cx="271" cy="45" r="1.6" fill="var(--ink)" />
      <circle cx="283" cy="45" r="1.6" fill="var(--ink)" />
      <path d="M270 51q7 6 14 0" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <ellipse cx="277" cy="103" rx="17" ry="6" fill="#fff" stroke="var(--line)" />
      <circle cx="272" cy="102" r="2.4" fill="var(--basil)" />
      <circle cx="281" cy="103" r="2.4" fill="var(--turmeric)" />
    </svg>
  );
}

function HomePage({ onNavigate, onOpenChat }) {
  const { user, walletBalance, notifications, unreadCount, markAllRead, canteens, updateCrowdLevel, menu, lang, toggleLang, t } = useCanteen();
  const [showNotif, setShowNotif] = useState(false);
  const [now, setNow] = useState(new Date());
  const [expandedId, setExpandedId] = useState(null);

  // Refresh clock every 30s so "X min ago" stays current
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const timeAgo = (date) => {
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return t("just_now");
    if (diff < 3600) return `${Math.floor(diff / 60)} ${t("min_ago")}`;
    return `${Math.floor(diff / 3600)} ${t("hr_ago")}`;
  };

  const mostRecentUpdate = canteens.reduce((latest, c) =>
    new Date(c.lastUpdated) > new Date(latest) ? c.lastUpdated : latest,
    canteens[0].lastUpdated
  );

  const recommended = useMemo(() => menu.filter((m) => m.available).slice(0, 2), [menu]);

  return (
    <>
      <div className="home-hero" style={{
        position: "relative",
        overflow: "hidden"
      }}>
        <img
          src="/canteen-hero.avif"
          alt="Canteen background"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            zIndex: 0,
            filter: "brightness(0.45) saturate(1.1)"
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(38,41,34,0.3) 0%, rgba(32,30,26,0.8) 100%)",
          zIndex: 1
        }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="row-between" style={{ padding: "0 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="eyebrow" style={{ marginTop: 0, color: "var(--coral-d)", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                {t("cse_canteen")}
              </div>
            </div>
            <div className="notif-wrap">
              <button
                className="icon-btn on-light"
                onClick={() => {
                  setShowNotif((s) => !s);
                  if (!showNotif) markAllRead();
                }}
              >
                <Bell />
                {unreadCount > 0 && <span className="icon-dot" />}
              </button>
              {showNotif && (
                <div className="notif-drop">
                  {notifications.map((n) => (
                    <div key={n.id} className="notif-item">
                      {n.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hero-thesis">
            <h1 style={{ color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
              {lang === "ta" ? "இப்போது எங்கு" : "Where's it quiet"}
              <br />
              {lang === "ta" ? "கூட்டம் குறைவு?" : "right now?"}
            </h1>
            <div className="sub" style={{ color: "rgba(255,255,255,0.7)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
              {t("crowd_status").toUpperCase()} · {timeAgo(mostRecentUpdate).toUpperCase()}
            </div>
          </div>

          <div className="flapboard">
            <div className="fb-head">
              <span className="fb-title">{t("brand")}</span>
              <span className="fb-live">
                <i /> {t("live")}
              </span>
            </div>
            {canteens.map((c) => {
              const lv = LEVELS[c.level];
              const isExpanded = expandedId === c.id;
              const canteenName = lang === "ta" ? (c.name_ta || c.name) : c.name;
              const canteenLoc = lang === "ta" ? (c.loc_ta || c.loc) : c.loc;
              return (
                <div key={c.id}>
                  <div className="flap-row" style={{ flexWrap: "wrap", gap: 6 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flap-name">{canteenName}</div>
                      <div className="flap-loc">{canteenLoc}</div>
                      <div style={{ fontSize: 10, color: "rgba(0,0,0,0.38)", marginTop: 2 }}>
                        {timeAgo(c.lastUpdated)}
                      </div>
                    </div>
                    <div className="flap-right" style={{ flexShrink: 0 }}>
                      <span className="pill" style={{ color: lv.color, background: lv.bg }}>
                        <i className="dot" style={{ background: lv.color }} />
                        {t(lv.key)}
                      </span>
                      <span className="flap-wait">{c.wait} {t("min")}</span>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : c.id)}
                          style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                            background: "rgba(226,163,16,0.12)", color: "var(--coral-d)",
                            border: "none", borderRadius: 6, padding: "3px 8px",
                            cursor: "pointer", marginLeft: 4
                          }}
                        >
                          {isExpanded ? t("cancel_btn") : t("update_btn")}
                        </button>
                      )}
                    </div>
                  </div>
                  {user?.role === "admin" && isExpanded && (
                    <div style={{ display: "flex", gap: 6, padding: "6px 0 10px 0" }}>
                      {["low", "med", "high"].map((lvl) => {
                        const l = LEVELS[lvl];
                        const active = c.level === lvl;
                        return (
                          <button
                            key={lvl}
                            onClick={() => { updateCrowdLevel(c.id, lvl); setExpandedId(null); }}
                            style={{
                              flex: 1, padding: "6px 0", borderRadius: 8, border: "none",
                              fontWeight: 700, fontSize: 12, cursor: "pointer",
                              background: active ? l.color : l.bg,
                              color: active ? "#fff" : l.color,
                              transition: "all 0.2s"
                            }}
                          >
                            {t(l.key)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="qa-row">
        <button className="qa-chip accent" onClick={() => onNavigate("menu")}>
          <div className="qa-ic">
            <Utensils size={17} />
          </div>
          <div className="qa-lbl">{t("order_now")}</div>
        </button>
        <button className="qa-chip" onClick={() => onOpenChat && onOpenChat()}>
          <div className="qa-ic">
            <span>👨‍🍳</span>
          </div>
          <div className="qa-lbl">{lang === "ta" ? "ஷெஃப் AI" : "Ask Chef AI"}</div>
        </button>
        <button className="qa-chip" onClick={() => onNavigate("tracking")}>
          <div className="qa-ic">
            <Ticket size={17} />
          </div>
          <div className="qa-lbl">{t("waitlist")}</div>
        </button>
        <button className="qa-chip" onClick={() => onNavigate("menu")}>
          <div className="qa-ic">
            <Wallet size={17} />
          </div>
          <div className="qa-lbl">₹{walletBalance} {t("wallet")}</div>
        </button>
      </div>

      <div className="scroll has-nav">
        <div className="section-title">{t("happening_now")}</div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <EatingIllustration />
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="bold" style={{ fontSize: 13 }}>{t("lunch_rush")}</div>
              <div className="small muted" style={{ marginTop: 2 }}>{t("students_eating")}</div>
            </div>
            <span className="pill" style={{ color: "var(--amber)", background: "rgba(245,158,11,.14)" }}>
              <i className="dot" style={{ background: "var(--amber)" }} />{t("busy")}
            </span>
          </div>
        </div>

        <div className="section-title">
          {t("recommended")}<span className="see-all">{t("see_all")}</span>
        </div>
        <div className="grid-2">
          {recommended.map((m) => {
            const Icon = FOOD_ICONS[m.icon];
            const itemName = lang === "ta" ? (m.name_ta || m.name) : m.name;
            return (
              <div className="card" style={{ padding: 12 }} key={m.id}>
                <div className="food-thumb lg" style={{ marginBottom: 10 }}>
                  <Icon size={26} />
                </div>
                <div className="bold" style={{ fontSize: 13 }}>{itemName}</div>
                <div className="small muted" style={{ marginTop: 4 }}>{m.kcal} kcal</div>
                <div className="mono bold" style={{ marginTop: 8 }}>₹{m.price}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ================================================================== */
/* Menu / Order page                                                     */
/* ================================================================== */
function MenuPage({ onNavigate }) {
  const { user, cart, cartCount, cartTotal, addToCart, setQty, menu, addProduct, removeProduct, lang, toggleLang, t, lowStockItems } = useCanteen();
  const isAdmin = user?.role === "admin";
  const [category, setCategory] = useState("meals");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newKcal, setNewKcal] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newCategory, setNewCategory] = useState("meals");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const filtered = useMemo(() => menu.filter((m) => m.category === category), [menu, category]);

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

    addProduct({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_" + Date.now(),
      name,
      price,
      kcal,
      category: newCategory,
      icon: "thali",
      stock,
      available: stock > 0,
    });
    setNewName("");
    setNewPrice("");
    setNewKcal("");
    setNewStock("");
    setNewCategory("meals");
    setAddError("");
    setAddSuccess(lang === "ta" ? "உணவு வெற்றிகரமாக சேர்க்கப்பட்டது." : "Product added successfully.");
  };

  return (
    <>
      <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
        <img
          src="/canteen-hero.avif"
          alt="Canteen"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.35) saturate(1.2)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(38,41,34,0.5) 0%,rgba(32,30,26,0.9) 100%)" }} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <button className="back" onClick={() => onNavigate(isAdmin ? "admin-dashboard" : "home")} style={{ color: "var(--coral)" }}>
            <ArrowLeft />
          </button>
          <div>
            <div className="eyebrow" style={{ color: "var(--coral-d)", marginTop: 0 }}>{t("cse_canteen")}</div>
            <div className="h-title" style={{ color: "#fff", margin: 0 }}>{t("order")}</div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 18 }}>
          <div style={{ color: "var(--coral)", fontSize: 10, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>{t("browse_order")}</div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginTop: 3 }}>{t("whats_fresh")}</div>
        </div>
      </div>

      <div className="scroll has-nav" style={{ paddingTop: 16 }}>
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

        <div className="cats">
          {CATEGORIES.map((c) => (
            <button key={c} className={"chip" + (category === c ? " active" : "")} onClick={() => setCategory(c)}>
              {t("categories." + c)}
            </button>
          ))}
        </div>

        {/* Admin-only Add Product Section */}
        {isAdmin && (
          <div className="card add-product-card advanced-form-card">
            <div className="add-product-header" style={{ cursor: "pointer" }} onClick={() => setShowAddForm(!showAddForm)}>
              <div className="add-product-title">
                <span className="add-product-icon">✨</span>
                <span>{t("add_new_product")} (Admin)</span>
              </div>
              <button type="button" className="cta-mini" style={{ fontSize: 11, padding: "4px 10px" }}>
                {showAddForm ? "▲ Hide" : "▼ + Add Dish"}
              </button>
            </div>

            {showAddForm && (
              <div style={{ marginTop: 14 }}>
                <div className="form-row">
                  <label className="adv-label">
                    <span>🍔 {t("product_name")}</span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      className="adv-input"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Fresh Masala Dosa"
                    />
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="adv-label">
                      <span>💰 {t("price")} (₹)</span>
                    </label>
                    <div className="input-prefix-wrap">
                      <span className="prefix-badge">₹</span>
                      <input
                        type="number"
                        className="adv-input prefixed"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="75"
                      />
                    </div>
                  </div>

                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="adv-label">
                      <span>🔥 {t("calories")}</span>
                    </label>
                    <div className="input-suffix-wrap">
                      <input
                        type="number"
                        className="adv-input suffixed"
                        value={newKcal}
                        onChange={(e) => setNewKcal(e.target.value)}
                        placeholder="320"
                      />
                      <span className="suffix-badge">kcal</span>
                    </div>
                  </div>
                </div>

                <div className="form-row-grid" style={{ marginTop: 16 }}>
                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="adv-label">
                      <span>📦 {t("stock_qty")}</span>
                    </label>
                    <div className="input-prefix-wrap">
                      <span className="prefix-badge">Qty</span>
                      <input
                        type="number"
                        className="adv-input prefixed"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        placeholder="20"
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
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {t("categories." + c)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {addError && <div className="hint error" style={{ marginTop: 14 }}>⚠️ {addError}</div>}
                {addSuccess && <div className="hint success" style={{ marginTop: 14 }}>✅ {addSuccess}</div>}

                <button className="adv-submit-btn" type="button" onClick={handleAddProduct}>
                  <span>➕ {t("add_product_btn")}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {filtered.map((item) => {
          const Icon = FOOD_ICONS[item.icon];
          const qty = cart[item.id] || 0;
          const stock = Math.max(0, item.stock ?? 0);
          const isAvailable = stock > 0;
          const isLowStock = isAvailable && stock <= 5;
          const itemName = lang === "ta" ? (item.name_ta || item.name) : item.name;

          return (
            <div className="ticket" key={item.id} style={{ opacity: isAvailable ? 1 : 0.5 }}>
              <div className="food-thumb">
                <Icon size={20} />
              </div>
              <div className="item-info">
                <div className="item-name">{itemName}</div>
                <div className="item-tag" style={{ color: isAvailable ? (isLowStock ? "var(--chili)" : "var(--basil)") : "var(--chili)" }}>
                  ● {isAvailable ? `${t("available")} · ${stock} ${t("left")}` : t("sold_out")}
                  {isLowStock && (
                    <span className="low-stock-badge">
                      <AlertTriangle size={10} /> {t("low_stock_badge")}
                    </span>
                  )}
                </div>
                <div className="item-bottom">
                  <div className="price">₹{item.price}</div>
                  {isAvailable ? (
                    qty === 0 ? (
                      <button className="add-btn" onClick={() => addToCart(item.id, 1)}>
                        {t("add")} +
                      </button>
                    ) : (
                      <div className="stepper">
                        <button onClick={() => setQty(item.id, qty - 1)}>
                          <Minus size={13} />
                        </button>
                        <span>{qty}</span>
                        <button onClick={() => setQty(item.id, qty + 1)}>
                          <Plus size={13} />
                        </button>
                      </div>
                    )
                  ) : null}
                  {isAdmin && (
                    <button className="link" type="button" onClick={() => removeProduct(item.id)} style={{ marginLeft: 8, color: "var(--rose)" }}>
                      🗑️ {t("remove")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cartCount > 0 && (
        <div className="cartbar">
          <div className="left">
            {cartCount} {cartCount === 1 ? t("item") : t("items")} · ₹{cartTotal}
          </div>
          <button className="cta-mini" onClick={() => onNavigate("cart")}>
            {t("view_cart")} →
          </button>
        </div>
      )}
    </>
  );
}

/* ================================================================== */
/* Cart page                                                             */
/* ================================================================== */
function CartPage({ onNavigate }) {
  const { cartLines, cartTotal, setQty, placeOrder, lang, toggleLang, t } = useCanteen();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [payMode, setPayMode] = useState("UPI");

  const discount = couponApplied ? Math.round(cartTotal * 0.1) : 0;
  const fee = cartLines.length ? 3 : 0;
  const tax = Math.round((cartTotal - discount) * 0.05);
  const total = cartTotal - discount + fee + tax;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "CANTEEN10") {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponApplied(false);
      setCouponError(true);
    }
  };

  const handlePlaceOrder = () => {
    if (cartLines.length === 0) return;
    placeOrder(payMode, total);
    onNavigate("tracking");
  };

  return (
    <>
      <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
        <img
          src="/canteen-hero.avif"
          alt="Canteen"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.45) saturate(1.1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.35) 0%,rgba(10,6,2,0.8) 100%)" }} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <button className="back" onClick={() => onNavigate("menu")} style={{ color: "var(--coral)" }}>
            <ArrowLeft />
          </button>
          <div className="cart-head-copy">
            <div className="h-title" style={{ color: "#fff", margin: 0 }}>{t("your_cart")}</div>
            <div className="eyebrow" style={{ color: "rgba(255,220,120,0.9)", marginTop: 0 }}>{t("cse_canteen")}</div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 18 }}>
          <div style={{ color: "rgba(255,220,120,0.85)", fontSize: 10, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>{t("review_pay")}</div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginTop: 3 }}>{t("almost_there")}</div>
        </div>
      </div>

      <div className="scroll" style={{ paddingTop: 16, paddingBottom: 24 }}>
        {cartLines.length === 0 ? (
          <div className="empty-state cart-empty-state">
            <div className="empty-badge">🛒</div>
            <div className="empty-title">{t("cart_empty")}</div>
            <button className="empty-link" onClick={() => onNavigate("menu")}>
              {t("browse_menu")} <span>→</span>
            </button>
          </div>
        ) : (
          <>
            <div className="card">
              {cartLines.map((l) => {
                const Icon = FOOD_ICONS[l.icon];
                const itemName = lang === "ta" ? (l.name_ta || l.name) : l.name;
                return (
                  <div className="list-row" key={l.id}>
                    <div className="list-left">
                      <div className="food-thumb">
                        <Icon size={18} />
                      </div>
                      <span>{itemName}</span>
                    </div>
                    <div className="stepper">
                      <button onClick={() => setQty(l.id, l.qty - 1)}>
                        <Minus size={13} />
                      </button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)}>
                        <Plus size={13} />
                      </button>
                    </div>
                    <b className="mono bold">₹{l.qty * l.price}</b>
                  </div>
                );
              })}
            </div>

            <div className="section-title">{t("promo_code")}</div>
            <div className="promo">
              <input
                placeholder="WELCOME10"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>{t("apply")}</button>
            </div>
            {couponApplied && <div className="hint success">{t("coupon_applied")}</div>}
            {couponError && <div className="hint error">{t("invalid_code")}</div>}

            <div className="section-title">{t("pay_with")}</div>
            <div className="mode-row">
              {["UPI", "Card", "Wallet", "Cash"].map((m) => (
                <button
                  key={m}
                  className={"mode" + (payMode === m ? " active" : "")}
                  onClick={() => setPayMode(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="section-title">{t("summary")}</div>
            <div className="card">
              <div className="r-row">
                <span>{t("subtotal")}</span>
                <span className="mono">₹{cartTotal}</span>
              </div>
              {couponApplied && (
                <div className="r-row">
                  <span>{t("coupon")}</span>
                  <span className="mono">−₹{discount}</span>
                </div>
              )}
              <div className="r-row">
                <span>{t("fee")}</span>
                <span className="mono">₹{fee}</span>
              </div>
              <div className="r-row">
                <span>{t("taxes")}</span>
                <span className="mono">₹{tax}</span>
              </div>
              <div className="r-row total">
                <span>{t("to_pay")}</span>
                <span className="mono">₹{total}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {cartLines.length > 0 && (
        <div className="checkoutbar">
          <button className="place-btn" onClick={handlePlaceOrder}>
            {t("place_order")} · ₹{total}
          </button>
        </div>
      )}
    </>
  );
}

/* ================================================================== */
/* Tracking page                                                         */
/* ================================================================== */
const STATUS_LABELS = ["Placed", "Preparing", "Ready", "Picked up"];

function StockPage({ onNavigate }) {
  const { menu, updateStock, addProduct, removeProduct, lang, toggleLang, t, lowStockItems } = useCanteen();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newKcal, setNewKcal] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newCategory, setNewCategory] = useState("meals");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

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

    addProduct({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_" + Date.now(),
      name,
      price,
      kcal,
      category: newCategory,
      icon: "thali",
      stock,
      available: stock > 0,
    });
    setNewName("");
    setNewPrice("");
    setNewKcal("");
    setNewStock("");
    setNewCategory("meals");
    setAddError("");
    setAddSuccess(lang === "ta" ? "உணவு வெற்றிகரமாக சேர்க்கப்பட்டது." : "Dish added to menu successfully.");
    setTimeout(() => setAddSuccess(""), 4000);
  };

  const handleRemoveItem = (id, name) => {
    if (window.confirm(lang === "ta" ? `"${name}" உணவை மெனுவிலிருந்து நீக்கவா?` : `Remove "${name}" from canteen menu?`)) {
      removeProduct(id);
    }
  };

  return (
    <>
      <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
        <img
          src="/canteen-hero.avif"
          alt="Canteen"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.45) saturate(1.1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.35) 0%,rgba(10,6,2,0.8) 100%)" }} />
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

        {/* Admin Add New Product Card */}
        <div className="card add-product-card advanced-form-card" style={{ marginBottom: 16 }}>
          <div
            className="add-product-header"
            style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <div>
              <div className="add-product-title">
                <span className="add-product-icon">✨</span>
                <span>{lang === "ta" ? "+ புதிய உணவு சேர்க்க" : "+ Add New Dish to Menu"}</span>
              </div>
              <div className="add-product-subtitle" style={{ marginTop: 2 }}>
                {lang === "ta" ? "விலை, இருப்பு மற்றும் கலோரியுடன் புதிய உணவை சேர்க்கவும்" : "Create a new dish with price, calories, category and stock"}
              </div>
            </div>
            <button type="button" className="cta-mini" style={{ fontSize: 11, padding: "6px 12px", flexShrink: 0 }}>
              {showAddForm ? "▲ Close" : "➕ Add Product"}
            </button>
          </div>

          {showAddForm && (
            <div style={{ marginTop: 16 }}>
              <div className="form-row">
                <label className="adv-label">
                  <span>🍔 {t("product_name")}</span>
                </label>
                <div className="input-with-icon">
                  <input
                    className="adv-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Special Ghee Roast Dosa"
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label className="adv-label">
                    <span>💰 {t("price")} (₹)</span>
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
                    <span>🔥 {t("calories")}</span>
                  </label>
                  <div className="input-suffix-wrap">
                    <input
                      type="number"
                      className="adv-input suffixed"
                      value={newKcal}
                      onChange={(e) => setNewKcal(e.target.value)}
                      placeholder="280"
                    />
                    <span className="suffix-badge">kcal</span>
                  </div>
                </div>
              </div>

              <div className="form-row-grid" style={{ marginTop: 14 }}>
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label className="adv-label">
                    <span>📦 {t("stock_qty")}</span>
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
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {t("categories." + c)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {addError && <div className="hint error" style={{ marginTop: 14 }}>⚠️ {addError}</div>}
              {addSuccess && <div className="hint success" style={{ marginTop: 14 }}>✅ {addSuccess}</div>}

              <button className="adv-submit-btn" type="button" onClick={handleAddProduct} style={{ marginTop: 16 }}>
                <span>➕ {lang === "ta" ? "மெனுவில் உணவு சேர்க்க" : "Publish Dish to Menu"}</span>
              </button>
            </div>
          )}
        </div>

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
  const { user, canteens, updateCrowdLevel, lang, toggleLang, t } = useCanteen();
  const isAdmin = user?.role === "admin";
  const [now, setNow] = useState(new Date());
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const timeAgo = (date) => {
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return t("just_now");
    if (diff < 3600) return `${Math.floor(diff / 60)} ${t("min_ago")}`;
    return `${Math.floor(diff / 3600)} ${t("hr_ago")}`;
  };

  const handleUpdate = (canteenId, level) => {
    setAnimatingId(canteenId);
    updateCrowdLevel(canteenId, level);
    setSelectedCanteen(null);
    setTimeout(() => setAnimatingId(null), 600);
  };

  const crowdPercent = { low: 25, med: 55, high: 90 };
  const crowdEmoji = { low: "😌", med: "😐", high: "😰" };
  const crowdDesc = {
    en: { low: "Plenty of seats available", med: "Moderate crowd, short wait", high: "Very crowded, long wait" },
    ta: { low: "தாராளமாக இடங்கள் உள்ளன", med: "மிதமான கூட்டம், குறைந்த காத்திருப்பு", high: "அதிக கூட்டம், நீண்ட காத்திருப்பு" }
  };

  return (
    <>
      <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
        <img
          src="/canteen-hero.avif"
          alt="Canteen"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.45) saturate(1.1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.35) 0%,rgba(10,6,2,0.8) 100%)" }} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <button className="back" onClick={() => onNavigate(isAdmin ? "admin-dashboard" : "home")} style={{ color: "var(--coral)" }}>
            <ArrowLeft />
          </button>
          <div>
            <div className="eyebrow" style={{ color: "rgba(255,220,120,0.9)", marginTop: 0 }}>{t("live_status")}</div>
            <div className="h-title" style={{ color: "#fff", margin: 0 }}>{t("crowd")}</div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 18 }}>
          <div style={{ color: "rgba(255,220,120,0.85)", fontSize: 10, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>
            {isAdmin ? (lang === "ta" ? "நிர்வாக மேலாண்மை" : "ADMIN CONTROLLER") : t("live_status")}
          </div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginTop: 3 }}>
            {isAdmin
              ? (lang === "ta" ? "கூட்ட நிலையை புதுப்பிக்கவும்" : "Manage & Update Crowd Levels")
              : (lang === "ta" ? "நேரலை கூட்ட நெரிசல் நிலை" : "Live Crowd Density & Wait Times")}
          </div>
        </div>
        <div style={{ position: "absolute", top: 14, right: 18, display: "flex", alignItems: "center", gap: 6 }}>
          <span className="crowd-live-badge">
            <i /> {t("live")}
          </span>
        </div>
      </div>

      <div className="scroll" style={{ paddingTop: 16, paddingBottom: 24 }}>
        <div className="crowd-summary-strip">
          {Object.entries(LEVELS).map(([key, lv]) => {
            const count = canteens.filter(c => c.level === key).length;
            return (
              <div key={key} className="crowd-summary-chip">
                <i className="dot" style={{ background: lv.color }} />
                <span style={{ color: lv.color, fontWeight: 700 }}>{count}</span>
                <span style={{ color: "var(--muted)", fontSize: 10 }}>{t(lv.key)}</span>
              </div>
            );
          })}
        </div>

        {canteens.map((c) => {
          const lv = LEVELS[c.level];
          const isSelected = selectedCanteen === c.id;
          const isAnimating = animatingId === c.id;
          const pct = crowdPercent[c.level];
          const canteenName = lang === "ta" ? (c.name_ta || c.name) : c.name;
          const canteenLoc = lang === "ta" ? (c.loc_ta || c.loc) : c.loc;

          return (
            <div
              className={"crowd-card" + (isAnimating ? " crowd-card-flash" : "")}
              key={c.id}
            >
              <div className="crowd-card-header">
                <div className="crowd-card-info">
                  <div className="crowd-card-name">{canteenName}</div>
                  <div className="crowd-card-loc">{canteenLoc}</div>
                  <div className="crowd-card-ago">{timeAgo(c.lastUpdated)}</div>
                </div>
                <div className="crowd-card-status">
                  <span className="crowd-emoji">{crowdEmoji[c.level]}</span>
                  <span className="pill" style={{ color: lv.color, background: lv.bg }}>
                    <i className="dot" style={{ background: lv.color }} />
                    {t(lv.key)}
                  </span>
                </div>
              </div>

              <div className="crowd-bar-wrap">
                <div className="crowd-bar-label">
                  <span>{crowdDesc[lang][c.level]}</span>
                  <span className="crowd-wait-tag">~{c.wait} {t("min")} {lang === "ta" ? "காத்திருப்பு" : "wait"}</span>
                </div>
                <div className="crowd-bar-track">
                  <div
                    className="crowd-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${lv.color}88, ${lv.color})`,
                    }}
                  />
                </div>
              </div>

              {isAdmin ? (
                !isSelected ? (
                  <button
                    className="crowd-update-btn"
                    onClick={() => setSelectedCanteen(c.id)}
                  >
                    <People size={14} />
                    {t("update_crowd")}
                  </button>
                ) : (
                  <div className="crowd-picker">
                    <div className="crowd-picker-title">{lang === "ta" ? "தற்போது எவ்வளவு கூட்டம் உள்ளது?" : "How crowded is it right now?"}</div>
                    <div className="crowd-picker-options">
                      {["low", "med", "high"].map((lvl) => {
                        const l = LEVELS[lvl];
                        const active = c.level === lvl;
                        return (
                          <button
                            key={lvl}
                            className={"crowd-pick-btn" + (active ? " active" : "")}
                            onClick={() => handleUpdate(c.id, lvl)}
                            style={{
                              "--pick-color": l.color,
                              "--pick-bg": l.bg,
                            }}
                          >
                            <span className="crowd-pick-emoji">{crowdEmoji[lvl]}</span>
                            <span className="crowd-pick-label">{t(l.key)}</span>
                            <span className="crowd-pick-desc">{crowdDesc[lang][lvl].split(",")[0]}</span>
                            {active && <span className="crowd-pick-current">{lang === "ta" ? "தற்போது" : "Current"}</span>}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className="crowd-cancel-btn"
                      onClick={() => setSelectedCanteen(null)}
                    >
                      {t("cancel_btn")}
                    </button>
                  </div>
                )
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px dashed var(--line)", fontSize: 11.5, color: "var(--muted)" }}>
                  <span>🛡️ {lang === "ta" ? "பணியாளர்களால் நேரலையாக புதுப்பிக்கப்படுகிறது" : "Live estimation updated by canteen staff"}</span>
                  <span style={{ fontWeight: 700, color: lv.color }}>● {t("live")}</span>
                </div>
              )}
            </div>
          );
        })}

        <div className="crowd-tip-card">
          <div className="crowd-tip-icon">💡</div>
          <div>
            <div className="crowd-tip-title">{t("crowd_tip_title")}</div>
            <div className="crowd-tip-text">
              {isAdmin
                ? (lang === "ta"
                    ? "நிர்வாகிகளாக, மாணவர்கள் தங்கள் காத்திருப்பு நேரத்தை திட்டமிட உதவ துல்லியமான கூட்ட நிலையை இங்கே புதுப்பிக்கவும்."
                    : "As canteen staff/admin, keep crowd levels accurate so students can plan their dining with minimal waiting time.")
                : t("crowd_tip_text")}
            </div>
          </div>
        </div>
      </div>
    </>
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

  const STATUS_KEYS = ["step_received", "step_preparing", "step_ready", "step_completed"];

  if (!order) {
    return (
      <>
        <div className="header cart-header" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="back" onClick={() => onNavigate("home")}>
            <ArrowLeft />
          </button>
          <div className="cart-head-copy">
            <div className="h-title">{t("order_tracking")}</div>
            <div className="eyebrow">{t("cse_canteen")}</div>
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
      <div className="header cart-header" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="back" onClick={() => onNavigate("home")}>
          <ArrowLeft />
        </button>
        <div className="cart-head-copy" style={{ flex: 1, alignItems: "center", textAlign: "center" }}>
          <div className="eyebrow" style={{ textAlign: "center" }}>
            {order.id} · CSE CANTEEN · COUNTER {order.counter}
          </div>
        </div>
      </div>

      <div className="token-card">
        <div className="token-label">{t("pickup_token")}</div>
        <div className="token-number">{order.token}</div>
        <div className="token-tear" />
        <div className="token-meta">
          <div>
            {t("issued")}
            <br />
            <b>{order.issuedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</b>
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
  const { user, lang, toggleLang, t, feedbacks, addFeedback, addManagerReply, upvoteFeedback, menu } = useCanteen();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("food_quality");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  const [filterTab, setFilterTab] = useState("all");
  const [replyTextMap, setReplyTextMap] = useState({});

  const AVAILABLE_TAGS = [
    "🔥 Hot & Fresh",
    "⚡ Fast Service",
    "🥗 Great Portion",
    "💰 Value for Money",
    "🧹 Clean Area",
    "😋 Super Tasty",
    "⏱️ Short Wait Time",
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addFeedback({
      rating,
      category,
      item: selectedItem || null,
      tags: selectedTags,
      comment: comment.trim(),
    });

    setRating(5);
    setSelectedItem("");
    setSelectedTags([]);
    setComment("");
  };

  const handlePostReply = (feedbackId) => {
    const text = replyTextMap[feedbackId];
    if (text && text.trim()) {
      addManagerReply(feedbackId, text.trim());
      setReplyTextMap((prev) => ({ ...prev, [feedbackId]: "" }));
    }
  };

  const totalReviews = feedbacks.length;
  const avgRating = totalReviews
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacks.forEach((f) => {
      if (counts[f.rating] !== undefined) counts[f.rating]++;
    });
    return counts;
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    if (filterTab === "5star") return feedbacks.filter((f) => f.rating === 5);
    if (filterTab === "food") return feedbacks.filter((f) => f.category === "food_quality");
    if (filterTab === "service") return feedbacks.filter((f) => f.category === "service_speed");
    if (filterTab === "hygiene") return feedbacks.filter((f) => f.category === "hygiene");
    if (filterTab === "helpful") return [...feedbacks].sort((a, b) => b.helpful - a.helpful);
    return feedbacks;
  }, [feedbacks, filterTab]);

  return (
    <>
      <div className="header cart-header" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="back" onClick={() => onNavigate(user?.role === "admin" ? "admin-dashboard" : "home")}>
          <ArrowLeft />
        </button>
        <div className="cart-head-copy" style={{ flex: 1, alignItems: "center", textAlign: "center" }}>
          <div className="eyebrow" style={{ textAlign: "center" }}>
            {t("feedback")} · {t("brand")} {user?.role === "admin" && "· ADMIN MODE"}
          </div>
        </div>
      </div>

      <div className="scroll" style={{ paddingTop: 16 }}>
        <div className="fb-summary-card">
          <div className="fb-score-box">
            <div className="fb-score-number">{avgRating}</div>
            <div className="fb-stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} size={18} filled={star <= Math.round(Number(avgRating))} />
              ))}
            </div>
            <div className="fb-total-text">
              {totalReviews} {lang === "ta" ? "மதிப்பீடுகள்" : "student reviews"}
            </div>
          </div>

          <div className="fb-bars-box">
            {[5, 4, 3, 2, 1].map((num) => {
              const count = ratingCounts[num] || 0;
              const pct = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={num} className="fb-bar-row">
                  <span className="fb-bar-label">{num} ★</span>
                  <div className="fb-bar-track">
                    <div className="fb-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="fb-bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="add-product-card" style={{ marginTop: 16 }}>
          <div className="add-product-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>⭐</span> {t("rate_your_experience")}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>{lang === "ta" ? "மதிப்பீடு கொடுக்கவும்" : "Your Rating"}</label>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoverRating || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      className={"star-pick-btn" + (isFilled ? " filled" : "")}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <StarIcon size={26} filled={isFilled} />
                    </button>
                  );
                })}
                <span className="star-rating-label">
                  {rating === 5 && (lang === "ta" ? "சிறப்பானது! 🔥" : "Excellent! 🔥")}
                  {rating === 4 && (lang === "ta" ? "மிகவும் நல்லது 👍" : "Very Good 👍")}
                  {rating === 3 && (lang === "ta" ? "சராசரி 👌" : "Average 👌")}
                  {rating === 2 && (lang === "ta" ? "மேம்பட வேண்டும் 😕" : "Needs Improvement 😕")}
                  {rating === 1 && (lang === "ta" ? "மோசமானது 😞" : "Poor 😞")}
                </span>
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-row" style={{ marginBottom: 0 }}>
                <label>{t("select_category")}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="food_quality">{t("food_quality")}</option>
                  <option value="service_speed">{t("service_speed")}</option>
                  <option value="hygiene">{t("hygiene")}</option>
                  <option value="app_experience">{t("app_experience")}</option>
                </select>
              </div>

              <div className="form-row" style={{ marginBottom: 0 }}>
                <label>{lang === "ta" ? "குறிப்பிட்ட உணவு (விரும்பினால்)" : "Dish Item (Optional)"}</label>
                <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                  <option value="">{lang === "ta" ? "பொதுவான கருத்து" : "General Feedback"}</option>
                  {menu.map((m) => (
                    <option key={m.id} value={lang === "ta" ? (m.name_ta || m.name) : m.name}>
                      {lang === "ta" ? (m.name_ta || m.name) : m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row" style={{ marginTop: 14 }}>
              <label>{t("quick_tags")}</label>
              <div className="tag-chips-wrap">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={"tag-chip-btn" + (isSelected ? " active" : "")}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-row">
              <label>{lang === "ta" ? "கருத்து உரை" : "Review Details"}</label>
              <textarea
                className="fb-textarea"
                rows={3}
                placeholder={t("write_comment")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              style={{ marginTop: 8 }}
              disabled={!comment.trim()}
            >
              💬 {t("submit_feedback")}
            </button>
          </form>
        </div>

        <div className="section-title" style={{ marginTop: 24 }}>
          <span>{lang === "ta" ? "மாணவர் விமர்சனங்கள்" : "Student Reviews"} ({filteredFeedbacks.length})</span>
        </div>

        <div className="cats" style={{ marginBottom: 14 }}>
          {[
            { id: "all", label: t("all_reviews") },
            { id: "5star", label: "5 ★" },
            { id: "food", label: t("food_quality") },
            { id: "service", label: t("service_speed") },
            { id: "hygiene", label: t("hygiene") },
            { id: "helpful", label: lang === "ta" ? "மிகவும் பயனுள்ளது" : "Most Helpful" },
          ].map((cat) => (
            <button
              key={cat.id}
              className={"chip" + (filterTab === cat.id ? " active" : "")}
              onClick={() => setFilterTab(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="fb-feed">
          {filteredFeedbacks.map((fb) => (
            <div key={fb.id} className="card fb-card">
              <div className="fb-card-top">
                <div className="fb-avatar">
                  {fb.author.charAt(0)}
                </div>
                <div className="fb-author-info">
                  <div className="fb-author-name">
                    {fb.author} <span className="fb-author-roll">· {fb.roll}</span>
                  </div>
                  <div className="fb-meta-sub">
                    <span className="fb-cat-pill">{t(fb.category) || fb.category}</span>
                    {fb.item && <span className="fb-dish-pill">🍛 {fb.item}</span>}
                    <span className="fb-time">{fb.date}</span>
                  </div>
                </div>
                <div className="fb-stars-badge">
                  <span>{fb.rating}</span> ★
                </div>
              </div>

              {fb.tags && fb.tags.length > 0 && (
                <div className="fb-card-tags">
                  {fb.tags.map((tg, idx) => (
                    <span key={idx} className="fb-tag-pill">{tg}</span>
                  ))}
                </div>
              )}

              <p className="fb-comment-text">{fb.comment}</p>

              {fb.managerReply && (
                <div className="fb-manager-reply">
                  <div className="fb-manager-head">
                    <span>👨‍🍳</span> {t("staff_response")}
                  </div>
                  <p className="fb-manager-text">{fb.managerReply}</p>
                </div>
              )}

              {/* Admin Manager Response Box */}
              {user?.role === "admin" && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
                  {!fb.managerReply ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        className="adv-input"
                        placeholder={lang === "ta" ? "மேலாளர் பதிலாக எழுதவும்..." : "Write official manager response..."}
                        style={{ fontSize: 12, padding: "8px 12px" }}
                        value={replyTextMap[fb.id] || ""}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [fb.id]: e.target.value })}
                      />
                      <button
                        type="button"
                        className="cta-mini"
                        style={{ fontSize: 11, padding: "6px 14px", flexShrink: 0 }}
                        onClick={() => handlePostReply(fb.id)}
                      >
                        {lang === "ta" ? "பதில் அளி" : "Post Reply"}
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: "var(--emerald)", fontWeight: 700 }}>
                      ✓ {lang === "ta" ? "மேலாளர் பதில் வெளியிடப்பட்டுள்ளது" : "Official manager response published"}
                    </div>
                  )}
                </div>
              )}

              <div className="fb-card-bottom" style={{ marginTop: 10 }}>
                <button
                  type="button"
                  className="helpful-btn"
                  onClick={() => upvoteFeedback(fb.id)}
                >
                  <ThumbsUpIcon size={13} /> {t("helpful")} ({fb.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================================================================== */
/* Admin Dashboard Page                                                */
/* ================================================================== */
function AdminDashboardPage({ onNavigate }) {
  const { user, orderHistory, menu, lowStockItems, canteens, advanceOrderStatus, cancelOrder, lang, t } = useCanteen();

  const totalOrders = orderHistory.length;
  const activeOrders = orderHistory.filter((o) => o.status >= 0 && o.status < 3);
  const deliveredOrders = orderHistory.filter((o) => o.status === 3).length;
  const totalRevenue = orderHistory
    .filter((o) => o.status === 3)
    .reduce((sum, o) => sum + o.total, 0);

  const STATUS_LABELS = {
    0: { en: "Placed", ta: "ஆர்டர் செய்யப்பட்டது", bg: "rgba(204,122,0,0.14)", color: "var(--amber)" },
    1: { en: "Preparing", ta: "தயாராகிறது", bg: "rgba(139,92,246,0.14)", color: "var(--violet)" },
    2: { en: "Ready for Pickup", ta: "பெறத் தயார்", bg: "rgba(62,122,79,0.14)", color: "var(--basil)" },
    3: { en: "Completed", ta: "நிறைவடைந்தது", bg: "rgba(16,185,129,0.14)", color: "var(--emerald)" },
    "-1": { en: "Cancelled", ta: "ரத்து செய்யப்பட்டது", bg: "rgba(196,62,28,0.14)", color: "var(--rose)" },
  };

  return (
    <>
      <div className="admin-header-banner">
        <div className="admin-banner-inner">
          <div className="admin-badge-top">🛡️ {lang === "ta" ? "நிர்வாக கட்டுப்பாட்டு மையம்" : "CANTEEN ADMIN COMMAND CENTER"}</div>
          <h1 className="admin-banner-title">{lang === "ta" ? "வரவேற்கிறோம், மேலாளர்!" : `Welcome back, ${user?.name || "Admin"}!`}</h1>
          <p className="admin-banner-sub">
            {lang === "ta"
              ? "ஆர்டர்கள், இருப்பு, கூட்ட நெரிசல் மற்றும் வாடிக்கையாளர் கருத்துகளை இங்கிருந்து நிர்வகிக்கவும்."
              : "Manage live orders, menu stock, crowd levels, and student feedback in real-time."}
          </p>
        </div>
      </div>

      <div className="scroll" style={{ paddingTop: 20 }}>
        {/* KPI Stats Grid */}
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon" style={{ background: "rgba(226,163,16,0.15)", color: "var(--coral-d)" }}>📋</div>
            <div className="admin-kpi-info">
              <div className="admin-kpi-num">{totalOrders}</div>
              <div className="admin-kpi-label">{lang === "ta" ? "மொத்த ஆர்டர்கள்" : "Total Orders Intake"}</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon" style={{ background: "rgba(204,122,0,0.15)", color: "var(--amber)" }}>⏳</div>
            <div className="admin-kpi-info">
              <div className="admin-kpi-num">{activeOrders.length}</div>
              <div className="admin-kpi-label">{lang === "ta" ? "சமையலறையில் தயார்" : "Active In Kitchen"}</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon" style={{ background: "rgba(62,122,79,0.15)", color: "var(--basil)" }}>✅</div>
            <div className="admin-kpi-info">
              <div className="admin-kpi-num">{deliveredOrders}</div>
              <div className="admin-kpi-label">{lang === "ta" ? "வழங்கப்பட்டவை" : "Delivered Today"}</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon" style={{ background: "rgba(139,92,246,0.15)", color: "var(--violet)" }}>💰</div>
            <div className="admin-kpi-info">
              <div className="admin-kpi-num">₹{totalRevenue}</div>
              <div className="admin-kpi-label">{lang === "ta" ? "மொத்த வருவாய்" : "Total Revenue"}</div>
            </div>
          </div>
        </div>

        {/* Low Stock Warning Alert */}
        {lowStockItems.length > 0 && (
          <div className="low-stock-alert-banner" style={{ marginTop: 16, cursor: "pointer" }} onClick={() => onNavigate("stock")}>
            <AlertTriangle size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>
                {lang === "ta" ? "⚠️ குறைந்த இருப்பு எச்சரிக்கை!" : "⚠️ Low Stock Alert for Menu Items!"}
              </div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>
                {lowStockItems.map((i) => i.name).join(", ")} {lang === "ta" ? "இருப்பு குறைவாக உள்ளது. கிளிக் செய்து இருப்பு உயர்த்தவும்." : "running low. Click to update stock."}
              </div>
            </div>
            <button className="cta-mini" style={{ background: "var(--chili)", color: "#fff" }}>
              {lang === "ta" ? "இருப்பு பார் →" : "Manage Stock →"}
            </button>
          </div>
        )}

        {/* Admin Quick Action Cards Grid */}
        <div className="section-title" style={{ marginTop: 24 }}>
          <span>⚡ {lang === "ta" ? "நிர்வாக விரைவு செயல்பாடுகள்" : "Admin Quick Actions"}</span>
        </div>

        <div className="admin-actions-grid">
          <div className="admin-action-card" onClick={() => onNavigate("kitchen-orders")}>
            <div className="admin-act-icon">👨‍🍳</div>
            <div className="admin-act-title">{lang === "ta" ? "சமையலறை ஆர்டர்கள் KDS" : "Kitchen Display System"}</div>
            <div className="admin-act-desc">{lang === "ta" ? "நேரலை ஆர்டர்களை பார்த்து நிலையை புதுப்பிக்கவும்" : "View active order queue & advance pickup tokens"}</div>
            <button className="admin-act-btn">{lang === "ta" ? "சமையலறை திற →" : "Open Kitchen KDS →"}</button>
          </div>

          <div className="admin-action-card" onClick={() => onNavigate("stock")}>
            <div className="admin-act-icon">📦</div>
            <div className="admin-act-title">{lang === "ta" ? "மெனு மற்றும் இருப்பு நிர்வாகம்" : "Menu & Stock Manager"}</div>
            <div className="admin-act-desc">{lang === "ta" ? "புதிய உணவு சேர்க்க, விலை மற்றும் இருப்பு மாற்ற" : "Add new dishes, edit prices & stock counts"}</div>
            <button className="admin-act-btn">{lang === "ta" ? "இருப்பு மேலாண்மை →" : "Manage Stock →"}</button>
          </div>

          <div className="admin-action-card" onClick={() => onNavigate("crowd")}>
            <div className="admin-act-icon">👥</div>
            <div className="admin-act-title">{lang === "ta" ? "கூட்ட நிலை அமைப்புகள்" : "Crowd Level Controller"}</div>
            <div className="admin-act-desc">{lang === "ta" ? "கேண்டீன் கூட்ட அளவை (குறைவு/மிதம்/அதிகம்) நேரலையாக மாற்ற" : "Set live crowd density and wait time estimates"}</div>
            <button className="admin-act-btn">{lang === "ta" ? "கூட்டம் மாற்று →" : "Update Crowd →"}</button>
          </div>

          <div className="admin-action-card" onClick={() => onNavigate("feedback")}>
            <div className="admin-act-icon">⭐</div>
            <div className="admin-act-title">{lang === "ta" ? "மாணவர் விமர்சனங்கள் & பதில்கள்" : "Customer Reviews & Replies"}</div>
            <div className="admin-act-desc">{lang === "ta" ? "மாணவர்களின் கருத்துகளை படித்து மேலாளர் பதில் அளிக்கவும்" : "Read feedback & post official manager responses"}</div>
            <button className="admin-act-btn">{lang === "ta" ? "பதில் அளி →" : "View Reviews →"}</button>
          </div>
        </div>

        {/* Live Kitchen Order Queue Preview */}
        <div className="section-title" style={{ marginTop: 28 }}>
          <span>🔥 {lang === "ta" ? "சமையலறை ஆர்டர்கள் நேரலை" : "Live Kitchen Order Queue"} ({activeOrders.length})</span>
          <span className="see-all" onClick={() => onNavigate("kitchen-orders")}>
            {lang === "ta" ? "அனைத்தும் பார் →" : "View All Orders →"}
          </span>
        </div>

        {activeOrders.length === 0 ? (
          <div className="card empty-state" style={{ padding: "40px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{lang === "ta" ? "அனைத்து ஆர்டர்களும் வழங்கப்பட்டுவிட்டன!" : "All kitchen orders cleared!"}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{lang === "ta" ? "புதிய ஆர்டர்கள் வரும்போது இங்கு காணப்படும்." : "New orders will appear here automatically."}</div>
          </div>
        ) : (
          <div className="admin-orders-list">
            {activeOrders.map((ord) => {
              const st = STATUS_LABELS[ord.status] || STATUS_LABELS[0];
              return (
                <div key={ord.id} className="admin-order-card">
                  <div className="admin-order-top">
                    <div>
                      <span className="ot-token">{ord.token}</span>
                      <span className="ot-id">{ord.id}</span>
                    </div>
                    <span className="ot-badge" style={{ background: st.bg, color: st.color }}>
                      {st[lang]}
                    </span>
                  </div>

                  <div className="admin-order-items">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="admin-order-item-row">
                        <span className="bold">{it.qty}×</span> {lang === "ta" ? (it.name_ta || it.name) : it.name}
                        <span className="mono muted"> (₹{it.price * it.qty})</span>
                      </div>
                    ))}
                  </div>

                  <div className="admin-order-bottom">
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>
                        🕒 {new Date(ord.issuedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {ord.paymentMode}
                      </div>
                      <div style={{ fontWeight: 800, color: "var(--ink)" }}>₹{ord.total}</div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="cta-mini"
                        style={{ fontSize: 12, padding: "8px 14px" }}
                        onClick={() => advanceOrderStatus()}
                      >
                        {ord.status === 0
                          ? (lang === "ta" ? "▶ தயாரிப்பை தொடங்கு" : "▶ Start Prep")
                          : ord.status === 1
                          ? (lang === "ta" ? "🔔 தயாரானது" : "🔔 Mark Ready")
                          : (lang === "ta" ? "✅ வழங்கப்பட்டது" : "✅ Mark Served")}
                      </button>
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
/* Kitchen Display System (KDS) Page                                    */
/* ================================================================== */
function KitchenOrdersPage({ onNavigate }) {
  const { orderHistory, setOrderHistory, lang, t } = useCanteen();
  const [filter, setFilter] = useState("active");

  const STATUS_LABELS = {
    0: { en: "Placed", ta: "ஆர்டர் செய்யப்பட்டது", bg: "rgba(204,122,0,0.14)", color: "var(--amber)" },
    1: { en: "Preparing", ta: "தயாராகிறது", bg: "rgba(139,92,246,0.14)", color: "var(--violet)" },
    2: { en: "Ready for Pickup", ta: "பெறத் தயார்", bg: "rgba(62,122,79,0.14)", color: "var(--basil)" },
    3: { en: "Completed", ta: "நிறைவடைந்தது", bg: "rgba(16,185,129,0.14)", color: "var(--emerald)" },
    "-1": { en: "Cancelled", ta: "ரத்து செய்யப்பட்டது", bg: "rgba(196,62,28,0.14)", color: "var(--rose)" },
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrderHistory((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
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
        ? "வணக்கம்! 👨‍🍳✨ நான் உங்கள் கேண்டீன் வாய்ஸ் உதவியாளர். உணவு ஆர்டர் செய்ய, மெனு பார்க்க அல்லது கூட்ட நிலை அறிய மைக் பட்டனை அழுத்தி பேசவும்!"
        : "Hey! 👋 I'm your AI Canteen Voice Assistant. Click the 🎙️ mic button or tap any command below to order food, check live crowd, and track orders!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: lang === "ta"
        ? ["🎙️ 2 மசாலா டீ ஆர்டர் செய்", "🍽️ இன்றைய மெனு", "📦 பிரியாணி இருக்கா?", "👥 கூட்டம் எப்படி இருக்கு?", "🛒 என் கார்ட் காட்டு"]
        : ["🎙️ Order 2 Masala Chai", "🍽️ Today's Menu", "📦 Is Biryani in stock?", "👥 Check Crowd", "🛒 Show My Cart"]
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
      const directTa = availVoices.find((v) => {
        const vLang = (v.lang || "").toLowerCase();
        return vLang === "ta-in" || vLang === "ta_in" || vLang.startsWith("ta-") || vLang.startsWith("ta_") || vLang === "ta";
      });
      if (directTa) return directTa;

      const nameTa = availVoices.find((v) => {
        const vName = (v.name || "").toLowerCase();
        return vName.includes("tamil") || vName.includes("தமிழ்") || vName.includes("valluvar") || vName.includes("pallavi") || vName.includes("latha");
      });
      if (nameTa) return nameTa;

      const inFallback = availVoices.find((v) => (v.lang || "").toLowerCase().includes("in"));
      if (inFallback) return inFallback;
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
        if (taVoice) utterance.voice = taVoice;
      } else {
        utterance.lang = "en-IN";
        const enVoice = findBestVoice("en");
        if (enVoice) utterance.voice = enVoice;
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

  return (
    <>
      {!isOpen && (
        <button
          className="chef-fab"
          onClick={() => onClose(false)}
          title={lang === "ta" ? "கேண்டீன் வாய்ஸ் உதவியாளருடன் பேசுங்கள்" : "Talk with AI Voice Assistant"}
        >
          <span className="chef-fab-icon">🎙️</span>
          <span className="chef-fab-label">{lang === "ta" ? "வாய்ஸ் உதவியாளர்" : "Voice Assistant"}</span>
          <span className="chef-fab-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="chef-chat-modal">
          <div className="chef-chat-header">
            <div className="chef-header-info">
              <div className="chef-avatar-wrap">
                <span>👨‍🍳</span>
                <span className="chef-status-dot" />
              </div>
              <div>
                <div className="chef-title">{lang === "ta" ? "கேண்டீன் AI வாய்ஸ் உதவியாளர்" : "Canteen AI Voice Assistant"}</div>
                <div className="chef-status-text">
                  {isSpeaking ? (
                    <span style={{ color: "#ea580c", fontWeight: 800 }}>🔊 {lang === "ta" ? "பதில் பேசுகிறது..." : "Speaking response..."}</span>
                  ) : isListening ? (
                    <span style={{ color: "#16a34a", fontWeight: 800 }}>🎙️ {lang === "ta" ? "உங்கள் குரலை கேட்கிறது..." : "Listening to your voice..."}</span>
                  ) : (
                    lang === "ta" ? "ஆன்லைன் • தமிழ் & English Voice" : "Online • Voice & Action Ready"
                  )}
                </div>
              </div>
            </div>
            <div className="chef-header-actions">
              {/* Language Switcher Button */}
              <button
                className="chef-lang-toggle-btn"
                title={lang === "ta" ? "Switch to English" : "தமிழுக்கு மாற்றவும்"}
                onClick={handleToggleLang}
              >
                🗣️ {lang === "ta" ? "தமிழ்" : "English"}
              </button>

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
                              if (act.navigate && onNavigate) onNavigate(act.navigate);
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
      )}
    </>
  );
}


function AppShell({ theme, toggleTheme }) {
  const { alertMessage, user } = useCanteen();
  const [page, setPage] = useState("login");
  const [chatOpen, setChatOpen] = useState(false);
  const onNavigate = useCallback((p) => setPage(p), []);

  if (page === "login") {
    return (
      <AppFrame>
        {alertMessage && (
          <div className="alert-toast">
            <AlertTriangle size={18} />
            <span>{alertMessage}</span>
          </div>
        )}
        <div className="page-col page-col-login">
          <LoginPage theme={theme} toggleTheme={toggleTheme} onLogin={(targetPage) => onNavigate(targetPage || (user?.role === "admin" ? "admin-dashboard" : "home"))} />
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
        {page === "kitchen-orders" && <KitchenOrdersPage onNavigate={onNavigate} />}
        {page === "home" && <HomePage onNavigate={onNavigate} onOpenChat={() => setChatOpen(true)} />}
        {page === "menu" && <MenuPage onNavigate={onNavigate} />}
        {page === "crowd" && <CrowdPage onNavigate={onNavigate} />}
        {page === "stock" && <StockPage onNavigate={onNavigate} />}
        {page === "feedback" && <FeedbackPage onNavigate={onNavigate} />}
        {page === "cart" && <CartPage onNavigate={onNavigate} />}
        {page === "tracking" && <TrackingPage onNavigate={onNavigate} />}
      </div>
      <CanteenChefChatbot isOpen={chatOpen} onClose={(forceClose) => setChatOpen(forceClose ? false : !chatOpen)} onNavigate={onNavigate} />
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
  --chalk:#262922; --chalk-2:#33372D; --steel:#ECE8DE; --paper:#FFFFFF;
  --coral:#E2A310; --coral-d:#B8830B; --rose:#C43E1C; --amber:#CC7A00; --emerald:#3E7A4F; --violet:#8B5CF6;
  --turmeric:#E2A310; --turmeric-d:#B8830B; --chili:#C43E1C; --basil:#3E7A4F;
  --ink:#201E1A; --muted:#7A7468; --line:#DAD3C2;
  --font-display:'Archivo Black',sans-serif; --font-body:'Work Sans',sans-serif; --font-mono:'IBM Plex Mono',monospace;

  --page-bg: #f2ebe0;
  --surface: rgba(255,255,255,.96);
  --surface-border: rgba(32,30,26,.14);
  --text: #27231b;
  --text-muted: rgba(39,35,27,.65);
  --input-bg: rgba(255,255,255,.95);
  --input-border: rgba(32,30,26,.14);
  --button-bg: linear-gradient(135deg, #e2a310 0%, #b8830b 100%);
  --button-bg-flat: var(--coral);
  --button-text: #1f1a0f;
  --pill-bg: rgba(255,255,255,.12);
  --pill-border: rgba(39,35,27,.14);
  --pill-active-bg: rgba(226,163,16,.2);
  --pill-active-text: #27231b;
  --card-shadow: 0 10px 32px rgba(15,23,42,0.06);
  --card-shadow-hover: 0 18px 48px rgba(15,23,42,0.12);
}
:root.theme-dark{
  --page-bg: radial-gradient(circle at 30% 0%, rgba(226,163,16,.15), transparent 30%), linear-gradient(180deg, #24271e 0%, #161810 100%);
  --surface: rgba(22,25,18,.85);
  --surface-border: rgba(226,163,16,.22);
  --text: #f7ecd4;
  --text-muted: rgba(247,236,212,.72);
  --input-bg: rgba(16,18,13,.6);
  --input-border: rgba(255,255,255,.14);
  --button-bg: linear-gradient(135deg, #e2a310 0%, #b8830b 100%);
  --button-bg-flat: var(--coral);
  --button-text: #1b170c;
  --pill-bg: rgba(255,255,255,.04);
  --pill-border: rgba(255,213,110,.25);
  --pill-active-bg: rgba(226,163,16,.22);
  --pill-active-text: #fff;
  --card-shadow: 0 10px 36px rgba(0,0,0,0.35);
  --card-shadow-hover: 0 20px 54px rgba(0,0,0,0.5);
}
:root.theme-light{
  --page-bg: #f2ebe0;
  --surface: #ffffff;
  --surface-border: rgba(32,30,26,.14);
  --text: #27231b;
  --text-muted: rgba(39,35,27,.65);
  --input-bg: rgba(255,255,255,.98);
  --input-border: rgba(32,30,26,.14);
  --button-bg: linear-gradient(135deg, #e2a310 0%, #b8830b 100%);
  --button-bg-flat: var(--coral);
  --button-text: #1f1a0f;
  --pill-bg: rgba(39,35,27,.04);
  --pill-border: rgba(39,35,27,.14);
  --pill-active-bg: rgba(226,163,16,.22);
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
.ref-login-canvas {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f6e8db;
  background-image: linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.18)), url('/cantenn.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow-x: hidden;
  font-family: var(--font-body);
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
.checkoutbar{ position:absolute; left:0; right:0; bottom:0; background:var(--surface); border-top:1.5px solid var(--surface-border); padding:18px 24px 28px; backdrop-filter:blur(20px); box-shadow:0 -10px 40px rgba(0,0,0,0.08); }
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
  box-shadow:0 4px 20px rgba(0,0,0,.15); border-bottom:1px solid rgba(226,163,16,0.2); }
.topnav-inner{ max-width:720px; margin:0 auto; display:flex; align-items:center; justify-content:space-between;
  padding:12px 20px; }
.topnav-brand{ display:flex; align-items:center; gap:8px; font-family:var(--font-display); color:var(--paper);
  font-size:15px; letter-spacing:.02em; }
.topnav-dot{ width:9px; height:9px; border-radius:50%; background:#4ade80; flex-shrink:0; box-shadow:0 0 0 3px rgba(74,222,128,0.25); animation:chefPulse 2s infinite; }
.topnav-items{ display:flex; gap:4px; }
.navitem{ display:flex; align-items:center; gap:6px; font-size:12.5px; color:#A9A498; font-weight:700;
  background:none; border:none; cursor:pointer; font-family:var(--font-body); padding:8px 14px; border-radius:20px;
  transition:background .2s, color .2s, transform .15s; }
.navitem:hover{ color:var(--paper); background:rgba(255,255,255,.08); transform:translateY(-1px); }
.navitem.active{ color:#1f1a0f; background:linear-gradient(135deg, var(--coral), #b8830b); box-shadow:0 4px 14px rgba(226,163,16,0.35); }
.navicon{ display:flex; }
.navitem span:last-child{ display:none; }
@media (min-width:520px){
  .navitem span:last-child{ display:inline; }
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
  bottom: 26px;
  right: 26px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  border-radius: 32px;
  background: linear-gradient(135deg, var(--coral), #b8830b);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.4);
  box-shadow: 0 12px 36px rgba(226,163,16,0.5);
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.chef-fab:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 16px 44px rgba(226,163,16,0.65);
}
.chef-fab-icon {
  font-size: 22px;
}
.chef-fab-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74,222,128,0.35);
  animation: chefPulse 2s infinite;
}
@keyframes chefPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(74,222,128,0.35); }
  50% { box-shadow: 0 0 0 8px rgba(74,222,128,0.55); }
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
`;
