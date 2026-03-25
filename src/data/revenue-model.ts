// Revenue Projection Model — 3 scenarios across all income streams

export interface RevenueStream {
  id: string;
  name: string;
  category: "Consulting" | "Training" | "Credits" | "Aggregation" | "Grants" | "Membership";
  description: string;
  conservative_annual: number;
  moderate_annual: number;
  aggressive_annual: number;
  assumptions: string;
  timeline: "0-6 months" | "6-18 months" | "18+ months";
  feasibility: "High" | "Medium" | "Low";
}

export const revenueStreams: RevenueStream[] = [
  {
    id: "rev-001",
    name: "LGU SWM Plan Consulting",
    category: "Consulting",
    description: "Develop Solid Waste Management Plans and WACS for non-compliant NCR LGUs",
    conservative_annual: 3_000_000,
    moderate_annual: 7_500_000,
    aggressive_annual: 15_000_000,
    assumptions: "Conservative: 2 LGUs × ₱1.5M. Moderate: 5 LGUs × ₱1.5M. Aggressive: 10 LGUs × ₱1.5M.",
    timeline: "6-18 months",
    feasibility: "High",
  },
  {
    id: "rev-002",
    name: "MRF Operations Management",
    category: "Consulting",
    description: "Manage and optimize Material Recovery Facilities for LGUs",
    conservative_annual: 600_000,
    moderate_annual: 1_500_000,
    aggressive_annual: 3_000_000,
    assumptions: "Conservative: 2 MRFs × ₱300K. Moderate: 5 MRFs. Aggressive: 10 MRFs.",
    timeline: "6-18 months",
    feasibility: "Medium",
  },
  {
    id: "rev-003",
    name: "Corporate Waste Training",
    category: "Training",
    description: "Paid training workshops for EPR-obliged companies and their supply chains",
    conservative_annual: 900_000,
    moderate_annual: 2_250_000,
    aggressive_annual: 4_500_000,
    assumptions: "Conservative: 6 workshops × ₱150K. Moderate: 15. Aggressive: 30.",
    timeline: "0-6 months",
    feasibility: "High",
  },
  {
    id: "rev-004",
    name: "LGU Waste Diversion Training",
    category: "Training",
    description: "Training for barangay workers, eco-aides, and LGU environment officers",
    conservative_annual: 450_000,
    moderate_annual: 1_200_000,
    aggressive_annual: 2_400_000,
    assumptions: "Conservative: 3 LGUs × ₱150K. Moderate: 8. Aggressive: 16.",
    timeline: "0-6 months",
    feasibility: "High",
  },
  {
    id: "rev-005",
    name: "Plastic Credit Aggregation",
    category: "Credits",
    description: "Aggregate and sell verified plastic credits via PCX Markets from junkshop network diversion",
    conservative_annual: 1_680_000,
    moderate_annual: 4_200_000,
    aggressive_annual: 8_400_000,
    assumptions: "Conservative: 200 tons × $106/ton × ₱56. Moderate: 500 tons. Aggressive: 1,000 tons. PCX floor rate.",
    timeline: "6-18 months",
    feasibility: "Medium",
  },
  {
    id: "rev-006",
    name: "Carbon Credits (Verra VCS)",
    category: "Credits",
    description: "Register waste diversion project with Verra for carbon credits",
    conservative_annual: 0,
    moderate_annual: 500_000,
    aggressive_annual: 2_000_000,
    assumptions: "Year 1: registration costs ($8,950). Break-even at 57 tons CO2e. Revenue starts Year 2.",
    timeline: "18+ months",
    feasibility: "Low",
  },
  {
    id: "rev-007",
    name: "Material Aggregation Margin",
    category: "Aggregation",
    description: "Broker fee / margin from aggregating materials across junkshop network",
    conservative_annual: 600_000,
    moderate_annual: 1_800_000,
    aggressive_annual: 4_200_000,
    assumptions: "Conservative: 100 tons/month × ₱0.50/kg margin. Moderate: ₱1.50/kg. Aggressive: ₱3.50/kg on 100 tons.",
    timeline: "6-18 months",
    feasibility: "Medium",
  },
  {
    id: "rev-008",
    name: "EPR Compliance Services",
    category: "Consulting",
    description: "Help EPR-obliged companies meet RA 11898 requirements — audits, collection programs, reporting",
    conservative_annual: 1_000_000,
    moderate_annual: 3_000_000,
    aggressive_annual: 6_000_000,
    assumptions: "Conservative: 2 companies × ₱500K. Moderate: 6. Aggressive: 12.",
    timeline: "0-6 months",
    feasibility: "High",
  },
  {
    id: "rev-009",
    name: "Zero-Waste Event Certification",
    category: "Training",
    description: "Certify events (festivals, concerts, corporate) as zero-waste. Traslacion is the proof case.",
    conservative_annual: 300_000,
    moderate_annual: 750_000,
    aggressive_annual: 1_500_000,
    assumptions: "Conservative: 3 events × ₱100K. Moderate: 5 × ₱150K. Aggressive: 10 × ₱150K.",
    timeline: "0-6 months",
    feasibility: "High",
  },
  {
    id: "rev-010",
    name: "Membership Dues (Tiered)",
    category: "Membership",
    description: "Introduce tiered membership: Free (advocacy access), Standard (₱5K/yr), Premium (₱25K/yr with data access)",
    conservative_annual: 250_000,
    moderate_annual: 675_000,
    aggressive_annual: 1_350_000,
    assumptions: "Conservative: 50 orgs × ₱5K. Moderate: 50 × ₱5K + 10 × ₱25K + 5 × ₱50K. Aggressive: double.",
    timeline: "6-18 months",
    feasibility: "Medium",
  },
];

export const SCENARIO_TOTALS = {
  conservative: revenueStreams.reduce((s, r) => s + r.conservative_annual, 0),
  moderate: revenueStreams.reduce((s, r) => s + r.moderate_annual, 0),
  aggressive: revenueStreams.reduce((s, r) => s + r.aggressive_annual, 0),
};

export const CURRENT_ESTIMATED_BUDGET = 20_000_000; // ₱20M
