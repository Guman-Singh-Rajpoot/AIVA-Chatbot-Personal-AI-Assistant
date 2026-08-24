// Rule-based response engine for the "AboutMe" portfolio chatbot (Guman Singh
// Rajpoot persona). Runs on the server so replies are generated and persisted
// consistently regardless of which client calls the API.

export const CHAT_INTRO_MESSAGE =
  "Hi! I'm Guman Singh Rajpoot. 👋 Welcome to my chat! Ask me anything about my background, skills, projects, or career goals. I'm here to share my journey! 🚀";

export const suggestedTopics = [
  "Who are you?",
  "Tell me about JNV",
  "What skills do you have?",
  "Tell me about your projects",
  "NCC & Awards?",
];

const keywordResponses: { [key: string]: string[] } = {
  "who|name|introduce": [
    "I'm Guman Singh Rajpoot, a B.Tech Computer Science Engineering student at Sitare University (SRMU), Lucknow, graduating May 2027. I'm a 100% scholarship holder passionate about full-stack development, AI/ML, and building scalable applications! 🚀",
    "Hi! I'm Guman Singh Rajpoot from JNV Mahoba background, now a B.Tech CSE student at Sitare University with 100% scholarship. I'm dedicated to becoming a skilled software engineer in backend development and AI-driven systems! 🎓",
  ],
  "school|jnv|jawahar|navodaya|mahoba|high school|intermediate": [
    "I studied at Jawahar Navodaya Vidyalaya (JNV), Mahoba - an institution known for academic discipline and holistic development! 📚\n\nResults:\n🏆 High School: 80%\n🏆 Intermediate: 84%\n\nJNV helped me develop:\n✨ Problem-solving skills\n✨ Self-discipline and leadership\n✨ Adaptability in competitive environments\n\nThese qualities continue to shape my academic and professional growth!",
  ],
  "ncc|award|certificate|recognition|achievement": [
    "I'm proud to be an NCC 'B' Certificate holder! 🎖️\n\nThe NCC experience has instilled:\n💪 Leadership qualities\n💪 Teamwork and discipline\n💪 Physical and mental resilience\n\nI also hold a 100% B.Tech Computer Science Scholarship at Sitare University, which reflects my academic excellence and commitment to growth! 🏅",
  ],
  "scholarship|merit|academic": [
    "I'm honored to be a 100% B.Tech Computer Science Scholarship recipient at Sitare University! 🎓✨\n\nThis achievement reflects my dedication to academic excellence and continuous learning. It's a testament to the strong foundation I built at JNV and my commitment to becoming an excellent software engineer! 💪",
  ],
  "skills|expertise|proficient": [
    "I'm skilled in:\n\n🐍 Languages: Python, Java, JavaScript, TypeScript\n⚛️ Frontend: React, HTML/CSS, Tailwind CSS\n🗄️ Backend: Node.js, FastAPI, Django, Flask\n🗄️ Databases: PostgreSQL, MySQL\n🛠️ Tools: REST APIs, Git, GitHub\n📊 Data: Pandas, NumPy, Chart.js\n\nI focus on clean, scalable architecture with strong problem-solving foundation!",
  ],
  "education|study|university|college|course": [
    "I'm pursuing B.Tech in Computer Science Engineering at Sitare University (SRMU), Lucknow! 🎓\n\n📍 Expected graduation: May 2027\n🏆 100% Scholarship recipient\n📚 Coursework: Data Structures, Algorithms, DBMS, Operating Systems, AI/ML, OOP, Computer Networks\n\nMy academic foundation from JNV + university coursework prepares me well for real-world challenges!",
  ],
  "project|portfolio|build|create|work": [
    "I've built several impactful data-driven projects:\n\n1️⃣ HomeFinder - Property recommendation platform with REST APIs and smart filtering\n2️⃣ LeetCode Student Progress Tracking System - Analyzes coding performance, tracks progress, generates insights\n3️⃣ LDU Factorization - Mathematical computing tool with step-by-step results\n\nEach focuses on real-world problem-solving, scalability, and user experience!",
  ],
  "ai|machine learning|ml|neural|deep learning": [
    "AI/ML fascinates me! 🤖 I'm actively enhancing my skills:\n\n• Studying algorithms and data structures deeply\n• Implementing ML models practically\n• Analyzing patterns in real data (IPL analysis, student tracking)\n• Building predictive systems\n\nMy goal: Create AI-driven solutions that solve real-world challenges at scale!",
  ],
  "goal|career|future|ambition|plan|aspiration": [
    "My long-term vision: Become a skilled software engineer building impactful solutions! 🎯\n\nFocus areas:\n🎯 Backend development & system design\n🎯 AI-driven applications\n🎯 Scalable, maintainable code\n\nI'm driven to learn new technologies, accept challenges, and contribute meaningfully to the tech industry while maintaining strong ethics! 💪",
  ],
  "interest|passionate|like|enjoy": [
    "I'm passionate about:\n\n✨ Full-stack web development\n✨ AI and Machine Learning\n✨ Data Structures & Algorithms\n✨ Database optimization\n✨ REST API design\n✨ Problem-solving through code\n✨ Building scalable systems\n✨ Continuous learning and growth",
  ],
  "communication|team|collaboration|leadership|soft skill|discipline": [
    "Strong soft skills drive my success! 💬\n\n📊 JNV & NCC Background:\n• Leadership qualities developed through NCC 'B' Certificate\n• Discipline from competitive academic environment\n• Teamwork through collaborative projects\n\n✨ Current Focus:\n• Clear, effective communication in teamwork\n• Presentations and professional environments\n• Self-motivated, independent & collaborative work\n\nI believe great software comes from great teamwork! 🤝",
  ],
  "python|java|javascript|react|node|typescript|postgresql|fastapi|mysql": [
    "Great tech question! I have hands-on experience across the modern tech stack:\n\n• Python: Data analysis, backend development (FastAPI, Django)\n• Java: OOP principles, competitive programming\n• JavaScript/TypeScript: React frontends, Node.js backends\n• Databases: PostgreSQL, MySQL with proper design\n\nWhat specific technology interests you? 🔧",
  ],
  "experience|background|history": [
    "My journey combines academics with hands-on practice:\n\n🎓 JNV Mahoba → Strong problem-solving foundation (80%+ grades)\n🎓 Sitare University → Deep CS fundamentals + 100% scholarship\n💻 Projects → Full-stack web apps with real data\n🏆 NCC 'B' Certificate → Leadership & discipline\n\nI'm eager to apply this blend of theory and practice to real-world challenges! 🚀",
  ],
  "hello|hi|hey|greetings": [
    "Hey there! 👋 Welcome! I'm Guman Singh Rajpoot. Ask me anything about my background, education, projects, skills, or goals! What interests you?",
  ],
  "thank|thanks|appreciated|grateful": [
    "You're welcome! 😊 Happy to share more about my journey. Feel free to ask anything else!",
  ],
  "how are you|how's it going|how's life": [
    "I'm doing great, thanks for asking! 😊 I'm excited about my journey at Sitare University and the projects I'm building. Currently focused on deepening my AI/ML skills and creating scalable applications. Life is good! 🚀",
    "Thanks for asking! 💫 I'm feeling energized and motivated. Balancing my B.Tech coursework, working on meaningful projects, and continuously learning new technologies. It's a fulfilling journey! 🎓",
    "Doing well! 😄 Just grinding away on my tech skills and building real-world projects. The combination of JNV's discipline and Sitare's academic rigor keeps me focused and driven. How about you?",
  ],
  "feeling|mood|how do you feel": [
    "I'm feeling amazing! 😄 Passionate about tech, grateful for my scholarship at Sitare, and excited about the projects I'm building. Every day brings new learning opportunities. It's an incredible time to be building in tech! 💪",
    "Honestly, I'm in a great place mentally! 🌟 The discipline from JNV and leadership qualities from NCC keep me grounded. I'm happy when working on problems that matter and learning new things. Right now? Really happy! 😊",
    "Feeling energized and focused! ⚡ I love what I do - coding, problem-solving, learning. My goals in backend development and AI/ML drive me forward every day. Can't ask for better motivation!",
  ],
  "happy|satisfied|content|love what": [
    "Absolutely! 🎉 I'm genuinely happy. I love what I'm doing - building applications, learning AI/ML, and working toward becoming a skilled software engineer. The NCC discipline and JNV foundation keep me grounded while pursuing my dreams! 😊",
    "Yes, very much! 💝 I'm living my passion - tech, problem-solving, continuous learning. Being a 100% scholarship holder at Sitare University is a dream, and I'm making the most of it. This happiness fuels my drive to create impact! 🚀",
    "I am! 🌈 There's something magical about being a software engineer in the making. Every challenge I solve, every project I build, every new technology I learn - it all adds up to genuine happiness and purpose! 💪",
  ],
  "what do you like|favorite|what excites|what motivates": [
    "What excites me most? 🤩\n\n1️⃣ Building full-stack applications from scratch\n2️⃣ Diving deep into AI/ML challenges\n3️⃣ Solving real-world problems with code\n4️⃣ Learning new technologies\n5️⃣ Leading teams (from my NCC experience)\n\nIt's the blend of creativity, logic, and impact that motivates me daily! 💪",
  ],
  "dream|vision|what's your": [
    "My dream? 🎯 Become a skilled software engineer building impactful solutions at scale!\n\nSpecifically:\n🚀 Master backend architecture & AI-driven systems\n🚀 Lead meaningful tech projects\n🚀 Contribute to innovations that solve real problems\n🚀 Mentor others in their tech journey\n\nI want to make a lasting impact in tech while maintaining strong ethics! 💫",
  ],
};

const defaultQuestionResponses = [
  "That's an interesting question! I'd love to help, but could you be more specific? Ask me about my skills, projects, education, or goals! 🤔",
  "Great question! Could you narrow it down? I'm happy to discuss my background, tech stack, or career aspirations! 💡",
  "Hmm, interesting! Feel free to ask about specific areas like my experience, skills, or what I'm working on! 🚀",
];

const fallbackResponses = [
  "That's a great point! Ask me more about my skills, projects, or goals, and I'll be happy to share! 😊",
  "Interesting! Feel free to ask me anything about my background or tech interests! 🌟",
  "I appreciate that! Is there something specific about my experience or projects you'd like to know? 💬",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateChatResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase().trim();

  for (const [keywords, responses] of Object.entries(keywordResponses)) {
    const keywordArray = keywords.split("|");
    if (keywordArray.some((keyword) => lowerMsg.includes(keyword))) {
      return pick(responses);
    }
  }

  if (lowerMsg.endsWith("?")) {
    return pick(defaultQuestionResponses);
  }

  return pick(fallbackResponses);
}

// ---------------------------------------------------------------------------
// "Nexus AI" personal-assistant channel — a much simpler, generic assistant
// reply generator, since that persona is a general-purpose task assistant
// rather than the portfolio bot.
// ---------------------------------------------------------------------------
export function generateAssistantResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (/\b(remind|reminder|remember)\b/.test(lower)) {
    return "Got it — I've noted that down for you. Anything else you'd like me to track?";
  }
  if (/\b(task|todo|to-do)\b/.test(lower)) {
    return "You can see and manage your tasks in the panel on the left. Want me to add a new one?";
  }
  if (/\b(hi|hello|hey)\b/.test(lower)) {
    return "Hello! I'm ready to help — ask me about your tasks, schedule, or anything else on your mind.";
  }
  if (lower.includes("thank")) {
    return "You're welcome! Let me know if there's anything else you need.";
  }

  return "I've processed that request. Is there anything else you need help with?";
}

// ---------------------------------------------------------------------------
// Fake-news heuristic analyzer — a lightweight, explainable scoring model
// (not a trained ML model) that looks for common misinformation signals.
// ---------------------------------------------------------------------------
export interface NewsAnalysisResult {
  score: number; // 0-100, higher = more likely authentic
  label: string;
  confidence: number;
  reasons: string[];
}

const sensationalWords = [
  "shocking", "you won't believe", "breaking", "urgent", "miracle", "secret",
  "they don't want you to know", "exposed", "banned", "cure", "conspiracy",
  "outrage", "destroyed", "slams", "epic", "unbelievable",
];

export function analyzeNewsContent(text: string): NewsAnalysisResult {
  const reasons: string[] = [];
  let score = 70; // start neutral-leaning-real

  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);

  // Signal: ALL CAPS shouting
  const capsWords = words.filter((w) => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  if (capsWords.length / Math.max(words.length, 1) > 0.15) {
    score -= 20;
    reasons.push("Excessive use of ALL CAPS words");
  }

  // Signal: exclamation marks
  const exclaims = (text.match(/!/g) || []).length;
  if (exclaims > 3) {
    score -= 10;
    reasons.push("Overuse of exclamation marks");
  }

  // Signal: sensational phrases
  const foundSensational = sensationalWords.filter((w) => lower.includes(w));
  if (foundSensational.length > 0) {
    score -= foundSensational.length * 8;
    reasons.push(`Sensational language detected (${foundSensational.slice(0, 3).join(", ")})`);
  }

  // Signal: very short content (hard to verify)
  if (words.length < 20) {
    score -= 10;
    reasons.push("Very short content makes verification difficult");
  } else {
    score += 5;
  }

  // Signal: presence of numbers/dates/citations (mild boost, looks more factual)
  if (/\b(19|20)\d{2}\b/.test(text)) {
    score += 5;
    reasons.push("Contains specific dates");
  }
  if (/https?:\/\//.test(text)) {
    score += 8;
    reasons.push("Includes source links");
  }

  // Clamp
  score = Math.max(2, Math.min(98, score));
  // Add small deterministic jitter based on text length so repeated identical
  // input gives identical results (no Math.random for reproducibility).
  const confidence = 80 + (words.length % 15);

  return {
    score,
    label: score > 50 ? "Likely Real" : "Potential Fake",
    confidence: Math.min(confidence, 97),
    reasons: reasons.length > 0 ? reasons : ["No strong misinformation signals detected"],
  };
}
