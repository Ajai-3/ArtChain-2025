# Stage 1: Build
FROM node:20-bullseye AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Runtime
FROM node:20-bullseye
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm install @esbuild-kit/esm-loader   
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 4003
CMD ["node", "--loader", "@esbuild-kit/esm-loader", "--no-warnings", "dist/server.js"]
