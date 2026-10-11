/**
 * @file Curated knowledge base for retrieval (RAG)
 *
 * General placement guidance, written for this project. It is NOT scraped
 * from any company and makes no claims about a specific employer's current
 * process. Always tell players to verify details on the official careers page.
 *
 * To extend: add chunks here, or load your own with `addChunks()` in
 * lib/rag/retriever.ts (for example from a JSON file of interview experiences).
 */

export type KbKind = 'guide' | 'pattern' | 'tip';

export interface KbChunk {
  id: string;
  title: string;
  kind: KbKind;
  /** Subject tags used for filtering and for roadmap lookups. */
  topics: string[];
  /** Company types or track ids this applies to. Empty means everyone. */
  audience: string[];
  text: string;
}

export const KNOWLEDGE_BASE: KbChunk[] = [
  // ── Company-type patterns ────────────────────────────────────────────────
  { id: 'pat-it-services', title: 'Typical IT services hiring process', kind: 'pattern', topics: ['process', 'aptitude', 'coding-round', 'hr'], audience: ['it-services'],
    text: 'Mass-hiring IT services drives usually start with an online test covering quantitative aptitude, logical reasoning, verbal ability and a few basic coding problems. Shortlisted candidates face a technical interview on fundamentals and one project, then an HR round. Cutoffs per section are common, so skipping a weak section can eliminate you even if other sections are strong. Practice timed sections.' },
  { id: 'pat-product', title: 'Typical product company hiring process', kind: 'pattern', topics: ['process', 'dsa', 'coding-round', 'system-design'], audience: ['product'],
    text: 'Product companies often begin with an online assessment of two to three DSA problems, followed by two coding interviews on a shared editor, then a design or hiring-manager conversation. Interviewers grade how you think aloud, handle hints, test your code and discuss complexity. Fresher design rounds are usually low-level design or simple system design, not massive scale.' },
  { id: 'pat-startup', title: 'Typical startup hiring process', kind: 'pattern', topics: ['process', 'projects', 'ownership'], audience: ['startup', 'platform'],
    text: 'Startups usually run a short screening call, a take-home task or live pairing session, and a founder conversation. They look for ownership: what you decided, shipped and learned. A deployed project with real users, a clean README and a short demo video often matters more than marks. Expect questions about trade-offs you made.' },
  { id: 'pat-core', title: 'Typical core engineering hiring process', kind: 'pattern', topics: ['process', 'core', 'ee', 'fundamentals'], audience: ['core-engg', 'iot-product'],
    text: 'Core engineering drives for electrical, electronics and mechanical roles typically use a written test on subject fundamentals, followed by a technical interview that starts from your syllabus and moves to your projects. Expect machines, power systems, control systems, analog and digital electronics, microcontrollers and basic safety. Hands-on projects, even lab-level, give strong talking points.' },
  { id: 'pat-data', title: 'Typical data and ML hiring process', kind: 'pattern', topics: ['process', 'ml', 'sql', 'statistics'], audience: ['data-ai', 'ai-solution'],
    text: 'Data and ML roles often test SQL, statistics, Python and one project in depth. Analyst roles include a business case where you interpret messy data. ML roles probe evaluation metrics, overfitting, feature engineering and why you chose a model. Interviewers value reproducible experiments and an honest discussion of failures.' },
  { id: 'pat-psu', title: 'Typical PSU and government hiring process', kind: 'pattern', topics: ['process', 'gate', 'interview'], audience: ['govt-psu', 'marketplace'],
    text: 'Many public sector units shortlist by GATE score or a written exam, then run a group discussion and a personal interview. Document verification and category norms apply. Subject clarity and calm presentation in the interview matter. Current affairs in the relevant sector often come up. Check each notification for eligibility and dates.' },
  { id: 'pat-bfsi', title: 'Typical BFSI and consulting hiring process', kind: 'pattern', topics: ['process', 'case', 'gd', 'sql'], audience: ['bfsi-consulting'],
    text: 'Financial technology and consulting firms combine timed coding or aptitude tests with structured interviews. Consulting adds case interviews and group exercises that grade structured thinking. For BFSI tech roles expect SQL, data integrity questions and behavioural questions about ethics and risk. Composure and precision are part of the brand.' },

  // ── Resume ───────────────────────────────────────────────────────────────
  { id: 'res-one-page', title: 'Keep the resume to one page', kind: 'tip', topics: ['resume'], audience: [],
    text: 'For freshers, a one-page resume is the norm. Recruiters skim the top third first, so lead with your strongest proof: projects, internships or research. Use a clean single-column layout so applicant tracking systems can parse it. Avoid tables, images, icons and skill progress bars.' },
  { id: 'res-bullets', title: 'Write bullets with an action and a number', kind: 'tip', topics: ['resume', 'projects'], audience: [],
    text: 'Each project bullet should say what you did, how, and what changed. A weak bullet: Worked on a web app. A stronger bullet: Built a REST API in Node.js with caching, cutting average response time from 800 ms to 220 ms. Use numbers where honest: latency, users, accuracy, dataset size, time saved. Never invent metrics.' },
  { id: 'res-filler', title: 'Cut filler sections', kind: 'tip', topics: ['resume'], audience: [],
    text: 'Sections that waste space on a modern tech resume: objective paragraph, passport photo, father\'s name and date of birth, hobbies, references available on request, and a declaration with signature. Use the space for projects, open-source work, research or measurable achievements.' },
  { id: 'res-links', title: 'Make your links clickable and worth clicking', kind: 'tip', topics: ['resume', 'portfolio'], audience: [],
    text: 'Include a GitHub and LinkedIn link in the header. Pin two or three repositories that have a clear README, screenshots and setup steps. A recruiter who opens an empty or messy profile loses trust. A live demo link is better than a long project description.' },
  { id: 'res-skills', title: 'Group skills and avoid skill bars', kind: 'tip', topics: ['resume', 'skills'], audience: [],
    text: 'List skills in groups: Languages, Frameworks, Tools, Core subjects. Only list what you can discuss for ten minutes. Interviewers pick items from your skills section to question you, so an exaggerated list becomes a trap. Percentage bars and star ratings are meaningless and often unreadable by parsers.' },
  { id: 'res-ats', title: 'Resume keywords and role matching', kind: 'tip', topics: ['resume', 'ats'], audience: [],
    text: 'Read the job description and mirror its honest keywords. If the role asks for SQL and REST APIs and you have used both, name them explicitly in your bullets, not only in a skills list. Keywords you do not have should not be added. Tailor a base resume for each company type.' },

  // ── Communication / HR ───────────────────────────────────────────────────
  { id: 'hr-intro', title: 'Tell me about yourself in 30 seconds', kind: 'guide', topics: ['hr', 'communication', 'intro'], audience: [],
    text: 'Structure the introduction in three parts: who you are (degree, college, graduation year), what you have built or learned that is relevant to the role, and why this role or company. Keep it to about 30 to 45 seconds. Do not recite your resume line by line. End with a hook the interviewer can follow, such as a project you are proud of.' },
  { id: 'hr-star', title: 'Use STAR for behavioural answers', kind: 'guide', topics: ['hr', 'communication', 'star'], audience: [],
    text: 'For questions like Tell me about a conflict or a failure, use STAR: Situation, Task, Action, Result. Spend most of the time on your action and the result, plus what you learned. Prepare four stories: a team conflict, a failure, a time you led or took initiative, and a time you learned something fast. Reuse them for different questions.' },
  { id: 'hr-weakness', title: 'Answering the weakness question', kind: 'tip', topics: ['hr', 'communication'], audience: [],
    text: 'Pick a real, non-fatal weakness and show active work on it. Avoid clichés like perfectionism. Example: I used to jump into coding without planning, so now I write a short design note first, and my last project had fewer rewrites. Honest and improving beats flawless and fake.' },
  { id: 'hr-why-company', title: 'Why this company', kind: 'tip', topics: ['hr', 'research'], audience: [],
    text: 'Spend an hour on the company before the interview: what the product does, the tech they use, one recent update, and how your skills connect. A specific answer such as their approach to a particular problem beats generic praise. Prepare two thoughtful questions to ask at the end.' },
  { id: 'comm-think-aloud', title: 'Think aloud while solving', kind: 'tip', topics: ['communication', 'coding-round', 'dsa'], audience: [],
    text: 'In coding interviews, narrate: restate the problem, ask clarifying questions, give a brute-force idea first, then improve it. State time and space complexity. Test with a small example before saying you are done. Silence makes interviewers guess whether you are stuck or thinking.' },
  { id: 'comm-gd', title: 'Group discussion basics', kind: 'guide', topics: ['gd', 'communication'], audience: [],
    text: 'In a group discussion, open with a short definition or a fresh angle if you can, contribute at steady intervals, build on others by name, and summarise if the discussion drifts. Quality beats volume. Interrupting loudly lowers your score. Practise weekly with a fixed topic list.' },
  { id: 'comm-mock', title: 'Why mock interviews work', kind: 'tip', topics: ['communication', 'mock'], audience: [],
    text: 'Mocks reveal filler words, rambling answers and weak openings that private study hides. Record at least one mock, watch it once, and fix two things before the next. Ask a senior who has cleared similar interviews, not only a friend. Do one mock per week during peak season.' },

  // ── DSA ──────────────────────────────────────────────────────────────────
  { id: 'dsa-patterns', title: 'Learn DSA by pattern', kind: 'guide', topics: ['dsa', 'coding-round'], audience: [],
    text: 'Group problems by pattern: two pointers, sliding window, binary search on answer, hashing, stack and monotonic stack, BFS and DFS, heap for top-k, intervals, backtracking and dynamic programming. After solving, write the pattern name and the trigger that tells you to use it. Reviewing mistakes weekly beats solving more new problems.' },
  { id: 'dsa-study-plan', title: 'A realistic DSA schedule', kind: 'guide', topics: ['dsa', 'plan'], audience: ['web-app', 'product'],
    text: 'Aim for steady progress: about five problems a day for thirty days is more useful than a weekend binge. Start with arrays and strings, hashing, then trees and graphs, then dynamic programming. Time yourself. If you cannot solve a problem in 30 minutes, study the approach, then re-solve it from scratch two days later.' },
  { id: 'dsa-complexity', title: 'Always discuss complexity', kind: 'tip', topics: ['dsa', 'coding-round'], audience: [],
    text: 'State time and space complexity for every solution without being asked. Know common ones: hash lookup O(1) average, sorting O(n log n), binary search O(log n), BFS and DFS O(V+E). Know how recursion depth affects space. Be ready to explain why a brute-force solution is too slow for the given constraints.' },

  // ── Core CS ──────────────────────────────────────────────────────────────
  { id: 'cs-os', title: 'Operating systems: what gets asked', kind: 'guide', topics: ['os', 'corecs'], audience: [],
    text: 'Common operating system topics: process versus thread, context switching, scheduling algorithms, deadlock conditions and prevention, synchronization with mutex and semaphore, paging and virtual memory, and the producer-consumer problem. Be able to explain with a small example, not just a definition.' },
  { id: 'cs-dbms', title: 'DBMS and SQL: what gets asked', kind: 'guide', topics: ['dbms', 'sql', 'corecs'], audience: [],
    text: 'Common DBMS topics: normalisation up to BCNF, ACID properties, transactions and isolation levels, indexing and why indexes speed up reads but slow writes, joins, primary versus foreign keys, and writing queries with group by, having and subqueries. Practise writing joins and window functions by hand.' },
  { id: 'cs-cn', title: 'Computer networks: what gets asked', kind: 'guide', topics: ['cn', 'corecs'], audience: [],
    text: 'Common networking topics: the OSI and TCP/IP layers, TCP versus UDP, the three-way handshake, what happens when you type a URL into a browser, DNS, HTTP versus HTTPS, and basic subnetting. Practise the browser question end to end, it covers many layers at once.' },
  { id: 'cs-oop', title: 'OOP and design basics', kind: 'guide', topics: ['oop', 'corecs', 'design'], audience: [],
    text: 'Explain the four pillars with real examples: encapsulation, inheritance, polymorphism and abstraction. Know the difference between an abstract class and an interface, overloading and overriding, and a few patterns such as singleton, factory and observer. Low-level design rounds ask you to model a parking lot or a cache with clean classes.' },
  { id: 'cs-sysdesign', title: 'System design for freshers', kind: 'guide', topics: ['system-design', 'design'], audience: ['web-app', 'product'],
    text: 'Fresher design rounds focus on basics: clarify requirements, estimate scale roughly, sketch components, pick a database and justify it, add caching where reads dominate, and discuss trade-offs. Practise a URL shortener, a chat service and a rate limiter. Reasoning clearly matters more than naming every technology.' },

  // ── Embedded / core ──────────────────────────────────────────────────────
  { id: 'emb-c', title: 'Embedded C essentials', kind: 'guide', topics: ['embedded', 'c', 'core'], audience: ['core-engg', 'iot-product'],
    text: 'Frequent embedded C topics: the volatile keyword and when it matters, pointers and pointer arithmetic, bit manipulation to set, clear and toggle bits, memory layout of stack, heap and static data, interrupts and ISR rules, and const correctness. Be ready to write short functions on paper.' },
  { id: 'emb-protocols', title: 'I2C, SPI and UART comparison', kind: 'guide', topics: ['embedded', 'protocols'], audience: ['core-engg', 'iot-product'],
    text: 'UART is asynchronous with two lines and no clock, suited to simple point-to-point links. SPI is synchronous, full duplex and fast, with separate chip-select lines per device. I2C is synchronous with two shared lines, addressing for many devices, and lower speed. Be ready to explain when you would choose each and what pull-up resistors do on I2C.' },
  { id: 'emb-project', title: 'Explaining a hardware project', kind: 'tip', topics: ['embedded', 'projects', 'communication'], audience: ['core-engg', 'iot-product'],
    text: 'For a board project, prepare: the problem, a block diagram, why you chose that microcontroller, one bug you debugged with a tool such as a multimeter or logic analyser, and what you would improve. Bring a photo or short video. Panels remember the debugging story more than the feature list.' },
  { id: 'ee-core-topics', title: 'Core electrical subjects to revise', kind: 'guide', topics: ['ee', 'core', 'fundamentals'], audience: ['core-engg', 'iot-product'],
    text: 'For electrical roles, revise: network theorems, three-phase systems, transformers and machines, per-unit systems, protection basics, control system stability with root locus and Bode plots, analog circuits with op-amps, digital logic and basic power electronics. Make a one-page summary for each subject.' },
  { id: 'ee-matlab', title: 'Simulation projects that interviewers like', kind: 'tip', topics: ['ee', 'matlab', 'projects'], audience: ['core-engg', 'iot-product'],
    text: 'A closed-loop control simulation, a converter design with efficiency curves or a filter design with frequency response can be a strong project when you can explain parameter choices and show before-and-after results. Document assumptions and what you would test on hardware.' },

  // ── Data / ML ────────────────────────────────────────────────────────────
  { id: 'ml-metrics', title: 'Evaluation metrics you must know', kind: 'guide', topics: ['ml', 'statistics'], audience: ['data-ai', 'ai-solution'],
    text: 'Know precision, recall, F1, ROC-AUC and when accuracy misleads on imbalanced data. For regression know MAE, RMSE and R-squared. Be ready to explain the confusion matrix and choose a metric for a given business goal. Overfitting, regularisation and train-validation-test splits are near-certain questions.' },
  { id: 'ml-project', title: 'Present an ML project well', kind: 'tip', topics: ['ml', 'projects', 'communication'], audience: ['data-ai', 'ai-solution'],
    text: 'Structure the walkthrough: problem and data, baseline, improvements with numbers, error analysis, and limitations. Interviewers probe why you chose each model and how you prevented leakage. Admit what did not work. A reproducible repository with a short report is strong proof.' },
  { id: 'ml-sql', title: 'SQL for analytics interviews', kind: 'guide', topics: ['sql', 'ml', 'analytics'], audience: ['data-ai', 'ai-solution'],
    text: 'Analytics interviews love joins, group by with having, window functions such as row_number and running totals, handling nulls, and finding duplicates. Practise explaining your query step by step. Know the difference between where and having, and between union and union all.' },
  { id: 'ml-stats', title: 'Statistics basics to revise', kind: 'guide', topics: ['statistics', 'ml'], audience: ['data-ai', 'ai-solution', 'marketplace'],
    text: 'Revise mean, median and variance, common distributions, central limit theorem, hypothesis testing with p-values, confidence intervals, correlation versus causation and the basics of A/B testing. Be able to explain each in plain language to a non-expert.' },
  { id: 'ml-research-paper', title: 'Using a research paper as proof', kind: 'tip', topics: ['research', 'ml', 'projects'], audience: ['data-ai', 'ai-solution', 'marketplace'],
    text: 'A paper, even at a workshop or student venue, is strong proof of depth. In interviews, summarise the problem, method, results and your exact contribution in two minutes. Know the baselines you compared against and the limits of your experiments. Link the code if possible.' },

  // ── Startup / projects ───────────────────────────────────────────────────
  { id: 'proj-deploy', title: 'Deploy at least one project', kind: 'tip', topics: ['projects', 'portfolio', 'startup'], audience: [],
    text: 'A deployed project with a live link, a README explaining the architecture and one measurable outcome stands out. Add basic tests and a short demo video. Be ready to discuss one trade-off you made and one thing you would change with more time.' },
  { id: 'proj-explain', title: 'Three-minute project walkthrough', kind: 'guide', topics: ['projects', 'communication'], audience: [],
    text: 'Prepare a three-minute walkthrough: the problem and user, your role, the architecture in one sentence, one hard bug and how you solved it, and a measurable result. Practise it out loud. Expect follow-ups on any technology you mention, so only mention what you can defend.' },
  { id: 'proj-takehome', title: 'Doing well on a take-home task', kind: 'tip', topics: ['projects', 'startup'], audience: ['startup', 'platform'],
    text: 'Read the brief twice, list assumptions, and scope tightly. Deliver something that works end to end before polishing. Write a README with setup steps, decisions and what you left out. A short demo video helps. Submit on time, since a smaller finished task beats a bigger broken one.' },
  { id: 'proj-oss', title: 'Open source contributions as proof', kind: 'tip', topics: ['portfolio', 'opensource'], audience: [],
    text: 'Start with documentation fixes and small bugs labelled good first issue. Read the contributing guide, discuss before big changes and respond to review comments politely. A few merged pull requests in a known project show you can read other people\'s code and collaborate.' },

  // ── Aptitude ─────────────────────────────────────────────────────────────
  { id: 'apt-plan', title: 'Aptitude practice plan', kind: 'guide', topics: ['aptitude', 'plan'], audience: ['it-services', 'mobile-app'],
    text: 'Spend 40 minutes daily on timed sections: percentages, ratios, time and work, probability, number series, seating arrangements and reading comprehension. Track accuracy and speed separately. Learn shortcuts only after you understand the concept. Take a full-length mock every week to practise the section switching and time limit.' },
  { id: 'apt-negative', title: 'Handling negative marking', kind: 'tip', topics: ['aptitude', 'coding-round'], audience: ['it-services', 'mobile-app'],
    text: 'When a test has negative marking, answer only what you can narrow down to two options or fewer. Skip and return if time remains. Sectional cutoffs mean you must clear each section, so avoid sacrificing one entirely for another.' },

  // ── Higher studies ───────────────────────────────────────────────────────
  { id: 'gate-plan', title: 'GATE preparation structure', kind: 'guide', topics: ['gate', 'plan'], audience: ['marketplace', 'govt-psu', 'core-engg'],
    text: 'Cover the syllabus once, then loop through previous-year questions by topic. Keep an error notebook and revise it weekly. Take timed mock tests from the start of the final three months. Balance placement preparation by fixing a daily block for GATE rather than switching on and off.' },
  { id: 'ms-sop', title: 'Statement of purpose basics', kind: 'guide', topics: ['research', 'ms', 'gre'], audience: ['marketplace'],
    text: 'A statement of purpose should tell a specific story: what sparked your interest, what you did about it, what you want to study and why this lab or university. Name professors or projects you would work with. Avoid generic praise and lists of achievements already on your resume.' },
  { id: 'ms-research-intern', title: 'Getting a research internship', kind: 'tip', topics: ['research', 'ms'], audience: ['marketplace', 'ai-solution'],
    text: 'Write a short, specific email to a professor: who you are, one line on their paper you read, a relevant project of yours and a clear ask. Attach a one-page resume. Follow up once after a week. Be ready for a short technical conversation about your project.' },

  // ── Strategy ─────────────────────────────────────────────────────────────
  { id: 'str-ladder', title: 'Apply in three tiers', kind: 'guide', topics: ['strategy', 'plan'], audience: [],
    text: 'Divide target companies into safe, target and stretch. Schedule safe drives early to build confidence and secure an offer, apply to target companies with full preparation, and keep one or two stretch applications. Prepare common fundamentals once, then add company-specific modules. Check the placement cell rules about offers and dream-company policies.' },
  { id: 'str-referral', title: 'Referrals and outreach', kind: 'tip', topics: ['strategy', 'network'], audience: [],
    text: 'A referral gets your resume read, not an offer. Message alumni with a specific, short request, share a tailored resume, and make it easy for them to say yes. Thank them whether or not it works. Skills still decide the outcome after the interview call.' },
  { id: 'str-rejections', title: 'Learning from rejections', kind: 'tip', topics: ['strategy', 'motivation'], audience: [],
    text: 'After every interview, write down the questions asked and what you could not answer. Fix one gap before the next drive. Rejections are common even among strong candidates, and the pattern in your notes tells you what to practise next.' },
  { id: 'str-burnout', title: 'Protect sleep and revision time', kind: 'tip', topics: ['strategy', 'wellbeing'], audience: [],
    text: 'Fixed sleep and short daily breaks protect memory and calm. A rested candidate performs better than one who studied until dawn. Schedule a weekly rest block, and plan revision days that are separate from learning new topics.' },
];
