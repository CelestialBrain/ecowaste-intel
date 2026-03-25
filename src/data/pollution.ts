export interface AQIReading {
  city: string;
  aqi: number;
  aqi_level: string;
  aqi_color: string;
  dominant_pollutant: string | null;
  pm25: number | null;
  pm10: number | null;
  lat: number | null;
  lng: number | null;
  last_updated: string | null;
}

export interface WasteSite {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "Landfill" | "Recycling Center" | "Waste Disposal" | "Wastewater Plant" | "Scrap Yard";
  source: string;
}

// Load real AQI data from scraper output
let aqiRaw: { city_readings: Array<{
  city: string; aqi: number; aqi_level: string; aqi_color: string;
  dominant_pollutant: string | null; pollutants: { pm25: number | null; pm10: number | null };
  lat: number | null; lng: number | null; last_updated: string | null;
}> } = { city_readings: [] };

try {
  aqiRaw = require("../../scrapers/data/air_quality.json");
} catch {
  // Scraper hasn't been run yet — use empty
}

export const aqiData: AQIReading[] = (aqiRaw.city_readings || []).map((r) => ({
  city: r.city,
  aqi: r.aqi,
  aqi_level: r.aqi_level,
  aqi_color: r.aqi_color,
  dominant_pollutant: r.dominant_pollutant,
  pm25: r.pollutants?.pm25 || null,
  pm10: r.pollutants?.pm10 || null,
  lat: r.lat,
  lng: r.lng,
  last_updated: r.last_updated,
}));

// Load real dump site data from scraper output
let dumpRaw: { ncr_only: Array<{
  id: string; name: string; lat: number; lng: number; type: string; source: string;
}> } = { ncr_only: [] };

try {
  dumpRaw = require("../../scrapers/data/dump_sites.json");
} catch {
  // Scraper hasn't been run yet
}

export const wasteSitesData: WasteSite[] = (dumpRaw.ncr_only || []).map((s) => ({
  id: s.id,
  name: s.name,
  lat: s.lat,
  lng: s.lng,
  type: s.type as WasteSite["type"],
  source: s.source,
}));
