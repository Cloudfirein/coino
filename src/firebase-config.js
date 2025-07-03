// Enhanced Firebase Configuration with AI Integration
const firebaseConfig = {
    apiKey: "demo-api-key",
    authDomain: "coino-demo.firebaseapp.com",
    projectId: "coino-demo",
    storageBucket: "coino-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    databaseURL: "https://coino-demo-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const realtimeDb = firebase.database();

// Enhanced Firestore settings for AI operations
db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    experimentalForceLongPolling: false
});

// Enable offline persistence for better AI data handling
db.enablePersistence({
    synchronizeTabs: true
}).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all features required for persistence.');
    }
});

// AI-specific collections and indexes
const AI_COLLECTIONS = {
    aiSystem: 'aiSystem',
    aiInsights: 'aiInsights',
    aiPredictions: 'aiPredictions',
    aiLearning: 'aiLearning',
    aiMetrics: 'aiMetrics',
    aiErrors: 'aiErrors',
    aiHealing: 'aiHealing',
    userBehavior: 'userBehavior',
    systemPerformance: 'systemPerformance',
    patternAnalysis: 'patternAnalysis',
    adminLogs: 'adminLogs'
};

// Real-time database paths for AI
const AI_REALTIME_PATHS = {
    systemHealth: '/ai/systemHealth',
    activeUsers: '/ai/activeUsers',
    liveMetrics: '/ai/liveMetrics',
    alerts: '/ai/alerts',
    predictions: '/ai/predictions'
};

// Enhanced error handling for AI operations
const handleAIError = (error, context) => {
    console.error(`AI Error in ${context}:`, error);
    
    // Store error for AI learning
    db.collection(AI_COLLECTIONS.aiErrors).add({
        error: {
            code: error.code || 'unknown',
            message: error.message || 'Unknown error',
            stack: error.stack || null
        },
        context,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        severity: determineSeverity(error),
        resolved: false,
        autoHealAttempts: 0
    }).catch(logError => {
        console.error('Failed to log AI error:', logError);
    });
};

const determineSeverity = (error) => {
    if (error.code === 'permission-denied') return 'high';
    if (error.code === 'unavailable') return 'critical';
    if (error.message?.includes('timeout')) return 'medium';
    return 'low';
};

// AI-enhanced batch operations
const createAIBatch = () => {
    return {
        batch: db.batch(),
        operations: [],
        add: function(operation) {
            this.operations.push(operation);
            return this;
        },
        commit: async function() {
            try {
                const result = await this.batch.commit();
                
                // Log successful batch for AI learning
                db.collection(AI_COLLECTIONS.aiMetrics).add({
                    type: 'batch_operation',
                    operationCount: this.operations.length,
                    success: true,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    duration: Date.now() - this.startTime
                });
                
                return result;
            } catch (error) {
                handleAIError(error, 'batch_operation');
                throw error;
            }
        },
        startTime: Date.now()
    };
};

// Export enhanced Firebase services
window.auth = auth;
window.db = db;
window.storage = storage;
window.realtimeDb = realtimeDb;
window.AI_COLLECTIONS = AI_COLLECTIONS;
window.AI_REALTIME_PATHS = AI_REALTIME_PATHS;
window.handleAIError = handleAIError;
window.createAIBatch = createAIBatch;

console.log('🔥 Enhanced Firebase with AI integration initialized');