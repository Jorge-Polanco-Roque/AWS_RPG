# Multi-stage build for React frontend
FROM node:18-alpine AS client-build

# Set working directory for client
WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install client dependencies
RUN npm install --legacy-peer-deps

# Copy client source code
COPY client/ ./

# Build the React app
RUN npm run build

# Production image
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    sqlite \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --legacy-peer-deps

# Copy server source code
COPY src/ ./src/

# Copy built client files from build stage
COPY --from=client-build /app/client/build ./client/build

# Create database directory
RUN mkdir -p /app/data

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
  const options = { hostname: 'localhost', port: 5000, path: '/api/game/cosmic-entities', method: 'GET' }; \
  const req = http.request(options, (res) => { \
    if (res.statusCode === 200) { process.exit(0); } else { process.exit(1); } \
  }); \
  req.on('error', () => { process.exit(1); }); \
  req.end();"

# Start the application
CMD ["node", "src/server/index.js"]