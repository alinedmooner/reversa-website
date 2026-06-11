/**
 * site.config.ts — every copy string, stat, and link on the page.
 * Swap the TODO links here and nothing else needs to change.
 */

export const SITE = {
  name: 'Reversa',
  title: 'Reversa — Autonomous fraud recovery for instant payment rails',
  description:
    'Reversa is an autonomous multi-agent recovery layer for instant payment rails — Pix and Bre-B. Four specialist agents trace stolen funds, issue ISO 20022 recalls before cashout, and write regulator-ready evidence. Built on Google ADK, deployed on Agent Engine.',
  /** TODO: replace with the real production URL before launch (canonical + OG). */
  url: 'https://reversa.example.com',
  /** Mirrors --color-background in ds/css/tokens.css (meta theme-color needs a literal). */
  themeColor: '#0d0d0f',
} as const;

export const LINKS = {
  github: 'https://github.com/alinedmooner/reversa',
  /** TODO: real demo video URL. */
  demo: '#',
  /** TODO: real Devpost submission URL. */
  devpost: '#',
  research: 'https://github.com/alinedmooner/reversa/blob/main/docs/research-full.md',
  datamirai: 'https://datamirai.com/',
  openmirai: 'https://github.com/Gabo-TheCreator/openmirai',
  /** Official hackathon video by the organizers (Google Cloud). */
  challenge: 'https://www.youtube.com/watch?v=2t-IWJTUHu0',
} as const;

export const NAV = [
  { label: 'Problem', href: '#problem' },
  { label: 'How it works', href: '#how' },
  { label: 'Research', href: '#research' },
  { label: 'Stack', href: '#stack' },
] as const;

export const HERO = {
  title: 'Reversa',
  tagline: "We don't prevent the theft. We recover the money.",
  subline: 'An autonomous multi-agent recovery layer for instant payment rails — Pix · Bre-B.',
  ctas: [
    { label: 'View the code', href: LINKS.github, variant: 'primary' },
    { label: 'Watch the demo', href: LINKS.demo, variant: 'secondary' },
    { label: 'Devpost', href: LINKS.devpost, variant: 'ghost' },
  ],
} as const;

export const PROBLEM = {
  eyebrow: 'The problem',
  heading: 'Seconds to steal. Days to respond.',
  paragraphs: [
    'Instant payment rails settle in seconds, and settlement is final. There is no chargeback on Pix or Bre-B — once the money moves, the rail itself offers no way back.',
    'APP fraud is engineered for that finality. Within minutes of the scam, the stolen money is layered through chains of mule accounts and cashed out before anyone is looking.',
    'Official recovery runs at human speed — forms, tickets, business days. Against a laundering chain measured in minutes, the race is lost before it starts.',
  ],
  stats: [
    {
      value: 7,
      suffix: '%',
      label: 'of disputed value the MED recovered',
      source: 'BCB, 2025',
    },
    {
      value: 89,
      suffix: '%',
      label: 'of MED refund requests denied',
      source: 'BCB, 2025',
    },
    {
      value: 2.5,
      suffix: '',
      label: 'minutes for a complete Reversa case',
      source: 'measured by CI on live infra',
    },
    {
      value: 200,
      suffix: '+',
      label: 'institutions on Bre-B',
      source: 'which has no recovery mechanism',
    },
  ],
} as const;

export const HOW = {
  eyebrow: 'How it works',
  heading: 'Four specialists, one pipeline, zero waiting.',
  steps: [
    {
      title: 'Intake',
      description: "Parses the victim's report in any language into a structured case.",
    },
    {
      title: 'Tracing',
      description: 'Follows the money hop-by-hop and flags known mules from institutional memory.',
    },
    {
      title: 'Action',
      description: 'Issues the ISO 20022 camt.056 recall autonomously — before cashout.',
    },
    {
      title: 'Evidence',
      description: 'Writes a regulator-ready dossier, grounded in an indexed rulebook.',
    },
  ],
  closing: "Built with Google's Agent Development Kit, deployed on Agent Engine.",
} as const;

export const RESEARCH = {
  eyebrow: 'The research',
  heading: 'Following the money',
  paragraphs: [
    "Fraud prevention is a crowded market; recovery is an empty one. Brazil's MED — the official recovery mechanism for Pix — returned roughly 7% of disputed value in 2025. That number does not measure what is recoverable. It measures human latency: by the time a person reviews the case, the money has already moved.",
    'Reimbursement is not recovery. The UK now repays victims 88% of APP-fraud losses — but repayment socializes the loss across banks while the stolen money walks away. Recovery means catching the funds mid-flight and pulling them back. On instant rails, that layer does not exist yet.',
  ],
  table: {
    ariaLabel: 'Recovery mechanisms compared: Brazil (Pix) versus Colombia (Bre-B)',
    rowHeader: '',
    columns: ['Brazil — Pix', 'Colombia — Bre-B'],
    rows: [
      {
        aspect: 'Recovery mechanism',
        brazil: 'MED, since 2021',
        colombia: 'None — Reversa is the first',
      },
      {
        aspect: 'Recovered value',
        brazil: '~7–14% of disputed amounts',
        colombia: 'No recovery path at all',
      },
      {
        aspect: 'What 2026 brings',
        brazil: 'MED 2.0 mandates 5-layer tracing',
        colombia: 'Reversa: tracing, recall, evidence',
      },
    ],
  },
  link: { label: 'Read the full investigation →', href: LINKS.research },
} as const;

export const RAILS = {
  eyebrow: 'Rail-agnostic',
  heading: 'Same agents. Any rail.',
  cases: [
    {
      lang: 'pt-BR',
      langLabel: 'PT',
      rail: 'Pix',
      text: 'Caí no golpe do falso parente, fiz um Pix de R$ 50.000 para a chave 123.456.789-09 há 10 minutos.',
    },
    {
      lang: 'es-CO',
      langLabel: 'ES',
      rail: 'Bre-B',
      text: 'Me hicieron un sequestro relámpago, transferí $11.000.000 a la llave 3001234567 hace 10 minutos.',
    },
  ],
  closing:
    "The pipeline detects the rail, traces in the right currency, and writes the dossier in the victim's language. Only a thin country config changes.",
} as const;

export const STACK = {
  eyebrow: 'Built with',
  heading: 'The stack underneath',
  chips: [
    'Google ADK',
    'Gemini 2.5 Flash (Vertex AI)',
    'Agent Engine',
    'Memory Bank',
    'A2A protocol',
    'Vertex AI Search',
    'Cloud Trace',
    'GitHub Actions + WIF',
    'Terraform',
  ],
} as const;

export const FOOTER = {
  line: 'A complete case in ~2.5 minutes — measured by CI on live infrastructure.',
  org: 'DataMirai',
  orgUrl: LINKS.datamirai,
  location: 'Bogotá',
  credit: {
    prefix: 'Built by Gabriel Cuadros & Daniel Moreno for the ',
    label: 'Google for Startups AI Agents Challenge 2026',
    href: LINKS.challenge,
    suffix: ', organized by Google Cloud.',
  },
  openSource: {
    prefix: 'Open source from the same team: ',
    label: 'OpenMirai',
    href: LINKS.openmirai,
    suffix: ' — a Rust-native engine for running AI agents anywhere.',
  },
  links: [
    { label: 'GitHub', href: LINKS.github },
    { label: 'Demo', href: LINKS.demo },
    { label: 'Devpost', href: LINKS.devpost },
    { label: 'OpenMirai', href: LINKS.openmirai },
  ],
  smallPrint: 'All data synthetic. All institutions fictional.',
} as const;
