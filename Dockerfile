# syntax=docker/dockerfile:1

FROM node:20-alpine
WORKDIR /app
COPY . .
# ------------------------------------------------------------
# Must provide values for this to app to work
# If I wanna deploy a docker image
ENV DATABASE_URL=''
ENV COOKIE_SECRET=''
ENV JWT_SECRET=''
# ------------------------------------------------------------
RUN npm install
RUN npm run build
CMD [ "npm", "run", "start:prod" ] 
EXPOSE 3000