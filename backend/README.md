# ArtChain Backend Ecosystem

The **ArtChain Backend** is an enterprise-grade, event-driven microservices ecosystem engineered using **Clean Architecture** principles. It powers the ArtChain decentralized digital art platform, providing capabilities for user identity management, digital art marketplace transactions, real-time auctions, mutual-agreement commission workflows, AI-assisted image generation, real-time chat, media uploading/moderation, and full-text search.

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![ElasticSearch](https://img.shields.io/badge/ElasticSearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-6772E5?style=for-the-badge&logo=stripe&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![AWS CloudFront](https://img.shields.io/badge/AWS%20CloudFront-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![gRPC](https://img.shields.io/badge/gRPC-244c5a?style=for-the-badge&logo=grpc&logoColor=white)
![Grafana Loki](https://img.shields.io/badge/Grafana%20Loki-F46800?style=for-the-badge&logo=grafana&logoColor=white)

---

## Architecture Overview

```
                                      ┌──────────────────────┐
                                      │   Client Applications│
                                      └──────────┬───────────┘
                                                 │
                                                 ▼
                                      ┌──────────────────────┐
                                      │   Nginx Reverse Proxy│
                                      └──────────┬───────────┘
                                                 │
                                                 ▼
                                      ┌──────────────────────┐
                                      │  API Gateway (:4000) │
                                      │  • CORS & Rate Limit │
                                      │  • Conditional Auth  │
                                      └──────────┬───────────┘
                                                 │
          ┌──────────────┬───────────────┼───────────────┬──────────────┬──────────────┐
          ▼              ▼               ▼               ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐  ┌────────────┐  ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ user-admin │ │art-service │  │  wallet-   │  │notif-      │ │ s3-service │ │chat-service│
   │  service   │ │  (:4002)   │  │  service   │  │  service   │ │  (:4006)   │ │  (:4007)   │
   │  (:4001)   │ └─────┬──────┘  │  (:4003)   │  │  (:4005)   │ └─────┬──────┘ └─────┬──────┘
   └─────┬──────┘       │         └─────┬──────┘  └─────┬──────┘       │             │
         │              │               │               │              │             │
         ▼              ▼               ▼               ▼              ▼             ▼
   ┌────────────┐ ┌────────────┐  ┌────────────┐  ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ PostgreSQL │ │ MongoDB &  │  │ PostgreSQL │  │ MongoDB &  │ │ AWS S3 /   │ │ MongoDB &  │
   │   (IAM)    │ │ Gemini AI  │  │  (Escrow)  │  │ SMTP Mail  │ │ CloudFront │ │ Socket.io  │
   └────────────┘ └────────────┘  └────────────┘  └────────────┘ └────────────┘ └────────────┘
         │              │               │               │
         └──────────────┴───────┬───────┴───────────────┘
                                │ (Async Events)
                                ▼
                      ┌───────────────────┐
                      │ RabbitMQ Event Bus│
                      └─────────┬─────────┘
                                │
                                ▼
                      ┌───────────────────┐
                      │  elastic-search-  │ ──► Elasticsearch
                      │  service (:4004)  │     Cluster (:9200)
                      └───────────────────┘
```

---

## Services Breakdown

| Service Folder | Port | Primary Database | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **`api-gateway`** | `4000` | Redis (Cache) | Central entry point, request proxying, conditional JWT authentication, rate limiting, request logging |
| **`user-admin-service`** | `4001` | PostgreSQL (Prisma) | Identity & Access Management (IAM), Google OAuth, user profiles, artist verification, admin dashboard, gRPC |
| **`art-service`** | `4002` | MongoDB | Artwork CRUD, auction bidding engine, commission negotiation workflows, AI artwork generation via Google Gemini |
| **`wallet-service`** | `4003` | PostgreSQL (Prisma) | Ledger balance, Stripe Checkout Top-ups, commission escrow lock/release, withdrawals, peer-to-peer gifts |
| **`elastic-search-service`**| `4004` | Elasticsearch (`:9200`)| Full-text search engine, fuzzy queries, auto-indexing via RabbitMQ consumers |
| **`notification-service`** | `4005` | MongoDB | In-app alerts, Socket.IO live notifications, transactional email dispatches via Nodemailer |
| **`s3-service`** | `4006` | AWS S3 | File uploads, image watermarking/resizing (`sharp`), pre-upload AI content moderation (`nsfwjs`) |
| **`chat-service`** | `4007` | MongoDB | Real-time messaging via Socket.IO (Redis Adapter), 1-on-1 and group rooms, WebRTC call signaling |
| **`shared`** | N/A | N/A | `art-chain-shared` internal library containing shared types, schemas, logger helpers, and custom error classes |

---

## Docker & Container Orchestration

The entire backend infrastructure is containerized and orchestrated using **Docker** and **Docker Compose** (`docker-compose.yml` for development, `docker-compose.prod.yml` for production).

- **Isolated Docker Network (`backend`)**: All microservice containers, database containers, and proxy containers communicate securely inside a dedicated bridge network.
- **Container Healthchecks**: Service containers run health checks (e.g. `curl -f http://localhost:4001/health`) before starting dependent services.
- **Volume Management**: Persistent named volumes (`es_data`) preserve search indices across container restarts.
- **Multi-Stage Dockerfiles**: Optimized Dockerfiles for each microservice using Node.js slim images to ensure fast build times and reduced container image sizes.

---

## Nginx Reverse Proxy & SSL Termination

The backend deploys an **Nginx** reverse proxy (`api-reverse-proxy`) configured in `nginx/nginx.conf` that acts as the ingress controller on ports `80` (HTTP) and `443` (HTTPS):

- **HTTPS & SSL Termination**: Uses Let's Encrypt Certbot certificates (`/etc/letsencrypt/`) to terminate SSL and enforce automatic HTTP to HTTPS redirects (`301 https://$host$request_uri`).
- **REST API Routing**: Routes incoming REST API traffic to `api-gateway:4000` with proxy headers (`X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`).
- **Websocket Upgrade Handler**: Configured `map $http_upgrade $connection_upgrade` rules to proxy WebSocket upgrade requests directly to real-time service upstream nodes:
  - `/socket.io/notification` -> `notification-service:4005`
  - `/socket.io/chat` -> `chat-service:4007`
  - `/socket.io/bidding` -> `art-service:4002`

---

## Inter-Service Communication

1. **Reverse Proxying**: The **API Gateway** acts as the single point of entry using `http-proxy-middleware`, routing client requests to downstream microservices and performing path matching for authentication access policies.
2. **Asynchronous Event Bus**: Microservices publish domain events (`art.created`, `user.updated`, `wallet.deposited`, `commission.locked`) to **RabbitMQ**. Consumers in `elastic-search-service` and `notification-service` process these events asynchronously.
3. **RPC Communication**: Direct high-performance service-to-service communication is supported via **gRPC** (Protobuf contracts).
4. **Websockets**: Real-time events are distributed using **Socket.IO** attached to a **Redis Adapter** pub/sub backplane for horizontal scale.

---

## Directory Layout

```
backend/
├── api-gateway/              # Express API Gateway reverse proxy & auth router
├── services/
│   ├── art-service/          # Artwork, Auctions, Commissions, AI Studio service
│   ├── chat-service/         # Websocket real-time messaging & WebRTC service
│   ├── elastic-search-service/ # Elasticsearch indexing and search service
│   ├── notification-service/ # Email dispatch & in-app notification service
│   ├── s3-service/           # AWS S3 media uploads, sharp processing & moderation
│   ├── user-admin-service/   # PostgreSQL IAM, Auth, Artist verification, Admin service
│   └── wallet-service/       # PostgreSQL Escrow, Stripe payment, Withdrawal service
├── shared/                   # Shared TypeScript utilities (art-chain-shared)
├── nginx/                    # Nginx SSL / HTTP reverse proxy config & certificates
├── infra/                    # Infrastructure deployment manifests
├── docker-compose.yml        # Docker Compose configuration for local microservice orchestration
├── docker-compose.prod.yml   # Production Docker Compose setup
├── init-multiple-dbs.sh      # Database startup script
└── start-all.ps1             # Windows Terminal multi-tab launcher script
```

---

## Environment Setup

Each service reads environment variables from `.env.local` (local execution) or `.env.docker` (Docker execution). 

Copy `.env.example` in each service directory to `.env.local` or `.env.docker`:

```bash
# Example copy for API Gateway and Services
cp backend/api-gateway/.env.example backend/api-gateway/.env.docker
cp backend/services/user-admin-service/.env.example backend/services/user-admin-service/.env.docker
cp backend/services/art-service/.env.example backend/services/art-service/.env.docker
cp backend/services/wallet-service/.env.example backend/services/wallet-service/.env.docker
cp backend/services/notification-service/.env.example backend/services/notification-service/.env.docker
cp backend/services/s3-service/.env.example backend/services/s3-service/.env.docker
cp backend/services/chat-service/.env.example backend/services/chat-service/.env.docker
cp backend/services/elastic-search-service/.env.example backend/services/elastic-search-service/.env
```

---

## Running the Backend Ecosystem

### Option 1: Docker Compose (Recommended)

Run the entire microservice cluster including Elasticsearch and Nginx using Docker Compose:

```bash
# Navigate to backend folder
cd backend

# Build and start all services in Docker containers
docker compose up --build
```

To stop all containers:

```bash
docker compose down
```

### Option 2: Local Development Mode

Ensure PostgreSQL, MongoDB, Redis, RabbitMQ, and Elasticsearch instances are running locally.

1. **Install Shared Package**:
   ```bash
   cd backend/shared
   npm install
   npm run build
   ```

2. **Run All Services via PowerShell Launcher (Windows)**:
   ```powershell
   ./backend/start-all.ps1
   ```

3. **Or Run Individual Services**:
   ```bash
   # In separate terminals for each service:
   cd backend/api-gateway && npm run local
   cd backend/services/user-admin-service && npm run local
   cd backend/services/art-service && npm run local
   cd backend/services/wallet-service && npm run local
   cd backend/services/notification-service && npm run local
   cd backend/services/s3-service && npm run dev
   cd backend/services/chat-service && npm run dev
   cd backend/services/elastic-search-service && npm run dev
   ```

---

## Database Migrations & Seeding

For services using **Prisma ORM** (`user-admin-service` and `wallet-service`):

```bash
# Run User Service migrations
cd backend/services/user-admin-service
npm run prisma:migrate

# Run Wallet Service migrations & seed
cd backend/services/wallet-service
npm run prisma:migrate
npx prisma db seed
```
