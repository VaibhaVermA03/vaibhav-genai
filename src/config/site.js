/**
 * ─────────────────────────────────────────────────────────────
 *  CENTRAL CONFIGURATION
 *  Everything personal / linkable lives here. Edit this one file
 *  to update social links, project repo + live URLs, and copy.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: 'Vaibhav Verma',
  initials: 'VV',
  role: 'Generative AI Engineer',
  location: 'New Delhi, India',
  email: 'vaibhavverma0307@gmail.com',

  // Put your real resume PDF in /public and keep this path (or change it).
  resumeUrl: '/Vaibhav Verma GenAI Engineer.pdf',
  resumeFileName: 'Vaibhav Verma GenAI Engineer.pdf',

  social: {
    github: 'https://github.com/VaibhaVermA03',
    linkedin: 'https://www.linkedin.com/in/vaibhav-verma-genai/',
  },

  tagline: ['Building intelligent systems.', 'Turning complex ideas into reality.'],
  heroDescription:
    'I engineer intelligent applications powered by LLMs, AI agents and retrieval systems — transforming ideas into practical AI-powered products.',
}

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

/**
 * PROJECT LINKS — update `repo` and `live` here and the whole site follows.
 * Leave a value as '' to render a disabled "Link coming soon" button instead
 * of a broken link.
 */
export const projects = [
  {
    id: 'oryn',
    index: '01',
    name: 'ORYN',
    fullName: 'Enterprise Knowledge RAG Engine',
    visual: 'oryn',
    kicker: 'Document intelligence',
    description:
      'An AI-powered document intelligence platform that enables users to upload documents and perform intelligent question-answering using RAG.',
    stack: ['React.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Pinecone', 'OpenAI API', 'Cohere'],
    features: [
      'Hybrid search using Pinecone and PostgreSQL full-text search',
      'OpenAI and Cohere integrations',
      'Embeddings and result reranking',
      'Secure multi-tenant workspaces',
      'Authentication and role-based access',
      'Google OAuth',
      'Audit logging',
      'Real-time response streaming',
      'Source citations',
      'Document processing',
      'Evaluation analytics',
    ],
    repo: 'https://github.com/VaibhaVermA03/ORYN',
    live: 'https://oryn-neon.vercel.app/',
  },
  {
    id: 'nexis',
    index: '02',
    name: 'NEXIS',
    fullName: 'AI Agent & Workflow Automation Platform',
    visual: 'nexis',
    kicker: 'Autonomous agents',
    description:
      'An AI-powered platform for creating autonomous agents and automating multi-step tasks using LangGraph.',
    stack: ['React.js', 'JavaScript', 'Python', 'FastAPI', 'PostgreSQL', 'LangGraph', 'OpenAI API'],
    features: [
      'Autonomous AI agents',
      'OpenAI tool calling',
      'External tool integrations',
      'Custom REST tools',
      'API key management',
      'Multi-step workflow automation',
      'Server-Sent Events',
      'Real-time execution monitoring',
      'Execution history',
      'Event tracking',
      'Approval-based tool execution',
      'Secure authentication',
    ],
    repo: 'https://github.com/VaibhaVermA03/NEXIS',
    live: 'https://nexisagent.vercel.app',
  },
  {
    id: 'synaxys',
    index: '03',
    name: 'SYNAXYS',
    fullName: 'AI-Powered Code Review & GitHub Intelligence Platform',
    visual: 'synaxys',
    kicker: 'Code intelligence',
    description:
      'An AI-powered code review platform that analyzes GitHub pull requests and identifies potential bugs, code quality issues and security concerns.',
    stack: ['React.js', 'JavaScript', 'Python', 'FastAPI', 'PostgreSQL', 'LangChain', 'OpenAI API', 'Pinecone', 'GitHub API'],
    features: [
      'GitHub OAuth',
      'GitHub App integration',
      'Webhook-triggered code reviews',
      'LangChain and OpenAI-powered review workflows',
      'Evidence-backed findings',
      'File references and line numbers',
      'Severity and confidence levels',
      'Pinecone-based semantic code search',
      'Interactive code diff visualization',
      'Custom review rules',
      'Finding management',
      'Human-approved GitHub comment publishing',
    ],
    repo: 'https://github.com/SYNAXYS',
    live: 'https://synaxys.vercel.app',
  },
]

export const experience = [
  {
    role: 'Frontend Developer Intern',
    company: 'ABYM Technologies',
    place: 'Noida, Sector 62',
    period: 'June 2025 — November 2025',
    type: 'Internship',
    points: [
      'Hands-on training in HTML5, CSS3, JavaScript and React.js.',
      'Building responsive user interfaces with modern CSS techniques.',
      'Creating reusable React components using props, state and Hooks.',
      'Version control with Git and GitHub.',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Git', 'GitHub'],
  },
]

export const education = {
  degree: 'Bachelor of Technology (B.Tech)',
  field: 'Computer Science & Engineering',
  school: 'Chaudhary Devi Lal State Institute of Engineering & Technology',
  place: 'Sirsa, Haryana',
  from: '2022',
  to: '2026',
  cgpa: 7.5,
  cgpaMax: 10,
}
