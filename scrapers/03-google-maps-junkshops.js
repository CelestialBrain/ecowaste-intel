/**
 * Google Maps NCR Junkshop Scraper
 * Searches for junkshops, scrap dealers, and MRFs across Metro Manila
 * using the Google Maps Places API.
 *
 * Usage: GOOGLE_MAPS_API_KEY=<key> node scrapers/03-google-maps-junkshops.js
 * Output: scrapers/data/ncr_junkshops.json
 *
 * Required env var: GOOGLE_MAPS_API_KEY
 * Estimated cost: ~$10-15 for full NCR coverage
 */

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const OUTPUT_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "ncr_junkshops.json");

// Grid of NCR coordinates (~3km spacing)
const NCR_GRID = [
  // Manila core
  { lat: 14.5995, lng: 120.9842, name: "Manila Center" },
  { lat: 14.6134, lng: 120.9685, name: "Tondo" },
  { lat: 14.5870, lng: 121.0005, name: "Sta Cruz/Quiapo" },
  // Quezon City
  { lat: 14.6488, lng: 121.0509, name: "QC Center" },
  { lat: 14.6907, lng: 121.0867, name: "Commonwealth" },
  { lat: 14.7094, lng: 121.1043, name: "Payatas" },
  { lat: 14.6600, lng: 121.0300, name: "QC West" },
  // Caloocan / Valenzuela
  { lat: 14.6572, lng: 120.9724, name: "Caloocan" },
  { lat: 14.6889, lng: 120.9589, name: "Valenzuela" },
  // Makati / Mandaluyong
  { lat: 14.5547, lng: 121.0244, name: "Makati" },
  { lat: 14.5858, lng: 121.0348, name: "Mandaluyong" },
  // Pasig / Marikina
  { lat: 14.5726, lng: 121.0605, name: "Pasig" },
  { lat: 14.6292, lng: 121.1005, name: "Marikina" },
  // South: Taguig / Paranaque / Las Pinas
  { lat: 14.5176, lng: 121.0509, name: "Taguig" },
  { lat: 14.4781, lng: 121.0201, name: "Paranaque" },
  { lat: 14.4495, lng: 120.9932, name: "Las Pinas" },
  // Pasay / Muntinlupa
  { lat: 14.5378, lng: 121.0014, name: "Pasay" },
  { lat: 14.4081, lng: 121.0415, name: "Muntinlupa" },
  // San Juan / Navotas / Malabon
  { lat: 14.6019, lng: 121.0355, name: "San Juan" },
  { lat: 14.6667, lng: 120.9417, name: "Navotas/Malabon" },
];

// Search terms to cover different naming conventions
const SEARCH_QUERIES = [
  "junkshop",
  "scrap dealer",
  "recyclables buyer",
  "bote dyaryo",
  "MRF material recovery facility",
];

const DELAY_MS = 300; // Google API rate limiting

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function textSearch(query, lat, lng) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", query);
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", "3000");
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.log(`  API status: ${data.status} - ${data.error_message || ""}`);
  }

  return data.results || [];
}

async function getAllPages(query, lat, lng) {
  let allResults = [];
  const firstPage = await textSearch(query, lat, lng);
  allResults = allResults.concat(firstPage);

  // Note: next_page_token handling would need additional pages
  // For now, first page (20 results) per grid point is sufficient
  return allResults;
}

function mapToSchema(place) {
  const name = place.name || "";
  const address = place.formatted_address || "";

  // Try to extract city/area from address
  const ncrCities = [
    "Manila", "Quezon City", "Caloocan", "Makati", "Pasig", "Taguig",
    "Paranaque", "Las Pinas", "Marikina", "Valenzuela", "Mandaluyong",
    "Muntinlupa", "Navotas", "Malabon", "San Juan", "Pasay", "Pateros",
  ];
  const area = ncrCities.find((c) => address.includes(c)) || "Metro Manila";

  // Guess materials from name/types
  const lowerName = name.toLowerCase();
  const materials = [];
  if (lowerName.includes("bote") || lowerName.includes("pet") || lowerName.includes("plastic"))
    materials.push("PET");
  if (lowerName.includes("dyaryo") || lowerName.includes("paper") || lowerName.includes("carton"))
    materials.push("Paper", "Carton");
  if (lowerName.includes("scrap") || lowerName.includes("metal") || lowerName.includes("iron"))
    materials.push("Scrap Iron");
  if (lowerName.includes("aluminum") || lowerName.includes("can"))
    materials.push("Aluminum");
  if (lowerName.includes("copper")) materials.push("Copper");

  // Default materials if none detected
  if (materials.length === 0) {
    materials.push("PET", "Paper", "Carton");
  }

  // Determine status
  let status = "Informal";
  if (lowerName.includes("mrf") || lowerName.includes("material recovery")) {
    status = "Accredited MRF";
  } else if (
    lowerName.includes("trading") ||
    lowerName.includes("center") ||
    lowerName.includes("enterprise")
  ) {
    status = "Semi-formal";
  }

  return {
    place_id: place.place_id,
    name,
    area,
    barangay: "",
    lat: place.geometry?.location?.lat || 0,
    lng: place.geometry?.location?.lng || 0,
    materials: [...new Set(materials)],
    status,
    source: "Google Maps",
    phone: "",
    rating: place.rating || null,
    address,
    google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
  };
}

async function main() {
  console.log("=== Google Maps NCR Junkshop Scraper ===\n");

  if (!API_KEY) {
    console.log("ERROR: No GOOGLE_MAPS_API_KEY found in environment.\n");
    console.log("Usage: GOOGLE_MAPS_API_KEY=<your_key> node scrapers/03-google-maps-junkshops.js\n");
    console.log("To get an API key:");
    console.log("1. Go to https://console.cloud.google.com/");
    console.log("2. Enable 'Places API'");
    console.log("3. Create an API key");
    console.log("4. Set billing (first $200/month free)\n");

    // Write template
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(
        {
          note: "TEMPLATE — Run with GOOGLE_MAPS_API_KEY to populate with real data",
          grid_points: NCR_GRID.length,
          search_queries: SEARCH_QUERIES,
          junkshops: [],
        },
        null,
        2
      )
    );
    console.log(`Template written to ${OUTPUT_FILE}`);
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const seenPlaceIds = new Set();
  const allJunkshops = [];
  let apiCalls = 0;

  for (const query of SEARCH_QUERIES) {
    console.log(`\n--- Searching: "${query}" ---`);

    for (const point of NCR_GRID) {
      process.stdout.write(`  ${point.name}... `);
      const results = await getAllPages(query, point.lat, point.lng);
      apiCalls++;

      let newCount = 0;
      for (const place of results) {
        if (!seenPlaceIds.has(place.place_id)) {
          seenPlaceIds.add(place.place_id);
          allJunkshops.push(mapToSchema(place));
          newCount++;
        }
      }

      console.log(`${results.length} found, ${newCount} new`);
      await sleep(DELAY_MS);
    }
  }

  // Assign IDs
  allJunkshops.forEach((j, i) => {
    j.id = `gm-${String(i + 1).padStart(4, "0")}`;
  });

  const output = {
    scraped_at: new Date().toISOString(),
    api_calls: apiCalls,
    total_results: allJunkshops.length,
    grid_points: NCR_GRID.length,
    search_queries: SEARCH_QUERIES,
    junkshops: allJunkshops,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n=== Done! ===`);
  console.log(`Total unique junkshops: ${allJunkshops.length}`);
  console.log(`API calls made: ${apiCalls}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch(console.error);
