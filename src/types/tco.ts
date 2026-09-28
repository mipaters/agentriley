export type Currency = "CAD" | "USD";
export type TcoScenarioId = "pilot" | "production" | "scaled";

export interface TcoAssumptions {
  addressableAccounts: number;
  accountsEvaluated: number;
  outreachSelectionRate: number;
  messagesPerAccount: number;
  campaignsPerMonth: number;
  responseRate: number;
  threadsPerRespondent: number;
  turnsPerConversation: number;
  inputTokensPerTurn: number;
  outputTokensPerTurn: number;
  retrievalCallsPerTurn: number;
  promptCacheRate: number;
  qualificationCompletionRate: number;
  qualificationRate: number;
  humanReviewRate: number;
  sellerRoutingRate: number;
  marketplaceRoutingRate: number;
  partnerRoutingRate: number;
  sellerAcceptanceRate: number;
  sellerCloseRate: number;
  marketplaceConversionRate: number;
  partnerConversionRate: number;
  seatsPerSale: number;
  copilotAttachRate: number;
  securityAttachRate: number;
  teamsPhoneAttachRate: number;
  connectivityAttachRate: number;
  microsoftAnnualContractValue: number;
  connectivityAnnualContractValue: number;
  grossMarginRate: number;
  sellerHourlyCost: number;
  sellerHoursSaved: number;
  crmReadsPerProspect: number;
  crmWritesPerQualified: number;
  logMbPerConversation: number;
  retentionMonths: number;
  environments: number;
  regions: number;
  currentCampaignCost: number;
  currentCostPerQualified: number;
  manualResearchHours: number;
  manualQualificationHours: number;
  manualCrmHours: number;
  avoidedSellerCapacity: number;
}

export interface AzureRateCard {
  hostingMonthly: number;
  searchMonthly: number;
  databaseMonthly: number;
  storagePerGb: number;
  apiManagementMonthly: number;
  keyVaultMonthly: number;
  monitoringMonthly: number;
  environmentMonthly: number;
  inputPerMillionTokens: number;
  outputPerMillionTokens: number;
  embeddingsPerMillionTokens: number;
  orchestrationPerThousand: number;
  retrievalPerThousand: number;
  evaluationPerThousand: number;
  summarizationPerThousand: number;
  workflowPerThousand: number;
  crmReadPerThousand: number;
  crmWritePerThousand: number;
  emailPerThousand: number;
  catalogPerThousand: number;
  marketplacePerThousand: number;
  auditPerMillion: number;
  additionalRegionMonthly: number;
  disasterRecoveryMonthly: number;
  privateNetworkingMonthly: number;
  enhancedMonitoringMonthly: number;
  auditRetentionPerGb: number;
  nonProductionMonthly: number;
  loadTestingMonthly: number;
  redTeamMonthly: number;
  premiumSupportMonthly: number;
}

export interface AzureCostCategory {
  name: string;
  amount: number;
  group: "Fixed" | "Variable AI" | "Variable process" | "Production controls";
}

export interface ImplementationFunding {
  route: "Microsoft FDE" | "Microsoft Industry Solutions Delivery" | "Partner-led implementation" | "Rogers-led implementation with Microsoft support" | "Custom scenario";
  grossInvestment: number | null;
  microsoftFunding: number | null;
  rogersContribution: number | null;
  partnerFunding: number | null;
  otherFunding: number | null;
  productionHardening: number;
  changeManagement: number;
  sellerEnablement: number;
}

export interface CustomerResourceCost {
  name: string;
  amount: number;
}

export interface SalesFunnelStage {
  name: string;
  volume: number;
  previousConversion: number;
  evaluatedConversion: number;
  cumulativeAzureCost: number;
  costPerOutcome: number | null;
  pipeline: number;
  bookings: number;
  grossMargin: number;
}

export interface SalesFunnel {
  stages: SalesFunnelStage[];
  evaluated: number;
  selected: number;
  contacted: number;
  responded: number;
  completed: number;
  qualified: number;
  approved: number;
  sellerRouted: number;
  marketplaceRouted: number;
  partnerRouted: number;
  closed: number;
  activated: number;
}

export interface UnitEconomics {
  costPerEvaluated: number | null;
  costPerContacted: number | null;
  costPerResponse: number | null;
  costPerConversation: number | null;
  costPerQualified: number | null;
  costPerSellerRouted: number | null;
  costPerMarketplaceRouted: number | null;
  costPerClosed: number | null;
  costPerSeat: number | null;
  costPerGrossMarginDollar: number | null;
}

export interface BusinessValue {
  qualifiedOpportunities: number;
  sellerRouted: number;
  marketplaceRouted: number;
  partnerRouted: number;
  completedSales: number;
  microsoftSeats: number;
  copilotSeats: number;
  securitySeats: number;
  teamsPhoneSeats: number;
  connectivityAttachments: number;
  microsoftBookings: number;
  connectivityBookings: number;
  totalBookings: number;
  grossMargin: number;
  sellerHoursReturned: number;
  azurePercentOfMargin: number | null;
  hardDollarValue: number;
}

export interface ThreeYearTcoRow {
  name: string;
  year1: number;
  year2: number;
  year3: number;
  type: "Cost" | "Benefit";
}

export interface ThreeYearTco {
  rows: ThreeYearTcoRow[];
  grossTco: number | null;
  netCustomerInvestment: number | null;
  grossBenefit: number;
  netEconomicValue: number | null;
  cumulativeCashFlow: number[];
  roi: number | null;
  paybackMonths: number | null;
  benefitCostRatio: number | null;
  breakEvenSales: number | null;
  breakEvenQualified: number | null;
}

export interface SensitivityScenario {
  name: "Conservative" | "Expected" | "Upside";
  responseRate: number;
  qualificationRate: number;
  closeRate: number;
  marketplaceConversion: number;
  annualContractValue: number;
  grossMarginRate: number;
  tokenRateMultiplier: number;
  conversationLengthMultiplier: number;
  implementationInvestment: number | null;
}

export interface FinOpsPolicy {
  campaignBudget: number;
  azureBudget: number;
  tokenBudgetMillions: number;
  maxCostPerQualified: number;
  maxCostPerClosed: number;
  maxTurns: number;
  maxRetries: number;
  maxContextTokens: number;
  logRetentionMonths: number;
  modelRoutingPolicy: string;
  promptCacheTarget: number;
  campaignPausePolicy: string;
  campaignPaused: boolean;
}

export interface FinOpsAlert {
  threshold: 50 | 75 | 90 | 100;
  currentPercent: number;
  breached: boolean;
  label: string;
}

export interface TcoScenario {
  id: TcoScenarioId;
  name: string;
  description: string;
  assumptions: TcoAssumptions;
}

export interface AzureRunRate {
  categories: AzureCostCategory[];
  fixed: number;
  variableAi: number;
  variableProcess: number;
  productionControls: number;
  monthly: number;
  annual: number;
}
