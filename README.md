# Canners Photography Portfolio

A modern, automated photography portfolio with GitHub-based content management.

## ✨ Features

- **Fully Automated Photo Management**: Upload photos through admin interface
- **GitHub Actions Integration**: Automatic image optimization and deployment
- **Modern Image Formats**: WebP with JPEG fallbacks for maximum performance
- **Responsive Design**: Perfect display on all devices
- **Category Filtering**: Organize by Textures, Products, Street, Film, Nature
- **Professional Typography**: Clean, modern fonts
- **Contact Form**: Professional contact page
- **Shop Integration**: E-commerce ready

## 🚀 Admin Interface

Access the admin panel at `/admin.html` to:
- Upload high-resolution photos
- Categorize and tag images
- Add alt text for accessibility
- Automatically publish to live website

## 📁 Structure

```
├── admin.html              # Photo management interface
├── portfolio.html          # Main gallery page
├── contact.html           # Contact form
├── shop.html              # Product showcase
├── data/portfolio.json    # Photo metadata (auto-generated)
├── images/portfolio/      # Photo storage
│   ├── original/          # Raw uploaded images
│   └── optimized/         # Auto-generated optimized versions
├── css/style.css          # Main stylesheet
├── js/
│   ├── github-admin.js    # Admin interface logic
│   ├── portfolio.js       # Dynamic gallery loading
│   └── script.js          # General functionality
└── .github/workflows/     # GitHub Actions automation
```

## 🛠️ Setup

1. **Fork/Clone this repository**
2. **Follow the setup guide**: See `GITHUB_SETUP_GUIDE.md`
3. **Configure admin interface**: Add GitHub credentials
4. **Start uploading photos**: Use `/admin.html`

## ⚡ Performance

- **~97% smaller images**: Automatic optimization
- **Multiple formats**: WebP, JPEG with responsive sizing
- **CDN delivery**: Via GitHub Pages
- **Lazy loading**: Better performance

## 📖 Documentation

See `GITHUB_SETUP_GUIDE.md` for complete setup instructions.

## 🔧 Technology

- Pure HTML/CSS/JavaScript
- GitHub Actions for automation
- Sharp for image optimization
- GitHub Pages for hosting