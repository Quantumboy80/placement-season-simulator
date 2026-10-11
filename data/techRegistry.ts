/**
 * @file Skill registry for the Skill Stack round (data/techRegistry.ts)
 *
 * Generated from a compact table, then checked in as plain TypeScript.
 * The file name and the `TechRegistryItem` shape are inherited from the
 * Hackathon Simulator so the store and UI keep working. Read each item as a
 * SKILL a candidate can build. Weight mapping:
 *   innovationWeight -> Skills, executionWeight -> Projects,
 *   designWeight -> Resume, pitchWeight -> Communication.
 * `compatibleSolutions` lists the career tracks (see lib/vocabulary.ts).
 *
 * @module data/techRegistry
 */

export type SkillFamily =
  | "DSA & Problem Solving"
  | "Core CS"
  | "Languages"
  | "Web & App Dev"
  | "Data & ML"
  | "Embedded & EE"
  | "Aptitude & Reasoning"
  | "Communication"
  | "Tools & Cloud"
  | "Certifications & Domain"
  | "Profile & Portfolio";

export interface TechRegistryItem {
  id: string;
  name: string;
  category: SkillFamily;
  tags: string[];
  compatibleSolutions: Array<
    "web-app" | "mobile-app" | "ai-solution" | "iot-product" | "platform" | "marketplace"
  >;
  difficultyScore: number; // 1 to 5
  innovationWeight: number; // Skills
  executionWeight: number; // Projects
  designWeight: number; // Resume
  pitchWeight: number; // Communication
  synergy: string[]; // related skill IDs
  conflicts: string[]; // skills that compete for the same limited prep time
}

export const TECH_REGISTRY: TechRegistryItem[] = [
  {
    id: "reg-arrays-strings", name: "Arrays and Strings", category: "DSA & Problem Solving",
    tags: ["dsa", "basics"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "platform", "marketplace"],
    difficultyScore: 1, innovationWeight: 10, executionWeight: 10, designWeight: 5, pitchWeight: 5,
    synergy: ["reg-sorting-search", "reg-cpp", "reg-java", "reg-python"], conflicts: [],
  },
  {
    id: "reg-sorting-search", name: "Sorting and Searching", category: "DSA & Problem Solving",
    tags: ["dsa", "basics"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "platform", "marketplace"],
    difficultyScore: 1, innovationWeight: 8, executionWeight: 8, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-arrays-strings", "reg-heaps-hashing"], conflicts: [],
  },
  {
    id: "reg-heaps-hashing", name: "Heaps and Hashing", category: "DSA & Problem Solving",
    tags: ["dsa", "intermediate"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "platform"],
    difficultyScore: 2, innovationWeight: 12, executionWeight: 10, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-arrays-strings", "reg-trees-graphs"], conflicts: [],
  },
  {
    id: "reg-recursion-bt", name: "Recursion and Backtracking", category: "DSA & Problem Solving",
    tags: ["dsa", "intermediate"], compatibleSolutions: ["web-app", "ai-solution", "platform"],
    difficultyScore: 3, innovationWeight: 14, executionWeight: 10, designWeight: 3, pitchWeight: 5,
    synergy: ["reg-dp", "reg-trees-graphs"], conflicts: [],
  },
  {
    id: "reg-trees-graphs", name: "Trees and Graphs", category: "DSA & Problem Solving",
    tags: ["dsa", "core"], compatibleSolutions: ["web-app", "ai-solution", "platform"],
    difficultyScore: 3, innovationWeight: 18, executionWeight: 12, designWeight: 3, pitchWeight: 5,
    synergy: ["reg-recursion-bt", "reg-dp", "reg-heaps-hashing"], conflicts: [],
  },
  {
    id: "reg-dp", name: "Dynamic Programming", category: "DSA & Problem Solving",
    tags: ["dsa", "hard"], compatibleSolutions: ["web-app", "ai-solution", "marketplace"],
    difficultyScore: 4, innovationWeight: 20, executionWeight: 10, designWeight: 3, pitchWeight: 5,
    synergy: ["reg-recursion-bt", "reg-trees-graphs"], conflicts: [],
  },
  {
    id: "reg-cp", name: "Competitive Programming", category: "DSA & Problem Solving",
    tags: ["dsa", "contests"], compatibleSolutions: ["web-app", "ai-solution", "marketplace"],
    difficultyScore: 4, innovationWeight: 22, executionWeight: 12, designWeight: 8, pitchWeight: 5,
    synergy: ["reg-dp", "reg-trees-graphs", "reg-cpp"], conflicts: ["reg-gate"],
  },
  {
    id: "reg-leetcode-habit", name: "Daily LeetCode Habit", category: "DSA & Problem Solving",
    tags: ["dsa", "consistency"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "platform"],
    difficultyScore: 2, innovationWeight: 15, executionWeight: 12, designWeight: 5, pitchWeight: 5,
    synergy: ["reg-arrays-strings", "reg-trees-graphs", "reg-mock-interviews"], conflicts: [],
  },
  {
    id: "reg-os", name: "Operating Systems", category: "Core CS",
    tags: ["os", "fundamentals"], compatibleSolutions: ["web-app", "mobile-app", "iot-product", "platform"],
    difficultyScore: 3, innovationWeight: 15, executionWeight: 8, designWeight: 3, pitchWeight: 5,
    synergy: ["reg-linux", "reg-dbms", "reg-system-design"], conflicts: [],
  },
  {
    id: "reg-dbms", name: "DBMS and SQL Theory", category: "Core CS",
    tags: ["database", "fundamentals"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "platform", "marketplace"],
    difficultyScore: 2, innovationWeight: 14, executionWeight: 10, designWeight: 3, pitchWeight: 5,
    synergy: ["reg-sql-db", "reg-os", "reg-system-design"], conflicts: [],
  },
  {
    id: "reg-cn", name: "Computer Networks", category: "Core CS",
    tags: ["networks", "fundamentals"], compatibleSolutions: ["web-app", "mobile-app", "iot-product", "platform"],
    difficultyScore: 3, innovationWeight: 13, executionWeight: 8, designWeight: 3, pitchWeight: 5,
    synergy: ["reg-os", "reg-system-design"], conflicts: [],
  },
  {
    id: "reg-oop", name: "OOP and Design Patterns", category: "Core CS",
    tags: ["oop", "fundamentals"], compatibleSolutions: ["web-app", "mobile-app", "platform", "ai-solution"],
    difficultyScore: 2, innovationWeight: 14, executionWeight: 12, designWeight: 5, pitchWeight: 5,
    synergy: ["reg-java", "reg-cpp", "reg-lld"], conflicts: [],
  },
  {
    id: "reg-lld", name: "Low-Level Design", category: "Core CS",
    tags: ["design", "interview"], compatibleSolutions: ["web-app", "platform"],
    difficultyScore: 3, innovationWeight: 14, executionWeight: 15, designWeight: 5, pitchWeight: 8,
    synergy: ["reg-oop", "reg-system-design"], conflicts: [],
  },
  {
    id: "reg-system-design", name: "System Design Basics", category: "Core CS",
    tags: ["design", "interview"], compatibleSolutions: ["web-app", "platform"],
    difficultyScore: 4, innovationWeight: 20, executionWeight: 14, designWeight: 5, pitchWeight: 10,
    synergy: ["reg-dbms", "reg-cn", "reg-os", "reg-lld"], conflicts: [],
  },
  {
    id: "reg-dsp-signals", name: "Signals and DSP Basics", category: "Core CS",
    tags: ["ee", "fundamentals"], compatibleSolutions: ["iot-product", "marketplace", "ai-solution"],
    difficultyScore: 3, innovationWeight: 12, executionWeight: 8, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-matlab", "reg-circuit-analysis"], conflicts: [],
  },
  {
    id: "reg-cpp", name: "C++", category: "Languages",
    tags: ["language", "dsa"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "iot-product", "platform", "marketplace"],
    difficultyScore: 2, innovationWeight: 14, executionWeight: 10, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-dp", "reg-trees-graphs", "reg-cp", "reg-oop"], conflicts: [],
  },
  {
    id: "reg-java", name: "Java", category: "Languages",
    tags: ["language", "enterprise"], compatibleSolutions: ["web-app", "mobile-app", "platform"],
    difficultyScore: 2, innovationWeight: 12, executionWeight: 12, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-oop", "reg-spring", "reg-dbms"], conflicts: [],
  },
  {
    id: "reg-python", name: "Python", category: "Languages",
    tags: ["language", "ml"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "iot-product", "platform", "marketplace"],
    difficultyScore: 1, innovationWeight: 12, executionWeight: 12, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-numpy-pandas", "reg-sklearn", "reg-arrays-strings"], conflicts: [],
  },
  {
    id: "reg-js-ts", name: "JavaScript and TypeScript", category: "Languages",
    tags: ["language", "web"], compatibleSolutions: ["web-app", "mobile-app", "platform"],
    difficultyScore: 2, innovationWeight: 10, executionWeight: 15, designWeight: 5, pitchWeight: 3,
    synergy: ["reg-react", "reg-node", "reg-next"], conflicts: [],
  },
  {
    id: "reg-c-lang", name: "C Programming", category: "Languages",
    tags: ["language", "embedded"], compatibleSolutions: ["iot-product", "web-app", "marketplace", "mobile-app"],
    difficultyScore: 2, innovationWeight: 14, executionWeight: 10, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-embedded-c", "reg-os", "reg-arduino"], conflicts: [],
  },
  {
    id: "reg-sql-lang", name: "SQL", category: "Languages",
    tags: ["language", "database"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "platform", "marketplace"],
    difficultyScore: 1, innovationWeight: 12, executionWeight: 12, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-dbms", "reg-sql-analytics", "reg-sql-db"], conflicts: [],
  },
  {
    id: "reg-react", name: "React", category: "Web & App Dev",
    tags: ["frontend", "js"], compatibleSolutions: ["web-app", "platform"],
    difficultyScore: 2, innovationWeight: 10, executionWeight: 15, designWeight: 10, pitchWeight: 5,
    synergy: ["reg-js-ts", "reg-next", "reg-rest-apis"], conflicts: [],
  },
  {
    id: "reg-next", name: "Next.js", category: "Web & App Dev",
    tags: ["frontend", "fullstack"], compatibleSolutions: ["web-app", "platform"],
    difficultyScore: 3, innovationWeight: 12, executionWeight: 18, designWeight: 12, pitchWeight: 8,
    synergy: ["reg-react", "reg-js-ts", "reg-node", "reg-sql-db"], conflicts: [],
  },
  {
    id: "reg-node", name: "Node.js and Express", category: "Web & App Dev",
    tags: ["backend", "js"], compatibleSolutions: ["web-app", "platform"],
    difficultyScore: 2, innovationWeight: 10, executionWeight: 15, designWeight: 5, pitchWeight: 3,
    synergy: ["reg-js-ts", "reg-rest-apis", "reg-sql-db", "reg-mongodb"], conflicts: [],
  },
  {
    id: "reg-spring", name: "Spring Boot", category: "Web & App Dev",
    tags: ["backend", "java"], compatibleSolutions: ["web-app", "mobile-app"],
    difficultyScore: 3, innovationWeight: 12, executionWeight: 15, designWeight: 5, pitchWeight: 3,
    synergy: ["reg-java", "reg-sql-db", "reg-rest-apis"], conflicts: [],
  },
  {
    id: "reg-fastapi", name: "FastAPI or Django", category: "Web & App Dev",
    tags: ["backend", "python"], compatibleSolutions: ["web-app", "ai-solution", "platform"],
    difficultyScore: 2, innovationWeight: 10, executionWeight: 15, designWeight: 5, pitchWeight: 3,
    synergy: ["reg-python", "reg-rest-apis", "reg-sql-db"], conflicts: [],
  },
  {
    id: "reg-sql-db", name: "PostgreSQL / MySQL", category: "Web & App Dev",
    tags: ["database", "sql"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "platform"],
    difficultyScore: 2, innovationWeight: 10, executionWeight: 14, designWeight: 4, pitchWeight: 3,
    synergy: ["reg-sql-lang", "reg-dbms", "reg-node", "reg-fastapi"], conflicts: [],
  },
  {
    id: "reg-mongodb", name: "MongoDB", category: "Web & App Dev",
    tags: ["database", "nosql"], compatibleSolutions: ["platform"],
    difficultyScore: 2, innovationWeight: 8, executionWeight: 12, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-node", "reg-js-ts"], conflicts: [],
  },
  {
    id: "reg-rest-apis", name: "REST API Design", category: "Web & App Dev",
    tags: ["backend", "api"], compatibleSolutions: ["web-app", "platform"],
    difficultyScore: 2, innovationWeight: 10, executionWeight: 14, designWeight: 4, pitchWeight: 5,
    synergy: ["reg-node", "reg-fastapi", "reg-spring", "reg-react"], conflicts: [],
  },
  {
    id: "reg-flutter", name: "Flutter or React Native", category: "Web & App Dev",
    tags: ["mobile", "app"], compatibleSolutions: ["mobile-app", "platform"],
    difficultyScore: 3, innovationWeight: 9, executionWeight: 15, designWeight: 10, pitchWeight: 5,
    synergy: ["reg-js-ts", "reg-rest-apis"], conflicts: [],
  },
  {
    id: "reg-numpy-pandas", name: "NumPy and Pandas", category: "Data & ML",
    tags: ["data", "python"], compatibleSolutions: ["ai-solution", "marketplace"],
    difficultyScore: 1, innovationWeight: 12, executionWeight: 12, designWeight: 4, pitchWeight: 3,
    synergy: ["reg-python", "reg-sklearn", "reg-stats"], conflicts: [],
  },
  {
    id: "reg-stats", name: "Statistics and Probability", category: "Data & ML",
    tags: ["math", "data"], compatibleSolutions: ["ai-solution", "marketplace"],
    difficultyScore: 3, innovationWeight: 16, executionWeight: 8, designWeight: 3, pitchWeight: 5,
    synergy: ["reg-numpy-pandas", "reg-sklearn", "reg-sql-analytics"], conflicts: [],
  },
  {
    id: "reg-sklearn", name: "Classical ML (Scikit-learn)", category: "Data & ML",
    tags: ["ml", "data"], compatibleSolutions: ["ai-solution", "marketplace"],
    difficultyScore: 2, innovationWeight: 14, executionWeight: 14, designWeight: 5, pitchWeight: 5,
    synergy: ["reg-numpy-pandas", "reg-stats", "reg-python"], conflicts: [],
  },
  {
    id: "reg-pytorch", name: "Deep Learning (PyTorch)", category: "Data & ML",
    tags: ["ml", "deeplearning"], compatibleSolutions: ["ai-solution", "marketplace"],
    difficultyScore: 4, innovationWeight: 20, executionWeight: 16, designWeight: 6, pitchWeight: 8,
    synergy: ["reg-sklearn", "reg-cv-yolo", "reg-nlp-llm"], conflicts: [],
  },
  {
    id: "reg-cv-yolo", name: "Computer Vision (YOLO / OpenCV)", category: "Data & ML",
    tags: ["ml", "vision"], compatibleSolutions: ["ai-solution", "iot-product", "marketplace"],
    difficultyScore: 4, innovationWeight: 20, executionWeight: 18, designWeight: 10, pitchWeight: 10,
    synergy: ["reg-pytorch", "reg-python", "reg-research-paper"], conflicts: [],
  },
  {
    id: "reg-nlp-llm", name: "NLP and LLM Apps", category: "Data & ML",
    tags: ["ml", "llm"], compatibleSolutions: ["ai-solution", "platform"],
    difficultyScore: 4, innovationWeight: 20, executionWeight: 16, designWeight: 8, pitchWeight: 10,
    synergy: ["reg-pytorch", "reg-rag", "reg-python"], conflicts: [],
  },
  {
    id: "reg-rag", name: "RAG Pipelines", category: "Data & ML",
    tags: ["ml", "llm", "retrieval"], compatibleSolutions: ["ai-solution", "platform"],
    difficultyScore: 4, innovationWeight: 18, executionWeight: 18, designWeight: 8, pitchWeight: 10,
    synergy: ["reg-nlp-llm", "reg-python", "reg-sql-db"], conflicts: [],
  },
  {
    id: "reg-sql-analytics", name: "SQL for Analytics", category: "Data & ML",
    tags: ["data", "sql"], compatibleSolutions: ["ai-solution"],
    difficultyScore: 2, innovationWeight: 14, executionWeight: 12, designWeight: 4, pitchWeight: 6,
    synergy: ["reg-sql-lang", "reg-stats", "reg-dashboards"], conflicts: [],
  },
  {
    id: "reg-dashboards", name: "Excel and Power BI Dashboards", category: "Data & ML",
    tags: ["data", "bi"], compatibleSolutions: ["ai-solution", "mobile-app"],
    difficultyScore: 1, innovationWeight: 8, executionWeight: 12, designWeight: 10, pitchWeight: 10,
    synergy: ["reg-sql-analytics", "reg-stats"], conflicts: [],
  },
  {
    id: "reg-mlops", name: "MLOps Basics", category: "Data & ML",
    tags: ["ml", "deployment"], compatibleSolutions: ["ai-solution"],
    difficultyScore: 4, innovationWeight: 14, executionWeight: 14, designWeight: 5, pitchWeight: 5,
    synergy: ["reg-docker", "reg-pytorch", "reg-fastapi"], conflicts: [],
  },
  {
    id: "reg-embedded-c", name: "Embedded C", category: "Embedded & EE",
    tags: ["embedded", "c"], compatibleSolutions: ["iot-product"],
    difficultyScore: 3, innovationWeight: 20, executionWeight: 15, designWeight: 5, pitchWeight: 5,
    synergy: ["reg-c-lang", "reg-stm32", "reg-rtos", "reg-protocols"], conflicts: [],
  },
  {
    id: "reg-arduino", name: "Arduino Projects", category: "Embedded & EE",
    tags: ["embedded", "hardware"], compatibleSolutions: ["iot-product"],
    difficultyScore: 1, innovationWeight: 8, executionWeight: 12, designWeight: 6, pitchWeight: 5,
    synergy: ["reg-c-lang", "reg-esp32", "reg-protocols"], conflicts: [],
  },
  {
    id: "reg-esp32", name: "ESP32 and IoT Projects", category: "Embedded & EE",
    tags: ["embedded", "iot"], compatibleSolutions: ["iot-product", "platform"],
    difficultyScore: 2, innovationWeight: 12, executionWeight: 16, designWeight: 8, pitchWeight: 6,
    synergy: ["reg-arduino", "reg-protocols", "reg-embedded-c"], conflicts: [],
  },
  {
    id: "reg-stm32", name: "STM32 / ARM Cortex-M", category: "Embedded & EE",
    tags: ["embedded", "mcu"], compatibleSolutions: ["iot-product"],
    difficultyScore: 4, innovationWeight: 20, executionWeight: 16, designWeight: 6, pitchWeight: 6,
    synergy: ["reg-embedded-c", "reg-rtos", "reg-protocols"], conflicts: [],
  },
  {
    id: "reg-rtos", name: "RTOS (FreeRTOS)", category: "Embedded & EE",
    tags: ["embedded", "os"], compatibleSolutions: ["iot-product"],
    difficultyScore: 4, innovationWeight: 18, executionWeight: 14, designWeight: 4, pitchWeight: 5,
    synergy: ["reg-stm32", "reg-embedded-c", "reg-os"], conflicts: [],
  },
  {
    id: "reg-protocols", name: "I2C, SPI and UART", category: "Embedded & EE",
    tags: ["embedded", "protocols"], compatibleSolutions: ["iot-product"],
    difficultyScore: 2, innovationWeight: 14, executionWeight: 12, designWeight: 3, pitchWeight: 4,
    synergy: ["reg-embedded-c", "reg-stm32", "reg-esp32"], conflicts: [],
  },
  {
    id: "reg-matlab", name: "MATLAB and Simulink", category: "Embedded & EE",
    tags: ["ee", "simulation"], compatibleSolutions: ["iot-product", "ai-solution", "marketplace"],
    difficultyScore: 2, innovationWeight: 12, executionWeight: 12, designWeight: 5, pitchWeight: 4,
    synergy: ["reg-circuit-analysis", "reg-power-controls", "reg-dsp-signals"], conflicts: [],
  },
  {
    id: "reg-vhdl-fpga", name: "Verilog / VHDL and FPGA", category: "Embedded & EE",
    tags: ["ee", "digital"], compatibleSolutions: ["iot-product", "marketplace"],
    difficultyScore: 4, innovationWeight: 18, executionWeight: 14, designWeight: 5, pitchWeight: 5,
    synergy: ["reg-circuit-analysis", "reg-embedded-c"], conflicts: [],
  },
  {
    id: "reg-pcb", name: "PCB Design (KiCad)", category: "Embedded & EE",
    tags: ["ee", "hardware"], compatibleSolutions: ["iot-product"],
    difficultyScore: 3, innovationWeight: 12, executionWeight: 16, designWeight: 8, pitchWeight: 5,
    synergy: ["reg-circuit-analysis", "reg-arduino", "reg-esp32"], conflicts: [],
  },
  {
    id: "reg-circuit-analysis", name: "Circuit Analysis and Analog", category: "Embedded & EE",
    tags: ["ee", "fundamentals"], compatibleSolutions: ["iot-product", "marketplace"],
    difficultyScore: 3, innovationWeight: 16, executionWeight: 8, designWeight: 3, pitchWeight: 4,
    synergy: ["reg-matlab", "reg-pcb", "reg-dsp-signals"], conflicts: [],
  },
  {
    id: "reg-power-controls", name: "Power Systems and Control", category: "Embedded & EE",
    tags: ["ee", "core"], compatibleSolutions: ["iot-product", "marketplace"],
    difficultyScore: 3, innovationWeight: 16, executionWeight: 10, designWeight: 3, pitchWeight: 4,
    synergy: ["reg-matlab", "reg-plc-scada", "reg-circuit-analysis"], conflicts: [],
  },
  {
    id: "reg-plc-scada", name: "PLC and SCADA", category: "Embedded & EE",
    tags: ["ee", "automation"], compatibleSolutions: ["iot-product"],
    difficultyScore: 3, innovationWeight: 14, executionWeight: 14, designWeight: 5, pitchWeight: 4,
    synergy: ["reg-power-controls", "reg-matlab"], conflicts: [],
  },
  {
    id: "reg-quant", name: "Quantitative Aptitude", category: "Aptitude & Reasoning",
    tags: ["aptitude", "test"], compatibleSolutions: ["mobile-app", "web-app", "iot-product", "marketplace"],
    difficultyScore: 1, innovationWeight: 8, executionWeight: 2, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-logical", "reg-puzzles"], conflicts: [],
  },
  {
    id: "reg-logical", name: "Logical Reasoning", category: "Aptitude & Reasoning",
    tags: ["aptitude", "test"], compatibleSolutions: ["mobile-app", "web-app", "iot-product", "marketplace"],
    difficultyScore: 1, innovationWeight: 8, executionWeight: 2, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-quant", "reg-puzzles"], conflicts: [],
  },
  {
    id: "reg-verbal", name: "Verbal Ability", category: "Aptitude & Reasoning",
    tags: ["aptitude", "english"], compatibleSolutions: ["mobile-app", "web-app"],
    difficultyScore: 1, innovationWeight: 6, executionWeight: 2, designWeight: 3, pitchWeight: 8,
    synergy: ["reg-english", "reg-gd"], conflicts: [],
  },
  {
    id: "reg-puzzles", name: "Puzzles and Mental Math", category: "Aptitude & Reasoning",
    tags: ["aptitude", "interview"], compatibleSolutions: ["web-app", "platform"],
    difficultyScore: 2, innovationWeight: 8, executionWeight: 2, designWeight: 3, pitchWeight: 5,
    synergy: ["reg-quant", "reg-logical"], conflicts: [],
  },
  {
    id: "reg-gd", name: "Group Discussion Skills", category: "Communication",
    tags: ["communication", "gd"], compatibleSolutions: ["mobile-app", "iot-product", "marketplace"],
    difficultyScore: 2, innovationWeight: 3, executionWeight: 2, designWeight: 3, pitchWeight: 16,
    synergy: ["reg-verbal", "reg-english"], conflicts: [],
  },
  {
    id: "reg-hr-prep", name: "HR Round Prep (STAR answers)", category: "Communication",
    tags: ["communication", "hr"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "iot-product", "platform", "marketplace"],
    difficultyScore: 1, innovationWeight: 3, executionWeight: 3, designWeight: 5, pitchWeight: 16,
    synergy: ["reg-explain-projects", "reg-mock-interviews"], conflicts: [],
  },
  {
    id: "reg-explain-projects", name: "Explaining Your Projects Clearly", category: "Communication",
    tags: ["communication", "projects"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "iot-product", "platform", "marketplace"],
    difficultyScore: 2, innovationWeight: 5, executionWeight: 10, designWeight: 6, pitchWeight: 18,
    synergy: ["reg-hr-prep", "reg-mock-interviews"], conflicts: [],
  },
  {
    id: "reg-mock-interviews", name: "Regular Mock Interviews", category: "Communication",
    tags: ["communication", "practice"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "iot-product", "platform", "marketplace"],
    difficultyScore: 2, innovationWeight: 6, executionWeight: 4, designWeight: 5, pitchWeight: 20,
    synergy: ["reg-explain-projects", "reg-hr-prep", "reg-leetcode-habit"], conflicts: [],
  },
  {
    id: "reg-english", name: "Spoken English Fluency", category: "Communication",
    tags: ["communication", "english"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "iot-product", "platform", "marketplace"],
    difficultyScore: 2, innovationWeight: 2, executionWeight: 2, designWeight: 3, pitchWeight: 15,
    synergy: ["reg-verbal", "reg-gd"], conflicts: [],
  },
  {
    id: "reg-git", name: "Git and GitHub Workflow", category: "Tools & Cloud",
    tags: ["tools", "git"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "iot-product", "platform", "marketplace"],
    difficultyScore: 1, innovationWeight: 6, executionWeight: 12, designWeight: 8, pitchWeight: 3,
    synergy: ["reg-github-portfolio", "reg-opensource"], conflicts: [],
  },
  {
    id: "reg-linux", name: "Linux and Shell", category: "Tools & Cloud",
    tags: ["tools", "linux"], compatibleSolutions: ["web-app", "mobile-app", "iot-product", "platform", "marketplace"],
    difficultyScore: 2, innovationWeight: 10, executionWeight: 10, designWeight: 3, pitchWeight: 3,
    synergy: ["reg-os", "reg-docker"], conflicts: [],
  },
  {
    id: "reg-docker", name: "Docker and Containers", category: "Tools & Cloud",
    tags: ["tools", "deploy"], compatibleSolutions: ["web-app", "ai-solution", "platform"],
    difficultyScore: 3, innovationWeight: 10, executionWeight: 14, designWeight: 6, pitchWeight: 3,
    synergy: ["reg-linux", "reg-mlops", "reg-cloud-basics"], conflicts: [],
  },
  {
    id: "reg-cloud-basics", name: "Cloud Basics (AWS / Azure)", category: "Tools & Cloud",
    tags: ["tools", "cloud"], compatibleSolutions: ["web-app", "ai-solution", "platform"],
    difficultyScore: 3, innovationWeight: 10, executionWeight: 12, designWeight: 6, pitchWeight: 4,
    synergy: ["reg-docker", "reg-linux"], conflicts: [],
  },
  {
    id: "reg-cicd", name: "CI/CD and Testing Basics", category: "Tools & Cloud",
    tags: ["tools", "quality"], compatibleSolutions: ["web-app", "platform"],
    difficultyScore: 3, innovationWeight: 8, executionWeight: 14, designWeight: 5, pitchWeight: 3,
    synergy: ["reg-git", "reg-docker"], conflicts: [],
  },
  {
    id: "reg-gate", name: "GATE Preparation", category: "Certifications & Domain",
    tags: ["exam", "higher-studies"], compatibleSolutions: ["iot-product", "marketplace"],
    difficultyScore: 4, innovationWeight: 22, executionWeight: 3, designWeight: 6, pitchWeight: 3,
    synergy: ["reg-circuit-analysis", "reg-power-controls", "reg-dsp-signals"], conflicts: ["reg-cp", "reg-hackathon-wins"],
  },
  {
    id: "reg-nptel", name: "NPTEL Certifications", category: "Certifications & Domain",
    tags: ["cert", "learning"], compatibleSolutions: ["mobile-app", "iot-product", "marketplace"],
    difficultyScore: 1, innovationWeight: 8, executionWeight: 3, designWeight: 8, pitchWeight: 3,
    synergy: ["reg-python", "reg-c-lang"], conflicts: [],
  },
  {
    id: "reg-cloud-cert", name: "Cloud Certification", category: "Certifications & Domain",
    tags: ["cert", "cloud"], compatibleSolutions: ["mobile-app", "ai-solution", "platform"],
    difficultyScore: 2, innovationWeight: 10, executionWeight: 3, designWeight: 8, pitchWeight: 3,
    synergy: ["reg-cloud-basics"], conflicts: [],
  },
  {
    id: "reg-gre-ielts", name: "GRE and IELTS (for MS)", category: "Certifications & Domain",
    tags: ["exam", "abroad"], compatibleSolutions: ["marketplace"],
    difficultyScore: 3, innovationWeight: 10, executionWeight: 2, designWeight: 6, pitchWeight: 10,
    synergy: ["reg-research-paper", "reg-english"], conflicts: ["reg-gate"],
  },
  {
    id: "reg-domain-knowledge", name: "Domain Knowledge (Banking / Core)", category: "Certifications & Domain",
    tags: ["domain", "interview"], compatibleSolutions: ["mobile-app", "iot-product", "ai-solution", "web-app"],
    difficultyScore: 2, innovationWeight: 10, executionWeight: 4, designWeight: 5, pitchWeight: 8,
    synergy: ["reg-hr-prep", "reg-explain-projects"], conflicts: [],
  },
  {
    id: "reg-github-portfolio", name: "Strong GitHub Portfolio", category: "Profile & Portfolio",
    tags: ["profile", "proof"], compatibleSolutions: ["web-app", "ai-solution", "platform", "iot-product"],
    difficultyScore: 2, innovationWeight: 8, executionWeight: 16, designWeight: 12, pitchWeight: 5,
    synergy: ["reg-git", "reg-opensource", "reg-explain-projects"], conflicts: [],
  },
  {
    id: "reg-linkedin", name: "LinkedIn Presence and Outreach", category: "Profile & Portfolio",
    tags: ["profile", "network"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "platform", "iot-product", "marketplace"],
    difficultyScore: 1, innovationWeight: 2, executionWeight: 4, designWeight: 10, pitchWeight: 10,
    synergy: ["reg-referrals", "reg-github-portfolio"], conflicts: [],
  },
  {
    id: "reg-internship", name: "Internship Experience", category: "Profile & Portfolio",
    tags: ["profile", "experience"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "iot-product", "platform", "marketplace"],
    difficultyScore: 3, innovationWeight: 14, executionWeight: 18, designWeight: 14, pitchWeight: 10,
    synergy: ["reg-github-portfolio", "reg-explain-projects"], conflicts: [],
  },
  {
    id: "reg-research-paper", name: "Research Paper / Publication", category: "Profile & Portfolio",
    tags: ["profile", "research"], compatibleSolutions: ["ai-solution", "iot-product", "marketplace"],
    difficultyScore: 5, innovationWeight: 20, executionWeight: 20, designWeight: 14, pitchWeight: 10,
    synergy: ["reg-cv-yolo", "reg-pytorch", "reg-gre-ielts"], conflicts: [],
  },
  {
    id: "reg-opensource", name: "Open Source Contributions", category: "Profile & Portfolio",
    tags: ["profile", "community"], compatibleSolutions: ["web-app", "ai-solution", "platform"],
    difficultyScore: 3, innovationWeight: 14, executionWeight: 16, designWeight: 10, pitchWeight: 6,
    synergy: ["reg-git", "reg-github-portfolio"], conflicts: [],
  },
  {
    id: "reg-hackathon-wins", name: "Hackathon Wins", category: "Profile & Portfolio",
    tags: ["profile", "proof"], compatibleSolutions: ["web-app", "ai-solution", "platform", "iot-product"],
    difficultyScore: 3, innovationWeight: 10, executionWeight: 18, designWeight: 12, pitchWeight: 12,
    synergy: ["reg-github-portfolio", "reg-explain-projects"], conflicts: ["reg-gate"],
  },
  {
    id: "reg-referrals", name: "Alumni Referrals Network", category: "Profile & Portfolio",
    tags: ["profile", "network"], compatibleSolutions: ["web-app", "mobile-app", "ai-solution", "platform"],
    difficultyScore: 2, innovationWeight: 2, executionWeight: 2, designWeight: 6, pitchWeight: 12,
    synergy: ["reg-linkedin"], conflicts: [],
  },
];

/** Maps a skill family to the legacy compile slot (kept for older helpers). */
export function getSlotForCategory(
  category: TechRegistryItem["category"]
): "frontend" | "backend" | "database" | "devops" | "ai" {
  switch (category) {
    case "Web & App Dev":
      return "frontend";
    case "Core CS":
    case "Languages":
      return "backend";
    case "DSA & Problem Solving":
      return "database";
    case "Tools & Cloud":
      return "devops";
    default:
      return "ai";
  }
}

/** Skill ids that keep a `tech-` prefix in the store (used by the dev mock and old saves). */
const LEGACY_STORE_IDS = ["python", "react", "node", "cpp", "java", "esp32", "arduino", "git", "dbms"];

/** Maps a registry or store skill ID to the store format. */
export function toStoreId(id: string): string {
  const core = id.replace("reg-", "").replace("tech-", "");
  if (LEGACY_STORE_IDS.includes(core)) {
    return `tech-${core}`;
  }
  return id;
}

/** Maps a store or registry skill ID to the registry format (reg- prefix). */
export function toRegistryId(id: string): string {
  const core = id.replace("reg-", "").replace("tech-", "");
  return `reg-${core}`;
}
