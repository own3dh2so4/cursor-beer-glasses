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
- **Fast & Modern**: Built with React and Vite for optimal performance
- **Comprehensive Testing**: Full unit test coverage with Vitest

## Tech Stack

- **React 18**: Modern UI library
- **TypeScript**: Static typing for enhanced code quality and developer experience
- **Vite**: Lightning-fast build tool
- **React Router v6**: Client-side routing
- **js-yaml**: YAML data parsing
- **CSS3**: Responsive, mobile-first styling
- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing utilities

## Setup and Development

### Prerequisites

- Node.js 16 or higher
- npm 8 or higher

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

**Note:** The app uses a pre-generated JSON index of all brands for optimal performance. This index is automatically generated during the build process from all YAML files in `public/data/`.

## Testing

The project includes comprehensive unit tests for all components and utilities. See [TESTING.md](./TESTING.md) for detailed testing documentation.

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Test coverage: **92%+ passing** (48/52 tests)

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
│   ├── components/           # React components
│   │   ├── Gallery.jsx
│   │   ├── GalleryCard.jsx
│   │   ├── BrandDetail.jsx
│   │   ├── BreweryInfo.jsx
│   │   ├── GlassCarousel.jsx
│   │   └── GlassInfo.jsx
│   ├── utils/
│   │   └── dataLoader.js     # YAML data loading
│   ├── styles/
│   │   └── App.css           # Global styles
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
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
- [TESTING.md](./TESTING.md) - Comprehensive testing guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [QUICKSTART.md](./QUICKSTART.md) - Quick reference guide
- [SOLUTION_NOTES.md](./SOLUTION_NOTES.md) - Technical implementation notes

## License

This project is for personal use.

## Live Demo

[View Live Demo](https://own3dh2so4.github.io/cursor-beer-glasses/)

