import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangePickerProps {
  onPeriodChange: (period: string) => void;
}

export const DateRangePicker = ({ onPeriodChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const handleDateSelect = (date: Date | undefined, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromDate(date);
    } else {
      setToDate(date);
    }

    // If both dates are selected, calculate the period
    if (fromDate && toDate) {
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Convert to our period format
      if (diffDays <= 7) {
        onPeriodChange('1W');
      } else if (diffDays <= 30) {
        onPeriodChange('1M');
      } else if (diffDays <= 90) {
        onPeriodChange('3M');
      } else if (diffDays <= 180) {
        onPeriodChange('6M');
      } else if (diffDays <= 365) {
        onPeriodChange('1Y');
      } else if (diffDays <= 730) {
        onPeriodChange('2Y');
      } else {
        onPeriodChange('3Y');
      }
      
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 hover:bg-secondary/80"
        >
          <CalendarDays className="h-4 w-4" />
          Range
          {fromDate && toDate && (
            <span className="text-xs">
              {format(fromDate, 'MMM dd')} - {format(toDate, 'MMM dd')}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-card border-border shadow-xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">
              Custom Date Range
            </h4>
            <p className="text-xs text-muted-foreground">
              Select start and end dates for the chart
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">From</label>
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={(date) => handleDateSelect(date, 'from')}
                className="rounded-md border border-border"
                disabled={(date) => date > new Date() || date < new Date('2020-01-01')}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">To</label>
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={(date) => handleDateSelect(date, 'to')}
                className="rounded-md border border-border"
                disabled={(date) => 
                  date > new Date() || 
                  date < new Date('2020-01-01') ||
                  (fromDate && date < fromDate)
                }
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setFromDate(undefined);
                setToDate(undefined);
              }}
              className="flex-1"
            >
              Clear
            </Button>
            <Button 
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={!fromDate || !toDate}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};