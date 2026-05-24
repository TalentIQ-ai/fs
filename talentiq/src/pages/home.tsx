// src/pages/home.tsx
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Briefcase,
  Clock,
  Sparkles,
  Target,
  Trophy,
  Upload,
  Zap,
  
} from "lucide-react";

import HeaderComponent from "@/layout/header";
import { useScrollAnimation, animClass } from "@/hooks/use-scroll-animation";

// ── Animated Section Wrapper ──────────────────────────────────────────────────
const AnimSection = ({
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
    <div
      ref={ref}
      className={`${animClass(isVisible, direction, 0)} ${className}`}
    >
      {children}
    </div>
  );
};

// ── Feature Cards ─────────────────────────────────────────────────────────────
const features = [
  {
    title: "Analisis Skill",
    desc: "AI membaca CV dan menganalisis skill teknis maupun soft skill secara otomatis.",
    icon: <Sparkles size={22} />,
    path: "/analisis-skill",
    badge: "AI Analysis",
  },
  {
    title: "Jalur Karir",
    desc: "Dapatkan roadmap belajar dan pengembangan karir berdasarkan skill kamu.",
    icon: <Target size={22} />,
    path: "/jalur-karir",
    badge: "Career Roadmap",
  },
  {
    title: "Lowongan Pekerjaan",
    desc: "Temukan lowongan yang cocok dengan kemampuan dan aspirasi karirmu.",
    icon: <Briefcase size={22} />,
    path: "/lowongan-kerja",
    badge: "Job Matching",
  },
];

// ── Steps ─────────────────────────────────────────────────────────────────────
const steps = [
  {
    title: "Upload CV",
    desc: "Upload CV format PDF atau DOCX.",
    icon: <Upload size={20} />,
  },
  {
    title: "AI Analisis Skill",
    desc: "AI membaca skill, pengalaman, dan potensi karir.",
    icon: <BrainCircuit size={20} />,
  },
  {
    title: "Dapatkan Roadmap",
    desc: "AI membuat jalur belajar dan karir personal.",
    icon: <Target size={20} />,
  },
  {
    title: "Temukan Lowongan",
    desc: "Lihat pekerjaan yang cocok dengan profilmu.",
    icon: <Briefcase size={20} />,
  },
];

// ── Main Component ────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderComponent />

      <div className="flex-1 pt-[0px]">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #00458D 0%, #025CB8 45%, #62AAEA 100%)",
          }}
        >
          {/* Blur Elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* LEFT */}
              <AnimSection direction="left">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                  <Sparkles size={14} className="text-white" />
                  <span className="text-white/90 text-xs font-bold">
                    AI Career Intelligence Platform
                  </span>
                </div>

                <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                  Bangun Karir IT
                  <span className="block text-[#DCEEFF]">
                    dengan Bantuan AI
                  </span>
                </h1>

                <p className="text-blue-100 text-lg leading-8 mt-6 max-w-2xl">
                  TalentIQ AI membantu kamu memahami skill, menentukan jalur
                  karir terbaik, dan menemukan lowongan kerja yang paling cocok
                  menggunakan analisis AI modern berbasis data industri.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    onClick={() => navigate("/analisis-skill")}
                    className="bg-white text-[#025CB8] font-bold px-7 py-4 rounded-2xl
                               hover:bg-gray-100 transition-all duration-300
                               shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    Mulai Analisis Skill
                    <ArrowRight size={18} />
                  </button>

                  <button
                    onClick={() => navigate("/jalur-karir")}
                    className="border border-white/30 text-white font-semibold
                               px-7 py-4 rounded-2xl hover:bg-white/10
                               transition-all duration-300"
                  >
                    Lihat Jalur Karir
                  </button>
                </div>

                {/* Mini Stats */}
                <div className="flex flex-wrap gap-4 mt-10">
                  {[
                    { num: "10K+", label: "Lowongan IT" },
                    { num: "25+", label: "Skill Dianalisis" },
                    { num: "AI", label: "Career Matching" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4"
                    >
                      <p className="text-white text-2xl font-black">
                        {item.num}
                      </p>
                      <p className="text-blue-100 text-xs mt-1">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimSection>

              {/* RIGHT */}
              <AnimSection direction="right">
                <div className="relative">

                  {/* Main Dashboard Card */}
                  <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 shadow-2xl border border-white/40">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-black text-gray-800 text-lg">
                          AI Career Dashboard
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          Personal career intelligence
                        </p>
                      </div>

                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <Zap size={24} className="text-[#025CB8]" />
                      </div>
                    </div>

                    {/* Skill Match */}
                    <div className="space-y-4 mb-6">
                      {[
                        {
                          label: "Frontend Development",
                          value: "92%",
                        },
                        {
                          label: "UI/UX Design",
                          value: "78%",
                        },
                        {
                          label: "Data Analysis",
                          value: "65%",
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              {item.label}
                            </span>

                            <span className="text-sm font-bold text-[#025CB8]">
                              {item.value}
                            </span>
                          </div>

                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-3 rounded-full"
                              style={{
                                width: item.value,
                                background:
                                  "linear-gradient(90deg, #025CB8, #62AAEA)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Roadmap Preview */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                      <p className="text-[#025CB8] text-xs font-bold uppercase tracking-wider mb-4">
                        Roadmap Progress
                      </p>

                      <div className="space-y-3">
                        {[
                          {
                            title: "Frontend Fundamentals",
                            progress: 100,
                            done: true,
                          },
                          {
                            title: "React Ecosystem",
                            progress: 70,
                          },
                          {
                            title: "TypeScript Advanced",
                            progress: 0,
                            locked: true,
                          },
                        ].map((step, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-3 ${step.locked ? "opacity-40" : ""
                              }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                              ${step.done
                                  ? "bg-green-500 text-white"
                                  : step.locked
                                    ? "bg-gray-200 text-gray-500"
                                    : "bg-[#025CB8] text-white"
                                }`}
                            >
                              {step.done ? "✓" : step.locked ? "🔒" : i + 1}
                            </div>

                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-700">
                                {step.title}
                              </p>

                              {!step.locked && (
                                <div className="mt-1 h-1.5 bg-white rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-[#025CB8]"
                                    style={{
                                      width: `${step.progress}%`,
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Insight */}
                    <div className="bg-gradient-to-r from-[#025CB8] to-[#62AAEA] rounded-2xl p-5 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} />
                        <p className="font-bold text-sm">AI Insight</p>
                      </div>

                      <p className="text-sm leading-7 text-blue-50">
                        Skill React & TypeScript kamu memiliki kecocokan tinggi
                        untuk posisi Frontend Engineer dengan estimasi kesiapan
                        kerja dalam 4 bulan.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimSection>
            </div>
          </div>
        </section>

        {/* ── FEATURE STATS ─────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-5 lg:px-8 py-14">
          <AnimSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: <Sparkles size={20} className="text-[#025CB8]" />,
                  bg: "bg-blue-50",
                  num: "94%",
                  label: "Akurasi AI Matching",
                },
                {
                  icon: <Briefcase size={20} className="text-green-600" />,
                  bg: "bg-green-50",
                  num: "10K+",
                  label: "Lowongan IT",
                },
                {
                  icon: <Target size={20} className="text-purple-500" />,
                  bg: "bg-purple-50",
                  num: "6+",
                  label: "Jalur Karir",
                },
                {
                  icon: <Clock size={20} className="text-orange-500" />,
                  bg: "bg-orange-50",
                  num: "≤12",
                  label: "Bulan Estimasi",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
                >
                  <div
                    className={`${item.bg} w-12 h-12 rounded-2xl flex items-center justify-center shrink-0`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-2xl font-black text-gray-800">
                      {item.num}
                    </p>
                    <p className="text-gray-400 text-sm font-medium">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimSection>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-24">
          <AnimSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-800">
                Semua yang Kamu Butuhkan
              </h2>

              <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto leading-8">
                TalentIQ AI membantu perjalanan karirmu dari analisis skill,
                roadmap belajar, hingga pencarian pekerjaan.
              </p>
            </div>
          </AnimSection>

          <div className="grid lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimSection key={feature.title}>
                <button
                  onClick={() => navigate(feature.path)}
                  className="group w-full bg-white rounded-[32px] border border-gray-100 shadow-sm
                             hover:shadow-2xl transition-all duration-300
                             hover:-translate-y-1 overflow-hidden text-left"
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#025CB8] to-[#62AAEA]" />

                  <div className="p-7">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #025CB8, #62AAEA)",
                        }}
                      >
                        {feature.icon}
                      </div>

                      <span className="text-[11px] font-bold text-[#025CB8] bg-[#025CB8]/10 px-3 py-1 rounded-full">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-800 mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-7 mb-8">
                      {feature.desc}
                    </p>

                    <div className="flex items-center gap-2 text-[#025CB8] font-bold text-sm">
                      Selengkapnya
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </button>
              </AnimSection>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 lg:px-8 pb-24">
          <AnimSection>
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 lg:p-12">

              <div className="text-center mb-14">
                <h2 className="text-3xl lg:text-4xl font-black text-gray-800">
                  Cara Kerjanya
                </h2>

                <p className="text-gray-500 mt-4 text-lg">
                  Hanya perlu beberapa langkah sederhana.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {steps.map((step, i) => (
                  <div key={step.title} className="text-center relative">

                    <div
                      className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center
                                 text-white mb-5"
                      style={{
                        background:
                          "linear-gradient(135deg, #025CB8, #62AAEA)",
                      }}
                    >
                      {step.icon}
                    </div>

                    <h3 className="font-bold text-gray-800 mb-2">
                      {step.title}
                    </h3>

                    <p className="text-sm text-gray-500 leading-7">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimSection>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 lg:px-8 pb-24">
          <AnimSection>
            <div
              className="rounded-[32px] p-10 lg:p-14 text-center shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, #025CB8, #3B82C4)",
              }}
            >
              <div className="w-20 h-20 rounded-[24px] bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                <Trophy size={38} className="text-white" />
              </div>

              <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                Siap Mengembangkan
                <span className="block">Karirmu?</span>
              </h2>

              <p className="text-blue-100 text-lg mt-5 max-w-2xl mx-auto leading-8">
                Analisis skill, temukan roadmap belajar, dan dapatkan pekerjaan
                yang sesuai dengan kemampuanmu bersama TalentIQ AI.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <button
                  onClick={() => navigate("/analisis-skill")}
                  className="px-8 py-4 rounded-2xl bg-white text-[#025CB8]
                             font-bold text-lg shadow-lg hover:shadow-2xl
                             hover:-translate-y-1 transition-all duration-300
                             inline-flex items-center gap-2"
                >
                  Mulai Sekarang
                  <ArrowRight size={20} />
                </button>

                <button
                  onClick={() => navigate("/lowongan-kerja")}
                  className="px-8 py-4 rounded-2xl border border-white/30
                             text-white font-bold text-lg hover:bg-white/10
                             transition-all duration-300"
                >
                  Lihat Lowongan
                </button>
              </div>
            </div>
          </AnimSection>
        </section>
      </div>
    </div>
  );
};

export default Home;