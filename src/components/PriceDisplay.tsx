import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockData } from '@/lib/stockData';

interface PriceDisplayProps {
  ticker: string;
  data: StockData;
  previousData?: StockData;
}

export const PriceDisplay = ({ ticker, data, previousData }: PriceDisplayProps) => {
  const change = previousData ? data.close - previousData.close : 0;
  const changePercent = previousData ? (change / previousData.close) * 100 : 0;
  const isPositive = change > 0;
  const isNegative = change < 0;

  const formatPrice = (price: number) => price.toFixed(2);
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Main Price Info */}
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">
              ${formatPrice(data.close)}
            </h1>
            <div className="flex items-center gap-2">
              {isPositive && <TrendingUp className="h-4 w-4 text-green-400" />}
              {isNegative && <TrendingDown className="h-4 w-4 text-red-400" />}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-green-400' : 
                isNegative ? 'text-red-400' : 
                'text-muted-foreground'
              }`}>
                {change >= 0 ? '+' : ''}{formatPrice(change)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <Badge 
            variant={isPositive ? 'default' : isNegative ? 'destructive' : 'secondary'}
            className="flex items-center gap-1"
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {isPositive ? 'Bullish' : isNegative ? 'Bearish' : 'Neutral'}
          </Badge>
        </div>

        {/* OHLCV Data */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground block">Open</span>
            <span className="font-medium">${formatPrice(data.open)}</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground block">High</span>
            <span className="font-medium text-green-400">${formatPrice(data.high)}</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground block">Low</span>
            <span className="font-medium text-red-400">${formatPrice(data.low)}</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground block">Close</span>
            <span className="font-medium">${formatPrice(data.close)}</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground block">Volume</span>
            <span className="font-medium">{formatVolume(data.volume)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};