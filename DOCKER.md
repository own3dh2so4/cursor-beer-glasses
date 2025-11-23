# Docker Development Setup

## Overview

This project includes a complete Docker setup for local development and testing without requiring Node.js installation.

## Quick Start

```bash
# Build images
make docker-build

# Start development server
make docker-dev

# Run tests
make docker-test
```

## Architecture

### Dockerfile Structure

**Base Stage:**
- Image: `node:24.11.1-alpine` (pinned version)
- Installs exact dependencies via `npm ci`
- Optimized for layer caching

**Development Stage:**
- Exposes port 5173
- Runs Vite dev server with host binding
- Supports hot-reload via volume mounts

**Test Stage:**
- Runs test suite in isolated environment
- No port exposure needed
- Clean environment for consistent results

### docker-compose.yaml Services

**dev service:**
- Development server with hot-reload
- Port: 5173:5173
- Volume mounts for source files
- Container name: `beer-glasses-dev`

**test service:**
- Test runner
- No ports exposed
- Volume mounts for test files
- Container name: `beer-glasses-test`

## Available Commands

### Build & Start
- `make docker-build` - Build Docker images from scratch
- `make docker-dev` - Start development server (attached)
- `make docker-dev-bg` - Start dev server in background

### Testing
- `make docker-test` - Run all tests once
- `make docker-test-watch` - Run tests in watch mode
- `make docker-test-coverage` - Run tests with coverage

### Management
- `make docker-down` - Stop all containers
- `make docker-clean` - Remove containers, volumes, and images
- `make docker-logs` - View dev server logs
- `make docker-shell` - Open interactive shell
- `make docker-rebuild` - Complete rebuild and restart

## Development Workflow

### Standard Development

```bash
# Start dev server in background
make docker-dev-bg

# Edit files in src/ - changes reflect automatically

# Run tests
make docker-test

# Stop when done
make docker-down
```

### Debugging

```bash
# View logs
make docker-logs

# Open shell in container
make docker-shell

# Inside container:
npm run dev
npm test
npm run lint
```

## Hot-Reload Configuration

The following files are mounted for instant updates:
- `./src/**` - All source code
- `./public/**` - Public assets
- `./index.html` - HTML entry point
- `./tailwind.config.js` - Tailwind config
- `./postcss.config.cjs` - PostCSS config
- `./vite.config.ts` - Vite config
- `./tsconfig.json` - TypeScript config

Changes to these files trigger hot-reload without rebuilding.

## Version Pinning

All versions are explicitly pinned:
- Docker base image: `node:24.11.1-alpine`
- npm packages: Exact versions from `package-lock.json` via `npm ci`
- Docker Compose: Version 3.9

## Benefits

✅ **No Node.js needed** - Docker provides everything
✅ **Consistent environment** - Same setup for all developers
✅ **Isolated testing** - Tests run in clean environment
✅ **Hot-reload works** - Edit locally, see changes instantly
✅ **CI/CD ready** - Same Docker setup for pipelines
✅ **Fast builds** - Alpine images are small (~150MB)

## Troubleshooting

### Port Already in Use

```bash
# Stop local Vite if running
pkill -f vite

# Or change port in docker-compose.yaml
ports:
  - "5174:5173"  # Use different host port
```

### Container Won't Start

```bash
# Clean everything and rebuild
make docker-clean
make docker-build
make docker-dev
```

### Hot-Reload Not Working

```bash
# Rebuild to ensure volume mounts are correct
make docker-rebuild
```

### Tests Failing

```bash
# Run tests locally to compare
npm test

# Check test logs in Docker
make docker-test

# Open shell to debug
make docker-shell
```

## File Structure

```
.
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yaml     # Service definitions
├── .dockerignore          # Files excluded from build
└── Makefile               # Docker command shortcuts
```

## Notes

- Use `npm ci` instead of `npm install` for reproducible builds
- Don't mount `node_modules` - use container's version
- Alpine images are used for smaller size
- All commands proxy through Makefile for simplicity

