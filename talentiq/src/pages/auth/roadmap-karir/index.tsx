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

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { getDashboardSummary, DashboardSummary } from "@/services/dashboard.service";

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
  const navigate = useNavigate();
  const [sidebarMini, setSidebarMini] = useState(false);

  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardSummary();
        setDashboardData(data);
      } catch (err: any) {
        console.error("[Roadmap] Error fetching:", err);
        setError("Gagal memuat peta karir. Pastikan server aktif.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const dreamRole = dashboardData?.targetRole || "Belum ditentukan";

  const careerJourney = useMemo(() => {
    if (!dashboardData?.roadmap || dashboardData.roadmap.length === 0) {
      return [];
    }
    return dashboardData.roadmap.map((step) => {
      let stack: string[] = [];
      let detail = "";
      let icon = <Database size={19} />;

      if (step.title.toLowerCase().includes("python")) {
        stack = ["Python Dasar", "Pandas", "NumPy"];
        detail = "Membangun pemahaman dasar tentang logika pemrograman dan manipulasi dataset.";
        icon = <FileCode2 size={19} />;
      } else if (step.title.toLowerCase().includes("sql")) {
        stack = ["SQL Dasar", "SQL Lanjutan", "Database"];
        detail = "Menguasai query database relational untuk ekstraksi data terstruktur.";
        icon = <Database size={19} />;
      } else if (step.title.toLowerCase().includes("visualisasi") || step.title.toLowerCase().includes("tableau") || step.title.toLowerCase().includes("bi")) {
        stack = ["Tableau", "Power BI", "Matplotlib"];
        detail = "Membuat dashboard interaktif dan menyampaikan insight secara visual.";
        icon = <LineChart size={19} />;
      } else if (step.title.toLowerCase().includes("machine learning") || step.title.toLowerCase().includes("ml")) {
        stack = ["Scikit-learn", "Regresi", "Klasifikasi"];
        detail = "Membangun model prediktif dasar untuk menyelesaikan masalah bisnis.";
        icon = <BrainCircuit size={19} />;
      } else {
        stack = ["General Skill"];
        detail = "Rencana pengembangan skill untuk menunjang karir Anda.";
      }

      let displayTitle = step.title;
      const match = step.title.match(/^(Minggu\s+\d+):\s*(.*)$/i);
      if (match) {
        displayTitle = match[2];
        displayTitle = displayTitle.charAt(0).toUpperCase() + displayTitle.slice(1);
      }

      return {
        step: step.order,
        title: displayTitle,
        state: step.status === "upcoming" ? "locked" : (step.status as any),
        estimate: step.status === "done" ? "Selesai" : step.duration,
        progress: step.progress,
        stack,
        detail,
        icon,
        currentCourse: step.status === "active" ? "Kursus Aktif" : undefined,
        finishedCourse: step.status === "done" ? 1 : 0,
        suggestedCourse: step.status === "next" ? 2 : 0,
      };
    });
  }, [dashboardData]);

  const skillRadar = useMemo(() => {
    const owned = dashboardData?.ownedSkills || [];
    const needed = dashboardData?.neededSkills || [];
    
    let radarOwned = owned;
    let radarNeeded = needed;
    
    if (owned.length > 4 && needed.length > 4) {
       radarOwned = owned.slice(0, 4);
       radarNeeded = needed.slice(0, 4);
    } else if (owned.length <= 4) {
       radarNeeded = needed.slice(0, 8 - owned.length);
    } else {
       radarOwned = owned.slice(0, 8 - needed.length);
    }
    
    // Gabungkan, pastikan minimal 3 skill untuk membentuk polygon radar
    let all = [...radarOwned, ...radarNeeded];
    if (all.length > 0 && all.length < 3) {
      // Jika kurang dari 3, pad dengan string kosong agar chart tetap tergambar
      while(all.length < 3) all.push(`Skill ${all.length + 1}`);
    }

    // Jika tidak ada data skill sama sekali, return null — akan ditampilkan empty state
    if (all.length === 0) return null;

    // Hitung mastery ratio berdasarkan jumlah skill yang dimiliki vs total
    const totalCount = Math.max(owned.length + needed.length, 1);
    const masteryPct = Math.round((owned.length / totalCount) * 100);
    // Clamp antara 10% - 90%
    const clampedMastery = Math.min(Math.max(masteryPct, 10), 90);
    const needGap = Math.max(10, clampedMastery - 35);

    return all.map((skill) => ({
      label: skill,
      current: owned.includes(skill) ? clampedMastery : needGap,
      target: 90,
      max: 100,
    }));
  }, [dashboardData]);

  const aiSuggestions = useMemo(() => {
    const needed = dashboardData?.neededSkills || [];
    if (needed.length === 0) {
      return [
        "Profil Anda sudah optimal! Mulai lamar pekerjaan di tab Cari Lowongan.",
        "Pertahankan konsistensi belajar Anda setiap hari.",
      ];
    }
    return [
      `Fokus mempelajari skill prioritas: ${needed[0]}.`,
      needed[1] ? `Pelajari dasar-dasar ${needed[1]} untuk menunjang pengerjaan proyek.` : "Buat proyek portofolio sederhana menggunakan dataset publik.",
      "Tingkatkan skor kesiapan kerja Anda dengan menyelesaikan kursus rekomendasi.",
    ];
  }, [dashboardData]);

  const roadmapSummary = useMemo(() => {
    const doneCount = careerJourney.filter(({ state }) => state === "done").length;
    const activeCount = careerJourney.filter(({ state }) => state === "active").length;

    // Hitung estimasi sisa waktu dari step yang belum done
    const remainingWeeks = careerJourney
      .filter(({ state }) => state !== "done")
      .reduce((acc, step) => {
        const match = step.estimate.match(/(\d+)/);
        return acc + (match ? parseInt(match[1]) : 0);
      }, 0);
    const remainingMonths = remainingWeeks > 0
      ? `${Math.ceil(remainingWeeks / 4)}`
      : "0";

    return {
      total: careerJourney.length,
      done: doneCount,
      active: activeCount,
      remainingMonths,
    };
  }, [careerJourney]);

  const layoutShift = sidebarMini ? "lg:ml-[90px]" : "lg:ml-[260px]";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar collapsed={sidebarMini} setCollapsed={setSidebarMini} />
        <main className={`pb-24 lg:pb-10 transition-all duration-300 ${layoutShift}`}>
          <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-[#025CB8] mb-4" size={48} />
            <p className="text-gray-500 font-semibold animate-pulse">Memuat analisis peta jalan karir AI Anda...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar collapsed={sidebarMini} setCollapsed={setSidebarMini} />
        <main className={`pb-24 lg:pb-10 transition-all duration-300 ${layoutShift}`}>
          <div className="min-h-[80vh] flex flex-col justify-center items-center p-6 text-center">
            <div className="bg-red-50 text-red-500 px-6 py-4 rounded-2xl border border-red-200 max-w-md shadow-sm">
              <h3 className="font-bold text-lg mb-2">Terjadi Kesalahan</h3>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#025CB8] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                  {dreamRole}
                </span>
                {" · "}
                Estimasi:{" "}
                <span className="font-semibold text-gray-600">
                  {roadmapSummary.remainingMonths
                    ? `${roadmapSummary.remainingMonths} bulan lagi`
                    : "Selesai! 🎉"}
                </span>
              </p>
            </div>

            <button
              onClick={() => navigate("/profil")}
              className="self-start sm:self-auto px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#025CB8] hover:border-blue-200 transition"
            >
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
                value: roadmapSummary.remainingMonths || "0",
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
                {careerJourney.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}
                    >
                      <BookOpen size={28} className="text-[#025CB8] opacity-50" />
                    </div>
                    <p className="text-sm font-bold text-gray-500 mb-1">
                      Roadmap belum terbentuk
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed mb-5 max-w-xs">
                      Upload CV atau isi data skill-mu agar AI bisa membuatkan rencana pengembangan yang personal
                    </p>
                    <button
                      onClick={() => navigate("/auth/user-analisis-skill")}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #025CB8, #000000)" }}
                    >
                      Mulai Analisis CV →
                    </button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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

                {skillRadar === null ? (
                  /* Empty state — belum ada data skill */
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}
                    >
                      <LineChart size={26} className="text-[#025CB8] opacity-50" />
                    </div>
                    <p className="text-sm font-bold text-gray-500 mb-1">
                      Belum ada data skill
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      Upload CV atau isi skill kamu dulu
                      agar peta skill bisa terbentuk
                    </p>
                    <button
                      onClick={() => navigate("/auth/user-analisis-skill")}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #025CB8, #000000)" }}
                    >
                      Upload CV Sekarang →
                    </button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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