import { AlertTriangle, FileClock, ShieldCheck, ToggleLeft, ToggleRight } from "lucide-react";
import { Badge, Card, PageHeader } from "../components/ui";
import { useDemo } from "../context/DemoContext";
import type { Controls } from "../types";

const groups: Array<{ title: string; description: string; controls: Array<{ key: keyof Controls; label: string }> }> = [
  { title: "Consent and contactability", description: "Determine whether, how, and how often Riley can contact a customer.", controls: [{ key: "consentValidation", label: "Consent validation" }, { key: "optOutEnforcement", label: "Opt-out enforcement" }, { key: "suppressionLists", label: "Suppression lists" }, { key: "frequencyCaps", label: "Frequency caps" }] },
  { title: "Human approval", description: "Require accountable review before external and system-of-record actions.", controls: [{ key: "humanApproval", label: "External outreach and routing approval" }] },
  { title: "Data protection", description: "Apply least privilege, minimization, masking, retention, and environment separation.", controls: [{ key: "piiMasking", label: "PII masking" }] },
  { title: "Responsible AI", description: "Ground recommendations, expose sources, filter content, and escalate uncertainty.", controls: [{ key: "sourceTransparency", label: "Source transparency" }, { key: "contentFiltering", label: "Content filtering" }] },
  { title: "Operational controls", description: "Control cost, campaign availability, incident response, and auditability.", controls: [{ key: "costThreshold", label: "Cost threshold" }, { key: "killSwitch", label: "Campaign kill switch" }] },
];

export function Governance() {
  const { controls, toggleControl, audit } = useDemo();
  const disabledRequired = !controls.consentValidation || !controls.humanApproval || !controls.contentFiltering || controls.killSwitch;
  return (
    <div>
      <PageHeader eyebrow="Governance and controls" title="Make safe behaviour visible and enforceable" description="These demonstration toggles actively change application behaviour. Required controls can block outreach, CRM creation, or campaign activity." actions={<Badge tone={disabledRequired ? "danger" : "success"}>{disabledRequired ? "Action required" : "Core controls healthy"}</Badge>} />
      {disabledRequired && <div className="mb-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /><p>A required control is disabled or the kill switch is active. Relevant material actions are blocked until governance is restored.</p></div>}
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-5 md:grid-cols-2">
          {groups.map((group) => <Card key={group.title}><ShieldCheck className="h-6 w-6 text-rogers" /><h2 className="mt-3 text-lg font-bold">{group.title}</h2><p className="mt-1 min-h-12 text-sm leading-5 text-slate-500">{group.description}</p><div className="mt-4 space-y-2">{group.controls.map((control) => { const on = controls[control.key]; return <button key={control.key} onClick={() => toggleControl(control.key)} className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left text-sm font-medium hover:bg-slate-50"><span>{control.label}</span><span className={on ? "text-green-700" : "text-slate-400"}>{on ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}</span></button>; })}</div></Card>)}
        </div>
        <div className="space-y-5">
          <Card className="bg-charcoal text-white"><h2 className="font-bold">Operational identity</h2><dl className="mt-4 space-y-4 text-sm">{[["Agent status", controls.killSwitch ? "Paused" : "Active"], ["Model version", "Demo simulator 1.0"], ["Prompt version", "RB-SMB-2026.09"], ["Approval policy", controls.humanApproval ? "Required" : "Blocked"], ["Environment", "Local browser demo"], ["Data classification", "Synthetic only"]].map(([label, value]) => <div key={label} className="flex justify-between gap-4"><dt className="text-slate-400">{label}</dt><dd className="font-semibold">{value}</dd></div>)}</dl></Card>
          <Card><div className="flex items-center gap-2"><FileClock className="h-5 w-5 text-blue-700" /><h2 className="font-bold">Audit log</h2></div><div className="mt-4 max-h-[480px] space-y-3 overflow-y-auto">{[...audit].reverse().map((event) => <div key={event.id} className="rounded-xl bg-slate-50 p-3"><div className="flex justify-between gap-3"><p className="text-sm font-semibold">{event.type}</p><span className="text-[10px] text-slate-400">{event.timestamp}</span></div><p className="mt-1 text-xs leading-5 text-slate-500">{event.detail}</p></div>)}</div></Card>
        </div>
      </div>
    </div>
  );
}
