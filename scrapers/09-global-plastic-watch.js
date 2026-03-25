/**
 * Global Plastic Watch — Philippine Dump Site Data
 * Fetches satellite-detected open dump and waste sites in the Philippines
 * from the Global Plastic Watch dataset.
 *
 * Usage: node scrapers/09-global-plastic-watch.js
 * Output: scrapers/data/dump_sites.json
 *
 * Also queries OpenStreetMap Overpass API for tagged waste sites.
 * No API key needed.
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "dump_sites.json");

async function fetchGPW() {
  console.log("--- Global Plastic Watch API ---");

  // GPW provides a public tile/data API for detected waste sites
  // Try the public dataset endpoint
  const urls = [
    "https://globalplasticwatch.org/api/sites?country=PHL",
    "https://globalplasticwatch.org/api/v1/sites?country=Philippines",
    "https://api.globalplasticwatch.org/v1/sites?bbox=116.9,4.5,126.6,21.1",
  ];

  for (const url of urls) {
    try {
      console.log(`  Trying: ${url}`);
      const res = await fetch(url, {
        headers: {
          "User-Agent": "EcoWaste-Intel-Research/1.0",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        console.log(`  -> ${res.status}`);
        continue;
      }

      const data = await res.json();
      if (data && (data.features || data.sites || data.data)) {
        const sites = data.features || data.sites || data.data || [];
        console.log(`  -> Found ${sites.length} sites`);
        return sites.map((s, i) => ({
          id: `gpw-${String(i + 1).padStart(4, "0")}`,
          name: s.properties?.name || s.name || `Waste Site ${i + 1}`,
          lat: s.geometry?.coordinates?.[1] || s.lat || null,
          lng: s.geometry?.coordinates?.[0] || s.lng || null,
          area_sqm: s.properties?.area || s.area || null,
          type: s.properties?.type || "Open Dump",
          confidence: s.properties?.confidence || null,
          detected_date: s.properties?.date || s.detected_date || null,
          source: "Global Plastic Watch",
        }));
      }
    } catch (err) {
      console.log(`  -> Error: ${err.message}`);
    }
  }

  console.log("  GPW API not publicly accessible — using Overpass fallback\n");
  return null;
}

async function fetchOverpassDumpSites() {
  console.log("--- OpenStreetMap Overpass API (Philippine waste sites) ---");

  // Query for landfills, dump sites, and waste facilities in NCR + nearby
  const query = `
    [out:json][timeout:60];
    area["name"="Philippines"]->.ph;
    (
      node["landuse"="landfill"](area.ph);
      way["landuse"="landfill"](area.ph);
      node["man_made"="wastewater_plant"](area.ph);
      way["man_made"="wastewater_plant"](area.ph);
      node["amenity"="waste_disposal"](area.ph);
      way["amenity"="waste_disposal"](area.ph);
      node["amenity"="recycling"](area.ph);
      way["amenity"="recycling"](area.ph);
      node["industrial"="scrap_yard"](area.ph);
      way["industrial"="scrap_yard"](area.ph);
    );
    out center body;
  `;

  try {
    console.log("  Fetching from Overpass API...");
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      console.log(`  -> ${res.status}`);
      return [];
    }

    const data = await res.json();
    const elements = data.elements || [];
    console.log(`  -> Found ${elements.length} waste-related sites`);

    return elements.map((el, i) => {
      const lat = el.lat || el.center?.lat || null;
      const lng = el.lon || el.center?.lon || null;
      const tags = el.tags || {};

      let type = "Unknown";
      if (tags.landuse === "landfill") type = "Landfill";
      else if (tags.man_made === "wastewater_plant") type = "Wastewater Plant";
      else if (tags.amenity === "waste_disposal") type = "Waste Disposal";
      else if (tags.amenity === "recycling") type = "Recycling Center";
      else if (tags.industrial === "scrap_yard") type = "Scrap Yard";

      return {
        id: `osm-${String(i + 1).padStart(4, "0")}`,
        name: tags.name || `${type} (OSM ${el.id})`,
        lat,
        lng,
        area_sqm: null,
        type,
        confidence: null,
        detected_date: null,
        source: "OpenStreetMap",
        osm_id: el.id,
        osm_type: el.type,
        tags,
      };
    });
  } catch (err) {
    console.log(`  -> Error: ${err.message}`);
    return [];
  }
}

// NCR bounding box filter
function isInNCR(lat, lng) {
  if (!lat || !lng) return false;
  return lat >= 14.35 && lat <= 14.75 && lng >= 120.9 && lng <= 121.15;
}

function isInPH(lat, lng) {
  if (!lat || !lng) return false;
  return lat >= 4.5 && lat <= 21.5 && lng >= 116.5 && lng <= 127.0;
}

async function main() {
  console.log("=== Dump Site & Waste Facility Scraper ===\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Try GPW first
  let gpwSites = await fetchGPW();

  // Always get OSM data
  const osmSites = await fetchOverpassDumpSites();

  // Combine
  const allSites = [...(gpwSites || []), ...osmSites].filter(
    (s) => s.lat && s.lng && isInPH(s.lat, s.lng)
  );

  const ncrSites = allSites.filter((s) => isInNCR(s.lat, s.lng));

  const output = {
    scraped_at: new Date().toISOString(),
    total_sites_ph: allSites.length,
    ncr_sites: ncrSites.length,
    by_type: {},
    by_source: {
      gpw: allSites.filter((s) => s.source === "Global Plastic Watch").length,
      osm: allSites.filter((s) => s.source === "OpenStreetMap").length,
    },
    sites: allSites,
    ncr_only: ncrSites,
  };

  // Count by type
  allSites.forEach((s) => {
    output.by_type[s.type] = (output.by_type[s.type] || 0) + 1;
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n=== Done! ===`);
  console.log(`Total PH sites: ${allSites.length}`);
  console.log(`NCR sites: ${ncrSites.length}`);
  console.log(`By type:`, JSON.stringify(output.by_type));
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch(console.error);
