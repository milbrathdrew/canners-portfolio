// GitHub-based Portfolio Admin
class GitHubPortfolioAdmin {
    constructor() {
        this.uploadedImages = [];
        this.githubConfig = {
            owner: '',
            repo: '',
            token: '',
            branch: 'main'
        };

        this.init();
    }

    init() {
        this.loadConfig();
        this.setupEventListeners();
        this.setupDropZone();
        this.loadCurrentPortfolio();
    }

    // Load saved configuration from localStorage
    loadConfig() {
        const saved = localStorage.getItem('githubConfig');
        if (saved) {
            this.githubConfig = JSON.parse(saved);
            document.getElementById('githubOwner').value = this.githubConfig.owner;
            document.getElementById('githubRepo').value = this.githubConfig.repo;
            document.getElementById('githubToken').value = this.githubConfig.token;
            document.getElementById('githubBranch').value = this.githubConfig.branch;
        }
    }

    // Save configuration to localStorage
    saveConfig() {
        const owner = document.getElementById('githubOwner').value.trim();
        const repo = document.getElementById('githubRepo').value.trim();
        const token = document.getElementById('githubToken').value.trim();
        const branch = document.getElementById('githubBranch').value.trim() || 'main';

        if (!owner || !repo || !token) {
            this.showStatus('configStatus', 'Please fill in Owner, Repository, and Personal Access Token', 'error');
            return;
        }

        this.githubConfig = { owner, repo, token, branch };
        localStorage.setItem('githubConfig', JSON.stringify(this.githubConfig));
        this.showStatus('configStatus', 'GitHub configuration saved successfully!', 'success');
    }

    // Load current portfolio to show existing photos
    async loadCurrentPortfolio() {
        if (!this.githubConfig.owner || !this.githubConfig.repo || !this.githubConfig.token) {
            console.log('GitHub not configured yet, skipping portfolio load');
            return;
        }

        try {
            const url = `https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/data/portfolio.json`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const fileData = await response.json();
                const decodedContent = atob(fileData.content);
                const data = JSON.parse(decodedContent);
                this.displayCurrentPhotos(data.photos || []);
            }
        } catch (error) {
            console.log('No existing portfolio found, starting fresh');
        }
    }

    // Display current photos from portfolio
    displayCurrentPhotos(photos) {
        if (photos.length === 0) return;

        const currentSection = document.getElementById('currentPhotos');
        currentSection.style.display = 'block';

        const container = document.getElementById('currentPhotosList');
        container.innerHTML = '';

        photos.forEach((photo, index) => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'current-photo-item';
            photoDiv.innerHTML = `
                <div class="photo-preview">
                    <img src="${photo.url}" alt="${photo.altText}" style="width: 100px; height: 100px; object-fit: cover;">
                </div>
                <div class="photo-details">
                    <div class="photo-name">${photo.originalName}</div>
                    <div class="photo-category">Category: ${photo.category}</div>
                    <div class="photo-alt">Alt: ${photo.altText}</div>
                    <button onclick="githubAdmin.removeExistingPhoto('${photo.id}')" class="remove-btn">Remove</button>
                </div>
            `;
            container.appendChild(photoDiv);
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Configuration
        document.getElementById('saveGithubConfig').addEventListener('click', () => this.saveConfig());

        // File input
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Browse link
        document.querySelector('.browse-link').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        // Actions
        document.getElementById('publishPortfolio').addEventListener('click', () => this.publishToGitHub());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
    }

    // Setup drag and drop
    setupDropZone() {
        const dropZone = document.getElementById('dropZone');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
        });

        dropZone.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e) {
        const files = e.dataTransfer.files;
        this.handleFiles(files);
    }

    // Handle file selection
    async handleFiles(files) {
        if (!this.githubConfig.owner || !this.githubConfig.repo || !this.githubConfig.token) {
            this.showStatus('configStatus', 'Please configure GitHub settings first', 'error');
            return;
        }

        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

        if (validFiles.length === 0) {
            alert('Please select valid image files');
            return;
        }

        this.showProgress(true);

        for (let i = 0; i < validFiles.length; i++) {
            try {
                await this.processImage(validFiles[i]);
                this.updateProgress((i + 1) / validFiles.length * 100);
            } catch (error) {
                console.error('Processing failed:', error);
                alert(`Failed to process ${validFiles[i].name}: ${error.message}`);
            }
        }

        this.showProgress(false);
        this.updateUI();
    }

    // Process individual image
    async processImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imageData = {
                    id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    originalName: file.name,
                    fileName: this.sanitizeFileName(file.name),
                    fileData: e.target.result, // Base64 data
                    size: file.size,
                    type: file.type,
                    category: 'all',
                    altText: '',
                    uploadDate: new Date().toISOString().split('T')[0]
                };

                this.uploadedImages.push(imageData);
                resolve(imageData);
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    // Sanitize filename for GitHub
    sanitizeFileName(fileName) {
        const name = fileName.toLowerCase()
            .replace(/[^a-z0-9.-]/g, '_')
            .replace(/_{2,}/g, '_');

        const timestamp = Date.now();
        const ext = name.split('.').pop();
        const basename = name.replace(`.${ext}`, '');

        return `${basename}_${timestamp}.${ext}`;
    }

    // Show/hide progress
    showProgress(show) {
        const progressDiv = document.getElementById('uploadProgress');
        progressDiv.style.display = show ? 'block' : 'none';

        if (!show) {
            this.updateProgress(0);
        }
    }

    // Update progress bar
    updateProgress(percent) {
        const fill = document.querySelector('.progress-fill');
        const text = document.querySelector('.progress-text');

        fill.style.width = `${percent}%`;
        text.textContent = percent === 100 ? 'Processing complete!' : `Processing... ${Math.round(percent)}%`;
    }

    // Update UI after processing
    updateUI() {
        if (this.uploadedImages.length > 0) {
            document.querySelector('.images-section').style.display = 'block';
            this.renderImagesList();
        }
    }

    // Render uploaded images list
    renderImagesList() {
        const container = document.getElementById('imagesList');
        container.innerHTML = '';

        this.uploadedImages.forEach((image, index) => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'image-item';
            imageDiv.innerHTML = `
                <div class="image-preview">
                    <img src="${image.fileData}" alt="${image.originalName}">
                </div>
                <div class="image-details">
                    <div class="image-name">${image.originalName}</div>
                    <div class="form-group">
                        <label>Category:</label>
                        <select onchange="githubAdmin.updateImageCategory(${index}, this.value)">
                            <option value="all" ${image.category === 'all' ? 'selected' : ''}>All</option>
                            <option value="nature" ${image.category === 'nature' ? 'selected' : ''}>Nature</option>
                            <option value="street" ${image.category === 'street' ? 'selected' : ''}>Street</option>
                            <option value="textures" ${image.category === 'textures' ? 'selected' : ''}>Textures</option>
                            <option value="products" ${image.category === 'products' ? 'selected' : ''}>Products</option>
                            <option value="film" ${image.category === 'film' ? 'selected' : ''}>Film</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Alt Text:</label>
                        <input type="text" value="${image.altText}"
                               onchange="githubAdmin.updateImageAltText(${index}, this.value)"
                               placeholder="Describe this image...">
                    </div>
                    <button onclick="githubAdmin.removeImage(${index})" class="remove-btn">Remove</button>
                </div>
            `;
            container.appendChild(imageDiv);
        });
    }

    // Update image category
    updateImageCategory(index, category) {
        this.uploadedImages[index].category = category;
    }

    // Update image alt text
    updateImageAltText(index, altText) {
        this.uploadedImages[index].altText = altText;
    }

    // Remove image
    removeImage(index) {
        if (confirm('Are you sure you want to remove this image?')) {
            this.uploadedImages.splice(index, 1);
            this.renderImagesList();

            if (this.uploadedImages.length === 0) {
                document.querySelector('.images-section').style.display = 'none';
                document.querySelector('.publish-section').style.display = 'none';
            }
        }
    }

    // Publish to GitHub
    async publishToGitHub() {
        if (this.uploadedImages.length === 0) {
            alert('Please upload some images first');
            return;
        }

        this.showStatus('publishStatus', 'Publishing to GitHub...', 'info');

        try {
            // 1. Upload images to GitHub
            const uploadedPhotos = [];

            for (const image of this.uploadedImages) {
                const imagePath = `images/portfolio/original/${image.fileName}`;
                const imageContent = image.fileData.split(',')[1]; // Remove data:image/jpeg;base64,

                await this.uploadFileToGitHub(imagePath, imageContent, `Add portfolio image: ${image.originalName}`);

                // Create photo data for portfolio.json
                uploadedPhotos.push({
                    id: image.id,
                    url: `images/portfolio/optimized/medium/${image.fileName.replace(/\.[^/.]+$/, '.webp')}`, // Use optimized WebP
                    fallbackUrl: `images/portfolio/optimized/medium/${image.fileName.replace(/\.[^/.]+$/, '.jpg')}`, // JPEG fallback
                    category: image.category,
                    altText: image.altText || image.originalName,
                    uploadDate: image.uploadDate,
                    originalName: image.originalName
                });
            }

            // 2. Update portfolio.json
            await this.updatePortfolioJson(uploadedPhotos);

            // 3. Success!
            this.showPublishSuccess();

        } catch (error) {
            console.error('Publish failed:', error);
            this.showStatus('publishStatus', `Publish failed: ${error.message}`, 'error');
        }
    }

    // Upload file to GitHub
    async uploadFileToGitHub(path, content, message) {
        const url = `https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${path}`;

        // Check if file exists to get SHA for updates
        let sha = null;
        try {
            const checkResponse = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (checkResponse.ok) {
                const fileData = await checkResponse.json();
                sha = fileData.sha;
            }
        } catch (error) {
            // File doesn't exist, that's fine for new files
        }

        // Upload or update file
        const uploadData = {
            message: message,
            content: content,
            branch: this.githubConfig.branch
        };

        // Add SHA if file exists (required for updates)
        if (sha) {
            uploadData.sha = sha;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.githubConfig.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`GitHub API error: ${error.message || response.statusText}`);
        }

        return response.json();
    }

    // Update portfolio.json
    async updatePortfolioJson(newPhotos) {
        // Load existing portfolio from GitHub
        let portfolioData;
        try {
            const url = `https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/data/portfolio.json`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const fileData = await response.json();
                const decodedContent = atob(fileData.content);
                portfolioData = JSON.parse(decodedContent);
            } else {
                throw new Error('Portfolio file not found');
            }
        } catch (error) {
            // Create new structure if doesn't exist
            portfolioData = {
                photos: [],
                categories: [
                    { "id": "all", "name": "All", "active": true },
                    { "id": "nature", "name": "Nature", "active": false },
                    { "id": "street", "name": "Street", "active": false },
                    { "id": "textures", "name": "Textures", "active": false },
                    { "id": "products", "name": "Products", "active": false },
                    { "id": "film", "name": "Film", "active": false }
                ]
            };
        }

        // Add new photos
        portfolioData.photos = portfolioData.photos || [];
        portfolioData.photos.push(...newPhotos);
        portfolioData.lastUpdated = new Date().toISOString();

        // Upload to GitHub - Use Unicode-safe base64 encoding
        const jsonString = JSON.stringify(portfolioData, null, 2);
        const jsonContent = btoa(unescape(encodeURIComponent(jsonString)));
        await this.uploadFileToGitHub('data/portfolio.json', jsonContent, 'Update portfolio with new photos');
    }

    // Show publish success
    showPublishSuccess() {
        document.querySelector('.publish-section').style.display = 'block';
        const container = document.querySelector('.publish-container');

        container.innerHTML = `
            <div class="success-message">
                <h4>✅ Portfolio Published Successfully!</h4>
                <p>Your photos have been uploaded to GitHub and will be automatically optimized and deployed.</p>
                <div class="success-details">
                    <p><strong>What happens next:</strong></p>
                    <ul>
                        <li>GitHub Actions will optimize your images (2-3 minutes)</li>
                        <li>Your website will automatically update</li>
                        <li>Photos will be available in WebP and JPEG formats</li>
                    </ul>
                    <p>Check your <a href="https://github.com/${this.githubConfig.owner}/${this.githubConfig.repo}/actions" target="_blank">GitHub Actions</a> for deployment status.</p>
                </div>
            </div>
        `;

        // Clear uploaded images
        this.uploadedImages = [];
        this.renderImagesList();
        document.querySelector('.images-section').style.display = 'none';
    }

    // Clear all images
    clearAll() {
        if (confirm('Are you sure you want to clear all uploaded images?')) {
            this.uploadedImages = [];
            document.querySelector('.images-section').style.display = 'none';
            document.querySelector('.publish-section').style.display = 'none';
        }
    }

    // Show status message
    showStatus(elementId, message, type = 'info') {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.className = `status-message ${type}`;

        if (type !== 'info') {
            setTimeout(() => {
                element.textContent = '';
                element.className = 'status-message';
            }, 5000);
        }
    }
}

// Initialize admin when page loads
let githubAdmin;
document.addEventListener('DOMContentLoaded', () => {
    githubAdmin = new GitHubPortfolioAdmin();
});