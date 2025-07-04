// AI-Powered Trading System for Coino
class TradingSystem {
    constructor() {
        this.selectedStock = null;
        this.stockChart = null;
        this.stockData = new Map();
        this.userPortfolio = new Map();
        this.aiBots = new Map();
        this.marketData = new Map();
        this.tradingHistory = [];
        this.currentTimeframe = '1h';
        this.isTrading = false;
        this.marketUpdateInterval = null;
        this.aiBotsInterval = null;
        
        // Predefined stock data (no server connectivity)
        this.initializeStockData();
        this.initializeAIBots();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeChart();
        this.startMarketUpdates();
        this.startAIBots();
        this.generateMarketNews();
    }

    initializeStockData() {
        const stocks = [
            { symbol: 'TECH', name: 'TechCorp', price: 150.00, change: 2.5 },
            { symbol: 'GOLD', name: 'GoldMine Inc', price: 85.50, change: -1.2 },
            { symbol: 'ENERGY', name: 'EnergyFlow', price: 120.75, change: 3.8 },
            { symbol: 'HEALTH', name: 'HealthPlus', price: 95.25, change: 1.5 },
            { symbol: 'FINANCE', name: 'FinanceHub', price: 200.00, change: -0.8 },
            { symbol: 'RETAIL', name: 'RetailMax', price: 75.80, change: 4.2 },
            { symbol: 'AUTO', name: 'AutoDrive', price: 180.30, change: -2.1 },
            { symbol: 'SPACE', name: 'SpaceVenture', price: 300.50, change: 8.5 },
            { symbol: 'CRYPTO', name: 'CryptoTech', price: 45.60, change: 12.3 },
            { symbol: 'AI', name: 'AI Solutions', price: 250.75, change: 6.7 }
        ];

        stocks.forEach(stock => {
            this.stockData.set(stock.symbol, {
                ...stock,
                history: this.generateStockHistory(stock.price),
                volume: Math.floor(Math.random() * 1000000) + 100000,
                marketCap: stock.price * (Math.floor(Math.random() * 10000000) + 1000000),
                aiRating: Math.random() * 5,
                trend: Math.random() > 0.5 ? 'up' : 'down'
            });
        });
    }

    generateStockHistory(basePrice) {
        const history = [];
        let currentPrice = basePrice;
        const now = Date.now();
        
        // Generate 24 hours of data (hourly)
        for (let i = 23; i >= 0; i--) {
            const timestamp = now - (i * 60 * 60 * 1000);
            const volatility = (Math.random() - 0.5) * 0.1; // ±5% volatility
            currentPrice = Math.max(1, currentPrice * (1 + volatility));
            
            history.push({
                timestamp,
                price: parseFloat(currentPrice.toFixed(2)),
                volume: Math.floor(Math.random() * 100000) + 10000
            });
        }
        
        return history;
    }

    initializeAIBots() {
        const botNames = [
            'AlphaTrader', 'QuantumBot', 'NeuralNet', 'DeepValue', 'TrendMaster',
            'RiskAnalyzer', 'MarketSeer', 'ProfitHunter', 'DataMiner', 'SmartInvestor',
            'PatternBot', 'ValueSeeker'
        ];

        botNames.forEach((name, index) => {
            this.aiBots.set(name, {
                name,
                id: `bot_${index}`,
                strategy: this.getRandomStrategy(),
                performance: Math.random() * 20 + 80, // 80-100% performance
                trades: Math.floor(Math.random() * 1000) + 100,
                profit: (Math.random() - 0.3) * 50, // -15% to +35% profit
                isActive: Math.random() > 0.2, // 80% chance to be active
                lastAction: this.getRandomAction(),
                confidence: Math.random() * 100,
                riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
            });
        });
    }

    getRandomStrategy() {
        const strategies = [
            'Momentum Trading', 'Value Investing', 'Scalping', 'Swing Trading',
            'Arbitrage', 'Mean Reversion', 'Trend Following', 'Contrarian',
            'Technical Analysis', 'Fundamental Analysis'
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    getRandomAction() {
        const actions = ['BUY', 'SELL', 'HOLD', 'ANALYZE'];
        return actions[Math.floor(Math.random() * actions.length)];
    }

    setupEventListeners() {
        // Stock selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.stock-item')) {
                const stockSymbol = e.target.closest('.stock-item').dataset.symbol;
                this.selectStock(stockSymbol);
            }
        });

        // Timeframe buttons
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const timeframe = e.target.dataset.timeframe;
                this.changeTimeframe(timeframe);
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterStocks(filter);
            });
        });

        // Trading buttons
        const buyBtn = document.getElementById('buy-btn');
        const sellBtn = document.getElementById('sell-btn');
        
        if (buyBtn) {
            buyBtn.addEventListener('click', () => this.openTradeModal('buy'));
        }
        
        if (sellBtn) {
            sellBtn.addEventListener('click', () => this.openTradeModal('sell'));
        }

        // Trade quantity input
        const tradeQuantity = document.getElementById('trade-quantity');
        if (tradeQuantity) {
            tradeQuantity.addEventListener('input', () => this.updateTradeTotal());
        }

        // Modal event listeners
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        const closeTradingModal = document.getElementById('close-trading-modal');
        const cancelTrade = document.getElementById('cancel-trade');
        const confirmTrade = document.getElementById('confirm-trade');
        const modalQuantity = document.getElementById('modal-trade-quantity');

        if (closeTradingModal) {
            closeTradingModal.addEventListener('click', () => this.closeTradeModal());
        }

        if (cancelTrade) {
            cancelTrade.addEventListener('click', () => this.closeTradeModal());
        }

        if (confirmTrade) {
            confirmTrade.addEventListener('click', () => this.executeTrade());
        }

        if (modalQuantity) {
            modalQuantity.addEventListener('input', () => this.updateModalTradeTotal());
        }
    }

    initializeTradingTab() {
        this.loadStocksList();
        this.loadPortfolio();
        this.loadAIBots();
        this.updatePortfolioOverview();
    }

    loadStocksList() {
        const container = document.getElementById('stocks-list');
        if (!container) return;

        const stocksArray = Array.from(this.stockData.entries());
        
        container.innerHTML = stocksArray.map(([symbol, stock]) => `
            <div class="stock-item" data-symbol="${symbol}">
                <div class="stock-info">
                    <div class="stock-header">
                        <h4>${stock.symbol}</h4>
                        <span class="stock-price">$${stock.price.toFixed(2)}</span>
                    </div>
                    <div class="stock-details">
                        <p class="stock-name">${stock.name}</p>
                        <div class="stock-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                            <span class="material-icons">${stock.change >= 0 ? 'trending_up' : 'trending_down'}</span>
                            <span>${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}%</span>
                        </div>
                    </div>
                </div>
                <div class="stock-metrics">
                    <div class="metric">
                        <span class="metric-label">Volume</span>
                        <span class="metric-value">${this.formatNumber(stock.volume)}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">AI Rating</span>
                        <span class="metric-value">${stock.aiRating.toFixed(1)}/5</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    selectStock(symbol) {
        this.selectedStock = symbol;
        const stock = this.stockData.get(symbol);
        
        if (!stock) return;

        // Update selected stock UI
        document.querySelectorAll('.stock-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-symbol="${symbol}"]`).classList.add('selected');

        // Update chart header
        const stockNameEl = document.getElementById('selected-stock-name');
        if (stockNameEl) {
            stockNameEl.textContent = `${stock.symbol} - ${stock.name}`;
        }

        // Show trading actions
        const tradingActions = document.getElementById('trading-actions');
        if (tradingActions) {
            tradingActions.style.display = 'block';
        }

        // Update chart
        this.updateChart();
        this.updateTradeTotal();
    }

    changeTimeframe(timeframe) {
        this.currentTimeframe = timeframe;
        
        // Update active button
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-timeframe="${timeframe}"]`).classList.add('active');

        // Update chart
        this.updateChart();
    }

    filterStocks(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Filter and reload stocks
        this.loadFilteredStocks(filter);
    }

    loadFilteredStocks(filter) {
        const container = document.getElementById('stocks-list');
        if (!container) return;

        let filteredStocks = Array.from(this.stockData.entries());

        switch (filter) {
            case 'trending':
                filteredStocks = filteredStocks.filter(([_, stock]) => Math.abs(stock.change) > 3);
                break;
            case 'ai-picks':
                filteredStocks = filteredStocks.filter(([_, stock]) => stock.aiRating > 4);
                break;
            default:
                // Show all stocks
                break;
        }

        // Sort by change percentage for trending, by AI rating for AI picks
        if (filter === 'trending') {
            filteredStocks.sort((a, b) => Math.abs(b[1].change) - Math.abs(a[1].change));
        } else if (filter === 'ai-picks') {
            filteredStocks.sort((a, b) => b[1].aiRating - a[1].aiRating);
        }

        container.innerHTML = filteredStocks.map(([symbol, stock]) => `
            <div class="stock-item" data-symbol="${symbol}">
                <div class="stock-info">
                    <div class="stock-header">
                        <h4>${stock.symbol}</h4>
                        <span class="stock-price">$${stock.price.toFixed(2)}</span>
                    </div>
                    <div class="stock-details">
                        <p class="stock-name">${stock.name}</p>
                        <div class="stock-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                            <span class="material-icons">${stock.change >= 0 ? 'trending_up' : 'trending_down'}</span>
                            <span>${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}%</span>
                        </div>
                    </div>
                </div>
                <div class="stock-metrics">
                    <div class="metric">
                        <span class="metric-label">Volume</span>
                        <span class="metric-value">${this.formatNumber(stock.volume)}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">AI Rating</span>
                        <span class="metric-value">${stock.aiRating.toFixed(1)}/5</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    initializeChart() {
        const canvas = document.getElementById('stock-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        this.stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Price',
                    data: [],
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    updateChart() {
        if (!this.stockChart || !this.selectedStock) return;

        const stock = this.stockData.get(this.selectedStock);
        if (!stock) return;

        const labels = stock.history.map(point => new Date(point.timestamp));
        const data = stock.history.map(point => point.price);

        this.stockChart.data.labels = labels;
        this.stockChart.data.datasets[0].data = data;
        this.stockChart.data.datasets[0].label = `${stock.symbol} Price`;
        
        // Update color based on trend
        const isPositive = stock.change >= 0;
        this.stockChart.data.datasets[0].borderColor = isPositive ? '#4caf50' : '#f44336';
        this.stockChart.data.datasets[0].backgroundColor = isPositive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';
        
        this.stockChart.update();
    }

    updateTradeTotal() {
        if (!this.selectedStock) return;

        const stock = this.stockData.get(this.selectedStock);
        const quantity = parseInt(document.getElementById('trade-quantity')?.value || 0);
        const total = stock.price * quantity;

        const totalEl = document.getElementById('trade-total');
        if (totalEl) {
            totalEl.textContent = `${total.toFixed(0)} Credits`;
        }
    }

    openTradeModal(action) {
        if (!this.selectedStock) {
            this.showToast('Please select a stock first', 'warning');
            return;
        }

        const stock = this.stockData.get(this.selectedStock);
        const modal = document.getElementById('trading-modal');
        
        if (!modal || !stock) return;

        // Update modal content
        document.getElementById('trade-modal-title').textContent = action === 'buy' ? 'Buy Stock' : 'Sell Stock';
        document.getElementById('trade-stock-name').textContent = `${stock.symbol} - ${stock.name}`;
        document.getElementById('trade-stock-price').textContent = `$${stock.price.toFixed(2)}`;
        
        const changeEl = document.getElementById('trade-price-change');
        changeEl.textContent = `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}%`;
        changeEl.className = `price-change ${stock.change >= 0 ? 'positive' : 'negative'}`;

        // Update available credits
        const userData = window.gameManager?.userData;
        const availableCredits = userData?.credits || 1000;
        document.getElementById('modal-available-credits').textContent = availableCredits.toLocaleString();

        // Reset quantity
        document.getElementById('modal-trade-quantity').value = 1;
        this.updateModalTradeTotal();

        // Store current action
        this.currentTradeAction = action;

        modal.classList.remove('hidden');
    }

    updateModalTradeTotal() {
        if (!this.selectedStock) return;

        const stock = this.stockData.get(this.selectedStock);
        const quantity = parseInt(document.getElementById('modal-trade-quantity')?.value || 0);
        const total = stock.price * quantity;

        const totalEl = document.getElementById('modal-trade-total');
        if (totalEl) {
            totalEl.textContent = `${total.toFixed(0)} Credits`;
        }
    }

    closeTradeModal() {
        const modal = document.getElementById('trading-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentTradeAction = null;
    }

    async executeTrade() {
        if (!this.selectedStock || !this.currentTradeAction) return;

        const stock = this.stockData.get(this.selectedStock);
        const quantity = parseInt(document.getElementById('modal-trade-quantity')?.value || 0);
        const total = stock.price * quantity;

        if (quantity <= 0) {
            this.showToast('Please enter a valid quantity', 'error');
            return;
        }

        const userData = window.gameManager?.userData;
        if (!userData) return;

        try {
            if (this.currentTradeAction === 'buy') {
                if (userData.credits < total && !userData.isAdmin) {
                    this.showToast('Insufficient credits', 'error');
                    return;
                }

                // Execute buy order
                await this.executeBuyOrder(stock, quantity, total);
            } else {
                // Execute sell order
                const holdings = this.userPortfolio.get(this.selectedStock);
                if (!holdings || holdings.quantity < quantity) {
                    this.showToast('Insufficient shares to sell', 'error');
                    return;
                }

                await this.executeSellOrder(stock, quantity, total);
            }

            this.closeTradeModal();
            this.updatePortfolioOverview();
            this.loadPortfolio();

        } catch (error) {
            console.error('Error executing trade:', error);
            this.showToast('Trade execution failed', 'error');
        }
    }

    async executeBuyOrder(stock, quantity, total) {
        const user = window.authManager?.getCurrentUser();
        if (!user) return;

        try {
            // Update user credits
            if (!window.gameManager?.userData?.isAdmin) {
                await db.collection('users').doc(user.uid).update({
                    credits: firebase.firestore.FieldValue.increment(-total)
                });
            }

            // Update portfolio
            const currentHoldings = this.userPortfolio.get(stock.symbol) || { quantity: 0, avgPrice: 0 };
            const newQuantity = currentHoldings.quantity + quantity;
            const newAvgPrice = ((currentHoldings.avgPrice * currentHoldings.quantity) + (stock.price * quantity)) / newQuantity;

            this.userPortfolio.set(stock.symbol, {
                symbol: stock.symbol,
                name: stock.name,
                quantity: newQuantity,
                avgPrice: newAvgPrice,
                currentPrice: stock.price
            });

            // Store trade in history
            this.tradingHistory.push({
                id: Date.now().toString(),
                symbol: stock.symbol,
                action: 'buy',
                quantity,
                price: stock.price,
                total,
                timestamp: Date.now()
            });

            // Store in database
            await db.collection('trades').add({
                userId: user.uid,
                symbol: stock.symbol,
                action: 'buy',
                quantity,
                price: stock.price,
                total,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Update user data
            await window.gameManager?.loadUserData();

            this.showToast(`Bought ${quantity} shares of ${stock.symbol}`, 'success');

        } catch (error) {
            console.error('Error executing buy order:', error);
            throw error;
        }
    }

    async executeSellOrder(stock, quantity, total) {
        const user = window.authManager?.getCurrentUser();
        if (!user) return;

        try {
            // Update user credits
            await db.collection('users').doc(user.uid).update({
                credits: firebase.firestore.FieldValue.increment(total)
            });

            // Update portfolio
            const currentHoldings = this.userPortfolio.get(stock.symbol);
            const newQuantity = currentHoldings.quantity - quantity;

            if (newQuantity <= 0) {
                this.userPortfolio.delete(stock.symbol);
            } else {
                this.userPortfolio.set(stock.symbol, {
                    ...currentHoldings,
                    quantity: newQuantity
                });
            }

            // Store trade in history
            this.tradingHistory.push({
                id: Date.now().toString(),
                symbol: stock.symbol,
                action: 'sell',
                quantity,
                price: stock.price,
                total,
                timestamp: Date.now()
            });

            // Store in database
            await db.collection('trades').add({
                userId: user.uid,
                symbol: stock.symbol,
                action: 'sell',
                quantity,
                price: stock.price,
                total,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Update user data
            await window.gameManager?.loadUserData();

            this.showToast(`Sold ${quantity} shares of ${stock.symbol}`, 'success');

        } catch (error) {
            console.error('Error executing sell order:', error);
            throw error;
        }
    }

    loadPortfolio() {
        const container = document.getElementById('holdings-list');
        if (!container) return;

        if (this.userPortfolio.size === 0) {
            container.innerHTML = '<p class="no-holdings">No holdings yet. Start trading to build your portfolio!</p>';
            return;
        }

        const holdings = Array.from(this.userPortfolio.values());
        
        container.innerHTML = holdings.map(holding => {
            const currentStock = this.stockData.get(holding.symbol);
            const currentValue = holding.quantity * currentStock.price;
            const totalCost = holding.quantity * holding.avgPrice;
            const profit = currentValue - totalCost;
            const profitPercent = (profit / totalCost) * 100;

            return `
                <div class="holding-item">
                    <div class="holding-info">
                        <h4>${holding.symbol}</h4>
                        <p>${holding.name}</p>
                        <div class="holding-details">
                            <span>Qty: ${holding.quantity}</span>
                            <span>Avg: $${holding.avgPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="holding-value">
                        <div class="current-value">$${currentValue.toFixed(2)}</div>
                        <div class="profit ${profit >= 0 ? 'positive' : 'negative'}">
                            ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)} (${profitPercent.toFixed(1)}%)
                        </div>
                    </div>
                    <div class="holding-actions">
                        <button class="action-btn sell" onclick="window.tradingSystem.quickSell('${holding.symbol}')">
                            Sell
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    quickSell(symbol) {
        this.selectedStock = symbol;
        this.openTradeModal('sell');
    }

    updatePortfolioOverview() {
        const userData = window.gameManager?.userData;
        if (!userData) return;

        // Calculate portfolio value
        let portfolioValue = 0;
        this.userPortfolio.forEach(holding => {
            const currentStock = this.stockData.get(holding.symbol);
            portfolioValue += holding.quantity * currentStock.price;
        });

        // Update UI
        const portfolioValueEl = document.getElementById('portfolio-value');
        const availableCreditsEl = document.getElementById('available-credits');
        const activePositionsEl = document.getElementById('active-positions');

        if (portfolioValueEl) {
            portfolioValueEl.textContent = portfolioValue.toFixed(0);
        }
        
        if (availableCreditsEl) {
            availableCreditsEl.textContent = (userData.credits || 1000).toLocaleString();
        }
        
        if (activePositionsEl) {
            activePositionsEl.textContent = this.userPortfolio.size;
        }

        // Calculate portfolio change (simplified)
        const portfolioChangeEl = document.getElementById('portfolio-change');
        if (portfolioChangeEl) {
            const change = Math.random() * 10 - 5; // Random change for demo
            portfolioChangeEl.innerHTML = `
                <span class="material-icons">${change >= 0 ? 'trending_up' : 'trending_down'}</span>
                <span>${change >= 0 ? '+' : ''}${change.toFixed(1)}%</span>
            `;
            portfolioChangeEl.className = `portfolio-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
    }

    loadAIBots() {
        const container = document.getElementById('bots-grid');
        if (!container) return;

        const botsArray = Array.from(this.aiBots.values());
        
        container.innerHTML = botsArray.map(bot => `
            <div class="ai-bot-card ${bot.isActive ? 'active' : 'inactive'}">
                <div class="bot-header">
                    <h4>${bot.name}</h4>
                    <div class="bot-status ${bot.isActive ? 'active' : 'inactive'}">
                        <span class="status-dot"></span>
                        <span>${bot.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                </div>
                <div class="bot-info">
                    <p class="bot-strategy">${bot.strategy}</p>
                    <div class="bot-metrics">
                        <div class="metric">
                            <span class="label">Performance</span>
                            <span class="value">${bot.performance.toFixed(1)}%</span>
                        </div>
                        <div class="metric">
                            <span class="label">Trades</span>
                            <span class="value">${bot.trades}</span>
                        </div>
                        <div class="metric">
                            <span class="label">Profit</span>
                            <span class="value ${bot.profit >= 0 ? 'positive' : 'negative'}">
                                ${bot.profit >= 0 ? '+' : ''}${bot.profit.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    <div class="bot-action">
                        <span class="action-label">Last Action:</span>
                        <span class="action-value ${bot.lastAction.toLowerCase()}">${bot.lastAction}</span>
                    </div>
                    <div class="bot-confidence">
                        <span class="confidence-label">Confidence:</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${bot.confidence}%"></div>
                        </div>
                        <span class="confidence-value">${bot.confidence.toFixed(0)}%</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    startMarketUpdates() {
        this.marketUpdateInterval = setInterval(() => {
            this.updateMarketData();
        }, 5000); // Update every 5 seconds
    }

    updateMarketData() {
        this.stockData.forEach((stock, symbol) => {
            // Simulate price changes
            const volatility = (Math.random() - 0.5) * 0.02; // ±1% volatility
            const newPrice = Math.max(1, stock.price * (1 + volatility));
            const change = ((newPrice - stock.price) / stock.price) * 100;
            
            stock.price = parseFloat(newPrice.toFixed(2));
            stock.change = parseFloat(change.toFixed(2));
            
            // Add to history
            stock.history.push({
                timestamp: Date.now(),
                price: stock.price,
                volume: Math.floor(Math.random() * 100000) + 10000
            });
            
            // Keep only last 24 hours of data
            const cutoff = Date.now() - (24 * 60 * 60 * 1000);
            stock.history = stock.history.filter(point => point.timestamp > cutoff);
        });

        // Update UI if trading tab is active
        if (document.getElementById('trading-tab').classList.contains('active')) {
            this.loadStocksList();
            if (this.selectedStock) {
                this.updateChart();
            }
            this.updatePortfolioOverview();
            this.loadPortfolio();
        }
    }

    startAIBots() {
        this.aiBotsInterval = setInterval(() => {
            this.updateAIBots();
        }, 10000); // Update every 10 seconds
    }

    updateAIBots() {
        this.aiBots.forEach(bot => {
            if (bot.isActive) {
                // Simulate bot actions
                bot.lastAction = this.getRandomAction();
                bot.confidence = Math.random() * 100;
                bot.trades += Math.random() > 0.7 ? 1 : 0; // 30% chance to make a trade
                
                // Update performance
                const performanceChange = (Math.random() - 0.5) * 2; // ±1% change
                bot.performance = Math.max(0, Math.min(100, bot.performance + performanceChange));
                
                // Update profit
                const profitChange = (Math.random() - 0.5) * 5; // ±2.5% change
                bot.profit += profitChange;
            }
        });

        // Update active bots count
        const activeBots = Array.from(this.aiBots.values()).filter(bot => bot.isActive).length;
        const activeBotsCountEl = document.getElementById('active-bots-count');
        if (activeBotsCountEl) {
            activeBotsCountEl.textContent = activeBots;
        }

        // Update bots display if visible
        if (document.getElementById('trading-tab').classList.contains('active')) {
            this.loadAIBots();
        }
    }

    generateMarketNews() {
        const newsContainer = document.getElementById('news-list');
        if (!newsContainer) return;

        const aiNews = [
            {
                title: "AI Predicts Strong Tech Sector Growth",
                content: "Advanced algorithms indicate a 15% potential upside in technology stocks over the next quarter.",
                timestamp: Date.now() - 300000,
                sentiment: "positive"
            },
            {
                title: "Market Volatility Expected in Energy Sector",
                content: "Machine learning models detect increased volatility patterns in energy commodities.",
                timestamp: Date.now() - 600000,
                sentiment: "neutral"
            },
            {
                title: "AI Bots Show Bullish Sentiment on Healthcare",
                content: "Collective AI analysis reveals strong buying pressure in healthcare and biotech stocks.",
                timestamp: Date.now() - 900000,
                sentiment: "positive"
            },
            {
                title: "Automated Trading Algorithms Adjust Risk Models",
                content: "AI systems have automatically reduced risk exposure following global market indicators.",
                timestamp: Date.now() - 1200000,
                sentiment: "neutral"
            }
        ];

        newsContainer.innerHTML = aiNews.map(news => `
            <div class="news-item ${news.sentiment}">
                <div class="news-header">
                    <h4>${news.title}</h4>
                    <span class="news-time">${this.formatTime(new Date(news.timestamp))}</span>
                </div>
                <p class="news-content">${news.content}</p>
                <div class="news-sentiment">
                    <span class="sentiment-indicator ${news.sentiment}"></span>
                    <span class="sentiment-label">${news.sentiment.toUpperCase()}</span>
                </div>
            </div>
        `).join('');
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    showToast(message, type = 'info') {
        if (window.gameManager) {
            window.gameManager.showToast(message, type);
        }
    }

    destroy() {
        if (this.marketUpdateInterval) {
            clearInterval(this.marketUpdateInterval);
        }
        if (this.aiBotsInterval) {
            clearInterval(this.aiBotsInterval);
        }
        if (this.stockChart) {
            this.stockChart.destroy();
        }
    }
}

// Initialize trading system
window.tradingSystem = new TradingSystem();