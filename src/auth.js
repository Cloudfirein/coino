// Enhanced Authentication Manager with AI Integration
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authStateListeners = [];
        this.aiInsights = new Map();
        this.loginAttempts = new Map();
        this.securityMetrics = {
            failedLogins: 0,
            successfulLogins: 0,
            suspiciousActivity: []
        };
        
        this.init();
    }

    async init() {
        try {
            // Listen for auth state changes
            auth.onAuthStateChanged(async (user) => {
                this.currentUser = user;
                
                if (user) {
                    await this.handleUserLogin(user);
                } else {
                    await this.handleUserLogout();
                }
                
                // Notify all listeners
                this.authStateListeners.forEach(callback => callback(user));
            });

            // Initialize AI monitoring
            this.initializeAIMonitoring();
            
            console.log('🔐 Enhanced AuthManager with AI initialized');
        } catch (error) {
            handleAIError(error, 'auth_manager_init');
        }
    }

    initializeAIMonitoring() {
        // Monitor authentication patterns
        setInterval(() => {
            this.analyzeAuthPatterns();
        }, 30000); // Every 30 seconds

        // Monitor for suspicious activity
        this.monitorSuspiciousActivity();
    }

    async analyzeAuthPatterns() {
        try {
            const patterns = {
                timestamp: Date.now(),
                failedLogins: this.securityMetrics.failedLogins,
                successfulLogins: this.securityMetrics.successfulLogins,
                activeUsers: this.currentUser ? 1 : 0,
                suspiciousActivityCount: this.securityMetrics.suspiciousActivity.length
            };

            // Store patterns for AI analysis
            await db.collection(AI_COLLECTIONS.userBehavior).add({
                type: 'auth_patterns',
                data: patterns,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Reset counters
            this.securityMetrics.failedLogins = 0;
            this.securityMetrics.successfulLogins = 0;
            this.securityMetrics.suspiciousActivity = [];
        } catch (error) {
            handleAIError(error, 'auth_pattern_analysis');
        }
    }

    monitorSuspiciousActivity() {
        // Monitor rapid login attempts
        const checkSuspiciousLogins = () => {
            this.loginAttempts.forEach((attempts, ip) => {
                if (attempts.length > 5) { // More than 5 attempts
                    const recentAttempts = attempts.filter(time => 
                        Date.now() - time < 300000 // Within 5 minutes
                    );
                    
                    if (recentAttempts.length > 3) {
                        this.securityMetrics.suspiciousActivity.push({
                            type: 'rapid_login_attempts',
                            ip,
                            attempts: recentAttempts.length,
                            timestamp: Date.now()
                        });
                    }
                }
            });
        };

        setInterval(checkSuspiciousLogins, 60000); // Every minute
    }

    async handleUserLogin(user) {
        try {
            // Record successful login
            this.securityMetrics.successfulLogins++;
            
            // Get or create user profile
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (!userDoc.exists) {
                // New user - create profile
                await this.createUserProfile(user);
            } else {
                // Existing user - update last login
                await db.collection('users').doc(user.uid).update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    loginCount: firebase.firestore.FieldValue.increment(1)
                });
            }

            // Store AI insights about user behavior
            await this.storeUserInsights(user);
            
            // Show game screen
            this.showGameScreen();
            
        } catch (error) {
            handleAIError(error, 'user_login_handling');
        }
    }

    async createUserProfile(user) {
        const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'New Player',
            username: this.generateUsername(user.email),
            coins: 10, // Starting coins
            avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            stats: {
                gamesPlayed: 0,
                gamesWon: 0,
                totalBets: 0,
                totalWinnings: 0
            },
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            loginCount: 1,
            isActive: true,
            preferences: {
                notifications: true,
                soundEffects: true,
                theme: 'default'
            }
        };

        await db.collection('users').doc(user.uid).set(userData);
        
        // Log new user for AI analysis
        await db.collection(AI_COLLECTIONS.userBehavior).add({
            type: 'new_user_registration',
            userId: user.uid,
            email: user.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    async storeUserInsights(user) {
        try {
            const insights = {
                userId: user.uid,
                loginTime: Date.now(),
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    platform: navigator.platform,
                    screenResolution: `${screen.width}x${screen.height}`
                },
                sessionStart: Date.now(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection(AI_COLLECTIONS.aiInsights).add(insights);
        } catch (error) {
            handleAIError(error, 'user_insights_storage');
        }
    }

    generateUsername(email) {
        const baseUsername = email.split('@')[0];
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseUsername}${randomSuffix}`;
    }

    async handleUserLogout() {
        try {
            if (this.currentUser) {
                // Store session end time
                await db.collection(AI_COLLECTIONS.aiInsights).add({
                    userId: this.currentUser.uid,
                    sessionEnd: Date.now(),
                    type: 'session_end',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            this.currentUser = null;
            this.showAuthScreen();
        } catch (error) {
            handleAIError(error, 'user_logout_handling');
        }
    }

    async login(email, password) {
        try {
            // Record login attempt
            const clientIP = 'unknown'; // In a real app, you'd get the actual IP
            if (!this.loginAttempts.has(clientIP)) {
                this.loginAttempts.set(clientIP, []);
            }
            this.loginAttempts.get(clientIP).push(Date.now());

            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            
            this.showToast('Login successful!', 'success');
            return userCredential.user;
        } catch (error) {
            this.securityMetrics.failedLogins++;
            
            let errorMessage = 'Login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
            }
            
            this.showToast(errorMessage, 'error');
            handleAIError(error, 'user_login');
            throw error;
        }
    }

    async register(email, password, name, username) {
        try {
            // Check if username is already taken
            const usernameQuery = await db.collection('users')
                .where('username', '==', username)
                .get();
            
            if (!usernameQuery.empty) {
                throw new Error('Username already taken');
            }

            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Update display name
            await userCredential.user.updateProfile({
                displayName: name
            });

            this.showToast('Registration successful! Welcome to Coino!', 'success');
            return userCredential.user;
        } catch (error) {
            let errorMessage = 'Registration failed. Please try again.';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'An account with this email already exists.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
            }
            
            if (error.message === 'Username already taken') {
                errorMessage = 'Username already taken. Please choose another.';
            }
            
            this.showToast(errorMessage, 'error');
            handleAIError(error, 'user_registration');
            throw error;
        }
    }

    async logout() {
        try {
            await auth.signOut();
            this.showToast('Logged out successfully', 'success');
        } catch (error) {
            this.showToast('Logout failed', 'error');
            handleAIError(error, 'user_logout');
            throw error;
        }
    }

    onAuthStateChanged(callback) {
        this.authStateListeners.push(callback);
        
        // Call immediately with current state
        callback(this.currentUser);
        
        // Return unsubscribe function
        return () => {
            const index = this.authStateListeners.indexOf(callback);
            if (index > -1) {
                this.authStateListeners.splice(index, 1);
            }
        };
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
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

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
            <span>${message}</span>
        `;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }

    // AI-enhanced security methods
    async detectAnomalousActivity(userId) {
        try {
            const recentActivity = await db.collection(AI_COLLECTIONS.userBehavior)
                .where('userId', '==', userId)
                .where('timestamp', '>', new Date(Date.now() - 3600000)) // Last hour
                .get();

            const activities = recentActivity.docs.map(doc => doc.data());
            
            // Simple anomaly detection
            const loginCount = activities.filter(a => a.type === 'login').length;
            const gameCount = activities.filter(a => a.type === 'game_action').length;
            
            if (loginCount > 10 || gameCount > 100) {
                await this.flagSuspiciousActivity(userId, 'high_activity_volume');
            }
        } catch (error) {
            handleAIError(error, 'anomaly_detection');
        }
    }

    async flagSuspiciousActivity(userId, reason) {
        try {
            await db.collection(AI_COLLECTIONS.aiErrors).add({
                type: 'suspicious_activity',
                userId,
                reason,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                severity: 'medium',
                resolved: false
            });
        } catch (error) {
            handleAIError(error, 'flag_suspicious_activity');
        }
    }
}

// Initialize and export
const authManager = new AuthManager();
window.authManager = authManager;

console.log('🔐 Enhanced AuthManager loaded');