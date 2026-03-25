export interface Bill {
  id: string;
  bill_number: string;
  title: string;
  author: string;
  status: "Pending" | "Committee" | "2nd Reading" | "3rd Reading" | "Enacted" | "Vetoed";
  chamber: "Senate" | "House" | "Executive";
  tags: string[];
  date_filed: string;
  relevance: "High" | "Medium" | "Low";
  ecowaste_impact: string;
  url: string;
}

// Seed data — Philippine gov sites block scrapers (403).
// These are known environment/waste bills from the 19th Congress.
// Run `npm run scrape:bills` to attempt live refresh.
export const billsData: Bill[] = [
  {
    id: "bill-001",
    bill_number: "RA 11898",
    title: "Extended Producer Responsibility Act of 2022",
    author: "Sen. Cynthia Villar / Multiple",
    status: "Enacted",
    chamber: "Executive",
    tags: ["EPR", "Plastics", "Waste Management"],
    date_filed: "2022-07-22",
    relevance: "High",
    ecowaste_impact:
      "Core enabling law for EcoWaste's EPR work. Obligates large enterprises to manage post-consumer plastic waste. Creates the compliance market EcoWaste can service.",
    url: "https://www.officialgazette.gov.ph/2022/07/22/republic-act-no-11898/",
  },
  {
    id: "bill-002",
    bill_number: "RA 9003",
    title: "Ecological Solid Waste Management Act of 2000",
    author: "Multiple",
    status: "Enacted",
    chamber: "Executive",
    tags: ["Waste Management", "Recycling"],
    date_filed: "2001-01-26",
    relevance: "High",
    ecowaste_impact:
      "Foundation law for EcoWaste's existence. Mandates LGU solid waste plans, MRFs, and the NSWMC where EcoWaste holds the NGO seat.",
    url: "https://emb.gov.ph/republic-act-9003/",
  },
  {
    id: "bill-003",
    bill_number: "SB 2425",
    title: "Act Strengthening the Implementation of the EPR Act (RA 11898 Amendments)",
    author: "Sen. Cynthia Villar",
    status: "Committee",
    chamber: "Senate",
    tags: ["EPR", "Plastics"],
    date_filed: "2024-08-15",
    relevance: "High",
    ecowaste_impact:
      "Would strengthen EPR enforcement penalties and expand covered products. Directly benefits EcoWaste's monitoring/compliance role.",
    url: "https://legacy.senate.gov.ph",
  },
  {
    id: "bill-004",
    bill_number: "SB 1950",
    title: "Carbon Credit Trading Act",
    author: "Sen. Sherwin Gatchalian",
    status: "Committee",
    chamber: "Senate",
    tags: ["Climate/Carbon"],
    date_filed: "2023-11-20",
    relevance: "Medium",
    ecowaste_impact:
      "Would formalize carbon credit trading in PH. EcoWaste's waste diversion activities could generate tradeable carbon credits under this framework.",
    url: "https://legacy.senate.gov.ph",
  },
  {
    id: "bill-005",
    bill_number: "HB 8861",
    title: "National Recycling and Circular Economy Act",
    author: "Rep. Angelina Tan",
    status: "2nd Reading",
    chamber: "House",
    tags: ["Recycling", "Waste Management"],
    date_filed: "2024-02-10",
    relevance: "High",
    ecowaste_impact:
      "Would mandate national recycling targets and create government procurement preferences for recycled materials. Major upside for junkshop network formalization.",
    url: "https://www.congress.gov.ph",
  },
  {
    id: "bill-006",
    bill_number: "SB 2100",
    title: "Anti-Incineration Act Strengthening (RA 8749 Amendment)",
    author: "Sen. Loren Legarda",
    status: "Pending",
    chamber: "Senate",
    tags: ["Pollution", "Waste Management"],
    date_filed: "2024-05-08",
    relevance: "High",
    ecowaste_impact:
      "EcoWaste is the leading anti-incineration advocacy group. This bill would close loopholes being used to permit waste-to-energy (WtE) incinerators.",
    url: "https://legacy.senate.gov.ph",
  },
  {
    id: "bill-007",
    bill_number: "HB 9552",
    title: "Deposit Return System Act for Beverage Containers",
    author: "Rep. Edgar Chatto",
    status: "Committee",
    chamber: "House",
    tags: ["Recycling", "EPR"],
    date_filed: "2024-09-12",
    relevance: "Medium",
    ecowaste_impact:
      "Would create a deposit-refund system for PET and aluminum containers. EcoWaste's junkshop partners would benefit from guaranteed buyback prices.",
    url: "https://www.congress.gov.ph",
  },
  {
    id: "bill-008",
    bill_number: "SB 1800",
    title: "Green Jobs Act Expansion",
    author: "Sen. Joel Villanueva",
    status: "Pending",
    chamber: "Senate",
    tags: ["Environment", "Recycling"],
    date_filed: "2023-09-15",
    relevance: "Low",
    ecowaste_impact:
      "Expands green job certification to include waste workers and junkshop operators. Could legitimize the informal sector EcoWaste supports.",
    url: "https://legacy.senate.gov.ph",
  },
  {
    id: "bill-009",
    bill_number: "HB 7788",
    title: "Toxic-Free Schools and Childcare Facilities Act",
    author: "Rep. France Castro",
    status: "Committee",
    chamber: "House",
    tags: ["Hazardous Waste", "Pollution"],
    date_filed: "2024-01-20",
    relevance: "Medium",
    ecowaste_impact:
      "Aligns with EcoWaste's Lead Safe Paint campaign and chemical safety advocacy in schools.",
    url: "https://www.congress.gov.ph",
  },
  {
    id: "bill-010",
    bill_number: "EO 301",
    title: "Philippine Green Procurement Policy",
    author: "Executive",
    status: "Enacted",
    chamber: "Executive",
    tags: ["Environment", "Recycling"],
    date_filed: "2023-01-01",
    relevance: "Medium",
    ecowaste_impact:
      "Mandates government agencies to prefer eco-labeled products. Creates demand-side pull for recycled materials that EcoWaste's network can supply.",
    url: "https://www.officialgazette.gov.ph",
  },
  {
    id: "bill-011",
    bill_number: "RA 11285",
    title: "Energy Efficiency and Conservation Act",
    author: "Multiple",
    status: "Enacted",
    chamber: "Executive",
    tags: ["Climate/Carbon", "Environment"],
    date_filed: "2019-04-12",
    relevance: "Low",
    ecowaste_impact:
      "Tax incentives for energy-efficient waste recovery equipment. EcoWaste could leverage this for MRF upgrades.",
    url: "https://www.officialgazette.gov.ph/2019/04/12/republic-act-no-11285/",
  },
  {
    id: "bill-012",
    bill_number: "SB 2650",
    title: "Chemical Safety and Right-to-Know Act",
    author: "Sen. Risa Hontiveros",
    status: "Pending",
    chamber: "Senate",
    tags: ["Hazardous Waste", "Pollution"],
    date_filed: "2025-01-10",
    relevance: "High",
    ecowaste_impact:
      "Would mandate disclosure of hazardous chemicals in consumer products. Directly supports EcoWaste's core chemical safety advocacy mission.",
    url: "https://legacy.senate.gov.ph",
  },
];
