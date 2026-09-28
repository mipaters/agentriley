import { Ban, Bot, MessageCircle, ShieldAlert, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, PageHeader, ProgressBar } from "../components/ui";
import { useDemo } from "../context/DemoContext";
import type { ConversationResponseId } from "../types";

interface Choice {
  id: ConversationResponseId;
  text: string;
}

const initialChoices: Choice[] = [
  { id: "need", text: "We are opening another office and need a better way to manage staff access and security." },
  { id: "provider", text: "We already buy Microsoft 365 from another provider. Why would we move it?" },
  { id: "timing", text: "We may be interested, but we are not changing anything until our current term ends." },
  { id: "optout", text: "Please remove us from future outreach." },
];

const branchChoices: Record<"need" | "provider" | "timing", Choice[]> = {
  need: [
    { id: "accessOwner", text: "Daniel manages access today, but I approve major changes." },
    { id: "newOffice90", text: "The new office needs to be operational within about 90 days." },
    { id: "termEnds", text: "Our current Microsoft agreement ends in roughly four months." },
    { id: "optout", text: "Please remove us from future outreach." },
  ],
  provider: [
    { id: "singleSupport", text: "A single support relationship and simpler billing would be valuable." },
    { id: "termEnds", text: "Our current Microsoft term ends in roughly four months." },
    { id: "stayProvider", text: "We are happy with our provider unless there is a clear operational advantage." },
    { id: "optout", text: "Please remove us from future outreach." },
  ],
  timing: [
    { id: "termEnds", text: "The agreement ends in roughly four months." },
    { id: "earlyAssessment", text: "It ends later this year, but we could assess options before then." },
    { id: "notReady", text: "We are not ready now; follow up closer to renewal." },
    { id: "optout", text: "Please remove us from future outreach." },
  ],
};

const qualificationChoices: Choice[] = [
  { id: "budgetFlexible", text: "We can fund it if the business case shows lower administration effort and better security." },
  { id: "budgetUnknown", text: "We have not set a budget yet; we need to understand the options first." },
  { id: "stakeholders", text: "Daniel and I would make the decision together after reviewing the operational impact." },
  { id: "optout", text: "Please remove us from future outreach." },
];

const handoffChoices: Choice[] = [
  { id: "scheduleMeeting", text: "Please arrange a short meeting with a Rogers Business seller." },
  { id: "sendSummary", text: "Send a short summary first, then we can decide on a meeting." },
  { id: "notReady", text: "We are not ready for a meeting; follow up closer to renewal." },
  { id: "optout", text: "Please remove us from future outreach." },
];

export function Conversation() {
  const { conversation, qualification, addCustomerResponse } = useDemo();
  const navigate = useNavigate();
  const stopped = conversation.status === "Stopped";
  const qualified = conversation.status === "Qualified";
  const choices = conversation.step === 0
    ? initialChoices
    : conversation.step === 1
      ? branchChoices[conversation.branch ?? "need"]
      : conversation.step === 2
        ? qualificationChoices
        : handoffChoices;
  return (
    <div>
      <PageHeader eyebrow="Customer conversation" title="A grounded, two-way sales conversation" description="Choose a fictional customer response to demonstrate how Riley adapts, qualifies, escalates, and enforces opt-out." actions={<Badge tone={stopped ? "danger" : conversation.status === "Active" ? "success" : "info"}>{stopped ? "No further automated outreach" : conversation.status}</Badge>} />
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Card>
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100"><UserRound className="h-5 w-5" /></div><div><p className="font-bold">Priya Shah</p><p className="text-xs text-slate-500">Managing Partner · Maple Ridge Dental Group</p></div></div>
          <div className="max-h-[520px] space-y-4 overflow-y-auto py-6">
            {conversation.messages.map((message) => <div key={message.id} className={`flex gap-3 ${message.sender === "Customer" ? "justify-end" : ""}`}>{message.sender === "Riley" && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rogers text-white"><Bot className="h-4 w-4" /></div>}<div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.sender === "Riley" ? "rounded-tl-sm bg-slate-100 text-slate-700" : "rounded-tr-sm bg-charcoal text-white"}`}><p>{message.text}</p><p className={`mt-2 text-[10px] ${message.sender === "Riley" ? "text-slate-400" : "text-slate-300"}`}>{message.timestamp}</p></div></div>)}
          </div>
          <div className="border-t border-slate-100 pt-5">
            {qualified ? <div className="rounded-xl border border-green-200 bg-green-50 p-4"><p className="font-semibold text-green-900">Conversation qualified</p><p className="mt-1 text-sm leading-5 text-green-800">Riley has enough context for a human-reviewed recommendation and seller handoff.</p><Button className="mt-4" onClick={() => navigate("/qualification")}>Review seller summary</Button></div> : <><p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Select the next synthetic customer response</p><div className="grid gap-2">{choices.map((choice) => <button key={choice.id} disabled={stopped} onClick={() => addCustomerResponse(choice.id)} className="rounded-xl border border-slate-200 p-3 text-left text-sm leading-5 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">{choice.text}</button>)}</div></>}
          </div>
        </Card>
        <div className="space-y-5">
          <Card><div className="flex items-center justify-between"><h2 className="font-bold">Qualification progress</h2><span className="text-2xl font-bold">{qualification.score}</span></div><div className="mt-3"><ProgressBar value={qualification.score} /></div><p className="mt-3 text-xs text-slate-500">Updates when the customer shares relevant information.</p><Button className="mt-5 w-full" onClick={() => navigate("/qualification")}>Open qualification</Button></Card>
          {stopped ? <Card className="border-red-200 bg-red-50"><Ban className="h-6 w-6 text-red-700" /><h2 className="mt-3 font-bold text-red-900">Sequence stopped</h2><p className="mt-2 text-sm leading-6 text-red-800">The contact opted out. Riley recorded the preference, added an audit event, and disabled every selling action for this contact.</p></Card> : <Card><MessageCircle className="h-6 w-6 text-blue-700" /><h2 className="mt-3 font-bold">Conversation guardrails</h2><ul className="mt-3 space-y-2 text-sm leading-5 text-slate-600"><li>Ask only relevant questions</li><li>Do not invent pricing or terms</li><li>Escalate uncertainty to a seller</li><li>Respect opt-out immediately</li></ul></Card>}
          <Card><ShieldAlert className="h-6 w-6 text-amber-700" /><h2 className="mt-3 font-bold">Commercial boundary</h2><p className="mt-2 text-sm leading-6 text-slate-600">Final solution design, pricing, discounts, migration commitments, and contractual terms require a Rogers Business seller.</p></Card>
        </div>
      </div>
    </div>
  );
}
