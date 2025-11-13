# Cloudflare Cache Purge Setup

This repository includes an automated GitHub Action that purges the Cloudflare cache on every push to the `main` branch.

## Required GitHub Secrets

You need to add two secrets to your GitHub repository for the cache purge workflow to work:

### 1. Get your Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click on your profile icon (top right) → **My Profile**
3. Go to **API Tokens** tab
4. Click **Create Token**
5. Use the **Edit zone DNS** template or create a custom token with these permissions:
   - **Zone** → **Cache Purge** → **Purge**
   - **Zone Resources**: Include → Specific zone → `canners.xyz`
6. Copy the token (you'll only see it once!)

### 2. Get your Cloudflare Zone ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain `canners.xyz`
3. Scroll down in the right sidebar under **API** section
4. Copy the **Zone ID**

### 3. Add Secrets to GitHub

1. Go to your GitHub repository: `https://github.com/milbrathdrew/canners-portfolio`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: (paste your API token from step 1)
4. Click **New repository secret** again and add:
   - Name: `CLOUDFLARE_ZONE_ID`
   - Value: (paste your Zone ID from step 2)

## Testing

Once you've added the secrets, the workflow will automatically run on every push to `main`. You can also trigger it manually:

1. Go to **Actions** tab in GitHub
2. Select **Purge Cloudflare Cache** workflow
3. Click **Run workflow**

## How It Works

- Every push to `main` triggers the cache purge workflow
- The workflow runs in parallel with deployments
- Cache is purged globally for your entire site
- Changes will be visible on `canners.xyz` within 10-30 seconds after deployment

## Note

The cache purge workflow will fail until you add the required secrets. This won't affect your deployments - they will continue to work normally.
