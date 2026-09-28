import type {
  AzureRateCard, AzureRunRate, BusinessValue, CustomerResourceCost, FinOpsAlert, FinOpsPolicy, ImplementationFunding,
  SalesFunnel, SensitivityScenario, TcoAssumptions, ThreeYearTco, UnitEconomics,
} from "../types/tco";

const pct = (value: number) => Math.max(0, value) / 100;
const safeDivide = (numerator: number, denominator: number) => denominator > 0 ? numerator / denominator : null;
const round = (value: number) => Math.max(0, Math.round(value));

export function calculateTokenConsumption(a: TcoAssumptions) {
  const selected = a.accountsEvaluated * pct(a.outreachSelectionRate) * a.campaignsPerMonth;
  const responses = selected * pct(a.responseRate);
  const conversations = responses * a.threadsPerRespondent;
  const turns = conversations * a.turnsPerConversation;
  const uncachedInputTokens = turns * a.inputTokensPerTurn * (1 - pct(a.promptCacheRate));
  return {
    selected,
    responses,
    conversations,
    turns,
    inputTokens: uncachedInputTokens,
    outputTokens: turns * a.outputTokensPerTurn,
    embeddingTokens: turns * 350,
    retrievalCalls: turns * a.retrievalCallsPerTurn,
  };
}

export function calculateAzureRunRate(a: TcoAssumptions, rates: AzureRateCard): AzureRunRate {
  const usage = calculateTokenConsumption(a);
  const storageGb = usage.conversations * a.logMbPerConversation * a.retentionMonths / 1024;
  const fixedCategories = [
    ["Application hosting", rates.hostingMonthly],
    ["Azure AI Search base capacity", rates.searchMonthly],
    ["Application database", rates.databaseMonthly],
    ["Storage", storageGb * rates.storagePerGb],
    ["API Management", rates.apiManagementMonthly],
    ["Key Vault", rates.keyVaultMonthly],
    ["Baseline monitoring", rates.monitoringMonthly],
    ["Minimum production environment", rates.environmentMonthly],
  ] as const;
  const aiCategories = [
    ["Azure OpenAI input tokens", usage.inputTokens / 1_000_000 * rates.inputPerMillionTokens],
    ["Azure OpenAI output tokens", usage.outputTokens / 1_000_000 * rates.outputPerMillionTokens],
    ["Embeddings", usage.embeddingTokens / 1_000_000 * rates.embeddingsPerMillionTokens],
    ["Agent orchestration", usage.turns / 1000 * rates.orchestrationPerThousand],
    ["Retrieval calls", usage.retrievalCalls / 1000 * rates.retrievalPerThousand],
    ["Evaluation-model usage", usage.conversations / 1000 * rates.evaluationPerThousand],
    ["Conversation summarization", usage.conversations / 1000 * rates.summarizationPerThousand],
  ] as const;
  const processCategories = [
    ["Workflow executions", usage.turns / 1000 * rates.workflowPerThousand],
    ["CRM reads", usage.selected * a.crmReadsPerProspect / 1000 * rates.crmReadPerThousand],
    ["CRM writes", usage.responses * pct(a.qualificationCompletionRate) * pct(a.qualificationRate) * a.crmWritesPerQualified / 1000 * rates.crmWritePerThousand],
    ["Email-processing events", usage.selected * a.messagesPerAccount / 1000 * rates.emailPerThousand],
    ["Offer-catalog calls", usage.conversations / 1000 * rates.catalogPerThousand],
    ["Marketplace-routing events", usage.responses * pct(a.marketplaceRoutingRate) / 1000 * rates.marketplacePerThousand],
    ["Audit events", usage.turns * 3 / 1_000_000 * rates.auditPerMillion],
  ] as const;
  const controlCategories = [
    ["Additional Azure region", Math.max(0, a.regions - 1) * rates.additionalRegionMonthly],
    ["Disaster recovery", a.regions > 1 ? rates.disasterRecoveryMonthly : 0],
    ["Private networking", rates.privateNetworkingMonthly],
    ["Enhanced security monitoring", rates.enhancedMonitoringMonthly],
    ["Longer audit retention", storageGb * rates.auditRetentionPerGb],
    ["Additional non-production environments", Math.max(0, a.environments - 1) * rates.nonProductionMonthly],
    ["Load testing", rates.loadTestingMonthly],
    ["Red-team and agent evaluation", rates.redTeamMonthly],
    ["Premium operational support allowance", rates.premiumSupportMonthly],
  ] as const;
  const make = (items: readonly (readonly [string, number])[], group: "Fixed" | "Variable AI" | "Variable process" | "Production controls") =>
    items.map(([name, amount]) => ({ name, amount, group }));
  const categories = [...make(fixedCategories, "Fixed"), ...make(aiCategories, "Variable AI"), ...make(processCategories, "Variable process"), ...make(controlCategories, "Production controls")];
  const total = (group: AzureRunRate["categories"][number]["group"]) => categories.filter((item) => item.group === group).reduce((sum, item) => sum + item.amount, 0);
  const fixed = total("Fixed");
  const variableAi = total("Variable AI");
  const variableProcess = total("Variable process");
  const productionControls = total("Production controls");
  return { categories, fixed, variableAi, variableProcess, productionControls, monthly: fixed + variableAi + variableProcess + productionControls, annual: (fixed + variableAi + variableProcess + productionControls) * 12 };
}

export function calculateFunnel(a: TcoAssumptions, monthlyAzureCost: number): SalesFunnel {
  const evaluated = round(a.accountsEvaluated * a.campaignsPerMonth);
  const selected = Math.min(evaluated, round(evaluated * pct(a.outreachSelectionRate)));
  const contacted = selected;
  const responded = Math.min(contacted, round(contacted * pct(a.responseRate)));
  const completed = Math.min(responded, round(responded * pct(a.qualificationCompletionRate)));
  const qualified = Math.min(completed, round(completed * pct(a.qualificationRate)));
  const approved = Math.min(qualified, round(qualified * pct(a.humanReviewRate)));
  const sellerRouted = Math.min(approved, round(approved * pct(a.sellerRoutingRate) * pct(a.sellerAcceptanceRate)));
  const marketplaceRouted = Math.min(approved, round(approved * pct(a.marketplaceRoutingRate)));
  const partnerRouted = Math.min(approved, round(approved * pct(a.partnerRoutingRate)));
  const closed = Math.min(approved, round(sellerRouted * pct(a.sellerCloseRate) + marketplaceRouted * pct(a.marketplaceConversionRate) + partnerRouted * pct(a.partnerConversionRate)));
  const activated = closed;
  const values = [
    ["Accounts evaluated", evaluated], ["Selected for outreach", selected], ["Contacted", contacted], ["Responded", responded],
    ["Qualification completed", completed], ["Qualified", qualified], ["Human approved", approved], ["Seller routed", sellerRouted],
    ["Marketplace routed", marketplaceRouted], ["Partner routed", partnerRouted], ["Closed", closed], ["Activated", activated],
  ] as const;
  const totalBookings = closed * (a.microsoftAnnualContractValue + a.connectivityAnnualContractValue * pct(a.connectivityAttachRate));
  const stages = values.map(([name, volume], index) => {
    const previous = index === 0 ? evaluated : values[index - 1][1];
    const progress = index / (values.length - 1);
    const cumulativeAzureCost = monthlyAzureCost * progress;
    const outcomeShare = activated > 0 ? Math.min(1, volume / Math.max(activated, 1)) : 0;
    const bookings = name === "Closed" || name === "Activated" ? totalBookings : 0;
    return {
      name, volume, previousConversion: safeDivide(volume * 100, previous) ?? 0, evaluatedConversion: safeDivide(volume * 100, evaluated) ?? 0,
      cumulativeAzureCost, costPerOutcome: safeDivide(cumulativeAzureCost, volume), pipeline: qualified > 0 ? totalBookings * outcomeShare : 0,
      bookings, grossMargin: bookings * pct(a.grossMarginRate),
    };
  });
  return { stages, evaluated, selected, contacted, responded, completed, qualified, approved, sellerRouted, marketplaceRouted, partnerRouted, closed, activated };
}

export function calculateBookings(a: TcoAssumptions, funnel: SalesFunnel) {
  const microsoftBookings = funnel.closed * a.microsoftAnnualContractValue;
  const connectivityAttachments = round(funnel.closed * pct(a.connectivityAttachRate));
  const connectivityBookings = connectivityAttachments * a.connectivityAnnualContractValue;
  return { microsoftBookings, connectivityAttachments, connectivityBookings, totalBookings: microsoftBookings + connectivityBookings };
}

export function calculateGrossMargin(bookings: number, grossMarginRate: number) {
  return Math.min(bookings, bookings * pct(grossMarginRate));
}

export function calculateSellerCapacityValue(a: TcoAssumptions, qualified: number) {
  return qualified * a.sellerHoursSaved * a.sellerHourlyCost;
}

export function calculateBusinessValue(a: TcoAssumptions, funnel: SalesFunnel, annualAzureCost: number): BusinessValue {
  const bookings = calculateBookings(a, funnel);
  const grossMargin = calculateGrossMargin(bookings.totalBookings, a.grossMarginRate);
  const sellerHoursReturned = funnel.qualified * a.sellerHoursSaved;
  const hardDollarValue = Math.max(0, a.currentCampaignCost) + calculateSellerCapacityValue(a, funnel.qualified) + grossMargin;
  return {
    qualifiedOpportunities: funnel.qualified, sellerRouted: funnel.sellerRouted, marketplaceRouted: funnel.marketplaceRouted,
    partnerRouted: funnel.partnerRouted, completedSales: funnel.closed, microsoftSeats: funnel.closed * a.seatsPerSale,
    copilotSeats: round(funnel.closed * a.seatsPerSale * pct(a.copilotAttachRate)), securitySeats: round(funnel.closed * a.seatsPerSale * pct(a.securityAttachRate)),
    teamsPhoneSeats: round(funnel.closed * a.seatsPerSale * pct(a.teamsPhoneAttachRate)), connectivityAttachments: bookings.connectivityAttachments,
    microsoftBookings: bookings.microsoftBookings, connectivityBookings: bookings.connectivityBookings, totalBookings: bookings.totalBookings,
    grossMargin, sellerHoursReturned, azurePercentOfMargin: safeDivide(annualAzureCost * 100, grossMargin), hardDollarValue,
  };
}

export function calculateUnitEconomics(azure: AzureRunRate, funnel: SalesFunnel, value: BusinessValue): UnitEconomics {
  return {
    costPerEvaluated: safeDivide(azure.monthly, funnel.evaluated), costPerContacted: safeDivide(azure.monthly, funnel.contacted),
    costPerResponse: safeDivide(azure.monthly, funnel.responded), costPerConversation: safeDivide(azure.monthly, funnel.completed),
    costPerQualified: safeDivide(azure.monthly, funnel.qualified), costPerSellerRouted: safeDivide(azure.monthly, funnel.sellerRouted),
    costPerMarketplaceRouted: safeDivide(azure.monthly, funnel.marketplaceRouted), costPerClosed: safeDivide(azure.monthly, funnel.closed),
    costPerSeat: safeDivide(azure.monthly, value.microsoftSeats), costPerGrossMarginDollar: safeDivide(azure.monthly, value.grossMargin),
  };
}

export function calculateNetCustomerInvestment(funding: ImplementationFunding) {
  if (funding.grossInvestment === null) return null;
  return Math.max(0, funding.grossInvestment - (funding.microsoftFunding ?? 0) - (funding.partnerFunding ?? 0) - (funding.otherFunding ?? 0));
}

export function calculateRoi(benefit: number, cost: number) { return cost > 0 ? (benefit - cost) / cost * 100 : null; }
export function calculateBenefitCostRatio(benefit: number, cost: number) { return safeDivide(benefit, cost); }
export function calculatePayback(investment: number, annualNetBenefit: number) { return annualNetBenefit > 0 ? investment / annualNetBenefit * 12 : null; }
export function calculateBreakEven(investment: number | null, marginPerSale: number, qualifiedToSaleRate: number) {
  if (investment === null || marginPerSale <= 0) return { sales: null, qualified: null };
  const sales = Math.ceil(investment / marginPerSale);
  return { sales, qualified: qualifiedToSaleRate > 0 ? Math.ceil(sales / qualifiedToSaleRate) : null };
}

export function calculateThreeYearTco(
  funding: ImplementationFunding, resources: CustomerResourceCost[], resourcesIncremental: boolean, azure: AzureRunRate, value: BusinessValue, funnel: SalesFunnel,
): ThreeYearTco {
  const implementation = funding.grossInvestment;
  const internal = resourcesIncremental ? resources.reduce((sum, item) => sum + item.amount, 0) : 0;
  const annualBenefit = value.grossMargin + Math.max(0, value.hardDollarValue - value.grossMargin);
  const rows = [
    { name: "FDE implementation", year1: implementation ?? 0, year2: 0, year3: 0, type: "Cost" as const },
    { name: "Rogers internal incremental implementation", year1: internal, year2: 0, year3: 0, type: "Cost" as const },
    { name: "Production hardening", year1: funding.productionHardening, year2: 0, year3: 0, type: "Cost" as const },
    { name: "Change management", year1: funding.changeManagement, year2: 0, year3: 0, type: "Cost" as const },
    { name: "Seller enablement", year1: funding.sellerEnablement, year2: 0, year3: 0, type: "Cost" as const },
    { name: "Azure operations", year1: azure.annual, year2: azure.annual * 1.08, year3: azure.annual * 1.16, type: "Cost" as const },
    { name: "Application and governance operations", year1: azure.annual * 0.35, year2: azure.annual * 0.4, year3: azure.annual * 0.45, type: "Cost" as const },
    { name: "Microsoft CSP bookings", year1: value.microsoftBookings, year2: value.microsoftBookings * 1.15, year3: value.microsoftBookings * 1.3, type: "Benefit" as const },
    { name: "Rogers connectivity bookings", year1: value.connectivityBookings, year2: value.connectivityBookings * 1.15, year3: value.connectivityBookings * 1.3, type: "Benefit" as const },
    { name: "Gross-margin contribution and avoided expense", year1: annualBenefit, year2: annualBenefit * 1.15, year3: annualBenefit * 1.3, type: "Benefit" as const },
  ];
  const grossTco = implementation === null ? null : rows.filter((row) => row.type === "Cost").reduce((sum, row) => sum + row.year1 + row.year2 + row.year3, 0);
  const grossBenefit = rows.filter((row) => row.name === "Gross-margin contribution and avoided expense").reduce((sum, row) => sum + row.year1 + row.year2 + row.year3, 0);
  const yearCosts = [0, 1, 2].map((year) => rows.filter((row) => row.type === "Cost").reduce((sum, row) => sum + [row.year1, row.year2, row.year3][year], 0));
  const yearBenefits = [annualBenefit, annualBenefit * 1.15, annualBenefit * 1.3];
  const cumulativeCashFlow = yearBenefits.map((benefit, index) => yearBenefits.slice(0, index + 1).reduce((sum, item) => sum + item, 0) - yearCosts.slice(0, index + 1).reduce((sum, item) => sum + item, 0));
  const qualifiedToSaleRate = safeDivide(funnel.closed, funnel.qualified) ?? 0;
  const marginPerSale = safeDivide(value.grossMargin, funnel.closed) ?? 0;
  const breakEven = calculateBreakEven(implementation, marginPerSale, qualifiedToSaleRate);
  return {
    rows, grossTco, netCustomerInvestment: calculateNetCustomerInvestment(funding), grossBenefit,
    netEconomicValue: grossTco === null ? null : grossBenefit - grossTco, cumulativeCashFlow,
    roi: grossTco === null ? null : calculateRoi(grossBenefit, grossTco),
    paybackMonths: implementation === null ? null : calculatePayback(implementation + internal, annualBenefit - azure.annual),
    benefitCostRatio: grossTco === null ? null : calculateBenefitCostRatio(grossBenefit, grossTco),
    breakEvenSales: breakEven.sales, breakEvenQualified: breakEven.qualified,
  };
}

export function calculateSensitivity(base: TcoAssumptions, scenarios: SensitivityScenario[], rates: AzureRateCard) {
  return scenarios.map((scenario) => {
    const assumptions = {
      ...base, responseRate: scenario.responseRate, qualificationRate: scenario.qualificationRate, sellerCloseRate: scenario.closeRate,
      marketplaceConversionRate: scenario.marketplaceConversion, microsoftAnnualContractValue: scenario.annualContractValue,
      grossMarginRate: scenario.grossMarginRate, turnsPerConversation: base.turnsPerConversation * scenario.conversationLengthMultiplier,
    };
    const adjustedRates = { ...rates, inputPerMillionTokens: rates.inputPerMillionTokens * scenario.tokenRateMultiplier, outputPerMillionTokens: rates.outputPerMillionTokens * scenario.tokenRateMultiplier };
    const azure = calculateAzureRunRate(assumptions, adjustedRates);
    const funnel = calculateFunnel(assumptions, azure.monthly);
    const value = calculateBusinessValue(assumptions, funnel, azure.annual);
    const costPerQualified = safeDivide(azure.monthly, funnel.qualified);
    const netValue = scenario.implementationInvestment === null ? null : value.grossMargin * 3 - azure.annual * 3 - scenario.implementationInvestment;
    return { name: scenario.name, netValue, costPerQualified, completedSales: funnel.closed, grossMargin: value.grossMargin };
  });
}

export function calculateFinOpsAlerts(policy: FinOpsPolicy, azure: AzureRunRate): FinOpsAlert[] {
  const currentPercent = policy.azureBudget > 0 ? azure.monthly / policy.azureBudget * 100 : 100;
  return ([50, 75, 90, 100] as const).map((threshold) => ({ threshold, currentPercent, breached: currentPercent >= threshold, label: `${threshold}% Azure budget` }));
}
