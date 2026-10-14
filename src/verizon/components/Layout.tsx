import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, Bot, BriefcaseBusiness, Building2, ChevronDown, Compass, LayoutDashboard, Menu, Network, PackageSearch, RotateCcw, Settings, Store, X } from 'lucide-react'
import { scenarios } from '../data/scenarios'
import { useDemo } from '../state/DemoContext'
import { Button, Disclaimer } from './UI'
import { DemoModeSwitch } from '../../components/DemoModeSwitch'

const nav = [
  ['/alternate', 'Executive Overview', LayoutDashboard],
  ['/alternate/prospects', 'Prospect Intelligence', PackageSearch],
  ['/alternate/workspace', 'Agent Riley Workspace', Bot],
  ['/alternate/offers', 'Offer Studio', BriefcaseBusiness],
  ['/alternate/pipeline', 'Qualified Pipeline', BarChart3],
  ['/alternate/marketplace', 'Digital Marketplace', Store],
  ['/alternate/customer-zero', 'Customer Zero', Building2],
  ['/alternate/architecture', 'Architecture & Governance', Network],
  ['/alternate/guide', 'Demo Guide', Compass],
] as const

export function Layout() {
  const { state, selectScenario, reset, update } = useDemo()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const scenario = scenarios.find(s => s.id === state.scenarioId)!
  const runDemo = () => { update({ tourStep: 0, workflowStep: 0 }); navigate('/alternate/guide') }
  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" to="/alternate"><span>Agent Riley</span><b>| Alternate Demo</b></Link>
      <div className="topbar-controls">
        <DemoModeSwitch mode="verizon" />
        <span className="demo-pill"><i/> DEMO MODE</span>
        <label className="scenario-select">Scenario<select value={state.scenarioId} onChange={e => selectScenario(e.target.value as typeof state.scenarioId)}>{scenarios.map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select><ChevronDown size={14}/></label>
        <button className="currency" onClick={() => update({ currency: state.currency === 'USD' ? 'CAD' : 'USD' })}>{state.currency}</button>
        <Button onClick={runDemo}>Run Executive Demo</Button>
        <button className="icon-button" aria-label="Reset demo" onClick={() => { reset(); navigate('/alternate') }}><RotateCcw size={18}/></button>
        <button className="icon-button" aria-label="Governance settings" onClick={() => navigate('/alternate/architecture')}><Settings size={18}/></button>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
      </div>
    </header>
    <aside className={open ? 'sidebar open' : 'sidebar'}>
      <div className="scenario-card"><span>Current synthetic scenario</span><strong>{scenario.name}</strong><p>{scenario.purpose}</p></div>
      <nav aria-label="Primary navigation">{nav.map(([path, label, Icon]) => <NavLink key={path} to={path} end={path === '/alternate'} onClick={() => setOpen(false)}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-foot"><span>Current page</span><b>{nav.find(([path]) => path === location.pathname)?.[1] ?? 'Agent Riley'}</b></div>
    </aside>
    <main className="main-content"><Outlet /></main>
    <footer><Disclaimer/><p>Agent Riley · Alternate executive concept demonstration · Synthetic data only</p></footer>
  </div>
}
