FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY . .

RUN npx prisma generate

EXPOSE 4003

CMD ["npm", "run", "dev"]
