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
import {
  useScrollAnimation,
  animClass,
} from "@/hooks/use-scroll-animation";

// wrapper anim biar ga nulis logic berulang
const MotionBlock = ({
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

const featureMenus = [
  {
    title: "Analisis Skill",
    description:
      "AI membaca CV dan menganalisis skill teknis maupun soft skill secara otomatis.",
    icon: <Sparkles size={22} />,
    redirectTo: "/analisis-skill",
    tag: "AI Analysis",
  },
  {
    title: "Jalur Karir",
    description:
      "Dapatkan roadmap belajar dan pengembangan karir berdasarkan skill kamu.",
    icon: <Target size={22} />,
    redirectTo: "/jalur-karir",
    tag: "Career Roadmap",
  },
  {
    title: "Lowongan Pekerjaan",
    description:
      "Temukan lowongan yang cocok dengan kemampuan dan aspirasi karirmu.",
    icon: <Briefcase size={22} />,
    redirectTo: "/lowongan-kerja",
    tag: "Job Matching",
  },
];

const workflowSteps = [
  {
    title: "Upload CV",
    description: "Upload CV format PDF atau DOCX.",
    icon: <Upload size={20} />,
  },
  {
    title: "AI Analisis Skill",
    description: "AI membaca skill, pengalaman, dan potensi karir.",
    icon: <BrainCircuit size={20} />,
  },
  {
    title: "Dapatkan Roadmap",
    description: "AI membuat jalur belajar dan karir personal.",
    icon: <Target size={20} />,
  },
  {
    title: "Temukan Lowongan",
    description: "Lihat pekerjaan yang cocok dengan profilmu.",
    icon: <Briefcase size={20} />,
  },
];

const landingStats = [
  {
    icon: <Sparkles size={20} className="text-[#025CB8]" />,
    bgClass: "bg-blue-50",
    value: "94%",
    label: "Akurasi AI Matching",
  },
  {
    icon: <Briefcase size={20} className="text-green-600" />,
    bgClass: "bg-green-50",
    value: "10K+",
    label: "Lowongan IT",
  },
  {
    icon: <Target size={20} className="text-purple-500" />,
    bgClass: "bg-purple-50",
    value: "6+",
    label: "Jalur Karir",
  },
  {
    icon: <Clock size={20} className="text-orange-500" />,
    bgClass: "bg-orange-50",
    value: "≤12",
    label: "Bulan Estimasi",
  },
];

const dashboardSkills = [
  { label: "Frontend Development", percent: "92%" },
  { label: "UI/UX Design", percent: "78%" },
  { label: "Data Analysis", percent: "65%" },
];

const roadmapPreview = [
  {
    title: "Frontend Fundamentals",
    progress: 100,
    state: "done",
  },
  {
    title: "React Ecosystem",
    progress: 70,
    state: "progress",
  },
  {
    title: "TypeScript Advanced",
    progress: 0,
    state: "locked",
  },
];

const heroStats = [
  { value: "10K+", label: "Lowongan IT" },
  { value: "25+", label: "Skill Dianalisis" },
  { value: "AI", label: "Career Matching" },
];

const Home = () => {
  const navigate = useNavigate();

  const openPage = (path: string) => navigate(path);

  const roadmapBadgeStyle = (state: string) => {
    switch (state) {
      case "done":
        return "bg-green-500 text-white";

      case "locked":
        return "bg-gray-200 text-gray-500";

      default:
        return "bg-[#025CB8] text-white";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderComponent />

      <main className="flex-1">

        {/* hero */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #00458D 0%, #025CB8 45%, #62AAEA 100%)",
          }}
        >
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <MotionBlock direction="left">
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
                    onClick={() => openPage("/analisis-skill")}
                    className="bg-white text-[#025CB8] font-bold px-7 py-4 rounded-2xl
                    hover:bg-gray-100 transition-all duration-300
                    shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    Mulai Analisis Skill
                    <ArrowRight size={18} />
                  </button>

                  <button
                    onClick={() => openPage("/jalur-karir")}
                    className="border border-white/30 text-white font-semibold
                    px-7 py-4 rounded-2xl hover:bg-white/10
                    transition-all duration-300"
                  >
                    Lihat Jalur Karir
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 mt-10">
                  {heroStats.map((statBox) => (
                    <div
                      key={statBox.label}
                      className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4"
                    >
                      <p className="text-white text-2xl font-black">
                        {statBox.value}
                      </p>

                      <p className="text-blue-100 text-xs mt-1">
                        {statBox.label}
                      </p>
                    </div>
                  ))}
                </div>
              </MotionBlock>

              <MotionBlock direction="right">
                <div className="relative">
                  <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 shadow-2xl border border-white/40">

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

                    <div className="space-y-4 mb-6">
                      {dashboardSkills.map((skillInfo) => (
                        <div key={skillInfo.label}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              {skillInfo.label}
                            </span>

                            <span className="text-sm font-bold text-[#025CB8]">
                              {skillInfo.percent}
                            </span>
                          </div>

                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-3 rounded-full"
                              style={{
                                width: skillInfo.percent,
                                background:
                                  "linear-gradient(90deg, #025CB8, #62AAEA)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                      <p className="text-[#025CB8] text-xs font-bold uppercase tracking-wider mb-4">
                        Roadmap Progress
                      </p>

                      <div className="space-y-3">
                        {roadmapPreview.map((phase, idx) => {
                          const isLocked = phase.state === "locked";
                          const isDone = phase.state === "done";

                          return (
                            <div
                              key={phase.title}
                              className={`flex items-center gap-3 ${isLocked ? "opacity-40" : ""}`}
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${roadmapBadgeStyle(
                                  phase.state
                                )}`}
                              >
                                {isDone
                                  ? "✓"
                                  : isLocked
                                    ? "🔒"
                                    : idx + 1}
                              </div>

                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-700">
                                  {phase.title}
                                </p>

                                {!isLocked && (
                                  <div className="mt-1 h-1.5 bg-white rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-[#025CB8]"
                                      style={{
                                        width: `${phase.progress}%`,
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#025CB8] to-[#62AAEA] rounded-2xl p-5 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} />

                        <p className="font-bold text-sm">
                          AI Insight
                        </p>
                      </div>

                      <p className="text-sm leading-7 text-blue-50">
                        Skill React & TypeScript kamu memiliki kecocokan tinggi
                        untuk posisi Frontend Engineer dengan estimasi kesiapan
                        kerja dalam 4 bulan.
                      </p>
                    </div>
                  </div>
                </div>
              </MotionBlock>
            </div>
          </div>
        </section>

        {/* quick stats */}
        <section className="max-w-7xl mx-auto px-5 lg:px-8 py-14">
          <MotionBlock>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {landingStats.map((statCard) => (
                <div
                  key={statCard.label}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
                >
                  <div
                    className={`${statCard.bgClass} w-12 h-12 rounded-2xl flex items-center justify-center shrink-0`}
                  >
                    {statCard.icon}
                  </div>

                  <div>
                    <p className="text-2xl font-black text-gray-800">
                      {statCard.value}
                    </p>

                    <p className="text-gray-400 text-sm font-medium">
                      {statCard.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MotionBlock>
        </section>

        {/* fitur utama */}
        <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-24">
          <MotionBlock>
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-800">
                Semua yang Kamu Butuhkan
              </h2>

              <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto leading-8">
                TalentIQ AI membantu perjalanan karirmu dari analisis skill,
                roadmap belajar, hingga pencarian pekerjaan.
              </p>
            </div>
          </MotionBlock>

          <div className="grid lg:grid-cols-3 gap-6">
            {featureMenus.map((menuCard) => (
              <MotionBlock key={menuCard.title}>
                <button
                  onClick={() => openPage(menuCard.redirectTo)}
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
                        {menuCard.icon}
                      </div>

                      <span className="text-[11px] font-bold text-[#025CB8] bg-[#025CB8]/10 px-3 py-1 rounded-full">
                        {menuCard.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-800 mb-3">
                      {menuCard.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-7 mb-8">
                      {menuCard.description}
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
              </MotionBlock>
            ))}
          </div>
        </section>

        {/* alur */}
        <section className="max-w-6xl mx-auto px-5 lg:px-8 pb-24">
          <MotionBlock>
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
                {workflowSteps.map((stepCard) => (
                  <div
                    key={stepCard.title}
                    className="text-center relative"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center
                      text-white mb-5"
                      style={{
                        background:
                          "linear-gradient(135deg, #025CB8, #62AAEA)",
                      }}
                    >
                      {stepCard.icon}
                    </div>

                    <h3 className="font-bold text-gray-800 mb-2">
                      {stepCard.title}
                    </h3>

                    <p className="text-sm text-gray-500 leading-7">
                      {stepCard.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </MotionBlock>
        </section>

        {/* cta bawah */}
        <section className="max-w-6xl mx-auto px-5 lg:px-8 pb-24">
          <MotionBlock>
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
                  onClick={() => openPage("/analisis-skill")}
                  className="px-8 py-4 rounded-2xl bg-white text-[#025CB8]
                  font-bold text-lg shadow-lg hover:shadow-2xl
                  hover:-translate-y-1 transition-all duration-300
                  inline-flex items-center gap-2"
                >
                  Mulai Sekarang
                  <ArrowRight size={20} />
                </button>

                <button
                  onClick={() => openPage("/lowongan-kerja")}
                  className="px-8 py-4 rounded-2xl border border-white/30
                  text-white font-bold text-lg hover:bg-white/10
                  transition-all duration-300"
                >
                  Lihat Lowongan
                </button>
              </div>
            </div>
          </MotionBlock>
        </section>
      </main>
    </div>
  );
};

export default Home;