// Main Application Controller
class CoinoApp {
    constructor() {
        this.managers = {};
        this.init();
    }

    init() {
        // Show loading screen initially
        this.showLoadingScreen();
        
        // Wait for Firebase to initialize and DOM to be ready
        this.waitForInitialization().then(() => {
            this.hideLoadingScreen();
            this.initializeManagers();
        });

        // Setup global event listeners
        this.setupGlobalEventListeners();
        this.handleOfflineStatus();
        this.registerServiceWorker();
    }

    async waitForInitialization() {
        // Wait for Firebase to be ready
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.auth && window.db) {
                    setTimeout(resolve, 1000); // Additional delay for smooth loading
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    initializeManagers() {
        // Managers are already initialized in their respective files
        // This method can be used for additional setup if needed
        console.log('All managers initialized');
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    setupGlobalEventListeners() {
        // Handle modal clicks outside content
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Handle ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
        });

        // Handle browser back button
        window.addEventListener('popstate', (e) => {
            // Close any open modals
            document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                modal.classList.add('hidden');
            });
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('App is hidden');
            } else {
                console.log('App is visible');
                // Refresh user data when app becomes visible
                if (window.gameManager && window.authManager.getCurrentUser()) {
                    window.gameManager.loadUserData();
                }
            }
        });

        // Handle online/offline status
        window.addEventListener('beforeunload', () => {
            // Cleanup when page is about to unload
            this.cleanup();
        });

        // Prevent zoom on double tap (mobile)
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Handle form submissions with Enter key
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;
                
                // Prevent default if we're handling the enter key
                if (activeElement.closest('.auth-form') || 
                    activeElement.closest('.input-group')) {
                    // Let auth manager handle this
                    return;
                }
            }
        });
    }

    handleOfflineStatus() {
        window.addEventListener('online', () => {
            if (window.authManager) {
                window.authManager.showToast('Connection restored', 'success');
            }
            // Refresh data when coming back online
            if (window.gameManager && window.authManager.getCurrentUser()) {
                window.gameManager.loadUserData();
            }
        });

        window.addEventListener('offline', () => {
            if (window.authManager) {
                window.authManager.showToast('Connection lost - some features may not work', 'warning');
            }
        });
    }

    registerServiceWorker() {
        // Service Worker Registration (for PWA capabilities)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    cleanup() {
        // Cleanup managers
        if (window.authManager && typeof window.authManager.destroy === 'function') {
            window.authManager.destroy();
        }
        if (window.gameManager && typeof window.gameManager.destroy === 'function') {
            window.gameManager.destroy();
        }
        if (window.borrowSystemManager && typeof window.borrowSystemManager.destroy === 'function') {
            window.borrowSystemManager.destroy();
        }
    }

    // Utility methods
    static formatCurrency(amount) {
        if (typeof amount !== 'number') return '0';
        return new Intl.NumberFormat('en-US').format(amount);
    }

    static formatDate(timestamp) {
        if (!timestamp) return 'Unknown';
        
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    static getColorName(color) {
        const colorNames = {
            red: 'Red',
            green: 'Green',
            blue: 'Blue',
            yellow: 'Yellow',
            purple: 'Purple',
            orange: 'Orange'
        };
        return colorNames[color] || color;
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
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

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    static copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return Promise.resolve();
            } catch (err) {
                document.body.removeChild(textArea);
                return Promise.reject(err);
            }
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.coinoApp = new CoinoApp();
});

// Add global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    if (window.authManager) {
        window.authManager.showToast('An error occurred. Please refresh the page.', 'error');
    }
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    if (window.authManager) {
        window.authManager.showToast('An error occurred. Please try again.', 'error');
    }
    e.preventDefault(); // Prevent the default browser behavior
});

// Export utility functions for global use
window.CoinoUtils = {
    formatCurrency: CoinoApp.formatCurrency,
    formatDate: CoinoApp.formatDate,
    getColorName: CoinoApp.getColorName,
    validateEmail: CoinoApp.validateEmail,
    sanitizeInput: CoinoApp.sanitizeInput,
    debounce: CoinoApp.debounce,
    throttle: CoinoApp.throttle,
    generateId: CoinoApp.generateId,
    isValidUrl: CoinoApp.isValidUrl,
    copyToClipboard: CoinoApp.copyToClipboard
};

// Add some global CSS classes for animations
const style = document.createElement('style');
style.textContent = `
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .pulse {
        animation: pulse 1s ease-in-out infinite;
    }
    
    .loading {
        position: relative;
        overflow: hidden;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% { left: -100%; }
        100% { left: 100%; }
    }
`;
document.head.appendChild(style);