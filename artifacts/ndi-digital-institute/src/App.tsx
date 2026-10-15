import { useEffect, useRef, useState, useCallback, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowRight, CheckCircle2, ChevronDown, ChevronRight, Code2, Database,
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

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }); },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((c) => obs.observe(c));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useCountUp(end: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * end));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [started, end, duration]);
  return { ref, val };
}

const IMG = {
  hero: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&q=80',
  web: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
  data: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
  design: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
  about: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1920&q=80',
  admissions: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
  contact: 'https://images.unsplash.com/photo-1594751543129-6701ad444259?w=1920&q=80',
  diploma: 'https://images.unsplash.com/photo-1758270703602-309dba204bbc?w=1920&q=80',
  study: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1920&q=80',
  collab: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1920&q=80',
};

const programmes = [
  { id: 'web', title: 'Web Development', family: 'Software and Build', code: 'WEB', icon: Code2, image: IMG.web, summary: 'Build, deploy and maintain a working website or web application to a client brief.', roles: 'Junior front-end or full-stack developer, freelance web developer, web officer or technical co-founder.', where: 'Agencies, start-ups, SMEs, NGOs and churches with a web presence, or freelance on Upwork, Fiverr and direct briefs.', bullets: ['Ship a production site from brief to deployment', 'JavaScript, React or equivalent framework', 'Backend, database and API fundamentals'], outcomes: ['Build a responsive, accessible web interface from a design or written brief.', 'Write JavaScript for state, events, validation and API data.', 'Design a simple relational schema and connect it to an application.', 'Build and consume a basic API, then explain the request and response cycle.', 'Deploy a site to a live host with a domain and keep it running.', 'Scope, quote and deliver a small client project with documentation.'], courses: [['WEB 121 · Front-End Development', 'Semantic HTML, CSS layout with flexbox and grid, responsive and mobile-first design, accessibility basics and building from a supplied design.'], ['WEB 122 · JavaScript and Interactive Interfaces', 'JavaScript in the browser, the DOM, events, forms and validation, asynchronous requests, public APIs and an introduction to a component framework.'], ['WEB 123 · Backend, Databases, APIs and Deployment', 'A server-side runtime, routing, relational databases, SQL basics, building a small API, environment configuration, domains and HTTPS.']] },
  { id: 'data', title: 'Data Analytics', family: 'Data and Artificial Intelligence', code: 'DAN', icon: Database, image: IMG.data, summary: 'Take a real dataset, clean it, interrogate it and give a decision-maker an answer they can act on.', roles: 'Data analyst, business analyst, monitoring and evaluation officer or reporting officer in government, NGOs, health, energy or finance.', where: 'Government MDAs, international NGOs, banks, fintechs, oil and gas operators, public health programmes and consulting firms.', bullets: ['SQL, dashboards and statistical reasoning', 'Clean, validate and present real-world data', 'Serve a decision-maker, not just a spreadsheet'], outcomes: ['Acquire, clean and validate a dataset, documenting what you changed and why.', 'Write SQL to answer a question against a relational database.', 'Build a dashboard a non-technical manager can read without a briefing.', 'Choose an appropriate descriptive or comparative statistic and state its limits.', 'Present a finding in writing and aloud, separating data from inference.', 'Recognise when a dataset cannot answer the question being asked.'], courses: [['DAN 121 · SQL and Relational Databases', 'Relational structure, filtering, joins, grouping and aggregation, subqueries and readable queries against a realistic multi-table database.'], ['DAN 122 · Dashboards and Business Intelligence', 'Connecting to sources, modelling for reporting, chart selection, dashboard layout, filters, publishing and maintaining a live report.'], ['DAN 123 · Statistics for Decision Making', 'Distributions, summary statistics, variability, uncertainty, comparison, correlation, sampling and writing a findings note for a decision-maker.']] },
  { id: 'design', title: 'Graphic Design', family: 'Design', code: 'GRD', icon: PenTool, image: IMG.design, summary: 'Take a client brief and deliver finished, production-ready visual work across identity, print and digital.', roles: 'Graphic designer in an agency, media house, church, school, NGO or SME, or a freelance designer and branding service.', where: 'Media houses, advertising agencies, print shops, churches, schools, SMEs, political campaigns and freelance platforms.', bullets: ['Identity, print and digital design end to end', 'Brief to finished production-ready artwork', 'Portfolio that shows range and professional judgement'], outcomes: ['Translate a brief into a clear visual direction and production plan.', 'Use composition, hierarchy, colour and type to make communication work.', 'Prepare artwork for print, identity systems, social channels and digital formats.', 'Critique your work and respond to a client or tutor brief without losing the purpose.', 'Build a portfolio of production-ready work that shows range and judgement.', 'Quote, revise and hand over design work professionally.'], courses: [['GRD 121 · Identity and Brand Systems', 'Visual identity, marks, colour systems, type pairing, brand rules and making a coherent family of applications.'], ['GRD 122 · Layout and Print Production', 'Composition, editorial and campaign layout, files for production, print processes, colour modes and quality checks.'], ['GRD 123 · Digital and Social Formats', 'Designing for screens, accessible contrast, responsive content, social formats, motion in outline and delivery to a content team.']] },
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

const outcomes = [
  { n: '01', title: 'A defended capstone', desc: 'A real project, built to a brief and defended before two assessors. Not a group slide deck.' },
  { n: '02', title: 'A working portfolio', desc: 'Three to five pieces of work a hiring manager or client can inspect, deployed and documented.' },
  { n: '03', title: 'A CV and online profile', desc: 'Written with you, reviewed by someone who hires, and ready before you finish.' },
  { n: '04', title: 'Interview practice', desc: 'At least two mock interviews, one with someone outside the Institute. Recorded on request.' },
  { n: '05', title: 'Introductions', desc: 'We introduce you to employers, freelance leads and alumni who are hiring. We cannot guarantee a job.' },
  { n: '06', title: '12 months alumni support', desc: 'After you leave, a Slack channel, monthly drop-in hours and priority when we hear of openings.' },
];

const scholarships = [
  { amt: '10%', title: 'Early registration', desc: 'Register and pay within the early window.' },
  { amt: '5%', title: 'Pay in full', desc: 'Clear the full tuition before classes begin.' },
  { amt: '15%', title: 'Women in tech', desc: 'Female-identifying applicants in any programme.' },
  { amt: '15%', title: 'Rural and riverine', desc: 'Applicants from rural or riverine communities in the Niger Delta.' },
  { amt: '10%', title: 'Partner school', desc: 'Applicants from an NDI club or partner secondary school.' },
  { amt: '5%', title: 'Referral or alumni', desc: 'Referred by a current student or alumnus.' },
];

const faqs: [string, string][] = [
  ['Do I need my own computer?', 'No. Device access is part of our access plan. You can use Institute machines during practical sessions and borrow a device under the loan scheme if eligible.'],
  ['I do not have SSCE credits. Can I still apply?', 'Yes. At certificate level we require SSCE or NECO attempted, not passed. The diagnostic assessment, not your certificate, decides readiness.'],
  ['Will this get me a job?', 'We teach a trade, build your portfolio, rehearse interviews and introduce you to employers. We cannot guarantee a job, and we will not claim to.'],
  ['How much does it cost?', 'Tuition is priced per credit unit within a band. At least 25% of seats in each intake are funded. Exact figures are confirmed closer to intake.'],
  ['Is the certificate recognised by NBTE?', 'Not yet. Recognition from the National Board for Technical Education is being sought, is not guaranteed, and has no confirmed date. Our curriculum is mapped to the National Skills Qualification framework as a design decision, not a claim of accreditation.'],
  ['Where exactly is the Institute?', 'Main classes are in Port Harcourt. Practical robotics and hardware teaching takes place at RAIL, the Robotics and AI Laboratory at Okrika Grammar School. Distance learners attend residency blocks.'],
  ['What if the cohort does not fill?', 'Programmes require a minimum-viable cohort to run. If a cohort does not form, applicants receive a full refund.'],
  ['Can I study in the evening?', 'Yes. Evening and weekend mode is designed for people already working. You attend live sessions after 5pm and on Saturdays.'],
  ['I live outside Port Harcourt.', 'You can study through an approved learning hub, or by distance with residency blocks for the practical components.'],
];

const selectionWeights = [
  { label: 'Diagnostic assessment', pct: 60 },
  { label: 'Academic or work record', pct: 20 },
  { label: 'Motivation statement', pct: 10 },
  { label: 'Portfolio or prior work', pct: 10 },
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
        <Link href="/admissions#apply" className="btn btn-sm nav-apply" data-testid="link-start-application">Register interest <ArrowRight size={14} /></Link>
      </nav>
    </div>
  </header>;
}

function Footer() {
  return <footer className="footer"><div className="wrap">
    <div className="footer-grid">
      <div><img className="footer-logo" src={ndiFooterLogo} alt="Niger Delta Innovate" /><h3>Niger Delta Institute of Digital Technology</h3><p style={{ marginTop: '10px', color: 'rgba(242,239,231,.72)' }}>Closing the digital skills gap across the Niger Delta.</p></div>
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
  return <section className={`page-hero hero-enter${image ? ' img-section' : ''}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>
    {image && <div className="overlay" />}
    <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
      <h1>{title}</h1>
      <div className="lede">{children}</div>
    </div>
  </section>;
}

function CountStat({ end, label }: { end: number; label: string }) {
  const { ref, val } = useCountUp(end);
  return <div className="stat" ref={ref}><strong>{val}</strong><span>{label}</span></div>;
}

function FAQ() {
  return <div className="faq-list">
    {faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
  </div>;
}

function HomePage() {
  const careersRef = useReveal();
  const remoteRef = useReveal();
  const outcomesRef = useReveal();
  const creditsRef = useReveal();
  const blendedRef = useReveal();
  const scholarRef = useReveal();
  const faqRef = useReveal();
  const selectionRef = useReveal();
  const ctaRef = useReveal();

  return <PageFrame>
    {/* ── Hero ── */}
    <section className="hero hero-img hero-enter" style={{ backgroundImage: `url(${IMG.hero})` }}>
      <div className="wrap">
        <p className="eyebrow">Niger Delta Institute of Digital Technology</p>
        <h1>Learn a digital trade <em>well enough to be paid for it.</em></h1>
        <p className="lede">24-week practical certificates in Port Harcourt. No prior experience needed, no laptop required.</p>
        <p className="hero-note">January 2027 intake · Web Development · Data Analytics · Graphic Design</p>
        <div className="actions">
          <Link href="/admissions#apply" className="btn btn-pulse" data-testid="button-hero-apply">Register interest <span className="arw">&rarr;</span></Link>
          <Link href="/programmes" className="btn btn-secondary" data-testid="button-hero-programmes">Explore programmes <span className="arw">&rarr;</span></Link>
        </div>
      </div>
      <div className="scroll-hint"><ChevronDown size={28} /></div>
    </section>

    {/* ── Stats ── */}
    <div className="stats-row">
      <CountStat end={24} label="weeks" />
      <CountStat end={30} label="credit units" />
      <CountStat end={3} label="programmes open" />
      <CountStat end={4} label="study modes" />
    </div>

    {/* ── Programmes (vertical cards) ── */}
    <section className="section" ref={careersRef}><div className="wrap">
      <div className="shead">
        <div className="reveal">
          <p className="eyebrow">Programmes</p>
          <h2>Three practical digital careers.</h2>
        </div>
        <p className="lede reveal">Each programme opens with an appointed instructor, approved specification and confirmed equipment. You leave with a portfolio, not just a certificate.</p>
      </div>
      <div className="programme-grid stagger">
        {programmes.map((p) => <div className="oc reveal-scale" key={p.id} data-testid={`card-programme-${p.id}`}>
          <p className="code">{p.code} · {p.family}</p>
          <h3>{p.title}</h3>
          <p className="roles">{p.roles}</p>
          <ul>{p.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          <p className="where"><b>Where the work is</b><br />{p.where}</p>
          <Link href={`/programmes#${p.id}`} className="more">Full specification <span className="arw">&rarr;</span></Link>
        </div>)}
      </div>
    </div></section>

    {/* ── Earning from here (remote work) ── */}
    <section className="section remote-band" ref={remoteRef}><div className="wrap">
      <div className="shead">
        <div className="reveal">
          <p className="eyebrow">Remote work readiness</p>
          <h2>Earning from here.</h2>
        </div>
        <p className="lede reveal">Every programme includes freelance and remote-work skills so you can sell what you learn to clients and employers who are not in your city.</p>
      </div>
      <div className="cols3 stagger">
        <div className="col reveal">
          <h4>What we teach</h4>
          <ul>
            <li>Building a freelance profile that gets shortlisted</li>
            <li>Pricing, quoting and managing a remote brief</li>
            <li>Time zones, communication norms and deliverables</li>
            <li>Upwork, Fiverr, Toptal and direct-client workflows</li>
          </ul>
        </div>
        <div className="col reveal">
          <h4>What we are realistic about</h4>
          <ul>
            <li>Remote income takes months to build, not days</li>
            <li>The market is competitive and rates start low</li>
            <li>Reliable power and internet are still a constraint here</li>
            <li>Most graduates will start with local work</li>
          </ul>
        </div>
        <div className="col reveal">
          <h4>What we don't promise</h4>
          <ul>
            <li>A guaranteed remote job or contract</li>
            <li>A specific salary or freelance rate</li>
            <li>That remote work will replace local employment</li>
            <li>Visa sponsorship, relocation or placement abroad</li>
          </ul>
        </div>
      </div>
    </div></section>

    {/* ── What you leave with ── */}
    <section className="section" ref={outcomesRef}><div className="wrap">
      <div className="section-head reveal">
        <p className="eyebrow">Outcomes</p>
        <h2>What you leave with.</h2>
        <p>Six things that are ready when you are, not things we hope will happen eventually.</p>
      </div>
      <div className="grid6 stagger">
        {outcomes.map((o) => <div className="cell reveal-scale" key={o.n}>
          <p className="n">{o.n}</p>
          <h4>{o.title}</h4>
          <p>{o.desc}</p>
        </div>)}
      </div>
    </div></section>

    {/* ── Credit structure ── */}
    <section className="section tinted" ref={creditsRef}><div className="wrap">
      <div className="section-head reveal">
        <p className="eyebrow">Curriculum</p>
        <h2>Thirty credit units. One project you defend.</h2>
        <p>One credit unit is thirty notional learner hours. Your 900 hours move from shared foundations to specialist practice, then into a capstone built for a real brief.</p>
      </div>
      <div className="blockbar reveal" role="img" aria-label="Certificate structure: Digital Core 6 units, Family Core 8 units, Specialist block 12 units, Capstone 4 units">
        <div className="b1"><b>Digital Core</b><span>6 units</span></div>
        <div className="b2"><b>Family Core</b><span>8 units</span></div>
        <div className="b3"><b>Specialist block</b><span>12 units</span></div>
        <div className="b4"><b>Capstone</b><span>4 units</span></div>
      </div>
      <div className="grid-2 stagger" style={{ marginTop: '2.5rem' }}>
        <div className="reveal-left">
          <h3>Shared foundations</h3>
          <p>Everyone takes computing environments, professional practice for technical work, and online safety and data protection under the Nigeria Data Protection Act 2023.</p>
        </div>
        <div className="reveal-right">
          <h3>A capstone with nowhere to hide</h3>
          <p>A partner brief or community need becomes your deadline. You produce the work and defend it in person before two assessors.</p>
        </div>
      </div>
    </div></section>

    {/* ── For people already working ── */}
    <section className="section hero-img" style={{ backgroundImage: `url(${IMG.study})` }} ref={blendedRef}>
      <div className="overlay" />
      <div className="wrap split-feature" style={{ position: 'relative', zIndex: 2 }}>
        <div className="reveal-left">
          <p className="eyebrow">Evening and weekend mode</p>
          <div className="feature-number">40<span style={{ fontSize: '2rem' }}>%</span></div>
          <h2>For people already working.</h2>
          <p style={{ marginTop: '1rem' }}>Forty per cent online in your own time, forty per cent live teaching and twenty per cent on-site practical work. Evening sessions start after 5pm, with Saturday workshops.</p>
        </div>
        <div className="reveal-right">
          <ul className="rule-list">
            <li><strong>Real workshops</strong><span>Robotics and hardware taught at RAIL, the Robotics and AI Laboratory at Okrika Grammar School.</span></li>
            <li><strong>Four study modes</strong><span>Full-time blended, evening and weekend, hub cohort, or distance with residency blocks.</span></li>
            <li><strong>Access by design</strong><span>You do not need to own a laptop. Device access is part of our access plan.</span></li>
            <li><strong>No time off work</strong><span>Evening and weekend mode is built so you keep your job and study alongside it.</span></li>
          </ul>
          <p style={{ marginTop: '2rem' }}>
            <Link href="/admissions" className="btn btn-light">See admissions and fees <ArrowRight size={16} /></Link>
          </p>
        </div>
      </div>
    </section>

    {/* ── Scholarships ── */}
    <section className="section funded-band" ref={scholarRef}><div className="wrap">
      <div className="reveal">
        <p className="eyebrow">Scholarships and discounts</p>
        <h2>At least 25% of seats are funded.</h2>
        <p className="lede">Discounts stack up to a cap. If you qualify for more than one, the largest applies first and the rest are added where the cap allows.</p>
      </div>
      <div className="discounts stagger">
        {scholarships.map((s) => <div className="disc reveal-scale" key={s.title}>
          <span className="amt">{s.amt}</span>
          <h4>{s.title}</h4>
          <p>{s.desc}</p>
        </div>)}
      </div>
      <p className="stack-note reveal">Tuition is priced per credit unit within a band. Exact figures are confirmed closer to intake.</p>
      <div className="actions reveal">
        <Link href="/admissions#apply" className="btn">Register interest <span className="arw">&rarr;</span></Link>
      </div>
    </div></section>

    {/* ── Selection criteria ── */}
    <section className="section" ref={selectionRef}><div className="wrap">
      <div className="section-head reveal">
        <p className="eyebrow">Selection</p>
        <h2>How we choose, when we have to.</h2>
        <p>If applications exceed places, selection is transparent. The diagnostic assessment carries the most weight because it tests readiness, not background.</p>
      </div>
      <div className="weights reveal">
        {selectionWeights.map((w) => <div className="w" key={w.label}>
          <span className="lab">{w.label}</span>
          <div className="track"><div className="fill" style={{ width: `${w.pct}%` }} /></div>
          <span className="val">{w.pct}%</span>
        </div>)}
      </div>
      <p className="meta reveal" style={{ marginTop: '1.5rem' }}>Reserved seats: at least 50% women (40% floor), 30% rural and riverine communities, 5% applicants with a disability, 25% articulation from clubs and partner schools.</p>
    </div></section>

    {/* ── FAQ ── */}
    <section className="section tinted" ref={faqRef}><div className="wrap narrow">
      <div className="section-head reveal">
        <p className="eyebrow">Questions</p>
        <h2>Before you ask Registry.</h2>
      </div>
      <div className="reveal"><FAQ /></div>
    </div></section>

    {/* ── Closing CTA ── */}
    <section className="section close-cta" ref={ctaRef}><div className="wrap">
      <div className="reveal">
        <p className="eyebrow">January 2027 intake</p>
        <h2>A trade you can sell, taught by people who do it.</h2>
        <p className="lede">Expressions of interest are open. Registry will confirm receipt within two working days.</p>
      </div>
      <div className="actions reveal">
        <Link href="/admissions#apply" className="btn btn-pulse" data-testid="button-cta-apply">Register interest <span className="arw">&rarr;</span></Link>
        <Link href="/programmes" className="btn btn-secondary">See the programmes <span className="arw">&rarr;</span></Link>
        <a href={`mailto:${contactEmail}`} className="btn btn-ghost">Email Registry <ExternalLink size={15} /></a>
      </div>
    </div></section>

    {/* ── Award notice ── */}
    <section className="section tinted"><div className="wrap narrow">
      <div className="trust-box">
        <h3>Serious about the work. Plain about the award.</h3>
        <p>Programmes lead to a certificate awarded by Niger Delta Innovate Ltd/Gte. Recognition from the National Board for Technical Education is being sought, is not guaranteed, and has no confirmed date.</p>
        <div className="actions" style={{ marginTop: '1.5rem' }}>
          <Link href="/about" className="btn btn-secondary">How we hold the standard <ArrowRight size={16} /></Link>
          <Link href="/diploma" className="arrow-link" data-testid="link-home-diploma">See the diploma pathway <ChevronRight size={15} /></Link>
        </div>
      </div>
    </div></section>
  </PageFrame>;
}

function ProgrammeDetail({ p }: { p: typeof programmes[number] }) {
  const Icon = p.icon;
  return <article className="detail" id={p.id}><div className="detail-head"><div><p className="eyebrow"><Icon size={16} /> {p.code} · January 2027</p><h2>Certificate in {p.title}</h2></div><span className="detail-meta">{p.family} · 30 credit units · 24 weeks</span></div><div className="grid-2"><div><p><strong>What it is for.</strong> {p.summary}</p><p style={{ marginTop: '.8rem' }}><strong>Where it leads.</strong> {p.roles}</p><p style={{ marginTop: '.8rem' }}><strong>Entry.</strong> Institute standard. No prior qualification in the field is required.</p><h3 style={{ marginTop: '1.5rem' }}>By the end you can</h3><ol className="outcomes">{p.outcomes.map((o) => <li key={o}>{o}</li>)}</ol></div><div><h3>Specialist block · 12 credit units</h3><ul className="course-list">{p.courses.map(([name, desc]) => <li key={name}><b>{name}</b><span>{desc}</span></li>)}</ul><p className="meta"><strong>Assessment.</strong> Continuous work, practical build assessments and examination, plus the capstone. Practical components must be passed on their own.</p></div></div></article>;
}

function ProgrammesPage() {
  const s1 = useReveal(); const s2 = useReveal();
  return <PageFrame><PageHero title="Learn by making something that has to work." image={IMG.collab}>Three certificates are accepting expressions of interest for January 2027. Practical assessment and an in-person capstone defence.</PageHero><section className="section tinted" ref={s1}><div className="wrap"><div className="section-head narrow reveal"><h2>Certificates open for January 2027</h2><p>The Digital Core, Family Core and capstone are shared across each specification.</p></div>{programmes.map((p) => <ProgrammeDetail key={p.id} p={p} />)}</div></section><section className="section" id="later" ref={s2}><div className="wrap"><div className="section-head narrow reveal"><h2>More certificates coming soon.</h2><p>Two intakes a year, January and July. Programmes launch when the instructor, specification and equipment are ready.</p></div><div className="table-scroll reveal"><table><thead><tr><th>Certificate</th><th>Family</th><th>First intake</th></tr></thead><tbody>{catalogue.map(([name, family, intake]) => <tr key={name}><td><strong>{name}</strong></td><td>{family}</td><td className={intake === 'January 2027' ? 'status-open' : 'status-later'}>{intake}</td></tr>)}</tbody></table></div><p className="meta">Data Science and Artificial Intelligence are the only certificates with a prerequisite (or assessed equivalence accepted). Everything else admits on the Institute standard.</p><div className="actions reveal"><Link href="/admissions#apply" className="btn btn-pulse" data-testid="button-programmes-apply">Register interest <ArrowRight size={16} /></Link></div></div></section></PageFrame>;
}

function Facts({ items }: { items: [string, string][] }) {
  return <ul className="rule-list">{items.map(([label, text]) => <li key={`${label}-${text}`}><strong>{label}</strong><span>{text}</span></li>)}</ul>;
}

function AdmissionsPage() {
  const s1 = useReveal(); const s2 = useReveal(); const s3 = useReveal(); const s4 = useReveal();
  return <PageFrame><PageHero title="The entry requirements are deliberately low." image={IMG.admissions}><p>Expressions of interest are open for Web Development, Data Analytics and Graphic Design. The diagnostic assessment, not your school certificate, decides readiness.</p><div className="actions"><a href="#apply" className="btn btn-pulse" data-testid="link-admissions-apply">Register interest <ArrowRight size={16} /></a></div></PageHero>

    <section className="section tinted" ref={s1}><div className="wrap"><div className="section-head narrow reveal"><h2>Who we admit</h2></div><div className="reveal"><Facts items={[['Academic', 'SSCE or NECO attempted, or a portfolio of prior learning assessed as equivalent. Credits are not required at certificate level.'], ['Age', 'Minimum 16. Applicants aged 16 or 17 need written guardian consent and are covered by our safeguarding policy.'], ['Diagnostic', 'Everyone sits it. It tests reasoning, numeracy and comprehension rather than prior knowledge, including for applicants who have never used a computer.'], ['Equipment', 'You do not need to own a laptop or phone. Device access is part of our access plan, not an entry barrier.'], ['Exceptions', 'Data Science and Artificial Intelligence, opening January 2028, carry a prerequisite (or assessed equivalence) that is not waived.']]} /></div></div></section>

    <section className="section" ref={s2}><div className="wrap"><div className="section-head narrow reveal"><h2>Six steps to registration.</h2></div><ol className="steps reveal">{[
      ['Make an enquiry', 'Fill in the form below or email Registry. We reply within two working days.'],
      ['Apply on Loop', 'We send you a link to the full application on Loop.'],
      ['Eligibility and document screening', 'Registry checks your documents against the entry standard.'],
      ['Sit the diagnostic assessment', 'A reasoning and comprehension test, not a knowledge exam.'],
      ['Offer and acceptance', 'If you meet the standard, you receive an offer with fees and study mode.'],
      ['Register', 'Accept, pay (or confirm funding) and you are in.'],
    ].map(([title, desc]) => <li key={title}><h3>{title}</h3><p>{desc}</p></li>)}</ol></div></section>

    <section className="section tinted" ref={s3}><div className="wrap grid-2"><div className="reveal-left"><h2>Selection criteria.</h2><p>If applications exceed places, selection is transparent.</p><div className="weights" style={{ marginTop: '2rem' }}>{selectionWeights.map((w) => <div className="w" key={w.label}><span className="lab">{w.label}</span><div className="track"><div className="fill" style={{ width: `${w.pct}%` }} /></div><span className="val">{w.pct}%</span></div>)}</div><p className="meta" style={{ marginTop: '1rem' }}>Reserved seats: at least 50% women (40% floor), 30% rural and riverine communities, 5% applicants with a disability, 25% articulation from clubs and partner schools.</p></div><div className="reveal-right"><h2>Study modes and fees.</h2><Facts items={[['Full-time', 'Blended. Suits school leavers and full-time students.'], ['Evening and weekend', 'For learners already in work.'], ['Hub cohort', 'For learners outside Port Harcourt, at an approved learning hub.'], ['Distance', 'With residency blocks, for learners with no hub in reach.']]} /><p className="meta">Tuition is priced per credit unit within a band. At least 25% of seats in each intake are funded. A minimum of 75% attendance is required. Programmes require a minimum-viable cohort to run; if a cohort does not form, applicants receive a full refund.</p></div></div></section>

    <section className="section tinted" id="apply" ref={s4}><div className="wrap form-shell"><div className="reveal-left"><h2>Register your interest.</h2><p>Send your details and Registry will confirm receipt within two working days. Nothing here commits you to anything.</p></div><div className="reveal-right"><EnquiryForm /></div></div></section>
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
  const s1 = useReveal(); const s2 = useReveal(); const s3 = useReveal(); const s4 = useReveal();
  return <PageFrame><PageHero title="Your certificate credit carries forward." image={IMG.diploma}>The certificate you start in January 2027 is built so every credit can advance into a diploma.</PageHero>

    <section className="section tinted" ref={s1}><div className="wrap narrow"><div className="notice reveal-scale"><h3>Where the diploma stands today</h3><p>Admission is open for Level 1 certificates only. Diploma admission is not open, and we are not taking diploma fees or issuing diploma offers.</p><p style={{ marginTop: '.8rem' }}>Diploma-awarding status requires institutional recognition from the National Board for Technical Education, which we do not yet hold. Recognition is being sought, is not guaranteed and has no confirmed date.</p><p style={{ marginTop: '.8rem' }}>Nothing on this page is an offer of a diploma place or a claim of accreditation.</p></div></div></section>

    <section className="section" ref={s2}><div className="wrap"><div className="section-head narrow reveal"><h2>What sits above the certificate.</h2><p>Each level opens only when it can be delivered and awarded properly.</p></div><div className="table-scroll reveal"><table><thead><tr><th>Award</th><th>Length</th><th>Credit units</th><th>Status</th></tr></thead><tbody>{[['Certificate · Level 1', '24 weeks', '30', 'Expressions of interest open, January 2027'], ['Professional Diploma · Level 2', '12 months, evening and weekend', '60', 'In development'], ['Diploma · Level 3', '24 months, four semesters', '120', 'In development, subject to recognition'], ['Advanced Diploma · Level 4', '12 months after a diploma', '60', 'Planned']].map(([a, b, c, d]) => <tr key={a}><td><strong>{a}</strong></td><td>{b}</td><td>{c}</td><td className={d.startsWith('Open') || d.startsWith('Expressions') ? 'status-open' : 'status-later'}>{d}</td></tr>)}</tbody></table></div><p className="meta">Planned fields: software engineering, data science and AI, robotics and mechatronics, cybersecurity and network systems, electronics and embedded systems, product design and digital media, digital business and entrepreneurship, and renewable energy technology.</p></div></section>

    <section className="section tinted" ref={s3}><div className="wrap form-shell"><div className="reveal-left"><h2>Register interest in the diploma pathway.</h2><p>Put your name down and we will write when a diploma opens. We will not use your details for anything else.</p></div><div className="reveal-right"><DiplomaForm /></div></div></section>

    <section className="section" ref={s4}><div className="wrap narrow"><p className="reveal">In the meantime, the certificate is the way in, and it is a complete qualification on its own. <Link href="/programmes">See the three programmes accepting interest for January 2027.</Link></p></div></section>
  </PageFrame>;
}

function DiplomaForm() {
  const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setError(''); setMessage(''); const f = new FormData(e.currentTarget); const name = String(f.get('dname') || '').trim(); const email = String(f.get('demail') || '').trim(); const phone = String(f.get('dphone') || '').trim(); if (!name || !email || !phone) { setError('Please add your full name, email and phone number so we can reach you.'); return; } if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Please enter a valid email address.'); return; } setSubmitting(true); try { const res = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'diploma', name, email, phone, field: f.get('dfield'), status: f.get('dstatus') }) }); if (!res.ok) throw new Error('Submission failed'); setMessage('You are on the list. We will write when a diploma opens.'); e.currentTarget.reset(); } catch { setError('Something went wrong. Please try again or email us directly.'); } finally { setSubmitting(false); } }
  return <form onSubmit={submit} noValidate data-testid="form-diploma-interest"><div className="form-grid"><div className="field"><label htmlFor="dname">Full name *</label><input id="dname" name="dname" autoComplete="name" data-testid="input-diploma-name" /></div><div className="field"><label htmlFor="demail">Email *</label><input id="demail" name="demail" type="email" autoComplete="email" data-testid="input-diploma-email" /></div><div className="field"><label htmlFor="dphone">Phone or WhatsApp number *</label><input id="dphone" name="dphone" type="tel" autoComplete="tel" data-testid="input-diploma-phone" /></div><div className="field"><label htmlFor="dfield">Field you are interested in</label><select id="dfield" name="dfield" data-testid="select-diploma-field">{['Software engineering', 'Data science and artificial intelligence', 'Robotics and mechatronics', 'Cybersecurity and network systems', 'Electronics and embedded systems', 'Product design and digital media', 'Digital business and entrepreneurship', 'Renewable energy technology', 'Not decided yet'].map((x) => <option key={x}>{x}</option>)}</select></div><div className="field full"><label htmlFor="dstatus">Where you are now</label><select id="dstatus" name="dstatus" data-testid="select-diploma-status"><option>Secondary school student or leaver</option><option>Working, no formal qualification in this field</option><option>Holder of another certificate or diploma</option><option>Studying with us already</option></select></div></div>{error && <p className="form-message error" role="alert">{error}</p>}{message && <p className="form-message" role="status">{message}</p>}<button className="btn" type="submit" disabled={submitting} data-testid="button-submit-diploma">{submitting ? 'Sending…' : 'Add me to the list'} {!submitting && <ArrowRight size={16} />}</button></form>;
}

function AboutPage() {
  const s1 = useReveal(); const s2 = useReveal(); const s3 = useReveal(); const s4 = useReveal();
  return <PageFrame><PageHero title="A qualification with something solid behind it." image={IMG.about}>The Niger Delta Institute of Digital Technology is the teaching institute of Niger Delta Innovate Ltd/Gte, closing the digital skills gap across the Niger Delta.</PageHero>

    <section className="section" ref={s1}><div className="wrap grid-2"><div className="reveal-left"><h2>From school clubs to real careers.</h2></div><div className="reveal-right"><p>Niger Delta Innovate runs digital technology teaching in secondary schools, Technovation Clubs in coding, AI and robotics, and RAIL, the Robotics and AI Laboratory at Okrika Grammar School.</p><p style={{ marginTop: '1rem' }}>The Institute exists because those students need somewhere to take the next step that ends in a qualification, not just a certificate of attendance.</p></div></div></section>

    <section className="section tinted" ref={s2}><div className="wrap"><div className="section-head narrow reveal"><h2>How we hold the standard.</h2></div><div className="grid-2 stagger">{[['Moderated before use', 'An internal moderator approves every assessment before it reaches a student. An external moderator reviews a sample from every intake.'], ['A course file for every course', 'Specifications, materials, mark schemes, moderation approvals, external reports and student voice are held for every intake.'], ['Open about AI, closed where it counts', 'Each assessment states whether AI use is open, assistive or closed. The capstone is defended in person before two assessors.'], ['Nothing advertised before it is ready', 'A programme opens only when its specification is approved, its instructor appointed and its equipment confirmed.']].map(([title, text]) => <div className="contact-tile reveal-scale" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

    <section className="section" ref={s3}><div className="wrap"><div className="section-head narrow reveal"><h2>Governance.</h2><p>The Institute is a unit of Niger Delta Innovate and answers to its Board of Directors.</p></div><div className="reveal"><Facts items={[['Board of Directors', 'Opening or closing programmes, tuition policy, the Institute budget and certificate authority.'], ['Programmes and Awards Committee', 'Approves specifications, ratifies results, awards certificates and appoints the external moderator.'], ['Registry', 'Applications, admissions, registration, attendance, marks, certificates and transcripts.'], ['Quality Assurance', 'Specifications, course files, lesson observation, student voice, external moderation and regulatory correspondence.'], ['Institute Lead', 'Vacancy. Being recruited. The Board exercises direct oversight until appointment.'], ['Safeguarding', 'A designated Safeguarding Lead. Applicants under 18 are covered from the moment they apply.']]} /></div></div></section>

    <section className="section tinted" ref={s4}><div className="wrap narrow"><div className="notice reveal-scale"><h3>Recognition, stated plainly</h3><p>Programmes lead to a certificate awarded by Niger Delta Innovate Ltd/Gte. Recognition from the National Board for Technical Education is being sought, is not guaranteed, and has no confirmed date.</p><p style={{ marginTop: '.8rem' }}>Our curriculum is mapped to the National Skills Qualification framework as a design decision, not a claim of accreditation.</p></div></div></section>
  </PageFrame>;
}

function ContactPage() {
  const s1 = useReveal(); const s2 = useReveal();
  return <PageFrame><PageHero title="Get in touch." image={IMG.contact}>Enquiries are answered within two working days.</PageHero>

    <section className="section" ref={s1}><div className="wrap grid-3 stagger">{[['Prospective students', 'Entry requirements, the diagnostic, fees, sponsorship and access support.', <><a href={`mailto:${contactEmail}`}>{contactEmail}</a><br /><a href="tel:+2348067260598">+234 806 726 0598</a><br /><a href="https://wa.me/2348181958816">WhatsApp +234 818 195 8816</a></>], ['Schools, employers and sponsors', 'Learning hubs, sponsored cohorts, staff training and articulation into the Institute.', <><a href={`mailto:${contactEmail}`}>{contactEmail}</a><br /><a href="tel:+2348067260598">+234 806 726 0598</a></>], ['Safeguarding and complaints', 'Concerns about conduct or student safety go straight to the Safeguarding Lead.', <><a href="mailto:info@nigerdeltainnovate.org">info@nigerdeltainnovate.org</a><br /><a href="tel:+2348067260598">+234 806 726 0598</a></>]].map(([title, text, details]) => <div className="contact-tile reveal-scale" key={String(title)}><h3>{title}</h3><p>{text}</p><p style={{ marginTop: '10px' }}>{details}</p></div>)}</div></section>

    <section className="section tinted" ref={s2}><div className="wrap grid-2"><div className="reveal-left"><h2>Port Harcourt is home base.</h2><p>Practical teaching in robotics and hardware takes place at RAIL, Okrika Grammar School. Learners outside Port Harcourt study through an approved hub or by distance.</p><div className="actions"><a href="https://wa.me/2348181958816" className="btn" data-testid="link-contact-whatsapp"><MessageCircle size={16} /> Message on WhatsApp</a><a href={`mailto:${contactEmail}`} className="btn btn-secondary" data-testid="link-contact-email">Email Registry <ExternalLink size={15} /></a></div></div><div className="reveal-right"><Facts items={[['Legal name', 'Niger Delta Innovate Ltd/Gte'], ['Registration', 'RC 9645329, a company limited by guarantee under the Companies and Allied Matters Act 2020'], ['Registered office', 'Plot 100 Avuha Estate, Eneka, Port Harcourt, Rivers State, Nigeria'], ['Website', 'nigerdeltainnovate.org']]} /></div></div></section>
  </PageFrame>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={HomePage} /><Route path="/programmes" component={ProgrammesPage} /><Route path="/admissions" component={AdmissionsPage} /><Route path="/diploma" component={DiplomaPage} /><Route path="/about" component={AboutPage} /><Route path="/contact" component={ContactPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
