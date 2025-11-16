# Deployment Guide

This guide explains how to deploy your Beer Glass Collection SPA to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed locally
- Node.js 16+ and npm installed

## Initial Setup

1. **Create a GitHub repository** (if not already done):
   - Go to GitHub and create a new repository named `cursor-beer-glasses`
   - Do NOT initialize with README, .gitignore, or license (we already have these)

2. **Initialize Git and push your code** (if not already done):

```bash
git init
git add .
git commit -m "Initial commit: Beer Glass Collection SPA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cursor-beer-glasses.git
git push -u origin main
```

## GitHub Pages Configuration

### Option 1: Using GitHub Actions (Recommended)

The project already includes a GitHub Actions workflow that will automatically deploy to GitHub Pages when you push to the main branch.

**Steps:**

1. Go to your repository on GitHub
2. Click on **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. That's it! The workflow will run automatically on the next push

The workflow file is located at `.github/workflows/deploy.yml` and will:
- Build your React application
- Deploy to GitHub Pages
- Update automatically on every push to main

### Option 2: Manual Deployment with gh-pages

If you prefer manual deployment:

```bash
# Build and deploy
npm run deploy
```

This will:
1. Build the production version
2. Push the `dist` folder to the `gh-pages` branch
3. Make it available at `https://YOUR_USERNAME.github.io/cursor-beer-glasses/`

**GitHub Settings for Manual Deployment:**
1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select branch **gh-pages** and folder **/ (root)**
4. Click **Save**

## Accessing Your Site

After deployment, your site will be available at:

```
https://YOUR_USERNAME.github.io/cursor-beer-glasses/
```

It may take a few minutes for the site to be live after the first deployment.

## Updating Your Site

### With GitHub Actions (Automatic)

Simply push changes to the main branch:

```bash
git add .
git commit -m "Update beer collection"
git push origin main
```

The site will automatically rebuild and redeploy.

### With Manual Deployment

```bash
git add .
git commit -m "Update beer collection"
git push origin main
npm run deploy
```

## Adding New Beers

To add a new beer to your collection:

1. Create a new directory in `public/data/` with the beer's ID
2. Add the following files:
   - `brand.yaml` (with all the metadata)
   - `logo.png` (any size)
   - `logo200x200.png` (200x200px)
   - `name.png` or `name.svg` (brand name image)
   - Glass photos (e.g., `brand_name_0.jpg`)

3. Generate the brands index:

```bash
npm run generate-index
```

4. Test locally:

```bash
npm run dev
```

5. Commit and push:

```bash
git add public/data/new_beer/ public/brands-index.json
git commit -m "Add new beer: Brand Name"
git push origin main
```

The site will automatically rebuild and update with the new beer.

**Note:** The `npm run build` command automatically runs `generate-index`, so you don't need to run it manually before deployment. However, it's good practice to run it and test locally before pushing.

## Troubleshooting

### Build Fails

**Check Node version:**
```bash
node --version  # Should be 16.0.0 or higher
```

**Clear and reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Site Shows 404 on Refresh

This is normal for SPAs on GitHub Pages. The `.github/workflows/deploy.yml` workflow handles this automatically by using the proper GitHub Pages deployment action.

### Images Not Loading

- Verify the `base` path in `vite.config.js` matches your repository name
- Check that images are in `public/data/` directory
- Clear browser cache

### GitHub Actions Not Running

1. Check **Settings** → **Actions** → **General**
2. Ensure "Allow all actions" is selected
3. Ensure "Read and write permissions" is enabled for workflows

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public` directory with your domain:
```
yourdomain.com
```

2. Configure DNS with your domain provider:
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`

3. In GitHub repository settings, add your custom domain under **Pages** → **Custom domain**

## Local Development

To run locally:

```bash
# Development server
npm run dev

# Production preview
npm run build
npm run preview
```

## Security Notes

- Never commit sensitive data or API keys
- The repository is public by default (GitHub Pages requires public repos for free tier)
- All data in `public/data/` will be publicly accessible

