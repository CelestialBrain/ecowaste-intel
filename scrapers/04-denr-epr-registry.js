/**
 * DENR EPR Registry Scraper
 * Fetches the list of EPR-registered obliged enterprises from the
 * DENR Environmental Management Bureau website.
 *
 * Usage: node scrapers/04-denr-epr-registry.js
 * Output: scrapers/data/denr_epr_registry.json
 *
 * No API key needed. Scrapes public HTML.
 */

const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "denr_epr_registry.json");

// Known URLs to try for EPR registry data
const TARGET_URLS = [
  "https://emb.gov.ph/epr/",
  "https://emb.gov.ph/epr-registry/",
  "https://emb.gov.ph/extended-producer-responsibility/",
  "https://emb.gov.ph/ra-11898/",
  "https://emb.gov.ph/list-of-registered-obliged-enterprises/",
];

const DELAY_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  try {
    console.log(`  Trying: ${url}`);
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
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

function extractTableData(html, url) {
  const $ = cheerio.load(html);
  const results = [];

  // Try to find tables
  $("table").each((tableIdx, table) => {
    const rows = $(table).find("tr");
    if (rows.length < 2) return; // Skip tables with no data rows

    // Get headers
    const headers = [];
    $(rows[0])
      .find("th, td")
      .each((_, cell) => {
        headers.push($(cell).text().trim().toLowerCase());
      });

    // Process data rows
    rows.slice(1).each((_, row) => {
      const cells = [];
      $(row)
        .find("td")
        .each((_, cell) => {
          cells.push($(cell).text().trim());
        });

      if (cells.length === 0) return;

      // Try to map cells to our schema
      const entry = {
        company_name: cells[0] || "",
        sector: "",
        epr_status: "EPR Registered",
        compliance_level: "Medium",
        registration_date: "",
        region: "",
        raw_data: cells,
      };

      // Try to identify columns by header names
      headers.forEach((h, i) => {
        if (i >= cells.length) return;
        if (h.includes("company") || h.includes("name") || h.includes("enterprise"))
          entry.company_name = cells[i];
        if (h.includes("sector") || h.includes("industry") || h.includes("type"))
          entry.sector = cells[i];
        if (h.includes("date") || h.includes("registered"))
          entry.registration_date = cells[i];
        if (h.includes("region") || h.includes("location"))
          entry.region = cells[i];
        if (h.includes("status")) entry.epr_status = cells[i] || "EPR Registered";
      });

      if (entry.company_name && entry.company_name.length > 1) {
        results.push(entry);
      }
    });
  });

  return results;
}

function extractListData(html) {
  const $ = cheerio.load(html);
  const results = [];

  // Try to find lists of companies
  $("li, .entry-content p, article p").each((_, el) => {
    const text = $(el).text().trim();
    // Look for patterns like company names (capitalized, multi-word)
    if (
      text.length > 5 &&
      text.length < 200 &&
      /^[A-Z]/.test(text) &&
      !text.startsWith("The ") &&
      !text.startsWith("This ")
    ) {
      results.push({
        company_name: text.split(/[,\-–—]|Inc\.|Corp\./)[0].trim(),
        raw_text: text,
      });
    }
  });

  return results;
}

function extractDownloadLinks(html) {
  const $ = cheerio.load(html);
  const links = [];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const text = $(el).text().trim().toLowerCase();
    if (
      (href.endsWith(".pdf") ||
        href.endsWith(".xlsx") ||
        href.endsWith(".csv") ||
        href.endsWith(".xls")) &&
      (text.includes("epr") ||
        text.includes("registry") ||
        text.includes("obliged") ||
        text.includes("list") ||
        text.includes("download"))
    ) {
      links.push({ url: href, text: $(el).text().trim() });
    }
  });

  return links;
}

async function main() {
  console.log("=== DENR EPR Registry Scraper ===\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let allEntries = [];
  let downloadLinks = [];
  let successUrl = null;

  for (const url of TARGET_URLS) {
    const html = await fetchPage(url);
    if (!html) {
      await sleep(DELAY_MS);
      continue;
    }

    successUrl = url;

    // Try table extraction first
    const tableData = extractTableData(html, url);
    if (tableData.length > 0) {
      console.log(`  -> Found ${tableData.length} entries in tables`);
      allEntries = allEntries.concat(tableData);
    }

    // Check for downloadable files
    const downloads = extractDownloadLinks(html);
    if (downloads.length > 0) {
      console.log(`  -> Found ${downloads.length} downloadable files:`);
      downloads.forEach((d) => console.log(`     ${d.text}: ${d.url}`));
      downloadLinks = downloadLinks.concat(downloads);
    }

    // Try list extraction as fallback
    if (tableData.length === 0) {
      const listData = extractListData(html);
      if (listData.length > 0) {
        console.log(`  -> Found ${listData.length} potential entries in lists`);
      }
    }

    await sleep(DELAY_MS);
  }

  // Also try searching for the registry via Google-like approach
  console.log("\n--- Checking alternative sources ---");
  const altUrls = [
    "https://emb.gov.ph/?s=EPR+registry",
    "https://emb.gov.ph/?s=obliged+enterprises",
  ];
  for (const url of altUrls) {
    const html = await fetchPage(url);
    if (!html) {
      await sleep(DELAY_MS);
      continue;
    }

    const $ = cheerio.load(html);
    const searchResults = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      const text = $(el).text().trim().toLowerCase();
      if (
        (text.includes("epr") || text.includes("obliged") || text.includes("producer responsibility")) &&
        href.includes("emb.gov.ph")
      ) {
        searchResults.push({ url: href, text: $(el).text().trim() });
      }
    });

    if (searchResults.length > 0) {
      console.log(`  Found ${searchResults.length} relevant links:`);
      searchResults.forEach((r) => console.log(`    ${r.text}: ${r.url}`));
    }

    await sleep(DELAY_MS);
  }

  // Assign IDs and clean up
  const cleaned = allEntries.map((entry, i) => ({
    id: `epr-denr-${String(i + 1).padStart(4, "0")}`,
    company_name: entry.company_name,
    sector: entry.sector || "TBD",
    epr_status: "EPR Registered",
    compliance_level: "Medium",
    known_program: "",
    strategic_angle: "",
    source: "DENR EPR Registry",
    registration_date: entry.registration_date || "",
    region: entry.region || "",
  }));

  const output = {
    scraped_at: new Date().toISOString(),
    source_url: successUrl,
    total_entries: cleaned.length,
    download_links: downloadLinks,
    note:
      cleaned.length === 0
        ? "No structured data found on EMB website. The EPR registry may be available as a downloadable PDF/Excel file. Check the download_links array, or visit emb.gov.ph directly and search for 'EPR registry' or 'obliged enterprises'."
        : "Data scraped from DENR-EMB website tables.",
    companies: cleaned,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n=== Done! ===`);
  console.log(`Entries found: ${cleaned.length}`);
  console.log(`Download links found: ${downloadLinks.length}`);
  console.log(`Output: ${OUTPUT_FILE}`);

  if (cleaned.length === 0) {
    console.log(
      "\nTip: The DENR-EMB site may publish the registry as a PDF or Excel file."
    );
    console.log(
      "Check: https://emb.gov.ph and search for 'EPR' or 'RA 11898 registry'"
    );
    console.log(
      "If you find a PDF, use a tool like pdf-parse to extract the table data."
    );
  }
}

main().catch(console.error);
