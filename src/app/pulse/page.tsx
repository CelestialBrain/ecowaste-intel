"use client";

import { useState, useMemo } from "react";
import { activitiesData } from "@/data/activities";
import { cn, exportToCSV } from "@/lib/utils";
import StatStrip from "@/components/StatCard";
import {
  Download,
  ExternalLink,
  Users,
  DollarSign,
  Globe,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

/* ── Badge color maps (dark design system) ── */
const typeBadgeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Campaign:        { bg: "rgba(96,165,250,0.12)", text: "var(--data-blue)",   dot: "var(--data-blue)" },
  Project:         { bg: "rgba(74,222,128,0.12)", text: "var(--accent)",      dot: "var(--accent)" },
  "Policy Win":    { bg: "rgba(167,139,250,0.12)",text: "var(--data-purple)", dot: "var(--data-purple)" },
  "Media Mention": { bg: "rgba(251,191,36,0.12)", text: "var(--data-amber)",  dot: "var(--data-amber)" },
  Partnership:     { bg: "rgba(74,222,128,0.08)", text: "var(--accent)",      dot: "var(--accent)" },
};

const statusBadgeStyles: Record<string, { bg: string; text: string; glow?: string }> = {
  Active:    { bg: "rgba(74,222,128,0.12)", text: "var(--accent)",     glow: "0 0 8px rgba(74,222,128,0.4)" },
  Completed: { bg: "rgba(61,92,61,0.2)",    text: "var(--text-muted)" },
  Upcoming:  { bg: "rgba(96,165,250,0.12)", text: "var(--data-blue)" },
};

/* ── Timeline dot colors ── */
const timelineDotStyle = (status: string) => {
  if (status === "Active")
    return {
      background: "var(--accent)",
      boxShadow: "0 0 8px rgba(74,222,128,0.4)",
    };
  if (status === "Upcoming")
    return {
      background: "var(--data-blue)",
      boxShadow: "none",
    };
  return {
    background: "var(--text-muted)",
    boxShadow: "none",
  };
};

export default function PulsePage() {
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    return activitiesData.filter((a) => {
      const matchesType = !typeFilter || a.type === typeFilter;
      const matchesStatus = !statusFilter || a.status === statusFilter;
      return matchesType && matchesStatus;
    });
  }, [typeFilter, statusFilter]);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
  );

  const activeCount = activitiesData.filter((a) => a.status === "Active").length;
  const completedCount = activitiesData.filter(
    (a) => a.status === "Completed"
  ).length;
  const fundingPartners = new Set(
    activitiesData
      .filter(
        (a) =>
          a.funding_source &&
          a.funding_source !== "TBD" &&
          a.funding_source !== "Self-funded" &&
          a.funding_source !== "Advocacy budget" &&
          a.funding_source !== "Institutional"
      )
      .map((a) => a.funding_source)
  ).size;

  /* ── Filter chip options ── */
  const typeOptions = ["Campaign", "Project", "Policy Win", "Media Mention", "Partnership"];
  const statusOptions = ["Active", "Completed", "Upcoming"];

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
            EcoWaste Pulse
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            Organizational activity tracker and project timeline
          </p>
        </div>
        <button
          onClick={() =>
            exportToCSV(
              filtered.map((a) => ({
                ...a,
                partner_orgs: a.partner_orgs.join("; "),
              })),
              "ecowaste-activities"
            )
          }
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

      {/* ── Org Profile Card ── */}
      <div
        className="animate-section"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--r-lg)",
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {/* Left: org info */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--accent)",
                lineHeight: 1.2,
              }}
            >
              EcoWaste Coalition
            </h2>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                color: "var(--text-secondary)",
                fontStyle: "italic",
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              &quot;A national ecological network of over 130 public interest groups
              working for sustainable solutions to waste and chemical
              issues.&quot;
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "8px 24px",
                marginTop: 16,
              }}
            >
              {[
                { label: "President", value: "Eileen Belamide-Sison" },
                { label: "Coordinator", value: "Aileen Lucero" },
                { label: "Founded", value: "2000 (SEC: 2005)" },
                { label: "Members", value: "130+ groups" },
              ].map((item) => (
                <div key={item.label} style={{ fontSize: 13 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {item.label}
                  </span>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--text-primary)",
                      marginTop: 2,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: contact details */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minWidth: 240,
            }}
          >
            {[
              {
                icon: <MapPin size={14} />,
                text: "78A Masigla Ext., Diliman, QC 1100",
              },
              { icon: <Phone size={14} />, text: "(02) 8441 1846" },
              {
                icon: <Mail size={14} />,
                text: "inquiries@ecowastecoalition.org",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                  {item.icon}
                </span>
                {item.text}
              </div>
            ))}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
              }}
            >
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                <Globe size={14} />
              </span>
              <a
                href="https://www.ecowastecoalition.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                }}
              >
                ecowastecoalition.org
              </a>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <a
                href="https://www.facebook.com/EWCoalition/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "4px 10px",
                  borderRadius: "var(--r-sm)",
                  background: "rgba(96,165,250,0.12)",
                  color: "var(--data-blue)",
                  textDecoration: "none",
                  border: "none",
                }}
              >
                Facebook
              </a>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "4px 10px",
                  borderRadius: "var(--r-sm)",
                  background: "rgba(61,92,61,0.2)",
                  color: "var(--text-muted)",
                }}
              >
                30.7K followers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Strip ── */}
      <div className="animate-section" style={{ marginBottom: 24 }}>
        <StatStrip
          cells={[
            {
              value: activeCount,
              label: "Active Projects",
              accent: "live",
            },
            {
              value: completedCount,
              label: "Completed",
            },
            {
              value: fundingPartners,
              label: "Funding Partners",
            },
          ]}
        />
      </div>

      {/* ── Filter Chips ── */}
      <div className="animate-section" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 12,
          }}
        >
          {/* Type heading */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              alignSelf: "center",
              marginRight: 4,
            }}
          >
            Type
          </span>
          <button
            onClick={() => setTypeFilter("")}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.06em",
              padding: "5px 14px",
              borderRadius: 100,
              border: "1px solid var(--border-default)",
              cursor: "pointer",
              background: !typeFilter ? "var(--accent)" : "transparent",
              color: !typeFilter ? "var(--bg-base, #090d09)" : "var(--text-secondary)",
            }}
          >
            ALL
          </button>
          {typeOptions.map((t) => {
            const active = typeFilter === t;
            const style = typeBadgeStyles[t];
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(active ? "" : t)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  padding: "5px 14px",
                  borderRadius: 100,
                  border: active
                    ? `1px solid ${style?.text || "var(--border-default)"}`
                    : "1px solid var(--border-default)",
                  cursor: "pointer",
                  background: active ? style?.bg || "transparent" : "transparent",
                  color: active ? style?.text || "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {t.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {/* Status heading */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              alignSelf: "center",
              marginRight: 4,
            }}
          >
            Status
          </span>
          <button
            onClick={() => setStatusFilter("")}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.06em",
              padding: "5px 14px",
              borderRadius: 100,
              border: "1px solid var(--border-default)",
              cursor: "pointer",
              background: !statusFilter ? "var(--accent)" : "transparent",
              color: !statusFilter ? "var(--bg-base, #090d09)" : "var(--text-secondary)",
            }}
          >
            ALL
          </button>
          {statusOptions.map((s) => {
            const active = statusFilter === s;
            const style = statusBadgeStyles[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(active ? "" : s)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  padding: "5px 14px",
                  borderRadius: 100,
                  border: active
                    ? `1px solid ${style?.text || "var(--border-default)"}`
                    : "1px solid var(--border-default)",
                  cursor: "pointer",
                  background: active ? style?.bg || "transparent" : "transparent",
                  color: active ? style?.text || "var(--text-primary)" : "var(--text-secondary)",
                  boxShadow: active && style?.glow ? style.glow : "none",
                }}
              >
                {s.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Activity Timeline ── */}
      <div className="animate-section" style={{ position: "relative" }}>
        {/* Section header */}
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
            Activity Timeline
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
            {sorted.length} {sorted.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 72,
            bottom: 0,
            width: 1,
            background: "var(--border-default)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {sorted.map((a) => {
            const tStyle = typeBadgeStyles[a.type] || {
              bg: "rgba(61,92,61,0.2)",
              text: "var(--text-muted)",
              dot: "var(--text-muted)",
            };
            const sStyle = statusBadgeStyles[a.status] || {
              bg: "rgba(61,92,61,0.2)",
              text: "var(--text-muted)",
            };

            return (
              <div
                key={a.id}
                style={{
                  position: "relative",
                  paddingLeft: 40,
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: 10,
                    top: 18,
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    ...timelineDotStyle(a.status),
                  }}
                />

                {/* Card */}
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--r-lg)",
                    padding: 20,
                  }}
                >
                  {/* Top row: badges + date */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      {/* Type badge */}
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          padding: "3px 10px",
                          borderRadius: "var(--r-sm)",
                          background: tStyle.bg,
                          color: tStyle.text,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: tStyle.dot,
                            display: "inline-block",
                          }}
                        />
                        {a.type}
                      </span>

                      {/* Status badge */}
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          padding: "3px 10px",
                          borderRadius: "var(--r-sm)",
                          background: sStyle.bg,
                          color: sStyle.text,
                          boxShadow: sStyle.glow || "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: sStyle.text,
                            display: "inline-block",
                          }}
                        />
                        {a.status}
                      </span>
                    </div>

                    {/* Date range */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-muted)",
                        letterSpacing: "0.04em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.date_start}
                      {a.date_end ? ` — ${a.date_end}` : " — Present"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: 6,
                      lineHeight: 1.3,
                    }}
                  >
                    {a.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      marginBottom: 14,
                    }}
                  >
                    {a.description}
                  </p>

                  {/* Meta row */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 16,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--text-muted)",
                    }}
                  >
                    {a.partner_orgs.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Users size={12} />
                        <span>{a.partner_orgs.join(", ")}</span>
                      </div>
                    )}
                    {a.funding_source && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <DollarSign size={12} />
                        <span>{a.funding_source}</span>
                      </div>
                    )}
                    <a
                      href={a.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        color: "var(--accent)",
                        textDecoration: "none",
                      }}
                    >
                      <ExternalLink size={12} />
                      Source
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-muted)",
            textAlign: "center",
            padding: "32px 0",
            letterSpacing: "0.06em",
          }}
        >
          NO ACTIVITIES MATCH YOUR FILTERS.
        </p>
      )}

      {/* ── Footer ── */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-muted)",
          marginTop: 24,
          lineHeight: 1.7,
        }}
      >
        Sources: ecowastecoalition.org, Facebook, Gemini research. Last
        updated: March 2026.
      </p>
    </div>
  );
}
