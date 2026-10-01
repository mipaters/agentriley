import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Activity, BarChart3, Bot, Building2, CircleHelp, ClipboardCheck, GitBranch, Landmark, LayoutDashboard, Menu, MessageSquareText, RotateCcw, Send, ShieldCheck, Sparkles, X } from "lucide-react";
import { useDemo } from "../context/DemoContext";
import { Button } from "./ui";
import { Tour } from "./Tour";
import { DemoModeSwitch } from "./DemoModeSwitch";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/customer-zero", label: "Customer Zero", icon: Landmark },
  { to: "/opportunities", label: "Opportunities", icon: Building2 },
  { to: "/outreach", label: "Outreach", icon: Send },
  { to: "/conversations", label: "Conversations", icon: MessageSquareText },
  { to: "/approvals", label: "Approvals", icon: ClipboardCheck },
  { to: "/performance", label: "Performance", icon: BarChart3 },
  { to: "/architecture", label: "Architecture", icon: GitBranch },
  { to: "/governance", label: "Governance", icon: ShieldCheck },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const { setActiveTour, resetDemo, toasts } = useDemo();
  const navigate = useNavigate();

  const sidebar = (
    <aside className="flex h-full w-72 flex-col bg-charcoal px-4 py-5 text-white">
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-rogers"><Bot className="h-6 w-6" /></div>
        <div><p className="font-bold tracking-wide">AGENT RILEY</p><p className="text-xs text-slate-400">Rogers Business</p></div>
      </div>
      <nav className="mt-8 flex-1 space-y-1" aria-label="Main navigation">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-white text-charcoal" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
            <Icon className="h-4 w-4" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-2 border-t border-white/10 pt-4">
        <Button className="w-full" onClick={() => { setActiveTour(0); navigate("/opportunities"); setMobileOpen(false); }}><Sparkles className="h-4 w-4" />Take the Tour</Button>
        <button onClick={() => setInfoOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/10"><CircleHelp className="h-4 w-4" />Demo information</button>
        <button onClick={resetDemo} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/10"><RotateCcw className="h-4 w-4" />Reset demo</button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden" onClick={() => setMobileOpen(false)}><div className="h-full" onClick={(event) => event.stopPropagation()}>{sidebar}</div></div>}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-7">
          <button className="rounded-lg p-2 lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>{mobileOpen ? <X /> : <Menu />}</button>
          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-500 sm:flex"><Activity className="h-4 w-4 text-green-700" />Agent status: Active</div>
          <div className="flex items-center gap-2">
            <DemoModeSwitch mode="rogers" />
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Demo mode</span>
            <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 md:inline">Synthetic data</span>
            <span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 xl:inline">Human approval required</span>
          </div>
        </header>
        <main className="page-enter min-h-[calc(100vh-64px)] p-4 md:p-7"><Outlet /></main>
        <footer className="border-t border-slate-200 bg-white px-7 py-4 text-center text-xs text-slate-500">
          Concept demonstration only. Uses synthetic data and simulated agent actions. Not connected to live Rogers or Microsoft production systems.
        </footer>
      </div>
      <Tour />
      <div className="fixed bottom-5 right-5 z-[60] space-y-2" aria-live="polite">
        {toasts.map((toast) => <div key={toast.id} className={`max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${toast.tone === "success" ? "border-green-200 bg-green-50 text-green-800" : toast.tone === "warning" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-blue-200 bg-blue-50 text-blue-800"}`}>{toast.message}</div>)}
      </div>
      {infoOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/50 p-4" role="dialog" aria-modal="true" aria-label="Demo information">
          <div className="max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-rogers">Demo information</p><h2 className="mt-2 text-2xl font-bold">Safe for solution exploration</h2></div><button aria-label="Close" onClick={() => setInfoOpen(false)}><X /></button></div>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
              {["All companies and people are fictional.", "All records, signals, conversations, and economics are synthetic.", "No real email is sent and no live Rogers systems are connected.", "No live Microsoft customer data is accessed.", "Pricing is illustrative and requires seller validation.", "Architecture represents a proposed production pattern, not existing connectors."].map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rogers" />{item}</li>)}
            </ul>
            <Button className="mt-6 w-full" onClick={() => setInfoOpen(false)}>Understood</Button>
          </div>
        </div>
      )}
    </div>
  );
}
