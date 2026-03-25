"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { aqiData, wasteSitesData } from "@/data/pollution";
import { cn, exportToCSV } from "@/lib/utils";
import StatStrip from "@/components/StatCard";
import { Download } from "lucide-react";

const PollutionMap = dynamic(() => import("@/components/PollutionMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: "var(--bg-surface)",
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.08em",
      }}
    >
      LOADING MAP...
    </div>
  ),
});

/* ── Pin-dot legend colors (match map markers) ── */
const siteTypeDots: Record<string, string> = {
  Landfill: "var(--data-red)",
  "Recycling Center": "var(--accent)",
  "Waste Disposal": "var(--data-amber)",
  "Wastewater Plant": "var(--data-blue)",
  "Scrap Yard": "var(--data-purple)",
};

export default function PollutionPage() {
  const [mapLayer, setMapLayer] = useState<"aqi" | "waste">("waste");
  const [siteTypeFilter, setSiteTypeFilter] = useState("");

  const filteredSites = siteTypeFilter
    ? wasteSitesData.filter((s) => s.type === siteTypeFilter)
    : wasteSitesData;

  const avgAqi = aqiData.length
    ? Math.round(aqiData.reduce((sum, r) => sum + r.aqi, 0) / aqiData.length)
    : 0;

  const siteTypeCounts: Record<string, number> = {};
  wasteSitesData.forEach((s) => {
    siteTypeCounts[s.type] = (siteTypeCounts[s.type] || 0) + 1;
  });

  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* ── Page Header ── */}
      <div
        className="animate-section"
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-default)",
          paddingBottom: 16,
          marginBottom: 20,
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
            Pollution Monitor
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            Air quality index and waste site mapping for NCR
          </p>
        </div>
        <button
          onClick={() => {
            if (mapLayer === "aqi") {
              exportToCSV(aqiData, "ecowaste-aqi-data");
            } else {
              exportToCSV(filteredSites, "ecowaste-waste-sites");
            }
          }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            padding: "8px 16px",
            borderRadius: "var(--r-sm)",
            border: "1px solid var(--border-default)",
            background: "transparent",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Download size={14} />
          EXPORT CSV
        </button>
      </div>

      {/* ── Stat Strip ── */}
      <div className="animate-section" style={{ marginBottom: 24 }}>
        <StatStrip
          cells={[
            {
              value: avgAqi,
              label: "NCR Average AQI",
              delta:
                avgAqi > 100
                  ? "Unhealthy for Sensitive Groups"
                  : avgAqi > 50
                    ? "Moderate"
                    : "Good",
              deltaColor: avgAqi > 100 ? "down" : avgAqi > 50 ? "warn" : "up",
              accent: avgAqi > 100 ? "alert" : avgAqi > 50 ? "warn" : "live",
            },
            {
              value: wasteSitesData.length,
              label: "Waste Sites (NCR)",
              accent: "warn",
            },
            {
              value: siteTypeCounts["Landfill"] || 0,
              label: "Landfills",
              accent: "alert",
            },
            {
              value: siteTypeCounts["Recycling Center"] || 0,
              label: "Recycling Centers",
              accent: "live",
            },
            {
              value: siteTypeCounts["Scrap Yard"] || 0,
              label: "Scrap Yards",
            },
          ]}
        />
      </div>

      {/* ── AQI City Grid ── */}
      {aqiData.length > 0 && (
        <div className="animate-section" style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border-default)",
              paddingBottom: 12,
              marginBottom: 20,
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
              Air Quality by City
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
              Real-time
            </span>
          </div>
          <div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8"
            style={{
              border: "1px solid var(--border-default)",
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
            }}
          >
            {aqiData.map((r, i) => (
              <div
                key={r.city}
                style={{
                  background: "var(--bg-surface)",
                  padding: "12px 10px",
                  textAlign: "center",
                  borderRight:
                    i < aqiData.length - 1
                      ? "1px solid var(--border-default)"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 26,
                    fontWeight: 600,
                    lineHeight: 1,
                    color: r.aqi_color,
                    marginBottom: 6,
                  }}
                >
                  {r.aqi}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    color: "var(--text-secondary)",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {r.city}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    marginTop: 4,
                    color: r.aqi_color,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {r.aqi <= 50
                    ? "Good"
                    : r.aqi <= 100
                      ? "Moderate"
                      : r.aqi <= 150
                        ? "USG"
                        : "Unhealthy"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Map Controls ── */}
      <div
        className="animate-section"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* Segmented control */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-overlay, rgba(0,0,0,0.3))",
            borderRadius: "var(--r-sm)",
            padding: 2,
          }}
        >
          {(
            [
              { key: "waste", label: `Waste Sites (${filteredSites.length})` },
              { key: "aqi", label: `Air Quality (${aqiData.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMapLayer(tab.key)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                padding: "7px 16px",
                borderRadius: "var(--r-sm)",
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
                background:
                  mapLayer === tab.key ? "var(--bg-surface)" : "transparent",
                color:
                  mapLayer === tab.key
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Site type filter */}
        {mapLayer === "waste" && (
          <select
            value={siteTypeFilter}
            onChange={(e) => setSiteTypeFilter(e.target.value)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.06em",
              padding: "8px 28px 8px 12px",
              borderRadius: "var(--r-md)",
              border: "1px solid var(--border-default)",
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              outline: "none",
              appearance: "none",
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%237da87d'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            <option value="">ALL TYPES ({wasteSitesData.length})</option>
            {Object.entries(siteTypeCounts).map(([type, count]) => (
              <option key={type} value={type}>
                {type.toUpperCase()} ({count})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── Map ── */}
      <div
        className="animate-section"
        style={{
          height: 550,
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
          border: "1px solid var(--border-default)",
          marginBottom: 24,
        }}
      >
        <PollutionMap
          layer={mapLayer}
          aqiReadings={aqiData}
          wasteSites={filteredSites}
        />
      </div>

      {/* ── Waste Site Legend (pin dots) ── */}
      <div
        className="animate-section"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {Object.entries(siteTypeDots).map(([type, color]) => (
          <div
            key={type}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--text-secondary)",
                letterSpacing: "0.04em",
              }}
            >
              {type}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--text-muted)",
              }}
            >
              ({siteTypeCounts[type] || 0})
            </span>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-muted)",
          lineHeight: 1.7,
        }}
      >
        AQI Source: AQICN.org (demo token). Waste Sites Source: OpenStreetMap
        Overpass API (1,590 sites in PH, {wasteSitesData.length} in NCR).
        <br />
        Run <code style={{ color: "var(--text-secondary)" }}>
          npm run scrape:aqi
        </code>{" "}
        and{" "}
        <code style={{ color: "var(--text-secondary)" }}>
          npm run scrape:dumpsites
        </code>{" "}
        to refresh.
      </p>
    </div>
  );
}
