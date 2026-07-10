# Smart Tailor Booking System — Client

A React + Vite single-page application for a tailor shop booking platform. It connects **customers**, **tailors**, and **admins** in one system: customers discover nearby tailor shops, book stitching orders, track progress, and pay online; tailors manage orders, visit requests, and shop profiles; admins oversee users, shops, revenue, and promotions.

This repository contains the **frontend client only**. It talks to a separate backend API (see [Environment Variables](#environment-variables)).

## Features

- **Role-based access** — Customer, Tailor, and Admin dashboards, each with protected routes gated by role (`src/App.jsx`).
- **Authentication** — Email/password signup & login, OTP verification, forgot/reset password flow, and Google OAuth sign-in (`@react-oauth/google`).
- **Shop discovery** — Interactive map-based shop finder using Leaflet/React-Leaflet and Google Maps, with a floating quick-access finder for customers.
- **Order booking & tracking** — Customers book orders with a chosen tailor, schedule shop visits, and track order status through stages (Fabric Picked → Cutting → Stitching → Quality Check → Ready → Delivered).
- **Measurements** — Digital measurement sheets/forms with a visual measurement guide diagram, manageable per customer.
- **Payments** — Stripe-powered checkout (`@stripe/react-stripe-js`, `@stripe/stripe-js`).
- **Reviews & feedback** — Customers review tailors/shops; tailors respond to and view feedback; admins see top-rated tailors.
- **Notifications & promotions** — In-app notification bell/list and promotions panel.
- **AI chat assistant** — Floating chat widget for booking, measurement, delivery, and payment questions.
- **Admin panel** — User management, shop verification, revenue reports, and promotions/alerts management.
- **Bilingual UI** — English and Urdu (with right-to-left layout and Noto Nastaliq Urdu font) via a language context/toggle.
- **Responsive UI** — Built with Tailwind CSS, Framer Motion animations, Heroicons/Lucide/React Icons.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 4 |
| HTTP client | Axios |
| Maps | Leaflet / React-Leaflet, Google Maps (`@react-google-maps/api`) |
| Payments | Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`) |
| Auth | Google OAuth (`@react-oauth/google`), JWT (stored client-side) |
| Animation | Framer Motion |
| Icons | Heroicons, Lucide React, React Icons |
| Linting | ESLint 9 |

## Project Structure

```
src/
├── Chatbot/                 # AI chat widget
├── components/
│   ├── admin/                # Admin dashboard panels (users, shops, revenue, promotions, top-rated)
│   ├── customer/              # Customer-facing components (orders, addresses, reviews, tailor list)
│   ├── notifications/         # Notification bell, list, promotions panel
│   ├── tailor/                 # Tailor profile setup, shop details, payments, reviews
│   ├── shared/                  # Shared components (e.g. StarRating)
│   ├── OrderTracking/            # Order status tracking UI
│   └── *.jsx                      # ShopFinder, MeasurementForm, VisitScheduler, etc.
├── context/                  # AuthContext, LanguageContext (React Context providers)
├── pages/                    # Route-level pages (Login, Signup, dashboards, OTP, password reset)
├── services/                 # API service modules (notifications, reviews, shops)
├── utils/                    # Axios instance, geolocation helpers, translations
├── App.jsx                   # Route definitions & protected routing
└── main.jsx                  # App entry point
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A running instance of the corresponding backend API
- API keys for Google OAuth, Google Maps, and Stripe (as needed for the features you plan to use)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Smart-Tailor-Booking-System-Client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root (see [Environment Variables](#environment-variables) below).

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app opens automatically at `http://localhost:5173` (Vite default).

## Environment Variables

Create a `.env` file in the project root with the following keys:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api`). Defaults to `http://localhost:5000/api` if unset. |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID, used for "Sign in with Google". |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key, used by the shop finder map. |

> `.env` is git-ignored — never commit real credentials. Share required keys with teammates through a secure channel and keep a local `.env.example` if you want a template.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server (opens browser automatically). |
| `npm run build` | Build the app for production into `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint across the project. |

## Application Roles & Routes

| Route | Access | Description |
|---|---|---|
| `/login`, `/signup` | Public | Authentication entry points |
| `/verify-otp` | Public | OTP verification after signup |
| `/forgot-password`, `/reset-password/:token?` | Public | Password recovery flow |
| `/customer-dashboard` | Customer | Profile, addresses, preferences, orders, reviews, notifications |
| `/shop-finder` | Customer | Map-based tailor shop discovery |
| `/book-order/:tailorId` | Customer | Order booking for a selected tailor |
| `/schedule-visit/:tailorId` | Customer | Schedule an in-person shop visit |
| `/my-measurements` | Customer | Manage measurement sheet |
| `/tailor-dashboard` | Tailor | Orders, visit requests, earnings, ratings, profile setup |
| `/admin-dashboard` | Admin | User & shop management, revenue reports, promotions |

Unauthenticated users are redirected to `/login`; users attempting to access a route outside their role are also redirected to `/login`.

## Building for Production

```bash
npm run build
npm run preview
```

The production-ready static assets are output to the `dist/` directory, which can be deployed to any static hosting provider (Vercel, Netlify, etc.). Ensure the production environment variables are configured on the hosting platform.

## Linting

```bash
npm run lint
```

ESLint is configured via `eslint.config.js` with React Hooks and React Refresh plugins.
