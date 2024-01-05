# syntax=docker/dockerfile:1

FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm run build
RUN npm run start:prod
EXPOSE 3000