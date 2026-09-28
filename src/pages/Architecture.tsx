import { useState } from "react";
import { ArrowDown, CloudCog, Database, LockKeyhole, Network, RadioTower, UsersRound } from "lucide-react";
import { Badge, Card, PageHeader } from "../components/ui";

const layers = [
  { icon: UsersRound, name: "Experience layer", items: ["Rogers Business seller workspace", "Rogers Business marketplace", "Email", "Teams", "Executive dashboard"] },
  { icon: RadioTower, name: "Agent and orchestration layer", items: ["Agent Riley", "Qualification workflow", "Recommendation service", "Human approval workflow", "Azure AI Foundry", "Copilot Studio patterns"] },
  { icon: Network, name: "Signal and intelligence layer", items: ["Rogers CRM", "Product holdings", "Engagement history", "Contactability and consent", "Approved Microsoft propensity signals", "Customer graph", "Product catalogue"] },
  { icon: CloudCog, name: "Integration layer", items: ["API Management", "Event processing", "CRM connectors", "Marketplace APIs", "Microsoft Graph where applicable", "Offer and catalogue APIs"] },
  { icon: Database, name: "Data layer", items: ["Rogers-governed customer data", "Microsoft Fabric", "Azure AI Search", "Account and product data", "Interaction history", "Audit records"] },
  { icon: LockKeyhole, name: "Trust and governance layer", items: ["Microsoft Entra ID", "Microsoft Purview", "Defender", "Azure Monitor", "Application Insights", "Responsible AI controls", "Human-in-the-loop", "Model and prompt versioning"] },
];

export function Architecture() {
  const [mode, setMode] = useState<"demo" | "production">("demo");
  const modeItems = mode === "demo"
    ? ["Local synthetic records", "Simulated AI responses", "Simulated CRM handoff", "No external email", "No production integration"]
    : ["Rogers identity and access", "Rogers CRM and customer data", "Approved Microsoft signal sources", "Approved email service", "Azure AI Foundry and Copilot Studio", "Microsoft Fabric and Azure AI Search", "API Management", "CRM, monitoring, and audit services"];
  return (
    <div>
      <PageHeader eyebrow="Solution architecture" title="A proposed, governed production pattern" description="Rogers customer data and Rogers business rules remain in Rogers-governed environments. Microsoft services provide agent orchestration, integration, monitoring, security, and human handoff patterns." actions={<div className="flex rounded-xl bg-slate-200 p-1"><button onClick={() => setMode("demo")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${mode === "demo" ? "bg-white shadow" : "text-slate-500"}`}>Demo</button><button onClick={() => setMode("production")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${mode === "production" ? "bg-white shadow" : "text-slate-500"}`}>Production concept</button></div>} />
      <Card className={mode === "demo" ? "border-blue-200 bg-blue-50/50" : "border-amber-200 bg-amber-50/50"}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><Badge tone={mode === "demo" ? "info" : "warning"}>{mode === "demo" ? "Current application" : "Proposed pattern"}</Badge><h2 className="mt-3 text-xl font-bold">{mode === "demo" ? "Safe, local executive demonstration" : "Production capabilities to design and approve"}</h2></div><p className="max-w-xl text-sm leading-6 text-slate-600">{mode === "demo" ? "Everything runs in the browser with synthetic data and simulated actions." : "Connectors are conceptual and would require Rogers architecture, security, privacy, legal, and operational approval."}</p></div>
        <div className="mt-5 flex flex-wrap gap-2">{modeItems.map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">{item}</span>)}</div>
      </Card>
      <div className="mx-auto mt-7 max-w-5xl">
        {layers.map(({ icon: Icon, name, items }, index) => <div key={name}><Card className="relative overflow-hidden"><div className="absolute inset-y-0 left-0 w-1.5 bg-rogers" /><div className="grid gap-4 md:grid-cols-[240px_1fr] md:items-center"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-rogers"><Icon /></div><div><p className="text-xs font-bold uppercase text-slate-400">Layer {index + 1}</p><h2 className="font-bold">{name}</h2></div></div><div className="flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">{item}</span>)}</div></div></Card>{index < layers.length - 1 && <ArrowDown className="mx-auto my-2 text-slate-300" />}</div>)}
      </div>
    </div>
  );
}
