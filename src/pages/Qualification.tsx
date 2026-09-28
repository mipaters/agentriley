import { AlertCircle, CheckCircle2, CircleDashed, HelpCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, PageHeader, ProgressBar } from "../components/ui";
import { useDemo } from "../context/DemoContext";
import type { Status } from "../types";

const statusIcon: Record<Status, typeof CheckCircle2> = { Confirmed: CheckCircle2, Likely: CircleDashed, Unknown: HelpCircle, "Not qualified": XCircle };
const statusTone: Record<Status, "success" | "info" | "warning" | "danger"> = { Confirmed: "success", Likely: "info", Unknown: "warning", "Not qualified": "danger" };

export function Qualification() {
  const { qualification } = useDemo();
  const navigate = useNavigate();
  const unknown = Object.entries(qualification.criteria).filter(([, item]) => item.status === "Unknown").map(([label]) => label);
  return (
    <div>
      <PageHeader eyebrow="Qualification" title="Explain every point in the score" description="Riley uses a simple BANT-style model with consent, provider, product fit, and customer interest. Unknown budget does not automatically disqualify an account." actions={<Button onClick={() => navigate("/offers")}>Review recommended offers</Button>} />
      <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
        <div className="space-y-5">
          <Card className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Qualification score</p><p className="mt-4 text-7xl font-bold">{qualification.score}</p><p className="text-sm text-slate-400">out of 100</p><div className="mt-5"><ProgressBar value={qualification.score} /></div></Card>
          <Card><AlertCircle className="h-5 w-5 text-amber-700" /><h2 className="mt-3 font-bold">What Riley still needs to learn</h2>{unknown.length ? <ul className="mt-3 space-y-2 text-sm text-slate-600">{unknown.map((item) => <li key={item}>• {item}</li>)}</ul> : <p className="mt-3 text-sm text-slate-600">Core qualification criteria have sufficient evidence for seller review.</p>}</Card>
        </div>
        <div className="space-y-5">
          <Card><h2 className="text-lg font-bold">Qualification criteria</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{Object.entries(qualification.criteria).map(([label, item]) => { const Icon = statusIcon[item.status]; return <div key={label} className="rounded-xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><Icon className="h-5 w-5 text-slate-500" /><h3 className="font-semibold">{label}</h3></div><Badge tone={statusTone[item.status]}>{item.status}</Badge></div><p className="mt-3 text-sm leading-5 text-slate-600">{item.rationale}</p><p className="mt-3 text-xs font-bold text-slate-500">+{item.points} points</p></div>; })}</div></Card>
          <Card>
            <p className="text-xs font-bold uppercase tracking-widest text-rogers">Seller-ready summary</p><h2 className="mt-2 text-xl font-bold">Maple Ridge Dental Group</h2>
            <dl className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2">{[
              ["Business situation", "Growing dental group opening another office."],
              ["Customer need", "Simpler staff access, security administration, collaboration, and communications."],
              ["Recommended products", "Microsoft 365 Business Premium, Defender, Teams Phone, optional Copilot."],
              ["Key objections", "Existing Microsoft provider and sensitivity to current term timing."],
              ["Decision stakeholders", "Priya Shah; Daniel Cho as technical influencer."],
              ["Timing", qualification.criteria.Timing.status === "Confirmed" ? "Aligned to current term end." : "Needs seller confirmation."],
              ["Existing provider", "Microsoft 365 purchased through another provider."],
              ["Consent status", qualification.criteria.Consent.status],
              ["Recommended seller action", "Validate renewal date, technical readiness, commercial fit, and migration appetite."],
            ].map(([label, value]) => <div key={label}><dt className="text-xs font-bold uppercase text-slate-500">{label}</dt><dd className="mt-1 text-sm leading-6 text-slate-700">{value}</dd></div>)}</dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
