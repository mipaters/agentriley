import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DemoProvider } from "./state/DemoContext";
import {
  AgentWorkspace,
  ArchitectureGovernance,
  CustomerZero,
  DemoGuide,
  ExecutiveOverview,
  MarketplaceJourney,
  OfferStudio,
  ProspectIntelligence,
  QualifiedPipeline,
} from "./pages/Pages";
import "./styles.css";

export default function VerizonApp() {
  return (
    <DemoProvider>
      <div className="verizon-mode">
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<ExecutiveOverview />} />
            <Route path="prospects" element={<ProspectIntelligence />} />
            <Route path="workspace" element={<AgentWorkspace />} />
            <Route path="offers" element={<OfferStudio />} />
            <Route path="pipeline" element={<QualifiedPipeline />} />
            <Route path="marketplace" element={<MarketplaceJourney />} />
            <Route path="customer-zero" element={<CustomerZero />} />
            <Route path="architecture" element={<ArchitectureGovernance />} />
            <Route path="guide" element={<DemoGuide />} />
            <Route path="*" element={<Navigate to="/verizon" replace />} />
          </Route>
        </Routes>
      </div>
    </DemoProvider>
  );
}
