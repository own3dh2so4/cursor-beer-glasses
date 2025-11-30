# Project Architecture

## 📁 Feature-Based Structure

This project uses a feature-based architecture to improve scalability and maintainability.

## 🎯 Folder Structure

```
src/
├── features/                    # Main application features
│   ├── gallery/                # Feature: Brand gallery
│   │   ├── components/         # Gallery-specific components
│   │   │   ├── Gallery.tsx    # Main gallery page
│   │   │   ├── GalleryCard.tsx # Individual brand card
│   │   │   └── FilterBar.tsx  # Filter bar
│   │   ├── __tests__/         # Gallery tests
│   │   │   ├── Gallery.test.tsx
│   │   │   └── GalleryCard.test.tsx
│   │   └── index.ts           # Public exports
│   │
│   ├── brand-detail/          # Feature: Brand detail
│   │   ├── components/        # Detail-specific components
│   │   │   ├── BrandDetail.tsx    # Detail page
│   │   │   ├── BreweryInfo.tsx    # Brewery info
│   │   │   ├── GlassCarousel.tsx  # Glass carousel
│   │   │   └── GlassInfo.tsx      # Glass info
│   │   ├── __tests__/         # Detail tests
│   │   │   ├── BrandDetail.test.tsx
│   │   │   ├── BreweryInfo.test.tsx
│   │   │   ├── GlassCarousel.test.tsx
│   │   │   └── GlassInfo.test.tsx
│   │   └── index.ts           # Public exports
│   │
│   └── statistics/            # Feature: Statistics & Analytics
│       ├── components/        # Statistics-specific components
│       │   ├── Statistics.tsx            # Main statistics page
│       │   ├── WorldMap.tsx              # Interactive world map
│       │   ├── TopCountriesList.tsx      # Top countries list with flags
│       │   ├── ViewModeToggle.tsx       # View mode switcher
│       │   ├── StatsCard.tsx            # Statistics card
│       │   ├── MapControls.tsx         # Map zoom/pan controls
│       │   └── UnmappedCountriesWarning.tsx # Warning for unmapped countries
│       ├── hooks/             # Statistics-specific hooks
│       │   ├── useWorldMap.ts          # World map data and rendering
│       │   └── useMapInteractions.ts   # Map interaction handlers
│       ├── utils/             # Statistics utilities
│       │   └── countryAliases.ts       # Country name normalization and flag emojis
│       ├── __tests__/         # Statistics tests
│       │   ├── Statistics.test.tsx
│       │   ├── WorldMap.test.tsx
│       │   └── components/
│       │       ├── TopCountriesList.test.tsx
│       │       ├── MapControls.test.tsx
│       │       └── UnmappedCountriesWarning.test.tsx
│       └── index.ts           # Public exports
│
├── shared/                    # Shared code between features
│   ├── components/           # Shared UI components
│   │   ├── Navbar.tsx       # Navigation bar with scroll effects
│   │   ├── ScrollToTop.tsx  # Scroll to top on route change
│   │   └── __tests__/
│   │       ├── Navbar.test.tsx
│   │       └── ScrollToTop.test.tsx
│   ├── hooks/                # Reusable hooks
│   │   ├── useBrands.ts
│   │   ├── useBrand.ts
│   │   ├── useStatistics.ts
│   │   ├── useImageBrightness.ts
│   │   └── __tests__/
│   │       ├── useStatistics.test.ts
│   │       └── useImageBrightness.test.ts
│   ├── utils/               # Shared utilities
│   │   └── dataLoader.ts
│   ├── types/               # Shared TypeScript types
│   │   └── index.ts
│   └── index.ts            # Public exports from shared
│
├── test/                   # Test configuration
│   ├── mocks/             # Mock data for tests
│   │   └── mockBrands.ts
│   ├── router-helpers.tsx # Router test helpers with future flags
│   └── setup.ts          # Vitest setup
│
├── index.css           # Tailwind CSS entry point
├── App.tsx              # Main app component
├── App.test.tsx         # App tests
├── main.tsx            # Entry point
└── vite-env.d.ts      # Vite types
```

## 🎨 Architecture Principles

### 1. **Co-location**
Related files are kept together. Each feature has its components and tests in the same folder.

### 2. **Separation of Concerns**
- **Features**: View-specific logic
- **Shared**: Reusable code between features
- **Test**: Shared test configuration and mocks

### 3. **Barrel Exports**
Each feature exports its public components through `index.ts`:

```typescript
// src/features/gallery/index.ts
export { default as Gallery } from './components/Gallery'
export { default as GalleryCard } from './components/GalleryCard'
export { default as FilterBar } from './components/FilterBar'
```

### 4. **Clean Imports**
```typescript
// ✅ Good - Import from barrel export
import { Gallery, GalleryCard } from './features/gallery'

// ❌ Avoid - Direct import from component
import Gallery from './features/gallery/components/Gallery'
```

## 📦 Current Features

### Gallery Feature
**Responsibility**: Display beer brand gallery with filters

**Components**:
- `Gallery`: Main component that manages state and filtering
- `GalleryCard`: Individual brand card
- `FilterBar`: Advanced filter bar

**Dependencies**:
- `shared/utils/dataLoader`: For data loading
- `shared/types`: For TypeScript types

### Brand Detail Feature
**Responsibility**: Display full brand details

**Components**:
- `BrandDetail`: Main detail page component
- `BreweryInfo`: Brewery information
- `GlassCarousel`: Glass photo carousel
- `GlassInfo`: Detailed glass information

**Dependencies**:
- `shared/utils/dataLoader`: For data loading
- `shared/hooks/useImageBrightness`: For brightness analysis
- `shared/types`: For TypeScript types

### Statistics Feature
**Responsibility**: Display collection statistics and analytics

**Components**:
- `Statistics`: Main statistics page component
- `WorldMap`: Interactive world map using d3-geo
- `TopCountriesList`: Top countries list with flag emojis and rankings
- `ViewModeToggle`: Toggle between purchase and origin views
- `StatsCard`: Reusable statistics card
- `MapControls`: Zoom and pan controls for the map
- `UnmappedCountriesWarning`: Warning for countries not found in map data

**Hooks**:
- `useWorldMap`: Handles world map data loading and rendering
- `useMapInteractions`: Manages map interactions (hover, click, tooltip)

**Utils**:
- `countryAliases`: Country name normalization, ISO code mapping, and flag emoji generation

**Dependencies**:
- `shared/hooks/useBrands`: For data loading (TanStack Query)
- `shared/hooks/useStatistics`: For statistics calculations
- `shared/types`: For TypeScript types
- `d3-geo`: For map projections
- `topojson-client`: For TopoJSON processing

## 🔧 Shared Module

### Components
- `Navbar`: Fixed navigation bar with scroll-based collapse and active route highlighting
- `ScrollToTop`: Automatically scrolls to top on route changes

### Hooks
- `useBrands`: Fetches all brands using TanStack Query
- `useBrand`: Fetches a single brand by ID using TanStack Query
- `useStatistics`: Calculates collection statistics from brand data
- `useImageBrightness`: Analyzes image brightness to adjust colors

### Utils
- `dataLoader`: Functions to load and cache brand data from JSON index

### Types
All shared TypeScript types:
- `Brand`: Beer brand type
- `Glass`: Glass type
- `Filters`: Filters type
- `FilterOptions`: Available filter options
- `BrightnessResult`: Brightness analysis result
- `Statistics`: Statistics data type
- `CountryStatistic`: Country with count
- `StatisticsViewMode`: 'purchase' | 'origin'

## 🚀 Adding New Features

To add a new feature (e.g., `statistics`):

```bash
# 1. Create folder structure
mkdir -p src/features/statistics/components
mkdir -p src/features/statistics/__tests__

# 2. Create components
touch src/features/statistics/components/Statistics.tsx

# 3. Create barrel export
touch src/features/statistics/index.ts
```

```typescript
// src/features/statistics/index.ts
export { default as Statistics } from './components/Statistics'
```

```typescript
// src/App.tsx
import { Statistics } from './features/statistics'

// Add route
<Route path="/stats" element={<Statistics />} />
```

## 📊 Advantages of This Structure

1. **Scalability**: Easy to add new features without touching existing code
2. **Maintainability**: Related code is kept together
3. **Testability**: Tests are close to their components
4. **Clarity**: Clear and predictable structure
5. **Independence**: Features are self-contained
6. **Reusability**: Shared code in `shared/`

## 🎯 Conventions

### Naming
- Components: PascalCase (`Gallery.tsx`)
- Tests: `*.test.tsx` in `__tests__/` folder
- Hooks: camelCase with `use` prefix (`useImageBrightness.ts`)
- Utils: camelCase (`dataLoader.ts`)
- Types: PascalCase (`Brand`, `Glass`)

### Imports
```typescript
// Preferred
import { Gallery } from './features/gallery'
import { loadAllBrands } from './shared/utils/dataLoader'
import type { Brand } from './shared/types'

// Or use the shared barrel
import { loadAllBrands, useImageBrightness } from './shared'
import type { Brand, Glass } from './shared'
```

### File Organization
- One component per file
- Tests in `__tests__/` folder at the same level
- Index files only for re-exports
- Styles using Tailwind CSS utility classes inline

## 🔍 Testing

All tests follow the same structure:
```
feature/
  __tests__/
    Component.test.tsx  # Component test
```

Run tests:
```bash
npm test                # All tests
npm run test:watch     # Watch mode
npm run test:ui        # Interactive UI
npm run test:coverage  # With coverage
```

## 📚 References

- [React Folder Structure](https://react.dev/learn/thinking-in-react)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
