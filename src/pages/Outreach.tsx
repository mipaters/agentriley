import { useState } from "react";
import { CheckCircle2, FileSearch, RefreshCw, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Checklist, PageHeader } from "../components/ui";
import { useDemo } from "../context/DemoContext";

const drafts = {
  Consultative: {
    subject: "Supporting Maple Ridge Dental Group's next stage of growth",
    body: "Hi Priya,\n\nAs Maple Ridge Dental Group adds a new location, keeping staff access, collaboration, and security consistent can become harder to manage. Rogers Business may be able to help bring connectivity, Microsoft 365 Business Premium, security, and Teams Phone into a more coordinated operating model.\n\nWould a short conversation about your current setup and renewal timing be useful? Any options and commercial terms would be reviewed with a Rogers Business seller.\n\nRegards,\nAgent Riley for Rogers Business",
  },
  Concise: {
    subject: "A simpler technology model for your growing team",
    body: "Hi Priya,\n\nWith a new location and a growing team, Rogers Business may be able to help simplify collaboration, security, and communications across your offices.\n\nWould you be open to a short assessment of your current Microsoft 365 and phone setup? A Rogers Business seller would validate all options and terms.\n\nRegards,\nAgent Riley for Rogers Business",
  },
  Executive: {
    subject: "One technology relationship for Maple Ridge Dental Group",
    body: "Hi Priya,\n\nGrowth often creates complexity across connectivity, communications, and security. Rogers Business can explore whether a consolidated workplace approach could reduce administration and support consistent operations across your locations.\n\nIf this aligns with your priorities, I can arrange a seller-led review. No changes or commercial commitments are made through this demonstration.\n\nRegards,\nAgent Riley for Rogers Business",
  },
};

export function Outreach() {
  const [tone, setTone] = useState<keyof typeof drafts>("Consultative");
  const [version, setVersion] = useState(1);
  const { accounts, controls, submitApproval, notify } = useDemo();
  const navigate = useNavigate();
  const account = accounts.find((item) => item.id === "maple-ridge")!;
  const blocked = !controls.consentValidation || account.consentStatus !== "Permitted" || controls.killSwitch;

  return (
    <div>
      <PageHeader eyebrow="Outreach studio" title="Create relevant, compliant outreach" description="Draft a synthetic message grounded in approved account signals. No email is sent from this application." actions={<Badge tone={blocked ? "danger" : "success"}>{blocked ? "Outreach blocked" : "Checks ready"}</Badge>} />
      {blocked && <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">Outreach is blocked by a required governance control or contact preference. Review Governance before continuing.</div>}
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <Card><h2 className="font-bold">Campaign context</h2><dl className="mt-4 space-y-3 text-sm">{[["Target account", account.company], ["Target contact", "Priya Shah · Managing Partner"], ["Goal", "Secure a seller-led discovery call"], ["Selected offer", "Rogers Business Modern Workplace"], ["Channel", "Business email"], ["Consent", account.consentStatus]].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><dt className="text-slate-500">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>)}</dl></Card>
          <Card><h2 className="font-bold">Personalization sources</h2><Checklist items={["New Mississauga location", "Employee growth signal", "Security research interest", "Existing Rogers connectivity relationship", "Microsoft 365 supplied by another provider"]} /><Button variant="secondary" className="mt-5 w-full" onClick={() => notify("Source details are visible in Customer 360.", "info")}><FileSearch className="h-4 w-4" />Review sources</Button></Card>
          <Card><h2 className="font-bold">Pre-send controls</h2><Checklist items={["Consent check passed", "Suppression list check passed", "Frequency cap passed", "Content policy check passed", "Human approval required"]} /></Card>
        </div>
        <Card>
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center">
            <div><p className="text-xs font-bold uppercase tracking-widest text-rogers">Draft message · version {version}</p><h2 className="mt-1 text-xl font-bold">Email preview</h2></div>
            <div className="flex rounded-xl bg-slate-100 p-1">{(Object.keys(drafts) as Array<keyof typeof drafts>).map((item) => <button key={item} onClick={() => setTone(item)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${tone === item ? "bg-white text-charcoal shadow-sm" : "text-slate-500"}`}>{item}</button>)}</div>
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold text-slate-500">To: Priya Shah &lt;priya.shah@example.ca&gt;</p>
            <p className="mt-2 border-b border-slate-200 pb-4 font-bold">{drafts[tone].subject}</p>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-700">{drafts[tone].body}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => { setVersion((current) => current + 1); notify("A new synthetic draft was generated.", "success"); }}><RefreshCw className="h-4 w-4" />Regenerate</Button>
            <Button variant="secondary" onClick={() => { setTone("Concise"); notify("Draft shortened.", "info"); }}>Shorten</Button>
            <Button variant="secondary" onClick={() => { setTone("Consultative"); notify("Consultative tone applied.", "info"); }}><Sparkles className="h-4 w-4" />Make more consultative</Button>
          </div>
          <div className="mt-6 flex flex-col justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <Button variant="secondary" disabled={blocked} onClick={submitApproval}>Submit for approval</Button>
            <Button disabled={blocked} onClick={() => { submitApproval(); navigate("/approvals"); }}><Send className="h-4 w-4" />Approve and send simulation</Button>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 className="h-4 w-4 text-green-700" />No external email service is configured.</div>
        </Card>
      </div>
    </div>
  );
}
