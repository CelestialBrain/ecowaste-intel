/**
 * OLX.ph Recyclable Material Price Scraper (v2 — Playwright)
 * Uses Playwright for JS rendering since OLX requires it.
 *
 * Usage: node scrapers/05-olx-prices.js
 * Output: scrapers/data/olx_prices.json
 *
 * First run: npx playwright install chromium
 * No API key needed.
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "olx_prices.json");

const SEARCHES = [
  { url: "https://www.olx.com.ph/items/q-scrap-PET-bottles", material: "PET", category: "Plastic" },
  { url: "https://www.olx.com.ph/items/q-scrap-plastic-recyclable", material: "Mixed Plastic", category: "Plastic" },
  { url: "https://www.olx.com.ph/items/q-scrap-HDPE", material: "HDPE", category: "Plastic" },
  { url: "https://www.olx.com.ph/items/q-scrap-aluminum-cans", material: "Aluminum", category: "Metal" },
  { url: "https://www.olx.com.ph/items/q-scrap-copper-wire", material: "Copper", category: "Metal" },
  { url: "https://www.olx.com.ph/items/q-scrap-iron-steel", material: "Scrap Iron", category: "Metal" },
  { url: "https://www.olx.com.ph/items/q-scrap-carton-paper", material: "Carton", category: "Paper" },
  { url: "https://www.olx.com.ph/items/q-basura-recyclables", material: "Mixed", category: "Mixed" },
];

function extractPrice(text) {
  const patterns = [
    /(?:₱|PHP|Php)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:per\s*kg|\/kg|pesos)/i,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:per\s*kilo)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return parseFloat(m[1].replace(/,/g, ""));
  }
  return null;
}

function inferMaterial(title) {
  const lower = title.toLowerCase();
  if (lower.includes("pet") || lower.includes("plastic bottle")) return "PET";
  if (lower.includes("hdpe")) return "HDPE";
  if (lower.includes("aluminum") || lower.includes("aluminium") || lower.includes("can")) return "Aluminum";
  if (lower.includes("copper")) return "Copper";
  if (lower.includes("iron") || lower.includes("steel") || lower.includes("metal")) return "Scrap Iron";
  if (lower.includes("carton") || lower.includes("paper") || lower.includes("dyaryo")) return "Carton";
  if (lower.includes("glass") || lower.includes("bote")) return "Glass";
  if (lower.includes("plastic")) return "Mixed Plastic";
  return "Mixed";
}

async function main() {
  console.log("=== OLX.ph Price Scraper (Playwright) ===\n");

  // Check if Playwright is installed
  let chromium;
  try {
    const pw = require("playwright");
    chromium = pw.chromium;
  } catch {
    console.log("Playwright not installed. Installing chromium...");
    const { execSync } = require("child_process");
    try {
      execSync("npx playwright install chromium", { stdio: "inherit" });
      const pw = require("playwright");
      chromium = pw.chromium;
    } catch (err) {
      console.log(`Failed to install Playwright: ${err.message}`);
      console.log("Run manually: npx playwright install chromium");

      // Write empty output
      if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      fs.writeFileSync(
        OUTPUT_FILE,
        JSON.stringify({
          scraped_at: new Date().toISOString(),
          note: "Playwright not available. Run: npx playwright install chromium",
          total_listings: 0,
          price_summary: [],
          listings: [],
        }, null, 2)
      );
      return;
    }
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    locale: "en-PH",
  });

  const allListings = [];

  for (const { url, material, category } of SEARCHES) {
    console.log(`  Searching: ${material} (${category})`);
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(3000); // Wait for dynamic content

      // Extract listings from the page
      const listings = await page.evaluate(() => {
        const items = [];
        // OLX listing selectors (try multiple patterns)
        const cards = document.querySelectorAll(
          "[data-aut-id='itemBox'], li[data-aut-id], .EIR5N, ._2Gr10"
        );

        cards.forEach((card) => {
          const titleEl = card.querySelector(
            "[data-aut-id='itemTitle'], .IKo3_, ._2tW1I, h2, h3"
          );
          const priceEl = card.querySelector(
            "[data-aut-id='itemPrice'], ._89yzn, ._2xKfz, span[data-aut-id='itemPrice']"
          );
          const locationEl = card.querySelector(
            "[data-aut-id='item-location'], ._424u2, ._2VQu4"
          );
          const linkEl = card.querySelector("a");

          const title = titleEl?.textContent?.trim() || "";
          const priceText = priceEl?.textContent?.trim() || "";
          const location = locationEl?.textContent?.trim() || "";
          const href = linkEl?.getAttribute("href") || "";

          if (title) {
            items.push({
              title: title.slice(0, 200),
              price_text: priceText,
              location,
              url: href.startsWith("http") ? href : `https://www.olx.com.ph${href}`,
            });
          }
        });

        // Fallback: get any listing-like text
        if (items.length === 0) {
          document.querySelectorAll("a[href*='/item/']").forEach((a) => {
            const text = a.textContent?.trim() || "";
            if (text.length > 10 && text.length < 300) {
              items.push({
                title: text.slice(0, 200),
                price_text: "",
                location: "",
                url: a.getAttribute("href") || "",
              });
            }
          });
        }

        return items;
      });

      listings.forEach((l) => {
        allListings.push({
          ...l,
          price: extractPrice(l.price_text) || extractPrice(l.title),
          material: inferMaterial(l.title) || material,
          category,
          search_material: material,
        });
      });

      console.log(`    Found ${listings.length} listings`);
    } catch (err) {
      console.log(`    Error: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Compute price stats per material
  const byMaterial = {};
  allListings.forEach((l) => {
    if (!byMaterial[l.material]) {
      byMaterial[l.material] = { material: l.material, category: l.category, prices: [], count: 0 };
    }
    byMaterial[l.material].count++;
    if (l.price && l.price > 0 && l.price < 50000) {
      byMaterial[l.material].prices.push(l.price);
    }
  });

  const summary = Object.values(byMaterial).map((m) => {
    const prices = m.prices.sort((a, b) => a - b);
    return {
      material: m.material,
      category: m.category,
      listings: m.count,
      prices_found: prices.length,
      min: prices[0] || null,
      max: prices[prices.length - 1] || null,
      median: prices.length ? prices[Math.floor(prices.length / 2)] : null,
      avg: prices.length
        ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100
        : null,
    };
  });

  const output = {
    scraped_at: new Date().toISOString(),
    total_listings: allListings.length,
    price_summary: summary,
    listings: allListings,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n=== Done! ===`);
  console.log(`Total listings: ${allListings.length}`);
  summary.forEach((s) =>
    console.log(`  ${s.material}: ${s.prices_found} prices, avg PHP ${s.avg || "N/A"}`)
  );
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch(console.error);
