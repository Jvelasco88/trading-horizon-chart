import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp } from 'lucide-react';

interface SMAConfig {
  period: number;
  color: string;
  enabled: boolean;
}

interface SMAPopoverProps {
  smaConfigs: SMAConfig[];
  onToggle: (period: number, enabled: boolean) => void;
}

export const SMAPopover = ({ smaConfigs, onToggle }: SMAPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (period: number, checked: boolean) => {
    onToggle(period, checked);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 hover:bg-secondary/80"
        >
          <TrendingUp className="h-4 w-4" />
          SMA
          {smaConfigs.filter(sma => sma.enabled).length > 0 && (
            <span className="bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-xs">
              {smaConfigs.filter(sma => sma.enabled).length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 bg-card border-border shadow-xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">
              Simple Moving Averages
            </h4>
            <p className="text-xs text-muted-foreground">
              Select which SMAs to display on the chart
            </p>
          </div>
          
          <div className="space-y-3">
            {smaConfigs.map((sma) => (
              <div key={sma.period} className="flex items-center space-x-3">
                <Checkbox
                  id={`sma-${sma.period}`}
                  checked={sma.enabled}
                  onCheckedChange={(checked) => handleToggle(sma.period, !!checked)}
                  className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <div className="flex items-center gap-2 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sma.color }}
                  />
                  <label 
                    htmlFor={`sma-${sma.period}`}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    SMA({sma.period})
                  </label>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              SMAs help identify trends and support/resistance levels
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};