import {
  ArrowDown,
  ArrowRight,
  BadgeDollarSign,
  Bot,
  CheckCircle2,
  CloudCog,
  Handshake,
  Mail,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  UsersRound,
  Zap,
} from "lucide-react";
import { Card, PageHeader } from "../components/ui";

const outcomes = [
  { value: "18%", label: "Lead-to-Opportunity Conversion", detail: "vs 9% traditional approach", icon: Target },
  { value: "$50M", label: "New Revenue Generated", detail: "through AI-infused sales processes", icon: BadgeDollarSign },
  { value: "9.4%", label: "Higher Revenue Per Seller", detail: "greater seller leverage", icon: TrendingUp },
  { value: "20%", label: "Increase in Deals Won", detail: "more opportunities converted", icon: Handshake },
  { value: "10%", label: "Faster Deal Cycles", detail: "less time from engagement to outcome", icon: Zap },
  { value: "20%", label: "Increase in Seller Productivity", detail: "more time focused on qualified demand", icon: UsersRound },
];

const challenge = [
  "Millions of SMB records",
  "Limited seller capacity",
  "Low coverage of long-tail customers",
  "Manual qualification consuming seller time",
];

const solution = [
  "AI-powered prospect identification",
  "Automated personalized email engagement",
  "Conversational qualification",
  "Human-in-the-loop governance",
  "Automated routing to sellers and CSP partners",
];

const rogersTargets = [
  "2X improvement in SMB opportunity conversion",
  "Lower customer acquisition costs",
  "Increased CSP attach and renewal rates",
  "More Microsoft 365 and Copilot opportunities",
  "Increased Marketplace traffic and transactions",
  "Growth in qualified pipeline without increasing seller headcount",
];

const timeline = [
  { label: "Cloud Ascent Signals", detail: "Propensity and intent", icon: CloudCog },
  { label: "Agent Riley Outreach", detail: "Relevant engagement", icon: Mail },
  { label: "Customer Qualification", detail: "Need, timing, fit", icon: Bot },
  { label: "Human Review", detail: "Governed approval", icon: UserCheck },
  { label: "Rogers Seller", detail: "Expert discovery", icon: UsersRound },
  { label: "Marketplace Purchase", detail: "Digital transaction", icon: ShoppingBag },
  { label: "Revenue Growth", detail: "Recurring value", icon: TrendingUp },
];

export function CustomerZero() {
  return (
    <div>
      <PageHeader
        eyebrow="Microsoft Customer Zero Results"
        title="Microsoft Customer Zero: Proven at Microsoft Before Rogers"
        description="Agent Riley originated within Microsoft's SMB/SME&C organization in Asia as a Customer Zero initiative designed to scale SMB demand generation and qualification using AI agents."
      />

      <section className="relative overflow-hidden rounded-3xl bg-charcoal p-6 text-white shadow-card md:p-10">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-rogers/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-700/20 blur-3xl" />
        <div className="relative grid gap-7 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-500/20 text-red-300"><Target /></div>
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">Challenge</p><h2 className="mt-1 text-xl font-bold">Reach could not scale with sellers alone</h2></div>
            </div>
            <ul className="mt-6 space-y-3">
              {challenge.map((item) => <li key={item} className="flex items-center gap-3 text-sm text-slate-200"><span className="h-2 w-2 rounded-full bg-rogers" />{item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/20 text-blue-300"><Sparkles /></div>
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Solution</p><h2 className="mt-1 text-xl font-bold">An agent-operated demand engine</h2></div>
            </div>
            <ul className="mt-6 space-y-3">
              {solution.map((item) => <li key={item} className="flex items-center gap-3 text-sm text-slate-200"><CheckCircle2 className="h-4 w-4 shrink-0 text-blue-300" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-rogers">Customer Zero outcomes</p><h2 className="mt-2 text-2xl font-bold text-charcoal">Evidence of commercial impact</h2></div>
          <p className="text-xs text-slate-500">Customer Zero narrative metrics · validate before external publication</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {outcomes.map(({ value, label, detail, icon: Icon }, index) => (
            <Card key={label} className={`relative overflow-hidden ${index === 0 ? "border-red-200 bg-gradient-to-br from-red-50 to-white" : ""}`}>
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-rogers/[0.04]" />
              <div className="relative flex items-start justify-between gap-4">
                <div><p className="text-4xl font-bold tracking-tight text-charcoal md:text-5xl">{value}</p><h3 className="mt-3 font-bold">{label}</h3><p className="mt-1 text-sm text-slate-500">{detail}</p></div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-rogers"><Icon className="h-5 w-5" /></div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#8B1710] via-rogers to-[#B51F15] p-7 text-white shadow-card md:p-10">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/15 backdrop-blur"><UserCheck className="h-10 w-10" /></div>
          <div><p className="text-sm font-bold uppercase tracking-[0.22em] text-red-100">Operating principle</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">Human-Led. Agent-Operated.</h2><p className="mt-4 max-w-4xl text-base leading-7 text-red-50">Agent Riley does not replace sellers. It identifies, engages, qualifies, and routes opportunities so human sellers spend time only on qualified prospects.</p></div>
        </div>
      </section>

      <div className="mt-10">
        <PageHeader
          eyebrow="What This Means For Rogers Business"
          title="Target Outcomes for Rogers"
          description="Apply the Customer Zero pattern to Rogers Business connectivity, Microsoft CSP growth, marketplace engagement, and seller capacity."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rogersTargets.map((target, index) => (
            <Card key={target} className="group transition hover:-translate-y-1 hover:border-red-200">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-charcoal text-sm font-bold text-white group-hover:bg-rogers">0{index + 1}</span>
                <div><p className="font-bold leading-6">{target}</p><p className="mt-2 text-xs leading-5 text-slate-500">Target outcome for executive planning and validation.</p></div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-8 overflow-hidden p-6 md:p-8">
        <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-rogers"><Sparkles /></div><div><p className="text-xs font-bold uppercase tracking-widest text-rogers">Growth motion</p><h2 className="mt-1 text-xl font-bold">From signal to revenue</h2></div></div>
        <div className="mt-8 grid gap-3 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] xl:items-center">
          {timeline.map(({ label, detail, icon: Icon }, index) => (
            <div className="contents" key={label}>
              <div className="group relative rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center transition duration-300 hover:border-red-200 hover:bg-red-50">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white text-rogers shadow-sm transition group-hover:scale-110"><Icon className="h-5 w-5" /></div>
                <p className="mt-3 text-sm font-bold">{label}</p><p className="mt-1 text-[11px] text-slate-500">{detail}</p>
                <span className="absolute inset-x-4 bottom-0 h-0.5 origin-left scale-x-0 bg-rogers transition-transform duration-500 group-hover:scale-x-100" />
              </div>
              {index < timeline.length - 1 && <div className="flex justify-center text-slate-300"><ArrowDown className="h-5 w-5 animate-pulse xl:hidden" /><ArrowRight className="hidden h-5 w-5 animate-pulse xl:block" /></div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
