"use client";

import { useState, useMemo } from "react";
import { grantsData } from "@/data/grants";
import { exportToCSV } from "@/lib/utils";
import StatStrip from "@/components/StatCard";
import { Download, ExternalLink, Search } from "lucide-react";
import React from "react";

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; border: string; color: string; dot: string }> = {
    Active: { bg: "rgba(22,163,74,0.08)", border: "var(--accent)", color: "var(--accent)", dot: "var(--accent)" },
    Open: { bg: "rgba(22,163,74,0.08)", border: "var(--accent)", color: "var(--accent)", dot: "var(--accent)" },
    Annual: { bg: "rgba(124,58,237,0.08)", border: "var(--data-purple)", color: "var(--data-purple)", dot: "var(--data-purple)" },
    Rolling: { bg: "rgba(217,119,6,0.08)", border: "var(--data-amber)", color: "var(--data-amber)", dot: "var(--data-amber)" },
    Procurement: { bg: "rgba(156,163,175,0.08)", border: "var(--text-muted)", color: "var(--text-muted)", dot: "var(--text-muted)" },
  };
  return map[status] ?? map.Procurement;
};

export default function GrantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [focusFilter, setFocusFilter] = useState("");

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
        g.focus_areas.some((f) => f.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = !statusFilter || g.status === statusFilter;
      const matchesFocus = !focusFilter || g.focus_areas.includes(focusFilter);
      return matchesSearch && matchesStatus && matchesFocus;
    });
  }, [search, statusFilter, focusFilter]);

  const activeRollingCount = grantsData.filter(
    (g) => g.status === "Active" || g.status === "Rolling"
  ).length;
  const uniqueFunders = new Set(grantsData.map((g) => g.funder)).size;

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
          paddingBottom: 14,
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
            Grant Opportunities
          </h1>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Funding sources, deadlines, and application details
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            MAR 2026
          </span>
          <button
            onClick={() =>
              exportToCSV(
                filtered.map((g) => ({ ...g, focus_areas: g.focus_areas.join("; ") })),
                "ecowaste-grants"
              )
            }
            style={{
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em",
              padding: "7px 14px", borderRadius: "var(--r-sm)",
              background: "var(--accent)", color: "var(--text-inverse)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
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
            { value: grantsData.length, label: "Total Opportunities", accent: "live" },
            { value: activeRollingCount, label: "Active / Rolling", accent: "live", delta: "Currently open", deltaColor: "up" },
            { value: uniqueFunders, label: "Unique Funders" },
          ]}
        />
      </div>

      {/* ── Filters ── */}
      <div className="animate-section" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search by funder, program, or focus area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", paddingLeft: 34, paddingRight: 14, paddingTop: 8, paddingBottom: 8,
              fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)",
              background: "var(--bg-surface)", border: "1px solid var(--border-default)",
              borderRadius: 100, outline: "none",
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em",
            color: "var(--text-primary)", background: "var(--bg-surface)",
            border: "1px solid var(--border-default)", borderRadius: "var(--r-md)",
            padding: "8px 30px 8px 12px", outline: "none", cursor: "pointer",
            appearance: "none", WebkitAppearance: "none",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239ca3af'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
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

      {/* Focus chips */}
      <div className="animate-section" style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        <button
          onClick={() => setFocusFilter("")}
          style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em",
            color: !focusFilter ? "var(--text-inverse)" : "var(--text-secondary)",
            background: !focusFilter ? "var(--accent)" : "transparent",
            border: `1px solid ${!focusFilter ? "var(--accent)" : "var(--border-default)"}`,
            borderRadius: 999, padding: "4px 12px", cursor: "pointer",
          }}
        >
          ALL
        </button>
        {allFocusAreas.map((area) => (
          <button
            key={area}
            onClick={() => setFocusFilter(focusFilter === area ? "" : area)}
            style={{
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em",
              color: focusFilter === area ? "var(--text-inverse)" : "var(--text-secondary)",
              background: focusFilter === area ? "var(--accent)" : "transparent",
              border: `1px solid ${focusFilter === area ? "var(--accent)" : "var(--border-default)"}`,
              borderRadius: 999, padding: "4px 12px", cursor: "pointer",
            }}
          >
            {area.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── Grant List (row-based, not wide table) ── */}
      <div className="animate-section">
        {filtered.length === 0 ? (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textAlign: "center", padding: "32px 0", letterSpacing: "0.06em" }}>
            NO GRANTS MATCH YOUR FILTERS.
          </p>
        ) : (
          filtered.map((g) => {
            const badge = statusBadge(g.status);
            return (
              <div
                key={g.id}
                style={{
                  borderBottom: "1px solid var(--border-default)",
                  padding: "16px 0",
                }}
              >
                {/* Top: program name + status + amount */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em",
                        padding: "2px 8px", borderRadius: "var(--r-sm)",
                        background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color,
                        display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: badge.dot }} />
                        {g.status}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>
                        {g.amount_range}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
                      {g.program_name}
                    </h3>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                      {g.funder}
                    </p>
                  </div>
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em",
                      color: "var(--accent)", textDecoration: "none",
                      display: "inline-flex", alignItems: "center", gap: 4,
                      borderRadius: "var(--r-sm)", border: "1px solid var(--border-default)",
                      padding: "5px 12px", flexShrink: 0,
                    }}
                  >
                    <ExternalLink size={10} />
                    VISIT
                  </a>
                </div>

                {/* Focus area tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                  {g.focus_areas.map((f) => (
                    <span key={f} style={{
                      fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em",
                      color: "var(--text-secondary)", border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--r-sm)", padding: "2px 8px", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>
                      {f}
                    </span>
                  ))}
                </div>

                {/* Deadline + contact */}
                <div style={{ display: "flex", gap: 16, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>
                  <span>{g.deadline_note}</span>
                  {g.contact_point && <span>{g.contact_point}</span>}
                </div>

                {/* Notes */}
                {g.notes && (
                  <div style={{
                    marginTop: 10, background: "var(--bg-elevated)", borderLeft: "2px solid var(--accent)",
                    borderRadius: "var(--r-sm)", padding: "8px 12px",
                    fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5,
                  }}>
                    {g.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 16 }}>
        Sources: Gemini Deep Research, public grant databases. Last updated: March 2026.
      </p>
    </div>
  );
}
