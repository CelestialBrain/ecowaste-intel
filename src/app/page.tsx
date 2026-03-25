"use client";

import StatStrip from "@/components/StatCard";
import { junkshopsData } from "@/data/junkshops";
import { materialsData } from "@/data/materials";
import { eprCompaniesData } from "@/data/epr-companies";
import { grantsData } from "@/data/grants";
import { activitiesData } from "@/data/activities";
import { billsData } from "@/data/bills";
import { aqiData, wasteSitesData } from "@/data/pollution";
import { lguData, NCR_STATS } from "@/data/lgu";
import { MapPin, TrendingUp, Building2, HandCoins, Activity, Scale, Wind, Landmark } from "lucide-react";

export default function Home() {
  const totalJunkshops = junkshopsData.length;

  const highestMargin = materialsData.reduce((best, m) => {
    const margin = m.sell_price_php_per_kg - m.buy_price_php_per_kg;
    const bestMargin = best.sell_price_php_per_kg - best.buy_price_php_per_kg;
    return margin > bestMargin ? m : best;
  }, materialsData[0]);

  const eprCount = eprCompaniesData.length;
  const openGrants = grantsData.filter(
    (g) => g.status === "Active" || g.status === "Open" || g.status === "Rolling"
  ).length;
  const activeProjects = activitiesData.filter(
    (a) => a.status === "Active"
  ).length;
  const highRelevanceBills = billsData.filter((b) => b.relevance === "High").length;
  const avgAqi = aqiData.length
    ? Math.round(aqiData.reduce((sum, r) => sum + r.aqi, 0) / aqiData.length)
    : 0;
  const wasteSiteCount = wasteSitesData.length;

  const quickLinks = [
    {
      href: "/junkshops",
      title: "Junkshop Directory",
      desc: "Interactive NCR map with searchable junkshop listings",
      icon: MapPin,
    },
    {
      href: "/materials",
      title: "Material Prices",
      desc: "Scrap material buy/sell price tracker with margins",
      icon: TrendingUp,
    },
    {
      href: "/epr",
      title: "EPR Companies",
      desc: "RA 11898 obliged enterprises and partnership leads",
      icon: Building2,
    },
    {
      href: "/grants",
      title: "Grant Opportunities",
      desc: "Funding sources, deadlines, and application details",
      icon: HandCoins,
    },
    {
      href: "/policy",
      title: "Policy Radar",
      desc: "Philippine bills and laws affecting environmental policy",
      icon: Scale,
    },
    {
      href: "/pollution",
      title: "Pollution Monitor",
      desc: `AQI tracking + ${wasteSiteCount} waste sites mapped in NCR`,
      icon: Wind,
    },
    {
      href: "/lgu",
      title: "LGU Compliance",
      desc: `${lguData.length} NCR LGUs — RA 9003 compliance gap + revenue calculator`,
      icon: Landmark,
    },
    {
      href: "/pulse",
      title: "EcoWaste Pulse",
      desc: "Organizational activity tracker and project timeline",
      icon: Activity,
    },
  ];

  return (
    <div>
      {/* Banner */}
      <div
        className="animate-section"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--r-sm)",
          padding: "14px 20px",
          marginBottom: 32,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          BUILT BY BCG &middot; BLUE CONSULTING GROUP &middot; ATENEO DE MANILA UNIVERSITY
        </p>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            color: "var(--text-muted)",
            margin: "4px 0 0 0",
          }}
        >
          Research support for EcoWaste Coalition
        </p>
      </div>

      {/* Editorial Header */}
      <div
        className="animate-section"
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-default)",
          paddingBottom: 12,
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 400,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Dashboard Overview
        </h1>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: "0.06em",
          }}
        >
          ECOWASTE INTEL v1.0
        </span>
      </div>

      {/* Summary Stats — StatStrip */}
      <div className="animate-section" style={{ marginBottom: 40 }}>
        <StatStrip
          cells={[
            {
              value: `${totalJunkshops}`,
              label: "Junkshops Mapped",
              delta: `~${NCR_STATS.estimated_junkshops_ncr.toLocaleString()} estimated total`,
              deltaColor: "up",
              accent: "live",
            },
            {
              value: highestMargin.short_name,
              label: "Highest Margin",
              delta: `PHP ${highestMargin.sell_price_php_per_kg - highestMargin.buy_price_php_per_kg}/kg spread`,
              deltaColor: "up",
              accent: "live",
            },
            {
              value: eprCount,
              label: "EPR Companies",
              delta: "Tracked",
              deltaColor: "muted",
            },
            {
              value: openGrants,
              label: "Open Grants",
              delta: "Active / Rolling",
              deltaColor: "warn",
              accent: "warn",
            },
          ]}
        />
        <div style={{ marginTop: 8 }}>
          <StatStrip
            cells={[
              {
                value: activeProjects,
                label: "Active Projects",
                delta: "EcoWaste programs",
                deltaColor: "muted",
              },
              {
                value: highRelevanceBills,
                label: "Policy Bills",
                delta: "High relevance",
                deltaColor: "down",
                accent: "alert",
              },
              {
                value: avgAqi || "N/A",
                label: "NCR AQI",
                delta: avgAqi > 100 ? "Unhealthy" : avgAqi > 50 ? "Moderate" : "Good",
                deltaColor: avgAqi > 100 ? "down" : avgAqi > 50 ? "warn" : "up",
                accent: avgAqi > 100 ? "alert" : avgAqi > 50 ? "warn" : "live",
              },
              {
                value: `${NCR_STATS.ncr_mrf_compliance_pct}%`,
                label: "NCR MRF Compliance",
                delta: `${NCR_STATS.ncr_barangays_with_mrf} of ${NCR_STATS.ncr_barangays_total.toLocaleString()} barangays`,
                deltaColor: "down",
                accent: "alert",
              },
            ]}
          />
        </div>
      </div>

      {/* Quick Access — Data Table */}
      <div className="animate-section">
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
            Quick Access
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.06em",
            }}
          >
            {quickLinks.length} MODULES
          </span>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <th
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  textAlign: "left",
                  padding: "10px 12px",
                }}
              >
                Module
              </th>
              <th
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  textAlign: "left",
                  padding: "10px 12px",
                }}
              >
                Description
              </th>
              <th
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  textAlign: "right",
                  padding: "10px 12px",
                  width: 80,
                }}
              >
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            {quickLinks.map((link) => (
              <tr
                key={link.href}
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
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <link.icon
                      size={14}
                      style={{ color: "var(--accent)", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {link.title}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    padding: "12px",
                  }}
                >
                  {link.desc}
                </td>
                <td style={{ padding: "12px", textAlign: "right" }}>
                  <a
                    href={link.href}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderRadius: "var(--r-sm)",
                      border: "1px solid var(--border-default)",
                      padding: "5px 12px",
                      display: "inline-block",
                      transition: "border-color 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border-default)")
                    }
                  >
                    OPEN
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
