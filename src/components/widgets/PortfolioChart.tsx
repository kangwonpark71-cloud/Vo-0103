import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";

interface PortfolioChartProps {
  totalValueKRW?: number;
}

// Lightweight inline SVG sparkline / area chart (TradingView-inspired)
export const PortfolioChart = ({ totalValueKRW }: PortfolioChartProps) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  const points = useMemo(() => {
    const seed = tick;
    const N = 60;
    const arr: number[] = [];
    let v = 100;
    for (let i = 0; i < N; i++) {
      const noise = Math.sin((i + seed) * 0.35) * 4 + Math.cos((i + seed) * 0.13) * 2.5;
      v += noise * 0.4 + 0.25;
      arr.push(v);
    }
    return arr;
  }, [tick]);

  const W = 800, H = 240, P = 8;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const xScale = (i: number) => P + (i / (points.length - 1)) * (W - P * 2);
  const yScale = (v: number) => H - P - ((v - min) / (max - min || 1)) * (H - P * 2);
  const line = points.map((v, i) => `${i === 0 ? "M" : "L"}${xScale(i).toFixed(1)},${yScale(v).toFixed(1)}`).join(" ");
  const area = `${line} L${xScale(points.length - 1).toFixed(1)},${H - P} L${xScale(0).toFixed(1)},${H - P} Z`;
  const last = points[points.length - 1];
  const first = points[0];
  const change = ((last - first) / first) * 100;
  const positive = change >= 0;

  return (
    <Card className="glass p-4 md:p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display text-sm font-semibold">포트폴리오 가치</h3>
          <p className="font-label mt-0.5">최근 24시간 실시간</p>
        </div>
        <div className="text-right">
          <div className="font-display text-xl md:text-2xl font-semibold leading-tight">
            {totalValueKRW != null
              ? `₩ ${Math.round(totalValueKRW).toLocaleString('ko-KR')}`
              : '₩ 0'}
          </div>
          <div className={`text-sm font-mono tabular-nums ${positive ? "text-primary" : "text-bear"}`}>
            {positive ? "+" : ""}
            {change.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="w-full -mx-0.5">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-48 md:h-56">
          <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={positive ? "#22c55e" : "#3b82f6"} stopOpacity="0.4" />
              <stop offset="100%" stopColor={positive ? "#22c55e" : "#3b82f6"} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((p) => (
            <line key={p} x1={P} x2={W - P} y1={H * p} y2={H * p} stroke="#e5e7eb" strokeDasharray="3 4" opacity="0.4" />
          ))}
          <path d={area} fill="url(#grad)" />
          <path d={line} fill="none" stroke={positive ? "#22c55e" : "#3b82f6"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={xScale(points.length - 1)} cy={yScale(last)} r="4" fill={positive ? "#22c55e" : "#3b82f6"} className="animate-pulse-glow" />
        </svg>
      </div>
    </Card>
  );
};
