// Waste Value Chain — price at each step from household to factory
// Shows where value is captured and where EcoWaste can intervene

export interface ValueChainStep {
  id: string;
  stage: string;
  actor: string;
  description: string;
  price_range_php_per_kg: [number, number] | null;
  margin_captured: string;
  ecowaste_role: string;
  color: string;
}

export interface MaterialFlow {
  material: string;
  short_name: string;
  household: number;
  eco_aide: number;
  junkshop: number;
  consolidator: number;
  factory: number;
  lme: number | null;
  total_value_chain_margin: number;
  ecowaste_opportunity: string;
}

export const valueChainSteps: ValueChainStep[] = [
  {
    id: "vc-1",
    stage: "Household / Source",
    actor: "Resident / Business",
    description: "Waste generated. Segregated or unsegregated. Most goes to collection trucks, some to eco-aides.",
    price_range_php_per_kg: null,
    margin_captured: "0%",
    ecowaste_role: "Advocacy: push LGU segregation enforcement under RA 9003",
    color: "var(--text-muted)",
  },
  {
    id: "vc-2",
    stage: "Eco-Aide / Waste Picker",
    actor: "Informal waste workers (~2,500 in Metro Manila)",
    description: "Collect recyclables door-to-door or from transfer stations. Sell to nearest junkshop.",
    price_range_php_per_kg: [0, 8],
    margin_captured: "5-15%",
    ecowaste_role: "WWEE program: skills training, cooperative formation, safety equipment",
    color: "var(--data-blue)",
  },
  {
    id: "vc-3",
    stage: "Junkshop / Bote-Dyaryo",
    actor: "~1,268 shops in NCR (336 mapped)",
    description: "Buy from eco-aides and walk-ins. Sort, bale, and sell to consolidators. Average 20-50% markup.",
    price_range_php_per_kg: [5, 50],
    margin_captured: "20-50%",
    ecowaste_role: "Network formalization: data sharing, price transparency, cooperative structure",
    color: "var(--accent)",
  },
  {
    id: "vc-4",
    stage: "Consolidator / Aggregator",
    actor: "Regional scrap dealers, trading companies",
    description: "Aggregate from multiple junkshops. Quality control, transport to factories. 10-30% markup.",
    price_range_php_per_kg: [10, 70],
    margin_captured: "10-30%",
    ecowaste_role: "Potential: EcoWaste as verified aggregator for plastic credits",
    color: "var(--data-amber)",
  },
  {
    id: "vc-5",
    stage: "Recycling Factory",
    actor: "Domestic recyclers, export buyers",
    description: "Process into raw material (flakes, pellets, ingots). Sell to manufacturers.",
    price_range_php_per_kg: [15, 350],
    margin_captured: "15-40%",
    ecowaste_role: "EPR compliance partner: connect obliged companies to verified recyclers",
    color: "var(--data-purple)",
  },
  {
    id: "vc-6",
    stage: "Global Commodity Market",
    actor: "LME, international buyers",
    description: "Benchmark pricing. Local prices track at 30-70% of global rates.",
    price_range_php_per_kg: [20, 515],
    margin_captured: "Reference price",
    ecowaste_role: "Intelligence: provide junkshop network with global price signals",
    color: "var(--data-red)",
  },
];

export const materialFlows: MaterialFlow[] = [
  {
    material: "PET Clean",
    short_name: "PET",
    household: 0,
    eco_aide: 8,
    junkshop: 16,
    consolidator: 20,
    factory: 25,
    lme: null,
    total_value_chain_margin: 25,
    ecowaste_opportunity: "Plastic credit overlay: +₱5.94/kg at PCX floor. Total potential ₱30.94/kg.",
  },
  {
    material: "Aluminum Cans",
    short_name: "ALU",
    household: 0,
    eco_aide: 30,
    junkshop: 50,
    consolidator: 60,
    factory: 80,
    lme: 181.58,
    total_value_chain_margin: 181.58,
    ecowaste_opportunity: "₱121.58/kg gap between local sell and LME. Biggest arbitrage opportunity in the chain.",
  },
  {
    material: "Copper Wire",
    short_name: "CU",
    household: 0,
    eco_aide: 200,
    junkshop: 300,
    consolidator: 350,
    factory: 400,
    lme: 515,
    total_value_chain_margin: 515,
    ecowaste_opportunity: "₱165/kg gap. Highest value material. E-waste disassembly unlocks copper recovery.",
  },
  {
    material: "Scrap Iron",
    short_name: "FE",
    household: 0,
    eco_aide: 4,
    junkshop: 8,
    consolidator: 12,
    factory: 16,
    lme: 21.28,
    total_value_chain_margin: 21.28,
    ecowaste_opportunity: "High volume, low value. Margins thin. Best as aggregation play.",
  },
  {
    material: "Carton",
    short_name: "CTN",
    household: 0,
    eco_aide: 1,
    junkshop: 2.5,
    consolidator: 3,
    factory: 4,
    lme: null,
    total_value_chain_margin: 4,
    ecowaste_opportunity: "Staple trade for bote-dyaryo network. Low margin but consistent volume.",
  },
  {
    material: "Glass (Clear)",
    short_name: "GLS",
    household: 0,
    eco_aide: 0.5,
    junkshop: 1,
    consolidator: 5,
    factory: 8,
    lme: null,
    total_value_chain_margin: 8,
    ecowaste_opportunity: "400% margin from junkshop to consolidator. Transport cost is the barrier.",
  },
];
