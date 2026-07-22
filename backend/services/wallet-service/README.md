# ArtChain Wallet Service

The **Wallet Service** is the financial engine and escrow manager for **ArtChain**. Built with Node.js, Express, TypeScript, PostgreSQL (via Prisma ORM), Stripe, and RabbitMQ, it handles user wallet balances, Stripe checkout payment processing, escrow lock/unlock mechanisms for commissions and auctions, withdrawal requests, peer-to-peer gifting, and transaction analytics.

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-6772E5?style=for-the-badge&logo=stripe&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

---

## Key Features

1. **Digital Wallet & Ledger**: Balance tracking, deposits, withdrawals, and immutable transaction logs stored in PostgreSQL.
2. **Stripe Payment Gateway**: Stripe Checkout Session creation and webhook signature validation (`STRIPE_WEBHOOK_SECRET`) for automated wallet top-ups.
3. **Escrow & Fund Locking**: Commission and auction fund locking mechanisms (`commission/lock`, `commission/distribute`, `commission/refund`) ensuring financial safety for buyers and artists during active jobs.
4. **Withdrawal Pipeline**: User withdrawal request creation, admin approval/rejection workflows, and automated status updates.
5. **Gifting & Direct Transfers**: Peer-to-peer balance gifting between users.
6. **Financial Analytics**: Wallet statistics charts and admin revenue reports.

---

## Clean Architecture Layers

```
wallet-service/
├── prisma/            # Prisma schema, migrations, relational database seeds
├── src/
│   ├── domain/        # Wallet entities, Transaction value objects, Escrow contracts
│   ├── application/   # Use cases (ProcessPayment, LockCommission, RequestWithdrawal, GiftBalance)
│   ├── infrastructure/# Prisma client instance, Stripe webhook verifier, RabbitMQ event handler
│   ├── presentation/  # Express REST controllers, Stripe Webhook endpoint, routes
│   ├── constants/     # Transaction types, route definitions
│   └── utils/         # Winston logger, error handling
```

---

## Environment Variables

Copy `.env.example` to `.env.local` or `.env.docker`:

```bash
# Server Configuration
NODE_ENV=development
PORT=4003
CLIENT_URL=http://localhost:5173
API_GATEWAY_URL=http://localhost:4000

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/wallet_db?sslmode=disable"

# Messaging & Platform
RABBITMQ_URL=amqp://localhost:5672
PLATFORM_ADMIN_ID=admin_wallet_id

# Stripe Integration
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Observability
LOKI_HOST=https://your-loki-instance.grafana.net
LOKI_USER=123456
LOKI_TOKEN=your_loki_token
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database running (v14+)
- RabbitMQ broker running
- Stripe test account credentials

### Installation & Scripts

```bash
# Navigate to wallet-service
cd backend/services/wallet-service

# Install dependencies
npm install

# Run database migrations
npm run prisma:migrate

# Push schema directly (dev mode)
npm run prisma:push

# Run database seeds
npx prisma db seed

# Run locally with tsx watch
npm run local

# Build TypeScript
npm run build

# Start production server
npm start

# Run linter
npm run lint
```
