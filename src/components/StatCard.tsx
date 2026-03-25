// StatStrip — replaces card grid with editorial stat cells
// Accent top border: "live" = green, "warn" = amber, "alert" = red, default = neutral

interface StatCell {
  value: string | number;
  label: string;
  delta?: string;
  deltaColor?: "up" | "down" | "warn" | "muted";
  accent?: "live" | "warn" | "alert";
}

interface StatStripProps {
  cells: StatCell[];
}

const accentColors = {
  live: "var(--accent)",
  warn: "var(--data-amber)",
  alert: "var(--data-red)",
};

const deltaColors = {
  up: "var(--accent)",
  down: "var(--data-red)",
  warn: "var(--data-amber)",
  muted: "var(--text-muted)",
};

export default function StatStrip({ cells }: StatStripProps) {
  return (
    <div
      className="grid border overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${Math.min(cells.length, 4)}, 1fr)`,
        borderColor: "var(--border-default)",
        borderRadius: "var(--r-lg)",
      }}
    >
      {cells.map((cell, i) => (
        <div
          key={i}
          className="relative px-5 py-4 md:px-6 md:py-5"
          style={{
            borderRight: i < cells.length - 1 ? "1px solid var(--border-default)" : "none",
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{
              background: cell.accent
                ? accentColors[cell.accent]
                : "var(--border-subtle)",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 28,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            {cell.value}
          </div>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              color: "var(--text-secondary)",
              fontWeight: 300,
            }}
          >
            {cell.label}
          </div>
          {cell.delta && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                marginTop: 8,
                color: deltaColors[cell.deltaColor || "muted"],
              }}
            >
              {cell.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Re-export as default for backward compat - but also export the old interface
// so pages that import StatCard don't break during migration
export function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string; icon?: unknown; color?: string }) {
  return (
    <div className="relative px-5 py-4" style={{ border: "1px solid var(--border-default)", borderRadius: "var(--r-lg)" }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "var(--border-subtle)" }} />
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-secondary)", fontWeight: 300 }}>{title}</div>
      {subtitle && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>{subtitle}</div>}
    </div>
  );
}
