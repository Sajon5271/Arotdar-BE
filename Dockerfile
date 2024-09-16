# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
# ------------------------------------------------------------
# Must provide values for this to app to work
# If I wanna deploy a docker image
# Now they will be coming from fly.io secrets
# ENV DATABASE_URL=''
# ENV COOKIE_SECRET=''
# ENV JWT_SECRET=''
# ------------------------------------------------------------
ENV NODE_ENV='production'
ENV CHROME_BIN="/usr/bin/chromium-browser" \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
  && apk update \
  && apk upgrade \
  && apk add --no-cache \
  udev \
  ttf-freefont \
  chromium
COPY package.json package-lock.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .
RUN npm run build
CMD [ "pm2-runtime", "./dist/main.js" ] 
EXPOSE 3000