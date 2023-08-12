# Use official node image as the base image
FROM node:18-alpine as builder

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container's /app directory
COPY package*.json .

# Install dependencies based on the package.json in the current directory
RUN npm install

# Copy the entire content of the current directory to the container's /app directory
COPY . .

# Run the npm build script to build the Angular application
RUN npm run build

# Use the official Nginx image as the base image
FROM nginx:alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy our custom Nginx config to the container
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static assets from builder stage
COPY --from=builder /app/dist/angular-ecommerce .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]

