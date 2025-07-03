// Advanced Admin Dashboard with AI Integration
class AdminDashboard {
    constructor() {
        this.isVisible = false;
        this.currentSection = 'overview';
        this.refreshInterval = null;
        this.realTimeListeners = new Map();
        this.aiMetrics = null;
        this.systemMetrics = null;
        this.init();
    }

    init() {
        this.createDashboardHTML();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    createDashboardHTML() {
        const dashboardHTML = `
            <div id="admin-dashboard" class="admin-dashboard hidden">
                <div class="dashboard-overlay" onclick="window.adminDashboard.hide()"></div>
                <div class="dashboard-container">
                    <div class="dashboard-header">
                        <h1>🛡️ Admin Control Center</h1>
                        <div class="header-actions">
                            <button class="dashboard-btn refresh-btn" onclick="window.adminDashboard.refreshAll()">
                                <span class="material-icons">refresh</span>
                                Refresh
                            </button>
                            <button class="dashboard-btn close-btn" onclick="window.adminDashboard.hide()">
                                <span class="material-icons">close</span>
                            </button>
                        </div>
                    </div>

                    <div class="dashboard-nav">
                        <button class="nav-btn active" data-section="overview">
                            <span class="material-icons">dashboard</span>
                            Overview
                        </button>
                        <button class="nav-btn" data-section="ai-control">
                            <span class="material-icons">psychology</span>
                            AI Control
                        </button>
                        <button class="nav-btn" data-section="user-management">
                            <span class="material-icons">people</span>
                            Users
                        </button>
                        <button class="nav-btn" data-section="game-control">
                            <span class="material-icons">casino</span>
                            Game Control
                        </button>
                        <button class="nav-btn" data-section="system-health">
                            <span class="material-icons">health_and_safety</span>
                            System Health
                        </button>
                        <button class="nav-btn" data-section="analytics">
                            <span class="material-icons">analytics</span>
                            Analytics
                        </button>
                        <button class="nav-btn" data-section="settings">
                            <span class="material-icons">settings</span>
                            Settings
                        </button>
                    </div>

                    <div class="dashboard-content">
                        <!-- Overview Section -->
                        <div id="overview-section" class="dashboard-section active">
                            <div class="metrics-grid">
                                <div class="metric-card">
                                    <div class="metric-icon">
                                        <span class="material-icons">people</span>
                                    </div>
                                    <div class="metric-info">
                                        <h3 id="total-users">0</h3>
                                        <p>Total Users</p>
                                        <span class="metric-change" id="users-change">+0%</span>
                                    </div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon">
                                        <span class="material-icons">casino</span>
                                    </div>
                                    <div class="metric-info">
                                        <h3 id="total-rounds">0</h3>
                                        <p>Total Rounds</p>
                                        <span class="metric-change" id="rounds-change">+0%</span>
                                    </div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon">
                                        <span class="material-icons">monetization_on</span>
                                    </div>
                                    <div class="metric-info">
                                        <h3 id="total-bets">0</h3>
                                        <p>Total Bets</p>
                                        <span class="metric-change" id="bets-change">+0%</span>
                                    </div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon">
                                        <span class="material-icons">psychology</span>
                                    </div>
                                    <div class="metric-info">
                                        <h3 id="ai-health">100%</h3>
                                        <p>AI Health</p>
                                        <span class="metric-change" id="ai-change">Optimal</span>
                                    </div>
                                </div>
                            </div>

                            <div class="overview-charts">
                                <div class="chart-container">
                                    <h3>System Performance</h3>
                                    <div id="performance-chart" class="chart-placeholder">
                                        <p>Performance metrics will be displayed here</p>
                                    </div>
                                </div>
                                <div class="chart-container">
                                    <h3>User Activity</h3>
                                    <div id="activity-chart" class="chart-placeholder">
                                        <p>User activity metrics will be displayed here</p>
                                    </div>
                                </div>
                            </div>

                            <div class="recent-activity">
                                <h3>Recent System Events</h3>
                                <div id="recent-events" class="events-list">
                                    <div class="loading">Loading events...</div>
                                </div>
                            </div>
                        </div>

                        <!-- AI Control Section -->
                        <div id="ai-control-section" class="dashboard-section">
                            <div class="ai-status-grid">
                                <div class="ai-status-card">
                                    <h3>🤖 AI System Status</h3>
                                    <div id="ai-system-status" class="status-indicator">
                                        <span class="status-dot active"></span>
                                        <span>Operational</span>
                                    </div>
                                    <div class="ai-metrics">
                                        <div class="ai-metric">
                                            <span>Learning Rate:</span>
                                            <span id="ai-learning-rate">0.1</span>
                                        </div>
                                        <div class="ai-metric">
                                            <span>Prediction Accuracy:</span>
                                            <span id="ai-accuracy">75%</span>
                                        </div>
                                        <div class="ai-metric">
                                            <span>Healing Actions:</span>
                                            <span id="ai-healing-count">0</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="ai-control-card">
                                    <h3>🔧 AI Controls</h3>
                                    <div class="control-group">
                                        <label class="toggle-label">
                                            <input type="checkbox" id="ai-healing-toggle" checked>
                                            <span class="toggle-slider"></span>
                                            Self-Healing
                                        </label>
                                        <label class="toggle-label">
                                            <input type="checkbox" id="ai-optimization-toggle" checked>
                                            <span class="toggle-slider"></span>
                                            Auto-Optimization
                                        </label>
                                        <label class="toggle-label">
                                            <input type="checkbox" id="ai-learning-toggle" checked>
                                            <span class="toggle-slider"></span>
                                            Learning Mode
                                        </label>
                                    </div>
                                    <div class="ai-actions">
                                        <button class="ai-action-btn" onclick="window.adminDashboard.triggerAIAnalysis()">
                                            <span class="material-icons">analytics</span>
                                            Trigger Analysis
                                        </button>
                                        <button class="ai-action-btn" onclick="window.adminDashboard.resetAILearning()">
                                            <span class="material-icons">refresh</span>
                                            Reset Learning
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="ai-insights">
                                <h3>🧠 AI Insights</h3>
                                <div id="ai-insights-list" class="insights-list">
                                    <div class="loading">Loading AI insights...</div>
                                </div>
                            </div>

                            <div class="ai-predictions">
                                <h3>🔮 AI Predictions</h3>
                                <div id="ai-predictions-list" class="predictions-list">
                                    <div class="loading">Loading predictions...</div>
                                </div>
                            </div>

                            <div class="ai-learning-data">
                                <h3>📚 Learning Models</h3>
                                <div id="ai-models-status" class="models-grid">
                                    <div class="loading">Loading model data...</div>
                                </div>
                            </div>
                        </div>

                        <!-- User Management Section -->
                        <div id="user-management-section" class="dashboard-section">
                            <div class="user-controls">
                                <div class="search-bar">
                                    <input type="text" id="user-search" placeholder="Search users...">
                                    <button onclick="window.adminDashboard.searchUsers()">
                                        <span class="material-icons">search</span>
                                    </button>
                                </div>
                                <div class="user-actions">
                                    <button class="action-btn" onclick="window.adminDashboard.showGiftCoinsModal()">
                                        <span class="material-icons">card_giftcard</span>
                                        Gift Coins
                                    </button>
                                    <button class="action-btn" onclick="window.adminDashboard.exportUserData()">
                                        <span class="material-icons">download</span>
                                        Export Data
                                    </button>
                                    <button class="action-btn danger" onclick="window.adminDashboard.resetAllUserCoins()">
                                        <span class="material-icons">refresh</span>
                                        Reset All Coins
                                    </button>
                                </div>
                            </div>

                            <div class="users-table-container">
                                <table class="users-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Coins</th>
                                            <th>Win Rate</th>
                                            <th>Last Active</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="users-table-body">
                                        <tr>
                                            <td colspan="6" class="loading">Loading users...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="pagination">
                                <button id="prev-page" onclick="window.adminDashboard.previousPage()">Previous</button>
                                <span id="page-info">Page 1 of 1</span>
                                <button id="next-page" onclick="window.adminDashboard.nextPage()">Next</button>
                            </div>
                        </div>

                        <!-- Game Control Section -->
                        <div id="game-control-section" class="dashboard-section">
                            <div class="game-controls">
                                <div class="control-card">
                                    <h3>🎮 Round Management</h3>
                                    <div class="control-actions">
                                        <button class="control-btn" onclick="window.adminDashboard.forceNewRound()">
                                            <span class="material-icons">add_circle</span>
                                            Force New Round
                                        </button>
                                        <button class="control-btn" onclick="window.adminDashboard.endCurrentRound()">
                                            <span class="material-icons">stop</span>
                                            End Current Round
                                        </button>
                                        <button class="control-btn" onclick="window.adminDashboard.processStuckResults()">
                                            <span class="material-icons">build</span>
                                            Process Stuck Results
                                        </button>
                                    </div>
                                </div>

                                <div class="control-card">
                                    <h3>🎯 Game Settings</h3>
                                    <div class="setting-group">
                                        <label>Round Duration (seconds):</label>
                                        <input type="number" id="round-duration" value="30" min="10" max="120">
                                    </div>
                                    <div class="setting-group">
                                        <label>Min Bet Amount:</label>
                                        <input type="number" id="min-bet" value="1" min="1" max="100">
                                    </div>
                                    <div class="setting-group">
                                        <label>Max Bet Amount:</label>
                                        <input type="number" id="max-bet" value="500" min="100" max="10000">
                                    </div>
                                    <button class="save-settings-btn" onclick="window.adminDashboard.saveGameSettings()">
                                        Save Settings
                                    </button>
                                </div>
                            </div>

                            <div class="game-statistics">
                                <h3>📊 Game Statistics</h3>
                                <div id="game-stats" class="stats-grid">
                                    <div class="loading">Loading game statistics...</div>
                                </div>
                            </div>

                            <div class="color-distribution">
                                <h3>🎨 Color Win Distribution</h3>
                                <div id="color-chart" class="chart-placeholder">
                                    <p>Color distribution chart will be displayed here</p>
                                </div>
                            </div>
                        </div>

                        <!-- System Health Section -->
                        <div id="system-health-section" class="dashboard-section">
                            <div class="health-overview">
                                <div class="health-card">
                                    <h3>🏥 System Health</h3>
                                    <div class="health-indicator">
                                        <div class="health-circle" id="health-circle">
                                            <span id="health-percentage">100%</span>
                                        </div>
                                        <div class="health-status">
                                            <span id="health-status-text">All Systems Operational</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="performance-metrics">
                                    <h3>⚡ Performance Metrics</h3>
                                    <div class="metrics-list">
                                        <div class="metric-item">
                                            <span>Response Time:</span>
                                            <span id="response-time">0ms</span>
                                        </div>
                                        <div class="metric-item">
                                            <span>Error Rate:</span>
                                            <span id="error-rate">0%</span>
                                        </div>
                                        <div class="metric-item">
                                            <span>Throughput:</span>
                                            <span id="throughput">0 req/s</span>
                                        </div>
                                        <div class="metric-item">
                                            <span>Database Load:</span>
                                            <span id="db-load">0ms</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="healing-history">
                                <h3>🔧 Self-Healing History</h3>
                                <div id="healing-history-list" class="healing-list">
                                    <div class="loading">Loading healing history...</div>
                                </div>
                            </div>

                            <div class="error-logs">
                                <h3>🚨 Error Logs</h3>
                                <div id="error-logs-list" class="logs-list">
                                    <div class="loading">Loading error logs...</div>
                                </div>
                            </div>
                        </div>

                        <!-- Analytics Section -->
                        <div id="analytics-section" class="dashboard-section">
                            <div class="analytics-filters">
                                <select id="analytics-timeframe">
                                    <option value="24h">Last 24 Hours</option>
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                    <option value="90d">Last 90 Days</option>
                                </select>
                                <button onclick="window.adminDashboard.refreshAnalytics()">
                                    <span class="material-icons">refresh</span>
                                    Refresh
                                </button>
                            </div>

                            <div class="analytics-grid">
                                <div class="analytics-card">
                                    <h3>📈 User Growth</h3>
                                    <div id="user-growth-chart" class="chart-placeholder">
                                        <p>User growth chart will be displayed here</p>
                                    </div>
                                </div>
                                <div class="analytics-card">
                                    <h3>💰 Revenue Analytics</h3>
                                    <div id="revenue-chart" class="chart-placeholder">
                                        <p>Revenue analytics will be displayed here</p>
                                    </div>
                                </div>
                                <div class="analytics-card">
                                    <h3>🎯 User Engagement</h3>
                                    <div id="engagement-chart" class="chart-placeholder">
                                        <p>Engagement metrics will be displayed here</p>
                                    </div>
                                </div>
                                <div class="analytics-card">
                                    <h3>🔄 Retention Rate</h3>
                                    <div id="retention-chart" class="chart-placeholder">
                                        <p>Retention rate chart will be displayed here</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Settings Section -->
                        <div id="settings-section" class="dashboard-section">
                            <div class="settings-grid">
                                <div class="settings-card">
                                    <h3>🔧 System Settings</h3>
                                    <div class="setting-group">
                                        <label class="toggle-label">
                                            <input type="checkbox" id="maintenance-mode">
                                            <span class="toggle-slider"></span>
                                            Maintenance Mode
                                        </label>
                                    </div>
                                    <div class="setting-group">
                                        <label class="toggle-label">
                                            <input type="checkbox" id="new-registrations" checked>
                                            <span class="toggle-slider"></span>
                                            Allow New Registrations
                                        </label>
                                    </div>
                                    <div class="setting-group">
                                        <label>System Message:</label>
                                        <textarea id="system-message" placeholder="Enter system-wide message..."></textarea>
                                    </div>
                                </div>

                                <div class="settings-card">
                                    <h3>🤖 AI Configuration</h3>
                                    <div class="setting-group">
                                        <label>Learning Rate:</label>
                                        <input type="range" id="ai-learning-rate-slider" min="0.01" max="1" step="0.01" value="0.1">
                                        <span id="learning-rate-value">0.1</span>
                                    </div>
                                    <div class="setting-group">
                                        <label>Healing Sensitivity:</label>
                                        <input type="range" id="healing-sensitivity" min="0.1" max="1" step="0.1" value="0.7">
                                        <span id="healing-sensitivity-value">0.7</span>
                                    </div>
                                    <div class="setting-group">
                                        <label>Prediction Accuracy Target:</label>
                                        <input type="range" id="prediction-target" min="0.5" max="0.95" step="0.05" value="0.75">
                                        <span id="prediction-target-value">75%</span>
                                    </div>
                                </div>

                                <div class="settings-card">
                                    <h3>💾 Data Management</h3>
                                    <div class="data-actions">
                                        <button class="data-btn" onclick="window.adminDashboard.backupData()">
                                            <span class="material-icons">backup</span>
                                            Backup Data
                                        </button>
                                        <button class="data-btn" onclick="window.adminDashboard.optimizeDatabase()">
                                            <span class="material-icons">speed</span>
                                            Optimize Database
                                        </button>
                                        <button class="data-btn danger" onclick="window.adminDashboard.cleanupOldData()">
                                            <span class="material-icons">delete_sweep</span>
                                            Cleanup Old Data
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="save-settings">
                                <button class="save-all-btn" onclick="window.adminDashboard.saveAllSettings()">
                                    <span class="material-icons">save</span>
                                    Save All Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gift Coins Modal -->
            <div id="gift-coins-modal" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🎁 Gift Coins</h2>
                        <button class="close-btn" onclick="window.adminDashboard.hideGiftCoinsModal()">
                            <span class="material-icons">close</span>
                        </button>
                    </div>
                    <div class="gift-form">
                        <div class="input-group">
                            <label>Recipient Type:</label>
                            <select id="gift-recipient-type">
                                <option value="user">Specific User</option>
                                <option value="all">All Users</option>
                                <option value="active">Active Users Only</option>
                            </select>
                        </div>
                        <div class="input-group" id="specific-user-group">
                            <label>Username/Email:</label>
                            <input type="text" id="gift-recipient" placeholder="Enter username or email">
                        </div>
                        <div class="input-group">
                            <label>Amount:</label>
                            <input type="number" id="gift-amount" min="1" max="10000" value="10">
                        </div>
                        <div class="input-group">
                            <label>Message:</label>
                            <textarea id="gift-message" placeholder="Optional message..."></textarea>
                        </div>
                        <div class="modal-actions">
                            <button class="modal-btn secondary" onclick="window.adminDashboard.hideGiftCoinsModal()">
                                Cancel
                            </button>
                            <button class="modal-btn primary" onclick="window.adminDashboard.sendGiftCoins()">
                                <span class="material-icons">send</span>
                                Send Gift
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.nav-btn').dataset.section;
                this.switchSection(section);
            });
        });

        // AI Controls
        document.getElementById('ai-healing-toggle')?.addEventListener('change', (e) => {
            this.updateAIConfig('healingEnabled', e.target.checked);
        });

        document.getElementById('ai-optimization-toggle')?.addEventListener('change', (e) => {
            this.updateAIConfig('autoOptimization', e.target.checked);
        });

        document.getElementById('ai-learning-toggle')?.addEventListener('change', (e) => {
            this.updateAIConfig('learningEnabled', e.target.checked);
        });

        // Settings sliders
        document.getElementById('ai-learning-rate-slider')?.addEventListener('input', (e) => {
            document.getElementById('learning-rate-value').textContent = e.target.value;
        });

        document.getElementById('healing-sensitivity')?.addEventListener('input', (e) => {
            document.getElementById('healing-sensitivity-value').textContent = e.target.value;
        });

        document.getElementById('prediction-target')?.addEventListener('input', (e) => {
            document.getElementById('prediction-target-value').textContent = (e.target.value * 100) + '%';
        });

        // Gift recipient type change
        document.getElementById('gift-recipient-type')?.addEventListener('change', (e) => {
            const specificUserGroup = document.getElementById('specific-user-group');
            if (e.target.value === 'user') {
                specificUserGroup.style.display = 'block';
            } else {
                specificUserGroup.style.display = 'none';
            }
        });
    }

    show() {
        this.isVisible = true;
        document.getElementById('admin-dashboard').classList.remove('hidden');
        this.refreshAll();
        this.startRealTimeUpdates();
    }

    hide() {
        this.isVisible = false;
        document.getElementById('admin-dashboard').classList.add('hidden');
        this.stopRealTimeUpdates();
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.dashboard-section').forEach(section => section.classList.remove('active'));
        document.getElementById(`${sectionName}-section`).classList.add('active');

        this.currentSection = sectionName;
        this.loadSectionData(sectionName);
    }

    async loadSectionData(sectionName) {
        switch (sectionName) {
            case 'overview':
                await this.loadOverviewData();
                break;
            case 'ai-control':
                await this.loadAIControlData();
                break;
            case 'user-management':
                await this.loadUserManagementData();
                break;
            case 'game-control':
                await this.loadGameControlData();
                break;
            case 'system-health':
                await this.loadSystemHealthData();
                break;
            case 'analytics':
                await this.loadAnalyticsData();
                break;
            case 'settings':
                await this.loadSettingsData();
                break;
        }
    }

    async loadOverviewData() {
        try {
            const [users, rounds, bets] = await Promise.all([
                window.db.collection('users').get(),
                window.realtimeDb.collection('rounds').get(),
                window.realtimeDb.collection('bets').get()
            ]);

            document.getElementById('total-users').textContent = users.size;
            document.getElementById('total-rounds').textContent = rounds.size;
            document.getElementById('total-bets').textContent = bets.size;

            // AI Health
            if (window.aiSystem) {
                const aiStatus = window.aiSystem.getSystemStatus();
                const healthPercentage = aiStatus.isInitialized ? 100 : 0;
                document.getElementById('ai-health').textContent = `${healthPercentage}%`;
            }

            // Load recent events
            await this.loadRecentEvents();

        } catch (error) {
            console.error('Error loading overview data:', error);
        }
    }

    async loadAIControlData() {
        try {
            if (!window.aiSystem) {
                document.getElementById('ai-system-status').innerHTML = `
                    <span class="status-dot inactive"></span>
                    <span>Not Available</span>
                `;
                return;
            }

            const aiStatus = window.aiSystem.getSystemStatus();
            
            // Update AI metrics
            document.getElementById('ai-learning-rate').textContent = aiStatus.config.learningRate;
            document.getElementById('ai-accuracy').textContent = `${Math.round(aiStatus.config.predictionAccuracy * 100)}%`;
            document.getElementById('ai-healing-count').textContent = aiStatus.healingStatus.recentActions.length;

            // Update toggles
            document.getElementById('ai-healing-toggle').checked = aiStatus.config.healingEnabled;
            document.getElementById('ai-optimization-toggle').checked = aiStatus.config.autoOptimization;

            // Load AI insights
            const insights = await window.aiSystem.getAIInsights();
            this.displayAIInsights(insights);

            // Load predictions
            const predictions = await window.aiSystem.getPredictions();
            this.displayAIPredictions(predictions);

            // Load model status
            this.displayAIModels(aiStatus.modelSizes);

        } catch (error) {
            console.error('Error loading AI control data:', error);
        }
    }

    async loadUserManagementData() {
        try {
            const users = await window.db.collection('users')
                .orderBy('createdAt', 'desc')
                .limit(50)
                .get();

            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '';

            users.docs.forEach(doc => {
                const user = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="user-cell">
                            <img src="${user.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'}" alt="Avatar" class="user-avatar-small">
                            <div>
                                <div class="user-name">${user.displayName || 'Unknown'}</div>
                                <div class="user-username">@${user.username || 'unknown'}</div>
                            </div>
                        </div>
                    </td>
                    <td>${user.email}</td>
                    <td>
                        <span class="coin-amount">${user.isAdmin ? '∞' : user.coins.toLocaleString()}</span>
                    </td>
                    <td>${user.winRate || 0}%</td>
                    <td>${this.formatDate(user.lastActive)}</td>
                    <td>
                        <div class="user-actions">
                            <button class="action-btn-small" onclick="window.adminDashboard.editUser('${doc.id}')">
                                <span class="material-icons">edit</span>
                            </button>
                            <button class="action-btn-small" onclick="window.adminDashboard.giftCoinsToUser('${doc.id}')">
                                <span class="material-icons">card_giftcard</span>
                            </button>
                            ${!user.isAdmin ? `
                                <button class="action-btn-small danger" onclick="window.adminDashboard.suspendUser('${doc.id}')">
                                    <span class="material-icons">block</span>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading user management data:', error);
        }
    }

    async loadGameControlData() {
        try {
            // Load game statistics
            const [rounds, bets] = await Promise.all([
                window.realtimeDb.collection('rounds').where('status', '==', 'completed').get(),
                window.realtimeDb.collection('bets').get()
            ]);

            const completedRounds = rounds.docs.map(doc => doc.data());
            const allBets = bets.docs.map(doc => doc.data());

            // Calculate statistics
            const totalWinnings = allBets
                .filter(bet => bet.status === 'won')
                .reduce((sum, bet) => sum + (bet.winAmount || 0), 0);

            const totalLosses = allBets
                .filter(bet => bet.status === 'lost')
                .reduce((sum, bet) => sum + (bet.lostAmount || 0), 0);

            const colorDistribution = {};
            completedRounds.forEach(round => {
                const color = round.winningColor;
                colorDistribution[color] = (colorDistribution[color] || 0) + 1;
            });

            // Display statistics
            const statsContainer = document.getElementById('game-stats');
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Completed Rounds:</span>
                    <span class="stat-value">${completedRounds.length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Bets:</span>
                    <span class="stat-value">${allBets.length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Winnings:</span>
                    <span class="stat-value">${totalWinnings.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Losses:</span>
                    <span class="stat-value">${totalLosses.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">House Edge:</span>
                    <span class="stat-value">${((totalLosses - totalWinnings) / Math.max(totalLosses, 1) * 100).toFixed(2)}%</span>
                </div>
            `;

            // Display color distribution
            this.displayColorDistribution(colorDistribution);

        } catch (error) {
            console.error('Error loading game control data:', error);
        }
    }

    async loadSystemHealthData() {
        try {
            if (window.aiSystem) {
                const healthMetrics = await window.aiSystem.getHealthMetrics();
                const systemStatus = window.aiSystem.getSystemStatus();

                // Update health percentage
                const healthPercentage = systemStatus.isInitialized ? 100 : 0;
                document.getElementById('health-percentage').textContent = `${healthPercentage}%`;
                document.getElementById('health-status-text').textContent = 
                    systemStatus.isInitialized ? 'All Systems Operational' : 'System Issues Detected';

                // Update performance metrics
                document.getElementById('response-time').textContent = `${systemStatus.metrics.betProcessingTime.slice(-1)[0] || 0}ms`;
                document.getElementById('error-rate').textContent = `${(systemStatus.metrics.systemErrors.length / 100 * 100).toFixed(1)}%`;
                document.getElementById('throughput').textContent = '0 req/s'; // Placeholder
                document.getElementById('db-load').textContent = '0ms'; // Placeholder

                // Display healing history
                this.displayHealingHistory(systemStatus.healingStatus.recentActions);

                // Display error logs
                this.displayErrorLogs(systemStatus.metrics.systemErrors.slice(-20));
            }

        } catch (error) {
            console.error('Error loading system health data:', error);
        }
    }

    async loadAnalyticsData() {
        try {
            const timeframe = document.getElementById('analytics-timeframe').value;
            const timeframeDays = {
                '24h': 1,
                '7d': 7,
                '30d': 30,
                '90d': 90
            };

            const days = timeframeDays[timeframe];
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

            // Load analytics data
            const [users, rounds, bets] = await Promise.all([
                window.db.collection('users').where('createdAt', '>', startDate).get(),
                window.realtimeDb.collection('rounds').where('startTime', '>', startDate).get(),
                window.realtimeDb.collection('bets').where('timestamp', '>', startDate).get()
            ]);

            // Process and display analytics
            this.displayUserGrowthChart(users.docs);
            this.displayRevenueChart(bets.docs);
            this.displayEngagementChart(users.docs, bets.docs);
            this.displayRetentionChart(users.docs);

        } catch (error) {
            console.error('Error loading analytics data:', error);
        }
    }

    async loadSettingsData() {
        try {
            // Load current settings
            if (window.aiSystem) {
                const aiStatus = window.aiSystem.getSystemStatus();
                
                document.getElementById('ai-learning-rate-slider').value = aiStatus.config.learningRate;
                document.getElementById('learning-rate-value').textContent = aiStatus.config.learningRate;
                
                document.getElementById('healing-sensitivity').value = aiStatus.config.errorDetectionSensitivity;
                document.getElementById('healing-sensitivity-value').textContent = aiStatus.config.errorDetectionSensitivity;
                
                document.getElementById('prediction-target').value = aiStatus.config.predictionAccuracy;
                document.getElementById('prediction-target-value').textContent = `${Math.round(aiStatus.config.predictionAccuracy * 100)}%`;
            }

        } catch (error) {
            console.error('Error loading settings data:', error);
        }
    }

    async loadRecentEvents() {
        try {
            const events = [];
            
            // Get recent rounds
            const recentRounds = await window.realtimeDb.collection('rounds')
                .orderBy('startTime', 'desc')
                .limit(10)
                .get();

            recentRounds.docs.forEach(doc => {
                const round = doc.data();
                events.push({
                    type: 'round',
                    message: `Round completed - Winner: ${round.winningColor}`,
                    timestamp: round.endTime || round.startTime,
                    icon: 'casino'
                });
            });

            // Get AI healing actions
            if (window.aiSystem) {
                const aiStatus = window.aiSystem.getSystemStatus();
                aiStatus.healingStatus.recentActions.forEach(action => {
                    events.push({
                        type: 'healing',
                        message: `AI Healing: ${action.type}`,
                        timestamp: { toDate: () => new Date(action.executedAt) },
                        icon: 'healing'
                    });
                });
            }

            // Sort by timestamp
            events.sort((a, b) => {
                const aTime = a.timestamp?.toDate?.()?.getTime() || 0;
                const bTime = b.timestamp?.toDate?.()?.getTime() || 0;
                return bTime - aTime;
            });

            // Display events
            const eventsContainer = document.getElementById('recent-events');
            eventsContainer.innerHTML = events.slice(0, 10).map(event => `
                <div class="event-item">
                    <div class="event-icon">
                        <span class="material-icons">${event.icon}</span>
                    </div>
                    <div class="event-content">
                        <div class="event-message">${event.message}</div>
                        <div class="event-time">${this.formatDate(event.timestamp)}</div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error loading recent events:', error);
        }
    }

    displayAIInsights(insights) {
        const container = document.getElementById('ai-insights-list');
        
        if (insights.length === 0) {
            container.innerHTML = '<div class="no-data">No AI insights available</div>';
            return;
        }

        container.innerHTML = insights.slice(0, 5).map(insight => `
            <div class="insight-item">
                <div class="insight-content">
                    <h4>${insight.title || 'AI Insight'}</h4>
                    <p>${insight.description || 'No description available'}</p>
                    <div class="insight-meta">
                        <span>Confidence: ${insight.confidence || 'N/A'}</span>
                        <span>${this.formatDate(insight.timestamp)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    displayAIPredictions(predictions) {
        const container = document.getElementById('ai-predictions-list');
        
        if (predictions.length === 0) {
            container.innerHTML = '<div class="no-data">No predictions available</div>';
            return;
        }

        container.innerHTML = predictions.slice(0, 5).map(prediction => `
            <div class="prediction-item">
                <div class="prediction-content">
                    <h4>System Prediction</h4>
                    <p>User activity prediction and system load forecasting</p>
                    <div class="prediction-meta">
                        <span>Accuracy: ${prediction.accuracy || 'N/A'}</span>
                        <span>${this.formatDate(prediction.timestamp)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    displayAIModels(modelSizes) {
        const container = document.getElementById('ai-models-status');
        
        container.innerHTML = Object.entries(modelSizes).map(([modelName, size]) => `
            <div class="model-item">
                <div class="model-name">${modelName.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div class="model-size">${size} entries</div>
                <div class="model-status">
                    <span class="status-dot active"></span>
                    Active
                </div>
            </div>
        `).join('');
    }

    displayColorDistribution(colorDistribution) {
        const container = document.getElementById('color-chart');
        const total = Object.values(colorDistribution).reduce((sum, count) => sum + count, 0);
        
        if (total === 0) {
            container.innerHTML = '<div class="no-data">No color data available</div>';
            return;
        }

        container.innerHTML = Object.entries(colorDistribution).map(([color, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            return `
                <div class="color-stat">
                    <div class="color-indicator" style="background-color: ${color}"></div>
                    <span class="color-name">${color.charAt(0).toUpperCase() + color.slice(1)}</span>
                    <span class="color-count">${count} (${percentage}%)</span>
                </div>
            `;
        }).join('');
    }

    displayHealingHistory(healingActions) {
        const container = document.getElementById('healing-history-list');
        
        if (healingActions.length === 0) {
            container.innerHTML = '<div class="no-data">No healing actions recorded</div>';
            return;
        }

        container.innerHTML = healingActions.slice(0, 10).map(action => `
            <div class="healing-item">
                <div class="healing-icon">
                    <span class="material-icons">${action.success ? 'check_circle' : 'error'}</span>
                </div>
                <div class="healing-content">
                    <div class="healing-type">${action.type}</div>
                    <div class="healing-time">${this.formatDate({ toDate: () => new Date(action.executedAt) })}</div>
                    <div class="healing-status ${action.success ? 'success' : 'failed'}">
                        ${action.success ? 'Success' : 'Failed'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    displayErrorLogs(errors) {
        const container = document.getElementById('error-logs-list');
        
        if (errors.length === 0) {
            container.innerHTML = '<div class="no-data">No recent errors</div>';
            return;
        }

        container.innerHTML = errors.map(error => `
            <div class="error-item">
                <div class="error-severity ${error.severity.toLowerCase()}">${error.severity}</div>
                <div class="error-content">
                    <div class="error-type">${error.type}</div>
                    <div class="error-message">${error.error || error.message || 'No message'}</div>
                    <div class="error-time">${this.formatDate({ toDate: () => new Date(error.timestamp) })}</div>
                </div>
            </div>
        `).join('');
    }

    displayUserGrowthChart(users) {
        const container = document.getElementById('user-growth-chart');
        container.innerHTML = `<div class="chart-placeholder">User growth: ${users.length} new users</div>`;
    }

    displayRevenueChart(bets) {
        const container = document.getElementById('revenue-chart');
        const totalRevenue = bets.reduce((sum, bet) => sum + (bet.data().amount || 0), 0);
        container.innerHTML = `<div class="chart-placeholder">Total revenue: ${totalRevenue.toLocaleString()} coins</div>`;
    }

    displayEngagementChart(users, bets) {
        const container = document.getElementById('engagement-chart');
        const avgBetsPerUser = users.length > 0 ? (bets.length / users.length).toFixed(1) : 0;
        container.innerHTML = `<div class="chart-placeholder">Avg bets per user: ${avgBetsPerUser}</div>`;
    }

    displayRetentionChart(users) {
        const container = document.getElementById('retention-chart');
        const activeUsers = users.filter(user => {
            const lastActive = user.data().lastActive;
            return lastActive && (Date.now() - lastActive.toDate().getTime()) < 86400000; // 24 hours
        });
        const retentionRate = users.length > 0 ? ((activeUsers.length / users.length) * 100).toFixed(1) : 0;
        container.innerHTML = `<div class="chart-placeholder">Retention rate: ${retentionRate}%</div>`;
    }

    startRealTimeUpdates() {
        if (this.refreshInterval) return;
        
        this.refreshInterval = setInterval(() => {
            if (this.isVisible) {
                this.loadSectionData(this.currentSection);
            }
        }, 30000); // Update every 30 seconds
    }

    stopRealTimeUpdates() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        // Clean up real-time listeners
        this.realTimeListeners.forEach(unsubscribe => unsubscribe());
        this.realTimeListeners.clear();
    }

    async refreshAll() {
        await this.loadSectionData(this.currentSection);
    }

    async refreshAnalytics() {
        await this.loadAnalyticsData();
    }

    // AI Control Methods
    async triggerAIAnalysis() {
        try {
            if (window.aiSystem) {
                await window.aiSystem.performSystemAnalysis();
                window.authManager?.showToast('AI analysis triggered successfully', 'success');
                await this.loadAIControlData();
            }
        } catch (error) {
            console.error('Error triggering AI analysis:', error);
            window.authManager?.showToast('Error triggering AI analysis', 'error');
        }
    }

    async resetAILearning() {
        if (!confirm('Are you sure you want to reset AI learning data? This cannot be undone.')) return;
        
        try {
            if (window.aiSystem) {
                // Reset learning models
                Object.keys(window.aiSystem.models).forEach(modelName => {
                    window.aiSystem.models[modelName].clear();
                });
                
                await window.aiSystem.saveAIData();
                window.authManager?.showToast('AI learning data reset successfully', 'success');
                await this.loadAIControlData();
            }
        } catch (error) {
            console.error('Error resetting AI learning:', error);
            window.authManager?.showToast('Error resetting AI learning', 'error');
        }
    }

    updateAIConfig(key, value) {
        try {
            if (window.aiSystem) {
                window.aiSystem.updateConfig({ [key]: value });
                window.authManager?.showToast(`AI ${key} updated`, 'success');
            }
        } catch (error) {
            console.error('Error updating AI config:', error);
            window.authManager?.showToast('Error updating AI config', 'error');
        }
    }

    // User Management Methods
    async searchUsers() {
        const searchTerm = document.getElementById('user-search').value.trim();
        if (!searchTerm) {
            await this.loadUserManagementData();
            return;
        }

        try {
            const users = await window.db.collection('users')
                .where('username', '>=', searchTerm.toLowerCase())
                .where('username', '<=', searchTerm.toLowerCase() + '\uf8ff')
                .get();

            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '';

            if (users.empty) {
                tbody.innerHTML = '<tr><td colspan="6" class="no-data">No users found</td></tr>';
                return;
            }

            users.docs.forEach(doc => {
                const user = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="user-cell">
                            <img src="${user.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'}" alt="Avatar" class="user-avatar-small">
                            <div>
                                <div class="user-name">${user.displayName || 'Unknown'}</div>
                                <div class="user-username">@${user.username || 'unknown'}</div>
                            </div>
                        </div>
                    </td>
                    <td>${user.email}</td>
                    <td>
                        <span class="coin-amount">${user.isAdmin ? '∞' : user.coins.toLocaleString()}</span>
                    </td>
                    <td>${user.winRate || 0}%</td>
                    <td>${this.formatDate(user.lastActive)}</td>
                    <td>
                        <div class="user-actions">
                            <button class="action-btn-small" onclick="window.adminDashboard.editUser('${doc.id}')">
                                <span class="material-icons">edit</span>
                            </button>
                            <button class="action-btn-small" onclick="window.adminDashboard.giftCoinsToUser('${doc.id}')">
                                <span class="material-icons">card_giftcard</span>
                            </button>
                            ${!user.isAdmin ? `
                                <button class="action-btn-small danger" onclick="window.adminDashboard.suspendUser('${doc.id}')">
                                    <span class="material-icons">block</span>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error searching users:', error);
            window.authManager?.showToast('Error searching users', 'error');
        }
    }

    showGiftCoinsModal() {
        document.getElementById('gift-coins-modal').classList.remove('hidden');
    }

    hideGiftCoinsModal() {
        document.getElementById('gift-coins-modal').classList.add('hidden');
    }

    async sendGiftCoins() {
        const recipientType = document.getElementById('gift-recipient-type').value;
        const recipient = document.getElementById('gift-recipient').value.trim();
        const amount = parseInt(document.getElementById('gift-amount').value);
        const message = document.getElementById('gift-message').value.trim();

        if (!amount || amount < 1) {
            window.authManager?.showToast('Please enter a valid amount', 'error');
            return;
        }

        if (recipientType === 'user' && !recipient) {
            window.authManager?.showToast('Please enter a username or email', 'error');
            return;
        }

        try {
            if (recipientType === 'user') {
                // Gift to specific user
                const userQuery = await window.db.collection('users')
                    .where('username', '==', recipient.toLowerCase())
                    .get();

                if (userQuery.empty) {
                    // Try by email
                    const emailQuery = await window.db.collection('users')
                        .where('email', '==', recipient.toLowerCase())
                        .get();
                    
                    if (emailQuery.empty) {
                        window.authManager?.showToast('User not found', 'error');
                        return;
                    }
                    
                    await this.giftCoinsToUser(emailQuery.docs[0].id, amount, message);
                } else {
                    await this.giftCoinsToUser(userQuery.docs[0].id, amount, message);
                }
            } else {
                // Gift to multiple users
                await this.giftCoinsToMultipleUsers(recipientType, amount, message);
            }

            this.hideGiftCoinsModal();
            window.authManager?.showToast('Coins gifted successfully!', 'success');

        } catch (error) {
            console.error('Error gifting coins:', error);
            window.authManager?.showToast('Error gifting coins', 'error');
        }
    }

    async giftCoinsToUser(userId, amount = null, message = null) {
        try {
            const giftAmount = amount || parseInt(prompt('Enter amount to gift:'));
            if (!giftAmount || giftAmount < 1) return;

            await window.db.collection('users').doc(userId).update({
                coins: firebase.firestore.FieldValue.increment(giftAmount)
            });

            // Log the gift
            await window.realtimeDb.collection('giftLogs').add({
                recipientId: userId,
                amount: giftAmount,
                message: message || 'Admin gift',
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                adminId: window.authManager.getCurrentUser().uid
            });

            window.authManager?.showToast(`Gifted ${giftAmount} coins successfully!`, 'success');
            await this.loadUserManagementData();

        } catch (error) {
            console.error('Error gifting coins to user:', error);
            window.authManager?.showToast('Error gifting coins', 'error');
        }
    }

    async giftCoinsToMultipleUsers(recipientType, amount, message) {
        try {
            let query = window.db.collection('users');
            
            if (recipientType === 'active') {
                const yesterday = new Date(Date.now() - 86400000);
                query = query.where('lastActive', '>', yesterday);
            }
            
            query = query.where('isAdmin', '==', false); // Don't gift to admins
            
            const users = await query.get();
            
            if (users.empty) {
                window.authManager?.showToast('No eligible users found', 'warning');
                return;
            }

            const batch = window.db.batch();
            const giftLogs = [];

            users.docs.forEach(doc => {
                batch.update(doc.ref, {
                    coins: firebase.firestore.FieldValue.increment(amount)
                });

                giftLogs.push({
                    recipientId: doc.id,
                    amount: amount,
                    message: message || 'Mass admin gift',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    adminId: window.authManager.getCurrentUser().uid
                });
            });

            await batch.commit();

            // Log all gifts
            const logBatch = window.realtimeDb.batch();
            giftLogs.forEach(log => {
                const logRef = window.realtimeDb.collection('giftLogs').doc();
                logBatch.set(logRef, log);
            });
            await logBatch.commit();

            window.authManager?.showToast(`Gifted ${amount} coins to ${users.size} users!`, 'success');

        } catch (error) {
            console.error('Error gifting coins to multiple users:', error);
            window.authManager?.showToast('Error gifting coins', 'error');
        }
    }

    async editUser(userId) {
        // Implement user editing functionality
        window.authManager?.showToast('User editing feature coming soon', 'info');
    }

    async suspendUser(userId) {
        if (!confirm('Are you sure you want to suspend this user?')) return;
        
        try {
            await window.db.collection('users').doc(userId).update({
                suspended: true,
                suspendedAt: firebase.firestore.FieldValue.serverTimestamp(),
                suspendedBy: window.authManager.getCurrentUser().uid
            });

            window.authManager?.showToast('User suspended successfully', 'success');
            await this.loadUserManagementData();

        } catch (error) {
            console.error('Error suspending user:', error);
            window.authManager?.showToast('Error suspending user', 'error');
        }
    }

    async exportUserData() {
        try {
            const users = await window.db.collection('users').get();
            const userData = users.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
                lastActive: doc.data().lastActive?.toDate?.()?.toISOString()
            }));

            const dataStr = JSON.stringify(userData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `coino-users-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            window.authManager?.showToast('User data exported successfully', 'success');

        } catch (error) {
            console.error('Error exporting user data:', error);
            window.authManager?.showToast('Error exporting user data', 'error');
        }
    }

    async resetAllUserCoins() {
        if (!confirm('⚠️ RESET ALL USER COINS? This cannot be undone!')) return;
        if (!confirm('This will reset all non-admin user coins to 10. Continue?')) return;

        try {
            const users = await window.db.collection('users').where('isAdmin', '==', false).get();
            const batches = this.chunkArray(users.docs, 500);
            
            for (const batch of batches) {
                const batchWrite = window.db.batch();
                batch.forEach(doc => {
                    batchWrite.update(doc.ref, { coins: 10 });
                });
                await batchWrite.commit();
            }
            
            window.authManager?.showToast('All user coins reset successfully', 'success');
            await this.loadUserManagementData();

        } catch (error) {
            console.error('Error resetting user coins:', error);
            window.authManager?.showToast('Error resetting user coins', 'error');
        }
    }

    // Game Control Methods
    async forceNewRound() {
        try {
            if (window.gameManager) {
                await window.gameManager.adminForceNewRound();
                window.authManager?.showToast('New round forced successfully', 'success');
            }
        } catch (error) {
            console.error('Error forcing new round:', error);
            window.authManager?.showToast('Error forcing new round', 'error');
        }
    }

    async endCurrentRound() {
        try {
            if (window.gameManager) {
                await window.gameManager.adminEndCurrentRound();
                window.authManager?.showToast('Current round ended successfully', 'success');
            }
        } catch (error) {
            console.error('Error ending current round:', error);
            window.authManager?.showToast('Error ending current round', 'error');
        }
    }

    async processStuckResults() {
        try {
            if (window.gameManager) {
                await window.gameManager.adminProcessStuckResults();
                window.authManager?.showToast('Stuck results processed successfully', 'success');
            }
        } catch (error) {
            console.error('Error processing stuck results:', error);
            window.authManager?.showToast('Error processing stuck results', 'error');
        }
    }

    async saveGameSettings() {
        try {
            const roundDuration = parseInt(document.getElementById('round-duration').value);
            const minBet = parseInt(document.getElementById('min-bet').value);
            const maxBet = parseInt(document.getElementById('max-bet').value);

            // Save to database
            await window.realtimeDb.collection('gameSettings').doc('config').set({
                roundDuration: roundDuration * 1000, // Convert to milliseconds
                minBet,
                maxBet,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: window.authManager.getCurrentUser().uid
            }, { merge: true });

            window.authManager?.showToast('Game settings saved successfully', 'success');

        } catch (error) {
            console.error('Error saving game settings:', error);
            window.authManager?.showToast('Error saving game settings', 'error');
        }
    }

    // Settings Methods
    async saveAllSettings() {
        try {
            const settings = {
                maintenanceMode: document.getElementById('maintenance-mode').checked,
                newRegistrations: document.getElementById('new-registrations').checked,
                systemMessage: document.getElementById('system-message').value.trim(),
                aiLearningRate: parseFloat(document.getElementById('ai-learning-rate-slider').value),
                healingSensitivity: parseFloat(document.getElementById('healing-sensitivity').value),
                predictionTarget: parseFloat(document.getElementById('prediction-target').value)
            };

            // Save system settings
            await window.realtimeDb.collection('systemSettings').doc('config').set({
                ...settings,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: window.authManager.getCurrentUser().uid
            }, { merge: true });

            // Update AI configuration
            if (window.aiSystem) {
                window.aiSystem.updateConfig({
                    learningRate: settings.aiLearningRate,
                    errorDetectionSensitivity: settings.healingSensitivity,
                    predictionAccuracy: settings.predictionTarget
                });
            }

            window.authManager?.showToast('All settings saved successfully', 'success');

        } catch (error) {
            console.error('Error saving settings:', error);
            window.authManager?.showToast('Error saving settings', 'error');
        }
    }

    // Data Management Methods
    async backupData() {
        try {
            window.authManager?.showToast('Starting data backup...', 'info');
            
            const [users, rounds, bets] = await Promise.all([
                window.db.collection('users').get(),
                window.realtimeDb.collection('rounds').get(),
                window.realtimeDb.collection('bets').get()
            ]);

            const backupData = {
                users: users.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                rounds: rounds.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                bets: bets.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                timestamp: new Date().toISOString()
            };

            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `coino-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            window.authManager?.showToast('Data backup completed successfully', 'success');

        } catch (error) {
            console.error('Error backing up data:', error);
            window.authManager?.showToast('Error backing up data', 'error');
        }
    }

    async optimizeDatabase() {
        try {
            if (window.gameManager) {
                await window.gameManager.adminOptimizeDatabase();
                window.authManager?.showToast('Database optimized successfully', 'success');
            }
        } catch (error) {
            console.error('Error optimizing database:', error);
            window.authManager?.showToast('Error optimizing database', 'error');
        }
    }

    async cleanupOldData() {
        if (!confirm('⚠️ CLEANUP OLD DATA? This will remove old rounds and bets. Continue?')) return;

        try {
            // Clean up old completed rounds (keep last 1000)
            const oldRounds = await window.realtimeDb.collection('rounds')
                .where('status', '==', 'completed')
                .orderBy('endTime', 'desc')
                .offset(1000)
                .get();

            if (!oldRounds.empty) {
                const batches = this.chunkArray(oldRounds.docs, 500);
                for (const batch of batches) {
                    const batchWrite = window.realtimeDb.batch();
                    batch.forEach(doc => batchWrite.delete(doc.ref));
                    await batchWrite.commit();
                }
            }

            // Clean up old processed bets (keep last 5000)
            const oldBets = await window.realtimeDb.collection('bets')
                .where('processed', '==', true)
                .orderBy('timestamp', 'desc')
                .offset(5000)
                .get();

            if (!oldBets.empty) {
                const batches = this.chunkArray(oldBets.docs, 500);
                for (const batch of batches) {
                    const batchWrite = window.realtimeDb.batch();
                    batch.forEach(doc => batchWrite.delete(doc.ref));
                    await batchWrite.commit();
                }
            }

            window.authManager?.showToast(`Cleaned up ${oldRounds.size + oldBets.size} old records`, 'success');

        } catch (error) {
            console.error('Error cleaning up old data:', error);
            window.authManager?.showToast('Error cleaning up old data', 'error');
        }
    }

    // Utility Methods
    formatDate(timestamp) {
        if (!timestamp) return 'Never';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            return 'Invalid Date';
        }
    }

    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    // Pagination methods (placeholder)
    previousPage() {
        // Implement pagination
    }

    nextPage() {
        // Implement pagination
    }
}

// Initialize admin dashboard
window.adminDashboard = new AdminDashboard();