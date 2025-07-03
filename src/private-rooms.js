class PrivateRoomsManager {
    constructor() {
        this.currentRoom = null;
        this.selectedPrivateColor = null;
        this.selectedPrivateBetAmount = null;
        this.unsubscribeRoom = null;
        this.unsubscribeRoomBets = null;
        this.unsubscribeRoomChat = null;
        this.unsubscribePrivateRounds = null;
        this.roomCountdown = null;
        this.currentPrivateRound = null;
        this.isProcessingPrivateResults = false;
        this.privateBetInProgress = false;
        this.privateResultModalShown = false;
        
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
        const createRoomBtn = document.getElementById('create-room-btn');
        if (createRoomBtn) {
            createRoomBtn.addEventListener('click', () => this.createPrivateRoom());
        }

        const joinRoomBtn = document.getElementById('join-room-btn');
        if (joinRoomBtn) {
            joinRoomBtn.addEventListener('click', () => this.joinPrivateRoom());
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
                
                console.warn(`Private room attempt ${attempt} failed, retrying...`, error);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
    }

    async createPrivateRoom() {
        const roomNameInput = document.getElementById('room-name');
        const roomPasswordInput = document.getElementById('room-password');
        
        if (!roomNameInput) return;

        const roomName = roomNameInput.value.trim();
        const roomPassword = roomPasswordInput ? roomPasswordInput.value.trim() : '';

        if (!roomName) {
            window.authManager?.showToast('Please enter a room name', 'error');
            return;
        }

        const currentUser = window.authManager?.getCurrentUser();
        if (!currentUser) return;

        try {
            const roomCode = this.generateRoomCode();
            const roomData = {
                name: roomName,
                code: roomCode,
                password: roomPassword || null,
                createdBy: currentUser.uid,
                createdByName: currentUser.displayName || 'User',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                isActive: true,
                players: [currentUser.uid],
                maxPlayers: 10,
                currentRound: null,
                totalEarnings: 0,
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('privateRooms').add(roomData);
            
            roomNameInput.value = '';
            if (roomPasswordInput) roomPasswordInput.value = '';
            
            window.authManager?.showToast(`Room created! Code: ${roomCode}`, 'success');
            this.loadPrivateRooms();
        } catch (error) {
            console.error('Error creating private room:', error);
            window.authManager?.showToast('Error creating room', 'error');
        }
    }

    async joinPrivateRoom() {
        const roomCodeInput = document.getElementById('join-room-code');
        const roomPasswordInput = document.getElementById('join-room-password');
        
        if (!roomCodeInput) return;

        const roomCode = roomCodeInput.value.trim().toUpperCase();
        const roomPassword = roomPasswordInput ? roomPasswordInput.value.trim() : '';

        if (!roomCode) {
            window.authManager?.showToast('Please enter a room code', 'error');
            return;
        }

        const currentUser = window.authManager?.getCurrentUser();
        if (!currentUser) return;

        try {
            const roomQuery = await db.collection('privateRooms')
                .where('code', '==', roomCode)
                .where('isActive', '==', true)
                .limit(1)
                .get();

            if (roomQuery.empty) {
                window.authManager?.showToast('Room not found', 'error');
                return;
            }

            const roomDoc = roomQuery.docs[0];
            const roomData = roomDoc.data();

            if (roomData.password && roomData.password !== roomPassword) {
                window.authManager?.showToast('Incorrect password', 'error');
                return;
            }

            if (roomData.players.length >= roomData.maxPlayers) {
                window.authManager?.showToast('Room is full', 'error');
                return;
            }

            if (roomData.players.includes(currentUser.uid)) {
                window.authManager?.showToast('You are already in this room', 'info');
                return;
            }

            await db.collection('privateRooms').doc(roomDoc.id).update({
                players: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });

            roomCodeInput.value = '';
            if (roomPasswordInput) roomPasswordInput.value = '';

            window.authManager?.showToast('Joined room successfully!', 'success');
            this.loadPrivateRooms();
        } catch (error) {
            console.error('Error joining private room:', error);
            window.authManager?.showToast('Error joining room', 'error');
        }
    }

    async loadPrivateRooms() {
        const currentUser = window.authManager?.getCurrentUser();
        if (!currentUser) return;

        const container = document.getElementById('private-rooms');
        if (!container) return;

        try {
            const roomsQuery = await db.collection('privateRooms')
                .where('players', 'array-contains', currentUser.uid)
                .where('isActive', '==', true)
                .orderBy('lastActivity', 'desc')
                .get();

            if (roomsQuery.empty) {
                container.innerHTML = '<p class="no-rooms">No private rooms yet</p>';
                return;
            }

            const rooms = roomsQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            container.innerHTML = rooms.map(room => `
                <div class="room-item">
                    <div class="room-info">
                        <h4>${room.name}</h4>
                        <p>Code: <strong>${room.code}</strong></p>
                        <p>Players: ${room.players.length}/${room.maxPlayers}</p>
                        <p>Created by: ${room.createdByName}</p>
                        <p>Earnings: <span class="earnings">${room.totalEarnings || 0} coins</span></p>
                    </div>
                    <div class="room-actions">
                        <button class="room-action-btn enter-btn" onclick="window.privateRoomsManager.enterRoom('${room.id}')">
                            <span class="material-icons">login</span>
                            Enter
                        </button>
                        ${room.createdBy === currentUser.uid ? `
                            <button class="room-action-btn delete-btn" onclick="window.privateRoomsManager.deleteRoom('${room.id}')">
                                <span class="material-icons">delete</span>
                                Delete
                            </button>
                        ` : `
                            <button class="room-action-btn leave-btn" onclick="window.privateRoomsManager.leaveRoom('${room.id}')">
                                <span class="material-icons">exit_to_app</span>
                                Leave
                            </button>
                        `}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading private rooms:', error);
            container.innerHTML = '<p class="no-rooms">Error loading rooms</p>';
        }
    }

    async enterRoom(roomId) {
        try {
            const roomDoc = await db.collection('privateRooms').doc(roomId).get();
            if (!roomDoc.exists) {
                window.authManager?.showToast('Room not found', 'error');
                return;
            }

            this.currentRoom = { id: roomId, ...roomDoc.data() };
            this.showPrivateRoomInterface();
            this.listenToRoomUpdates();
        } catch (error) {
            console.error('Error entering room:', error);
            window.authManager?.showToast('Error entering room', 'error');
        }
    }

    showPrivateRoomInterface() {
        if (!this.currentRoom) return;

        const privateTab = document.getElementById('private-tab');
        if (!privateTab) return;

        privateTab.innerHTML = `
            <div class="private-room-game">
                <div class="room-header">
                    <h3 class="room-title">${this.currentRoom.name}</h3>
                    <div class="room-code">Code: ${this.currentRoom.code}</div>
                    <button class="leave-room-btn" onclick="window.privateRoomsManager.exitRoom()">
                        <span class="material-icons">exit_to_app</span>
                        Leave Room
                    </button>
                </div>

                <div class="room-stats">
                    <div class="stat-item">
                        <span class="material-icons">people</span>
                        <span>${this.currentRoom.players.length} Players</span>
                    </div>
                    <div class="stat-item">
                        <span class="material-icons">monetization_on</span>
                        <span>${this.currentRoom.totalEarnings || 0} Earnings</span>
                    </div>
                </div>

                <div class="room-chat">
                    <div class="chat-messages" id="room-chat-messages">
                        <p class="no-messages">No messages yet</p>
                    </div>
                    <div class="chat-input-container">
                        <input type="text" class="chat-input" id="room-chat-input" placeholder="Type a message..." maxlength="200">
                        <button class="send-chat-btn" onclick="window.privateRoomsManager.sendChatMessage()">
                            <span class="material-icons">send</span>
                        </button>
                    </div>
                </div>

                <div class="game-status">
                    <div class="status-card">
                        <h3 id="private-game-status-text">Waiting for players to bet...</h3>
                        <div class="game-info">
                            <div class="info-item">
                                <span class="material-icons">casino</span>
                                <span id="private-player-count">0 bets</span>
                            </div>
                            <div class="timer-container">
                                <div class="timer-circle">
                                    <span id="private-countdown">--</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="color-selection">
                    <h3>Choose Your Color</h3>
                    <div class="colors-grid">
                        <button class="private-color-btn" data-color="red" style="background: linear-gradient(135deg, #f44336, #d32f2f);">
                            <span>Red</span>
                        </button>
                        <button class="private-color-btn" data-color="green" style="background: linear-gradient(135deg, #4caf50, #388e3c);">
                            <span>Green</span>
                        </button>
                        <button class="private-color-btn" data-color="blue" style="background: linear-gradient(135deg, #2196f3, #1976d2);">
                            <span>Blue</span>
                        </button>
                        <button class="private-color-btn" data-color="yellow" style="background: linear-gradient(135deg, #ffeb3b, #f57f17); color: #333;">
                            <span>Yellow</span>
                        </button>
                        <button class="private-color-btn" data-color="purple" style="background: linear-gradient(135deg, #9c27b0, #7b1fa2);">
                            <span>Purple</span>
                        </button>
                        <button class="private-color-btn" data-color="orange" style="background: linear-gradient(135deg, #ff9800, #f57c00);">
                            <span>Orange</span>
                        </button>
                    </div>
                </div>

                <div class="bet-selection">
                    <h3>Select Bet Amount</h3>
                    <div class="bet-amounts" id="private-bet-amounts">
                        <!-- Bet amounts will be generated -->
                    </div>
                </div>

                <div class="current-bets">
                    <h3>Room Bets</h3>
                    <div id="private-bets-list" class="bets-list">
                        <p class="no-bets">No bets placed yet</p>
                    </div>
                </div>
            </div>

            <div class="floating-bet-container">
                <button class="floating-bet-btn disabled" id="private-place-bet-btn">
                    <span class="material-icons">casino</span>
                    <div class="bet-info">
                        <span class="bet-text">Select Color & Amount</span>
                    </div>
                </button>
            </div>
        `;

        this.setupPrivateRoomEventListeners();
        this.generatePrivateBetAmounts();
        this.loadRoomChat();
        this.listenToPrivateRounds();
    }

    setupPrivateRoomEventListeners() {
        // Color selection
        document.querySelectorAll('.private-color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.closest('.private-color-btn')?.dataset?.color;
                if (color) this.selectPrivateColor(color);
            });
        });

        // Private bet button with debouncing
        const privateBetBtn = document.getElementById('private-place-bet-btn');
        if (privateBetBtn) {
            privateBetBtn.addEventListener('click', this.debounce(() => this.placePrivateBet(), 1000));
        }

        // Chat input
        const chatInput = document.getElementById('room-chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendChatMessage();
            });
        }
    }

    generatePrivateBetAmounts() {
        const container = document.getElementById('private-bet-amounts');
        if (!container) return;
        
        const amounts = [1, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 150, 200];

        container.innerHTML = amounts.map(amount => 
            `<button class="bet-amount private-bet-amount" data-amount="${amount}">${amount}</button>`
        ).join('');

        container.querySelectorAll('.private-bet-amount').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseInt(e.target.dataset.amount);
                if (!isNaN(amount)) this.selectPrivateBetAmount(amount);
            });
        });
    }

    selectPrivateColor(color) {
        this.selectedPrivateColor = color;
        
        document.querySelectorAll('.private-color-btn').forEach(btn => btn.classList.remove('selected'));
        const colorBtn = document.querySelector(`[data-color="${color}"]`);
        if (colorBtn) colorBtn.classList.add('selected');
        
        this.updatePrivatePlaceBetButton();
    }

    selectPrivateBetAmount(amount) {
        const userData = window.gameManager?.userData;
        if (!userData || (userData.coins < amount && !userData.isAdmin)) {
            window.authManager?.showToast('Insufficient coins', 'error');
            return;
        }

        this.selectedPrivateBetAmount = amount;
        
        document.querySelectorAll('.private-bet-amount').forEach(btn => btn.classList.remove('selected'));
        const amountBtn = document.querySelector(`[data-amount="${amount}"]`);
        if (amountBtn) amountBtn.classList.add('selected');
        
        this.updatePrivatePlaceBetButton();
    }

    updatePrivatePlaceBetButton() {
        const btn = document.getElementById('private-place-bet-btn');
        if (!btn) return;
        
        if (this.selectedPrivateColor && this.selectedPrivateBetAmount && !this.privateBetInProgress) {
            btn.classList.remove('disabled');
            btn.disabled = false;
            btn.innerHTML = `
                <span class="material-icons">casino</span>
                <div class="bet-info">
                    <span class="bet-text">Bet ${this.selectedPrivateBetAmount} coins on ${this.selectedPrivateColor.toUpperCase()}</span>
                </div>
            `;
        } else {
            btn.classList.add('disabled');
            btn.disabled = true;
            const text = this.privateBetInProgress ? 'Processing bet...' : 'Select Color & Amount';
            btn.innerHTML = `
                <span class="material-icons">${this.privateBetInProgress ? 'hourglass_empty' : 'casino'}</span>
                <div class="bet-info">
                    <span class="bet-text">${text}</span>
                </div>
            `;
        }
    }

    async placePrivateBet() {
        if (!this.selectedPrivateColor || !this.selectedPrivateBetAmount || !this.currentRoom || this.privateBetInProgress) return;

        const userData = window.gameManager?.userData;
        if (!userData || (userData.coins < this.selectedPrivateBetAmount && !userData.isAdmin)) {
            window.authManager?.showToast('Insufficient coins', 'error');
            return;
        }

        this.privateBetInProgress = true;
        this.updatePrivatePlaceBetButton();

        try {
            const user = window.authManager?.getCurrentUser();
            if (!user) return;

            // Check for existing bet in waiting status
            const existingBet = await db.collection('privateBets')
                .where('userId', '==', user.uid)
                .where('roomId', '==', this.currentRoom.id)
                .where('status', 'in', ['private-waiting', 'private-pending'])
                .get();

            if (!existingBet.empty) {
                window.authManager?.showToast('You already have a pending bet in this room', 'warning');
                return;
            }

            // Use optimized transaction with retry logic
            await this.executeWithRetry(async () => {
                await db.runTransaction(async (transaction) => {
                    const userRef = db.collection('users').doc(user.uid);
                    const roomRef = db.collection('privateRooms').doc(this.currentRoom.id);
                    
                    const [userDoc, roomDoc] = await Promise.all([
                        transaction.get(userRef),
                        transaction.get(roomRef)
                    ]);
                    
                    if (!userDoc.exists) throw new Error('User not found');
                    if (!roomDoc.exists || !roomDoc.data().isActive) {
                        throw new Error('Room is no longer active');
                    }
                    
                    const currentUserData = userDoc.data();
                    if (currentUserData.coins < this.selectedPrivateBetAmount && !currentUserData.isAdmin) {
                        throw new Error('Insufficient coins');
                    }

                    // Create bet with optimized structure
                    const betRef = db.collection('privateBets').doc();
                    const betData = {
                        userId: user.uid,
                        userName: userData.displayName || 'User',
                        userEmail: user.email,
                        color: this.selectedPrivateColor,
                        amount: this.selectedPrivateBetAmount,
                        roomId: this.currentRoom.id,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        status: 'private-waiting',
                        type: 'private',
                        processed: false
                    };
                    
                    transaction.set(betRef, betData);

                    // Deduct coins (unless admin)
                    if (!currentUserData.isAdmin) {
                        transaction.update(userRef, {
                            coins: firebase.firestore.FieldValue.increment(-this.selectedPrivateBetAmount)
                        });
                    }

                    // Update room activity
                    transaction.update(roomRef, {
                        lastActivity: firebase.firestore.FieldValue.serverTimestamp()
                    });
                });
            });

            // Reset selection
            this.selectedPrivateColor = null;
            this.selectedPrivateBetAmount = null;
            document.querySelectorAll('.private-color-btn.selected, .private-bet-amount.selected').forEach(el => {
                el.classList.remove('selected');
            });

            // Reload user data
            if (window.gameManager) {
                await window.gameManager.loadUserData();
            }

            window.authManager?.showToast('Private bet placed successfully!', 'success');
            this.checkAndStartPrivateRound();
        } catch (error) {
            console.error('Error placing private bet:', error);
            window.authManager?.showToast(error.message || 'Error placing bet', 'error');
        } finally {
            this.privateBetInProgress = false;
            this.updatePrivatePlaceBetButton();
        }
    }

    async checkAndStartPrivateRound() {
        if (!this.currentRoom || this.currentPrivateRound || this.isProcessingPrivateResults) return;

        try {
            const waitingBets = await db.collection('privateBets')
                .where('roomId', '==', this.currentRoom.id)
                .where('status', '==', 'private-waiting')
                .get();

            const uniqueUsers = new Set();
            waitingBets.docs.forEach(doc => {
                uniqueUsers.add(doc.data().userId);
            });

            if (uniqueUsers.size >= 2) {
                await this.createPrivateRound();
            }
        } catch (error) {
            console.error('Error checking private round start:', error);
        }
    }

    async createPrivateRound() {
        if (!this.currentRoom || this.isProcessingPrivateResults) return;

        try {
            const roundData = {
                roomId: this.currentRoom.id,
                status: 'active',
                startTime: firebase.firestore.FieldValue.serverTimestamp(),
                duration: 30,
                type: 'private',
                processed: false
            };

            const roundRef = await db.collection('privateRounds').add(roundData);
            console.log('Private round created:', roundRef.id);
            
            // Move waiting bets to this round
            const waitingBets = await db.collection('privateBets')
                .where('roomId', '==', this.currentRoom.id)
                .where('status', '==', 'private-waiting')
                .get();

            if (!waitingBets.empty) {
                const batch = db.batch();
                waitingBets.docs.forEach(doc => {
                    batch.update(doc.ref, {
                        roundId: roundRef.id,
                        status: 'private-pending'
                    });
                });
                await batch.commit();
            }

            // Set timeout to end round
            setTimeout(async () => {
                if (!this.isProcessingPrivateResults) {
                    await this.endPrivateRound(roundRef.id);
                }
            }, 30000);
        } catch (error) {
            console.error('Error creating private round:', error);
        }
    }

    async endPrivateRound(roundId) {
        if (this.isProcessingPrivateResults) {
            console.log('Already processing private results, skipping...');
            return;
        }
        
        this.isProcessingPrivateResults = true;
        console.log(`Starting to end private round: ${roundId}`);

        try {
            const roundDoc = await db.collection('privateRounds').doc(roundId).get();
            if (!roundDoc.exists || roundDoc.data().status !== 'active') {
                console.log('Private round not found or not active');
                this.isProcessingPrivateResults = false;
                return;
            }

            const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
            const winningColor = colors[Math.floor(Math.random() * colors.length)];

            await db.collection('privateRounds').doc(roundId).update({
                status: 'completed',
                endTime: firebase.firestore.FieldValue.serverTimestamp(),
                winningColor: winningColor,
                processed: true
            });

            console.log(`Private round ${roundId} ended with winning color: ${winningColor}`);

            await this.processPrivateBetsOptimized(roundId, winningColor);

            // Wait before allowing new round
            setTimeout(() => {
                this.isProcessingPrivateResults = false;
                this.privateResultModalShown = false;
                this.checkAndStartPrivateRound();
            }, 8000);
        } catch (error) {
            console.error('Error ending private round:', error);
            this.isProcessingPrivateResults = false;
        }
    }

    async processPrivateBetsOptimized(roundId, winningColor) {
        try {
            const betsSnapshot = await db.collection('privateBets')
                .where('roundId', '==', roundId)
                .where('status', '==', 'private-pending')
                .get();

            if (betsSnapshot.empty) {
                console.log('No private bets to process');
                return;
            }

            const bets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const winningBets = bets.filter(bet => bet.color === winningColor);
            const losingBets = bets.filter(bet => bet.color !== winningColor);

            console.log(`Processing ${bets.length} private bets: ${winningBets.length} winners, ${losingBets.length} losers`);

            // Private room logic: 50% of losing amount distributed
            const totalLosingAmount = losingBets.reduce((sum, bet) => sum + bet.amount, 0);
            const distributionAmount = Math.floor(totalLosingAmount * 0.5);
            const winnersShare = Math.floor(distributionAmount * 0.5); // 25% to winners
            const roomAdminShare = Math.floor(distributionAmount * 0.5); // 25% to room admin

            console.log(`Private distribution: Total losing: ${totalLosingAmount}, Winners share: ${winnersShare}, Room admin share: ${roomAdminShare}`);

            // Process in batches
            const batches = this.chunkArray(bets, this.batchSize);
            
            for (const batchBets of batches) {
                await this.processPrivateBetBatch(batchBets, winningColor, winnersShare, winningBets);
            }

            // Give room admin their share
            if (roomAdminShare > 0 && this.currentRoom) {
                await this.distributeRoomAdminShare(roomAdminShare);
            }

            console.log('Private bet processing completed successfully');

        } catch (error) {
            console.error('Error processing private bets:', error);
        }
    }

    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    async processPrivateBetBatch(batchBets, winningColor, winnersShare, allWinningBets) {
        const batch = db.batch();

        for (const bet of batchBets) {
            const isWinner = bet.color === winningColor;
            const userRef = db.collection('users').doc(bet.userId);
            const betRef = db.collection('privateBets').doc(bet.id);

            if (isWinner) {
                let winAmount = bet.amount; // Return original bet
                
                if (allWinningBets.length > 0 && winnersShare > 0) {
                    const totalWinningAmount = allWinningBets.reduce((sum, b) => sum + b.amount, 0);
                    const proportion = bet.amount / totalWinningAmount;
                    const additionalWin = Math.floor(winnersShare * proportion);
                    winAmount += additionalWin;
                }

                batch.update(userRef, {
                    coins: firebase.firestore.FieldValue.increment(winAmount)
                });

                batch.update(betRef, {
                    status: 'private-won',
                    winAmount: winAmount,
                    processedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    processed: true
                });
            } else {
                // Losing bet - return 50%
                const lossAmount = Math.floor(bet.amount * 0.5);
                const returnAmount = bet.amount - lossAmount;

                batch.update(userRef, {
                    coins: firebase.firestore.FieldValue.increment(returnAmount)
                });

                batch.update(betRef, {
                    status: 'private-lost',
                    lostAmount: lossAmount,
                    returnedAmount: returnAmount,
                    processedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    processed: true
                });
            }
        }

        await batch.commit();
    }

    async distributeRoomAdminShare(roomAdminShare) {
        try {
            const adminRef = db.collection('users').doc(this.currentRoom.createdBy);
            const roomRef = db.collection('privateRooms').doc(this.currentRoom.id);
            
            await db.runTransaction(async (transaction) => {
                transaction.update(adminRef, {
                    coins: firebase.firestore.FieldValue.increment(roomAdminShare)
                });

                transaction.update(roomRef, {
                    totalEarnings: firebase.firestore.FieldValue.increment(roomAdminShare),
                    lastActivity: firebase.firestore.FieldValue.serverTimestamp()
                });
            });

            console.log(`Distributed ${roomAdminShare} coins to room admin`);
        } catch (error) {
            console.error('Error distributing room admin share:', error);
        }
    }

    listenToPrivateRounds() {
        if (!this.currentRoom) return;

        this.unsubscribePrivateRounds = db.collection('privateRounds')
            .where('roomId', '==', this.currentRoom.id)
            .where('status', '==', 'active')
            .limit(1)
            .onSnapshot((snapshot) => {
                if (!snapshot.empty) {
                    const roundDoc = snapshot.docs[0];
                    this.currentPrivateRound = { id: roundDoc.id, ...roundDoc.data() };
                    this.updatePrivateGameStatus();
                    this.startPrivateCountdown();
                } else {
                    this.currentPrivateRound = null;
                    this.updatePrivateGameStatus('waiting');
                    this.stopPrivateCountdown();
                }
            }, (error) => {
                console.error('Private rounds listener error:', error);
            });
    }

    updatePrivateGameStatus(status = null) {
        const statusText = document.getElementById('private-game-status-text');
        const playerCount = document.getElementById('private-player-count');
        
        if (!statusText) return;

        if (status === 'waiting' || !this.currentPrivateRound) {
            statusText.textContent = 'Waiting for players to bet...';
            if (playerCount) playerCount.textContent = '0 bets';
        } else if (this.currentPrivateRound) {
            statusText.textContent = 'Private round in progress!';
            if (playerCount) playerCount.textContent = 'Round active';
        }
    }

    startPrivateCountdown() {
        this.stopPrivateCountdown();

        if (!this.currentPrivateRound || !this.currentPrivateRound.startTime) return;

        const countdownElement = document.getElementById('private-countdown');
        if (!countdownElement) return;

        const updateCountdown = () => {
            try {
                const now = new Date().getTime();
                const startTime = this.currentPrivateRound.startTime.toDate().getTime();
                const elapsed = Math.floor((now - startTime) / 1000);
                const timeLeft = Math.max(0, 30 - elapsed);
                
                countdownElement.textContent = timeLeft;

                if (timeLeft <= 0) {
                    this.stopPrivateCountdown();
                }
            } catch (error) {
                console.error('Error updating private countdown:', error);
                this.stopPrivateCountdown();
            }
        };

        updateCountdown();
        this.roomCountdown = setInterval(updateCountdown, 1000);
    }

    stopPrivateCountdown() {
        if (this.roomCountdown) {
            clearInterval(this.roomCountdown);
            this.roomCountdown = null;
        }
    }

    async sendChatMessage() {
        const chatInput = document.getElementById('room-chat-input');
        if (!chatInput || !this.currentRoom) return;

        const message = chatInput.value.trim();
        if (!message) return;

        const currentUser = window.authManager?.getCurrentUser();
        if (!currentUser) return;

        try {
            const chatData = {
                roomId: this.currentRoom.id,
                userId: currentUser.uid,
                userName: currentUser.displayName || 'User',
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('roomChat').add(chatData);
            chatInput.value = '';
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    }

    loadRoomChat() {
        if (!this.currentRoom) return;

        this.unsubscribeRoomChat = db.collection('roomChat')
            .where('roomId', '==', this.currentRoom.id)
            .orderBy('timestamp', 'desc')
            .limit(50)
            .onSnapshot((snapshot) => {
                const messages = snapshot.docs.map(doc => doc.data()).reverse();
                this.updateChatMessages(messages);
            }, (error) => {
                console.error('Room chat listener error:', error);
            });
    }

    updateChatMessages(messages) {
        const container = document.getElementById('room-chat-messages');
        if (!container) return;

        if (messages.length === 0) {
            container.innerHTML = '<p class="no-messages">No messages yet</p>';
            return;
        }

        container.innerHTML = messages.map(msg => `
            <div class="chat-message">
                <div class="sender">${msg.userName}</div>
                <div class="content">${msg.message}</div>
                <div class="timestamp">${this.formatChatTime(msg.timestamp)}</div>
            </div>
        `).join('');

        container.scrollTop = container.scrollHeight;
    }

    formatChatTime(timestamp) {
        if (!timestamp) return '';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            return '';
        }
    }

    listenToRoomUpdates() {
        if (!this.currentRoom) return;

        this.unsubscribeRoomBets = db.collection('privateBets')
            .where('roomId', '==', this.currentRoom.id)
            .orderBy('timestamp', 'desc')
            .limit(50)
            .onSnapshot((snapshot) => {
                this.updatePrivateBetsList(snapshot.docs);
            }, (error) => {
                console.error('Room bets listener error:', error);
            });
    }

    updatePrivateBetsList(betDocs) {
        const container = document.getElementById('private-bets-list');
        if (!container) return;

        const bets = betDocs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(bet => bet.status.includes('private'))
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
                        <p>${bet.userName}</p>
                        <p>${bet.color.toUpperCase()}</p>
                    </div>
                </div>
                <div class="bet-amount-display">${bet.amount}</div>
            </div>
        `).join('');
    }

    exitRoom() {
        // Clean up all listeners
        if (this.unsubscribeRoom) {
            this.unsubscribeRoom();
            this.unsubscribeRoom = null;
        }
        if (this.unsubscribeRoomBets) {
            this.unsubscribeRoomBets();
            this.unsubscribeRoomBets = null;
        }
        if (this.unsubscribeRoomChat) {
            this.unsubscribeRoomChat();
            this.unsubscribeRoomChat = null;
        }
        if (this.unsubscribePrivateRounds) {
            this.unsubscribePrivateRounds();
            this.unsubscribePrivateRounds = null;
        }
        this.stopPrivateCountdown();

        this.currentRoom = null;
        this.currentPrivateRound = null;
        this.selectedPrivateColor = null;
        this.selectedPrivateBetAmount = null;
        this.privateBetInProgress = false;
        this.isProcessingPrivateResults = false;
        this.privateResultModalShown = false;
        
        this.resetPrivateTab();
        this.loadPrivateRooms();
    }

    resetPrivateTab() {
        const privateTab = document.getElementById('private-tab');
        if (!privateTab) return;

        privateTab.innerHTML = `
            <div class="private-games">
                <div class="create-private">
                    <h3>Create Private Room</h3>
                    <div class="input-group">
                        <span class="material-icons">meeting_room</span>
                        <input type="text" id="room-name" placeholder="Room Name" maxlength="30">
                    </div>
                    <div class="input-group">
                        <span class="material-icons">lock</span>
                        <input type="password" id="room-password" placeholder="Room Password (Optional)" maxlength="20">
                    </div>
                    <button class="create-room-btn" id="create-room-btn">
                        <span class="material-icons">add</span>
                        Create Room
                    </button>
                </div>

                <div class="join-private">
                    <h3>Join Private Room</h3>
                    <div class="input-group">
                        <span class="material-icons">vpn_key</span>
                        <input type="text" id="join-room-code" placeholder="Room Code" maxlength="6" style="text-transform: uppercase;">
                    </div>
                    <div class="input-group">
                        <span class="material-icons">lock</span>
                        <input type="password" id="join-room-password" placeholder="Password (if required)" maxlength="20">
                    </div>
                    <button class="join-room-btn" id="join-room-btn">
                        <span class="material-icons">login</span>
                        Join Room
                    </button>
                </div>

                <div class="private-rooms-list">
                    <h3>Your Private Rooms</h3>
                    <div id="private-rooms" class="rooms-list">
                        <p class="no-rooms">No private rooms yet</p>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    async leaveRoom(roomId) {
        const currentUser = window.authManager?.getCurrentUser();
        if (!currentUser) return;

        try {
            await db.collection('privateRooms').doc(roomId).update({
                players: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });

            window.authManager?.showToast('Left room successfully', 'info');
            this.loadPrivateRooms();
        } catch (error) {
            console.error('Error leaving room:', error);
            window.authManager?.showToast('Error leaving room', 'error');
        }
    }

    async deleteRoom(roomId) {
        if (!confirm('Are you sure you want to delete this room?')) return;

        try {
            await db.collection('privateRooms').doc(roomId).update({
                isActive: false,
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });

            window.authManager?.showToast('Room deleted successfully', 'info');
            this.loadPrivateRooms();
        } catch (error) {
            console.error('Error deleting room:', error);
            window.authManager?.showToast('Error deleting room', 'error');
        }
    }

    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    destroy() {
        if (this.unsubscribeRoom) this.unsubscribeRoom();
        if (this.unsubscribeRoomBets) this.unsubscribeRoomBets();
        if (this.unsubscribeRoomChat) this.unsubscribeRoomChat();
        if (this.unsubscribePrivateRounds) this.unsubscribePrivateRounds();
        this.stopPrivateCountdown();
        
        this.privateBetInProgress = false;
        this.isProcessingPrivateResults = false;
        this.privateResultModalShown = false;
    }
}

// Initialize private rooms manager
window.privateRoomsManager = new PrivateRoomsManager();