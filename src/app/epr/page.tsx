"use client";

import React, { useState, useMemo } from "react";
import { eprCompaniesData } from "@/data/epr-companies";
import { exportToCSV } from "@/lib/utils";
import StatStrip from "@/components/StatCard";
import {
  Search,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ── badge & bar helpers ── */
const statusBadgeStyle = (status: string) => {
  const map: Record<string, { bg: string; border: string; color: string; dot: string }> = {
    "Active Partner": {
      bg: "rgba(74,222,128,0.08)",
      border: "var(--accent)",
      color: "var(--accent)",
      dot: "var(--accent)",
    },
    "Lead Prospect": {
      bg: "rgba(96,165,250,0.08)",
      border: "var(--data-blue)",
      color: "var(--data-blue)",
      dot: "var(--data-blue)",
    },
    "EPR Registered": {
      bg: "rgba(251,191,36,0.08)",
      border: "var(--data-amber)",
      color: "var(--data-amber)",
      dot: "var(--data-amber)",
    },
    Target: {
      bg: "rgba(61,92,61,0.12)",
      border: "var(--text-muted)",
      color: "var(--text-muted)",
      dot: "var(--text-muted)",
    },
  };
  return map[status] ?? map["Target"];
};

const complianceBarColor: Record<string, string> = {
  High: "var(--accent)",
  Medium: "var(--data-amber)",
  Low: "var(--data-red)",
};

const complianceBarWidth: Record<string, string> = {
  High: "100%",
  Medium: "66%",
  Low: "33%",
};

export default function EPRPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return eprCompaniesData.filter((c) => {
      const matchesSearch =
        !search ||
        c.company_name.toLowerCase().includes(search.toLowerCase()) ||
        c.sector.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || c.epr_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

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
            EPR Companies
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            RA 11898 obliged enterprises and partnership leads
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
            onClick={() => exportToCSV(filtered, "ecowaste-epr-companies")}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "7px 14px",
              borderRadius: "var(--r-sm)",
              background: "var(--accent)",
              color: "var(--text-inverse)",
              border: "none",
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
              value: eprCompaniesData.length,
              label: "Total Tracked",
            },
            {
              value: eprCompaniesData.filter((c) => c.epr_status === "EPR Registered").length,
              label: "EPR Registered",
              accent: "warn",
            },
            {
              value: eprCompaniesData.filter((c) => c.epr_status === "Lead Prospect").length,
              label: "Lead Prospects",
            },
            {
              value: eprCompaniesData.filter((c) => c.compliance_level === "High").length,
              label: "High Compliance",
              accent: "live",
            },
          ]}
        />
      </div>

      {/* ── Filters ── */}
      <div
        className="animate-section"
        style={{ display: "flex", gap: 10, marginBottom: 20 }}
      >
        {/* Search — pill */}
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search company or sector…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: 34,
              paddingRight: 14,
              paddingTop: 8,
              paddingBottom: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-primary)",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              borderRadius: 100,
              outline: "none",
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--text-primary)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--r-md)",
            padding: "8px 30px 8px 12px",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239ca3af'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
          } as React.CSSProperties}
        >
          <option value="">All Statuses</option>
          <option value="Active Partner">Active Partner</option>
          <option value="Lead Prospect">Lead Prospect</option>
          <option value="EPR Registered">EPR Registered</option>
          <option value="Target">Target</option>
        </select>
      </div>

      {/* ── Data Table ── */}
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
                {["Company", "Sector", "Status", "Compliance", "Program", ""].map(
                  (h, i) => (
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
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const badge = statusBadgeStyle(c.epr_status);
                const isExpanded = expanded === c.id;
                return (
                  <React.Fragment key={c.id}>
                    <tr
                      onClick={() => setExpanded(isExpanded ? null : c.id)}
                      style={{
                        borderBottom: isExpanded ? "none" : "1px solid var(--border-default)",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--bg-surface)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "var(--font-ui)",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {c.company_name}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "var(--font-ui)",
                          fontSize: 12,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {c.sector}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "2px 8px",
                            borderRadius: "var(--r-sm)",
                            background: badge.bg,
                            border: `1px solid ${badge.border}`,
                            color: badge.color,
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
                              background: badge.dot,
                            }}
                          />
                          {c.epr_status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {/* thin compliance bar */}
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
                                width: complianceBarWidth[c.compliance_level] ?? "33%",
                                height: "100%",
                                background: complianceBarColor[c.compliance_level] ?? "var(--text-muted)",
                                borderRadius: 2,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 10,
                              color: "var(--text-muted)",
                            }}
                          >
                            {c.compliance_level}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--text-muted)",
                        }}
                      >
                        {c.known_program}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {isExpanded ? (
                          <ChevronUp size={14} style={{ color: "var(--text-muted)" }} />
                        ) : (
                          <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
                        )}
                      </td>
                    </tr>
                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr
                        style={{
                          borderBottom: "1px solid var(--border-default)",
                        }}
                      >
                        <td
                          colSpan={6}
                          style={{
                            padding: 0,
                          }}
                        >
                          <div
                            style={{
                              background: "var(--bg-elevated)",
                              borderLeft: "2px solid var(--accent)",
                              padding: "14px 20px",
                              boxShadow: "inset 0 0 12px rgba(74,222,128,0.04)",
                            }}
                          >
                            <p
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "var(--accent)",
                                marginBottom: 6,
                              }}
                            >
                              Strategic Angle (BCG Analysis)
                            </p>
                            <p
                              style={{
                                fontFamily: "var(--font-ui)",
                                fontSize: 13,
                                color: "var(--text-primary)",
                                lineHeight: 1.5,
                              }}
                            >
                              {c.strategic_angle}
                            </p>
                            <p
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                color: "var(--text-muted)",
                                marginTop: 8,
                              }}
                            >
                              Source: {c.source}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
        Sources: DENR EPR Registry, PSE Edge, Manual research. Last updated:
        March 2026.
      </p>
    </div>
  );
}
