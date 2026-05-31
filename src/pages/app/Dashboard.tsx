import { StatCard } from "@/components/widgets/StatCard";
import { PortfolioChart } from "@/components/widgets/PortfolioChart";
import { AIBriefing } from "@/components/widgets/AIBriefing";
import { RiskScore } from "@/components/widgets/RiskScore";
import { WhaleAlerts } from "@/components/widgets/WhaleAlerts";
import { CorrelationAnalysis } from "@/components/widgets/CorrelationAnalysis";
import { TradeJournal } from "@/components/widgets/TradeJournal";
import { TotalAllocationChart } from "@/components/widgets/TotalAllocationChart";
import { CustomAlerts } from "@/components/widgets/CustomAlerts";
import { Wallet, TrendingUp, Activity, Bitcoin, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CoinOneTicker } from "@/components/widgets/CoinOneTicker";
import { usePortfolioAutoSync } from "@/hooks/usePortfolioAutoSync";
import { useAlertEngine } from "@/hooks/useAlertEngine";
import { formatKRW } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CorrelationPair } from "@/lib/correlationAnalysis";
import { getPersonalizedCorrelations } from "@/lib/correlationAnalysis";

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, classBreakdown, holdings, exchangeRate, loading, refresh } = usePortfolioAutoSync();

  const totalValueKRW = stats?.portfolioValueKRW ?? 0;

  // 리스크 점수: BTC 비중(높을수록 위험) + 자산 분산도 반영
  const riskScore = stats
    ? Math.min(100, Math.round(stats.btcRatio * 0.6 + Math.max(0, 100 - holdings.length * 8) * 0.4))
    : 0;

  const correlations: CorrelationPair[] = classBreakdown.length > 0
    ? getPersonalizedCorrelations(classBreakdown, totalValueKRW)
    : [];

  const alertEngine = useAlertEngine({
    classBreakdown,
    holdings,
    totalValueKRW,
    exchangeRate,
    btcRatio: stats?.btcRatio ?? 0,
    dailyPnL: stats?.dailyPnL ?? 0,
  });

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-xl md:text-2xl font-semibold tracking-tight">
              현재 시간은 {new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric' })} 입니다, {user?.nickname || ''}님
            </h1>
            <p className="text-sm text-muted-foreground">
              현재 포트폴리오 상황입니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={refresh} className="gap-1.5 h-8 text-xs px-3">
              <RefreshCw className="h-3.5 w-3.5" />
              새로고침
            </Button>
            <div className="text-[11px] font-mono text-muted-foreground">
              {stats ? '최근 동기화 완료' : '동기화 대기 중'} | {new Date().toLocaleTimeString('ko-KR')}
            </div>
          </div>
        </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="포트폴리오 가치"
          value={stats ? formatKRW(stats.portfolioValueKRW) : "--"}
          delta={stats && stats.portfolioValueKRW && stats.dailyPnL ? (stats.dailyPnL / (stats.portfolioValueKRW - stats.dailyPnL)) * 100 : 0}
          icon={Wallet}
          accent="primary"
        />
        <StatCard
          label="일간 손익"
          value={stats ? `${stats.dailyPnL >= 0 ? "+" : ""}${formatKRW(stats.dailyPnL)}` : "--"}
          delta={stats && stats.portfolioValueKRW && stats.dailyPnL ? (stats.dailyPnL / (stats.portfolioValueKRW - stats.dailyPnL)) * 100 : 0}
          icon={TrendingUp}
          accent="primary"
        />
        <StatCard
          label="BTC/알트 비율"
          value={stats ? `${stats.btcRatio} / ${stats.altRatio}` : "--"}
          hint="포트폴리오 내 BTC 비중"
          icon={Bitcoin}
          accent="warning"
        />
        <StatCard
          label="24시간 거래"
          value={stats ? `${stats.trades24h}` : "--"}
          delta={0}
          icon={Activity}
          accent="accent"
        />
      </div>
      <CoinOneTicker />

      <TotalAllocationChart
        breakdown={classBreakdown}
        totalValueKRW={totalValueKRW}
        exchangeRate={exchangeRate}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <PortfolioChart totalValueKRW={totalValueKRW} />
        </div>
        <div className="space-y-4">
          <AIBriefing />
          <CorrelationAnalysis correlations={correlations} />
          <RiskScore score={riskScore} />
          <WhaleAlerts />
          <CustomAlerts
            rules={alertEngine.rules}
            onAdd={alertEngine.addRule}
            onUpdate={alertEngine.updateRule}
            onDelete={alertEngine.deleteRule}
            onToggle={alertEngine.toggleRule}
            onCreateDefault={alertEngine.createDefaultRule}
          />
        </div>
      </div>

      <TradeJournal />
    </div>
  );
}
