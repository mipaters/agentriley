import { ArrowLeft, BriefcaseBusiness, CalendarClock, MailCheck, MapPin, ShieldCheck, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, PageHeader, ProgressBar } from "../components/ui";
import { useDemo } from "../context/DemoContext";

export function Customer360() {
  const { id = "maple-ridge" } = useParams();
  const { accounts } = useDemo();
  const navigate = useNavigate();
  const account = accounts.find((item) => item.id === id) ?? accounts[0];
  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/opportunities")}><ArrowLeft className="h-4 w-4" />Back to opportunities</Button>
      <PageHeader eyebrow="Customer 360" title={account.company} description={`${account.industry} · ${account.city}, ${account.province}`} actions={<><Badge tone={account.consentStatus === "Permitted" ? "success" : "warning"}>{account.consentStatus}</Badge><Button onClick={() => navigate("/outreach")}>Prepare outreach</Button></>} />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[{ icon: MapPin, label: "Location", value: `${account.city}, ${account.province}` }, { icon: Users, label: "Employees", value: account.employees.toString() }, { icon: BriefcaseBusiness, label: "Estimated opportunity", value: `$${account.estimatedValue.toLocaleString()} ARR` }, { icon: CalendarClock, label: "Recent signal", value: account.recentSignal }].map(({ icon: Icon, label, value }) => <Card key={label}><Icon className="h-5 w-5 text-rogers" /><p className="mt-3 text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 font-bold">{value}</p></Card>)}
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card><h2 className="text-lg font-bold">Current Rogers relationship</h2><div className="mt-4 space-y-2">{account.rogersProducts.map((product) => <div key={product} className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800"><ShieldCheck className="h-4 w-4" />{product}</div>)}</div></Card>
            <Card><h2 className="text-lg font-bold">Current Microsoft footprint</h2><div className="mt-4 space-y-2">{account.microsoftProducts.length ? account.microsoftProducts.map((product) => <div key={product} className="rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-800">{product}</div>) : <p className="text-sm text-slate-500">No Microsoft products observed in the synthetic account profile.</p>}</div></Card>
          </div>
          <Card><h2 className="text-lg font-bold">Recent signals</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{account.signals.map((signal) => <div key={signal.label} className="rounded-xl border border-slate-200 p-4"><div className="flex justify-between gap-2"><Badge tone={signal.strength === "High" ? "success" : "info"}>{signal.strength}</Badge><span className="text-xs text-slate-400">{signal.date}</span></div><p className="mt-3 text-sm font-semibold">{signal.label}</p><p className="mt-1 text-xs text-slate-500">{signal.type} signal</p></div>)}</div></Card>
          <Card><h2 className="text-lg font-bold">Key contacts and permissions</h2><div className="mt-4 divide-y divide-slate-100">{account.contacts.map((contact) => <div key={contact.id} className="flex flex-col justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"><div><p className="font-semibold">{contact.name}</p><p className="text-sm text-slate-500">{contact.role} · {contact.email}</p></div><Badge tone={contact.consent === "Permitted" ? "success" : contact.consent === "Pending" ? "warning" : "danger"}>{contact.consent}</Badge></div>)}</div></Card>
          <Card><h2 className="text-lg font-bold">Known needs and next action</h2><p className="mt-3 text-sm leading-6 text-slate-600">{account.challenge}</p><div className="mt-4 rounded-xl border-l-4 border-rogers bg-red-50 p-4"><p className="text-xs font-bold uppercase text-red-700">Recommended next action</p><p className="mt-1 font-semibold">{account.recommendedAction}</p></div></Card>
        </div>
        <div className="space-y-5">
          <Card>
            <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase text-slate-500">Opportunity score</p><p className="mt-2 text-5xl font-bold">{account.propensity}</p></div><span className="text-sm font-semibold text-slate-400">/100</span></div>
            <div className="mt-4"><ProgressBar value={account.propensity} /></div>
            <p className="mt-3 text-xs leading-5 text-slate-500">Transparent weighted factors. This score supports prioritization; it does not replace seller judgment.</p>
          </Card>
          <Card><h2 className="font-bold">Score explanation</h2><div className="mt-4 space-y-4">{Object.entries(account.scoreBreakdown).map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between text-xs"><span>{label}</span><strong>{value}</strong></div><ProgressBar value={(value / 18) * 100} color={value > 13 ? "bg-rogers" : "bg-blue-600"} /></div>)}</div></Card>
          <Card className="bg-charcoal text-white"><MailCheck className="h-6 w-6 text-red-300" /><h2 className="mt-3 text-lg font-bold">Communication permissions</h2><p className="mt-2 text-sm leading-6 text-slate-300">Business email contact is {account.consentStatus.toLowerCase()}. Consent, suppression, frequency, and policy checks run again before simulated send.</p></Card>
        </div>
      </div>
    </div>
  );
}
