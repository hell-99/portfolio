'use client'

import { useEffect, useRef, useState } from 'react'

// ── Data ────────────────────────────────────────────────────────────────────

type Project = {
  id: string
  name: string
  full: string
  tagline: string
  description: string
  metrics: { val: string; label: string }[]
  tags: string[]
  color: string
  links: { label: string; href: string; primary: boolean }[]
  category: 'featured' | 'independent' | 'course'
  collaborators?: string
  course?: string
  screenshot?: string
}

const PROJECTS: Project[] = [
  {
    id: 'iris',
    name: 'IRIS',
    full: 'Identity Risk Intelligence System',
    tagline: 'Behavioral security monitor for LLM agent systems',
    description:
      'Built a 5-layer real-time detection engine that catches indirect prompt injection, cross-agent collusion, and behavioral drift — attacks that bypass every standard defense. Core contribution: intent-action divergence detection using llama-3.3-70b to compare what an agent should do vs what it actually does.',
    metrics: [
      { val: '93.1%', label: 'Precision' },
      { val: '0.43ms', label: 'Avg Latency' },
      { val: '14', label: 'Collusion Patterns' },
      { val: '894', label: 'Calls Monitored' },
    ],
    tags: ['LLM Security', 'Python', 'XGBoost', 'FastAPI', 'Streamlit', 'LangChain'],
    color: '#00ff88',
    screenshot: '/screenshots/iris.png',
    links: [
      { label: 'Live Demo', href: 'https://iris-hell99.streamlit.app', primary: true },
      { label: 'Demo Video', href: 'https://youtu.be/nqiDZgpAdyM', primary: false },
      { label: 'GitHub', href: 'https://github.com/hell-99/IRIS', primary: false },
      { label: 'pip install iris-security', href: 'https://pypi.org/project/iris-security/', primary: false },
    ],
    category: 'featured',
  },
  {
    id: 'aegis',
    name: 'AEGIS',
    full: 'Autonomous Cybersecurity Intelligence System',
    tagline: 'Multi-layered autonomous IDS/IPS with post-quantum cryptography',
    description:
      'Multi-layered threat detection platform combining rule-based IDS, Isolation Forest anomaly detection, and CICIDS2017-trained Random Forest with ensemble voting. Deployed in a Mininet SDN environment (OpenFlow), with a post-quantum cryptographic pipeline (Dilithium3 + Kyber768), SHA-256 tamper-evident audit ledger, self-healing watchdog, NIST CSF incident response automation, Kubernetes Zero Trust architecture, and a live SOC dashboard.',
    metrics: [
      { val: '3-layer', label: 'ML Ensemble' },
      { val: 'PQC', label: 'Post-Quantum Crypto' },
      { val: 'K8s', label: 'Zero Trust' },
      { val: 'NIST CSF', label: 'IR Automation' },
    ],
    tags: ['IDS/IPS', 'Post-Quantum Crypto', 'Kubernetes', 'Ensemble ML', 'SDN/OpenFlow', 'Mininet'],
    color: '#00d2ff',
    screenshot: 'https://raw.githubusercontent.com/hell-99/AEGIS/main/Images/Critical.png',
    links: [
      { label: 'GitHub', href: 'https://github.com/hell-99/AEGIS', primary: true },
    ],
    category: 'featured',
  },
  {
    id: 'zeroseg',
    name: 'ZeroSeg',
    full: 'Live Microsegmentation Monitor',
    tagline: 'ML-driven network microsegmentation with real-time enforcement',
    description:
      'ML-driven network microsegmentation system using XGBoost and DBSCAN clustering on the UNSW-NB15 dataset. Ryu OpenFlow 1.3 controller on Mininet with a real-time Flask event-stream dashboard. Achieved 95.31% classification accuracy and 100% cross-segment block rate.',
    metrics: [
      { val: '95.31%', label: 'Accuracy' },
      { val: '100%', label: 'Block Rate' },
      { val: 'UNSW-NB15', label: 'Dataset' },
      { val: 'OpenFlow 1.3', label: 'Controller' },
    ],
    tags: ['XGBoost', 'DBSCAN', 'SDN', 'Mininet', 'Flask', 'OpenFlow', 'Microsegmentation'],
    color: '#a855f7',
    links: [],
    category: 'course',
  },
  {
    id: 'mirai',
    name: 'Mirai Botnet Detection',
    full: 'Botnet Forensics & Detection',
    tagline: 'Simulated Mirai attacks with Suricata IDS rules and forensic analysis',
    description:
      'Simulated Mirai botnet attacks using Security Onion for forensic analysis. Built custom Suricata IDS rules and conducted deep network traffic analysis using Moloch/Arkime. Delivered a comprehensive forensic report covering attack vectors, IoC extraction, and detection signatures.',
    metrics: [],
    tags: ['Security Onion', 'Suricata', 'Moloch/Arkime', 'Forensics', 'Botnet Analysis', 'IDS'],
    color: '#ff4757',
    links: [],
    category: 'course',
  },
  {
    id: 'aws',
    name: 'AWS Security Scanner',
    full: 'AWS Environment Security Auditor',
    tagline: 'Python CLI for scanning AWS environments for misconfigurations',
    description:
      'Command-line tool that scans AWS environments for security misconfigurations across IAM, S3, EC2, Security Groups, and more. Generates prioritized findings with remediation steps.',
    metrics: [],
    tags: ['AWS', 'Python', 'CLI', 'Cloud Security', 'IAM', 'S3'],
    color: '#ffa502',
    links: [
      { label: 'GitHub', href: 'https://github.com/hell-99/aws-security-scanner', primary: true },
    ],
    category: 'course',
  },
  {
    id: 'forensic-timecop',
    name: 'Forensic Time Cop',
    full: 'Anti-Forensics Detection Framework',
    tagline: 'Cross-platform detection of timestomping, log manipulation, and artifact tampering',
    description:
      'Cross-platform anti-forensics detection framework for Windows and Linux. Python rule engine with 5 detection rules targeting MFT timestomping, event log manipulation, prefetch tampering, registry artifacts, and USN journal anomalies. Streamlit/Plotly dashboard for forensic timeline reconstruction. Culminated in a research paper.',
    metrics: [
      { val: '5', label: 'Detection Rules' },
      { val: '2', label: 'Platforms' },
    ],
    tags: ['Digital Forensics', 'Anti-Forensics', 'Python', 'MFT', 'Streamlit', 'Windows', 'Linux'],
    color: '#00ff88',
    links: [],
    category: 'course',
    collaborators: 'Kaivalya & Aarya',
    course: '14-822 Host-Based Forensics · CMU',
  },
  {
    id: 'k8s-guard',
    name: 'K8s-Guard',
    full: 'Kubernetes Threat Detection Lab',
    tagline: 'SIEM-integrated K8s threat detection for container escape and lateral movement',
    description:
      'Kubernetes threat detection environment integrating Security Onion (network security monitoring), Falco (runtime syscall monitoring), and Filebeat. Detected container escape, privilege escalation, and lateral movement scenarios. Handled SIEM architecture and detection engineering.',
    metrics: [],
    tags: ['Kubernetes', 'Falco', 'Security Onion', 'SIEM', 'Filebeat', 'Container Security'],
    color: '#00d2ff',
    links: [],
    category: 'course',
    course: '14-742 AI and Security · CMU',
  },
]

const FEATURED    = PROJECTS.filter(p => p.category === 'featured')
const INDEPENDENT = PROJECTS.filter(p => p.category === 'independent')
const COURSE      = PROJECTS.filter(p => p.category === 'course')

const SKILLS = [
  {
    category: 'Security',
    color: '#ff4757',
    items: ['LLM/Agent Security', 'Intrusion Detection', 'Post-Quantum Cryptography', 'Penetration Testing', 'Cloud Security (AWS)', 'Zero Trust', 'MITRE ATT&CK / ATLAS', 'Digital Forensics', 'Anti-Forensics Detection'],
  },
  {
    category: 'AI & ML',
    color: '#a855f7',
    items: ['XGBoost', 'Random Forest', 'Isolation Forest', 'DBSCAN', 'Ensemble Voting', 'LangChain', 'Intent-Action Analysis', 'Behavioral Analysis'],
  },
  {
    category: 'Engineering',
    color: '#00d2ff',
    items: ['Python', 'TypeScript', 'FastAPI', 'Flask', 'Streamlit', 'Docker', 'Kubernetes', 'SDN/OpenFlow', 'Mininet', 'PostgreSQL'],
  },
  {
    category: 'Tools & Platforms',
    color: '#00ff88',
    items: ['Security Onion', 'Suricata', 'Falco', 'Moloch/Arkime', 'Groq / Ollama', 'AWS', 'Sigma Rules', 'SIEM', 'Jupyter'],
  },
]

const TERMINAL_LINES = [
  { text: '> whoami', color: '#00ff88', delay: 0 },
  { text: 'twinkle_kamdar', color: '#e6edf3', delay: 400 },
  { text: '> cat role.txt', color: '#00ff88', delay: 900 },
  { text: 'Cybersecurity @ Carnegie Mellon University (INI)', color: '#e6edf3', delay: 1300 },
  { text: '> ls projects/', color: '#00ff88', delay: 1900 },
  { text: 'IRIS/  AEGIS/  ZeroSeg/  Mirai/  K8s-Guard/', color: '#00d2ff', delay: 2300 },
  { text: '> cat focus.txt', color: '#00ff88', delay: 2900 },
  { text: 'Building security systems for the AI-native world.', color: '#e6edf3', delay: 3300 },
  { text: '▋', color: '#00ff88', delay: 3800 },
]

// ── Components ───────────────────────────────────────────────────────────────

function Terminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0)

  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    })
  }, [])

  return (
    <div className="card p-6 font-mono text-sm leading-7 max-w-xl w-full glow-green">
      <div className="flex gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red" />
        <div className="w-3 h-3 rounded-full bg-amber" />
        <div className="w-3 h-3 rounded-full bg-green" />
        <span className="ml-2 text-muted text-xs">terminal</span>
      </div>
      {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
        <div key={i} style={{ color: line.color }}>
          {line.text}
        </div>
      ))}
    </div>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-bg/90 backdrop-blur border-b border-border' : ''
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="font-mono font-bold text-green text-lg">TK<span className="text-muted">_</span></span>
        <div className="flex gap-8">
          {['About', 'Projects', 'Skills', 'Contact'].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`}
              className="text-muted hover:text-green transition-colors text-sm font-mono">
              {s}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

function FlipCard({ project }: { project: Project }) {
  const [flipped, setFlipped] = useState(false)
  const FLIP_HEIGHT = 380

  return (
    <div className="rounded-xl border overflow-hidden flex flex-col"
      style={{ background: '#0d1117', borderTop: `3px solid ${project.color}`, borderLeft: '1px solid #21262d', borderRight: '1px solid #21262d', borderBottom: '1px solid #21262d' }}>

      {/* ── Flipping area ── */}
      <div
        className="cursor-pointer"
        style={{ perspective: '1000px', height: `${FLIP_HEIGHT}px`, flexShrink: 0 }}
        onClick={() => setFlipped(f => !f)}
      >
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>

          {/* Front */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', overflow: 'hidden' }}>
            <div className="h-full flex flex-col">
              {project.screenshot ? (
                <div className="w-full overflow-hidden" style={{ height: '160px', flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.screenshot} alt={`${project.name} screenshot`}
                    className="w-full h-full object-cover object-top" style={{ opacity: 0.88 }} />
                </div>
              ) : null}

              <div className="p-6 flex flex-col flex-1">
                <span className="font-mono font-bold text-3xl block mb-1" style={{ color: project.color }}>
                  {project.name}
                </span>
                <p className="text-muted text-xs font-mono uppercase tracking-widest mb-3">{project.full}</p>
                {project.course && (
                  <p className="text-xs font-mono mb-3" style={{ color: project.color, opacity: 0.6 }}>{project.course}</p>
                )}
                <p className="text-text text-sm leading-relaxed mb-4">{project.tagline}</p>

                {project.metrics.length > 0 && (
                  <div className={`grid grid-cols-${Math.min(project.metrics.length, 4)} gap-2 mb-4`}>
                    {project.metrics.map(m => (
                      <div key={m.label} className="text-center p-2 rounded-lg" style={{ background: '#060912' }}>
                        <div className="font-mono font-bold" style={{ color: project.color, fontSize: '0.95rem' }}>{m.val}</div>
                        <div className="text-muted" style={{ fontSize: '0.65rem' }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex justify-end">
                  <span className="text-xs font-mono px-3 py-1 rounded-full border border-border text-muted">
                    ↺ flip to know more
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Back */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden' }}>
            <div className="h-full p-6 flex flex-col" style={{ borderLeft: `2px solid ${project.color}20` }}>
              <p className="text-muted text-sm leading-relaxed flex-1 overflow-auto">{project.description}</p>
              {project.collaborators && (
                <p className="text-xs font-mono mt-3" style={{ color: project.color, opacity: 0.7 }}>
                  with {project.collaborators}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map(t => (
                  <span key={t} className="badge bg-surface text-muted border border-border">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <span className="text-xs font-mono px-3 py-1 rounded-full border border-border text-muted">
                  ↺ flip back
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Always-visible links ── */}
      {project.links.length > 0 && (
        <div className="px-6 py-4 border-t border-border flex flex-wrap gap-3">
          {project.links.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all ${
                l.primary ? 'text-bg hover:opacity-90' : 'border border-border text-muted hover:border-green hover:text-green'
              }`}
              style={l.primary ? { background: project.color } : {}}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionHeader({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <div className="mb-12">
      <div className="font-mono text-green text-sm tracking-widest uppercase mb-3">{label}</div>
      <h2 className="text-4xl font-bold text-text mb-3">{title}</h2>
      <p className="text-muted text-lg max-w-2xl">{sub}</p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    sectionsRef.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el)
  }

  return (
    <main className="min-h-screen bg-bg grid-bg">
      <Nav />

      {/* ── Hero ── */}
      <section id="about" className="min-h-screen flex items-center pt-20">
        <div className="max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="font-mono text-green text-sm mb-4 tracking-widest uppercase">
                &gt; Available for Summer 2027 Internships
              </div>
              <h1 className="text-5xl font-bold leading-tight mb-4">
                <span className="text-text">Twinkle </span>
                <span style={{
                  background: 'linear-gradient(135deg, #00ff88, #00d2ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Kamdar</span>
              </h1>
              <h2 className="text-xl text-muted font-mono mb-6">
                Information Security · AI Security · Carnegie Mellon INI
              </h2>
              <p className="text-text leading-relaxed text-lg mb-6">
                MSIS student at Carnegie Mellon University (INI) specializing in Information Security.
                I build security systems for the AI-native world — LLM agent monitors,
                autonomous IDS/IPS, network microsegmentation, and cloud security tooling.
              </p>
              <p className="text-muted leading-relaxed mb-10">
                The attack surface is shifting from "what the model says" to "what the agent does."
                I'm building the detection layer that catches what existing tools miss.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#projects"
                  className="px-6 py-3 rounded-lg font-mono font-medium text-bg transition-opacity hover:opacity-90"
                  style={{ background: '#00ff88' }}>
                  View Projects
                </a>
                <a href="https://github.com/hell-99" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg font-mono font-medium border border-border text-muted hover:border-green hover:text-green transition-all">
                  GitHub
                </a>
                <a href="https://linkedin.com/in/twinklekamdar" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg font-mono font-medium border border-border text-muted hover:border-blue hover:text-blue transition-all">
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Terminal />
            </div>
          </div>

          <div ref={addRef} className="fade-section grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {[
              { val: '7+',       label: 'Security Projects', color: '#00ff88' },
              { val: 'CMU INI',  label: 'Graduate Program',  color: '#00d2ff' },
              { val: 'Dec 2026', label: 'Graduating',         color: '#a855f7' },
              { val: 'Open',     label: 'To Opportunities',   color: '#ffa502' },
            ].map(s => (
              <div key={s.label} className="card p-6 text-center">
                <div className="font-mono font-bold text-2xl mb-1" style={{ color: s.color }}>{s.val}</div>
                <div className="text-muted text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-24">
        <div className="max-w-6xl mx-auto px-6">

          {/* Featured */}
          <div ref={addRef} className="fade-section">
            <SectionHeader
              label="// featured projects"
              title="Flagship Work"
              sub="End-to-end security systems built from scratch. Production-ready, open source."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {FEATURED.map((p, i) => (
              <div key={p.id} ref={addRef} className="fade-section" style={{ transitionDelay: `${i * 0.1}s` }}>
                <FlipCard project={p} />
              </div>
            ))}
          </div>

          {/* Course */}
          <div ref={addRef} className="fade-section">
            <SectionHeader
              label="// course projects"
              title="CMU Coursework"
              sub="Graduate-level security engineering — threat simulation, detection engineering, and forensics at CMU INI."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {COURSE.map((p, i) => (
              <div key={p.id} ref={addRef} className="fade-section" style={{ transitionDelay: `${i * 0.1}s` }}>
                <FlipCard project={p} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" className="py-24" style={{ background: '#0d1117' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div ref={addRef} className="fade-section">
            <SectionHeader
              label="// skills"
              title="Technical Stack"
              sub="Tools and technologies across security, ML, and engineering."
            />
          </div>
          <div ref={addRef} className="fade-section grid md:grid-cols-2 gap-6">
            {SKILLS.map(skill => (
              <div key={skill.category} className="card p-6" style={{ borderLeft: `3px solid ${skill.color}` }}>
                <h3 className="font-mono font-bold mb-4" style={{ color: skill.color }}>{skill.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map(item => (
                    <span key={item} className="badge bg-surface text-muted border border-border text-xs">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={addRef} className="fade-section text-center max-w-2xl mx-auto">
            <div className="font-mono text-green text-sm tracking-widest uppercase mb-3">// contact</div>
            <h2 className="text-4xl font-bold text-text mb-6">Get In Touch</h2>
            <p className="text-muted text-lg mb-10">
              Open to internships, research collaborations, and full-time roles in
              cybersecurity and AI security. Graduating December 2026.
            </p>
            <div className="card p-8 text-left mb-8">
              <div className="font-mono text-sm space-y-4">
                {[
                  { label: 'Email',    val: 'tkamdar@andrew.cmu.edu',        href: 'mailto:tkamdar@andrew.cmu.edu',        color: '#00ff88' },
                  { label: 'LinkedIn', val: 'linkedin.com/in/twinklekamdar', href: 'https://linkedin.com/in/twinklekamdar', color: '#00d2ff' },
                  { label: 'GitHub',   val: 'github.com/hell-99',            href: 'https://github.com/hell-99',           color: '#a855f7' },
                  { label: 'IRIS Demo',val: 'iris-hell99.streamlit.app',     href: 'https://iris-hell99.streamlit.app',    color: '#ffa502' },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-4">
                    <span className="text-muted w-20">{c.label}</span>
                    <span className="text-border">→</span>
                    <a href={c.href} target="_blank" rel="noopener noreferrer"
                      className="transition-colors hover:opacity-80" style={{ color: c.color }}>
                      {c.val}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <a href="mailto:tkamdar@andrew.cmu.edu"
              className="inline-block px-10 py-4 rounded-lg font-mono font-bold text-bg transition-opacity hover:opacity-90 text-lg"
              style={{ background: 'linear-gradient(135deg, #00ff88, #00d2ff)' }}>
              Say Hello →
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="font-mono text-muted text-sm">Twinkle Kamdar · CMU INI · 2026</span>
          <span className="font-mono text-muted text-sm">Built with Next.js · Deployed on Vercel</span>
        </div>
      </footer>
    </main>
  )
}
