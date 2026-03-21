# ArtChain-2025

Welcome to **ArtChain-2025**, a premier decentralized platform bridging the gap between digital artists, enthusiasts, and collectors. The application is built with modern, scalable, microservice-based architecture to provide exceptional experiences for art commission workflows, real-time communications, artwork showcasing, peer interactions, bidding, and more.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Architecture and Tech Stack](#architecture-and-tech-stack)
4. [Services Breakdown](#services-breakdown)
5. [Getting Started](#getting-started)

---

## Project Overview

ArtChain-2025 is designed to be the ultimate hub for artists and art lovers. The platform secures art commissions by implementing mutual agreement workflows and fund locking. It provides state-of-the-art interactive modules like real-time chats, WebRTC video calling, and a live bidding system for art auctions, all wrapped in a premium UX. 

## Key Features

- **Advanced Art Commissions**: Sophisticated workflows where artists and requesters iteratively agree on terms, combined with scalable fund-locking to prevent scam/fraud scenarios. Artists can seamlessly deliver their final artwork via the platform.
- **Real-Time Capabilities**: Featuring real-time messaging, including media-rich texts, and built-in WebRTC based direct video calling directly integrated into the client application.
- **Dynamic Bidding & Auctions**: Start time/end time functionalities and robust auction pipelines. Current highest bidders are updated seamlessly.
- **Role-Based Workflows**: Tailored user experiences depending on whether the user is a standard browser, an artist, or an administrator.
- **Content Delivery Network (CDN) Integtration**: Scalable handling of high-quality digital artwork, properly sized profile banners, and dynamic user images.
- **Admin & Dashboard Capabilities**: Premium dashboards to visualize user bases, financial transactions, and content moderation tools (skeleton-loaded for aesthetics and performance).

## Architecture and Tech Stack

ArtChain-2025 runs on a highly scalable **Microservice Architecture** deployed and orchestrated via **Docker**.

- **Frontend**: React, Next.js / Vite (Typescript), utilizing modular CSS/Tailwind with aesthetically driven components.
- **Backend Infrastructure**:
  - API Gateway: Reverse proxy handling routing, verification, and centralized rate limiting.
  - Microservices: Built typically in Node.js (TypeScript) employing Clean Architecture.
- **Real-Time Communication**: `socket.io` for chat events and `WebRTC` (via Google/Twilio STUN servers) for P2P video connections.
- **Database Architecture**: Highly reliant on multiple databases mapping to their individual boundaries (Microservice DB per Service pattern) such as MongoDB/PostgreSQL implementations.
- **Tooling**: Containerized with Docker / Docker-Compose, structured for cloud-agnostic deployments.

## Services Breakdown

Within the project folder, services are decoupled effectively:
- `api-gateway`: The entry point for all frontend traffic. Handles routing and edge access.
- `user-admin-service`: Built heavily on SOLID principles. Responsible for user registration, authentication, OAuth integrations, profiles, roles, and main dashboard data.
- `art-service`: Manages creation, fetching, and deletion of artwork documents. Contains logic for the commission lifecycles.
- `chat`: Real-time conversation logic with socket hooks bridging interactions among users.
- `frontend`: The client application.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) and `docker-compose` installed natively.

### Running standard instances:
1. Ensure `.env` files are populated in the relevant directories using the provided templates (`.env.example`).
2. Run database initialization script (if fresh setup):
   ```bash
   bash init-multiple-dbs.sh
   # Or use the Powershell script if on Windows
   ./start-all.ps1
   ```
3. Boot the environment utilizing Docker:
   ```bash
   docker-compose up -d --build
   ```
4. Access the platform through the API gateway proxy layer and the local Frontend service output port.

## License
Confidential and Proprietary. ArtChain-2025.
