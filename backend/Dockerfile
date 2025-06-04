# Use a lightweight Node.js image
FROM node:22-slim

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
COPY ./src . 

# Expose the port the backend runs on
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]
