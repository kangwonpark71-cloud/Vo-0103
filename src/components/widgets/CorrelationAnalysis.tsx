import { Card } from '@/components/ui/card';
import type { CorrelationPair } from '@/lib/correlationAnalysis';
import { getSeedCorrelations } from '@/lib/correlationAnalysis';

interface CorrelationAnalysisProps {
  correlations?: CorrelationPair[];
}

const colorForCoefficient = (r: number): string => {
  if (r > 0.5) return 'text-green-500';
  if (r > 0.2) return 'text-lime-500';
  if (r > -0.2) return 'text-muted-foreground';
  if (r > -0.5) return 'text-orange-500';
  return 'text-red-500';
};

const bgForCoefficient = (r: number): string => {
  const abs = Math.abs(r);
  if (abs > 0.5) return 'bg-primary/10';
  if (abs > 0.2) return 'bg-accent/5';
  return 'bg-transparent';
};

const barForCoefficient = (r: number): { width: string; color: string } => {
  const pct = Math.abs(r) * 100;
  return {
    width: `${Math.max(pct, 2)}%`,
    color: r > 0 ? 'hsl(var(--primary))' : 'hsl(var(--bear))',
  };
};

export const CorrelationAnalysis = ({ correlations }: CorrelationAnalysisProps) => {
  const pairs = correlations && correlations.length > 0 ? correlations : getSeedCorrelations();

  return (
    <Card className="glass p-4 md:p-5">
      <h3 className="font-display text-sm font-semibold mb-0.5">
        자산 간 상관관계
      </h3>
      <p className="font-label mb-4">
        {correlations && correlations.length > 0
          ? '내 포트폴리오 기준 맞춤형 상관계수 (Pearson r)'
          : '과거 데이터 기반 예측 상관계수 (Pearson r)'}
      </p>
      <div className="space-y-3">
        {pairs.map((pair, idx) => {
          const bar = barForCoefficient(pair.coefficient);
          return (
            <div
              key={idx}
              className={`rounded-lg p-3 transition-colors ${bgForCoefficient(pair.coefficient)}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{pair.label}</span>
                <span
                  className={`font-mono text-xs font-semibold tabular-nums ${colorForCoefficient(pair.coefficient)}`}
                >
                  {pair.coefficient > 0 ? '+' : ''}
                  {pair.coefficient.toFixed(2)}
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: bar.width,
                    background: bar.color,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {pair.description}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
