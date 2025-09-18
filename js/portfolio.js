// Dynamic Portfolio Loading
class DynamicPortfolio {
    constructor() {
        this.photos = [];
        this.categories = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        try {
            await this.loadPortfolioData();
            this.renderGallery();
            this.setupFiltering();
        } catch (error) {
            console.error('Failed to load portfolio:', error);
            this.showFallbackContent();
        }
    }

    // Load portfolio data from JSON
    async loadPortfolioData() {
        const response = await fetch('data/portfolio.json');
        if (!response.ok) {
            throw new Error('Failed to load portfolio data');
        }

        const data = await response.json();
        this.photos = data.photos || [];
        this.categories = data.categories || [];

        console.log('Loaded portfolio data:', {
            photos: this.photos.length,
            categories: this.categories.length
        });
    }

    // Render the gallery
    renderGallery() {
        const galleryContainer = document.querySelector('.gallery');
        if (!galleryContainer) {
            console.error('Gallery container not found');
            return;
        }

        // Clear existing content
        galleryContainer.innerHTML = '';

        // Filter photos based on current filter
        const filteredPhotos = this.currentFilter === 'all'
            ? this.photos
            : this.photos.filter(photo => photo.category === this.currentFilter);

        // Create gallery items
        filteredPhotos.forEach(photo => {
            const galleryItem = this.createGalleryItem(photo);
            galleryContainer.appendChild(galleryItem);
        });

        // Add loading animation
        this.addLoadingAnimation();
    }

    // Create individual gallery item with modern image formats
    createGalleryItem(photo) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-category', photo.category);

        // Use picture element for modern image formats
        const picture = document.createElement('picture');

        // WebP source for modern browsers
        if (photo.url && photo.url.includes('.webp')) {
            const sourceWebP = document.createElement('source');
            sourceWebP.srcset = photo.url;
            sourceWebP.type = 'image/webp';
            picture.appendChild(sourceWebP);
        }

        // Fallback img element
        const img = document.createElement('img');
        img.src = photo.fallbackUrl || photo.url;
        img.alt = photo.altText || photo.originalName;
        img.loading = 'lazy'; // Lazy loading for performance

        // Add error handling for images
        img.onerror = () => {
            console.error('Failed to load image:', photo.url);
            // Try original URL as final fallback
            if (photo.originalUrl && img.src !== photo.originalUrl) {
                img.src = photo.originalUrl;
            } else {
                item.style.display = 'none';
            }
        };

        picture.appendChild(img);
        item.appendChild(picture);
        return item;
    }

    // Setup category filtering
    setupFiltering() {
        const categoryLinks = document.querySelectorAll('.category-link');

        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Update active state
                categoryLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Update current filter
                this.currentFilter = link.getAttribute('data-category');

                // Re-render gallery
                this.renderGallery();
            });
        });
    }

    // Add loading animation to images
    addLoadingAnimation() {
        const images = document.querySelectorAll('.gallery-item img');

        images.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';

                img.onload = () => {
                    img.style.opacity = '1';
                };
            }
        });
    }

    // Show fallback content if JSON loading fails
    showFallbackContent() {
        const galleryContainer = document.querySelector('.gallery');
        if (!galleryContainer) return;

        galleryContainer.innerHTML = `
            <div class="gallery-item" data-category="textures">
                <img src="images/placeholder.jpg" alt="Texture photography example">
            </div>
            <div class="gallery-item" data-category="products">
                <img src="images/placeholder.jpg" alt="Product photography example">
            </div>
            <div class="gallery-item" data-category="street">
                <img src="images/placeholder.jpg" alt="Street photography example">
            </div>
            <div class="gallery-item" data-category="film">
                <img src="images/placeholder.jpg" alt="Film photography example">
            </div>
            <div class="gallery-item" data-category="nature">
                <img src="images/placeholder.jpg" alt="Nature photography example">
            </div>
        `;
    }

    // Public method to refresh gallery (called from admin)
    async refresh() {
        await this.loadPortfolioData();
        this.renderGallery();
    }

    // Add new photo (called from admin interface)
    addPhoto(photoData) {
        this.photos.push({
            id: Date.now().toString(),
            ...photoData,
            uploadDate: new Date().toISOString().split('T')[0]
        });

        this.renderGallery();
    }

    // Remove photo
    removePhoto(photoId) {
        this.photos = this.photos.filter(photo => photo.id !== photoId);
        this.renderGallery();
    }

    // Get current photos data
    getPhotosData() {
        return {
            photos: this.photos,
            categories: this.categories,
            lastUpdated: new Date().toISOString()
        };
    }
}

// Initialize portfolio when page loads
let portfolioManager;
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on portfolio page
    if (document.querySelector('.gallery')) {
        portfolioManager = new DynamicPortfolio();
    }
});