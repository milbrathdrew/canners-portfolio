// Dynamic Portfolio Loading
class DynamicPortfolio {
    constructor() {
        this.photos = [];
        this.categories = [];
        this.currentFilter = 'all';
        this.currentLightboxIndex = 0;
        this.init();
    }

    async init() {
        try {
            await this.loadPortfolioData();
            this.renderGallery();
            this.setupFiltering();
            this.setupLightbox();
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

        // Add click handler for lightbox
        item.addEventListener('click', () => {
            this.openLightbox(photo);
        });

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

    // Setup lightbox functionality
    setupLightbox() {
        // Create lightbox HTML if it doesn't exist
        if (!document.querySelector('.lightbox')) {
            const lightboxHTML = `
                <div class="lightbox" id="lightbox">
                    <div class="lightbox-content">
                        <img class="lightbox-image" id="lightboxImage" alt="">
                        <button class="lightbox-close" id="lightboxClose">&times;</button>
                        <button class="lightbox-nav lightbox-prev" id="lightboxPrev">&#8249;</button>
                        <button class="lightbox-nav lightbox-next" id="lightboxNext">&#8250;</button>
                        <div class="lightbox-info" id="lightboxInfo"></div>
                        <div class="lightbox-loading" id="lightboxLoading">Loading...</div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        }

        // Setup event listeners
        document.getElementById('lightboxClose').addEventListener('click', () => this.closeLightbox());
        document.getElementById('lightboxPrev').addEventListener('click', () => this.prevImage());
        document.getElementById('lightboxNext').addEventListener('click', () => this.nextImage());

        // Close on background click
        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') {
                this.closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!document.querySelector('.lightbox.active')) return;

            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
    }

    // Open lightbox with specific photo
    openLightbox(photo) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxInfo = document.getElementById('lightboxInfo');
        const lightboxLoading = document.getElementById('lightboxLoading');

        // Get filtered photos for navigation
        const filteredPhotos = this.currentFilter === 'all'
            ? this.photos
            : this.photos.filter(p => p.category === this.currentFilter);

        // Find index in filtered photos
        this.currentLightboxIndex = filteredPhotos.findIndex(p => p.id === photo.id || p.url === photo.url);

        // Show loading
        lightboxLoading.style.display = 'block';
        lightboxImage.style.opacity = '0';

        // Set image source
        lightboxImage.src = photo.url;
        lightboxImage.alt = photo.altText || photo.originalName;

        // Set info
        lightboxInfo.textContent = photo.altText || photo.originalName || 'Photo';

        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Handle image loading
        lightboxImage.onload = () => {
            lightboxLoading.style.display = 'none';
            lightboxImage.style.opacity = '1';
        };

        lightboxImage.onerror = () => {
            lightboxLoading.style.display = 'none';
            lightboxInfo.textContent = 'Failed to load image';
        };

        // Update navigation buttons
        this.updateNavigationButtons(filteredPhotos);
    }

    // Close lightbox
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Reset image
        setTimeout(() => {
            document.getElementById('lightboxImage').src = '';
        }, 300);
    }

    // Navigate to previous image
    prevImage() {
        const filteredPhotos = this.currentFilter === 'all'
            ? this.photos
            : this.photos.filter(p => p.category === this.currentFilter);

        if (filteredPhotos.length <= 1) return;

        this.currentLightboxIndex = (this.currentLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        this.openLightbox(filteredPhotos[this.currentLightboxIndex]);
    }

    // Navigate to next image
    nextImage() {
        const filteredPhotos = this.currentFilter === 'all'
            ? this.photos
            : this.photos.filter(p => p.category === this.currentFilter);

        if (filteredPhotos.length <= 1) return;

        this.currentLightboxIndex = (this.currentLightboxIndex + 1) % filteredPhotos.length;
        this.openLightbox(filteredPhotos[this.currentLightboxIndex]);
    }

    // Update navigation button visibility
    updateNavigationButtons(filteredPhotos) {
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');

        if (filteredPhotos.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
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