# ArtChain Web Application (Frontend)

The **ArtChain Frontend** is a modern, enterprise-grade Single Page Application (SPA) built with **React 19**, **TypeScript**, and **Vite**. It provides a dynamic client interface for digital artists, art collectors, and platform administrators—featuring real-time auctions, live messaging, WebRTC video calls, AI artwork generation, Stripe payments, and admin analytics dashboards.

---

## Tech Stack

![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix%20UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-6772E5?style=for-the-badge&logo=stripe&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Recharts](https://img.shields.io/badge/Recharts-22B573?style=for-the-badge&logo=chart.js&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## Key Features

1. **Artwork & Community Hub**: Artwork discovery, search/filtering, comment threads, likes, favorites, and profile customization.
2. **Real-Time Bidding & Auctions**: Live artwork auctions with real-time bidding history and automated countdown timers.
3. **Mutual Agreement Commissions**: Multi-step client-to-artist commission workflows (request, milestone updates, approval, escrow release).
4. **Real-Time Communication**: Websocket-powered 1-on-1 private & group chat, real-time notification toasts, and WebRTC peer-to-peer video calling.
5. **AI Generation Studio (Liora)**: Interactive AI artwork generation portal with parameter controls, prompt tuning, and quota tracking.
6. **Digital Wallet & Stripe Payments**: Balance top-up via Stripe Checkout, withdrawal requests, peer-to-peer gifts, and transaction ledger.
7. **Admin Control Center**: Admin portal featuring user account management, artist verification review, commission disputes, and Recharts statistical graphs.
8. **Automated Token Management**: Axios response interceptors handling silent JWT refresh queues, session recovery, and error boundary fallbacks.

---

## Directory Structure

```
frontend/
├── src/
│   ├── api/                   # Axios client instance, auth interceptors, API service modules
│   ├── components/            # Reusable UI components, Radix/shadcn primitives, modals, loaders
│   ├── constants/             # Application route constants and options
│   ├── context/               # React Context providers (Socket context, WebRTC call context)
│   ├── features/
│   │   ├── admin/             # Admin portal components, dashboard charts, verification tables
│   │   └── user/              # User marketplace, auctions, commissions, chat, AI studio, wallet
│   ├── firebase/              # Firebase App initialization and Google OAuth setup
│   ├── hooks/                 # Custom React hooks (debounce, socket listeners, query hooks)
│   ├── layouts/               # Header, Sidebar, Footer, and Auth Guard Layout components
│   ├── libs/                  # Third-party library initializations (Stripe, Cloudinary)
│   ├── redux/                 # Redux Toolkit store, user/admin slices, Redux Persist setup
│   ├── routes/                # React Router v7 routes configuration and access control
│   ├── socket/                # Socket.IO client event handlers and listeners
│   └── types/                 # TypeScript interfaces, DTOs, and global type extensions
├── public/                    # Static public assets, favicons, logos
├── index.html                 # Main HTML entry document
├── vite.config.ts             # Vite build & proxy settings
├── tailwind.config.js         # TailwindCSS design tokens and theme extensions
└── package.json               # Dependencies and scripts
```

---

## Environment Variables

Copy `.env.example` (or create `.env.local`):

```bash
# Gateway & API Base
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000

# Stripe Integration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Firebase Configuration (Google Auth)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# CloudFront CDN
VITE_AWS_CDN_DOMAIN=https://your-cdn.cloudfront.net
```

---

## Getting Started

### Prerequisites
- Node.js v18+ or v20+
- Running API Gateway (Port 4000) and backend microservices

### Installation & Scripts

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint check
npm run lint
```
