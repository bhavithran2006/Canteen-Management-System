# Campus Canteen — Crowd Management System (Frontend)

A React + Vite implementation of the student-facing app: live crowd status across
canteens ("Campus Board"), menu browsing, cart/checkout, and order/token tracking.

## Stack
- React 18 (function components, hooks only — `useState`, `useEffect`, `useContext`,
  `useMemo`, `useCallback`, `useRef`)
- Vite (dev server + build)
- No UI library / no CSS framework — all styling is a single hand-written CSS block
  in `src/App.jsx` using CSS custom properties for the design tokens (colors, fonts)
- No icon package — icons are small inline SVG components

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview   # serve the production build locally to check it
```

## Project structure

```
index.html          Vite entry HTML, loads Google Fonts (Archivo Black, Work Sans, IBM Plex Mono)
src/main.jsx         React root
src/App.jsx           Everything else:
  - CanteenContext     shared state: cart, wallet balance, live crowd data,
                        notifications, the active order
  - PhoneFrame          mobile app-frame wrapper (390 x 844)
  - LoginPage            login / signup tab switcher
  - HomePage              "Campus Board" live crowd status, quick actions,
                          illustrated banner, recommended items
  - MenuPage               category filter, add/remove items, floating cart bar
  - CartPage                 quantity steppers, coupon code (try CANTEEN10),
                              payment method, order summary
  - TrackingPage               token number, status stepper, "simulate next
                                update" button, notify toggle, cancel order
  - BottomNav                 Home / Order / Cart / Track navigation
```

## Notes for extending this

- All mock data (canteens, menu items, notifications) lives near the top of
  `src/App.jsx` — swap those arrays for real API calls when you wire up a backend.
- The design tokens (`--chalk`, `--turmeric`, `--basil`, `--chili`, `--amber`,
  `--steel`, `--ink`, `--muted`, `--line`) are declared once in `:root` inside the
  `css` template string at the bottom of `App.jsx` — change them there to re-theme
  the whole app.
- The database design (matching table names) and the ER diagram for this project
  are in the accompanying `canteen_db_design.xlsx` / `canteen_class_diagram.png`
  files from the rest of this project deliverable.
