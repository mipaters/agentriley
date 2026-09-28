import { Check, PackageCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { offers } from "../data/offers";
import { useDemo } from "../context/DemoContext";
import { Badge, Button, Card, PageHeader, ProgressBar } from "../components/ui";

export function Offers() {
  const { selectedOffer, setSelectedOffer, submitApproval } = useDemo();
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader eyebrow="Offer recommendation" title="Compare the next best bundles" description="Recommendations are grounded in known needs and labelled with confidence, dependencies, and illustrative annual value." actions={<Badge tone="warning">Illustrative pricing only</Badge>} />
      <div className="grid gap-5 xl:grid-cols-3">
        {offers.map((offer, index) => {
          const selected = selectedOffer === offer.id;
          return <Card key={offer.id} className={selected ? "border-red-300 ring-2 ring-red-100" : ""}>
            <div className="flex items-start justify-between gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-rogers"><PackageCheck /></div>{index === 0 && <Badge tone="success">Best fit</Badge>}</div>
            <h2 className="mt-5 text-xl font-bold">{offer.name}</h2><p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">{offer.description}</p>
            <div className="mt-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase text-slate-500">Illustrative annual value</p><p className="mt-1 text-2xl font-bold">${offer.annualValue.toLocaleString()} CAD</p></div><div className="text-right"><p className="text-xs text-slate-500">Confidence</p><p className="font-bold">{offer.confidence}%</p></div></div>
            <div className="mt-3"><ProgressBar value={offer.confidence} /></div>
            <h3 className="mt-6 text-sm font-bold">Products included</h3><ul className="mt-3 space-y-2">{offer.products.map((product) => <li key={product} className="flex gap-2 text-sm text-slate-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />{product}</li>)}</ul>
            <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">Customer need addressed</p><p className="mt-2 text-sm leading-6 text-slate-700">{offer.need}</p></div>
            <h3 className="mt-5 text-sm font-bold">Dependencies</h3><ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-slate-500">{offer.dependencies.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3 className="mt-5 text-sm font-bold">Seller talking points</h3><ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-slate-500">{offer.talkingPoints.map((item) => <li key={item}>{item}</li>)}</ul>
            <Button variant={selected ? "primary" : "secondary"} className="mt-6 w-full" onClick={() => setSelectedOffer(offer.id)}>{selected ? "Selected" : "Select offer"}</Button>
          </Card>;
        })}
      </div>
      <div className="mt-6 flex justify-end"><Button onClick={() => { submitApproval(); navigate("/approvals"); }}>Submit recommendation for approval</Button></div>
    </div>
  );
}
