import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import type { ClassBreakdown } from '@/lib/aggregatePortfolio';
import { formatKRW } from '@/lib/utils';

interface Props {
  breakdown: ClassBreakdown[];
  totalValueKRW: number;
  exchangeRate: number;
}

interface CustomPayload {
  label: string;
  color: string;
  holdingCount: number;
  value: number;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: CustomPayload }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="glass p-3 text-sm space-y-1 rounded-lg border">
      <p className="font-display font-semibold">{d.payload.label}</p>
      <p className="font-mono">{formatKRW(d.value)}</p>
      <p className="text-xs text-muted-foreground">
        {d.payload.holdingCount}\uac1c \uc790\uc0b0
      </p>
    </div>
  );
};

export const TotalAllocationChart = ({ breakdown, totalValueKRW, exchangeRate }: Props) => {
  if (!breakdown.length) {
    return (
      <Card className="glass p-4 md:p-5">
        <h3 className="font-display text-sm font-semibold mb-1">총자산 구성</h3>
        <p className="text-sm text-muted-foreground">
          거래소를 연결하면 자산 구성을 확인할 수 있습니다.
        </p>
      </Card>
    );
  }

  return (
    <Card className="glass p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-sm font-semibold">총자산 구성</h3>
          <p className="font-label mt-0.5">
            환율: {formatKRW(exchangeRate)}/USD
          </p>
        </div>
        <span className="font-display text-xl md:text-2xl font-semibold leading-tight">
          {formatKRW(totalValueKRW)}
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-44 h-44 md:w-48 md:h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown.map((b) => ({
                  ...b,
                  value: Math.max(b.valueKRW, 0.01),
                }))}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                paddingAngle={3}
              >
                {breakdown.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex-1 w-full space-y-3">
          {breakdown.map((b) => {
            const pct = totalValueKRW > 0 ? (b.valueKRW / totalValueKRW) * 100 : 0;
            return (
              <li key={b.assetClass} className="flex items-center gap-3 text-sm">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ background: b.color }}
                />
                <span className="w-20 text-muted-foreground text-sm">{b.label}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: b.color }}
                  />
                </div>
                <span className="font-mono text-muted-foreground w-16 text-right text-xs tabular-nums">
                  {pct.toFixed(1)}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};
