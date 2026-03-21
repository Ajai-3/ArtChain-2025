# ArtChain-2025

Welcome to **ArtChain-2025**, a comprehensive, enterprise-grade decentralized platform designed to bridge the gap between digital artists and art enthusiasts. Through a robust microservices ecosystem, ArtChain facilitates secure art commissions, peer-to-peer live interactions, real-time bidding, and dynamic portfolios. 

The application has been meticulously engineered using **Clean Architecture** patterns, ensuring exceptional scalability, separation of concerns, and long-term maintainability.

---

## 🏗️ Architecture & Tech Stack

The entire backend ecosystem is composed of highly decoupled **Microservices**, orchestrated seamlessly via **Docker** and utilizing industry-standard design patterns.

**Frontend Stack:**
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
* **TanStack Query** (React Query): Leveraged for powerful, optimized server-state management, data fetching, and intelligent caching strategies.
* **shadcn/ui**: Utilized for stunning, accessible, and deeply customizable UI components without restrictive monolithic libraries.
* **Socket.io Client** & **WebRTC**: For seamless real-time sockets and peer-to-peer web-rtc video integrations.
* **Redux Toolkit**: Handling complex global client states.

**Backend & Infrastructure Stack:**
![Node.JS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white) ![ElasticSearch](https://img.shields.io/badge/-ElasticSearch-005571?style=for-the-badge&logo=elasticsearch) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
* **Clean Architecture**: Deeply integrated Domain, Application, and Infrastructure layers. Applies stringent SOLID principles (Dependency Inversion, Single Responsibility).
* **Databases**: Combining the relational constraints of **PostgreSQL** (managed via Prisma & pgAdmin) with the flexibility of **MongoDB**.
* **Redis**: Deployed as an ultra-fast caching layer for optimization.
* **Elasticsearch**: Used as a high-performance vector-search and logging utility module.
* **Loki & Grafana**: Deployed as the observability platform for centralized, aggregated microservice logging and beautiful metrics tracking.

---

## 📦 Microservices Breakdown

Each service maps exclusively to its domain boundary, ensuring no tight-coupling between disparate features:

1. **`api-gateway` (Port: 4000)**
   The edge proxy. Routes all incoming client requests to their appropriate downstream services, handling core authentication pass-through and global rate-limiting.

2. **`user-admin-service` (Port: 4001)**
   The robust IAM module. Manages user registration, OAuth flows (Google), authorization policies, profiles, artist identity verification, and curates extensive data for the admin observability dashboards.

3. **`art-service` (Port: 4002)**
   The core art engine. Handles the logic for artworks, bidding pipelines, and complex mutual-agreement commission workflows natively.

4. **`wallet-service` (Port: 4003)**
   Finances & Escrow. Using modern Stripe integrations, it manages fund-locking capabilities to ensure mutual trust during active commissions, successfully paying out artists upon workflow completion.

5. **`elastic-search-service` (Port: 4004)**
   Indexes art/user data to act as an incredibly fast native search utility engine.

6. **`notification-service` (Port: 4005)**
   The event bus listener. Broadcasts vital system alerts, email updates, and platform notifications safely.

7. **`s3-service` (Port: 4006)**
   The media proxy. Safely streams and handles image uploads (avatars, full-res digital illustrations) directly into cloud buckets acting as the unified platform CDN.

8. **`chat-service` (Port: 4007)**
   The real-time epicenter. Actively uses `Socket.io` to persist real-time chat spaces, manage media messaging, and negotiate WebRTC signaling for point-to-point video communication.

---

## 🚀 Platform Capabilities

* **Mutual-Agreement Commissions**: Protects both clients and creatives. Funds are locked in escrow, requiring dual sign-offs throughout various phases (Agreement -> In-Progress -> Delivery -> Payout).
* **Live Multimedia WebRTC Communication**: Why leave the platform to communicate? Integrated text messaging supports inline images alongside flawless live peer-to-peer Video calling. 
* **Dynamic Content Loaders**: Employing beautiful, customized Skeleton loading screens natively built in `shadcn` to keep aesthetic standards premium while `TanStack Query` seamlessly populates data.
* **Centralized Observability**: Zero blind-spots. **Loki** consumes container logs and outputs them directly into customizable **Grafana** visualization dashboards to track operational health.

---

## 🛠️ Getting Started

### Prerequisites
* **Node.js**: v18+ recommended.
* **Docker & Docker Compose**: Native installations required for infrastructure spinning.

### Running the Ecosystem

1. **Environment Setup**: Populate the `.env` roots throughout the distinct service directories using their respective `.env.docker` or `.env.example` templates.
2. **Database Initialization**: If running for the first time, boot the database instances via the shell scripts:
   ```bash
   # Unix environments
   bash init-multiple-dbs.sh
   
   # Windows environments
   ./start-all.ps1
   ```
3. **Container Orchestration**: Spin up the whole infrastructure network seamlessly:
   ```bash
   docker-compose up -d --build
   ```
4. **Accessing the Stack**:
   * Frontend Application: Boot the Vite bundler over `npm run dev`.
   * PgAdmin Dashboard: Accessible globally at `localhost:8080`.
   * Grafana Observability Dashboard: Accessible at `localhost:3000`.

---
**ArtChain-2025** — Setting the modern standard for Decentralized Art Ecosystems.
