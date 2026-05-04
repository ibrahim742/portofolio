export type IconKey =
  | "code"
  | "bot"
  | "router"
  | "camera"
  | "shield"
  | "brain"
  | "globe"
  | "settings"
  | "monitor"
  | "search"
  | "wrench"
  | "layers"
  | "credit-card"
  | "activity"
  | "clipboard"
  | "drafting"
  | "rocket"
  | "check"
  | "phone"
  | "mail"
  | "map-pin";

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const heroRoles = [
  "AI Web Developer",
  "Networking Engineer",
  "Cyber Security Enthusiast",
] as const;

export const heroContent = {
  badge: "Available for web, network, and security projects",
  name: "Ibrahim Setiawan",
  headline: "AI Web Developer, Networking & Cyber Security",
  roles: [...heroRoles],
  description:
    "Saya membantu merancang dan membangun aplikasi web fullstack, konfigurasi jaringan MikroTik, instalasi CCTV, serta analisis keamanan sistem dan jaringan dengan pendekatan yang rapi, terukur, dan mudah dipelihara.",
  profileImage: "",
  profileImageAlt: "Foto Ibrahim Setiawan",
  primaryCta: "Download CV",
  primaryCtaHref: "/cv/ibrahim-setiawan-cv.pdf",
  secondaryCta: "Hubungi Saya",
} as const;

export const aboutContent = {
  eyebrow: "About",
  title: "Developer yang menggabungkan web, jaringan, dan keamanan.",
  subtitle:
    "Saya fokus membangun solusi digital yang bukan hanya terlihat rapi, tetapi juga jelas secara teknis, mudah digunakan, dan siap dikembangkan.",
  description:
    "Profil singkat tentang fokus kerja, cara berpikir teknis, dan area layanan yang bisa saya bantu.",
  paragraphs: [
    "Saya adalah AI Web Developer, Networking Engineer, dan Cyber Security Enthusiast dengan kemampuan membuat aplikasi web fullstack, melakukan instalasi serta manajemen jaringan MikroTik, instalasi CCTV, dan menganalisis permasalahan computer science.",
    "Dalam setiap pekerjaan, saya berusaha melihat kebutuhan dari sisi sistem secara menyeluruh: struktur aplikasi, performa, alur pengguna, konfigurasi jaringan, sampai potensi celah keamanan yang bisa menimbulkan risiko seperti malware, eksploitasi, atau gangguan layanan.",
  ],
  highlights: ["Fullstack", "Networking", "Security"],
} as const;

export const sectionContent = {
  skills: {
    eyebrow: "Skills",
    title: "Kemampuan utama yang saling melengkapi.",
    description:
      "Skill dikelompokkan agar mudah melihat area teknis yang bisa saya bantu, dari pengembangan aplikasi sampai analisis keamanan.",
  },
  services: {
    eyebrow: "Services",
    title: "Layanan teknis untuk kebutuhan digital dan infrastruktur.",
    description:
      "Pilih layanan sesuai kebutuhan project, mulai dari aplikasi web, infrastruktur jaringan, CCTV, sampai pemeriksaan keamanan.",
  },
  projects: {
    eyebrow: "Portfolio",
    title: "Contoh project yang relevan.",
    description:
      "Beberapa contoh project dummy yang menggambarkan jenis solusi yang bisa dikembangkan dan disesuaikan.",
  },
  workflow: {
    eyebrow: "Workflow",
    title: "Alur kerja yang jelas dari awal sampai maintenance.",
    description:
      "Setiap pekerjaan dimulai dari pemahaman kebutuhan, lalu masuk ke rancangan, implementasi, validasi, dan dukungan setelah rilis.",
  },
} as const;

export const skills = [
  {
    title: "Fullstack Web Development",
    icon: "code",
    items: ["Next.js", "TypeScript", "API Design", "Database Integration"],
  },
  {
    title: "AI Integration",
    icon: "bot",
    items: ["AI Workflow", "Automation", "Chatbot", "Smart Features"],
  },
  {
    title: "Networking & MikroTik",
    icon: "router",
    items: ["Routing", "Hotspot", "Firewall", "Bandwidth Management"],
  },
  {
    title: "CCTV Installation",
    icon: "camera",
    items: ["IP Camera", "DVR/NVR", "Remote Access", "Site Planning"],
  },
  {
    title: "Cyber Security Analysis",
    icon: "shield",
    items: ["Vulnerability Review", "Threat Analysis", "Hardening", "Monitoring"],
  },
  {
    title: "Computer Science Problem Solving",
    icon: "brain",
    items: ["Debugging", "System Analysis", "Algorithms", "Technical Research"],
  },
] satisfies Array<{
  title: string;
  icon: IconKey;
  items: string[];
}>;

export const services = [
  {
    title: "Pembuatan Website & Web Application",
    icon: "globe",
    description:
      "Membangun website company profile, aplikasi operasional, dan dashboard modern yang cepat, aman, dan mudah dikembangkan.",
  },
  {
    title: "Instalasi dan Konfigurasi Jaringan MikroTik",
    icon: "router",
    description:
      "Perancangan jaringan, konfigurasi router, hotspot, firewall, manajemen bandwidth, dan optimasi koneksi.",
  },
  {
    title: "Instalasi CCTV",
    icon: "camera",
    description:
      "Instalasi kamera, konfigurasi DVR/NVR, akses remote, dan penataan titik kamera sesuai kebutuhan lokasi.",
  },
  {
    title: "Security Assessment Sistem dan Jaringan",
    icon: "shield",
    description:
      "Analisis celah keamanan, review konfigurasi, dan rekomendasi mitigasi untuk mengurangi risiko ancaman siber.",
  },
  {
    title: "Konsultasi IT dan Troubleshooting",
    icon: "wrench",
    description:
      "Membantu menganalisis kendala teknis, menyusun solusi, dan memperbaiki masalah sistem, jaringan, maupun perangkat.",
  },
] satisfies Array<{
  title: string;
  icon: IconKey;
  description: string;
}>;

export const projects = [
  {
    title: "Sistem Informasi Sekolah",
    icon: "layers",
    category: "Fullstack App",
    image: "/projects/sistem-informasi-sekolah.svg",
    imageAlt: "Preview sistem informasi sekolah",
    description:
      "Platform akademik untuk data siswa, guru, kelas, jadwal, dan laporan administrasi sekolah.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL"],
    liveUrl: "",
    sourceUrl: "",
  },
  {
    title: "Aplikasi Iuran RT",
    icon: "clipboard",
    category: "Web Application",
    image: "/projects/aplikasi-iuran-rt.svg",
    imageAlt: "Preview aplikasi iuran RT",
    description:
      "Aplikasi pencatatan iuran warga, histori pembayaran, laporan kas, dan rekap bulanan.",
    techStack: ["Next.js", "Prisma", "Dashboard"],
    liveUrl: "",
    sourceUrl: "",
  },
  {
    title: "Website Company Profile",
    icon: "globe",
    category: "Business Website",
    image: "/projects/company-profile.svg",
    imageAlt: "Preview website company profile",
    description:
      "Website profil perusahaan dengan informasi layanan, portofolio, CTA kontak, dan struktur SEO-friendly.",
    techStack: ["Next.js", "SEO", "Responsive UI"],
    liveUrl: "",
    sourceUrl: "",
  },
  {
    title: "Dashboard Admin Modern",
    icon: "monitor",
    category: "Admin System",
    image: "/projects/dashboard-admin.svg",
    imageAlt: "Preview dashboard admin modern",
    description:
      "Dashboard responsif untuk monitoring data, aktivitas, statistik, dan manajemen konten internal.",
    techStack: ["React", "Admin Panel", "API"],
    liveUrl: "",
    sourceUrl: "",
  },
  {
    title: "Sistem Pembayaran Online",
    icon: "credit-card",
    category: "Payment Flow",
    image: "/projects/sistem-pembayaran.svg",
    imageAlt: "Preview sistem pembayaran online",
    description:
      "Prototype sistem pembayaran dengan pencatatan transaksi, status pembayaran, dan notifikasi dasar.",
    techStack: ["Payment Flow", "Database", "Notification"],
    liveUrl: "",
    sourceUrl: "",
  },
  {
    title: "Network Monitoring Dashboard",
    icon: "activity",
    category: "Networking",
    image: "/projects/network-monitoring.svg",
    imageAlt: "Preview network monitoring dashboard",
    description:
      "Dashboard pemantauan jaringan untuk melihat status perangkat, trafik, dan indikasi gangguan koneksi.",
    techStack: ["Networking", "Monitoring", "Dashboard"],
    liveUrl: "",
    sourceUrl: "",
  },
] satisfies Array<{
  title: string;
  icon: IconKey;
  category: string;
  image: string;
  imageAlt: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  sourceUrl: string;
}>;

export const workflow = [
  {
    title: "Analisis kebutuhan",
    icon: "search",
    description:
      "Menggali masalah utama, tujuan bisnis, kondisi teknis, dan batasan pekerjaan sebelum solusi dirancang.",
  },
  {
    title: "Perancangan solusi",
    icon: "drafting",
    description:
      "Menyusun arsitektur, flow kerja, pilihan teknologi, estimasi, dan prioritas fitur secara jelas.",
  },
  {
    title: "Development / Instalasi",
    icon: "settings",
    description:
      "Mengimplementasikan aplikasi, konfigurasi jaringan, atau instalasi perangkat sesuai rancangan.",
  },
  {
    title: "Testing & Security Check",
    icon: "check",
    description:
      "Melakukan pengujian fungsional, validasi konfigurasi, dan pengecekan keamanan dasar sebelum rilis.",
  },
  {
    title: "Deployment / Maintenance",
    icon: "rocket",
    description:
      "Menyiapkan rilis, dokumentasi ringkas, monitoring awal, dan dukungan maintenance bila dibutuhkan.",
  },
] satisfies Array<{
  title: string;
  icon: IconKey;
  description: string;
}>;

export const contact = {
  eyebrow: "Contact",
  title: "Siap membahas kebutuhan web, jaringan, atau security?",
  description:
    "Ceritakan kebutuhan Anda, mulai dari website, aplikasi internal, konfigurasi MikroTik, CCTV, sampai assessment keamanan. Saya akan bantu petakan solusi yang paling sesuai.",
  whatsappLabel: "+62 812-3456-7890",
  whatsappHref: "https://wa.me/6281234567890",
  emailLabel: "hello@ibrahimsetiawan.dev",
  emailHref: "mailto:hello@ibrahimsetiawan.dev",
  location: "Karawang, Indonesia",
  mapHref: "https://www.google.com/maps/search/Karawang,+Indonesia",
  socialLinks: [
    "LinkedIn | https://www.linkedin.com/",
    "GitHub | https://github.com/",
  ],
} as const;

export const defaultPortfolioContent = {
  hero: heroContent,
  about: aboutContent,
  sections: sectionContent,
  skills,
  services,
  projects,
  workflow,
  contact,
} as const;
