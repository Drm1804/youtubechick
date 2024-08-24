FROM node:20-alpine3.20
RUN apk --no-cache add curl
RUN apk -U add yt-dlp
RUN mkdir /bot
WORKDIR /bot
COPY package.json /bot
COPY package-lock.json /bot
RUN npm ci
COPY tsconfig.json /bot
COPY .eslintrc.json /bot
COPY .eslintignore /bot
COPY tsconfig.release.json /bot
COPY config.type.ts /bot
COPY config.ts /bot
COPY /src /bot/src
RUN mkdir files
RUN npm run build
