class BorrowSystemManager {
    constructor() {
        this.unsubscribeRequests = null;
        this.currentRequestId = null;
        this.currentRequest = null;
        this.requestInProgress = false;
        this.processedRequests = new Set(); // Prevent duplicate processing
        
        // Performance optimizations
        this.batchSize = 50;
        this.maxRetries = 3;
        this.retryDelay = 1000;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const requestCoinsBtn = document.getElementById('request-coins-btn');
        if (requestCoinsBtn) {
            requestCoinsBtn.addEventListener('click', this.debounce(() => this.requestCoins(), 2000));
        }

        const approveBorrowBtn = document.getElementById('approve-borrow');
        const declineBorrowBtn = document.getElementById('decline-borrow');
        
        if (approveBorrowBtn) {
            approveBorrowBtn.addEventListener('click', () => {
                this.respondToBorrowRequest(true);
            });
        }
        
        if (declineBorrowBtn) {
            declineBorrowBtn.addEventListener('click', () => {
                this.respondToBorrowRequest(false);
            });
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

    async executeWithRetry(operation, maxRetries = this.maxRetries) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                if (attempt === maxRetries) throw error;
                
                console.warn(`Borrow system attempt ${attempt} failed, retrying...`, error);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
    }

    async requestCoins() {
        if (this.requestInProgress) {
            console.log('Request already in progress, ignoring...');
            return;
        }
        
        const usernameInput = document.getElementById('borrow-username');
        const amountInput = document.getElementById('borrow-amount');
        const messageInput = document.getElementById('borrow-message');
        
        if (!usernameInput || !amountInput) return;

        const username = usernameInput.value.trim().toLowerCase();
        const amount = parseInt(amountInput.value);
        const message = messageInput ? messageInput.value.trim() : '';

        if (!username || !amount) {
            window.authManager?.showToast('Please fill in username and amount', 'error');
            return;
        }

        if (amount < 1 || amount > 100) {
            window.authManager?.showToast('Amount must be between 1 and 100 coins', 'error');
            return;
        }

        const currentUser = window.authManager?.getCurrentUser();
        if (!currentUser) return;

        this.requestInProgress = true;

        try {
            // Find user by username with optimized query
            const userQuery = await db.collection('users')
                .where('username', '==', username)
                .limit(1)
                .get();

            if (userQuery.empty) {
                window.authManager?.showToast('User not found', 'error');
                return;
            }

            const targetUser = userQuery.docs[0];
            const targetUserData = targetUser.data();

            if (targetUser.id === currentUser.uid) {
                window.authManager?.showToast('You cannot request coins from yourself', 'error');
                return;
            }

            if (targetUserData.coins < amount && !targetUserData.isAdmin) {
                window.authManager?.showToast('User does not have enough coins', 'error');
                return;
            }

            // Check for existing pending request with optimized query
            const existingRequest = await db.collection('borrowRequests')
                .where('fromUserId', '==', currentUser.uid)
                .where('toUserId', '==', targetUser.id)
                .where('status', '==', 'pending')
                .get();

            if (!existingRequest.empty) {
                window.authManager?.showToast('You already have a pending request to this user', 'error');
                return;
            }

            // Create request with retry logic
            await this.executeWithRetry(async () => {
                const requestData = {
                    fromUserId: currentUser.uid,
                    fromUserName: currentUser.displayName || 'User',
                    fromUserEmail: currentUser.email,
                    toUserId: targetUser.id,
                    toUserName: targetUserData.displayName,
                    toUserEmail: targetUserData.email,
                    amount: amount,
                    message: message || 'Please lend me some coins!',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'pending',
                    processed: false
                };

                await db.collection('borrowRequests').add(requestData);
            });

            // Clear inputs
            usernameInput.value = '';
            amountInput.value = '';
            if (messageInput) messageInput.value = '';

            window.authManager?.showToast('Request sent successfully!', 'success');
            this.loadBorrowRequests();
        } catch (error) {
            console.error('Error requesting coins:', error);
            window.authManager?.showToast('Error sending request', 'error');
        } finally {
            this.requestInProgress = false;
        }
    }

    async loadBorrowRequests() {
        const currentUser = window.authManager?.getCurrentUser();
        if (!currentUser) return;

        this.loadOutgoingRequests(currentUser.uid);
        this.loadIncomingRequests(currentUser.uid);
        this.loadLoanHistory(currentUser.uid);
    }

    async loadOutgoingRequests(userId) {
        const container = document.getElementById('borrow-requests-list');
        if (!container) return;

        try {
            const requestsQuery = await db.collection('borrowRequests')
                .where('fromUserId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(20)
                .get();

            if (requestsQuery.empty) {
                container.innerHTML = '<p class="no-requests">No pending requests</p>';
                return;
            }

            const requests = requestsQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            container.innerHTML = requests.map(request => `
                <div class="request-item">
                    <div class="request-info">
                        <p><strong>To:</strong> ${request.toUserName}</p>
                        <p><strong>Amount:</strong> ${request.amount} coins</p>
                        <p><strong>Message:</strong> ${request.message}</p>
                        <p><strong>Status:</strong> <span class="status-${request.status}">${request.status.toUpperCase()}</span></p>
                        <p class="request-time">${this.formatTime(request.timestamp)}</p>
                    </div>
                    ${request.status === 'pending' ? `
                        <div class="request-actions">
                            <button class="request-action-btn cancel-btn" onclick="window.borrowSystemManager.cancelRequest('${request.id}')">
                                Cancel
                            </button>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading outgoing requests:', error);
            container.innerHTML = '<p class="no-requests">Error loading requests</p>';
        }
    }

    async loadIncomingRequests(userId) {
        // Clean up existing listener
        if (this.unsubscribeRequests) {
            this.unsubscribeRequests();
        }

        // Listen for incoming requests with duplicate prevention
        this.unsubscribeRequests = db.collection('borrowRequests')
            .where('toUserId', '==', userId)
            .where('status', '==', 'pending')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const request = { id: change.doc.id, ...change.doc.data() };
                        
                        // Prevent duplicate processing
                        if (!this.processedRequests.has(request.id) && !this.currentRequestId) {
                            this.processedRequests.add(request.id);
                            this.showBorrowRequestModal(request);
                        }
                    }
                });
            }, (error) => {
                console.error('Incoming requests listener error:', error);
            });
    }

    async loadLoanHistory(userId) {
        const container = document.getElementById('loan-history-list');
        if (!container) return;

        try {
            const historyQuery = await db.collection('borrowRequests')
                .where('fromUserId', '==', userId)
                .where('status', 'in', ['approved', 'declined'])
                .orderBy('timestamp', 'desc')
                .limit(30)
                .get();

            if (historyQuery.empty) {
                container.innerHTML = '<p class="no-history">No loan history</p>';
                return;
            }

            const history = historyQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            container.innerHTML = history.map(item => `
                <div class="history-item">
                    <div class="history-info">
                        <p><strong>${item.status === 'approved' ? 'Received' : 'Declined'}:</strong> ${item.amount} coins</p>
                        <p><strong>From:</strong> ${item.toUserName}</p>
                        <p class="history-time">${this.formatTime(item.timestamp)}</p>
                    </div>
                    <div class="history-status">
                        <span class="status-${item.status}">${item.status.toUpperCase()}</span>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading loan history:', error);
            container.innerHTML = '<p class="no-history">Error loading history</p>';
        }
    }

    showBorrowRequestModal(request) {
        const modal = document.getElementById('borrow-response-modal');
        if (!modal) return;

        const requesterName = document.getElementById('requester-name');
        const requestAmount = document.getElementById('request-amount');
        const requestMessage = document.getElementById('request-message-display');

        if (requesterName) requesterName.textContent = request.fromUserName;
        if (requestAmount) requestAmount.textContent = request.amount;
        if (requestMessage) requestMessage.textContent = request.message;

        this.currentRequestId = request.id;
        this.currentRequest = request;

        modal.classList.remove('hidden');
    }

    async respondToBorrowRequest(approve) {
        if (!this.currentRequestId || !this.currentRequest) return;

        const modal = document.getElementById('borrow-response-modal');
        const currentUser = window.authManager?.getCurrentUser();
        
        if (!currentUser) return;

        try {
            if (approve) {
                const userData = await window.authManager?.getUserData();
                if (!userData) return;

                if (userData.coins < this.currentRequest.amount && !userData.isAdmin) {
                    window.authManager?.showToast('You do not have enough coins', 'error');
                    modal.classList.add('hidden');
                    return;
                }

                // Use optimized transaction with retry logic
                await this.executeWithRetry(async () => {
                    await db.runTransaction(async (transaction) => {
                        const requestRef = db.collection('borrowRequests').doc(this.currentRequestId);
                        const requestDoc = await transaction.get(requestRef);
                        
                        if (!requestDoc.exists || requestDoc.data().status !== 'pending') {
                            throw new Error('Request no longer valid');
                        }

                        // Deduct from lender (unless admin)
                        if (!userData.isAdmin) {
                            const lenderRef = db.collection('users').doc(currentUser.uid);
                            transaction.update(lenderRef, {
                                coins: firebase.firestore.FieldValue.increment(-this.currentRequest.amount)
                            });
                        }

                        // Add to borrower
                        const borrowerRef = db.collection('users').doc(this.currentRequest.fromUserId);
                        transaction.update(borrowerRef, {
                            coins: firebase.firestore.FieldValue.increment(this.currentRequest.amount)
                        });

                        // Update request status
                        transaction.update(requestRef, {
                            status: 'approved',
                            respondedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            processed: true
                        });
                    });
                });

                window.authManager?.showToast(`Sent ${this.currentRequest.amount} coins to ${this.currentRequest.fromUserName}`, 'success');
            } else {
                await db.collection('borrowRequests').doc(this.currentRequestId).update({
                    status: 'declined',
                    respondedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    processed: true
                });

                window.authManager?.showToast('Request declined', 'info');
            }

            // Reload user data
            if (window.gameManager) {
                await window.gameManager.loadUserData();
            }

            modal.classList.add('hidden');
            
            // Clean up current request
            this.processedRequests.delete(this.currentRequestId);
            this.currentRequestId = null;
            this.currentRequest = null;
        } catch (error) {
            console.error('Error responding to borrow request:', error);
            window.authManager?.showToast('Error processing request', 'error');
        }
    }

    async cancelRequest(requestId) {
        try {
            await db.collection('borrowRequests').doc(requestId).update({
                status: 'cancelled',
                cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
                processed: true
            });

            window.authManager?.showToast('Request cancelled', 'info');
            this.loadBorrowRequests();
        } catch (error) {
            console.error('Error cancelling request:', error);
            window.authManager?.showToast('Error cancelling request', 'error');
        }
    }

    formatTime(timestamp) {
        if (!timestamp) return 'Unknown';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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

    destroy() {
        if (this.unsubscribeRequests) {
            this.unsubscribeRequests();
        }
        this.processedRequests.clear();
        this.requestInProgress = false;
        this.currentRequestId = null;
        this.currentRequest = null;
    }
}

// Initialize borrow system manager
window.borrowSystemManager = new BorrowSystemManager();