import { Card } from "@/components/ui/card";

interface Slice {
  label: string;
  value: number;
  color: string; // hsl(var(--...))
}

const data: Slice[] = [
  { label: "BTC", value: 42, color: "hsl(var(--primary))" },
  { label: "ETH", value: 24, color: "hsl(var(--accent))" },
  { label: "SOL", value: 12, color: "hsl(280 80% 65%)" },
  { label: "XRP", value: 9, color: "hsl(var(--warning))" },
  { label: "Alt", value: 13, color: "hsl(var(--bear))" },
];

export const AllocationChart = () => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let acc = 0;
  const segments = data.map((d) => {
    const start = (acc / total) * 360;
    acc += d.value;
    const end = (acc / total) * 360;
    return `${d.color} ${start}deg ${end}deg`;
  }).join(", ");

  return (
    <Card className="glass p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-sm font-semibold">자산 구성</h3>
          <p className="font-label mt-0.5">BTC 비중이 42%</p>
        </div>
        <span className="font-label">실시간 업데이트</span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative shrink-0">
          <div
            className="h-36 w-36 md:h-40 md:w-40 rounded-full"
            style={{ background: `conic-gradient(${segments})` }}
          />
          <div className="absolute inset-3 rounded-full bg-card flex flex-col items-center justify-center">
            <span className="font-label">총</span>
            <span className="font-display text-sm font-semibold">5개 자산</span>
          </div>
        </div>
        <ul className="flex-1 w-full space-y-2">
          {data.map((d) => (
            <li key={d.label} className="flex items-center gap-3 text-sm">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="font-mono w-10 text-sm">{d.label}</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
              </div>
              <span className="font-mono text-muted-foreground w-10 text-right text-xs">{d.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
