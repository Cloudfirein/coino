// Enhanced Admin Dashboard with Complete AI Integration
class AdminDashboard {
    constructor() {
        this.isVisible = false;
        this.currentSection = 'overview';
        this.refreshInterval = null;
        this.realTimeUpdates = new Map();
        this.charts = new Map();
        this.filters = {
            timeRange: '24h',
            userType: 'all',
            severity: 'all'
        };
        
        this.init();
    }

    init() {
        this.createDashboardHTML();
        this.setupEventListeners();
        this.initializeCharts();
    }

    createDashboardHTML() {
        const dashboardHTML = `
            <div id="admin-dashboard" class="admin-dashboard hidden">
                <div class="dashboard-overlay" onclick="window.adminDashboard.hide()"></div>
                <div class="dashboard-container">
                    <div class="dashboard-header">
                        <h1>🤖 AI-Powered Admin Dashboard</h1>
                        <div class="dashboard-controls">
                            <select id="dashboard-time-filter" class="dashboard-filter">
                                <option value="1h">Last Hour</option>
                                <option value="24h" selected>Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                            </select>
                            <button class="dashboard-btn refresh-btn" onclick="window.adminDashboard.refresh()">
                                <span class="material-icons">refresh</span>
                                Refresh
                            </button>
                            <button class="dashboard-btn close-btn" onclick="window.adminDashboard.hide()">
                                <span class="material-icons">close</span>
                            </button>
                        </div>
                    </div>

                    <div class="dashboard-nav">
                        <button class="nav-item active" data-section="overview">
                            <span class="material-icons">dashboard</span>
                            Overview
                        </button>
                        <button class="nav-item" data-section="ai-system">
                            <span class="material-icons">psychology</span>
                            AI System
                        </button>
                        <button class="nav-item" data-section="users">
                            <span class="material-icons">people</span>
                            Users
                        </button>
                        <button class="nav-item" data-section="games">
                            <span class="material-icons">casino</span>
                            Games
                        </button>
                        <button class="nav-item" data-section="security">
                            <span class="material-icons">security</span>
                            Security
                        </button>
                        <button class="nav-item" data-section="analytics">
                            <span class="material-icons">analytics</span>
                            Analytics
                        </button>
                        <button class="nav-item" data-section="system">
                            <span class="material-icons">settings</span>
                            System
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
                                    <div class="metric-content">
                                        <h3 id="total-users">0</h3>
                                        <p>Total Users</p>
                                        <span class="metric-change" id="users-change">+0%</span>
                                    </div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon">
                                        <span class="material-icons">casino</span>
                                    </div>
                                    <div class="metric-content">
                                        <h3 id="total-games">0</h3>
                                        <p>Total Games</p>
                                        <span class="metric-change" id="games-change">+0%</span>
                                    </div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon">
                                        <span class="material-icons">monetization_on</span>
                                    </div>
                                    <div class="metric-content">
                                        <h3 id="total-coins">0</h3>
                                        <p>Total Coins</p>
                                        <span class="metric-change" id="coins-change">+0%</span>
                                    </div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon">
                                        <span class="material-icons">psychology</span>
                                    </div>
                                    <div class="metric-content">
                                        <h3 id="ai-health">100%</h3>
                                        <p>AI Health</p>
                                        <span class="metric-change" id="ai-change">Optimal</span>
                                    </div>
                                </div>
                            </div>

                            <div class="charts-grid">
                                <div class="chart-container">
                                    <h3>User Activity (24h)</h3>
                                    <canvas id="user-activity-chart"></canvas>
                                </div>
                                <div class="chart-container">
                                    <h3>Game Performance</h3>
                                    <canvas id="game-performance-chart"></canvas>
                                </div>
                            </div>

                            <div class="recent-activity">
                                <h3>Recent AI Actions</h3>
                                <div id="recent-ai-actions" class="activity-list">
                                    <div class="loading">Loading AI actions...</div>
                                </div>
                            </div>
                        </div>

                        <!-- AI System Section -->
                        <div id="ai-system-section" class="dashboard-section">
                            <div class="ai-status-grid">
                                <div class="ai-status-card">
                                    <h3>🧠 Learning System</h3>
                                    <div class="status-indicator" id="learning-status">
                                        <span class="status-dot active"></span>
                                        <span>Active</span>
                                    </div>
                                    <div class="ai-metrics">
                                        <p>Models Trained: <span id="models-trained">0</span></p>
                                        <p>Accuracy: <span id="learning-accuracy">0%</span></p>
                                        <p>Last Update: <span id="last-learning-update">Never</span></p>
                                    </div>
                                </div>
                                <div class="ai-status-card">
                                    <h3>🔧 Self-Healing</h3>
                                    <div class="status-indicator" id="healing-status">
                                        <span class="status-dot active"></span>
                                        <span>Active</span>
                                    </div>
                                    <div class="ai-metrics">
                                        <p>Issues Resolved: <span id="issues-resolved">0</span></p>
                                        <p>Success Rate: <span id="healing-success-rate">0%</span></p>
                                        <p>Queue Length: <span id="healing-queue">0</span></p>
                                    </div>
                                </div>
                                <div class="ai-status-card">
                                    <h3>🔮 Predictions</h3>
                                    <div class="status-indicator" id="prediction-status">
                                        <span class="status-dot active"></span>
                                        <span>Active</span>
                                    </div>
                                    <div class="ai-metrics">
                                        <p>Predictions Made: <span id="predictions-made">0</span></p>
                                        <p>Accuracy: <span id="prediction-accuracy">0%</span></p>
                                        <p>Confidence: <span id="prediction-confidence">0%</span></p>
                                    </div>
                                </div>
                                <div class="ai-status-card">
                                    <h3>🛡️ Security</h3>
                                    <div class="status-indicator" id="security-status">
                                        <span class="status-dot active"></span>
                                        <span>Secure</span>
                                    </div>
                                    <div class="ai-metrics">
                                        <p>Threat Level: <span id="threat-level">LOW</span></p>
                                        <p>Incidents: <span id="security-incidents">0</span></p>
                                        <p>Score: <span id="security-score">100%</span></p>
                                    </div>
                                </div>
                            </div>

                            <div class="ai-controls">
                                <h3>AI System Controls</h3>
                                <div class="control-grid">
                                    <button class="control-btn" onclick="window.adminDashboard.toggleAILearning()">
                                        <span class="material-icons">school</span>
                                        Toggle Learning
                                    </button>
                                    <button class="control-btn" onclick="window.adminDashboard.toggleSelfHealing()">
                                        <span class="material-icons">healing</span>
                                        Toggle Healing
                                    </button>
                                    <button class="control-btn" onclick="window.adminDashboard.forceAIAnalysis()">
                                        <span class="material-icons">analytics</span>
                                        Force Analysis
                                    </button>
                                    <button class="control-btn" onclick="window.adminDashboard.resetAIModels()">
                                        <span class="material-icons">refresh</span>
                                        Reset Models
                                    </button>
                                    <button class="control-btn" onclick="window.adminDashboard.exportAIData()">
                                        <span class="material-icons">download</span>
                                        Export Data
                                    </button>
                                    <button class="control-btn danger" onclick="window.adminDashboard.emergencyStop()">
                                        <span class="material-icons">emergency</span>
                                        Emergency Stop
                                    </button>
                                </div>
                            </div>

                            <div class="ai-insights">
                                <h3>AI Insights & Recommendations</h3>
                                <div id="ai-insights-list" class="insights-list">
                                    <div class="loading">Loading AI insights...</div>
                                </div>
                            </div>

                            <div class="ai-logs">
                                <h3>AI System Logs</h3>
                                <div class="log-filters">
                                    <select id="log-level-filter">
                                        <option value="all">All Levels</option>
                                        <option value="info">Info</option>
                                        <option value="warning">Warning</option>
                                        <option value="error">Error</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                    <button class="filter-btn" onclick="window.adminDashboard.filterLogs()">
                                        Filter
                                    </button>
                                </div>
                                <div id="ai-logs-list" class="logs-list">
                                    <div class="loading">Loading AI logs...</div>
                                </div>
                            </div>
                        </div>

                        <!-- Users Section -->
                        <div id="users-section" class="dashboard-section">
                            <div class="section-header">
                                <h3>User Management</h3>
                                <div class="section-controls">
                                    <input type="text" id="user-search" placeholder="Search users..." class="search-input">
                                    <select id="user-filter" class="filter-select">
                                        <option value="all">All Users</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="banned">Banned</option>
                                    </select>
                                </div>
                            </div>

                            <div class="user-stats">
                                <div class="stat-card">
                                    <h4>Active Users</h4>
                                    <span id="active-users-count">0</span>
                                </div>
                                <div class="stat-card">
                                    <h4>New Today</h4>
                                    <span id="new-users-today">0</span>
                                </div>
                                <div class="stat-card">
                                    <h4>Avg Session</h4>
                                    <span id="avg-session-time">0m</span>
                                </div>
                                <div class="stat-card">
                                    <h4>Retention Rate</h4>
                                    <span id="retention-rate">0%</span>
                                </div>
                            </div>

                            <div class="users-table-container">
                                <table class="users-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Coins</th>
                                            <th>Games</th>
                                            <th>Win Rate</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="users-table-body">
                                        <tr>
                                            <td colspan="7" class="loading">Loading users...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="user-behavior-analysis">
                                <h3>AI Behavior Analysis</h3>
                                <div id="behavior-insights" class="behavior-insights">
                                    <div class="loading">Analyzing user behavior...</div>
                                </div>
                            </div>
                        </div>

                        <!-- Games Section -->
                        <div id="games-section" class="dashboard-section">
                            <div class="game-stats-grid">
                                <div class="game-stat-card">
                                    <h4>Total Rounds</h4>
                                    <span id="total-rounds">0</span>
                                </div>
                                <div class="game-stat-card">
                                    <h4>Active Rounds</h4>
                                    <span id="active-rounds">0</span>
                                </div>
                                <div class="game-stat-card">
                                    <h4>Total Bets</h4>
                                    <span id="total-bets">0</span>
                                </div>
                                <div class="game-stat-card">
                                    <h4>Avg Bet Size</h4>
                                    <span id="avg-bet-size">0</span>
                                </div>
                            </div>

                            <div class="game-controls">
                                <h3>Game Management</h3>
                                <div class="control-grid">
                                    <button class="control-btn" onclick="window.adminDashboard.forceNewRound()">
                                        <span class="material-icons">add_circle</span>
                                        Force New Round
                                    </button>
                                    <button class="control-btn" onclick="window.adminDashboard.endAllRounds()">
                                        <span class="material-icons">stop</span>
                                        End All Rounds
                                    </button>
                                    <button class="control-btn" onclick="window.adminDashboard.adjustGameBalance()">
                                        <span class="material-icons">balance</span>
                                        Adjust Balance
                                    </button>
                                    <button class="control-btn danger" onclick="window.adminDashboard.resetAllGames()">
                                        <span class="material-icons">restart_alt</span>
                                        Reset All Games
                                    </button>
                                </div>
                            </div>

                            <div class="game-balance-analysis">
                                <h3>AI Game Balance Analysis</h3>
                                <canvas id="game-balance-chart"></canvas>
                                <div id="balance-recommendations" class="recommendations">
                                    <div class="loading">Analyzing game balance...</div>
                                </div>
                            </div>

                            <div class="recent-games">
                                <h3>Recent Games</h3>
                                <div id="recent-games-list" class="games-list">
                                    <div class="loading">Loading recent games...</div>
                                </div>
                            </div>
                        </div>

                        <!-- Security Section -->
                        <div id="security-section" class="dashboard-section">
                            <div class="security-overview">
                                <div class="security-card">
                                    <h4>🛡️ Security Score</h4>
                                    <div class="security-score" id="security-score-display">100</div>
                                    <div class="security-status" id="security-status-text">Excellent</div>
                                </div>
                                <div class="security-card">
                                    <h4>🚨 Active Threats</h4>
                                    <div class="threat-count" id="active-threats-count">0</div>
                                    <div class="threat-level" id="threat-level-display">LOW</div>
                                </div>
                                <div class="security-card">
                                    <h4>🔒 Failed Logins</h4>
                                    <div class="failed-logins" id="failed-logins-count">0</div>
                                    <div class="login-status">Last 24h</div>
                                </div>
                            </div>

                            <div class="security-events">
                                <h3>Security Events</h3>
                                <div class="event-filters">
                                    <select id="event-type-filter">
                                        <option value="all">All Events</option>
                                        <option value="login">Login Attempts</option>
                                        <option value="suspicious">Suspicious Activity</option>
                                        <option value="blocked">Blocked IPs</option>
                                    </select>
                                    <select id="event-severity-filter">
                                        <option value="all">All Severities</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <div id="security-events-list" class="events-list">
                                    <div class="loading">Loading security events...</div>
                                </div>
                            </div>

                            <div class="security-actions">
                                <h3>Security Actions</h3>
                                <div class="action-grid">
                                    <button class="action-btn" onclick="window.adminDashboard.runSecurityScan()">
                                        <span class="material-icons">security</span>
                                        Run Security Scan
                                    </button>
                                    <button class="action-btn" onclick="window.adminDashboard.blockSuspiciousIPs()">
                                        <span class="material-icons">block</span>
                                        Block Suspicious IPs
                                    </button>
                                    <button class="action-btn" onclick="window.adminDashboard.resetSecurityMetrics()">
                                        <span class="material-icons">refresh</span>
                                        Reset Metrics
                                    </button>
                                    <button class="action-btn danger" onclick="window.adminDashboard.lockdownSystem()">
                                        <span class="material-icons">lock</span>
                                        Emergency Lockdown
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Analytics Section -->
                        <div id="analytics-section" class="dashboard-section">
                            <div class="analytics-overview">
                                <h3>Advanced Analytics</h3>
                                <div class="analytics-grid">
                                    <div class="analytics-card">
                                        <h4>User Engagement</h4>
                                        <canvas id="engagement-chart"></canvas>
                                    </div>
                                    <div class="analytics-card">
                                        <h4>Revenue Trends</h4>
                                        <canvas id="revenue-chart"></canvas>
                                    </div>
                                    <div class="analytics-card">
                                        <h4>Performance Metrics</h4>
                                        <canvas id="performance-chart"></canvas>
                                    </div>
                                    <div class="analytics-card">
                                        <h4>AI Predictions</h4>
                                        <canvas id="predictions-chart"></canvas>
                                    </div>
                                </div>
                            </div>

                            <div class="predictive-analytics">
                                <h3>AI Predictive Analytics</h3>
                                <div id="predictive-insights" class="predictive-insights">
                                    <div class="loading">Generating predictions...</div>
                                </div>
                            </div>
                        </div>

                        <!-- System Section -->
                        <div id="system-section" class="dashboard-section">
                            <div class="system-health">
                                <h3>System Health</h3>
                                <div class="health-grid">
                                    <div class="health-card">
                                        <h4>CPU Usage</h4>
                                        <div class="health-meter">
                                            <div class="meter-bar" id="cpu-meter"></div>
                                        </div>
                                        <span id="cpu-percentage">0%</span>
                                    </div>
                                    <div class="health-card">
                                        <h4>Memory Usage</h4>
                                        <div class="health-meter">
                                            <div class="meter-bar" id="memory-meter"></div>
                                        </div>
                                        <span id="memory-percentage">0%</span>
                                    </div>
                                    <div class="health-card">
                                        <h4>Database Load</h4>
                                        <div class="health-meter">
                                            <div class="meter-bar" id="db-meter"></div>
                                        </div>
                                        <span id="db-percentage">0%</span>
                                    </div>
                                    <div class="health-card">
                                        <h4>Response Time</h4>
                                        <div class="response-time" id="response-time">0ms</div>
                                    </div>
                                </div>
                            </div>

                            <div class="system-controls">
                                <h3>System Controls</h3>
                                <div class="control-grid">
                                    <button class="control-btn" onclick="window.adminDashboard.optimizeDatabase()">
                                        <span class="material-icons">storage</span>
                                        Optimize Database
                                    </button>
                                    <button class="control-btn" onclick="window.adminDashboard.clearCache()">
                                        <span class="material-icons">clear_all</span>
                                        Clear Cache
                                    </button>
                                    <button class="control-btn" onclick="window.adminDashboard.backupSystem()">
                                        <span class="material-icons">backup</span>
                                        Backup System
                                    </button>
                                    <button class="control-btn danger" onclick="window.adminDashboard.restartSystem()">
                                        <span class="material-icons">restart_alt</span>
                                        Restart System
                                    </button>
                                </div>
                            </div>

                            <div class="system-logs">
                                <h3>System Logs</h3>
                                <div class="log-viewer" id="system-logs">
                                    <div class="loading">Loading system logs...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.target.closest('.nav-item').dataset.section;
                this.switchSection(section);
            });
        });

        // Time filter
        const timeFilter = document.getElementById('dashboard-time-filter');
        if (timeFilter) {
            timeFilter.addEventListener('change', (e) => {
                this.filters.timeRange = e.target.value;
                this.refresh();
            });
        }

        // Search and filters
        const userSearch = document.getElementById('user-search');
        if (userSearch) {
            userSearch.addEventListener('input', this.debounce(() => {
                this.filterUsers();
            }, 300));
        }
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.dashboard-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        this.currentSection = section;
        this.loadSectionData(section);
    }

    async loadSectionData(section) {
        switch (section) {
            case 'overview':
                await this.loadOverviewData();
                break;
            case 'ai-system':
                await this.loadAISystemData();
                break;
            case 'users':
                await this.loadUsersData();
                break;
            case 'games':
                await this.loadGamesData();
                break;
            case 'security':
                await this.loadSecurityData();
                break;
            case 'analytics':
                await this.loadAnalyticsData();
                break;
            case 'system':
                await this.loadSystemData();
                break;
        }
    }

    async loadOverviewData() {
        try {
            // Load basic metrics
            const [users, rounds, bets] = await Promise.all([
                db.collection('users').get(),
                db.collection('rounds').get(),
                db.collection('bets').get()
            ]);

            // Update metrics
            document.getElementById('total-users').textContent = users.size;
            document.getElementById('total-games').textContent = rounds.size;
            document.getElementById('total-coins').textContent = this.calculateTotalCoins(users.docs);

            // Get AI health
            if (window.coinoAI) {
                const aiStatus = window.coinoAI.getSystemStatus();
                document.getElementById('ai-health').textContent = `${aiStatus.monitoring.healthScore}%`;
                document.getElementById('ai-change').textContent = aiStatus.monitoring.healthScore > 90 ? 'Optimal' : 'Needs Attention';
            }

            // Load recent AI actions
            await this.loadRecentAIActions();

        } catch (error) {
            console.error('Error loading overview data:', error);
        }
    }

    async loadAISystemData() {
        try {
            if (!window.coinoAI) {
                document.getElementById('learning-status').innerHTML = '<span class="status-dot inactive"></span><span>Offline</span>';
                return;
            }

            const aiStatus = window.coinoAI.getSystemStatus();

            // Update AI status indicators
            this.updateAIStatusIndicator('learning-status', aiStatus.isInitialized);
            this.updateAIStatusIndicator('healing-status', aiStatus.healingStatus.enabled);
            this.updateAIStatusIndicator('prediction-status', aiStatus.isInitialized);
            this.updateAIStatusIndicator('security-status', aiStatus.securityStatus.securityScore > 80);

            // Update AI metrics
            document.getElementById('models-trained').textContent = Object.keys(aiStatus.modelAccuracy).length;
            document.getElementById('learning-accuracy').textContent = `${Math.round(Object.values(aiStatus.modelAccuracy).reduce((a, b) => a + b, 0) / Object.keys(aiStatus.modelAccuracy).length || 0)}%`;
            document.getElementById('last-learning-update').textContent = this.formatTime(Date.now());

            document.getElementById('issues-resolved').textContent = aiStatus.healingStatus.recentActions.filter(a => a.success).length;
            document.getElementById('healing-success-rate').textContent = `${Math.round(aiStatus.healingStatus.successRate)}%`;
            document.getElementById('healing-queue').textContent = aiStatus.healingStatus.queueLength;

            document.getElementById('threat-level').textContent = aiStatus.securityStatus.threatLevel;
            document.getElementById('security-incidents').textContent = aiStatus.securityStatus.activeThreats;
            document.getElementById('security-score').textContent = `${aiStatus.securityStatus.securityScore}%`;

            // Load AI insights
            await this.loadAIInsights();

            // Load AI logs
            await this.loadAILogs();

        } catch (error) {
            console.error('Error loading AI system data:', error);
        }
    }

    async loadUsersData() {
        try {
            const users = await db.collection('users').limit(100).get();
            const usersData = users.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Update user stats
            const activeUsers = usersData.filter(user => this.isUserActive(user));
            const newUsersToday = usersData.filter(user => this.isUserNewToday(user));

            document.getElementById('active-users-count').textContent = activeUsers.length;
            document.getElementById('new-users-today').textContent = newUsersToday.length;
            document.getElementById('avg-session-time').textContent = this.calculateAverageSessionTime(usersData);
            document.getElementById('retention-rate').textContent = `${this.calculateRetentionRate(usersData)}%`;

            // Populate users table
            this.populateUsersTable(usersData);

            // Load behavior analysis
            await this.loadBehaviorAnalysis(usersData);

        } catch (error) {
            console.error('Error loading users data:', error);
        }
    }

    async loadGamesData() {
        try {
            const [rounds, bets] = await Promise.all([
                db.collection('rounds').get(),
                db.collection('bets').get()
            ]);

            const roundsData = rounds.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const betsData = bets.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Update game stats
            document.getElementById('total-rounds').textContent = roundsData.length;
            document.getElementById('active-rounds').textContent = roundsData.filter(r => r.status === 'active').length;
            document.getElementById('total-bets').textContent = betsData.length;
            document.getElementById('avg-bet-size').textContent = this.calculateAverageBetSize(betsData);

            // Load game balance analysis
            await this.loadGameBalanceAnalysis(roundsData);

            // Load recent games
            this.loadRecentGames(roundsData.slice(-20));

        } catch (error) {
            console.error('Error loading games data:', error);
        }
    }

    async loadSecurityData() {
        try {
            // Load security events
            const securityEvents = await db.collection('securityEvents').orderBy('timestamp', 'desc').limit(100).get();
            const eventsData = securityEvents.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Update security overview
            const securityScore = this.calculateSecurityScore(eventsData);
            const activeThreats = eventsData.filter(e => e.severity === 'high' || e.severity === 'critical').length;
            const failedLogins = eventsData.filter(e => e.type === 'failed_login').length;

            document.getElementById('security-score-display').textContent = securityScore;
            document.getElementById('security-status-text').textContent = this.getSecurityStatusText(securityScore);
            document.getElementById('active-threats-count').textContent = activeThreats;
            document.getElementById('threat-level-display').textContent = this.calculateThreatLevel(eventsData);
            document.getElementById('failed-logins-count').textContent = failedLogins;

            // Populate security events
            this.populateSecurityEvents(eventsData);

        } catch (error) {
            console.error('Error loading security data:', error);
        }
    }

    async loadAnalyticsData() {
        try {
            // Load analytics data and create charts
            await this.createEngagementChart();
            await this.createRevenueChart();
            await this.createPerformanceChart();
            await this.createPredictionsChart();

            // Load predictive insights
            await this.loadPredictiveInsights();

        } catch (error) {
            console.error('Error loading analytics data:', error);
        }
    }

    async loadSystemData() {
        try {
            // Simulate system metrics (in real app, these would come from monitoring)
            const systemMetrics = {
                cpu: Math.random() * 100,
                memory: Math.random() * 100,
                database: Math.random() * 100,
                responseTime: Math.random() * 1000
            };

            // Update health meters
            this.updateHealthMeter('cpu-meter', 'cpu-percentage', systemMetrics.cpu);
            this.updateHealthMeter('memory-meter', 'memory-percentage', systemMetrics.memory);
            this.updateHealthMeter('db-meter', 'db-percentage', systemMetrics.database);
            document.getElementById('response-time').textContent = `${Math.round(systemMetrics.responseTime)}ms`;

            // Load system logs
            await this.loadSystemLogs();

        } catch (error) {
            console.error('Error loading system data:', error);
        }
    }

    // AI Control Methods
    async toggleAILearning() {
        try {
            if (window.coinoAI) {
                const currentStatus = window.coinoAI.getSystemStatus();
                // Toggle learning system
                window.coinoAI.updateConfig({
                    learningEnabled: !currentStatus.config.learningEnabled
                });
                
                this.showNotification('AI Learning system toggled', 'success');
                await this.loadAISystemData();
            }
        } catch (error) {
            this.showNotification('Failed to toggle AI learning', 'error');
        }
    }

    async toggleSelfHealing() {
        try {
            if (window.coinoAI) {
                const currentStatus = window.coinoAI.getSystemStatus();
                window.coinoAI.updateConfig({
                    healingEnabled: !currentStatus.config.healingEnabled
                });
                
                this.showNotification('Self-healing system toggled', 'success');
                await this.loadAISystemData();
            }
        } catch (error) {
            this.showNotification('Failed to toggle self-healing', 'error');
        }
    }

    async forceAIAnalysis() {
        try {
            if (window.coinoAI) {
                await window.coinoAI.performComprehensiveAnalysis();
                this.showNotification('AI analysis completed', 'success');
                await this.loadAISystemData();
            }
        } catch (error) {
            this.showNotification('Failed to perform AI analysis', 'error');
        }
    }

    async resetAIModels() {
        if (!confirm('Are you sure you want to reset all AI models? This action cannot be undone.')) return;
        
        try {
            if (window.coinoAI) {
                // Reset AI models
                Object.keys(window.coinoAI.models).forEach(modelName => {
                    window.coinoAI.models[modelName].data.clear();
                    window.coinoAI.models[modelName].patterns.clear();
                    window.coinoAI.models[modelName].predictions.clear();
                    window.coinoAI.models[modelName].accuracy = 0;
                });
                
                await window.coinoAI.saveAIData();
                this.showNotification('AI models reset successfully', 'success');
                await this.loadAISystemData();
            }
        } catch (error) {
            this.showNotification('Failed to reset AI models', 'error');
        }
    }

    async exportAIData() {
        try {
            if (window.coinoAI) {
                const aiData = window.coinoAI.getSystemStatus();
                const dataStr = JSON.stringify(aiData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                
                const link = document.createElement('a');
                link.href = URL.createObjectURL(dataBlob);
                link.download = `coino-ai-data-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                
                this.showNotification('AI data exported successfully', 'success');
            }
        } catch (error) {
            this.showNotification('Failed to export AI data', 'error');
        }
    }

    async emergencyStop() {
        if (!confirm('EMERGENCY STOP: This will halt all AI operations. Continue?')) return;
        
        try {
            if (window.coinoAI) {
                window.coinoAI.destroy();
                this.showNotification('AI system emergency stopped', 'warning');
                await this.loadAISystemData();
            }
        } catch (error) {
            this.showNotification('Failed to emergency stop AI', 'error');
        }
    }

    // Utility Methods
    updateAIStatusIndicator(elementId, isActive) {
        const element = document.getElementById(elementId);
        if (element) {
            const dot = element.querySelector('.status-dot');
            const text = element.querySelector('span:last-child');
            
            if (isActive) {
                dot.className = 'status-dot active';
                text.textContent = 'Active';
            } else {
                dot.className = 'status-dot inactive';
                text.textContent = 'Inactive';
            }
        }
    }

    updateHealthMeter(meterId, percentageId, value) {
        const meter = document.getElementById(meterId);
        const percentage = document.getElementById(percentageId);
        
        if (meter && percentage) {
            meter.style.width = `${value}%`;
            meter.className = `meter-bar ${this.getHealthClass(value)}`;
            percentage.textContent = `${Math.round(value)}%`;
        }
    }

    getHealthClass(value) {
        if (value < 50) return 'good';
        if (value < 80) return 'warning';
        return 'critical';
    }

    calculateTotalCoins(userDocs) {
        return userDocs.reduce((total, doc) => {
            const userData = doc.data();
            return total + (userData.coins || 0);
        }, 0).toLocaleString();
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
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

    showNotification(message, type = 'info') {
        if (window.authManager) {
            window.authManager.showToast(message, type);
        }
    }

    show() {
        document.getElementById('admin-dashboard').classList.remove('hidden');
        this.isVisible = true;
        this.startRealTimeUpdates();
        this.loadSectionData(this.currentSection);
    }

    hide() {
        document.getElementById('admin-dashboard').classList.add('hidden');
        this.isVisible = false;
        this.stopRealTimeUpdates();
    }

    startRealTimeUpdates() {
        this.refreshInterval = setInterval(() => {
            if (this.isVisible) {
                this.refresh();
            }
        }, 30000); // Update every 30 seconds
    }

    stopRealTimeUpdates() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    async refresh() {
        await this.loadSectionData(this.currentSection);
    }

    destroy() {
        this.stopRealTimeUpdates();
        const dashboard = document.getElementById('admin-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
    }
}

// Initialize Admin Dashboard
window.adminDashboard = new AdminDashboard();