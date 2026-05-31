import { StatCard } from "@/components/widgets/StatCard";
import { PortfolioChart } from "@/components/widgets/PortfolioChart";
import { AllocationChart } from "@/components/widgets/AllocationChart";
import { AIBriefing } from "@/components/widgets/AIBriefing";
import { RiskScore } from "@/components/widgets/RiskScore";
import { WhaleAlerts } from "@/components/widgets/WhaleAlerts";
import { CorrelationAnalysis } from "@/components/widgets/CorrelationAnalysis";
import { TradeJournal } from "@/components/widgets/TradeJournal";
import { Wallet, TrendingUp, Activity, Bitcoin, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CoinOneTicker } from "@/components/widgets/CoinOneTicker";
import { usePortfolioAutoSync } from "@/hooks/usePortfolioAutoSync";
import { formatKRW } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, loading, refresh } = usePortfolioAutoSync();

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        \ub370\uc774\ud130\ub97c \ubd88\ub7ec\uc624\ub294 \uc911...
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
              \ud604\uc7ac \ud3ec\ud2b8\ud3f4\ub9ac\uc624 \uc0c1\ud669\uc785\ub2c8\ub2e4.
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
          label="\ud3ec\ud2b8\ud3f4\ub9ac\uc624 \uac00\uce58"
          value={stats ? formatKRW(stats.portfolioValueKRW) : "--"}
          delta={stats && stats.portfolioValueKRW && stats.dailyPnL ? (stats.dailyPnL / (stats.portfolioValueKRW - stats.dailyPnL)) * 100 : 0}
          icon={Wallet}
          accent="primary"
        />
        <StatCard
          label="\uc77c\uac04 \uc190\uc775"
          value={stats ? `${stats.dailyPnL >= 0 ? "+" : ""}${formatKRW(stats.dailyPnL)}` : "--"}
          delta={stats && stats.portfolioValueKRW && stats.dailyPnL ? (stats.dailyPnL / (stats.portfolioValueKRW - stats.dailyPnL)) * 100 : 0}
          icon={TrendingUp}
          accent="primary"
        />
        <StatCard
          label="BTC/\uc54c\ud2b8 \ube44\uc728"
          value={stats ? `${stats.btcRatio} / ${stats.altRatio}` : "--"}
          hint="\ud3ec\ud2b8\ud3f4\ub9ac\uc624 \ub0b4 BTC \ube44\uc911"
          icon={Bitcoin}
          accent="warning"
        />
        <StatCard
          label="24\uc2dc\uac04 \uac70\ub798"
          value={stats ? `${stats.trades24h}` : "--"}
          delta={0}
          icon={Activity}
          accent="accent"
        />
      </div>
      <CoinOneTicker />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <PortfolioChart />
          <AllocationChart />
        </div>
        <div className="space-y-4">
          <AIBriefing />
          <CorrelationAnalysis />
          <RiskScore score={38} />
          <WhaleAlerts />
        </div>
      </div>

      <TradeJournal />
    </div>
  );
}
