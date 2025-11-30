# Quick Start Guide

Get your Beer Glass Collection SPA up and running in minutes!

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start the development server
npm run dev
```

Visit: `http://localhost:5173/cursor-beer-glasses/`

**Note:** The dev server automatically redirects from `/` to `/cursor-beer-glasses/` to avoid base path warnings.

## Build for Production

```bash
# Create production build
npm run build
```

The build output will be in the `dist/` directory.

## Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Deploy to GitHub Pages

### First Time Setup

1. Create a GitHub repository named `cursor-beer-glasses`
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cursor-beer-glasses.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to repository **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

### Subsequent Deployments

Just push to main:

```bash
git add .
git commit -m "Update collection"
git push origin main
```

Your site will be live at: `https://YOUR_USERNAME.github.io/cursor-beer-glasses/`

## Project Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run deploy` | Manual deploy to GitHub Pages |
| `make dev` | Alternative: Start dev server |
| `make build` | Alternative: Build project |
| `make test` | Alternative: Run tests |

## Adding a New Beer

1. Create directory: `public/data/new_beer_id/`
2. Add files:
   - `brand.yaml` (metadata)
   - `logo200x200.png` (200x200px logo)
   - `name.png` or `name.svg` (brand name image)
   - `beer_name_0.jpg` (glass photo)
3. Generate index: `npm run generate-index`
4. Test locally: `npm run dev`
5. Commit and push

## Troubleshooting

**Port already in use?**
```bash
# Vite will automatically try the next available port
# Or specify a different port:
npm run dev -- --port 3000
```

**Build errors?**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

**Images not loading in dev?**
- Ensure images are in `public/data/` directory
- Check that paths in `brand.yaml` match actual file locations
- Restart dev server

## Need More Help?

- See [README.md](./README.md) for detailed documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- Check the [React documentation](https://react.dev/)
- Check the [Vite documentation](https://vitejs.dev/)

