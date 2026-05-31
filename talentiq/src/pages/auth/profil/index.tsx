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

// dummy dulu, nanti tinggal tarik API aja — dihapus, sekarang pakai data API

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

  // kursus dari dashboard API
  const [activeCourseList, setActiveCourseList] = useState<ActiveCourse[]>([]);
  const [recommendedCourseList, setRecommendedCourseList] = useState<RecommendedCourse[]>([]);

  // form state
  const [fullName, setFullName] = useState("");
  const [careerTarget, setCareerTarget] = useState("");

  const [experienceTier, setExperienceTier] = useState(
    "Fresh Graduate (0-1 tahun)"
  );

  const [skillCollection, setSkillCollection] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsFetchingProfile(true);

        const [profileResponse, dashboardResponse] = await Promise.all([
          getProfileService(),
          getDashboardSummary().catch(() => null),
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

        if (dashboardResponse) {
          setActiveCourseList(dashboardResponse.activeCourses || []);
          setRecommendedCourseList(dashboardResponse.recommendedCourses || []);
        }
      } catch (fetchErr: any) {
        console.error("profile error:", fetchErr);
        setErrorMessage(
          "Profil gagal dimuat. Coba refresh halaman ya."
        );
      } finally {
        setIsFetchingProfile(false);
      }
    };

    loadProfile();
  }, []);

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
      }, 3000);
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

        <div
          className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
            sidebarMini ? "lg:ml-[90px]" : "lg:ml-[260px]"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={32}
              className="animate-spin text-[#025CB8]"
            />

            <p className="text-sm text-gray-500">
              Memuat profil...
            </p>
          </div>
        </div>
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
                      {dashboardStats.active}
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
                      {dashboardStats.completed}
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

                    <p className="text-xl sm:text-2xl font-black text-gray-800">
                      {dashboardStats.hours}
                      <span className="ml-0.5 text-xs sm:text-sm font-bold text-gray-500">
                        j
                      </span>
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

                    <p className="mt-0.5 text-lg sm:text-xl font-black text-orange-600 truncate">
                      {dashboardStats.streak}h 🔥
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

                {activeCourseList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                    <PlayCircle size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-400">Belum ada kursus aktif</p>
                    <p className="text-xs text-gray-300 mt-1">Mulai kursus dari rekomendasi di bawah</p>
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

                      return (
                        <div
                          key={courseInfo.id}
                          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="flex gap-4">
                            <div
                              className="flex h-16 w-16 items-center justify-center rounded-xl shrink-0"
                              style={{ backgroundColor: bgSoft, color: accent }}
                            >
                              <BookOpen size={28} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <span className="mb-1 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                {courseInfo.platform}
                              </span>

                              <h3 className="mb-2 font-bold leading-tight text-gray-800 line-clamp-2">
                                {courseInfo.title}
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

                              <p className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                                <Clock size={10} />
                                Terakhir diakses: {lastAccessedLabel}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex justify-end">
                            <button
                              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
                              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)` }}
                            >
                              Lanjutkan Belajar
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* kursus rekomendasi — dari API */}
              {recommendedCourseList.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800">
                    <Star size={18} className="text-amber-500" />
                    Kursus Rekomendasi
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {recommendedCourseList.map((course, idx) => {
                      const accent = courseAccents[idx % courseAccents.length];
                      const badgeStyle = course.badge === "Direkomendasikan AI"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-green-100 text-green-700";

                      return (
                        <div
                          key={course.id}
                          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {course.category}
                              </span>
                              <h3 className="font-bold text-sm text-gray-800 leading-snug line-clamp-2 mt-0.5">
                                {course.title}
                              </h3>
                            </div>
                            {course.badge && (
                              <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${badgeStyle}`}>
                                {course.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="font-semibold">{course.platform}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {course.duration}
                              </span>
                              <span className="flex items-center gap-1 text-amber-600 font-bold">
                                ★ {course.rating}
                              </span>
                            </div>
                          </div>
                          <button
                            className="w-full mt-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)` }}
                          >
                            Mulai Belajar →
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mx-auto max-w-2xl">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="p-6 sm:p-8">
                  <h2 className="mb-6 border-b border-gray-100 pb-4 text-xl font-bold text-gray-800">
                    Edit Profil Saya
                  </h2>

                  {showSavedAlert && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                      <CheckCircle2 size={16} />

                      Profil berhasil disimpan!
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
      </div>
    </div>
  );
};

export default ProfilKursus;