# ArtChain Chat Service

The **Chat Service** provides real-time messaging, private and group conversation management, WebRTC peer-to-peer video signaling, and attachment support for the **ArtChain** platform. It is built with Node.js, Express, Socket.IO (with Redis Adapter for multi-instance scaling), MongoDB, TypeScript, and InversifyJS Clean Architecture.

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Grafana Loki](https://img.shields.io/badge/Grafana%20Loki-F46800?style=for-the-badge&logo=grafana&logoColor=white)

---

## Key Features

1. **Real-Time Messaging**: Websocket-driven instant messaging using Socket.IO, backed by Redis Adapter for pub/sub scaling across multiple gateway nodes.
2. **Private & Group Conversations**: Direct 1-on-1 chats and group rooms with member management (add/remove members, promote admin).
3. **WebRTC Video & Audio Signaling**: Signal exchange endpoint for peer-to-peer WebRTC connections (video calls, screen sharing).
4. **Conversation History & Pagination**: MongoDB storage for message persistence, read receipts, and recent conversation lists.
5. **Media Attachment Integration**: AWS CloudFront URL mapping for chat attachment previews and file sharing.

---

## Clean Architecture Layers

```
src/
├── domain/            # Entities (Conversation, Message), repository interfaces, value objects
├── applications/      # Use cases (SendMessage, CreateGroup, ManageMembers), service interfaces
├── infrastructure/    # Database models (Mongoose), Socket.IO server setup, Redis Adapter, Inversify DI
├── presentation/      # HTTP Controllers, Express routes, Socket handlers/events
├── constants/         # Event names, route paths, messages
└── utils/             # Winston logger, auth helpers, error handling
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# Server Configuration
NODE_ENV=development
PORT=4007
FRONTEND_URL=http://localhost:5000

# Database & Cache
MONGO_URI=mongodb://localhost:27017/artchain_chat
REDIS_URL=redis://localhost:6379

# Authentication & Media
JWT_ACCESS_SECRET=your_jwt_access_secret
AWS_CDN_DOMAIN=your-cdn.cloudfront.net

# Observability
LOKI_HOST=https://your-loki-instance.grafana.net
LOKI_USER=123456
LOKI_TOKEN=your_loki_token
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB & Redis running locally or via Docker

### Installation & Scripts

```bash
# Navigate to chat-service
cd backend/services/chat-service

# Install dependencies
npm install

# Run locally with tsx watch
npm run local

# Build TypeScript
npm run build

# Start production server
npm start

# Run linter
npm run lint
```
