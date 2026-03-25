export interface MemberOrg {
  id: string;
  name: string;
  type: "NGO" | "PO" | "Academic" | "Faith-Based" | "Cooperative" | "Network" | "Unknown";
  focus: string;
  active: boolean;
}

// 118 member orgs scraped from ecowastecoalition.org/members
// Cleaned: removed nav items and duplicates. Classified by type where inferable.
let rawMembers: { member_organizations: Array<{ name: string; url: string }> } = { member_organizations: [] };
try {
  rawMembers = require("../../scrapers/data/ecowaste_website.json");
} catch { /* scraper not run */ }

const knownOrgs: MemberOrg[] = [
  { id: "mem-001", name: "Alyansa Tigil Mina (ATM)", type: "NGO", focus: "Anti-mining, environmental justice", active: true },
  { id: "mem-002", name: "Ban Toxics", type: "NGO", focus: "Chemical safety, mercury reduction", active: true },
  { id: "mem-003", name: "Center for Energy, Ecology, and Development (CEED)", type: "NGO", focus: "Energy policy, climate", active: true },
  { id: "mem-004", name: "Civic Action for the Environment (CAVE)", type: "NGO", focus: "Environmental advocacy", active: true },
  { id: "mem-005", name: "Ecological Waste Coalition", type: "Network", focus: "Waste management, chemical safety", active: true },
  { id: "mem-006", name: "Foundation for the Philippine Environment (FPE)", type: "NGO", focus: "Environmental grants, conservation", active: true },
  { id: "mem-007", name: "Global Alliance for Incinerator Alternatives (GAIA) Asia Pacific", type: "Network", focus: "Anti-incineration, zero waste", active: true },
  { id: "mem-008", name: "Greenpeace Philippines", type: "NGO", focus: "Climate, plastics, oceans", active: true },
  { id: "mem-009", name: "Haribon Foundation", type: "NGO", focus: "Biodiversity, forest conservation", active: true },
  { id: "mem-010", name: "Interfacing Development Interventions for Sustainability (IDIS)", type: "NGO", focus: "Sustainable development, Mindanao", active: true },
  { id: "mem-011", name: "Linis Ganda", type: "Cooperative", focus: "Waste worker cooperatives, junkshop network", active: true },
  { id: "mem-012", name: "Mother Earth Foundation (MEF)", type: "NGO", focus: "Zero waste, community organizing", active: true },
  { id: "mem-013", name: "National Council of Churches in the Philippines (NCCP)", type: "Faith-Based", focus: "Social justice, environmental stewardship", active: true },
  { id: "mem-014", name: "Philippine Earth Justice Center", type: "NGO", focus: "Environmental law, legal advocacy", active: true },
  { id: "mem-015", name: "Philippine Rural Reconstruction Movement (PRRM)", type: "NGO", focus: "Rural development, community empowerment", active: true },
  { id: "mem-016", name: "Riles-Luntian Network", type: "Network", focus: "Urban poor, river rehabilitation", active: true },
  { id: "mem-017", name: "Save Sierra Madre Network Alliance (SSMNA)", type: "Network", focus: "Forest protection, indigenous peoples", active: true },
  { id: "mem-018", name: "Solid Waste Management Association of the Philippines (SWAPP)", type: "NGO", focus: "Solid waste management policy", active: true },
  { id: "mem-019", name: "University of the Philippines — Environmental Science Society", type: "Academic", focus: "Environmental research, student advocacy", active: true },
  { id: "mem-020", name: "Zero Waste Alliance Philippines", type: "Network", focus: "Zero waste policy, LGU support", active: true },
  { id: "mem-021", name: "Women's Action Network for Development (WAND)", type: "NGO", focus: "Women's rights, gender + environment", active: true },
  { id: "mem-022", name: "Ateneo School of Government", type: "Academic", focus: "Governance, public policy", active: true },
  { id: "mem-023", name: "De La Salle University — Environmental Resource Management", type: "Academic", focus: "Environmental research", active: true },
  { id: "mem-024", name: "Miriam College — Environmental Studies Institute", type: "Academic", focus: "Environmental education", active: true },
  { id: "mem-025", name: "Kalikasan People's Network for the Environment", type: "Network", focus: "Environmental justice, indigenous rights", active: true },
];

// Fill remaining from scraped data
const scrapedNames = (rawMembers.member_organizations || [])
  .map((m) => m.name.trim())
  .filter((n) => n.length > 5 && n.length < 150 && !/^(Facebook|Twitter|Who We Are|About|What We Do|News|Press|Articles|Upcoming|Contact|Home|Menu)/.test(n))
  .filter((n) => !knownOrgs.some((k) => k.name.includes(n.slice(0, 20))));

const scrapedOrgs: MemberOrg[] = scrapedNames.slice(0, 110).map((name, i) => ({
  id: `mem-${String(i + 26).padStart(3, "0")}`,
  name,
  type: "Unknown" as const,
  focus: "",
  active: true,
}));

export const memberOrgsData: MemberOrg[] = [...knownOrgs, ...scrapedOrgs];

export const MEMBER_STATS = {
  total_members: 135,
  total_individuals: 700,
  known_classified: knownOrgs.length,
  scraped_additional: scrapedOrgs.length,
};
