import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useDemo } from "../context/DemoContext";
import { Button, ProgressBar } from "./ui";

const steps = [
  { title: "Find the right account", text: "Riley identifies Maple Ridge Dental Group as a high-propensity SMB based on growth, product gap, security intent, and contactability.", path: "/opportunities" },
  { title: "Understand the customer", text: "The account has Rogers Business Internet and wireless, while Microsoft 365 is supplied through another provider.", path: "/accounts/maple-ridge" },
  { title: "Prepare compliant outreach", text: "Riley drafts a relevant message focused on a growing team, simpler security, and one technology relationship.", path: "/outreach" },
  { title: "Start a conversation", text: "A synthetic response begins a two-way exchange. Riley stays grounded, asks relevant questions, and respects opt-out immediately.", path: "/conversations" },
  { title: "Qualify transparently", text: "Need, authority, timing, budget fit, consent, provider, product fit, and interest produce an explainable score.", path: "/qualification" },
  { title: "Recommend the next best bundle", text: "Riley compares three Rogers Business bundles and explains why each fits, including dependencies and illustrative value.", path: "/offers" },
  { title: "Pause for a person", text: "Material actions require human approval before seller assignment, marketplace routing, or CRM creation.", path: "/approvals" },
  { title: "Create the handoff", text: "After approval, Riley creates a simulated opportunity and an auditable seller-ready summary.", path: "/approvals" },
  { title: "Show the economics", text: "The dashboard updates the pipeline story, funnel, attach rates, seller hours returned, and illustrative operating costs.", path: "/performance" },
  { title: "Understand the business case", text: "Riley’s economics are measured as the cost of creating qualified pipeline and completed CSP sales, not simply the cost of running an AI model.", path: "/tco" },
  { title: "Scale with control", text: "The production concept keeps Rogers data and business rules governed while using Microsoft services for orchestration and monitoring.", path: "/architecture" },
];

export function Tour() {
  const { activeTour, setActiveTour } = useDemo();
  const navigate = useNavigate();
  if (activeTour === null) return null;
  const step = steps[activeTour];

  const move = (next: number) => {
    setActiveTour(next);
    navigate(steps[next].path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/50 p-4 backdrop-blur-sm md:items-center" role="dialog" aria-modal="true" aria-label="Executive tour">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-rogers">Executive tour · {activeTour + 1} of {steps.length}</p>
            <h2 className="mt-2 text-2xl font-bold text-charcoal">{step.title}</h2>
          </div>
          <button aria-label="Skip tour" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={() => setActiveTour(null)}><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-4 leading-7 text-slate-600">{step.text}</p>
        <div className="mt-6"><ProgressBar value={((activeTour + 1) / steps.length) * 100} /></div>
        <div className="mt-6 flex justify-between gap-3">
          <Button variant="secondary" disabled={activeTour === 0} onClick={() => move(activeTour - 1)}>Previous</Button>
          {activeTour < steps.length - 1
            ? <Button onClick={() => move(activeTour + 1)}>Next</Button>
            : <Button onClick={() => { setActiveTour(null); navigate("/performance"); }}>Finish tour</Button>}
        </div>
      </div>
    </div>
  );
}
