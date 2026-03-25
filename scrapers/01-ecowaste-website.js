/**
 * EcoWaste Coalition Website Crawler (v2 — deeper crawl)
 * Crawls ecowastecoalition.org with sub-page navigation
 * to extract actual article content, not just page titles.
 *
 * Usage: node scrapers/01-ecowaste-website.js
 * Output: scrapers/data/ecowaste_website.json
 *
 * Uses Cheerio (static HTML). Falls back gracefully if pages are JS-rendered.
 */

const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://www.ecowastecoalition.org";
const OUTPUT_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "ecowaste_website.json");
const DELAY_MS = 1500;
const MAX_SUBPAGES = 15;

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

    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.log(`      Error: ${err.message}`);
    return null;
  }
}

function extractArticleContent($) {
  // Try multiple content selectors (WordPress-style and generic)
  const contentSelectors = [
    "article .entry-content",
    ".post-content",
    ".entry-content",
    "article",
    ".content-area",
    "main .content",
    "#content",
    ".page-content",
  ];

  let contentArea = null;
  for (const sel of contentSelectors) {
    const el = $(sel).first();
    if (el.length && el.text().trim().length > 50) {
      contentArea = el;
      break;
    }
  }

  if (!contentArea) {
    contentArea = $("body");
  }

  // Get all paragraphs
  const paragraphs = [];
  contentArea.find("p").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 30) {
      paragraphs.push(text);
    }
  });

  return paragraphs;
}

function extractPageTitle($) {
  return (
    $("h1.entry-title").first().text().trim() ||
    $("h1").first().text().trim() ||
    $(".page-title").first().text().trim() ||
    $("title").text().trim().split("|")[0].trim() ||
    ""
  );
}

function extractDate($) {
  return (
    $("time").first().attr("datetime") ||
    $(".entry-date, .post-date, .date").first().text().trim() ||
    $("meta[property='article:published_time']").attr("content") ||
    ""
  );
}

function extractLinks($, basePath) {
  const links = new Set();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const fullUrl = href.startsWith("http") ? href : BASE_URL + href;

    // Only follow links within the same section or within the site
    if (
      fullUrl.startsWith(BASE_URL) &&
      !fullUrl.includes("#") &&
      !fullUrl.match(/\.(pdf|jpg|png|gif|zip|doc)$/i) &&
      !fullUrl.includes("wp-content") &&
      !fullUrl.includes("wp-admin")
    ) {
      links.add(fullUrl);
    }
  });
  return [...links];
}

function findPartners(text) {
  const known = [
    "GAIA", "BFFP", "Break Free From Plastic", "IPEN", "UNIDO",
    "DENR", "USAID", "KOICA", "GEF", "Linis Ganda", "OSEAN",
    "Zero Waste", "GIZ", "EU", "JICA", "WWF", "Greenpeace",
    "UNDP", "UNEP", "World Bank", "ADB", "CCBO", "SAICM",
    "Plastic Free Pilipinas", "Mother Earth Foundation",
  ];
  const lower = text.toLowerCase();
  return known.filter((p) => lower.includes(p.toLowerCase()));
}

function findFunders(text) {
  const known = [
    "USAID", "KOICA", "GEF", "GIZ", "EU", "JICA", "Bloomberg",
    "DOST", "DENR", "FPE", "World Bank", "ADB", "UNDP", "UNEP",
    "SAICM", "IPEN",
  ];
  const lower = text.toLowerCase();
  return known.filter((f) => lower.includes(f.toLowerCase()));
}

function classifyType(url, title) {
  const lower = (url + " " + title).toLowerCase();
  if (lower.includes("campaign")) return "Campaign";
  if (lower.includes("project") || lower.includes("program")) return "Project";
  if (lower.includes("news") || lower.includes("press") || lower.includes("media")) return "Media Mention";
  if (lower.includes("member")) return "Partnership";
  if (lower.includes("policy") || lower.includes("law") || lower.includes("act")) return "Policy Win";
  return "Media Mention";
}

// Section crawlers
const SECTIONS = [
  {
    name: "Campaigns",
    path: "/campaigns",
    type: "Campaign",
  },
  {
    name: "News",
    path: "/news",
    type: "Media Mention",
  },
  {
    name: "Press Releases",
    path: "/press-releases",
    type: "Media Mention",
  },
  {
    name: "About",
    path: "/about",
    type: "Partnership",
  },
  {
    name: "Members",
    path: "/members",
    type: "Partnership",
  },
  {
    name: "Programs",
    path: "/programs",
    type: "Project",
  },
  {
    name: "Projects",
    path: "/projects",
    type: "Project",
  },
];

async function crawlSection(section) {
  const sectionUrl = BASE_URL + section.path;
  console.log(`\n--- ${section.name} (${section.path}) ---`);
  console.log(`  Fetching index: ${sectionUrl}`);

  const html = await fetchPage(sectionUrl);
  if (!html) {
    console.log("  -> Not found or error");
    return { entries: [], members: [] };
  }

  const $ = cheerio.load(html);
  const title = extractPageTitle($);
  const paragraphs = extractArticleContent($);
  const links = extractLinks($, section.path);
  const fullText = paragraphs.join(" ");

  console.log(`  Title: ${title}`);
  console.log(`  Paragraphs: ${paragraphs.length}`);
  console.log(`  Links found: ${links.length}`);

  const entries = [];
  const members = [];

  // Main page entry
  if (title && paragraphs.length > 0) {
    entries.push({
      title,
      type: section.type,
      status: "Active",
      description: paragraphs.slice(0, 3).join(" ").slice(0, 500),
      partner_orgs: findPartners(fullText),
      funding_source: findFunders(fullText).join(", "),
      date_start: extractDate($),
      date_end: null,
      source_url: sectionUrl,
    });
  }

  // If this is the members page, extract member list
  if (section.path === "/members") {
    $("li, .member-item, .entry-content li, article li").each((_, el) => {
      const name = $(el).text().trim();
      const link = $(el).find("a").attr("href") || "";
      if (name.length > 3 && name.length < 200 && !name.includes("©")) {
        members.push({ name, url: link });
      }
    });

    // Also try table cells and paragraphs
    $(".entry-content p, article p").each((_, el) => {
      const text = $(el).text().trim();
      // Split by line breaks or bullet-like patterns
      text.split(/[;\n]/).forEach((part) => {
        const cleaned = part.trim();
        if (cleaned.length > 5 && cleaned.length < 150 && /^[A-Z]/.test(cleaned)) {
          if (!members.some((m) => m.name === cleaned)) {
            members.push({ name: cleaned, url: "" });
          }
        }
      });
    });

    console.log(`  Members found: ${members.length}`);
  }

  // Crawl sub-pages (individual articles/campaigns)
  const subPageUrls = links
    .filter((l) =>
      l.startsWith(sectionUrl + "/") ||
      l.startsWith(BASE_URL + section.path + "/")
    )
    .filter((l) => l !== sectionUrl && l !== sectionUrl + "/")
    .slice(0, MAX_SUBPAGES);

  if (subPageUrls.length > 0) {
    console.log(`  Crawling ${subPageUrls.length} sub-pages...`);
  }

  for (const subUrl of subPageUrls) {
    await sleep(DELAY_MS);
    console.log(`    -> ${subUrl.replace(BASE_URL, "")}`);
    const subHtml = await fetchPage(subUrl);
    if (!subHtml) continue;

    const sub$ = cheerio.load(subHtml);
    const subTitle = extractPageTitle(sub$);
    const subParagraphs = extractArticleContent(sub$);
    const subDate = extractDate(sub$);
    const subFullText = subParagraphs.join(" ");

    if (subTitle && subParagraphs.length > 0) {
      entries.push({
        title: subTitle,
        type: classifyType(subUrl, subTitle),
        status: subFullText.toLowerCase().includes("completed") ? "Completed" : "Active",
        description: subParagraphs.slice(0, 3).join(" ").slice(0, 500),
        partner_orgs: findPartners(subFullText),
        funding_source: findFunders(subFullText).join(", "),
        date_start: subDate,
        date_end: null,
        source_url: subUrl,
      });
      console.log(`      "${subTitle}" — ${subParagraphs.length} paragraphs`);
    }
  }

  // Also try pagination (page/2, page/3)
  for (let page = 2; page <= 3; page++) {
    const pageUrl = `${sectionUrl}/page/${page}`;
    await sleep(DELAY_MS);
    const pageHtml = await fetchPage(pageUrl);
    if (!pageHtml) break;

    const page$ = cheerio.load(pageHtml);
    const pageLinks = extractLinks(page$, section.path)
      .filter((l) => l.includes(section.path + "/") && !l.includes("/page/"))
      .slice(0, 5);

    for (const subUrl of pageLinks) {
      if (entries.some((e) => e.source_url === subUrl)) continue;
      await sleep(DELAY_MS);
      const subHtml = await fetchPage(subUrl);
      if (!subHtml) continue;

      const sub$ = cheerio.load(subHtml);
      const subTitle = extractPageTitle(sub$);
      const subParagraphs = extractArticleContent(sub$);

      if (subTitle && subParagraphs.length > 0) {
        entries.push({
          title: subTitle,
          type: classifyType(subUrl, subTitle),
          status: "Active",
          description: subParagraphs.slice(0, 3).join(" ").slice(0, 500),
          partner_orgs: findPartners(subParagraphs.join(" ")),
          funding_source: findFunders(subParagraphs.join(" ")).join(", "),
          date_start: extractDate(sub$),
          date_end: null,
          source_url: subUrl,
        });
      }
    }
  }

  return { entries, members };
}

async function main() {
  console.log("=== EcoWaste Coalition Website Crawler (v2) ===");
  console.log(`Target: ${BASE_URL}\n`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allEntries = [];
  let allMembers = [];

  for (const section of SECTIONS) {
    const { entries, members } = await crawlSection(section);
    allEntries.push(...entries);
    if (members.length > 0) allMembers = members;
    await sleep(DELAY_MS);
  }

  // Assign IDs
  const output = {
    scraped_at: new Date().toISOString(),
    base_url: BASE_URL,
    total_entries: allEntries.length,
    member_orgs_found: allMembers.length,
    entries: allEntries.map((e, i) => ({
      id: `web-${String(i + 1).padStart(3, "0")}`,
      ...e,
    })),
    member_organizations: allMembers,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n=== Done! ===`);
  console.log(`Total entries: ${allEntries.length}`);
  console.log(`Member orgs: ${allMembers.length}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch(console.error);
