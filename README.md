# Beer Glass Collection

A modern, responsive single-page application showcasing a collection of beer glasses from around the world.

## Features

- **Responsive Gallery**: Browse through a beautiful grid of beer brand logos
- **Advanced Filtering System**: 6 combinable filters to explore your collection:
  - 🔍 Search by name
  - 📍 Filter by origin country
  - 🍺 Filter by glass count (single/multiple)
  - 🎁 Filter by acquisition method (bought/gift)
  - 🛍️ Filter by purchase location
  - 📊 Sort by name, country, or glass count
- **Interactive Cards**: Hover effects reveal brand names with smooth transitions
- **Adaptive Backgrounds**: Intelligent color detection automatically adjusts backgrounds based on logo brightness for optimal contrast
- **Parallax Effects**: Fixed background images create depth and visual interest
- **Detailed Views**: Click any brand to see detailed information including:
  - Brewery information (location, website)
  - Interactive Google Maps
  - Glass photos with carousel navigation
  - Acquisition details
- **Mobile-First Design**: Optimized for all screen sizes (mobile, tablet, desktop)
- **Progressive Web App (PWA)**: Installable on mobile and desktop devices, works offline
- **Fast & Modern**: Built with React and Vite for optimal performance
- **Comprehensive Testing**: Full unit test coverage with Vitest

## Tech Stack

- **React 19**: Latest version with improved performance and new features
- **TypeScript 5.9**: Static typing for enhanced code quality and developer experience
- **Vite 6**: Lightning-fast build tool with enhanced performance
- **React Router v6**: Client-side routing
- **Tailwind CSS 3**: Utility-first CSS framework for rapid UI development
- **js-yaml**: YAML data parsing
- **TanStack React Query 5**: Data fetching and caching
- **Vitest 2**: Fast unit test framework with improved API
- **React Testing Library 16**: Component testing utilities
- **ESLint 9**: Code linting with TypeScript and React rules
- **tsx**: TypeScript execution for scripts

## Setup and Development

### Prerequisites

- Node.js 22 or higher (recommended: Node 24 LTS)
- npm 10 or higher

### Installation

```bash
# Install dependencies
npm install

# Generate brands index (automatically runs before build)
npm run generate-index

# Run development server
npm run dev

# Build for production (includes index generation)
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

The development server will start at `http://localhost:5173/cursor-beer-glasses/`

**Note:** The app uses a pre-generated JSON index of all brands for optimal performance. This index is automatically generated during the build process from all YAML files in `public/data/` using `tsx`.

**Development Note:** The dev server automatically redirects from `/` to `/cursor-beer-glasses/` to avoid Vite base path warnings.

## Docker Development

You can run the application in Docker without needing to install Node.js locally.

### Docker Prerequisites

- Docker 24.0 or higher
- Docker Compose 2.20 or higher

### Quick Start with Docker

```bash
# Build Docker images
make docker-build

# Start development server (with hot-reload)
make docker-dev
# App runs on http://localhost:5173/cursor-beer-glasses/

# Run tests
make docker-test

# Run tests in watch mode
make docker-test-watch

# Stop containers
make docker-down
```

### Docker Commands

All Docker commands are available via the Makefile:

| Command | Description |
|---------|-------------|
| `make docker-build` | Build Docker images from scratch |
| `make docker-dev` | Start development server with hot-reload |
| `make docker-dev-bg` | Start dev server in background (detached) |
| `make docker-test` | Run all tests once |
| `make docker-test-watch` | Run tests in interactive watch mode |
| `make docker-test-coverage` | Run tests with coverage report |
| `make docker-down` | Stop all running containers |
| `make docker-clean` | Remove containers, volumes, and images |
| `make docker-logs` | View development server logs |
| `make docker-shell` | Open interactive shell in dev container |
| `make docker-rebuild` | Complete rebuild and restart |

### Development Workflow with Docker

1. **Edit files locally** - No need to enter the container
2. **See changes instantly** - Hot-reload works automatically
3. **Run tests** - Isolated environment, consistent results

```bash
# Start development server in background
make docker-dev-bg

# Edit your files in src/
# Changes reflect automatically in the browser

# Run tests when ready
make docker-test

# View logs if needed
make docker-logs

# Stop when done
make docker-down
```

### Benefits of Docker Development

- ✅ **No Node.js installation needed** - Docker provides everything
- ✅ **Consistent environment** - Same Node.js version for all developers
- ✅ **Isolated testing** - Tests run in clean environment
- ✅ **Hot-reload works** - Edit locally, see changes instantly
- ✅ **CI/CD ready** - Same Docker setup for pipelines

## Progressive Web App (PWA)

The application is a fully functional Progressive Web App that can be installed on mobile and desktop devices.

### PWA Features

- 📱 **Installable** - Add to home screen on mobile devices
- 🔌 **Works Offline** - Access your collection without internet connection
- ⚡ **Fast Loading** - Resources cached for instant access
- 🎨 **Native Feel** - Runs in standalone mode without browser UI
- 🔄 **Auto-Updates** - Service worker automatically updates content

### Installing the PWA

**On Mobile (iOS/Android):**
1. Visit the app in your mobile browser
2. Look for "Add to Home Screen" or "Install" prompt
3. Tap "Add" or "Install"
4. Launch from your home screen

**On Desktop (Chrome/Edge):**
1. Visit the app in your browser
2. Look for the install icon (⊕) in the address bar
3. Click "Install"
4. Launch from your apps menu or desktop

**On Desktop (Safari):**
1. Visit the app in Safari
2. Click "Share" → "Add to Dock"
3. Launch from your dock

### Offline Capabilities

Once installed, the PWA caches:
- All app code (HTML, CSS, JavaScript)
- All brand data and images
- Gallery and detail views
- Filters and search functionality

You can browse your entire collection without an internet connection!

### PWA Technical Details

- **Service Worker**: Workbox-based caching strategy
- **Cache Size**: ~20MB (all collection data)
- **Update Strategy**: Auto-update on new deployments
- **Icons**: Optimized 192x192 and 512x512 icons
- **Manifest**: Full Web App Manifest specification

## Testing

The project includes comprehensive unit tests for all components and utilities. See [TESTING.md](./TESTING.md) for detailed testing documentation.

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Linting
npm run lint

# Auto-fix linting errors
npm run lint:fix

# TypeScript type checking
npm run type-check
```

**Note:** ESLint checks code style and basic rules, but **TypeScript type checking** (`npm run type-check`) is what catches missing props, incorrect types, and other type errors.

Test coverage: **173 tests passing** with comprehensive coverage across all features

## Architecture

This project uses a **feature-based architecture** for better scalability and maintainability. Each feature (gallery, brand-detail, statistics) contains its own components, tests, and logic. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

**Styling:** The project uses **Tailwind CSS** with utility classes for rapid development and optimal performance. Custom theme configuration preserves the original design system.

## Project Structure

```
/
├── public/
│   ├── data/                 # Beer brand data
│   │   └── [brand_name]/
│   │       ├── brand.yaml    # Brand metadata
│   │       ├── logo200x200.png # Brand logo
│   │       ├── name.png/svg  # Brand name image
│   │       └── *.jpg         # Glass photos
│   └── .nojekyll             # GitHub Pages configuration
├── src/
│   ├── features/             # Feature-based architecture
│   │   ├── gallery/          # Gallery feature
│   │   │   ├── components/   # Gallery components
│   │   │   ├── __tests__/    # Gallery tests
│   │   │   └── index.ts      # Public exports
│   │   ├── brand-detail/     # Brand detail feature
│   │   │   ├── components/   # Detail components
│   │   │   ├── __tests__/    # Detail tests
│   │   │   └── index.ts      # Public exports
│   │   └── statistics/       # Statistics feature
│   │       ├── components/   # Statistics components
│   │       ├── hooks/        # Statistics hooks
│   │       ├── utils/        # Statistics utilities
│   │       ├── __tests__/    # Statistics tests
│   │       └── index.ts      # Public exports
│   ├── shared/               # Shared code
│   │   ├── components/       # Shared components (Navbar, ScrollToTop)
│   │   ├── hooks/            # Reusable hooks
│   │   ├── utils/            # Utilities
│   │   ├── types/            # TypeScript types
│   │   └── index.ts          # Public exports
│   ├── test/                 # Test configuration
│   │   ├── mocks/            # Mock data
│   │   ├── router-helpers.tsx # Router test helpers
│   │   └── setup.ts          # Vitest setup
│   ├── index.css             # Tailwind CSS entry point
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.cjs        # PostCSS configuration
└── index.html                # HTML template
```

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### GitHub Pages SPA Routing

This app includes a special routing configuration to handle direct URL access (deep linking) on GitHub Pages.

**How it works:**

When you access a URL like `https://own3dh2so4.github.io/cursor-beer-glasses/heineken` directly:

1. GitHub Pages doesn't find that specific file and serves `404.html`
2. The `404.html` script saves the requested URL in `sessionStorage` and redirects to the root
3. The `index.html` loads and restores the original URL using `history.replaceState()`
4. React Router sees the correct URL and renders the appropriate page

**Benefits:**
- ✅ Direct links to brand pages work correctly
- ✅ Browser back/forward buttons work as expected  
- ✅ Bookmarks and shared links function properly
- ✅ Page refreshes maintain the current route

### Automatic Deployment

Push to the `master` branch to trigger automatic deployment via GitHub Actions.

### Manual Build

```bash
# Build for production
npm run build

# Output will be in ./dist directory
```

## Code Quality & Linting

This project uses **ESLint 9** with strict TypeScript rules to maintain code quality.

### Linting Commands

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors where possible
npm run lint:fix
```

### ESLint Configuration

The project uses:
- **@typescript-eslint/eslint-plugin**: TypeScript-specific linting rules
- **eslint-plugin-react-hooks**: Enforces Rules of Hooks
- **eslint-plugin-react-refresh**: Vite HMR compatibility
- **Strict mode enabled**: Catches potential bugs early

Key rules:
- TypeScript strict null checks
- No unused variables (except those prefixed with `_`)
- React Hooks rules enforced
- Console statements limited to `console.warn` and `console.error`

### IDE Integration

Most modern IDEs (VS Code, WebStorm, etc.) will automatically detect the ESLint configuration and show linting errors inline as you code.

## Adding New Beers

To add a new beer to your collection:

1. Create a new directory in `public/data/` with the beer's ID (e.g., `new_beer`)
2. Add the required files:
   - `brand.yaml` - Brand metadata (see format below)
   - `logo.png` - Full-size logo
   - `logo200x200.png` - 200x200px logo for gallery
   - `name.png` or `name.svg` - Brand name image
   - Glass photos (e.g., `new_beer_0.jpg`, `new_beer_1.jpg`)
3. Run `npm run generate-index` to update the brands index
4. Test locally with `npm run dev`
5. Commit and push to deploy

## Data Format

Each brand directory in `public/data/` contains a `brand.yaml` file with the following structure:

```yaml
name: Brand Name
id: brand_id
from_city: City
from_country: Country
website: https://example.com
logo: brand_id/logo200x200.png
name_image: brand_id/name.png
map: https://www.google.com/maps/embed?pb=...
glasses:
  - name: Glass Name
    id: glass_id
    photo: brand_id/photo.jpg
    bought_city: City
    bought_country: Country
    got: buy
    got_from: Store Name
    map: https://www.google.com/maps/embed?pb=...
```

## Documentation

- [README.md](./README.md) - This file, project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Feature-based architecture guide
- [TESTING.md](./TESTING.md) - Comprehensive testing guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [QUICKSTART.md](./QUICKSTART.md) - Quick reference guide

## License

This project is for personal use.

## Live Demo

[View Live Demo](https://own3dh2so4.github.io/cursor-beer-glasses/)

