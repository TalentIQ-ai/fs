// src/pages/dashboard/index.tsx

import {
  ArrowRight,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Database,
  FileCode2,
  LineChart,
  Loader2,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/common/sidebar";
import { animClass, useScrollAnimation } from "@/hooks/use-scroll-animation";
import { getDashboardSummary, DashboardSummary } from "@/services/dashboard.service";
import { enrollCourseService, getRecommendationsService, getMyCoursesService } from "@/services/course.service";



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
  direction = "up",
  extraClass = "",
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade";
  extraClass?: string;
}) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`${animClass(isVisible, direction)} ${extraClass}`}
    >
      {children}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [sidebarShrink, setSidebarShrink] = useState(false);

  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [llmRecs, setLlmRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [error, setError] = useState("");
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<number>>(new Set());

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary();
      setDashboardData(data);
    } catch (err: any) {
      console.error("[Dashboard] Error fetching:", err);
      setError("Gagal memuat analisis karir AI Anda. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoadingRecs(true);
      const [recsRes, myCoursesRes] = await Promise.all([
        getRecommendationsService().catch(() => null),
        getMyCoursesService().catch(() => null)
      ]);

      const enrolledIds = new Set<number>(
        (myCoursesRes || []).map((c: any) => c.courseId || c.id)
      );
      setEnrolledCourseIds(enrolledIds);

      if (recsRes) {
        const filtered = (recsRes.recommendations || []).filter((r: any) => {
          const cId = r.course?.id || r.courseId;
          return !enrolledIds.has(cId);
        });
        setLlmRecs(filtered);
      }
    } catch (err) {
      console.error("Error fetching recs:", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchRecommendations();
  }, []);

  const handleEnroll = async (courseId: number) => {
    try {
      setEnrollingId(courseId);
      await enrollCourseService(courseId);
      setEnrolledCourseIds((prev) => {
        const next = new Set(prev);
        next.add(courseId);
        return next;
      });
      // Re-fetch dashboard stats so active courses counts, etc. are updated!
      const data = await getDashboardSummary();
      setDashboardData(data);
      navigate("/profil");
    } catch (err: any) {
      console.error("Enroll error:", err);
      alert(err?.response?.data?.message || "Gagal mendaftar ke kursus.");
    } finally {
      setEnrollingId(null);
    }
  };

  const sidebarWidth = useMemo(
    () => (sidebarShrink ? "lg:ml-[90px]" : "lg:ml-[260px]"),
    [sidebarShrink]
  );

  // Map API data to expected variables
  const name = dashboardData?.user?.name || "User";
  const firstName = name.split(" ")[0];
  const completeName = name;

  const profile = useMemo(() => ({
    firstName,
    completeName
  }), [firstName, completeName]);

  const updatedAt = dashboardData?.lastUpdated || "Baru saja";
  const jobReadyScore = dashboardData?.readinessScore ?? 0;
  const dreamRole = dashboardData?.targetRole || "Belum ditentukan";

  const masteredSkills = dashboardData?.ownedSkills || [];
  const missingSkills = dashboardData?.neededSkills || [];

  // Apakah user sudah pernah upload/scan CV?
  const hasSkillData = masteredSkills.length > 0 || missingSkills.length > 0;

  const learningJourney = useMemo(() => {
    if (!dashboardData?.roadmap || dashboardData.roadmap.length === 0) {
      return [];
    }
    return dashboardData.roadmap.map((step) => {
      let displayTitle = step.title;
      // Remove "Minggu X: " prefix from the AI output because we already have duration info
      const match = step.title.match(/^(Minggu\s+\d+):\s*(.*)$/i);
      if (match) {
        displayTitle = match[2];
        displayTitle = displayTitle.charAt(0).toUpperCase() + displayTitle.slice(1);
      }

      return {
        id: step.id,
        title: displayTitle,
        state: step.status === "upcoming" ? "later" : (step.status as any),
        estimate: step.duration,
        progress: step.progress,
      };
    });
  }, [dashboardData]);

  // Mapping ikon berdasarkan kategori keyword — bukan nama persis
  const getSkillIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (["sql", "database", "postgresql", "mongodb", "mysql", "oracle"].some((k) => lower.includes(k)))
      return <Database size={22} />;
    if (["python", "java", "js", "javascript", "typescript", "react", "node", "php", "golang", "rust", "kotlin"].some((k) => lower.includes(k)))
      return <FileCode2 size={22} />;
    if (["tableau", "power bi", "powerbi", "matplotlib", "chart", "viz", "visualization", "looker"].some((k) => lower.includes(k)))
      return <LineChart size={22} />;
    if (["ml", "machine learning", "ai", "deep learning", "neural", "nlp"].some((k) => lower.includes(k)))
      return <Brain size={22} />;
    if (["code", "programming", "dev", "software", "engineer"].some((k) => lower.includes(k)))
      return <Code2 size={22} />;
    return <TrendingUp size={22} />;
  };

  const highlightedSkills = useMemo(() => {
    if (!dashboardData?.prioritySkills || dashboardData.prioritySkills.length === 0) {
      return [];
    }
    return dashboardData.prioritySkills.map((ps) => ({
      id: ps.id,
      label: ps.name,
      icon: getSkillIcon(ps.name),
      demand: ps.reason || `Dibutuhkan untuk ${dreamRole}`,
      percentage: ps.relevance,
      accent: ps.color || "#025CB8",
      soft: ps.bg || "#EFF6FF",
    }));
  }, [dashboardData, dreamRole]);

  const coursesToRender = useMemo(() => {
    if (dreamRole === "Belum ditentukan" || missingSkills.length === 0) {
      return [];
    }

    let list: any[] = [];
    if (llmRecs.length > 0) {
      list = llmRecs.map((rec: any) => {
        const matched = rec.matchedSkills || [];
        const taught = rec.course?.skills_taught ? rec.course.skills_taught.split(",").map((s: string) => s.trim()) : [];
        const uniqueSkills = Array.from(new Set([...matched, ...taught])).filter(Boolean);

        return {
          id: rec.course?.id || rec.courseId,
          title: rec.course?.course_name || "Unknown Course",
          category: rec.course?.category || "General",
          platform: rec.course?.platform || "Online",
          rating: 4.8,
          badge: "Direkomendasikan AI",
          url: rec.course?.url,
          level: rec.course?.level || "Beginner",
          skills: uniqueSkills,
          reason: rec.reason || "",
        };
      });
    } else if (dashboardData?.recommendedCourses) {
      list = dashboardData.recommendedCourses.map((course) => {
        return {
          id: course.id,
          title: course.title,
          category: course.category,
          platform: course.platform,
          rating: course.rating,
          badge: course.badge || "",
          url: (course as any).url,
          level: (course as any).level || "Beginner",
          skills: (course as any).skills || [],
          reason: (course as any).reason || "",
        };
      });
    }

    return list.filter((course) => !enrolledCourseIds.has(course.id));
  }, [dashboardData, llmRecs, dreamRole, missingSkills, enrolledCourseIds]);

  const shouldShowReason = (r: string) => r && r.trim().length > 5 && !r.toLowerCase().startsWith("course ini mencakup skill");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar
          collapsed={sidebarShrink}
          setCollapsed={setSidebarShrink}
        />
        <main
          className={`pb-24 pt-[72px] transition-all duration-300 lg:pb-8 lg:pt-0 ${sidebarWidth}`}
        >
          <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-[#025CB8] mb-4" size={48} />
            <p className="text-gray-500 font-semibold animate-pulse">Memasang modul AI & memuat analisis karir...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar
          collapsed={sidebarShrink}
          setCollapsed={setSidebarShrink}
        />
        <main
          className={`pb-24 pt-[72px] transition-all duration-300 lg:pb-8 lg:pt-0 ${sidebarWidth}`}
        >
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
          {/* Banner jika belum menentukan target role */}
          {dreamRole === "Belum ditentukan" && (
            <FadeSection>
              <div className="rounded-2xl border border-blue-100 p-6 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-200/20 -mr-10 -mt-10" />
                <div className="absolute left-1/3 bottom-0 h-24 w-24 rounded-full bg-indigo-200/20 -mb-10" />

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md text-[#025CB8] shrink-0">
                  <Brain size={32} className="animate-pulse" />
                </div>

                <div className="flex-1 text-center md:text-left relative z-10">
                  <h3 className="text-lg font-black text-gray-800 mb-1">
                    Mulai Perjalanan Karir AI Anda! 🚀
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xl">
                    Anda belum menentukan target karir atau mengunggah CV.
                    Unggah CV atau pilih target role Anda sekarang untuk mendapatkan analisis kesiapan kerja, peta belajar, dan rekomendasi kursus berbasis AI.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 relative z-10">
                  <button
                    onClick={() => navigate("/profil")}
                    className="bg-[#025CB8] hover:bg-blue-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-md shadow-blue-500/20 text-center"
                  >
                    Tentukan Target Karir
                  </button>
                  <button
                    onClick={() => navigate("/auth/user-analisis-skill")}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-bold px-6 py-3 rounded-xl transition shadow-sm text-center"
                  >
                    Upload & Scan CV
                  </button>
                </div>
              </div>
            </FadeSection>
          )}

          {/* cards */}
          <FadeSection>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {/* skill dimiliki */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col">
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

                {masteredSkills.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                    <CheckCircle2 size={28} className="text-gray-200 mb-2" />
                    <p className="text-xs font-semibold text-gray-400">Belum ada skill terdeteksi</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">Upload CV untuk analisis otomatis</p>
                    <button
                      onClick={() => navigate("/auth/user-analisis-skill")}
                      className="mt-3 px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#025CB8] border border-blue-200 hover:bg-blue-50 transition"
                    >
                      Upload CV →
                    </button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* skill kurang */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                    <Target size={16} className="text-red-500" />
                  </div>

                  <h2 className="text-sm font-semibold text-gray-700">
                    Skill yang Masih Kurang
                  </h2>
                </div>

                {missingSkills.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                    <Target size={28} className="text-gray-200 mb-2" />
                    {!hasSkillData ? (
                      /* Belum ada data skill sama sekali */
                      <>
                        <p className="text-xs font-semibold text-gray-400">Belum ada data skill</p>
                        <p className="text-[10px] text-gray-300 mt-0.5">Upload CV agar AI bisa menganalisis gap skill-mu</p>
                        <button
                          onClick={() => navigate("/auth/user-analisis-skill")}
                          className="mt-3 px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#025CB8] border border-blue-200 hover:bg-blue-50 transition"
                        >
                          Upload CV →
                        </button>
                      </>
                    ) : dreamRole === "Belum ditentukan" ? (
                      /* Ada skill tapi belum ada target role */
                      <>
                        <p className="text-xs font-semibold text-gray-400">Target karir belum diset</p>
                        <p className="text-[10px] text-gray-300 mt-0.5">Tentukan role agar gap skill bisa dianalisis</p>
                        <button
                          onClick={() => navigate("/profil")}
                          className="mt-3 px-3 py-1.5 rounded-lg text-[11px] font-bold text-red-500 border border-red-200 hover:bg-red-50 transition"
                        >
                          Tentukan Target →
                        </button>
                      </>
                    ) : (
                      /* Ada skill, ada target, semua terpenuhi */
                      <>
                        <p className="text-xs font-semibold text-green-500">Semua skill terpenuhi! 🎉</p>
                        <p className="text-[10px] text-gray-300 mt-0.5">Kamu siap melamar sebagai {dreamRole}</p>
                      </>
                    )}
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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

                {!hasSkillData ? (
                  /* Empty state — belum ada data CV */
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
                      style={{ background: "rgba(255,255,255,0.6)", border: "3px dashed #93C5FD" }}
                    >
                      <Target size={28} className="text-blue-400" />
                    </div>
                    <p className="text-sm font-bold text-[#025CB8] mb-1">Belum dianalisis</p>
                    <p className="text-xs text-blue-400 leading-relaxed mb-3">
                      Upload CV untuk tahu seberapa siap kamu sebagai
                      <span className="font-bold"> {dreamRole}</span>
                    </p>
                    <button
                      onClick={() => navigate("/auth/user-analisis-skill")}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white transition hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                    >
                      Analisis Sekarang →
                    </button>
                  </div>
                ) : (
                  <>
                    <ScoreCircle score={jobReadyScore} />

                    <p className="mt-4 text-center text-sm font-semibold text-[#025CB8]">
                      Siap kerja sebagai
                    </p>

                    <p className="text-center text-base font-black text-gray-800">
                      {dreamRole}
                    </p>
                  </>
                )}
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
                  onClick={() => navigate("/auth/roadmap-karir")}
                  className="group flex items-center gap-1 text-xs font-semibold text-[#025CB8] transition hover:text-blue-700"
                >
                  Lihat semua

                  <ChevronRight
                    size={14}
                    className="transition group-hover:translate-x-0.5"
                  />
                </button>
              </div>

              {/* desktop */}
              <div className="hidden items-start overflow-x-auto pb-2 lg:flex">
                {learningJourney.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center py-10 text-center">
                    <BookOpen size={32} className="text-gray-200 mb-3" />
                    <p className="text-sm font-bold text-gray-400">Roadmap belum terbentuk</p>
                    <p className="text-xs text-gray-300 mt-1">Tentukan target karir & upload CV untuk membuat roadmap AI-mu</p>
                    <button
                      onClick={() => navigate("/auth/user-analisis-skill")}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                    >
                      Mulai Analisis CV →
                    </button>
                  </div>
                ) : (
                  <>
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
                          className="relative flex flex-1 basis-0 flex-col items-center"
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

                          <div className="mt-3 px-1 text-center max-w-[130px] mx-auto">
                            <p
                              className={`mb-0.5 text-[11px] font-bold ${currentStep.text}`}
                            >
                              {currentStep.label}
                            </p>

                            <p
                              className="whitespace-normal text-xs font-semibold leading-snug text-gray-700 line-clamp-3"
                              title={phase.title}
                            >
                              {phase.title}
                            </p>

                            <p className="mt-1 text-[10px] text-gray-400">
                              {phase.estimate}
                            </p>

                            {phase.state === "active" &&
                              phase.progress && (
                                <div className="mt-2 w-full px-2">
                                  <MiniBar
                                    value={phase.progress}
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
                  </>
                )}
              </div>

              {/* mobile / tablet */}
              <div className="flex flex-col gap-4 lg:hidden">
                {learningJourney.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <BookOpen size={28} className="text-gray-200 mb-2" />
                    <p className="text-xs font-bold text-gray-400">Roadmap belum terbentuk</p>
                    <button
                      onClick={() => navigate("/auth/user-analisis-skill")}
                      className="mt-3 px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#025CB8] border border-blue-200 hover:bg-blue-50 transition"
                    >
                      Mulai Analisis CV →
                    </button>
                  </div>
                ) : (
                  <>
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
                                    value={phase.progress}
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
                  </>
                )}
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

              {highlightedSkills.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                    <Zap size={22} className="text-[#025CB8] opacity-50" />
                  </div>
                  <p className="text-sm font-bold text-gray-400">Belum ada skill prioritas</p>
                  <p className="text-xs text-gray-300 mt-1 max-w-xs">
                    AI akan merekomendasikan skill yang harus difokuskan setelah kamu upload CV
                  </p>
                  <button
                    onClick={() => navigate("/auth/user-analisis-skill")}
                    className="mt-4 px-5 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                  >
                    Analisis CV Sekarang →
                  </button>
                </div>
              ) : (
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
                        className={`cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 flex flex-col ${isHover
                          ? "border-opacity-0 shadow-xl -translate-y-1"
                          : "hover:shadow-md"
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
              )}
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

              {loadingRecs ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-12 shadow-sm min-h-[240px]">
                  <Loader2 size={36} className="animate-spin text-[#025CB8] mb-3" />
                  <p className="text-sm font-semibold text-gray-500 animate-pulse">Memuat rekomendasi kursus AI...</p>
                </div>
              ) : coursesToRender.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                    <BookOpen size={22} className="text-[#025CB8] opacity-50" />
                  </div>
                  <p className="text-sm font-bold text-gray-400">Belum ada rekomendasi kursus</p>
                  <p className="text-xs text-gray-300 mt-1 max-w-xs">
                    AI akan merekomendasikan kursus yang harus dipelajari setelah kamu upload CV
                  </p>
                  <button
                    onClick={() => navigate("/auth/user-analisis-skill")}
                    className="mt-4 px-5 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                  >
                    Mulai Analisis CV →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {coursesToRender.map((course) => {
                    const badgeStyle = course.badge === "Direkomendasikan AI" || course.badge === "Rekomendasi AI"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-green-100 text-green-700";

                    return (
                      <div
                        key={course.id}
                        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[240px]"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {course.category}
                              </span>
                              <h3 className="font-bold text-sm text-gray-800 leading-snug line-clamp-2 mt-0.5" title={course.title}>
                                {course.url ? (
                                  <a href={course.url} target="_blank" rel="noreferrer" className="hover:text-[#025CB8] hover:underline transition-colors">
                                    {course.title}
                                  </a>
                                ) : (
                                  course.title
                                )}
                              </h3>
                            </div>
                            {course.badge && (
                              <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${badgeStyle}`}>
                                {course.badge}
                              </span>
                            )}
                          </div>

                          {/* Skills Tag Area */}
                          {course.skills && course.skills.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-1.5">
                              {course.skills.slice(0, 3).map((skill: string) => (
                                <span
                                  key={skill}
                                  className="bg-gray-100 text-gray-600 border border-gray-200/50 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                                >
                                  {skill}
                                </span>
                              ))}
                              {course.skills.length > 3 && (
                                <span title={course.skills.slice(3).join(", ")} className="bg-gray-50 text-gray-400 border border-gray-200/30 rounded-lg px-2 py-0.5 text-[9px] font-bold cursor-help">
                                  +{course.skills.length - 3} lagi
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <span className="font-bold text-gray-600">{course.platform}</span>
                              {course.level && (
                                <span className="ml-2 bg-blue-50 text-[#025CB8] border border-blue-100 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                                  {course.level}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            disabled={enrollingId === course.id}
                            onClick={() => handleEnroll(course.id)}
                            style={{
                              background:
                                "linear-gradient(135deg, #025CB8, #62AAEA)",
                            }}
                            className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow"
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
                    );
                  })}
                </div>
              )}
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
                      {missingSkills.length > 0 ? missingSkills.length : ""}
                    </span>{" "}
                    {missingSkills.length > 0
                      ? `lowongan cocok buat role ${dreamRole}`
                      : `Temukan lowongan untuk ${dreamRole}`
                    }
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
                  navigate("/jalur-karir")
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
                    {missingSkills.length > 0
                      ? (
                        <>Mulai belajar <span className="font-bold text-white">{missingSkills[0]}</span> dan tingkatkan peluangmu{" "}
                          <span className="text-lg font-black text-white">
                            {Math.min(Math.round((1 / Math.max(missingSkills.length + masteredSkills.length, 1)) * 100 + 5), 30)}%
                          </span></>
                      )
                      : "Semua skill terpenuhi! Coba lamar pekerjaan sekarang."
                    }
                  </p>

                  <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-purple-700 shadow transition-all duration-200 hover:shadow-md group-hover:gap-3">
                    Ke Roadmap Karir

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