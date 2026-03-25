/**
 * Air Quality Index Scraper — NCR Cities (v3)
 * Uses AQICN map bounds API to get all real monitoring stations in Manila,
 * then fetches detailed data per station.
 *
 * Usage: AQICN_TOKEN=<token> node scrapers/07-air-quality.js
 * Output: scrapers/data/air_quality.json
 *
 * Get a free token at: https://aqicn.org/data-platform/token/
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "air_quality.json");
const TOKEN = process.env.AQICN_TOKEN || "demo";
const DELAY_MS = 400;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAQILevel(aqi) {
  if (aqi <= 50) return { level: "Good", color: "#009966" };
  if (aqi <= 100) return { level: "Moderate", color: "#ffde33" };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive Groups", color: "#ff9933" };
  if (aqi <= 200) return { level: "Unhealthy", color: "#cc0033" };
  if (aqi <= 300) return { level: "Very Unhealthy", color: "#660099" };
  return { level: "Hazardous", color: "#7e0023" };
}

// Map station to nearest NCR city
function assignCity(lat, lng, stationName) {
  const cities = [
    { city: "Manila", lat: 14.5995, lng: 120.9842 },
    { city: "Quezon City", lat: 14.6488, lng: 121.0509 },
    { city: "Makati", lat: 14.5547, lng: 121.0244 },
    { city: "Pasig", lat: 14.5726, lng: 121.0605 },
    { city: "Taguig", lat: 14.5176, lng: 121.0509 },
    { city: "Caloocan", lat: 14.6572, lng: 120.9724 },
    { city: "Mandaluyong", lat: 14.5858, lng: 121.0348 },
    { city: "Marikina", lat: 14.6292, lng: 121.1005 },
    { city: "Paranaque", lat: 14.4781, lng: 121.0201 },
    { city: "Las Pinas", lat: 14.4495, lng: 120.9932 },
    { city: "Muntinlupa", lat: 14.4081, lng: 121.0415 },
    { city: "Valenzuela", lat: 14.6889, lng: 120.9589 },
    { city: "Pasay", lat: 14.5378, lng: 121.0014 },
    { city: "Navotas", lat: 14.6667, lng: 120.9417 },
    { city: "Malabon", lat: 14.6625, lng: 120.9567 },
    { city: "San Juan", lat: 14.6019, lng: 121.0355 },
  ];

  // Check station name first
  const lowerName = stationName.toLowerCase();
  for (const c of cities) {
    if (lowerName.includes(c.city.toLowerCase().replace(" ", ""))) return c.city;
    if (lowerName.includes(c.city.toLowerCase())) return c.city;
  }

  // Fall back to nearest by distance
  let nearest = cities[0];
  let minDist = Infinity;
  for (const c of cities) {
    const d = Math.sqrt((lat - c.lat) ** 2 + (lng - c.lng) ** 2);
    if (d < minDist) { minDist = d; nearest = c; }
  }
  return nearest.city;
}

async function fetchAllStations() {
  // Metro Manila bounding box (wider to catch edge stations)
  const url = `https://api.waqi.info/v2/map/bounds?latlng=14.30,120.85,14.80,121.20&networks=all&token=${TOKEN}`;
  console.log("Fetching all monitoring stations in NCR bounds...");

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const data = await res.json();

    if (data.status !== "ok") {
      console.log(`  Error: ${data.data || data.status}`);
      return [];
    }

    const stations = (data.data || []).map((s) => ({
      uid: s.uid,
      station_name: s.station?.name || "Unknown",
      aqi: s.aqi === "-" ? null : parseInt(s.aqi),
      lat: parseFloat(s.lat),
      lng: parseFloat(s.lon),
    }));

    console.log(`  Found ${stations.length} stations\n`);
    return stations;
  } catch (err) {
    console.log(`  Error: ${err.message}`);
    return [];
  }
}

async function fetchStationDetail(uid) {
  const url = `https://api.waqi.info/feed/@${uid}/?token=${TOKEN}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    if (data.status !== "ok") return null;
    return data.data;
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== Air Quality Index Scraper — NCR (v3) ===\n");

  if (TOKEN === "demo") {
    console.log("WARNING: Demo token may return limited data.");
    console.log("Get a free token at: https://aqicn.org/data-platform/token/\n");
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Step 1: Get all stations in NCR
  const stations = await fetchAllStations();

  if (stations.length === 0) {
    console.log("No stations found. Writing empty output.");
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      scraped_at: new Date().toISOString(),
      error: "No stations found in NCR bounds",
      city_readings: [],
    }, null, 2));
    return;
  }

  // Filter to valid AQI stations
  const validStations = stations.filter((s) => s.aqi !== null && s.aqi > 0);
  console.log(`Stations with valid AQI: ${validStations.length}\n`);

  // Step 2: Fetch detailed data for each station
  console.log("Fetching detailed data per station...");
  const detailedReadings = [];

  for (const station of validStations) {
    process.stdout.write(`  ${station.station_name} (AQI ${station.aqi})... `);

    const detail = await fetchStationDetail(station.uid);
    if (detail) {
      const aqi = typeof detail.aqi === "number" ? detail.aqi : parseInt(detail.aqi);
      const aqiLevel = getAQILevel(aqi);
      const city = assignCity(station.lat, station.lng, station.station_name);

      detailedReadings.push({
        city,
        station_name: detail.city?.name || station.station_name,
        aqi,
        aqi_level: aqiLevel.level,
        aqi_color: aqiLevel.color,
        dominant_pollutant: detail.dominentpol || null,
        pollutants: {
          pm25: detail.iaqi?.pm25?.v ?? null,
          pm10: detail.iaqi?.pm10?.v ?? null,
          o3: detail.iaqi?.o3?.v ?? null,
          no2: detail.iaqi?.no2?.v ?? null,
          so2: detail.iaqi?.so2?.v ?? null,
          co: detail.iaqi?.co?.v ?? null,
        },
        weather: {
          temperature: detail.iaqi?.t?.v ?? null,
          humidity: detail.iaqi?.h?.v ?? null,
          wind: detail.iaqi?.w?.v ?? null,
        },
        lat: detail.city?.geo?.[0] ?? station.lat,
        lng: detail.city?.geo?.[1] ?? station.lng,
        last_updated: detail.time?.iso || null,
        source: (detail.attributions || []).map((a) => a.name).join(", ") || "AQICN",
      });
      console.log(`OK (${city})`);
    } else {
      console.log("no detail");
    }

    await sleep(DELAY_MS);
  }

  // Step 3: Aggregate per city (average of stations in that city)
  const cityMap = {};
  detailedReadings.forEach((r) => {
    if (!cityMap[r.city]) {
      cityMap[r.city] = { readings: [], best: null };
    }
    cityMap[r.city].readings.push(r);
    // Keep the reading with most pollutant data
    const current = cityMap[r.city].best;
    if (!current || Object.values(r.pollutants).filter(Boolean).length >
        Object.values(current.pollutants).filter(Boolean).length) {
      cityMap[r.city].best = r;
    }
  });

  const cityReadings = Object.entries(cityMap).map(([city, data]) => {
    const avgAqi = Math.round(
      data.readings.reduce((s, r) => s + r.aqi, 0) / data.readings.length
    );
    const best = data.best;
    const aqiLevel = getAQILevel(avgAqi);
    return {
      ...best,
      city,
      aqi: avgAqi,
      aqi_level: aqiLevel.level,
      aqi_color: aqiLevel.color,
      stations_in_city: data.readings.length,
      station_names: data.readings.map((r) => r.station_name),
    };
  });

  // Sort by AQI descending (worst first)
  cityReadings.sort((a, b) => b.aqi - a.aqi);

  const uniqueAqiValues = new Set(cityReadings.map((r) => r.aqi));
  const avgAqi = cityReadings.length
    ? Math.round(cityReadings.reduce((s, r) => s + r.aqi, 0) / cityReadings.length)
    : null;

  const output = {
    scraped_at: new Date().toISOString(),
    token_type: TOKEN === "demo" ? "demo" : "custom",
    data_quality: uniqueAqiValues.size > 1 ? "OK" : "LOW — single station resolved",
    total_stations: stations.length,
    stations_with_aqi: validStations.length,
    stations_detailed: detailedReadings.length,
    cities_covered: cityReadings.length,
    ncr_average_aqi: avgAqi,
    ncr_average_level: avgAqi ? getAQILevel(avgAqi).level : null,
    city_readings: cityReadings,
    all_station_readings: detailedReadings,
    all_stations_raw: stations,
    legend: {
      "0-50": "Good (Green)",
      "51-100": "Moderate (Yellow)",
      "101-150": "Unhealthy for Sensitive Groups (Orange)",
      "151-200": "Unhealthy (Red)",
      "201-300": "Very Unhealthy (Purple)",
      "300+": "Hazardous (Maroon)",
    },
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n=== Done! ===`);
  console.log(`Stations in NCR: ${stations.length}`);
  console.log(`With valid AQI: ${validStations.length}`);
  console.log(`Detailed fetched: ${detailedReadings.length}`);
  console.log(`Cities covered: ${cityReadings.length}`);
  console.log(`NCR Average AQI: ${avgAqi || "N/A"}`);
  console.log(`Data quality: ${output.data_quality}`);
  cityReadings.forEach((r) =>
    console.log(`  ${r.city}: AQI ${r.aqi} (${r.aqi_level}) — ${r.stations_in_city} station(s)`)
  );
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch(console.error);
