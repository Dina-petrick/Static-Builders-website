// Contact form functionality

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.newsletterForm = document.getElementById('newsletterForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupContactForm();
        }
        
        if (this.newsletterForm) {
            this.setupNewsletterForm();
        }
    }

    setupContactForm() {
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit();
        });

        // Set minimum date for visit date to today
        const visitDateInput = document.getElementById('visitDate');
        if (visitDateInput) {
            const today = new Date().toISOString().split('T')[0];
            visitDateInput.min = today;
        }
    }

    setupNewsletterForm() {
        this.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSubmit();
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        FormValidator.hideError(field);

        switch (field.type) {
            case 'email':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!FormValidator.validateEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'tel':
                if (value && !FormValidator.validatePhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;

            case 'text':
                if (field.hasAttribute('required') && !FormValidator.validateRequired(value)) {
                    isValid = false;
                    errorMessage = `${this.getFieldLabel(field)} is required`;
                }
                break;

            case 'select-one':
                if (field.hasAttribute('required') && !value) {
                    isValid = false;
                    errorMessage = 'Please make a selection';
                }
                break;

            case 'textarea':
                if (field.hasAttribute('required') && !FormValidator.validateRequired(value)) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value && value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;

            case 'date':
                if (value) {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        isValid = false;
                        errorMessage = 'Please select a future date';
                    }
                }
                break;
        }

        if (!isValid) {
            FormValidator.showError(field, errorMessage);
        }

        return isValid;
    }

    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : 'Field';
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleContactSubmit() {
        if (!this.validateForm()) {
            this.showMessage('Please correct the errors above.', 'error');
            return;
        }

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Show success message
            this.showMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            this.form.reset();
            
            // Clear any error states
            const errorInputs = this.form.querySelectorAll('.error');
            errorInputs.forEach(input => FormValidator.hideError(input));

        } catch (error) {
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleNewsletterSubmit() {
        const emailInput = this.newsletterForm.querySelector('input[type="email"]');
        const submitBtn = this.newsletterForm.querySelector('button[type="submit"]');
        
        if (!FormValidator.validateEmail(emailInput.value.trim())) {
            this.showNewsletterMessage('Please enter a valid email address.', 'error');
            return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            this.showNewsletterMessage('Successfully subscribed to our newsletter!', 'success');
            this.newsletterForm.reset();

        } catch (error) {
            this.showNewsletterMessage('Sorry, there was an error. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;

        // Add styles if not already added
        this.addMessageStyles();

        // Insert message at the top of the form
        this.form.insertBefore(messageEl, this.form.firstChild);

        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 5000);
        }

        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showNewsletterMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.newsletter-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `newsletter-message newsletter-message--${type}`;
        messageEl.textContent = message;

        // Insert after newsletter form
        this.newsletterForm.parentNode.insertBefore(messageEl, this.newsletterForm.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    addMessageStyles() {
        if (document.getElementById('message-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'message-styles';
        styles.textContent = `
            .form-message,
            .newsletter-message {
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1.5rem;
                font-weight: 500;
                animation: slideIn 0.3s ease-out;
            }

            .form-message--success,
            .newsletter-message--success {
                background-color: #D1FAE5;
                color: #065F46;
                border: 1px solid #10B981;
            }

            .form-message--error,
            .newsletter-message--error {
                background-color: #FEE2E2;
                color: #991B1B;
                border: 1px solid #EF4444;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .form-input.error,
            .form-select.error,
            .form-textarea.error {
                border-color: #EF4444;
                background-color: #FEF2F2;
            }

            .form-error {
                color: #EF4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            }
        `;

        document.head.appendChild(styles);
    }

    simulateApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.contact-section')) {
        new ContactForm();
    }
});