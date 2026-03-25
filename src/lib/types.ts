export interface Junkshop {
  id: string;
  name: string;
  area: string;
  barangay: string;
  lat: number;
  lng: number;
  materials: string[];
  status: "Informal" | "Semi-formal" | "Accredited MRF";
  source: "Google Maps" | "DENR Registry" | "Manual";
  phone?: string;
  rating?: number;
}

export interface Material {
  id: string;
  name: string;
  short_name: string;
  category: "Plastic" | "Metal" | "Paper";
  buy_price_php_per_kg: number;
  sell_price_php_per_kg: number;
  trend_label: string;
  trend_direction: "up" | "down" | "flat";
  last_updated: string;
  source: string;
}

export interface EPRCompany {
  id: string;
  company_name: string;
  sector: string;
  epr_status: "Active Partner" | "Lead Prospect" | "EPR Registered" | "Target";
  compliance_level: "High" | "Medium" | "Low";
  known_program: string;
  strategic_angle: string;
  source: "DENR EPR Registry" | "PSE Edge" | "Manual";
}

export interface Grant {
  id: string;
  funder: string;
  program_name: string;
  amount_range: string;
  status: "Active" | "Open" | "Annual" | "Rolling" | "Procurement";
  focus_areas: string[];
  contact_point: string;
  deadline_note: string;
  url: string;
  notes: string;
}

export interface EcoWasteActivity {
  id: string;
  title: string;
  type: "Campaign" | "Project" | "Policy Win" | "Media Mention" | "Partnership";
  status: "Active" | "Completed" | "Upcoming";
  description: string;
  partner_orgs: string[];
  funding_source: string;
  date_start: string;
  date_end: string | null;
  source_url: string;
}
