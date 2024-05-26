FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Build the TypeScript code
RUN tsc

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/server.js"]