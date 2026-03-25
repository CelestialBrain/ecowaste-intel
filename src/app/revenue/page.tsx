"use client";

import React, { useState, useMemo } from "react";
import {
  revenueStreams,
  SCENARIO_TOTALS,
  CURRENT_ESTIMATED_BUDGET,
} from "@/data/revenue-model";
import type { RevenueStream } from "@/data/revenue-model";
import { exportToCSV } from "@/lib/utils";
import StatStrip from "@/components/StatCard";
import { Download } from "lucide-react";

/* ── types ── */
type Scenario = "conservative" | "moderate" | "aggressive";

/* ── helpers ── */
const fmt = (n: number) => `₱${n.toLocaleString()}`;

const scenarioKey = (s: Scenario): keyof RevenueStream =>
  `${s}_annual` as keyof RevenueStream;

const categoryColors: Record<string, { bg: string; border: string; color: string }> = {
  Consulting: {
    bg: "rgba(74,222,128,0.08)",
    border: "var(--accent)",
    color: "var(--accent)",
  },
  Training: {
    bg: "rgba(96,165,250,0.08)",
    border: "var(--data-blue)",
    color: "var(--data-blue)",
  },
  Credits: {
    bg: "rgba(168,85,247,0.08)",
    border: "var(--data-purple)",
    color: "var(--data-purple)",
  },
  Aggregation: {
    bg: "rgba(251,191,36,0.08)",
    border: "var(--data-amber)",
    color: "var(--data-amber)",
  },
  Grants: {
    bg: "rgba(61,92,61,0.12)",
    border: "var(--text-muted)",
    color: "var(--text-muted)",
  },
  Membership: {
    bg: "rgba(96,165,250,0.08)",
    border: "var(--data-blue)",
    color: "var(--data-blue)",
  },
};

const timelineStyle = (t: string) => {
  if (t.startsWith("0-6"))
    return {
      bg: "rgba(74,222,128,0.08)",
      border: "var(--accent)",
      color: "var(--accent)",
    };
  if (t.startsWith("6-18"))
    return {
      bg: "rgba(251,191,36,0.08)",
      border: "var(--data-amber)",
      color: "var(--data-amber)",
    };
  return {
    bg: "rgba(61,92,61,0.12)",
    border: "var(--text-muted)",
    color: "var(--text-muted)",
  };
};

const feasibilityStyle = (f: string) => {
  if (f === "High")
    return {
      bg: "rgba(74,222,128,0.08)",
      border: "var(--accent)",
      color: "var(--accent)",
    };
  if (f === "Medium")
    return {
      bg: "rgba(251,191,36,0.08)",
      border: "var(--data-amber)",
      color: "var(--data-amber)",
    };
  return {
    bg: "rgba(248,113,113,0.08)",
    border: "var(--data-red)",
    color: "var(--data-red)",
  };
};

/* ── page ── */
export default function RevenuePage() {
  const [scenario, setScenario] = useState<Scenario>("moderate");

  /* sorted streams for selected scenario */
  const sorted = useMemo(() => {
    const key = scenarioKey(scenario);
    return [...revenueStreams].sort(
      (a, b) => (b[key] as number) - (a[key] as number)
    );
  }, [scenario]);

  /* category summary */
  const categorySummary = useMemo(() => {
    const key = scenarioKey(scenario);
    const map: Record<string, number> = {};
    revenueStreams.forEach((r) => {
      map[r.category] = (map[r.category] || 0) + (r[key] as number);
    });
    return Object.entries(map)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [scenario]);

  const maxCategoryTotal = categorySummary[0]?.total || 1;

  /* export helper */
  const handleExport = () => {
    const rows = sorted.map((r) => ({
      name: r.name,
      category: r.category,
      timeline: r.timeline,
      feasibility: r.feasibility,
      conservative: r.conservative_annual,
      moderate: r.moderate_annual,
      aggressive: r.aggressive_annual,
      assumptions: r.assumptions,
    }));
    exportToCSV(rows, "ecowaste-revenue-projections");
  };

  const scenarios: { key: Scenario; label: string }[] = [
    { key: "conservative", label: "Conservative" },
    { key: "moderate", label: "Moderate" },
    { key: "aggressive", label: "Aggressive" },
  ];

  return (
    <div>
      {/* ── Editorial Header ── */}
      <div
        className="animate-section"
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-default)",
          marginBottom: 20,
          paddingBottom: 14,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            Revenue Projections
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            Earned income scenarios for EcoWaste Coalition sustainability
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            MAR 2026
          </span>
          <button
            onClick={handleExport}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "7px 14px",
              borderRadius: "var(--r-sm)",
              background: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-default)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Stat Strip ── */}
      <div className="animate-section" style={{ marginBottom: 20 }}>
        <StatStrip
          cells={[
            {
              value: fmt(SCENARIO_TOTALS.conservative),
              label: "Conservative",
              accent: "warn",
            },
            {
              value: fmt(SCENARIO_TOTALS.moderate),
              label: "Moderate",
              accent: "live",
            },
            {
              value: fmt(SCENARIO_TOTALS.aggressive),
              label: "Aggressive",
              accent: "live",
            },
            {
              value: fmt(CURRENT_ESTIMATED_BUDGET),
              label: "Current Budget",
            },
          ]}
        />
      </div>

      {/* ── Scenario Toggle ── */}
      <div
        className="animate-section"
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 20,
        }}
      >
        {scenarios.map((s, i) => {
          const isActive = scenario === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setScenario(s.key)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "8px 20px",
                cursor: "pointer",
                border: isActive
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border-default)",
                borderRight:
                  i < scenarios.length - 1 && !isActive
                    ? "none"
                    : isActive
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border-default)",
                borderRadius:
                  i === 0
                    ? "var(--r-md) 0 0 var(--r-md)"
                    : i === scenarios.length - 1
                    ? "0 var(--r-md) var(--r-md) 0"
                    : "0",
                background: isActive ? "var(--accent)" : "transparent",
                color: isActive
                  ? "var(--text-inverse)"
                  : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s ease",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* ── Revenue Streams Table ── */}
      <div
        className="animate-section"
        style={{
          border: "1px solid var(--border-default)",
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "var(--bg-elevated)",
                  borderBottom: "1px solid var(--border-default)",
                }}
              >
                {["Stream", "Category", "Timeline", "Feasibility", "Revenue"].map(
                  (h, i) => (
                    <th
                      key={i}
                      style={{
                        textAlign: i === 4 ? "right" : "left",
                        padding: "10px 16px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        fontWeight: 500,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const rev = r[scenarioKey(scenario)] as number;
                const catStyle = categoryColors[r.category] || categoryColors.Grants;
                const tlStyle = timelineStyle(r.timeline);
                const fsStyle = feasibilityStyle(r.feasibility);

                return (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: "1px solid var(--border-default)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-elevated)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Stream Name + Assumptions */}
                    <td style={{ padding: "12px 16px", maxWidth: 320 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          lineHeight: 1.3,
                        }}
                      >
                        {r.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 11,
                          color: "var(--text-muted)",
                          marginTop: 4,
                          lineHeight: 1.4,
                        }}
                      >
                        {r.assumptions}
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          padding: "2px 8px",
                          borderRadius: "var(--r-sm)",
                          background: catStyle.bg,
                          border: `1px solid ${catStyle.border}`,
                          color: catStyle.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.category}
                      </span>
                    </td>

                    {/* Timeline Badge */}
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          padding: "2px 8px",
                          borderRadius: "var(--r-sm)",
                          background: tlStyle.bg,
                          border: `1px solid ${tlStyle.border}`,
                          color: tlStyle.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.timeline}
                      </span>
                    </td>

                    {/* Feasibility Badge */}
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          padding: "2px 8px",
                          borderRadius: "var(--r-sm)",
                          background: fsStyle.bg,
                          border: `1px solid ${fsStyle.border}`,
                          color: fsStyle.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.feasibility}
                      </span>
                    </td>

                    {/* Revenue */}
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "var(--accent)",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmt(rev)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Revenue by Category ── */}
      <div className="animate-section" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-default)",
            marginBottom: 20,
            paddingBottom: 14,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            Revenue by Category
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {scenario}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {categorySummary.map((cat) => (
            <div
              key={cat.category}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 100px",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {cat.category}
              </span>
              <div
                style={{
                  height: 6,
                  background: "var(--border-subtle)",
                  borderRadius: "var(--r-sm)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(cat.total / maxCategoryTotal) * 100}%`,
                    background: "var(--accent)",
                    borderRadius: "var(--r-sm)",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--accent)",
                  textAlign: "right",
                  fontWeight: 500,
                }}
              >
                {fmt(cat.total)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Growth Trajectory ── */}
      <div className="animate-section" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-default)",
            marginBottom: 20,
            paddingBottom: 14,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            Growth Trajectory
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            vs ₱20M baseline
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {(
            [
              {
                key: "conservative" as const,
                label: "Conservative",
                color: "var(--data-amber)",
                total: SCENARIO_TOTALS.conservative,
              },
              {
                key: "moderate" as const,
                label: "Moderate",
                color: "var(--accent)",
                total: SCENARIO_TOTALS.moderate,
              },
              {
                key: "aggressive" as const,
                label: "Aggressive",
                color: "var(--data-blue)",
                total: SCENARIO_TOTALS.aggressive,
              },
            ] as const
          ).map((col) => {
            const pctChange =
              ((col.total - CURRENT_ESTIMATED_BUDGET) / CURRENT_ESTIMATED_BUDGET) *
              100;
            const multiplier = col.total / CURRENT_ESTIMATED_BUDGET;
            return (
              <div
                key={col.key}
                style={{
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--r-lg)",
                  padding: "24px 20px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* top accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: col.color,
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 28,
                    fontWeight: 600,
                    color: col.color,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {fmt(col.total)}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    marginBottom: 12,
                  }}
                >
                  {col.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: col.color,
                    fontWeight: 500,
                  }}
                >
                  {pctChange >= 0 ? "+" : ""}
                  {pctChange.toFixed(0)}%{" "}
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: 400,
                      fontSize: 11,
                    }}
                  >
                    vs current ₱20M
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  {multiplier.toFixed(2)}x multiplier
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-muted)",
          marginTop: 16,
        }}
      >
        Projections based on Gemini Deep Research + BCG analysis. All figures
        annualized.
      </p>
    </div>
  );
}
