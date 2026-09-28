import { ArrowRight, Building2, CheckCircle2, Layers3, Search, Send, ShieldCheck, Sparkles, Target, TrendingUp, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../context/DemoContext";
import { Button, Card, MetricCard, PageHeader } from "../components/ui";

const flow = [
  { label: "Find", icon: Search, detail: "Prioritize explainable signals" },
  { label: "Engage", icon: Send, detail: "Start compliant outreach" },
  { label: "Qualify", icon: CheckCircle2, detail: "Capture seller-ready context" },
  { label: "Recommend", icon: Sparkles, detail: "Match the right bundle" },
  { label: "Route", icon: UserCheck, detail: "Pause for human approval" },
];

export function Overview() {
  const navigate = useNavigate();
  const { setActiveTour, opportunities } = useDemo();
  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-charcoal px-6 py-12 text-white shadow-card md:px-10 md:py-16">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-rogers/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-300">Rogers Business · Concept demonstration</p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">Agent Riley</h1>
          <p className="mt-3 text-xl font-semibold text-white md:text-2xl">AI-powered inside sales for Rogers Business</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">Find the right SMB customer, start a relevant conversation, qualify the opportunity, recommend the best bundle, and route it to the right seller.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => { setActiveTour(0); navigate("/opportunities"); }}><Sparkles className="h-4 w-4" />Take the Tour</Button>
            <Button variant="secondary" onClick={() => navigate("/opportunities")}>Explore Opportunities <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-3 md:grid-cols-5">
        {flow.map(({ label, icon: Icon, detail }, index) => (
          <Card key={label} className="relative">
            <div className="flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-rogers"><Icon className="h-5 w-5" /></div><span className="text-xs font-bold text-slate-300">0{index + 1}</span></div>
            <h2 className="mt-4 font-bold">{label}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
          </Card>
        ))}
      </div>

      <PageHeader eyebrow="Executive snapshot" title="A scalable SMB growth motion" description="Illustrative demo values show how Riley can expand coverage without requiring a proportional increase in seller headcount." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="SMB accounts analyzed" value="12,480" detail="Demo data · current quarter" accent />
        <MetricCard label="High-propensity accounts" value="2,140" detail="17.1% of accounts analyzed" />
        <MetricCard label="Active conversations" value="624" detail="Across approved campaigns" />
        <MetricCard label="Qualified opportunities" value={`${238 + opportunities.length}`} detail="Explainable qualification model" />
        <MetricCard label="Estimated pipeline" value={`$${(6.8 + opportunities.length * 0.0288).toFixed(2)}M`} detail="CAD · illustrative annual value" />
        <MetricCard label="Seller hours returned" value="3,460" detail="Estimated administrative time" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          { icon: Building2, title: "Expand SMB coverage", text: "Consistently monitor synthetic account signals and prioritize the customers most likely to benefit." },
          { icon: Target, title: "Improve lead quality", text: "Give sellers transparent evidence, conversation context, qualification status, and clear next actions." },
          { icon: TrendingUp, title: "Grow recurring revenue", text: "Connect Rogers connectivity with Microsoft cloud, security, collaboration, devices, and marketplace solutions." },
        ].map(({ icon: Icon, title, text }) => <Card key={title}><Icon className="h-6 w-6 text-rogers" /><h2 className="mt-4 text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></Card>)}
      </div>

      <Card className="mt-8 bg-gradient-to-r from-red-50 to-white">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="text-xs font-bold uppercase tracking-widest text-rogers">Why Rogers Business</p><h2 className="mt-2 text-2xl font-bold">A differentiated relationship for Canadian SMBs</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Rogers can bring together trusted connectivity, established customer relationships, digital channels, and Microsoft cloud solutions into one coordinated growth motion—supported by human sellers and governed business rules.</p></div>
          <div className="flex gap-3 text-sm font-semibold text-slate-600"><Layers3 className="text-rogers" />Connectivity + cloud + people <ShieldCheck className="text-green-700" /></div>
        </div>
      </Card>
    </div>
  );
}
