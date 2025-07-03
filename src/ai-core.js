// Advanced AI Core System for Coino - Complete Rewrite
class CoinoAI {
    constructor() {
        this.isInitialized = false;
        this.version = '2.0.0';
        this.startTime = Date.now();
        
        // Enhanced learning data structures
        this.learningData = {
            userBehavior: new Map(),
            systemPerformance: new Map(),
            errorPatterns: new Map(),
            gameBalance: new Map(),
            predictionAccuracy: new Map(),
            healingEffectiveness: new Map(),
            adminActions: new Map(),
            securityEvents: new Map()
        };
        
        // Comprehensive performance metrics
        this.performanceMetrics = {
            betProcessingTime: [],
            roundCompletionTime: [],
            userSatisfactionScore: 0,
            systemErrors: [],
            healingActions: [],
            predictions: [],
            optimizations: [],
            adminInteractions: [],
            securityIncidents: [],
            learningProgress: new Map(),
            systemUptime: 0,
            errorRate: 0,
            healingSuccessRate: 0,
            predictionAccuracy: 0
        };
        
        // Advanced AI Configuration
        this.config = {
            learningRate: 0.15,
            adaptationThreshold: 0.75,
            healingEnabled: true,
            autoOptimization: true,
            predictionAccuracy: 0.80,
            maxLearningHistory: 50000,
            healingCooldown: 15000,
            optimizationInterval: 45000,
            securityScanInterval: 30000,
            dataRetentionDays: 30,
            batchSize: 200,
            maxRetries: 5,
            confidenceThreshold: 0.85,
            anomalyDetectionSensitivity: 0.7,
            autoHealingLevel: 'aggressive'
        };
        
        // Enhanced Learning Models
        this.models = {
            userBehavior: {
                data: new Map(),
                patterns: new Map(),
                predictions: new Map(),
                accuracy: 0
            },
            systemPerformance: {
                data: new Map(),
                trends: new Map(),
                predictions: new Map(),
                accuracy: 0
            },
            errorPatterns: {
                data: new Map(),
                classifications: new Map(),
                predictions: new Map(),
                accuracy: 0
            },
            gameBalance: {
                data: new Map(),
                fairnessMetrics: new Map(),
                adjustments: new Map(),
                accuracy: 0
            },
            securityThreats: {
                data: new Map(),
                riskScores: new Map(),
                mitigations: new Map(),
                accuracy: 0
            },
            adminBehavior: {
                data: new Map(),
                patterns: new Map(),
                recommendations: new Map(),
                accuracy: 0
            }
        };
        
        // Advanced Self-healing system
        this.healingSystem = {
            lastHealingAction: 0,
            healingQueue: [],
            criticalIssues: new Set(),
            healingHistory: [],
            healingStrategies: new Map(),
            successRates: new Map(),
            autoHealingEnabled: true,
            emergencyProtocols: new Map(),
            healingPriorities: {
                'CRITICAL': 100,
                'HIGH': 75,
                'MEDIUM': 50,
                'LOW': 25,
                'INFO': 10
            }
        };
        
        // Enhanced Prediction system
        this.predictionSystem = {
            userActions: new Map(),
            systemLoad: [],
            errorPredictions: [],
            performancePredictions: [],
            securityPredictions: [],
            gameOutcomePredictions: [],
            adminActionPredictions: [],
            marketTrends: [],
            userRetention: new Map(),
            systemOptimizations: []
        };
        
        // Advanced Security system
        this.securitySystem = {
            threatLevel: 'LOW',
            activeThreats: new Set(),
            securityEvents: [],
            riskAssessments: new Map(),
            mitigationStrategies: new Map(),
            securityMetrics: {
                failedLogins: 0,
                suspiciousActivity: 0,
                blockedIPs: new Set(),
                securityScore: 100
            }
        };
        
        // Real-time monitoring
        this.monitoring = {
            activeUsers: 0,
            systemLoad: 0,
            memoryUsage: 0,
            errorRate: 0,
            responseTime: 0,
            throughput: 0,
            alerts: [],
            healthScore: 100
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('🤖 Initializing Advanced AI System v2.0...');
            
            // Load existing AI data
            await this.loadAIData();
            
            // Initialize all AI subsystems
            await this.startLearningSystem();
            await this.startSelfHealingSystem();
            await this.startPredictionSystem();
            await this.startOptimizationSystem();
            await this.startMonitoringSystem();
            await this.startSecuritySystem();
            await this.startAdminAnalytics();
            
            // Start auto-save
            this.startAutoSave();
            
            this.isInitialized = true;
            this.performanceMetrics.systemUptime = Date.now();
            
            console.log('✅ Advanced AI System fully initialized');
            
            // Initial comprehensive analysis
            setTimeout(() => this.performComprehensiveAnalysis(), 3000);
            
            // Register global error handler
            this.registerGlobalErrorHandler();
            
        } catch (error) {
            console.error('❌ AI System initialization failed:', error);
            this.handleCriticalError('AI_INIT_FAILED', error);
            
            // Attempt recovery
            setTimeout(() => this.attemptRecovery(), 5000);
        }
    }

    // ==================== ENHANCED LEARNING SYSTEM ====================
    
    async startLearningSystem() {
        console.log('🧠 Starting Enhanced AI Learning System...');
        
        // Continuous learning with adaptive intervals
        this.learningInterval = setInterval(() => {
            this.updateLearningModels();
        }, 20000);
        
        // Deep learning analysis with pattern recognition
        this.deepLearningInterval = setInterval(() => {
            this.performDeepLearning();
        }, 180000);
        
        // Pattern analysis and prediction updates
        this.patternAnalysisInterval = setInterval(() => {
            this.analyzePatterns();
        }, 60000);
        
        // Model accuracy evaluation
        this.accuracyEvaluationInterval = setInterval(() => {
            this.evaluateModelAccuracy();
        }, 300000);
    }

    async updateLearningModels() {
        try {
            const startTime = Date.now();
            
            // Learn from all data sources
            await Promise.all([
                this.learnUserBehavior(),
                this.learnSystemPerformance(),
                this.learnErrorPatterns(),
                this.learnGameBalance(),
                this.learnSecurityThreats(),
                this.learnAdminBehavior()
            ]);
            
            // Update prediction models
            await this.updatePredictionModels();
            
            // Clean old data
            this.cleanOldLearningData();
            
            const duration = Date.now() - startTime;
            this.performanceMetrics.learningProgress.set(Date.now(), {
                duration,
                modelsUpdated: Object.keys(this.models).length,
                success: true
            });
            
            console.log(`🧠 Learning models updated in ${duration}ms`);
            
        } catch (error) {
            console.error('Learning model update failed:', error);
            this.handleCriticalError('LEARNING_UPDATE_FAILED', error);
        }
    }

    async learnUserBehavior() {
        try {
            const users = await db.collection('users').limit(500).get();
            const behaviorPatterns = new Map();
            
            for (const doc of users.docs) {
                const userData = doc.data();
                const userId = doc.id;
                
                // Advanced behavioral analysis
                const behaviorPattern = {
                    avgBetAmount: this.calculateAverageBetAmount(userData),
                    winRate: userData.winRate || 0,
                    activityLevel: this.calculateActivityLevel(userData),
                    riskProfile: this.calculateRiskProfile(userData),
                    playingPatterns: await this.analyzePlayingPatterns(userId),
                    socialBehavior: await this.analyzeSocialBehavior(userId),
                    spendingHabits: this.analyzeSpendingHabits(userData),
                    sessionDuration: await this.calculateAverageSessionDuration(userId),
                    preferredColors: await this.analyzeColorPreferences(userId),
                    timePatterns: await this.analyzeTimePatterns(userId),
                    retentionScore: this.calculateRetentionScore(userData),
                    timestamp: Date.now()
                };
                
                behaviorPatterns.set(userId, behaviorPattern);
                
                // Predict future behavior
                const prediction = this.predictUserBehavior(behaviorPattern);
                this.predictionSystem.userActions.set(userId, prediction);
            }
            
            this.models.userBehavior.data = behaviorPatterns;
            this.models.userBehavior.patterns = this.extractBehaviorPatterns(behaviorPatterns);
            
            // Store in database for admin access
            await this.storeModelData('userBehavior', {
                totalUsers: behaviorPatterns.size,
                patterns: Array.from(this.models.userBehavior.patterns.entries()),
                lastUpdated: Date.now()
            });
            
        } catch (error) {
            console.error('User behavior learning failed:', error);
            this.handleCriticalError('USER_BEHAVIOR_LEARNING_FAILED', error);
        }
    }

    async learnSystemPerformance() {
        try {
            const metrics = await this.gatherComprehensiveSystemMetrics();
            
            const performancePattern = {
                responseTime: metrics.avgResponseTime,
                errorRate: metrics.errorRate,
                throughput: metrics.throughput,
                resourceUsage: metrics.resourceUsage,
                concurrentUsers: metrics.concurrentUsers,
                databasePerformance: metrics.databasePerformance,
                networkLatency: metrics.networkLatency,
                memoryUsage: metrics.memoryUsage,
                cpuUsage: metrics.cpuUsage,
                diskIO: metrics.diskIO,
                cacheHitRate: metrics.cacheHitRate,
                timestamp: Date.now()
            };
            
            this.models.systemPerformance.data.set(Date.now(), performancePattern);
            
            // Detect performance anomalies
            const anomalies = this.detectPerformanceAnomalies(performancePattern);
            if (anomalies.length > 0) {
                await this.handlePerformanceAnomalies(anomalies);
            }
            
            // Predict future performance
            const prediction = this.predictSystemPerformance(performancePattern);
            this.predictionSystem.performancePredictions.push(prediction);
            
            this.cleanOldLearningData('systemPerformance');
            
        } catch (error) {
            console.error('System performance learning failed:', error);
            this.handleCriticalError('SYSTEM_PERFORMANCE_LEARNING_FAILED', error);
        }
    }

    async learnErrorPatterns() {
        try {
            const recentErrors = await db.collection(AI_COLLECTIONS.aiErrors)
                .orderBy('timestamp', 'desc')
                .limit(1000)
                .get();
            
            const errorPatterns = new Map();
            const errorClassifications = new Map();
            
            recentErrors.docs.forEach(doc => {
                const error = doc.data();
                const pattern = this.extractErrorPattern(error);
                const classification = this.classifyError(error);
                
                if (!errorPatterns.has(pattern)) {
                    errorPatterns.set(pattern, []);
                }
                errorPatterns.get(pattern).push(error);
                
                errorClassifications.set(error.id || doc.id, classification);
            });
            
            this.models.errorPatterns.data = errorPatterns;
            this.models.errorPatterns.classifications = errorClassifications;
            
            // Generate error predictions
            const predictions = this.generateErrorPredictions(errorPatterns);
            this.predictionSystem.errorPredictions = predictions;
            
            // Create healing strategies
            await this.createHealingStrategies(errorPatterns);
            
        } catch (error) {
            console.error('Error pattern learning failed:', error);
            this.handleCriticalError('ERROR_PATTERN_LEARNING_FAILED', error);
        }
    }

    async learnGameBalance() {
        try {
            const recentRounds = await db.collection('rounds')
                .where('status', '==', 'completed')
                .orderBy('endTime', 'desc')
                .limit(1000)
                .get();
            
            const colorDistribution = new Map();
            const winRates = new Map();
            const betPatterns = new Map();
            
            recentRounds.docs.forEach(doc => {
                const round = doc.data();
                const color = round.winningColor;
                
                colorDistribution.set(color, (colorDistribution.get(color) || 0) + 1);
                
                // Analyze betting patterns for this round
                if (round.totalBets && round.totalAmount) {
                    const avgBet = round.totalAmount / round.totalBets;
                    betPatterns.set(doc.id, {
                        avgBet,
                        totalBets: round.totalBets,
                        winningColor: color
                    });
                }
            });
            
            const balancePattern = {
                colorDistribution: Object.fromEntries(colorDistribution),
                fairnessScore: this.calculateAdvancedFairnessScore(colorDistribution),
                betPatterns: Object.fromEntries(betPatterns),
                recommendedAdjustments: this.generateBalanceAdjustments(colorDistribution),
                timestamp: Date.now()
            };
            
            this.models.gameBalance.data.set(Date.now(), balancePattern);
            
            // Auto-adjust if needed
            if (balancePattern.fairnessScore < this.config.adaptationThreshold) {
                await this.autoAdjustGameBalance(balancePattern);
            }
            
        } catch (error) {
            console.error('Game balance learning failed:', error);
            this.handleCriticalError('GAME_BALANCE_LEARNING_FAILED', error);
        }
    }

    async learnSecurityThreats() {
        try {
            const securityEvents = await db.collection('securityEvents')
                .orderBy('timestamp', 'desc')
                .limit(500)
                .get();
            
            const threatPatterns = new Map();
            const riskScores = new Map();
            
            securityEvents.docs.forEach(doc => {
                const event = doc.data();
                const pattern = this.extractSecurityPattern(event);
                const riskScore = this.calculateRiskScore(event);
                
                if (!threatPatterns.has(pattern)) {
                    threatPatterns.set(pattern, []);
                }
                threatPatterns.get(pattern).push(event);
                riskScores.set(doc.id, riskScore);
            });
            
            this.models.securityThreats.data = threatPatterns;
            this.models.securityThreats.riskScores = riskScores;
            
            // Generate security predictions
            const predictions = this.generateSecurityPredictions(threatPatterns);
            this.predictionSystem.securityPredictions = predictions;
            
            // Update threat level
            this.updateThreatLevel(threatPatterns);
            
        } catch (error) {
            console.error('Security threat learning failed:', error);
            this.handleCriticalError('SECURITY_LEARNING_FAILED', error);
        }
    }

    async learnAdminBehavior() {
        try {
            const adminActions = await db.collection(AI_COLLECTIONS.adminLogs)
                .orderBy('timestamp', 'desc')
                .limit(1000)
                .get();
            
            const behaviorPatterns = new Map();
            const actionEffectiveness = new Map();
            
            adminActions.docs.forEach(doc => {
                const action = doc.data();
                const pattern = this.extractAdminPattern(action);
                const effectiveness = this.calculateActionEffectiveness(action);
                
                if (!behaviorPatterns.has(action.adminId)) {
                    behaviorPatterns.set(action.adminId, []);
                }
                behaviorPatterns.get(action.adminId).push(action);
                actionEffectiveness.set(doc.id, effectiveness);
            });
            
            this.models.adminBehavior.data = behaviorPatterns;
            
            // Generate admin recommendations
            const recommendations = this.generateAdminRecommendations(behaviorPatterns);
            this.models.adminBehavior.recommendations = recommendations;
            
        } catch (error) {
            console.error('Admin behavior learning failed:', error);
            this.handleCriticalError('ADMIN_BEHAVIOR_LEARNING_FAILED', error);
        }
    }

    // ==================== ADVANCED SELF-HEALING SYSTEM ====================
    
    async startSelfHealingSystem() {
        console.log('🔧 Starting Advanced Self-Healing System...');
        
        // Continuous health monitoring with multiple checks
        this.healthMonitoringInterval = setInterval(() => {
            this.performComprehensiveHealthCheck();
        }, 10000);
        
        // Process healing queue with priority
        this.healingProcessorInterval = setInterval(() => {
            this.processHealingQueue();
        }, 3000);
        
        // Proactive healing based on predictions
        this.proactiveHealingInterval = setInterval(() => {
            this.performProactiveHealing();
        }, 30000);
        
        // Emergency response system
        this.emergencyResponseInterval = setInterval(() => {
            this.checkEmergencyConditions();
        }, 5000);
    }

    async performComprehensiveHealthCheck() {
        try {
            const healthStatus = await this.analyzeSystemHealth();
            
            // Update monitoring metrics
            this.monitoring.healthScore = healthStatus.overallScore;
            this.monitoring.alerts = healthStatus.alerts;
            
            // Handle critical issues immediately
            if (healthStatus.criticalIssues.length > 0) {
                console.log('🚨 Critical issues detected:', healthStatus.criticalIssues);
                
                for (const issue of healthStatus.criticalIssues) {
                    await this.scheduleEmergencyHealing(issue);
                }
            }
            
            // Handle warnings proactively
            if (healthStatus.warnings.length > 0) {
                console.log('⚠️ System warnings:', healthStatus.warnings);
                await this.handleWarnings(healthStatus.warnings);
            }
            
            // Store health data for learning
            await this.storeHealthData(healthStatus);
            
        } catch (error) {
            console.error('Comprehensive health check failed:', error);
            this.handleCriticalError('HEALTH_CHECK_FAILED', error);
        }
    }

    async analyzeSystemHealth() {
        const criticalIssues = [];
        const warnings = [];
        const alerts = [];
        let overallScore = 100;
        
        try {
            // Check database health
            const dbHealth = await this.checkDatabaseHealth();
            if (dbHealth.score < 70) {
                criticalIssues.push({
                    type: 'DATABASE_HEALTH',
                    severity: 'CRITICAL',
                    data: dbHealth,
                    autoHeal: true,
                    priority: 100
                });
                overallScore -= 30;
            }
            
            // Check for stuck processes
            const stuckProcesses = await this.detectStuckProcesses();
            if (stuckProcesses.length > 0) {
                criticalIssues.push({
                    type: 'STUCK_PROCESSES',
                    severity: 'HIGH',
                    data: stuckProcesses,
                    autoHeal: true,
                    priority: 90
                });
                overallScore -= 20;
            }
            
            // Check memory usage
            const memoryUsage = await this.checkMemoryUsage();
            if (memoryUsage > 85) {
                warnings.push({
                    type: 'HIGH_MEMORY_USAGE',
                    severity: 'MEDIUM',
                    value: memoryUsage,
                    autoHeal: true,
                    priority: 60
                });
                overallScore -= 10;
            }
            
            // Check error rates
            const errorRate = this.calculateCurrentErrorRate();
            if (errorRate > 0.05) {
                warnings.push({
                    type: 'HIGH_ERROR_RATE',
                    severity: 'HIGH',
                    value: errorRate,
                    autoHeal: true,
                    priority: 80
                });
                overallScore -= 15;
            }
            
            // Check security threats
            const securityThreats = await this.detectSecurityThreats();
            if (securityThreats.length > 0) {
                criticalIssues.push({
                    type: 'SECURITY_THREATS',
                    severity: 'CRITICAL',
                    data: securityThreats,
                    autoHeal: true,
                    priority: 100
                });
                overallScore -= 25;
            }
            
            // Check performance degradation
            const performanceDegradation = await this.detectPerformanceDegradation();
            if (performanceDegradation.severity > 0.7) {
                warnings.push({
                    type: 'PERFORMANCE_DEGRADATION',
                    severity: 'MEDIUM',
                    data: performanceDegradation,
                    autoHeal: true,
                    priority: 70
                });
                overallScore -= 15;
            }
            
            // Check data consistency
            const consistencyIssues = await this.checkAdvancedDataConsistency();
            if (consistencyIssues.length > 0) {
                criticalIssues.push({
                    type: 'DATA_INCONSISTENCY',
                    severity: 'CRITICAL',
                    data: consistencyIssues,
                    autoHeal: true,
                    priority: 95
                });
                overallScore -= 20;
            }
            
        } catch (error) {
            criticalIssues.push({
                type: 'HEALTH_CHECK_ERROR',
                severity: 'CRITICAL',
                error: error.message,
                autoHeal: false,
                priority: 100
            });
            overallScore -= 50;
        }
        
        return {
            criticalIssues,
            warnings,
            alerts,
            overallScore: Math.max(0, overallScore),
            timestamp: Date.now()
        };
    }

    async scheduleEmergencyHealing(issue) {
        const now = Date.now();
        
        // Skip if recently healed
        if (now - this.healingSystem.lastHealingAction < this.config.healingCooldown / 2) {
            console.log('🔧 Emergency healing on cooldown, queuing for immediate processing...');
        }
        
        if (issue.autoHeal && this.healingSystem.autoHealingEnabled) {
            this.healingSystem.healingQueue.unshift({
                ...issue,
                scheduledAt: now,
                priority: issue.priority || this.healingSystem.healingPriorities[issue.severity],
                emergency: true
            });
            
            console.log(`🚨 Emergency healing scheduled for ${issue.type}`);
        }
    }

    async processHealingQueue() {
        if (this.healingSystem.healingQueue.length === 0) return;
        
        // Sort by priority (emergency first, then by priority score)
        this.healingSystem.healingQueue.sort((a, b) => {
            if (a.emergency && !b.emergency) return -1;
            if (!a.emergency && b.emergency) return 1;
            return b.priority - a.priority;
        });
        
        const healingAction = this.healingSystem.healingQueue.shift();
        
        try {
            console.log(`🔧 Executing ${healingAction.emergency ? 'EMERGENCY ' : ''}healing: ${healingAction.type}`);
            
            const result = await this.executeAdvancedHealing(healingAction);
            
            this.healingSystem.healingHistory.push({
                ...healingAction,
                result,
                executedAt: Date.now(),
                success: true,
                duration: Date.now() - healingAction.scheduledAt
            });
            
            this.healingSystem.lastHealingAction = Date.now();
            
            // Update healing effectiveness
            this.updateHealingEffectiveness(healingAction.type, true);
            
            console.log(`✅ Healing completed: ${healingAction.type}`);
            
            // Learn from successful healing
            await this.learnFromHealing(healingAction, result, true);
            
        } catch (error) {
            console.error(`❌ Healing failed: ${healingAction.type}`, error);
            
            this.healingSystem.healingHistory.push({
                ...healingAction,
                error: error.message,
                executedAt: Date.now(),
                success: false,
                duration: Date.now() - healingAction.scheduledAt
            });
            
            // Update healing effectiveness
            this.updateHealingEffectiveness(healingAction.type, false);
            
            // Learn from failed healing
            await this.learnFromHealing(healingAction, null, false);
            
            // Try alternative healing strategy
            await this.tryAlternativeHealing(healingAction, error);
        }
    }

    async executeAdvancedHealing(action) {
        const healingStrategy = this.healingSystem.healingStrategies.get(action.type) || 
                              this.getDefaultHealingStrategy(action.type);
        
        switch (action.type) {
            case 'DATABASE_HEALTH':
                return await this.healDatabaseHealth(action.data);
                
            case 'STUCK_PROCESSES':
                return await this.healStuckProcesses(action.data);
                
            case 'HIGH_MEMORY_USAGE':
                return await this.healMemoryUsage(action.value);
                
            case 'HIGH_ERROR_RATE':
                return await this.healErrorRate(action.value);
                
            case 'SECURITY_THREATS':
                return await this.healSecurityThreats(action.data);
                
            case 'PERFORMANCE_DEGRADATION':
                return await this.healPerformanceDegradation(action.data);
                
            case 'DATA_INCONSISTENCY':
                return await this.healDataInconsistency(action.data);
                
            default:
                return await this.executeCustomHealing(action, healingStrategy);
        }
    }

    // ==================== ADVANCED PREDICTION SYSTEM ====================
    
    async startPredictionSystem() {
        console.log('🔮 Starting Advanced AI Prediction System...');
        
        // Generate predictions with multiple models
        this.predictionInterval = setInterval(() => {
            this.generateComprehensivePredictions();
        }, 45000);
        
        // Validate and improve prediction accuracy
        this.predictionValidationInterval = setInterval(() => {
            this.validatePredictions();
        }, 120000);
        
        // Market trend analysis
        this.marketAnalysisInterval = setInterval(() => {
            this.analyzeMarketTrends();
        }, 300000);
    }

    async generateComprehensivePredictions() {
        try {
            const predictions = {
                userBehavior: await this.predictUserBehaviorAdvanced(),
                systemLoad: await this.predictSystemLoadAdvanced(),
                errors: await this.predictErrorsAdvanced(),
                gameOutcomes: await this.predictGameOutcomesAdvanced(),
                security: await this.predictSecurityThreatsAdvanced(),
                performance: await this.predictPerformanceAdvanced(),
                adminActions: await this.predictAdminActionsAdvanced(),
                marketTrends: await this.predictMarketTrendsAdvanced(),
                timestamp: Date.now()
            };
            
            // Store predictions for validation
            await this.storePredictions(predictions);
            
            // Update prediction system
            Object.assign(this.predictionSystem, predictions);
            
            console.log('🔮 Comprehensive predictions generated');
            
        } catch (error) {
            console.error('Prediction generation failed:', error);
            this.handleCriticalError('PREDICTION_GENERATION_FAILED', error);
        }
    }

    // ==================== ADMIN ANALYTICS AND CONTROLS ====================
    
    async startAdminAnalytics() {
        console.log('👑 Starting Admin Analytics System...');
        
        // Track admin actions
        this.adminTrackingInterval = setInterval(() => {
            this.trackAdminActivity();
        }, 30000);
        
        // Generate admin insights
        this.adminInsightsInterval = setInterval(() => {
            this.generateAdminInsights();
        }, 180000);
        
        // Monitor admin effectiveness
        this.adminEffectivenessInterval = setInterval(() => {
            this.analyzeAdminEffectiveness();
        }, 300000);
    }

    async trackAdminActivity() {
        try {
            const adminActions = await db.collection(AI_COLLECTIONS.adminLogs)
                .where('timestamp', '>', new Date(Date.now() - 300000))
                .get();
            
            const activityMetrics = {
                totalActions: adminActions.size,
                actionTypes: new Map(),
                effectiveness: new Map(),
                timestamp: Date.now()
            };
            
            adminActions.docs.forEach(doc => {
                const action = doc.data();
                const type = action.actionType;
                
                activityMetrics.actionTypes.set(type, 
                    (activityMetrics.actionTypes.get(type) || 0) + 1);
                
                const effectiveness = this.calculateActionEffectiveness(action);
                activityMetrics.effectiveness.set(doc.id, effectiveness);
            });
            
            this.performanceMetrics.adminInteractions.push(activityMetrics);
            
        } catch (error) {
            console.error('Admin activity tracking failed:', error);
        }
    }

    // ==================== UTILITY METHODS ====================
    
    calculateAverageBetAmount(userData) {
        return userData.totalBets > 0 ? 
            (userData.coins || 0) / userData.totalBets : 0;
    }

    calculateActivityLevel(userData) {
        const totalGames = (userData.totalWins || 0) + (userData.totalLosses || 0);
        const daysSinceCreated = (Date.now() - 
            (userData.createdAt?.toDate?.()?.getTime() || Date.now())) / (1000 * 60 * 60 * 24);
        return totalGames / Math.max(daysSinceCreated, 1);
    }

    calculateRiskProfile(userData) {
        const avgBet = this.calculateAverageBetAmount(userData);
        const totalCoins = userData.coins || 0;
        return totalCoins > 0 ? avgBet / totalCoins : 0;
    }

    calculateAdvancedFairnessScore(colorDistribution) {
        const colors = Array.from(colorDistribution.keys());
        const total = Array.from(colorDistribution.values()).reduce((sum, count) => sum + count, 0);
        
        if (total === 0 || colors.length === 0) return 1;
        
        const expected = total / colors.length;
        let chiSquare = 0;
        
        for (const count of colorDistribution.values()) {
            chiSquare += Math.pow(count - expected, 2) / expected;
        }
        
        // Convert chi-square to fairness score (0-1)
        const maxChiSquare = total * (colors.length - 1);
        return Math.max(0, 1 - (chiSquare / maxChiSquare));
    }

    extractErrorPattern(error) {
        if (error.code) return error.code;
        if (error.message) {
            if (error.message.includes('timeout')) return 'TIMEOUT';
            if (error.message.includes('permission')) return 'PERMISSION';
            if (error.message.includes('network')) return 'NETWORK';
            if (error.message.includes('quota')) return 'QUOTA_EXCEEDED';
            if (error.message.includes('unavailable')) return 'SERVICE_UNAVAILABLE';
        }
        return 'UNKNOWN';
    }

    classifyError(error) {
        const pattern = this.extractErrorPattern(error);
        const severity = error.severity || 'medium';
        const frequency = this.getErrorFrequency(pattern);
        
        return {
            pattern,
            severity,
            frequency,
            category: this.categorizeError(pattern),
            healable: this.isErrorHealable(pattern),
            priority: this.calculateErrorPriority(severity, frequency)
        };
    }

    handleCriticalError(type, error) {
        this.performanceMetrics.systemErrors.push({
            type,
            error: error.message || error,
            timestamp: Date.now(),
            severity: 'CRITICAL',
            stack: error.stack || null
        });
        
        console.error(`🚨 Critical AI Error [${type}]:`, error);
        
        // Store in database for admin access
        db.collection(AI_COLLECTIONS.aiErrors).add({
            type,
            error: {
                message: error.message || error,
                stack: error.stack || null,
                code: error.code || null
            },
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            severity: 'CRITICAL',
            resolved: false,
            autoHealAttempts: 0,
            context: 'AI_SYSTEM'
        }).catch(logError => {
            console.error('Failed to log critical error:', logError);
        });
        
        // Trigger emergency healing if possible
        if (this.healingSystem.autoHealingEnabled) {
            this.scheduleEmergencyHealing({
                type: `ERROR_${type}`,
                severity: 'CRITICAL',
                data: error,
                autoHeal: true,
                priority: 100
            });
        }
    }

    registerGlobalErrorHandler() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            this.handleCriticalError('UNHANDLED_ERROR', event.error);
        });
        
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleCriticalError('UNHANDLED_REJECTION', event.reason);
        });
    }

    // ==================== DATA PERSISTENCE ====================
    
    async loadAIData() {
        try {
            const aiDataDoc = await db.collection(AI_COLLECTIONS.aiSystem).doc('data').get();
            if (aiDataDoc.exists) {
                const data = aiDataDoc.data();
                
                // Restore models
                if (data.models) {
                    Object.keys(data.models).forEach(modelName => {
                        if (this.models[modelName]) {
                            this.models[modelName].data = new Map(data.models[modelName].data || []);
                            this.models[modelName].patterns = new Map(data.models[modelName].patterns || []);
                            this.models[modelName].predictions = new Map(data.models[modelName].predictions || []);
                            this.models[modelName].accuracy = data.models[modelName].accuracy || 0;
                        }
                    });
                }
                
                // Restore configuration
                if (data.config) {
                    this.config = { ...this.config, ...data.config };
                }
                
                // Restore healing strategies
                if (data.healingStrategies) {
                    this.healingSystem.healingStrategies = new Map(data.healingStrategies);
                }
                
                console.log('📚 AI data loaded successfully');
            }
        } catch (error) {
            console.error('Failed to load AI data:', error);
            this.handleCriticalError('AI_DATA_LOAD_FAILED', error);
        }
    }

    async saveAIData() {
        try {
            const aiData = {
                version: this.version,
                models: {},
                config: this.config,
                metrics: this.performanceMetrics,
                healingHistory: this.healingSystem.healingHistory.slice(-500),
                healingStrategies: Array.from(this.healingSystem.healingStrategies.entries()),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                systemUptime: Date.now() - this.startTime
            };
            
            // Convert Maps to arrays for storage
            Object.keys(this.models).forEach(modelName => {
                aiData.models[modelName] = {
                    data: Array.from(this.models[modelName].data.entries()),
                    patterns: Array.from(this.models[modelName].patterns.entries()),
                    predictions: Array.from(this.models[modelName].predictions.entries()),
                    accuracy: this.models[modelName].accuracy
                };
            });
            
            await db.collection(AI_COLLECTIONS.aiSystem).doc('data').set(aiData, { merge: true });
            
        } catch (error) {
            console.error('Failed to save AI data:', error);
            this.handleCriticalError('AI_DATA_SAVE_FAILED', error);
        }
    }

    startAutoSave() {
        setInterval(() => {
            this.saveAIData();
        }, 180000); // Every 3 minutes
    }

    // ==================== PUBLIC API ====================
    
    getSystemStatus() {
        return {
            isInitialized: this.isInitialized,
            version: this.version,
            uptime: Date.now() - this.startTime,
            config: this.config,
            metrics: this.performanceMetrics,
            monitoring: this.monitoring,
            healingStatus: {
                enabled: this.healingSystem.autoHealingEnabled,
                lastAction: this.healingSystem.lastHealingAction,
                queueLength: this.healingSystem.healingQueue.length,
                recentActions: this.healingSystem.healingHistory.slice(-20),
                successRate: this.calculateHealingSuccessRate()
            },
            modelAccuracy: Object.fromEntries(
                Object.entries(this.models).map(([name, model]) => [name, model.accuracy])
            ),
            securityStatus: {
                threatLevel: this.securitySystem.threatLevel,
                activeThreats: this.securitySystem.activeThreats.size,
                securityScore: this.securitySystem.securityMetrics.securityScore
            }
        };
    }

    async getAIInsights() {
        try {
            const insights = await db.collection(AI_COLLECTIONS.aiInsights)
                .orderBy('timestamp', 'desc')
                .limit(100)
                .get();
            
            return insights.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Failed to get AI insights:', error);
            return [];
        }
    }

    async getPredictions() {
        try {
            const predictions = await db.collection(AI_COLLECTIONS.aiPredictions)
                .orderBy('timestamp', 'desc')
                .limit(50)
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
        
        // Log admin action
        this.logAdminAction('CONFIG_UPDATE', newConfig);
    }

    async logAdminAction(actionType, data) {
        try {
            await db.collection(AI_COLLECTIONS.adminLogs).add({
                actionType,
                data,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                adminId: window.authManager?.getCurrentUser()?.uid || 'unknown',
                systemState: this.getSystemStatus()
            });
        } catch (error) {
            console.error('Failed to log admin action:', error);
        }
    }

    calculateHealingSuccessRate() {
        const recentHealing = this.healingSystem.healingHistory.slice(-100);
        if (recentHealing.length === 0) return 0;
        
        const successful = recentHealing.filter(h => h.success).length;
        return (successful / recentHealing.length) * 100;
    }

    destroy() {
        // Clear all intervals
        if (this.learningInterval) clearInterval(this.learningInterval);
        if (this.deepLearningInterval) clearInterval(this.deepLearningInterval);
        if (this.patternAnalysisInterval) clearInterval(this.patternAnalysisInterval);
        if (this.accuracyEvaluationInterval) clearInterval(this.accuracyEvaluationInterval);
        if (this.healthMonitoringInterval) clearInterval(this.healthMonitoringInterval);
        if (this.healingProcessorInterval) clearInterval(this.healingProcessorInterval);
        if (this.proactiveHealingInterval) clearInterval(this.proactiveHealingInterval);
        if (this.emergencyResponseInterval) clearInterval(this.emergencyResponseInterval);
        if (this.predictionInterval) clearInterval(this.predictionInterval);
        if (this.predictionValidationInterval) clearInterval(this.predictionValidationInterval);
        if (this.marketAnalysisInterval) clearInterval(this.marketAnalysisInterval);
        if (this.adminTrackingInterval) clearInterval(this.adminTrackingInterval);
        if (this.adminInsightsInterval) clearInterval(this.adminInsightsInterval);
        if (this.adminEffectivenessInterval) clearInterval(this.adminEffectivenessInterval);
        
        // Save final state
        this.saveAIData();
        
        console.log('🤖 AI System destroyed');
    }
}

// Initialize Enhanced AI System
window.coinoAI = new CoinoAI();