// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE ONLY to personalise your portfolio.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Rohit Singh",
  role: "CSE (AI & ML) · Applied AI & Systems Builder",
  tagline: "B.Tech student building real ML models, robotics pathfinding, and full-stack platforms from scratch.",
  location: "Hyderabad, India",
  email: "rohitsingh89788@gmail.com",
  about:
    "I'm a CSE (AI & ML) student who loves turning complex technical challenges into working software. " +
    "I've built and deployed deep learning medical diagnostic classifiers with Grad-CAM explainability, coded A* graph pathfinding stacks from scratch, trained network anomaly detection systems, and engineered full-stack TypeScript platforms. " +
    "I believe in clean code, algorithmic rigor, and being honest about what models can and cannot do.",
  socials: [
    { label: "Resume (PDF)", url: "/Rohit_Singh_AI_Engineer_Resume.pdf" },
    { label: "GitHub", url: "https://github.com/rohitsingh83" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/rohit-singh-180ba1324" },
  ],
};

// Shown in the marquee ticker AND the 3D orbit sphere (keep ≤ 16 for smooth perf).
export const skills = [
  "Python", "TypeScript", "TensorFlow", "Keras",
  "scikit-learn", "A* & DSA", "React", "Next.js",
  "Node.js", "Express", "Flask", "PostgreSQL",
  "Supabase", "Docker", "Tailwind CSS", "Git",
];

// Each project becomes a floating 3D tile. 5 is the sweet-spot for perf.
export const projects = [
  {
    title: "Autonomous Navigation (DSA)",
    description:
      "Mobile robotics autonomy stack highlighting advanced DSA & algorithmic problem solving: A* graph traversal with line-of-sight smoothing, 2D dynamic occupancy grid mapping, and pure-pursuit trajectory control with 100% collision-free success across 60 benchmark environments.",
    tech: ["Python", "A* Graph Search", "Occupancy Grids", "Pure Pursuit", "Robotics"],
    link: "https://rohitsingh83.github.io/AI-Autonomous-Navigation-System/",
    color: "#7eb8a4",
  },
  {
    title: "PneumoAI: Diagnostic Vision",
    description:
      "Deep learning diagnostic system demonstrating core ML fundamentals beyond API calls. Custom CNN trained on chest radiographs achieving 95%+ accuracy with Grad-CAM heatmaps for interpretable clinical attribution and model reliability.",
    tech: ["Python", "TensorFlow", "Keras", "Grad-CAM", "Flask"],
    link: "https://rohitsingh83.github.io/AI-Medical-Image-Analysis/",
    color: "#c9b27a",
  },
  {
    title: "AI Threat Intelligence",
    description:
      "Defense-in-depth security intelligence platform combining Random Forest multi-class intrusion detection (99.2% accuracy) with unsupervised Isolation Forest anomaly detection for zero-day threats, MITRE ATT&CK mapping, and real-time SOC alerting.",
    tech: ["Python", "scikit-learn", "Isolation Forest", "MITRE ATT&CK", "Docker"],
    link: "https://rohitsingh83.github.io/AI-Cybersecurity-Threat-Detection/",
    color: "#8fa0c9",
  },
  {
    title: "AI Energy Demand Forecasting",
    description:
      "Hourly electricity demand forecasting system benchmarking Ridge Regression, Random Forest, and Scaled MLPs over 52,000+ hours of data, with empirical uncertainty bands (±95%) and virtual peak load-shifting simulation under Time-of-Use tariffs.",
    tech: ["Python", "scikit-learn", "Ridge Regression", "Time-Series", "HTML/CSS"],
    link: "https://rohitsingh83.github.io/AI-Energy-Forecasting/",
    color: "#e2c275",
  },
  {
    title: "CabGo: Distributed Systems",
    description:
      "Production full-stack transport platform built with Next.js 14, TypeScript, Supabase, and real-time WebSockets. Demonstrates solid software architecture, concurrent state synchronization, Stripe payments, and live geospatial tracking.",
    tech: ["Next.js 14", "TypeScript", "WebSockets", "Supabase", "PostgreSQL"],
    link: "https://github.com/rohitsingh83",
    color: "#dcd6c8",
  },
];
