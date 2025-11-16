# Testing Guide

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for unit and integration testing.

## Test Coverage

The application has comprehensive test coverage for:

- ✅ **Utils** (`src/utils/dataLoader.js`) - Data loading and asset path utilities
- ✅ **Components** - All React components (Gallery, GalleryCard, BrandDetail, BreweryInfo, GlassCarousel, GlassInfo)
- ✅ **Scripts** (`scripts/generate-index.js`) - Index generation logic
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
├── components/
│   ├── Gallery.jsx
│   ├── Gallery.test.jsx          ← Component tests
│   ├── GalleryCard.jsx
│   ├── GalleryCard.test.jsx
│   └── ...
├── utils/
│   ├── dataLoader.js
│   └── dataLoader.test.js         ← Utility tests
├── test/
│   ├── setup.js                   ← Test configuration
│   └── mocks/
│       └── mockBrands.js          ← Mock data
└── App.test.jsx

scripts/
└── generate-index.test.js         ← Script tests
```

## Writing Tests

### Component Tests

Example from `GalleryCard.test.jsx`:

```javascript
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import GalleryCard from './GalleryCard'

describe('GalleryCard', () => {
  it('should render brand logo', () => {
    const brand = { name: 'Test Beer', logo: 'test.png' }
    render(
      <BrowserRouter>
        <GalleryCard brand={brand} />
      </BrowserRouter>
    )
    
    expect(screen.getByAltText('Test Beer')).toBeInTheDocument()
  })
})
```

### Utility Tests

Example from `dataLoader.test.js`:

```javascript
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

### Setup File (`src/test/setup.js`)

- Configures React Testing Library
- Sets up global mocks (fetch, import.meta.env)
- Cleanup after each test

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
touch src/components/NewFeature.jsx
touch src/components/NewFeature.test.jsx

# 2. Write tests
# ... edit NewFeature.test.jsx

# 3. Run tests in watch mode
npm run test:watch

# 4. Implement feature
# ... edit NewFeature.jsx

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

