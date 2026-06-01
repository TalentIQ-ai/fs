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
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/common/sidebar";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import type { ReactNode } from "react";

type RoadmapStatus =
  | "done"
  | "active"
  | "next"
  | "later";

type LearningJourneyItem = {
  id: number;
  title: string;
  state: RoadmapStatus;
  estimate: string;
  progress?: number;
};

type HighlightedSkill = {
  id: number;
  label: string;
  icon: ReactNode;
  demand: string;
  percentage: number;
  accent: string;
  soft: string;
};

// mock sementara
const dashboardSnapshot: {
  profile: {
    firstName: string;
    completeName: string;
  };
  updatedAt: string;
  jobReadyScore: number;
  dreamRole: string;
  masteredSkills: string[];
  missingSkills: string[];
  learningJourney: LearningJourneyItem[];
  highlightedSkills: HighlightedSkill[];
} = {
  profile: {
    firstName: "Budi",
    completeName: "Budi Santoso",
  },

  updatedAt: "20 Mei 2025",
  jobReadyScore: 72,
  dreamRole: "Data Analyst",

  masteredSkills: ["Python", "SQL", "Excel", "Statistics", "Pandas"],

  missingSkills: [
    "Tableau",
    "Power BI",
    "ML Basics",
    "Spark",
    "Airflow",
  ],

  learningJourney: [
    {
      id: 1,
      title: "Dasar Python",
      state: "done",
      estimate: "4 minggu",
    },
    {
      id: 2,
      title: "SQL Lanjutan",
      state: "active",
      estimate: "3 minggu",
      progress: 60,
    },
    {
      id: 3,
      title: "Visualisasi Data\n(Tableau)",
      state: "next",
      estimate: "4 minggu",
    },
    {
      id: 4,
      title: "Machine Learning\nDasar",
      state: "later",
      estimate: "6 minggu",
    },
  ],

  highlightedSkills: [
    {
      id: 1,
      label: "Tableau",
      icon: <TrendingUp size={22} />,
      demand: "Dipakai di 87% lowongan Data Analyst",
      percentage: 87,
      accent: "#025CB8",
      soft: "#EFF6FF",
    },
    {
      id: 2,
      label: "Power BI",
      icon: <Database size={22} />,
      demand: "Dipakai di 79% lowongan Data Analyst",
      percentage: 79,
      accent: "#7C3AED",
      soft: "#F5F3FF",
    },
    {
      id: 3,
      label: "ML Basics",
      icon: <Brain size={22} />,
      demand: "Dipakai di 65% lowongan Data Analyst",
      percentage: 65,
      accent: "#059669",
      soft: "#ECFDF5",
    },
  ],
};

const suggestedCourses = [
  {
    id: 1,
    title: "Belajar Tableau dari Nol",
    field: "Visualisasi Data",
    source: "Udemy",
    duration: "4.5 jam",
    rating: 4.8,
    tag: "Rekomendasi AI",
    tagStyle: "bg-indigo-100 text-indigo-700",
    accent: "#4F46E5",
  },
  {
    id: 2,
    title: "Machine Learning Dasar",
    field: "Machine Learning",
    source: "Coursera",
    duration: "12 jam",
    rating: 4.9,
    tag: "Populer",
    tagStyle: "bg-green-100 text-green-700",
    accent: "#10B981",
  },
  {
    id: 3,
    title: "Python untuk Data Science",
    field: "Pemrograman",
    source: "Dicoding",
    duration: "15 jam",
    rating: 4.7,
    tag: "",
    tagStyle: "",
    accent: "#F59E0B",
  },
  {
    id: 4,
    title: "Advanced SQL & Database",
    field: "Database",
    source: "Udacity",
    duration: "8 jam",
    rating: 4.6,
    tag: "",
    tagStyle: "",
    accent: "#EF4444",
  },
  {
    id: 5,
    title: "Statistics for Data Science",
    field: "Matematika",
    source: "edX",
    duration: "20 jam",
    rating: 4.8,
    tag: "Rekomendasi AI",
    tagStyle: "bg-indigo-100 text-indigo-700",
    accent: "#025CB8",
  },
  {
    id: 6,
    title: "Storytelling with Data",
    field: "Komunikasi",
    source: "Skillshare",
    duration: "3 jam",
    rating: 4.9,
    tag: "Populer",
    tagStyle: "bg-green-100 text-green-700",
    accent: "#8B5CF6",
  },
];

// progress circle
const ScoreCircle = ({ score }: { score: number }) => {
  const size = 58;
  const line = 2 * Math.PI * size;
  const stroke = line - (score / 100) * line;

  return (
    <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-md"
        style={{
          background:
            "conic-gradient(#025CB8, #62AAEA, #025CB8)",
        }}
      />

      <svg width="160" height="160" className="-rotate-90">
        <circle
          cx="80"
          cy="80"
          r={size}
          fill="none"
          stroke="#E0EEFB"
          strokeWidth="10"
        />

        <circle
          cx="80"
          cy="80"
          r={size}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={line}
          strokeDashoffset={stroke}
          className="duration-1000 ease-out transition-all"
        />

        <defs>
          <linearGradient
            id="scoreGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#025CB8" />
            <stop offset="100%" stopColor="#62AAEA" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-[#025CB8]">
          {score}%
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          siap kerja
        </span>
      </div>
    </div>
  );
};

const BadgeSkill = ({
  text,
  type = "owned",
}: {
  text: string;
  type?: "owned" | "needed";
}) => {
  const palette =
    type === "owned"
      ? "border border-blue-100 bg-blue-50 text-[#025CB8]"
      : "border border-red-100 bg-red-50 text-red-500";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:scale-105 ${palette}`}
    >
      {text}
    </span>
  );
};

const MiniBar = ({
  value,
  accent = "#025CB8",
}: {
  value: number;
  accent?: string;
}) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
    <div
      className="h-2 rounded-full transition-all duration-700"
      style={{
        width: `${value}%`,
        background: accent,
      }}
    />
  </div>
);

// buat status roadmap
const roadmapState = {
  done: {
    label: "Selesai",
    icon: <CheckCircle2 size={20} />,
    ring: "ring-2 ring-green-200",
    text: "text-green-600",
  },

  active: {
    label: "Sedang",
    icon: <Loader2 size={20} className="animate-spin" />,
    ring: "ring-2 ring-blue-300",
    text: "text-[#025CB8]",
  },

  next: {
    label: "Berikutnya",
    icon: <Clock size={20} />,
    ring: "ring-2 ring-orange-200",
    text: "text-orange-500",
  },

  later: {
    label: "Mendatang",
    icon: <Clock size={20} />,
    ring: "ring-2 ring-gray-200",
    text: "text-gray-400",
  },
};

const FadeSection = ({
  children,
  extraClass = "",
}: {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade";
  extraClass?: string;
}) => {
  const { ref} = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`$animClass(isVisible, direction)} ${extraClass}`}
    >
      {children}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [sidebarShrink, setSidebarShrink] = useState(false);

  const {
    profile,
    updatedAt,
    jobReadyScore,
    dreamRole,
    masteredSkills,
    missingSkills,
    learningJourney,
    highlightedSkills,
  } = dashboardSnapshot;

  const sidebarWidth = useMemo(
    () => (sidebarShrink ? "lg:ml-[90px]" : "lg:ml-[260px]"),
    [sidebarShrink]
  );

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar
        collapsed={sidebarShrink}
        setCollapsed={setSidebarShrink}
      />

      <main
        className={`pb-24 pt-[72px] transition-all duration-300 lg:pb-8 lg:pt-0 ${sidebarWidth}`}
      >
        {/* top bar */}
        <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 px-5 py-4 backdrop-blur-md lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Selamat datang kembali, {profile.firstName} 👋
              </h1>

              <p className="mt-0.5 text-sm text-gray-400">
                Terakhir diperbarui{" "}
                <span className="font-medium text-gray-500">
                  {updatedAt}
                </span>

                <span className="mx-1">·</span>

                <span className="font-semibold text-[#025CB8]">
                  Skor kesiapan: {jobReadyScore}%
                </span>
              </p>
            </div>

            <div
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md sm:flex"
              style={{
                background:
                  "linear-gradient(135deg, #025CB8, #62AAEA)",
              }}
            >
              <Zap size={15} />
              <span>{jobReadyScore}% Ready</span>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl space-y-7 px-4 pt-6 sm:px-5 sm:pt-7 lg:px-8">
          {/* cards */}
          <FadeSection>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {/* skill dimiliki */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <CheckCircle2
                      size={16}
                      className="text-[#025CB8]"
                    />
                  </div>

                  <h2 className="text-sm font-semibold text-gray-700">
                    Skill yang Sudah Ada
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {masteredSkills.map((skillName) => (
                    <BadgeSkill
                      key={skillName}
                      text={skillName}
                    />
                  ))}
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  {masteredSkills.length} skill berhasil dibaca dari CV
                </p>
              </div>

              {/* skill kurang */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                    <Target size={16} className="text-red-500" />
                  </div>

                  <h2 className="text-sm font-semibold text-gray-700">
                    Skill yang Masih Kurang
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skillName) => (
                    <BadgeSkill
                      key={skillName}
                      text={skillName}
                      type="needed"
                    />
                  ))}
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  {missingSkills.length} skill perlu dipelajari
                </p>
              </div>

              {/* readiness */}
              <div
                className="flex flex-col items-center justify-center rounded-2xl border border-blue-100 p-5 shadow-sm transition hover:shadow-md"
                style={{
                  background:
                    "linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 100%)",
                }}
              >
                <h2 className="mb-4 text-sm font-semibold text-gray-700">
                  Tingkat Kesiapan
                </h2>

                <ScoreCircle score={jobReadyScore} />

                <p className="mt-4 text-center text-sm font-semibold text-[#025CB8]">
                  Siap kerja sebagai
                </p>

                <p className="text-center text-base font-black text-gray-800">
                  {dreamRole}
                </p>
              </div>
            </div>
          </FadeSection>

          {/* target */}
          <FadeSection>
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #025CB8, #62AAEA)",
                  }}
                >
                  <Target size={20} className="text-white" />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Role incaran kamu
                  </p>

                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-lg font-black text-gray-800">
                      {dreamRole}
                    </span>

                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #025CB8, #62AAEA)",
                      }}
                    >
                      Aktif
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/profil")}
                className="group flex items-center gap-1.5 text-sm font-semibold text-[#025CB8] transition hover:text-blue-700"
              >
                Ubah Target

                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </div>
          </FadeSection>

          {/* roadmap */}
          <FadeSection>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <BookOpen
                      size={16}
                      className="text-[#025CB8]"
                    />
                  </div>

                  <h2 className="font-bold text-gray-800">
                    Roadmap Karir
                  </h2>
                </div>

                <button
                  onClick={() => navigate("/jalur-karir")}
                  className="group flex items-center gap-1 text-xs font-semibold text-[#025CB8] transition hover:text-blue-700"
                >
                  Lihat semua

                  <ChevronRight
                    size={14}
                    className="transition group-hover:translate-x-0.5"
                  />
                </button>
              </div>

              <div className="hidden items-start overflow-x-auto pb-2 xl:flex">
                {learningJourney.map((phase, index) => {
                  const currentStep =
                    roadmapState[
                    phase.state as keyof typeof roadmapState
                    ];

                  const lastIndex =
                    index === learningJourney.length - 1;

                  return (
                    <div
                      key={phase.id}
                      className="relative flex flex-1 flex-col items-center"
                    >
                      {!lastIndex && (
                        <div
                          className={`absolute left-1/2 top-[19px] z-0 h-0.5 w-full ${phase.state === "done"
                            ? "bg-green-300"
                            : "bg-gray-200"
                            }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ${currentStep.ring} ${currentStep.text}`}
                      >
                        {currentStep.icon}
                      </div>

                      <div className="mt-3 px-1 text-center">
                        <p
                          className={`mb-0.5 text-[11px] font-bold ${currentStep.text}`}
                        >
                          {currentStep.label}
                        </p>

                        <p className="whitespace-pre-line text-xs font-semibold leading-snug text-gray-700">
                          {phase.title}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {phase.estimate}
                        </p>

                        {phase.state === "active" &&
                          phase.progress && (
                            <div className="mt-2 w-full px-2">
                              <MiniBar
                                value={phase.progress ?? 0}
                              />

                              <p className="mt-1 text-[10px] font-semibold text-[#025CB8]">
                                {phase.progress}% selesai
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* mobile */}
              <div className="flex flex-col gap-4 xl:hidden">
                {learningJourney.map((phase, index) => {
                  const currentStep =
                    roadmapState[
                    phase.state as keyof typeof roadmapState
                    ];

                  const lastIndex =
                    index === learningJourney.length - 1;

                  return (
                    <div
                      key={phase.id}
                      className="relative flex items-start gap-3"
                    >
                      {!lastIndex && (
                        <div
                          className={`absolute bottom-[-16px] left-[19px] top-10 w-0.5 ${phase.state === "done"
                            ? "bg-green-200"
                            : "bg-gray-200"
                            }`}
                        />
                      )}

                      <div
                        className={`z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm ${currentStep.ring} ${currentStep.text}`}
                      >
                        {currentStep.icon}
                      </div>

                      <div className="flex-1 pb-2">
                        <span
                          className={`text-[11px] font-bold ${currentStep.text}`}
                        >
                          {currentStep.label}
                        </span>

                        <p className="whitespace-pre-line text-sm font-semibold leading-snug text-gray-700">
                          {phase.title}
                        </p>

                        <p className="text-xs text-gray-400">
                          {phase.estimate}
                        </p>

                        {phase.state === "active" &&
                          phase.progress && (
                            <div className="mt-2">
                              <MiniBar
                                value={phase.progress ?? 0}
                              />

                              <p className="mt-1 text-xs font-semibold text-[#025CB8]">
                                {phase.progress}% selesai
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeSection>

          {/* priority */}
          <FadeSection>
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-800">
                  Skill Prioritas
                </h2>

                <span className="text-xs text-gray-400">
                  fokus belajar sekarang
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {highlightedSkills.map((skillCard) => {
                  const isHover =
                    activeCard === skillCard.id;

                  return (
                    <div
                      key={skillCard.id}
                      onMouseEnter={() =>
                        setActiveCard(skillCard.id)
                      }
                      onMouseLeave={() =>
                        setActiveCard(null)
                      }
                      className={`cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 ${isHover
                        ? "border-opacity-0 shadow-xl -translate-y-1"
                        : "shadow-sm hover:shadow-md"
                        }`}
                      style={
                        isHover
                          ? {
                            borderColor:
                              skillCard.accent + "30",
                          }
                          : {}
                      }
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300"
                          style={{
                            background: isHover
                              ? skillCard.accent
                              : skillCard.soft,

                            color: isHover
                              ? "#fff"
                              : skillCard.accent,
                          }}
                        >
                          {skillCard.icon}
                        </div>

                        <div>
                          <p className="font-bold text-gray-800">
                            {skillCard.label}
                          </p>

                          <p className="text-[10px] text-gray-400">
                            High Priority
                          </p>
                        </div>
                      </div>

                      <p className="mb-4 text-xs leading-relaxed text-gray-500">
                        {skillCard.demand}
                      </p>

                      <div className="mb-4">
                        <div className="mb-1.5 flex justify-between text-[11px] text-gray-500">
                          <span>Relevansi industri</span>

                          <span
                            className="font-bold"
                            style={{
                              color: skillCard.accent,
                            }}
                          >
                            {skillCard.percentage}%
                          </span>
                        </div>

                        <MiniBar
                          value={skillCard.percentage}
                          accent={skillCard.accent}
                        />
                      </div>

                      <button
                        className="w-full rounded-xl py-2.5 text-xs font-bold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-95"
                        style={{
                          background: skillCard.accent,
                        }}
                      >
                        Mulai Belajar →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeSection>

          {/* course */}
          <FadeSection>
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
                    <Target
                      size={18}
                      className="text-[#025CB8]"
                    />

                    Kursus Rekomendasi
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Berdasarkan target role kamu sebagai{" "}
                    <span className="font-semibold text-[#025CB8]">
                      {dreamRole}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => navigate("/profil")}
                  className="group hidden items-center gap-1 text-sm font-semibold text-[#025CB8] transition hover:text-blue-700 sm:flex"
                >
                  Lihat semua

                  <ChevronRight
                    size={15}
                    className="transition group-hover:translate-x-0.5"
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {suggestedCourses.map((courseItem) => (
                  <div
                    key={courseItem.id}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div
                      className="relative flex h-32 w-full items-center justify-center"
                      style={{
                        backgroundColor:
                          `${courseItem.accent}15`,
                      }}
                    >
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm"
                        style={{
                          color: courseItem.accent,
                        }}
                      >
                        <BookOpen size={28} />
                      </div>

                      {!!courseItem.tag && (
                        <div
                          className={`absolute left-3 top-3 rounded-lg px-2 py-1 text-[10px] font-bold shadow-sm ${courseItem.tagStyle}`}
                        >
                          {courseItem.tag}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <span className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {courseItem.field}
                      </span>

                      <h3 className="mb-3 text-sm font-bold leading-tight text-gray-800 transition-colors group-hover:text-[#025CB8]">
                        {courseItem.title}
                      </h3>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-gray-600">
                            {courseItem.source}
                          </span>

                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock size={10} />

                            {courseItem.duration}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber-600">
                          <Star
                            size={12}
                            className="fill-amber-500"
                          />

                          {courseItem.rating}
                        </div>
                      </div>

                      <button
                        className="mt-4 w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${courseItem.accent}, ${courseItem.accent}CC)`,
                        }}
                      >
                        Mulai Belajar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeSection>

          {/* banner bawah */}
          <FadeSection>
            <div className="grid grid-cols-1 gap-5 pb-4 xl:grid-cols-2">
              {/* lowongan */}
              <div
                onClick={() =>
                  navigate("/lowongan-kerja")
                }
                className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #025CB8 0%, #1D4ED8 100%)",
                }}
              >
                <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />

                <div className="absolute -bottom-10 -right-2 h-24 w-24 rounded-full bg-white/5" />

                <div className="relative z-10">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Briefcase
                      size={20}
                      className="text-white"
                    />
                  </div>

                  <h3 className="mb-1 text-base font-bold text-white">
                    Lowongan Buat Kamu
                  </h3>

                  <p className="mb-5 text-sm leading-relaxed text-blue-100">
                    <span className="text-lg font-black text-white">
                      14
                    </span>{" "}
                    lowongan cocok buat role Data Analyst
                  </p>

                  <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#025CB8] shadow transition-all duration-200 hover:shadow-md group-hover:gap-3">
                    Lihat Lowongan

                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* belajar */}
              <div
                onClick={() =>
                  navigate("/auth/analisis-skill")
                }
                className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                }}
              >
                <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />

                <div className="absolute -bottom-10 -right-2 h-24 w-24 rounded-full bg-white/5" />

                <div className="relative z-10">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <BookOpen
                      size={20}
                      className="text-white"
                    />
                  </div>

                  <h3 className="mb-1 text-base font-bold text-white">
                    Jalur Belajar
                  </h3>

                  <p className="mb-5 text-sm leading-relaxed text-purple-100">
                    Mulai belajar Tableau dan tingkatkan peluangmu{" "}
                    <span className="text-lg font-black text-white">
                      23%
                    </span>
                  </p>

                  <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-purple-700 shadow transition-all duration-200 hover:shadow-md group-hover:gap-3">
                    Mulai Kursus

                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;