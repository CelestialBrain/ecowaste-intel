/**
 * Philippine Bill & Policy Tracker
 * Uses Google News RSS + Philippine News Agency as fallback
 * since Senate.gov.ph and Congress.gov.ph block scrapers (403).
 *
 * Usage: node scrapers/06-bill-tracker.js
 * Output: scrapers/data/policy_bills.json
 *
 * No API key needed.
 */

const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "policy_bills.json");
const DELAY_MS = 1500;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xml,application/rss+xml,*/*",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.log(`    -> ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.log(`    -> Error: ${err.message}`);
    return null;
  }
}

// ============ Google News RSS ============
const GOOGLE_NEWS_QUERIES = [
  { query: "waste+bill+Philippines+senate", tag: "Waste Management" },
  { query: "plastic+law+Philippines", tag: "Plastics" },
  { query: "EPR+Philippines+DENR", tag: "EPR" },
  { query: "recycling+bill+Philippines+congress", tag: "Recycling" },
  { query: "incineration+Philippines+law", tag: "Pollution" },
  { query: "carbon+credit+Philippines+bill", tag: "Climate/Carbon" },
  { query: "solid+waste+management+Philippines+2024+2025", tag: "Waste Management" },
  { query: "EcoWaste+Coalition+Philippines", tag: "Environment" },
];

async function scrapeGoogleNewsRSS() {
  console.log("--- Google News RSS ---");
  const results = [];

  for (const { query, tag } of GOOGLE_NEWS_QUERIES) {
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-PH&gl=PH&ceid=PH:en`;
    console.log(`  Searching: ${query}`);
    const xml = await fetchPage(url);
    if (!xml) {
      await sleep(DELAY_MS);
      continue;
    }

    const $ = cheerio.load(xml, { xmlMode: true });
    $("item").each((_, item) => {
      const title = $(item).find("title").text().trim();
      const link = $(item).find("link").text().trim();
      const pubDate = $(item).find("pubDate").text().trim();
      const source = $(item).find("source").text().trim();

      if (title) {
        results.push({
          title: title.slice(0, 300),
          source: source || "Google News",
          date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : "",
          url: link,
          tag,
          origin: "google_news",
        });
      }
    });

    console.log(`    Found ${$("item").length} articles`);
    await sleep(DELAY_MS);
  }

  return results;
}

// ============ Philippine News Agency ============
const PNA_QUERIES = [
  { query: "waste bill", tag: "Waste Management" },
  { query: "plastic law", tag: "Plastics" },
  { query: "EPR producer responsibility", tag: "EPR" },
  { query: "recycling environment", tag: "Recycling" },
  { query: "EcoWaste Coalition", tag: "Environment" },
];

async function scrapePNA() {
  console.log("\n--- Philippine News Agency ---");
  const results = [];

  for (const { query, tag } of PNA_QUERIES) {
    const url = `https://www.pna.gov.ph/?s=${encodeURIComponent(query)}`;
    console.log(`  Searching: ${query}`);
    const html = await fetchPage(url);
    if (!html) {
      await sleep(DELAY_MS);
      continue;
    }

    const $ = cheerio.load(html);
    let count = 0;

    // PNA search results
    $("article, .post, .entry, .search-result").each((_, el) => {
      const title =
        $(el).find("h2 a, h3 a, .entry-title a").first().text().trim() ||
        $(el).find("a").first().text().trim();
      const link = $(el).find("a").first().attr("href") || "";
      const date =
        $(el).find("time").attr("datetime") ||
        $(el).find(".date, .entry-date, .post-date").first().text().trim() ||
        "";
      const excerpt = $(el).find("p, .excerpt, .entry-summary").first().text().trim();

      if (title && title.length > 15) {
        results.push({
          title: title.slice(0, 300),
          source: "Philippine News Agency",
          date: date ? new Date(date).toISOString().split("T")[0] : "",
          url: link.startsWith("http") ? link : `https://www.pna.gov.ph${link}`,
          excerpt: excerpt.slice(0, 300),
          tag,
          origin: "pna",
        });
        count++;
      }
    });

    // Fallback: general link parsing
    if (count === 0) {
      $("a[href*='/2024/'], a[href*='/2025/'], a[href*='/2026/']").each((_, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr("href") || "";
        if (text.length > 20 && text.length < 300 && href.includes("pna.gov.ph")) {
          results.push({
            title: text,
            source: "Philippine News Agency",
            date: "",
            url: href,
            excerpt: "",
            tag,
            origin: "pna",
          });
          count++;
        }
      });
    }

    console.log(`    Found ${count} articles`);
    await sleep(DELAY_MS);
  }

  return results;
}

// ============ Rappler (public, usually accessible) ============
async function scrapeRappler() {
  console.log("\n--- Rappler ---");
  const results = [];
  const queries = [
    "waste management bill",
    "plastic ban Philippines",
    "EPR law Philippines",
  ];

  for (const query of queries) {
    const url = `https://www.rappler.com/search/?q=${encodeURIComponent(query)}&type=articles`;
    console.log(`  Searching: ${query}`);
    const html = await fetchPage(url);
    if (!html) {
      await sleep(DELAY_MS);
      continue;
    }

    const $ = cheerio.load(html);
    let count = 0;

    $("article a, .search-result a, a[href*='/nation/'], a[href*='/environment/']").each(
      (_, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr("href") || "";
        if (
          text.length > 20 &&
          text.length < 300 &&
          href.includes("rappler.com") &&
          !text.includes("Subscribe") &&
          !text.includes("Sign")
        ) {
          results.push({
            title: text,
            source: "Rappler",
            date: "",
            url: href,
            excerpt: "",
            tag: "Environment",
            origin: "rappler",
          });
          count++;
        }
      }
    );

    console.log(`    Found ${count} articles`);
    await sleep(DELAY_MS);
  }

  return results;
}

function tagArticle(title) {
  const lower = title.toLowerCase();
  const tags = [];
  if (lower.includes("waste") || lower.includes("basura") || lower.includes("solid waste"))
    tags.push("Waste Management");
  if (lower.includes("plastic") || lower.includes("single-use") || lower.includes("sachet"))
    tags.push("Plastics");
  if (lower.includes("recycl") || lower.includes("circular") || lower.includes("mrf"))
    tags.push("Recycling");
  if (lower.includes("epr") || lower.includes("producer responsib"))
    tags.push("EPR");
  if (lower.includes("carbon") || lower.includes("climate") || lower.includes("emission"))
    tags.push("Climate/Carbon");
  if (lower.includes("inciner") || lower.includes("pollut") || lower.includes("air quality"))
    tags.push("Pollution");
  if (lower.includes("hazard") || lower.includes("toxic") || lower.includes("e-waste") || lower.includes("lead"))
    tags.push("Hazardous Waste");
  if (lower.includes("bill") || lower.includes("law") || lower.includes("act") || lower.includes("senate") || lower.includes("house"))
    tags.push("Legislation");
  if (tags.length === 0) tags.push("Environment");
  return [...new Set(tags)];
}

async function main() {
  console.log("=== Philippine Bill & Policy Tracker ===\n");
  console.log("Note: Senate.gov.ph and Congress.gov.ph block scrapers.");
  console.log("Using Google News RSS + PNA + Rappler as sources.\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const googleResults = await scrapeGoogleNewsRSS();
  const pnaResults = await scrapePNA();
  const rapplerResults = await scrapeRappler();

  // Combine and deduplicate
  const all = [...googleResults, ...pnaResults, ...rapplerResults];
  const seen = new Set();
  const unique = all.filter((r) => {
    const key = r.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Tag and format
  const tagged = unique.map((r, i) => ({
    id: `news-${String(i + 1).padStart(3, "0")}`,
    title: r.title,
    source: r.source,
    date: r.date,
    url: r.url,
    excerpt: r.excerpt || "",
    tags: tagArticle(r.title),
    primary_tag: r.tag,
    origin: r.origin,
  }));

  // Sort by date (newest first)
  tagged.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const output = {
    scraped_at: new Date().toISOString(),
    total_articles: tagged.length,
    by_source: {
      google_news: tagged.filter((t) => t.origin === "google_news").length,
      pna: tagged.filter((t) => t.origin === "pna").length,
      rappler: tagged.filter((t) => t.origin === "rappler").length,
    },
    by_tag: {},
    articles: tagged,
    note: "Senate.gov.ph and Congress.gov.ph return 403. This data is sourced from news coverage of legislation instead. For official bill text, visit the sites directly in a browser.",
  };

  // Count by tag
  tagged.forEach((t) => {
    t.tags.forEach((tag) => {
      output.by_tag[tag] = (output.by_tag[tag] || 0) + 1;
    });
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n=== Done! ===`);
  console.log(`Google News: ${output.by_source.google_news}`);
  console.log(`PNA: ${output.by_source.pna}`);
  console.log(`Rappler: ${output.by_source.rappler}`);
  console.log(`Total unique: ${tagged.length}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch(console.error);
