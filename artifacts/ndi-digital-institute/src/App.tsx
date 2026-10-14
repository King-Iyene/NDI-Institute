import { useEffect, useState, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowRight, ChevronRight, Code2, Database,
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

const programmes = [
  { id: 'web', title: 'Web Development', family: 'Software and Build', code: 'WEB', icon: Code2, summary: 'Build, deploy and maintain a working website or web application to a client brief.', lead: 'Junior front end developer, web developer, WordPress and site maintenance, in-house developer for an SME.', outcomes: ['Ship a live site to a client brief, hosted and maintained', 'HTML, CSS, JavaScript, Git and deployment', 'A public GitHub profile with commits an employer can read'], courses: [['WEB 121 · Front-End Development', 'Semantic HTML, CSS layout with flexbox and grid, responsive and mobile-first design, accessibility basics and building from a supplied design.'], ['WEB 122 · JavaScript and Interactive Interfaces', 'JavaScript in the browser, the DOM, events, forms and validation, asynchronous requests, public APIs and an introduction to a component framework.'], ['WEB 123 · Backend, Databases, APIs and Deployment', 'A server-side runtime, routing, relational databases, SQL basics, building a small API, environment configuration, domains and HTTPS.']], where: 'Agencies and startups in Port Harcourt, Lagos and Abuja, banks and energy service firms, plus contract work on Upwork, Toptal and Contra.' },
  { id: 'data', title: 'Data Analytics', family: 'Data and Artificial Intelligence', code: 'DAN', icon: Database, summary: 'Take a real dataset, clean it, interrogate it and give a decision-maker an answer they can act on.', lead: 'Data analyst, business analyst, monitoring and evaluation officer, reporting officer in government, NGOs, health, energy or finance.', outcomes: ['Clean a real dataset and document every change', 'SQL, dashboards and statistics for decision makers', 'A findings note a manager can act on without a briefing'], courses: [['DAN 121 · SQL and Relational Databases', 'Relational structure, filtering, joins, grouping and aggregation, subqueries and readable queries against a realistic multi-table database.'], ['DAN 122 · Dashboards and Business Intelligence', 'Connecting to sources, modelling for reporting, chart selection, dashboard layout, filters, publishing and maintaining a live report.'], ['DAN 123 · Statistics for Decision Making', 'Distributions, summary statistics, variability, uncertainty, comparison, correlation, sampling and writing a findings note for a decision-maker.']], where: 'NDDC and state agencies, donor-funded M&E teams, oil and gas services, banks, and remote analyst contracts for firms outside Nigeria.' },
  { id: 'design', title: 'Graphic Design', family: 'Design', code: 'GRD', icon: PenTool, summary: 'Take a client brief and deliver finished, production-ready visual work across identity, print and digital.', lead: 'Junior designer, brand and identity designer, print and production artist, social and content designer, independent studio of one.', outcomes: ['Take a client brief to finished, production-ready files', 'Identity, print and digital across the same system', 'A portfolio of six pieces, each with the brief behind it'], courses: [['GRD 121 · Identity and Brand Systems', 'Visual identity, marks, colour systems, type pairing, brand rules and making a coherent family of applications.'], ['GRD 122 · Layout and Print Production', 'Composition, editorial and campaign layout, files for production, print processes, colour modes and quality checks.'], ['GRD 123 · Digital and Social Formats', 'Designing for screens, accessible contrast, responsive content, social formats, motion in outline and delivery to a content team.']], where: 'Agencies, churches, schools and SMEs across Rivers State, plus retainer work on Fiverr, Upwork and direct client referral.' },
];

const catalogue = [
  ...programmes.map((p) => [p.title, p.family, 'January 2027']),
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
  return <>
    <div className="top-strip"><div className="wrap top-strip-inner"><span>January 2027 intake · applications open for three certificates</span><a href="mailto:info@nigerdeltainnovate.org">Registry replies within two working days</a></div></div>
    <header className="site-header">
      <div className="wrap header-inner">
         <Link href="/" className="wordmark" data-testid="link-home"><LogoMark /></Link>
        <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} data-testid="button-menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main navigation">
          {links.map(([href, label]) => <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}
          <Link href="/admissions#apply" className="btn nav-apply" data-testid="link-start-application">Start an application <ArrowRight size={15} /></Link>
        </nav>
      </div>
    </header>
  </>;
}

function Footer() {
  return <footer className="footer"><div className="wrap">
    <div className="footer-grid">
      <div><img className="footer-logo" src={ndiFooterLogo} alt="Niger Delta Innovate" /><h3>Niger Delta Institute of Digital Technology</h3><p>An institute of Niger Delta Innovate Ltd/Gte, closing the digital skills gap across the Niger Delta.</p></div>
      <div><h4>Study</h4><ul><li><Link href="/programmes">Programmes</Link></li><li><Link href="/admissions">Admissions</Link></li><li><Link href="/diploma">Diploma pathway</Link></li><li><Link href="/admissions#apply">Start an application</Link></li></ul></div>
      <div><h4>Reach Registry</h4><ul><li><a href="mailto:info@nigerdeltainnovate.org">info@nigerdeltainnovate.org</a></li><li><a href="tel:+2348067260598">+234 806 726 0598</a></li><li><a href="https://wa.me/2348181958816">WhatsApp +234 818 195 8816</a></li><li>Plot 100 Avuha Estate, Eneka, Port Harcourt, Rivers State</li></ul></div>
    </div>
    <div className="colophon"><p>Niger Delta Innovate Ltd/Gte · RC 9645329 · A Company Limited by Guarantee · Port Harcourt, Rivers State</p><p>Awards are certificates of Niger Delta Innovate. Recognition from the National Board for Technical Education is being sought and is not in place.</p></div>
  </div></footer>;
}

function PageFrame({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location]);
  return <div className="site-shell"><SiteHeader /><main className="fade-in">{children}</main><Footer /></div>;
}

function HomePage() {
  return <PageFrame>
    {/* Hero */}
    <section className="hero"><div className="wrap">
      <p className="eyebrow">Port Harcourt, Rivers State</p>
      <h1>Learn a digital trade <em>well enough to be paid for it.</em></h1>
      <p className="lede">Twenty four weeks to a working skill, a portfolio you built for a real brief, and a route to paid work in Port Harcourt or for clients anywhere. You do not need a laptop of your own, prior experience, or credits in your school certificate to start.</p>
      <div className="actions">
        <Link href="/admissions#apply" className="btn" data-testid="button-hero-apply">Register your interest <ArrowRight size={16} /></Link>
        <Link href="#programmes" className="btn btn-secondary" data-testid="button-hero-programmes">See the three programmes</Link>
      </div>
      <p className="meta" style={{ marginTop: '1rem' }}>Takes two minutes. Registry replies within two working days. Nothing commits you to anything.</p>
    </div>
    <div className="wrap"><div className="stat-band">
      <div className="stat"><strong>24</strong><span>weeks, start to capstone</span></div>
      <div className="stat"><strong>900</strong><span>hours of taught practice</span></div>
      <div className="stat"><strong>30</strong><span>credit units per certificate</span></div>
      <div className="stat"><strong>3</strong><span>programmes open now</span></div>
    </div></div></section>

    {/* Three programmes */}
    <section className="section tinted" id="programmes"><div className="wrap">
      <div className="section-head"><h2>Three programmes. Three places they take you.</h2><p>We name the jobs, the pay and the places the work is bought. Each programme is 30 credit units over 24 weeks.</p></div>
      <div className="grid-3">{programmes.map((p) => {
        const Icon = p.icon;
        return <div className="contact-tile" key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <p className="eyebrow"><Icon size={14} /> {p.code} · 30 credit units</p>
          <h3>{'Certificate in ' + p.title}</h3>
          <p style={{ fontSize: '.92rem', color: 'hsl(var(--muted-foreground))' }}>{p.lead}</p>
          <p style={{ fontSize: '.9rem' }}><strong>Where the work is.</strong> {(p as any).where}</p>
          <ul style={{ paddingLeft: '1.1rem', fontSize: '.92rem', color: 'hsl(var(--muted-foreground))' }}>{p.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
          <Link href={`/programmes#${p.id}`} className="arrow-link" style={{ marginTop: 'auto' }}>Full specification <ChevronRight size={14} /></Link>
        </div>;
      })}</div>
    </div></section>

    {/* Remote work */}
    <section className="section dark-section" id="remote"><div className="wrap">
      <div className="section-head"><p className="eyebrow">Earning from here</p><h2>You can be paid in dollars from Port Harcourt. Here is what that actually takes.</h2><p>Remote and freelance work is the reason most people enrol. We will not pretend it is automatic, so we teach the parts most courses leave out.</p></div>
      <div className="grid-3">
        <div><h3>What we teach you to do</h3><ul style={{ paddingLeft: '1.1rem', fontSize: '.92rem' }}><li>Build a portfolio that shows the brief, not just the picture</li><li>Write a profile and proposals that win a first contract</li><li>Price work, scope it and say no to bad briefs</li><li>Run a client call, agree a deadline and meet it</li><li>Get paid across borders and keep clean records</li></ul></div>
        <div><h3>What it realistically takes</h3><ul style={{ paddingLeft: '1.1rem', fontSize: '.92rem' }}><li>Three to nine months after finishing before steady income</li><li>Reliable power and data, which we help you plan for</li><li>English you can hold a client call in</li><li>Ten to twenty unpaid proposals before the first yes</li><li>Patience through a first contract that pays below the range</li></ul></div>
        <div><h3>What we do not promise</h3><ul style={{ paddingLeft: '1.1rem', fontSize: '.92rem' }}><li>A job on graduation. We open doors, you walk through them</li><li>A salary figure. The ranges here are the market, not a guarantee</li><li>A visa, a relocation or an overseas placement</li><li>That twenty four weeks makes you senior. It makes you employable</li></ul></div>
      </div>
    </div></section>

    {/* What you leave with */}
    <section className="section tinted" id="support"><div className="wrap">
      <div className="section-head"><h2>What you leave with.</h2><p>A certificate is paper. These are the things that get you hired, and every one of them is built into the twenty four weeks.</p></div>
      <div className="grid-3">{[
        ['01', 'A defended capstone', 'A partner brief or community need becomes your deadline. You produce the work and defend it in person before two assessors.'],
        ['02', 'A portfolio with the thinking in it', 'Six pieces of real work, each written up with the brief, the constraint and what you would change. Hosted, public, yours.'],
        ['03', 'A CV and a live profile', 'GitHub, Behance or a dashboard gallery, set up and reviewed. LinkedIn and Upwork profiles written with you, not for you.'],
        ['04', 'Interview and client practice', 'Mock technical interviews and mock client calls, recorded and reviewed, so the first real one is not your first one.'],
        ['05', 'Introductions we actually have', 'Named partner employers, our own project pipeline, and a referral list we keep current.'],
        ['06', 'Twelve months of alumni support', 'Portfolio reviews, a job and brief board, and a cohort group that does not close when the programme does.'],
      ].map(([n, title, text]) => <div className="contact-tile" key={n}><p className="eyebrow" style={{ fontSize: '.7rem' }}>{n}</p><h3>{title}</h3><p style={{ fontSize: '.92rem', color: 'hsl(var(--muted-foreground))' }}>{text}</p></div>)}</div>
    </div></section>

    {/* Career switchers */}
    <section className="section"><div className="wrap split-feature">
      <div>
        <p className="eyebrow">For people already working</p>
        <h2>Switch careers without leaving your job.</h2>
        <p>The evening and weekend mode is built for people with salaries, rent and children. Two evenings and one Saturday morning a week, plus about six hours of your own time. Twenty four weeks from the first class to defending your capstone.</p>
        <p style={{ marginTop: '1rem' }}>If you are outside Port Harcourt, a hub cohort or distance study with residency blocks does the same work. Device access is part of our access plan, not an entry barrier.</p>
        <div className="actions"><Link href="/admissions" className="btn btn-secondary">Compare the four study modes</Link></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ aspectRatio: '4/3', border: '1px dashed hsl(var(--border))', background: 'hsl(var(--card))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.2rem', gap: '.3rem' }}>
          <p className="eyebrow" style={{ fontSize: '.65rem' }}>Photograph</p>
          <p style={{ fontSize: '.88rem', color: 'hsl(var(--muted-foreground))' }}>An evening class in session. Adult learners, laptops open, instructor mid-explanation.</p>
        </div>
      </div>
    </div></section>

    {/* Scholarships */}
    <section className="section" id="scholarships" style={{ background: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}><div className="wrap">
      <p className="eyebrow" style={{ color: 'hsl(var(--accent-foreground))', opacity: .7 }}>Scholarships</p>
      <h2 style={{ maxWidth: '18ch' }}>Most people pay less than the published fee.</h2>
      <p className="lede" style={{ color: 'hsl(var(--accent-foreground))', opacity: .82 }}>Fees should not decide who gets to learn this. Scholarships here are discounts off tuition, applied at registration against criteria we publish. You do not write an essay or wait for a decision panel. If you qualify, it comes off the invoice.</p>
      <div className="grid-3" style={{ marginTop: '2rem' }}>{[
        ['Early registration', 'Register and pay your first instalment before the published cut-off for the intake.'],
        ['Pay in full', 'Settle the full thirty units upfront instead of by instalment.'],
        ['Women in technology', 'Open to every woman admitted, on every programme and every study mode.'],
        ['Rural and riverine', 'For applicants whose home community is outside the Port Harcourt urban area.'],
        ['Partner school or club', 'Articulating from a Technovation club, a partner school or a partner organisation.'],
        ['Bring two, or come back', 'Refer two people who register, or return for a second certificate as an alumnus.'],
      ].map(([title, text]) => <div key={title} style={{ borderTop: '1px solid rgba(255,255,255,.2)', paddingTop: '1rem' }}><h3 style={{ fontSize: '1rem' }}>{title}</h3><p style={{ fontSize: '.9rem', opacity: .86 }}>{text}</p></div>)}</div>
      <p style={{ marginTop: '1.5rem', fontSize: '.92rem', opacity: .82, maxWidth: '60ch' }}>Discounts do not stack. You receive the largest one you qualify for, stated on your offer letter before you pay anything.</p>
      <div className="actions"><Link href="/admissions#apply" className="btn" style={{ background: 'hsl(var(--accent-foreground))', color: 'hsl(var(--accent))', borderColor: 'hsl(var(--accent-foreground))' }}>Check which discount you qualify for <ArrowRight size={16} /></Link></div>
    </div></section>

    {/* Admissions */}
    <section className="section tinted" id="admissions"><div className="wrap">
      <div className="section-head"><h2>Getting in is deliberately possible.</h2><p>The diagnostic assessment decides readiness, not your school certificate. It tests reasoning, numeracy and comprehension, including for applicants who have never used a computer.</p></div>
      <div className="grid-3" style={{ gap: '1px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--border))' }}>{[
        ['01', 'Make an enquiry'], ['02', 'Apply on Loop'], ['03', 'Document screening'],
        ['04', 'Sit the diagnostic'], ['05', 'Offer and acceptance'], ['06', 'Register'],
      ].map(([n, title]) => <div key={n} style={{ background: 'hsl(var(--background))', padding: '1.2rem' }}><p style={{ color: 'hsl(var(--accent))', fontFamily: 'var(--app-font-sans)', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em' }}>{n}</p><h3 style={{ fontSize: '1rem', marginTop: '.5rem' }}>{title}</h3></div>)}</div>
      <h3 style={{ marginTop: '3rem' }}>If applications exceed places, this is exactly how we choose.</h3>
      <ul className="rule-list" style={{ maxWidth: '640px', marginTop: '1rem' }}>
        <li><strong>60%</strong><span>Diagnostic assessment</span></li>
        <li><strong>20%</strong><span>Academic or work record</span></li>
        <li><strong>10%</strong><span>Motivation statement</span></li>
        <li><strong>10%</strong><span>Portfolio or prior work</span></li>
      </ul>
    </div></section>

    {/* FAQ */}
    <section className="section" id="faq"><div className="wrap">
      <div className="section-head"><h2>Questions people actually ask.</h2><p>If yours is not here, ask Registry. We answer within two working days.</p></div>
      <div style={{ borderTop: '1px solid hsl(var(--border))' }}>{[
        ['I have never used a computer. Can I still apply?', 'Yes. The diagnostic assessment tests reasoning, numeracy and comprehension rather than prior knowledge, and it is designed for applicants who have never used a computer. The Digital Core block at the start of every programme assumes nothing.'],
        ['I do not own a laptop.', 'You do not need one to start. Device access is part of our access plan, not an entry barrier. Tell us your situation on the interest form and Registry will set out what is available in your study mode.'],
        ['I failed or did not sit my SSCE.', 'Credits are not required at certificate level. SSCE or NECO attempted is enough, and a portfolio of prior learning assessed as equivalent also qualifies. The diagnostic decides readiness.'],
        ['Will I get a job at the end?', 'We do not promise one, and you should be wary of any school that does. What we commit to is a defended capstone, a public portfolio, interview and client practice, introductions to the employers and partners we actually have, and twelve months of alumni support after you finish.'],
        ['How much does it cost, and can I pay in instalments?', 'Tuition is priced per credit unit within a band, shown by study mode in the admissions section, and is payable in instalments. Most applicants qualify for a scholarship discount, applied to the invoice at registration.'],
        ['How do the scholarship discounts work?', 'They are discounts off tuition, not a separate fund you apply to. Tell Registry your situation on the interest form, and your offer letter states the discount you qualify for and the amount you will actually pay, before you part with any money. Discounts do not stack, so you receive the largest one you are eligible for.'],
        ['Is the certificate recognised?', 'Programmes lead to a certificate awarded by Niger Delta Innovate Ltd/Gte. Recognition from the National Board for Technical Education is being sought. It is not guaranteed and has no confirmed date, and we will not tell you otherwise.'],
        ['I live outside Port Harcourt.', 'Hub cohorts run at approved learning hubs, and distance study with residency blocks covers learners with no hub in reach. Thirty per cent of seats are reserved for rural and riverine communities.'],
        ['What if the cohort does not fill?', 'Programmes require a minimum viable cohort to run. If one does not form, applicants receive a full refund. No programme opens without an appointed instructor, an approved specification and confirmed equipment.'],
      ].map(([q, a]) => <details key={q} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
        <summary style={{ cursor: 'pointer', padding: '1.1rem 2.5rem 1.1rem 0', position: 'relative', fontFamily: 'var(--app-font-sans)', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', fontWeight: 600, listStyle: 'none' }}>{q}</summary>
        <p style={{ padding: '0 0 1.3rem', color: 'hsl(var(--muted-foreground))', maxWidth: '68ch' }}>{a}</p>
      </details>)}</div>
    </div></section>

    {/* Trust block */}
    <section className="section tinted"><div className="wrap"><div className="notice">
      <p className="eyebrow" style={{ fontSize: '.65rem' }}>The award</p>
      <h3 style={{ marginTop: '.6rem' }}>Serious about the work. Plain about the award.</h3>
      <p>Programmes lead to a certificate awarded by Niger Delta Innovate Ltd/Gte. Recognition from the National Board for Technical Education is being sought, is not guaranteed, and has no confirmed date. We would rather you read that here than find it out later. What stands behind the certificate is the specification, the external assessors, the practical components you must pass on their own, and the capstone you defend in person.</p>
      <div className="actions"><Link href="/about" className="btn btn-secondary">How we hold the standard <ArrowRight size={16} /></Link><Link href="/diploma" className="arrow-link" data-testid="link-home-diploma">The diploma pathway <ChevronRight size={15} /></Link></div>
    </div></div></section>

    {/* Close / CTA */}
    <section className="section" id="register"><div className="wrap">
      <h2 style={{ maxWidth: '15ch' }}>Twenty four weeks from now, you could be getting paid for this.</h2>
      <p className="lede">Send your details and Registry will confirm receipt within two working days. Nothing here commits you to anything.</p>
      <div className="actions">
        <Link href="/admissions#apply" className="btn">Register your interest <ArrowRight size={16} /></Link>
        <a href="https://wa.me/2348181958816" className="btn btn-secondary">Talk to Registry on WhatsApp</a>
      </div>
    </div></section>
  </PageFrame>;
}

function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="page-hero"><div className="wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><div className="lede">{children}</div></div></section>;
}

function ProgrammeDetail({ p }: { p: typeof programmes[number] }) {
  const Icon = p.icon;
  return <article className="detail" id={p.id}><div className="detail-head"><div><p className="eyebrow"><Icon size={16} /> {p.code} · Open January 2027</p><h2>Certificate in {p.title}</h2></div><span className="detail-meta">{p.family} · 30 credit units · 24 weeks</span></div><div className="grid-2"><div><p><strong>What it is for.</strong> {p.summary}</p><p><strong>Where it leads.</strong> {p.lead}</p><p><strong>Entry.</strong> Institute standard. No prior qualification in the field is required.</p><h3>By the end you can</h3><ol className="outcomes">{p.outcomes.map((o) => <li key={o}>{o}</li>)}</ol></div><div><h3>Specialist block · 12 credit units</h3><ul className="course-list">{p.courses.map(([name, desc]) => <li key={name}><b>{name}</b><span>{desc}</span></li>)}</ul><p className="meta"><strong>Assessment.</strong> Continuous work, practical build assessments and examination, plus the capstone. Practical components must be passed on their own.</p></div></div></article>;
}

function ProgrammesPage() {
  return <PageFrame><PageHero eyebrow="Programmes · 14 certificates in the catalogue" title="Learn by making something that has to work.">Three certificates are open for January 2027. Every one is a Level 1 award, complete from a standing start, with practical assessment and an in-person capstone defence.</PageHero><section className="section tinted"><div className="wrap"><div className="section-head narrow"><h2>Open for January 2027</h2><p>The Digital Core, Family Core and capstone are shared across each published specification.</p></div>{programmes.map((p) => <ProgrammeDetail key={p.id} p={p} />)}</div></section><section className="section" id="later"><div className="wrap"><div className="section-head narrow"><p className="eyebrow">The full catalogue</p><h2>Fourteen certificates, opening in three groups.</h2><p>We take two intakes a year, in January and July. Programmes launch when the instructor, specification and equipment are ready, not all at once.</p></div><div className="table-scroll"><table><thead><tr><th>Certificate</th><th>Family</th><th>First intake</th></tr></thead><tbody>{catalogue.map(([name, family, intake]) => <tr key={name}><td><strong>{name}</strong></td><td>{family}</td><td className={intake === 'January 2027' ? 'status-open' : 'status-later'}>{intake}</td></tr>)}</tbody></table></div><p className="meta">Data Science and Artificial Intelligence are the only certificates with a prerequisite. Everything else admits on the Institute standard.</p><div className="actions"><Link href="/admissions#apply" className="btn" data-testid="button-programmes-apply">Start an application <ArrowRight size={16} /></Link></div></div></section></PageFrame>;
}

function Facts({ items }: { items: [string, string][] }) {
  return <ul className="rule-list">{items.map(([label, text]) => <li key={`${label}-${text}`}><strong>{label}</strong><span>{text}</span></li>)}</ul>;
}

function AdmissionsPage() {
  return <PageFrame><PageHero eyebrow="Admissions · January 2027" title="The entry requirements are deliberately low."><p>Applications are open for Web Development, Data Analytics and Graphic Design. The diagnostic assessment, not your school certificate, decides whether you can do the work.</p><div className="actions"><a href="#apply" className="btn" data-testid="link-admissions-apply">Start an application <ArrowRight size={16} /></a></div></PageHero><section className="section tinted"><div className="wrap"><div className="section-head narrow"><p className="eyebrow">Start from where you are</p><h2>Who we admit</h2></div><Facts items={[['Academic', 'SSCE or NECO attempted, or a portfolio of prior learning assessed as equivalent. Credits are not required at certificate level.'], ['Age', 'Minimum 16. Applicants aged 16 or 17 need written guardian consent and are covered by our safeguarding policy.'], ['Diagnostic', 'Everyone sits it. It tests reasoning, numeracy and comprehension rather than prior knowledge, including for applicants who have never used a computer.'], ['Equipment', 'You do not need to own a laptop or phone. Device access is part of our access plan, not an entry barrier.'], ['Exceptions', 'Data Science and Artificial Intelligence, opening January 2028, carry a prerequisite that is not waived.']]} /></div></section><section className="section"><div className="wrap"><div className="section-head narrow"><p className="eyebrow">A transparent route</p><h2>Six steps to registration.</h2></div><ol className="steps">{[['Make an enquiry', 'By the form below, by email or on WhatsApp. We respond within two working days.'], ['Apply on Loop', 'The full application is completed on Loop, our learning platform, and stays open until the published closing date.'], ['Eligibility and document screening', 'Registry checks your documents and confirms your route in five working days.'], ['Sit the diagnostic assessment', 'Scheduled fortnightly, online or at a hub near you. There is nothing to revise.'], ['Offer and acceptance', 'An offer follows within five working days of the diagnostic. You have fourteen days to accept, with recognition language stated plainly.'], ['Register', 'Receive your student number and Loop account, then start with the Digital Core alongside every other student.']].map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol></div></section><section className="section tinted"><div className="wrap grid-2"><div><p className="eyebrow">Five ways in</p><h2>Choose the route that describes you.</h2><p>Every applicant enters through exactly one route, recorded on your file.</p><div className="table-scroll"><table><thead><tr><th>Route</th><th>Selected on</th></tr></thead><tbody>{[['Direct', 'Application and diagnostic assessment'], ['Articulation', 'School or club record plus diagnostic, against a reserved quota'], ['Sponsored', "Sponsor's criteria plus our academic minimum"], ['Employer', 'Employer nomination plus diagnostic'], ['Prior learning', 'Portfolio, skills test and interview']].map(([a, b]) => <tr key={a}><td><strong>{a}</strong></td><td>{b}</td></tr>)}</tbody></table></div></div><div><p className="eyebrow">If applications exceed places</p><h2>Selection is visible.</h2><Facts items={[['60%', 'Diagnostic assessment'], ['20%', 'Prior academic or work record'], ['10%', 'Motivation statement'], ['10%', 'Portfolio or demonstrated prior work'], ['Reserved seats', 'Women, rural and riverine communities, applicants with a disability, and articulation from clubs and partner schools']]} /></div></div></section><section className="section"><div className="wrap grid-2"><div><p className="eyebrow">Study modes</p><h2>Fit learning around the life you already have.</h2><Facts items={[['Full-time', 'Blended. Suits school leavers and full-time students.'], ['Evening and weekend', 'For learners already in work.'], ['Hub cohort', 'For learners outside Port Harcourt, at an approved learning hub.'], ['Distance', 'With residency blocks, for learners with no hub in reach.']]} /></div><div><p className="eyebrow">Fee bands</p><h2>Clear bands, not a mystery invoice.</h2><p>Tuition is priced per credit unit within a band. The Board publishes the fee schedule, payment plans and scholarship terms before applications close.</p><Facts items={[['Band 1', 'Studio and classroom: Web Development, Data Analytics, Graphic Design and most design and business programmes.'], ['Band 2', 'Laboratory: Systems Administration and Cybersecurity.'], ['Band 3', 'Heavy laboratory: Computer Hardware and Networks, Robotics and Automated Systems, and Mobile Device and GSM Repairs.']]} /></div></div></section><section className="section tinted" id="apply"><div className="wrap form-shell"><div><p className="eyebrow">Registry enquiry</p><h2>Start an application.</h2><p>Send your details and Registry will return the application link and next diagnostic date within two working days. Nothing here commits you to anything.</p></div><EnquiryForm /></div></section><section className="section"><div className="wrap narrow"><div className="notice"><h3>What your offer will say about recognition</h3><p>The award is a certificate of Niger Delta Innovate Ltd/Gte. Recognition from the National Board for Technical Education is being sought. Recognition is not guaranteed and no date can be given.</p><p>Our curriculum is mapped to the National Skills Qualification framework. That mapping is a design decision, not a claim of accreditation.</p></div></div></section></PageFrame>;
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
      setMessage('Your details have been sent to Registry. We will reply within two working days.');
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
  return <PageFrame><PageHero eyebrow="The diploma pathway" title="Build your first qualification without closing the door above it.">Diploma study is where this Institute is going. The certificate you start in January 2027 is built so every credit you earn can carry forward intact.</PageHero><section className="section tinted"><div className="wrap narrow"><div className="notice"><h3>Where the diploma stands today</h3><p>Admission is open for Level 1 certificates only. Diploma admission is not open, and we are not taking diploma fees or issuing diploma offers.</p><p>Diploma-awarding status in Nigeria sits with the National Board for Technical Education and requires institutional recognition we do not yet hold. Recognition is being sought, is not guaranteed and has no date we can give.</p><p>Nothing on this page is an offer of a diploma place or a claim that any programme is accredited or government-approved.</p></div></div></section><section className="section"><div className="wrap"><div className="section-head narrow"><p className="eyebrow">A pathway, not a promise</p><h2>Why your certificate credit is safe.</h2></div><div className="grid-3">{[['One credit unit, one definition', 'A credit unit is thirty notional learner hours everywhere in the Institute. A certificate is 30 units. A planned diploma is 120.'], ['Written as outcomes first', 'Every course states what a graduate can do before it states what is taught. Credits are designed to travel with those outcomes.'], ['Evidence kept from day one', "Registry holds marks, moderation trails and external moderator reports for every intake. Records are kept to the standard a diploma-awarding body expects."]].map(([title, text]) => <div className="contact-tile" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></div></section><section className="section tinted"><div className="wrap"><div className="section-head narrow"><p className="eyebrow">The award ladder</p><h2>What sits above the certificate.</h2><p>Each level opens only when it can be delivered and awarded properly.</p></div><div className="table-scroll"><table><thead><tr><th>Award</th><th>Length</th><th>Credit units</th><th>Status</th></tr></thead><tbody>{[['Certificate · Level 1', '24 weeks', '30', 'Open, January 2027'], ['Professional Diploma · Level 2', '12 months, evening and weekend', '60', 'In development'], ['Diploma · Level 3', '24 months, four semesters', '120', 'In development, subject to recognition'], ['Advanced Diploma · Level 4', '12 months after a diploma', '60', 'Planned']].map(([a, b, c, d]) => <tr key={a}><td><strong>{a}</strong></td><td>{b}</td><td>{c}</td><td className={d.startsWith('Open') ? 'status-open' : 'status-later'}>{d}</td></tr>)}</tbody></table></div><p className="meta">Planned fields follow our existing strengths: software engineering, data science and artificial intelligence, robotics and mechatronics, cybersecurity and network systems, electronics and embedded systems, product design and digital media, digital business and entrepreneurship, and renewable energy technology. The field list and opening date are not settled.</p></div></section><section className="section"><div className="wrap form-shell"><div><p className="eyebrow">Stay in the loop</p><h2>Register interest in the diploma pathway.</h2><p>Put your name down and we will write when a diploma opens, with the entry requirements, fee and advanced standing your certificate carries. We will not use your details for anything else.</p></div><DiplomaForm /></div></section><section className="section tinted"><div className="wrap narrow"><p>In the meantime, the certificate is the way in, and it is a complete qualification on its own. <Link href="/programmes">See the three programmes open for January 2027.</Link></p></div></section></PageFrame>;
}

function DiplomaForm() {
  const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setError(''); setMessage(''); const f = new FormData(e.currentTarget); const name = String(f.get('dname') || '').trim(); const email = String(f.get('demail') || '').trim(); const phone = String(f.get('dphone') || '').trim(); if (!name || !email || !phone) { setError('Please add your full name, email and phone number so we can reach you.'); return; } if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Please enter a valid email address.'); return; } setSubmitting(true); try { const res = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'diploma', name, email, phone, field: f.get('dfield'), status: f.get('dstatus') }) }); if (!res.ok) throw new Error('Submission failed'); setMessage('You are on the list. We will write when a diploma opens.'); e.currentTarget.reset(); } catch { setError('Something went wrong. Please try again or email us directly.'); } finally { setSubmitting(false); } }
  return <form onSubmit={submit} noValidate data-testid="form-diploma-interest"><div className="form-grid"><div className="field"><label htmlFor="dname">Full name *</label><input id="dname" name="dname" autoComplete="name" data-testid="input-diploma-name" /></div><div className="field"><label htmlFor="demail">Email *</label><input id="demail" name="demail" type="email" autoComplete="email" data-testid="input-diploma-email" /></div><div className="field"><label htmlFor="dphone">Phone or WhatsApp number *</label><input id="dphone" name="dphone" type="tel" autoComplete="tel" data-testid="input-diploma-phone" /></div><div className="field"><label htmlFor="dfield">Field you are interested in</label><select id="dfield" name="dfield" data-testid="select-diploma-field">{['Software engineering', 'Data science and artificial intelligence', 'Robotics and mechatronics', 'Cybersecurity and network systems', 'Electronics and embedded systems', 'Product design and digital media', 'Digital business and entrepreneurship', 'Renewable energy technology', 'Not decided yet'].map((x) => <option key={x}>{x}</option>)}</select></div><div className="field full"><label htmlFor="dstatus">Where you are now</label><select id="dstatus" name="dstatus" data-testid="select-diploma-status"><option>Secondary school student or leaver</option><option>Working, no formal qualification in this field</option><option>Holder of another certificate or diploma</option><option>Studying with us already</option></select></div></div>{error && <p className="form-message error" role="alert">{error}</p>}{message && <p className="form-message" role="status">{message}</p>}<button className="btn" type="submit" disabled={submitting} data-testid="button-submit-diploma">{submitting ? 'Sending…' : 'Add me to the list'} {!submitting && <ArrowRight size={16} />}</button></form>;
}

function AboutPage() {
  return <PageFrame><PageHero eyebrow="About the Institute" title="A qualification should have something solid behind it.">The Niger Delta Institute of Digital Technology is the awarding arm of Niger Delta Innovate Ltd/Gte, a company limited by guarantee working to close the digital skills gap across the Niger Delta.</PageHero><section className="section"><div className="wrap grid-2"><div><p className="eyebrow">Why we exist</p><h2>From school clubs to work that carries a name.</h2></div><div><p>Niger Delta Innovate runs digital technology teaching in secondary schools against the national curriculum, Technovation Clubs in coding, artificial intelligence and robotics, and RAIL, the Robotics and Artificial Intelligence Laboratory at Okrika Grammar School.</p><p>The Institute exists because those students, and the adults who watched them, need somewhere to take the next step that ends in a qualification rather than a certificate of attendance.</p></div></div></section><section className="section tinted"><div className="wrap"><div className="section-head narrow"><p className="eyebrow">Quality is a practice</p><h2>How we hold the standard.</h2></div><div className="grid-2">{[['Moderated before use', 'An internal moderator approves every assessment instrument before it reaches a student. An external moderator reviews a sample from every intake, including every fail and every distinction.'], ['A course file for every course', 'Specifications, teaching materials, mark schemes, moderation approvals, mark sheets, external reports, committee minutes and student voice are held for every intake.'], ['Open about AI, closed where it counts', 'Each assessment says whether AI use is open, assistive or closed. The capstone is defended in person before two assessors.'], ['Nothing advertised before it is ready', 'A programme opens only when its specification is approved, its instructor appointed with a complete qualification file and its equipment confirmed in place.']].map(([title, text]) => <div className="contact-tile" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></div></section><section className="section"><div className="wrap"><div className="section-head narrow"><p className="eyebrow">Governance</p><h2>Clear lines of responsibility.</h2><p>The Institute is a unit of Niger Delta Innovate and answers to its Board of Directors.</p></div><Facts items={[['Board of Directors', 'Opening or closing programmes, tuition and scholarship policy, the Institute budget and the authority under which certificates are executed.'], ['Programmes and Awards Committee', 'Approves specifications and assessments, ratifies results, awards certificates, appoints the external moderator and decides academic misconduct outcomes.'], ['Registry', 'Applications, admissions, registration, attendance, marks, certificates, transcripts and the archive.'], ['Quality Assurance', 'Specifications, course files, lesson observation, student voice, external moderation and regulatory correspondence.'], ['Safeguarding', 'A named function. Applicants under 18 are covered by safeguarding policy from the moment they apply.']]} /></div></section><section className="section tinted"><div className="wrap"><div className="section-head narrow"><p className="eyebrow">Niger Delta Innovate in practice</p><h2>The work around the Institute.</h2></div><div className="grid-3">{[['Schools and clubs', 'Digital technology taught to the national curriculum from JSS1 to SS3 in partner schools, with Technovation Clubs in coding, artificial intelligence and robotics.'], ['RAIL', 'The Robotics and Artificial Intelligence Laboratory at Okrika Grammar School, in service since March 2026 and the first facility of its kind in Rivers State.'], ['Loop', 'Our own learning and assessment platform. It carries course delivery, assessment and the student record, rather than acting as a filing cabinet with a login.']].map(([title, text]) => <div className="contact-tile" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></div></section><section className="section"><div className="wrap narrow"><div className="notice"><h3>Recognition, stated plainly</h3><p>Programmes lead to a certificate awarded by Niger Delta Innovate Ltd/Gte. Recognition from the National Board for Technical Education is being sought. Recognition is not guaranteed and no date can be given.</p><p>Our curriculum is mapped to the National Skills Qualification framework as a design decision. We do not describe any programme as accredited, nationally recognised or government-approved.</p></div></div></section></PageFrame>;
}

function ContactPage() {
  return <PageFrame><PageHero eyebrow="Contact · Port Harcourt, Rivers State" title="One inbox. One phone number. One WhatsApp line.">Enquiries are answered within two working days. Tell us what you are trying to build, study or make possible, and Registry will route it.</PageHero><section className="section"><div className="wrap grid-3">{[['Prospective students', 'Entry requirements, the diagnostic, fees, sponsorship and access support.', <><a href={`mailto:${contactEmail}`}>{contactEmail}</a><br /><a href="tel:+2348067260598">+234 806 726 0598</a><br /><a href="https://wa.me/2348181958816">WhatsApp +234 818 195 8816</a></>], ['Schools, employers and sponsors', 'Learning hubs, sponsored cohorts, staff training and articulation from a school or club into the Institute.', <><a href={`mailto:${contactEmail}`}>{contactEmail}</a><br /><a href="tel:+2348067260598">+234 806 726 0598</a></>], ['Safeguarding and complaints', 'Concerns about the conduct of anyone teaching or working for us, or about the safety of a student, go straight to our safeguarding route.', <><a href={`mailto:${contactEmail}`}>{contactEmail}</a><br /><a href="tel:+2348067260598">+234 806 726 0598</a></>]].map(([title, text, details]) => <div className="contact-tile" key={String(title)}><h3>{title}</h3><p>{text}</p><p>{details}</p></div>)}</div></section><section className="section tinted"><div className="wrap grid-2"><div><p className="eyebrow"><Phone size={15} /> Find us</p><h2>Port Harcourt is home base. RAIL is where machines get real.</h2><p>The Institute is based in Port Harcourt, Rivers State. Practical teaching in robotics and hardware takes place at RAIL, the Robotics and Artificial Intelligence Laboratory at Okrika Grammar School, Okrika.</p><p>Learners outside Port Harcourt study through an approved hub or by distance with residency blocks. If there is no hub near you, tell us where you are; hub locations follow demand.</p><div className="actions"><a href="https://wa.me/2348181958816" className="btn" data-testid="link-contact-whatsapp"><MessageCircle size={16} /> Message on WhatsApp</a><a href={`mailto:${contactEmail}`} className="btn btn-secondary" data-testid="link-contact-email">Email Registry <ExternalLink size={15} /></a></div></div><div><p className="eyebrow">The organisation</p><Facts items={[['Legal name', 'Niger Delta Innovate Ltd/Gte'], ['Registration', 'RC 9645329, a company limited by guarantee under the Companies and Allied Matters Act 2020'], ['Registered office', 'Port Harcourt, Rivers State, Nigeria'], ['Website', 'nigerdeltainnovate.org']]} /></div></div></section><section className="section"><div className="wrap narrow"><p className="eyebrow">Ready for the next step?</p><h2>Start with the programme, not the paperwork.</h2><p>Explore the three certificates open for January 2027, then send Registry a low-pressure enquiry.</p><div className="actions"><Link href="/programmes" className="btn">Explore programmes <ArrowRight size={16} /></Link><Link href="/admissions#apply" className="btn btn-secondary">Start an application</Link></div></div></section></PageFrame>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={HomePage} /><Route path="/programmes" component={ProgrammesPage} /><Route path="/admissions" component={AdmissionsPage} /><Route path="/diploma" component={DiplomaPage} /><Route path="/about" component={AboutPage} /><Route path="/contact" component={ContactPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;