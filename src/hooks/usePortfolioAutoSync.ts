import { useCallback, useEffect, useState, useRef } from 'react';
import { aggregatePortfolio } from '@/lib/aggregatePortfolio';
import type { AggregateResult, ClassBreakdown } from '@/lib/aggregatePortfolio';
import type { PortfolioHolding } from '@/lib/portfolioModel';

interface PortfolioStats {
  portfolioValueKRW: number;
  btcRatio: number;
  altRatio: number;
  dailyPnL: number;
  trades24h: number;
}

interface UsePortfolioAutoSyncResult {
  stats: PortfolioStats | null;
  /** 전체 집계 데이터 (차트/분석용) */
  aggregateData: AggregateResult | null;
  /** 자산군별 분류 데이터 */
  classBreakdown: ClassBreakdown[];
  /** 개별 보유 자산 목록 */
  holdings: PortfolioHolding[];
  /** KRW/USD 환율 */
  exchangeRate: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePortfolioAutoSync(): UsePortfolioAutoSyncResult {
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [aggregateData, setAggregateData] = useState<AggregateResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result: AggregateResult = await aggregatePortfolio();
      if (mountedRef.current) {
        setAggregateData(result);
        setStats({
          portfolioValueKRW: result.summary.portfolioValueKRW,
          btcRatio: result.summary.btcRatio,
          altRatio: result.summary.altRatio,
          dailyPnL: result.summary.dailyPnL,
          trades24h: result.summary.trades24h,
        });
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Sync failed');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refresh();
    return () => { mountedRef.current = false; };
  }, [refresh]);

  return {
    stats,
    aggregateData,
    classBreakdown: aggregateData?.classBreakdown ?? [],
    holdings: aggregateData?.holdings ?? [],
    exchangeRate: aggregateData?.exchangeRate ?? 0,
    loading,
    error,
    refresh,
  };
}
