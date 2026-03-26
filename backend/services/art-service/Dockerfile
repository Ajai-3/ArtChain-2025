# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install @esbuild-kit/esm-loader   
COPY --from=builder /app/dist ./dist
EXPOSE 4002
CMD ["node", "--loader", "@esbuild-kit/esm-loader", "--no-warnings", "dist/server.js"]