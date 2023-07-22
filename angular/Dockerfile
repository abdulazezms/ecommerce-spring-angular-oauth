# Use official node image as the base image
FROM node:18-alpine as build

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container's /app directory
COPY package*.json .

# Install Node.js dependencies based on the package.json in the current directory
RUN npm install

# Copy the entire content of the current directory to the container's /app directory
COPY . .

# Run the npm build script to build the Angular application
RUN npm run build

# ----------------------------
# run with nginx
# ----------------------------
# Use the official Nginx image as the base image
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file to the container's Nginx configuration directory
COPY nginx.conf /etc/nginx/conf.d

# Copy the built Angular application files from the previous build stage to the Nginx web server's default HTML directory
COPY --from=build /app/dist/angular-ecommerce /usr/share/nginx/html

# Expose port 80 to make the web application accessible from outside the container
EXPOSE 80
