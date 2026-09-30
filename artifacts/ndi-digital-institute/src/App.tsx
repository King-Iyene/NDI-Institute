import { useEffect, useState, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowRight, CheckCircle2, ChevronRight, Code2, Database,
  ExternalLink, Menu, MessageCircle, PenTool, Phone, X,
} from 'lucide-react';
import {
  Link, Route, Switch, Router as WouterRouter, useLocation,
} from 'wouter';
import NotFound from '@/pages/not-found';
import ndiLogo from '@assets/tmp3sykabk4_1788802155179.webp';
import ndiFooterLogo from '@assets/6a7c377c1fd638d364c21328_1788802293520.png';

const queryClient = new QueryClient();
const contactEmail = 'info@nigerdeltainnovate.org';

const IMG = {
  hero: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80',
  web: 'https://images.unsplash.com/photo-1620829813573-7c9e1877706f?w=800&q=80',
  data: 'https://images.unsplash.com/photo-1589114207353-1fc98a11070b?w=800&q=80',
  design: 'https://images.unsplash.com/photo-1611432579402-7037e3e2c1e4?w=800&q=80',
  about: 'https://images.unsplash.com/photo-1615891081220-9116de3e1afd?w=1920&q=80',
  admissions: 'https://images.unsplash.com/photo-1678695972687-033fa0bdbac9?w=1920&q=80',
  contact: 'https://images.unsplash.com/photo-1594751543129-6701ad444259?w=1920&q=80',
  diploma: 'https://images.unsplash.com/photo-1758270703602-309dba204bbc?w=1920&q=80',
  study: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1920&q=80',
};

const programmes = [
  { id: 'web', title: 'Web Development', family: 'Software and Build', code: 'WEB', icon: Code2, image: IMG.web, summary: 'Build, deploy and maintain a working website or web application to a client brief.', lead: 'Junior front-end or full-stack developer, freelance web developer, web officer or technical co-founder.', outcomes: ['Build a responsive, accessible web interface from a design or written brief.', 'Write JavaScript for state, events, validation and API data.', 'Design a simple relational schema and connect it to an application.', 'Build and consume a basic API, then explain the request and response cycle.', 'Deploy a site to a live host with a domain and keep it running.', 'Scope, quote and deliver a small client project with documentation.'], courses: [['WEB 121 · Front-End Development', 'Semantic HTML, CSS layout with flexbox and grid, responsive and mobile-first design, accessibility basics and building from a supplied design.'], ['WEB 122 · JavaScript and Interactive Interfaces', 'JavaScript in the browser, the DOM, events, forms and validation, asynchronous requests, public APIs and an introduction to a component framework.'], ['WEB 123 · Backend, Databases, APIs and Deployment', 'A server-side runtime, routing, relational databases, SQL basics, building a small API, environment configuration, domains and HTTPS.']] },
  { id: 'data', title: 'Data Analytics', family: 'Data and Artificial Intelligence', code: 'DAN', icon: Database, image: IMG.data, summary: 'Take a real dataset, clean it, interrogate it and give a decision-maker an answer they can act on.', lead: 'Data analyst, business analyst, monitoring and evaluation officer or reporting officer in government, NGOs, health, energy or finance.', outcomes: ['Acquire, clean and validate a dataset, documenting what you changed and why.', 'Write SQL to answer a question against a relational database.', 'Build a dashboard a non-technical manager can read without a briefing.', 'Choose an appropriate descriptive or comparative statistic and state its limits.', 'Present a finding in writing and aloud, separating data from inference.', 'Recognise when a dataset cannot answer the question being asked.'], courses: [['DAN 121 · SQL and Relational Databases', 'Relational structure, filtering, joins, grouping and aggregation, subqueries and readable queries against a realistic multi-table database.'], ['DAN 122 · Dashboards and Business Intelligence', 'Connecting to sources, modelling for reporting, chart selection, dashboard layout, filters, publishing and maintaining a live report.'], ['DAN 123 · Statistics for Decision Making', 'Distributions, summary statistics, variability, uncertainty, comparison, correlation, sampling and writing a findings note for a decision-maker.']] },
  { id: 'design', title: 'Graphic Design', family: 'Design', code: 'GRD', icon: PenTool, image: IMG.design, summary: 'Take a client brief and deliver finished, production-ready visual work across identity, print and digital.', lead: 'Graphic designer in an agency, media house, church, school, NGO or SME, or a freelance designer and branding service.', outcomes: ['Translate a brief into a clear visual direction and production plan.', 'Use composition, hierarchy, colour and type to make communication work.', 'Prepare artwork for print, identity systems, social channels and digital formats.', 'Critique your work and respond to a client or tutor brief without losing the purpose.', 'Build a portfolio of production-ready work that shows range and judgement.', 'Quote, revise and hand over design work professionally.'], courses: [['GRD 121 · Identity and Brand Systems', 'Visual identity, marks, colour systems, type pairing, brand rules and making a coherent family of applications.'], ['GRD 122 · Layout and Print Production', 'Composition, editorial and campaign layout, files for production, print processes, colour modes and quality checks.'], ['GRD 123 · Digital and Social Formats', 'Designing for screens, accessible contrast, responsive content, social formats, motion in outline and delivery to a content team.']] },
];

const catalogue = [
  ...programmes.map((p) => [p.title, p.family, 'January 2027']),
  ['Computer Hardware and Networks', 'Hardware and Infrastructure', 'Pending equipment confirmation'],
  ['Robotics and Automated Systems', 'Software and Build', 'Pending equipment confirmation'],
  ['Mobile Device and GSM Repairs', 'Hardware and Infrastructure', 'July 2027'],
  ['Systems Administration', 'Hardware and Infrastructure', 'July 2027'],
  ['Cybersecurity', 'Hardware and Infrastructure', 'July 2027'],
  ['UI and UX Design', 'Design', 'July 2027'],
  ['Virtual Assistance and Remote Work', 'Digital Work and Delivery', 'July 2027'],
  ['Data Science', 'Data and Artificial Intelligence', 'January 2028'],
  ['Artificial Intelligence', 'Data and Artificial Intelligence', 'January 2028'],
  ['Product Design', 'Design', 'January 2028'],
  ['Project Management', 'Digital Work and Delivery', 'January 2028'],
];

function LogoMark() {
  return <img className="wordmark-logo" src={ndiLogo} alt="Niger Delta Institute of Digital Technology" />;
}

function SiteHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [location]);
  const links = [['/', 'Home'], ['/programmes', 'Programmes'], ['/admissions', 'Admissions'], ['/diploma', 'Diploma pathway'], ['/about', 'About'], ['/contact', 'Contact']];
  return <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="wordmark" data-testid="link-home"><LogoMark /></Link>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} data-testid="button-menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
      <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main navigation">
        {links.map(([href, label]) => <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}
        <Link href="/admissions#apply" className="btn nav-apply" data-testid="link-start-application">Register interest <ArrowRight size={15} /></Link>
      </nav>
    </div>
  </header>;
}

function Footer() {
  return <footer className="footer"><div className="wrap">
    <div className="footer-grid">
      <div><img className="footer-logo" src={ndiFooterLogo} alt="Niger Delta Innovate" /><h3>Niger Delta Institute of Digital Technology</h3><p>Closing the digital skills gap across the Niger Delta.</p></div>
      <div><h4>Study</h4><ul><li><Link href="/programmes">Programmes</Link></li><li><Link href="/admissions">Admissions</Link></li><li><Link href="/diploma">Diploma pathway</Link></li><li><Link href="/admissions#apply">Register interest</Link></li></ul></div>
      <div><h4>Reach Registry</h4><ul><li><a href="mailto:info@nigerdeltainnovate.org">info@nigerdeltainnovate.org</a></li><li><a href="tel:+2348067260598">+234 806 726 0598</a></li><li><a href="https://wa.me/2348181958816">WhatsApp +234 818 195 8816</a></li><li>Plot 100 Avuha Estate, Eneka, Port Harcourt, Rivers State</li></ul></div>
    </div>
    <div className="colophon"><p>Niger Delta Innovate Ltd/Gte · RC 9645329 · A Company Limited by Guarantee · Port Harcourt, Rivers State</p><p>Awards are certificates of Niger Delta Innovate. Recognition from the National Board for Technical Education is being sought and is not in place.</p><p>Your data is handled under the Nigeria Data Protection Act 2023.</p></div>
  </div></footer>;
}

function PageFrame({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location]);
  return <div className="site-shell"><SiteHeader /><main className="fade-in">{children}</main><Footer /></div>;
}

function PageHero({ title, children, image }: { title: string; children: React.ReactNode; image?: string }) {
  return <section className={`page-hero${image ? ' img-section' : ''}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>
    {image && <div className="overlay" />}
    <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
      <h1>{title}</h1>
      <div className="lede">{children}</div>
    </div>
  </section>;
}

function HomePage() {
  return <PageFrame>
    <section className="hero hero-img" style={{ backgroundImage: `url(${IMG.hero})` }}>
      <div className="overlay" />
      <div className="wrap hero-content" style={{ position: 'relative', zIndex: 2 }}>
        <h1>Learn a digital trade <em>well enough to be paid for it.</em></h1>
        <p className="lede">24-week practical certificates in Port Harcourt. No prior experience needed.</p>
        <div className="actions">
          <Link href="/admissions#apply" className="btn" data-testid="button-hero-apply">Register interest <ArrowRight size={16} /></Link>
          <Link href="/programmes" className="btn btn-secondary" data-testid="button-hero-programmes">Explore programmes</Link>
        </div>
      </div>
    </section>

    <section className="section"><div className="wrap">
      <div className="stats-row">
        <div className="stat"><strong>24</strong><span>weeks</span></div>
        <div className="stat"><strong>30</strong><span>credit units</span></div>
        <div className="stat"><strong>3</strong><span>programmes</span></div>
        <div className="stat"><strong>4</strong><span>study modes</span></div>
      </div>
    </div></section>

    <section className="section tinted"><div className="wrap">
      <div className="section-head narrow"><h2>Three practical digital careers.</h2><p>Each programme opens with an appointed instructor, approved specification and confirmed equipment.</p></div>
      <div className="grid-3">{programmes.map((p) => <Link href={`/programmes#${p.id}`} className="program-card img-card" key={p.id} data-testid={`card-programme-${p.id}`} style={{ backgroundImage: `url(${p.image})` }}>
        <div className="overlay" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
          <span className="arrow-link">Learn more <ChevronRight size={14} /></span>
        </div>
      </Link>)}</div>
    </div></section>

    <section className="section"><div className="wrap"><div className="section-head"><h2>Thirty credit units. One project you defend.</h2><p>One credit unit is thirty notional learner hours. Your 900 hours move from shared foundations to specialist practice, then into a capstone built for a real brief.</p></div><div className="blockbar" role="img" aria-label="Certificate structure: Digital Core 6 units, Family Core 8 units, Specialist block 12 units, Capstone 4 units"><div className="b1"><b>Digital Core</b><span>6 units</span></div><div className="b2"><b>Family Core</b><span>8 units</span></div><div className="b3"><b>Specialist block</b><span>12 units</span></div><div className="b4"><b>Capstone</b><span>4 units</span></div></div><div className="grid-2" style={{ marginTop: '2.5rem' }}><div><h3>Shared foundations</h3><p>Everyone takes computing environments, professional practice for technical work, and online safety and data protection under the Nigeria Data Protection Act 2023.</p></div><div><h3>A capstone with nowhere to hide</h3><p>A partner brief or community need becomes your deadline. You produce the work and defend it in person before two assessors.</p></div></div></div></section>

    <section className="section dark-section hero-img" style={{ backgroundImage: `url(${IMG.study})` }}><div className="overlay" /><div className="wrap split-feature" style={{ position: 'relative', zIndex: 2 }}><div><div className="feature-number">40<span style={{ fontSize: '2rem' }}>%</span></div><h2>Blended, not remote.</h2><p>Forty per cent online in your own time, forty per cent live teaching and twenty per cent on-site practical work.</p></div><div><ul className="rule-list"><li><strong>Real workshops</strong><span>Robotics and hardware taught at RAIL, the Robotics and AI Laboratory at Okrika Grammar School.</span></li><li><strong>Four study modes</strong><span>Full-time blended, evening and weekend, hub cohort, or distance with residency blocks.</span></li><li><strong>Access by design</strong><span>You do not need to own a laptop. Device access is part of our access plan.</span></li></ul><p style={{ marginTop: '2rem' }}><Link href="/admissions" className="btn btn-light">See admissions and fees <ArrowRight size={16} /></Link></p></div></div></section>

    <section className="section"><div className="wrap"><div className="section-head narrow"><h2>Serious about the work. Plain about the award.</h2><p>Programmes lead to a certificate awarded by Niger Delta Innovate Ltd/Gte. Recognition from the National Board for Technical Education is being sought, is not guaranteed, and has no confirmed date.</p></div><div className="actions"><Link href="/about" className="btn btn-secondary">How we hold the standard <ArrowRight size={16} /></Link><Link href="/diploma" className="arrow-link" data-testid="link-home-diploma">See the diploma pathway <ChevronRight size={15} /></Link></div></div></section>
  </PageFrame>;
}

function ProgrammeDetail({ p }: { p: typeof programmes[number] }) {
  const Icon = p.icon;
  return <article className="detail" id={p.id}><div className="detail-head"><div><p className="eyebrow"><Icon size={16} /> {p.code} · January 2027</p><h2>Certificate in {p.title}</h2></div><span className="detail-meta">{p.family} · 30 credit units · 24 weeks</span></div><div className="grid-2"><div><p><strong>What it is for.</strong> {p.summary}</p><p><strong>Where it leads.</strong> {p.lead}</p><p><strong>Entry.</strong> Institute standard. No prior qualification in the field is required.</p><h3>By the end you can</h3><ol className="outcomes">{p.outcomes.map((o) => <li key={o}>{o}</li>)}</ol></div><div><h3>Specialist block · 12 credit units</h3><ul className="course-list">{p.courses.map(([name, desc]) => <li key={name}><b>{name}</b><span>{desc}</span></li>)}</ul><p className="meta"><strong>Assessment.</strong> Continuous work, practical build assessments and examination, plus the capstone. Practical components must be passed on their own.</p></div></div></article>;
}

function ProgrammesPage() {
  return <PageFrame><PageHero title="Learn by making something that has to work." image={IMG.hero}>Three certificates are accepting expressions of interest for January 2027. Practical assessment and an in-person capstone defence.</PageHero><section className="section tinted"><div className="wrap"><div className="section-head narrow"><h2>Certificates open for January 2027</h2><p>The Digital Core, Family Core and capstone are shared across each specification.</p></div>{programmes.map((p) => <ProgrammeDetail key={p.id} p={p} />)}</div></section><section className="section" id="later"><div className="wrap"><div className="section-head narrow"><h2>More certificates coming soon.</h2><p>Two intakes a year, January and July. Programmes launch when the instructor, specification and equipment are ready.</p></div><div className="table-scroll"><table><thead><tr><th>Certificate</th><th>Family</th><th>First intake</th></tr></thead><tbody>{catalogue.map(([name, family, intake]) => <tr key={name}><td><strong>{name}</strong></td><td>{family}</td><td className={intake === 'January 2027' ? 'status-open' : 'status-later'}>{intake}</td></tr>)}</tbody></table></div><p className="meta">Data Science and Artificial Intelligence are the only certificates with a prerequisite (or assessed equivalence accepted). Everything else admits on the Institute standard.</p><div className="actions"><Link href="/admissions#apply" className="btn" data-testid="button-programmes-apply">Register interest <ArrowRight size={16} /></Link></div></div></section></PageFrame>;
}

function Facts({ items }: { items: [string, string][] }) {
  return <ul className="rule-list">{items.map(([label, text]) => <li key={`${label}-${text}`}><strong>{label}</strong><span>{text}</span></li>)}</ul>;
}

function AdmissionsPage() {
  return <PageFrame><PageHero title="The entry requirements are deliberately low." image={IMG.admissions}><p>Expressions of interest are open for Web Development, Data Analytics and Graphic Design. The diagnostic assessment, not your school certificate, decides readiness.</p><div className="actions"><a href="#apply" className="btn" data-testid="link-admissions-apply">Register interest <ArrowRight size={16} /></a></div></PageHero>

    <section className="section tinted"><div className="wrap"><div className="section-head narrow"><h2>Who we admit</h2></div><Facts items={[['Academic', 'SSCE or NECO attempted, or a portfolio of prior learning assessed as equivalent. Credits are not required at certificate level.'], ['Age', 'Minimum 16. Applicants aged 16 or 17 need written guardian consent and are covered by our safeguarding policy.'], ['Diagnostic', 'Everyone sits it. It tests reasoning, numeracy and comprehension rather than prior knowledge, including for applicants who have never used a computer.'], ['Equipment', 'You do not need to own a laptop or phone. Device access is part of our access plan, not an entry barrier.'], ['Exceptions', 'Data Science and Artificial Intelligence, opening January 2028, carry a prerequisite (or assessed equivalence) that is not waived.']]} /></div></section>

    <section className="section"><div className="wrap"><div className="section-head narrow"><h2>Six steps to registration.</h2></div><ol className="steps">{[
      'Make an enquiry',
      'Apply on Loop',
      'Eligibility and document screening',
      'Sit the diagnostic assessment',
      'Offer and acceptance',
      'Register',
    ].map((title) => <li key={title}><h3>{title}</h3></li>)}</ol></div></section>

    <section className="section tinted"><div className="wrap grid-2"><div><h2>Selection criteria.</h2><p>If applications exceed places, selection is transparent.</p><Facts items={[['60%', 'Diagnostic assessment'], ['20%', 'Prior academic or work record'], ['10%', 'Motivation statement'], ['10%', 'Portfolio or demonstrated prior work'], ['Reserved seats', 'At least 50% women (40% floor), 30% rural and riverine communities, 5% applicants with a disability, 25% articulation from clubs and partner schools']]} /></div><div><h2>Study modes and fees.</h2><Facts items={[['Full-time', 'Blended. Suits school leavers and full-time students.'], ['Evening and weekend', 'For learners already in work.'], ['Hub cohort', 'For learners outside Port Harcourt, at an approved learning hub.'], ['Distance', 'With residency blocks, for learners with no hub in reach.']]} /><p className="meta">Tuition is priced per credit unit within a band. At least 25% of seats in each intake are funded. A minimum of 75% attendance is required. Programmes require a minimum-viable cohort to run; if a cohort does not form, applicants receive a full refund.</p></div></div></section>

    <section className="section tinted" id="apply"><div className="wrap form-shell"><div><h2>Register your interest.</h2><p>Send your details and Registry will confirm receipt within two working days. Nothing here commits you to anything.</p></div><EnquiryForm /></div></section>
  </PageFrame>;
}

function EnquiryForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(''); setMessage(''); const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '').trim(); const email = String(form.get('email') || '').trim(); const phone = String(form.get('phone') || '').trim();
    if (!name || !email || !phone) { setError('Please add your full name, email and phone number so Registry can reach you.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Please enter a valid email address.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'admissions', name, email, phone, programme: form.get('programme'), mode: form.get('mode'), location: form.get('location') || null, note: form.get('note') || null }) });
      if (!res.ok) throw new Error('Submission failed');
      setMessage('Your details have been sent to Registry. We will confirm receipt within two working days.');
      e.currentTarget.reset();
    } catch { setError('Something went wrong. Please try again or email us directly.'); }
    finally { setSubmitting(false); }
  }
  return <form onSubmit={submit} noValidate data-testid="form-enquiry"><div className="form-grid">
    <div className="field"><label htmlFor="name">Full name *</label><input id="name" name="name" autoComplete="name" data-testid="input-name" /></div>
    <div className="field"><label htmlFor="email">Email *</label><input id="email" name="email" type="email" autoComplete="email" data-testid="input-email" /></div>
    <div className="field"><label htmlFor="phone">Phone or WhatsApp number *</label><input id="phone" name="phone" type="tel" autoComplete="tel" data-testid="input-phone" /></div>
    <div className="field"><label htmlFor="programme">Programme</label><select id="programme" name="programme" data-testid="select-programme">{programmes.map((p) => <option key={p.id}>{p.title}</option>)}<option>Not decided yet</option><option>A programme opening later</option></select></div>
    <div className="field"><label htmlFor="mode">How you would like to study</label><select id="mode" name="mode" data-testid="select-mode"><option>Full-time blended</option><option>Evening and weekend</option><option>Hub cohort outside Port Harcourt</option><option>Distance with residency blocks</option></select></div>
    <div className="field"><label htmlFor="location">Where you live</label><input id="location" name="location" placeholder="Town or community, and state" data-testid="input-location" /></div>
    <div className="field full"><label htmlFor="note">Anything you want us to know</label><textarea id="note" name="note" rows={4} placeholder="Optional. Sponsorship, access needs, prior experience." data-testid="input-note" /></div>
  </div>{error && <p className="form-message error" role="alert" data-testid="status-form-error">{error}</p>}{message && <p className="form-message" role="status" data-testid="status-form-success">{message}</p>}<button className="btn" type="submit" disabled={submitting} data-testid="button-submit-enquiry">{submitting ? 'Sending…' : 'Send my details'} {!submitting && <ArrowRight size={16} />}</button></form>;
}

function DiplomaPage() {
  return <PageFrame><PageHero title="Your certificate credit carries forward." image={IMG.diploma}>The certificate you start in January 2027 is built so every credit can advance into a diploma.</PageHero>

    <section className="section tinted"><div className="wrap narrow"><div className="notice"><h3>Where the diploma stands today</h3><p>Admission is open for Level 1 certificates only. Diploma admission is not open, and we are not taking diploma fees or issuing diploma offers.</p><p>Diploma-awarding status requires institutional recognition from the National Board for Technical Education, which we do not yet hold. Recognition is being sought, is not guaranteed and has no confirmed date.</p><p>Nothing on this page is an offer of a diploma place or a claim of accreditation.</p></div></div></section>

    <section className="section"><div className="wrap"><div className="section-head narrow"><h2>What sits above the certificate.</h2><p>Each level opens only when it can be delivered and awarded properly.</p></div><div className="table-scroll"><table><thead><tr><th>Award</th><th>Length</th><th>Credit units</th><th>Status</th></tr></thead><tbody>{[['Certificate · Level 1', '24 weeks', '30', 'Expressions of interest open, January 2027'], ['Professional Diploma · Level 2', '12 months, evening and weekend', '60', 'In development'], ['Diploma · Level 3', '24 months, four semesters', '120', 'In development, subject to recognition'], ['Advanced Diploma · Level 4', '12 months after a diploma', '60', 'Planned']].map(([a, b, c, d]) => <tr key={a}><td><strong>{a}</strong></td><td>{b}</td><td>{c}</td><td className={d.startsWith('Open') ? 'status-open' : 'status-later'}>{d}</td></tr>)}</tbody></table></div><p className="meta">Planned fields: software engineering, data science and AI, robotics and mechatronics, cybersecurity and network systems, electronics and embedded systems, product design and digital media, digital business and entrepreneurship, and renewable energy technology.</p></div></section>

    <section className="section tinted"><div className="wrap form-shell"><div><h2>Register interest in the diploma pathway.</h2><p>Put your name down and we will write when a diploma opens. We will not use your details for anything else.</p></div><DiplomaForm /></div></section>

    <section className="section"><div className="wrap narrow"><p>In the meantime, the certificate is the way in, and it is a complete qualification on its own. <Link href="/programmes">See the three programmes accepting interest for January 2027.</Link></p></div></section>
  </PageFrame>;
}

function DiplomaForm() {
  const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setError(''); setMessage(''); const f = new FormData(e.currentTarget); const name = String(f.get('dname') || '').trim(); const email = String(f.get('demail') || '').trim(); const phone = String(f.get('dphone') || '').trim(); if (!name || !email || !phone) { setError('Please add your full name, email and phone number so we can reach you.'); return; } if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Please enter a valid email address.'); return; } setSubmitting(true); try { const res = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'diploma', name, email, phone, field: f.get('dfield'), status: f.get('dstatus') }) }); if (!res.ok) throw new Error('Submission failed'); setMessage('You are on the list. We will write when a diploma opens.'); e.currentTarget.reset(); } catch { setError('Something went wrong. Please try again or email us directly.'); } finally { setSubmitting(false); } }
  return <form onSubmit={submit} noValidate data-testid="form-diploma-interest"><div className="form-grid"><div className="field"><label htmlFor="dname">Full name *</label><input id="dname" name="dname" autoComplete="name" data-testid="input-diploma-name" /></div><div className="field"><label htmlFor="demail">Email *</label><input id="demail" name="demail" type="email" autoComplete="email" data-testid="input-diploma-email" /></div><div className="field"><label htmlFor="dphone">Phone or WhatsApp number *</label><input id="dphone" name="dphone" type="tel" autoComplete="tel" data-testid="input-diploma-phone" /></div><div className="field"><label htmlFor="dfield">Field you are interested in</label><select id="dfield" name="dfield" data-testid="select-diploma-field">{['Software engineering', 'Data science and artificial intelligence', 'Robotics and mechatronics', 'Cybersecurity and network systems', 'Electronics and embedded systems', 'Product design and digital media', 'Digital business and entrepreneurship', 'Renewable energy technology', 'Not decided yet'].map((x) => <option key={x}>{x}</option>)}</select></div><div className="field full"><label htmlFor="dstatus">Where you are now</label><select id="dstatus" name="dstatus" data-testid="select-diploma-status"><option>Secondary school student or leaver</option><option>Working, no formal qualification in this field</option><option>Holder of another certificate or diploma</option><option>Studying with us already</option></select></div></div>{error && <p className="form-message error" role="alert">{error}</p>}{message && <p className="form-message" role="status">{message}</p>}<button className="btn" type="submit" disabled={submitting} data-testid="button-submit-diploma">{submitting ? 'Sending…' : 'Add me to the list'} {!submitting && <ArrowRight size={16} />}</button></form>;
}

function AboutPage() {
  return <PageFrame><PageHero title="A qualification with something solid behind it." image={IMG.about}>The Niger Delta Institute of Digital Technology is the teaching institute of Niger Delta Innovate Ltd/Gte, closing the digital skills gap across the Niger Delta.</PageHero>

    <section className="section"><div className="wrap grid-2"><div><h2>From school clubs to real careers.</h2></div><div><p>Niger Delta Innovate runs digital technology teaching in secondary schools, Technovation Clubs in coding, AI and robotics, and RAIL, the Robotics and AI Laboratory at Okrika Grammar School.</p><p>The Institute exists because those students need somewhere to take the next step that ends in a qualification, not just a certificate of attendance.</p></div></div></section>

    <section className="section tinted"><div className="wrap"><div className="section-head narrow"><h2>How we hold the standard.</h2></div><div className="grid-2">{[['Moderated before use', 'An internal moderator approves every assessment before it reaches a student. An external moderator reviews a sample from every intake.'], ['A course file for every course', 'Specifications, materials, mark schemes, moderation approvals, external reports and student voice are held for every intake.'], ['Open about AI, closed where it counts', 'Each assessment states whether AI use is open, assistive or closed. The capstone is defended in person before two assessors.'], ['Nothing advertised before it is ready', 'A programme opens only when its specification is approved, its instructor appointed and its equipment confirmed.']].map(([title, text]) => <div className="contact-tile" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

    <section className="section"><div className="wrap"><div className="section-head narrow"><h2>Governance.</h2><p>The Institute is a unit of Niger Delta Innovate and answers to its Board of Directors.</p></div><Facts items={[['Board of Directors', 'Opening or closing programmes, tuition policy, the Institute budget and certificate authority.'], ['Programmes and Awards Committee', 'Approves specifications, ratifies results, awards certificates and appoints the external moderator.'], ['Registry', 'Applications, admissions, registration, attendance, marks, certificates and transcripts.'], ['Quality Assurance', 'Specifications, course files, lesson observation, student voice, external moderation and regulatory correspondence.'], ['Institute Lead', 'Vacancy. Being recruited. The Board exercises direct oversight until appointment.'], ['Safeguarding', 'A designated Safeguarding Lead. Applicants under 18 are covered from the moment they apply.']]} /></div></section>

    <section className="section tinted"><div className="wrap narrow"><div className="notice"><h3>Recognition, stated plainly</h3><p>Programmes lead to a certificate awarded by Niger Delta Innovate Ltd/Gte. Recognition from the National Board for Technical Education is being sought, is not guaranteed, and has no confirmed date.</p><p>Our curriculum is mapped to the National Skills Qualification framework as a design decision, not a claim of accreditation.</p></div></div></section>
  </PageFrame>;
}

function ContactPage() {
  return <PageFrame><PageHero title="Get in touch." image={IMG.contact}>Enquiries are answered within two working days.</PageHero>

    <section className="section"><div className="wrap grid-3">{[['Prospective students', 'Entry requirements, the diagnostic, fees, sponsorship and access support.', <><a href={`mailto:${contactEmail}`}>{contactEmail}</a><br /><a href="tel:+2348067260598">+234 806 726 0598</a><br /><a href="https://wa.me/2348181958816">WhatsApp +234 818 195 8816</a></>], ['Schools, employers and sponsors', 'Learning hubs, sponsored cohorts, staff training and articulation into the Institute.', <><a href={`mailto:${contactEmail}`}>{contactEmail}</a><br /><a href="tel:+2348067260598">+234 806 726 0598</a></>], ['Safeguarding and complaints', 'Concerns about conduct or student safety go straight to the Safeguarding Lead.', <><a href="mailto:info@nigerdeltainnovate.org">info@nigerdeltainnovate.org</a><br /><a href="tel:+2348067260598">+234 806 726 0598</a></>]].map(([title, text, details]) => <div className="contact-tile" key={String(title)}><h3>{title}</h3><p>{text}</p><p>{details}</p></div>)}</div></section>

    <section className="section tinted"><div className="wrap grid-2"><div><h2>Port Harcourt is home base.</h2><p>Practical teaching in robotics and hardware takes place at RAIL, Okrika Grammar School. Learners outside Port Harcourt study through an approved hub or by distance.</p><div className="actions"><a href="https://wa.me/2348181958816" className="btn" data-testid="link-contact-whatsapp"><MessageCircle size={16} /> Message on WhatsApp</a><a href={`mailto:${contactEmail}`} className="btn btn-secondary" data-testid="link-contact-email">Email Registry <ExternalLink size={15} /></a></div></div><div><Facts items={[['Legal name', 'Niger Delta Innovate Ltd/Gte'], ['Registration', 'RC 9645329, a company limited by guarantee under the Companies and Allied Matters Act 2020'], ['Registered office', 'Plot 100 Avuha Estate, Eneka, Port Harcourt, Rivers State, Nigeria'], ['Website', 'nigerdeltainnovate.org']]} /></div></div></section>
  </PageFrame>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={HomePage} /><Route path="/programmes" component={ProgrammesPage} /><Route path="/admissions" component={AdmissionsPage} /><Route path="/diploma" component={DiplomaPage} /><Route path="/about" component={AboutPage} /><Route path="/contact" component={ContactPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
