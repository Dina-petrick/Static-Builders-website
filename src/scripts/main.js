// Main JavaScript functionality for Smart Builders website

class SmartBuilders {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupLazyLoading();
    }

    // Navigation functionality
    setupNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('nav__menu--active');
                this.toggleNavIcon(navToggle);
            });

            // Close menu when clicking on links
            const navLinks = navMenu.querySelectorAll('.nav__link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('nav__menu--active');
                    this.resetNavIcon(navToggle);
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('nav__menu--active');
                    this.resetNavIcon(navToggle);
                }
            });
        }
    }

    toggleNavIcon(toggle) {
        const spans = toggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (index === 0) {
                span.style.transform = toggle.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            } else if (index === 1) {
                span.style.opacity = toggle.classList.contains('active') ? '0' : '1';
            } else if (index === 2) {
                span.style.transform = toggle.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
            }
        });
        toggle.classList.toggle('active');
    }

    resetNavIcon(toggle) {
        const spans = toggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (index === 0) {
                span.style.transform = 'none';
            } else if (index === 1) {
                span.style.opacity = '1';
            } else if (index === 2) {
                span.style.transform = 'none';
            }
        });
        toggle.classList.remove('active');
    }

    // Scroll effects
    setupScrollEffects() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Header background opacity
            if (header) {
                if (currentScrollY > 50) {
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = 'none';
                }
            }

            lastScrollY = currentScrollY;
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Animation setup
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.listing-card, .process__step, .testimonial, .value-card, .team-member');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });

        // Stagger animation for grids
        const grids = document.querySelectorAll('.listings-grid, .process__steps, .testimonials__grid, .values-grid, .team-grid');
        grids.forEach(grid => {
            const items = grid.children;
            Array.from(items).forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }

    // Lazy loading setup
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Utility methods
    static formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Form validation utilities
class FormValidator {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    static validateRequired(value) {
        return value.trim().length > 0;
    }

    static showError(element, message) {
        const errorElement = document.getElementById(element.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        element.classList.add('error');
    }

    static hideError(element) {
        const errorElement = document.getElementById(element.id + 'Error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        element.classList.remove('error');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmartBuilders();
});

// Export for use in other modules
window.SmartBuilders = SmartBuilders;
window.FormValidator = FormValidator;