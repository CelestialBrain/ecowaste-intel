"use client";

import { valueChainSteps, materialFlows } from "@/data/value-chain";
import StatStrip from "@/components/StatCard";

/* ── Price color gradient helper ── */
const priceColor = (value: number, max: number): string => {
  if (value === 0) return "var(--text-muted)";
  const ratio = value / max;
  if (ratio > 0.7) return "var(--accent)";
  if (ratio > 0.4) return "var(--data-amber)";
  if (ratio > 0.15) return "var(--text-secondary)";
  return "var(--text-muted)";
};

export default function ValueChainPage() {
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
            Waste Value Chain
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            Price flow from household to global commodity market
          </p>
        </div>
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
      </div>

      {/* ── Stat Strip ── */}
      <div className="animate-section" style={{ marginBottom: 28 }}>
        <StatStrip
          cells={[
            {
              value: valueChainSteps.length,
              label: "Chain Steps",
              accent: "live",
            },
            {
              value: "\u20B1121.58/kg",
              label: "Aluminum Gap",
              accent: "warn",
              delta: "LME vs local sell",
              deltaColor: "warn",
            },
            {
              value: "~1,268",
              label: "Junkshops",
              delta: "336 mapped",
              deltaColor: "muted",
            },
            {
              value: "\u20B15.94/kg",
              label: "PCX Credit Floor",
              accent: "live",
              delta: "Plastic credit overlay",
              deltaColor: "up",
            },
          ]}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 1: Value Chain Steps — vertical flow visualization
         ════════════════════════════════════════════════════════════════ */}
      <div className="animate-section" style={{ marginBottom: 36 }}>
        {/* Section editorial header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-default)",
            marginBottom: 20,
            paddingBottom: 10,
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
            Value Chain Steps
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
            6 steps &middot; household to LME
          </span>
        </div>

        {/* Vertical flow */}
        <div style={{ position: "relative" }}>
          {valueChainSteps.map((step, i) => (
            <div
              key={step.id}
              style={{
                display: "flex",
                gap: 0,
                position: "relative",
              }}
            >
              {/* Left column: step number + connector line */}
              <div
                style={{
                  width: 48,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Color dot */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: step.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "var(--text-inverse)",
                    flexShrink: 0,
                    zIndex: 1,
                    marginTop: 14,
                  }}
                >
                  {i + 1}
                </div>
                {/* Vertical connector line */}
                {i < valueChainSteps.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      background: "var(--border-default)",
                      minHeight: 20,
                    }}
                  />
                )}
              </div>

              {/* Main content row */}
              <div
                style={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  padding: "12px 0",
                  borderBottom:
                    i < valueChainSteps.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                  minHeight: 72,
                }}
              >
                {/* Left: stage info */}
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    {step.stage}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      marginBottom: 6,
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{step.actor}</span>
                    <br />
                    {step.description}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {step.price_range_php_per_kg ? (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--accent)",
                          fontWeight: 500,
                        }}
                      >
                        {"\u20B1"}
                        {step.price_range_php_per_kg[0]}&ndash;
                        {"\u20B1"}
                        {step.price_range_php_per_kg[1]}/kg
                      </span>
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        No direct price
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-muted)",
                      }}
                    >
                      Margin: {step.margin_captured}
                    </span>
                  </div>
                </div>

                {/* Right: EcoWaste Role block */}
                <div
                  style={{
                    background: "var(--bg-elevated)",
                    borderLeft: "2px solid var(--accent)",
                    padding: "10px 14px",
                    borderRadius: "0 var(--r-md) var(--r-md) 0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--accent)",
                      marginBottom: 4,
                      fontWeight: 600,
                    }}
                  >
                    EcoWaste Role
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                    }}
                  >
                    {step.ecowaste_role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2: Material Price Flow Table
         ════════════════════════════════════════════════════════════════ */}
      <div className="animate-section">
        {/* Section editorial header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-default)",
            marginBottom: 20,
            paddingBottom: 10,
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
            Material Flow Analysis
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
            {materialFlows.length} materials tracked
          </span>
        </div>

        <div
          style={{
            border: "1px solid var(--border-default)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-default)",
                  background: "var(--bg-surface)",
                }}
              >
                {[
                  "Material",
                  "Eco-Aide (\u20B1)",
                  "Junkshop (\u20B1)",
                  "Consolidator (\u20B1)",
                  "Factory (\u20B1)",
                  "LME (\u20B1)",
                  "Total Margin",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                      textAlign: "left",
                      padding: "10px 14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {materialFlows.map((mat) => {
                const max = mat.lme ?? mat.factory;
                return (
                  <tr key={mat.short_name} style={{ verticalAlign: "top" }}>
                    {/* Material row wrapper for hover */}
                    <td
                      colSpan={7}
                      style={{ padding: 0, border: "none" }}
                    >
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                          {/* Main data row */}
                          <tr
                            style={{
                              borderBottom: "none",
                              transition: "background 0.15s",
                              cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "var(--bg-elevated)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            {/* Material name */}
                            <td
                              style={{
                                fontFamily: "var(--font-ui)",
                                fontSize: 13,
                                fontWeight: 500,
                                color: "var(--text-primary)",
                                padding: "12px 14px 4px 14px",
                                width: "16%",
                              }}
                            >
                              {mat.material}
                              <span
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: 9,
                                  color: "var(--text-muted)",
                                  marginLeft: 6,
                                }}
                              >
                                {mat.short_name}
                              </span>
                            </td>

                            {/* Eco-Aide */}
                            <td
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                color: priceColor(mat.eco_aide, max),
                                padding: "12px 14px 4px 14px",
                                width: "12%",
                              }}
                            >
                              {mat.eco_aide > 0
                                ? `${mat.eco_aide.toFixed(1)}`
                                : "\u2014"}
                            </td>

                            {/* Junkshop */}
                            <td
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                color: priceColor(mat.junkshop, max),
                                padding: "12px 14px 4px 14px",
                                width: "12%",
                              }}
                            >
                              {mat.junkshop.toFixed(1)}
                            </td>

                            {/* Consolidator */}
                            <td
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                color: priceColor(mat.consolidator, max),
                                padding: "12px 14px 4px 14px",
                                width: "14%",
                              }}
                            >
                              {mat.consolidator.toFixed(1)}
                            </td>

                            {/* Factory */}
                            <td
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                color: priceColor(mat.factory, max),
                                padding: "12px 14px 4px 14px",
                                width: "12%",
                              }}
                            >
                              {mat.factory.toFixed(1)}
                            </td>

                            {/* LME */}
                            <td
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                color: mat.lme
                                  ? "var(--data-blue)"
                                  : "var(--text-muted)",
                                padding: "12px 14px 4px 14px",
                                width: "12%",
                                fontWeight: mat.lme ? 600 : 400,
                              }}
                            >
                              {mat.lme !== null
                                ? mat.lme.toFixed(2)
                                : "\u2014"}
                            </td>

                            {/* Total Margin */}
                            <td
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                fontWeight: 600,
                                color: "var(--accent)",
                                padding: "12px 14px 4px 14px",
                                width: "14%",
                              }}
                            >
                              {"\u20B1"}
                              {mat.total_value_chain_margin.toFixed(2)}
                            </td>
                          </tr>

                          {/* EcoWaste Opportunity note */}
                          <tr>
                            <td
                              colSpan={7}
                              style={{
                                padding: "2px 14px 12px 14px",
                                borderBottom:
                                  "1px solid var(--border-subtle)",
                              }}
                            >
                              <div
                                style={{
                                  fontFamily: "var(--font-ui)",
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  fontStyle: "italic",
                                  lineHeight: 1.3,
                                }}
                              >
                                EcoWaste Opportunity: {mat.ecowaste_opportunity}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Source line ── */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-muted)",
          marginTop: 16,
        }}
      >
        Data sources: Junkshop surveys, LME spot prices (PHP converted at
        BSP rate), PCX plastic credit registry, DENR-EMB. Last updated:
        March 2026.
      </p>
    </div>
  );
}
