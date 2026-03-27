"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { OneMapResult } from "@/lib/onemap";
import type { ValuationSummary, FlatTypeValuation } from "@/lib/valuation";
import type { HDBTransaction } from "@/lib/hdb-data";
import { buildTrendData, formatSGD } from "@/lib/valuation";

interface Props {
  address: OneMapResult;
  valuation: ValuationSummary;
  isHDB: boolean;
  message: string | null;
}

const CONFIDENCE_CONFIG = {
  high: { label: "High", color: "text-green-700 bg-green-100" },
  medium: { label: "Medium", color: "text-yellow-700 bg-yellow-100" },
  low: { label: "Low", color: "text-orange-700 bg-orange-100" },
  insufficient: { label: "Insufficient Data", color: "text-red-700 bg-red-100" },
};

function ConfidenceBadge({ level }: { level: FlatTypeValuation["confidence"] }) {
  const cfg = CONFIDENCE_CONFIG[level];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

function formatMonth(month: string) {
  const [y, m] = month.split("-");
  const date = new Date(parseInt(y), parseInt(m) - 1, 1);
  return date.toLocaleDateString("en-SG", { month: "short", year: "numeric" });
}

export default function ValuationReport({
  address,
  valuation,
  isHDB,
  message,
}: Props) {
  const [selectedFlatType, setSelectedFlatType] = useState<string>(
    valuation?.byFlatType[0]?.flatType ?? ""
  );
  const [txPage, setTxPage] = useState(0);

  const TX_PER_PAGE = 10;

  if (!isHDB || message) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">🏢</div>
        <h3 className="font-semibold text-amber-800 text-lg mb-2">
          Private Property Detected
        </h3>
        <p className="text-amber-700 text-sm max-w-md mx-auto">
          {message ??
            "HDB valuation data is not available for private properties at this time. We currently support HDB resale flat valuations only."}
        </p>
      </div>
    );
  }

  if (!valuation || valuation.byFlatType.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">📭</div>
        <h3 className="font-semibold text-gray-700 text-lg mb-2">
          No Transaction Data Found
        </h3>
        <p className="text-gray-500 text-sm">
          No recent HDB resale transactions were found for this address. This
          may be a new development or an area with no recent resales.
        </p>
      </div>
    );
  }

  const selected =
    valuation.byFlatType.find((f) => f.flatType === selectedFlatType) ??
    valuation.byFlatType[0];

  const trendData = buildTrendData(valuation.recentTransactions, selectedFlatType || valuation.byFlatType[0].flatType);

  const filteredTx = valuation.recentTransactions.filter(
    (t) => !selectedFlatType || t.flat_type === selectedFlatType
  );
  const paginatedTx = filteredTx.slice(
    txPage * TX_PER_PAGE,
    (txPage + 1) * TX_PER_PAGE
  );
  const totalPages = Math.ceil(filteredTx.length / TX_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Flat type selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          Select Flat Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {valuation.byFlatType.map((f) => (
            <button
              key={f.flatType}
              onClick={() => {
                setSelectedFlatType(f.flatType);
                setTxPage(0);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFlatType === f.flatType
                  ? "bg-brand-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.flatType}
            </button>
          ))}
        </div>
      </div>

      {/* Valuation card */}
      <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl shadow-md p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-brand-200 text-sm font-medium uppercase tracking-wide">
              Estimated Market Value
            </p>
            <p className="text-sm text-brand-300 mt-0.5">{selected.flatType}</p>
          </div>
          <ConfidenceBadge level={selected.confidence} />
        </div>

        <div className="mb-4">
          <p className="text-4xl font-bold">
            {formatSGD(selected.estimatedValue)}
          </p>
          <p className="text-brand-200 text-sm mt-1">
            Range: {formatSGD(selected.lowEstimate)} –{" "}
            {formatSGD(selected.highEstimate)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-brand-600">
          <div>
            <p className="text-brand-300 text-xs">Median PSM</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              {formatSGD(selected.medianPricePerSqm)} / m²
            </p>
          </div>
          <div>
            <p className="text-brand-300 text-xs">Median Area</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              {selected.medianFloorArea} m²
            </p>
          </div>
          <div>
            <p className="text-brand-300 text-xs">Comparables</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              {selected.transactionCount} transactions
            </p>
          </div>
        </div>
      </div>

      {/* Methodology note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
        <strong>Methodology:</strong> Estimated value is based on the median
        price per m² from {selected.transactionCount} recent HDB resale
        transactions
        {valuation.latestTransactionMonth && (
          <> (up to {formatMonth(valuation.latestTransactionMonth)})</>
        )}{" "}
        in this area, applied to the median floor area for {selected.flatType}{" "}
        flats. The range reflects the 25th–75th percentile of comparable
        transactions. This is an indicative estimate only and should not be
        relied upon as a formal valuation.
      </div>

      {/* Price trend chart */}
      {trendData.length > 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-1">
            Price Trend – {selectedFlatType || valuation.byFlatType[0].flatType}
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Median resale price per m² by month
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                width={55}
              />
              <Tooltip
                formatter={(value: number) => [
                  formatSGD(value) + " / m²",
                  "Median PSM",
                ]}
                labelFormatter={(label) => formatMonth(label)}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="medianPSM"
                stroke="#1d4ed8"
                strokeWidth={2}
                dot={{ fill: "#1d4ed8", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent transactions table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">
            Recent Comparable Transactions
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {filteredTx.length} transactions in the last {valuation.dataMonths}{" "}
            months
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Month
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Block / Street
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Flat Type
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Storey
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide text-right">
                  Floor Area
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide text-right">
                  Price
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide text-right">
                  PSM
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedTx.map((tx: HDBTransaction, i: number) => {
                const psm = Math.round(
                  parseFloat(tx.resale_price) / parseFloat(tx.floor_area_sqm)
                );
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">
                      {formatMonth(tx.month)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      Blk {tx.block} {tx.street_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{tx.flat_type}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {tx.storey_range}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-right">
                      {tx.floor_area_sqm} m²
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-right">
                      {formatSGD(parseFloat(tx.resale_price))}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right">
                      {formatSGD(psm)}/m²
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Page {txPage + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setTxPage((p) => Math.max(0, p - 1))}
                disabled={txPage === 0}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setTxPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={txPage === totalPages - 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
