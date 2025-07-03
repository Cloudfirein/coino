class LeaderboardManager {
    constructor() {
        this.currentTab = 'coins';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Leaderboard button
        const leaderboardBtn = document.getElementById('leaderboard-btn');
        if (leaderboardBtn) {
            leaderboardBtn.addEventListener('click', () => {
                this.openLeaderboardModal();
            });
        }

        // Close leaderboard modal
        const closeLeaderboardBtn = document.getElementById('close-leaderboard');
        if (closeLeaderboardBtn) {
            closeLeaderboardBtn.addEventListener('click', () => {
                this.closeLeaderboardModal();
            });
        }

        // Leaderboard tabs
        document.querySelectorAll('.leaderboard-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchLeaderboardTab(tabName);
            });
        });
    }

    async openLeaderboardModal() {
        document.getElementById('leaderboard-modal').classList.remove('hidden');
        await this.loadLeaderboard(this.currentTab);
    }

    closeLeaderboardModal() {
        document.getElementById('leaderboard-modal').classList.add('hidden');
    }

    switchLeaderboardTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.leaderboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Load leaderboard data
        this.loadLeaderboard(tabName);
    }

    async loadLeaderboard(type) {
        const container = document.getElementById('leaderboard-list');
        if (!container) return;

        try {
            container.innerHTML = '<div class="loading-leaderboard">Loading...</div>';

            let query;
            let sortField;
            let title;

            switch (type) {
                case 'coins':
                    query = db.collection('users')
                        .where('isAdmin', '==', false)
                        .orderBy('coins', 'desc')
                        .limit(50);
                    sortField = 'coins';
                    title = 'Top Coin Holders';
                    break;
                case 'wins':
                    query = db.collection('users')
                        .where('isAdmin', '==', false)
                        .orderBy('totalWins', 'desc')
                        .limit(50);
                    sortField = 'totalWins';
                    title = 'Most Wins';
                    break;
                case 'winrate':
                    query = db.collection('users')
                        .where('isAdmin', '==', false)
                        .where('totalWins', '>', 0)
                        .orderBy('winRate', 'desc')
                        .limit(50);
                    sortField = 'winRate';
                    title = 'Highest Win Rate';
                    break;
                default:
                    return;
            }

            const snapshot = await query.get();
            
            if (snapshot.empty) {
                container.innerHTML = '<div class="no-leaderboard-data">No data available</div>';
                return;
            }

            const users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Get current user for highlighting
            const currentUser = window.authManager.getCurrentUser();
            
            container.innerHTML = `
                <div class="leaderboard-header">
                    <h3>${title}</h3>
                </div>
                <div class="leaderboard-items">
                    ${users.map((user, index) => this.renderLeaderboardItem(user, index + 1, sortField, currentUser?.uid === user.id)).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            container.innerHTML = '<div class="leaderboard-error">Error loading leaderboard</div>';
        }
    }

    renderLeaderboardItem(user, rank, sortField, isCurrentUser) {
        let value;
        let icon;

        switch (sortField) {
            case 'coins':
                value = user.coins.toLocaleString();
                icon = 'monetization_on';
                break;
            case 'totalWins':
                value = user.totalWins.toLocaleString();
                icon = 'emoji_events';
                break;
            case 'winRate':
                value = `${user.winRate}%`;
                icon = 'percent';
                break;
            default:
                value = '0';
                icon = 'help';
        }

        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        const currentUserClass = isCurrentUser ? 'current-user' : '';

        return `
            <div class="leaderboard-item ${rankClass} ${currentUserClass}">
                <div class="rank-info">
                    <div class="rank-number">${rank}</div>
                    <div class="user-info">
                        <img src="${user.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'}" 
                             alt="Avatar" class="leaderboard-avatar">
                        <div class="user-details">
                            <p class="user-name">${user.displayName || 'User'}</p>
                            <p class="user-username">@${user.username || 'user'}</p>
                        </div>
                    </div>
                </div>
                <div class="leaderboard-value">
                    <span class="material-icons">${icon}</span>
                    <span class="value">${value}</span>
                </div>
            </div>
        `;
    }
}

// Initialize leaderboard manager
window.leaderboardManager = new LeaderboardManager();