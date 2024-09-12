# syntax=docker/dockerfile:1

FROM node:20-alpine
WORKDIR /app
COPY . .
# ------------------------------------------------------------
# Must provide values for this to app to work
# If I wanna deploy a docker image
# Now they will be coming from fly.io secrets
# ENV DATABASE_URL=''
# ENV COOKIE_SECRET=''
# ENV JWT_SECRET=''
# ------------------------------------------------------------
RUN npm install
RUN npm run build
RUN npx puppeteer browsers install chrome
ENV NODE_ENV='production'
CMD [ "npm", "run", "start:prod" ] 
EXPOSE 3000