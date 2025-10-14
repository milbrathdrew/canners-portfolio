// Bio page functionality

class BioManager {
    constructor() {
        this.bioText = '';
        this.init();
    }

    async init() {
        await this.loadBio();
        this.renderBio();
    }

    async loadBio() {
        try {
            const response = await fetch('bio.json');
            if (!response.ok) {
                throw new Error('Bio not found');
            }
            const data = await response.json();
            this.bioText = data.bioText || '';
        } catch (error) {
            console.error('Error loading bio:', error);
            this.bioText = '';
        }
    }

    renderBio() {
        const bioTextElement = document.getElementById('bioText');
        if (!bioTextElement) return;

        if (this.bioText) {
            // Convert line breaks to paragraphs
            const paragraphs = this.bioText.split('\n\n').filter(p => p.trim());
            bioTextElement.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
        } else {
            bioTextElement.innerHTML = '<p>Bio coming soon...</p>';
        }
    }

    // Method for admin to update bio
    updateBio(newBioText) {
        this.bioText = newBioText;
        this.renderBio();
    }

    // Method to get current bio data for saving
    getBioData() {
        return {
            bioText: this.bioText,
            lastUpdated: new Date().toISOString()
        };
    }
}

// Initialize bio manager when page loads
let bioManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.bio')) {
        bioManager = new BioManager();
    }
});
