import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are Twinkle's AI assistant on her portfolio website. Answer questions about her concisely and warmly. Keep responses under 3 sentences.

About Twinkle Kamdar:
- MSIS Information Security at Carnegie Mellon University INI, graduating December 2026
- Currently: Security Analyst Intern at Floatbot.AI (PCI DSS v4.0.1 compliance, GCP/Azure)
- Past: SOC Intern at Silver Touch Technologies (SIEM, Suricata, VAPT), Research Assistant at PDEU (deepfake detection)
- Education: B.Tech CSE from PDEU India, GPA 9.44/10
- Key projects: IRIS (LLM agent security monitor, 93.1% precision, live on Streamlit), AEGIS (autonomous IDS/IPS with post-quantum crypto), ZeroSeg (microsegmentation ML, 95.31% accuracy), Forensic Time Cop (anti-forensics detection), K8s-Guard, AWS Scanner, Mirai Botnet forensics
- Skills: Python, XGBoost, LangChain/LangGraph, FastAPI, Docker, Kubernetes, GCP, Azure, AWS, Wireshark, Suricata, Security Onion, MITRE ATT&CK, PCI DSS, Digital Forensics
- Open to full-time cybersecurity / AI security roles
- Contact: tkamdar@andrew.cmu.edu | github.com/hell-99 | linkedin.com/in/twinklekamdar
- IRIS live demo: iris-hell99.streamlit.app

If asked something personal or outside this scope, say Twinkle can be reached directly at tkamdar@andrew.cmu.edu.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM,
      messages,
    })
    return Response.json({ content: (response.content[0] as { text: string }).text })
  } catch {
    return Response.json({ content: "Sorry, I'm having trouble connecting right now. Reach Twinkle directly at tkamdar@andrew.cmu.edu!" }, { status: 200 })
  }
}
