export type DealStatus = 'active' | 'watch' | 'stalled' | 'closing';

export interface Compartment {
  id: string;
  name: string;
  description: string;
  status: DealStatus;
  lastConversationAt: string;
  nextMeeting: string | null;
  openQuestions: number;
  keyContacts: string[];
  tags: string[];
  insights: string[];
  contextPages: string[];
  metrics: {
    dealSize?: string;
    stage?: string;
    probability?: number;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'person' | 'company' | 'deal' | 'topic' | 'document';
  group: number;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  strength: number;
}

export const MOCK_COMPARTMENTS: Compartment[] = [
  {
    id: 'deal-vertex-ai',
    name: 'Vertex AI Partnership',
    description: 'Strategic cloud AI partnership — $4.2M ARR potential. Legal review in progress.',
    status: 'active',
    lastConversationAt: '2026-05-14T02:30:00Z',
    nextMeeting: '2026-05-15T14:00:00Z',
    openQuestions: 3,
    keyContacts: ['Sarah Chen (Google)', 'Marcus Webb (Legal)'],
    tags: ['cloud', 'ai', 'partnership'],
    insights: [
      'Google team prefers phased rollout over big-bang integration',
      'Legal flagged IP ownership clause — needs revision before signature',
      'Technical pilot can start Q3 without full contract',
    ],
    contextPages: ['deals/vertex-ai.md', 'contacts/sarah-chen.md', 'contracts/vertex-draft-v3.md'],
    metrics: { dealSize: '$4.2M ARR', stage: 'Legal Review', probability: 75 },
  },
  {
    id: 'deal-series-b',
    name: 'Series B Round',
    description: 'Raising $18M Series B. Tier 1 VC conversations active. Lead investor TBD.',
    status: 'active',
    lastConversationAt: '2026-05-13T18:00:00Z',
    nextMeeting: '2026-05-16T10:00:00Z',
    openQuestions: 7,
    keyContacts: ['David Park (Sequoia)', 'Amanda Torres (a16z)', 'CFO Lisa Huang'],
    tags: ['fundraising', 'investors', 'growth'],
    insights: [
      'Sequoia wants 3 more months of growth data before committing',
      'a16z interested but asking about enterprise GTM traction',
      'Current runway: 14 months at burn rate',
    ],
    contextPages: ['fundraising/series-b-deck.md', 'financials/q1-2026.md', 'investors/sequoia.md'],
    metrics: { dealSize: '$18M', stage: 'Term Sheet Negotiation', probability: 60 },
  },
  {
    id: 'deal-acme-enterprise',
    name: 'ACME Corp Enterprise',
    description: '500-seat enterprise license. IT procurement moving slow but champion engaged.',
    status: 'watch',
    lastConversationAt: '2026-05-10T11:00:00Z',
    nextMeeting: '2026-05-20T15:30:00Z',
    openQuestions: 4,
    keyContacts: ['Robert Kim (IT Director)', 'Janet Mills (Champion)'],
    tags: ['enterprise', 'license', 'procurement'],
    insights: [
      'IT procurement cycle is 90 days minimum — started April 1',
      'Champion Janet has exec buy-in but no budget authority',
      'Security review questionnaire submitted, awaiting response',
    ],
    contextPages: ['deals/acme-enterprise.md', 'contacts/robert-kim.md'],
    metrics: { dealSize: '$240K/yr', stage: 'Procurement', probability: 45 },
  },
  {
    id: 'deal-latam-expansion',
    name: 'LATAM Expansion',
    description: 'Market entry strategy for Brazil & Mexico. Partner network mapping underway.',
    status: 'active',
    lastConversationAt: '2026-05-14T00:15:00Z',
    nextMeeting: '2026-05-17T16:00:00Z',
    openQuestions: 9,
    keyContacts: ['Carlos Mendoza (Brazil Partner)', 'Elena Ruiz (Mexico Ops)'],
    tags: ['expansion', 'latam', 'partnerships'],
    insights: [
      'Brazil requires local entity incorporation — 3-4 months',
      'Existing partner network in Mexico can accelerate go-to-market',
      'Currency hedging strategy needed for Brazil operations',
    ],
    contextPages: ['expansion/latam-strategy.md', 'legal/brazil-entity.md'],
    metrics: { stage: 'Strategy', probability: 30 },
  },
  {
    id: 'deal-acquisition-target',
    name: 'DataBridge Acquisition',
    description: 'Potential acqui-hire of 8-person team + IP. NDA signed. Diligence ongoing.',
    status: 'closing',
    lastConversationAt: '2026-05-13T20:00:00Z',
    nextMeeting: '2026-05-14T17:00:00Z',
    openQuestions: 5,
    keyContacts: ['Alex Morgan (DataBridge CEO)', 'M&A Counsel'],
    tags: ['acquisition', 'tech', 'team'],
    insights: [
      'IP valuation complete — fair value $2.1M',
      'Retention packages for 6 of 8 engineers agreed in principle',
      'Closing timeline: 30 days pending final LOI sign-off',
    ],
    contextPages: ['ma/databridge-diligence.md', 'legal/acquisition-loi.md'],
    metrics: { dealSize: '$3.2M', stage: 'Final Diligence', probability: 85 },
  },
  {
    id: 'deal-govt-contract',
    name: 'Federal AI Contract',
    description: 'GSA Schedule contract application. 18-month procurement cycle, $1.8M ceiling.',
    status: 'stalled',
    lastConversationAt: '2026-04-28T09:00:00Z',
    nextMeeting: null,
    openQuestions: 2,
    keyContacts: ['Procurement Officer (GSA)', 'Compliance Lead'],
    tags: ['government', 'federal', 'compliance'],
    insights: [
      'FedRAMP authorization required — not yet started',
      'GSA schedule application under review, 6-8 months typical',
    ],
    contextPages: ['government/gsa-application.md', 'compliance/fedramp-roadmap.md'],
    metrics: { dealSize: '$1.8M ceiling', stage: 'Application Review', probability: 20 },
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'deal-vertex-ai': [
    {
      id: 'm1',
      role: 'user',
      content: 'What are the key risks we need to address before the legal review meeting tomorrow?',
      timestamp: '2026-05-14T02:28:00Z',
    },
    {
      id: 'm2',
      role: 'assistant',
      content: 'Based on your notes from the last legal session, three risks need your attention before tomorrow. First, the IP ownership clause in Section 7.3 — Marcus flagged that the current language gives Google perpetual license rights to any joint developments, which is broader than standard. You need a counter-proposal that limits this to specifically contracted work. Second, the data residency requirements conflict with your current multi-region architecture. Sarah mentioned Google Cloud can accommodate, but it needs to be contractually specified. Third, the termination clause gives 30-day notice which is too short given your integration depth — push for 90 days. I\'d prioritize these in this order for the meeting.',
      timestamp: '2026-05-14T02:29:00Z',
    },
    {
      id: 'm3',
      role: 'user',
      content: "What's Sarah's preferred communication style based on our history?",
      timestamp: '2026-05-14T02:30:00Z',
    },
    {
      id: 'm4',
      role: 'assistant',
      content: "From your notes across 6 meetings with Sarah, she's consistently data-first — she responds well when you lead with metrics and specific technical specs rather than business narrative. She dislikes vague commitments. In your April 15th meeting she explicitly called out that she appreciated when you brought the latency benchmarks unprompted. For tomorrow, I'd recommend opening with the specific clause numbers and proposed revised language rather than starting with relationship-building. She\'ll interpret efficiency as respect.",
      timestamp: '2026-05-14T02:30:30Z',
    },
  ],
};

export const MOCK_KNOWLEDGE_NODES: KnowledgeNode[] = [
  { id: 'vertex-ai', label: 'Vertex AI Partnership', type: 'deal', group: 1 },
  { id: 'sarah-chen', label: 'Sarah Chen', type: 'person', group: 2 },
  { id: 'marcus-webb', label: 'Marcus Webb', type: 'person', group: 2 },
  { id: 'google', label: 'Google', type: 'company', group: 3 },
  { id: 'ip-clause', label: 'IP Ownership', type: 'topic', group: 4 },
  { id: 'data-residency', label: 'Data Residency', type: 'topic', group: 4 },
  { id: 'vertex-draft', label: 'Contract Draft v3', type: 'document', group: 5 },
  { id: 'series-b', label: 'Series B Round', type: 'deal', group: 1 },
  { id: 'david-park', label: 'David Park', type: 'person', group: 2 },
  { id: 'sequoia', label: 'Sequoia Capital', type: 'company', group: 3 },
  { id: 'a16z', label: 'Andreessen Horowitz', type: 'company', group: 3 },
  { id: 'databridge', label: 'DataBridge Acquisition', type: 'deal', group: 1 },
  { id: 'alex-morgan', label: 'Alex Morgan', type: 'person', group: 2 },
  { id: 'latam', label: 'LATAM Expansion', type: 'deal', group: 1 },
];

export const MOCK_KNOWLEDGE_LINKS: KnowledgeLink[] = [
  { source: 'vertex-ai', target: 'sarah-chen', strength: 0.9 },
  { source: 'vertex-ai', target: 'marcus-webb', strength: 0.8 },
  { source: 'vertex-ai', target: 'google', strength: 1.0 },
  { source: 'vertex-ai', target: 'ip-clause', strength: 0.9 },
  { source: 'vertex-ai', target: 'data-residency', strength: 0.7 },
  { source: 'vertex-ai', target: 'vertex-draft', strength: 1.0 },
  { source: 'sarah-chen', target: 'google', strength: 0.9 },
  { source: 'series-b', target: 'david-park', strength: 0.8 },
  { source: 'series-b', target: 'sequoia', strength: 0.9 },
  { source: 'series-b', target: 'a16z', strength: 0.7 },
  { source: 'david-park', target: 'sequoia', strength: 1.0 },
  { source: 'databridge', target: 'alex-morgan', strength: 1.0 },
  { source: 'latam', target: 'vertex-ai', strength: 0.2 },
];
