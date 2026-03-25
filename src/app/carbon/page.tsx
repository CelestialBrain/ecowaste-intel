"use client";

import { useState } from "react";
import { PLASTIC_CREDITS, materialsData } from "@/data/materials";
import StatStrip from "@/components/StatCard";

export default function CarbonPage() {
  // ── State for calculator ──
  const [volume, setVolume] = useState(50);
  const [creditType, setCreditType] = useState<"floor" | "premium">("floor");
  const [includeVerra, setIncludeVerra] = useState(false);

  // ── Derived calculator values ──
  const ratePerTon =
    creditType === "floor"
      ? PLASTIC_CREDITS.pcx_floor_usd_per_ton
      : PLASTIC_CREDITS.pcx_premium_usd_per_ton;
  const ratePerKg =
    creditType === "floor"
      ? PLASTIC_CREDITS.pcx_floor_php_per_kg
      : PLASTIC_CREDITS.pcx_premium_php_per_kg;

  const monthlyRevenuePHP = volume * 1000 * ratePerKg;
  const annualRevenuePHP = monthlyRevenuePHP * 12;
  const verraCostPHP =
    PLASTIC_CREDITS.verra_registration_cost_usd * PLASTIC_CREDITS.php_usd_rate;
  const netYear1 = includeVerra ? annualRevenuePHP - verraCostPHP : annualRevenuePHP;
  const breakEvenMonth =
    includeVerra && monthlyRevenuePHP > 0
      ? Math.ceil(verraCostPHP / monthlyRevenuePHP)
      : 0;

  // ── PET Credit Uplift data ──
  const petClean = materialsData.find((m) => m.short_name === "PET-C")!;
  const hdpe = materialsData.find((m) => m.short_name === "HDPE")!;

  const petCreditPerKg = PLASTIC_CREDITS.pcx_floor_php_per_kg;
  const petTotal = petClean.sell_price_php_per_kg + petCreditPerKg;
  const petUpliftPct = ((petCreditPerKg / petClean.sell_price_php_per_kg) * 100).toFixed(1);

  const hdpeCreditPerKg = PLASTIC_CREDITS.pcx_floor_php_per_kg;
  const hdpeTotal = hdpe.sell_price_php_per_kg + hdpeCreditPerKg;
  const hdpeUpliftPct = ((hdpeCreditPerKg / hdpe.sell_price_php_per_kg) * 100).toFixed(1);

  // ── Formatters ──
  const fmt = (n: number) =>
    n.toLocaleString("en-PH", { maximumFractionDigits: 0 });
  const fmtPHP = (n: number) => `₱${fmt(n)}`;

  // ── Shared styles ──
  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "var(--text-primary)",
    background: "var(--bg-surface)",
    border: "1px solid var(--border-default)",
    borderRadius: "var(--r-sm)",
    padding: "8px 12px",
    width: "100%",
    outline: "none",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 32,
    cursor: "pointer",
    fontSize: 11,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-ui)",
    fontSize: 12,
    color: "var(--text-secondary)",
    marginBottom: 6,
    display: "block",
  };

  const sectionHeader: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: 0,
  };

  return (
    <div>
      {/* ─── 1. Editorial Header ─── */}
      <div
        className="animate-section"
        style={{
          borderBottom: "1px solid var(--border-default)",
          paddingBottom: 12,
          marginBottom: 24,
        }}
      >
        <h1 style={sectionHeader}>Carbon & Credit Calculator</h1>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            color: "var(--text-secondary)",
            margin: "4px 0 0 0",
          }}
        >
          Estimate revenue from plastic credits and carbon offsets
        </p>
      </div>

      {/* ─── 2. Stat Strip ─── */}
      <div className="animate-section" style={{ marginBottom: 32 }}>
        <StatStrip
          cells={[
            {
              value: `$${PLASTIC_CREDITS.pcx_floor_usd_per_ton}/ton`,
              label: "PCX Floor",
              delta: `₱${PLASTIC_CREDITS.pcx_floor_php_per_kg}/kg`,
              deltaColor: "muted",
              accent: "live",
            },
            {
              value: `$${PLASTIC_CREDITS.pcx_premium_usd_per_ton}/ton`,
              label: "PCX Premium",
              delta: `₱${PLASTIC_CREDITS.pcx_premium_php_per_kg}/kg`,
              deltaColor: "up",
              accent: "live",
            },
            {
              value: `$${PLASTIC_CREDITS.verra_registration_cost_usd.toLocaleString()}`,
              label: "Verra Registration Cost",
              accent: "warn",
            },
            {
              value: `${PLASTIC_CREDITS.verra_breakeven_tons} tons`,
              label: "Break-even Volume",
              accent: "alert",
            },
          ]}
        />
      </div>

      {/* ─── 3. Interactive Calculator ─── */}
      <div className="animate-section" style={{ marginBottom: 40 }}>
        <div
          style={{
            borderBottom: "1px solid var(--border-default)",
            paddingBottom: 10,
            marginBottom: 16,
          }}
        >
          <h2 style={sectionHeader}>Interactive Calculator</h2>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-secondary)",
              margin: "4px 0 0 0",
            }}
          >
            Adjust inputs to model your credit revenue scenario
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          {/* Input Panel */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--r-lg)",
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 500,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 20,
              }}
            >
              Inputs
            </div>

            {/* Volume */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Monthly collection volume (tons)</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(Math.max(0, Number(e.target.value)))}
                style={inputStyle}
                min={0}
              />
            </div>

            {/* Credit type */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Credit type</label>
              <select
                value={creditType}
                onChange={(e) =>
                  setCreditType(e.target.value as "floor" | "premium")
                }
                style={selectStyle}
              >
                <option value="floor">
                  PCX Floor (${PLASTIC_CREDITS.pcx_floor_usd_per_ton}/ton)
                </option>
                <option value="premium">
                  PCX Premium (${PLASTIC_CREDITS.pcx_premium_usd_per_ton}/ton)
                </option>
              </select>
            </div>

            {/* Verra checkbox */}
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={includeVerra}
                  onChange={(e) => setIncludeVerra(e.target.checked)}
                  style={{
                    width: 16,
                    height: 16,
                    accentColor: "var(--accent)",
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                  }}
                >
                  Include Verra registration cost
                </span>
              </label>
            </div>
          </div>

          {/* Output Panel */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--r-lg)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 500,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Projected Revenue
            </div>

            {/* Monthly revenue */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                Monthly Revenue
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 32,
                  fontWeight: 600,
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                {fmtPHP(monthlyRevenuePHP)}
              </div>
            </div>

            {/* Annual revenue */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                Annual Revenue
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 28,
                  fontWeight: 600,
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                {fmtPHP(annualRevenuePHP)}
              </div>
            </div>

            {/* Verra cost deduction */}
            {includeVerra && (
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginBottom: 4,
                  }}
                >
                  Verra Cost Deduction
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    color: "var(--text-secondary)",
                    lineHeight: 1,
                  }}
                >
                  -{fmtPHP(verraCostPHP)}
                </div>
              </div>
            )}

            {/* Net Year 1 */}
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                Net Year 1
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 28,
                  fontWeight: 600,
                  color: netYear1 >= 0 ? "var(--accent)" : "var(--data-red)",
                  lineHeight: 1,
                }}
              >
                {fmtPHP(netYear1)}
              </div>
            </div>

            {/* Break-even month */}
            {includeVerra && breakEvenMonth > 0 && (
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginBottom: 4,
                  }}
                >
                  Break-even Month
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    color: "var(--text-secondary)",
                    lineHeight: 1,
                  }}
                >
                  Month {breakEvenMonth}
                </div>
              </div>
            )}

            {/* Per-kg additional value */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                Per-kg Additional Value
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                +₱{ratePerKg}/kg
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. PET Credit Uplift ─── */}
      <div className="animate-section" style={{ marginBottom: 40 }}>
        <div
          style={{
            borderBottom: "1px solid var(--border-default)",
            paddingBottom: 10,
            marginBottom: 16,
          }}
        >
          <h2 style={sectionHeader}>PET Credit Uplift</h2>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-secondary)",
              margin: "4px 0 0 0",
            }}
          >
            Revenue stacking: raw material sale + plastic credit per kilogram
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {/* PET Clean Panel */}
          <div
            style={{
              background: "var(--bg-elevated)",
              borderTop: "2px solid var(--accent)",
              border: "1px solid var(--border-default)",
              borderTopWidth: 2,
              borderTopColor: "var(--accent)",
              borderRadius: "var(--r-lg)",
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--text-muted)",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--r-sm)",
                  padding: "2px 6px",
                  letterSpacing: "0.05em",
                }}
              >
                PET-C
              </span>
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                PET Clean
              </span>
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 2,
              }}
            >
              <div>
                Raw sale{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  ₱{petClean.sell_price_php_per_kg}/kg
                </span>
              </div>
              <div>
                + Credit{" "}
                <span style={{ color: "var(--data-blue)", fontWeight: 600 }}>
                  ₱{petCreditPerKg}/kg
                </span>
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: 8,
                  marginTop: 4,
                }}
              >
                ={" "}
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  ₱{petTotal.toFixed(2)}/kg
                </span>{" "}
                total
              </div>
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--accent)",
                marginTop: 12,
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--r-sm)",
                padding: "8px 12px",
                textAlign: "center",
              }}
            >
              +{petUpliftPct}% uplift
            </div>
          </div>

          {/* HDPE Panel */}
          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderTopWidth: 2,
              borderTopColor: "var(--accent)",
              borderRadius: "var(--r-lg)",
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--text-muted)",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--r-sm)",
                  padding: "2px 6px",
                  letterSpacing: "0.05em",
                }}
              >
                HDPE
              </span>
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                HDPE Rigid
              </span>
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 2,
              }}
            >
              <div>
                Raw sale{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  ₱{hdpe.sell_price_php_per_kg}/kg
                </span>
              </div>
              <div>
                + Credit{" "}
                <span style={{ color: "var(--data-blue)", fontWeight: 600 }}>
                  ₱{hdpeCreditPerKg}/kg
                </span>
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: 8,
                  marginTop: 4,
                }}
              >
                ={" "}
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  ₱{hdpeTotal.toFixed(2)}/kg
                </span>{" "}
                total
              </div>
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--accent)",
                marginTop: 12,
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--r-sm)",
                padding: "8px 12px",
                textAlign: "center",
              }}
            >
              +{hdpeUpliftPct}% uplift
            </div>
          </div>
        </div>
      </div>

      {/* ─── 5. How It Works ─── */}
      <div className="animate-section" style={{ marginBottom: 40 }}>
        <div
          style={{
            borderBottom: "1px solid var(--border-default)",
            paddingBottom: 10,
            marginBottom: 16,
          }}
        >
          <h2 style={sectionHeader}>How It Works</h2>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-secondary)",
              margin: "4px 0 0 0",
            }}
          >
            From collection to credit sale in four steps
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
          }}
        >
          {[
            {
              step: 1,
              label: "COLLECT",
              desc: "Aggregate plastic waste through junkshop network and community collection drives.",
            },
            {
              step: 2,
              label: "VERIFY",
              desc: "Weigh, sort, and document material type and volume with auditable chain of custody.",
            },
            {
              step: 3,
              label: "REGISTER",
              desc: "Submit verified collection data to Verra or PCX registry for credit issuance.",
            },
            {
              step: 4,
              label: "SELL",
              desc: "Trade issued credits on open market or through corporate offset agreements.",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              style={{
                padding: 24,
                borderRight:
                  i < 3 ? "1px solid var(--border-default)" : "none",
                position: "relative",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 32,
                  fontWeight: 700,
                  color: "var(--accent)",
                  lineHeight: 1,
                  marginBottom: 12,
                  opacity: 0.7,
                }}
              >
                {String(item.step).padStart(2, "0")}
              </div>

              {/* Label */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                {item.label}
              </div>

              {/* Description */}
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {item.desc}
              </div>

              {/* Arrow connector (except last) */}
              {i < 3 && (
                <div
                  style={{
                    position: "absolute",
                    right: -7,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    color: "var(--text-muted)",
                    zIndex: 1,
                    background: "var(--bg-surface)",
                    padding: "2px 0",
                  }}
                >
                  {"\u2192"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Footer source line ─── */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-muted)",
          marginTop: 0,
          letterSpacing: "0.04em",
        }}
      >
        Source: PCX Exchange, Verra Registry. Rates as of Q1 2026. PHP/USD = {PLASTIC_CREDITS.php_usd_rate}.
      </p>
    </div>
  );
}
