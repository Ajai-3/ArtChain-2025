# ArtChain 2025

> A decentralized, enterprise-grade platform connecting digital artists with art enthusiasts — built on a production-ready microservices ecosystem.

ArtChain facilitates secure art commissions, peer-to-peer live communication, real-time bidding, and dynamic portfolio management. The platform is architected using **Clean Architecture** principles, ensuring exceptional scalability, strict separation of concerns, and long-term maintainability.

---

## System Design

A full breakdown of the system architecture, service interactions, and data flow is documented here:

**[View Full System Design](./docs/System-Design.md)**

---

## Top Features

**Mutual-Agreement Commission Workflow**
A trustworthy escrow-backed commission system where funds are locked upfront and released only after both parties approve each stage — Agreement, In Progress, Delivery, and Payout. Neither side can be exploited.

**Live Peer-to-Peer Video & Messaging**
Real-time text chat with inline image support and seamless WebRTC-powered video calling — all without leaving the platform. Signaling is handled entirely by the dedicated chat service.

**Real-Time Bidding**
Artists and collectors can participate in live auction-style bidding with instant updates powered by Socket.io, ensuring a fair and transparent process.

**Artist Identity Verification**
A structured verification pipeline ensures only legitimate artists can list work, building platform-wide trust for both buyers and creatives.

**Stripe Escrow & Payouts**
Integrated Stripe handles fund-locking during active commissions and automated artist payouts upon successful delivery — no manual intervention required.

**Centralized Observability**
Loki aggregates container logs from every microservice and feeds them into Grafana dashboards, giving complete visibility into platform health with zero blind spots.

**Elasticsearch-Powered Search**
High-performance vector search across artworks and user profiles, enabling fast and relevant discovery across the entire catalog.

**Cloud Media CDN**
All image uploads — avatars and full-resolution illustrations — are proxied through a dedicated S3 service acting as the platform's unified content delivery network.

---

## Tech Stack

### Frontend

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

| Tool | Purpose |
|---|---|
| **TanStack Query** | Server-state management, data fetching & intelligent caching |
| **shadcn/ui** | Accessible, customizable UI component library |
| **Socket.io Client + WebRTC** | Real-time messaging & peer-to-peer video |
| **Redux Toolkit** | Complex global client-state management |

### Backend & Infrastructure

![Node.JS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![ElasticSearch](https://img.shields.io/badge/-ElasticSearch-005571?style=for-the-badge&logo=elasticsearch)
![RabbitMQ](https://img.shields.io/badge/rabbitmq-%23FF6600.svg?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)
![Loki](https://img.shields.io/badge/loki-%23F5A623.svg?style=for-the-badge&logo=grafana&logoColor=white)

| Tool | Purpose |
|---|---|
| **PostgreSQL** | Relational data, managed via Prisma & pgAdmin |
| **MongoDB** | Flexible document-based storage |
| **Redis** | High-speed caching layer |
| **RabbitMQ** | Asynchronous inter-service event messaging |
| **Elasticsearch** | Vector search & structured log indexing |
| **Loki + Grafana** | Centralized observability & metrics dashboards |
| **Docker + Compose** | Container orchestration across all services |

---

## Microservices

Each service is strictly bounded to its own domain with no cross-service coupling.

| Service | Port | Responsibility |
|---|---|---|
| `api-gateway` | 4000 | Edge proxy — request routing, auth pass-through & global rate-limiting |
| `user-admin-service` | 4001 | IAM — registration, OAuth (Google), authorization, artist verification & admin dashboards |
| `art-service` | 4002 | Core art engine — artwork management, bidding pipelines & commission workflows |
| `wallet-service` | 4003 | Finances & escrow — Stripe integration, fund-locking & artist payouts |
| `elastic-search-service` | 4004 | Search indexing — fast native search across art and user data |
| `notification-service` | 4005 | Event bus — email alerts, system notifications & platform broadcasts |
| `s3-service` | 4006 | Media proxy — image upload & streaming via cloud bucket CDN |
| `chat-service` | 4007 | Real-time comms — Socket.io chat, media messaging & WebRTC video signaling |

---

## Getting Started

### Prerequisites

- Node.js v18+
- Docker & Docker Compose

### Setup & Launch

**1. Configure environment variables**

Copy the `.env.docker` or `.env.example` templates into each service directory and populate the required values.

**2. Initialize databases** *(first run only)*

```bash
# Unix
bash init-multiple-dbs.sh

# Windows
./start-all.ps1
```

**3. Start the full container stack**

```bash
docker-compose up -d --build
```

**4. Access the platform**

| Interface | URL |
|---|---|
| Frontend (Vite dev server) | `npm run dev` |
| pgAdmin Dashboard | `http://localhost:8080` |
| Grafana Observability | `http://localhost:3000` |

---

*ArtChain 2025 — Setting the modern standard for decentralized art ecosystems.*
