export interface PolicyNews {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  tags: string[];
}

// Load scraped news from Google News RSS
let rawNews: {
  articles: Array<{
    id: string;
    title: string;
    source: string;
    date: string;
    url: string;
    tags: string[];
  }>;
} = { articles: [] };

try {
  rawNews = require("../../scrapers/data/policy_bills.json");
} catch {
  // Scraper hasn't been run yet
}

export const policyNewsData: PolicyNews[] = (rawNews.articles || [])
  .filter((a) => a.title && a.date)
  .map((a) => ({
    id: a.id,
    title: a.title,
    source: a.source,
    date: a.date,
    url: a.url,
    tags: a.tags,
  }));
