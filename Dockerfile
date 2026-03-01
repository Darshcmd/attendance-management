# Multi-stage build: Build frontend, copy to backend, run backend

# Stage 1: Build React Frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

# Set production environment variable for build
ENV REACT_APP_BASE_URL=""
ENV NODE_ENV=production

# Clean old builds
RUN rm -rf build

# Build the frontend
RUN npm run build

# Stage 2: Build and Run Backend with Frontend
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS=--max_old_space_size=512

# Copy backend files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy frontend build from Stage 1
COPY --from=frontend-builder /app/frontend/build ../frontend/build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the backend server
CMD ["node", "index.js"]
