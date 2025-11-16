# Solution Notes: Gallery Loading Fix

## Problem

The gallery was showing 0 elements because the data loading approach using `import.meta.glob` wasn't compatible with files in the `public/` directory.

### Root Cause

Vite's `import.meta.glob` is designed to work with source files that are processed during build, not with files in the `public/` directory which are served statically.

## Solution

Implemented a build-time index generation approach:

### 1. Created Index Generator Script

**File:** `scripts/generate-index.js`

- Reads all `brand.yaml` files from `public/data/`
- Parses YAML content
- Generates a single `brands-index.json` file
- Runs automatically before each build

### 2. Updated Data Loader

**File:** `src/utils/dataLoader.js`

**Before:** Used `import.meta.glob` to dynamically import YAML files
**After:** Fetches pre-generated `brands-index.json` using standard fetch API

Benefits:
- Works with static files in `public/` directory
- Faster loading (single JSON request vs. multiple YAML files)
- Simpler caching strategy
- Better browser compatibility

### 3. Updated Build Process

**File:** `package.json`

```json
"build": "npm run generate-index && vite build"
```

The index is now automatically regenerated before every build.

## How It Works

1. **Build Time:**
   - `npm run build` triggers `generate-index` script
   - Script scans `public/data/` for all `brand.yaml` files
   - Parses and combines them into `public/brands-index.json`
   - Vite copies everything from `public/` to `dist/`

2. **Runtime:**
   - App fetches `/brands-index.json` (single HTTP request)
   - JSON is parsed and cached
   - Gallery displays all 62 brands

## Files Modified

1. `src/utils/dataLoader.js` - Changed from import.meta.glob to fetch
2. `package.json` - Added generate-index script and prebuild step
3. `scripts/generate-index.js` - New file for index generation
4. `README.md` - Updated with new workflow
5. `DEPLOYMENT.md` - Updated adding new beers section
6. `QUICKSTART.md` - Updated commands
7. `Makefile` - Added generate-index command

## Adding New Beers (Updated Workflow)

1. Add brand directory to `public/data/`
2. Run `npm run generate-index` (or it runs automatically on build)
3. Test with `npm run dev`
4. Commit and push

## Verification

✅ Build successful: 62 brands indexed
✅ Dev server starts correctly
✅ Data loading works via fetch
✅ No dependencies on js-yaml in production bundle (lighter)

## Performance Impact

**Positive:**
- Single HTTP request instead of 62+ requests
- Smaller bundle (no YAML parser in production)
- Faster initial load
- Better caching

**Trade-off:**
- Need to regenerate index when adding/modifying brands
- Extra build step (automated, minimal impact)

## Future Considerations

If you want to avoid the build step entirely, you could:
1. Move data out of `public/` to `src/data/`
2. Use `import.meta.glob` with eager loading
3. Accept larger initial bundle size

Current approach is optimal for GitHub Pages static deployment.

