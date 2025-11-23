# Base stage - shared dependencies
FROM node:24.11.1-alpine AS base

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies using exact versions from package-lock.json
RUN npm ci --no-audit --prefer-offline

# Development stage
FROM base AS development

# Copy all application files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Set environment
ENV NODE_ENV=development

# Start development server with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Test stage
FROM base AS test

# Copy all application files
COPY . .

# Set environment
ENV NODE_ENV=test

# Run tests
CMD ["npm", "test"]

