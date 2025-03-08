
import React from 'react';
import { cn } from '@/lib/utils';
import { useSmoothCounter } from '@/lib/animations';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  Shield, 
  Code2, 
  Bug, 
  Zap 
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ReactNode;
  className?: string;
  unit?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendGood?: boolean;
  formatter?: (value: number) => string;
}

export function MetricCard({ 
  title, 
  value, 
  previousValue, 
  icon,
  unit = '',
  className,
  trendDirection = 'neutral',
  trendGood = true,
  formatter = (val) => val.toString()
}: MetricCardProps) {
  const displayValue = useSmoothCounter(value);
  
  let trendColor = 'text-foreground/50';
  if (trendDirection === 'up') {
    trendColor = trendGood ? 'text-green-500' : 'text-red-500';
  } else if (trendDirection === 'down') {
    trendColor = trendGood ? 'text-red-500' : 'text-green-500';
  }
  
  const trendIcon = trendDirection === 'up' ? (
    <TrendingUp size={16} className={cn("ml-1", trendColor)} />
  ) : trendDirection === 'down' ? (
    <TrendingDown size={16} className={cn("ml-1", trendColor)} />
  ) : null;
  
  return (
    <div className={cn(
      "rounded-xl p-6 bg-card border border-border shadow-sm transition-all hover:shadow-md",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground/70">{title}</span>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline space-x-1">
        <h3 className="text-2xl font-bold">{formatter(displayValue)}{unit}</h3>
        {previousValue !== undefined && (
          <div className="flex items-center text-xs font-medium">
            {trendIcon}
          </div>
        )}
      </div>
      
      {previousValue !== undefined && (
        <div className="mt-1 text-xs text-foreground/60">
          {previousValue > value ? 'Down' : previousValue < value ? 'Up' : 'No change'} from {formatter(previousValue)}{unit}
        </div>
      )}
    </div>
  );
}

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <MetricCard 
        title="Code Quality Score" 
        value={87}
        previousValue={82}
        icon={<Zap size={18} />}
        unit="/100"
        trendDirection="up"
        trendGood={true}
      />
      
      <MetricCard 
        title="Bugs Found" 
        value={12}
        previousValue={19}
        icon={<Bug size={18} />}
        trendDirection="down"
        trendGood={true}
      />
      
      <MetricCard 
        title="Code Smells" 
        value={47}
        previousValue={63}
        icon={<Code2 size={18} />}
        trendDirection="down"
        trendGood={true}
      />
      
      <MetricCard 
        title="Security Vulnerabilities" 
        value={2}
        previousValue={5}
        icon={<Shield size={18} />}
        trendDirection="down"
        trendGood={true}
      />
    </div>
  );
}
