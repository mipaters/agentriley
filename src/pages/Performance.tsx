import { BarChart3, Clock3, DollarSign, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, MetricCard, PageHeader } from "../components/ui";
import { costMetrics, funnelData, trendData } from "../data/metrics";
import { useDemo } from "../context/DemoContext";

export function Performance() {
  const { opportunities } = useDemo();
  const totalCost = costMetrics.reduce((sum, item) => sum + item.amount, 0);
  return (
    <div>
      <PageHeader eyebrow="Performance and economics" title="Connect activity to business value" description="Synthetic demo data illustrates pipeline, recurring revenue, attach rates, seller capacity, and operating economics." actions={<select aria-label="Reporting period" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"><option>Current quarter</option><option>Current month</option><option>Year to date</option></select>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Accounts contacted" value="1,672" detail="13.4% of analyzed accounts" />
        <MetricCard label="Response rate" value="37.3%" detail="Synthetic campaign average" />
        <MetricCard label="Qualified opportunities" value={`${238 + opportunities.length}`} detail="38.1% of engaged accounts" accent />
        <MetricCard label="Pipeline generated" value={`$${(6.8 + opportunities.length * 0.0288).toFixed(2)}M`} detail="CAD · illustrative" />
        <MetricCard label="Microsoft 365 seats" value="3,840" detail="Potential qualified seat volume" />
        <MetricCard label="Copilot attach rate" value="24%" detail="Among eligible recommendations" />
        <MetricCard label="Connectivity attach rate" value="41%" detail="Net-new or expanded connectivity" />
        <MetricCard label="Seller hours returned" value="3,460" detail="Illustrative administrative time" />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Card><div className="flex items-center gap-3"><BarChart3 className="text-rogers" /><div><h2 className="font-bold">Conversion funnel</h2><p className="text-xs text-slate-500">Current quarter · demo data</p></div></div><div className="mt-5 h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 20 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={105} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#DA291C" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div></Card>
        <Card><div className="flex items-center gap-3"><TrendingUp className="text-blue-700" /><div><h2 className="font-bold">Pipeline trend</h2><p className="text-xs text-slate-500">Illustrative weekly pipeline in CAD thousands</p></div></div><div className="mt-5 h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="week" /><YAxis /><Tooltip /><Line type="monotone" dataKey="pipeline" stroke="#DA291C" strokeWidth={3} /><Line type="monotone" dataKey="qualified" stroke="#2563EB" strokeWidth={2} /></LineChart></ResponsiveContainer></div></Card>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_340px]">
        <Card>
          <div className="flex items-center gap-3"><DollarSign className="text-green-700" /><div><h2 className="font-bold">Agent economics</h2><p className="text-xs text-slate-500">Illustrative monthly operating model</p></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{costMetrics.map((item) => <div key={item.label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-500">{item.label}</p><p className="mt-2 text-xl font-bold">${item.amount.toLocaleString()}</p></div>)}</div>
          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">Illustrative model only. Actual economics depend on model choice, token usage, campaign volume, integrations, and operating controls.</p>
        </Card>
        <Card className="bg-charcoal text-white"><Clock3 className="h-7 w-7 text-red-300" /><p className="mt-4 text-xs font-bold uppercase text-slate-400">Estimated operating cost</p><p className="mt-2 text-4xl font-bold">${totalCost.toLocaleString()}</p><p className="text-sm text-slate-400">per illustrative month</p><div className="mt-6 space-y-4 border-t border-white/10 pt-5"><div className="flex justify-between"><span className="text-sm text-slate-400">Cost per engaged account</span><strong>$24.36</strong></div><div className="flex justify-between"><span className="text-sm text-slate-400">Cost per qualified opportunity</span><strong>$63.87</strong></div><div className="flex justify-between"><span className="text-sm text-slate-400">Human approval rate</span><strong>80.3%</strong></div><div className="flex justify-between"><span className="text-sm text-slate-400">Opt-out rate</span><strong>1.8%</strong></div></div></Card>
      </div>
    </div>
  );
}
