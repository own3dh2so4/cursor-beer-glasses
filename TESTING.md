# Testing Guide

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for unit and integration testing.

## Test Coverage

The application has comprehensive test coverage with **173 tests** covering:

- ✅ **Shared Components** - Navbar, ScrollToTop
- ✅ **Gallery Feature** - Gallery, GalleryCard, FilterBar
- ✅ **Brand Detail Feature** - BrandDetail, BreweryInfo, GlassCarousel, GlassInfo
- ✅ **Statistics Feature** - Statistics, WorldMap, TopCountriesList, MapControls, UnmappedCountriesWarning
- ✅ **Shared Hooks** - useBrands, useStatistics, useImageBrightness
- ✅ **Shared Utils** - dataLoader
- ✅ **Statistics Utils** - countryAliases (normalization, flag emojis)
- ✅ **Scripts** (`scripts/generate-index.ts`) - Index generation logic
- ✅ **App** - Main application routing

## Running Tests

### Run all tests once

```bash
npm test
# or
make test
```

### Watch mode (re-run on file changes)

```bash
npm run test:watch
# or
make test-watch
```

### Interactive UI mode

```bash
npm run test:ui
# or
make test-ui
```

### Generate coverage report

```bash
npm run test:coverage
# or
make test-coverage
```

Coverage reports are generated in the `coverage/` directory.

## Test Structure

```
src/
├── features/
│   ├── gallery/
│   │   ├── components/
│   │   │   ├── Gallery.tsx
│   │   │   └── GalleryCard.tsx
│   │   └── __tests__/
│   │       ├── Gallery.test.tsx
│   │       └── GalleryCard.test.tsx
│   ├── brand-detail/
│   │   ├── components/
│   │   └── __tests__/
│   │       ├── BrandDetail.test.tsx
│   │       ├── BreweryInfo.test.tsx
│   │       ├── GlassCarousel.test.tsx
│   │       └── GlassInfo.test.tsx
│   └── statistics/
│       ├── components/
│       │   └── __tests__/
│       │       ├── TopCountriesList.test.tsx
│       │       ├── MapControls.test.tsx
│       │       └── UnmappedCountriesWarning.test.tsx
│       ├── __tests__/
│       │   ├── Statistics.test.tsx
│       │   └── WorldMap.test.tsx
│       └── utils/
│           └── __tests__/
│               ├── countryAliases.test.ts
│               └── countryAliases-flag.test.ts
├── shared/
│   ├── components/
│   │   └── __tests__/
│   │       ├── Navbar.test.tsx
│   │       └── ScrollToTop.test.tsx
│   ├── hooks/
│   │   └── __tests__/
│   │       ├── useStatistics.test.ts
│   │       └── useImageBrightness.test.ts
│   └── utils/
│       └── __tests__/
│           └── dataLoader.test.ts
├── test/
│   ├── setup.ts                   ← Test configuration
│   ├── router-helpers.tsx         ← Router test helpers
│   └── mocks/
│       └── mockBrands.ts          ← Mock data
└── App.test.tsx

scripts/
└── generate-index.test.ts         ← Script tests
```

## Writing Tests

### Component Tests

Example from `GalleryCard.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestBrowserRouter } from '@/test/router-helpers'
import userEvent from '@testing-library/user-event'
import GalleryCard from './GalleryCard'

describe('GalleryCard', () => {
  it('should render brand logo', () => {
    const brand = { name: 'Test Beer', logo: 'test.png' }
    render(
      <TestBrowserRouter>
        <GalleryCard brand={brand} />
      </TestBrowserRouter>
    )
    
    expect(screen.getByAltText('Test Beer')).toBeInTheDocument()
  })
})
```

**Note:** All tests use `TestBrowserRouter` or `TestMemoryRouter` from `@/test/router-helpers` which include React Router v7 future flags to avoid warnings.

### Utility Tests

Example from `dataLoader.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { loadAllBrands } from './dataLoader'

describe('loadAllBrands', () => {
  it('should fetch and return brands', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ name: 'Test' }]
    })
    
    const brands = await loadAllBrands()
    expect(brands).toHaveLength(1)
  })
})
```

### Router Test Helpers

The project includes router test helpers in `src/test/router-helpers.tsx`:

```typescript
import { TestBrowserRouter, TestMemoryRouter } from '@/test/router-helpers'

// Use in tests instead of BrowserRouter/MemoryRouter
render(
  <TestBrowserRouter>
    <YourComponent />
  </TestBrowserRouter>
)
```

These helpers automatically include React Router v7 future flags (`v7_startTransition`, `v7_relativeSplatPath`) to prepare for React Router v7 and eliminate warnings.

## Test Configuration

### Vitest Config (`vitest.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### Setup File (`src/test/setup.ts`)

- Configures React Testing Library
- Sets up global mocks (fetch, import.meta.env)
- Cleanup after each test
- Suppresses benign happy-dom errors

## Mock Data

Mock data is centralized in `src/test/mocks/mockBrands.js`:

- `mockBrand1` - Single glass brand
- `mockBrand2` - Multi-glass brand  
- `mockBrands` - Array of both

Use these mocks in your tests for consistency.

## Best Practices

1. **Test behavior, not implementation**
   - Test what users see and do
   - Avoid testing internal component state

2. **Use semantic queries**
   ```javascript
   // Good
   screen.getByRole('button', { name: 'Submit' })
   screen.getByLabelText('Email')
   
   // Avoid
   container.querySelector('.btn-submit')
   ```

3. **Mock external dependencies**
   - Mock `fetch` for API calls
   - Mock navigation for routing tests
   - Use test doubles for complex dependencies

4. **Keep tests isolated**
   - Each test should be independent
   - Use `beforeEach` for setup
   - Clean up after tests automatically

5. **Test edge cases**
   - Empty states
   - Error conditions
   - Loading states
   - User interactions

## Continuous Integration

Tests run automatically on:
- Pre-commit (optional)
- Pull requests
- Before deployment

Update `.github/workflows/deploy.yml` to include:

```yaml
- name: Run tests
  run: npm test
```

## Troubleshooting

### Tests fail with "Cannot find module"

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Tests timeout

Increase timeout in test files:

```javascript
it('slow test', async () => {
  // test code
}, 10000) // 10 second timeout
```

### Happy-DOM errors

The test environment uses happy-dom for better performance. Some DOM features may not be fully supported. If you encounter issues, consider switching to jsdom in `vitest.config.js`:

```javascript
test: {
  environment: 'jsdom'
}
```

## Coverage Goals

- **Utilities**: 90%+ coverage
- **Components**: 80%+ coverage
- **Overall**: 80%+ coverage

**Current Status**: 173 tests passing across all features

View current coverage:

```bash
npm run test:coverage
```

Then open `coverage/index.html` in your browser.

## Adding Tests for New Features

When adding new features:

1. **Create test file** alongside the component/utility
2. **Write tests first** (TDD approach recommended)
3. **Cover happy path** and edge cases
4. **Run tests** before committing
5. **Check coverage** hasn't decreased

Example workflow:

```bash
# 1. Create component and test file
touch src/features/new-feature/components/NewFeature.tsx
touch src/features/new-feature/components/__tests__/NewFeature.test.tsx

# 2. Write tests
# ... edit NewFeature.test.tsx

# 3. Run tests in watch mode
npm run test:watch

# 4. Implement feature
# ... edit NewFeature.tsx

# 5. Verify all tests pass
npm test

# 6. Check coverage
npm run test:coverage
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

