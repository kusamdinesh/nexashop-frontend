# Stage 1 — Build Angular app
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/dist/nexashop-frontend/browser /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]