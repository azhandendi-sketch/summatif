# Use a stable Node.js base image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Expose the port Cloud Run uses
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
