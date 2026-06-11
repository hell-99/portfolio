'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Data ──────────────────────────────────────────────────────────────────────

type Project = {
  id: string; name: string; full: string; tagline: string; description: string
  metrics: { val: string; label: string }[]; tags: string[]; color: string; bg: string
  links: { label: string; href: string; primary: boolean }[]
  category: 'featured' | 'course'; collaborators?: string; course?: string; screenshot?: string
}

const PROJECTS: Project[] = [
  {
    id: 'iris', name: 'IRIS', full: 'Identity Risk Intelligence System',
    tagline: 'Behavioral security monitor for LLM agent systems',
    description: 'Built a 5-layer real-time detection engine that catches indirect prompt injection, cross-agent collusion, and behavioral drift — attacks that bypass every standard defense. Core contribution: intent-action divergence detection using llama-3.3-70b to compare what an agent should do vs what it actually does.',
    metrics: [{ val: '93.1%', label: 'Precision' }, { val: '0.43ms', label: 'Latency' }, { val: '14', label: 'Collusion' }, { val: '894', label: 'Calls' }],
    tags: ['LLM Security', 'Python', 'XGBoost', 'FastAPI', 'Streamlit', 'LangChain'],
    color: '#16a34a', bg: '#f0fdf4',
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
    id: 'aegis', name: 'AEGIS', full: 'Autonomous Cybersecurity Intelligence System',
    tagline: 'Multi-layered autonomous IDS/IPS with post-quantum cryptography',
    description: 'Multi-layered threat detection platform combining rule-based IDS, Isolation Forest, and CICIDS2017-trained Random Forest with ensemble voting. Deployed in a Mininet SDN environment with post-quantum crypto (Dilithium3 + Kyber768), SHA-256 tamper-evident audit ledger, self-healing watchdog, NIST CSF IR automation, and Kubernetes Zero Trust.',
    metrics: [{ val: '3-layer', label: 'ML Ensemble' }, { val: 'PQC', label: 'Post-Quantum' }, { val: 'K8s', label: 'Zero Trust' }, { val: 'NIST CSF', label: 'IR Auto' }],
    tags: ['IDS/IPS', 'Post-Quantum Crypto', 'Kubernetes', 'Ensemble ML', 'SDN/OpenFlow'],
    color: '#7c3aed', bg: '#f5f3ff',
    screenshot: 'https://raw.githubusercontent.com/hell-99/AEGIS/main/Images/Critical.png',
    links: [{ label: 'GitHub', href: 'https://github.com/hell-99/AEGIS', primary: true }],
    category: 'featured',
  },
  {
    id: 'zeroseg', name: 'ZeroSeg', full: 'Live Microsegmentation Monitor',
    tagline: 'ML-driven network microsegmentation with 100% block rate',
    description: 'ML-driven network microsegmentation using XGBoost and DBSCAN on UNSW-NB15. Ryu OpenFlow 1.3 on Mininet with a real-time Flask event-stream dashboard. 95.31% accuracy and 100% cross-segment block rate.',
    metrics: [{ val: '95.31%', label: 'Accuracy' }, { val: '100%', label: 'Block Rate' }],
    tags: ['XGBoost', 'DBSCAN', 'SDN', 'Mininet', 'Flask', 'OpenFlow'],
    color: '#0369a1', bg: '#f0f9ff',
    links: [], category: 'course',
  },
  {
    id: 'mirai', name: 'Mirai Botnet', full: 'Botnet Forensics & Detection',
    tagline: 'Simulated Mirai attacks with Suricata IDS rules and forensic analysis',
    description: 'Simulated Mirai botnet attacks using Security Onion for forensic analysis. Built custom Suricata IDS rules and deep network traffic analysis using Moloch/Arkime. Delivered a comprehensive forensic report covering attack vectors, IoC extraction, and detection signatures.',
    metrics: [], tags: ['Security Onion', 'Suricata', 'Moloch/Arkime', 'Forensics', 'IDS'],
    color: '#be123c', bg: '#fff1f2',
    links: [], category: 'course',
  },
  {
    id: 'aws', name: 'AWS Scanner', full: 'AWS Environment Security Auditor',
    tagline: 'Python CLI for scanning AWS environments for misconfigurations',
    description: 'Command-line tool that scans AWS environments for security misconfigurations across IAM, S3, EC2, Security Groups, and more. Generates prioritized findings with remediation steps.',
    metrics: [], tags: ['AWS', 'Python', 'CLI', 'Cloud Security', 'IAM', 'S3'],
    color: '#b45309', bg: '#fffbeb',
    links: [{ label: 'GitHub', href: 'https://github.com/hell-99/aws-security-scanner', primary: true }],
    category: 'course',
  },
  {
    id: 'forensic-timecop', name: 'Forensic Time Cop', full: 'Anti-Forensics Detection Framework',
    tagline: 'Cross-platform timestomping & log manipulation detection',
    description: 'Cross-platform anti-forensics detection framework for Windows and Linux. Python rule engine targeting MFT timestomping, event log manipulation, prefetch tampering, and USN journal anomalies. Streamlit/Plotly dashboard for timeline reconstruction. Published research paper.',
    metrics: [{ val: '5', label: 'Detection Rules' }, { val: '2', label: 'Platforms' }],
    tags: ['Digital Forensics', 'Anti-Forensics', 'Python', 'MFT', 'Windows', 'Linux'],
    color: '#16a34a', bg: '#f0fdf4',
    links: [], category: 'course', collaborators: 'Kaivalya & Aarya', course: '14-822 Host-Based Forensics · CMU',
  },
  {
    id: 'k8s-guard', name: 'K8s-Guard', full: 'Kubernetes Threat Detection Lab',
    tagline: 'SIEM-integrated K8s detection for container escape & lateral movement',
    description: 'Kubernetes threat detection integrating Security Onion (NSM), Falco (syscall monitoring), and Filebeat. Detected container escape, privilege escalation, and lateral movement. Handled SIEM architecture and detection engineering.',
    metrics: [], tags: ['Kubernetes', 'Falco', 'Security Onion', 'SIEM', 'Filebeat'],
    color: '#0369a1', bg: '#f0f9ff',
    links: [], category: 'course', course: '14-742 AI and Security · CMU',
  },
]

const FEATURED = PROJECTS.filter(p => p.category === 'featured')
const COURSE   = PROJECTS.filter(p => p.category === 'course')

const MARQUEE_ITEMS = ['LLM Security', 'Post-Quantum Crypto', 'IDS/IPS', 'Digital Forensics', 'Zero Trust', 'SIEM', 'XGBoost', 'Kubernetes', 'SDN/OpenFlow', 'Cloud Security', 'MITRE ATT&CK', 'Behavioral Analysis']

const SKILLS = [
  { label: 'LLM / Agent Security',     color: '#fce7f3', text: '#be185d' },
  { label: 'Intrusion Detection',       color: '#f5f3ff', text: '#7c3aed' },
  { label: 'Post-Quantum Cryptography', color: '#ecfdf5', text: '#15803d' },
  { label: 'Digital Forensics',         color: '#eff6ff', text: '#1d4ed8' },
  { label: 'Cloud Security (AWS)',      color: '#fffbeb', text: '#b45309' },
  { label: 'Zero Trust Architecture',   color: '#fff1f2', text: '#be123c' },
  { label: 'MITRE ATT&CK / ATLAS',      color: '#fdf4ff', text: '#7e22ce' },
  { label: 'Python',                    color: '#fce7f3', text: '#be185d' },
  { label: 'XGBoost / Random Forest',   color: '#ecfdf5', text: '#15803d' },
  { label: 'Isolation Forest / DBSCAN', color: '#eff6ff', text: '#1d4ed8' },
  { label: 'LangChain',                 color: '#f5f3ff', text: '#7c3aed' },
  { label: 'FastAPI / Flask',           color: '#fffbeb', text: '#b45309' },
  { label: 'Docker / Kubernetes',       color: '#eff6ff', text: '#1d4ed8' },
  { label: 'SDN / OpenFlow / Mininet',  color: '#ecfdf5', text: '#15803d' },
  { label: 'Security Onion / Suricata', color: '#fff1f2', text: '#be123c' },
  { label: 'Streamlit',                 color: '#fce7f3', text: '#be185d' },
  { label: 'SIEM / Sigma Rules',        color: '#fdf4ff', text: '#7e22ce' },
  { label: 'TypeScript / Next.js',      color: '#fffbeb', text: '#b45309' },
]

// ── Cursor ────────────────────────────────────────────────────────────────────

function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) { dotRef.current.style.left = `${e.clientX}px`; dotRef.current.style.top = `${e.clientY}px` }
    }
    const onEnter = () => ringRef.current?.classList.add('hovering')
    const onLeave = () => ringRef.current?.classList.remove('hovering')
    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a,button').forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave) })
    let raf: number
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (ringRef.current) { ringRef.current.style.left = `${ring.current.x}px`; ringRef.current.style.top = `${ring.current.y}px` }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return <><div ref={dotRef} className="cursor-dot" /><div ref={ringRef} className="cursor-ring" /></>
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: scrolled ? '12px 24px' : '20px 24px',
      transition: 'all 0.3s',
    }}>
      <div style={{
        maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        ...(scrolled ? {
          background: 'rgba(255,251,247,0.85)', backdropFilter: 'blur(20px)',
          borderRadius: '999px', padding: '12px 28px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)',
        } : {}),
      }}>
        <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg,#f472b6,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>tk</span>
        <div style={{ display: 'flex', gap: '32px' }}>
          {['about','projects','skills','contact'].map(s => (
            <a key={s} href={`#${s}`} style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', textDecoration: 'none', textTransform: 'capitalize', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f472b6')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>{s}</a>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ── 3D Tilt ───────────────────────────────────────────────────────────────────

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    ref.current.style.transform = `perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg) scale(1.02)`
  }, [])
  const onLeave = useCallback(() => { if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)' }, [])
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: 'transform 0.15s ease', transformStyle: 'preserve-3d' }}>{children}</div>
}

// ── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <TiltCard>
      <div className="pcard" style={{ border: `1.5px solid ${project.color}30` }}>

        {/* Flip zone */}
        <div style={{ height: '380px', cursor: 'none', perspective: '1000px' }} onClick={() => setFlipped(f => !f)}>
          <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>

            {/* Front */}
            <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', overflow: 'hidden', borderRadius: '22px 22px 0 0' }}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: project.bg }}>
                {project.screenshot && (
                  <div style={{ height: '155px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.screenshot} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${project.bg})` }} />
                  </div>
                )}
                <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: '1.6rem', color: project.color, marginBottom: '4px' }}>{project.name}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: `${project.color}99`, marginBottom: '10px' }}>{project.full}</div>
                  {project.course && <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: project.color, opacity: 0.7, marginBottom: '8px' }}>{project.course}</div>}
                  <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.6, marginBottom: '14px' }}>{project.tagline}</div>

                  {project.metrics.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(project.metrics.length,4)},1fr)`, gap: '8px', marginBottom: '14px' }}>
                      {project.metrics.map(m => (
                        <div key={m.label} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '12px', background: 'rgba(255,255,255,0.7)', border: `1px solid ${project.color}25` }}>
                          <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.85rem', color: project.color }}>{m.val}</div>
                          <div style={{ fontSize: '0.6rem', color: '#9ca3af', marginTop: '2px' }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: project.color, padding: '4px 12px', borderRadius: '999px', background: `${project.color}15`, border: `1px solid ${project.color}30` }}>↺ flip to know more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back */}
            <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden', borderRadius: '22px 22px 0 0' }}>
              <div style={{ height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', background: '#fff', borderLeft: `4px solid ${project.color}` }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.1rem', color: project.color, marginBottom: '12px' }}>{project.name}</div>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.75, flex: 1, overflow: 'auto' }}>{project.description}</p>
                {project.collaborators && <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: project.color, margin: '10px 0', opacity: 0.8 }}>with {project.collaborators}</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0' }}>
                  {project.tags.map(t => (
                    <span key={t} style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.65rem', fontFamily: 'JetBrains Mono', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: `${project.color}12`, color: project.color, border: `1px solid ${project.color}30` }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: project.color, padding: '4px 12px', borderRadius: '999px', background: `${project.color}15`, border: `1px solid ${project.color}30` }}>↺ flip back</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Always-visible links */}
        {project.links.length > 0 && (
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${project.color}20`, display: 'flex', flexWrap: 'wrap', gap: '8px', background: '#fff' }}
            onClick={e => e.stopPropagation()}>
            {project.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '7px 18px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
                  ...(l.primary
                    ? { background: project.color, color: '#fff', boxShadow: `0 4px 16px ${project.color}50` }
                    : { background: `${project.color}12`, color: project.color, border: `1px solid ${project.color}30` }),
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
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
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }), { threshold: 0.1 })
    fadeRefs.current.forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])
  const addFade = (el: HTMLDivElement | null) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el) }

  return (
    <>
      <div className="aurora">
        <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
        <div className="blob blob-4" /><div className="blob blob-5" />
      </div>
      <Cursor />
      <Nav />

      <main style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Hero ── */}
        <section id="about" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px', textAlign: 'center' }}>
          <div style={{ maxWidth: '680px', width: '100%' }}>

            {/* Photo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
              <div className="avatar-ring" style={{ width: '110px', height: '110px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://avatars.githubusercontent.com/u/167800111?v=4" alt="Twinkle Kamdar" />
              </div>
            </div>

            {/* Badge */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 18px', borderRadius: '999px', background: '#fce7f3', color: '#be185d', border: '1px solid #fbcfe8', fontWeight: 600 }}>
                ✦ Open to Summer 2027 Internships
              </span>
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(3.2rem,8vw,5.5rem)', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
              <span style={{ background: 'linear-gradient(135deg, #f472b6 0%, #8b5cf6 50%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Twinkle Kamdar
              </span>
            </h1>

            {/* Sub */}
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '20px', textTransform: 'uppercase' }}>
              MSIS · Information Security · Carnegie Mellon INI
            </p>

            <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: 1.8, marginBottom: '36px' }}>
              I build security systems for the AI-native world —<br />
              LLM agent monitors, autonomous IDS/IPS, and forensics tooling.<br />
              <span style={{ color: '#f472b6', fontWeight: 600 }}>The attack surface is shifting. I'm building what catches it.</span>
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
              <a href="#projects" style={{ padding: '12px 28px', borderRadius: '999px', background: 'linear-gradient(135deg, #f472b6, #8b5cf6)', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 8px 32px rgba(244,114,182,0.35)', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                View Projects ↓
              </a>
              <a href="https://github.com/hell-99" target="_blank" rel="noopener noreferrer"
                style={{ padding: '12px 24px', borderRadius: '999px', background: '#fff', color: '#374151', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', border: '1.5px solid #e5e7eb', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f472b6'; (e.currentTarget as HTMLElement).style.color = '#f472b6' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLElement).style.color = '#374151' }}>
                GitHub
              </a>
              <a href="https://linkedin.com/in/twinklekamdar" target="_blank" rel="noopener noreferrer"
                style={{ padding: '12px 24px', borderRadius: '999px', background: '#fff', color: '#374151', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', border: '1.5px solid #e5e7eb', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#8b5cf6'; (e.currentTarget as HTMLElement).style.color = '#8b5cf6' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLElement).style.color = '#374151' }}>
                LinkedIn
              </a>
            </div>

            {/* Stats */}
            <div ref={addFade} className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
              {[
                { val: '7+', label: 'Projects', bg: '#fce7f3', color: '#be185d' },
                { val: 'CMU', label: 'Graduate Program', bg: '#f5f3ff', color: '#7c3aed' },
                { val: 'Dec 2026', label: 'Graduating', bg: '#ecfdf5', color: '#15803d' },
                { val: 'Open', label: 'To Opportunities', bg: '#eff6ff', color: '#1d4ed8' },
              ].map(s => (
                <div key={s.label} style={{ padding: '18px 10px', textAlign: 'center', borderRadius: '16px', background: s.bg, border: `1px solid ${s.color}20` }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1rem', color: s.color, marginBottom: '4px' }}>{s.val}</div>
                  <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Marquee ── */}
        <div style={{ overflow: 'hidden', borderTop: '1px solid #f3e8ff', borderBottom: '1px solid #f3e8ff', background: '#fdf4ff', padding: '14px 0' }}>
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} style={{ padding: '0 32px', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: i % 3 === 0 ? '#f472b6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4', whiteSpace: 'nowrap' }}>
                {item} <span style={{ opacity: 0.4 }}>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Featured Projects ── */}
        <section id="projects" style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div ref={addFade} className="fade-up" style={{ marginBottom: '56px' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f472b6', fontWeight: 700 }}>✦ featured projects</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(2.2rem,5vw,3.2rem)', letterSpacing: '-0.02em', marginTop: '8px', marginBottom: '8px' }}>Flagship Work</h2>
              <p style={{ color: '#6b7280', maxWidth: '420px', fontSize: '1rem' }}>End-to-end security systems. Production-ready, open source.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(460px,1fr))', gap: '24px' }}>
              {FEATURED.map((p, i) => (
                <div key={p.id} ref={addFade} className="fade-up" style={{ transitionDelay: `${i*0.1}s` }}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Course Projects ── */}
        <section style={{ padding: '80px 24px', background: '#faf9ff' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div ref={addFade} className="fade-up" style={{ marginBottom: '56px' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8b5cf6', fontWeight: 700 }}>✦ coursework</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(2.2rem,5vw,3.2rem)', letterSpacing: '-0.02em', marginTop: '8px', marginBottom: '8px' }}>CMU Projects</h2>
              <p style={{ color: '#6b7280', maxWidth: '420px', fontSize: '1rem' }}>Graduate-level security engineering at Carnegie Mellon INI.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '20px' }}>
              {COURSE.map((p, i) => (
                <div key={p.id} ref={addFade} className="fade-up" style={{ transitionDelay: `${i*0.08}s` }}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="skills" style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div ref={addFade} className="fade-up" style={{ marginBottom: '48px' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#10b981', fontWeight: 700 }}>✦ skills</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(2.2rem,5vw,3.2rem)', letterSpacing: '-0.02em', marginTop: '8px' }}>Technical Stack</h2>
            </div>
            <div ref={addFade} className="fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {SKILLS.map(s => (
                <span key={s.label} className="pill" style={{ background: s.color, color: s.text, border: `1px solid ${s.text}25` }}>{s.label}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" style={{ padding: '100px 24px 120px', background: '#fdf4ff' }}>
          <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
            <div ref={addFade} className="fade-up">
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f472b6', fontWeight: 700 }}>✦ contact</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(2.2rem,5vw,3.2rem)', letterSpacing: '-0.02em', margin: '8px 0 14px' }}>Say Hello ✦</h2>
              <p style={{ color: '#6b7280', lineHeight: 1.8, marginBottom: '48px' }}>
                Open to internships, research, and full-time roles in cybersecurity and AI security. Graduating December 2026.
              </p>

              <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', marginBottom: '32px', textAlign: 'left', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', border: '1px solid #fce7f3' }}>
                {[
                  { label: 'Email',     val: 'tkamdar@andrew.cmu.edu',        href: 'mailto:tkamdar@andrew.cmu.edu',        color: '#f472b6' },
                  { label: 'LinkedIn',  val: 'linkedin.com/in/twinklekamdar', href: 'https://linkedin.com/in/twinklekamdar', color: '#8b5cf6' },
                  { label: 'GitHub',    val: 'github.com/hell-99',            href: 'https://github.com/hell-99',           color: '#10b981' },
                  { label: 'IRIS Demo', val: 'iris-hell99.streamlit.app',     href: 'https://iris-hell99.streamlit.app',    color: '#0ea5e9' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color: '#9ca3af', width: '64px', flexShrink: 0 }}>{c.label}</span>
                    <span style={{ color: '#d1d5db', fontSize: '0.8rem' }}>→</span>
                    <a href={c.href} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: c.color, textDecoration: 'none', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                      {c.val}
                    </a>
                  </div>
                ))}
              </div>

              <a href="mailto:tkamdar@andrew.cmu.edu"
                style={{ display: 'inline-block', padding: '14px 44px', borderRadius: '999px', background: 'linear-gradient(135deg, #f472b6, #8b5cf6)', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '1rem', boxShadow: '0 8px 32px rgba(244,114,182,0.35)', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                Get In Touch →
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #f3e8ff' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color: '#d1d5db' }}>
            Twinkle Kamdar · CMU INI · 2026 · Built with Next.js
          </span>
        </footer>
      </main>
    </>
  )
}
