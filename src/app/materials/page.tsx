"use client";

import { materialsData, PLASTIC_CREDITS } from "@/data/materials";
import { exportToCSV } from "@/lib/utils";
import StatStrip from "@/components/StatCard";
import { Download } from "lucide-react";
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
  // ── Derived data ──

  const highestMargin = materialsData.reduce((best, m) => {
    return m.middleman_margin_pct > best.middleman_margin_pct ? m : best;
  }, materialsData[0]);

  // Chart data — exclude Copper (scale) and E-waste
  const chartData = materialsData
    .filter((m) => m.short_name !== "CU" && m.short_name !== "EW")
    .map((m) => ({
      name: m.short_name,
      Buy: m.buy_price_php_per_kg,
      Sell: m.sell_price_php_per_kg,
    }));

  // Plastic credit uplift helper
  const creditUplift = (sell: number, credit: number) => {
    const total = sell + credit;
    const pct = ((credit / sell) * 100).toFixed(1);
    return { total, pct };
  };

  const petClean = materialsData.find((m) => m.short_name === "PET-C")!;
  const hdpe = materialsData.find((m) => m.short_name === "HDPE")!;

  const petUplift = creditUplift(
    petClean.sell_price_php_per_kg,
    PLASTIC_CREDITS.pcx_floor_php_per_kg
  );
  const hdpeUplift = creditUplift(
    hdpe.sell_price_php_per_kg,
    PLASTIC_CREDITS.pcx_floor_php_per_kg
  );

  // ── Trend helpers ──

  const trendColor = (dir: string) =>
    dir === "up"
      ? "var(--accent)"
      : dir === "down"
        ? "var(--data-red)"
        : "var(--text-muted)";

  // ── Shared styles ──

  const headerMono: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    fontWeight: 500,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      {/* ─── 1. Editorial Header ─── */}
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
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Price Index
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-secondary)",
              margin: "4px 0 0 0",
            }}
          >
            Scrap material buy/sell prices across Metro Manila junkshop networks
          </p>
        </div>
        <button
          onClick={() =>
            exportToCSV(
              materialsData.map((m) => ({
                ...m,
                margin_php:
                  m.sell_price_php_per_kg - m.buy_price_php_per_kg,
                margin_pct: m.middleman_margin_pct.toFixed(1),
              })),
              "ecowaste-price-index"
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

      {/* ─── 2. Stat Strip ─── */}
      <div className="animate-section" style={{ marginBottom: 32 }}>
        <StatStrip
          cells={[
            {
              value: materialsData.length,
              label: "Materials Tracked",
              accent: "live",
            },
            {
              value: highestMargin.name,
              label: "Highest Margin",
              delta: `${highestMargin.middleman_margin_pct}%`,
              deltaColor: "up",
              accent: "live",
            },
            {
              value: "~1,268",
              label: "Est. Junkshops in NCR",
            },
            {
              value: `₱${PLASTIC_CREDITS.pcx_floor_php_per_kg}/kg`,
              label: "PCX Floor",
              delta: `$${PLASTIC_CREDITS.pcx_floor_usd_per_ton}/ton`,
              deltaColor: "muted",
            },
          ]}
        />
      </div>

      {/* ─── 3. Main Price Table ─── */}
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
              fontWeight: 700,
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
                {[
                  { label: "Material", align: "left" as const },
                  { label: "Category", align: "left" as const },
                  { label: "Buy", align: "right" as const },
                  { label: "Sell", align: "right" as const },
                  { label: "Margin %", align: "right" as const },
                  { label: "LME Bench", align: "right" as const },
                  { label: "Price Gap", align: "right" as const },
                  { label: "Trend", align: "right" as const },
                ].map((col) => (
                  <th
                    key={col.label}
                    style={{
                      ...headerMono,
                      textAlign: col.align,
                      padding: "10px 12px",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {materialsData.map((m) => (
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
                  {/* Material name + badge + notes */}
                  <td style={{ padding: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
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
                          whiteSpace: "nowrap",
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
                    {m.notes && (
                      <div
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 10,
                          color: "var(--text-muted)",
                          marginTop: 3,
                          lineHeight: 1.3,
                          maxWidth: 280,
                        }}
                      >
                        {m.notes}
                      </div>
                    )}
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

                  {/* Buy — data-red */}
                  <td
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--data-red)",
                      padding: "12px",
                      textAlign: "right",
                      fontWeight: 500,
                    }}
                  >
                    {m.buy_price_php_per_kg.toFixed(2)}
                  </td>

                  {/* Sell — accent */}
                  <td
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--accent)",
                      padding: "12px",
                      textAlign: "right",
                      fontWeight: 500,
                    }}
                  >
                    {m.sell_price_php_per_kg.toFixed(2)}
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
                    {m.middleman_margin_pct.toFixed(1)}%
                  </td>

                  {/* LME Benchmark — data-blue */}
                  <td
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color:
                        m.lme_benchmark_php != null
                          ? "var(--data-blue)"
                          : "var(--text-muted)",
                      padding: "12px",
                      textAlign: "right",
                    }}
                  >
                    {m.lme_benchmark_php != null
                      ? `₱${m.lme_benchmark_php.toFixed(2)}`
                      : "\u2014"}
                  </td>

                  {/* Price Gap — data-amber */}
                  <td
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color:
                        m.price_gap_php != null
                          ? "var(--data-amber)"
                          : "var(--text-muted)",
                      padding: "12px",
                      textAlign: "right",
                    }}
                  >
                    {m.price_gap_php != null
                      ? `₱${m.price_gap_php.toFixed(2)}`
                      : "\u2014"}
                  </td>

                  {/* Trend — dot badge */}
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
                        color: trendColor(m.trend_direction),
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: trendColor(m.trend_direction),
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      {m.trend_label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 4. Plastic Credit Opportunity ─── */}
      <div className="animate-section" style={{ marginBottom: 40 }}>
        <div
          style={{
            borderBottom: "1px solid var(--border-default)",
            paddingBottom: 10,
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Plastic Credit Opportunity
          </h2>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-secondary)",
              margin: "4px 0 0 0",
            }}
          >
            Revenue stacking: raw material sale + plastic credit per kilogram
          </p>
        </div>

        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--r-sm)",
            padding: 24,
          }}
        >
          {/* Pricing tiers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginBottom: 24,
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  ...headerMono,
                  marginBottom: 6,
                }}
              >
                PCX Floor
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                ${PLASTIC_CREDITS.pcx_floor_usd_per_ton}/ton
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--accent)",
                  marginTop: 2,
                }}
              >
                = ₱{PLASTIC_CREDITS.pcx_floor_php_per_kg}/kg
              </div>
            </div>

            <div>
              <div
                style={{
                  ...headerMono,
                  marginBottom: 6,
                }}
              >
                PCX Premium
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                ${PLASTIC_CREDITS.pcx_premium_usd_per_ton}/ton
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--accent)",
                  marginTop: 2,
                }}
              >
                = ₱{PLASTIC_CREDITS.pcx_premium_php_per_kg}/kg
              </div>
            </div>

            <div>
              <div
                style={{
                  ...headerMono,
                  marginBottom: 6,
                }}
              >
                Verra Registration
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                ${PLASTIC_CREDITS.verra_registration_cost_usd.toLocaleString()}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--data-amber)",
                  marginTop: 2,
                }}
              >
                Break-even at ~{PLASTIC_CREDITS.verra_breakeven_tons} tons
              </div>
            </div>
          </div>

          {/* Material uplift calculations */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 20,
            }}
          >
            {/* PET Clean */}
            <div
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--r-sm)",
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
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
                  PET-C
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  PET Clean
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                }}
              >
                Raw sale{" "}
                <span style={{ color: "var(--accent)" }}>
                  ₱{petClean.sell_price_php_per_kg}/kg
                </span>{" "}
                + credit{" "}
                <span style={{ color: "var(--data-blue)" }}>
                  ₱{PLASTIC_CREDITS.pcx_floor_php_per_kg}/kg
                </span>{" "}
                ={" "}
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  ₱{petUplift.total.toFixed(2)}/kg total
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--accent)",
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                +{petUplift.pct}% uplift
              </div>
            </div>

            {/* HDPE */}
            <div
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--r-sm)",
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
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
                  HDPE
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  HDPE Rigid
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                }}
              >
                Raw sale{" "}
                <span style={{ color: "var(--accent)" }}>
                  ₱{hdpe.sell_price_php_per_kg}/kg
                </span>{" "}
                + credit{" "}
                <span style={{ color: "var(--data-blue)" }}>
                  ₱{PLASTIC_CREDITS.pcx_floor_php_per_kg}/kg
                </span>{" "}
                ={" "}
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  ₱{hdpeUplift.total.toFixed(2)}/kg total
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--accent)",
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                +{hdpeUplift.pct}% uplift
              </div>
            </div>
          </div>

          {/* Caveat note */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: 12,
            }}
          >
            Mechanical recycling only — no co-processing credits for multilayer
          </div>
        </div>
      </div>

      {/* ─── 5. Buy vs Sell Chart ─── */}
      <div
        className="animate-section"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--r-sm)",
          padding: 24,
          marginBottom: 24,
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
              fontWeight: 700,
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
            CU + EW EXCLUDED
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
          Copper and E-waste excluded from chart for scale reasons
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
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
              formatter={(value: any) => `₱${value}/kg`}
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
            <Bar dataKey="Buy" fill="var(--data-red)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Sell" fill="var(--accent)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Footer source line ─── */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-muted)",
          marginTop: 0,
          letterSpacing: "0.04em",
        }}
      >
        Source: Field Survey / EcoWaste Junkshop Network. Last updated:{" "}
        {materialsData[0].last_updated}.
      </p>
    </div>
  );
}
