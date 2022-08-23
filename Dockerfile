# syntax=docker/dockerfile:1

FROM node:18-alpine AS build
WORKDIR valbot
COPY ./package.json ./package-lock.json ./tsconfig.json ./
RUN npm ci
COPY ./src ./src
RUN npm run build

FROM node:18-alpine
COPY --from=build ./valbot/build ./valbot/package.json ./

CMD [ "npm", "start" ]
