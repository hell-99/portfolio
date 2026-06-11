'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

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
  category: 'featured' | 'course'
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
    description: 'Built a 5-layer real-time detection engine that catches indirect prompt injection, cross-agent collusion, and behavioral drift — attacks that bypass every standard defense. Core contribution: intent-action divergence detection using llama-3.3-70b to compare what an agent should do vs what it actually does.',
    metrics: [
      { val: '93.1%', label: 'Precision' },
      { val: '0.43ms', label: 'Latency' },
      { val: '14', label: 'Collusion Patterns' },
      { val: '894', label: 'Calls Monitored' },
    ],
    tags: ['LLM Security', 'Python', 'XGBoost', 'FastAPI', 'Streamlit', 'LangChain'],
    color: '#86efac',
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
    description: 'Multi-layered threat detection platform combining rule-based IDS, Isolation Forest anomaly detection, and CICIDS2017-trained Random Forest with ensemble voting. Deployed in a Mininet SDN environment with post-quantum cryptographic pipeline (Dilithium3 + Kyber768), SHA-256 tamper-evident audit ledger, self-healing watchdog, NIST CSF IR automation, Kubernetes Zero Trust, and a live SOC dashboard.',
    metrics: [
      { val: '3-layer', label: 'ML Ensemble' },
      { val: 'PQC', label: 'Post-Quantum Crypto' },
      { val: 'K8s', label: 'Zero Trust' },
      { val: 'NIST CSF', label: 'IR Automation' },
    ],
    tags: ['IDS/IPS', 'Post-Quantum Crypto', 'Kubernetes', 'Ensemble ML', 'SDN/OpenFlow', 'Mininet'],
    color: '#c4b5fd',
    screenshot: 'https://raw.githubusercontent.com/hell-99/AEGIS/main/Images/Critical.png',
    links: [{ label: 'GitHub', href: 'https://github.com/hell-99/AEGIS', primary: true }],
    category: 'featured',
  },
  {
    id: 'zeroseg',
    name: 'ZeroSeg',
    full: 'Live Microsegmentation Monitor',
    tagline: 'ML-driven network microsegmentation with real-time enforcement',
    description: 'ML-driven network microsegmentation system using XGBoost and DBSCAN clustering on the UNSW-NB15 dataset. Ryu OpenFlow 1.3 controller on Mininet with a real-time Flask event-stream dashboard. Achieved 95.31% classification accuracy and 100% cross-segment block rate.',
    metrics: [
      { val: '95.31%', label: 'Accuracy' },
      { val: '100%', label: 'Block Rate' },
    ],
    tags: ['XGBoost', 'DBSCAN', 'SDN', 'Mininet', 'Flask', 'OpenFlow'],
    color: '#93c5fd',
    links: [],
    category: 'course',
  },
  {
    id: 'mirai',
    name: 'Mirai Botnet',
    full: 'Botnet Forensics & Detection',
    tagline: 'Simulated Mirai attacks with Suricata IDS rules and forensic analysis',
    description: 'Simulated Mirai botnet attacks using Security Onion for forensic analysis. Built custom Suricata IDS rules and conducted deep network traffic analysis using Moloch/Arkime. Delivered a comprehensive forensic report covering attack vectors, IoC extraction, and detection signatures.',
    metrics: [],
    tags: ['Security Onion', 'Suricata', 'Moloch/Arkime', 'Forensics', 'IDS'],
    color: '#fda4af',
    links: [],
    category: 'course',
  },
  {
    id: 'aws',
    name: 'AWS Scanner',
    full: 'AWS Environment Security Auditor',
    tagline: 'Python CLI for scanning AWS environments for misconfigurations',
    description: 'Command-line tool that scans AWS environments for security misconfigurations across IAM, S3, EC2, Security Groups, and more. Generates prioritized findings with remediation steps.',
    metrics: [],
    tags: ['AWS', 'Python', 'CLI', 'Cloud Security', 'IAM', 'S3'],
    color: '#fcd34d',
    links: [{ label: 'GitHub', href: 'https://github.com/hell-99/aws-security-scanner', primary: true }],
    category: 'course',
  },
  {
    id: 'forensic-timecop',
    name: 'Forensic Time Cop',
    full: 'Anti-Forensics Detection Framework',
    tagline: 'Cross-platform detection of timestomping, log manipulation & artifact tampering',
    description: 'Cross-platform anti-forensics detection framework for Windows and Linux. Python rule engine with 5 detection rules targeting MFT timestomping, event log manipulation, prefetch tampering, registry artifacts, and USN journal anomalies. Streamlit/Plotly dashboard for forensic timeline reconstruction. Culminated in a research paper.',
    metrics: [
      { val: '5', label: 'Detection Rules' },
      { val: '2', label: 'Platforms' },
    ],
    tags: ['Digital Forensics', 'Anti-Forensics', 'Python', 'MFT', 'Windows', 'Linux'],
    color: '#86efac',
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
    description: 'Kubernetes threat detection environment integrating Security Onion (NSM), Falco (runtime syscall monitoring), and Filebeat. Detected container escape, privilege escalation, and lateral movement. Handled SIEM architecture and detection engineering.',
    metrics: [],
    tags: ['Kubernetes', 'Falco', 'Security Onion', 'SIEM', 'Filebeat', 'Container Security'],
    color: '#93c5fd',
    links: [],
    category: 'course',
    course: '14-742 AI and Security · CMU',
  },
]

const FEATURED = PROJECTS.filter(p => p.category === 'featured')
const COURSE   = PROJECTS.filter(p => p.category === 'course')

const SKILLS = [
  { label: 'LLM / Agent Security',        color: '#f9a8d4' },
  { label: 'Intrusion Detection',          color: '#c4b5fd' },
  { label: 'Post-Quantum Cryptography',    color: '#86efac' },
  { label: 'Digital Forensics',            color: '#93c5fd' },
  { label: 'Cloud Security (AWS)',          color: '#fcd34d' },
  { label: 'Zero Trust Architecture',      color: '#fda4af' },
  { label: 'MITRE ATT&CK / ATLAS',         color: '#c4b5fd' },
  { label: 'Python',                        color: '#86efac' },
  { label: 'XGBoost / Random Forest',      color: '#f9a8d4' },
  { label: 'Isolation Forest / DBSCAN',    color: '#93c5fd' },
  { label: 'LangChain',                    color: '#fda4af' },
  { label: 'FastAPI / Flask',              color: '#fcd34d' },
  { label: 'Docker / Kubernetes',          color: '#c4b5fd' },
  { label: 'SDN / OpenFlow / Mininet',     color: '#86efac' },
  { label: 'Security Onion / Suricata',    color: '#f9a8d4' },
  { label: 'Streamlit',                    color: '#93c5fd' },
  { label: 'SIEM / Sigma Rules',           color: '#fcd34d' },
  { label: 'TypeScript / Next.js',         color: '#c4b5fd' },
]

// ── Custom Cursor ─────────────────────────────────────────────────────────────

function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top  = `${e.clientY}px`
      }
    }
    const onEnter = () => ringRef.current?.classList.add('hovering')
    const onLeave = () => ringRef.current?.classList.remove('hovering')

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    let raf: number
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`
        ringRef.current.style.top  = `${ring.current.y}px`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className={`max-w-5xl mx-auto px-6 flex items-center justify-between transition-all duration-500 ${
        scrolled ? 'glass rounded-2xl py-3 px-6' : ''
      }`}>
        <span className="font-mono font-bold text-lg" style={{
          background: 'linear-gradient(135deg, #f9a8d4, #c4b5fd)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>tk.</span>
        <div className="flex items-center gap-8">
          {['about', 'projects', 'skills', 'contact'].map(s => (
            <a key={s} href={`#${s}`}
              className="text-sm font-medium capitalize transition-colors"
              style={{ color: 'rgba(241,240,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f9a8d4')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,240,255,0.5)')}>
              {s}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    ref.current.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`
  }, [])

  const onLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
  }, [])

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform 0.15s ease', transformStyle: 'preserve-3d', willChange: 'transform' }}>
      {children}
    </div>
  )
}

// ── Flip Project Card ─────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const [flipped, setFlipped] = useState(false)
  const FLIP_H = 400

  return (
    <TiltCard>
      <div className="rounded-2xl overflow-hidden flex flex-col glass"
        style={{ borderTop: `2px solid ${project.color}40` }}>

        {/* Flipping area */}
        <div style={{ perspective: '1000px', height: `${FLIP_H}px`, cursor: 'none' }}
          onClick={() => setFlipped(f => !f)}>
          <div style={{
            position: 'relative', width: '100%', height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
          }}>

            {/* Front */}
            <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', overflow: 'hidden' }}>
              <div className="h-full flex flex-col">
                {project.screenshot && (
                  <div style={{ height: '160px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.screenshot} alt={project.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.8 }} />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, #09091a)` }} />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-mono font-bold text-2xl" style={{ color: project.color }}>{project.name}</span>
                  </div>
                  <p style={{ color: 'rgba(241,240,255,0.35)', fontSize: '0.65rem', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    {project.full}
                  </p>
                  {project.course && (
                    <p style={{ color: project.color, opacity: 0.6, fontSize: '0.7rem', fontFamily: 'JetBrains Mono', marginBottom: '10px' }}>{project.course}</p>
                  )}
                  <p style={{ color: 'rgba(241,240,255,0.75)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>{project.tagline}</p>

                  {project.metrics.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(project.metrics.length, 4)}, 1fr)`, gap: '8px', marginBottom: '16px' }}>
                      {project.metrics.map(m => (
                        <div key={m.label} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.95rem', color: project.color }}>{m.val}</div>
                          <div style={{ fontSize: '0.6rem', color: 'rgba(241,240,255,0.4)', marginTop: '2px' }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{
                      fontSize: '0.7rem', fontFamily: 'JetBrains Mono',
                      color: 'rgba(241,240,255,0.3)', padding: '4px 12px',
                      borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)',
                    }}>↺ flip to know more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back */}
            <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden' }}>
              <div className="h-full p-6 flex flex-col" style={{ borderLeft: `2px solid ${project.color}30` }}>
                <p style={{ color: 'rgba(241,240,255,0.7)', fontSize: '0.875rem', lineHeight: 1.7, flex: 1, overflow: 'auto' }}>{project.description}</p>
                {project.collaborators && (
                  <p style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono', color: project.color, opacity: 0.6, margin: '12px 0' }}>with {project.collaborators}</p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0' }}>
                  {project.tags.map(t => <span key={t} className="badge">{t}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{
                    fontSize: '0.7rem', fontFamily: 'JetBrains Mono',
                    color: 'rgba(241,240,255,0.3)', padding: '4px 12px',
                    borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)',
                  }}>↺ flip back</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Always-visible links */}
        {project.links.length > 0 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}
            onClick={e => e.stopPropagation()}>
            {project.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                className={l.primary ? 'btn-primary' : 'btn-glass'}
                style={l.primary ? { background: `linear-gradient(135deg, ${project.color}, ${project.color}aa)`, fontSize: '0.8rem', padding: '7px 18px' } : { fontSize: '0.8rem', padding: '7px 18px' }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </TiltCard>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const fadeRefs = useRef<Element[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    fadeRefs.current.forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const addFade = (el: HTMLDivElement | null) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el)
  }

  return (
    <>
      {/* Aurora + noise */}
      <div className="aurora">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="blob blob-5" />
      </div>
      <div className="noise" />

      <Cursor />
      <Nav />

      <main style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Hero ── */}
        <section id="about" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
          <div style={{ maxWidth: '700px', width: '100%', textAlign: 'center' }}>

            {/* Photo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div className="avatar-ring" style={{ width: '120px', height: '120px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://avatars.githubusercontent.com/u/167800111?v=4" alt="Twinkle Kamdar" />
              </div>
            </div>

            {/* Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <span style={{
                fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', padding: '6px 16px', borderRadius: '999px',
                background: 'rgba(249,168,212,0.1)', border: '1px solid rgba(249,168,212,0.25)',
                color: '#f9a8d4',
              }}>✦ Available for Summer 2027 Internships</span>
            </div>

            {/* Name */}
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              <span className="grad-text">Twinkle Kamdar</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem', color: 'rgba(241,240,255,0.45)', letterSpacing: '0.08em', marginBottom: '24px' }}>
              MSIS · Information Security · Carnegie Mellon INI
            </p>

            <p style={{ fontSize: '1.1rem', color: 'rgba(241,240,255,0.65)', lineHeight: 1.75, maxWidth: '520px', margin: '0 auto 40px' }}>
              I build security systems for the AI-native world — LLM agent monitors,
              autonomous IDS/IPS, and forensics tooling. The attack surface is shifting.
              I'm building the detection layer that catches what existing tools miss.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#projects" className="btn-primary">View Projects ↓</a>
              <a href="https://github.com/hell-99" target="_blank" rel="noopener noreferrer" className="btn-glass">GitHub</a>
              <a href="https://linkedin.com/in/twinklekamdar" target="_blank" rel="noopener noreferrer" className="btn-glass">LinkedIn</a>
            </div>

            {/* Stats */}
            <div ref={addFade} className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginTop: '64px' }}>
              {[
                { val: '7+',        label: 'Projects',        color: '#f9a8d4' },
                { val: 'CMU INI',   label: 'Graduate Program', color: '#c4b5fd' },
                { val: 'Dec 2026',  label: 'Graduating',       color: '#86efac' },
                { val: 'Open',      label: 'To Opportunities', color: '#93c5fd' },
              ].map(s => (
                <div key={s.label} className="glass" style={{ padding: '20px 12px', textAlign: 'center', borderRadius: '16px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.1rem', color: s.color, marginBottom: '4px' }}>{s.val}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(241,240,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Projects ── */}
        <section id="projects" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div ref={addFade} className="fade-up" style={{ marginBottom: '48px' }}>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#f9a8d4', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                ✦ featured projects
              </p>
              <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Flagship Work</h2>
              <p style={{ color: 'rgba(241,240,255,0.5)', marginTop: '8px', maxWidth: '480px' }}>
                End-to-end security systems built from scratch. Production-ready, open source.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
              {FEATURED.map((p, i) => (
                <div key={p.id} ref={addFade} className="fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Course Projects ── */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div ref={addFade} className="fade-up" style={{ marginBottom: '48px' }}>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#c4b5fd', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                ✦ coursework
              </p>
              <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>CMU Projects</h2>
              <p style={{ color: 'rgba(241,240,255,0.5)', marginTop: '8px', maxWidth: '480px' }}>
                Graduate-level security engineering at Carnegie Mellon INI.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {COURSE.map((p, i) => (
                <div key={p.id} ref={addFade} className="fade-up" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="skills" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div ref={addFade} className="fade-up" style={{ marginBottom: '48px' }}>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#86efac', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                ✦ skills
              </p>
              <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Technical Stack</h2>
            </div>
            <div ref={addFade} className="fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {SKILLS.map(s => (
                <span key={s.label} style={{
                  padding: '8px 18px', borderRadius: '999px',
                  fontFamily: 'JetBrains Mono', fontSize: '0.72rem',
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: `${s.color}12`,
                  border: `1px solid ${s.color}35`,
                  color: s.color,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${s.color}25`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${s.color}12`; (e.currentTarget as HTMLElement).style.transform = 'none' }}
                >{s.label}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" style={{ padding: '80px 24px 120px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div ref={addFade} className="fade-up">
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#fda4af', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                ✦ contact
              </p>
              <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '16px' }}>Say Hello ✦</h2>
              <p style={{ color: 'rgba(241,240,255,0.5)', lineHeight: 1.7, marginBottom: '48px' }}>
                Open to internships, research, and full-time roles in cybersecurity and AI security.
                Graduating December 2026.
              </p>

              <div className="glass" style={{ padding: '32px', marginBottom: '32px', textAlign: 'left' }}>
                {[
                  { label: 'Email',     val: 'tkamdar@andrew.cmu.edu',        href: 'mailto:tkamdar@andrew.cmu.edu',        color: '#f9a8d4' },
                  { label: 'LinkedIn',  val: 'linkedin.com/in/twinklekamdar', href: 'https://linkedin.com/in/twinklekamdar', color: '#c4b5fd' },
                  { label: 'GitHub',    val: 'github.com/hell-99',            href: 'https://github.com/hell-99',           color: '#86efac' },
                  { label: 'IRIS Demo', val: 'iris-hell99.streamlit.app',     href: 'https://iris-hell99.streamlit.app',    color: '#93c5fd' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: 'rgba(241,240,255,0.3)', width: '70px' }}>{c.label}</span>
                    <span style={{ color: 'rgba(241,240,255,0.2)' }}>→</span>
                    <a href={c.href} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: c.color, transition: 'opacity 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                      {c.val}
                    </a>
                  </div>
                ))}
              </div>

              <a href="mailto:tkamdar@andrew.cmu.edu" className="btn-primary"
                style={{ fontSize: '1rem', padding: '14px 40px' }}>
                Get In Touch →
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: 'rgba(241,240,255,0.2)' }}>
            Twinkle Kamdar · CMU INI · 2026 · Built with Next.js
          </span>
        </footer>
      </main>
    </>
  )
}
