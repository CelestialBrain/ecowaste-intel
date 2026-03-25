"use client";

import React, { useState, useMemo } from "react";
import { lguData, SERVICE_OPTIONS, NCR_STATS } from "@/data/lgu";
import { exportToCSV } from "@/lib/utils";
import StatStrip from "@/components/StatCard";
import { Download } from "lucide-react";

/* ── helpers ── */

const complianceColor = (pct: number) =>
  pct > 40 ? "var(--accent)" : pct > 20 ? "var(--data-amber)" : "var(--data-red)";

const swmBadgeStyle = (status: string) => {
  const map: Record<string, { bg: string; border: string; color: string; dot: string }> = {
    Compliant: {
      bg: "rgba(74,222,128,0.08)",
      border: "var(--accent)",
      color: "var(--accent)",
      dot: "var(--accent)",
    },
    Partial: {
      bg: "rgba(251,191,36,0.08)",
      border: "var(--data-amber)",
      color: "var(--data-amber)",
      dot: "var(--data-amber)",
    },
    Expired: {
      bg: "rgba(248,113,113,0.08)",
      border: "var(--data-red)",
      color: "var(--data-red)",
      dot: "var(--data-red)",
    },
    "Non-compliant": {
      bg: "rgba(248,113,113,0.08)",
      border: "var(--data-red)",
      color: "var(--data-red)",
      dot: "var(--data-red)",
    },
  };
  return map[status] ?? map["Partial"];
};

const priorityBadgeStyle = (priority: string) => {
  const map: Record<string, { bg: string; border: string; color: string; dot: string }> = {
    High: {
      bg: "rgba(248,113,113,0.08)",
      border: "var(--data-red)",
      color: "var(--data-red)",
      dot: "var(--data-red)",
    },
    Medium: {
      bg: "rgba(251,191,36,0.08)",
      border: "var(--data-amber)",
      color: "var(--data-amber)",
      dot: "var(--data-amber)",
    },
    Low: {
      bg: "rgba(100,100,100,0.08)",
      border: "var(--text-muted)",
      color: "var(--text-muted)",
      dot: "var(--text-muted)",
    },
  };
  return map[priority] ?? map["Low"];
};

const formatCurrency = (n: number) =>
  "₱" + n.toLocaleString();

export default function LGUPage() {
  const [selectedLGUs, setSelectedLGUs] = useState<Set<string>>(new Set());
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  /* sort by opportunity score descending */
  const sortedData = useMemo(
    () => [...lguData].sort((a, b) => b.opportunity_score - a.opportunity_score),
    []
  );

  const toggleLGU = (id: string) => {
    setSelectedLGUs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllLGUs = () => {
    if (selectedLGUs.size === sortedData.length) {
      setSelectedLGUs(new Set());
    } else {
      setSelectedLGUs(new Set(sortedData.map((l) => l.id)));
    }
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* revenue computation */
  const serviceTotalPerLGU = useMemo(
    () =>
      SERVICE_OPTIONS.filter((s) => selectedServices.has(s.id)).reduce(
        (sum, s) => sum + s.price_per_lgu,
        0
      ),
    [selectedServices]
  );

  const projectedRevenue = selectedLGUs.size * serviceTotalPerLGU;

  /* ── checkbox style helper ── */
  const checkboxStyle: React.CSSProperties = {
    width: 16,
    height: 16,
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border-default)",
    background: "var(--bg-surface)",
    cursor: "pointer",
    accentColor: "var(--accent)",
  };

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
            LGU Compliance
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            RA 9003 compliance gap as a service opportunity
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
            onClick={() => exportToCSV(sortedData, "ecowaste-lgu-compliance")}
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
              value: NCR_STATS.national_mrf_compliance_pct + "%",
              label: "National MRF Compliance",
              accent: "alert",
            },
            {
              value: NCR_STATS.ncr_barangays_with_mrf.toLocaleString() +
                " of " +
                NCR_STATS.ncr_barangays_total.toLocaleString(),
              label: "NCR Barangays with MRFs",
            },
            {
              value: "₱1M–₱3M",
              label: "SWM Plan Rate per LGU",
            },
            {
              value: "₱23.4M",
              label: "Estimated NCR TAM",
              accent: "live",
            },
          ]}
        />
      </div>

      {/* ── NCR LGU Compliance Table ── */}
      <div
        className="animate-section"
        style={{
          border: "1px solid var(--border-default)",
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
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
                {/* Select all checkbox */}
                <th
                  style={{
                    textAlign: "center",
                    padding: "10px 12px",
                    width: 40,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedLGUs.size === sortedData.length && sortedData.length > 0}
                    onChange={toggleAllLGUs}
                    style={checkboxStyle}
                  />
                </th>
                {[
                  "City",
                  "Population",
                  "Barangays",
                  "MRF Compliance",
                  "SWM Plan",
                  "Waste TPD",
                  "Opportunity",
                  "Priority",
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: "left",
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
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((lgu) => {
                const swmBadge = swmBadgeStyle(lgu.swm_plan_status);
                const priBadge = priorityBadgeStyle(lgu.priority);
                const barColor = complianceColor(lgu.mrf_compliance_pct);
                const isSelected = selectedLGUs.has(lgu.id);

                return (
                  <tr
                    key={lgu.id}
                    style={{
                      borderBottom: "1px solid var(--border-default)",
                      transition: "background 0.15s",
                      background: isSelected ? "rgba(74,222,128,0.04)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-elevated)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isSelected
                        ? "rgba(74,222,128,0.04)"
                        : "transparent";
                    }}
                  >
                    {/* Select checkbox */}
                    <td style={{ textAlign: "center", padding: "12px 12px" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleLGU(lgu.id)}
                        style={checkboxStyle}
                      />
                    </td>

                    {/* City */}
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: "var(--font-ui)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lgu.city}
                    </td>

                    {/* Population */}
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {lgu.population.toLocaleString()}
                    </td>

                    {/* Barangays (X of Y) */}
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lgu.barangays_with_mrf} of {lgu.barangays_total}
                    </td>

                    {/* MRF Compliance % (bar + %) */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 64,
                            height: 3,
                            background: "var(--border-default)",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(lgu.mrf_compliance_pct, 100)}%`,
                              height: "100%",
                              background: barColor,
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: barColor,
                            minWidth: 38,
                          }}
                        >
                          {lgu.mrf_compliance_pct}%
                        </span>
                      </div>
                    </td>

                    {/* SWM Plan Status badge */}
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          padding: "2px 8px",
                          borderRadius: "var(--r-sm)",
                          background: swmBadge.bg,
                          border: `1px solid ${swmBadge.border}`,
                          color: swmBadge.color,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: swmBadge.dot,
                          }}
                        />
                        {lgu.swm_plan_status}
                      </span>
                    </td>

                    {/* Waste TPD */}
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {lgu.estimated_waste_tpd.toLocaleString()}
                    </td>

                    {/* Opportunity Score (visual bar) */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 64,
                            height: 3,
                            background: "var(--border-default)",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${lgu.opportunity_score}%`,
                              height: "100%",
                              background: "var(--accent)",
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "var(--text-primary)",
                            minWidth: 22,
                          }}
                        >
                          {lgu.opportunity_score}
                        </span>
                      </div>
                    </td>

                    {/* Priority badge */}
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          padding: "2px 8px",
                          borderRadius: "var(--r-sm)",
                          background: priBadge.bg,
                          border: `1px solid ${priBadge.border}`,
                          color: priBadge.color,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: priBadge.dot,
                          }}
                        />
                        {lgu.priority}
                      </span>
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
          marginBottom: 32,
        }}
      >
        Sources: DENR-EMB, Gemini Deep Research. {sortedData.length} NCR LGUs
        tracked. Last updated: March 2026.
      </p>

      {/* ── Service Revenue Calculator ── */}
      <div
        className="animate-section"
        style={{
          borderTop: "1px solid var(--border-default)",
          paddingTop: 24,
        }}
      >
        {/* Calculator header */}
        <div
          style={{
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
            Revenue Calculator
          </h2>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            Select LGUs from the table above, then choose services to estimate
            revenue
          </p>
        </div>

        {/* Service checkboxes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {SERVICE_OPTIONS.map((svc) => {
            const isChecked = selectedServices.has(svc.id);
            return (
              <label
                key={svc.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: "var(--r-md)",
                  border: `1px solid ${isChecked ? "var(--accent)" : "var(--border-default)"}`,
                  background: isChecked ? "rgba(74,222,128,0.04)" : "var(--bg-surface)",
                  cursor: "pointer",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleService(svc.id)}
                  style={{
                    ...checkboxStyle,
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: 2,
                    }}
                  >
                    {svc.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--accent)",
                    }}
                  >
                    {formatCurrency(svc.price_per_lgu)}{" "}
                    <span style={{ color: "var(--text-muted)" }}>
                      {svc.frequency}
                    </span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Projected revenue output */}
        <div
          style={{
            border: "1px solid var(--border-default)",
            borderRadius: "var(--r-lg)",
            padding: "24px 28px",
            background: "var(--bg-surface)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            Projected Annual Revenue
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 36,
              fontWeight: 600,
              color: "var(--accent)",
              lineHeight: 1,
              marginBottom: 12,
            }}
          >
            {formatCurrency(projectedRevenue)}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-secondary)",
            }}
          >
            {selectedLGUs.size} LGU{selectedLGUs.size !== 1 ? "s" : ""} selected
            {" × "}
            {selectedServices.size} service{selectedServices.size !== 1 ? "s" : ""}
            {serviceTotalPerLGU > 0 && (
              <span style={{ color: "var(--text-muted)" }}>
                {" "}
                ({formatCurrency(serviceTotalPerLGU)}/LGU)
              </span>
            )}
            {" = "}
            <span style={{ color: "var(--accent)" }}>
              {formatCurrency(projectedRevenue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
