FROM node:20

WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install -g npm@11.6.0

COPY package*.json ./

RUN npm cache clean --force

RUN npm install 

COPY . .

EXPOSE 4004

CMD ["npm", "run", "dev"]
