# ArtChain User & Admin Service

The **User & Admin Service** is the identity, access management (IAM), user profile, and administrative backbone for the **ArtChain** platform. Built with Node.js, Express, TypeScript, PostgreSQL (via Prisma ORM), Google OAuth (Firebase Admin), gRPC, and RabbitMQ, it handles user authentication, artist identity verification requests, social supporter graphs, admin analytics, and platform governance.

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=json-web-tokens)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![gRPC](https://img.shields.io/badge/gRPC-244c5a?style=for-the-badge&logo=grpc&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

---

## Key Features

1. **Authentication & Authorization**: Registration, bcrypt password hashing, JWT Access/Refresh tokens, HTTP-only cookie support, and password/email change procedures.
2. **Google Social Authentication**: OAuth 2.0 verification via Firebase Admin SDK integration.
3. **Prisma & PostgreSQL Database**: Relational schema handling users, artist verification requests, roles, user status, and support relationships.
4. **Artist Verification Workflow**: Submission, review, approval, and rejection pipeline for users requesting Artist role status.
5. **Supporter Social Network**: Follower/supporter graphs (`support`, `unsupport`, `remove supporter`) between fans and digital artists.
6. **Admin Dashboard & Analytics**: System-wide metric aggregations, user account deactivation, platform reports, and governance tools.
7. **Cross-Service gRPC & Event Publishing**: High-speed gRPC endpoints and RabbitMQ event dispatches for user profile changes.

---

## Clean Architecture Layers

```
user-admin-service/
├── prisma/            # Prisma schema, migrations, relational database seeds
├── src/
│   ├── domain/        # Entities (User, ArtistRequest, Role), repository interfaces, domain errors
│   ├── application/   # Use cases (AuthenticateUser, ApproveArtist, ManageSupporters), DTOs
│   ├── infrastructure/# Prisma client instance, PostgreSQL repositories, Firebase Admin, RabbitMQ producer
│   ├── presentation/  # Express REST controllers, gRPC server definitions, route handlers
│   ├── test/          # Dummy user data seed generators
│   ├── constants/     # Roles, route constants, status codes
│   └── utils/         # JWT utilities, bcrypt helpers, Winston logger
```

---

## Environment Variables

Copy `.env.example` to `.env.local` or `.env.docker`:

```bash
# Server Configuration
NODE_ENV=development
PORT=4001
FRONTEND_URL=http://localhost:5000
API_GATEWAY_URL=http://localhost:4000

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/user_db?sslmode=disable"

# Messaging & CloudFront
RABBITMQ_URL=amqp://localhost:5672
AWS_CDN_DOMAIN=your-cdn.cloudfront.net

# JWT Configuration
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EMAIL_VERIFICATION_SECRET=your_email_verification_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
EMAIL_EXPIRES_IN=5m

# Firebase Admin (Google Auth)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

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
- RabbitMQ server running

### Installation & Scripts

```bash
# Navigate to user-admin-service
cd backend/services/user-admin-service

# Install dependencies
npm install

# Run database migrations
npm run prisma:migrate

# Push schema directly (dev mode)
npm run prisma:push

# Run locally with tsx watch
npm run local

# Seed dummy test users
npm run seed:users

# Build TypeScript
npm run build

# Start production server
npm start

# Run linter
npm run lint
```
