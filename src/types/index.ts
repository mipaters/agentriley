export type Status = "Confirmed" | "Likely" | "Unknown" | "Not qualified";

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  consent: "Permitted" | "Pending" | "Opted out";
}

export interface Signal {
  label: string;
  type: "Growth" | "Intent" | "Engagement" | "Renewal";
  date: string;
  strength: "High" | "Medium" | "Low";
}

export interface ConsentRecord {
  status: "Permitted" | "Pending" | "Opted out";
  channel: string;
  source: string;
  validatedAt: string;
}

export interface ProductHolding {
  provider: "Rogers Business" | "Microsoft" | "Other";
  name: string;
  detail: string;
}

export interface Account {
  id: string;
  company: string;
  industry: string;
  city: string;
  province: string;
  employees: number;
  rogersProducts: string[];
  microsoftProducts: string[];
  growthSignal: string;
  intentSignal: string;
  contactability: "High" | "Medium" | "Low";
  consentStatus: "Permitted" | "Pending" | "Opted out";
  propensity: number;
  estimatedValue: number;
  recentSignal: string;
  recommendedAction: string;
  stage: string;
  assignedSeller: string;
  challenge: string;
  contacts: Contact[];
  signals: Signal[];
  scoreBreakdown: Record<string, number>;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  products: string[];
  need: string;
  confidence: number;
  annualValue: number;
  dependencies: string[];
  talkingPoints: string[];
}

export interface ConversationMessage {
  id: string;
  sender: "Riley" | "Customer";
  text: string;
  timestamp: string;
}

export interface Conversation {
  accountId: string;
  status: "Not started" | "Active" | "Stopped" | "Qualified";
  step: number;
  branch?: "need" | "provider" | "timing";
  messages: ConversationMessage[];
}

export type ConversationResponseId =
  | "need"
  | "provider"
  | "timing"
  | "optout"
  | "accessOwner"
  | "newOffice90"
  | "singleSupport"
  | "termEnds"
  | "stayProvider"
  | "earlyAssessment"
  | "budgetFlexible"
  | "budgetUnknown"
  | "stakeholders"
  | "scheduleMeeting"
  | "sendSummary"
  | "notReady";

export interface Qualification {
  accountId: string;
  score: number;
  criteria: Record<string, { status: Status; points: number; rationale: string }>;
}

export interface Approval {
  id: string;
  accountId: string;
  action: string;
  status: "Pending" | "Approved" | "Changes requested" | "Rejected";
  createdAt: string;
}

export interface Opportunity {
  id: string;
  accountId: string;
  name: string;
  value: number;
  stage: string;
  products: string[];
  closeTiming: string;
  seller: string;
}

export interface AuditEvent {
  id: string;
  type: string;
  detail: string;
  timestamp: string;
}

export interface CampaignMetric {
  label: string;
  value: number;
  display: string;
}

export interface CostMetric {
  label: string;
  amount: number;
}

export interface Controls {
  consentValidation: boolean;
  optOutEnforcement: boolean;
  suppressionLists: boolean;
  frequencyCaps: boolean;
  humanApproval: boolean;
  piiMasking: boolean;
  sourceTransparency: boolean;
  contentFiltering: boolean;
  costThreshold: boolean;
  killSwitch: boolean;
}
