/**
 * Devex Grant Opportunities Scraper
 * Searches Devex for Philippines environment/waste funding opportunities.
 *
 * Usage: node scrapers/08-devex-grants.js
 * Output: scrapers/data/devex_grants.json
 *
 * No API key needed. Scrapes public search results.
 */

const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "devex_grants.json");
const DELAY_MS = 2500;

const SEARCH_QUERIES = [
  "Philippines environment waste management",
  "Philippines solid waste recycling",
  "Philippines circular economy",
  "Philippines climate change environment",
  "Southeast Asia waste management NGO",
  "Philippines plastic pollution",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.log(`  -> ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.log(`  -> Error: ${err.message}`);
    return null;
  }
}

async function scrapeDevex(query) {
  const url = `https://www.devex.com/funding/search?query=${encodeURIComponent(query)}`;
  console.log(`  Searching: "${query}"`);

  const html = await fetchPage(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results = [];

  // Devex funding search results
  $(".search-result, .funding-result, article, .result-item, [data-testid='search-result']").each(
    (_, el) => {
      const title = $(el).find("h3, h2, .title, a.result-title").first().text().trim();
      const link = $(el).find("a").first().attr("href") || "";
      const donor = $(el).find(".donor, .organization, .source").first().text().trim();
      const amount = $(el).find(".amount, .budget, .funding-amount").first().text().trim();
      const deadline = $(el).find(".deadline, .date, time").first().text().trim();
      const description = $(el).find("p, .description, .summary").first().text().trim();

      if (title && title.length > 10) {
        results.push({
          title: title.slice(0, 300),
          donor: donor || "Unknown",
          amount: amount || "TBD",
          deadline: deadline || "",
          description: description.slice(0, 500),
          url: link.startsWith("http") ? link : `https://www.devex.com${link}`,
          search_query: query,
        });
      }
    }
  );

  // Fallback: parse links that look like funding opportunities
  if (results.length === 0) {
    $("a[href*='/funding/']").each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr("href") || "";
      if (text.length > 15 && text.length < 300) {
        results.push({
          title: text,
          donor: "",
          amount: "",
          deadline: "",
          description: "",
          url: href.startsWith("http") ? href : `https://www.devex.com${href}`,
          search_query: query,
        });
      }
    });
  }

  console.log(`    Found ${results.length} opportunities`);
  return results;
}

async function scrapeReliefWeb() {
  console.log("\n--- ReliefWeb (UN/INGO opportunities) ---");
  const url =
    "https://api.reliefweb.int/v1/jobs?appname=ecowaste-intel&filter[field]=country.name&filter[value]=Philippines&filter[field]=theme.name&filter[value][]=Environment&limit=20&sort[]=date:desc";

  try {
    console.log("  Fetching ReliefWeb API...");
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const data = await res.json();

    if (!data.data) {
      console.log("  -> No data returned");
      return [];
    }

    const results = data.data.map((item) => ({
      title: item.fields?.title || "",
      donor: item.fields?.source?.[0]?.name || "",
      amount: "",
      deadline: item.fields?.date?.closing || "",
      description: (item.fields?.body || "").slice(0, 500).replace(/<[^>]*>/g, ""),
      url: item.fields?.url_alias
        ? `https://reliefweb.int${item.fields.url_alias}`
        : item.href || "",
      search_query: "reliefweb-ph-environment",
    }));

    console.log(`  Found ${results.length} opportunities`);
    return results;
  } catch (err) {
    console.log(`  -> Error: ${err.message}`);
    return [];
  }
}

async function main() {
  console.log("=== Devex & Grant Opportunity Scraper ===\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allResults = [];

  // Scrape Devex
  console.log("--- Devex Funding Search ---");
  for (const query of SEARCH_QUERIES) {
    const results = await scrapeDevex(query);
    allResults.push(...results);
    await sleep(DELAY_MS);
  }

  // Scrape ReliefWeb
  const reliefResults = await scrapeReliefWeb();
  allResults.push(...reliefResults);

  // Deduplicate by title similarity
  const seen = new Set();
  const unique = allResults.filter((r) => {
    const key = r.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Tag relevance
  const tagged = unique.map((r, i) => {
    const lower = (r.title + " " + r.description).toLowerCase();
    const tags = [];
    if (lower.includes("waste")) tags.push("Waste Management");
    if (lower.includes("plastic")) tags.push("Plastics");
    if (lower.includes("recycl") || lower.includes("circular")) tags.push("Recycling");
    if (lower.includes("climate") || lower.includes("carbon")) tags.push("Climate");
    if (lower.includes("environment")) tags.push("Environment");
    if (lower.includes("water") || lower.includes("ocean") || lower.includes("marine"))
      tags.push("Marine/Water");
    if (tags.length === 0) tags.push("General");

    return {
      id: `devex-${String(i + 1).padStart(3, "0")}`,
      ...r,
      tags,
      source: r.search_query.startsWith("reliefweb") ? "ReliefWeb" : "Devex",
    };
  });

  const output = {
    scraped_at: new Date().toISOString(),
    total_opportunities: tagged.length,
    by_source: {
      devex: tagged.filter((t) => t.source === "Devex").length,
      reliefweb: tagged.filter((t) => t.source === "ReliefWeb").length,
    },
    opportunities: tagged,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n=== Done! ===`);
  console.log(`Total unique opportunities: ${tagged.length}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch(console.error);
