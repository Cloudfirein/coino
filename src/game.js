// Enhanced Game Manager with AI Integration and Trading System
class GameManager {
    constructor() {
        this.currentRound = null;
        this.selectedColor = null;
        this.selectedBetAmount = null;
        this.userData = null;
        this.currentTab = 'public';
        this.roundDuration = 30000; // 30 seconds
        this.resultDisplayDuration = 8000; // 8 seconds to show results
        this.isProcessingResults = false;
        this.isCreatingRound = false;
        this.betInProgress = false;
        this.resultModalShown = false;
        
        // AI Integration
        this.aiPredictions = new Map();
        this.gamePatterns = [];
        this.userBehaviorData = new Map();
        this.aiInsightsInterval = null;
        
        // Listeners
        this.unsubscribeRounds = null;
        this.unsubscribeBets = null;
        this.unsubscribeHistory = null;
        this.unsubscribeUserBets = null;
        
        // Performance optimizations
        this.batchSize = 100;
        this.maxRetries = 3;
        this.retryDelay = 1000;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateBetAmounts();
        this.setupTabNavigation();
        this.setupAdminControls();
        this.initializeAIIntegration();
        
        // Start the game system with delay
        setTimeout(() => {
            this.initializeGameSystem();
        }, 2000);
    }

    initializeAIIntegration() {
        // Start AI insights updates
        this.aiInsightsInterval = setInterval(() => {
            this.updateAIInsights();
        }, 5000);

        // Monitor AI health
        this.monitorAIHealth();
        
        // Initialize AI predictions
        this.initializeAIPredictions();
    }

    async initializeAIPredictions() {
        try {
            // Generate initial AI predictions
            const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
            const prediction = colors[Math.floor(Math.random() * colors.length)];
            const confidence = Math.random() * 0.4 + 0.6; // 60-100%
            
            this.aiPredictions.set('current', {
                color: prediction,
                confidence: confidence,
                timestamp: Date.now()
            });

            this.updateAIInsights();
        } catch (error) {
            console.error('Error initializing AI predictions:', error);
        }
    }

    updateAIInsights() {
        try {
            const prediction = this.aiPredictions.get('current');
            if (prediction) {
                const aiPredictionEl = document.getElementById('ai-prediction');
                const winProbabilityEl = document.getElementById('win-probability');
                const patternStrengthEl = document.getElementById('pattern-strength');

                if (aiPredictionEl) {
                    aiPredictionEl.textContent = prediction.color.toUpperCase();
                }
                
                if (winProbabilityEl) {
                    winProbabilityEl.textContent = `${Math.round(prediction.confidence * 100)}%`;
                }
                
                if (patternStrengthEl) {
                    const strength = prediction.confidence > 0.8 ? 'High' : 
                                   prediction.confidence > 0.7 ? 'Medium' : 'Low';
                    patternStrengthEl.textContent = strength;
                }
            }

            // Update AI status indicator
            this.updateAIStatusIndicator();
        } catch (error) {
            console.error('Error updating AI insights:', error);
        }
    }

    updateAIStatusIndicator() {
        const aiStatusIndicator = document.getElementById('ai-status-indicator');
        const aiHealthFill = document.getElementById('ai-health-fill');
        
        if (window.coinoAI && aiStatusIndicator) {
            const aiStatus = window.coinoAI.getSystemStatus();
            const healthScore = aiStatus.monitoring?.healthScore || 100;
            
            if (aiHealthFill) {
                aiHealthFill.style.width = `${healthScore}%`;
                aiHealthFill.className = `ai-health-fill ${healthScore > 80 ? 'healthy' : healthScore > 50 ? 'warning' : 'critical'}`;
            }
            
            const statusText = aiStatusIndicator.querySelector('.ai-status-text');
            if (statusText) {
                statusText.textContent = healthScore > 80 ? 'AI Optimal' : 
                                       healthScore > 50 ? 'AI Warning' : 'AI Critical';
            }
        }
    }

    monitorAIHealth() {
        setInterval(() => {
            if (window.coinoAI) {
                const status = window.coinoAI.getSystemStatus();
                if (status.monitoring.healthScore < 50) {
                    this.showToast('AI system health is critical', 'warning');
                }
            }
        }, 60000); // Check every minute
    }

    async initializeGameSystem() {
        try {
            await this.ensureActiveRound();
            this.listenToGameUpdates();
            this.startAILearning();
            console.log('Enhanced game system with AI initialized successfully');
        } catch (error) {
            console.error('Error initializing game system:', error);
            if (window.coinoAI) {
                window.coinoAI.handleCriticalError('GAME_SYSTEM_INIT_FAILED', error);
            }
            setTimeout(() => this.initializeGameSystem(), 5000);
        }
    }

    startAILearning() {
        // Learn from game patterns
        setInterval(() => {
            this.analyzeGamePatterns();
        }, 30000);

        // Update user behavior data
        setInterval(() => {
            this.updateUserBehaviorData();
        }, 15000);
    }

    async analyzeGamePatterns() {
        try {
            if (this.gamePatterns.length > 10) {
                const recentPatterns = this.gamePatterns.slice(-10);
                const colorCounts = {};
                
                recentPatterns.forEach(pattern => {
                    colorCounts[pattern.winningColor] = (colorCounts[pattern.winningColor] || 0) + 1;
                });

                // Generate new AI prediction based on patterns
                const mostFrequent = Object.keys(colorCounts).reduce((a, b) => 
                    colorCounts[a] > colorCounts[b] ? a : b
                );

                // AI tries to predict the opposite of the most frequent (anti-pattern)
                const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
                const oppositeColors = colors.filter(c => c !== mostFrequent);
                const prediction = oppositeColors[Math.floor(Math.random() * oppositeColors.length)];
                
                this.aiPredictions.set('current', {
                    color: prediction,
                    confidence: Math.random() * 0.3 + 0.7, // 70-100%
                    timestamp: Date.now(),
                    basedOn: 'pattern_analysis'
                });

                // Store AI learning data
                if (window.coinoAI) {
                    await window.coinoAI.storeModelData('gamePatterns', {
                        patterns: recentPatterns,
                        prediction: prediction,
                        confidence: this.aiPredictions.get('current').confidence,
                        timestamp: Date.now()
                    });
                }
            }
        } catch (error) {
            console.error('Error analyzing game patterns:', error);
            if (window.coinoAI) {
                window.coinoAI.handleCriticalError('GAME_PATTERN_ANALYSIS_FAILED', error);
            }
        }
    }

    async updateUserBehaviorData() {
        try {
            const user = window.authManager?.getCurrentUser();
            if (!user || !this.userData) return;

            const behaviorData = {
                userId: user.uid,
                currentCoins: this.userData.coins,
                currentCredits: this.userData.credits || 1000,
                selectedColor: this.selectedColor,
                selectedBetAmount: this.selectedBetAmount,
                timestamp: Date.now(),
                sessionDuration: Date.now() - (this.sessionStartTime || Date.now())
            };

            this.userBehaviorData.set(user.uid, behaviorData);

            // Store in AI system
            if (window.coinoAI) {
                await window.coinoAI.storeModelData('userBehavior', behaviorData);
            }
        } catch (error) {
            console.error('Error updating user behavior data:', error);
        }
    }

    setupEventListeners() {
        // Color selection
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.closest('.color-btn')?.dataset?.color;
                if (color) this.selectColor(color);
            });
        });

        // Place bet button with debouncing
        const placeBetBtn = document.getElementById('place-bet-btn');
        if (placeBetBtn) {
            placeBetBtn.addEventListener('click', this.debounce(() => this.placeBet(), 1000));
        }

        // Result modal close
        const closeResultBtn = document.getElementById('close-result-modal');
        if (closeResultBtn) {
            closeResultBtn.addEventListener('click', () => this.closeResultModal());
        }

        // Auth form handling
        this.setupAuthEventListeners();
    }

    setupAuthEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchAuthTab(tab);
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

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Enter key handling
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const activeForm = document.querySelector('.auth-form:not(.hidden)');
                if (activeForm) {
                    if (activeForm.id === 'login-form') {
                        this.handleLogin();
                    } else if (activeForm.id === 'register-form') {
                        this.handleRegister();
                    }
                }
            }
        });
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.add('hidden'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-form`).classList.remove('hidden');
    }

    async handleLogin() {
        const email = document.getElementById('login-email')?.value?.trim();
        const password = document.getElementById('login-password')?.value;

        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email', 'error');
            return;
        }

        try {
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.innerHTML = '<span class="material-icons">hourglass_empty</span> Logging in...';
            }

            if (window.authManager) {
                await window.authManager.login(email, password);
            } else {
                throw new Error('Auth manager not available');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Login failed. Please check your credentials.', 'error');
        } finally {
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<span class="material-icons">login</span> Login';
            }
        }
    }

    async handleRegister() {
        const name = document.getElementById('register-name')?.value?.trim();
        const username = document.getElementById('register-username')?.value?.trim();
        const email = document.getElementById('register-email')?.value?.trim();
        const password = document.getElementById('register-password')?.value;

        if (!name || !username || !email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email', 'error');
            return;
        }

        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters', 'error');
            return;
        }

        if (username.length < 3) {
            this.showToast('Username must be at least 3 characters', 'error');
            return;
        }

        try {
            const registerBtn = document.getElementById('register-btn');
            if (registerBtn) {
                registerBtn.disabled = true;
                registerBtn.innerHTML = '<span class="material-icons">hourglass_empty</span> Creating account...';
            }

            if (window.authManager) {
                await window.authManager.register(email, password, name, username);
            } else {
                throw new Error('Auth manager not available');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showToast('Registration failed. Please try again.', 'error');
        } finally {
            const registerBtn = document.getElementById('register-btn');
            if (registerBtn) {
                registerBtn.disabled = false;
                registerBtn.innerHTML = '<span class="material-icons">person_add</span> Register & Get 10 Coins + 1000 Credits';
            }
        }
    }

    async handleLogout() {
        try {
            if (window.authManager) {
                await window.authManager.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
            this.showToast('Logout failed', 'error');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    debounce(func, wait) {
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

    setupAdminControls() {
        const headerActions = document.querySelector('.header-actions');
        const adminBtn = document.getElementById('admin-btn');
        
        if (adminBtn) {
            adminBtn.addEventListener('click', () => this.showAdminPanel());
        }
    }

    async showAdminPanel() {
        const userData = await this.getUserData();
        if (!userData?.isAdmin) return;

        if (window.adminDashboard) {
            window.adminDashboard.show();
        } else {
            this.showToast('Admin dashboard not available', 'error');
        }
    }

    setupTabNavigation() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.closest('.nav-tab')?.dataset?.tab;
                if (tabName) this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update UI
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-tab`);
        
        if (activeTab) activeTab.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
        
        // Initialize tab-specific functionality
        if (tabName === 'public') {
            this.listenToGameUpdates();
        } else if (tabName === 'trading') {
            if (window.tradingSystem) {
                window.tradingSystem.initializeTradingTab();
            }
        } else {
            this.stopGameListeners();
        }

        // Load tab data
        if (tabName === 'borrow' && window.borrowSystemManager) {
            window.borrowSystemManager.loadBorrowRequests();
        } else if (tabName === 'private' && window.privateRoomsManager) {
            window.privateRoomsManager.loadPrivateRooms();
        }
    }

    generateBetAmounts() {
        const container = document.getElementById('bet-amounts');
        if (!container) return;
        
        const amounts = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500];

        container.innerHTML = amounts.map(amount => 
            `<button class="bet-amount" data-amount="${amount}">${amount}</button>`
        ).join('');

        container.querySelectorAll('.bet-amount').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseInt(e.target.dataset.amount);
                if (!isNaN(amount)) this.selectBetAmount(amount);
            });
        });
    }

    selectColor(color) {
        this.selectedColor = color;
        
        document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('selected'));
        const colorBtn = document.querySelector(`[data-color="${color}"]`);
        if (colorBtn) colorBtn.classList.add('selected');
        
        this.updatePlaceBetButton();
        
        // Store user behavior for AI
        this.trackUserAction('color_selection', { color, timestamp: Date.now() });
    }

    selectBetAmount(amount) {
        if (!this.userData || (this.userData.coins < amount && !this.userData.isAdmin)) {
            this.showToast('Insufficient coins', 'error');
            return;
        }

        this.selectedBetAmount = amount;
        
        document.querySelectorAll('.bet-amount').forEach(btn => btn.classList.remove('selected'));
        const amountBtn = document.querySelector(`[data-amount="${amount}"]`);
        if (amountBtn) amountBtn.classList.add('selected');
        
        this.updatePlaceBetButton();
        
        // Store user behavior for AI
        this.trackUserAction('bet_amount_selection', { amount, timestamp: Date.now() });
    }

    trackUserAction(action, data) {
        try {
            if (window.coinoAI) {
                window.coinoAI.storeModelData('userActions', {
                    action,
                    data,
                    userId: window.authManager?.getCurrentUser()?.uid,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error('Error tracking user action:', error);
        }
    }

    updatePlaceBetButton() {
        const btn = document.getElementById('place-bet-btn');
        if (!btn) return;
        
        if (this.selectedColor && this.selectedBetAmount && !this.betInProgress) {
            btn.classList.remove('disabled');
            btn.disabled = false;
            btn.innerHTML = `
                <span class="material-icons">casino</span>
                <div class="bet-info">
                    <span class="bet-text">Bet ${this.selectedBetAmount} coins on ${this.selectedColor.toUpperCase()}</span>
                </div>
            `;
        } else {
            btn.classList.add('disabled');
            btn.disabled = true;
            const text = this.betInProgress ? 'Processing bet...' : 'Select Color & Amount';
            btn.innerHTML = `
                <span class="material-icons">${this.betInProgress ? 'hourglass_empty' : 'casino'}</span>
                <div class="bet-info">
                    <span class="bet-text">${text}</span>
                </div>
            `;
        }
    }

    async placeBet() {
        if (!this.selectedColor || !this.selectedBetAmount || this.betInProgress) {
            this.showToast('Please select color and amount', 'warning');
            return;
        }

        if (!this.userData || (this.userData.coins < this.selectedBetAmount && !this.userData.isAdmin)) {
            this.showToast('Insufficient coins', 'error');
            return;
        }

        await this.ensureActiveRound();

        if (!this.currentRound || this.currentRound.status !== 'active') {
            this.showToast('No active round available', 'warning');
            return;
        }

        this.betInProgress = true;
        this.updatePlaceBetButton();

        try {
            const user = window.authManager?.getCurrentUser();
            if (!user) return;

            // Check for existing bet in this round
            const existingBet = await db.collection('bets')
                .where('userId', '==', user.uid)
                .where('roundId', '==', this.currentRound.id)
                .where('status', '==', 'pending')
                .where('type', '==', 'public')
                .get();

            if (!existingBet.empty) {
                this.showToast('You already have a bet in this round', 'warning');
                return;
            }

            // Use optimized transaction with retry logic
            await this.executeWithRetry(async () => {
                await db.runTransaction(async (transaction) => {
                    const userRef = db.collection('users').doc(user.uid);
                    const roundRef = db.collection('rounds').doc(this.currentRound.id);
                    
                    const [userDoc, roundDoc] = await Promise.all([
                        transaction.get(userRef),
                        transaction.get(roundRef)
                    ]);
                    
                    if (!userDoc.exists) throw new Error('User not found');
                    if (!roundDoc.exists || roundDoc.data().status !== 'active') {
                        throw new Error('Round is no longer active');
                    }
                    
                    const currentUserData = userDoc.data();
                    if (currentUserData.coins < this.selectedBetAmount && !currentUserData.isAdmin) {
                        throw new Error('Insufficient coins');
                    }

                    // Create bet with optimized structure
                    const betRef = db.collection('bets').doc();
                    const betData = {
                        userId: user.uid,
                        userName: this.userData.displayName || 'User',
                        userEmail: user.email,
                        color: this.selectedColor,
                        amount: this.selectedBetAmount,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        status: 'pending',
                        roundId: this.currentRound.id,
                        type: 'public',
                        processed: false,
                        aiPrediction: this.aiPredictions.get('current')
                    };
                    
                    transaction.set(betRef, betData);

                    // Deduct coins (unless admin)
                    if (!currentUserData.isAdmin) {
                        transaction.update(userRef, {
                            coins: firebase.firestore.FieldValue.increment(-this.selectedBetAmount),
                            totalBets: firebase.firestore.FieldValue.increment(1)
                        });
                    }

                    // Update round stats atomically
                    transaction.update(roundRef, {
                        totalBets: firebase.firestore.FieldValue.increment(1),
                        totalAmount: firebase.firestore.FieldValue.increment(this.selectedBetAmount),
                        lastBetTime: firebase.firestore.FieldValue.serverTimestamp()
                    });
                });
            });

            this.resetBetSelection();
            await this.loadUserData();
            this.showToast('Bet placed successfully!', 'success');

            // Track bet placement for AI
            this.trackUserAction('bet_placed', {
                color: this.selectedColor,
                amount: this.selectedBetAmount,
                roundId: this.currentRound.id,
                timestamp: Date.now()
            });

        } catch (error) {
            console.error('Error placing bet:', error);
            this.showToast(error.message || 'Error placing bet', 'error');
            
            if (window.coinoAI) {
                window.coinoAI.handleCriticalError('BET_PLACEMENT_FAILED', error);
            }
        } finally {
            this.betInProgress = false;
            this.updatePlaceBetButton();
        }
    }

    async executeWithRetry(operation, maxRetries = this.maxRetries) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                if (attempt === maxRetries) throw error;
                
                console.warn(`Attempt ${attempt} failed, retrying...`, error);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
    }

    resetBetSelection() {
        this.selectedColor = null;
        this.selectedBetAmount = null;
        document.querySelectorAll('.color-btn.selected, .bet-amount.selected').forEach(el => {
            el.classList.remove('selected');
        });
        this.updatePlaceBetButton();
    }

    async ensureActiveRound() {
        if (this.isCreatingRound) return;

        try {
            const activeRounds = await db.collection('rounds')
                .where('status', '==', 'active')
                .where('type', '==', 'public')
                .limit(1)
                .get();

            if (activeRounds.empty) {
                await this.createNewRound();
            } else {
                const roundData = activeRounds.docs[0].data();
                const roundId = activeRounds.docs[0].id;
                
                if (roundData.startTime) {
                    const startTime = roundData.startTime.toDate();
                    const elapsed = Date.now() - startTime.getTime();
                    
                    if (elapsed >= this.roundDuration) {
                        await this.endRound(roundId);
                    }
                }
            }
        } catch (error) {
            console.error('Error ensuring active round:', error);
            if (window.coinoAI) {
                window.coinoAI.handleCriticalError('ENSURE_ACTIVE_ROUND_FAILED', error);
            }
            setTimeout(() => this.ensureActiveRound(), 3000);
        }
    }

    async createNewRound() {
        if (this.isCreatingRound) return;
        
        this.isCreatingRound = true;

        try {
            const roundData = {
                status: 'active',
                startTime: firebase.firestore.FieldValue.serverTimestamp(),
                duration: this.roundDuration / 1000,
                totalBets: 0,
                totalAmount: 0,
                type: 'public',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                processed: false,
                aiPrediction: this.aiPredictions.get('current')
            };

            const roundRef = await db.collection('rounds').add(roundData);
            console.log('New round created with AI prediction:', roundRef.id);
            
            // Set timeout to end round with buffer
            setTimeout(async () => {
                if (!this.isProcessingResults) {
                    await this.endRound(roundRef.id);
                }
            }, this.roundDuration + 1000); // Add 1 second buffer

        } catch (error) {
            console.error('Error creating new round:', error);
            if (window.coinoAI) {
                window.coinoAI.handleCriticalError('CREATE_ROUND_FAILED', error);
            }
        } finally {
            this.isCreatingRound = false;
        }
    }

    async endRound(roundId) {
        if (this.isProcessingResults) {
            console.log('Already processing results, skipping...');
            return;
        }
        
        this.isProcessingResults = true;
        console.log(`Starting to end round: ${roundId}`);

        try {
            const roundDoc = await db.collection('rounds').doc(roundId).get();
            if (!roundDoc.exists || roundDoc.data().status !== 'active') {
                console.log('Round not found or not active');
                this.isProcessingResults = false;
                return;
            }

            const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
            const winningColor = colors[Math.floor(Math.random() * colors.length)];

            // Update round with result atomically
            await db.collection('rounds').doc(roundId).update({
                status: 'completed',
                endTime: firebase.firestore.FieldValue.serverTimestamp(),
                winningColor: winningColor,
                processed: true
            });

            console.log(`Round ${roundId} ended with winning color: ${winningColor}`);

            // Store game pattern for AI learning
            this.gamePatterns.push({
                roundId,
                winningColor,
                timestamp: Date.now(),
                aiPrediction: this.aiPredictions.get('current')
            });

            // Process bets with improved logic
            await this.processBetsOptimized(roundId, winningColor);
            
            // Show result modal with delay
            setTimeout(async () => {
                await this.showResultModal(winningColor, roundId);
            }, 1000);

            // Generate new AI prediction for next round
            this.generateNextAIPrediction(winningColor);

            // Wait for result display duration before creating new round
            setTimeout(async () => {
                this.isProcessingResults = false;
                this.resultModalShown = false;
                await this.ensureActiveRound();
            }, this.resultDisplayDuration);

        } catch (error) {
            console.error('Error ending round:', error);
            if (window.coinoAI) {
                window.coinoAI.handleCriticalError('END_ROUND_FAILED', error);
            }
            this.isProcessingResults = false;
            setTimeout(() => this.ensureActiveRound(), 3000);
        }
    }

    generateNextAIPrediction(lastWinningColor) {
        try {
            const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
            
            // AI learns from recent patterns
            if (this.gamePatterns.length > 5) {
                const recentColors = this.gamePatterns.slice(-5).map(p => p.winningColor);
                const colorCounts = {};
                
                recentColors.forEach(color => {
                    colorCounts[color] = (colorCounts[color] || 0) + 1;
                });

                // Predict less frequent colors
                const leastFrequent = colors.filter(color => 
                    (colorCounts[color] || 0) <= Math.min(...Object.values(colorCounts))
                );
                
                const prediction = leastFrequent[Math.floor(Math.random() * leastFrequent.length)];
                const confidence = Math.random() * 0.2 + 0.75; // 75-95%
                
                this.aiPredictions.set('current', {
                    color: prediction,
                    confidence: confidence,
                    timestamp: Date.now(),
                    basedOn: 'frequency_analysis'
                });
            } else {
                // Random prediction for early rounds
                const prediction = colors[Math.floor(Math.random() * colors.length)];
                this.aiPredictions.set('current', {
                    color: prediction,
                    confidence: Math.random() * 0.3 + 0.6, // 60-90%
                    timestamp: Date.now(),
                    basedOn: 'random'
                });
            }
        } catch (error) {
            console.error('Error generating AI prediction:', error);
        }
    }

    async processBetsOptimized(roundId, winningColor) {
        try {
            const betsSnapshot = await db.collection('bets')
                .where('roundId', '==', roundId)
                .where('status', '==', 'pending')
                .where('type', '==', 'public')
                .get();

            if (betsSnapshot.empty) {
                console.log('No bets to process');
                return;
            }

            const bets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const winningBets = bets.filter(bet => bet.color === winningColor);
            const losingBets = bets.filter(bet => bet.color !== winningColor);

            console.log(`Processing ${bets.length} bets: ${winningBets.length} winners, ${losingBets.length} losers`);

            // Calculate distributions
            const totalLosingAmount = losingBets.reduce((sum, bet) => sum + bet.amount, 0);
            const distributionAmount = Math.floor(totalLosingAmount * 0.5); // 50% of losing amount
            const winnersShare = Math.floor(distributionAmount * 0.5); // 25% of total losing amount
            const adminShare = Math.floor(distributionAmount * 0.5); // 25% of total losing amount

            console.log(`Distribution: Total losing: ${totalLosingAmount}, Winners share: ${winnersShare}, Admin share: ${adminShare}`);

            // Process in optimized batches
            const allBets = [...winningBets, ...losingBets];
            const batches = this.chunkArray(allBets, this.batchSize);
            
            for (const batchBets of batches) {
                await this.processBetBatch(batchBets, winningColor, winnersShare, winningBets);
            }

            // Give admin share
            if (adminShare > 0) {
                await this.distributeAdminShare(adminShare);
            }

            // Update win rates efficiently
            const uniqueUserIds = [...new Set(bets.map(bet => bet.userId))];
            await this.updateWinRatesOptimized(uniqueUserIds);

            // Store AI learning data about bet outcomes
            if (window.coinoAI) {
                await window.coinoAI.storeModelData('betOutcomes', {
                    roundId,
                    winningColor,
                    totalBets: bets.length,
                    winningBets: winningBets.length,
                    losingBets: losingBets.length,
                    totalAmount: bets.reduce((sum, bet) => sum + bet.amount, 0),
                    timestamp: Date.now()
                });
            }

            console.log('Bet processing completed successfully');

        } catch (error) {
            console.error('Error processing bets:', error);
            if (window.coinoAI) {
                window.coinoAI.handleCriticalError('BET_PROCESSING_FAILED', error);
            }
        }
    }

    async processBetBatch(batchBets, winningColor, winnersShare, allWinningBets) {
        const batch = db.batch();

        for (const bet of batchBets) {
            const isWinner = bet.color === winningColor;
            const userRef = db.collection('users').doc(bet.userId);
            const betRef = db.collection('bets').doc(bet.id);

            if (isWinner) {
                let winAmount = bet.amount; // Return original bet
                
                if (allWinningBets.length > 0 && winnersShare > 0) {
                    const totalWinningAmount = allWinningBets.reduce((sum, b) => sum + b.amount, 0);
                    const proportion = bet.amount / totalWinningAmount;
                    const additionalWin = Math.floor(winnersShare * proportion);
                    winAmount += additionalWin;
                }

                batch.update(userRef, {
                    coins: firebase.firestore.FieldValue.increment(winAmount),
                    totalWins: firebase.firestore.FieldValue.increment(1)
                });

                batch.update(betRef, {
                    status: 'won',
                    winAmount: winAmount,
                    processedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    processed: true
                });
            } else {
                // Losing bet - only lose 50% of bet amount
                const lossAmount = Math.floor(bet.amount * 0.5);
                const returnAmount = bet.amount - lossAmount;

                batch.update(userRef, {
                    coins: firebase.firestore.FieldValue.increment(returnAmount),
                    totalLosses: firebase.firestore.FieldValue.increment(1)
                });

                batch.update(betRef, {
                    status: 'lost',
                    lostAmount: lossAmount,
                    returnedAmount: returnAmount,
                    processedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    processed: true
                });
            }
        }

        await batch.commit();
    }

    async distributeAdminShare(adminShare) {
        try {
            const adminUsers = await db.collection('users')
                .where('isAdmin', '==', true)
                .limit(1)
                .get();

            if (!adminUsers.empty) {
                const adminRef = adminUsers.docs[0].ref;
                await adminRef.update({
                    coins: firebase.firestore.FieldValue.increment(adminShare)
                });
                console.log(`Distributed ${adminShare} coins to admin`);
            }
        } catch (error) {
            console.error('Error giving admin share:', error);
        }
    }

    async updateWinRatesOptimized(userIds) {
        const batches = this.chunkArray(userIds, this.batchSize);
        
        for (const batchUserIds of batches) {
            const batch = db.batch();
            
            for (const userId of batchUserIds) {
                try {
                    const userDoc = await db.collection('users').doc(userId).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        const totalGames = (userData.totalWins || 0) + (userData.totalLosses || 0);
                        const winRate = totalGames > 0 ? Math.round(((userData.totalWins || 0) / totalGames) * 100) : 0;
                        
                        batch.update(userDoc.ref, { winRate: winRate });
                    }
                } catch (error) {
                    console.error('Error updating win rate for user:', userId, error);
                }
            }
            
            await batch.commit();
        }
    }

    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    async loadUserData() {
        try {
            const userData = await this.getUserData();
            if (userData) {
                this.userData = userData;
                this.updateUserUI();
                this.updateBetAmountAvailability();
                
                const adminBtn = document.getElementById('admin-btn');
                if (adminBtn) {
                    adminBtn.style.display = userData.isAdmin ? 'block' : 'none';
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async getUserData() {
        const user = window.authManager?.getCurrentUser();
        if (!user) return null;

        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                return { id: user.uid, ...userDoc.data() };
            }
        } catch (error) {
            console.error('Error getting user data:', error);
        }
        return null;
    }

    updateUserUI() {
        if (!this.userData) return;

        const userNameEl = document.getElementById('user-name');
        const coinCountEl = document.getElementById('coin-count');
        const creditCountEl = document.getElementById('credit-count');
        const headerAvatarEl = document.getElementById('header-avatar');

        if (userNameEl) userNameEl.textContent = this.userData.displayName || 'User';
        if (coinCountEl) {
            coinCountEl.textContent = this.userData.isAdmin ? '∞' : this.userData.coins.toLocaleString();
        }
        if (creditCountEl) {
            creditCountEl.textContent = this.userData.isAdmin ? '∞' : (this.userData.credits || 1000).toLocaleString();
        }
        if (headerAvatarEl && this.userData.avatar) {
            headerAvatarEl.src = this.userData.avatar;
        }
    }

    updateBetAmountAvailability() {
        if (!this.userData) return;

        document.querySelectorAll('.bet-amount').forEach(btn => {
            const amount = parseInt(btn.dataset.amount);
            if (this.userData.coins < amount && !this.userData.isAdmin) {
                btn.classList.add('disabled');
                btn.disabled = true;
            } else {
                btn.classList.remove('disabled');
                btn.disabled = false;
            }
        });
    }

    listenToGameUpdates() {
        this.stopGameListeners();

        // Listen to current round with optimized query
        this.unsubscribeRounds = db.collection('rounds')
            .where('status', '==', 'active')
            .where('type', '==', 'public')
            .limit(1)
            .onSnapshot(async (snapshot) => {
                try {
                    if (!snapshot.empty) {
                        const roundDoc = snapshot.docs[0];
                        this.currentRound = { id: roundDoc.id, ...roundDoc.data() };
                        this.updateGameStatus();
                        this.startCountdown();
                    } else {
                        this.currentRound = null;
                        this.updateGameStatus('waiting');
                        this.stopCountdown();
                        if (!this.isProcessingResults && !this.isCreatingRound) {
                            await this.ensureActiveRound();
                        }
                    }
                } catch (error) {
                    console.error('Error in rounds listener:', error);
                }
            }, (error) => {
                console.error('Rounds listener error:', error);
            });

        // Listen to bets with optimized query
        if (this.currentRound) {
            this.unsubscribeBets = db.collection('bets')
                .where('roundId', '==', this.currentRound.id)
                .where('type', '==', 'public')
                .where('status', '==', 'pending')
                .orderBy('timestamp', 'desc')
                .limit(50)
                .onSnapshot((snapshot) => {
                    this.updateBetsList(snapshot.docs);
                }, (error) => {
                    console.error('Bets listener error:', error);
                });
        }

        // Listen to history with optimized query
        this.unsubscribeHistory = db.collection('rounds')
            .where('status', '==', 'completed')
            .where('type', '==', 'public')
            .orderBy('endTime', 'desc')
            .limit(20)
            .onSnapshot((snapshot) => {
                this.updateGameHistory(snapshot.docs);
            }, (error) => {
                console.error('History listener error:', error);
            });
    }

    stopGameListeners() {
        if (this.unsubscribeRounds) {
            this.unsubscribeRounds();
            this.unsubscribeRounds = null;
        }
        if (this.unsubscribeBets) {
            this.unsubscribeBets();
            this.unsubscribeBets = null;
        }
        if (this.unsubscribeHistory) {
            this.unsubscribeHistory();
            this.unsubscribeHistory = null;
        }
        if (this.unsubscribeUserBets) {
            this.unsubscribeUserBets();
            this.unsubscribeUserBets = null;
        }
        this.stopCountdown();
    }

    updateGameStatus(status = null) {
        const statusText = document.getElementById('game-status-text');
        const playerCount = document.getElementById('player-count');
        
        if (!statusText) return;

        if (status === 'waiting' || !this.currentRound) {
            statusText.textContent = 'AI preparing next round...';
            if (playerCount) playerCount.textContent = 'Standby';
        } else if (this.currentRound) {
            if (this.currentRound.status === 'active') {
                statusText.textContent = 'Round in progress! AI is analyzing patterns...';
                if (playerCount) playerCount.textContent = `${this.currentRound.totalBets || 0} bets`;
            }
        }
    }

    startCountdown() {
        this.stopCountdown();

        if (!this.currentRound || !this.currentRound.startTime) return;

        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;

        const updateCountdown = () => {
            try {
                const now = new Date().getTime();
                const startTime = this.currentRound.startTime.toDate().getTime();
                const elapsed = Math.floor((now - startTime) / 1000);
                const timeLeft = Math.max(0, (this.roundDuration / 1000) - elapsed);
                
                countdownElement.textContent = timeLeft;

                if (timeLeft <= 0) {
                    this.stopCountdown();
                }
            } catch (error) {
                console.error('Error updating countdown:', error);
                this.stopCountdown();
            }
        };

        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    stopCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    updateBetsList(betDocs) {
        const container = document.getElementById('bets-list');
        if (!container) return;

        try {
            const bets = betDocs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => {
                    const aTime = a.timestamp?.toDate?.() || new Date(0);
                    const bTime = b.timestamp?.toDate?.() || new Date(0);
                    return bTime - aTime;
                });
            
            if (bets.length === 0) {
                container.innerHTML = '<p class="no-bets">No bets placed yet</p>';
                return;
            }

            container.innerHTML = bets.map(bet => `
                <div class="bet-item">
                    <div class="bet-info">
                        <div class="color-indicator" style="background-color: ${bet.color};"></div>
                        <div class="bet-details">
                            <p>${bet.userName || 'Anonymous'}</p>
                            <p>${bet.color.toUpperCase()}</p>
                        </div>
                    </div>
                    <div class="bet-amount-display">${bet.amount}</div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error updating bets list:', error);
        }
    }

    updateGameHistory(roundDocs) {
        const container = document.getElementById('history-list');
        if (!container) return;
        
        try {
            if (roundDocs.length === 0) {
                container.innerHTML = '<p class="no-history">No games played yet</p>';
                return;
            }

            container.innerHTML = roundDocs.map(doc => {
                const round = doc.data();
                const roundId = doc.id.slice(-6);
                const endTime = round.endTime?.toDate?.() || new Date(0);
                
                return `
                    <div class="history-item">
                        <div class="history-info">
                            <div class="color-indicator" style="background-color: ${round.winningColor};"></div>
                            <div class="bet-details">
                                <p>Round ${roundId}</p>
                                <p>Winner: ${round.winningColor?.toUpperCase()}</p>
                                <p class="history-time">${this.formatTime(endTime)}</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error updating game history:', error);
        }
    }

    formatTime(date) {
        try {
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            return 'Unknown';
        }
    }

    async showResultModal(winningColor, roundId) {
        if (this.resultModalShown) return;
        this.resultModalShown = true;

        const currentUser = window.authManager?.getCurrentUser();
        if (!currentUser) return;

        try {
            const userBetsSnapshot = await db.collection('bets')
                .where('roundId', '==', roundId)
                .where('userId', '==', currentUser.uid)
                .where('type', '==', 'public')
                .get();

            const modal = document.getElementById('result-modal');
            if (!modal) return;

            const winningColorEl = modal.querySelector('.winning-color');
            const resultTitle = document.getElementById('result-title');
            const resultMessage = document.getElementById('result-message');

            if (winningColorEl) winningColorEl.style.backgroundColor = winningColor;
            if (resultTitle) resultTitle.textContent = 'Round Complete!';
            if (resultMessage) {
                resultMessage.textContent = `The winning color was ${winningColor.toUpperCase()}!`;
            }

            await this.showUserBetResult(roundId, winningColor);
            modal.classList.remove('hidden');

            // Auto-close after display duration
            setTimeout(() => {
                this.closeResultModal();
            }, this.resultDisplayDuration - 1000);

        } catch (error) {
            console.error('Error showing result modal:', error);
        }
    }

    async showUserBetResult(roundId, winningColor) {
        const currentUser = window.authManager?.getCurrentUser();
        if (!currentUser) return;

        try {
            const userBetsSnapshot = await db.collection('bets')
                .where('roundId', '==', roundId)
                .where('userId', '==', currentUser.uid)
                .where('type', '==', 'public')
                .get();

            const yourBetEl = document.getElementById('your-bet');
            const betResultEl = document.getElementById('bet-result');

            if (userBetsSnapshot.empty) {
                if (yourBetEl) yourBetEl.textContent = 'No bet placed';
                if (betResultEl) betResultEl.textContent = '-';
                return;
            }

            const userBet = userBetsSnapshot.docs[0].data();
            const isWinner = userBet.color === winningColor;

            if (yourBetEl) {
                yourBetEl.textContent = `${userBet.amount} on ${userBet.color.toUpperCase()}`;
            }
            
            if (betResultEl) {
                if (isWinner) {
                    const winAmount = userBet.winAmount || userBet.amount;
                    betResultEl.textContent = `+${winAmount} coins`;
                    betResultEl.className = 'win';
                } else {
                    const lossAmount = userBet.lostAmount || Math.floor(userBet.amount * 0.5);
                    betResultEl.textContent = `-${lossAmount} coins`;
                    betResultEl.className = 'loss';
                }
            }
        } catch (error) {
            console.error('Error showing user bet result:', error);
        }
    }

    closeResultModal() {
        const modal = document.getElementById('result-modal');
        if (modal) modal.classList.add('hidden');
        this.resultModalShown = false;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'}</span>
            <span>${message}</span>
        `;
        
        const container = document.getElementById('toast-container');
        if (container) {
            container.appendChild(toast);
            
            // Animate in
            setTimeout(() => toast.classList.add('show'), 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (container.contains(toast)) {
                        container.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }
    }

    destroy() {
        this.stopGameListeners();
        this.betInProgress = false;
        this.isCreatingRound = false;
        this.isProcessingResults = false;
        this.resultModalShown = false;
        
        if (this.aiInsightsInterval) {
            clearInterval(this.aiInsightsInterval);
            this.aiInsightsInterval = null;
        }
    }
}

// Initialize game manager
window.gameManager = new GameManager();