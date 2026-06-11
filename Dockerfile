# ================================
# Stage 1 — Build & Test
# ================================
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Lint, test, then build — if any step fails, the image won't be created
RUN npm run lint && npm test && npm run build

# ================================
# Stage 2 — Production (nginx)
# ================================
FROM nginx:alpine AS production

# Copy only the built static files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80