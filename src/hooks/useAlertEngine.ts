import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { ClassBreakdown } from '@/lib/aggregatePortfolio';
import type { PortfolioHolding } from '@/lib/portfolioModel';
import {
  loadRules,
  saveRules,
  addRule as engineAddRule,
  updateRule as engineUpdateRule,
  deleteRule as engineDeleteRule,
  toggleRule as engineToggleRule,
  buildSnapshot,
  evaluateRule,
  createDefaultRule,
} from '@/lib/alertEngine';
import type { AlertRule } from '@/lib/alertEngine';

const POLL_INTERVAL_MS = 30_000;

interface AlertEngineInput {
  classBreakdown: ClassBreakdown[];
  holdings: PortfolioHolding[];
  totalValueKRW: number;
  exchangeRate: number;
  btcRatio: number;
  dailyPnL: number;
}

export function useAlertEngine(input: AlertEngineInput) {
  const [rules, setRules] = useState<AlertRule[]>(() => loadRules());
  const inputRef = useRef(input);
  inputRef.current = input;

  const checkRules = useCallback(() => {
    const snapshot = buildSnapshot(
      inputRef.current.classBreakdown,
      inputRef.current.holdings,
      inputRef.current.totalValueKRW,
      inputRef.current.exchangeRate,
      inputRef.current.btcRatio,
      inputRef.current.dailyPnL,
    );

    const current = loadRules();
    let changed = false;

    const updated = current.map((rule) => {
      if (!rule.enabled) return rule;
      const cooldownMs = rule.cooldownMinutes * 60 * 1000;
      const lastTriggered = rule.lastTriggeredAt ?? 0;
      if (Date.now() - lastTriggered < cooldownMs) return rule;

      const triggered = evaluateRule(rule, snapshot);
      if (!triggered) return rule;

      toast(rule.name || '알림', {
        description: rule.message,
        duration: 6000,
      });

      changed = true;
      return { ...rule, lastTriggeredAt: Date.now() };
    });

    if (changed) {
      saveRules(updated);
      setRules(updated);
    }
  }, []);

  useEffect(() => {
    checkRules();
    const id = setInterval(checkRules, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [checkRules]);

  const addRule = useCallback((rule: AlertRule) => {
    setRules(engineAddRule(rule));
  }, []);

  const updateRule = useCallback((rule: AlertRule) => {
    setRules(engineUpdateRule(rule));
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules(engineDeleteRule(id));
  }, []);

  const toggleRule = useCallback((id: string) => {
    setRules(engineToggleRule(id));
  }, []);

  return {
    rules,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    createDefaultRule,
  };
}
