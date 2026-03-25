"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AQIReading, WasteSite } from "@/data/pollution";
import { useTheme } from "@/components/ThemeProvider";

const siteColors: Record<string, string> = {
  Landfill: "#d97706",
  "Recycling Center": "#16a34a",
  "Waste Disposal": "#dc2626",
  "Wastewater Plant": "#2563eb",
  "Scrap Yard": "#7c3aed",
};

interface Props {
  layer: "aqi" | "waste";
  aqiReadings: AQIReading[];
  wasteSites: WasteSite[];
}

export default function PollutionMap({ layer, aqiReadings, wasteSites }: Props) {
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
      {layer === "aqi" &&
        aqiReadings
          .filter((r) => r.lat && r.lng)
          .map((r) => (
            <CircleMarker
              key={r.city}
              center={[r.lat!, r.lng!]}
              radius={18}
              fillColor={r.aqi_color}
              fillOpacity={0.5}
              color={r.aqi_color}
              weight={1.5}
            >
              <Popup>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 13 }}>
                  <p style={{ fontWeight: 500, color: "var(--text-primary)" }}>{r.city}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: r.aqi_color }}>AQI {r.aqi} — {r.aqi_level}</p>
                  {r.pm25 && <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>PM2.5: {r.pm25}</p>}
                </div>
              </Popup>
            </CircleMarker>
          ))}
      {layer === "waste" &&
        wasteSites
          .filter((s) => s.lat && s.lng)
          .map((s) => (
            <CircleMarker
              key={s.id}
              center={[s.lat, s.lng]}
              radius={4}
              fillColor={siteColors[s.type] || "#9ca3af"}
              fillOpacity={0.6}
              color={siteColors[s.type] || "#9ca3af"}
              weight={1}
            >
              <Popup>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 13 }}>
                  <p style={{ fontWeight: 500, color: "var(--text-primary)" }}>{s.name}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>{s.type}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
    </MapContainer>
  );
}
