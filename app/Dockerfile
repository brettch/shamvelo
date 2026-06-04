FROM node:24.16.0-slim AS build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ src/
RUN npm run build

FROM node:24.16.0-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /build/dist/ dist/
COPY views/ views/
COPY static/ static/
EXPOSE 8080
CMD ["node", "dist/index.js"]
