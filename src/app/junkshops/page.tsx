"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { junkshopsData } from "@/data/junkshops";
import { Junkshop } from "@/lib/types";
import { exportToCSV } from "@/lib/utils";
import { Search, Download, Phone, Star } from "lucide-react";
import StatStrip from "@/components/StatCard";

const JunkshopMap = dynamic(() => import("@/components/JunkshopMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg-surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
      }}
    >
      Loading map…
    </div>
  ),
});

const allAreas = Array.from(new Set(junkshopsData.map((j) => j.area))).sort();
const allStatuses: Junkshop["status"][] = [
  "Informal",
  "Semi-formal",
  "Accredited MRF",
];
const allMaterials = Array.from(
  new Set(junkshopsData.flatMap((j) => j.materials))
).sort();

/* ── badge helpers ── */
const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; border: string; color: string; dot: string }> = {
    "Accredited MRF": {
      bg: "rgba(74,222,128,0.08)",
      border: "var(--accent)",
      color: "var(--accent)",
      dot: "var(--accent)",
    },
    "Semi-formal": {
      bg: "rgba(96,165,250,0.08)",
      border: "var(--data-blue)",
      color: "var(--data-blue)",
      dot: "var(--data-blue)",
    },
    Informal: {
      bg: "rgba(61,92,61,0.12)",
      border: "var(--text-muted)",
      color: "var(--text-muted)",
      dot: "var(--text-muted)",
    },
  };
  return map[status] ?? map["Informal"];
};

export default function JunkshopsPage() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [materialFilter, setMaterialFilter] = useState("");
  const [selected, setSelected] = useState<Junkshop | null>(null);

  const filtered = useMemo(() => {
    return junkshopsData.filter((j) => {
      const matchesSearch =
        !search ||
        j.name.toLowerCase().includes(search.toLowerCase()) ||
        j.barangay.toLowerCase().includes(search.toLowerCase());
      const matchesArea = !areaFilter || j.area === areaFilter;
      const matchesStatus = !statusFilter || j.status === statusFilter;
      const matchesMaterial =
        !materialFilter || j.materials.includes(materialFilter);
      return matchesSearch && matchesArea && matchesStatus && matchesMaterial;
    });
  }, [search, areaFilter, statusFilter, materialFilter]);

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
            Junkshop Directory
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            NCR junkshops, scrap dealers, and accredited MRFs
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
                filtered.map((j) => ({
                  ...j,
                  materials: j.materials.join("; "),
                })),
                "ecowaste-junkshops"
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
            { value: junkshopsData.length, label: "Total Mapped", accent: "live" },
            {
              value: junkshopsData.filter((j) => j.status === "Accredited MRF").length,
              label: "Accredited MRFs",
              accent: "live",
            },
            { value: allAreas.length, label: "Areas Covered" },
            {
              value: filtered.length,
              label: "Filtered Results",
              accent: filtered.length < junkshopsData.length ? "warn" : undefined,
            },
          ]}
        />
      </div>

      {/* ── Filters ── */}
      <div
        className="animate-section"
        style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}
      >
        {/* Search — pill shape */}
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
            placeholder="Search by name or barangay…"
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
        {/* Dropdowns */}
        {[
          { value: areaFilter, setter: setAreaFilter, label: "All Areas", options: allAreas },
          { value: statusFilter, setter: setStatusFilter, label: "All Statuses", options: allStatuses },
          { value: materialFilter, setter: setMaterialFilter, label: "All Materials", options: allMaterials },
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

      {/* ── Map + List Split ── */}
      <div
        className="animate-section"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: 16,
        }}
      >
        {/* List */}
        <div
          style={{
            maxHeight: 600,
            overflowY: "auto",
            borderRight: "1px solid var(--border-default)",
            paddingRight: 8,
          }}
        >
          {filtered.map((j) => {
            const badge = statusBadge(j.status);
            const isActive = selected?.id === j.id;
            return (
              <button
                key={j.id}
                onClick={() => setSelected(j)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "block",
                  padding: "12px 14px",
                  background: isActive ? "var(--bg-elevated)" : "transparent",
                  borderBottom: "1px solid var(--border-default)",
                  borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "var(--bg-surface)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {j.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        marginTop: 2,
                      }}
                    >
                      {j.barangay}, {j.area}
                    </div>
                  </div>
                  {/* Status badge */}
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
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: badge.dot }} />
                    {j.status}
                  </span>
                </div>
                {/* Materials */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                  {j.materials.map((m) => (
                    <span
                      key={m}
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
                      {m}
                    </span>
                  ))}
                </div>
                {/* Meta row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                  {j.phone && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-muted)",
                      }}
                    >
                      <Phone size={10} />
                      {j.phone}
                    </span>
                  )}
                  {j.rating && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--data-amber)",
                      }}
                    >
                      <Star size={10} />
                      {j.rating}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--text-muted)",
                    }}
                  >
                    via {j.source}
                  </span>
                </div>
              </button>
            );
          })}
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
              No junkshops match your filters.
            </p>
          )}
        </div>

        {/* Map */}
        <div
          style={{
            height: 600,
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            border: "1px solid var(--border-default)",
          }}
        >
          <JunkshopMap
            junkshops={filtered}
            selected={selected}
            onSelect={setSelected}
          />
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
        Data sources: Google Maps API, DENR-EMB MRF Registry, Manual survey.
        Last updated: March 2026.
      </p>
    </div>
  );
}
