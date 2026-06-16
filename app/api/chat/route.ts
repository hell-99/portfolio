const FAQ: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['hi', 'hello', 'hey', 'hii', 'heyy', 'howdy', 'sup', 'yo'],
    answer: "Hi there! 👋 I'm Twinkle's AI assistant. Ask me anything about her work, projects, skills, or background!",
  },
  {
    keywords: ['how are you', 'how r u', 'how are u', 'hows it going', "how's it going", 'how do you do', "what's up", 'whats up'],
    answer: "I'm doing great, thanks for asking! 😊 I'm here to tell you all about Twinkle her projects, skills, and background. What would you like to know?",
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'see ya', 'cya', 'later', 'take care', 'good night', 'goodnight'],
    answer: "Bye! It was great chatting. Feel free to reach Twinkle directly at tkamdar@andrew.cmu.edu if you'd like to connect! 👋",
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'thx', 'ty', 'appreciated'],
    answer: "You're welcome! 😊 Let me know if there's anything else you'd like to know about Twinkle.",
  },
  {
    keywords: ['nice', 'cool', 'awesome', 'great', 'amazing', 'wow', 'impressive', 'interesting'],
    answer: "Right?! Twinkle has built some really cool stuff 🙌 want to know more about any specific project or her background?",
  },
  {
    keywords: ['ok', 'okay', 'got it', 'sure', 'alright', 'makes sense', 'i see'],
    answer: "Great! Is there anything else you'd like to know about Twinkle her projects, skills, or experience?",
  },
  {
    keywords: ['who are you', 'who is twinkle', 'about you', 'tell me about', 'introduce'],
    answer: "I'm Twinkle Kamdar a Cybersecurity & AI grad student at Carnegie Mellon University (INI), graduating December 2026. I'm passionate about LLM security, autonomous threat detection, and building AI-powered security systems.",
  },
  {
    keywords: ['education', 'school', 'university', 'cmu', 'carnegie mellon', 'degree', 'gpa', 'pdeu', 'college'],
    answer: "Twinkle is pursuing an MSIS in Information Security at Carnegie Mellon University (INI), graduating December 2026. She completed her B.Tech in CSE from PDEU, India with a 9.44/10 GPA.",
  },
  {
    keywords: ['experience', 'work', 'job', 'intern', 'floatbot', 'silver touch', 'soc', 'research assistant'],
    answer: "Twinkle is currently a Security Analyst Intern at Floatbot.AI (PCI DSS v4.0.1, GCP/Azure). Previously she was a SOC Intern at Silver Touch Technologies (SIEM, Suricata, VAPT) and a Research Assistant at PDEU working on deepfake detection.",
  },
  {
    keywords: ['project', 'iris', 'aegis', 'zeroseg', 'forensic', 'k8s', 'aws', 'mirai', 'botnet', 'built'],
    answer: "Twinkle's key projects include IRIS (LLM agent security monitor, 93.1% precision live on Streamlit!), AEGIS (autonomous IDS/IPS with post-quantum crypto), ZeroSeg (microsegmentation ML, 95.31% accuracy), Forensic Time Cop (anti-forensics detection), K8s-Guard, and an AWS Security Scanner.",
  },
  {
    keywords: ['iris', 'llm', 'agent', 'streamlit', 'demo', 'live'],
    answer: "IRIS is Twinkle's flagship project — an LLM agent security monitor built with LangGraph and FastAPI, achieving 93.1% precision. It detects indirect prompt injection, cross-agent collusion, behavioral drift, and maps every attack to the Cyber Kill Chain via MITRE ATLAS. Red-teamed with Garak: 18/18 probes detected, zero bypasses. Try the live demo at iris-hell99.streamlit.app!",
  },
  {
    keywords: ['garak', 'red team', 'red-team', 'adversarial', 'probe', 'jailbreak', 'prompt injection'],
    answer: "Twinkle integrated Garak (NVIDIA's open-source LLM vulnerability scanner) as a red-team framework for IRIS. She ran 18 adversarial probes across 5 attack categories — prompt injection, jailbreak, privilege escalation, data exfiltration, and encoding attacks. IRIS detected 18/18 with zero bypasses, proving its behavioral layer catches attacks even when LLM safety training fails.",
  },
  {
    keywords: ['kill chain', 'cyber kill chain', 'mitre atlas', 'attack stage', 'lockheed'],
    answer: "Both IRIS and AEGIS map detections to the Lockheed Martin Cyber Kill Chain. IRIS badges every collusion detection with the kill chain stage (e.g. Stage 7 — Actions on Objectives). AEGIS's XDR correlator tracks campaign progression across all 7 stages in real-time. MITRE ATLAS TTP IDs are used for the mapping.",
  },
  {
    keywords: ['medium', 'article', 'blog', 'post', 'writing', 'published'],
    answer: "Twinkle published a technical article on Medium: 'My AI Agent Passed Every Security Check. Then It Stole My Credentials.' — a deep dive into how IRIS catches attacks that bypass every standard defense. Read it at medium.com/@debugcigcode",
  },
  {
    keywords: ['skill', 'tech', 'stack', 'language', 'tool', 'python', 'kubernetes', 'docker', 'cloud', 'gcp', 'azure', 'aws'],
    answer: "Twinkle's stack spans Python, XGBoost, LangChain/LangGraph, FastAPI, Docker, Kubernetes, GCP, Azure, and AWS plus security tooling like Wireshark, Suricata, Security Onion, and frameworks like MITRE ATT&CK and PCI DSS.",
  },
  {
    keywords: ['contact', 'email', 'reach', 'hire', 'connect', 'linkedin', 'github'],
    answer: "You can reach Twinkle at tkamdar@andrew.cmu.edu, find her on GitHub at github.com/hell-99, or connect on LinkedIn at linkedin.com/in/twinkle-kamdar3.",
  },
  {
    keywords: ['hire', 'available', 'open to', 'job', 'full-time', 'role', 'opportunity', 'looking'],
    answer: "Yes! Twinkle is open to full-time cybersecurity and AI security roles starting December 2026. She's especially excited about LLM security, cloud security, and AI-powered threat detection. Reach her at tkamdar@andrew.cmu.edu.",
  },
  {
    keywords: ['resume', 'cv'],
    answer: "You can view Twinkle's resume directly on this page click the Resume button in the navigation bar at the top!",
  },
  {
    keywords: ['pci', 'compliance', 'grc', 'governance', 'risk'],
    answer: "At Floatbot.AI, Twinkle has hands-on experience with PCI DSS v4.0.1 compliance across GCP and Azure environments. She's familiar with risk assessment, audit controls, and security policy implementation.",
  },
  {
    keywords: ['deepfake', 'detection', 'forensics', 'digital forensics'],
    answer: "Twinkle researched deepfake detection as a Research Assistant at PDEU. Her Forensic Time Cop project also detects anti-forensics techniques like timestomping in Windows MFT and Linux filesystem artifacts.",
  },
]

function getAnswer(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  for (const entry of FAQ) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.answer
    }
  }
  return "Great question! For anything specific, Twinkle would love to chat directly reach her at tkamdar@andrew.cmu.edu or on LinkedIn at linkedin.com/in/twinkle-kamdar3."
}

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]?.content ?? ''
  const content = getAnswer(lastMessage)
  return Response.json({ content })
}
