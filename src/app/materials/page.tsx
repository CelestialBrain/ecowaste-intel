"use client";

import { materialsData } from "@/data/materials";
import { exportToCSV } from "@/lib/utils";
import StatStrip from "@/components/StatCard";
import { TrendingUp, TrendingDown, Minus, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MaterialsPage() {
  const chartData = materialsData.map((m) => ({
    name: m.short_name,
    Buy: m.buy_price_php_per_kg,
    Sell: m.sell_price_php_per_kg,
    Margin: m.sell_price_php_per_kg - m.buy_price_php_per_kg,
  }));

  // Exclude copper from chart for scale reasons (300+ vs single digits)
  const chartDataFiltered = chartData.filter((d) => d.name !== "CU");

  const highestMargin = materialsData.reduce((best, m) => {
    const margin = m.sell_price_php_per_kg - m.buy_price_php_per_kg;
    const bestMargin = best.sell_price_php_per_kg - best.buy_price_php_per_kg;
    return margin > bestMargin ? m : best;
  }, materialsData[0]);

  const avgMarginPct =
    materialsData.reduce((sum, m) => {
      return (
        sum +
        ((m.sell_price_php_per_kg - m.buy_price_php_per_kg) /
          m.buy_price_php_per_kg) *
          100
      );
    }, 0) / materialsData.length;

  const trendIcon = (direction: string) => {
    if (direction === "up") return TrendingUp;
    if (direction === "down") return TrendingDown;
    return Minus;
  };

  return (
    <div>
      {/* Editorial Header */}
      <div
        className="animate-section"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-default)",
          paddingBottom: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 400,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Material Prices
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-secondary)",
              margin: "4px 0 0 0",
            }}
          >
            Scrap material buy/sell price tracker
          </p>
        </div>
        <button
          onClick={() =>
            exportToCSV(
              materialsData.map((m) => ({
                ...m,
                margin_php:
                  m.sell_price_php_per_kg - m.buy_price_php_per_kg,
                margin_pct: (
                  ((m.sell_price_php_per_kg - m.buy_price_php_per_kg) /
                    m.buy_price_php_per_kg) *
                  100
                ).toFixed(1),
              })),
              "ecowaste-material-prices"
            )
          }
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--accent)",
            background: "transparent",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--r-sm)",
            padding: "7px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "border-color 0.15s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--border-default)")
          }
        >
          <Download size={13} style={{ color: "var(--accent)" }} />
          EXPORT CSV
        </button>
      </div>

      {/* StatStrip */}
      <div className="animate-section" style={{ marginBottom: 32 }}>
        <StatStrip
          cells={[
            {
              value: materialsData.length,
              label: "Materials Tracked",
              accent: "live",
            },
            {
              value: highestMargin.short_name,
              label: "Highest Margin",
              delta: `PHP ${highestMargin.sell_price_php_per_kg - highestMargin.buy_price_php_per_kg}/kg`,
              deltaColor: "up",
              accent: "live",
            },
            {
              value: `${avgMarginPct.toFixed(1)}%`,
              label: "Avg Margin %",
              deltaColor: "muted",
            },
          ]}
        />
      </div>

      {/* Price Data Table */}
      <div className="animate-section" style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-default)",
            paddingBottom: 10,
            marginBottom: 0,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 400,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Price Directory
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.06em",
            }}
          >
            PHP PER KG
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Material", "Category", "Buy", "Sell", "Margin", "Margin %", "Trend"].map(
                  (col) => (
                    <th
                      key={col}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        fontWeight: 500,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        textAlign: col === "Material" || col === "Category" ? "left" : "right",
                        padding: "10px 12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {materialsData.map((m) => {
                const margin = m.sell_price_php_per_kg - m.buy_price_php_per_kg;
                const marginPct = (
                  (margin / m.buy_price_php_per_kg) *
                  100
                ).toFixed(1);
                const TrendIcon = trendIcon(m.trend_direction);

                return (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--bg-elevated)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Material name */}
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--text-muted)",
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--r-sm)",
                            padding: "2px 6px",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {m.short_name}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--text-primary)",
                          }}
                        >
                          {m.name}
                        </span>
                      </div>
                    </td>
                    {/* Category */}
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-secondary)",
                        padding: "12px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {m.category}
                    </td>
                    {/* Buy */}
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        color: "#f87171",
                        padding: "12px",
                        textAlign: "right",
                        fontWeight: 500,
                      }}
                    >
                      {m.buy_price_php_per_kg.toFixed(2)}
                    </td>
                    {/* Sell */}
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        color: "#4ade80",
                        padding: "12px",
                        textAlign: "right",
                        fontWeight: 500,
                      }}
                    >
                      {m.sell_price_php_per_kg.toFixed(2)}
                    </td>
                    {/* Margin */}
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        color: "var(--text-primary)",
                        padding: "12px",
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {margin.toFixed(2)}
                    </td>
                    {/* Margin % */}
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--accent)",
                        padding: "12px",
                        textAlign: "right",
                      }}
                    >
                      {marginPct}%
                    </td>
                    {/* Trend */}
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color:
                            m.trend_direction === "up"
                              ? "#4ade80"
                              : m.trend_direction === "down"
                                ? "#f87171"
                                : "var(--text-muted)",
                        }}
                      >
                        <span
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background:
                              m.trend_direction === "up"
                                ? "#4ade80"
                                : m.trend_direction === "down"
                                  ? "#f87171"
                                  : "var(--text-muted)",
                            display: "inline-block",
                          }}
                        />
                        {m.trend_label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div
        className="animate-section"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--r-sm)",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-default)",
            paddingBottom: 10,
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 400,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Buy vs Sell Comparison
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.06em",
            }}
          >
            COPPER EXCLUDED
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            color: "var(--text-muted)",
            marginBottom: 16,
            marginTop: 0,
          }}
        >
          Copper excluded from chart for scale (Buy: PHP 300, Sell: PHP 350)
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartDataFiltered}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fill: "var(--text-secondary)",
              }}
              axisLine={{ stroke: "var(--border-default)" }}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fill: "var(--text-secondary)",
              }}
              axisLine={{ stroke: "var(--border-default)" }}
              tickLine={false}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => `PHP ${value}/kg`}
              contentStyle={{
                borderRadius: 2,
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
              cursor={{ fill: "rgba(74, 222, 128, 0.04)" }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--text-secondary)",
              }}
            />
            <Bar dataKey="Buy" fill="#f87171" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Sell" fill="#4ade80" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-muted)",
          marginTop: 20,
          letterSpacing: "0.04em",
        }}
      >
        Source: Field Survey / EcoWaste Junkshop Network. Last updated:{" "}
        {materialsData[0].last_updated}.
      </p>
    </div>
  );
}
