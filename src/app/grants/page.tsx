"use client";

import { useState, useMemo } from "react";
import { grantsData } from "@/data/grants";
import { exportToCSV } from "@/lib/utils";
import StatStrip from "@/components/StatCard";
import {
  Download,
  ExternalLink,
  Search,
} from "lucide-react";

const statusBadgeStyles: Record<string, { dotColor: string; textColor: string }> = {
  Active: { dotColor: "#4ade80", textColor: "#4ade80" },
  Open: { dotColor: "#4ade80", textColor: "#4ade80" },
  Annual: { dotColor: "#c084fc", textColor: "#c084fc" },
  Rolling: { dotColor: "#fbbf24", textColor: "#fbbf24" },
  Procurement: { dotColor: "var(--text-muted)", textColor: "var(--text-muted)" },
};

export default function GrantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [focusFilter, setFocusFilter] = useState("");

  // Collect all unique focus areas
  const allFocusAreas = useMemo(() => {
    const set = new Set<string>();
    grantsData.forEach((g) => g.focus_areas.forEach((f) => set.add(f)));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return grantsData.filter((g) => {
      const matchesSearch =
        !search ||
        g.funder.toLowerCase().includes(search.toLowerCase()) ||
        g.program_name.toLowerCase().includes(search.toLowerCase()) ||
        g.focus_areas.some((f) =>
          f.toLowerCase().includes(search.toLowerCase())
        );
      const matchesStatus = !statusFilter || g.status === statusFilter;
      const matchesFocus =
        !focusFilter || g.focus_areas.includes(focusFilter);
      return matchesSearch && matchesStatus && matchesFocus;
    });
  }, [search, statusFilter, focusFilter]);

  const activeRollingCount = grantsData.filter(
    (g) => g.status === "Active" || g.status === "Rolling"
  ).length;

  const uniqueFunders = new Set(grantsData.map((g) => g.funder)).size;

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
            Grant Opportunities
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-secondary)",
              margin: "4px 0 0 0",
            }}
          >
            Funding sources, deadlines, and application details
          </p>
        </div>
        <button
          onClick={() =>
            exportToCSV(
              filtered.map((g) => ({
                ...g,
                focus_areas: g.focus_areas.join("; "),
              })),
              "ecowaste-grants"
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
      <div className="animate-section" style={{ marginBottom: 28 }}>
        <StatStrip
          cells={[
            {
              value: grantsData.length,
              label: "Total Opportunities",
              accent: "live",
            },
            {
              value: activeRollingCount,
              label: "Active / Rolling",
              accent: "live",
              delta: "Currently open",
              deltaColor: "up",
            },
            {
              value: uniqueFunders,
              label: "Unique Funders",
            },
          ]}
        />
      </div>

      {/* Filters */}
      <div className="animate-section" style={{ marginBottom: 24 }}>
        {/* Search + Status */}
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search by funder, program, or focus area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: 32,
                paddingRight: 14,
                paddingTop: 9,
                paddingBottom: 9,
                fontFamily: "var(--font-ui)",
                fontSize: 12,
                color: "var(--text-primary)",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--r-sm)",
                outline: "none",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--accent)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border-default)")
              }
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
            <option value="">ALL STATUSES</option>
            <option value="Active">ACTIVE</option>
            <option value="Rolling">ROLLING</option>
            <option value="Open">OPEN</option>
            <option value="Annual">ANNUAL</option>
            <option value="Procurement">PROCUREMENT</option>
          </select>
        </div>

        {/* Focus Area Filter Chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <button
            onClick={() => setFocusFilter("")}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.06em",
              color: !focusFilter ? "var(--bg-base)" : "var(--text-secondary)",
              background: !focusFilter ? "var(--accent)" : "transparent",
              border: `1px solid ${!focusFilter ? "var(--accent)" : "var(--border-default)"}`,
              borderRadius: 999,
              padding: "4px 12px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ALL
          </button>
          {allFocusAreas.map((area) => (
            <button
              key={area}
              onClick={() => setFocusFilter(focusFilter === area ? "" : area)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.06em",
                color:
                  focusFilter === area
                    ? "var(--bg-base)"
                    : "var(--text-secondary)",
                background:
                  focusFilter === area ? "var(--accent)" : "transparent",
                border: `1px solid ${focusFilter === area ? "var(--accent)" : "var(--border-default)"}`,
                borderRadius: 999,
                padding: "4px 12px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {area.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="animate-section" style={{ marginBottom: 24 }}>
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
            Directory
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.06em",
            }}
          >
            {filtered.length} RESULT{filtered.length !== 1 ? "S" : ""}
          </span>
        </div>

        {filtered.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            No grants match your filters.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {[
                    { label: "Program", align: "left" as const },
                    { label: "Funder", align: "left" as const },
                    { label: "Amount", align: "right" as const },
                    { label: "Status", align: "center" as const },
                    { label: "Deadline", align: "left" as const },
                    { label: "Focus Areas", align: "left" as const },
                    { label: "Link", align: "right" as const },
                  ].map((col) => (
                    <th
                      key={col.label}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        fontWeight: 500,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        textAlign: col.align,
                        padding: "10px 12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => {
                  const badge = statusBadgeStyles[g.status] || statusBadgeStyles.Procurement;
                  return (
                    <tr
                      key={g.id}
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
                      {/* Program */}
                      <td
                        style={{
                          padding: "12px",
                          fontFamily: "var(--font-ui)",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          maxWidth: 240,
                        }}
                      >
                        {g.program_name}
                        {g.notes && (
                          <div
                            style={{
                              fontFamily: "var(--font-ui)",
                              fontSize: 11,
                              color: "var(--text-muted)",
                              marginTop: 4,
                              lineHeight: 1.4,
                            }}
                          >
                            {g.notes}
                          </div>
                        )}
                      </td>
                      {/* Funder */}
                      <td
                        style={{
                          padding: "12px",
                          fontFamily: "var(--font-ui)",
                          fontSize: 12,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {g.funder}
                      </td>
                      {/* Amount */}
                      <td
                        style={{
                          padding: "12px",
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--accent)",
                          textAlign: "right",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {g.amount_range}
                      </td>
                      {/* Status Badge */}
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: badge.textColor,
                          }}
                        >
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: badge.dotColor,
                              display: "inline-block",
                              flexShrink: 0,
                            }}
                          />
                          {g.status}
                        </span>
                      </td>
                      {/* Deadline */}
                      <td
                        style={{
                          padding: "12px",
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--text-secondary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {g.deadline_note}
                      </td>
                      {/* Focus Areas */}
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                          }}
                        >
                          {g.focus_areas.map((f) => (
                            <span
                              key={f}
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 9,
                                letterSpacing: "0.06em",
                                color: "var(--text-secondary)",
                                border: "1px solid var(--border-subtle)",
                                borderRadius: "var(--r-sm)",
                                padding: "2px 8px",
                                whiteSpace: "nowrap",
                                textTransform: "uppercase",
                              }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                      {/* Link */}
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <a
                          href={g.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            letterSpacing: "0.08em",
                            color: "var(--accent)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            borderRadius: "var(--r-sm)",
                            border: "1px solid var(--border-default)",
                            padding: "4px 10px",
                            transition: "border-color 0.15s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor = "var(--accent)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor =
                              "var(--border-default)")
                          }
                        >
                          <ExternalLink size={10} />
                          VISIT
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
        Sources: Gemini Deep Research, public grant databases. Last updated:
        March 2026.
      </p>
    </div>
  );
}
