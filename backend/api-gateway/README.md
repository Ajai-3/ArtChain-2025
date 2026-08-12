# ArtChain API Gateway

The **API Gateway** serves as the single entry point for all client traffic into the **ArtChain microservices architecture**. Built with **Express**, **TypeScript**, and **http-proxy-middleware**, it manages reverse proxying, JWT-based authentication & access control, rate limiting, request logging, and CORS handling.

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=json-web-tokens)
![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Grafana Loki](https://img.shields.io/badge/Grafana%20Loki-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Client / Frontend App   │
                          └─────────────┬─────────────┘
                                        │ (HTTP/REST)
                                        ▼
                          ┌────────────────────────────────┐
                          │     API Gateway (:4000)        │
                          │  • CORS & Rate Limiting        │
                          │  • Conditional Auth Middleware │
                          │  • Winston / Loki Logging      │
                          └─────────────┬──────────────────┘
                                        │
     ┌─────────────┬─────────────┬──────┴──────┬─────────────┬─────────────┐
     ▼             ▼             ▼             ▼             ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  User &  │ │ Wallet   │ │ Art      │ │ Notif.   │ │ S3/Upload│ │ Chat &   │
│  Admin   │ │ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Elastic  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

---

## Key Features

1. **Centralized Reverse Proxying**: Routes requests seamlessly to appropriate microservices using `http-proxy-middleware`.
2. **Conditional Authentication Middleware**: Dynamically inspects incoming route paths and HTTP methods against predefined authentication rules using `path-to-regexp`:
   - **Public Routes**: Open access without JWT checks.
   - **User Routes (`authUser`)**: Validates Access Token (from Cookies or Authorization header) and injects user identity headers (`x-user-id`).
   - **Optional User Routes (`optionalAuthUser`)**: Attaches user identity if token is present, but allows anonymous traffic if missing.
   - **Admin Routes (`adminAuth`)**: Validates token and verifies Admin role privileges.
3. **Rate Limiting**: Protects downstream services from spam or DDoS using `express-rate-limit` with optional Redis backing.
4. **Structured Logging**: Built-in `winston` logger with optional Grafana Loki transport integration (`winston-loki`).
5. **CORS & Security**: Configured CORS origins with support for credentials, custom authorization headers, and cookie parsing.

---

## Microservice Proxies & Routes

The API Gateway routes traffic to the following downstream services:

| Route Prefix | Service | Description |
| :--- | :--- | :--- |
| `/api/v1/auth` | User & Admin Service | User registration, login, logout, password resets |
| `/api/v1/user` | User & Admin Service | User profile management, support/unsupport, artist requests |
| `/api/v1/admin` | User & Admin Service | Admin dashboard, user management, platform analytics |
| `/api/v1/wallet` | Wallet Service | Balance, transactions, Stripe checkout, gifts, withdrawals |
| `/api/v1/art` | Art Service | Artwork creation, auctions, bids, comments, likes, commissions |
| `/api/v1/notifications` | Notification Service | In-app notification retrieval, mark-as-read |
| `/api/v1/upload` | Upload Service | S3 image/artwork file uploads |
| `/api/v1/elastic` | Search Service | Elasticsearch indexing and artwork discovery |
| `/api/v1/chat` | Chat Service | Private & group messaging conversations |

---

## Directory Structure

```
api-gateway/
├── src/
│   ├── app.ts                    # Express application setup, CORS, rate limiting, route mounting
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   ├── env.ts                # Environment variable schemas & configuration loader
│   │   └── authRoutes.config.ts  # Route access control policy mappings (user, user_optional, admin)
│   ├── constants/
│   │   ├── messages.ts           # Response messages & constants
│   │   └── routes.ts             # Central API route path declarations
│   ├── middleware/
│   │   ├── conditionalAuth.ts    # Central router matching paths to auth policy
│   │   ├── authUser.ts           # Required User JWT verification
│   │   ├── optionalAuthUser.ts   # Optional User JWT verification
│   │   ├── adminAuth.ts          # Required Admin JWT & Role verification
│   │   └── rateLimiter.ts        # Express rate limiting logic
│   ├── proxy/                    # Service reverse proxy definitions
│   │   ├── admin.proxy.ts
│   │   ├── art.proxy.ts
│   │   ├── auth.proxy.ts
│   │   ├── chat.proxy.ts
│   │   ├── elastic-search.proxy.ts
│   │   ├── notifications.proxy.ts
│   │   ├── S3.proxy.ts
│   │   ├── user.proxy.ts
│   │   └── wallet.proxy.ts
│   ├── routes/
│   │   └── main.route.ts         # Main router binding route bases to service proxies
│   ├── utils/
│   │   └── logger.ts             # Winston & Loki logger configuration
│   └── types/                    # TypeScript interfaces & type extensions
├── Dockerfile                    # Containerization instructions
├── eslint.config.mts             # Linter configuration
├── package.json                  # Dependencies & scripts
└── tsconfig.json                 # TypeScript compiler options
```

---

## Environment Variables

Copy `.env.example` to `.env.local` (for local development) or `.env.docker` (for Docker execution):

```bash
# Server Configuration
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5000

# Downstream Microservice URLs
MAIN_SERVICE_URL=http://localhost:4001
WALLET_SERVICE_URL=http://localhost:4002
ART_SERVICE_URL=http://localhost:4003
NOTIFICATION_URL=http://localhost:4004
S3_SERVICE_URL=http://localhost:4005
ELASTIC_SEARCH_SERVICE_URL=http://localhost:4006
CHAT_SERVICE_URL=http://localhost:4007

# JWT Secrets & Expiry
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Redis (Optional Rate Limiting)
REDIS_HOST=localhost
REDIS_PORT=6379

# Grafana Loki Logging (Optional)
LOKI_HOST=https://your-loki-instance.grafana.net
LOKI_USER=123456
LOKI_TOKEN=your_loki_token
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v18+` or `v20+`
- **npm** or **pnpm**
- Running downstream microservices (or Docker Compose setup)

### Installation

```bash
# Navigate to api-gateway folder
cd backend/api-gateway

# Install dependencies
npm install
```

### Running Locally

```bash
# Start in local watch mode using tsx
npm run local

# Or start in Docker-targeted mode
npm run dev
```

### Build & Production Start

```bash
# Compile TypeScript to JavaScript (dist/)
npm run build

# Start production server
npm start
```

### Code Quality & Linting

```bash
# Run linter
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

---

## Docker Usage

The API Gateway is included in the project's root `docker-compose.yml`. To run the API Gateway within Docker

```bash
# Build & run gateway service
docker compose up --build api-gateway
```
