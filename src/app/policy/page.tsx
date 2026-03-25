"use client";

import { useState, useMemo } from "react";
import { billsData } from "@/data/bills";
import { policyNewsData } from "@/data/policy-news";
import { exportToCSV } from "@/lib/utils";
import StatStrip from "@/components/StatCard";
import { Search, Download, ExternalLink } from "lucide-react";

/* ── badge helpers ── */
const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; border: string; color: string; dot: string }> = {
    Enacted: {
      bg: "rgba(74,222,128,0.08)",
      border: "var(--accent)",
      color: "var(--accent)",
      dot: "var(--accent)",
    },
    "3rd Reading": {
      bg: "rgba(74,222,128,0.06)",
      border: "var(--accent)",
      color: "var(--accent)",
      dot: "var(--accent)",
    },
    "2nd Reading": {
      bg: "rgba(96,165,250,0.08)",
      border: "var(--data-blue)",
      color: "var(--data-blue)",
      dot: "var(--data-blue)",
    },
    Committee: {
      bg: "rgba(251,191,36,0.08)",
      border: "var(--data-amber)",
      color: "var(--data-amber)",
      dot: "var(--data-amber)",
    },
    Pending: {
      bg: "rgba(61,92,61,0.12)",
      border: "var(--text-muted)",
      color: "var(--text-muted)",
      dot: "var(--text-muted)",
    },
    Vetoed: {
      bg: "rgba(248,113,113,0.08)",
      border: "var(--data-red)",
      color: "var(--data-red)",
      dot: "var(--data-red)",
    },
  };
  return map[status] ?? map["Pending"];
};

const chamberBadge = (chamber: string) => {
  const map: Record<string, { bg: string; border: string; color: string }> = {
    Senate: {
      bg: "rgba(96,165,250,0.08)",
      border: "var(--data-blue)",
      color: "var(--data-blue)",
    },
    House: {
      bg: "rgba(167,139,250,0.08)",
      border: "var(--data-purple)",
      color: "var(--data-purple)",
    },
    Executive: {
      bg: "rgba(74,222,128,0.08)",
      border: "var(--accent)",
      color: "var(--accent)",
    },
  };
  return map[chamber] ?? map["Senate"];
};

const relevanceBadge = (relevance: string) => {
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
      bg: "rgba(61,92,61,0.12)",
      border: "var(--text-muted)",
      color: "var(--text-muted)",
      dot: "var(--text-muted)",
    },
  };
  return map[relevance] ?? map["Low"];
};

/* ── shared badge render ── */
const Badge = ({
  label,
  bg,
  border,
  color,
  dot,
}: {
  label: string;
  bg: string;
  border: string;
  color: string;
  dot?: string;
}) => (
  <span
    style={{
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      padding: "2px 8px",
      borderRadius: "var(--r-sm)",
      background: bg,
      border: `1px solid ${border}`,
      color,
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      whiteSpace: "nowrap",
    }}
  >
    {dot && (
      <span
        style={{ width: 5, height: 5, borderRadius: "50%", background: dot }}
      />
    )}
    {label}
  </span>
);

export default function PolicyPage() {
  const [search, setSearch] = useState("");
  const [chamberFilter, setChamberFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [relevanceFilter, setRelevanceFilter] = useState("");

  const allTags = Array.from(
    new Set(billsData.flatMap((b) => b.tags))
  ).sort();

  const filtered = useMemo(() => {
    return billsData.filter((b) => {
      const matchesSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.bill_number.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      const matchesChamber = !chamberFilter || b.chamber === chamberFilter;
      const matchesTag = !tagFilter || b.tags.includes(tagFilter);
      const matchesRelevance =
        !relevanceFilter || b.relevance === relevanceFilter;
      return matchesSearch && matchesChamber && matchesTag && matchesRelevance;
    });
  }, [search, chamberFilter, tagFilter, relevanceFilter]);

  const highRelevance = billsData.filter((b) => b.relevance === "High").length;
  const enacted = billsData.filter((b) => b.status === "Enacted").length;
  const pending = billsData.filter(
    (b) => b.status !== "Enacted" && b.status !== "Vetoed"
  ).length;

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
            Policy Radar
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            Philippine bills and laws affecting EcoWaste&apos;s mission
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
                filtered.map((b) => ({ ...b, tags: b.tags.join("; ") })),
                "ecowaste-policy-bills"
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
            { value: billsData.length, label: "Total Bills Tracked" },
            { value: highRelevance, label: "High Relevance", accent: "alert" },
            { value: enacted, label: "Enacted Laws", accent: "live" },
            { value: pending, label: "Pending / In Progress", accent: "warn" },
          ]}
        />
      </div>

      {/* ── Filters ── */}
      <div
        className="animate-section"
        style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}
      >
        {/* Search — pill */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
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
            placeholder="Search bills, authors…"
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
        {[
          {
            value: chamberFilter,
            setter: setChamberFilter,
            label: "All Chambers",
            options: ["Senate", "House", "Executive"],
          },
          {
            value: tagFilter,
            setter: setTagFilter,
            label: "All Topics",
            options: allTags,
          },
          {
            value: relevanceFilter,
            setter: setRelevanceFilter,
            label: "All Relevance",
            options: ["High", "Medium", "Low"],
          },
        ].map((f) => (
          <select
            key={f.label}
            value={f.value}
            onChange={(e) => f.setter(e.target.value)}
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
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* ── Bills List (bordered rows, not cards) ── */}
      <div className="animate-section">
        {filtered.map((b) => {
          const sBadge = statusBadge(b.status);
          const cBadge = chamberBadge(b.chamber);
          const rBadge = relevanceBadge(b.relevance);
          return (
            <div
              key={b.id}
              style={{
                borderBottom: "1px solid var(--border-default)",
                padding: "16px 0",
                transition: "background 0.15s",
              }}
            >
              {/* Top row: bill number + badges + external link */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--accent)",
                      }}
                    >
                      {b.bill_number}
                    </span>
                    <Badge label={b.chamber} {...cBadge} />
                    <Badge label={b.status} {...sBadge} />
                    <Badge label={`${b.relevance} Relevance`} {...rBadge} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      lineHeight: 1.4,
                    }}
                  >
                    {b.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--text-muted)",
                      marginTop: 4,
                    }}
                  >
                    Author: {b.author} &middot; Filed: {b.date_filed}
                  </p>
                </div>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)",
                    marginLeft: 12,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                  marginTop: 10,
                }}
              >
                {b.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      padding: "1px 6px",
                      borderRadius: "var(--r-sm)",
                      background: "rgba(61,92,61,0.12)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Impact block */}
              <div
                style={{
                  marginTop: 12,
                  background: "var(--bg-elevated)",
                  borderLeft: "2px solid var(--accent)",
                  borderRadius: "var(--r-sm)",
                  padding: "10px 14px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--accent)",
                    marginBottom: 4,
                  }}
                >
                  EcoWaste Impact Analysis
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 13,
                    color: "var(--text-primary)",
                    lineHeight: 1.5,
                  }}
                >
                  {b.ecowaste_impact}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            color: "var(--text-muted)",
            textAlign: "center",
            padding: "32px 0",
          }}
        >
          No bills match your filters.
        </p>
      )}

      {/* ── News Feed Section ── */}
      {policyNewsData.length > 0 && (
        <div className="animate-section" style={{ marginTop: 48 }}>
          {/* Editorial section header */}
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
              Policy News Feed
            </h2>
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
                {policyNewsData.length} articles
              </span>
              <button
                onClick={() =>
                  exportToCSV(
                    policyNewsData.map((n) => ({
                      ...n,
                      tags: n.tags.join("; "),
                    })),
                    "ecowaste-policy-news"
                  )
                }
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "5px 12px",
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
                <Download size={12} />
                Export News
              </button>
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 16,
            }}
          >
            Live feed from Google News RSS — Philippine waste, plastic, EPR, and
            environment legislation coverage.
          </p>

          {/* Compact news rows */}
          <div style={{ maxHeight: 600, overflowY: "auto", paddingRight: 4 }}>
            {policyNewsData.slice(0, 50).map((n) => (
              <a
                key={n.id}
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border-default)",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-surface)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {n.title}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-muted)",
                      }}
                    >
                      {n.source}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-muted)",
                      }}
                    >
                      {n.date}
                    </span>
                    {n.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "1px 6px",
                          borderRadius: "var(--r-sm)",
                          background: "rgba(61,92,61,0.12)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <ExternalLink
                  size={12}
                  style={{
                    color: "var(--text-muted)",
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
              </a>
            ))}
          </div>
          {policyNewsData.length > 50 && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--text-muted)",
                marginTop: 12,
                textAlign: "center",
              }}
            >
              Showing 50 of {policyNewsData.length} articles. Export CSV for full
              dataset.
            </p>
          )}
        </div>
      )}

      {/* ── Source line ── */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-muted)",
          marginTop: 24,
        }}
      >
        Bill data: BCG research. News feed: Google News RSS (run{" "}
        <code
          style={{
            fontFamily: "var(--font-mono)",
            background: "var(--bg-elevated)",
            padding: "1px 4px",
            borderRadius: "var(--r-sm)",
          }}
        >
          npm run scrape:bills
        </code>{" "}
        to refresh). Last updated: March 2026.
      </p>
    </div>
  );
}
