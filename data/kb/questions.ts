/**
 * @file Interview question bank with grading rubrics
 *
 * Each question lists key points as groups of word stems. A key point counts
 * as covered when ANY stem in its group appears in the answer. The rubric
 * score is deterministic, so the agent's score never depends on an LLM.
 */

export interface InterviewQuestion {
  id: string;
  topic: string;
  /** Company types or track ids. Empty means all. */
  audience: string[];
  difficulty: 1 | 2 | 3;
  question: string;
  /** Each inner array is one key point (synonym stems). */
  keyPoints: string[][];
  hint: string;
}

export const QUESTIONS: InterviewQuestion[] = [
  { id: 'q-intro', topic: 'hr', audience: [], difficulty: 1, question: 'Tell me about yourself in about 30 seconds.',
    keyPoints: [['student', 'engineering', 'final year', 'btech', 'b.tech'], ['project', 'built', 'developed', 'internship'], ['skill', 'learn', 'python', 'c++', 'java', 'embedded', 'data'], ['role', 'company', 'interested', 'opportunity', 'looking']],
    hint: 'Who you are, what you built, why this role.' },
  { id: 'q-weakness', topic: 'hr', audience: [], difficulty: 1, question: 'What is your biggest weakness?',
    keyPoints: [['weakness', 'used to', 'tend to', 'struggle'], ['working on', 'improv', 'now i', 'started', 'learned'], ['example', 'project', 'for instance', 'last']],
    hint: 'A real, non-fatal weakness plus what you are doing about it.' },
  { id: 'q-conflict', topic: 'hr', audience: [], difficulty: 2, question: 'Tell me about a conflict in a team and how you handled it.',
    keyPoints: [['situation', 'team', 'project', 'when'], ['task', 'responsib', 'goal', 'needed'], ['talked', 'listened', 'discuss', 'agreed', 'action', 'decid'], ['result', 'outcome', 'delivered', 'learned']],
    hint: 'Use STAR: situation, task, action, result.' },
  { id: 'q-proc-thread', topic: 'os', audience: [], difficulty: 1, question: 'What is the difference between a process and a thread?',
    keyPoints: [['address space', 'memory'], ['share', 'shared'], ['context switch', 'lighter', 'lightweight', 'overhead'], ['independent', 'isolated', 'own'], ['example', 'browser', 'tab']],
    hint: 'Memory isolation, sharing and cost of switching.' },
  { id: 'q-deadlock', topic: 'os', audience: [], difficulty: 2, question: 'What is a deadlock and what conditions cause it?',
    keyPoints: [['mutual exclusion'], ['hold and wait'], ['no preemption', 'preempt'], ['circular wait'], ['prevent', 'avoid', 'ordering', 'banker']],
    hint: 'Name the four Coffman conditions and one way to break them.' },
  { id: 'q-acid', topic: 'dbms', audience: [], difficulty: 1, question: 'Explain the ACID properties of a database transaction.',
    keyPoints: [['atomic'], ['consisten'], ['isolation', 'isolated'], ['durab'], ['example', 'bank', 'transfer', 'commit', 'rollback']],
    hint: 'Four properties, each with one line, plus a bank-transfer example.' },
  { id: 'q-index', topic: 'dbms', audience: [], difficulty: 2, question: 'What is an index and what are the trade-offs of adding one?',
    keyPoints: [['faster', 'speed', 'quick', 'lookup', 'read'], ['b-tree', 'b tree', 'tree', 'hash'], ['slower write', 'write', 'insert', 'update'], ['storage', 'space', 'memory']],
    hint: 'Faster reads, slower writes, extra storage.' },
  { id: 'q-url', topic: 'cn', audience: [], difficulty: 2, question: 'What happens when you type a URL into a browser and press enter?',
    keyPoints: [['dns'], ['tcp', 'handshake'], ['http', 'request'], ['server', 'response'], ['render', 'html', 'browser display'], ['tls', 'https', 'ssl']],
    hint: 'DNS, TCP, TLS, HTTP request, response, rendering.' },
  { id: 'q-tcp-udp', topic: 'cn', audience: [], difficulty: 1, question: 'Compare TCP and UDP.',
    keyPoints: [['reliable', 'guarantee', 'ack'], ['connection', 'handshake'], ['fast', 'faster', 'low latency', 'overhead'], ['streaming', 'video', 'gaming', 'dns', 'voip'], ['order', 'sequence']],
    hint: 'Reliability versus speed, with use cases.' },
  { id: 'q-oop', topic: 'oop', audience: [], difficulty: 1, question: 'Explain the four pillars of OOP with an example.',
    keyPoints: [['encapsulat'], ['inherit'], ['polymorph'], ['abstract'], ['example', 'class', 'animal', 'vehicle', 'shape']],
    hint: 'Name all four and tie them to one example class.' },
  { id: 'q-hash', topic: 'dsa', audience: ['product', 'web-app', 'it-services', 'bfsi-consulting', 'startup'], difficulty: 1, question: 'How would you find two numbers in an array that add up to a target? State the complexity.',
    keyPoints: [['hash', 'map', 'dictionary', 'set'], ['o(n)', 'linear', 'one pass'], ['brute', 'o(n^2)', 'n squared', 'nested'], ['complement', 'target minus', 'difference', 'target -']],
    hint: 'Brute force first, then a hash map in one pass.' },
  { id: 'q-bfs-dfs', topic: 'dsa', audience: ['product', 'web-app', 'startup'], difficulty: 2, question: 'When would you use BFS versus DFS on a graph?',
    keyPoints: [['shortest', 'level', 'minimum steps'], ['queue'], ['stack', 'recursion'], ['o(v+e)', 'v + e', 'vertices and edges', 'linear'], ['cycle', 'path', 'topolog', 'connected']],
    hint: 'BFS for shortest path in unweighted graphs, DFS for exploring and cycle detection.' },
  { id: 'q-dp', topic: 'dsa', audience: ['product', 'web-app'], difficulty: 3, question: 'Explain dynamic programming using the climbing stairs or Fibonacci problem.',
    keyPoints: [['overlapping', 'repeated', 'subproblem'], ['optimal substructure', 'recurrence', 'relation'], ['memo', 'cache', 'top-down'], ['tabulation', 'bottom-up', 'iterative'], ['o(n)', 'exponential', '2^n']],
    hint: 'Overlapping subproblems, recurrence, memoisation or tabulation, complexity.' },
  { id: 'q-sql-join', topic: 'sql', audience: ['data-ai', 'ai-solution', 'it-services', 'bfsi-consulting', 'startup'], difficulty: 1, question: 'Explain inner, left and full outer joins.',
    keyPoints: [['inner', 'matching', 'both'], ['left', 'all rows from the left', 'left table'], ['full', 'all rows from both', 'either'], ['null'], ['example', 'orders', 'customers', 'employees']],
    hint: 'Describe each join by which rows survive, with nulls.' },
  { id: 'q-window', topic: 'sql', audience: ['data-ai', 'ai-solution', 'bfsi-consulting'], difficulty: 3, question: 'What is a window function and how is it different from group by?',
    keyPoints: [['over', 'partition'], ['row_number', 'rank', 'running', 'lag', 'lead'], ['keep rows', 'does not collapse', 'every row', 'without collapsing'], ['aggregate', 'group by collapses', 'collapse']],
    hint: 'Window keeps all rows; group by collapses them.' },
  { id: 'q-metrics', topic: 'ml', audience: ['data-ai', 'ai-solution'], difficulty: 2, question: 'Why can accuracy be misleading, and which metrics would you use instead?',
    keyPoints: [['imbalanc', 'skew', 'rare'], ['precision'], ['recall'], ['f1', 'auc', 'roc'], ['confusion matrix', 'false positive', 'false negative']],
    hint: 'Imbalanced data and precision, recall, F1.' },
  { id: 'q-overfit', topic: 'ml', audience: ['data-ai', 'ai-solution'], difficulty: 2, question: 'What is overfitting and how do you reduce it?',
    keyPoints: [['training', 'train'], ['validation', 'test', 'unseen', 'generaliz'], ['regulariz', 'l1', 'l2', 'dropout'], ['more data', 'augment', 'cross-validation', 'cross validation', 'early stopping', 'simpler model']],
    hint: 'Good on training, bad on unseen data; regularisation, more data, validation.' },
  { id: 'q-volatile', topic: 'embedded', audience: ['core-engg', 'iot-product'], difficulty: 2, question: 'What does the volatile keyword do in embedded C, and when do you need it?',
    keyPoints: [['optimi', 'compiler'], ['hardware register', 'register', 'peripheral', 'memory-mapped'], ['interrupt', 'isr', 'flag'], ['change', 'unexpected', 'outside', 'read every time', 'reload']],
    hint: 'Stops the compiler from caching a value that can change outside the code flow.' },
  { id: 'q-i2c-spi', topic: 'embedded', audience: ['core-engg', 'iot-product'], difficulty: 2, question: 'Compare I2C, SPI and UART and say when you would use each.',
    keyPoints: [['i2c', 'two wire', 'address', 'sda', 'scl'], ['spi', 'chip select', 'full duplex', 'miso', 'mosi'], ['uart', 'asynchronous', 'baud', 'no clock'], ['speed', 'faster', 'pins', 'wires', 'multiple devices'], ['pull-up', 'pull up']],
    hint: 'Wires, speed, addressing and use cases.' },
  { id: 'q-transformer', topic: 'ee', audience: ['core-engg', 'iot-product', 'govt-psu'], difficulty: 2, question: 'Explain the working principle of a transformer and its losses.',
    keyPoints: [['mutual induction', 'electromagnetic induction', 'faraday'], ['primary', 'secondary', 'turns ratio'], ['core loss', 'iron loss', 'hysteresis', 'eddy'], ['copper loss', 'i2r', 'winding'], ['efficiency', 'voltage', 'step up', 'step down']],
    hint: 'Mutual induction, turns ratio, iron and copper losses.' },
  { id: 'q-pid', topic: 'ee', audience: ['core-engg', 'iot-product', 'govt-psu'], difficulty: 2, question: 'What is a PID controller and what does each term do?',
    keyPoints: [['proportional', 'present error'], ['integral', 'accumulated', 'steady-state', 'steady state'], ['derivative', 'rate', 'damping', 'predict'], ['tuning', 'overshoot', 'stability', 'setpoint']],
    hint: 'P reacts to error, I removes steady-state error, D damps.' },
  { id: 'q-project', topic: 'projects', audience: [], difficulty: 2, question: 'Walk me through your best project and one hard problem you solved in it.',
    keyPoints: [['problem', 'goal', 'objective'], ['my role', 'i built', 'i designed', 'i implemented', 'i was responsible'], ['bug', 'challenge', 'difficult', 'issue', 'hard'], ['result', 'improv', 'reduced', 'increased', '%', 'accuracy', 'faster'], ['learn', 'next time', 'would change', 'improve']],
    hint: 'Problem, your role, one hard bug, a measurable result.' },
  { id: 'q-why-company', topic: 'hr', audience: [], difficulty: 1, question: 'Why do you want to work at this company?',
    keyPoints: [['product', 'work on', 'technology', 'tech'], ['skill', 'learn', 'grow'], ['my', 'i have', 'experience', 'project'], ['team', 'culture', 'mission', 'impact']],
    hint: 'Be specific about the product and connect it to your skills.' },
  { id: 'q-case', topic: 'case', audience: ['bfsi-consulting'], difficulty: 3, question: 'A client\'s app has seen a 20 percent drop in daily active users. How would you approach it?',
    keyPoints: [['clarif', 'question', 'timeframe', 'segment'], ['hypothes', 'framework', 'structure', 'buckets'], ['data', 'metric', 'funnel', 'analy'], ['internal', 'external', 'release', 'competitor', 'seasonal'], ['recommend', 'next step', 'prioriti']],
    hint: 'Clarify, structure, analyse data, recommend.' },
  { id: 'q-gate', topic: 'gate', audience: ['govt-psu', 'marketplace'], difficulty: 1, question: 'How are you preparing for GATE alongside placements?',
    keyPoints: [['schedule', 'daily', 'hours', 'plan', 'slot'], ['previous year', 'pyq', 'mock', 'test'], ['syllabus', 'topic', 'subject'], ['revision', 'error notebook', 'weak']],
    hint: 'Schedule, previous-year questions, mocks and revision.' },
  { id: 'q-system-url', topic: 'system-design', audience: ['product', 'web-app'], difficulty: 3, question: 'Design a URL shortener at a high level.',
    keyPoints: [['requirement', 'clarif', 'scale', 'read heavy', 'estimate'], ['hash', 'base62', 'counter', 'id generation', 'unique'], ['database', 'key-value', 'sql', 'nosql', 'store'], ['cache', 'redis', 'cdn'], ['redirect', '301', '302', 'trade-off', 'collision']],
    hint: 'Requirements, ID generation, storage, caching, trade-offs.' },
];
