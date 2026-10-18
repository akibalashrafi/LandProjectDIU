# Multi-stage Dockerfile for LandSure BD Full-Stack
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy source trees
COPY frontend ./frontend
COPY backend ./backend

# Build frontend and backend
RUN cd frontend && npm run build
RUN cd backend && npm run build

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist

# Install production backend dependencies
RUN cd backend && npm install --omit=dev

EXPOSE 5000

CMD ["node", "backend/dist/server.js"]
