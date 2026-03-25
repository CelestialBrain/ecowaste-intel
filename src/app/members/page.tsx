"use client";

import { useState, useMemo } from "react";
import { memberOrgsData, MEMBER_STATS, MemberOrg } from "@/data/members";
import { exportToCSV } from "@/lib/utils";
import { Search, Download } from "lucide-react";
import StatStrip from "@/components/StatCard";

/* ── Badge color map by org type ── */
const typeBadge = (type: MemberOrg["type"]) => {
  const map: Record<
    MemberOrg["type"],
    { bg: string; border: string; color: string; dot: string }
  > = {
    NGO: {
      bg: "rgba(74,222,128,0.08)",
      border: "var(--accent)",
      color: "var(--accent)",
      dot: "var(--accent)",
    },
    Academic: {
      bg: "rgba(96,165,250,0.08)",
      border: "var(--data-blue)",
      color: "var(--data-blue)",
      dot: "var(--data-blue)",
    },
    "Faith-Based": {
      bg: "rgba(168,85,247,0.08)",
      border: "var(--data-purple)",
      color: "var(--data-purple)",
      dot: "var(--data-purple)",
    },
    Cooperative: {
      bg: "rgba(251,191,36,0.08)",
      border: "var(--data-amber)",
      color: "var(--data-amber)",
      dot: "var(--data-amber)",
    },
    Network: {
      bg: "rgba(74,222,128,0.06)",
      border: "var(--accent)",
      color: "var(--accent)",
      dot: "var(--accent)",
    },
    PO: {
      bg: "rgba(239,68,68,0.08)",
      border: "var(--data-red)",
      color: "var(--data-red)",
      dot: "var(--data-red)",
    },
    Unknown: {
      bg: "rgba(120,120,120,0.08)",
      border: "var(--text-muted)",
      color: "var(--text-muted)",
      dot: "var(--text-muted)",
    },
  };
  return map[type] ?? map["Unknown"];
};

const allTypes: MemberOrg["type"][] = [
  "NGO",
  "Academic",
  "Faith-Based",
  "Cooperative",
  "Network",
  "PO",
  "Unknown",
];

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = useMemo(() => {
    return memberOrgsData.filter((m) => {
      const matchesSearch =
        !search || m.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || m.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

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
            Member Directory
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            135 member organizations in the EcoWaste Coalition network
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
            onClick={() =>
              exportToCSV(
                filtered.map((m) => ({
                  name: m.name,
                  type: m.type,
                  focus: m.focus,
                  active: m.active ? "Yes" : "No",
                })),
                "ecowaste-members"
              )
            }
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
            { value: MEMBER_STATS.total_members, label: "Total Members", accent: "live" },
            { value: `~${MEMBER_STATS.total_individuals}`, label: "Individuals", accent: "live" },
            { value: MEMBER_STATS.known_classified, label: "Classified" },
            { value: allTypes.length, label: "Organization Types" },
          ]}
        />
      </div>

      {/* ── Filters ── */}
      <div
        className="animate-section"
        style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}
      >
        {/* Search — pill shape */}
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
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
            placeholder="Search organization name..."
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

        {/* Type filter dropdown */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
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
          <option value="">All Types</option>
          {allTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
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
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border-default)",
                background: "var(--bg-surface)",
              }}
            >
              {["Organization Name", "Type", "Focus Area", "Status"].map(
                (h) => (
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
                      padding: "10px 16px",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const badge = typeBadge(m.type);
              return (
                <tr
                  key={m.id}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background 0.15s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--bg-elevated)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Organization Name */}
                  <td
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      padding: "12px 16px",
                      maxWidth: 340,
                    }}
                  >
                    {m.name}
                  </td>

                  {/* Type Badge */}
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
                        whiteSpace: "nowrap",
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
                          flexShrink: 0,
                        }}
                      />
                      {m.type}
                    </span>
                  </td>

                  {/* Focus Area */}
                  <td
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      padding: "12px 16px",
                      maxWidth: 280,
                    }}
                  >
                    {m.focus || "\u2014"}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: m.active
                          ? "var(--accent)"
                          : "var(--text-muted)",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: m.active
                            ? "var(--accent)"
                            : "var(--text-muted)",
                        }}
                      />
                      {m.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                    textAlign: "center",
                    padding: "32px 0",
                  }}
                >
                  No organizations match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Results count ── */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-muted)",
          marginTop: 16,
        }}
      >
        Showing {filtered.length} of {memberOrgsData.length} organizations.
        Source: ecowastecoalition.org, manual classification. Last updated:
        March 2026.
      </p>
    </div>
  );
}
