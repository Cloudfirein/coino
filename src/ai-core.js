// Advanced AI Core System for Coino
class CoinoAI {
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
            optimizations: []
        };
        
        // AI Configuration
        this.config = {
            learningRate: 0.1,
            adaptationThreshold: 0.8,
            healingEnabled: true,
            autoOptimization: true,
            predictionAccuracy: 0.75,
            maxLearningHistory: 10000,
            healingCooldown: 30000, // 30 seconds
            optimizationInterval: 60000 // 1 minute
        };
        
        // Learning Models
        this.models = {
            userBehavior: new Map(),
            systemPerformance: new Map(),
            errorPatterns: new Map(),
            gameBalance: new Map(),
            predictionModel: new Map()
        };
        
        // Self-healing system
        this.healingSystem = {
            lastHealingAction: 0,
            healingQueue: [],
            criticalIssues: new Set(),
            healingHistory: []
        };
        
        // Prediction system
        this.predictionSystem = {
            userActions: new Map(),
            systemLoad: [],
            errorPredictions: [],
            performancePredictions: []
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
        }, 30000); // Every 30 seconds
        
        // Deep learning analysis
        setInterval(() => {
            this.performDeepLearning();
        }, 300000); // Every 5 minutes
    }

    updateLearningModel() {
        try {
            // Learn from user behavior
            this.learnUserBehavior();
            
            // Learn from system performance
            this.learnSystemPerformance();
            
            // Learn from error patterns
            this.learnErrorPatterns();
            
            // Learn from game balance
            this.learnGameBalance();
            
            // Update prediction models
            this.updatePredictionModels();
            
            console.log('🧠 Learning models updated');
            
        } catch (error) {
            console.error('Learning model update failed:', error);
        }
    }

    async learnUserBehavior() {
        try {
            const users = await db.collection('users').limit(100).get();
            
            users.docs.forEach(doc => {
                const userData = doc.data();
                const userId = doc.id;
                
                // Analyze betting patterns
                const behaviorPattern = {
                    avgBetAmount: userData.coins / Math.max(userData.totalBets, 1),
                    winRate: userData.winRate || 0,
                    activityLevel: this.calculateActivityLevel(userData),
                    riskProfile: this.calculateRiskProfile(userData),
                    timestamp: Date.now()
                };
                
                this.models.userBehavior.set(userId, behaviorPattern);
            });
            
            // Clean old data
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
            const recentErrors = this.performanceMetrics.systemErrors.slice(-50);
            
            const errorPatterns = {};
            recentErrors.forEach(error => {
                const pattern = this.extractErrorPattern(error);
                errorPatterns[pattern] = (errorPatterns[pattern] || 0) + 1;
            });
            
            this.models.errorPatterns.set(Date.now(), errorPatterns);
            this.cleanOldLearningData('errorPatterns');
            
        } catch (error) {
            console.error('Error pattern learning failed:', error);
        }
    }

    async learnGameBalance() {
        try {
            const recentRounds = await db.collection('rounds')
                .where('status', '==', 'completed')
                .orderBy('endTime', 'desc')
                .limit(100)
                .get();
            
            const colorDistribution = {};
            const winRates = {};
            
            recentRounds.docs.forEach(doc => {
                const round = doc.data();
                const color = round.winningColor;
                
                colorDistribution[color] = (colorDistribution[color] || 0) + 1;
            });
            
            const balancePattern = {
                colorDistribution,
                fairnessScore: this.calculateFairnessScore(colorDistribution),
                timestamp: Date.now()
            };
            
            this.models.gameBalance.set(Date.now(), balancePattern);
            this.cleanOldLearningData('gameBalance');
            
        } catch (error) {
            console.error('Game balance learning failed:', error);
        }
    }

    performDeepLearning() {
        try {
            console.log('🔬 Performing deep learning analysis...');
            
            // Analyze correlations between different data points
            this.analyzeUserGameCorrelations();
            this.analyzeSystemPerformanceCorrelations();
            this.analyzeErrorPredictionPatterns();
            
            // Generate insights
            const insights = this.generateAIInsights();
            this.storeAIInsights(insights);
            
            console.log('🔬 Deep learning analysis completed');
            
        } catch (error) {
            console.error('Deep learning failed:', error);
        }
    }

    // ==================== SELF-HEALING SYSTEM ====================
    
    startSelfHealingSystem() {
        console.log('🔧 Starting Self-Healing System...');
        
        // Continuous health monitoring
        setInterval(() => {
            this.performHealthCheck();
        }, 15000); // Every 15 seconds
        
        // Process healing queue
        setInterval(() => {
            this.processHealingQueue();
        }, 5000); // Every 5 seconds
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
            const stuckRounds = await db.collection('rounds')
                .where('status', '==', 'active')
                .where('startTime', '<', new Date(Date.now() - 120000))
                .get();
            
            if (!stuckRounds.empty) {
                criticalIssues.push({
                    type: 'STUCK_ROUNDS',
                    severity: 'CRITICAL',
                    data: stuckRounds.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                    autoHeal: true
                });
            }
            
            // Check for orphaned bets
            const orphanedBets = await db.collection('bets')
                .where('status', '==', 'pending')
                .where('timestamp', '<', new Date(Date.now() - 300000))
                .get();
            
            if (!orphanedBets.empty) {
                criticalIssues.push({
                    type: 'ORPHANED_BETS',
                    severity: 'HIGH',
                    data: orphanedBets.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                    autoHeal: true
                });
            }
            
            // Check system performance
            const avgResponseTime = this.calculateAverageResponseTime();
            if (avgResponseTime > 5000) {
                warnings.push({
                    type: 'SLOW_PERFORMANCE',
                    severity: 'MEDIUM',
                    value: avgResponseTime,
                    autoHeal: true
                });
            }
            
            // Check error rate
            const errorRate = this.calculateErrorRate();
            if (errorRate > 0.1) {
                warnings.push({
                    type: 'HIGH_ERROR_RATE',
                    severity: 'HIGH',
                    value: errorRate,
                    autoHeal: true
                });
            }
            
            // Check database consistency
            const consistencyIssues = await this.checkDatabaseConsistency();
            if (consistencyIssues.length > 0) {
                criticalIssues.push({
                    type: 'DATA_INCONSISTENCY',
                    severity: 'CRITICAL',
                    data: consistencyIssues,
                    autoHeal: true
                });
            }
            
        } catch (error) {
            criticalIssues.push({
                type: 'HEALTH_CHECK_ERROR',
                severity: 'CRITICAL',
                error: error.message,
                autoHeal: false
            });
        }
        
        return { criticalIssues, warnings };
    }

    async scheduleHealing(issue) {
        const now = Date.now();
        
        // Check cooldown
        if (now - this.healingSystem.lastHealingAction < this.config.healingCooldown) {
            console.log('🔧 Healing on cooldown, scheduling for later...');
            setTimeout(() => this.scheduleHealing(issue), this.config.healingCooldown);
            return;
        }
        
        if (issue.autoHeal && this.config.healingEnabled) {
            this.healingSystem.healingQueue.push({
                ...issue,
                scheduledAt: now,
                priority: this.getHealingPriority(issue.severity)
            });
            
            console.log(`🔧 Scheduled healing for ${issue.type}`);
        }
    }

    async processHealingQueue() {
        if (this.healingSystem.healingQueue.length === 0) return;
        
        // Sort by priority
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
            
            console.log(`✅ Healing completed: ${healingAction.type}`);
            
        } catch (error) {
            console.error(`❌ Healing failed: ${healingAction.type}`, error);
            
            this.healingSystem.healingHistory.push({
                ...healingAction,
                error: error.message,
                executedAt: Date.now(),
                success: false
            });
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
                
            default:
                throw new Error(`Unknown healing action: ${action.type}`);
        }
    }

    async healStuckRounds(stuckRounds) {
        const results = [];
        
        for (const round of stuckRounds) {
            try {
                // Force end the round
                const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
                const winningColor = colors[Math.floor(Math.random() * colors.length)];
                
                await db.collection('rounds').doc(round.id).update({
                    status: 'completed',
                    endTime: firebase.firestore.FieldValue.serverTimestamp(),
                    winningColor: winningColor,
                    healedBy: 'AI_SYSTEM',
                    healedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                results.push({ roundId: round.id, action: 'force_ended', success: true });
                
            } catch (error) {
                results.push({ roundId: round.id, action: 'force_ended', success: false, error: error.message });
            }
        }
        
        return results;
    }

    async healOrphanedBets(orphanedBets) {
        const results = [];
        
        for (const bet of orphanedBets) {
            try {
                // Refund the bet
                await db.runTransaction(async (transaction) => {
                    const userRef = db.collection('users').doc(bet.userId);
                    const betRef = db.collection('bets').doc(bet.id);
                    
                    transaction.update(userRef, {
                        coins: firebase.firestore.FieldValue.increment(bet.amount)
                    });
                    
                    transaction.update(betRef, {
                        status: 'refunded',
                        healedBy: 'AI_SYSTEM',
                        healedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                });
                
                results.push({ betId: bet.id, action: 'refunded', success: true });
                
            } catch (error) {
                results.push({ betId: bet.id, action: 'refunded', success: false, error: error.message });
            }
        }
        
        return results;
    }

    // ==================== PREDICTION SYSTEM ====================
    
    startPredictionSystem() {
        console.log('🔮 Starting AI Prediction System...');
        
        setInterval(() => {
            this.generatePredictions();
        }, 60000); // Every minute
    }

    async generatePredictions() {
        try {
            // Predict user behavior
            const userPredictions = await this.predictUserBehavior();
            
            // Predict system load
            const loadPredictions = await this.predictSystemLoad();
            
            // Predict potential errors
            const errorPredictions = await this.predictPotentialErrors();
            
            // Predict game outcomes
            const gamePredictions = await this.predictGameOutcomes();
            
            this.predictionSystem.userActions = userPredictions;
            this.predictionSystem.systemLoad = loadPredictions;
            this.predictionSystem.errorPredictions = errorPredictions;
            
            // Store predictions for admin dashboard
            await this.storePredictions({
                userPredictions,
                loadPredictions,
                errorPredictions,
                gamePredictions,
                timestamp: Date.now()
            });
            
        } catch (error) {
            console.error('Prediction generation failed:', error);
        }
    }

    async predictUserBehavior() {
        const predictions = new Map();
        
        try {
            for (const [userId, behavior] of this.models.userBehavior) {
                const prediction = {
                    nextBetAmount: this.predictNextBetAmount(behavior),
                    nextBetColor: this.predictNextBetColor(behavior),
                    activityProbability: this.predictActivityProbability(behavior),
                    riskLevel: this.predictRiskLevel(behavior)
                };
                
                predictions.set(userId, prediction);
            }
        } catch (error) {
            console.error('User behavior prediction failed:', error);
        }
        
        return predictions;
    }

    async predictSystemLoad() {
        try {
            const historicalLoad = Array.from(this.models.systemPerformance.values());
            
            if (historicalLoad.length < 5) return [];
            
            // Simple linear regression for load prediction
            const predictions = [];
            const timeWindow = 300000; // 5 minutes
            
            for (let i = 1; i <= 12; i++) { // Predict next hour
                const futureTime = Date.now() + (i * timeWindow);
                const predictedLoad = this.calculateLoadTrend(historicalLoad, futureTime);
                
                predictions.push({
                    timestamp: futureTime,
                    predictedLoad,
                    confidence: this.calculatePredictionConfidence(historicalLoad)
                });
            }
            
            return predictions;
            
        } catch (error) {
            console.error('System load prediction failed:', error);
            return [];
        }
    }

    async predictPotentialErrors() {
        try {
            const errorPatterns = Array.from(this.models.errorPatterns.values());
            const predictions = [];
            
            for (const pattern of errorPatterns) {
                for (const [errorType, frequency] of Object.entries(pattern)) {
                    if (frequency > 3) { // Threshold for concerning patterns
                        predictions.push({
                            errorType,
                            probability: Math.min(frequency / 10, 0.9),
                            severity: this.predictErrorSeverity(errorType),
                            preventionActions: this.suggestPreventionActions(errorType)
                        });
                    }
                }
            }
            
            return predictions;
            
        } catch (error) {
            console.error('Error prediction failed:', error);
            return [];
        }
    }

    // ==================== OPTIMIZATION SYSTEM ====================
    
    startOptimizationSystem() {
        console.log('⚡ Starting AI Optimization System...');
        
        setInterval(() => {
            this.performOptimization();
        }, this.config.optimizationInterval);
    }

    async performOptimization() {
        try {
            console.log('⚡ Performing AI optimization...');
            
            // Optimize database queries
            await this.optimizeDatabaseQueries();
            
            // Optimize game algorithms
            await this.optimizeGameAlgorithms();
            
            // Optimize resource usage
            await this.optimizeResourceUsage();
            
            // Optimize user experience
            await this.optimizeUserExperience();
            
            console.log('⚡ AI optimization completed');
            
        } catch (error) {
            console.error('AI optimization failed:', error);
        }
    }

    async optimizeDatabaseQueries() {
        // Analyze query performance and suggest optimizations
        const slowQueries = this.identifySlowQueries();
        
        for (const query of slowQueries) {
            await this.optimizeQuery(query);
        }
    }

    async optimizeGameAlgorithms() {
        // Analyze game balance and adjust algorithms
        const balanceData = Array.from(this.models.gameBalance.values());
        
        if (balanceData.length > 0) {
            const latestBalance = balanceData[balanceData.length - 1];
            
            if (latestBalance.fairnessScore < 0.8) {
                await this.adjustGameAlgorithms(latestBalance);
            }
        }
    }

    // ==================== MONITORING SYSTEM ====================
    
    startMonitoringSystem() {
        console.log('📊 Starting AI Monitoring System...');
        
        setInterval(() => {
            this.updateMetrics();
        }, 10000); // Every 10 seconds
    }

    async updateMetrics() {
        try {
            const metrics = await this.gatherSystemMetrics();
            
            // Update performance metrics
            this.performanceMetrics.betProcessingTime.push(metrics.betProcessingTime);
            this.performanceMetrics.roundCompletionTime.push(metrics.roundCompletionTime);
            this.performanceMetrics.userSatisfactionScore = metrics.userSatisfactionScore;
            
            // Keep only recent metrics
            this.cleanOldMetrics();
            
        } catch (error) {
            console.error('Metrics update failed:', error);
        }
    }

    // ==================== UTILITY METHODS ====================
    
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

    extractErrorPattern(error) {
        // Extract meaningful pattern from error
        if (error.code) return error.code;
        if (error.message) {
            if (error.message.includes('timeout')) return 'TIMEOUT';
            if (error.message.includes('permission')) return 'PERMISSION';
            if (error.message.includes('network')) return 'NETWORK';
        }
        return 'UNKNOWN';
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
            
            // Keep only the most recent entries
            const toKeep = entries.slice(-this.config.maxLearningHistory);
            model.clear();
            toKeep.forEach(([key, value]) => model.set(key, value));
        }
    }

    async gatherSystemMetrics() {
        // Gather comprehensive system metrics
        return {
            avgResponseTime: this.calculateAverageResponseTime(),
            errorRate: this.calculateErrorRate(),
            throughput: this.calculateThroughput(),
            resourceUsage: this.calculateResourceUsage(),
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
        const timeWindow = 300000; // 5 minutes
        const recentErrorsInWindow = recentErrors.filter(error => 
            Date.now() - error.timestamp < timeWindow
        );
        return recentErrorsInWindow.length / 100; // Error rate as percentage
    }

    handleCriticalError(type, error) {
        this.performanceMetrics.systemErrors.push({
            type,
            error: error.message || error,
            timestamp: Date.now(),
            severity: 'CRITICAL'
        });
        
        console.error(`🚨 Critical AI Error [${type}]:`, error);
    }

    // ==================== DATA PERSISTENCE ====================
    
    async loadAIData() {
        try {
            const aiDataDoc = await db.collection('aiSystem').doc('data').get();
            if (aiDataDoc.exists) {
                const data = aiDataDoc.data();
                
                // Restore learning models
                if (data.models) {
                    Object.keys(data.models).forEach(modelName => {
                        if (this.models[modelName]) {
                            this.models[modelName] = new Map(data.models[modelName]);
                        }
                    });
                }
                
                // Restore configuration
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
            
            // Convert Maps to arrays for storage
            Object.keys(this.models).forEach(modelName => {
                aiData.models[modelName] = Array.from(this.models[modelName].entries());
            });
            
            await db.collection('aiSystem').doc('data').set(aiData, { merge: true });
            
        } catch (error) {
            console.error('Failed to save AI data:', error);
        }
    }

    async storePredictions(predictions) {
        try {
            await db.collection('aiPredictions').add(predictions);
            
            // Clean old predictions
            const oldPredictions = await db.collection('aiPredictions')
                .where('timestamp', '<', Date.now() - 86400000) // 24 hours
                .get();
            
            const batch = db.batch();
            oldPredictions.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            
        } catch (error) {
            console.error('Failed to store predictions:', error);
        }
    }

    async storeAIInsights(insights) {
        try {
            await db.collection('aiInsights').add({
                ...insights,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Failed to store AI insights:', error);
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
            )
        };
    }

    async getAIInsights() {
        try {
            const insights = await db.collection('aiInsights')
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
            const predictions = await db.collection('aiPredictions')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .get();
            
            return predictions.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Failed to get predictions:', error);
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
        }, 300000); // Every 5 minutes
    }
}

// Initialize AI System
window.coinoAI = new CoinoAI();