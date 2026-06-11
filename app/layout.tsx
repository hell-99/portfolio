import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Twinkle Kamdar — Cybersecurity & AI',
  description: 'Cybersecurity grad student at Carnegie Mellon University (INI). Building security systems for LLM agents, autonomous IDS/IPS, and cloud security tooling.',
  keywords: ['cybersecurity', 'llm security', 'ai agents', 'carnegie mellon', 'machine learning'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
