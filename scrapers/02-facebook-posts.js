/**
 * EcoWaste Coalition Facebook Posts Scraper
 * Fetches recent posts from EcoWaste Coalition's Facebook page via Graph API.
 *
 * Usage: node scrapers/02-facebook-posts.js
 * Output: scrapers/data/ecowaste_facebook.json
 *
 * Required env vars:
 *   FB_ACCESS_TOKEN - Facebook Page Access Token (with pages_read_engagement)
 *   FB_PAGE_ID - Facebook Page ID (default: 282944807)
 *
 * If no token is available, the script outputs a template JSON with instructions.
 */

const fs = require("fs");
const path = require("path");

const PAGE_ID = process.env.FB_PAGE_ID || "282944807";
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const OUTPUT_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "ecowaste_facebook.json");
const POST_LIMIT = 30;

async function fetchFromGraphAPI(endpoint) {
  const url = `https://graph.facebook.com/v19.0/${endpoint}&access_token=${ACCESS_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Graph API error ${res.status}: ${text}`);
  }
  return res.json();
}

function classifyPost(message) {
  if (!message) return "Media Mention";
  const lower = message.toLowerCase();

  const campaignKeywords = [
    "campaign", "plastic free", "lead safe", "zero waste",
    "traslacion", "ban", "phase out", "advocacy",
  ];
  const projectKeywords = [
    "project", "survey", "monitoring", "workshop", "training",
    "MEAL", "assessment",
  ];

  if (campaignKeywords.some((k) => lower.includes(k))) return "Campaign";
  if (projectKeywords.some((k) => lower.includes(k))) return "Project";
  return "Media Mention";
}

async function fetchWithToken() {
  console.log("Fetching page info...");
  const pageInfo = await fetchFromGraphAPI(
    `${PAGE_ID}?fields=name,fan_count,talking_about_count,about,link,picture`
  );
  console.log(`  Page: ${pageInfo.name}`);
  console.log(`  Followers: ${pageInfo.fan_count}`);
  console.log(`  Talking about: ${pageInfo.talking_about_count}`);

  console.log(`\nFetching last ${POST_LIMIT} posts...`);
  const postsData = await fetchFromGraphAPI(
    `${PAGE_ID}/posts?fields=id,message,created_time,full_picture,permalink_url,likes.summary(true),comments.summary(true),shares&limit=${POST_LIMIT}`
  );

  const posts = (postsData.data || []).map((post, i) => {
    const createdDate = new Date(post.created_time);
    const now = new Date();
    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

    return {
      id: `fb-${String(i + 1).padStart(3, "0")}`,
      title: (post.message || "").split("\n")[0].slice(0, 100) || "Facebook Post",
      type: classifyPost(post.message),
      status: daysDiff <= 90 ? "Active" : "Completed",
      description: (post.message || "").slice(0, 200),
      partner_orgs: [],
      funding_source: "",
      date_start: post.created_time,
      date_end: null,
      source_url: post.permalink_url || "",
      fb_metadata: {
        post_id: post.id,
        full_picture: post.full_picture || null,
        likes: post.likes?.summary?.total_count || 0,
        comments: post.comments?.summary?.total_count || 0,
        shares: post.shares?.count || 0,
      },
    };
  });

  return {
    page_info: {
      name: pageInfo.name,
      fan_count: pageInfo.fan_count,
      talking_about_count: pageInfo.talking_about_count,
      about: pageInfo.about,
      link: pageInfo.link,
      picture: pageInfo.picture?.data?.url || null,
    },
    posts,
    scraped_at: new Date().toISOString(),
  };
}

function generateTemplate() {
  console.log("No FB_ACCESS_TOKEN found. Generating template with instructions.\n");
  console.log("To get a token:");
  console.log("1. Go to https://developers.facebook.com/tools/explorer/");
  console.log("2. Select your app (or create one)");
  console.log("3. Add permission: pages_read_engagement, pages_read_user_content");
  console.log("4. Generate token and extend to long-lived");
  console.log("5. Run: FB_ACCESS_TOKEN=<your_token> node scrapers/02-facebook-posts.js\n");

  return {
    page_info: {
      name: "EcoWaste Coalition",
      fan_count: 30700,
      talking_about_count: 413,
      about:
        "A national ecological network of over 130 public interest groups working for sustainable solutions to waste and chemical issues.",
      link: "https://www.facebook.com/EWCoalition/",
      picture: null,
      note: "PLACEHOLDER DATA — run with FB_ACCESS_TOKEN to get live data",
    },
    posts: [
      {
        id: "fb-001",
        title: "Marine Litter Monitoring Survey final presentation",
        type: "Project",
        status: "Completed",
        description:
          "EcoWaste Coalition presents the final results of the 3-year Marine Litter Monitoring Survey covering 10 sites along Manila Bay. Funded by KOICA.",
        partner_orgs: ["DLSU-Dasmarinas", "OSEAN"],
        funding_source: "KOICA",
        date_start: "2026-03-17T08:00:00+0800",
        date_end: null,
        source_url: "https://www.facebook.com/EWCoalition/",
        fb_metadata: { post_id: "placeholder", likes: 0, comments: 0, shares: 0 },
      },
      {
        id: "fb-002",
        title: "Plastic Free Pilipinas MEAL workshop",
        type: "Campaign",
        status: "Active",
        description:
          "3-day MEAL and Communications workshop with Plastic Free Pilipinas network partners. Building capacity for monitoring, evaluation, accountability and learning.",
        partner_orgs: ["Plastic Free Pilipinas"],
        funding_source: "",
        date_start: "2026-03-10T08:00:00+0800",
        date_end: null,
        source_url: "https://www.facebook.com/EWCoalition/",
        fb_metadata: { post_id: "placeholder", likes: 0, comments: 0, shares: 0 },
      },
      {
        id: "fb-003",
        title: "Lead Safe Paint certification update",
        type: "Campaign",
        status: "Active",
        description:
          "Latest round of third-party Lead Safe Paint certification results published. Engaging Philippine Building and Construction industry.",
        partner_orgs: ["IPEN"],
        funding_source: "IPEN / SAICM",
        date_start: "2026-03-05T08:00:00+0800",
        date_end: null,
        source_url: "https://www.facebook.com/EWCoalition/",
        fb_metadata: { post_id: "placeholder", likes: 0, comments: 0, shares: 0 },
      },
    ],
    scraped_at: new Date().toISOString(),
    note: "TEMPLATE — No FB_ACCESS_TOKEN provided. Data is placeholder. See instructions above.",
  };
}

async function main() {
  console.log("=== EcoWaste Facebook Posts Scraper ===\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let result;
  if (ACCESS_TOKEN) {
    try {
      result = await fetchWithToken();
      console.log(`\nFetched ${result.posts.length} posts.`);
    } catch (err) {
      console.error(`Error fetching from Graph API: ${err.message}`);
      console.log("Falling back to template...\n");
      result = generateTemplate();
    }
  } else {
    result = generateTemplate();
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log(`\nOutput: ${OUTPUT_FILE}`);
}

main().catch(console.error);
