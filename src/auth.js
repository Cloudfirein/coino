// Enhanced Authentication Manager with AI Integration
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.unsubscribeAuth = null;
        this.loginAttempts = new Map();
        this.maxLoginAttempts = 5;
        this.lockoutDuration = 300000; // 5 minutes
        this.init();
    }

    init() {
        // Listen for auth state changes
        this.unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                await this.handleUserLogin(user);
            } else {
                this.currentUser = null;
                this.showAuthScreen();
            }
        });

        this.setupAuthEventListeners();
        this.initializeSecurityFeatures();
    }

    setupAuthEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Login form
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLogin());
        }

        // Register form
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.handleRegister());
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Enter key handling
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;
                
                if (activeElement.closest('#login-form')) {
                    this.handleLogin();
                } else if (activeElement.closest('#register-form')) {
                    this.handleRegister();
                }
            }
        });
    }

    initializeSecurityFeatures() {
        // Monitor for suspicious activity
        this.startSecurityMonitoring();
        
        // Clear old login attempts
        setInterval(() => {
            this.cleanupOldLoginAttempts();
        }, 60000); // Every minute
    }

    startSecurityMonitoring() {
        // Monitor for rapid login attempts
        setInterval(() => {
            this.analyzeLoginPatterns();
        }, 30000); // Every 30 seconds
    }

    analyzeLoginPatterns() {
        const now = Date.now();
        const suspiciousIPs = new Set();
        
        this.loginAttempts.forEach((attempts, ip) => {
            const recentAttempts = attempts.filter(attempt => 
                now - attempt.timestamp < 300000 // Last 5 minutes
            );
            
            if (recentAttempts.length > 10) {
                suspiciousIPs.add(ip);
                
                // Report to AI system
                if (window.aiSystem) {
                    window.aiSystem.handleCriticalError('SUSPICIOUS_LOGIN_ACTIVITY', {
                        ip,
                        attempts: recentAttempts.length,
                        timeWindow: '5 minutes'
                    });
                }
            }
        });
        
        // Log suspicious activity
        if (suspiciousIPs.size > 0) {
            console.warn('Suspicious login activity detected from IPs:', Array.from(suspiciousIPs));
        }
    }

    cleanupOldLoginAttempts() {
        const cutoffTime = Date.now() - this.lockoutDuration;
        
        this.loginAttempts.forEach((attempts, ip) => {
            const recentAttempts = attempts.filter(attempt => 
                attempt.timestamp > cutoffTime
            );
            
            if (recentAttempts.length === 0) {
                this.loginAttempts.delete(ip);
            } else {
                this.loginAttempts.set(ip, recentAttempts);
            }
        });
    }

    recordLoginAttempt(ip, success, email = null) {
        if (!this.loginAttempts.has(ip)) {
            this.loginAttempts.set(ip, []);
        }
        
        this.loginAttempts.get(ip).push({
            timestamp: Date.now(),
            success,
            email,
            userAgent: navigator.userAgent
        });
        
        // Sync with AI system for learning
        if (window.dataSyncManager) {
            window.dataSyncManager.addToSyncQueue({
                type: 'security_event',
                data: {
                    type: 'login_attempt',
                    ip,
                    success,
                    email,
                    timestamp: Date.now()
                },
                priority: 'medium'
            });
        }
    }

    isIPLocked(ip) {
        if (!this.loginAttempts.has(ip)) return false;
        
        const attempts = this.loginAttempts.get(ip);
        const recentFailedAttempts = attempts.filter(attempt => 
            !attempt.success && 
            Date.now() - attempt.timestamp < this.lockoutDuration
        );
        
        return recentFailedAttempts.length >= this.maxLoginAttempts;
    }

    getUserIP() {
        // In a real application, you would get the actual IP
        // For demo purposes, we'll use a placeholder
        return 'demo-ip-' + Math.random().toString(36).substr(2, 9);
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.add('hidden'));
        
        const tabBtn = document.querySelector(`[data-tab="${tab}"]`);
        const tabForm = document.getElementById(`${tab}-form`);
        
        if (tabBtn) tabBtn.classList.add('active');
        if (tabForm) tabForm.classList.remove('hidden');
    }

    async handleLogin() {
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        
        if (!emailInput || !passwordInput) return;
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const userIP = this.getUserIP();

        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        // Check if IP is locked
        if (this.isIPLocked(userIP)) {
            this.showToast('Too many failed attempts. Please try again later.', 'error');
            this.recordLoginAttempt(userIP, false, email);
            return;
        }

        try {
            this.showLoading(true);
            
            // Enhanced security check
            await this.performSecurityCheck(email, userIP);
            
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            
            // Record successful login
            this.recordLoginAttempt(userIP, true, email);
            
            // Log successful login for AI analysis
            if (window.aiSystem) {
                window.aiSystem.performanceMetrics.userBehaviorPatterns.set(userCredential.user.uid, {
                    lastLogin: Date.now(),
                    loginIP: userIP,
                    loginSuccess: true
                });
            }
            
            this.showToast('Login successful!', 'success');
            
        } catch (error) {
            // Record failed login
            this.recordLoginAttempt(userIP, false, email);
            
            // Enhanced error handling with AI integration
            this.handleAuthError(error, 'login', { email, ip: userIP });
            
            this.showToast(this.getErrorMessage(error), 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleRegister() {
        const nameInput = document.getElementById('register-name');
        const usernameInput = document.getElementById('register-username');
        const emailInput = document.getElementById('register-email');
        const passwordInput = document.getElementById('register-password');
        
        if (!nameInput || !usernameInput || !emailInput || !passwordInput) return;
        
        const name = nameInput.value.trim();
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const userIP = this.getUserIP();

        // Enhanced validation
        const validationResult = this.validateRegistrationData(name, username, email, password);
        if (!validationResult.valid) {
            this.showToast(validationResult.message, 'error');
            return;
        }

        try {
            this.showLoading(true);
            
            // Check if username is already taken
            const usernameCheck = await db.collection('users')
                .where('username', '==', username.toLowerCase())
                .get();
                
            if (!usernameCheck.empty) {
                this.showToast('Username is already taken', 'error');
                return;
            }

            // Enhanced security check for registration
            await this.performRegistrationSecurityCheck(email, username, userIP);

            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Update user profile
            await user.updateProfile({
                displayName: name
            });

            // Create enhanced user document
            await this.createUserDocument(user, name, username, userIP);
            
            // Record successful registration
            this.recordLoginAttempt(userIP, true, email);
            
            this.showToast('Registration successful! You received 10 coins!', 'success');
            
        } catch (error) {
            // Record failed registration
            this.recordLoginAttempt(userIP, false, email);
            
            this.handleAuthError(error, 'register', { email, username, ip: userIP });
            this.showToast(this.getErrorMessage(error), 'error');
        } finally {
            this.showLoading(false);
        }
    }

    validateRegistrationData(name, username, email, password) {
        if (!name || !username || !email || !password) {
            return { valid: false, message: 'Please fill in all fields' };
        }

        if (!this.validateEmail(email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }

        if (password.length < 6) {
            return { valid: false, message: 'Password must be at least 6 characters' };
        }

        if (username.length < 3) {
            return { valid: false, message: 'Username must be at least 3 characters' };
        }

        if (username.length > 20) {
            return { valid: false, message: 'Username must be less than 20 characters' };
        }

        // Check for valid username characters
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
        }

        // Check for strong password
        if (!this.isStrongPassword(password)) {
            return { valid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
        }

        return { valid: true };
    }

    isStrongPassword(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= 8 && hasUpperCase && hasLowerCase && (hasNumbers || hasSpecialChar);
    }

    async performSecurityCheck(email, ip) {
        // Check for suspicious patterns
        const suspiciousPatterns = [
            /test@test\.com/i,
            /admin@admin\.com/i,
            /fake@fake\.com/i
        ];

        if (suspiciousPatterns.some(pattern => pattern.test(email))) {
            throw new Error('Suspicious email pattern detected');
        }

        // Additional security checks can be added here
        return true;
    }

    async performRegistrationSecurityCheck(email, username, ip) {
        // Check for disposable email domains
        const disposableDomains = [
            '10minutemail.com',
            'tempmail.org',
            'guerrillamail.com'
        ];

        const emailDomain = email.split('@')[1];
        if (disposableDomains.includes(emailDomain)) {
            throw new Error('Disposable email addresses are not allowed');
        }

        // Check for suspicious usernames
        const suspiciousUsernames = [
            'admin', 'administrator', 'root', 'test', 'demo'
        ];

        if (suspiciousUsernames.includes(username.toLowerCase())) {
            throw new Error('Username not allowed');
        }

        return true;
    }

    async createUserDocument(user, name, username, ip) {
        const isAdmin = user.email === 'admin@coino.com';
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: name,
            username: username.toLowerCase(),
            coins: isAdmin ? 999999 : 10,
            isAdmin: isAdmin,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            totalBets: 0,
            totalWins: 0,
            totalLosses: 0,
            winRate: 0,
            avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            lastActive: firebase.firestore.FieldValue.serverTimestamp(),
            registrationIP: ip,
            securityLevel: 'standard',
            accountStatus: 'active',
            preferences: {
                notifications: true,
                emailUpdates: false,
                theme: 'dark'
            },
            statistics: {
                longestWinStreak: 0,
                longestLossStreak: 0,
                totalTimeSpent: 0,
                favoriteColor: null,
                avgBetAmount: 0
            }
        };

        // Create user document in primary database
        await db.collection('users').doc(user.uid).set(userData);
        
        // Sync to realtime database for quick access
        if (window.dataSyncManager) {
            await window.dataSyncManager.syncUserData(user.uid, userData);
        }

        // Log user creation for AI analysis
        if (window.aiSystem) {
            window.aiSystem.performanceMetrics.userBehaviorPatterns.set(user.uid, {
                registrationDate: Date.now(),
                registrationIP: ip,
                initialCoins: userData.coins
            });
        }
    }

    async handleUserLogin(user) {
        try {
            // Get or create user document
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (!userDoc.exists) {
                // Create user document if it doesn't exist (for existing users)
                await this.createUserDocument(
                    user, 
                    user.displayName || 'User', 
                    user.email.split('@')[0],
                    this.getUserIP()
                );
            } else {
                // Update last active and login analytics
                const updateData = {
                    lastActive: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLoginIP: this.getUserIP(),
                    loginCount: firebase.firestore.FieldValue.increment(1)
                };

                await db.collection('users').doc(user.uid).update(updateData);
                
                // Sync to realtime database
                if (window.dataSyncManager) {
                    await window.dataSyncManager.syncUserData(user.uid, updateData);
                }
            }

            this.showGameScreen();
            
            // Initialize other managers with enhanced error handling
            try {
                if (window.gameManager) {
                    await window.gameManager.loadUserData();
                }
                if (window.profileManager) {
                    window.profileManager.init();
                }
                if (window.leaderboardManager) {
                    window.leaderboardManager.init();
                }
                if (window.borrowSystemManager) {
                    window.borrowSystemManager.init();
                }
                if (window.privateRoomsManager) {
                    window.privateRoomsManager.init();
                }
            } catch (managerError) {
                console.error('Error initializing managers:', managerError);
                
                // Report to AI system
                if (window.aiSystem) {
                    window.aiSystem.handleCriticalError('MANAGER_INIT_FAILED', managerError);
                }
            }
            
        } catch (error) {
            console.error('Error handling user login:', error);
            this.handleAuthError(error, 'login_process', { userId: user.uid });
            this.showToast('Error loading user data', 'error');
        }
    }

    async handleLogout() {
        try {
            this.showLoading(true);
            
            // Log logout for analytics
            if (this.currentUser && window.aiSystem) {
                window.aiSystem.performanceMetrics.userBehaviorPatterns.set(this.currentUser.uid, {
                    lastLogout: Date.now(),
                    sessionDuration: Date.now() - (this.currentUser.metadata.lastSignInTime || Date.now())
                });
            }
            
            await auth.signOut();
            this.showToast('Logged out successfully', 'info');
            
        } catch (error) {
            this.handleAuthError(error, 'logout', {});
            this.showToast('Error logging out', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    handleAuthError(error, context, metadata) {
        // Enhanced error handling with AI integration
        const errorData = {
            code: error.code,
            message: error.message,
            context,
            metadata,
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        };

        // Report to AI system for learning and pattern detection
        if (window.aiSystem) {
            window.aiSystem.handleCriticalError('AUTH_ERROR', errorData);
        }

        // Log to realtime database for admin monitoring
        if (window.realtimeDb) {
            window.realtimeDb.collection('errorLogs').add({
                type: 'authentication',
                ...errorData
            }).catch(logError => {
                console.error('Failed to log error:', logError);
            });
        }

        console.error('Authentication error:', errorData);
    }

    showAuthScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('game-screen').classList.add('hidden');
    }

    showGameScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
    }

    showLoading(show) {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        
        if (show) {
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.innerHTML = '<span class="material-icons">hourglass_empty</span> Signing in...';
            }
            if (registerBtn) {
                registerBtn.disabled = true;
                registerBtn.innerHTML = '<span class="material-icons">hourglass_empty</span> Creating account...';
            }
        } else {
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<span class="material-icons">login</span> Login';
            }
            if (registerBtn) {
                registerBtn.disabled = false;
                registerBtn.innerHTML = '<span class="material-icons">person_add</span> Register & Get 10 Coins';
            }
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check_circle' : 
                    type === 'error' ? 'error' : 
                    type === 'warning' ? 'warning' : 'info';
        
        toast.innerHTML = `
            <span class="material-icons">${icon}</span>
            <span>${message}</span>
        `;

        const container = document.getElementById('toast-container');
        if (container) {
            container.appendChild(toast);

            // Auto-remove toast
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.remove();
                        }
                    }, 300);
                }
            }, 4000);

            // Click to dismiss
            toast.addEventListener('click', () => {
                if (toast.parentNode) {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.remove();
                        }
                    }, 300);
                }
            });
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getErrorMessage(error) {
        const errorMessages = {
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-in-use': 'Email is already registered',
            'auth/weak-password': 'Password is too weak',
            'auth/invalid-email': 'Invalid email address',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later',
            'auth/user-disabled': 'This account has been disabled',
            'auth/operation-not-allowed': 'Operation not allowed',
            'auth/network-request-failed': 'Network error. Please check your connection'
        };

        return errorMessages[error.code] || error.message || 'An error occurred';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async getUserData() {
        if (!this.currentUser) return null;
        
        try {
            const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
            return userDoc.exists ? userDoc.data() : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            
            // Report to AI system
            if (window.aiSystem) {
                window.aiSystem.handleCriticalError('USER_DATA_FETCH_FAILED', error);
            }
            
            return null;
        }
    }

    async updateUserData(data) {
        if (!this.currentUser) return false;
        
        try {
            await db.collection('users').doc(this.currentUser.uid).update(data);
            
            // Sync to realtime database
            if (window.dataSyncManager) {
                await window.dataSyncManager.syncUserData(this.currentUser.uid, data);
            }
            
            return true;
        } catch (error) {
            console.error('Error updating user data:', error);
            
            // Report to AI system
            if (window.aiSystem) {
                window.aiSystem.handleCriticalError('USER_DATA_UPDATE_FAILED', error);
            }
            
            return false;
        }
    }

    // Enhanced security methods
    async checkAccountSecurity() {
        if (!this.currentUser) return null;
        
        try {
            const userData = await this.getUserData();
            if (!userData) return null;
            
            const securityScore = this.calculateSecurityScore(userData);
            const recommendations = this.getSecurityRecommendations(userData, securityScore);
            
            return {
                score: securityScore,
                level: this.getSecurityLevel(securityScore),
                recommendations
            };
        } catch (error) {
            console.error('Error checking account security:', error);
            return null;
        }
    }

    calculateSecurityScore(userData) {
        let score = 0;
        
        // Password strength (estimated based on creation date)
        if (userData.createdAt) {
            const accountAge = Date.now() - userData.createdAt.toDate().getTime();
            if (accountAge > 86400000) score += 20; // Account older than 1 day
        }
        
        // Email verification
        if (this.currentUser.emailVerified) score += 30;
        
        // Profile completeness
        if (userData.displayName && userData.username) score += 20;
        if (userData.avatar && !userData.avatar.includes('pexels')) score += 10; // Custom avatar
        
        // Activity level
        if (userData.totalBets > 10) score += 10;
        if (userData.lastActive) {
            const lastActiveTime = userData.lastActive.toDate().getTime();
            if (Date.now() - lastActiveTime < 86400000) score += 10; // Active in last 24 hours
        }
        
        return Math.min(score, 100);
    }

    getSecurityLevel(score) {
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        if (score >= 40) return 'low';
        return 'very-low';
    }

    getSecurityRecommendations(userData, score) {
        const recommendations = [];
        
        if (!this.currentUser.emailVerified) {
            recommendations.push('Verify your email address');
        }
        
        if (!userData.displayName) {
            recommendations.push('Complete your profile information');
        }
        
        if (userData.avatar && userData.avatar.includes('pexels')) {
            recommendations.push('Upload a custom profile picture');
        }
        
        if (score < 60) {
            recommendations.push('Enable two-factor authentication');
            recommendations.push('Use a strong, unique password');
        }
        
        return recommendations;
    }

    destroy() {
        if (this.unsubscribeAuth) {
            this.unsubscribeAuth();
        }
        
        // Clear login attempts
        this.loginAttempts.clear();
    }
}

// Initialize auth manager
window.authManager = new AuthManager();