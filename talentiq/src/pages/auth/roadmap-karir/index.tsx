// src/pages/auth/roadmap-karir/index.tsx

import {
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Compass,
  Database,
  FileCode2,
  LineChart,
  Loader2,
  Lock,
  Target,
  Trophy,
} from "lucide-react";

import { useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import Sidebar from "@/components/common/sidebar";

// data dummy dulu
const skillRadar = [
  { label: "Analisis Data", current: 70, target: 90, max: 100 },
  { label: "Visualisasi", current: 40, target: 85, max: 100 },
  { label: "Machine Learning", current: 20, target: 70, max: 100 },
  { label: "SQL", current: 80, target: 95, max: 100 },
  { label: "Python", current: 65, target: 90, max: 100 },
];

const careerJourney = [
  {
    step: 1,
    title: "Fondasi Data",
    state: "done",
    estimate: "Selesai dalam 6 minggu",
    stack: ["Python Dasar", "SQL Dasar", "Statistika Dasar"],
    finishedCourse: 2,
    detail:
      "Membangun pemahaman dasar tentang pengolahan data dan logika pemrograman.",
    icon: <Database size={19} />,
  },
  {
    step: 2,
    title: "Analisis Data",
    state: "active",
    estimate: "3 minggu lagi",
    progress: 65,
    stack: ["SQL Lanjutan", "Pandas", "NumPy"],
    currentCourse: "Data Manipulation with Python",
    detail:
      "Mengolah dan membersihkan dataset menggunakan library manipulasi data.",
    icon: <FileCode2 size={19} />,
  },
  {
    step: 3,
    title: "Visualisasi Data",
    state: "next",
    estimate: "Estimasi: 4 minggu",
    stack: ["Tableau", "Power BI", "Matplotlib"],
    suggestedCourse: 3,
    detail:
      "Membuat dashboard interaktif dan menyampaikan insight secara visual.",
    icon: <LineChart size={19} />,
  },
  {
    step: 4,
    title: "Machine Learning Dasar",
    state: "locked",
    estimate: "Estimasi: 6 minggu",
    stack: ["Scikit-learn", "Regresi", "Klasifikasi"],
    detail:
      "Membangun model prediktif dasar untuk menyelesaikan masalah bisnis.",
    icon: <BrainCircuit size={19} />,
  },
];

const aiSuggestions = [
  "Selesaikan modul 'Data Manipulation with Python' di kursus aktif saat ini.",
  "Mulai biasakan diri mengerjakan dataset sederhana dari Kaggle (misal: Titanic).",
  "Buat 1 proyek analisis data portofolio menggunakan dataset terbuka pemerintah.",
];

// mini component
const SkillProgress = ({ percent }: { percent: number }) => (
  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{
        width: `${percent}%`,
        background:
          "linear-gradient(90deg, #025CB8 0%, #62AAEA 100%)",
      }}
    />
  </div>
);

const RadarHint = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const skillInfo = payload?.[0]?.payload;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-gray-800 mb-1">
        {skillInfo.label}
      </p>

      <p className="text-[#025CB8] font-medium">
        Skill sekarang: {payload?.[0]?.value}%
      </p>

      <p className="text-gray-400 mt-1">
        Target: {payload?.[1]?.value}%
      </p>
    </div>
  );
};

const RoadmapKarir = () => {
  const [sidebarMini, setSidebarMini] = useState(false);

  const roadmapSummary = useMemo(() => {
    const doneCount = careerJourney.filter(
      ({ state }) => state === "done"
    ).length;

    const activeCount = careerJourney.filter(
      ({ state }) => state === "active"
    ).length;

    return {
      total: careerJourney.length,
      done: doneCount,
      active: activeCount,
    };
  }, []);

  const layoutShift = sidebarMini
    ? "lg:ml-[90px]"
    : "lg:ml-[260px]";

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar
        collapsed={sidebarMini}
        setCollapsed={setSidebarMini}
      />

      <main
        className={`pb-24 lg:pb-10 transition-all duration-300 ${layoutShift}`}
      >
        {/* top bar */}
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-md px-5 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Compass
                  size={20}
                  className="text-[#025CB8]"
                />
                Roadmap Karir Kamu
              </h1>

              <p className="mt-0.5 text-sm text-gray-400">
                Berdasarkan analisis AI · Target:
                <span className="font-semibold text-gray-600">
                  {" "}
                  Data Analyst
                </span>
                {" · "}
                Estimasi: 6-9 bulan
              </p>
            </div>

            <button className="self-start sm:self-auto px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#025CB8] hover:border-blue-200 transition">
              Ubah Target Karir
            </button>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-5 lg:px-8 pt-6 space-y-6">
          {/* quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Total Tahapan",
                value: roadmapSummary.total,
                icon: (
                  <Target
                    size={20}
                    className="text-[#025CB8]"
                  />
                ),
                box: "bg-blue-50",
              },
              {
                title: "Selesai",
                value: roadmapSummary.done,
                icon: (
                  <CheckCircle2
                    size={20}
                    className="text-green-600"
                  />
                ),
                box: "bg-green-50",
              },
              {
                title: "Sedang Berjalan",
                value: roadmapSummary.active,
                icon: (
                  <Loader2
                    size={20}
                    className="animate-spin-slow text-[#025CB8]"
                  />
                ),
                box: "bg-blue-50",
              },
              {
                title: "Sisa Estimasi",
                value: "5-7",
                suffix: " bln",
                icon: (
                  <Clock
                    size={20}
                    className="text-amber-600"
                  />
                ),
                box: "bg-amber-50",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.box}`}
                >
                  {card.icon}
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400">
                    {card.title}
                  </p>

                  <p className="text-xl leading-tight font-black text-gray-800">
                    {card.value}
                    {card.suffix && (
                      <span className="text-sm font-bold text-gray-500">
                        {card.suffix}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* kiri */}
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-8">
                <BookOpen
                  size={18}
                  className="text-[#025CB8]"
                />
                Rencana Pengembangan
              </h2>

              <div className="relative pl-3 sm:pl-4">
                <div className="absolute top-2 bottom-6 left-[19px] sm:left-[23px] w-[2px] bg-gray-100" />

                <div className="space-y-8 relative z-10">
                  {careerJourney.map((phase) => {
                    const phaseDone = phase.state === "done";
                    const phaseActive =
                      phase.state === "active";

                    const phaseLocked =
                      phase.state === "locked";

                    const badgeClass = phaseDone
                      ? "bg-green-100 text-green-700"
                      : phaseActive
                        ? "bg-blue-100 text-[#025CB8]"
                        : "bg-gray-100 text-gray-500";

                    const cardClass = phaseActive
                      ? "border-blue-200 bg-blue-50/30"
                      : "border-gray-100 bg-white";

                    return (
                      <div
                        key={phase.step}
                        className={`relative flex gap-4 sm:gap-6 ${phaseLocked ? "opacity-50" : ""
                          }`}
                      >
                        {/* icon bulat */}
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm
                            ${phaseDone
                              ? "bg-green-500 text-white"
                              : phaseActive
                                ? "bg-[#025CB8] text-white ring-4 ring-blue-100"
                                : "bg-gray-100 text-gray-400 border-2 border-white"
                            }`}
                        >
                          {phaseDone ? (
                            <CheckCircle2 size={20} />
                          ) : phaseLocked ? (
                            <Lock size={18} />
                          ) : (
                            phase.icon
                          )}
                        </div>

                        {/* isi card */}
                        <div
                          className={`flex-1 border rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow ${cardClass}`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="font-bold text-base text-gray-800">
                                  Tahap {phase.step}:{" "}
                                  {phase.title}
                                </h3>

                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}
                                >
                                  {phaseDone
                                    ? "Selesai"
                                    : phaseActive
                                      ? "Sedang Berjalan"
                                      : "Belum Dimulai"}
                                </span>
                              </div>

                              <p className="text-xs text-gray-500">
                                {phase.detail}
                              </p>
                            </div>

                            <span className="whitespace-nowrap flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1 text-[11px] font-semibold text-gray-400">
                              <Clock size={12} />
                              {phase.estimate}
                            </span>
                          </div>

                          {/* skill tag */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {phase.stack.map((tech) => (
                              <span
                                key={tech}
                                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold
                                  ${phaseDone
                                    ? "bg-white border-green-200 text-green-700"
                                    : phaseActive
                                      ? "bg-white border-blue-200 text-[#025CB8]"
                                      : "bg-gray-50 border-gray-200 text-gray-500"
                                  }`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {phaseDone && (
                            <div className="flex items-center gap-2 bg-green-50/50 rounded-xl p-2.5 text-xs font-semibold text-green-600">
                              <Trophy size={14} />
                              <span>
                                Sudah menyelesaikan{" "}
                                {phase.finishedCourse} kursus
                                di tahap ini.
                              </span>
                            </div>
                          )}

                          {phaseActive && (
                            <div className="mt-2 bg-white border border-blue-100 rounded-xl p-3 shadow-sm">
                              <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-gray-700">
                                  {phase.currentCourse}
                                </span>

                                <span className="text-[#025CB8]">
                                  {phase.progress}%
                                </span>
                              </div>

                              <SkillProgress
                                percent={phase.progress || 0}
                              />

                              <div className="mt-4 flex justify-end">
                                <button className="px-4 py-2 rounded-lg bg-[#025CB8] text-white text-xs font-bold shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95">
                                  Lanjutkan Belajar
                                </button>
                              </div>
                            </div>
                          )}

                          {phase.state === "next" && (
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-500">
                                <Award
                                  size={14}
                                  className="inline mr-1 mb-0.5"
                                />
                                {
                                  phase.suggestedCourse
                                }{" "}
                                kursus direkomendasikan
                              </span>

                              <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#025CB8] hover:bg-blue-50 transition">
                                Mulai Tahap Ini →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* kanan */}
            <aside className="w-full lg:w-[320px] space-y-6">
              {/* radar */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                  <LineChart
                    size={16}
                    className="text-[#025CB8]"
                  />
                  Peta Skill Kamu Saat Ini
                </h2>

                <div className="relative h-[220px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      data={skillRadar}
                    >
                      <PolarGrid stroke="#f3f4f6" />

                      <PolarAngleAxis
                        dataKey="label"
                        tick={{
                          fill: "#6b7280",
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      />

                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />

                      <Tooltip content={<RadarHint />} />

                      <Radar
                        name="Target"
                        dataKey="target"
                        stroke="#9ca3af"
                        fill="#f3f4f6"
                        fillOpacity={0.5}
                        strokeDasharray="3 3"
                      />

                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#025CB8"
                        fill="#62AAEA"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 flex items-center justify-center gap-4 text-[10px] font-semibold text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#62AAEA] opacity-80" />
                    <span>Saat Ini</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm border border-dashed border-gray-400 bg-gray-200" />
                    <span>Target Ideal</span>
                  </div>
                </div>
              </div>

              {/* rekomendasi */}
              <div
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5"
                style={{
                  background:
                    "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
                }}
              >
                <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                  <BrainCircuit
                    size={16}
                    className="text-purple-500"
                  />
                  Rekomendasi AI Selanjutnya
                </h2>

                <div className="space-y-3">
                  {aiSuggestions.map((tips, idx) => (
                    <div
                      key={tips}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>

                      <p className="text-xs leading-relaxed font-medium text-gray-600">
                        {tips}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full mt-5 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                  }}
                >
                  Buat Rencana Harian
                  <ArrowRight size={14} />
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RoadmapKarir;