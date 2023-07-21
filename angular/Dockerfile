# Use official node image as the base image
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

# ----------------------------
# run with nginx
# ----------------------------
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY --from=build /app/dist/angular-ecommerce /usr/share/nginx/html

EXPOSE 80