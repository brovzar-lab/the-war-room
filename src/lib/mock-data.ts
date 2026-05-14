export type DealStatus = 'active' | 'watch' | 'stalled' | 'closing';
export type DealTemperature = 'warm' | 'hot' | 'cold' | 'new';

export interface Compartment {
  id: string;
  name: string;
  companyName: string;
  description: string;
  status: DealStatus;
  temperature: DealTemperature;
  isPinned: boolean;
  needsAction: boolean;
  actionNote: string | null;
  fieldReportSummary: string;
  editorialHeadline: string;
  editorialBody: [string, string];
  lastConversationAt: string;
  nextMeeting: string | null;
  openQuestions: number;
  keyContacts: string[];
  tags: string[];
  insights: string[];
  contextPages: string[];
  metrics: {
    dealSize?: string;
    dealValue?: number;
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

export interface PipelineData {
  total: string;
  deals: number;
  closing: number;
  atRisk: number;
}

export const PIPELINE_DATA: PipelineData = {
  total: '$7M',
  deals: 9,
  closing: 3,
  atRisk: 1,
};

export const MOCK_COMPARTMENTS: Compartment[] = [
  {
    id: 'deal-alpha',
    name: 'Alpha Corp Series B',
    companyName: 'ALPHA CORP',
    description: 'Series B round — $18M target. Term sheet issued Day 0, now Day 3 overdue on countersign. Lead partner travelling; associate delegated.',
    status: 'active',
    temperature: 'hot',
    isPinned: true,
    needsAction: true,
    actionNote: 'Term Sheet Overdue',
    fieldReportSummary: 'Term Sheet — Day 3 Overdue',
    editorialHeadline: 'Term Sheet — Day 3 Overdue',
    editorialBody: [
      'Alpha Corp has failed to return the countersigned term sheet for a third consecutive business day, raising questions about internal alignment at the portfolio company. Lead partner James Whitfield is travelling through Singapore; his associate Dana Reeves has been delegated authority but has not exercised it.',
      'Intelligence suggests a competing offer from Crosspoint Ventures at a 15% higher pre-money valuation was tabled Monday. Recommend direct escalation to Whitfield via mobile before end-of-day Wednesday to avoid losing momentum. Closing window is narrow: board approval requires five days notice for the next scheduled meeting.',
    ],
    lastConversationAt: '2026-05-14T06:00:00Z',
    nextMeeting: '2026-05-15T14:00:00Z',
    openQuestions: 4,
    keyContacts: ['James Whitfield (Lead Partner)', 'Dana Reeves (Associate)', 'Alpha Corp CFO'],
    tags: ['series-b', 'term-sheet', 'overdue', 'hot'],
    insights: [
      'Competing Crosspoint offer at +15% pre-money filed Monday',
      'Lead partner Whitfield unreachable — delegate Dana Reeves empowered',
      'Board approval window requires 5 days notice — closes Wednesday',
      'Internal champion Sarah Park pushing hard; external friction only',
    ],
    contextPages: ['deals/alpha-series-b.md', 'contacts/james-whitfield.md', 'term-sheets/alpha-ts-v2.md'],
    metrics: { dealSize: '$18M', dealValue: 18, stage: 'Term Sheet', probability: 70 },
  },
  {
    id: 'deal-flagship',
    name: 'Flagship Ventures Lead',
    companyName: 'FLAGSHIP',
    description: 'Lead investor in a $45M growth round. Diligence complete. Closing scheduled next week pending LP approvals.',
    status: 'closing',
    temperature: 'warm',
    isPinned: false,
    needsAction: false,
    actionNote: null,
    fieldReportSummary: 'Closing next week — LP approvals pending',
    editorialHeadline: 'Flagship Closes In — LP Approvals Final Gate',
    editorialBody: [
      'Flagship Ventures is on track to lead the $45M growth round, with all technical and commercial diligence completed as of last Friday. The sole remaining gate is LP approval, expected by Thursday per the fund administrator.',
      'Relationship with Managing Director Helena Cross remains warm. She has signalled no objection to the current cap table structure. Wire instructions have been shared; escrow agent confirmed ready. Closing probability assessed at 91%.',
    ],
    lastConversationAt: '2026-05-13T16:00:00Z',
    nextMeeting: '2026-05-16T10:00:00Z',
    openQuestions: 1,
    keyContacts: ['Helena Cross (MD)', 'Fund Administrator', 'Escrow Agent'],
    tags: ['growth-round', 'closing', 'lp-approval'],
    insights: [
      'All diligence complete as of last Friday',
      'LP approval expected by Thursday per fund admin',
      'Wire instructions shared; escrow ready',
    ],
    contextPages: ['deals/flagship-growth.md', 'contacts/helena-cross.md', 'closing/flagship-wire.md'],
    metrics: { dealSize: '$45M', dealValue: 45, stage: 'Closing', probability: 91 },
  },
  {
    id: 'deal-foxtrot',
    name: 'Foxtrot Technologies',
    companyName: 'FOXTROT',
    description: 'Enterprise SaaS deal — $22M ARR opportunity. Security review underway; champion engaged at VP level.',
    status: 'active',
    temperature: 'warm',
    isPinned: false,
    needsAction: false,
    actionNote: null,
    fieldReportSummary: 'Diligence — security review week 2',
    editorialHeadline: 'Foxtrot Diligence Enters Week Two',
    editorialBody: [
      'Foxtrot Technologies security review entered its second week with no material findings to date. The vendor security team has been responsive and the champion, VP Engineering Rachel Osei, continues to advocate internally for an accelerated timeline.',
      'Procurement has indicated a 60-day standard cycle; Rachel believes executive sponsorship can compress this to 45 days. Next formal checkpoint is a steering committee presentation scheduled for May 22nd.',
    ],
    lastConversationAt: '2026-05-12T11:00:00Z',
    nextMeeting: '2026-05-22T14:00:00Z',
    openQuestions: 3,
    keyContacts: ['Rachel Osei (VP Engineering)', 'Procurement Lead', 'CISO Team'],
    tags: ['enterprise', 'saas', 'security-review'],
    insights: [
      'Security review week 2 — no material findings',
      'Champion Rachel Osei has exec sponsorship',
      'Steering committee presentation May 22nd',
    ],
    contextPages: ['deals/foxtrot-saas.md', 'contacts/rachel-osei.md', 'security/foxtrot-review.md'],
    metrics: { dealSize: '$22M', dealValue: 22, stage: 'Diligence', probability: 60 },
  },
  {
    id: 'deal-delta',
    name: 'Delta Partners',
    companyName: 'DELTA',
    description: 'Strategic partnership for distribution network. $12M revenue share agreement in diligence phase.',
    status: 'active',
    temperature: 'warm',
    isPinned: false,
    needsAction: false,
    actionNote: null,
    fieldReportSummary: 'Diligence — legal review scheduled',
    editorialHeadline: 'Delta Distribution Pact Advances to Legal',
    editorialBody: [
      'Delta Partners distribution agreement has advanced to legal review following successful commercial term alignment last week. The revenue share structure at 22% has been agreed in principle; legal is now reviewing exclusivity provisions.',
      'Contact Marcus Webb flagged a potential conflict with an existing distribution partner in the Northeast region. This needs resolution before the agreement can be executed. Meeting with both parties proposed for week of May 18th.',
    ],
    lastConversationAt: '2026-05-11T09:30:00Z',
    nextMeeting: '2026-05-18T15:00:00Z',
    openQuestions: 2,
    keyContacts: ['Tom Bradley (Delta CEO)', 'Marcus Webb (Legal)', 'Distribution Ops'],
    tags: ['partnership', 'distribution', 'legal'],
    insights: [
      '22% revenue share agreed in principle',
      'Exclusivity conflict with Northeast partner flagged',
      'Joint meeting proposed week of May 18th',
    ],
    contextPages: ['deals/delta-partnership.md', 'contacts/tom-bradley.md', 'legal/delta-exclusivity.md'],
    metrics: { dealSize: '$12M', dealValue: 12, stage: 'Legal Review', probability: 55 },
  },
  {
    id: 'deal-bravo',
    name: 'Bravo Capital',
    companyName: 'BRAVO',
    description: 'Board information rights only — $9M follow-on. Hot inbound; board info presentation Friday.',
    status: 'active',
    temperature: 'hot',
    isPinned: false,
    needsAction: false,
    actionNote: null,
    fieldReportSummary: 'Board Info Presentation Friday',
    editorialHeadline: 'Bravo Board Presentation Friday — Inbound Hot',
    editorialBody: [
      'Bravo Capital has requested board information rights as a precondition to their $9M follow-on commitment. The board information presentation is confirmed for this Friday at 2pm. CFO Lisa Huang has prepared the financial package.',
      'Bravo Managing Partner Chris Adler attended the last two board meetings as an observer and has been publicly positive. The follow-on is considered highly likely contingent on Friday\'s presentation meeting expectations on gross margin trajectory.',
    ],
    lastConversationAt: '2026-05-14T04:00:00Z',
    nextMeeting: '2026-05-17T14:00:00Z',
    openQuestions: 2,
    keyContacts: ['Chris Adler (Managing Partner)', 'Lisa Huang (CFO)', 'Board Secretary'],
    tags: ['follow-on', 'board-info', 'hot'],
    insights: [
      'Board info presentation confirmed Friday 2pm',
      'Chris Adler observed last two board meetings — positive signals',
      'Gross margin trajectory is the key metric to present',
    ],
    contextPages: ['deals/bravo-followon.md', 'contacts/chris-adler.md', 'board/q1-package.md'],
    metrics: { dealSize: '$9M', dealValue: 9, stage: 'Board Info', probability: 78 },
  },
  {
    id: 'deal-charlie',
    name: 'Charlie Ventures',
    companyName: 'CHARLIE',
    description: 'Seed-stage deal — $4M. Contact ghosted 14 days ago after positive initial meetings. Re-engagement required.',
    status: 'stalled',
    temperature: 'cold',
    isPinned: false,
    needsAction: true,
    actionNote: 'Ghosted 14d — Re-engage',
    fieldReportSummary: 'Ghosted 14d — re-engagement required',
    editorialHeadline: 'Charlie Goes Dark — 14 Days Silent',
    editorialBody: [
      'Charlie Ventures has gone silent for fourteen days following what appeared to be a productive second meeting on April 30th. Partner Kevin Lau attended with two associates and requested a detailed technical roadmap — which was delivered on May 1st — but has not responded since.',
      'Comparable silence patterns in the database suggest 60% probability of a competing term sheet received. Recommended re-engagement approach: brief personal note from CEO, not sales team, acknowledging the silence and offering a 15-minute call to address any concerns. Avoid multi-touch cadence which historically provokes ghosting escalation.',
    ],
    lastConversationAt: '2026-04-30T10:00:00Z',
    nextMeeting: null,
    openQuestions: 1,
    keyContacts: ['Kevin Lau (Partner)', 'Charlie Ventures Team'],
    tags: ['seed', 'stalled', 'cold', 'ghosted'],
    insights: [
      '14 days dark after technical roadmap delivery May 1st',
      '60% probability competing term sheet received',
      'Recommend CEO personal note — avoid sales cadence',
    ],
    contextPages: ['deals/charlie-seed.md', 'contacts/kevin-lau.md'],
    metrics: { dealSize: '$4M', dealValue: 4, stage: 'Stalled', probability: 25 },
  },
  {
    id: 'deal-echo',
    name: 'Echo Systems',
    companyName: 'ECHO',
    description: 'New inbound — $2M pilot. Intro scheduled via warm referral from Flagship network.',
    status: 'watch',
    temperature: 'new',
    isPinned: false,
    needsAction: false,
    actionNote: null,
    fieldReportSummary: 'Intro scheduled — Flagship referral',
    editorialHeadline: 'Echo Systems: New Inbound via Flagship Network',
    editorialBody: [
      'Echo Systems was referred by Helena Cross at Flagship last Thursday, representing a potential $2M pilot engagement in the infrastructure monitoring space. Initial call scheduled for May 19th.',
      'Echo is a 40-person Series A company with strong ARR growth (180% YoY). The pilot would serve as a reference deployment in the financial services vertical. Early qualification indicates strong product-market fit alignment.',
    ],
    lastConversationAt: '2026-05-09T14:00:00Z',
    nextMeeting: '2026-05-19T11:00:00Z',
    openQuestions: 1,
    keyContacts: ['Echo Systems CEO', 'Helena Cross (Referral)'],
    tags: ['inbound', 'new', 'pilot', 'finserv'],
    insights: [
      'Warm referral from Helena Cross at Flagship',
      '180% ARR YoY growth — strong fit signals',
      'Financial services vertical pilot opportunity',
    ],
    contextPages: ['deals/echo-pilot.md', 'contacts/echo-ceo.md'],
    metrics: { dealSize: '$2M', dealValue: 2, stage: 'Intro', probability: 40 },
  },
  {
    id: 'deal-golf',
    name: 'Golf Fund III',
    companyName: 'GOLF',
    description: 'LP relationship — $7M commitment in Fund III. Last touch 2 days ago. Warm relationship, quarterly update due.',
    status: 'watch',
    temperature: 'warm',
    isPinned: false,
    needsAction: false,
    actionNote: null,
    fieldReportSummary: '2d since touch — quarterly update due',
    editorialHeadline: 'Golf Fund III: Quarterly Update Window Opening',
    editorialBody: [
      'Golf Capital Management committed $7M to Fund III with an option to double in Fund IV. The quarterly update window opens this week; last direct contact was 2 days ago via email — no response yet, which is within normal cadence.',
      'LP relationship manager notes Golf\'s investment committee has been evaluating a competing fund manager. Delivering a strong Q1 performance narrative this week is strategically important for Fund IV conversation.',
    ],
    lastConversationAt: '2026-05-12T08:00:00Z',
    nextMeeting: '2026-05-21T10:00:00Z',
    openQuestions: 1,
    keyContacts: ['Golf Capital LP Contact', 'Fund Admin'],
    tags: ['lp', 'fund-iii', 'quarterly-update'],
    insights: [
      'Quarterly update window opens this week',
      'Competing fund manager being evaluated by Golf IC',
      'Strong Q1 narrative critical for Fund IV discussion',
    ],
    contextPages: ['deals/golf-fund3.md', 'contacts/golf-lp.md', 'reports/q1-lp-update.md'],
    metrics: { dealSize: '$7M', dealValue: 7, stage: 'LP Relations', probability: 80 },
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'deal-alpha': [
    {
      id: 'm1',
      role: 'user',
      content: 'What are the key risks with the Alpha term sheet situation?',
      timestamp: '2026-05-14T06:00:00Z',
    },
    {
      id: 'm2',
      role: 'assistant',
      content: 'Three risks require immediate attention. First, the competing Crosspoint offer at +15% pre-money — if Alpha countersigns that instead, you lose deal lead. Intelligence from the cap table suggests Crosspoint moved Monday, which aligns with the silence. Second, the board approval window: five days notice required, closing Wednesday. If the countersign comes Thursday, you\'re into a June board cycle. Third, James Whitfield\'s travel — Dana Reeves is empowered but junior; she may be stalling to avoid making a unilateral call on the competing offer. Recommend you reach Whitfield directly on mobile today.',
      timestamp: '2026-05-14T06:01:30Z',
    },
    {
      id: 'm3',
      role: 'user',
      content: "What's the best approach to reach Whitfield while he's in Singapore?",
      timestamp: '2026-05-14T06:03:00Z',
    },
    {
      id: 'm4',
      role: 'assistant',
      content: "Your notes from three prior interactions with Whitfield show he responds best to direct, time-bounded asks — he dislikes open-ended pressure. I'd suggest a WhatsApp message over email given timezone: acknowledge you know he's travelling, state the specific issue in one sentence (term sheet day 3, board window closing Wednesday), and ask for a yes/no on a 10-minute call in the next 24 hours. Don't mention Crosspoint directly — it signals intelligence gathering and may feel adversarial. His travel schedule from LinkedIn suggests he's in Singapore through Friday, so you have a 3-hour window when it's 9am for him and business hours for you.",
      timestamp: '2026-05-14T06:04:00Z',
    },
  ],
};

export const MOCK_KNOWLEDGE_NODES: KnowledgeNode[] = [
  { id: 'alpha', label: 'Alpha Corp', type: 'deal', group: 1 },
  { id: 'flagship', label: 'Flagship Ventures', type: 'deal', group: 1 },
  { id: 'foxtrot', label: 'Foxtrot Technologies', type: 'deal', group: 1 },
  { id: 'whitfield', label: 'James Whitfield', type: 'person', group: 2 },
  { id: 'helena', label: 'Helena Cross', type: 'person', group: 2 },
  { id: 'rachel', label: 'Rachel Osei', type: 'person', group: 2 },
  { id: 'crosspoint', label: 'Crosspoint Ventures', type: 'company', group: 3 },
  { id: 'term-sheet', label: 'Alpha Term Sheet v2', type: 'document', group: 5 },
  { id: 'ts-overdue', label: 'Term Sheet Overdue', type: 'topic', group: 4 },
  { id: 'board-window', label: 'Board Approval Window', type: 'topic', group: 4 },
  { id: 'delta', label: 'Delta Partners', type: 'deal', group: 1 },
  { id: 'bravo', label: 'Bravo Capital', type: 'deal', group: 1 },
  { id: 'charlie', label: 'Charlie Ventures', type: 'deal', group: 1 },
];

export const MOCK_KNOWLEDGE_LINKS: KnowledgeLink[] = [
  { source: 'alpha', target: 'whitfield', strength: 0.9 },
  { source: 'alpha', target: 'crosspoint', strength: 0.7 },
  { source: 'alpha', target: 'term-sheet', strength: 1.0 },
  { source: 'alpha', target: 'ts-overdue', strength: 0.9 },
  { source: 'alpha', target: 'board-window', strength: 0.8 },
  { source: 'flagship', target: 'helena', strength: 1.0 },
  { source: 'foxtrot', target: 'rachel', strength: 0.9 },
  { source: 'flagship', target: 'alpha', strength: 0.3 },
  { source: 'delta', target: 'bravo', strength: 0.2 },
  { source: 'charlie', target: 'ts-overdue', strength: 0.4 },
];
