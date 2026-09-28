import type { CostMetric } from "../types";

export const funnelData = [
  { name: "Analyzed", value: 12480 },
  { name: "High propensity", value: 2140 },
  { name: "Contactable", value: 1672 },
  { name: "Engaged", value: 624 },
  { name: "Qualified", value: 238 },
  { name: "Approved", value: 191 },
  { name: "Opportunity", value: 176 },
  { name: "Won", value: 63 },
];

export const trendData = [
  { week: "W1", pipeline: 420, qualified: 31 },
  { week: "W2", pipeline: 610, qualified: 43 },
  { week: "W3", pipeline: 780, qualified: 52 },
  { week: "W4", pipeline: 960, qualified: 67 },
];

export const costMetrics: CostMetric[] = [
  { label: "AI inference", amount: 2840 },
  { label: "Email processing", amount: 920 },
  { label: "Data retrieval", amount: 1680 },
  { label: "Integration", amount: 3200 },
  { label: "Monitoring", amount: 1160 },
  { label: "Human review", amount: 5400 },
];
