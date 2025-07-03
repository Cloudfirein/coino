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
        
        // Start the game system with delay
        setTimeout(() => {
            this.initializeGameSystem();
        }, 2000);
    }

    async initializeGameSystem() {
        try {
            await this.ensureActiveRound();
            this.listenToGameUpdates();
            console.log('Game system initialized successfully');
        } catch (error) {
            console.error('Error initializing game system:', error);
            setTimeout(() => this.initializeGameSystem(), 5000);
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
        if (headerActions && !document.getElementById('admin-btn')) {
            const adminBtn = document.createElement('button');
            adminBtn.id = 'admin-btn';
            adminBtn.className = 'header-btn admin-btn';
            adminBtn.title = 'Admin Panel';
            adminBtn.innerHTML = '<span class="material-icons">admin_panel_settings</span>';
            adminBtn.style.display = 'none';
            adminBtn.addEventListener('click', () => this.showAdminPanel());
            headerActions.insertBefore(adminBtn, headerActions.firstChild);
        }
    }

    async showAdminPanel() {
        const userData = await window.authManager?.getUserData();
        if (!userData?.isAdmin) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content admin-modal">
                <div class="modal-header">
                    <h2>Admin Control Panel</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="admin-actions">
                    <button class="admin-action-btn danger" onclick="window.gameManager.adminDeleteAllData()">
                        <span class="material-icons">delete_forever</span>
                        Delete All Data
                    </button>
                    <button class="admin-action-btn" onclick="window.gameManager.adminForceNewRound()">
                        <span class="material-icons">add_circle</span>
                        Force New Round
                    </button>
                    <button class="admin-action-btn" onclick="window.gameManager.adminResetUserCoins()">
                        <span class="material-icons">refresh</span>
                        Reset All User Coins
                    </button>
                    <button class="admin-action-btn" onclick="window.gameManager.adminEndCurrentRound()">
                        <span class="material-icons">stop</span>
                        End Current Round
                    </button>
                    <button class="admin-action-btn" onclick="window.gameManager.adminProcessStuckResults()">
                        <span class="material-icons">build</span>
                        Process Stuck Results
                    </button>
                    <button class="admin-action-btn" onclick="window.gameManager.adminOptimizeDatabase()">
                        <span class="material-icons">speed</span>
                        Optimize Database
                    </button>
                </div>
                <div class="admin-stats">
                    <h3>System Statistics</h3>
                    <div id="admin-stats-content">Loading...</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.loadAdminStats();
    }

    async loadAdminStats() {
        try {
            const [roundsSnapshot, betsSnapshot, usersSnapshot] = await Promise.all([
                db.collection('rounds').get(),
                db.collection('bets').get(),
                db.collection('users').get()
            ]);

            const statsContent = document.getElementById('admin-stats-content');
            if (statsContent) {
                statsContent.innerHTML = `
                    <div class="stat-item">Total Rounds: ${roundsSnapshot.size}</div>
                    <div class="stat-item">Total Bets: ${betsSnapshot.size}</div>
                    <div class="stat-item">Total Users: ${usersSnapshot.size}</div>
                    <div class="stat-item">Current Round: ${this.currentRound ? 'Active' : 'None'}</div>
                    <div class="stat-item">Processing: ${this.isProcessingResults ? 'Yes' : 'No'}</div>
                    <div class="stat-item">Bet In Progress: ${this.betInProgress ? 'Yes' : 'No'}</div>
                `;
            }
        } catch (error) {
            console.error('Error loading admin stats:', error);
        }
    }

    async adminProcessStuckResults() {
        try {
            const stuckRounds = await db.collection('rounds')
                .where('status', '==', 'active')
                .where('type', '==', 'public')
                .get();

            for (const doc of stuckRounds.docs) {
                const roundData = doc.data();
                if (roundData.startTime) {
                    const startTime = roundData.startTime.toDate();
                    const elapsed = Date.now() - startTime.getTime();
                    
                    if (elapsed >= this.roundDuration) {
                        await this.endRound(doc.id);
                    }
                }
            }
            
            window.authManager?.showToast('Processed stuck results', 'success');
        } catch (error) {
            console.error('Error processing stuck results:', error);
            window.authManager?.showToast('Error processing results', 'error');
        }
    }

    async adminOptimizeDatabase() {
        try {
            // Clean up old completed rounds (keep last 100)
            const oldRounds = await db.collection('rounds')
                .where('status', '==', 'completed')
                .orderBy('endTime', 'desc')
                .offset(100)
                .get();

            const batch = db.batch();
            oldRounds.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            if (oldRounds.size > 0) {
                await batch.commit();
            }

            window.authManager?.showToast(`Cleaned up ${oldRounds.size} old rounds`, 'success');
        } catch (error) {
            console.error('Error optimizing database:', error);
            window.authManager?.showToast('Error optimizing database', 'error');
        }
    }

    async adminDeleteAllData() {
        if (!confirm('⚠️ DELETE ALL DATA? This cannot be undone!')) return;
        if (!confirm('This will delete ALL rounds, bets, and reset user coins. Continue?')) return;

        try {
            // Delete in batches to avoid timeout
            await this.deleteBatchCollection('rounds');
            await this.deleteBatchCollection('bets');
            
            // Reset user data (except admin)
            const users = await db.collection('users').get();
            const batches = this.chunkArray(users.docs, this.batchSize);
            
            for (const batch of batches) {
                const batchWrite = db.batch();
                batch.forEach(doc => {
                    const userData = doc.data();
                    if (!userData.isAdmin) {
                        batchWrite.update(doc.ref, {
                            coins: 10,
                            totalBets: 0,
                            totalWins: 0,
                            totalLosses: 0,
                            winRate: 0
                        });
                    }
                });
                await batchWrite.commit();
            }
            
            window.authManager?.showToast('All data deleted successfully', 'success');
            document.querySelector('.modal')?.remove();
            
            // Restart system
            await this.loadUserData();
            await this.ensureActiveRound();
        } catch (error) {
            console.error('Error deleting data:', error);
            window.authManager?.showToast('Error deleting data', 'error');
        }
    }

    async deleteBatchCollection(collectionName) {
        const collection = db.collection(collectionName);
        const batchSize = 100;
        
        let query = collection.limit(batchSize);
        let snapshot = await query.get();
        
        while (!snapshot.empty) {
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            
            snapshot = await query.get();
        }
    }

    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    async adminForceNewRound() {
        try {
            this.isProcessingResults = false;
            this.resultModalShown = false;
            await this.createNewRound();
            window.authManager?.showToast('New round created', 'success');
        } catch (error) {
            console.error('Error creating round:', error);
            window.authManager?.showToast('Error creating round', 'error');
        }
    }

    async adminResetUserCoins() {
        if (!confirm('Reset all user coins to 10?')) return;

        try {
            const users = await db.collection('users').where('isAdmin', '==', false).get();
            const batches = this.chunkArray(users.docs, this.batchSize);
            
            for (const batch of batches) {
                const batchWrite = db.batch();
                batch.forEach(doc => {
                    batchWrite.update(doc.ref, { coins: 10 });
                });
                await batchWrite.commit();
            }
            
            window.authManager?.showToast('User coins reset', 'success');
            await this.loadUserData();
        } catch (error) {
            console.error('Error resetting coins:', error);
            window.authManager?.showToast('Error resetting coins', 'error');
        }
    }

    async adminEndCurrentRound() {
        if (!this.currentRound) {
            window.authManager?.showToast('No active round to end', 'warning');
            return;
        }

        try {
            await this.endRound(this.currentRound.id);
            window.authManager?.showToast('Round ended manually', 'success');
        } catch (error) {
            console.error('Error ending round:', error);
            window.authManager?.showToast('Error ending round', 'error');
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
    }

    selectBetAmount(amount) {
        if (!this.userData || (this.userData.coins < amount && !this.userData.isAdmin)) {
            window.authManager?.showToast('Insufficient coins', 'error');
            return;
        }

        this.selectedBetAmount = amount;
        
        document.querySelectorAll('.bet-amount').forEach(btn => btn.classList.remove('selected'));
        const amountBtn = document.querySelector(`[data-amount="${amount}"]`);
        if (amountBtn) amountBtn.classList.add('selected');
        
        this.updatePlaceBetButton();
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
            window.authManager?.showToast('Please select color and amount', 'warning');
            return;
        }

        if (!this.userData || (this.userData.coins < this.selectedBetAmount && !this.userData.isAdmin)) {
            window.authManager?.showToast('Insufficient coins', 'error');
            return;
        }

        await this.ensureActiveRound();

        if (!this.currentRound || this.currentRound.status !== 'active') {
            window.authManager?.showToast('No active round available', 'warning');
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
                window.authManager?.showToast('You already have a bet in this round', 'warning');
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
                        processed: false
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
            window.authManager?.showToast('Bet placed successfully!', 'success');

        } catch (error) {
            console.error('Error placing bet:', error);
            window.authManager?.showToast(error.message || 'Error placing bet', 'error');
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
                processed: false
            };

            const roundRef = await db.collection('rounds').add(roundData);
            console.log('New round created:', roundRef.id);
            
            // Set timeout to end round with buffer
            setTimeout(async () => {
                if (!this.isProcessingResults) {
                    await this.endRound(roundRef.id);
                }
            }, this.roundDuration + 1000); // Add 1 second buffer

        } catch (error) {
            console.error('Error creating new round:', error);
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

            // Process bets with improved logic
            await this.processBetsOptimized(roundId, winningColor);
            
            // Show result modal with delay
            setTimeout(async () => {
                await this.showResultModal(winningColor, roundId);
            }, 1000);

            // Wait for result display duration before creating new round
            setTimeout(async () => {
                this.isProcessingResults = false;
                this.resultModalShown = false;
                await this.ensureActiveRound();
            }, this.resultDisplayDuration);

        } catch (error) {
            console.error('Error ending round:', error);
            this.isProcessingResults = false;
            setTimeout(() => this.ensureActiveRound(), 3000);
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

            console.log('Bet processing completed successfully');

        } catch (error) {
            console.error('Error processing bets:', error);
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

    async loadUserData() {
        try {
            const userData = await window.authManager?.getUserData();
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

    updateUserUI() {
        if (!this.userData) return;

        const userNameEl = document.getElementById('user-name');
        const coinCountEl = document.getElementById('coin-count');
        const headerAvatarEl = document.getElementById('header-avatar');

        if (userNameEl) userNameEl.textContent = this.userData.displayName || 'User';
        if (coinCountEl) {
            coinCountEl.textContent = this.userData.isAdmin ? '∞' : this.userData.coins.toLocaleString();
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
            statusText.textContent = 'Preparing next round...';
            if (playerCount) playerCount.textContent = 'Standby';
        } else if (this.currentRound) {
            if (this.currentRound.status === 'active') {
                statusText.textContent = 'Round in progress! Place your bets!';
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

    destroy() {
        this.stopGameListeners();
        this.betInProgress = false;
        this.isCreatingRound = false;
        this.isProcessingResults = false;
        this.resultModalShown = false;
    }
}

// Initialize game manager
window.gameManager = new GameManager();