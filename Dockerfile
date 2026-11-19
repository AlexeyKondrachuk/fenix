FROM node:24-trixie-slim AS build
WORKDIR /app
COPY package*.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_YMAPS_API_KEY
ENV NEXT_PUBLIC_YMAPS_API_KEY=$NEXT_PUBLIC_YMAPS_API_KEY NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-trixie-slim
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=node:node /app /app
USER node
CMD ["npm", "start"]
