// Login page functionality

class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.passwordInput = document.getElementById('password');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupForm();
        }
        
        if (this.passwordToggle && this.passwordInput) {
            this.setupPasswordToggle();
        }

        this.setupSocialLogin();
    }

    setupForm() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const isPassword = this.passwordInput.type === 'password';
            const hideIcon = this.passwordToggle.querySelector('.password-icon--hide');
            const showIcon = this.passwordToggle.querySelector('.password-icon--show');
            
            if (isPassword) {
                this.passwordInput.type = 'text';
                hideIcon.style.display = 'none';
                showIcon.style.display = 'block';
            } else {
                this.passwordInput.type = 'password';
                hideIcon.style.display = 'block';
                showIcon.style.display = 'none';
            }
        });
    }

    setupSocialLogin() {
        const googleBtn = document.querySelector('.btn--google');
        const appleBtn = document.querySelector('.btn--apple');

        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleSocialLogin('google');
            });
        }

        if (appleBtn) {
            appleBtn.addEventListener('click', () => {
                this.handleSocialLogin('apple');
            });
        }
    }

    async handleLogin() {
        const formData = new FormData(this.form);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;

        try {
            // Simulate login process
            await this.simulateLogin(email, password, remember);
            
            // Show success and redirect
            this.showMessage('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                // In a real app, redirect to dashboard or previous page
                window.location.href = '/';
            }, 1500);

        } catch (error) {
            this.showMessage('Invalid email or password. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    handleSocialLogin(provider) {
        // In a real application, this would integrate with OAuth providers
        console.log(`Initiating ${provider} login...`);
        
        // Simulate social login
        this.showMessage(`Redirecting to ${provider} login...`, 'info');
        
        // In a real app, redirect to OAuth provider
        setTimeout(() => {
            this.showMessage('Social login would be implemented here.', 'info');
        }, 1000);
    }

    simulateLogin(email, password, remember) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simple simulation - accept any email/password combination
                // In a real app, this would make an API call
                if (email && password) {
                    // Store login state if remember me is checked
                    if (remember) {
                        localStorage.setItem('smartbuilders_remember', 'true');
                    }
                    resolve({ success: true, user: { email } });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1500);
        });
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `login-message login-message--${type}`;
        messageEl.textContent = message;

        // Add styles if not already added
        this.addMessageStyles();

        // Insert message at the top of the form
        const loginHeader = document.querySelector('.login-header');
        loginHeader.parentNode.insertBefore(messageEl, loginHeader.nextSibling);

        // Auto-remove messages after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    addMessageStyles() {
        if (document.getElementById('login-message-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'login-message-styles';
        styles.textContent = `
            .login-message {
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1.5rem;
                font-weight: 500;
                animation: slideIn 0.3s ease-out;
                text-align: center;
            }

            .login-message--success {
                background-color: #D1FAE5;
                color: #065F46;
                border: 1px solid #10B981;
            }

            .login-message--error {
                background-color: #FEE2E2;
                color: #991B1B;
                border: 1px solid #EF4444;
            }

            .login-message--info {
                background-color: #DBEAFE;
                color: #1E40AF;
                border: 1px solid #3B82F6;
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
        `;

        document.head.appendChild(styles);
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.login-section')) {
        new LoginManager();
    }
});