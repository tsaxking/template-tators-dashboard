FROM --platform=linux/amd64 node:22.12.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM --platform=linux/amd64 node:22.12.0-alpine AS production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./

# this also copies node modules, we don't want that.
# COPY --from=build /app .

EXPOSE 3000

CMD [ "npm", "start" ]