"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { junkshopsData } from "@/data/junkshops";
import { eprCompaniesData } from "@/data/epr-companies";
import { wasteSitesData } from "@/data/pollution";
import { grantsData } from "@/data/grants";

const dataModules = [
  { href: "/junkshops", label: "Junkshop Directory", count: junkshopsData.length, live: true },
  { href: "/materials", label: "Material Prices", live: false },
  { href: "/epr", label: "EPR Companies", count: eprCompaniesData.length, live: false },
  { href: "/grants", label: "Grant Opportunities", count: grantsData.length, live: false },
];

const intelligence = [
  { href: "/pollution", label: "Pollution Monitor", count: wasteSitesData.length, live: true },
  { href: "/policy", label: "Policy Radar", live: false },
  { href: "/pulse", label: "EcoWaste Pulse", live: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const NavItem = ({ href, label, count, live }: { href: string; label: string; count?: number; live?: boolean }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="group relative flex items-center gap-2.5 py-2 text-[13px]"
      style={{
        fontFamily: "var(--font-ui)",
        color: isActive(href) ? "var(--accent)" : "var(--text-secondary)",
        background: isActive(href) ? "var(--accent-glow)" : "transparent",
        paddingLeft: 20,
        paddingRight: 16,
      }}
    >
      {isActive(href) && (
        <span
          className="absolute left-0 top-1 bottom-1 w-0.5"
          style={{ background: "var(--accent)", borderRadius: "0 2px 2px 0" }}
        />
      )}
      <span
        className="flex-shrink-0"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: live ? "var(--accent)" : "var(--border-default)",
          boxShadow: live ? "0 0 6px var(--accent)" : "none",
        }}
      />
      <span className="flex-1 truncate group-hover:opacity-80 transition-opacity">{label}</span>
      {count !== undefined && (
        <span
          className="flex-shrink-0"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            padding: "1px 6px",
            borderRadius: 3,
            color: "var(--text-muted)",
            background: "var(--bg-elevated)",
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-4"
        style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
          EcoWaste Intel
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--r-sm)",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            {theme === "light" ? "DARK" : "LIGHT"}
          </button>
          <button onClick={() => setOpen(!open)} style={{ color: "var(--text-secondary)" }}>
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-transform duration-200 md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-auto md:flex-shrink-0 overflow-hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          width: 230,
          minWidth: 230,
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-default)",
        }}
      >
        {/* Logo */}
        <div className="px-5 pt-4 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <Link href="/" onClick={() => setOpen(false)}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
              EcoWaste Intel
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.1em", marginTop: 2 }}>
              BCG × EcoWaste Coalition
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {/* Dashboard */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="relative flex items-center gap-2.5 py-2 text-[13px]"
            style={{
              fontFamily: "var(--font-ui)",
              color: pathname === "/" ? "var(--accent)" : "var(--text-secondary)",
              background: pathname === "/" ? "var(--accent-glow)" : "transparent",
              paddingLeft: 20,
              paddingRight: 16,
            }}
          >
            {pathname === "/" && (
              <span className="absolute left-0 top-1 bottom-1 w-0.5" style={{ background: "var(--accent)", borderRadius: "0 2px 2px 0" }} />
            )}
            <span className="flex-shrink-0" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
            Overview
          </Link>

          {/* Data Modules */}
          <div
            className="px-5 pt-4 pb-1"
            style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}
          >
            Data Modules
          </div>
          {dataModules.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}

          {/* Intelligence */}
          <div
            className="px-5 pt-4 pb-1"
            style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}
          >
            Intelligence
          </div>
          {intelligence.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        {/* Bottom: theme toggle + attribution */}
        <div className="px-5 py-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <button
            onClick={toggle}
            className="w-full mb-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "var(--text-secondary)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--r-sm)",
              padding: "6px 0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {theme === "light" ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                DARK MODE
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                LIGHT MODE
              </>
            )}
          </button>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
            Ateneo de Manila University
          </p>
        </div>
      </aside>

      {/* Mobile bottom tabs */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)" }}
      >
        {[
          { href: "/", label: "Home" },
          { href: "/junkshops", label: "Map" },
          { href: "/materials", label: "Prices" },
          { href: "/pollution", label: "AQI" },
          { href: "/pulse", label: "Pulse" },
        ].map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="flex-1 flex flex-col items-center py-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.05em",
              color: isActive(t.href) ? "var(--accent)" : "var(--text-muted)",
            }}
          >
            <span
              className="w-1 h-1 rounded-full mb-1"
              style={{
                background: isActive(t.href) ? "var(--accent)" : "transparent",
                boxShadow: isActive(t.href) ? "0 0 4px var(--accent)" : "none",
              }}
            />
            {t.label}
          </Link>
        ))}
      </div>
    </>
  );
}
