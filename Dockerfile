# Use the official Node.js image from the Docker Hub
FROM node:16

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# generate swagger documentation
RUN node swagger.js
# Define the command to run the app
CMD ["node", "server.js"]