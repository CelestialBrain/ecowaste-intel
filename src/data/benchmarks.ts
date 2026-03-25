export interface Benchmark {
  id: string;
  org_name: string;
  country: string;
  type: "Competitor" | "Peer" | "Model";
  annual_budget: string;
  funding_mix: string;
  key_metric: string;
  key_metric_value: string;
  earned_income_model: string;
  waste_worker_engagement: string;
  lesson_for_ecowaste: string;
}

export const benchmarksData: Benchmark[] = [
  {
    id: "bm-001",
    org_name: "Linis Ganda",
    country: "Philippines",
    type: "Competitor",
    annual_budget: "~₱50M",
    funding_mix: "40% grants, 30% earned income, 30% donations",
    key_metric: "Junkshop network",
    key_metric_value: "572 shops, 2,500 workers, 1,200 eco-aides",
    earned_income_model: "Material aggregation fees, cooperative membership dues, training services to LGUs",
    waste_worker_engagement: "Direct employment of eco-aides, cooperative structure, health insurance provision",
    lesson_for_ecowaste: "Linis Ganda proves the junkshop network model works at scale. EcoWaste has 336 mapped shops — Linis Ganda has 572. Differentiate on data/technology (dashboard, price transparency) rather than competing on network size.",
  },
  {
    id: "bm-002",
    org_name: "Plastic Bank",
    country: "Global (PH operations)",
    type: "Model",
    annual_budget: "$10M+ (global)",
    funding_mix: "70% corporate partnerships, 20% plastic credit sales, 10% grants",
    key_metric: "Active collectors",
    key_metric_value: "30,251 globally, ~3,000 in Philippines",
    earned_income_model: "Plastic credits sold to brands (SC Johnson, Henkel, Dell). Blockchain-verified collection. Premium pricing.",
    waste_worker_engagement: "Collectors paid above market rate via app. Banking services included. Digital wage records.",
    lesson_for_ecowaste: "Plastic Bank gets premium prices ($230/ton vs $106 floor) because of corporate partnerships + blockchain verification. EcoWaste can replicate the credit model without the tech overhead by leveraging its NSWMC seat for credibility.",
  },
  {
    id: "bm-003",
    org_name: "Mother Earth Foundation",
    country: "Philippines",
    type: "Peer",
    annual_budget: "~₱30M",
    funding_mix: "60% grants, 25% LGU consulting, 15% training fees",
    key_metric: "LGUs served",
    key_metric_value: "50+ LGUs with zero-waste programs",
    earned_income_model: "Paid LGU consulting for SWM plans (₱1-3M per engagement), zero-waste certification fees, training programs",
    waste_worker_engagement: "Community-based MRF programs, waste worker cooperatives in partner LGUs",
    lesson_for_ecowaste: "MEF already does what the LGU compliance module suggests. They charge ₱1-3M per SWM plan. EcoWaste should partner or differentiate — the dashboard + data advantage is the differentiator.",
  },
  {
    id: "bm-004",
    org_name: "Waste Aid",
    country: "UK / Africa",
    type: "Model",
    annual_budget: "£2M (~₱140M)",
    funding_mix: "50% grants (DFID, EU), 30% corporate, 20% consulting",
    key_metric: "Countries active",
    key_metric_value: "8 countries, 500+ waste workers trained",
    earned_income_model: "Consulting fees from international development projects, training certification licensing",
    waste_worker_engagement: "Train-the-trainer model. Certify local NGOs to deliver waste management training.",
    lesson_for_ecowaste: "Waste Aid's train-the-trainer model could work for EcoWaste — certify member orgs to deliver standardized training, earn licensing fees.",
  },
  {
    id: "bm-005",
    org_name: "Chintan Environmental Research and Action Group",
    country: "India",
    type: "Model",
    annual_budget: "~$1.5M (~₱84M)",
    funding_mix: "45% grants, 35% earned income (consulting + material sales), 20% donations",
    key_metric: "Waste workers organized",
    key_metric_value: "10,000+ waste pickers in cooperatives",
    earned_income_model: "E-waste collection services for corporates, consulting on waste policy, carbon credit sales from waste diversion",
    waste_worker_engagement: "Cooperative formation, ID cards, bank accounts, children's education programs",
    lesson_for_ecowaste: "Chintan monetizes e-waste collection for corporates — EcoWaste already has the Caloocan TSD facility. This is an untapped revenue stream.",
  },
  {
    id: "bm-006",
    org_name: "Philippine Business for Social Progress (PBSP)",
    country: "Philippines",
    type: "Model",
    annual_budget: "~₱500M",
    funding_mix: "60% corporate contributions, 25% training institute, 15% consulting",
    key_metric: "Training revenue",
    key_metric_value: "₱125M/year from training institute alone",
    earned_income_model: "Built a training institute in the 1980s that now generates 25% of total budget. Corporate members pay annual dues. Consulting arm charges market rates.",
    waste_worker_engagement: "N/A (corporate-focused)",
    lesson_for_ecowaste: "PBSP is the Philippine precedent for nonprofit → earned income transition. They did it through a training institute. EcoWaste can follow the same path with waste management training certification.",
  },
];

export const ECOWASTE_POSITION = {
  junkshops_mapped: 336,
  estimated_total: 1268,
  member_orgs: 135,
  annual_budget: "~₱20M (estimated)",
  funding_mix: "80% grants, 15% project fees, 5% donations",
  key_advantage: "NSWMC statutory seat + 130 member network + 25 years advocacy track record",
  key_gap: "No earned income model, no CRM, paper-based operations, donor-dependent",
};
