# Photography Portfolio Website

A clean, minimal photography portfolio website with responsive design.

## Structure

```
canners-portfolio/
├── index.html          # Home page
├── portfolio.html      # Portfolio gallery with category filtering
├── shop.html          # E-commerce product listing
├── contact.html       # Contact form
├── css/
│   └── style.css      # All styling and responsive design
├── js/
│   └── script.js      # Form validation and portfolio filtering
├── images/
│   └── placeholder.jpg # Placeholder image for gallery/products
└── README.md          # This file
```

## Features

### Navigation
- Responsive header with logo and navigation menu
- Logo links back to home page from any page
- Active page highlighting in navigation

### Portfolio Page
- Category filtering: All, Textures, Products, Street, Film, Nature
- Responsive grid layout
- Hover effects on images

### Shop Page
- Product grid layout
- Basic "Add to Cart" functionality (demo)
- Responsive design

### Contact Page
- Functional contact form with validation
- Required fields: Name, Email, Message
- Loading states and success/error messages
- Form validation with error display

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 480px
- Optimized layouts for all screen sizes

## Setup

1. Open `index.html` in a web browser to view the site
2. For development, serve the files using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if http-server is installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Visit `http://localhost:8000` in your browser

## Customization

### Images
- Replace `images/placeholder.jpg` with actual photography
- Add more images to the gallery by updating `portfolio.html`
- Update product images in `shop.html`

### Content
- Update photographer name in the logo (currently "PHOTOGRAPHER")
- Modify gallery categories as needed
- Add actual products to the shop page
- Customize contact information

### Form Submission
The contact form currently shows a demo success message. To make it functional:

1. Update the form action in `contact.html`
2. Implement server-side form handling
3. Update the JavaScript in `script.js` to use your form endpoint

### Styling
- Colors, fonts, and spacing can be modified in `css/style.css`
- The design follows a minimal aesthetic with neutral colors
- Easy to customize for different photography styles

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with some limitations)
- Mobile browsers (iOS Safari, Chrome Mobile)