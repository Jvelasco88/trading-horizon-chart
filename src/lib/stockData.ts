export interface StockData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Realistic stock data generator with proper volatility and trends
export const generateStockData = async (ticker: string, period: string): Promise<StockData[]> => {
  const now = Date.now();
  const periodMap: Record<string, number> = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    '2Y': 730,
    '3Y': 1095,
  };

  const days = periodMap[period] || 365;
  const startTime = now - (days * 24 * 60 * 60 * 1000);
  
  // Base prices for different tickers
  const basePrices: Record<string, number> = {
    'IBM': 280,
    'AAPL': 185,
    'MSFT': 420,
    'GOOGL': 140,
    'TSLA': 250,
  };

  const basePrice = basePrices[ticker] || 280;
  const data: StockData[] = [];
  let currentPrice = basePrice;
  
  // Generate realistic stock data
  for (let i = 0; i < days; i++) {
    const timestamp = startTime + (i * 24 * 60 * 60 * 1000);
    
    // Add some trend and volatility
    const trendFactor = Math.sin(i / 30) * 0.001; // Long-term trend
    const volatility = (Math.random() - 0.5) * 0.04; // ±2% daily volatility
    const priceChange = (trendFactor + volatility) * currentPrice;
    
    const open = currentPrice;
    const close = open + priceChange;
    
    // Generate realistic high/low within the range
    const range = Math.abs(close - open) * 1.5 + (Math.random() * open * 0.01);
    const high = Math.max(open, close) + (Math.random() * range);
    const low = Math.min(open, close) - (Math.random() * range);
    
    // Ensure low is never negative
    const finalLow = Math.max(low, open * 0.95);
    
    // Generate realistic volume (higher on price movements)
    const priceMovement = Math.abs(close - open) / open;
    const baseVolume = 1000000; // 1M base volume
    const volumeMultiplier = 1 + (priceMovement * 5) + (Math.random() * 0.5);
    const volume = Math.floor(baseVolume * volumeMultiplier);

    data.push({
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(finalLow.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    });

    currentPrice = close;
  }

  return data;
};