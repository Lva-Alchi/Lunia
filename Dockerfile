FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV="production"

FROM base AS build
RUN apt-get update -qq && apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3 && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build --if-present
RUN npm prune --omit=dev

FROM base
COPY --from=build /app /app
# Gak perlu EXPOSE buat bot polling
CMD ["npm", "run", "start"]
