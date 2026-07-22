# ArtChain S3 Upload Service

The **S3 Upload Service** manages secure media uploading, image processing (watermarking, resizing, thumbnail generation), content moderation, and Amazon S3 / CloudFront CDN integration for **ArtChain**. Built with TypeScript, Node.js, Express, Sharp, Canvas, NSFWJS (TensorFlow.js), and AWS SDK v3.

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![AWS CloudFront](https://img.shields.io/badge/AWS%20CloudFront-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Sharp](https://img.shields.io/badge/Sharp-99CC00?style=for-the-badge&logo=sharp&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Grafana Loki](https://img.shields.io/badge/Grafana%20Loki-F46800?style=for-the-badge&logo=grafana&logoColor=white)

---

## Key Features

1. **Multi-Bucket File Uploads**: Upload handling for artwork (public previews and private high-res storage), avatars, commission attachments, and chat media via `multer`.
2. **AI Content Moderation**: Integrates `nsfwjs` (TensorFlow.js) for automated pre-upload scanning to block inappropriate or unsafe images.
3. **Dynamic Watermarking & Image Processing**: Automated image transformations, thumbnail creation, and customizable text/logo watermarking using `sharp` and `canvas`.
4. **AWS S3 & CloudFront CDN Integration**: Secure upload pipelines into S3 buckets and generation of CloudFront signed URLs for protected content delivery.
5. **Event Notifications**: Emits file upload and cleanup events to RabbitMQ queues for asynchronous consumption by downstream microservices.

---

## Architecture Layers

```
src/
├── domain/            # Storage contracts, image moderation specs, watermarking interfaces
├── application/       # Use cases (UploadArtwork, ProcessWatermark, ModerateImage, DeleteFile)
├── infrastructure/    # AWS S3 client, CloudFront signer, NSFWJS moderation engine, Sharp processor
├── presentation/      # Upload controllers, Multer multipart middlewares, Express routes
├── constants/         # Storage buckets, mime types, file limits
└── types/             # Upload result payloads, image metadata typings
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# Server Configuration
NODE_ENV=development
PORT=4006

# Messaging
RABBITMQ_URL=amqp://localhost:5672

# AWS Credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# AWS S3 Buckets
AWS_UPLOAD_BUCKET=artchain-temp-uploads
AWS_UPLOAD_ACL=public-read
AWS_ART_BUCKET_PRIVATE=artchain-art-private
AWS_ART_BUCKET_PUBLIC=artchain-art-public
AWS_ART_ACL=public-read
AWS_CHAT_BUCKET=artchain-chat-media
AWS_BIDDING_BUCKET=artchain-bidding-assets

# CloudFront CDN
AWS_CDN_DOMAIN=your-cdn.cloudfront.net
CLOUDFRONT_KEY_PAIR_ID=your_key_pair_id
CLOUDFRONT_PRIVATE_KEY=your_private_key_pem

# Observability
LOKI_HOST=https://your-loki-instance.grafana.net
LOKI_USER=123456
LOKI_TOKEN=your_loki_token
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- AWS Account with S3 and CloudFront key pairs configured
- Local native dependencies for `canvas` & `sharp` compilation

### Installation & Scripts

```bash
# Navigate to s3-service
cd backend/services/s3-service

# Install dependencies
npm install

# Run locally with tsx watch
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run linter
npm run lint
```
