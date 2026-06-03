// src/pages/auth/roadmap-karir/index.tsx

import {
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  GraduationCap,
  LineChart,
  Loader2,
  PlayCircle,
  Plus,
  Star,
  Target,
  Trophy,
  X,
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
import {
  getMyCoursesService,
  getRecommendationsService,
  enrollCourseService,
  dailyCheckinService,
  getCheckinHistoryService,
  UserCourse,
  DailyCheckinLog,
} from "@/services/course.service";
import { getProfileService, UserWithProfile } from "@/services/profile.service";

// ── Warna kursus berdasarkan index ───────────────────────────────────────────
const courseAccents = ["#025CB8", "#7C3AED", "#059669", "#EF4444", "#F59E0B", "#8B5CF6"];

// ── Mini components ───────────────────────────────────────────────────────────
const ProgressLine = ({
  percentage,
  accent = "#025CB8",
}: {
  percentage: number;
  accent?: string;
}) => (
  <div className="w-full h-2 overflow-hidden rounded-full bg-gray-100">
    <div
      className="h-full rounded-full transition-all duration-500"
      style={{ width: `${percentage}%`, background: accent }}
    />
  </div>
);

const RadarHint = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const skillInfo = payload?.[0]?.payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-gray-800 mb-1">{skillInfo.label}</p>
      <p className="text-[#025CB8] font-medium">Skill sekarang: {payload?.[0]?.value}%</p>
      <p className="text-gray-400 mt-1">Target: {payload?.[1]?.value}%</p>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const RoadmapKarir = () => {
  const navigate = useNavigate();
  const [sidebarMini, setSidebarMini] = useState(false);
  const [currentTab, setCurrentTab] = useState<"roadmap" | "kursus">("roadmap");
  const [roadmapMode, setRoadmapMode] = useState<"ai" | "mandiri">("ai");
  const [allRecommendations, setAllRecommendations] = useState<any[]>([]);

  // ── Dashboard data ─────────────────────────────────────────────────────────
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Kursus user ────────────────────────────────────────────────────────────
  const [myCoursesList, setMyCoursesList] = useState<UserCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // ── Profile data ───────────────────────────────────────────────────────────
  const [profileDetail, setProfileDetail] = useState<UserWithProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ── Rekomendasi ────────────────────────────────────────────────────────────
  const [recommendedCourseList, setRecommendedCourseList] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [enrollMessage, setEnrollMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ── Daily Check-in modal ───────────────────────────────────────────────────
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<UserCourse | null>(null);
  const [checkinProgress, setCheckinProgress] = useState(0);
  const [checkinHours, setCheckinHours] = useState(1);
  const [checkinNote, setCheckinNote] = useState("");
  const [checkinHistory, setCheckinHistory] = useState<DailyCheckinLog[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [isSubmittingCheckin, setIsSubmittingCheckin] = useState(false);

  // ── Complete modal ─────────────────────────────────────────────────────────
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [courseToComplete, setCourseToComplete] = useState<UserCourse | null>(null);
  const [isCompletingCourse, setIsCompletingCourse] = useState(false);

  // ── Fetch functions ────────────────────────────────────────────────────────
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await getProfileService();
      setProfileDetail(res.user);
    } catch (err) {
      console.error("[Roadmap] Error fetching profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary();
      setDashboardData(data);
    } catch (err: any) {
      console.error("[Roadmap] Error fetching dashboard:", err);
      setError("Gagal memuat peta karir. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCourses = async () => {
    try {
      setLoadingCourses(true);
      const courses = await getMyCoursesService();
      setMyCoursesList(courses || []);
    } catch (err) {
      console.error("[Roadmap] Error fetching my courses:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchRecommendations = async (enrolledCourseIds: Set<number>) => {
    try {
      setLoadingRecs(true);
      const recsRes = await getRecommendationsService().catch(() => null);
      if (recsRes) {
        const mappedAll = (recsRes.recommendations || []).map((rec: any) => {
          const matched = rec.matchedSkills || [];
          const taught = rec.course?.skills_taught
            ? rec.course.skills_taught.split(",").map((s: string) => s.trim())
            : [];
          const uniqueSkills = Array.from(new Set([...matched, ...taught])).filter(Boolean);
          return {
            id: rec.course?.id || rec.courseId,
            title: rec.course?.course_name || "Kursus Rekomendasi",
            platform: rec.course?.platform || "Online",
            category: rec.course?.category || "General",
            badge: "Direkomendasikan AI",
            reason: rec.reason || "",
            level: rec.course?.level || "Beginner",
            skills: uniqueSkills,
            url: rec.course?.url,
          };
        });
        setAllRecommendations(mappedAll);

        const filtered = mappedAll.filter((r) => !enrolledCourseIds.has(r.id));
        setRecommendedCourseList(filtered);
      }
    } catch (err) {
      console.error("[Roadmap] Error fetching recommendations:", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchDashboard(), fetchMyCourses(), fetchProfile()]);
    };
    init();
  }, []);

  useEffect(() => {
    if (!loadingCourses) {
      const enrolledIds = new Set<number>(
        myCoursesList.map((c) => c.courseId || c.id)
      );
      fetchRecommendations(enrolledIds);
    }
  }, [loadingCourses]);

  // ── Derived lists ──────────────────────────────────────────────────────────
  const activeCourseList = useMemo(
    () => myCoursesList.filter((c) => c.status === "active"),
    [myCoursesList]
  );

  const completedCourseList = useMemo(
    () => myCoursesList.filter((c) => c.status === "completed"),
    [myCoursesList]
  );

  const getLevelWeight = (lvl?: string | null) => {
    if (!lvl) return 1;
    const key = lvl.toLowerCase().trim();
    if (key.includes("begin") || key.includes("pemula") || key.includes("dasar") || key.includes("basic") || key.includes("start")) return 1;
    if (key.includes("inter") || key.includes("menengah") || key.includes("medium")) return 2;
    if (key.includes("adv") || key.includes("mahir") || key.includes("lanjut") || key.includes("expert") || key.includes("specialist")) return 3;
    return 1;
  };

  // Sorted: level terendah ke tertinggi (Beginner -> Intermediate -> Advanced)
  const sortedCourseList = useMemo(() => {
    return [...myCoursesList].sort((a, b) => {
      const wA = getLevelWeight(a.level);
      const wB = getLevelWeight(b.level);
      if (wA !== wB) return wA - wB;

      // Sub-sort: active dulu, baru completed
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;

      // Sub-sort: lastAccessed terbaru di depan
      return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
    });
  }, [myCoursesList]);

  // AI Roadmap sorted by level (AI mode)
  const sortedAiRoadmapList = useMemo(() => {
    return [...allRecommendations].sort((a, b) => {
      const wA = getLevelWeight(a.level);
      const wB = getLevelWeight(b.level);
      return wA - wB;
    });
  }, [allRecommendations]);

  const matchedAiRoadmap = useMemo(() => {
    return sortedAiRoadmapList.map((rec) => {
      const enrollment = myCoursesList.find((uc) => uc.courseId === rec.id);
      return {
        ...rec,
        enrollment,
      };
    });
  }, [sortedAiRoadmapList, myCoursesList]);

  // ── Skill radar ────────────────────────────────────────────────────────────
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
    let all = [...radarOwned, ...radarNeeded];
    if (all.length > 0 && all.length < 3) {
      while (all.length < 3) all.push(`Skill ${all.length + 1}`);
    }
    if (all.length === 0) return null;
    const totalCount = Math.max(owned.length + needed.length, 1);
    const masteryPct = Math.round((owned.length / totalCount) * 100);
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
      needed[1]
        ? `Pelajari dasar-dasar ${needed[1]} untuk menunjang pengerjaan proyek.`
        : "Buat proyek portofolio sederhana menggunakan dataset publik.",
      "Tingkatkan skor kesiapan kerja Anda dengan menyelesaikan kursus rekomendasi.",
    ];
  }, [dashboardData]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleEnroll = async (courseId: number) => {
    try {
      setEnrollingId(courseId);
      await enrollCourseService(courseId);
      setEnrollMessage({ type: "success", text: "Berhasil mendaftar! Lihat di Tab Roadmap." });
      setTimeout(() => setEnrollMessage(null), 6000);
      await Promise.all([fetchMyCourses(), fetchProfile()]);
    } catch (err: any) {
      setEnrollMessage({
        type: "error",
        text: err?.response?.data?.message || "Gagal mendaftar ke kursus.",
      });
      setTimeout(() => setEnrollMessage(null), 6000);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleOpenCheckinModal = async (course: UserCourse) => {
    const hasCheckedInToday = course.recentCheckins?.some((ci) => {
      return new Date(ci.date).toDateString() === new Date().toDateString();
    });
    if (hasCheckedInToday) {
      alert("Kamu sudah check-in hari ini. Kembali besok ya! 🎯");
      return;
    }
    setSelectedCourse(course);
    setCheckinProgress(course.progress);
    setCheckinHours(1);
    setCheckinNote("");
    setCheckinHistory([]);
    setIsCheckinModalOpen(true);
    try {
      setIsFetchingHistory(true);
      const res = await getCheckinHistoryService(course.id);
      setCheckinHistory(res.checkins || []);
    } catch (err) {
      console.error("Gagal mengambil riwayat check-in:", err);
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const handleSubmitCheckin = async () => {
    if (!selectedCourse) return;
    try {
      setIsSubmittingCheckin(true);
      await dailyCheckinService({
        userCourseId: selectedCourse.id,
        progress: checkinProgress,
        note: checkinNote,
        hoursSpent: parseFloat(checkinHours.toString()) || 0,
      });
      await Promise.all([fetchMyCourses(), fetchProfile()]);
      setIsCheckinModalOpen(false);
      setSelectedCourse(null);
    } catch (err: any) {
      console.error("Check-in error:", err);
      alert(err?.response?.data?.message || "Gagal melakukan check-in.");
    } finally {
      setIsSubmittingCheckin(false);
    }
  };

  const handleOpenCompleteModal = (course: UserCourse) => {
    setCourseToComplete(course);
    setIsCompleteModalOpen(true);
  };

  const handleConfirmComplete = async () => {
    if (!courseToComplete) return;
    try {
      setIsCompletingCourse(true);
      await dailyCheckinService({
        userCourseId: courseToComplete.id,
        progress: 100,
        note: "Menyelesaikan kursus",
        hoursSpent: 1,
      });
      await Promise.all([fetchMyCourses(), fetchProfile()]);
      setIsCompleteModalOpen(false);
      setCourseToComplete(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menyelesaikan kursus.");
    } finally {
      setIsCompletingCourse(false);
    }
  };

  const layoutShift = sidebarMini ? "lg:ml-[90px]" : "lg:ml-[260px]";
  const dreamRole = dashboardData?.targetRole || "Belum ditentukan";
  const isStatsLoading = loadingCourses || loadingProfile;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar collapsed={sidebarMini} setCollapsed={setSidebarMini} />
        <main className={`pb-24 lg:pb-10 transition-all duration-300 ${layoutShift}`}>
          <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-[#025CB8] mb-4" size={48} />
            <p className="text-gray-500 font-semibold animate-pulse">
              Memuat roadmap karir...
            </p>
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

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar collapsed={sidebarMini} setCollapsed={setSidebarMini} />

      <main className={`pb-24 lg:pb-10 transition-all duration-300 ${layoutShift}`}>
        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-md px-5 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Compass size={20} className="text-[#025CB8]" />
                Roadmap Karir &amp; Kursus
              </h1>
              <p className="mt-0.5 text-sm text-gray-400">
                Target:{" "}
                <span className="font-semibold text-gray-600">{dreamRole}</span>
              </p>
            </div>

            {/* Tab Switch */}
            <div className="flex self-start rounded-xl bg-gray-100 p-1 sm:self-auto">
              {(["roadmap", "kursus"] as const).map((tabName) => {
                const isActive = currentTab === tabName;
                return (
                  <button
                    key={tabName}
                    onClick={() => setCurrentTab(tabName)}
                    className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-[#025CB8] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tabName === "roadmap" ? "Roadmap" : "Kursus"}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════════════
            TAB 1: ROADMAP
        ═══════════════════════════════════════════════════════════════════════ */}
        {currentTab === "roadmap" && (
          <section className="max-w-6xl mx-auto px-5 lg:px-8 pt-6 space-y-6">
            {/* Quick stats ── Kursus Aktif, Selesai, Total Jam, Streak */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  title: "Kursus Aktif",
                  value: activeCourseList.length,
                  icon: <PlayCircle size={20} className="text-[#025CB8]" />,
                  box: "bg-blue-50",
                  isLoading: isStatsLoading,
                },
                {
                  title: "Selesai",
                  value: completedCourseList.length,
                  icon: <Award size={20} className="text-green-600" />,
                  box: "bg-green-50",
                  isLoading: isStatsLoading,
                },
                {
                  title: "Total Jam",
                  value: `${profileDetail?.profile?.totalHours ?? 0}j`,
                  icon: <Clock size={20} className="text-purple-600" />,
                  box: "bg-purple-50",
                  isLoading: isStatsLoading,
                },
                {
                  title: "Streak",
                  value: `${profileDetail?.profile?.streakDays ?? 0}h 🔥`,
                  icon: <Flame size={20} className="text-orange-500" />,
                  box: "bg-orange-50",
                  isLoading: isStatsLoading,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 transition-all duration-300 ${
                    card.isLoading ? "blur-[2px] opacity-60 pointer-events-none select-none animate-pulse" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.box}`}
                  >
                    {card.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-400 truncate">
                      {card.title}
                    </p>
                    <p className="text-base leading-tight font-black text-gray-800 truncate mt-0.5">
                      {card.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Rencana Pengembangan + Sidebar ─────────────────────────── */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Rencana Pengembangan — dari myCoursesList / allRecommendations */}
              <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
                    <BookOpen size={18} className="text-[#025CB8]" />
                    {roadmapMode === "ai" ? "Roadmap Karir (Rekomendasi AI)" : "Roadmap Belajar Mandiri"}
                  </h2>

                  {/* Toggle Switch */}
                  <div className="flex rounded-xl bg-gray-100 p-1 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setRoadmapMode("ai")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                        roadmapMode === "ai"
                          ? "bg-white text-[#025CB8] shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      🤖 Rekomendasi AI
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoadmapMode("mandiri")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                        roadmapMode === "mandiri"
                          ? "bg-white text-[#025CB8] shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      👤 Mandiri (Pilih Sendiri)
                    </button>
                  </div>
                </div>

                {/* Enroll alert di Roadmap */}
                {enrollMessage && (
                  <div
                    className={`mb-4 flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${
                      enrollMessage.type === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {enrollMessage.type === "success" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <X size={16} />
                      )}
                      {enrollMessage.text}
                    </span>
                    <button
                      onClick={() => setEnrollMessage(null)}
                      className="shrink-0 hover:opacity-70"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="relative pl-3 sm:pl-4">
                  {/* Loading */}
                  {loadingCourses || (roadmapMode === "ai" && loadingRecs) ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex gap-4 animate-pulse">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                          <div className="flex-1 border border-gray-100 rounded-2xl p-5 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="h-2 bg-gray-100 rounded w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {roadmapMode === "ai" ? (
                        matchedAiRoadmap.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                              style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}
                            >
                              <BrainCircuit size={28} className="text-[#025CB8] opacity-50 animate-pulse" />
                            </div>
                            <p className="text-sm font-bold text-gray-500 mb-1">
                              Roadmap AI belum terbentuk
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed mb-5 max-w-xs">
                              Unggah CV kamu atau isi analisis skill untuk membuat roadmap otomatis dari AI.
                            </p>
                            <button
                              onClick={() => navigate("/auth/user-analisis-skill")}
                              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                              style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                            >
                              Mulai Analisis Skill &amp; CV →
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-6 relative z-10">
                            {matchedAiRoadmap.map((item, idx) => {
                              const course = item.enrollment;
                              const isEnrolled = !!course;
                              const isActive = isEnrolled && course.status === "active";
                              const isDone = isEnrolled && course.status === "completed";
                              const courseUrl = course?.url || item.url;

                              const hasCheckedInToday = isEnrolled && course.recentCheckins?.some(
                                (ci: any) => new Date(ci.date).toDateString() === new Date().toDateString()
                              );

                              const badgeClass = isDone
                                ? "bg-green-100 text-green-700"
                                : isActive
                                ? "bg-blue-100 text-[#025CB8]"
                                : "bg-purple-100 text-purple-700";

                              const cardClass = isActive
                                ? "border-blue-200 bg-blue-50/20"
                                : isDone
                                ? "border-green-200 bg-green-50/10"
                                : "border-dashed border-gray-200 bg-white hover:border-blue-300";

                              const totalHoursSpent = isEnrolled
                                ? (course.recentCheckins?.reduce(
                                    (sum: number, ci: any) => sum + (parseFloat(String(ci.hoursSpent)) || 0),
                                    0
                                  ) || 0)
                                : 0;

                              const accent = courseAccents[idx % courseAccents.length];

                              return (
                                <div key={item.id} className="relative flex gap-4 sm:gap-5 items-stretch">
                                  <div className="relative w-9 sm:w-10 flex-shrink-0 flex flex-col items-center z-10">
                                    {idx === 0 ? (
                                      <div className="absolute top-[18px] sm:top-[20px] bottom-[-24px] w-[2px] bg-gray-100 -z-10" />
                                    ) : (
                                      <div className="absolute top-0 bottom-[-24px] w-[2px] bg-gray-100 -z-10" />
                                    )}
                                    <div
                                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm text-white flex-shrink-0 ${
                                        isDone
                                          ? "bg-green-500"
                                          : isActive
                                          ? "bg-[#025CB8] ring-4 ring-blue-100"
                                          : "bg-purple-500 ring-4 ring-purple-100"
                                      }`}
                                    >
                                      {isDone ? (
                                        <CheckCircle2 size={18} />
                                      ) : (
                                        <span className="text-sm font-black">{idx + 1}</span>
                                      )}
                                    </div>
                                  </div>

                                  <div className={`flex-1 border rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow ${cardClass}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                                            {isDone ? "✓ Selesai" : isActive ? "Sedang Berjalan" : "Rekomendasi AI"}
                                          </span>
                                          {isActive && hasCheckedInToday && (
                                            <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
                                              Check-in Hari Ini ✓
                                            </span>
                                          )}
                                        </div>
                                        <h3 className="font-bold text-sm text-gray-800 leading-snug line-clamp-2" title={item.title || item.courseName}>
                                          {courseUrl ? (
                                            <a href={courseUrl} target="_blank" rel="noreferrer" className="hover:text-[#025CB8] hover:underline transition-colors">
                                              {item.title || item.courseName}
                                            </a>
                                          ) : (
                                            item.title || item.courseName
                                          )}
                                        </h3>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                          {item.platform}
                                        </span>
                                        {item.level && (
                                          <span className="text-[9px] font-bold text-[#025CB8] bg-blue-50 border border-blue-100 px-1.5 py-1 rounded-md uppercase tracking-wider">
                                            {item.level}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {item.skills && item.skills.length > 0 && (
                                      <div className="mb-3 flex flex-wrap gap-1.5">
                                        {item.skills.slice(0, 3).map((skill: string) => (
                                          <span key={skill} className="bg-gray-100 text-gray-600 border border-gray-200/50 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                            {skill}
                                          </span>
                                        ))}
                                        {item.skills.length > 3 && (
                                          <span className="bg-gray-50 text-gray-400 border border-gray-200/30 rounded-lg px-2 py-0.5 text-[9px] font-bold">
                                            +{item.skills.length - 3} lagi
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {!isEnrolled && item.reason && (
                                      <p className="text-xs text-purple-600 font-medium bg-purple-50/50 border border-purple-100 rounded-xl p-2.5 mb-4 italic">
                                        ✨ AI: {item.reason}
                                      </p>
                                    )}

                                    {isActive && course && (
                                      <div className="mb-3">
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                          <span className="text-gray-500">Progress Belajar</span>
                                          <span style={{ color: accent }}>{course.progress}%</span>
                                        </div>
                                        <ProgressLine percentage={course.progress} accent={accent} />
                                        <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                                          <Clock size={9} />
                                          {hasCheckedInToday ? `Check-in hari ini · ${course.progress}% selesai` : `Progress terkini · ${course.progress}% selesai`}
                                        </p>
                                      </div>
                                    )}

                                    {isDone && (
                                      <div className="mb-3 flex items-center gap-2 bg-green-50 rounded-xl p-2.5 text-xs font-semibold text-green-700">
                                        <Trophy size={14} />
                                        <span>🎉 Selesai dalam {Number(totalHoursSpent.toFixed(1))} jam belajar</span>
                                      </div>
                                    )}

                                    {isActive && course && (
                                      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 mt-1 flex-wrap">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenCompleteModal(course)}
                                          className="px-3 py-2 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                                        >
                                          Tandai Selesai ✓
                                        </button>

                                        <button
                                          type="button"
                                          disabled={hasCheckedInToday}
                                          onClick={() => handleOpenCheckinModal(course)}
                                          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 ${
                                            hasCheckedInToday ? "bg-gray-300 cursor-not-allowed hover:translate-y-0" : "hover:opacity-90"
                                          }`}
                                          style={hasCheckedInToday ? undefined : { background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                                        >
                                          {hasCheckedInToday ? "Sudah check-in ✓" : "Check-in Progress"}
                                          {!hasCheckedInToday && <ArrowRight size={12} />}
                                        </button>
                                      </div>
                                    )}

                                    {!isEnrolled && (
                                      <div className="flex justify-end border-t border-gray-100 pt-3 mt-1">
                                        <button
                                          type="button"
                                          disabled={enrollingId === item.id}
                                          onClick={() => handleEnroll(item.id)}
                                          style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                                          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                          {enrollingId === item.id ? (
                                            <>
                                              <Loader2 size={12} className="animate-spin" />
                                              Mendaftar...
                                            </>
                                          ) : (
                                            <>
                                              <span>Daftar Kursus</span>
                                              <ArrowRight size={12} />
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Footer promo for AI roadmap */}
                            <div className="relative flex gap-4 sm:gap-5 items-stretch">
                              <div className="relative w-9 sm:w-10 flex-shrink-0 flex flex-col items-center z-10">
                                <div className="absolute top-0 h-[18px] sm:h-[20px] w-[2px] bg-gray-100 -z-10" />
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-purple-50 text-purple-600 ring-4 ring-purple-100 border border-purple-200 flex-shrink-0">
                                  <Award size={18} />
                                </div>
                              </div>

                              <div className="flex-1 border border-dashed border-purple-200 bg-purple-50/10 rounded-2xl p-4 sm:p-5">
                                <h3 className="font-bold text-sm text-gray-800 leading-snug">
                                  Selesaikan Peta Belajarmu! 🏆
                                </h3>
                                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                                  AI telah menyusun kurikulum di atas untuk membantumu menguasai profesi target: <span className="font-bold text-gray-600">{dreamRole}</span>. Selesaikan semua tahapan ini untuk mencapai kesiapan karir optimal.
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        sortedCourseList.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                              style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}
                            >
                              <BookOpen size={28} className="text-[#025CB8] opacity-50" />
                            </div>
                            <p className="text-sm font-bold text-gray-500 mb-1">
                              Belum ada kursus mandiri yang diikuti
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed mb-5 max-w-xs">
                              Pilih dan daftar kursus satu persatu secara manual dari menu Kursus untuk memulai belajar mandiri.
                            </p>
                            <button
                              onClick={() => setCurrentTab("kursus")}
                              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                              style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                            >
                              Cari &amp; Daftar Kursus →
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-6 relative z-10">
                            {sortedCourseList.map((course, idx) => {
                              const isActive = course.status === "active";
                              const isDone = course.status === "completed";

                              const hasCheckedInToday = course.recentCheckins?.some(
                                (ci) => new Date(ci.date).toDateString() === new Date().toDateString()
                              );

                              const badgeClass = isDone
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-[#025CB8]";

                              const cardClass = isActive
                                ? "border-blue-200 bg-blue-50/20"
                                : isDone
                                ? "border-green-200 bg-green-50/10"
                                : "border-gray-100 bg-white";

                              const totalHoursSpent =
                                course.recentCheckins?.reduce(
                                  (sum, ci) => sum + (parseFloat(String(ci.hoursSpent)) || 0),
                                  0
                                ) || 0;

                              const accent = courseAccents[idx % courseAccents.length];

                              return (
                                <div key={course.id} className="relative flex gap-4 sm:gap-5 items-stretch">
                                  <div className="relative w-9 sm:w-10 flex-shrink-0 flex flex-col items-center z-10">
                                    {idx === 0 ? (
                                      <div className="absolute top-[18px] sm:top-[20px] bottom-[-24px] w-[2px] bg-gray-100 -z-10" />
                                    ) : (
                                      <div className="absolute top-0 bottom-[-24px] w-[2px] bg-gray-100 -z-10" />
                                    )}
                                    <div
                                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm text-white flex-shrink-0 ${
                                        isDone
                                          ? "bg-green-500"
                                          : "bg-[#025CB8] ring-4 ring-blue-100"
                                      }`}
                                    >
                                      {isDone ? (
                                        <CheckCircle2 size={18} />
                                      ) : (
                                        <span className="text-sm font-black">{idx + 1}</span>
                                      )}
                                    </div>
                                  </div>

                                  <div className={`flex-1 border rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow ${cardClass}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                                            {isDone ? "✓ Selesai" : "Sedang Berjalan"}
                                          </span>
                                          {isActive && hasCheckedInToday && (
                                            <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
                                              Check-in Hari Ini ✓
                                            </span>
                                          )}
                                        </div>
                                        <h3 className="font-bold text-sm text-gray-800 leading-snug line-clamp-2" title={course.courseName}>
                                          {course.url ? (
                                            <a href={course.url} target="_blank" rel="noreferrer" className="hover:text-[#025CB8] hover:underline transition-colors">
                                              {course.courseName}
                                            </a>
                                          ) : (
                                            course.courseName
                                          )}
                                        </h3>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                          {course.platform}
                                        </span>
                                        {course.level && (
                                          <span className="text-[9px] font-bold text-[#025CB8] bg-blue-50 border border-blue-100 px-1.5 py-1 rounded-md uppercase tracking-wider">
                                            {course.level}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {course.skills && course.skills.length > 0 && (
                                      <div className="mb-3 flex flex-wrap gap-1.5">
                                        {course.skills.slice(0, 3).map((skill) => (
                                          <span key={skill} className="bg-gray-100 text-gray-600 border border-gray-200/50 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                            {skill}
                                          </span>
                                        ))}
                                        {course.skills.length > 3 && (
                                          <span className="bg-gray-50 text-gray-400 border border-gray-200/30 rounded-lg px-2 py-0.5 text-[9px] font-bold">
                                            +{course.skills.length - 3} lagi
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {isActive && (
                                      <div className="mb-3">
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                          <span className="text-gray-500">Progress Belajar</span>
                                          <span style={{ color: accent }}>{course.progress}%</span>
                                        </div>
                                        <ProgressLine percentage={course.progress} accent={accent} />
                                        <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                                          <Clock size={9} />
                                          {hasCheckedInToday ? `Check-in hari ini · ${course.progress}% selesai` : `Progress terkini · ${course.progress}% selesai`}
                                        </p>
                                      </div>
                                    )}

                                    {isDone && (
                                      <div className="mb-3 flex items-center gap-2 bg-green-50 rounded-xl p-2.5 text-xs font-semibold text-green-700">
                                        <Trophy size={14} />
                                        <span>🎉 Selesai dalam {Number(totalHoursSpent.toFixed(1))} jam belajar</span>
                                      </div>
                                    )}

                                    {isActive && (
                                      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 mt-1 flex-wrap">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenCompleteModal(course)}
                                          className="px-3 py-2 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                                        >
                                          Tandai Selesai ✓
                                        </button>

                                        <button
                                          type="button"
                                          disabled={hasCheckedInToday}
                                          onClick={() => handleOpenCheckinModal(course)}
                                          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 ${
                                            hasCheckedInToday ? "bg-gray-300 cursor-not-allowed hover:translate-y-0" : "hover:opacity-90"
                                          }`}
                                          style={hasCheckedInToday ? undefined : { background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                                        >
                                          {hasCheckedInToday ? "Sudah check-in ✓" : "Check-in Progress"}
                                          {!hasCheckedInToday && <ArrowRight size={12} />}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Card promo penambahan kursus baru mandiri */}
                            <div className="relative flex gap-4 sm:gap-5 items-stretch">
                              <div className="relative w-9 sm:w-10 flex-shrink-0 flex flex-col items-center z-10">
                                <div className="absolute top-0 h-[18px] sm:h-[20px] w-[2px] bg-gray-100 -z-10" />
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-blue-50 text-[#025CB8] ring-4 ring-blue-100 border border-blue-200 flex-shrink-0">
                                  <Plus size={18} />
                                </div>
                              </div>

                              <div className="flex-1 border border-dashed border-blue-200 bg-blue-50/10 rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
                                <div>
                                  <h3 className="font-bold text-sm text-gray-800 leading-snug">
                                    Tingkatkan Skill Karirmu Mandiri 🚀
                                  </h3>
                                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                                    Ingin menguasai skill tambahan untuk mempercepat kesiapan kerjamu? 
                                    Temukan rekomendasi kursus AI terbaik yang sesuai dengan target karirmu.
                                  </p>
                                </div>
                                <div className="mt-4 flex justify-start">
                                  <button
                                    onClick={() => setCurrentTab("kursus")}
                                    className="px-4 py-2 bg-[#025CB8] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                                  >
                                    <span>Tambah Kursus Baru</span>
                                    <ArrowRight size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar kanan */}
              <aside className="w-full lg:w-[300px] space-y-6">
                {/* Target Karir Card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Target size={20} className="text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Target Karir
                    </p>
                    <p className="text-sm font-black text-gray-800 mt-0.5 truncate" title={dreamRole}>
                      {dreamRole}
                    </p>
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                    <LineChart size={16} className="text-[#025CB8]" />
                    Peta Skill Kamu Saat Ini
                  </h2>

                  {skillRadar === null ? (
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
                        Upload CV agar peta skill bisa terbentuk
                      </p>
                      <button
                        onClick={() => navigate("/auth/user-analisis-skill")}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #025CB8, #000000)" }}
                      >
                        Upload CV →
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillRadar}>
                            <PolarGrid stroke="#f3f4f6" />
                            <PolarAngleAxis
                              dataKey="label"
                              tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 600 }}
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

                {/* AI Suggestions */}
                <div
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5"
                  style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)" }}
                >
                  <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                    <BrainCircuit size={16} className="text-purple-500" />
                    Rekomendasi AI Selanjutnya
                  </h2>

                  <div className="space-y-3">
                    {aiSuggestions.map((tips, idx) => (
                      <div key={tips} className="flex items-start gap-3">
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
                    onClick={() => setCurrentTab("kursus")}
                    className="w-full mt-5 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}
                  >
                    Lihat Kursus Rekomendasi
                    <ArrowRight size={14} />
                  </button>
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 2: KURSUS
        ═══════════════════════════════════════════════════════════════════════ */}
        {currentTab === "kursus" && (
          <section className="max-w-5xl mx-auto px-5 lg:px-8 pt-6 space-y-8">
            {/* ── Kursus Rekomendasi ─────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
                  <Star size={18} className="text-amber-500 fill-amber-500" />
                  Kursus Rekomendasi AI
                </h2>
                <p className="text-xs text-gray-400">Berdasarkan skill gap kamu</p>
              </div>

              {/* Enroll alert */}
              {enrollMessage && (
                <div
                  className={`mb-4 flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${
                    enrollMessage.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {enrollMessage.type === "success" ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <X size={16} />
                    )}
                    {enrollMessage.text}
                  </span>
                  <button
                    onClick={() => setEnrollMessage(null)}
                    className="shrink-0 hover:opacity-70"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {loadingRecs ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-12 shadow-sm min-h-[200px]">
                  <Loader2 size={36} className="animate-spin text-[#025CB8] mb-3" />
                  <p className="text-sm font-semibold text-gray-500 animate-pulse">
                    Memuat rekomendasi AI...
                  </p>
                </div>
              ) : recommendedCourseList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                  <Star size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-semibold text-gray-400">
                    Belum ada rekomendasi
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Upload CV agar AI bisa merekomendasikan kursus untukmu.
                  </p>
                  <button
                    onClick={() => navigate("/auth/user-analisis-skill")}
                    className="mt-4 px-5 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                  >
                    Upload CV Sekarang →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {recommendedCourseList.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[220px]"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              {course.category}
                            </span>
                            <h3
                              className="font-bold text-sm text-gray-800 leading-snug line-clamp-2 mt-0.5"
                              title={course.title}
                            >
                              {course.url ? (
                                <a
                                  href={course.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:text-[#025CB8] hover:underline transition-colors"
                                >
                                  {course.title}
                                </a>
                              ) : (
                                course.title
                              )}
                            </h3>
                          </div>
                          {course.badge && (
                            <span className="shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700">
                              {course.badge}
                            </span>
                          )}
                        </div>

                        {course.skills && course.skills.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {course.skills.slice(0, 3).map((skill: string) => (
                              <span
                                key={skill}
                                className="bg-gray-100 text-gray-600 border border-gray-200/50 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                              >
                                {skill}
                              </span>
                            ))}
                            {course.skills.length > 3 && (
                              <span className="bg-gray-50 text-gray-400 border border-gray-200/30 rounded-lg px-2 py-0.5 text-[9px] font-bold">
                                +{course.skills.length - 3} lagi
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <span className="font-bold text-gray-600">{course.platform}</span>
                          {course.level && (
                            <span className="ml-2 bg-blue-50 text-[#025CB8] border border-blue-100 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                              {course.level}
                            </span>
                          )}
                        </div>

                        <button
                          disabled={enrollingId === course.id}
                          onClick={() => handleEnroll(course.id)}
                          style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                          className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                        >
                          {enrollingId === course.id ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              Mendaftar...
                            </>
                          ) : (
                            "Mulai Belajar →"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Kursus Terdaftar ───────────────────────────────────────── */}
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4">
                <GraduationCap size={18} className="text-[#025CB8]" />
                Kursus yang Sudah Terdaftar
              </h2>

              {loadingCourses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={28} className="animate-spin text-[#025CB8]" />
                </div>
              ) : myCoursesList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                  <BookOpen size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-semibold text-gray-400">
                    Belum ada kursus terdaftar
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Daftar ke kursus di atas untuk memulai perjalanan belajarmu.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myCoursesList.map((course) => {
                    const isActive = course.status === "active";
                    const isCompleted = course.status === "completed";
                    const hasCheckedInToday = course.recentCheckins?.some(
                      (ci) =>
                        new Date(ci.date).toDateString() ===
                        new Date().toDateString()
                    );
                    return (
                      <div
                        key={course.id}
                        className={`flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
                          isCompleted ? "border-green-200" : "border-gray-100"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isCompleted ? "bg-green-50" : "bg-blue-50"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={20} className="text-green-600" />
                          ) : (
                            <PlayCircle size={20} className="text-[#025CB8]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-bold text-gray-800 line-clamp-1">
                              {course.url ? (
                                <a
                                  href={course.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:text-[#025CB8] hover:underline transition-colors"
                                >
                                  {course.courseName}
                                </a>
                              ) : (
                                course.courseName
                              )}
                            </h3>
                            <span
                              className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isCompleted
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-[#025CB8]"
                              }`}
                            >
                              {isCompleted ? "Selesai" : "Aktif"}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400">{course.platform}</p>
                          {isActive && (
                            <div className="mt-1.5">
                              <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-[#025CB8]">{course.progress}%</span>
                              </div>
                              <ProgressLine
                                percentage={course.progress}
                                accent="#025CB8"
                              />
                            </div>
                          )}
                        </div>

                        {isActive && (
                          <button
                            disabled={hasCheckedInToday}
                            onClick={() => {
                              setCurrentTab("roadmap");
                              setTimeout(() => handleOpenCheckinModal(course), 100);
                            }}
                            className={`shrink-0 px-3 py-2 rounded-xl text-[10px] font-bold transition ${
                              hasCheckedInToday
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-[#025CB8] text-white hover:bg-blue-700"
                            }`}
                          >
                            {hasCheckedInToday ? "Sudah Check-in ✓" : "Check-in"}
                          </button>
                        )}
                        {isCompleted && (
                          <span className="shrink-0 text-green-600 text-xs font-bold flex items-center gap-1">
                            <Trophy size={14} />
                            Lulus!
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Daily Check-in
      ═══════════════════════════════════════════════════════════════════════════ */}
      {isCheckinModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <Flame size={18} className="text-orange-500 animate-pulse" />
                  Check-in Progress Belajar
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5 line-clamp-1">
                  {selectedCourse.courseName}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCheckinModalOpen(false);
                  setSelectedCourse(null);
                }}
                className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 min-h-0">
              <div className="rounded-2xl border border-blue-50 bg-blue-50/30 px-4 py-3 text-xs font-semibold text-[#025CB8] flex items-center justify-between">
                <span>📅 Tanggal Check-in:</span>
                <span>
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Progress Baru</span>
                  <span className="text-[#025CB8]">{checkinProgress}% Selesai</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={checkinProgress}
                    onChange={(e) => setCheckinProgress(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#025CB8]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={checkinProgress}
                    onChange={(e) => {
                      const val = Math.max(
                        0,
                        Math.min(100, parseInt(e.target.value) || 0)
                      );
                      setCheckinProgress(val);
                    }}
                    className="w-16 rounded-xl border border-gray-200 px-2 py-1 text-center text-xs font-bold text-gray-700 focus:border-[#025CB8] focus:outline-none focus:ring-1 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  ⏱️ Berapa jam kamu belajar hari ini?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={checkinHours === 0 ? "" : checkinHours}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    onBlur={(e) => {
                      let val = parseFloat(e.target.value);
                      if (isNaN(val) || val < 0) val = 0;
                      else if (val > 24) val = 24;
                      else val = Math.round(val * 10) / 10;
                      setCheckinHours(val);
                    }}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCheckinHours(isNaN(val) ? 0 : val);
                    }}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-[#025CB8] focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Contoh: 1.5"
                  />
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2.5 rounded-xl border border-gray-200">
                    jam
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  📝 Catatan Belajar (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={checkinNote}
                  onChange={(e) => setCheckinNote(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-[#025CB8] focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  placeholder="Modul atau topik yang kamu pelajari hari ini..."
                />
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Clock size={14} className="text-purple-500" />
                  Riwayat Check-in
                </h4>

                {isFetchingHistory ? (
                  <div className="flex items-center justify-center py-6 text-gray-400 gap-2">
                    <Loader2 size={16} className="animate-spin text-[#025CB8]" />
                    <span className="text-xs font-medium">Memuat riwayat...</span>
                  </div>
                ) : checkinHistory.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                    Belum ada catatan check-in sebelumnya.
                  </p>
                ) : (
                  <div className="relative pl-4 space-y-4 max-h-[160px] overflow-y-auto">
                    <div className="absolute top-2 bottom-2 left-[7px] w-[1.5px] bg-purple-100" />
                    {checkinHistory.map((log) => (
                      <div key={log.id} className="relative flex gap-3 text-xs">
                        <div className="absolute -left-[13px] top-1.5 w-2 h-2 rounded-full bg-purple-500 border border-white" />
                        <div className="flex-1 bg-gray-50/50 rounded-2xl border border-gray-100 p-3">
                          <div className="flex justify-between items-center font-bold text-gray-700 mb-1">
                            <span>{log.progress}% Selesai</span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(log.date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          {log.hoursSpent > 0 && (
                            <p className="text-[10px] font-bold text-purple-600 mb-1">
                              ⏱️ Durasi: {log.hoursSpent} jam
                            </p>
                          )}
                          {log.note && (
                            <p className="text-gray-500 leading-normal">{log.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => {
                  setIsCheckinModalOpen(false);
                  setSelectedCourse(null);
                }}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmittingCheckin || checkinHours <= 0}
                onClick={handleSubmitCheckin}
                className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
              >
                {isSubmittingCheckin ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <span>Simpan Progress</span>
                    <ArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Konfirmasi Selesai Kursus
      ═══════════════════════════════════════════════════════════════════════════ */}
      {isCompleteModalOpen && courseToComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-7 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#025CB8] mb-4">
              <Trophy size={32} />
            </div>

            <h3 className="text-base font-bold text-gray-800">Selesaikan Kursus?</h3>

            <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-xs">
              Kamu akan menandai <span className="font-bold text-gray-600">"{courseToComplete.courseName}"</span> sebagai selesai. Progress belajar kamu akan diset ke 100% dan dipindahkan ke riwayat kelulusan.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => {
                  setIsCompleteModalOpen(false);
                  setCourseToComplete(null);
                }}
                className="flex-1 rounded-xl py-2.5 border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                disabled={isCompletingCourse}
                style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                className="flex-1 rounded-xl py-2.5 text-xs font-bold text-white transition hover:opacity-90 shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isCompletingCourse ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <span>Ya, Selesaikan</span>
                    <CheckCircle2 size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapKarir;