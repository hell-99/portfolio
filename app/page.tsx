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
    id: 'malware-lab', name: 'Malware Analysis Lab', full: 'Cross-Platform Malware Analysis: XMRig & OceanLotus (APT32)',
    tagline: 'Static + dynamic malware analysis across Linux and macOS with custom detection engineering',
    description: 'Conducted static and dynamic analysis of XMRig (Linux ELF cryptominer) via strace, tcpdump, and objdump in an isolated VM sandbox, confirming live C2 connection behavior, hardware-fingerprinting patterns, and container-evasion techniques. Designed a family-level YARA rule generalizing beyond XMRig to two independent miner codebases (xmr-stak, cgminer) with 0% false positives across a 1,319-binary clean corpus, and validated a complementary behavioral signal live via auditd. Performed static analysis of two OceanLotus (APT32) macOS variants (2014, 2017), identifying AES-128 encrypted C2 and quantifying the actor\'s 3-year TTP evolution from dropper to self-contained backdoor. Authored full CTI reports with MITRE ATT&CK mapping and integrated findings into IRIS as a live detection endpoint.',
    metrics: [{ val: '0%', label: 'False Positives' }, { val: '3', label: 'Miner Families' }, { val: '2.5×', label: 'APT TTP Growth' }, { val: '21', label: 'ATT&CK TTPs' }],
    tags: ['Malware Analysis', 'YARA', 'MITRE ATT&CK', 'Linux', 'macOS', 'Mach-O', 'Detection Engineering', 'auditd'],
    color: '#991b1b', bg: '#fef2f2',
    screenshot: '/screenshots/malware-lab.png',
    links: [
      { label: 'Report', href: '/malware-analysis-report.html', primary: true },
      { label: 'GitHub', href: 'https://github.com/hell-99/malware-analysis-lab', primary: false },
    ],
    category: 'featured',
  },
  {
    id: 'iris', name: 'IRIS', full: 'Identity Risk Intelligence System',
    tagline: 'Behavioral security monitor for LLM agent systems',
    description: 'Built a 5-layer real-time detection engine that catches indirect prompt injection, cross-agent collusion, and behavioral drift — attacks that bypass every standard defense. Core contribution: intent-action divergence detection using llama-3.3-70b to compare what an agent should do vs what it actually does. Red-teamed with Garak: 18 adversarial probes across 5 attack categories, 18/18 detected, zero bypasses. Every detection auto-mapped to the Lockheed Martin Cyber Kill Chain via MITRE ATLAS.',
    metrics: [{ val: '93.1%', label: 'Precision' }, { val: '18/18', label: 'Red Team' }, { val: '14', label: 'Collusion' }, { val: '894', label: 'Calls' }],
    tags: ['LLM Security', 'Python', 'FastAPI', 'Streamlit', 'LangChain', 'Garak', 'Kill Chain'],
    color: '#16a34a', bg: '#f0fdf4',
    screenshot: '/screenshots/iris.png',
    links: [
      { label: 'Live Demo', href: 'https://iris-hell99.streamlit.app', primary: true },
      { label: '▶ Demo Video', href: 'https://youtu.be/nqiDZgpAdyM', primary: false },
      { label: 'GitHub', href: 'https://github.com/hell-99/IRIS', primary: false },
      { label: 'Medium Article', href: 'https://medium.com/@debugcigcode/my-ai-agent-passed-every-security-check-then-it-stole-my-credentials-069e3099cb4a', primary: false },
      { label: 'pip install iris-security', href: 'https://pypi.org/project/iris-security/', primary: false },
    ],
    category: 'featured',
  },
  {
    id: 'aegis', name: 'AEGIS', full: 'Autonomous Cybersecurity Intelligence System',
    tagline: 'Multi-layered autonomous IDS/IPS with post-quantum cryptography',
    description: 'Multi-layered threat detection platform combining rule-based IDS, Isolation Forest, and CICIDS2017-trained Random Forest with ensemble voting. Deployed in a Mininet SDN environment with post-quantum crypto (Dilithium3 + Kyber768), SHA-256 tamper-evident audit ledger, self-healing watchdog, NIST CSF IR automation, and Kubernetes Zero Trust. XDR correlator maps detections to the Lockheed Martin Cyber Kill Chain in real-time across AEGIS, IRIS, and AWS Scanner. SOAR layer automates threat response with AbuseIPDB enrichment and SLA-tiered playbooks.',
    metrics: [{ val: '3-layer', label: 'ML Ensemble' }, { val: 'PQC', label: 'Post-Quantum' }, { val: 'Kill Chain', label: 'XDR Mapped' }, { val: 'SOAR', label: 'Auto-Response' }],
    tags: ['IDS/IPS', 'Post-Quantum Crypto', 'Kill Chain', 'SOAR', 'XDR', 'Ensemble ML', 'SDN/OpenFlow'],
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
    screenshot: '/screenshots/zeroseg.png',
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
    screenshot: '/screenshots/forensic.png',
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

const MARQUEE_ITEMS = ['LLM Security', 'Post-Quantum Crypto', 'IDS/IPS', 'Garak Red Team', 'Kill Chain', 'Digital Forensics', 'Zero Trust', 'SIEM', 'XGBoost', 'Kubernetes', 'SDN/OpenFlow', 'Cloud Security', 'MITRE ATLAS', 'Behavioral Analysis']

type SkillCat = { label: string; color: string; bg: string; skills: string[] }
const SKILL_CATEGORIES: SkillCat[] = [
  { label: 'Languages',               color: '#be185d', bg: '#fce7f3', skills: ['Python', 'C', 'C++', 'Java', 'SQL', 'Bash'] },
  { label: 'Security Tools',          color: '#7c3aed', bg: '#f5f3ff', skills: ['Wireshark', 'tshark', 'Suricata', 'Security Onion', 'Moloch/Arkime', 'Falco', 'Filebeat', 'ExifTool', 'KAPE', 'MFTECmd', 'analyzeMFT', 'python-evtx', 'pfSense', 'FortiGate'] },
  { label: 'ML / AI',                 color: '#0369a1', bg: '#f0f9ff', skills: ['XGBoost', 'Random Forest', 'Isolation Forest', 'DBSCAN', 'scikit-learn', 'LangChain', 'LangGraph', 'Groq API', 'Ollama', 'Qwen3', 'Garak'] },
  { label: 'Cloud & Infrastructure',  color: '#15803d', bg: '#ecfdf5', skills: ['GCP', 'Azure', 'AWS', 'Docker', 'Kubernetes', 'Colima', 'Mininet', 'GNS3', 'OpenFlow/Ryu', 'Faucet/OVS', 'Ansible', 'Salt'] },
  { label: 'Web & APIs',              color: '#b45309', bg: '#fffbeb', skills: ['FastAPI', 'Flask', 'Streamlit', 'Plotly', 'Next.js', 'TypeScript'] },
  { label: 'Frameworks & Standards',  color: '#be123c', bg: '#fff1f2', skills: ['NIST CSF', 'PCI DSS v4.0.1', 'SOC 2', 'MITRE ATT&CK', 'MITRE ATLAS', 'Cyber Kill Chain', 'CVSS', 'CWE', 'IRS Pub 1075', 'SSAE18'] },
  { label: 'Digital Forensics',       color: '#7e22ce', bg: '#fdf4ff', skills: ['Windows Forensics', 'Linux Forensics', 'MFT Analysis', 'EVTX Analysis', 'Android Forensics', 'Timeline Reconstruction', 'Anti-Forensics Detection'] },
  { label: 'Compliance',              color: '#0891b2', bg: '#ecfeff', skills: ['Scrut', 'Coalition', 'draw.io', 'Microsoft Forms'] },
]

type TimelineItem = { type: 'work' | 'education'; org: string; role: string; period: string; location: string; color: string; bg: string; bullets?: string[]; tags: string[]; gpa?: string; detail?: string }

const TIMELINE: TimelineItem[] = [
  {
    type: 'work', org: 'Floatbot.AI', role: 'Security Analyst Intern',
    period: 'May 2026 – Present', location: 'Remote · Milpitas, CA',
    color: '#7c3aed', bg: '#f5f3ff',
    bullets: [
      'Building PCI DSS v4.0.1 compliance infrastructure: controls tracker, evidence mapping, and scoping documents across GCP US, Azure UAE, and GCP India CDE environments',
      'Completed Coalition cyber insurance checklist across all domains: access control, SAT, endpoint security, network controls, and incident response',
      'Drafted System Security Plan for FTI protection with network architecture diagrams in draw.io',
      'Produced WAF vendor comparison, TWFG security questionnaire responses, and IRS Pub 1075 training materials',
    ],
    tags: ['PCI DSS v4.0.1', 'GCP', 'Azure', 'IRS Pub 1075', 'Compliance'],
  },
  {
    type: 'education', org: 'Carnegie Mellon University', role: 'M.S. Information Security · INI',
    period: 'Aug 2025 – Dec 2026', location: 'Pittsburgh, PA',
    color: '#be185d', bg: '#fce7f3',
    detail: 'Intro to Information Security · Host-Based Forensics · Security in Networked Systems · AI & Security · Cloud Security · Network Forensics',
    tags: ['MSIS', 'Cybersecurity', 'Machine Learning', 'Cryptography'],
  },
  {
    type: 'work', org: 'Silver Touch Technologies', role: 'SOC Intern',
    period: 'May – Jul 2024', location: 'India',
    color: '#0369a1', bg: '#f0f9ff',
    bullets: [
      'Triaged security alerts and monitored network traffic using Wireshark, tshark, and Moloch/Arkime in a 24/7 SOC environment',
      'Supported VAPT assessments and tracked 50+ CVEs across internal ticketing systems',
      'Worked with SIEM tooling and Suricata IDS/IPS rules for threat detection',
    ],
    tags: ['SIEM', 'Suricata', 'Wireshark', 'VAPT', 'CVE Tracking'],
  },
  {
    type: 'work', org: 'PDEU Deepfake Forensics Lab', role: 'Research Assistant',
    period: '2024 – 2025', location: 'Gandhinagar, India',
    color: '#be123c', bg: '#fff1f2',
    bullets: [
      'Assisted faculty with literature review and dataset management for deepfake detection research',
      'Maintained experimental records and supported research reports and presentations',
    ],
    tags: ['Deepfake Detection', 'Research', 'Python'],
  },
  {
    type: 'education', org: 'Pandit Deendayal Energy University', role: 'B.Tech Computer Science Engineering',
    period: 'Jul 2021 – May 2025', location: 'Gandhinagar, India',
    color: '#b45309', bg: '#fffbeb', gpa: '9.44 / 10',
    detail: 'Cultural Club, Event Manager · Society of Mathematics · Zaayka Food & Culture Club',
    tags: ['Computer Science', 'Networking', 'Security'],
  },
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
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {['about','experience','projects','skills','contact'].map(s => (
            <a key={s} href={`#${s}`} style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', textDecoration: 'none', textTransform: 'capitalize', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f472b6')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>{s}</a>
          ))}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.8rem', fontWeight: 700, color: '#be185d', textDecoration: 'none', padding: '5px 14px', borderRadius: '999px', background: '#fce7f3', border: '1px solid #fbcfe8', transition: 'all 0.2s', fontFamily: 'JetBrains Mono' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f472b6'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fce7f3'; (e.currentTarget as HTMLElement).style.color = '#be185d' }}>
            📄 Resume
          </a>
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

// ── Chat Widget ───────────────────────────────────────────────────────────────

type Msg = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  "What projects has Twinkle built?",
  "What's her tech stack?",
  "Is she open to opportunities?",
  "Tell me about IRIS",
]

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', content: "Hi! I'm Twinkle's AI assistant ✦ Ask me anything about her work, projects, or background!" }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const newMsgs: Msg[] = [...msgs, { role: 'user', content: text }]
    setMsgs(newMsgs)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMsgs }) })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'assistant', content: data.content }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: "Something went wrong. Reach Twinkle at tkamdar@andrew.cmu.edu!" }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: '28px', right: '28px', zIndex: 200,
        width: '56px', height: '56px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #f472b6, #8b5cf6)',
        border: 'none', cursor: 'none', boxShadow: '0 8px 32px rgba(244,114,182,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', transition: 'transform 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
        {open ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '28px', zIndex: 199,
          width: '340px', height: '480px', borderRadius: '24px',
          background: '#fff', border: '1.5px solid #fbcfe8',
          boxShadow: '0 24px 80px rgba(244,114,182,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #f472b6, #8b5cf6)', color: '#fff' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: '1rem' }}>Ask Twinkle&apos;s AI ✦</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', opacity: 0.85, marginTop: '2px' }}>Instant replies · Ask anything</div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#f472b6,#8b5cf6)' : '#fdf4ff',
                  color: m.role === 'user' ? '#fff' : '#374151',
                  fontSize: '0.85rem', lineHeight: 1.6,
                  border: m.role === 'assistant' ? '1px solid #f3e8ff' : 'none',
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '18px 18px 18px 4px', background: '#fdf4ff', border: '1px solid #f3e8ff', fontSize: '1rem' }}>
                  <span style={{ animation: 'blink 1s step-end infinite' }}>✦</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)} style={{
                padding: '4px 10px', borderRadius: '999px', fontSize: '0.68rem',
                fontFamily: 'JetBrains Mono', background: '#fce7f3', color: '#be185d',
                border: '1px solid #fbcfe8', cursor: 'none', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f472b6'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fce7f3'; e.currentTarget.style.color = '#be185d' }}>
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid #f3e8ff', display: 'flex', gap: '8px' }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '999px',
                border: '1.5px solid #fbcfe8', fontSize: '0.85rem',
                outline: 'none', fontFamily: 'DM Sans', background: '#fdf4ff',
                cursor: 'text',
              }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()}
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #f472b6, #8b5cf6)',
                border: 'none', cursor: 'none', color: '#fff', fontSize: '1rem',
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}>↑</button>
          </div>
        </div>
      )}
    </>
  )
}

// ── Timeline Card ─────────────────────────────────────────────────────────────

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <div className="pcard" style={{ maxWidth: '380px', width: '100%', borderTop: `4px solid ${item.color}` }}>
      <div style={{ padding: '20px 24px', background: item.bg }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: '1.05rem', color: item.color, marginBottom: '2px' }}>{item.org}</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>{item.role}</div>
        {item.bullets && (
          <ul style={{ paddingLeft: '14px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {item.bullets.map((b, j) => <li key={j} style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.65 }}>{b}</li>)}
          </ul>
        )}
        {item.detail && <p style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.65, marginBottom: '10px' }}>{item.detail}</p>}
        {item.gpa && <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: item.color, fontWeight: 700, marginBottom: '8px' }}>GPA {item.gpa}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {item.tags.map(t => <span key={t} style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.58rem', fontFamily: 'JetBrains Mono', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: `${item.color}12`, color: item.color, border: `1px solid ${item.color}30` }}>{t}</span>)}
        </div>
      </div>
    </div>
  )
}

// ── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.open(`mailto:tkamdar@andrew.cmu.edu?subject=${subject}&body=${body}`)
    setSent(true)
    setName(''); setEmail(''); setMessage('')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', borderRadius: '14px',
    border: '1.5px solid #f3e8ff', fontSize: '0.95rem', fontFamily: 'DM Sans',
    background: '#fdf4ff', outline: 'none', color: '#374151',
    transition: 'border-color 0.2s', cursor: 'text',
  }

  return (
    <section id="contact" style={{ padding: '100px 24px 120px', background: 'linear-gradient(160deg, #1a1028 0%, #2d1b4e 50%, #1a1028 100%)' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c4b5fd', fontWeight: 600 }}>✦ get in touch</span>
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(3rem,7vw,5.5rem)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '48px', lineHeight: 1 }}>
          Contact.
        </h2>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✦</div>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#f9a8d4', marginBottom: '8px' }}>Message sent!</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#a78bfa' }}>Your email client opened with the message pre-filled. Twinkle will get back to you soon.</p>
            <button onClick={() => setSent(false)} style={{ marginTop: '24px', padding: '10px 28px', borderRadius: '999px', border: '1.5px solid #c4b5fd', background: 'transparent', color: '#c4b5fd', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', cursor: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#c4b5fd20' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', fontWeight: 600, color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem' }}>👤</span> Name
                </label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#f472b6')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#f3e8ff')} />
              </div>
              <div>
                <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', fontWeight: 600, color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem' }}>✉️</span> Email
                </label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" type="email" required style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#8b5cf6')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#f3e8ff')} />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', fontWeight: 600, color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem' }}>💬</span> Message
              </label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Hey Twinkle, love the website! I'd like to chat about some opportunities you might like! 🎉" required rows={6}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                onFocus={e => (e.currentTarget.style.borderColor = '#f472b6')}
                onBlur={e => (e.currentTarget.style.borderColor = '#f3e8ff')} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
              <button type="submit" style={{
                padding: '16px 56px', borderRadius: '999px', fontSize: '1rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #f472b6, #8b5cf6)',
                color: '#fff', border: 'none', cursor: 'none',
                boxShadow: '0 8px 32px rgba(244,114,182,0.45)',
                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(244,114,182,0.55)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(244,114,182,0.45)' }}>
                Send Message
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [glassesOn, setGlasses] = useState(false)
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
        <section id="about" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 24px 80px' }}>
          <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '72px', flexWrap: 'wrap', justifyContent: 'center' }}>

            {/* Text */}
            <div style={{ flex: '1 1 340px', maxWidth: '520px' }}>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 18px', borderRadius: '999px', background: '#fce7f3', color: '#be185d', border: '1px solid #fbcfe8', fontWeight: 600 }}>
                  ✦ Seeking Full-Time Roles · Graduating Dec 2026
                </span>
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(3rem,6vw,5rem)', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
                <span style={{ background: 'linear-gradient(135deg, #f472b6 0%, #8b5cf6 50%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Twinkle Kamdar
                </span>
              </h1>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '20px', textTransform: 'uppercase' }}>
                MSIS · Information Security · Carnegie Mellon INI
              </p>
              <p style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: 1.8, marginBottom: '36px' }}>
                CMU security grad student building defenses for AI systems that didn&apos;t exist two years ago.<br />
                I built IRIS, a real-time LLM security monitor catching prompt injection and cross-agent collusion with 93.1% precision.<br />
                <span style={{ color: '#f472b6', fontWeight: 600 }}>The AI attack surface is growing faster than the defenses. I&apos;m on the right side of that gap.</span>
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="#projects" style={{ padding: '12px 28px', borderRadius: '999px', background: 'linear-gradient(135deg, #f472b6, #8b5cf6)', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 8px 32px rgba(244,114,182,0.35)', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                  View Projects ↓
                </a>
                <a href="https://youtu.be/nqiDZgpAdyM" target="_blank" rel="noopener noreferrer"
                  style={{ padding: '12px 24px', borderRadius: '999px', background: '#fff', color: '#16a34a', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', border: '1.5px solid #bbf7d0', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f0fdf4'; (e.currentTarget as HTMLElement).style.borderColor = '#16a34a' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#bbf7d0' }}>
                  ▶ Watch IRIS Demo
                </a>
                <a href="https://github.com/hell-99" target="_blank" rel="noopener noreferrer"
                  style={{ padding: '12px 24px', borderRadius: '999px', background: '#fff', color: '#374151', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', border: '1.5px solid #e5e7eb', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f472b6'; (e.currentTarget as HTMLElement).style.color = '#f472b6' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLElement).style.color = '#374151' }}>
                  GitHub
                </a>
                <a href="https://linkedin.com/in/twinkle-kamdar3" target="_blank" rel="noopener noreferrer"
                  style={{ padding: '12px 24px', borderRadius: '999px', background: '#fff', color: '#374151', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', border: '1.5px solid #e5e7eb', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#8b5cf6'; (e.currentTarget as HTMLElement).style.color = '#8b5cf6' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLElement).style.color = '#374151' }}>
                  LinkedIn
                </a>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                  style={{ padding: '12px 24px', borderRadius: '999px', background: '#fff', color: '#be185d', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', border: '1.5px solid #fbcfe8', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fce7f3' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff' }}>
                  📄 Resume
                </a>
              </div>
            </div>

            {/* Photo */}
            <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', cursor: 'none' }} onClick={() => setGlasses(g => !g)}>
                <div style={{
                  width: '340px', height: '450px', borderRadius: '32px', overflow: 'hidden',
                  boxShadow: '0 24px 80px rgba(244,114,182,0.28), 0 8px 32px rgba(0,0,0,0.08)',
                  border: '3px solid #fbcfe8',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/twinkle.jpg" alt="Twinkle Kamdar" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 12%' }} />
                </div>

                {/* Pixel glasses */}
                {glassesOn && <>
                  <div style={{
                    position: 'absolute', top: '27%', left: '44%', width: '28%',
                    animation: 'slideGlasses 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/glasses.png" alt="" style={{ width: '100%', display: 'block', imageRendering: 'pixelated', mixBlendMode: 'multiply', transform: 'rotate(6deg)' }} />
                  </div>
                  <div style={{
                    position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                    fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1rem', color: '#fff',
                    whiteSpace: 'nowrap', textShadow: '0 0 16px #f472b6, 0 2px 8px rgba(0,0,0,0.9)',
                    animation: 'dealWithIt 0.4s 0.5s ease forwards', opacity: 0,
                  }}>
                    DEAL WITH IT ✦
                  </div>
                </>}
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#f472b6', opacity: glassesOn ? 0 : 0.75, transition: 'opacity 0.3s' }}>
                click me ✦
              </span>
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

        {/* ── Journey Timeline ── */}
        <section id="experience" style={{ padding: '100px 24px', background: '#faf9ff' }}>
          <div style={{ maxWidth: '920px', margin: '0 auto' }}>

            <div ref={addFade} className="fade-up" style={{ marginBottom: '64px', textAlign: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f472b6', fontWeight: 700 }}>✦ journey</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(2.2rem,5vw,3.2rem)', letterSpacing: '-0.02em', marginTop: '8px' }}>My Story</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '8px', fontFamily: 'JetBrains Mono' }}>work &amp; education · newest first</p>
            </div>

            <div style={{ position: 'relative' }}>
              {/* Continuous center line */}
              <div style={{
                position: 'absolute', left: '50%', top: '22px', bottom: '22px', width: '2px',
                background: 'linear-gradient(to bottom, #f9a8d4 0%, #c4b5fd 25%, #86efac 55%, #93c5fd 80%, #fcd34d 100%)',
                transform: 'translateX(-50%)', zIndex: 0,
              }} />

              {TIMELINE.map((item, i) => {
                const isLeft = i % 2 === 0
                return (
                  <div key={i} ref={addFade} className="fade-up" style={{
                    display: 'flex', alignItems: 'flex-start', marginBottom: '44px',
                    position: 'relative', zIndex: 1, transitionDelay: `${i * 0.1}s`,
                  }}>
                    {/* Left */}
                    <div style={{ flex: 1, paddingRight: '30px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                      {isLeft ? <TimelineCard item={item} /> : (
                        <div style={{ textAlign: 'right', paddingTop: '10px' }}>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', fontWeight: 700, color: item.color }}>{item.period}</div>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: '#9ca3af', marginTop: '3px' }}>{item.location}</div>
                        </div>
                      )}
                    </div>

                    {/* Center dot */}
                    <div style={{
                      flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%',
                      background: item.bg, border: `3px solid ${item.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', zIndex: 2,
                      boxShadow: `0 0 0 4px white, 0 0 0 6px ${item.color}25`,
                    }}>
                      {item.type === 'education' ? '🎓' : '💼'}
                    </div>

                    {/* Right */}
                    <div style={{ flex: 1, paddingLeft: '30px', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                      {!isLeft ? <TimelineCard item={item} /> : (
                        <div style={{ paddingTop: '10px' }}>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', fontWeight: 700, color: item.color }}>{item.period}</div>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: '#9ca3af', marginTop: '3px' }}>{item.location}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

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
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div ref={addFade} className="fade-up" style={{ marginBottom: '48px' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#10b981', fontWeight: 700 }}>✦ skills</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(2.2rem,5vw,3.2rem)', letterSpacing: '-0.02em', marginTop: '8px' }}>Technical Stack</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {SKILL_CATEGORIES.map((cat, ci) => (
                <div key={cat.label} ref={addFade} className="fade-up" style={{ transitionDelay: `${ci * 0.04}s` }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: cat.color, padding: '4px 14px', borderRadius: '999px', background: cat.bg, border: `1px solid ${cat.color}25` }}>{cat.label}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {cat.skills.map(s => (
                      <span key={s} className="pill" style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}25` }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <ContactForm />

        <ChatWidget />

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
