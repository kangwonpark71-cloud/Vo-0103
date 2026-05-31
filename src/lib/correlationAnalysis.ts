import type { ClassBreakdown } from './aggregatePortfolio';

export interface CorrelationPair {
  assetA: string;
  assetB: string;
  coefficient: number; // -1 ~ 1
  label: string;
  description: string;
}

/**
 * 피어슨 상관계수 (Pearson correlation coefficient)
 * r = \u03a3((xi-x\u0304)(yi-\u0305y)) / \u221a(\u03a3(xi-x\u0304)\u00b2 \u03a3(yi-\u0305y)\u00b2)
 */
export function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, denomX = 0, denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? 0 : Math.max(-1, Math.min(1, num / denom));
}

/**
 * 시드 상관관계 데이터
 * 실제 과거 데이터 기반 근사치, 지속적으로 업데이트 필요
 */
export function getSeedCorrelations(): CorrelationPair[] {
  return [
    {
      assetA: 'BTC',
      assetB: 'Nasdaq',
      coefficient: 0.42,
      label: 'BTC vs \ub098\uc2a4\ub2e5',
      description: 'BTC\ub294 \uae30\uc220\uc8fc\uc640 \uc911\uac04 \uc815\ub3c4\uc758 \uc591\uc758 \uc0c1\uad00\uad00\uacc4\ub97c \ubcf4\uc785\ub2c8\ub2e4. \uc704\ud5d8\uc790\uc0b0 \uc120\ud638 \uc2ec\ub9ac\uac00 \ubc18\uc601\ub429\ub2c8\ub2e4.',
    },
    {
      assetA: 'BTC',
      assetB: 'KOSPI',
      coefficient: 0.28,
      label: 'BTC vs \ucf54\uc2a4\ud53c',
      description: 'BTC\uc640 \ucf54\uc2a4\ud53c\ub294 \uc57d\ud55c \uc591\uc758 \uc0c1\uad00\uad00\uacc4\ub97c \ubcf4\uc785\ub2c8\ub2e4. \uae00\ub85c\ubc8c \uc720\ub3d9\uc131\uc5d0 \ub3d9\uc2dc\uc5d0 \uc601\ud5a5\uc744 \ubc1b\uc2b5\ub2c8\ub2e4.',
    },
    {
      assetA: 'BTC',
      assetB: 'USD/KRW',
      coefficient: -0.18,
      label: 'BTC vs \uc6d0/\ub2ec\ub7ec',
      description: '\uc57d\ud55c \uc74c\uc758 \uc0c1\uad00\uad00\uacc4\ub85c, \ub2ec\ub7ec \uc57d\uc138 \uc2dc BTC \uac15\uc138\ub97c \ubcf4\uc774\ub294 \uacbd\ud5a5\uc774 \uc788\uc2b5\ub2c8\ub2e4.',
    },
    {
      assetA: '\uad6d\ub0b4 \uc8fc\uc2dd',
      assetB: '\ubbf8\uad6d \uc8fc\uc2dd',
      coefficient: 0.65,
      label: '\uad6d\ub0b4 vs \ubbf8\uad6d \uc8fc\uc2dd',
      description: '\ubbf8\uad6d \uc99d\uc2dc\uc640 \ud55c\uad6d \uc99d\uc2dc\ub294 \ube44\uad50\uc801 \uac15\ud55c \uc591\uc758 \uc0c1\uad00\uad00\uacc4\ub97c \ubcf4\uc785\ub2c8\ub2e4. \uae00\ub85c\ubc8c \uacbd\uae30 \uc21c\ud658\uc744 \uacf5\uc720\ud569\ub2c8\ub2e4.',
    },
    {
      assetA: '\uc554\ud638\ud654\ud3d0',
      assetB: '\uae08',
      coefficient: 0.15,
      label: '\uc554\ud638\ud654\ud3d0 vs \uae08',
      description: '\uc554\ud638\ud654\ud3d0\uc640 \uae08\uc740 \uc0c1\uad00\uad00\uacc4\uac00 \ub0ae\uc544, \ud568\uaed8 \ubcf4\uc720 \uc2dc \ubd84\uc0b0 \ud6a8\uacfc\ub97c \uae30\ub300\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.',
    },
  ];
}

/**
 * 상관관계 매트릭스 조회 (시드 데이터 + 로컬 누적 데이터)
 * 향후 localStorage 누적 데이터와 병합 가능
 */
export function getCorrelationMatrix(): CorrelationPair[] {
  return getSeedCorrelations();
}

/**
 * 개인 포트폴리오 맞춤형 상관관계 분석
 * 사용자가 실제 보유한 자산군 비중을 반영하여 상관계수를 가중 조정
 */
export function getPersonalizedCorrelations(
  breakdown: ClassBreakdown[],
  totalValueKRW: number,
): CorrelationPair[] {
  if (!breakdown.length || totalValueKRW <= 0) return [];

  const classMap = new Map(breakdown.map((b) => [b.assetClass, b.valueKRW]));
  const koreanPct = ((classMap.get('korean') ?? 0) / totalValueKRW) * 100;
  const usPct = ((classMap.get('us') ?? 0) / totalValueKRW) * 100;
  const cryptoPct = ((classMap.get('crypto') ?? 0) / totalValueKRW) * 100;

  const hasKorean = koreanPct > 0;
  const hasUS = usPct > 0;
  const hasCrypto = cryptoPct > 0;
  const activeCount = [hasKorean, hasUS, hasCrypto].filter(Boolean).length;

  if (activeCount < 2) return [];

  const pairs: CorrelationPair[] = [];
  const seeds = getSeedCorrelations();

  if (hasCrypto && hasUS) {
    const seed = seeds.find((p) => p.assetA === 'BTC' && p.assetB === 'Nasdaq');
    if (seed) {
      const weightedR = seed.coefficient * (1 + cryptoPct * 0.003);
      pairs.push({
        ...seed,
        coefficient: Math.min(0.95, weightedR),
        description: `내 포트폴리오의 암호화폐 비중 ${cryptoPct.toFixed(0)}% 반영. ${seed.description}`,
      });
    }
  }

  if (hasCrypto && hasKorean) {
    const seed = seeds.find((p) => p.assetA === 'BTC' && p.assetB === 'KOSPI');
    if (seed) {
      const weightedR = seed.coefficient * (1 + cryptoPct * 0.002);
      pairs.push({
        ...seed,
        coefficient: Math.min(0.9, weightedR),
        description: `내 포트폴리오 암호화폐 ${cryptoPct.toFixed(0)}% + 국내 주식 ${koreanPct.toFixed(0)}% 구성 반영. ${seed.description}`,
      });
    }
  }

  if (hasKorean && hasUS) {
    const seed = seeds.find((p) => p.assetA === '국내 주식' && p.assetB === '미국 주식');
    if (seed) {
      const balanceFactor = 1 - Math.abs((koreanPct - usPct) / (koreanPct + usPct)) * 0.3;
      const adjustedR = seed.coefficient * balanceFactor;
      pairs.push({
        ...seed,
        coefficient: adjustedR,
        description: `국내(${koreanPct.toFixed(0)}%):미국(${usPct.toFixed(0)}%) 비중 반영. ${seed.description}`,
      });
    }
  }

  if (hasCrypto && (hasKorean || hasUS)) {
    const seed = seeds.find((p) => p.assetA === 'BTC' && p.assetB === 'USD/KRW');
    if (seed) {
      const fxWeight = hasUS ? 1.2 : 0.8;
      pairs.push({
        ...seed,
        coefficient: seed.coefficient * fxWeight,
        description: hasUS
          ? `미국 자산 보유로 환율 민감도 ${(fxWeight * 100).toFixed(0)}% 반영. ${seed.description}`
          : `국내 자산 중심으로 환율 영향 상대적 ${(fxWeight * 100).toFixed(0)}% 수준. ${seed.description}`,
      });
    }
  }

  if (pairs.length > 0) {
    const avgR = pairs.reduce((s, p) => s + p.coefficient, 0) / pairs.length;
    const diversificationBonus = Math.min(0.3, activeCount * 0.1);
    pairs.push({
      assetA: '내 포트폴리오',
      assetB: '시장 평균',
      coefficient: avgR * (1 - diversificationBonus),
      label: '포트폴리오 종합',
      description: `${activeCount}개 자산군 분산 투자로 종합 상관계수 ${(diversificationBonus * 100).toFixed(0)}% 경감. 분산 효과가 리스크를 낮추고 있습니다.`,
    });
  }

  return pairs;
}
