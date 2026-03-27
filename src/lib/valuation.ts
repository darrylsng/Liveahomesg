import type { HDBTransaction } from "./hdb-data";
import { filterRecentTransactions, storeyMidpoint } from "./hdb-data";

export interface FlatTypeValuation {
  flatType: string;
  estimatedValue: number;
  lowEstimate: number;
  highEstimate: number;
  medianPricePerSqm: number;
  medianFloorArea: number;
  transactionCount: number;
  confidence: "high" | "medium" | "low" | "insufficient";
}

export interface ValuationSummary {
  byFlatType: FlatTypeValuation[];
  recentTransactions: HDBTransaction[];
  dataMonths: number;
  latestTransactionMonth: string | null;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

function floorAdjustment(storeyRange: string): number {
  const floor = storeyMidpoint(storeyRange);
  // +0.6% per floor above storey 3, capped at +18%
  const adjustment = Math.min(0.18, Math.max(0, (floor - 3) * 0.006));
  return adjustment;
}

function confidenceLevel(
  count: number
): "high" | "medium" | "low" | "insufficient" {
  if (count >= 15) return "high";
  if (count >= 6) return "medium";
  if (count >= 2) return "low";
  return "insufficient";
}

export function computeValuation(
  transactions: HDBTransaction[],
  dataMonths = 24
): ValuationSummary {
  const recent = filterRecentTransactions(transactions, dataMonths);

  const latestTransactionMonth =
    recent.length > 0 ? [...recent].sort((a, b) => b.month.localeCompare(a.month))[0].month : null;

  // Group by flat type
  const byType: Record<string, HDBTransaction[]> = {};
  for (const tx of recent) {
    const ft = tx.flat_type;
    if (!byType[ft]) byType[ft] = [];
    byType[ft].push(tx);
  }

  const flatTypeOrder = [
    "1 ROOM",
    "2 ROOM",
    "3 ROOM",
    "4 ROOM",
    "5 ROOM",
    "EXECUTIVE",
    "MULTI-GENERATION",
  ];

  const byFlatType: FlatTypeValuation[] = [];

  for (const flatType of flatTypeOrder) {
    const txs = byType[flatType];
    if (!txs || txs.length === 0) continue;

    const psmValues = txs.map(
      (t) => parseFloat(t.resale_price) / parseFloat(t.floor_area_sqm)
    );
    const floorAreas = txs.map((t) => parseFloat(t.floor_area_sqm));

    const medianPSM = median(psmValues);
    const medianArea = median(floorAreas);
    const p25PSM = percentile(psmValues, 25);
    const p75PSM = percentile(psmValues, 75);

    const estimatedValue = Math.round((medianPSM * medianArea) / 1000) * 1000;
    const lowEstimate = Math.round((p25PSM * medianArea) / 1000) * 1000;
    const highEstimate = Math.round((p75PSM * medianArea) / 1000) * 1000;

    byFlatType.push({
      flatType,
      estimatedValue,
      lowEstimate,
      highEstimate,
      medianPricePerSqm: Math.round(medianPSM),
      medianFloorArea: Math.round(medianArea),
      transactionCount: txs.length,
      confidence: confidenceLevel(txs.length),
    });
  }

  // Sort recentTransactions: newest first
  const recentTransactions = [...recent].sort((a, b) =>
    b.month.localeCompare(a.month)
  );

  return { byFlatType, recentTransactions, dataMonths, latestTransactionMonth };
}

/** Adjust an estimated value for a specific unit's floor level */
export function adjustForFloor(
  baseValue: number,
  storeyRange: string
): number {
  const adj = floorAdjustment(storeyRange);
  return Math.round((baseValue * (1 + adj)) / 1000) * 1000;
}

/** Format a number as SGD currency string */
export function formatSGD(value: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Generate trend data (monthly median PSM) for a flat type */
export function buildTrendData(
  transactions: HDBTransaction[],
  flatType: string
): { month: string; medianPSM: number; count: number }[] {
  const filtered = transactions.filter((t) => t.flat_type === flatType);

  const byMonth: Record<string, number[]> = {};
  for (const tx of filtered) {
    if (!byMonth[tx.month]) byMonth[tx.month] = [];
    byMonth[tx.month].push(
      parseFloat(tx.resale_price) / parseFloat(tx.floor_area_sqm)
    );
  }

  return Object.entries(byMonth)
    .map(([month, psms]) => ({
      month,
      medianPSM: Math.round(median(psms)),
      count: psms.length,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
