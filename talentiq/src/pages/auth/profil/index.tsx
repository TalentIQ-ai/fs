//src/pages/auth/profil/index.tsx
import {
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock,
  Flame,
  Loader2,
  PlayCircle,
  Star,
  X,
  FileText,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import Sidebar from "@/components/common/sidebar";
import {
  getProfileService,
  updateProfileService,
  UpdateProfilePayload,
  UserWithProfile,
} from "@/services/profile.service";
import {
  getDashboardSummary,
  ActiveCourse,
  RecommendedCourse,
} from "@/services/dashboard.service";
import {
  getRecommendationsService,
  enrollCourseService,
  getMyCoursesService,
  dailyCheckinService,
  getCheckinHistoryService,
  DailyCheckinLog,
} from "@/services/course.service";

// Palet warna kursus berdasarkan index
const courseAccents = ["#025CB8", "#7C3AED", "#059669", "#EF4444", "#F59E0B", "#8B5CF6"];
const courseBgSofts = ["#EFF6FF", "#F5F3FF", "#ECFDF5", "#FEF2F2", "#FEF3C7", "#F5F3FF"];

// progress kecil
const TARGET_CATEGORIES = [
  "Software Engineer",
  "Video/Content Creator",
  "Graphic Designer",
  "Frontend Developer",
  "Backend Developer",
  "Marketing & Growth",
  "Data Analyst & BI",
  "Operations & Admin",
  "UI/UX Designer",
  "Full-Stack Developer",
  "IT Infrastructure & DevOps",
  "Sales",
  "Mobile Developer",
  "Architect",
  "AI & ML Engineer",
  "Web Developer",
  "HR & Talent",
  "QA Engineer",
  "Strategy & Consulting",
  "Data Engineer",
  "Product Designer",
  "Interior Designer",
  "Editor & Writer",
  "Education & Teaching",
  "Motion Designer",
  "Art Director",
  "Illustrator",
  "Game Developer"
];
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
      style={{
        width: `${percentage}%`,
        background: accent,
      }}
    />
  </div>
);

// "Budi Santoso" => BS
const makeInitialAvatar = (fullName: string) =>
  fullName
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const ProfilKursus = () => {
  const [currentTab, setCurrentTab] = useState<"progress" | "profil">(
    "progress"
  );

  const [sidebarMini, setSidebarMini] = useState(false);

  // avatar upload ref
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // api state
  const [profileDetail, setProfileDetail] =
    useState<UserWithProfile | null>(null);

  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  // kursus dari dashboard & course API lokal interfaces
  interface ClientActiveCourse {
    id: number;
    title: string;
    platform: string;
    category: string;
    duration: string;
    rating: number;
    progress: number;
    lastAccessed: string;
    recentCheckins?: any[];
    estimatedHours?: number;
    url?: string | null;
    skills?: string[];
    level?: string | null;
  }

  const shouldShowReason = (reason?: string) => {
    if (!reason) return false;
    const lower = reason.toLowerCase();
    return !(
      lower.includes("mencakup skill") ||
      lower.includes("mencakup keahlian") ||
      lower.includes("course ini mencakup")
    );
  };

  interface ClientRecommendedCourse {
    id: number;
    title: string;
    platform: string;
    category: string;
    badge: string | null;
    reason?: string;
    level?: string | null;
    skills?: string[];
    url?: string | null;
  }

  const [activeCourseList, setActiveCourseList] = useState<ClientActiveCourse[]>([]);
  const [completedCourseList, setCompletedCourseList] = useState<ClientActiveCourse[]>([]);
  const [recommendedCourseList, setRecommendedCourseList] = useState<ClientRecommendedCourse[]>([]);

  // Custom Modal Konfirmasi Selesai Kursus
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [courseToComplete, setCourseToComplete] = useState<ClientActiveCourse | null>(null);
  const [isCompletingCourse, setIsCompletingCourse] = useState(false);

  // Daily check-in modal states
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ClientActiveCourse | null>(null);
  const [checkinProgress, setCheckinProgress] = useState(0);
  const [checkinHours, setCheckinHours] = useState(1);
  const [checkinNote, setCheckinNote] = useState("");
  const [checkinHistory, setCheckinHistory] = useState<DailyCheckinLog[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [isSubmittingCheckin, setIsSubmittingCheckin] = useState(false);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [enrollMessage, setEnrollMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  // form state
  const [fullName, setFullName] = useState("");
  const [careerTarget, setCareerTarget] = useState("");

  const [experienceTier, setExperienceTier] = useState(
    "Fresh Graduate (0-1 tahun)"
  );

  const [skillCollection, setSkillCollection] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const loadProfile = async () => {
    try {
      setIsFetchingProfile(true);

      const [profileResponse, dashboardResponse, myCoursesResponse] = await Promise.all([
        getProfileService(),
        getDashboardSummary().catch(() => null),
        getMyCoursesService().catch(() => null),
      ]);

      const currentUser = profileResponse.user;
      setProfileDetail(currentUser);
      setFullName(currentUser.name ?? "");
      setCareerTarget(currentUser.profile?.targetRole ?? "");
      setExperienceTier(
        currentUser.profile?.experienceLevel ??
          "Fresh Graduate (0-1 tahun)"
      );
      setSkillCollection(currentUser.profile?.skills ?? []);

      // 1. Load my courses (active vs completed)
      if (myCoursesResponse) {
        const activeOnly = myCoursesResponse
          .filter((c) => c.status === "active")
          .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
        setActiveCourseList(
          activeOnly.map((uc) => ({
            id: uc.id,
            title: uc.courseName,
            platform: uc.platform || "Online",
            category: uc.category || "General",
            duration: "4 - 8 minggu",
            rating: 4.8,
            progress: uc.progress,
            lastAccessed: uc.lastAccessed,
            recentCheckins: uc.recentCheckins || [],
            estimatedHours: (uc as any).estimatedHours,
            url: uc.url,
            skills: (uc as any).skills || [],
            level: (uc as any).level || "Beginner",
          }))
        );

        const completedOnly = myCoursesResponse
          .filter((c) => c.status === "completed")
          .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
        setCompletedCourseList(
          completedOnly.map((uc) => ({
            id: uc.id,
            title: uc.courseName,
            platform: uc.platform || "Online",
            category: uc.category || "General",
            duration: "4 - 8 minggu",
            rating: 4.8,
            progress: uc.progress,
            lastAccessed: uc.lastAccessed,
            recentCheckins: uc.recentCheckins || [],
            estimatedHours: (uc as any).estimatedHours,
            url: uc.url,
            skills: (uc as any).skills || [],
            level: (uc as any).level || "Beginner",
          }))
        );
      } else if (dashboardResponse) {
        setActiveCourseList(dashboardResponse.activeCourses || []);
        setCompletedCourseList([]);
      }

      // 2. Load LLM recommendations
      let finalRecs: ClientRecommendedCourse[] = [];
      const registeredCourseIds = new Set(
        (myCoursesResponse || []).map((c: any) => c.courseId || c.id)
      );

      try {
        const recsRes = await getRecommendationsService();
        finalRecs = recsRes.recommendations.map((rec) => {
          const matched = rec.matchedSkills || [];
          const taught = rec.course?.skills_taught ? rec.course.skills_taught.split(",").map((s) => s.trim()) : [];
          const uniqueSkills = Array.from(new Set([...matched, ...taught])).filter(Boolean);

          return {
            id: rec.course?.id || rec.courseId,
            title: rec.course?.course_name || "Unknown Course",
            platform: rec.course?.platform || "Online",
            category: rec.course?.category || "General",
            rating: 4.8,
            badge: "Direkomendasikan AI",
            reason: rec.reason || "",
            level: rec.course?.level || "Beginner",
            skills: uniqueSkills,
            url: rec.course?.url,
          };
        });
      } catch (e) {
        if (dashboardResponse) {
          finalRecs = (dashboardResponse.recommendedCourses || []).map((c) => ({
            id: c.id,
            title: c.title,
            platform: c.platform,
            category: c.category,
            rating: typeof c.rating === "number" ? c.rating : parseFloat((c.rating as any) || "0") || 4.8,
            badge: c.badge,
            skills: [],
            reason: "",
            level: "Beginner",
            url: (c as any).url,
          }));
        }
      }
      
      // Filter out registered/enrolled courses from recommendations
      const filteredRecs = finalRecs.filter((rec) => !registeredCourseIds.has(rec.id));
      setRecommendedCourseList(filteredRecs);

    } catch (fetchErr: any) {
      console.error("profile error:", fetchErr);
      setErrorMessage(
        "Profil gagal dimuat. Coba refresh halaman ya."
      );
    } finally {
      setIsFetchingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleEnroll = async (courseId: number) => {
    try {
      setEnrollingId(courseId);
      await enrollCourseService(courseId);
      setEnrollMessage({ type: "success", text: "Berhasil mendaftar ke kursus! Cek bagian Kursus Aktif Saya." });
      setTimeout(() => setEnrollMessage(null), 6000);
      await loadProfile();
    } catch (err: any) {
      console.error("Enroll error:", err);
      setEnrollMessage({ type: "error", text: err?.response?.data?.message || "Gagal mendaftar ke kursus." });
      setTimeout(() => setEnrollMessage(null), 6000);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleOpenCheckinModal = async (course: ClientActiveCourse) => {
    const hasCheckedInToday = course.recentCheckins?.some((ci) => {
      const ciDate = new Date(ci.date).toDateString();
      const todayDate = new Date().toDateString();
      return ciDate === todayDate;
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
      await loadProfile();
      setIsCheckinModalOpen(false);
      setSelectedCourse(null);
    } catch (err: any) {
      console.error("Check-in error:", err);
      alert(err?.response?.data?.message || "Gagal melakukan check-in.");
    } finally {
      setIsSubmittingCheckin(false);
    }
  };

  const handleOpenCompleteModal = (course: ClientActiveCourse) => {
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
        note: "Menyelesaikan kursus secara cepat",
        hoursSpent: 1,
      });
      await loadProfile();
      setIsCompleteModalOpen(false);
      setCourseToComplete(null);
    } catch (err: any) {
      console.error("Gagal menyelesaikan kursus:", err);
      alert(err?.response?.data?.message || "Gagal menyelesaikan kursus.");
    } finally {
      setIsCompletingCourse(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleSkillInput = (
    keyboardEvent: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const cleanSkill = skillInput.trim();

    if (keyboardEvent.key !== "Enter" || !cleanSkill) return;

    keyboardEvent.preventDefault();

    setSkillCollection((prevSkill) =>
      prevSkill.includes(cleanSkill)
        ? prevSkill
        : [...prevSkill, cleanSkill]
    );

    setSkillInput("");
  };

  const removeSkillTag = (deletedSkill: string) => {
    setSkillCollection((prevSkill) =>
      prevSkill.filter((skillName) => skillName !== deletedSkill)
    );
  };

  const restoreForm = () => {
    if (!profileDetail) return;

    setFullName(profileDetail.name ?? "");
    setCareerTarget(profileDetail.profile?.targetRole ?? "");

    setExperienceTier(
      profileDetail.profile?.experienceLevel ??
        "Fresh Graduate (0-1 tahun)"
    );

    setSkillCollection(profileDetail.profile?.skills ?? []);

    setErrorMessage("");
  };

  const saveProfileChanges = async () => {
    if (!fullName.trim()) {
      setErrorMessage("Nama wajib diisi");
      return;
    }

    setErrorMessage("");
    setShowSavedAlert(false);
    setIsSubmitting(true);

    try {
      const requestBody: UpdateProfilePayload = {
        name: fullName.trim(),
        // Kirim string kosong apa adanya agar user bisa mereset target karir
        targetRole: careerTarget,
        experienceLevel: experienceTier || undefined,
        skills: skillCollection,
      };

      const updatedProfile = await updateProfileService(requestBody);

      setProfileDetail(updatedProfile.user);
      setShowSavedAlert(true);

      window.setTimeout(() => {
        setShowSavedAlert(false);
      }, 5000);
    } catch (saveErr: any) {
      setErrorMessage(
        saveErr?.response?.data?.message ||
          "Profil gagal disimpan. Coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const dashboardStats = useMemo(
    () => ({
      active:
        profileDetail?.profile?.activeCourses ??
        activeCourseList.length,

      completed:
        profileDetail?.profile?.completedCourses ?? 0,

      hours:
        profileDetail?.profile?.totalHours ?? 0,

      streak:
        profileDetail?.profile?.streakDays ?? 0,
    }),
    [profileDetail, activeCourseList.length]
  );



  if (isFetchingProfile) {
    return (
      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar
          collapsed={sidebarMini}
          setCollapsed={setSidebarMini}
        />
        <main
          className={`pb-24 pt-[72px] transition-all duration-300 lg:pb-8 lg:pt-0 ${
            sidebarMini ? "lg:ml-[90px]" : "lg:ml-[260px]"
          }`}
        >
          <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-[#025CB8] mb-4" size={48} />
            <p className="text-gray-500 font-semibold animate-pulse">Memuat rekomendasi kursus AI...</p>
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

      <div
        className={`pb-24 lg:pb-10 transition-all duration-300 ${
          sidebarMini ? "lg:ml-[90px]" : "lg:ml-[260px]"
        }`}
      >
        {/* top */}
        <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 px-5 py-4 backdrop-blur-md lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <BookOpen
                  className="text-[#025CB8]"
                  size={20}
                />

                Progress Skill & Kursus Kamu
              </h1>

              <p className="mt-0.5 text-sm text-gray-400">
                Pantau perkembangan belajar dan cari course baru
              </p>
            </div>

            <div className="flex self-start rounded-xl bg-gray-100 p-1 sm:self-auto">
              {["progress", "profil"].map((tabName) => {
                const isActive = currentTab === tabName;

                return (
                  <button
                    key={tabName}
                    onClick={() =>
                      setCurrentTab(
                        tabName as "progress" | "profil"
                      )
                    }
                    className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-[#025CB8] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tabName === "progress"
                      ? "Progress Kursus"
                      : "Profil Saya"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl space-y-8 px-5 pt-6 lg:px-8">
          {currentTab === "progress" ? (
            <>
              {/* stat — overflow protection untuk layar kecil */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="flex items-center gap-2 sm:gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm overflow-hidden min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <PlayCircle
                      size={22}
                      className="text-[#025CB8]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-400 truncate">
                      Kursus Aktif
                    </p>

                    <p className="text-xl sm:text-2xl font-black text-gray-800">
                      {isFetchingProfile ? (
                        <span className="inline-block h-6 w-8 bg-gray-200 animate-pulse rounded mt-1" />
                      ) : (
                        dashboardStats.active
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm overflow-hidden min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                    <Award
                      size={22}
                      className="text-green-600"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-400 truncate">
                      Selesai
                    </p>

                    <p className="text-xl sm:text-2xl font-black text-gray-800">
                      {isFetchingProfile ? (
                        <span className="inline-block h-6 w-8 bg-gray-200 animate-pulse rounded mt-1" />
                      ) : (
                        dashboardStats.completed
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm overflow-hidden min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                    <Clock
                      size={22}
                      className="text-purple-600"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-400 truncate">
                      Total Jam
                    </p>

                    <p className="text-xl sm:text-2xl font-black text-gray-800 flex items-baseline">
                      {isFetchingProfile ? (
                        <span className="inline-block h-6 w-12 bg-purple-100 animate-pulse rounded mt-1" />
                      ) : (
                        <>
                          {dashboardStats.hours}
                          <span className="ml-0.5 text-xs sm:text-sm font-bold text-gray-500">
                            j
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 sm:gap-4 rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm overflow-hidden min-w-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
                  }}
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                    <Flame
                      size={22}
                      className="text-orange-500"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-600/70 truncate">
                      Streak
                    </p>

                    <p className="mt-0.5 text-lg sm:text-xl font-black text-orange-600 truncate flex items-center">
                      {isFetchingProfile ? (
                        <span className="inline-block h-6 w-12 bg-orange-200 animate-pulse rounded mt-1" />
                      ) : (
                        `${dashboardStats.streak}h 🔥`
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* course aktif — data dari API */}
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800">
                  <PlayCircle
                    size={18}
                    className="text-[#025CB8]"
                  />
                  Kursus Aktif Saya
                </h2>

                {isFetchingProfile ? (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {[1, 2].map((n) => (
                      <div key={n} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse min-h-[240px] flex flex-col justify-between">
                        <div className="flex gap-4">
                          <div className="h-16 w-16 bg-gray-200 rounded-xl shrink-0 animate-pulse" />
                          <div className="flex-1 space-y-3 min-w-0">
                            <div className="h-3 bg-gray-200 rounded w-1/4" />
                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                            <div className="h-2 bg-gray-200 rounded w-full" />
                            <div className="h-2 bg-gray-200 rounded w-5/6" />
                          </div>
                        </div>
                        <div className="mt-5 border-t border-gray-50 pt-4 flex justify-between gap-3">
                          <div className="h-8 bg-gray-200 rounded-xl w-24 shrink-0" />
                          <div className="h-8 bg-gray-200 rounded-xl w-32 shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeCourseList.length === 0 ? (
                  <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center flex flex-col items-center justify-center shadow-sm animate-scale-in">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 mb-4">
                      <BookOpen size={32} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">Mulai Perjalanan Belajarmu</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">
                      Kamu belum memiliki kursus yang sedang aktif. Jelajahi rekomendasi kursus terbaik yang telah disesuaikan oleh AI di bawah dan mulai belajar hari ini!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {activeCourseList.map((courseInfo, idx) => {
                      const accent = courseAccents[idx % courseAccents.length];
                      const bgSoft = courseBgSofts[idx % courseBgSofts.length];
                      const lastAccessedDate = new Date(courseInfo.lastAccessed);
                      const now = new Date();
                      const diffDays = Math.floor((now.getTime() - lastAccessedDate.getTime()) / (1000 * 60 * 60 * 24));
                      const lastAccessedLabel = diffDays === 0 ? "Hari ini" : diffDays === 1 ? "Kemarin" : `${diffDays} hari lalu`;

                      // Check if already checked in today
                      const hasCheckedInToday = courseInfo.recentCheckins?.some((ci) => {
                        return new Date(ci.date).toDateString() === new Date().toDateString();
                      });

                      const estHours = courseInfo.estimatedHours;
                      const hasEstimate = estHours && estHours > 0;
                      const sisaJam = hasEstimate ? estHours * (1 - courseInfo.progress / 100) : 0;

                      return (
                        <div
                          key={courseInfo.id}
                          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md flex flex-col justify-between min-h-[240px]"
                        >
                          <div className="flex gap-4">
                            <div
                              className="flex h-16 w-16 items-center justify-center rounded-xl shrink-0"
                              style={{ backgroundColor: bgSoft, color: accent }}
                            >
                              <BookOpen size={28} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                  {courseInfo.platform}
                                </span>
                                {hasCheckedInToday && (
                                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                    Sudah Check-in ✓
                                  </span>
                                )}
                              </div>

                              <h3 className="mb-1.5 font-bold leading-tight text-gray-800 line-clamp-2" title={courseInfo.title}>
                                {courseInfo.url ? (
                                  <a href={courseInfo.url} target="_blank" rel="noreferrer" className="hover:text-[#025CB8] hover:underline transition-colors">
                                    {courseInfo.title}
                                  </a>
                                ) : (
                                  courseInfo.title
                                )}
                              </h3>

                              <div className="mb-1 flex items-center justify-between text-xs font-bold">
                                <span className="text-gray-500">Progress</span>
                                <span style={{ color: accent }}>
                                  {courseInfo.progress}% selesai
                                </span>
                              </div>

                              <ProgressLine
                                percentage={courseInfo.progress}
                                accent={accent}
                              />

                              <div className="mt-1.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                {hasEstimate && (
                                  <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5">
                                    ⏱️ ~{Number(sisaJam.toFixed(1))} jam tersisa
                                  </p>
                                )}
                                <p className="flex items-center gap-1 text-[10px] text-gray-400">
                                  <Clock size={10} />
                                  {hasCheckedInToday 
                                    ? `Update terakhir: ${courseInfo.progress}% · Hari ini` 
                                    : `Terakhir diakses: ${lastAccessedLabel}`}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 border-t border-gray-50 pt-4 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => handleOpenCompleteModal(courseInfo)}
                              className="px-3 py-2 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-colors shrink-0"
                            >
                              Selesai Kursus ✓
                            </button>

                            <div className="flex flex-col items-end shrink-0">
                              <button
                                type="button"
                                disabled={hasCheckedInToday}
                                onClick={() => handleOpenCheckinModal(courseInfo)}
                                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 ${
                                  hasCheckedInToday
                                    ? "bg-gray-300 shadow-none cursor-not-allowed hover:translate-y-0"
                                    : "bg-[#025CB8] hover:bg-blue-700"
                                }`}
                              >
                                {hasCheckedInToday ? "Sudah check-in hari ini ✓" : "Check-in Progress"}
                                {!hasCheckedInToday && <ArrowRight size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION KURSUS SELESAI */}
              {!isFetchingProfile && completedCourseList.length > 0 && (
                <div className="pt-4">
                  <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800">
                    <Award
                      size={18}
                      className="text-green-600"
                    />
                    Kursus Selesai
                  </h2>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {completedCourseList.map((courseInfo, idx) => {
                      const totalHoursSpent = courseInfo.recentCheckins?.reduce((sum, ci) => sum + (parseFloat(ci.hoursSpent) || 0), 0) || 0;

                      return (
                        <div
                          key={courseInfo.id}
                          className="rounded-2xl border-2 border-green-500 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[240px]"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                  {courseInfo.category}
                                </span>
                                <h3 className="font-bold text-sm text-gray-800 leading-snug line-clamp-2 mt-0.5" title={courseInfo.title}>
                                  {courseInfo.title}
                                </h3>
                              </div>
                              <span className="shrink-0 text-[10px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-lg shadow-sm">
                                ✓ Selesai
                              </span>
                            </div>

                            {/* Hours Spent Summary */}
                            <p className="mb-3 text-[11px] leading-relaxed text-green-700 font-semibold bg-green-50 p-2.5 rounded-xl border border-green-100 flex items-center gap-1.5 animate-pulse-once">
                              🎉 Selesai dalam {Number(totalHoursSpent.toFixed(1))} jam belajar
                            </p>

                            {/* Skills Tag Area */}
                            {courseInfo.skills && courseInfo.skills.length > 0 && (
                              <div className="mb-4 flex flex-wrap gap-1.5">
                                {courseInfo.skills.slice(0, 3).map((skill) => (
                                  <span
                                    key={skill}
                                    className="bg-gray-100 text-gray-600 border border-gray-200/50 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {courseInfo.skills.length > 3 && (
                                  <span title={courseInfo.skills.slice(3).join(", ")} className="bg-gray-50 text-gray-400 border border-gray-200/30 rounded-lg px-2 py-0.5 text-[9px] font-bold cursor-help">
                                    +{courseInfo.skills.length - 3} lagi
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center">
                                <span className="font-bold text-gray-600">{courseInfo.platform}</span>
                                {courseInfo.level && (
                                  <span className="ml-2 bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                                    {courseInfo.level}
                                  </span>
                                )}
                              </div>
                              <span className="flex items-center gap-1 font-bold text-green-600">
                                <CheckCircle2 size={12} />
                                100% Selesai
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => courseInfo.url && window.open(courseInfo.url, "_blank")}
                              className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-[#025CB8] border border-[#025CB8] hover:bg-blue-50/50 transition flex items-center justify-center gap-2"
                            >
                              Lihat Kursus
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* kursus rekomendasi — dari API */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
                    <Star size={18} className="text-amber-500 fill-amber-500" />
                    Kursus Rekomendasi
                  </h2>
                </div>

                {enrollMessage && (
                  <div className={`mb-5 flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm animate-scale-in ${enrollMessage.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                    <span className="flex items-center gap-2">
                      {enrollMessage.type === "success" ? <CheckCircle2 size={16} /> : <X size={16} />}
                      {enrollMessage.text}
                    </span>
                    <button onClick={() => setEnrollMessage(null)} className="shrink-0 transition-colors hover:opacity-70">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {isFetchingProfile ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-12 shadow-sm min-h-[240px]">
                    <Loader2 size={36} className="animate-spin text-[#025CB8] mb-3" />
                    <p className="text-sm font-semibold text-gray-500 animate-pulse">Memuat rekomendasi kursus AI...</p>
                  </div>
                ) : recommendedCourseList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                    <Star size={32} className="mx-auto mb-3 text-gray-300 animate-spin-slow" />
                    <p className="text-sm font-semibold text-gray-400">Belum ada rekomendasi</p>
                    <p className="text-xs text-gray-300 mt-1">Upload CV Anda terlebih dahulu agar AI bisa merekomendasikan kursus.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {recommendedCourseList.map((course) => {
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
                                {course.skills.slice(0, 3).map((skill) => (
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
            </>
          ) : (
            <div className="mx-auto max-w-2xl">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="p-6 sm:p-8">
                  <h2 className="mb-6 border-b border-gray-100 pb-4 text-xl font-bold text-gray-800">
                    Edit Profil Saya
                  </h2>

                  {showSavedAlert && (
                    <div className="mb-5 flex items-center justify-between gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-pulse-once">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        Profil berhasil disimpan!
                      </span>
                      <button
                        onClick={() => setShowSavedAlert(false)}
                        className="ml-2 text-green-500 hover:text-green-700 transition-colors shrink-0"
                        title="Tutup"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {!!errorMessage && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {errorMessage}
                    </div>
                  )}

                  {/* avatar */}
                  <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row">
                    <div className="relative">
                      {/* Hidden file input untuk upload avatar */}
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />

                      {avatarPreview || profileDetail?.profile?.avatarUrl ? (
                        <img
                          src={avatarPreview || profileDetail!.profile!.avatarUrl!}
                          alt="Avatar"
                          className="h-24 w-24 rounded-full object-cover shadow-md"
                        />
                      ) : (
                        <div
                          className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-white shadow-md"
                          style={{
                            background:
                              "linear-gradient(135deg, #025CB8, #62AAEA)",
                          }}
                        >
                          {makeInitialAvatar(
                            fullName ||
                              profileDetail?.name ||
                              "U"
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-[#025CB8]"
                      >
                        <Camera size={14} />
                      </button>
                    </div>

                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-bold text-gray-800">
                        {fullName}
                      </h3>

                      <p className="mb-1 text-sm text-gray-500">
                        {profileDetail?.email}
                      </p>

                      <p className="text-sm font-medium text-[#025CB8]">
                        {careerTarget || "Belum diisi"}
                      </p>
                    </div>
                  </div>

                  {/* CV Status */}
                  <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800">
                          <FileText size={18} className="text-[#025CB8]" />
                          Status Analisis CV
                        </h3>
                        {skillCollection.length > 0 ? (
                          <p className="mt-1 text-xs text-gray-500">
                            CV kamu sudah dianalisis oleh AI. Skill dan role kamu telah disesuaikan dengan data terbaru.
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-red-500 font-medium">
                            Kamu belum pernah mengunggah CV atau menganalisis skillmu.
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => window.location.href = "/auth/user-analisis-skill"}
                        className="shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#025CB8] shadow-sm border border-blue-200 transition-colors hover:bg-blue-50"
                      >
                        {skillCollection.length > 0 ? "Perbarui CV" : "Upload CV"}
                      </button>
                    </div>
                  </div>

                  {/* form */}
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-600">
                          Nama Lengkap
                        </label>

                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) =>
                            setFullName(e.target.value)
                          }
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-[#025CB8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-600">
                          Email
                        </label>

                        <input
                          type="email"
                          readOnly
                          value={profileDetail?.email ?? ""}
                          className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-600">
                          Posisi yang Diincar
                        </label>

                        <select
                          value={careerTarget}
                          onChange={(e) =>
                            setCareerTarget(e.target.value)
                          }
                          className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-[#025CB8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Pilih Posisi yang Diincar...</option>
                          {TARGET_CATEGORIES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-600">
                          Level Pengalaman
                        </label>

                        <select
                          value={experienceTier}
                          onChange={(e) =>
                            setExperienceTier(
                              e.target.value
                            )
                          }
                          className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-[#025CB8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option>
                            Fresh Graduate (0-1 tahun)
                          </option>

                          <option>
                            Junior (1-3 tahun)
                          </option>

                          <option>
                            Mid (3-5 tahun)
                          </option>

                          <option>Senior (5+ tahun)</option>
                        </select>
                      </div>
                    </div>

                    {/* skill */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-600">
                        Skill yang Dimiliki

                        <span className="ml-1 font-normal text-gray-400">
                          (tekan enter)
                        </span>
                      </label>

                      <div className="flex min-h-[48px] flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all focus-within:border-[#025CB8] focus-within:ring-2 focus-within:ring-blue-100">
                        {skillCollection.map((skillName) => (
                          <span
                            key={skillName}
                            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-700 shadow-sm"
                          >
                            {skillName}

                            <button
                              onClick={() =>
                                removeSkillTag(skillName)
                              }
                              className="text-gray-400 transition-colors hover:text-red-500"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}

                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) =>
                            setSkillInput(e.target.value)
                          }
                          onKeyDown={handleSkillInput}
                          placeholder={
                            skillCollection.length
                              ? ""
                              : "Tambah skill lalu enter"
                          }
                          className="min-w-[120px] flex-1 bg-transparent text-sm text-gray-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* btn bawah */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 p-6 sm:p-8">
                  <button
                    onClick={restoreForm}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    Batal
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={saveProfileChanges}
                    className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background:
                        "linear-gradient(135deg, #025CB8, #62AAEA)",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Daily Check-in Premium */}
        {isCheckinModalOpen && selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative flex flex-col max-h-[90vh] animate-scale-in">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <Flame size={18} className="text-orange-500 animate-pulse" />
                    Check-in Progress Belajar
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5 line-clamp-1">
                    {selectedCourse.title}
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

              {/* Body */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1 min-h-0">
                {/* Tanggal */}
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

                {/* Progress Input */}
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
                        const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                        setCheckinProgress(val);
                      }}
                      className="w-16 rounded-xl border border-gray-200 px-2 py-1 text-center text-xs font-bold text-gray-700 focus:border-[#025CB8] focus:outline-none focus:ring-1 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Jam Belajar */}
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
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        let val = parseFloat(e.target.value);
                        if (isNaN(val) || val < 0) {
                          val = 0;
                        } else if (val > 24) {
                          val = 24;
                        } else {
                          val = Math.round(val * 10) / 10;
                        }
                        setCheckinHours(val);
                      }}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setCheckinHours(isNaN(val) ? 0 : val);
                      }}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-[#025CB8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Contoh: 1.5"
                    />
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2.5 rounded-xl border border-gray-200">
                      jam
                    </span>
                  </div>
                </div>

                {/* Catatan Belajar */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700">
                    📝 Catatan Belajar (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={checkinNote}
                    onChange={(e) => setCheckinNote(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-[#025CB8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                    placeholder="Apa saja modul atau topik yang kamu pelajari hari ini?..."
                  />
                </div>

                {/* History Logs */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Clock size={14} className="text-purple-500" />
                    Riwayat Check-in Kursus Ini
                  </h4>

                  {isFetchingHistory ? (
                    <div className="flex items-center justify-center py-6 text-gray-400 gap-2">
                      <Loader2 size={16} className="animate-spin text-[#025CB8]" />
                      <span className="text-xs font-medium">Memuat riwayat belajar...</span>
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
                          {/* Dot timeline */}
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
                              <p className="text-[10px] font-bold text-purple-600 mb-1 flex items-center gap-0.5">
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

              {/* Footer */}
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
                  style={{
                    background:
                      "linear-gradient(135deg, #025CB8, #62AAEA)",
                  }}
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

        {/* Custom Modal Konfirmasi Selesai Kursus */}
        {isCompleteModalOpen && courseToComplete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-6 relative flex flex-col items-center text-center animate-scale-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-500 mb-4">
                <CheckCircle2 size={36} />
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                Selesaikan Kursus?
              </h3>

              <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xs">
                Kamu akan menandai <span className="font-bold text-gray-700">"{courseToComplete.title}"</span> sebagai selesai. Progress belajar kamu akan diset ke 100%.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setIsCompleteModalOpen(false);
                    setCourseToComplete(null);
                  }}
                  className="flex-1 rounded-xl py-2.5 border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmComplete}
                  disabled={isCompletingCourse}
                  className="flex-1 rounded-xl py-2.5 text-xs font-bold text-white bg-green-500 hover:bg-green-600 transition-colors shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCompletingCourse ? (
                    <><Loader2 size={16} className="animate-spin" /> Memproses...</>
                  ) : (
                    "Ya, Selesaikan ✓"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilKursus;