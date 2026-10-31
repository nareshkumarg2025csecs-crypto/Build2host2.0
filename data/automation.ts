export interface AutomationService {
  id: string;
  number: string;
  name: string;
  price: number;
  priceDisplay: string;
  outcome: string;
  description: string;
  bullets: string[];
  scope: string;
  consentNote?: string;
}

export const automationServices: AutomationService[] = [
  {
    id: "whatsapp-lead",
    number: "01",
    name: "WhatsApp AI Lead Response and Qualification",
    price: 1299,
    priceDisplay: "1,299",
    outcome: "Capture and qualify incoming WhatsApp enquiries",
    description:
      "An AI assistant responds to incoming WhatsApp enquiries instantly, gathers buyer requirements conversationally, and delivers a structured lead summary to your agent.",
    bullets: [
      "Instant acknowledgement of new enquiries",
      "Conversational qualification: location, BHK, budget, property type, buy or rent, timeline",
      "AI extracts details from free text messages",
      "Creates or updates a lead row in your Google Sheet with timestamp and source",
      "Sends the agent a structured summary and handoff alert",
      "Fallback reply that never invents availability, pricing or property facts",
    ],
    scope:
      "One WhatsApp number, one qualification flow, one Google Sheet, one notification route, one agreed language.",
  },
  {
    id: "missed-call",
    number: "02",
    name: "Missed-Call Recovery",
    price: 2499,
    priceDisplay: "2,499",
    outcome: "Turn eligible missed calls into structured conversations",
    description:
      "When a call is missed, the system sends an approved WhatsApp follow-up to start a qualifying conversation automatically.",
    bullets: [
      "Listens for missed-call events from a supported provider",
      "Sends an approved WhatsApp follow-up where the business has the required permission",
      "Routes replies into the qualification flow",
      "Logs call time, number, status and captured requirements",
      "Alerts the assigned agent",
    ],
    scope:
      "Requires a supported missed-call webhook or provider and the Package 01 workflow.",
    consentNote:
      "A missed call by itself is not permission for WhatsApp messaging. The client needs an opt-in process and must honour opt-outs.",
  },
  {
    id: "portal-capture",
    number: "03",
    name: "Property Portal Lead Capture and Routing",
    price: 4999,
    priceDisplay: "4,999",
    outcome: "Collect and route leads from supported portals",
    description:
      "Capture enquiries from one supported property portal via official API, webhook or authorised email, normalise them, and route them to your team.",
    bullets: [
      "Captures enquiries via official API, webhook or authorised email notification",
      "Extracts contact details and property interest",
      "Normalises and logs to Google Sheet or CRM",
      "Flags source and timestamp",
      "Optional basic duplicate check",
      "Notifies the assigned agent",
    ],
    scope:
      "One portal, one routing destination. Depends on portal permissions and API access. No scraping or bypassing portal controls.",
  },
  {
    id: "voice-agent",
    number: "04",
    name: "AI Voice Agent",
    price: 7999,
    priceDisplay: "7,999",
    outcome: "Answer and qualify inbound property calls",
    description:
      "A basic inbound AI voice assistant answers approved FAQs, gathers core requirements, creates a call summary, and routes details to your sheet or CRM.",
    bullets: [
      "Answers inbound calls on one number or route",
      "Responds to approved FAQs",
      "Gathers core buyer requirements",
      "Creates a structured call summary",
      "Pushes details into the sheet or CRM",
      "Clear escalation route to a human or callback",
    ],
    scope:
      "One inbound flow and one destination. Outbound calling, multilingual and high-volume flows are scoped separately.",
  },
  {
    id: "complete-suite",
    number: "05",
    name: "Complete Real Estate Automation Suite",
    price: 15000,
    priceDisplay: "15,000",
    outcome: "One connected system from first enquiry to agent handoff",
    description:
      "All four automations in one integrated system with a central lead view, duplicate handling, agent notifications and end-to-end testing.",
    bullets: [
      "All four services integrated into one system",
      "Central lead view with agreed fields",
      "Duplicate handling across channels",
      "Agent notifications across all sources",
      "End-to-end testing of the agreed journey",
    ],
    scope:
      "One business, one WhatsApp number, one voice route, one portal, one Google Sheet or CRM, one notification route.",
  },
];

export const pipelineSteps = [
  {
    number: "01",
    label: "Receive",
    description: "Enquiry arrives via WhatsApp, missed call, portal or voice",
  },
  {
    number: "02",
    label: "Respond",
    description: "Instant acknowledgement sent to the prospect",
  },
  {
    number: "03",
    label: "Qualify",
    description: "AI gathers location, BHK, budget, timeline and intent",
  },
  {
    number: "04",
    label: "Structure",
    description: "Details extracted and logged to the Google Sheet",
  },
  {
    number: "05",
    label: "Hand off",
    description: "Agent receives a structured summary and alert",
  },
  {
    number: "06",
    label: "Follow through",
    description: "Agent contacts the prospect and owns the sale",
  },
];
