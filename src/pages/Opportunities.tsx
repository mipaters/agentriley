import { useMemo, useState } from "react";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, Card, PageHeader, ProgressBar } from "../components/ui";
import { useDemo } from "../context/DemoContext";

export function Opportunities() {
  const { accounts } = useDemo();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("All");
  const [stage, setStage] = useState("All");
  const [sort, setSort] = useState("propensity");
  const [selected, setSelected] = useState("maple-ridge");
  const selectedAccount = accounts.find((account) => account.id === selected)!;

  const filtered = useMemo(() => accounts
    .filter((account) => account.company.toLowerCase().includes(search.toLowerCase()))
    .filter((account) => province === "All" || account.province === province)
    .filter((account) => stage === "All" || account.stage === stage)
    .sort((a, b) => sort === "value" ? b.estimatedValue - a.estimatedValue : sort === "recent" ? b.recentSignal.localeCompare(a.recentSignal) : b.propensity - a.propensity),
  [accounts, search, province, stage, sort]);

  return (
    <div>
      <PageHeader eyebrow="SMB opportunity workbench" title="Prioritize the right accounts" description="Explore synthetic Canadian SMB accounts and see the signals behind every propensity score." />
      <Card className="mb-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="relative"><span className="sr-only">Search accounts</span><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search accounts" className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm" /></label>
          <label className="relative"><span className="sr-only">Province</span><Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><select value={province} onChange={(event) => setProvince(event.target.value)} className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm"><option>All</option>{[...new Set(accounts.map((account) => account.province))].map((item) => <option key={item}>{item}</option>)}</select></label>
          <select aria-label="Opportunity stage" value={stage} onChange={(event) => setStage(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"><option>All</option>{[...new Set(accounts.map((account) => account.stage))].map((item) => <option key={item}>{item}</option>)}</select>
          <label className="relative"><span className="sr-only">Sort accounts</span><ArrowUpDown className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm"><option value="propensity">Highest propensity</option><option value="value">Highest estimated value</option><option value="recent">Most recent signal</option></select></label>
        </div>
      </Card>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Company", "Location", "Employees", "Product relationship", "Propensity", "Consent", "Stage", "Seller"].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((account) => (
                  <tr key={account.id} onClick={() => setSelected(account.id)} onDoubleClick={() => navigate(`/accounts/${account.id}`)} className={`cursor-pointer transition hover:bg-red-50/40 ${selected === account.id ? "bg-red-50/60" : ""}`}>
                    <td className="px-4 py-4"><button onClick={() => navigate(`/accounts/${account.id}`)} className="font-semibold text-charcoal hover:text-rogers">{account.company}</button><p className="mt-1 text-xs text-slate-500">{account.industry}</p></td>
                    <td className="px-4 py-4 text-slate-600">{account.city}, {account.province}</td>
                    <td className="px-4 py-4">{account.employees}</td>
                    <td className="px-4 py-4"><p>{account.rogersProducts.length} Rogers</p><p className="text-xs text-slate-500">{account.microsoftProducts.length} Microsoft</p></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-3"><span className="w-7 font-bold">{account.propensity}</span><div className="w-16"><ProgressBar value={account.propensity} /></div></div></td>
                    <td className="px-4 py-4"><Badge tone={account.consentStatus === "Permitted" ? "success" : account.consentStatus === "Pending" ? "warning" : "danger"}>{account.consentStatus}</Badge></td>
                    <td className="px-4 py-4"><Badge tone="info">{account.stage}</Badge></td>
                    <td className="px-4 py-4 text-slate-600">{account.assignedSeller}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-widest text-rogers">Why this account?</p>
          <h2 className="mt-2 text-xl font-bold">{selectedAccount.company}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{selectedAccount.recommendedAction}</p>
          <div className="mt-5 space-y-4">
            {Object.entries(selectedAccount.scoreBreakdown).map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between text-xs"><span className="font-medium text-slate-600">{label}</span><span className="font-bold">{value} pts</span></div><ProgressBar value={(value / 18) * 100} color={value >= 14 ? "bg-rogers" : "bg-blue-600"} /></div>)}
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">Known challenge</p><p className="mt-2 text-sm leading-6 text-slate-700">{selectedAccount.challenge}</p></div>
          <button onClick={() => navigate(`/accounts/${selectedAccount.id}`)} className="mt-5 w-full rounded-xl bg-charcoal px-4 py-3 text-sm font-semibold text-white hover:bg-black">Open Customer 360</button>
        </Card>
      </div>
    </div>
  );
}
