# ArtChain Art Service

The **Art Service** is a core microservice in the **ArtChain** ecosystem responsible for managing digital artwork, auctions, bidding, commission request lifecycles, comments, likes/favorites, and AI artwork generation via Google Gemini. It is built using TypeScript, Node.js, Express, MongoDB (Mongoose), InversifyJS (Dependency Injection), and RabbitMQ for asynchronous event messaging.

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![AWS CloudFront](https://img.shields.io/badge/AWS%20CloudFront-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Grafana Loki](https://img.shields.io/badge/Grafana%20Loki-F46800?style=for-the-badge&logo=grafana&logoColor=white)

---

## Key Features

1. **Artwork Management**: Create, view, search, and delete artwork listings with dynamic metadata, tags, and category associations.
2. **Auction & Bidding Engine**: Manage live auctions, real-time bid processing, bidding history tracking, and automated auction settlement.
3. **Commission Workflow**: Mutual agreement commission request lifecycles between clients and artists with multi-step status updates.
4. **AI Generation Integration**: AI artwork generation powered by Google Gemini with quota management, configuration settings, and generation history.
5. **Social Interactions**: Artwork likes, dislikes, favorites, and threaded comments.
6. **Secure Media Access**: AWS CloudFront CDN signed URLs for artwork downloads and asset streaming.
7. **Event-Driven Architecture**: Uses RabbitMQ to publish artwork lifecycle events to the Elasticsearch service, Notification service, and Wallet service.

---

## Clean Architecture Layers

The service follows **Clean Architecture** principles to separate business logic from framework details:

```
src/
├── domain/            # Entities, domain models, contracts, repository interfaces
├── application/       # Use cases, services, DTOs, bus handlers
├── infrastructure/    # Database models (Mongoose), RabbitMQ, Redis, CloudFront, Inversify IoC container
├── presentation/      # Express controllers, routers, middleware
├── constants/         # Domain constants and route endpoints
├── scripts/           # Seeding scripts (e.g. AI provider configurations)
└── utils/             # Winston logger, helpers, error handlers
```

---

## Environment Variables

Copy `.env.example` to `.env.local` or `.env.docker`:

```bash
# Server Configuration
NODE_ENV=development
PORT=4002

# Databases & Messaging
MONGO_URL=mongodb://localhost:27017/artchain_art
RABBITMQ_URL=amqp://localhost:5672
REDIS_URL=redis://localhost:6379

# Gateway & Services
API_GATEWAY_URL=http://localhost:4000

# AWS CloudFront CDN
AWS_CDN_DOMAIN=your-cdn.cloudfront.net
CLOUDFRONT_KEY_PAIR_ID=your_key_pair_id
CLOUDFRONT_PRIVATE_KEY=your_private_key_pem

# Authentication & Admin
JWT_ACCESS_SECRET=your_jwt_access_secret
PLATFORM_ADMIN_ID=admin_wallet_id

# Observability
LOKI_HOST=https://your-loki-instance.grafana.net
LOKI_USER=123456
LOKI_TOKEN=your_loki_token
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB instance running
- RabbitMQ & Redis running

### Installation & Scripts

```bash
# Navigate to art-service
cd backend/services/art-service

# Install dependencies
npm install

# Run locally in watch mode
npm run local

# Seed default AI configurations
npm run seed

# Build TypeScript
npm run build

# Start compiled output
npm start

# Run Linter
npm run lint
```
