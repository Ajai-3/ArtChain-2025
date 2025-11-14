FROM node:20

WORKDIR /app

RUN npm install -g npm@11.6.0

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 4007

CMD ["npm", "run", "dev"]