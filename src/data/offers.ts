import type { Offer } from "../types";

export const offers: Offer[] = [
  {
    id: "modern-workplace",
    name: "Rogers Business Modern Workplace",
    description: "A unified communications, collaboration, and security foundation for a growing team.",
    products: ["Existing Business Internet", "Existing Rogers wireless", "Microsoft 365 Business Premium", "Microsoft Defender for Business", "Teams Phone", "Optional Microsoft 365 Copilot"],
    need: "Consolidate tools, simplify security administration, and support a new office.",
    confidence: 92,
    annualValue: 28800,
    dependencies: ["Validate current Microsoft agreement", "Confirm Teams Phone readiness", "Seller-led commercial review"],
    talkingPoints: ["One relationship across connectivity and workplace technology", "Consistent identity and device controls", "Simpler collaboration across locations"],
  },
  {
    id: "secure-growth",
    name: "Rogers Business Secure Growth",
    description: "Connectivity and managed protection designed for expansion without adding security complexity.",
    products: ["Rogers connectivity", "Microsoft 365 Business Premium", "Managed security", "Identity and device protection", "Security posture review"],
    need: "Reduce security administration risk while the business expands.",
    confidence: 84,
    annualValue: 32400,
    dependencies: ["Security discovery", "Device inventory", "Approved service scope"],
    talkingPoints: ["Security controls designed around business growth", "Visibility across users and devices", "Human-led posture review"],
  },
  {
    id: "ai-ready",
    name: "Rogers Business AI-Ready Workplace",
    description: "A secure productivity platform with Copilot adoption and enablement support.",
    products: ["Rogers connectivity", "Microsoft 365 Business Premium", "Microsoft 365 Copilot", "Teams Phone", "Adoption and enablement services"],
    need: "Prepare the team to use AI productively with appropriate governance.",
    confidence: 76,
    annualValue: 36600,
    dependencies: ["AI readiness assessment", "Data governance review", "Eligible Microsoft licensing"],
    talkingPoints: ["Start with secure foundations", "Prioritize high-value roles and use cases", "Support adoption with clear controls"],
  },
];
