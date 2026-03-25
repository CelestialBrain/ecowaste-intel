"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Junkshop } from "@/lib/types";
import { useTheme } from "@/components/ThemeProvider";

const createIcon = (color: string) =>
  new L.DivIcon({
    html: `<div style="background:${color};width:10px;height:10px;border-radius:50%;box-shadow:0 0 6px ${color}44;border:1.5px solid ${color}"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const statusColors: Record<Junkshop["status"], string> = {
  "Accredited MRF": "#16a34a",
  "Semi-formal": "#2563eb",
  Informal: "#9ca3af",
};

interface Props {
  junkshops: Junkshop[];
  selected: Junkshop | null;
  onSelect: (j: Junkshop) => void;
}

export default function JunkshopMap({ junkshops, selected, onSelect }: Props) {
  const center: [number, number] = [14.5995, 120.9842];
  const { theme } = useTheme();

  const tileUrl = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer center={center} zoom={11} className="w-full h-full" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url={tileUrl}
      />
      {junkshops.map((j) => (
        <Marker
          key={j.id}
          position={[j.lat, j.lng]}
          icon={createIcon(selected?.id === j.id ? "#d97706" : statusColors[j.status])}
          eventHandlers={{ click: () => onSelect(j) }}
        >
          <Popup>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 13 }}>
              <p style={{ fontWeight: 500, color: "var(--text-primary)", marginBottom: 2 }}>{j.name}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>{j.barangay ? `${j.barangay}, ` : ""}{j.area}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>{j.materials.join(" · ")}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
