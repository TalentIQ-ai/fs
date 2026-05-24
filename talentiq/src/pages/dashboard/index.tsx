// src/pages/dashboard/index.tsx
import {
  ArrowRight,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  Loader2,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/common/sidebar";
import { useScrollAnimation, animClass } from "@/hooks/use-scroll-animation";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const mockData = {
  user: { name: "Budi", fullName: "Budi Santoso" },
  lastUpdated: "20 Mei 2025",
  readinessScore: 72,
  targetRole: "Data Analyst",

  ownedSkills: ["Python", "SQL", "Excel", "Statistics", "Pandas"],
  neededSkills: ["Tableau", "Power BI", "ML Basics", "Spark", "Airflow"],

  roadmap: [
    {
      id: 1,
      title: "Dasar Python",
      status: "done",
      duration: "4 minggu",
    },
    {
      id: 2,
      title: "SQL Lanjutan",
      status: "active",
      duration: "3 minggu",
      progress: 60,
    },
    {
      id: 3,
      title: "Visualisasi Data\n(Tableau)",
      status: "next",
      duration: "4 minggu",
    },
    {
      id: 4,
      title: "Machine Learning\nDasar",
      status: "upcoming",
      duration: "6 minggu",
    },
  ],

  prioritySkills: [
    {
      id: 1,
      name: "Tableau",
      icon: <TrendingUp size={22} />,
      reason: "Dibutuhkan 87% job listing Data Analyst",
      relevance: 87,
      color: "#025CB8",
      bg: "#EFF6FF",
    },
    {
      id: 2,
      name: "Power BI",
      icon: <Database size={22} />,
      reason: "Dibutuhkan 79% job listing Data Analyst",
      relevance: 79,
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      id: 3,
      name: "ML Basics",
      icon: <Brain size={22} />,
      reason: "Dibutuhkan 65% job listing Data Analyst",
      relevance: 65,
      color: "#059669",
      bg: "#ECFDF5",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CIRCULAR PROGRESS CHART
// ─────────────────────────────────────────────────────────────────────────────
const CircularProgress = ({ value }: { value: number }) => {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-md"
        style={{ background: "conic-gradient(#025CB8, #62AAEA, #025CB8)" }}
      />
      <svg width="160" height="160" className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#E0EEFB"
          strokeWidth="10"
        />
        {/* Progress */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#025CB8" />
            <stop offset="100%" stopColor="#62AAEA" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-[#025CB8]">{value}%</span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          Siap Kerja
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKILL BADGE
// ─────────────────────────────────────────────────────────────────────────────
const SkillBadge = ({
  label,
  variant = "owned",
}: {
  label: string;
  variant?: "owned" | "needed";
}) => {
  const styles = {
    owned: "bg-blue-50 text-[#025CB8] border border-blue-100",
    needed: "bg-red-50 text-red-600 border border-red-100",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-transform hover:scale-105 ${styles[variant]}`}
    >
      {label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────
const ProgressBar = ({
  value,
  color = "#025CB8",
}: {
  value: number;
  color?: string;
}) => (
  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div
      className="h-2 rounded-full transition-all duration-700 ease-out"
      style={{ width: `${value}%`, background: color }}
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ROADMAP STEP
// ─────────────────────────────────────────────────────────────────────────────
const roadmapConfig: Record<
  string,
  { icon: React.ReactNode; label: string; ring: string; dot: string; text: string }
> = {
  done: {
    icon: <CheckCircle2 size={20} />,
    label: "Selesai",
    ring: "ring-2 ring-green-200",
    dot: "bg-green-500",
    text: "text-green-600",
  },
  active: {
    icon: <Loader2 size={20} className="animate-spin" />,
    label: "Sedang",
    ring: "ring-2 ring-blue-300",
    dot: "bg-[#025CB8]",
    text: "text-[#025CB8]",
  },
  next: {
    icon: <Clock size={20} />,
    label: "Berikutnya",
    ring: "ring-2 ring-orange-200",
    dot: "bg-orange-400",
    text: "text-orange-500",
  },
  upcoming: {
    icon: <Clock size={20} />,
    label: "Mendatang",
    ring: "ring-2 ring-gray-200",
    dot: "bg-gray-300",
    text: "text-gray-400",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION WRAPPER (Animated)
// ─────────────────────────────────────────────────────────────────────────────
const Section = ({
  children,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade";
  className?: string;
}) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={`${animClass(isVisible, direction, 700, direction)} ${className}`}>
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  const { user, lastUpdated, readinessScore, targetRole, ownedSkills, neededSkills, roadmap, prioritySkills } = mockData;

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content — offset for sidebar on desktop */}
      <div className="lg:ml-[260px] pb-24 lg:pb-8">

        {/* ── HEADER BAR ─────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 lg:px-8 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Selamat datang kembali, {user.name} 👋
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Terakhir diperbarui:{" "}
                <span className="font-medium text-gray-500">{lastUpdated}</span>
                {" · "}
                <span className="text-[#025CB8] font-semibold">
                  Skor Kesiapan Kerja: {readinessScore}%
                </span>
              </p>
            </div>
            {/* Score pill */}
            <div
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-md"
              style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
            >
              <Zap size={15} />
              <span>{readinessScore}% Siap</span>
            </div>
          </div>
        </div>

        {/* ── CONTENT AREA ─────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-7 space-y-7">

          {/* ── SECTION 1 — SKILL GAP CARDS ────────────────────────────── */}
          <Section direction="up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Card 1 — Owned Skills */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-[#025CB8]" />
                  </div>
                  <h2 className="font-semibold text-gray-700 text-sm">
                    Skill yang Kamu Miliki
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ownedSkills.map((s) => (
                    <SkillBadge key={s} label={s} variant="owned" />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  {ownedSkills.length} skill teridentifikasi dari CV kamu
                </p>
              </div>

              {/* Card 2 — Needed Skills */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <Target size={16} className="text-red-500" />
                  </div>
                  <h2 className="font-semibold text-gray-700 text-sm">
                    Skill yang Dibutuhkan
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {neededSkills.map((s) => (
                    <SkillBadge key={s} label={s} variant="needed" />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  {neededSkills.length} skill perlu dipelajari untuk target kamu
                </p>
              </div>

              {/* Card 3 — Readiness */}
              <div
                className="rounded-2xl p-5 shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center"
                style={{ background: "linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 100%)" }}
              >
                <h2 className="font-semibold text-gray-700 text-sm mb-4">
                  Tingkat Kesiapan
                </h2>
                <CircularProgress value={readinessScore} />
                <p className="text-center mt-4 text-sm font-semibold text-[#025CB8]">
                  Siap Kerja sebagai
                </p>
                <p className="text-center text-base font-black text-gray-800">
                  {targetRole}
                </p>
              </div>
            </div>
          </Section>

          {/* ── SECTION 2 — TARGET KARIR ────────────────────────────────── */}
          <Section direction="up">
            <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                >
                  <Target size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    Posisi yang Kamu Incar
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-black text-gray-800">
                      {targetRole}
                    </span>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                    >
                      Target Aktif
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="flex items-center gap-1.5 text-sm font-semibold text-[#025CB8] hover:text-blue-700 transition-colors group"
                onClick={() => navigate("/profil")}
              >
                Ubah Target
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Section>

          {/* ── SECTION 3 — ROADMAP PREVIEW ─────────────────────────────── */}
          <Section direction="up">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <BookOpen size={16} className="text-[#025CB8]" />
                  </div>
                  <h2 className="font-bold text-gray-800">Roadmap Karir Kamu</h2>
                </div>
                <button
                  onClick={() => navigate("/jalur-karir")}
                  className="flex items-center gap-1 text-xs font-semibold text-[#025CB8] hover:text-blue-700 transition-colors group"
                >
                  Lihat Roadmap Lengkap
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Timeline — horizontal on desktop, vertical on mobile */}
              <div className="hidden md:flex items-start gap-0 relative">
                {roadmap.map((step, idx) => {
                  const cfg = roadmapConfig[step.status];
                  const isLast = idx === roadmap.length - 1;
                  return (
                    <div key={step.id} className="flex-1 flex flex-col items-center relative">
                      {/* Connector line */}
                      {!isLast && (
                        <div
                          className={`absolute top-[19px] left-1/2 w-full h-0.5 z-0 ${step.status === "done" ? "bg-green-300" : "bg-gray-200"
                            }`}
                        />
                      )}
                      {/* Icon */}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${cfg.ring} ${cfg.text} bg-white shadow-sm`}
                      >
                        {cfg.icon}
                      </div>
                      {/* Label */}
                      <div className="mt-3 text-center px-1">
                        <p className={`text-[11px] font-bold ${cfg.text} mb-0.5`}>
                          {cfg.label}
                        </p>
                        <p className="text-xs font-semibold text-gray-700 whitespace-pre-line leading-snug">
                          {step.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {step.duration}
                        </p>
                        {/* Progress for active */}
                        {step.status === "active" && step.progress && (
                          <div className="mt-2 w-full px-2">
                            <ProgressBar value={step.progress} color="#025CB8" />
                            <p className="text-[10px] text-[#025CB8] font-semibold mt-1">
                              {step.progress}% selesai
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile vertical timeline */}
              <div className="md:hidden flex flex-col gap-4">
                {roadmap.map((step, idx) => {
                  const cfg = roadmapConfig[step.status];
                  const isLast = idx === roadmap.length - 1;
                  return (
                    <div key={step.id} className="flex items-start gap-3 relative">
                      {/* Vertical connector */}
                      {!isLast && (
                        <div
                          className={`absolute left-[19px] top-10 bottom-[-16px] w-0.5 ${step.status === "done" ? "bg-green-200" : "bg-gray-200"
                            }`}
                        />
                      )}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.ring} ${cfg.text} bg-white shadow-sm z-10`}
                      >
                        {cfg.icon}
                      </div>
                      <div className="flex-1 pb-2">
                        <span className={`text-[11px] font-bold ${cfg.text}`}>
                          {cfg.label}
                        </span>
                        <p className="text-sm font-semibold text-gray-700 whitespace-pre-line leading-snug">
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-400">{step.duration}</p>
                        {step.status === "active" && step.progress && (
                          <div className="mt-2">
                            <ProgressBar value={step.progress} color="#025CB8" />
                            <p className="text-xs text-[#025CB8] font-semibold mt-1">
                              {step.progress}% selesai
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => navigate("/jalur-karir")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                >
                  Lihat Roadmap Lengkap
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </Section>

          {/* ── SECTION 4 — PRIORITY SKILLS ─────────────────────────────── */}
          <Section direction="up">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 text-base">
                  Skill yang Perlu Dipelajari Sekarang
                </h2>
                <span className="text-xs text-gray-400">Prioritas tertinggi</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {prioritySkills.map((skill) => (
                  <div
                    key={skill.id}
                    onMouseEnter={() => setHoveredSkill(skill.id)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className={`bg-white rounded-2xl p-5 border border-gray-100 cursor-pointer transition-all duration-300 ${hoveredSkill === skill.id
                      ? "shadow-xl -translate-y-1 border-opacity-0"
                      : "shadow-sm hover:shadow-md"
                      }`}
                    style={
                      hoveredSkill === skill.id
                        ? { borderColor: skill.color + "30" }
                        : {}
                    }
                  >
                    {/* Icon + Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{
                          background:
                            hoveredSkill === skill.id ? skill.color : skill.bg,
                          color:
                            hoveredSkill === skill.id ? "#fff" : skill.color,
                        }}
                      >
                        {skill.icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{skill.name}</p>
                        <p className="text-[10px] text-gray-400">Prioritas Tinggi</p>
                      </div>
                    </div>

                    {/* Reason */}
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                      {skill.reason}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
                        <span>Relevansi di Industri</span>
                        <span className="font-bold" style={{ color: skill.color }}>
                          {skill.relevance}%
                        </span>
                      </div>
                      <ProgressBar value={skill.relevance} color={skill.color} />
                    </div>

                    {/* Button */}
                    <button
                      className="w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-95 text-white"
                      style={{ background: skill.color }}
                    >
                      Mulai Belajar →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── SECTION 5 — BOTTOM BANNERS ──────────────────────────────── */}
          <Section direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-4">

              {/* Banner 1 — Lowongan */}
              <div
                className="rounded-2xl p-6 relative overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                style={{ background: "linear-gradient(135deg, #025CB8 0%, #1D4ED8 100%)" }}
                onClick={() => navigate("/lowongan-kerja")}
              >
                {/* Decorative circle */}
                <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
                <div className="absolute -right-2 -bottom-10 w-24 h-24 rounded-full bg-white/5" />

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-1">
                    Lowongan Untukmu
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed mb-5">
                    <span className="text-white font-black text-lg">14 </span>
                    lowongan Data Analyst tersedia yang cocok dengan skillmu
                  </p>
                  <button className="flex items-center gap-2 bg-white text-[#025CB8] text-xs font-bold px-4 py-2 rounded-xl shadow hover:shadow-md group-hover:gap-3 transition-all duration-200">
                    Lihat Lowongan
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Banner 2 — Kursus */}
              <div
                className="rounded-2xl p-6 relative overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}
                onClick={() => navigate("/auth/analisis-skill")}
              >
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
                <div className="absolute -right-2 -bottom-10 w-24 h-24 rounded-full bg-white/5" />

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-1">
                    Jalur Belajar Untukmu
                  </h3>
                  <p className="text-purple-100 text-sm leading-relaxed mb-5">
                    Mulai kursus Tableau dan tingkatkan peluangmu{" "}
                    <span className="text-white font-black text-lg">23%</span>
                  </p>
                  <button className="flex items-center gap-2 bg-white text-purple-700 text-xs font-bold px-4 py-2 rounded-xl shadow hover:shadow-md group-hover:gap-3 transition-all duration-200">
                    Mulai Kursus
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// src/pages/dashboard/index.tsx