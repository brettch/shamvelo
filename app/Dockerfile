FROM node:24.16.0-alpine3.23 AS build
WORKDIR /build
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
COPY src/ src/
RUN npm run build

FROM node:24.16.0-alpine3.23
WORKDIR /app
COPY --from=build /build/dist dist/
COPY --from=build /build/node_modules node_modules/
COPY views/ views/
COPY static/ static/
EXPOSE 8080
CMD ["node", "dist/index.js"]
