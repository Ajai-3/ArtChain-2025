# ArtChain Elasticsearch Service

The **Elasticsearch Service** provides ultra-fast full-text search, auto-suggestions, and search indexing capabilities for artworks, users, and tags across the **ArtChain** platform. It listens for real-time domain events via **RabbitMQ** (such as artwork creation, updates, or user profile modifications) to keep Elasticsearch indices synchronized.

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![ElasticSearch](https://img.shields.io/badge/ElasticSearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Grafana Loki](https://img.shields.io/badge/Grafana%20Loki-F46800?style=for-the-badge&logo=grafana&logoColor=white)

---

## Key Features

1. **High-Performance Search**: Full-text keyword search across artwork titles, descriptions, categories, price ranges, and tags.
2. **Event-Driven Auto-Indexing**: Listens to RabbitMQ messaging topics (`art.created`, `art.updated`, `art.deleted`, `user.updated`) to maintain index consistency without polling.
3. **Fuzzy Matching & Aggregations**: Supports fuzzy queries, category filtering, and aggregated search statistics.
4. **CloudFront Media Integration**: Format search result payloads with CDN-accelerated artwork thumbnail URLs.

---

## Architecture Overview

```
src/
├── config/            # Environment variable loader & Elasticsearch client setup
├── consumers/         # RabbitMQ event consumers for real-time index synchronization
├── controller/        # Search controllers handling incoming query REST APIs
├── interface/         # Search service and repository contract interfaces
├── Inversify/         # IoC container dependency injection bindings
├── repositories/      # Elasticsearch query builders and document mappers
├── routes/            # Express route bindings
├── services/          # Search business logic & index management
└── utils/             # Logger, error handlers, response formatting helpers
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# Server Configuration
NODE_ENV=development
PORT=4006

# Infrastructure
ELASTIC_URL=http://localhost:9200
RABBITMQ_URL=amqp://localhost:5672

# Media & Observability
AWS_CDN_DOMAIN=your-cdn.cloudfront.net
LOKI_HOST=https://your-loki-instance.grafana.net
LOKI_USER=123456
LOKI_TOKEN=your_loki_token
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Elasticsearch instance running (v8+)
- RabbitMQ message broker running

### Installation & Scripts

```bash
# Navigate to elastic-search-service
cd backend/services/elastic-search-service

# Install dependencies
npm install

# Run locally in watch mode
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run linter
npm run lint
```
