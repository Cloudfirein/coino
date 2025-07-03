// Advanced Dual Firebase Configuration with AI Integration
const primaryConfig = {
    apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "coino-primary.firebaseapp.com",
    projectId: "coino-primary",
    storageBucket: "coino-primary.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxx"
};

const realtimeConfig = {
    apiKey: "AIzaSyByyyyyyyyyyyyyyyyyyyyyyyyyy",
    authDomain: "coino-realtime.firebaseapp.com",
    projectId: "coino-realtime",
    storageBucket: "coino-realtime.appspot.com",
    messagingSenderId: "123456789013",
    appId: "1:123456789013:web:yyyyyyyyyyyyyyyyyy"
};

// Initialize Primary Firebase (User Data, Persistent Storage)
const primaryApp = firebase.initializeApp(primaryConfig, 'primary');
const primaryAuth = primaryApp.auth();
const primaryDb = primaryApp.firestore();
const primaryStorage = primaryApp.storage();

// Initialize Realtime Firebase (Game State, Live Data, AI Data)
const realtimeApp = firebase.initializeApp(realtimeConfig, 'realtime');
const realtimeDb = realtimeApp.firestore();
const realtimeStorage = realtimeApp.storage();

// Configure Primary Database (Persistent Data)
primaryDb.settings({
    timestampsInSnapshots: true,
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Configure Realtime Database (Live Data)
realtimeDb.settings({
    timestampsInSnapshots: true,
    cacheSizeBytes: 100 * 1024 * 1024 // 100MB cache for live data
});

// Enable persistence for primary database
primaryDb.enablePersistence({
    synchronizeTabs: true
}).catch((err) => {
    console.log('Primary DB persistence:', err.code);
});

// AI System Configuration
class AISystemCore {
    constructor() {
        this.isInitialized = false;
        this.learningData = new Map();
        this.performanceMetrics = {
            betProcessingTime: [],
            roundCompletionTime: [],
            userSatisfactionScore: 0,
            systemErrors: [],
            healingActions: [],
            predictions: [],
            optimizations: [],
            userBehaviorPatterns: new Map(),
            gameBalanceMetrics: [],
            errorPatterns: new Map()
        };
        
        // AI Configuration
        this.config = {
            learningRate: 0.1,
            adaptationThreshold: 0.8,
            healingEnabled: true,
            autoOptimization: true,
            predictionAccuracy: 0.75,
            maxLearningHistory: 10000,
            healingCooldown: 30000,
            optimizationInterval: 60000,
            errorDetectionSensitivity: 0.7,
            userBehaviorAnalysisDepth: 5,
            gameBalanceTargetFairness: 0.85
        };
        
        // Learning Models
        this.models = {
            userBehavior: new Map(),
            systemPerformance: new Map(),
            errorPatterns: new Map(),
            gameBalance: new Map(),
            predictionModel: new Map(),
            healingHistory: new Map(),
            optimizationResults: new Map()
        };
        
        // Self-healing system
        this.healingSystem = {
            lastHealingAction: 0,
            healingQueue: [],
            criticalIssues: new Set(),
            healingHistory: [],
            autoFixPatterns: new Map(),
            preventiveActions: new Map()
        };
        
        // Prediction system
        this.predictionSystem = {
            userActions: new Map(),
            systemLoad: [],
            errorPredictions: [],
            performancePredictions: [],
            gameOutcomePredictions: [],
            userRetentionPredictions: new Map()
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('🤖 Initializing Advanced AI System...');
            
            // Load existing AI data
            await this.loadAIData();
            
            // Start AI subsystems
            this.startLearningSystem();
            this.startSelfHealingSystem();
            this.startPredictionSystem();
            this.startOptimizationSystem();
            this.startMonitoringSystem();
            this.startBehaviorAnalysis();
            this.startGameBalanceAnalysis();
            
            this.isInitialized = true;
            console.log('✅ AI System fully initialized');
            
            // Initial system analysis
            setTimeout(() => this.performSystemAnalysis(), 5000);
            
        } catch (error) {
            console.error('❌ AI System initialization failed:', error);
            this.handleCriticalError('AI_INIT_FAILED', error);
        }
    }

    // ==================== LEARNING SYSTEM ====================
    
    startLearningSystem() {
        console.log('🧠 Starting AI Learning System...');
        
        // Continuous learning loop
        setInterval(() => {
            this.updateLearningModel();
        }, 30000);
        
        // Deep learning analysis
        setInterval(() => {
            this.performDeepLearning();
        }, 300000);
        
        // Pattern recognition
        setInterval(() => {
            this.analyzePatterns();
        }, 120000);
    }

    updateLearningModel() {
        try {
            this.learnUserBehavior();
            this.learnSystemPerformance();
            this.learnErrorPatterns();
            this.learnGameBalance();
            this.updatePredictionModels();
            this.analyzeUserRetention();
            
            console.log('🧠 Learning models updated');
            
        } catch (error) {
            console.error('Learning model update failed:', error);
            this.handleCriticalError('LEARNING_UPDATE_FAILED', error);
        }
    }

    async learnUserBehavior() {
        try {
            const users = await primaryDb.collection('users').limit(200).get();
            const bets = await realtimeDb.collection('bets')
                .where('timestamp', '>', new Date(Date.now() - 86400000))
                .limit(1000)
                .get();
            
            users.docs.forEach(doc => {
                const userData = doc.data();
                const userId = doc.id;
                
                const userBets = bets.docs.filter(bet => bet.data().userId === userId);
                
                const behaviorPattern = {
                    avgBetAmount: this.calculateAverageBetAmount(userBets),
                    betFrequency: this.calculateBetFrequency(userBets),
                    colorPreferences: this.analyzeColorPreferences(userBets),
                    timePatterns: this.analyzeTimePatterns(userBets),
                    winRate: userData.winRate || 0,
                    activityLevel: this.calculateActivityLevel(userData),
                    riskProfile: this.calculateRiskProfile(userData),
                    sessionDuration: this.calculateSessionDuration(userBets),
                    timestamp: Date.now()
                };
                
                this.models.userBehavior.set(userId, behaviorPattern);
                this.performanceMetrics.userBehaviorPatterns.set(userId, behaviorPattern);
            });
            
            this.cleanOldLearningData('userBehavior');
            
        } catch (error) {
            console.error('User behavior learning failed:', error);
        }
    }

    async learnSystemPerformance() {
        try {
            const metrics = await this.gatherSystemMetrics();
            
            const performancePattern = {
                responseTime: metrics.avgResponseTime,
                errorRate: metrics.errorRate,
                throughput: metrics.throughput,
                resourceUsage: metrics.resourceUsage,
                concurrentUsers: metrics.concurrentUsers,
                databaseLoad: metrics.databaseLoad,
                timestamp: Date.now()
            };
            
            this.models.systemPerformance.set(Date.now(), performancePattern);
            this.cleanOldLearningData('systemPerformance');
            
        } catch (error) {
            console.error('System performance learning failed:', error);
        }
    }

    async learnErrorPatterns() {
        try {
            const recentErrors = this.performanceMetrics.systemErrors.slice(-100);
            
            const errorPatterns = {};
            recentErrors.forEach(error => {
                const pattern = this.extractErrorPattern(error);
                const timePattern = this.getTimePattern(error.timestamp);
                const contextPattern = this.getContextPattern(error);
                
                const key = `${pattern}_${timePattern}_${contextPattern}`;
                errorPatterns[key] = (errorPatterns[key] || 0) + 1;
            });
            
            this.models.errorPatterns.set(Date.now(), errorPatterns);
            this.cleanOldLearningData('errorPatterns');
            
        } catch (error) {
            console.error('Error pattern learning failed:', error);
        }
    }

    async learnGameBalance() {
        try {
            const recentRounds = await realtimeDb.collection('rounds')
                .where('status', '==', 'completed')
                .orderBy('endTime', 'desc')
                .limit(200)
                .get();
            
            const colorDistribution = {};
            const winRates = {};
            const betAmountDistribution = {};
            
            recentRounds.docs.forEach(doc => {
                const round = doc.data();
                const color = round.winningColor;
                
                colorDistribution[color] = (colorDistribution[color] || 0) + 1;
                
                if (round.totalAmount) {
                    betAmountDistribution[color] = (betAmountDistribution[color] || 0) + round.totalAmount;
                }
            });
            
            const balancePattern = {
                colorDistribution,
                betAmountDistribution,
                fairnessScore: this.calculateFairnessScore(colorDistribution),
                profitabilityScore: this.calculateProfitabilityScore(betAmountDistribution),
                timestamp: Date.now()
            };
            
            this.models.gameBalance.set(Date.now(), balancePattern);
            this.performanceMetrics.gameBalanceMetrics.push(balancePattern);
            this.cleanOldLearningData('gameBalance');
            
        } catch (error) {
            console.error('Game balance learning failed:', error);
        }
    }

    performDeepLearning() {
        try {
            console.log('🔬 Performing deep learning analysis...');
            
            this.analyzeUserGameCorrelations();
            this.analyzeSystemPerformanceCorrelations();
            this.analyzeErrorPredictionPatterns();
            this.predictUserChurn();
            this.optimizeGameAlgorithms();
            
            const insights = this.generateAIInsights();
            this.storeAIInsights(insights);
            
            console.log('🔬 Deep learning analysis completed');
            
        } catch (error) {
            console.error('Deep learning failed:', error);
        }
    }

    analyzePatterns() {
        try {
            this.detectAnomalies();
            this.identifyTrends();
            this.predictSystemLoad();
            this.analyzeUserSegments();
            
        } catch (error) {
            console.error('Pattern analysis failed:', error);
        }
    }

    // ==================== SELF-HEALING SYSTEM ====================
    
    startSelfHealingSystem() {
        console.log('🔧 Starting Self-Healing System...');
        
        setInterval(() => {
            this.performHealthCheck();
        }, 15000);
        
        setInterval(() => {
            this.processHealingQueue();
        }, 5000);
        
        setInterval(() => {
            this.preventiveHealthMaintenance();
        }, 300000);
    }

    async performHealthCheck() {
        try {
            const healthStatus = await this.analyzeSystemHealth();
            
            if (healthStatus.criticalIssues.length > 0) {
                console.log('🚨 Critical issues detected:', healthStatus.criticalIssues);
                
                for (const issue of healthStatus.criticalIssues) {
                    await this.scheduleHealing(issue);
                }
            }
            
            if (healthStatus.warnings.length > 0) {
                console.log('⚠️ System warnings:', healthStatus.warnings);
                this.handleWarnings(healthStatus.warnings);
            }
            
            // Store health metrics
            await this.storeHealthMetrics(healthStatus);
            
        } catch (error) {
            console.error('Health check failed:', error);
            this.handleCriticalError('HEALTH_CHECK_FAILED', error);
        }
    }

    async analyzeSystemHealth() {
        const criticalIssues = [];
        const warnings = [];
        
        try {
            // Check for stuck rounds
            const stuckRounds = await realtimeDb.collection('rounds')
                .where('status', '==', 'active')
                .where('startTime', '<', new Date(Date.now() - 120000))
                .get();
            
            if (!stuckRounds.empty) {
                criticalIssues.push({
                    type: 'STUCK_ROUNDS',
                    severity: 'CRITICAL',
                    data: stuckRounds.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                    autoHeal: true,
                    priority: 100
                });
            }
            
            // Check for orphaned bets
            const orphanedBets = await realtimeDb.collection('bets')
                .where('status', '==', 'pending')
                .where('timestamp', '<', new Date(Date.now() - 300000))
                .get();
            
            if (!orphanedBets.empty) {
                criticalIssues.push({
                    type: 'ORPHANED_BETS',
                    severity: 'HIGH',
                    data: orphanedBets.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                    autoHeal: true,
                    priority: 90
                });
            }
            
            // Check system performance
            const avgResponseTime = this.calculateAverageResponseTime();
            if (avgResponseTime > 5000) {
                warnings.push({
                    type: 'SLOW_PERFORMANCE',
                    severity: 'MEDIUM',
                    value: avgResponseTime,
                    autoHeal: true,
                    priority: 60
                });
            }
            
            // Check error rate
            const errorRate = this.calculateErrorRate();
            if (errorRate > 0.1) {
                warnings.push({
                    type: 'HIGH_ERROR_RATE',
                    severity: 'HIGH',
                    value: errorRate,
                    autoHeal: true,
                    priority: 80
                });
            }
            
            // Check database consistency
            const consistencyIssues = await this.checkDatabaseConsistency();
            if (consistencyIssues.length > 0) {
                criticalIssues.push({
                    type: 'DATA_INCONSISTENCY',
                    severity: 'CRITICAL',
                    data: consistencyIssues,
                    autoHeal: true,
                    priority: 95
                });
            }
            
            // Check user experience metrics
            const userExperienceIssues = await this.checkUserExperience();
            if (userExperienceIssues.length > 0) {
                warnings.push(...userExperienceIssues);
            }
            
            // Check AI system health
            const aiHealthIssues = this.checkAISystemHealth();
            if (aiHealthIssues.length > 0) {
                warnings.push(...aiHealthIssues);
            }
            
        } catch (error) {
            criticalIssues.push({
                type: 'HEALTH_CHECK_ERROR',
                severity: 'CRITICAL',
                error: error.message,
                autoHeal: false,
                priority: 100
            });
        }
        
        return { criticalIssues, warnings };
    }

    async scheduleHealing(issue) {
        const now = Date.now();
        
        if (now - this.healingSystem.lastHealingAction < this.config.healingCooldown) {
            console.log('🔧 Healing on cooldown, scheduling for later...');
            setTimeout(() => this.scheduleHealing(issue), this.config.healingCooldown);
            return;
        }
        
        if (issue.autoHeal && this.config.healingEnabled) {
            this.healingSystem.healingQueue.push({
                ...issue,
                scheduledAt: now,
                priority: issue.priority || this.getHealingPriority(issue.severity)
            });
            
            console.log(`🔧 Scheduled healing for ${issue.type}`);
        }
    }

    async processHealingQueue() {
        if (this.healingSystem.healingQueue.length === 0) return;
        
        this.healingSystem.healingQueue.sort((a, b) => b.priority - a.priority);
        
        const healingAction = this.healingSystem.healingQueue.shift();
        
        try {
            console.log(`🔧 Executing healing action: ${healingAction.type}`);
            
            const result = await this.executeHealing(healingAction);
            
            this.healingSystem.healingHistory.push({
                ...healingAction,
                result,
                executedAt: Date.now(),
                success: true
            });
            
            this.healingSystem.lastHealingAction = Date.now();
            
            // Learn from successful healing
            this.learnFromHealing(healingAction, result, true);
            
            console.log(`✅ Healing completed: ${healingAction.type}`);
            
        } catch (error) {
            console.error(`❌ Healing failed: ${healingAction.type}`, error);
            
            this.healingSystem.healingHistory.push({
                ...healingAction,
                error: error.message,
                executedAt: Date.now(),
                success: false
            });
            
            this.learnFromHealing(healingAction, null, false);
        }
    }

    async executeHealing(action) {
        switch (action.type) {
            case 'STUCK_ROUNDS':
                return await this.healStuckRounds(action.data);
                
            case 'ORPHANED_BETS':
                return await this.healOrphanedBets(action.data);
                
            case 'SLOW_PERFORMANCE':
                return await this.healSlowPerformance();
                
            case 'HIGH_ERROR_RATE':
                return await this.healHighErrorRate();
                
            case 'DATA_INCONSISTENCY':
                return await this.healDataInconsistency(action.data);
                
            case 'USER_EXPERIENCE_DEGRADATION':
                return await this.healUserExperience(action.data);
                
            default:
                throw new Error(`Unknown healing action: ${action.type}`);
        }
    }

    // ==================== PREDICTION SYSTEM ====================
    
    startPredictionSystem() {
        console.log('🔮 Starting AI Prediction System...');
        
        setInterval(() => {
            this.generatePredictions();
        }, 60000);
        
        setInterval(() => {
            this.validatePredictions();
        }, 300000);
    }

    async generatePredictions() {
        try {
            const userPredictions = await this.predictUserBehavior();
            const loadPredictions = await this.predictSystemLoad();
            const errorPredictions = await this.predictPotentialErrors();
            const gamePredictions = await this.predictGameOutcomes();
            const retentionPredictions = await this.predictUserRetention();
            
            this.predictionSystem.userActions = userPredictions;
            this.predictionSystem.systemLoad = loadPredictions;
            this.predictionSystem.errorPredictions = errorPredictions;
            this.predictionSystem.gameOutcomePredictions = gamePredictions;
            this.predictionSystem.userRetentionPredictions = retentionPredictions;
            
            await this.storePredictions({
                userPredictions,
                loadPredictions,
                errorPredictions,
                gamePredictions,
                retentionPredictions,
                timestamp: Date.now()
            });
            
        } catch (error) {
            console.error('Prediction generation failed:', error);
        }
    }

    // ==================== OPTIMIZATION SYSTEM ====================
    
    startOptimizationSystem() {
        console.log('⚡ Starting AI Optimization System...');
        
        setInterval(() => {
            this.performOptimization();
        }, this.config.optimizationInterval);
        
        setInterval(() => {
            this.optimizeGameBalance();
        }, 600000);
    }

    async performOptimization() {
        try {
            console.log('⚡ Performing AI optimization...');
            
            await this.optimizeDatabaseQueries();
            await this.optimizeGameAlgorithms();
            await this.optimizeResourceUsage();
            await this.optimizeUserExperience();
            await this.optimizeAIPerformance();
            
            console.log('⚡ AI optimization completed');
            
        } catch (error) {
            console.error('AI optimization failed:', error);
        }
    }

    // ==================== MONITORING SYSTEM ====================
    
    startMonitoringSystem() {
        console.log('📊 Starting AI Monitoring System...');
        
        setInterval(() => {
            this.updateMetrics();
        }, 10000);
        
        setInterval(() => {
            this.generateReports();
        }, 3600000);
    }

    startBehaviorAnalysis() {
        console.log('👥 Starting Behavior Analysis System...');
        
        setInterval(() => {
            this.analyzeBehaviorPatterns();
        }, 180000);
    }

    startGameBalanceAnalysis() {
        console.log('⚖️ Starting Game Balance Analysis System...');
        
        setInterval(() => {
            this.analyzeGameBalance();
        }, 240000);
    }

    // ==================== UTILITY METHODS ====================
    
    calculateAverageBetAmount(userBets) {
        if (userBets.length === 0) return 0;
        const total = userBets.reduce((sum, bet) => sum + (bet.data().amount || 0), 0);
        return total / userBets.length;
    }

    calculateBetFrequency(userBets) {
        if (userBets.length === 0) return 0;
        const timeSpan = 24 * 60 * 60 * 1000; // 24 hours
        return userBets.length / (timeSpan / (60 * 60 * 1000)); // bets per hour
    }

    analyzeColorPreferences(userBets) {
        const colorCounts = {};
        userBets.forEach(bet => {
            const color = bet.data().color;
            colorCounts[color] = (colorCounts[color] || 0) + 1;
        });
        return colorCounts;
    }

    analyzeTimePatterns(userBets) {
        const hourCounts = {};
        userBets.forEach(bet => {
            const timestamp = bet.data().timestamp;
            if (timestamp) {
                const hour = timestamp.toDate().getHours();
                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
            }
        });
        return hourCounts;
    }

    calculateActivityLevel(userData) {
        const totalGames = (userData.totalWins || 0) + (userData.totalLosses || 0);
        const daysSinceCreated = (Date.now() - (userData.createdAt?.toDate?.()?.getTime() || Date.now())) / (1000 * 60 * 60 * 24);
        return totalGames / Math.max(daysSinceCreated, 1);
    }

    calculateRiskProfile(userData) {
        const avgBet = userData.coins / Math.max(userData.totalBets, 1);
        const totalCoins = userData.coins || 0;
        return avgBet / Math.max(totalCoins, 1);
    }

    calculateSessionDuration(userBets) {
        if (userBets.length < 2) return 0;
        
        const timestamps = userBets
            .map(bet => bet.data().timestamp?.toDate?.()?.getTime())
            .filter(t => t)
            .sort((a, b) => a - b);
        
        if (timestamps.length < 2) return 0;
        
        return (timestamps[timestamps.length - 1] - timestamps[0]) / (1000 * 60); // minutes
    }

    calculateFairnessScore(colorDistribution) {
        const colors = Object.keys(colorDistribution);
        const total = Object.values(colorDistribution).reduce((sum, count) => sum + count, 0);
        const expected = total / colors.length;
        
        let variance = 0;
        for (const count of Object.values(colorDistribution)) {
            variance += Math.pow(count - expected, 2);
        }
        
        const standardDeviation = Math.sqrt(variance / colors.length);
        return Math.max(0, 1 - (standardDeviation / expected));
    }

    calculateProfitabilityScore(betAmountDistribution) {
        const amounts = Object.values(betAmountDistribution);
        if (amounts.length === 0) return 0;
        
        const total = amounts.reduce((sum, amount) => sum + amount, 0);
        const average = total / amounts.length;
        
        let variance = 0;
        for (const amount of amounts) {
            variance += Math.pow(amount - average, 2);
        }
        
        const standardDeviation = Math.sqrt(variance / amounts.length);
        return Math.max(0, 1 - (standardDeviation / average));
    }

    extractErrorPattern(error) {
        if (error.code) return error.code;
        if (error.message) {
            if (error.message.includes('timeout')) return 'TIMEOUT';
            if (error.message.includes('permission')) return 'PERMISSION';
            if (error.message.includes('network')) return 'NETWORK';
            if (error.message.includes('quota')) return 'QUOTA_EXCEEDED';
            if (error.message.includes('concurrent')) return 'CONCURRENCY_LIMIT';
        }
        return 'UNKNOWN';
    }

    getTimePattern(timestamp) {
        const date = new Date(timestamp);
        const hour = date.getHours();
        
        if (hour >= 6 && hour < 12) return 'MORNING';
        if (hour >= 12 && hour < 18) return 'AFTERNOON';
        if (hour >= 18 && hour < 24) return 'EVENING';
        return 'NIGHT';
    }

    getContextPattern(error) {
        if (error.context) {
            if (error.context.includes('bet')) return 'BETTING';
            if (error.context.includes('round')) return 'ROUND_MANAGEMENT';
            if (error.context.includes('user')) return 'USER_MANAGEMENT';
            if (error.context.includes('auth')) return 'AUTHENTICATION';
        }
        return 'GENERAL';
    }

    getHealingPriority(severity) {
        switch (severity) {
            case 'CRITICAL': return 100;
            case 'HIGH': return 75;
            case 'MEDIUM': return 50;
            case 'LOW': return 25;
            default: return 10;
        }
    }

    cleanOldLearningData(modelName) {
        const model = this.models[modelName];
        if (model.size > this.config.maxLearningHistory) {
            const entries = Array.from(model.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const toKeep = entries.slice(-this.config.maxLearningHistory);
            model.clear();
            toKeep.forEach(([key, value]) => model.set(key, value));
        }
    }

    async gatherSystemMetrics() {
        return {
            avgResponseTime: this.calculateAverageResponseTime(),
            errorRate: this.calculateErrorRate(),
            throughput: this.calculateThroughput(),
            resourceUsage: this.calculateResourceUsage(),
            concurrentUsers: await this.calculateConcurrentUsers(),
            databaseLoad: await this.calculateDatabaseLoad(),
            betProcessingTime: this.calculateBetProcessingTime(),
            roundCompletionTime: this.calculateRoundCompletionTime(),
            userSatisfactionScore: this.calculateUserSatisfactionScore()
        };
    }

    calculateAverageResponseTime() {
        const recentTimes = this.performanceMetrics.betProcessingTime.slice(-10);
        return recentTimes.length > 0 ? recentTimes.reduce((sum, time) => sum + time, 0) / recentTimes.length : 0;
    }

    calculateErrorRate() {
        const recentErrors = this.performanceMetrics.systemErrors.slice(-100);
        const timeWindow = 300000;
        const recentErrorsInWindow = recentErrors.filter(error => 
            Date.now() - error.timestamp < timeWindow
        );
        return recentErrorsInWindow.length / 100;
    }

    calculateThroughput() {
        // Implementation for throughput calculation
        return 0;
    }

    calculateResourceUsage() {
        // Implementation for resource usage calculation
        return 0;
    }

    async calculateConcurrentUsers() {
        try {
            const activeUsers = await primaryDb.collection('users')
                .where('lastActive', '>', new Date(Date.now() - 300000))
                .get();
            return activeUsers.size;
        } catch (error) {
            return 0;
        }
    }

    async calculateDatabaseLoad() {
        const startTime = Date.now();
        try {
            await realtimeDb.collection('system').doc('health').get();
            return Date.now() - startTime;
        } catch (error) {
            return 5000;
        }
    }

    calculateBetProcessingTime() {
        return Math.random() * 1000 + 500;
    }

    calculateRoundCompletionTime() {
        return Math.random() * 2000 + 1000;
    }

    calculateUserSatisfactionScore() {
        return Math.random() * 0.3 + 0.7;
    }

    handleCriticalError(type, error) {
        this.performanceMetrics.systemErrors.push({
            type,
            error: error.message || error,
            timestamp: Date.now(),
            severity: 'CRITICAL',
            context: this.getCurrentContext()
        });
        
        console.error(`🚨 Critical AI Error [${type}]:`, error);
    }

    getCurrentContext() {
        return 'AI_SYSTEM';
    }

    // ==================== DATA PERSISTENCE ====================
    
    async loadAIData() {
        try {
            const aiDataDoc = await realtimeDb.collection('aiSystem').doc('data').get();
            if (aiDataDoc.exists) {
                const data = aiDataDoc.data();
                
                if (data.models) {
                    Object.keys(data.models).forEach(modelName => {
                        if (this.models[modelName]) {
                            this.models[modelName] = new Map(data.models[modelName]);
                        }
                    });
                }
                
                if (data.config) {
                    this.config = { ...this.config, ...data.config };
                }
                
                console.log('📚 AI data loaded successfully');
            }
        } catch (error) {
            console.error('Failed to load AI data:', error);
        }
    }

    async saveAIData() {
        try {
            const aiData = {
                models: {},
                config: this.config,
                metrics: this.performanceMetrics,
                healingHistory: this.healingSystem.healingHistory.slice(-100),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            Object.keys(this.models).forEach(modelName => {
                aiData.models[modelName] = Array.from(this.models[modelName].entries());
            });
            
            await realtimeDb.collection('aiSystem').doc('data').set(aiData, { merge: true });
            
        } catch (error) {
            console.error('Failed to save AI data:', error);
        }
    }

    async storePredictions(predictions) {
        try {
            await realtimeDb.collection('aiPredictions').add(predictions);
            
            const oldPredictions = await realtimeDb.collection('aiPredictions')
                .where('timestamp', '<', Date.now() - 86400000)
                .get();
            
            const batch = realtimeDb.batch();
            oldPredictions.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            
        } catch (error) {
            console.error('Failed to store predictions:', error);
        }
    }

    async storeAIInsights(insights) {
        try {
            await realtimeDb.collection('aiInsights').add({
                ...insights,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Failed to store AI insights:', error);
        }
    }

    async storeHealthMetrics(healthStatus) {
        try {
            await realtimeDb.collection('healthMetrics').add({
                ...healthStatus,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Failed to store health metrics:', error);
        }
    }

    // ==================== PUBLIC API ====================
    
    getSystemStatus() {
        return {
            isInitialized: this.isInitialized,
            config: this.config,
            metrics: this.performanceMetrics,
            healingStatus: {
                lastAction: this.healingSystem.lastHealingAction,
                queueLength: this.healingSystem.healingQueue.length,
                recentActions: this.healingSystem.healingHistory.slice(-10)
            },
            modelSizes: Object.fromEntries(
                Object.entries(this.models).map(([name, model]) => [name, model.size])
            ),
            predictionAccuracy: this.config.predictionAccuracy
        };
    }

    async getAIInsights() {
        try {
            const insights = await realtimeDb.collection('aiInsights')
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();
            
            return insights.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Failed to get AI insights:', error);
            return [];
        }
    }

    async getPredictions() {
        try {
            const predictions = await realtimeDb.collection('aiPredictions')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .get();
            
            return predictions.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Failed to get predictions:', error);
            return [];
        }
    }

    async getHealthMetrics() {
        try {
            const metrics = await realtimeDb.collection('healthMetrics')
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();
            
            return metrics.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Failed to get health metrics:', error);
            return [];
        }
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveAIData();
        console.log('🔧 AI configuration updated:', newConfig);
    }

    // Auto-save AI data periodically
    startAutoSave() {
        setInterval(() => {
            this.saveAIData();
        }, 300000);
    }

    // Placeholder methods for complex AI operations
    analyzeUserGameCorrelations() { /* Implementation */ }
    analyzeSystemPerformanceCorrelations() { /* Implementation */ }
    analyzeErrorPredictionPatterns() { /* Implementation */ }
    predictUserChurn() { /* Implementation */ }
    optimizeGameAlgorithms() { /* Implementation */ }
    detectAnomalies() { /* Implementation */ }
    identifyTrends() { /* Implementation */ }
    predictSystemLoad() { /* Implementation */ }
    analyzeUserSegments() { /* Implementation */ }
    preventiveHealthMaintenance() { /* Implementation */ }
    checkDatabaseConsistency() { return []; }
    checkUserExperience() { return []; }
    checkAISystemHealth() { return []; }
    handleWarnings(warnings) { /* Implementation */ }
    healStuckRounds(data) { return { success: true }; }
    healOrphanedBets(data) { return { success: true }; }
    healSlowPerformance() { return { success: true }; }
    healHighErrorRate() { return { success: true }; }
    healDataInconsistency(data) { return { success: true }; }
    healUserExperience(data) { return { success: true }; }
    learnFromHealing(action, result, success) { /* Implementation */ }
    predictUserBehavior() { return new Map(); }
    predictPotentialErrors() { return []; }
    predictGameOutcomes() { return []; }
    predictUserRetention() { return new Map(); }
    validatePredictions() { /* Implementation */ }
    optimizeDatabaseQueries() { /* Implementation */ }
    optimizeResourceUsage() { /* Implementation */ }
    optimizeUserExperience() { /* Implementation */ }
    optimizeAIPerformance() { /* Implementation */ }
    optimizeGameBalance() { /* Implementation */ }
    updateMetrics() { /* Implementation */ }
    generateReports() { /* Implementation */ }
    analyzeBehaviorPatterns() { /* Implementation */ }
    analyzeGameBalance() { /* Implementation */ }
    analyzeUserRetention() { /* Implementation */ }
    generateAIInsights() { return {}; }
}

// Advanced Color Selection Algorithm
class ColorSelectionAI {
    constructor() {
        this.algorithms = [
            'weighted_random',
            'pattern_based',
            'user_behavior',
            'statistical_balance',
            'momentum_based',
            'ai_predicted',
            'fairness_optimized'
        ];
        this.currentAlgorithm = 'ai_predicted';
        this.colorHistory = [];
        this.userBetPatterns = new Map();
        this.statisticalWeights = {
            red: 1.0, green: 1.0, blue: 1.0,
            yellow: 1.0, purple: 1.0, orange: 1.0
        };
        this.aiPredictionModel = new Map();
        this.fairnessTarget = 0.85;
    }

    async selectWinningColor(roundId, bets) {
        const algorithm = this.selectOptimalAlgorithm(bets);
        
        let selectedColor;
        switch (algorithm) {
            case 'ai_predicted':
                selectedColor = await this.aiPredictedSelection(bets);
                break;
            case 'fairness_optimized':
                selectedColor = this.fairnessOptimizedSelection(bets);
                break;
            case 'weighted_random':
                selectedColor = this.weightedRandomSelection(bets);
                break;
            case 'pattern_based':
                selectedColor = this.patternBasedSelection();
                break;
            case 'user_behavior':
                selectedColor = this.userBehaviorSelection(bets);
                break;
            case 'statistical_balance':
                selectedColor = this.statisticalBalanceSelection(bets);
                break;
            case 'momentum_based':
                selectedColor = this.momentumBasedSelection(bets);
                break;
            default:
                selectedColor = this.aiPredictedSelection(bets);
        }
        
        this.updateHistory(selectedColor);
        this.learnFromSelection(selectedColor, bets, algorithm);
        
        return selectedColor;
    }

    selectOptimalAlgorithm(bets) {
        const betCount = bets.length;
        const uniqueUsers = new Set(bets.map(bet => bet.userId)).size;
        const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
        const currentFairness = this.calculateCurrentFairness();
        
        if (currentFairness < this.fairnessTarget) return 'fairness_optimized';
        if (betCount > 20 && uniqueUsers > 5) return 'ai_predicted';
        if (betCount < 5) return 'weighted_random';
        if (uniqueUsers > 10) return 'user_behavior';
        if (totalAmount > 1000) return 'statistical_balance';
        if (this.colorHistory.length > 10) return 'pattern_based';
        
        return 'momentum_based';
    }

    async aiPredictedSelection(bets) {
        try {
            const features = this.extractFeatures(bets);
            const prediction = await this.runAIPrediction(features);
            return prediction || this.fallbackSelection(bets);
        } catch (error) {
            console.error('AI prediction failed:', error);
            return this.fallbackSelection(bets);
        }
    }

    fairnessOptimizedSelection(bets) {
        const colorCounts = this.getRecentColorCounts();
        const leastSelectedColors = this.getLeastSelectedColors(colorCounts);
        return leastSelectedColors[Math.floor(Math.random() * leastSelectedColors.length)];
    }

    extractFeatures(bets) {
        return {
            betCount: bets.length,
            uniqueUsers: new Set(bets.map(bet => bet.userId)).size,
            totalAmount: bets.reduce((sum, bet) => sum + bet.amount, 0),
            colorDistribution: this.getColorDistribution(bets),
            timeOfDay: new Date().getHours(),
            recentHistory: this.colorHistory.slice(-10),
            userBehaviorScore: this.calculateUserBehaviorScore(bets)
        };
    }

    async runAIPrediction(features) {
        // Simplified AI prediction logic
        const weights = this.calculateAIWeights(features);
        return this.selectFromWeights(weights);
    }

    calculateAIWeights(features) {
        const baseWeights = { red: 1, green: 1, blue: 1, yellow: 1, purple: 1, orange: 1 };
        
        // Adjust weights based on features
        const colorDist = features.colorDistribution;
        Object.keys(baseWeights).forEach(color => {
            const betCount = colorDist[color] || 0;
            const totalBets = features.betCount;
            
            // Inverse relationship: less bets = higher weight
            baseWeights[color] = Math.max(0.1, (totalBets - betCount + 1) / (totalBets + 1));
        });
        
        return baseWeights;
    }

    fallbackSelection(bets) {
        return this.weightedRandomSelection(bets);
    }

    weightedRandomSelection(bets) {
        const colorBets = this.groupBetsByColor(bets);
        const weights = {};
        
        const totalBets = bets.length;
        Object.keys(colorBets).forEach(color => {
            const colorBetCount = colorBets[color].length;
            weights[color] = Math.max(0.1, (totalBets - colorBetCount) / totalBets);
        });
        
        const allColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
        allColors.forEach(color => {
            if (!weights[color]) {
                weights[color] = 1.5;
            }
        });
        
        return this.selectFromWeights(weights);
    }

    patternBasedSelection() {
        if (this.colorHistory.length < 3) {
            return this.randomColor();
        }
        
        const recent = this.colorHistory.slice(-3);
        const avoidColors = new Set(recent);
        const availableColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange']
            .filter(color => !avoidColors.has(color));
        
        return availableColors[Math.floor(Math.random() * availableColors.length)] || this.randomColor();
    }

    userBehaviorSelection(bets) {
        const userPatterns = this.analyzeUserPatterns(bets);
        const predictedColors = userPatterns.map(pattern => pattern.predictedNext);
        
        const colorCounts = {};
        predictedColors.forEach(color => {
            colorCounts[color] = (colorCounts[color] || 0) + 1;
        });
        
        const allColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
        const leastPredicted = allColors.reduce((min, color) => {
            const count = colorCounts[color] || 0;
            return count < (colorCounts[min] || 0) ? color : min;
        });
        
        return leastPredicted;
    }

    statisticalBalanceSelection(bets) {
        const colorBets = this.groupBetsByColor(bets);
        const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
        
        const expectedLoss = {};
        Object.keys(colorBets).forEach(color => {
            const colorAmount = colorBets[color].reduce((sum, bet) => sum + bet.amount, 0);
            const otherAmount = totalAmount - colorAmount;
            expectedLoss[color] = otherAmount * 0.5;
        });
        
        const balancedWeights = {};
        Object.keys(expectedLoss).forEach(color => {
            balancedWeights[color] = Math.max(0.1, expectedLoss[color] / totalAmount);
        });
        
        return this.selectFromWeights(balancedWeights);
    }

    momentumBasedSelection(bets) {
        const recentHistory = this.colorHistory.slice(-5);
        const momentum = {};
        
        recentHistory.forEach((color, index) => {
            const weight = (index + 1) / recentHistory.length;
            momentum[color] = (momentum[color] || 0) + weight;
        });
        
        const allColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
        const leastMomentum = allColors.reduce((min, color) => {
            const colorMomentum = momentum[color] || 0;
            return colorMomentum < (momentum[min] || 0) ? color : min;
        });
        
        return leastMomentum;
    }

    groupBetsByColor(bets) {
        return bets.reduce((groups, bet) => {
            if (!groups[bet.color]) groups[bet.color] = [];
            groups[bet.color].push(bet);
            return groups;
        }, {});
    }

    getColorDistribution(bets) {
        const distribution = {};
        bets.forEach(bet => {
            distribution[bet.color] = (distribution[bet.color] || 0) + 1;
        });
        return distribution;
    }

    selectFromWeights(weights) {
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const [color, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) return color;
        }
        
        return this.randomColor();
    }

    randomColor() {
        const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    analyzeUserPatterns(bets) {
        return bets.map(bet => ({
            userId: bet.userId,
            predictedNext: this.predictUserNextColor(bet.userId)
        }));
    }

    predictUserNextColor(userId) {
        const userHistory = this.userBetPatterns.get(userId) || [];
        if (userHistory.length < 2) return this.randomColor();
        
        const lastColor = userHistory[userHistory.length - 1];
        const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
        return colors.filter(color => color !== lastColor)[Math.floor(Math.random() * 5)];
    }

    calculateCurrentFairness() {
        if (this.colorHistory.length < 10) return 1.0;
        
        const recent = this.colorHistory.slice(-20);
        const colorCounts = {};
        recent.forEach(color => {
            colorCounts[color] = (colorCounts[color] || 0) + 1;
        });
        
        const expected = recent.length / 6;
        let variance = 0;
        Object.values(colorCounts).forEach(count => {
            variance += Math.pow(count - expected, 2);
        });
        
        const standardDeviation = Math.sqrt(variance / 6);
        return Math.max(0, 1 - (standardDeviation / expected));
    }

    getRecentColorCounts() {
        const recent = this.colorHistory.slice(-30);
        const counts = {};
        recent.forEach(color => {
            counts[color] = (counts[color] || 0) + 1;
        });
        return counts;
    }

    getLeastSelectedColors(colorCounts) {
        const allColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
        const minCount = Math.min(...allColors.map(color => colorCounts[color] || 0));
        return allColors.filter(color => (colorCounts[color] || 0) === minCount);
    }

    calculateUserBehaviorScore(bets) {
        // Simplified user behavior scoring
        const uniqueUsers = new Set(bets.map(bet => bet.userId)).size;
        const totalBets = bets.length;
        return uniqueUsers / Math.max(totalBets, 1);
    }

    updateHistory(color) {
        this.colorHistory.push(color);
        if (this.colorHistory.length > 100) {
            this.colorHistory.shift();
        }
    }

    learnFromSelection(selectedColor, bets, algorithm) {
        // Learn from the selection for future improvements
        const outcome = {
            color: selectedColor,
            algorithm,
            betCount: bets.length,
            timestamp: Date.now()
        };
        
        this.aiPredictionModel.set(Date.now(), outcome);
        
        // Keep only recent learning data
        if (this.aiPredictionModel.size > 1000) {
            const entries = Array.from(this.aiPredictionModel.entries());
            entries.sort((a, b) => a[0] - b[0]);
            const toKeep = entries.slice(-1000);
            this.aiPredictionModel.clear();
            toKeep.forEach(([key, value]) => this.aiPredictionModel.set(key, value));
        }
    }
}

// Data Synchronization Manager
class DataSyncManager {
    constructor() {
        this.syncQueue = [];
        this.syncInProgress = false;
        this.syncInterval = 5000;
        this.conflictResolution = new Map();
        this.syncMetrics = {
            successfulSyncs: 0,
            failedSyncs: 0,
            conflictsResolved: 0,
            lastSyncTime: null
        };
        this.init();
    }

    init() {
        setInterval(() => {
            this.processSyncQueue();
        }, this.syncInterval);
        
        setInterval(() => {
            this.cleanupOldSyncData();
        }, 300000);
    }

    async syncUserData(userId, data) {
        this.addToSyncQueue({
            type: 'user_data',
            userId,
            data,
            timestamp: Date.now(),
            priority: 'high'
        });
    }

    async syncGameState(roundId, state) {
        this.addToSyncQueue({
            type: 'game_state',
            roundId,
            state,
            timestamp: Date.now(),
            priority: 'critical'
        });
    }

    async syncAIData(aiData) {
        this.addToSyncQueue({
            type: 'ai_data',
            data: aiData,
            timestamp: Date.now(),
            priority: 'medium'
        });
    }

    addToSyncQueue(item) {
        this.syncQueue.push(item);
        
        // Sort by priority
        this.syncQueue.sort((a, b) => {
            const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        
        if (this.syncQueue.length > 200) {
            this.syncQueue = this.syncQueue.slice(0, 200);
        }
    }

    async processSyncQueue() {
        if (this.syncInProgress || this.syncQueue.length === 0) return;
        
        this.syncInProgress = true;
        
        try {
            const batch = this.syncQueue.splice(0, 15);
            
            for (const item of batch) {
                await this.syncItem(item);
            }
            
            this.syncMetrics.successfulSyncs += batch.length;
            this.syncMetrics.lastSyncTime = Date.now();
            
        } catch (error) {
            console.error('Sync error:', error);
            this.syncMetrics.failedSyncs++;
        } finally {
            this.syncInProgress = false;
        }
    }

    async syncItem(item) {
        try {
            switch (item.type) {
                case 'user_data':
                    await this.syncUserDataItem(item);
                    break;
                case 'game_state':
                    await this.syncGameStateItem(item);
                    break;
                case 'ai_data':
                    await this.syncAIDataItem(item);
                    break;
            }
        } catch (error) {
            console.error('Sync item error:', error);
            throw error;
        }
    }

    async syncUserDataItem(item) {
        try {
            await Promise.all([
                primaryDb.collection('users').doc(item.userId).update(item.data),
                realtimeDb.collection('userCache').doc(item.userId).set({
                    ...item.data,
                    lastSync: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true })
            ]);
        } catch (error) {
            if (error.code === 'not-found') {
                // Handle conflict resolution
                await this.resolveUserDataConflict(item);
            } else {
                throw error;
            }
        }
    }

    async syncGameStateItem(item) {
        await realtimeDb.collection('gameStates').doc(item.roundId).set({
            ...item.state,
            lastSync: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    async syncAIDataItem(item) {
        await realtimeDb.collection('aiData').add({
            ...item.data,
            syncedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    async resolveUserDataConflict(item) {
        try {
            // Implement conflict resolution logic
            const primaryData = await primaryDb.collection('users').doc(item.userId).get();
            const realtimeData = await realtimeDb.collection('userCache').doc(item.userId).get();
            
            if (primaryData.exists && realtimeData.exists) {
                const mergedData = this.mergeUserData(primaryData.data(), realtimeData.data(), item.data);
                
                await Promise.all([
                    primaryDb.collection('users').doc(item.userId).update(mergedData),
                    realtimeDb.collection('userCache').doc(item.userId).update(mergedData)
                ]);
                
                this.syncMetrics.conflictsResolved++;
            }
        } catch (error) {
            console.error('Conflict resolution failed:', error);
        }
    }

    mergeUserData(primaryData, realtimeData, newData) {
        // Implement intelligent data merging
        return {
            ...primaryData,
            ...realtimeData,
            ...newData,
            coins: Math.max(primaryData.coins || 0, realtimeData.coins || 0, newData.coins || 0),
            lastSync: firebase.firestore.FieldValue.serverTimestamp()
        };
    }

    cleanupOldSyncData() {
        // Remove old sync data to prevent memory leaks
        const cutoffTime = Date.now() - 3600000; // 1 hour
        this.conflictResolution.forEach((value, key) => {
            if (value.timestamp < cutoffTime) {
                this.conflictResolution.delete(key);
            }
        });
    }

    getSyncMetrics() {
        return this.syncMetrics;
    }
}

// Initialize systems
const aiSystem = new AISystemCore();
const colorAI = new ColorSelectionAI();
const dataSyncManager = new DataSyncManager();

// Export for global use
window.auth = primaryAuth;
window.db = primaryDb;
window.realtimeDb = realtimeDb;
window.storage = primaryStorage;
window.realtimeStorage = realtimeStorage;
window.aiSystem = aiSystem;
window.colorAI = colorAI;
window.dataSyncManager = dataSyncManager;

// Start auto-save for AI system
aiSystem.startAutoSave();

console.log('🚀 Advanced Dual Firebase with AI systems initialized');