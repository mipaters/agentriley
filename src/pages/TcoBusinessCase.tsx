import { useMemo, useState } from "react";
import {
  AlertTriangle, BriefcaseBusiness, Calculator, CheckCircle2, ChevronDown, ChevronUp,
  CircleDollarSign, Gauge, Landmark, Pause, Play, Settings2, Sparkles, WalletCards,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Badge, Button, Card, PageHeader, ProgressBar } from "../components/ui";
import { useDemo } from "../context/DemoContext";
import { tcoScenarios } from "../data/tcoData";
import {
  calculateAzureRunRate, calculateBusinessValue, calculateFinOpsAlerts, calculateFunnel, calculateNetCustomerInvestment,
  calculateSensitivity, calculateThreeYearTco, calculateTokenConsumption, calculateUnitEconomics,
} from "../lib/tcoCalculations";
import type { AzureRateCard, FinOpsPolicy, ImplementationFunding, TcoAssumptions } from "../types/tco";

const USD_RATE = 0.74;
const percentageFields = new Set<keyof TcoAssumptions>([
  "outreachSelectionRate", "responseRate", "promptCacheRate", "qualificationCompletionRate", "qualificationRate", "humanReviewRate",
  "sellerRoutingRate", "marketplaceRoutingRate", "partnerRoutingRate", "sellerAcceptanceRate", "sellerCloseRate",
  "marketplaceConversionRate", "partnerConversionRate", "copilotAttachRate", "securityAttachRate", "teamsPhoneAttachRate",
  "connectivityAttachRate", "grossMarginRate",
]);

const assumptionGroups: Array<{ title: string; fields: Array<[keyof TcoAssumptions, string]> }> = [
  { title: "Campaign", fields: [["addressableAccounts", "Addressable SMB accounts"], ["accountsEvaluated", "Accounts evaluated per month"], ["outreachSelectionRate", "Selected for outreach"], ["messagesPerAccount", "Messages per selected account"], ["campaignsPerMonth", "Campaigns per month"]] },
  { title: "Engagement", fields: [["responseRate", "Expected response rate"], ["threadsPerRespondent", "Threads per respondent"], ["turnsPerConversation", "Riley turns per conversation"], ["inputTokensPerTurn", "Input tokens per turn"], ["outputTokensPerTurn", "Output tokens per turn"], ["retrievalCallsPerTurn", "Retrieval calls per turn"], ["promptCacheRate", "Reusable prompt cache"]] },
  { title: "Qualification", fields: [["qualificationCompletionRate", "Completing qualification"], ["qualificationRate", "Becoming qualified"], ["humanReviewRate", "Requiring human review"], ["sellerRoutingRate", "Routed to Rogers seller"], ["marketplaceRoutingRate", "Routed to marketplace"], ["partnerRoutingRate", "Routed to partner"], ["sellerAcceptanceRate", "Seller acceptance rate"]] },
  { title: "Conversion", fields: [["sellerCloseRate", "Seller close rate"], ["marketplaceConversionRate", "Marketplace conversion"], ["partnerConversionRate", "Partner conversion"], ["seatsPerSale", "Microsoft 365 seats per sale"], ["copilotAttachRate", "Copilot attach rate"], ["securityAttachRate", "Security attach rate"], ["teamsPhoneAttachRate", "Teams Phone attach rate"], ["connectivityAttachRate", "Rogers connectivity attach rate"]] },
  { title: "Commercial", fields: [["microsoftAnnualContractValue", "Microsoft CSP annual contract value"], ["connectivityAnnualContractValue", "Rogers connectivity annual contract value"], ["grossMarginRate", "Gross-margin percentage"], ["sellerHourlyCost", "Loaded seller cost per hour"], ["sellerHoursSaved", "Seller hours saved per qualified opportunity"]] },
  { title: "Operations", fields: [["crmReadsPerProspect", "CRM reads per prospect"], ["crmWritesPerQualified", "CRM writes per qualified opportunity"], ["logMbPerConversation", "Log MB per conversation"], ["retentionMonths", "Data retention months"], ["environments", "Number of environments"], ["regions", "Number of Azure regions"]] },
];

const rateGroups: Array<{ title: string; fields: Array<[keyof AzureRateCard, string]> }> = [
  { title: "Fixed platform", fields: [["hostingMonthly", "Application hosting / month"], ["searchMonthly", "Azure AI Search / month"], ["databaseMonthly", "Application database / month"], ["storagePerGb", "Storage / GB"], ["apiManagementMonthly", "API Management / month"], ["keyVaultMonthly", "Key Vault / month"], ["monitoringMonthly", "Baseline monitoring / month"], ["environmentMonthly", "Production environment / month"]] },
  { title: "Variable AI", fields: [["inputPerMillionTokens", "Input / million tokens"], ["outputPerMillionTokens", "Output / million tokens"], ["embeddingsPerMillionTokens", "Embeddings / million tokens"], ["orchestrationPerThousand", "Orchestration / thousand"], ["retrievalPerThousand", "Retrieval / thousand"], ["evaluationPerThousand", "Evaluation / thousand"], ["summarizationPerThousand", "Summarization / thousand"]] },
  { title: "Variable process", fields: [["workflowPerThousand", "Workflow / thousand"], ["crmReadPerThousand", "CRM reads / thousand"], ["crmWritePerThousand", "CRM writes / thousand"], ["emailPerThousand", "Email events / thousand"], ["catalogPerThousand", "Catalog calls / thousand"], ["marketplacePerThousand", "Marketplace events / thousand"], ["auditPerMillion", "Audit events / million"]] },
  { title: "Production controls", fields: [["additionalRegionMonthly", "Additional region / month"], ["disasterRecoveryMonthly", "Disaster recovery / month"], ["privateNetworkingMonthly", "Private networking / month"], ["enhancedMonitoringMonthly", "Enhanced monitoring / month"], ["auditRetentionPerGb", "Audit retention / GB"], ["nonProductionMonthly", "Non-production environment / month"], ["loadTestingMonthly", "Load testing / month"], ["redTeamMonthly", "Red-team evaluation / month"], ["premiumSupportMonthly", "Premium support allowance / month"]] },
];

const phases = [
  { title: "Phase 1: Frame", items: ["Confirm business owner and target segment", "Define measurable business outcomes", "Select initial Microsoft CSP offers", "Confirm seller and marketplace routing", "Confirm data, consent, and email governance", "Establish baseline KPIs", "Approve target architecture"] },
  { title: "Phase 2: Build", items: ["Connect synthetic or approved signals", "Configure CloudAscent-style propensity ingestion", "Configure outreach and qualification", "Integrate Rogers CRM pattern", "Configure seller and marketplace routing", "Implement approvals, telemetry, security, and governance"] },
  { title: "Phase 3: Prove", items: ["Run a controlled pilot", "Measure response, qualification, routing, bookings, and pipeline", "Evaluate cost per qualified opportunity", "Optimize models, prompts, and retrieval", "Produce production backlog and scale recommendation", "Transfer operational knowledge to Rogers"] },
];

const scope = [
  "Rogers Business SMB accounts", "Rogers product ownership", "Microsoft product footprint", "CloudAscent-style propensity signals",
  "Contactability and consent", "Email outreach", "Conversational qualification", "Microsoft 365, Copilot, Security and Teams Phone recommendations",
  "Rogers seller routing", "Rogers digital-marketplace routing", "Human approval", "CRM opportunity creation", "Audit and observability", "TCO and value measurement",
];

function NumberField({ label, value, onChange, suffix, placeholder, step = 1 }: { label: string; value: number | null; onChange: (value: number | null) => void; suffix?: string; placeholder?: string; step?: number }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span><div className="relative"><input type="number" min="0" step={step} value={value ?? ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-12 text-sm" />{suffix && <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">{suffix}</span>}</div></label>;
}

export function TcoBusinessCase() {
  const demo = useDemo();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [ratesOpen, setRatesOpen] = useState(false);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [selectedSensitivity, setSelectedSensitivity] = useState(1);
  const multiplier = demo.currency === "CAD" ? 1 : USD_RATE;
  const currency = demo.currency;
  const money = (value: number | null, compact = false) => value === null ? "Not available" : new Intl.NumberFormat("en-CA", { style: "currency", currency, notation: compact ? "compact" : "standard", maximumFractionDigits: compact ? 1 : 0 }).format(value * multiplier);
  const number = (value: number) => new Intl.NumberFormat("en-CA", { maximumFractionDigits: 1 }).format(value);

  const results = useMemo(() => {
    const azure = calculateAzureRunRate(demo.tcoAssumptions, demo.azureRateCard);
    const funnel = calculateFunnel(demo.tcoAssumptions, azure.monthly);
    const value = calculateBusinessValue(demo.tcoAssumptions, funnel, azure.annual);
    const unit = calculateUnitEconomics(azure, funnel, value);
    const threeYear = calculateThreeYearTco(demo.implementationFunding, demo.customerResources, demo.resourcesIncremental, azure, value, funnel);
    const sensitivity = calculateSensitivity(demo.tcoAssumptions, demo.sensitivityScenarios, demo.azureRateCard);
    const alerts = calculateFinOpsAlerts(demo.finOpsPolicy, azure);
    const tokens = calculateTokenConsumption(demo.tcoAssumptions);
    return { azure, funnel, value, unit, threeYear, sensitivity, alerts, tokens };
  }, [demo.tcoAssumptions, demo.azureRateCard, demo.implementationFunding, demo.customerResources, demo.resourcesIncremental, demo.sensitivityScenarios, demo.finOpsPolicy]);

  const costChart = [
    { name: "Fixed", value: results.azure.fixed * multiplier, fill: "#2563EB" },
    { name: "AI", value: results.azure.variableAi * multiplier, fill: "#7C3AED" },
    { name: "Process", value: results.azure.variableProcess * multiplier, fill: "#D97706" },
    { name: "Controls", value: results.azure.productionControls * multiplier, fill: "#DA291C" },
  ];
  const annualChart = [0, 1, 2].map((index) => ({
    year: `Year ${index + 1}`,
    cost: results.threeYear.rows.filter((row) => row.type === "Cost").reduce((sum, row) => sum + [row.year1, row.year2, row.year3][index], 0) * multiplier,
    benefit: results.threeYear.rows.filter((row) => row.name === "Gross-margin contribution and avoided expense").reduce((sum, row) => sum + [row.year1, row.year2, row.year3][index], 0) * multiplier,
    cashFlow: results.threeYear.cumulativeCashFlow[index] * multiplier,
  }));
  const selectedScenario = tcoScenarios.find((item) => item.id === demo.tcoScenario)!;
  const investmentEntered = demo.implementationFunding.grossInvestment !== null;
  const implementationFields: Array<[keyof ImplementationFunding, string]> = [
    ["grossInvestment", "Gross FDE implementation investment"], ["microsoftFunding", "Potential Microsoft funding contribution"],
    ["rogersContribution", "Potential Rogers contribution"], ["partnerFunding", "Potential partner contribution"], ["otherFunding", "Other approved funding"],
  ];

  return (
    <div>
      <PageHeader eyebrow="TCO & Business Case" title="Understand the economics of an AI-powered inside-sales channel." description="Agent Riley combines a Microsoft co-engineering engagement, ongoing Azure consumption and Rogers operational ownership to create qualified Microsoft CSP pipeline and recurring Rogers Business revenue." actions={<div className="flex rounded-xl bg-slate-200 p-1"><button onClick={() => demo.setCurrency("CAD")} className={`rounded-lg px-4 py-2 text-sm font-bold ${currency === "CAD" ? "bg-white shadow" : "text-slate-500"}`}>CAD</button><button onClick={() => demo.setCurrency("USD")} className={`rounded-lg px-4 py-2 text-sm font-bold ${currency === "USD" ? "bg-white shadow" : "text-slate-500"}`}>USD</button></div>} />

      <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /><p>All financial values are synthetic planning assumptions. They are not an approved Microsoft, Rogers, Azure, FDE or partner quote. Final implementation investment and Azure operating costs require formal architecture, usage and commercial validation.</p></div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Implementation model", "Microsoft Forward Deployed Engineering", "Outcome-oriented co-engineering"],
          ["Engagement duration", "Three months", "Outcome-oriented co-engineering engagement"],
          ["Implementation investment", investmentEntered ? money(demo.implementationFunding.grossInvestment) : "Pending formal implementation proposal", investmentEntered ? "Presenter-entered scenario assumption" : "TBD through formal scoping"],
          ["Monthly Azure run rate", money(results.azure.monthly), `${selectedScenario.name} calculated scenario`],
          ["Azure cost / qualified opportunity", money(results.unit.costPerQualified), `${results.funnel.qualified} qualified per month`],
          ["Break-even completed sales", results.threeYear.breakEvenSales === null ? "Pending formal implementation proposal" : number(results.threeYear.breakEvenSales), "Calculated after implementation input"],
          ["Three-year TCO", results.threeYear.grossTco === null ? "Pending formal implementation proposal" : money(results.threeYear.grossTco), "Gross economic cost; funding does not reduce TCO"],
        ].map(([label, value, detail], index) => <Card key={label} className={index === 3 || index === 4 ? "border-blue-200 bg-blue-50/40" : ""}><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className={`mt-3 font-bold tracking-tight ${value.length > 24 ? "text-lg" : "text-3xl"}`}>{value}</p><p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p></Card>)}
      </div>

      <section className="mt-8">
        <PageHeader eyebrow="Scenario presets" title="Choose a scale pattern" description="Every total is calculated from the editable workload assumptions and illustrative Azure rate card." />
        <div className="grid gap-4 lg:grid-cols-3">
          {tcoScenarios.map((scenario) => <button key={scenario.id} onClick={() => demo.setTcoScenario(scenario.id)} className={`rounded-2xl border p-5 text-left shadow-card transition ${demo.tcoScenario === scenario.id ? "border-red-300 bg-red-50 ring-2 ring-red-100" : "border-slate-200 bg-white hover:border-red-200"}`}><div className="flex justify-between gap-3"><h3 className="font-bold">{scenario.name}</h3>{demo.tcoScenario === scenario.id && <Badge tone="success">Active</Badge>}</div><p className="mt-3 text-sm leading-6 text-slate-600">{scenario.description}</p><p className="mt-4 text-xs font-bold uppercase text-slate-500">{scenario.assumptions.accountsEvaluated.toLocaleString()} accounts evaluated</p></button>)}
        </div>
      </section>

      <section className="mt-10">
        <PageHeader eyebrow="Implementation model" title="A three-month co-engineering path" description="Microsoft Forward Deployed Engineering would work with Rogers as an outcome-oriented co-engineering team for a fixed engagement period. The engagement would create a production-oriented Agent Riley vertical slice, integrate the agreed data and workflow components, establish governance and observability, run a controlled pilot and transfer the solution pattern to Rogers." />
        <Card><dl className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{[["Implementation route", "Microsoft Forward Deployed Engineering"], ["Engagement pattern", "Three-month co-engineering engagement"], ["Commercial treatment", "Subject to FDE intake, qualification, scoping, staffing, funding, contracting and formal proposal"], ["Target outcome", "Controlled production pilot for Rogers Business"]].map(([label, value]) => <div key={label}><dt className="text-xs font-bold uppercase text-slate-500">{label}</dt><dd className="mt-2 text-sm leading-6 font-semibold">{value}</dd></div>)}</dl></Card>
        <div className="mt-5 grid gap-5 xl:grid-cols-3">{phases.map((phase, index) => <Card key={phase.title}><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rogers font-bold text-white">{index + 1}</span><h3 className="text-lg font-bold">{phase.title}</h3></div><ul className="mt-5 space-y-2">{phase.items.map((item) => <li key={item} className="flex gap-2 text-sm leading-5 text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />{item}</li>)}</ul></Card>)}</div>
        <Card className="mt-5"><h3 className="font-bold">Initial Agent Riley scope</h3><div className="mt-4 flex flex-wrap gap-2">{scope.map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">{item}</span>)}</div></Card>
      </section>

      <section className="mt-10 grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="flex items-center gap-3"><WalletCards className="text-rogers" /><div><p className="text-xs font-bold uppercase tracking-widest text-rogers">Implementation investment</p><h2 className="mt-1 text-xl font-bold">Presenter-entered commercial assumptions</h2></div></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Implementation route</span><select value={demo.implementationFunding.route} onChange={(event) => demo.updateImplementationFunding("route", event.target.value as ImplementationFunding["route"])} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm">{["Microsoft FDE", "Microsoft Industry Solutions Delivery", "Partner-led implementation", "Rogers-led implementation with Microsoft support", "Custom scenario"].map((route) => <option key={route}>{route}</option>)}</select></label>
            {implementationFields.map(([key, label]) => <NumberField key={key} label={label} value={demo.implementationFunding[key] as number | null} placeholder="TBD through formal scoping" suffix={currency} onChange={(value) => demo.updateImplementationFunding(key, value)} />)}
          </div>
          {investmentEntered && <Badge tone="warning">Presenter-entered scenario assumption</Badge>}
          <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">Net Rogers implementation investment</p><p className="mt-2 text-2xl font-bold">{money(calculateNetCustomerInvestment(demo.implementationFunding))}</p><p className="mt-2 text-xs leading-5 text-slate-500">Gross investment minus Microsoft, partner and other approved funding. Rogers contribution is not subtracted.</p></div>
          <p className="mt-4 text-sm leading-6 text-slate-600">Funding treatment changes who pays for implementation. It does not change the gross economic cost of creating the solution.</p>
        </Card>
        <Card className="bg-charcoal text-white"><Landmark className="h-7 w-7 text-red-300" /><h2 className="mt-4 text-xl font-bold">Commercial boundary</h2><p className="mt-3 text-sm leading-6 text-slate-300">No implementation price is pre-populated. FDE investment remains subject to formal intake, staffing, architecture, scope, funding, contracting, and proposal.</p><div className="mt-5 rounded-xl bg-white/10 p-4 text-sm font-semibold">Do not interpret this planning model as an FDE, ISD, Azure, Rogers, or partner quote.</div></Card>
      </section>

      <section className="mt-5">
        <button onClick={() => setResourcesOpen((value) => !value)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card"><div><p className="font-bold">Rogers internal enablement assumptions</p><p className="mt-1 text-xs text-slate-500">Optional presenter-entered Rogers resource assumptions</p></div>{resourcesOpen ? <ChevronUp /> : <ChevronDown />}</button>
        {resourcesOpen && <Card className="mt-3"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{demo.customerResources.map((resource, index) => <NumberField key={resource.name} label={resource.name} value={resource.amount} suffix={currency} onChange={(value) => demo.updateCustomerResource(index, value ?? 0)} />)}</div><label className="mt-5 flex items-center gap-3 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900"><input type="checkbox" checked={demo.resourcesIncremental} onChange={(event) => demo.setResourcesIncremental(event.target.checked)} className="h-4 w-4 accent-red-600" />Treat Rogers resource assumptions as incremental cash cost</label></Card>}
      </section>

      <section className="mt-10">
        <PageHeader eyebrow="Ongoing Azure operating costs" title="Consumption follows workload and control assumptions" description="Illustrative demo rates support scenario planning only. Validate every rate using the Azure Pricing Calculator and Rogers' Microsoft commercial agreement." />
        <div className="grid gap-5 xl:grid-cols-[1fr_370px]">
          <Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[["Monthly fixed", results.azure.fixed], ["Variable AI", results.azure.variableAi], ["Variable process", results.azure.variableProcess], ["Production controls", results.azure.productionControls]].map(([label, value]) => <div key={label as string} className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-2 text-xl font-bold text-blue-800">{money(value as number)}</p></div>)}
            </div>
            <div className="mt-6 h-72" aria-label={`Monthly Azure cost chart totaling ${money(results.azure.monthly)}`}><ResponsiveContainer width="100%" height="100%"><BarChart data={costChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis domain={[0, "auto"]} tickFormatter={(value) => money(value / multiplier, true)} /><Tooltip formatter={(value) => money(Number(value) / multiplier)} /><Bar dataKey="value" name={`Monthly cost (${currency})`} radius={[6, 6, 0, 0]}>{costChart.map((item) => <Cell key={item.name} fill={item.fill} />)}</Bar></BarChart></ResponsiveContainer></div>
          </Card>
          <Card className="bg-blue-950 text-white"><CircleDollarSign className="h-7 w-7 text-blue-300" /><p className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-300">Total Azure run rate</p><p className="mt-2 text-4xl font-bold">{money(results.azure.monthly)}</p><p className="text-sm text-blue-200">per month</p><div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs uppercase text-blue-300">Annual run rate</p><p className="mt-1 text-2xl font-bold">{money(results.azure.annual)}</p></div><div className="mt-5 rounded-xl bg-white/10 p-4 text-xs leading-5 text-blue-100">{number(results.tokens.inputTokens / 1_000_000)}M input tokens and {number(results.tokens.outputTokens / 1_000_000)}M output tokens per month after prompt-cache reuse.</div></Card>
        </div>
        <button onClick={() => setRatesOpen((value) => !value)} className="mt-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card"><div><p className="font-bold">Editable Azure rate card</p><p className="mt-1 text-xs text-slate-500">Illustrative demo rate. Validate using the Azure Pricing Calculator and Rogers' Microsoft commercial agreement.</p></div>{ratesOpen ? <ChevronUp /> : <ChevronDown />}</button>
        {ratesOpen && <div className="mt-4 grid gap-5 xl:grid-cols-2">{rateGroups.map((group) => <Card key={group.title}><h3 className="font-bold">{group.title}</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{group.fields.map(([key, label]) => <NumberField key={key} label={label} value={demo.azureRateCard[key]} step={0.01} suffix={currency} onChange={(value) => demo.updateAzureRate(key, value ?? 0)} />)}</div></Card>)}</div>}
      </section>

      <section className="mt-10">
        <button onClick={() => setAssumptionsOpen((value) => !value)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card"><div className="flex items-center gap-3"><Settings2 className="text-rogers" /><div><p className="font-bold">Workload assumptions</p><p className="mt-1 text-xs text-slate-500">Changing any input immediately recalculates every affected metric and chart.</p></div></div>{assumptionsOpen ? <ChevronUp /> : <ChevronDown />}</button>
        {assumptionsOpen && <div className="mt-4 grid gap-5 xl:grid-cols-2">{assumptionGroups.map((group) => <Card key={group.title}><h3 className="font-bold">{group.title}</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{group.fields.map(([key, label]) => <NumberField key={key} label={label} value={demo.tcoAssumptions[key]} suffix={percentageFields.has(key) ? "%" : undefined} step={percentageFields.has(key) ? 0.1 : 1} onChange={(value) => demo.updateTcoAssumption(key, value ?? 0)} />)}</div></Card>)}</div>}
      </section>

      <section className="mt-10">
        <PageHeader eyebrow="Funnel and unit economics" title="Measure cost at every outcome" description="Volumes never exceed their applicable prior stage. Pipeline, bookings, gross margin, and costs all come from the same calculated scenario." />
        <Card className="overflow-hidden p-0"><div className="overflow-x-auto"><table className="w-full min-w-[1150px] text-left text-xs"><thead className="bg-slate-50 uppercase tracking-wide text-slate-500"><tr>{["Stage", "Volume", "From prior", "From evaluated", "Cumulative Azure", "Cost / outcome", "Pipeline", "Bookings", "Gross margin"].map((item) => <th key={item} className="px-4 py-3">{item}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{results.funnel.stages.map((stage) => <tr key={stage.name}><td className="px-4 py-3 font-semibold">{stage.name}</td><td className="px-4 py-3">{stage.volume.toLocaleString()}</td><td className="px-4 py-3">{stage.previousConversion.toFixed(1)}%</td><td className="px-4 py-3">{stage.evaluatedConversion.toFixed(1)}%</td><td className="px-4 py-3">{money(stage.cumulativeAzureCost)}</td><td className="px-4 py-3">{money(stage.costPerOutcome)}</td><td className="px-4 py-3">{money(stage.pipeline, true)}</td><td className="px-4 py-3">{money(stage.bookings, true)}</td><td className="px-4 py-3">{money(stage.grossMargin, true)}</td></tr>)}</tbody></table></div></Card>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[
          ["Cost / evaluated account", results.unit.costPerEvaluated], ["Cost / contacted prospect", results.unit.costPerContacted],
          ["Cost / response", results.unit.costPerResponse], ["Cost / completed conversation", results.unit.costPerConversation],
          ["Cost / qualified opportunity", results.unit.costPerQualified], ["Cost / seller-routed opportunity", results.unit.costPerSellerRouted],
          ["Cost / marketplace route", results.unit.costPerMarketplaceRouted], ["Cost / closed sale", results.unit.costPerClosed],
          ["Cost / Microsoft seat", results.unit.costPerSeat], ["Cost / gross-margin dollar", results.unit.costPerGrossMarginDollar],
        ].map(([label, value]) => <Card key={label as string}><p className="text-xs font-bold uppercase leading-5 text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold">{money(value as number | null)}</p></Card>)}</div>
      </section>

      <section className="mt-10">
        <PageHeader eyebrow="Business outcomes" title="Bookings, margin, and seller capacity" description="Hard-dollar value and operational value remain separate unless a presenter supplies a financial assumption." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
          ["Qualified opportunities", results.value.qualifiedOpportunities.toLocaleString()], ["Completed sales", results.value.completedSales.toLocaleString()],
          ["Microsoft 365 seats", results.value.microsoftSeats.toLocaleString()], ["Copilot seats", results.value.copilotSeats.toLocaleString()],
          ["Total attributable bookings", money(results.value.totalBookings, true)], ["Gross-margin contribution", money(results.value.grossMargin, true)],
          ["Seller hours returned", number(results.value.sellerHoursReturned)], ["Azure cost / gross margin", results.value.azurePercentOfMargin === null ? "Not available" : `${results.value.azurePercentOfMargin.toFixed(1)}%`],
        ].map(([label, value]) => <Card key={label}><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p></Card>)}</div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <Card><h3 className="font-bold">Traditional motion</h3><ul className="mt-4 grid gap-2 text-sm text-slate-600">{["Campaign-based targeting", "Manual account research", "Manual early qualification", "Limited long-tail coverage", "Seller time spent on unvalidated prospects", "Inconsistent qualification evidence"].map((item) => <li key={item}>• {item}</li>)}</ul></Card>
          <Card className="border-red-200 bg-red-50/40"><h3 className="font-bold text-red-900">Agent Riley motion</h3><ul className="mt-4 grid gap-2 text-sm text-red-900">{["Signal-driven targeting", "Personalized digital outreach", "Consistent qualification", "Explainable offer recommendation", "Seller-ready opportunity summary", "Broader SMB coverage", "Measured cost per outcome"].map((item) => <li key={item}>• {item}</li>)}</ul></Card>
        </div>
      </section>

      <section className="mt-10">
        <PageHeader eyebrow="Three-year TCO" title="Connect implementation, operations, and benefits" description={investmentEntered ? "The full scenario includes gross TCO, net Rogers investment, ROI, payback, benefit-cost ratio, and break-even outcomes." : "Enter the scoped implementation investment to complete the full TCO and ROI analysis."} />
        {!investmentEntered && <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-900">Azure operating costs, unit economics, bookings, and gross margin are calculated. Full ROI, payback, and benefit-cost ratio remain hidden until implementation investment is entered.</div>}
        <div className="grid gap-5 xl:grid-cols-[1fr_370px]">
          <Card><div className="h-80" aria-label="Three-year cost and benefit chart"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={annualChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis domain={[0, "auto"]} tickFormatter={(value) => money(value / multiplier, true)} /><Tooltip formatter={(value) => money(Number(value) / multiplier)} /><Legend /><Bar dataKey="cost" name={`TCO (${currency})`} fill="#2563EB" /><Bar dataKey="benefit" name={`Benefit (${currency})`} fill="#15803D" /><Line type="monotone" dataKey="cashFlow" name={`Cumulative cash flow (${currency})`} stroke="#DA291C" strokeWidth={3} /></ComposedChart></ResponsiveContainer></div></Card>
          <Card className="bg-charcoal text-white"><Calculator className="h-7 w-7 text-red-300" /><div className="mt-5 space-y-4">{[
            ["Gross three-year TCO", money(results.threeYear.grossTco)], ["Net Rogers investment", money(results.threeYear.netCustomerInvestment)],
            ["Gross economic benefit", money(results.threeYear.grossBenefit)], ["Net economic value", money(results.threeYear.netEconomicValue)],
            ["ROI", results.threeYear.roi === null ? "Not available" : `${results.threeYear.roi.toFixed(1)}%`],
            ["Payback period", results.threeYear.paybackMonths === null ? "Not available" : `${results.threeYear.paybackMonths.toFixed(1)} months`],
            ["Benefit-cost ratio", results.threeYear.benefitCostRatio === null ? "Not available" : `${results.threeYear.benefitCostRatio.toFixed(2)}x`],
            ["Break-even qualified opportunities", results.threeYear.breakEvenQualified === null ? "Not available" : results.threeYear.breakEvenQualified.toLocaleString()],
          ].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-sm text-slate-400">{label}</span><strong className="text-right text-sm">{value}</strong></div>)}</div></Card>
        </div>
      </section>

      <section className="mt-10">
        <PageHeader eyebrow="Sensitivity analysis" title="Test the assumptions that matter most" description="This is scenario sensitivity, not predictive analysis. No factor is described as statistically significant." />
        <div className="grid gap-4 lg:grid-cols-3">{demo.sensitivityScenarios.map((scenario, index) => <button key={scenario.name} onClick={() => setSelectedSensitivity(index)} className={`rounded-2xl border p-5 text-left shadow-card ${selectedSensitivity === index ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"}`}><h3 className="font-bold">{scenario.name}</h3><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><span>Response <strong>{scenario.responseRate}%</strong></span><span>Qualification <strong>{scenario.qualificationRate}%</strong></span><span>Close <strong>{scenario.closeRate}%</strong></span><span>Margin <strong>{scenario.grossMarginRate}%</strong></span></div><p className="mt-4 text-sm font-bold">{results.sensitivity[index].netValue === null ? `${money(results.sensitivity[index].costPerQualified)} / qualified` : `${money(results.sensitivity[index].netValue, true)} net value`}</p></button>)}</div>
        <Card className="mt-5"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[
          ["responseRate", "Response rate", "%"], ["qualificationRate", "Qualification rate", "%"], ["closeRate", "Seller close rate", "%"],
          ["marketplaceConversion", "Marketplace conversion", "%"], ["annualContractValue", "Annual contract value", currency],
          ["grossMarginRate", "Gross margin", "%"], ["tokenRateMultiplier", "Azure token-rate multiplier", "x"],
          ["conversationLengthMultiplier", "Conversation-length multiplier", "x"],
        ].map(([key, label, suffix]) => <NumberField key={key} label={label} value={demo.sensitivityScenarios[selectedSensitivity][key as keyof typeof demo.sensitivityScenarios[number]] as number} suffix={suffix} step={0.1} onChange={(value) => demo.updateSensitivityScenario(selectedSensitivity, key as keyof typeof demo.sensitivityScenarios[number], value ?? 0)} />)}</div>
          <div className="mt-6 h-72" aria-label="Sensitivity cost per qualified opportunity chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={results.sensitivity.map((item) => ({ name: item.name, value: (item.costPerQualified ?? 0) * multiplier }))} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" domain={[0, "auto"]} tickFormatter={(value) => money(value / multiplier)} /><YAxis type="category" dataKey="name" width={100} /><Tooltip formatter={(value) => money(Number(value) / multiplier)} /><Bar dataKey="value" name={`Cost per qualified (${currency})`} fill="#DA291C" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
        </Card>
      </section>

      <section className="mt-10">
        <PageHeader eyebrow="FinOps controls" title="How Riley's costs stay controlled" description="Budgets and unit-economics thresholds can pause campaigns, reduce volume, route simple work to lower-cost models, summarize context, improve caching, and disable underperforming segments." />
        <div className="grid gap-5 xl:grid-cols-[1fr_370px]">
          <Card>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[
              ["campaignBudget", "Monthly campaign budget", currency], ["azureBudget", "Monthly Azure budget", currency],
              ["tokenBudgetMillions", "Token budget", "M"], ["maxCostPerQualified", "Maximum cost / qualified", currency],
              ["maxCostPerClosed", "Maximum cost / closed sale", currency], ["maxTurns", "Maximum conversation turns", ""],
              ["maxRetries", "Maximum retries", ""], ["maxContextTokens", "Maximum retained context", "tokens"],
              ["logRetentionMonths", "Log retention period", "months"], ["promptCacheTarget", "Prompt-cache target", "%"],
            ].map(([key, label, suffix]) => <NumberField key={key} label={label} value={demo.finOpsPolicy[key as keyof FinOpsPolicy] as number} suffix={suffix} onChange={(value) => demo.updateFinOpsPolicy(key as keyof FinOpsPolicy, value ?? 0)} />)}</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-600">Model-routing policy<select value={demo.finOpsPolicy.modelRoutingPolicy} onChange={(event) => demo.updateFinOpsPolicy("modelRoutingPolicy", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal"><option>Use lower-cost models for classification and extraction</option><option>Single approved model</option><option>Require approval for high-cost conversations</option></select></label><label className="text-xs font-semibold text-slate-600">Campaign pause policy<select value={demo.finOpsPolicy.campaignPausePolicy} onChange={(event) => demo.updateFinOpsPolicy("campaignPausePolicy", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal"><option>Pause at 100% of monthly Azure budget</option><option>Pause when cost per qualified exceeds threshold</option><option>Manual pause only</option></select></label></div>
            <Button variant={demo.finOpsPolicy.campaignPaused ? "secondary" : "danger"} className="mt-5" onClick={() => demo.updateFinOpsPolicy("campaignPaused", !demo.finOpsPolicy.campaignPaused)}>{demo.finOpsPolicy.campaignPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{demo.finOpsPolicy.campaignPaused ? "Resume campaign" : "Pause campaign"}</Button>
          </Card>
          <Card>
            <div className="flex items-center gap-3"><Gauge className="text-rogers" /><h3 className="font-bold">Budget alerts</h3></div>
            <p className="mt-3 text-sm text-slate-600">{money(results.azure.monthly)} of {money(demo.finOpsPolicy.azureBudget)} monthly Azure budget</p>
            <div className="mt-3"><ProgressBar value={Math.min(100, results.alerts[0].currentPercent)} color={results.alerts[3].breached ? "bg-red-600" : results.alerts[2].breached ? "bg-amber-600" : "bg-blue-600"} /></div>
            <div className="mt-5 space-y-3">{results.alerts.map((alert) => <div key={alert.threshold} className={`flex items-center justify-between rounded-xl p-3 ${alert.breached ? alert.threshold >= 90 ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-800" : "bg-slate-50 text-slate-500"}`}><span className="text-sm font-semibold">{alert.label}</span><Badge tone={alert.breached ? alert.threshold >= 90 ? "danger" : "warning" : "neutral"}>{alert.breached ? "Triggered" : "Clear"}</Badge></div>)}</div>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600"><strong>Showback:</strong> Rogers Business · SMB Growth Campaign · Modern Workplace · Azure subscription RB-AI-Sales · Cost centre RB-SMB-01 · {results.funnel.qualified} qualified · {results.funnel.closed} sales.</div>
          </Card>
        </div>
      </section>

      <section className="mt-10 grid gap-5 xl:grid-cols-2">
        <Card><Sparkles className="h-7 w-7 text-rogers" /><h2 className="mt-4 text-xl font-bold">Cost optimization recommendations</h2><ul className="mt-5 space-y-3">{[
          "Use smaller models for classification, routing and structured extraction.", "Reserve higher-capability models for complex customer conversations and offer reasoning.",
          "Cache reusable system instructions and approved offer content.", "Summarize long conversations before sending context to subsequent turns.",
          "Limit retrieval to the customer segment and products being discussed.", "Run offline scoring and evaluations in batches where appropriate.",
          "Establish retention limits for detailed interaction logs.", "Track cost per campaign, qualified opportunity and completed sale.",
          "Start with consumption pricing while volumes are uncertain.", "Evaluate provisioned capacity only when demand is stable and predictable.",
          "Pause segments that exceed approved unit-economics thresholds.",
        ].map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-700" />{item}</li>)}</ul></Card>
        <Card className="bg-gradient-to-br from-charcoal to-[#4B1511] text-white"><BriefcaseBusiness className="h-8 w-8 text-red-300" /><p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-red-300">Executive conclusion</p><h2 className="mt-3 text-2xl font-bold leading-tight">The business case is not whether each AI interaction is inexpensive.</h2><p className="mt-5 text-base leading-7 text-slate-200">The business case is whether Rogers can create qualified Microsoft CSP pipeline and recurring gross margin at a lower marginal cost than expanding its existing sales and demand-generation model.</p><div className="mt-6 rounded-2xl bg-white/10 p-5 text-sm leading-6 text-slate-100">Agent Riley should be evaluated on cost per qualified opportunity, cost per completed sale, attributable gross margin and the amount of SMB coverage created without proportional growth in seller capacity.</div></Card>
      </section>
    </div>
  );
}
