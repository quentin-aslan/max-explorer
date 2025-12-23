# ============================================
# STAGE 1: Base - Image Node.js légère
# ============================================
FROM node:22-alpine AS base
WORKDIR /app

# ============================================
# STAGE 2: Dependencies - Installe les dépendances
# ============================================
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ============================================
# STAGE 3: Build - Compile l'application
# ============================================
FROM deps AS build
COPY . .
RUN npm run build

# ============================================
# STAGE 4: Migration - Image pour les migrations
# ============================================
FROM deps AS migration
COPY scripts/ ./scripts/
COPY migrations/ ./migrations/
CMD ["npx", "tsx", "scripts/migrate.ts", "up"]

# ============================================
# STAGE 5: Production - Image finale légère
# ============================================
FROM base AS production
COPY --from=build /app/.output ./.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]