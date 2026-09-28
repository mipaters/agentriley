import { CheckCircle2, Database, Route, UserCheck, XCircle } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "../components/ui";
import { useDemo } from "../context/DemoContext";
import { offers } from "../data/offers";

export function Approvals() {
  const { approvals, opportunities, qualification, selectedOffer, submitApproval, resolveApproval, accounts, notify } = useDemo();
  const approval = approvals.find((item) => item.accountId === "maple-ridge");
  const opportunity = opportunities.find((item) => item.accountId === "maple-ridge");
  const account = accounts.find((item) => item.id === "maple-ridge")!;
  const offer = offers.find((item) => item.id === selectedOffer) ?? offers[0];
  return (
    <div>
      <PageHeader eyebrow="Human approval and handoff" title="Keep people accountable for material actions" description="Initial outreach, recommendations, pricing, CRM creation, seller assignment, and marketplace routing require review in this concept." />
      {!approval ? <Card className="mx-auto max-w-2xl text-center"><UserCheck className="mx-auto h-10 w-10 text-rogers" /><h2 className="mt-4 text-2xl font-bold">No pending approval yet</h2><p className="mt-2 text-sm text-slate-600">Create the Maple Ridge approval package to demonstrate the controlled handoff.</p><Button className="mt-5" onClick={submitApproval}>Create approval request</Button></Card> : (
        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <Card>
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start"><div><p className="text-xs font-bold uppercase tracking-widest text-rogers">Approval request</p><h2 className="mt-2 text-2xl font-bold">{account.company}</h2><p className="mt-1 text-sm text-slate-500">Priya Shah · Managing Partner</p></div><Badge tone={approval.status === "Approved" ? "success" : approval.status === "Rejected" ? "danger" : "warning"}>{approval.status}</Badge></div>
            <dl className="mt-5 grid gap-5 md:grid-cols-2">{[["Opportunity summary", account.challenge], ["Qualification score", `${qualification.score}/100`], ["Recommended bundle", offer.name], ["Estimated value", `$${offer.annualValue.toLocaleString()} CAD ARR · illustrative`], ["Consent status", account.consentStatus], ["Risk flags", "Existing provider; renewal date to validate"], ["Supporting signals", "Growth, new location, security intent, Rogers relationship"], ["Proposed route", "Jordan Lee · Rogers Business seller"]].map(([label, value]) => <div key={label}><dt className="text-xs font-bold uppercase text-slate-500">{label}</dt><dd className="mt-2 text-sm leading-6 text-slate-700">{value}</dd></div>)}</dl>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
              <Button onClick={() => resolveApproval("Approved")}><CheckCircle2 className="h-4 w-4" />Approve</Button>
              <Button variant="secondary" onClick={() => resolveApproval("Changes requested")}>Request changes</Button>
              <Button variant="danger" onClick={() => resolveApproval("Rejected")}><XCircle className="h-4 w-4" />Reject</Button>
              <Button variant="secondary" onClick={() => notify("Jordan Lee assigned as the proposed seller.", "success")}><UserCheck className="h-4 w-4" />Assign seller</Button>
              <Button variant="secondary" onClick={() => notify("Marketplace routing requires approved handoff.", "info")}><Route className="h-4 w-4" />Route to marketplace</Button>
              <Button variant="secondary" onClick={() => notify("Partner route recorded for seller review.", "info")}>Route to partner</Button>
            </div>
          </Card>
          <Card className="bg-charcoal text-white">
            <Database className="h-7 w-7 text-red-300" /><p className="mt-4 text-xs font-bold uppercase tracking-widest text-red-300">Simulated CRM record</p>
            {opportunity ? <div><h2 className="mt-2 text-xl font-bold">{opportunity.name}</h2><dl className="mt-5 space-y-4 text-sm">{[["Record ID", opportunity.id], ["Account", account.company], ["Contact", "Priya Shah"], ["Annual value", `$${opportunity.value.toLocaleString()} CAD`], ["Sales stage", opportunity.stage], ["Close timing", opportunity.closeTiming], ["Assigned seller", opportunity.seller], ["Products", opportunity.products.join(", ")]].map(([label, value]) => <div key={label}><dt className="text-xs font-semibold uppercase text-slate-400">{label}</dt><dd className="mt-1 leading-5 text-slate-100">{value}</dd></div>)}</dl><div className="mt-5 rounded-xl bg-white/10 p-4 text-sm leading-6 text-slate-200">Agent-generated summary: Growing dental group needs consistent access, security, and collaboration across two locations. Validate current provider term and technical readiness.</div></div> : <div className="mt-5 rounded-xl border border-dashed border-slate-600 p-5 text-sm leading-6 text-slate-300">Approve the request to create a synthetic Dynamics 365-style opportunity record. No production CRM is connected.</div>}
          </Card>
        </div>
      )}
    </div>
  );
}
