# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm install -g npm@11.6.0
COPY package*.json ./
RUN npm cache clean --force
RUN npm install 
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 4004
CMD ["node", "dist/server.js"]
