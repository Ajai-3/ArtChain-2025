# ArtChain Notification Service

The **Notification Service** manages multi-channel notifications across the **ArtChain** platform. It handles real-time in-app alerts via Socket.IO, persists notification history in MongoDB, and delivers transactional emails (email verification, password resets, auction status, commission alerts) using Nodemailer and HTML templates. It consumes events published by other microservices via **RabbitMQ**.

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io)
![Nodemailer](https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=gmail&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Grafana Loki](https://img.shields.io/badge/Grafana%20Loki-F46800?style=for-the-badge&logo=grafana&logoColor=white)

---

## Key Features

1. **Transactional Email Delivery**: Automated HTML email dispatches (email verification tokens, password resets, artist approval, purchase receipts, withdrawal updates).
2. **Real-Time In-App Alerts**: Socket.IO connection for instant client alerts when actions occur (likes, supporters, bids, commissions).
3. **Event Consumer Hub**: RabbitMQ consumers listening to system queues (`user.events`, `art.events`, `wallet.events`).
4. **Notification History**: Persistent MongoDB storage allowing users to fetch notification lists, unread counts, and mark notifications as read.

---

## Clean Architecture Layers

```
src/
├── domain/            # Notification entities, email value objects, repository contracts
├── application/       # Use cases (SendEmail, CreateNotification, MarkAllRead), event handlers
├── infrastructure/    # MongoDB schemas, RabbitMQ consumers, Nodemailer transport, Socket.IO server setup
├── presentation/      # HTTP Controllers, Express routes for notification retrieval
├── email-templates/   # Responsive HTML/CSS email templates (verification, welcome, transaction alerts)
├── constants/         # Event names, routing keys, template identifiers
└── types/             # Interface definitions and payload typings
```

---

## Environment Variables

Copy `.env.example` to `.env.local` or `.env.docker`:

```bash
# Server Configuration
NODE_ENV=development
PORT=4005
FRONTEND_URL=http://localhost:5000
API_GATEWAY_URL=http://localhost:4000

# MongoDB & RabbitMQ
MONGO_URL=mongodb://localhost:27017/artchain_notifications
RABBITMQ_URL=amqp://localhost:5672

# Email / SMTP Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM_NAME=ArtChain
EMAIL_FROM_ADDRESS=noreply@artchain.com
EMAIL_SECURE=false

# AWS S3 (Email Templates Optional)
EMAIL_TEMPLATE_BUCKET=artchain-email-templates

# Security & Observability
JWT_ACCESS_SECRET=your_jwt_access_secret
LOKI_HOST=https://your-loki-instance.grafana.net
LOKI_USER=123456
LOKI_TOKEN=your_loki_token
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB & RabbitMQ instances
- Active SMTP credentials (or Ethereal / Mailtrap for testing)

### Installation & Scripts

```bash
# Navigate to notification-service
cd backend/services/notification-service

# Install dependencies
npm install

# Run locally in watch mode
npm run local

# Build TypeScript
npm run build

# Start production server
npm start

# Run linter
npm run lint
```
