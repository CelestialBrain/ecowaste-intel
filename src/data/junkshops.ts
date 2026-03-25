import { Junkshop } from "@/lib/types";

// Auto-generated from Google Maps Places API scrape (March 2026)
// 336 junkshops across NCR — run `npm run scrape:junkshops` to refresh

/* eslint-disable @typescript-eslint/no-var-requires */
import rawData from "../../scrapers/data/ncr_junkshops.json";

const ncrCities = [
  "Quezon City", "Caloocan", "Las Piñas", "Las Pinas", "Makati", "Malabon",
  "Mandaluyong", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Paranaque",
  "Pasay", "Pasig", "Pateros", "San Juan", "Taguig", "Valenzuela",
  "Tondo", "Sampaloc", "Sta. Cruz", "Quiapo", "Ermita", "Malate",
  "Manila",
];

function extractCity(address: string): string {
  for (const city of ncrCities) {
    if (address.includes(city)) {
      if (["Las Piñas"].includes(city)) return "Las Pinas";
      if (["Parañaque"].includes(city)) return "Paranaque";
      if (["Tondo", "Sampaloc", "Sta. Cruz", "Quiapo", "Ermita", "Malate"].includes(city))
        return "Manila";
      return city;
    }
  }
  return "Metro Manila";
}

interface RawJunkshop {
  id: string;
  name: string;
  area: string;
  barangay: string;
  lat: number;
  lng: number;
  materials: string[];
  status: string;
  source: string;
  phone: string;
  rating: number | null;
  address: string;
  place_id: string;
}

export const junkshopsData: Junkshop[] = (rawData.junkshops as RawJunkshop[]).map((j) => ({
  id: j.id,
  name: j.name,
  area: extractCity(j.address || ""),
  barangay: j.barangay || "",
  lat: j.lat,
  lng: j.lng,
  materials: j.materials,
  status: j.status as Junkshop["status"],
  source: j.source as Junkshop["source"],
  phone: j.phone || undefined,
  rating: j.rating || undefined,
}));
