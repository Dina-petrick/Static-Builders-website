// Gallery functionality for property details page

class PropertyGallery {
    constructor() {
        this.currentImageIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        this.loadImages();
        this.setupThumbnails();
        this.setupFullscreen();
        this.setupKeyboardNavigation();
    }

    loadImages() {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.gallery-thumb img');
        
        if (mainImage && thumbnails.length > 0) {
            this.images = Array.from(thumbnails).map(thumb => ({
                src: thumb.src.replace('w=200&h=150', 'w=1200&h=800'),
                alt: thumb.alt,
                thumb: thumb.src
            }));
            
            // Set initial main image
            if (this.images.length > 0) {
                mainImage.src = this.images[0].src;
                mainImage.alt = this.images[0].alt;
            }
        }
    }

    setupThumbnails() {
        const thumbnails = document.querySelectorAll('.gallery-thumb');
        const mainImage = document.getElementById('mainImage');

        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                this.currentImageIndex = index;
                this.updateMainImage();
                this.updateActiveThumbnail(index);
            });
        });
    }

    updateMainImage() {
        const mainImage = document.getElementById('mainImage');
        if (mainImage && this.images[this.currentImageIndex]) {
            // Add fade effect
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = this.images[this.currentImageIndex].src;
                mainImage.alt = this.images[this.currentImageIndex].alt;
                mainImage.style.opacity = '1';
            }, 150);
        }
    }

    updateActiveThumbnail(activeIndex) {
        const thumbnails = document.querySelectorAll('.gallery-thumb');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('gallery-thumb--active', index === activeIndex);
        });
    }

    setupFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const mainImage = document.getElementById('mainImage');

        if (fullscreenBtn && mainImage) {
            fullscreenBtn.addEventListener('click', () => {
                this.openLightbox();
            });

            // Also allow clicking on main image to open lightbox
            mainImage.addEventListener('click', () => {
                this.openLightbox();
            });
        }
    }

    openLightbox() {
        const lightbox = this.createLightbox();
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Animate in
        setTimeout(() => {
            lightbox.classList.add('lightbox--active');
        }, 10);
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox__overlay"></div>
            <div class="lightbox__content">
                <button class="lightbox__close" aria-label="Close lightbox">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <button class="lightbox__prev" aria-label="Previous image">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                </button>
                <button class="lightbox__next" aria-label="Next image">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                </button>
                <img class="lightbox__image" src="${this.images[this.currentImageIndex].src}" alt="${this.images[this.currentImageIndex].alt}">
                <div class="lightbox__counter">${this.currentImageIndex + 1} / ${this.images.length}</div>
            </div>
        `;

        // Add styles
        this.addLightboxStyles();

        // Setup event listeners
        this.setupLightboxEvents(lightbox);

        return lightbox;
    }

    addLightboxStyles() {
        if (document.getElementById('lightbox-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'lightbox-styles';
        styles.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
            }

            .lightbox--active {
                opacity: 1;
                visibility: visible;
            }

            .lightbox__overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.9);
            }

            .lightbox__content {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }

            .lightbox__image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
            }

            .lightbox__close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background-color: rgba(255, 255, 255, 0.1);
                color: white;
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.2s ease;
                z-index: 10001;
            }

            .lightbox__close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .lightbox__prev,
            .lightbox__next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background-color: rgba(255, 255, 255, 0.1);
                color: white;
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.2s ease;
                z-index: 10001;
            }

            .lightbox__prev {
                left: 1rem;
            }

            .lightbox__next {
                right: 1rem;
            }

            .lightbox__prev:hover,
            .lightbox__next:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .lightbox__counter {
                position: absolute;
                bottom: 1rem;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.875rem;
                z-index: 10001;
            }

            @media (max-width: 768px) {
                .lightbox__content {
                    padding: 1rem;
                }

                .lightbox__prev,
                .lightbox__next {
                    width: 40px;
                    height: 40px;
                }

                .lightbox__close {
                    width: 40px;
                    height: 40px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    setupLightboxEvents(lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox__close');
        const prevBtn = lightbox.querySelector('.lightbox__prev');
        const nextBtn = lightbox.querySelector('.lightbox__next');
        const overlay = lightbox.querySelector('.lightbox__overlay');

        // Close lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('lightbox--active');
            setTimeout(() => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
            }, 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', closeLightbox);

        // Navigation
        prevBtn.addEventListener('click', () => {
            this.previousImage();
            this.updateLightboxImage(lightbox);
        });

        nextBtn.addEventListener('click', () => {
            this.nextImage();
            this.updateLightboxImage(lightbox);
        });

        // Keyboard navigation
        const handleKeydown = (e) => {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    this.updateLightboxImage(lightbox);
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    this.updateLightboxImage(lightbox);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeydown);

        // Clean up event listener when lightbox is closed
        lightbox.addEventListener('transitionend', () => {
            if (!lightbox.classList.contains('lightbox--active')) {
                document.removeEventListener('keydown', handleKeydown);
            }
        });
    }

    updateLightboxImage(lightbox) {
        const image = lightbox.querySelector('.lightbox__image');
        const counter = lightbox.querySelector('.lightbox__counter');

        if (image && this.images[this.currentImageIndex]) {
            image.style.opacity = '0';
            setTimeout(() => {
                image.src = this.images[this.currentImageIndex].src;
                image.alt = this.images[this.currentImageIndex].alt;
                image.style.opacity = '1';
            }, 150);
        }

        if (counter) {
            counter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
        }

        // Update main gallery
        this.updateMainImage();
        this.updateActiveThumbnail(this.currentImageIndex);
    }

    previousImage() {
        this.currentImageIndex = this.currentImageIndex > 0 
            ? this.currentImageIndex - 1 
            : this.images.length - 1;
    }

    nextImage() {
        this.currentImageIndex = this.currentImageIndex < this.images.length - 1 
            ? this.currentImageIndex + 1 
            : 0;
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle keyboard navigation when not in lightbox
            if (document.querySelector('.lightbox--active')) return;

            switch (e.key) {
                case 'ArrowLeft':
                    this.previousImage();
                    this.updateMainImage();
                    this.updateActiveThumbnail(this.currentImageIndex);
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    this.updateMainImage();
                    this.updateActiveThumbnail(this.currentImageIndex);
                    break;
            }
        });
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.property-gallery')) {
        new PropertyGallery();
    }
});