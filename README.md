# Agent Riley

**AI-powered inside sales for Rogers Business SMB growth**

Agent Riley is a production-quality interactive concept demonstration showing how Rogers Business could identify high-potential SMB accounts, conduct governed outreach, qualify opportunities, recommend Rogers and Microsoft bundles, request human approval, and create a simulated seller handoff.

> Concept demonstration only. Uses synthetic data and simulated agent actions. Not connected to live Rogers or Microsoft production systems.

## Business scenario

The executive walkthrough follows Maple Ridge Dental Group, a fictional 42-person business opening a second location. Riley combines a synthetic Rogers relationship, product gaps, growth signals, security intent, contactability, and renewal proximity to recommend a Rogers Business Modern Workplace bundle. The customer conversation, consent checks, qualification, approval, CRM record, metrics, and audit events are all simulated locally.

## Demo capabilities

- Executive overview and guided tour
- Filterable SMB opportunity workbench with eight fictional Canadian accounts
- Customer 360 with transparent propensity scoring
- Tone-aware outreach studio with consent and policy checks
- Branching customer conversation, including enforced opt-out
- Explainable BANT-style qualification
- Three Rogers Business bundle recommendations
- Human approval queue and simulated Dynamics 365-style opportunity
- Performance funnel, pipeline trend, attach rates, and illustrative agent economics
- Responsive HTML solution architecture with demo/production toggle
- Governance console whose controls actively block relevant actions
- localStorage persistence, reset, toast feedback, keyboard navigation, and reduced-motion support

## Architecture overview

The proposed production pattern separates:

1. Experience channels and seller workspaces
2. Agent orchestration, qualification, recommendation, and approvals
3. Rogers and approved Microsoft signals
4. API, event, CRM, and marketplace integration
5. Rogers-governed data, Fabric, search, and audit records
6. Identity, Purview, Defender, monitoring, responsible AI, and human oversight

The repository contains no production connectors. Rogers customer data and business rules would remain in Rogers-governed environments.

## Technology

- React 18 and TypeScript
- Vite
- Tailwind CSS
- React Router with `HashRouter` for reliable static hosting
- Lucide React
- Recharts
- Local synthetic TypeScript data and browser localStorage

## Local setup

```bash
npm install
npm run dev
```

Open the URL printed by Vite. To create a production build:

```bash
npm run build
npm run preview
```

## Azure Static Web Apps deployment

The preferred workflow is `.github/workflows/azure-static-web-apps.yml`.

1. Create an Azure Static Web App linked to this GitHub repository.
2. Use `/` as the app location and `dist` as the output location.
3. Add the deployment token as the GitHub Actions secret `AZURE_STATIC_WEB_APPS_API_TOKEN`.
4. Push to `main` or run the workflow manually.
5. The included `staticwebapp.config.json` provides a fallback and baseline response headers.

No deployment token is stored in the repository.

## GitHub Pages deployment

An optional workflow is included at `.github/workflows/pages.yml`.

1. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
2. Run the **Deploy to GitHub Pages** workflow.
3. Vite uses a relative base and the app uses `HashRouter`, so project-site paths work without server rewrites.

## Custom domain

The intended domain is `projectriley.patersonindustrydemos.com`.

For Azure Static Web Apps:

1. Deploy and verify the default Azure URL.
2. In the Static Web App, open **Custom domains** and add `projectriley.patersonindustrydemos.com`.
3. Add the CNAME or TXT validation record Azure supplies through the DNS provider.
4. Wait for certificate validation and HTTPS provisioning.
5. Confirm the domain loads the app and preserves hash routes.

For GitHub Pages, add the custom domain in **Settings → Pages**, then create the documented CNAME record to the GitHub Pages hostname. Do not configure both hosts for the same DNS name at once.

DNS is intentionally not changed by this repository.

## Suggested executive walkthrough

1. Start on Overview and select **Take the Tour**.
2. Open Maple Ridge Dental Group in Opportunities and review its score.
3. Inspect Customer 360, then prepare consultative outreach.
4. Select a customer response in Conversations.
5. Review the updated Qualification score and seller summary.
6. Choose the Modern Workplace offer.
7. Approve the handoff and inspect the simulated CRM record.
8. Show Performance, Architecture, and Governance.
9. Demonstrate opt-out or disable a required governance control.
10. Use **Reset demo** to restore the initial state.

## Assumptions and limitations

- All names, companies, emails, signals, products, values, and interactions are fictional.
- Pricing and economics are illustrative, not Rogers price guidance or production cost estimates.
- “Microsoft propensity signals,” CRM, marketplace, email, Azure AI Foundry, Copilot Studio, Fabric, and Azure AI Search are architecture concepts only.
- The demo uses deterministic local responses rather than an external AI service.
- Responsive behaviour is optimized for desktop and tablet presentations.
