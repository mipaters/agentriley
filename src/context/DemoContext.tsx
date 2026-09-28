import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { accounts as seedAccounts } from "../data/accounts";
import {
  controlledPilotAssumptions, defaultAzureRateCard, defaultCustomerResources, defaultFinOpsPolicy,
  defaultImplementationFunding, defaultSensitivity, tcoScenarios,
} from "../data/tcoData";
import type { Account, Approval, AuditEvent, Controls, Conversation, ConversationResponseId, Opportunity, Qualification, Status } from "../types";
import type {
  AzureRateCard, Currency, CustomerResourceCost, FinOpsPolicy, ImplementationFunding, SensitivityScenario,
  TcoAssumptions, TcoScenarioId,
} from "../types/tco";

interface Toast {
  id: number;
  message: string;
  tone: "success" | "warning" | "info";
}

interface DemoState {
  accounts: Account[];
  conversation: Conversation;
  qualification: Qualification;
  approvals: Approval[];
  opportunities: Opportunity[];
  audit: AuditEvent[];
  controls: Controls;
  activeTour: number | null;
  selectedOffer: string;
  tcoScenario: TcoScenarioId;
  tcoAssumptions: TcoAssumptions;
  azureRateCard: AzureRateCard;
  implementationFunding: ImplementationFunding;
  customerResources: CustomerResourceCost[];
  resourcesIncremental: boolean;
  currency: Currency;
  finOpsPolicy: FinOpsPolicy;
  sensitivityScenarios: SensitivityScenario[];
}

interface DemoContextValue extends DemoState {
  toasts: Toast[];
  setActiveTour: (step: number | null) => void;
  setSelectedOffer: (offer: string) => void;
  setTcoScenario: (scenario: TcoScenarioId) => void;
  updateTcoAssumption: (key: keyof TcoAssumptions, value: number) => void;
  updateAzureRate: (key: keyof AzureRateCard, value: number) => void;
  updateImplementationFunding: (key: keyof ImplementationFunding, value: ImplementationFunding[keyof ImplementationFunding]) => void;
  updateCustomerResource: (index: number, value: number) => void;
  setResourcesIncremental: (enabled: boolean) => void;
  setCurrency: (currency: Currency) => void;
  updateFinOpsPolicy: (key: keyof FinOpsPolicy, value: FinOpsPolicy[keyof FinOpsPolicy]) => void;
  updateSensitivityScenario: (index: number, key: keyof SensitivityScenario, value: SensitivityScenario[keyof SensitivityScenario]) => void;
  addCustomerResponse: (kind: ConversationResponseId) => void;
  submitApproval: () => void;
  resolveApproval: (status: Approval["status"]) => void;
  toggleControl: (key: keyof Controls) => void;
  resetDemo: () => void;
  notify: (message: string, tone?: Toast["tone"]) => void;
}

const initialControls: Controls = {
  consentValidation: true,
  optOutEnforcement: true,
  suppressionLists: true,
  frequencyCaps: true,
  humanApproval: true,
  piiMasking: true,
  sourceTransparency: true,
  contentFiltering: true,
  costThreshold: true,
  killSwitch: false,
};

const initialQualification: Qualification = {
  accountId: "maple-ridge",
  score: 38,
  criteria: {
    Need: { status: "Likely", points: 10, rationale: "Growth and security signals suggest a meaningful need." },
    Authority: { status: "Confirmed", points: 12, rationale: "Priya Shah is the managing partner." },
    Timing: { status: "Unknown", points: 0, rationale: "Current agreement timing is not yet confirmed." },
    "Budget fit": { status: "Unknown", points: 0, rationale: "Budget is not required to continue qualification." },
    Consent: { status: "Confirmed", points: 8, rationale: "Business email contact is permitted." },
    "Current provider": { status: "Likely", points: 3, rationale: "Microsoft 365 is supplied by another provider." },
    "Product fit": { status: "Likely", points: 5, rationale: "Modern workplace bundle aligns to known signals." },
    "Customer interest": { status: "Unknown", points: 0, rationale: "No response has been selected yet." },
  },
};

const initialState: DemoState = {
  accounts: seedAccounts,
  conversation: {
    accountId: "maple-ridge",
    status: "Not started",
    step: 0,
    messages: [
      {
        id: "intro",
        sender: "Riley",
        text: "Hi Priya — as Maple Ridge Dental Group grows, Rogers Business may be able to help simplify collaboration and security across your locations. Would it be useful to compare options with your current setup?",
        timestamp: "9:30 AM",
      },
    ],
  },
  qualification: initialQualification,
  approvals: [],
  opportunities: [],
  audit: [
    { id: "seed-1", type: "Signal review", detail: "Maple Ridge Dental Group prioritized with transparent score factors.", timestamp: "2026-09-28 09:12" },
  ],
  controls: initialControls,
  activeTour: null,
  selectedOffer: "modern-workplace",
  tcoScenario: "pilot",
  tcoAssumptions: controlledPilotAssumptions,
  azureRateCard: defaultAzureRateCard,
  implementationFunding: defaultImplementationFunding,
  customerResources: defaultCustomerResources,
  resourcesIncremental: false,
  currency: "CAD",
  finOpsPolicy: defaultFinOpsPolicy,
  sensitivityScenarios: defaultSensitivity,
};

const DemoContext = createContext<DemoContextValue | null>(null);
const STORAGE_KEY = "agent-riley-demo-state-v2";

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;
    try {
      return { ...initialState, ...JSON.parse(saved) } as DemoState;
    } catch {
      return initialState;
    }
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const notify = (message: string, tone: Toast["tone"] = "info") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3400);
  };

  const addCustomerResponse = (kind: ConversationResponseId) => {
    const responses: Record<ConversationResponseId, {
      customer: string;
      riley: string;
      score: number;
      updates: Record<string, [Status, number, string]>;
      branch?: "need" | "provider" | "timing";
      qualified?: boolean;
    }> = {
      need: {
        customer: "We are opening another office and need a better way to manage staff access and security.",
        riley: "That makes sense. To keep the discussion relevant, who manages user access today, and when does the new office need to be operational?",
        branch: "need" as const,
        score: 62,
        updates: {
          Need: ["Confirmed", 18, "Customer confirmed an access and security need."],
          "Customer interest": ["Confirmed", 12, "Customer engaged with the outreach."],
        },
      },
      provider: {
        customer: "We already buy Microsoft 365 from another provider. Why would we move it?",
        riley: "A change would only make sense if it creates measurable value. Potential areas include simplified support, consolidated billing, and tighter connectivity and collaboration planning. What would matter most when you next review the relationship?",
        branch: "provider" as const,
        score: 57,
        updates: {
          "Current provider": ["Confirmed", 7, "Customer confirmed an existing Microsoft provider."],
          "Customer interest": ["Confirmed", 12, "Customer is evaluating the value of a change."],
        },
      },
      timing: {
        customer: "We may be interested, but we are not changing anything until our current term ends.",
        riley: "Understood. We can align any assessment to your renewal timing and avoid disrupting the current term. When does that agreement come up for review?",
        branch: "timing" as const,
        score: 61,
        updates: {
          Timing: ["Likely", 7, "Customer confirmed that action depends on the current term end."],
          "Customer interest": ["Confirmed", 12, "Customer expressed conditional interest."],
        },
      },
      accessOwner: {
        customer: "Daniel, our office and IT manager, handles access today, but I approve major changes.",
        riley: "Thanks—that clarifies the decision process. Is the new office expected to be operational within the next three months?",
        score: 74,
        updates: {
          Authority: ["Confirmed", 14, "Priya approves major changes and Daniel is the technical influencer."],
          Need: ["Confirmed", 18, "Customer confirmed a current access-management challenge."],
        },
      },
      newOffice90: {
        customer: "The new office needs to be ready within about 90 days.",
        riley: "That creates a practical planning window. We can focus a seller discussion on what must be ready for opening day. How are technology investments approved?",
        score: 76,
        updates: {
          Timing: ["Confirmed", 14, "New office readiness is required within approximately 90 days."],
          Need: ["Confirmed", 18, "The expansion has a defined operational requirement."],
        },
      },
      singleSupport: {
        customer: "A single support relationship and simpler billing would be valuable.",
        riley: "Understood. Those are reasonable areas to assess, without assuming a move is automatically right. When does your current Microsoft agreement renew?",
        score: 70,
        updates: {
          "Product fit": ["Confirmed", 12, "Customer values consolidated support and billing."],
          Need: ["Confirmed", 16, "Customer confirmed a consolidation need."],
        },
      },
      termEnds: {
        customer: "Our current Microsoft term ends in roughly four months.",
        riley: "That timing supports a no-pressure review before renewal. Who else should be involved in evaluating options?",
        score: 78,
        updates: {
          Timing: ["Confirmed", 14, "Current Microsoft term ends in approximately four months."],
          "Current provider": ["Confirmed", 7, "An incumbent provider and renewal window are confirmed."],
        },
      },
      stayProvider: {
        customer: "We are happy with the current provider unless there is a clear operational advantage.",
        riley: "That is a sensible threshold. Riley will not assume a switch. A seller can compare support, billing, connectivity, and migration implications so you can decide whether further review is worthwhile.",
        score: 64,
        updates: {
          "Current provider": ["Confirmed", 7, "Customer prefers the incumbent unless a clear advantage is demonstrated."],
          "Customer interest": ["Likely", 7, "Customer is open to evidence but not committed to change."],
        },
      },
      earlyAssessment: {
        customer: "The term ends later this year, but we could assess options before then.",
        riley: "That provides time to compare options without creating urgency. What level of investment would require a formal business case?",
        score: 72,
        updates: {
          Timing: ["Confirmed", 12, "Customer is open to an assessment ahead of renewal."],
          "Customer interest": ["Confirmed", 12, "Customer agreed to evaluate options early."],
        },
      },
      budgetFlexible: {
        customer: "We can fund it if the business case shows lower administration effort and better security.",
        riley: "That is enough to continue qualification without inventing a price. A seller should validate scope and build the commercial case. Should Daniel join that discussion?",
        score: 88,
        updates: {
          "Budget fit": ["Likely", 9, "Funding is available if the operational and security case is supported."],
          "Product fit": ["Confirmed", 12, "The desired outcomes align to the recommended bundle."],
        },
      },
      budgetUnknown: {
        customer: "We have not set a budget yet; we need to understand the options first.",
        riley: "That is fine—unknown budget does not disqualify the opportunity. A seller can establish scope and provide approved commercial guidance. Who should participate in that review?",
        score: 80,
        updates: {
          "Budget fit": ["Unknown", 0, "Budget is not established, but the customer wants to understand options."],
          "Customer interest": ["Confirmed", 12, "Customer requested a clearer view of available options."],
        },
      },
      stakeholders: {
        customer: "Daniel and I would make the decision together after reviewing the operational impact.",
        riley: "Great. I will prepare a concise summary for human review and recommend a seller conversation with both of you. Would you prefer a meeting request or a written summary first?",
        score: 86,
        updates: {
          Authority: ["Confirmed", 14, "Priya and Daniel are confirmed as business and technical stakeholders."],
          "Customer interest": ["Confirmed", 12, "Customer described the evaluation process."],
        },
      },
      scheduleMeeting: {
        customer: "Please arrange a short meeting with a Rogers Business seller.",
        riley: "Thank you. I have captured the need, stakeholders, timing, provider context, and consent status. The handoff will pause for human approval before any meeting or CRM action is created.",
        score: 94,
        qualified: true,
        updates: {
          "Customer interest": ["Confirmed", 14, "Customer requested a seller meeting."],
          "Product fit": ["Confirmed", 13, "Customer agreed to a seller-led solution review."],
        },
      },
      sendSummary: {
        customer: "Send a short summary first, then we can decide on a meeting.",
        riley: "Understood. Riley will prepare a seller-reviewed summary and will not send anything externally without approval. The opportunity is ready for a controlled handoff.",
        score: 89,
        qualified: true,
        updates: {
          "Customer interest": ["Confirmed", 12, "Customer requested a written summary before a meeting."],
          "Product fit": ["Confirmed", 12, "Customer agreed to review the proposed solution areas."],
        },
      },
      notReady: {
        customer: "We are not ready for a meeting, but you may follow up closer to renewal.",
        riley: "Understood. I have recorded the timing preference. No meeting will be created, and any future contact remains subject to consent, frequency, and human-review controls.",
        score: 73,
        qualified: true,
        updates: {
          Timing: ["Confirmed", 10, "Customer requested follow-up closer to renewal."],
          "Customer interest": ["Likely", 6, "Customer is not ready now but permits a later review."],
        },
      },
      optout: {
        customer: "Please remove us from future outreach.",
        riley: "Understood. Your preference has been recorded and no further automated outreach will be sent.",
        score: 0,
        updates: {},
      },
    };
    const selected = responses[kind];
    const optedOut = kind === "optout";
    const now = new Date();
    setState((current) => {
      const criteria = { ...current.qualification.criteria };
      Object.entries(selected.updates).forEach(([criterion, [status, points, rationale]]) => {
        criteria[criterion] = { status, points, rationale };
      });
      if (optedOut) {
        criteria.Consent = { status: "Not qualified", points: 0, rationale: "Customer opted out. All outreach is stopped." };
      }
      return {
        ...current,
        accounts: current.accounts.map((account) =>
          account.id === "maple-ridge" && optedOut
            ? { ...account, consentStatus: "Opted out", stage: "Suppressed", recommendedAction: "No automated outreach", contacts: account.contacts.map((contact) => ({ ...contact, consent: "Opted out" })) }
            : account.id === "maple-ridge" && selected.qualified
              ? { ...account, stage: "Qualified", recommendedAction: "Prepare human-approved seller handoff" }
              : account,
        ),
        conversation: {
          ...current.conversation,
          status: optedOut ? "Stopped" : selected.qualified ? "Qualified" : "Active",
          step: optedOut || selected.qualified ? current.conversation.step : current.conversation.step + 1,
          branch: selected.branch ?? current.conversation.branch,
          messages: [
            ...current.conversation.messages,
            { id: `${now.getTime()}-c`, sender: "Customer", text: selected.customer, timestamp: now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) },
            { id: `${now.getTime()}-r`, sender: "Riley", text: selected.riley, timestamp: new Date(now.getTime() + 60000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) },
          ],
        },
        qualification: { ...current.qualification, score: optedOut ? 0 : selected.score, criteria },
        audit: [
          ...current.audit,
          {
            id: `${now.getTime()}-audit`,
            type: optedOut ? "Opt-out enforced" : selected.qualified ? "Conversation qualified" : "Conversation updated",
            detail: optedOut ? "Sequence stopped. No further automated outreach." : `Customer response captured: ${kind}.`,
            timestamp: now.toLocaleString("en-CA"),
          },
        ],
      };
    });
    notify(optedOut ? "Opt-out enforced. Outreach has stopped." : selected.qualified ? "Conversation qualified and ready for handoff." : "Conversation advanced and qualification updated.", optedOut ? "warning" : "success");
  };

  const submitApproval = () => {
    const maple = state.accounts.find((account) => account.id === "maple-ridge");
    if (!state.controls.consentValidation || maple?.consentStatus !== "Permitted") {
      notify("Outreach blocked: valid communication consent is required.", "warning");
      return;
    }
    if (state.controls.killSwitch) {
      notify("Campaign paused by the operational kill switch.", "warning");
      return;
    }
    setState((current) => ({
      ...current,
      approvals: current.approvals.some((approval) => approval.accountId === "maple-ridge")
        ? current.approvals
        : [{ id: "approval-maple", accountId: "maple-ridge", action: "Approve offer and CRM handoff", status: "Pending", createdAt: new Date().toLocaleString("en-CA") }, ...current.approvals],
      audit: [...current.audit, { id: `approval-${Date.now()}`, type: "Approval requested", detail: "Modern Workplace recommendation submitted for seller review.", timestamp: new Date().toLocaleString("en-CA") }],
    }));
    notify("Submitted for human approval.", "success");
  };

  const resolveApproval = (status: Approval["status"]) => {
    if (status === "Approved" && !state.controls.humanApproval) {
      notify("CRM routing blocked: human approval control is disabled.", "warning");
      return;
    }
    setState((current) => {
      const approved = status === "Approved";
      const hasOpportunity = current.opportunities.some((opportunity) => opportunity.accountId === "maple-ridge");
      return {
        ...current,
        approvals: current.approvals.map((approval) => approval.accountId === "maple-ridge" ? { ...approval, status } : approval),
        opportunities: approved && !hasOpportunity
          ? [{ id: "D365-DEMO-1042", accountId: "maple-ridge", name: "Maple Ridge Dental - Modern Workplace", value: 28800, stage: "Seller discovery", products: ["Microsoft 365 Business Premium", "Defender for Business", "Teams Phone", "Optional Copilot"], closeTiming: "Within 120 days", seller: "Jordan Lee" }, ...current.opportunities]
          : current.opportunities,
        accounts: current.accounts.map((account) => account.id === "maple-ridge" && approved ? { ...account, stage: "Opportunity", assignedSeller: "Jordan Lee" } : account),
        audit: [...current.audit, { id: `resolve-${Date.now()}`, type: `Approval ${status.toLowerCase()}`, detail: approved ? "Simulated CRM opportunity created and assigned to Jordan Lee." : `Approval marked ${status.toLowerCase()}.`, timestamp: new Date().toLocaleString("en-CA") }],
      };
    });
    notify(status === "Approved" ? "Approved. Simulated CRM opportunity created." : `Approval marked ${status.toLowerCase()}.`, status === "Approved" ? "success" : "info");
  };

  const toggleControl = (key: keyof Controls) => {
    setState((current) => ({ ...current, controls: { ...current.controls, [key]: !current.controls[key] } }));
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
    notify("Demo restored to its initial state.", "success");
  };

  const value: DemoContextValue = {
    ...state,
    toasts,
    setActiveTour: (activeTour) => setState((current) => ({ ...current, activeTour })),
    setSelectedOffer: (selectedOffer) => setState((current) => ({ ...current, selectedOffer })),
    setTcoScenario: (tcoScenario) => setState((current) => {
      const scenario = tcoScenarios.find((item) => item.id === tcoScenario) ?? tcoScenarios[0];
      return { ...current, tcoScenario, tcoAssumptions: { ...scenario.assumptions }, finOpsPolicy: { ...current.finOpsPolicy, campaignPaused: false } };
    }),
    updateTcoAssumption: (key, value) => setState((current) => ({ ...current, tcoAssumptions: { ...current.tcoAssumptions, [key]: Math.max(0, value) } })),
    updateAzureRate: (key, value) => setState((current) => ({ ...current, azureRateCard: { ...current.azureRateCard, [key]: Math.max(0, value) } })),
    updateImplementationFunding: (key, value) => setState((current) => ({ ...current, implementationFunding: { ...current.implementationFunding, [key]: value } })),
    updateCustomerResource: (index, amount) => setState((current) => ({ ...current, customerResources: current.customerResources.map((item, itemIndex) => itemIndex === index ? { ...item, amount: Math.max(0, amount) } : item) })),
    setResourcesIncremental: (resourcesIncremental) => setState((current) => ({ ...current, resourcesIncremental })),
    setCurrency: (currency) => setState((current) => ({ ...current, currency })),
    updateFinOpsPolicy: (key, value) => setState((current) => ({ ...current, finOpsPolicy: { ...current.finOpsPolicy, [key]: value } })),
    updateSensitivityScenario: (index, key, value) => setState((current) => ({
      ...current,
      sensitivityScenarios: current.sensitivityScenarios.map((scenario, itemIndex) => itemIndex === index ? { ...scenario, [key]: value } : scenario),
    })),
    addCustomerResponse,
    submitApproval,
    resolveApproval,
    toggleControl,
    resetDemo,
    notify,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoProvider");
  return context;
}
