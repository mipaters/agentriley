import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";

const Overview = lazy(() => import("./pages/Overview").then((module) => ({ default: module.Overview })));
const VerizonApp = lazy(() => import("./verizon/VerizonApp"));
const CustomerZero = lazy(() => import("./pages/CustomerZero").then((module) => ({ default: module.CustomerZero })));
const Opportunities = lazy(() => import("./pages/Opportunities").then((module) => ({ default: module.Opportunities })));
const Customer360 = lazy(() => import("./pages/Customer360").then((module) => ({ default: module.Customer360 })));
const Outreach = lazy(() => import("./pages/Outreach").then((module) => ({ default: module.Outreach })));
const Conversation = lazy(() => import("./pages/Conversation").then((module) => ({ default: module.Conversation })));
const Qualification = lazy(() => import("./pages/Qualification").then((module) => ({ default: module.Qualification })));
const Offers = lazy(() => import("./pages/Offers").then((module) => ({ default: module.Offers })));
const Approvals = lazy(() => import("./pages/Approvals").then((module) => ({ default: module.Approvals })));
const Performance = lazy(() => import("./pages/Performance").then((module) => ({ default: module.Performance })));
const Architecture = lazy(() => import("./pages/Architecture").then((module) => ({ default: module.Architecture })));
const Governance = lazy(() => import("./pages/Governance").then((module) => ({ default: module.Governance })));

export default function App() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-canvas text-sm font-semibold text-slate-500">Loading Agent Riley…</div>}>
      <Routes>
        <Route path="verizon/*" element={<VerizonApp />} />
        <Route element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="customer-zero" element={<CustomerZero />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="accounts/:id" element={<Customer360 />} />
          <Route path="outreach" element={<Outreach />} />
          <Route path="conversations" element={<Conversation />} />
          <Route path="qualification" element={<Qualification />} />
          <Route path="offers" element={<Offers />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="performance" element={<Performance />} />
          <Route path="architecture" element={<Architecture />} />
          <Route path="governance" element={<Governance />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
