import { useState, useEffect, useRef, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SMAPopover } from './SMAPopover';
import { DateRangePicker } from './DateRangePicker';
import { PriceDisplay } from './PriceDisplay';
import { generateStockData, StockData } from '@/lib/stockData';
import { format } from 'date-fns';

interface SMAConfig {
  period: number;
  color: string;
  enabled: boolean;
}

const DEFAULT_SMAS: SMAConfig[] = [
  { period: 20, color: '#FCD34D', enabled: false },   // Yellow
  { period: 50, color: '#60A5FA', enabled: false },   // Blue
  { period: 150, color: '#A78BFA', enabled: false },  // Purple
  { period: 200, color: '#FB923C', enabled: false },  // Orange
];

const TIME_PERIODS = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1Y' },
  { label: '2Y', value: '2Y' },
  { label: '3Y', value: '3Y' },
];

export const TradingChart = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [ticker, setTicker] = useState('IBM');
  const [activePeriod, setActivePeriod] = useState('1Y');
  const [smaConfigs, setSmaConfigs] = useState<SMAConfig[]>(DEFAULT_SMAS);
  const [currentPrice, setCurrentPrice] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await generateStockData(ticker, activePeriod);
        setStockData(data);
        if (data.length > 0) {
          setCurrentPrice(data[data.length - 1]);
        }
      } catch (error) {
        console.error('Error loading stock data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [ticker, activePeriod]);

  const handleSMAToggle = useCallback((period: number, enabled: boolean) => {
    setSmaConfigs(prev => 
      prev.map(sma => 
        sma.period === period ? { ...sma, enabled } : sma
      )
    );
  }, []);

  const handlePeriodChange = useCallback((period: string) => {
    setActivePeriod(period);
  }, []);

  const handleTickerChange = useCallback((newTicker: string) => {
    setTicker(newTicker.toUpperCase());
  }, []);

  // Prepare chart data
  const candlestickData = stockData.map(item => [
    item.timestamp,
    item.open,
    item.high,
    item.low,
    item.close
  ]);

  const volumeData = stockData.map(item => [
    item.timestamp,
    item.volume
  ]);

  // Prepare SMA data
  const smaData = smaConfigs
    .filter(config => config.enabled)
    .map(config => {
      const smaValues = [];
      for (let i = config.period - 1; i < stockData.length; i++) {
        const sum = stockData.slice(i - config.period + 1, i + 1)
          .reduce((acc, item) => acc + item.close, 0);
        const avg = sum / config.period;
        smaValues.push([stockData[i].timestamp, avg]);
      }
      return {
        name: `SMA(${config.period})`,
        data: smaValues,
        color: config.color,
        lineWidth: 2,
        marker: { enabled: false }
      };
    });

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'candlestick',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      height: 600,
      spacingTop: 20,
      spacingRight: 20,
      spacingBottom: 20,
      spacingLeft: 20,
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      gridLineWidth: 1,
      gridLineColor: 'rgba(255,255,255,0.1)',
      lineColor: 'rgba(255,255,255,0.2)',
      tickColor: 'rgba(255,255,255,0.2)',
      labels: {
        style: {
          color: '#9CA3AF'
        }
      }
    },
    yAxis: [{
      title: {
        text: 'Price',
        style: {
          color: '#9CA3AF'
        }
      },
      height: '75%',
      lineWidth: 1,
      lineColor: 'rgba(255,255,255,0.2)',
      gridLineColor: 'rgba(255,255,255,0.1)',
      labels: {
        style: {
          color: '#9CA3AF'
        }
      },
      opposite: true
    }, {
      title: {
        text: 'Volume',
        style: {
          color: '#9CA3AF'
        }
      },
      top: '80%',
      height: '20%',
      offset: 0,
      lineWidth: 1,
      lineColor: 'rgba(255,255,255,0.2)',
      gridLineColor: 'rgba(255,255,255,0.1)',
      labels: {
        style: {
          color: '#9CA3AF'
        }
      },
      opposite: true
    }],
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      borderRadius: 8,
      style: {
        color: '#F3F4F6'
      },
      split: false,
      shared: true,
      useHTML: true
    },
    plotOptions: {
      candlestick: {
        upColor: '#10B981',
        color: '#EF4444',
        upLineColor: '#10B981',
        lineColor: '#EF4444',
        lineWidth: 1
      },
      column: {
        color: 'rgba(75, 85, 99, 0.6)'
      },
      line: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 4
            }
          }
        }
      }
    },
    rangeSelector: {
      enabled: false
    },
    navigator: {
      enabled: false
    },
    scrollbar: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    series: [
      {
        type: 'candlestick',
        name: ticker,
        data: candlestickData,
        yAxis: 0
      },
      {
        type: 'column',
        name: 'Volume',
        data: volumeData,
        yAxis: 1,
        color: 'rgba(75, 85, 99, 0.4)'
      },
      ...smaData
    ] as any
  };

  const availableTickers = ['IBM', 'AAPL', 'MSFT', 'GOOGL', 'TSLA'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Ticker Selection */}
          <div className="flex items-center gap-3">
            <select
              value={ticker}
              onChange={(e) => handleTickerChange(e.target.value)}
              className="bg-secondary border border-border rounded-lg px-4 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {availableTickers.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <Badge variant="outline" className="text-sm">
              Live Data
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <SMAPopover 
              smaConfigs={smaConfigs}
              onToggle={handleSMAToggle}
            />
            <DateRangePicker onPeriodChange={handlePeriodChange} />
          </div>
        </div>

        {/* Price Display */}
        {currentPrice && (
          <PriceDisplay 
            ticker={ticker}
            data={currentPrice}
            previousData={stockData[stockData.length - 2]}
          />
        )}

        {/* Time Period Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {TIME_PERIODS.map((period) => (
            <Button
              key={period.value}
              variant={activePeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange(period.value)}
              className={`${
                activePeriod === period.value 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-secondary"
              }`}
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <Card className="chart-container">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-pulse text-muted-foreground">
                Loading chart data...
              </div>
            </div>
          ) : (
            <HighchartsReact
              ref={chartRef}
              highcharts={Highcharts}
              constructorType="stockChart"
              options={chartOptions}
            />
          )}
        </Card>

        {/* SMA Legend */}
        {smaConfigs.some(sma => sma.enabled) && (
          <div className="flex items-center gap-6 text-sm">
            <span className="text-muted-foreground">Active SMAs:</span>
            {smaConfigs
              .filter(sma => sma.enabled)
              .map(sma => (
                <div key={sma.period} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-0.5 rounded"
                    style={{ backgroundColor: sma.color }}
                  />
                  <span style={{ color: sma.color }}>
                    SMA({sma.period})
                  </span>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};