# Multi-stage build to compile the Vite app and serve the static build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build the application
COPY . .
RUN npm run build

# Serve the compiled assets with a lightweight image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install a tiny static file server
RUN npm install -g serve

# Copy the production build
COPY --from=builder /app/dist ./dist

EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
