type Card = {
  title: string;
  body: string;
  note?: string;
};

type Portal = {
  title: string;
  href: string;
  body: string;
};

type FAQ = {
  question: string;
  answer: string;
};

type Testimonial = {
  quote: string;
  author: string;
  detail: string;
  services: readonly string[];
};

export const heroHighlights = [
  {
    title: 'Private assistance only',
    body: 'Sahaay Digital helps people understand requirements, organize records, and prepare for official processes. It is not a government office.',
  },
  {
    title: 'No government affiliation',
    body: 'The service does not claim to be Passport Seva, the Income Tax Department, the Election Commission, an RTO, or an authorized passport-issuing authority.',
  },
  {
    title: 'Privacy-first handling',
    body: 'Sensitive documents should be requested only when reasonably necessary, with limited access, minimal retention, and no sale of personal data.',
  },
] as const satisfies readonly Card[];

export const heroPills = [
  'Independent private assistance',
  'Official portal-first process',
  'Privacy-aware document handling',
] as const;

export const serviceCards = [
  {
    title: 'Passport application support',
    body: 'Checklist review, data matching, form-preparation guidance, and appointment-readiness support for passport-related applications.',
    note: 'Approval, police verification, appointment availability, and passport issuance remain solely with Passport Seva and the Ministry of External Affairs.',
  },
  {
    title: 'Voter service guidance',
    body: 'Help understanding voter registration, correction, and supporting-document requirements where the official portal or local process allows self-service applications.',
    note: 'Electoral decisions and record updates remain with the Election Commission of India and the relevant electoral registration authorities.',
  },
  {
    title: 'PAN application support',
    body: 'Help with PAN application readiness, document review, correction guidance, and understanding the relevant submission path.',
    note: 'PAN allotment, correction approval, and issuance remain with the Income Tax Department and its authorized PAN service channels.',
  },
  {
    title: 'Aadhaar address update support',
    body: 'Help with address-update readiness, supporting-document review, and understanding the official update path where the relevant channel permits it.',
    note: 'Aadhaar update availability, verification, and approval remain with UIDAI and its authorized update channels.',
  },
  // {
  //   title: 'Professional Tax registration support',
  //   body: 'Help with PT registration readiness, document review, form preparation, and understanding the relevant state-specific online application process.',
  //   note: 'Registration rules, department processing, approval, and certificate issuance remain with the relevant state tax authority and its official portal.',
  // },
  {
    title: 'Karnataka Hindu marriage certificate support',
    body: 'Help with document readiness, detail review, form-preparation guidance, and understanding the official Karnataka workflow for Hindu marriage certificate applications.',
    note: 'Eligibility, registration scrutiny, appointment requirements, and certificate issuance remain with the relevant Karnataka registration authority and its official process.',
  },
  {
    title: 'Online application assistance',
    body: 'General help with document-heavy online applications, form preparation, checklist review, and submission readiness for services that offer official online workflows.',
    note: 'Submission rules, portal availability, and final decisions remain with the relevant authority operating the official application system.',
  }
] as const satisfies readonly Card[];

export const processSteps = [
  {
    title: 'Start with the official process',
    body: 'Begin with the target service, the relevant government workflow, and the client’s current records.',
  },
  {
    title: 'Review only what is needed',
    body: 'Check the minimum set of documents required to identify missing items, conflicts, or obvious inconsistencies.',
  },
  {
    title: 'Prepare the next action',
    body: 'Give the user a practical checklist so they can proceed through the correct official portal or office.',
  },
  {
    title: 'Close the matter carefully',
    body: 'When the support window ends, wrap up the matter and handle retained records according to the privacy policy.',
  },
] as const;

export const portalCards = [
  {
    title: 'Passport Seva',
    href: 'https://portal2.passportindia.gov.in/AppOnlineProject/welcomeLink',
    body: 'Official passport application, appointment, fee, and document information from the Ministry of External Affairs.',
  },
  {
    title: "Voters' Service Portal",
    href: 'https://voters.eci.gov.in/',
    body: 'Official voter registration and electoral service portal operated under the Election Commission of India.',
  },
  {
    title: 'PAN Services',
    href: 'https://tinpan.proteantech.in/services/pan/pan-index.html',
    body: 'Online PAN application, correction, reprint, and related services through Protean, which is entrusted by the Income Tax Department for PAN application acceptance and processing.',
  },
] as const satisfies readonly Portal[];

export const privacyPoints = [
  'Only collect documents and identifiers that are reasonably necessary for the specific service requested.',
  'Prefer masked Aadhaar or partial identifiers where the full number is not strictly required for the task.',
  'Use submitted information only for client communication, checklisting, application guidance, and other support directly tied to the requested service.',
  'Do not sell personal data and do not use identity documents for unrelated marketing or profiling.',
  'Restrict access to client files to the people or service providers actually involved in the matter.',
  'Retain documents only for as long as needed to provide the service, maintain records, resolve disputes, or comply with legal or accounting obligations.',
  'Allow correction or deletion requests where legally permitted, noting that some records may need to be retained for compliance or dispute resolution.',
] as const;

export const termsPoints = [
  'Sahaay Digital is an independent private assistance service and is not a government department, public authority, passport office, or passport-issuing authority.',
  'The service does not guarantee appointment slots, turnaround times, eligibility, approval, issuance, or correction of any passport, voter record, licence, certificate, or other government document.',
  'Government charges, portal fees, and third-party charges are separate from any private service fee charged by Sahaay Digital.',
  'Clients are responsible for the truthfulness, completeness, and legality of the information and documents they provide.',
  'Sahaay Digital may refuse or stop service where records appear forged, misleading, incomplete, or unlawful.',
  'Information on this website is general guidance and should not be treated as legal advice or a substitute for reading the relevant official instructions.',
  'By using this website, contacting Sahaay Digital, booking assistance, or sharing documents for support, the user acknowledges and agrees to these Terms & Conditions and the Privacy Notice.',
] as const;

export const faqs = [
  {
    question: 'Are you a passport agent or government office?',
    answer:
      'No. Sahaay Digital is an independent private assistance service. Official decisions, appointments, verification, and issuance remain with the relevant government authority.',
  },
  {
    question: 'Will you submit or approve the application for me?',
    answer:
      'The service can help the user prepare, review, and navigate the process, but official submission and approval happen only through the relevant government portal or office.',
  },
  {
    question: 'What sensitive documents might be involved?',
    answer:
      'Depending on the case, the process may involve Aadhaar, PAN, driving licence, address proof, educational records, or other identity documents. The policy is to ask only for what is reasonably needed.',
  },
  {
    question: 'How will document privacy be handled?',
    answer:
      'Access should be limited to the people handling the matter, unrelated use is not allowed, personal data should not be sold, and retained records should be deleted or anonymized when they are no longer needed, subject to legal obligations.',
  },
] as const satisfies readonly FAQ[];

export const testimonials = [
  {
    quote: 'I got passport documentation verification support for my wife, me, and my mother. The guidance kept the paperwork clear, organized, and easier to review before moving ahead with the official process. My wife had a descrepancy in her father\'s name in her 10th marks card, the guidance helped in smooth proceedings at the PSK.',
    author: 'Private client',
    detail: 'Names are withheld for privacy.',
    services: ['Passport documentation verification'],
  },
  {
    quote:
      'I got marriage certificate support for me and my wife. The document review and preparation guidance helped us keep the process straightforward and well-organized.',
    author: 'Private client',
    detail: 'Names are withheld for privacy.',
    services: ['Karnataka Hindu marriage certificate'],
  },
] as const satisfies readonly Testimonial[];
