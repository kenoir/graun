# Graun - Digital Media Company Simulation

A digital media company simulation game built with Next.js, converted from the original Cycle.js implementation. Manage journalists, content API, frontend publishing, and ad networks to grow your media empire!

Play here: http://kenoir.github.io/graun/

## Features

- **Dashboard**: Track your daily progress, expenses, and profits
- **Journalists**: Invest in journalism quality and integrity  
- **CAPI (Content API)**: Manage content creation and processing
- **Frontend**: Publish articles and track pageviews
- **AdNet**: Monetize your content through advertising

![Game Screenshot](https://cloud.githubusercontent.com/assets/953792/11246084/0d94cec0-8e0e-11e5-888d-c3b970535c6d.png)

## Getting Started

### Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

This will create a static export in the `out` directory that can be deployed to any static hosting service.

## GitHub Pages Deployment

This app is configured for automatic deployment to GitHub Pages.

### Setup

1. **Enable GitHub Pages in your repository**:
   - Go to your repository's Settings
   - Navigate to "Pages" in the sidebar  
   - Under "Source", select "GitHub Actions"

2. **Update the base path** (if your repository name is not "graun"):
   - Edit `next.config.js`
   - Change the `basePath` and `assetPrefix` values to match your repository name:
     ```javascript
     basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
     assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '',
     ```

3. **Deploy**:
   - Push to the `main` branch
   - The GitHub Action will automatically build and deploy your app
   - Your app will be available at `https://your-username.github.io/your-repo-name/`

## Technology Stack

- **Next.js 14** - React framework with static export capabilities
- **React 18** - UI library  
- **RxJS 7** - Reactive programming for real-time updates
- **TypeScript** - Type safety and better developer experience

## Game Mechanics

The simulation runs in real-time with these core mechanics:

- **Time**: Days advance every 5 seconds
- **Journalists**: Generate ideas based on investment level
- **CAPI**: Processes journalist ideas into articles
- **Frontend**: Randomly publishes CAPI articles with view counts
- **AdNet**: Generates revenue based on published content views
- **Economics**: Balance daily expenses against ad revenue

Written with [Next.js](https://nextjs.org/) and [RxJS](https://rxjs.dev/).
```
