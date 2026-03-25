"use client";

import { benchmarksData, ECOWASTE_POSITION } from "@/data/benchmarks";
import StatStrip from "@/components/StatCard";

export default function BenchmarksPage() {
  // ── Type badge color helper ──
  const typeBadge = (type: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      Competitor: {
        bg: "var(--bg-elevated)",
        text: "var(--data-red)",
        border: "var(--data-red)",
      },
      Peer: {
        bg: "var(--bg-elevated)",
        text: "var(--data-amber)",
        border: "var(--data-amber)",
      },
      Model: {
        bg: "var(--bg-elevated)",
        text: "var(--data-blue)",
        border: "var(--data-blue)",
      },
    };
    return colors[type] || colors.Model;
  };

  // ── Section header style ──
  const sectionHeader: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: 0,
  };

  const monoLabel: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    fontWeight: 500,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  };

  return (
    <div>
      {/* ─── 1. Editorial Header ─── */}
      <div
        className="animate-section"
        style={{
          borderBottom: "1px solid var(--border-default)",
          paddingBottom: 12,
          marginBottom: 24,
        }}
      >
        <h1 style={sectionHeader}>Competitor Benchmarks</h1>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            color: "var(--text-secondary)",
            margin: "4px 0 0 0",
          }}
        >
          How comparable organizations sustain themselves
        </p>
      </div>

      {/* ─── 2. Stat Strip ─── */}
      <div className="animate-section" style={{ marginBottom: 32 }}>
        <StatStrip
          cells={[
            {
              value: `${benchmarksData.length} Orgs`,
              label: "Organizations Profiled",
              accent: "live",
            },
            {
              value: "572",
              label: "Linis Ganda Shops",
              delta: "vs EcoWaste 336",
              deltaColor: "warn",
            },
            {
              value: "30,251",
              label: "Plastic Bank Collectors",
              delta: "~3,000 in PH",
              deltaColor: "muted",
            },
            {
              value: "₱125M",
              label: "PBSP Training Revenue",
              delta: "25% of their total budget",
              deltaColor: "up",
              accent: "live",
            },
          ]}
        />
      </div>

      {/* ─── 3. EcoWaste Position Card ─── */}
      <div className="animate-section" style={{ marginBottom: 40 }}>
        <div
          style={{
            borderBottom: "1px solid var(--border-default)",
            paddingBottom: 10,
            marginBottom: 16,
          }}
        >
          <h2 style={sectionHeader}>EcoWaste Position</h2>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-secondary)",
              margin: "4px 0 0 0",
            }}
          >
            Current standing versus peer organizations
          </p>
        </div>

        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--r-lg)",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            overflow: "hidden",
          }}
        >
          {/* Left: Key Stats */}
          <div style={{ padding: 24 }}>
            <div style={{ ...monoLabel, marginBottom: 16 }}>Key Statistics</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginBottom: 4,
                  }}
                >
                  Junkshops Mapped
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {ECOWASTE_POSITION.junkshops_mapped}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  of ~{ECOWASTE_POSITION.estimated_total.toLocaleString()} total
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginBottom: 4,
                  }}
                >
                  Member Orgs
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {ECOWASTE_POSITION.member_orgs}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginBottom: 4,
                  }}
                >
                  Annual Budget
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {ECOWASTE_POSITION.annual_budget}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginBottom: 4,
                  }}
                >
                  Funding Mix
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  {ECOWASTE_POSITION.funding_mix}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Advantage + Gap */}
          <div
            style={{
              borderLeft: "1px solid var(--border-default)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Key Advantage */}
            <div
              style={{
                padding: 24,
                flex: 1,
                borderBottom: "1px solid var(--border-default)",
              }}
            >
              <div style={{ ...monoLabel, marginBottom: 10 }}>
                Key Advantage
              </div>
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                {ECOWASTE_POSITION.key_advantage}
              </div>
            </div>

            {/* Key Gap — red tinted */}
            <div
              style={{
                padding: 24,
                flex: 1,
                background:
                  "color-mix(in srgb, var(--data-red) 6%, var(--bg-surface))",
                borderLeft: "3px solid var(--data-red)",
                marginLeft: -1,
              }}
            >
              <div
                style={{
                  ...monoLabel,
                  marginBottom: 10,
                  color: "var(--data-red)",
                }}
              >
                Key Gap
              </div>
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                {ECOWASTE_POSITION.key_gap}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. Benchmark Comparison Table ─── */}
      <div className="animate-section" style={{ marginBottom: 40 }}>
        <div
          style={{
            borderBottom: "1px solid var(--border-default)",
            paddingBottom: 10,
            marginBottom: 16,
          }}
        >
          <h2 style={sectionHeader}>Benchmark Comparison</h2>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-secondary)",
              margin: "4px 0 0 0",
            }}
          >
            Detailed profiles of {benchmarksData.length} comparable organizations
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {benchmarksData.map((bm, i) => {
            const badge = typeBadge(bm.type);
            return (
              <div
                key={bm.id}
                style={{
                  border: "1px solid var(--border-default)",
                  borderBottom:
                    i < benchmarksData.length - 1
                      ? "none"
                      : "1px solid var(--border-default)",
                  borderRadius:
                    i === 0
                      ? "var(--r-lg) var(--r-lg) 0 0"
                      : i === benchmarksData.length - 1
                        ? "0 0 var(--r-lg) var(--r-lg)"
                        : "0",
                  padding: 24,
                  background: "var(--bg-surface)",
                }}
              >
                {/* Row Header: Org name + country + type badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {bm.org_name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--text-muted)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {bm.country}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      fontWeight: 600,
                      color: badge.text,
                      background: badge.bg,
                      border: `1px solid ${badge.border}`,
                      borderRadius: "var(--r-sm)",
                      padding: "2px 8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {bm.type}
                  </span>
                </div>

                {/* Key Metric highlight */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: 20,
                    marginBottom: 16,
                  }}
                >
                  {/* Key metric */}
                  <div>
                    <div style={{ ...monoLabel, marginBottom: 6 }}>
                      {bm.key_metric}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 20,
                        fontWeight: 600,
                        color: "var(--accent)",
                        lineHeight: 1.2,
                      }}
                    >
                      {bm.key_metric_value}
                    </div>
                  </div>

                  {/* Annual budget */}
                  <div>
                    <div style={{ ...monoLabel, marginBottom: 6 }}>
                      Annual Budget
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        lineHeight: 1.2,
                      }}
                    >
                      {bm.annual_budget}
                    </div>
                  </div>

                  {/* Funding mix */}
                  <div>
                    <div style={{ ...monoLabel, marginBottom: 6 }}>
                      Funding Mix
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {bm.funding_mix}
                    </div>
                  </div>

                  {/* Earned income model */}
                  <div>
                    <div style={{ ...monoLabel, marginBottom: 6 }}>
                      Earned Income Model
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {bm.earned_income_model}
                    </div>
                  </div>
                </div>

                {/* Lesson for EcoWaste */}
                <div
                  style={{
                    background: "var(--bg-elevated)",
                    borderLeft: "3px solid var(--accent)",
                    borderRadius: "0 var(--r-sm) var(--r-sm) 0",
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      ...monoLabel,
                      marginBottom: 6,
                      color: "var(--accent)",
                    }}
                  >
                    Lesson for EcoWaste
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {bm.lesson_for_ecowaste}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
        Source: Organizational reports, Gemini Deep Research, field interviews.
        Compiled Q1 2026.
      </p>
    </div>
  );
}
