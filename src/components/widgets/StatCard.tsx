import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon: LucideIcon;
  accent?: 'primary' | 'warning' | 'accent';
}

export function StatCard({ label, value, delta, hint, icon: Icon, accent = 'primary' }: StatCardProps) {
  const colorMap = {
    primary: 'text-primary',
    warning: 'text-warning',
    accent: 'text-accent',
  };

  return (
    <Card className="glass p-4 md:p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="font-label">{label}</span>
        <Icon className={`h-4 w-4 ${colorMap[accent]}`} />
      </div>
      <div className="font-display text-xl md:text-2xl font-semibold leading-tight">{value}</div>
      {(delta !== undefined || hint) && (
        <div className="mt-1.5 text-xs text-muted-foreground">
          {delta !== undefined && (
            <span className={delta >= 0 ? 'text-bull' : 'text-bear'}>
              {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
            </span>
          )}
          {hint && <span className="ml-2">{hint}</span>}
        </div>
      )}
    </Card>
  );
}
