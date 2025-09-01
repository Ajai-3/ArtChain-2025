# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy rest of the source code
COPY . .

# Expose port
EXPOSE 4004

# Start the service
CMD ["npm", "run", "dev"]
