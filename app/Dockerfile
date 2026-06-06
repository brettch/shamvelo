FROM node:24.16.0-slim AS build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY src/ src/
RUN npm run build

FROM node:24.16.0-slim
WORKDIR /app
COPY --from=build /build/dist/index.cjs dist/index.cjs
COPY views/ views/
COPY static/ static/
EXPOSE 8080
CMD ["node", "dist/index.cjs"]
