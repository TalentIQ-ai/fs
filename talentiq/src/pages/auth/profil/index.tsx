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
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "@/components/common/sidebar";
import {
  getProfileService,
  updateProfileService,
  UpdateProfilePayload,
  UserWithProfile,
} from "@/services/profile.service";

// dummy dulu, nanti tinggal tarik API aja
const enrolledCourseList = [
  {
    id: 1,
    title: "SQL untuk Analisis Data",
    platform: "Dicoding",
    progress: 65,
    lastAccessed: "2 hari lalu",
    accent: "#025CB8",
    bgSoft: "#EFF6FF",
  },
  {
    id: 2,
    title: "Data Manipulation with Python",
    platform: "Coursera",
    progress: 30,
    lastAccessed: "Hari ini",
    accent: "#7C3AED",
    bgSoft: "#F5F3FF",
  },
];

// progress kecil
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

  // api state
  const [profileDetail, setProfileDetail] =
    useState<UserWithProfile | null>(null);

  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showSavedAlert, setShowSavedAlert] = useState(false);

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

        const profileResponse = await getProfileService();
        const currentUser = profileResponse.user;

        setProfileDetail(currentUser);

        setFullName(currentUser.name ?? "");
        setCareerTarget(currentUser.profile?.targetRole ?? "");

        setExperienceTier(
          currentUser.profile?.experienceLevel ??
            "Fresh Graduate (0-1 tahun)"
        );

        setSkillCollection(currentUser.profile?.skills ?? []);
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
        targetRole: careerTarget || undefined,
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
        enrolledCourseList.length,

      completed:
        profileDetail?.profile?.completedCourses ?? 5,

      hours:
        profileDetail?.profile?.totalHours ?? 34,

      streak:
        profileDetail?.profile?.streakDays ?? 7,
    }),
    [profileDetail]
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
              {/* stat */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                    <PlayCircle
                      size={24}
                      className="text-[#025CB8]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Kursus Aktif
                    </p>

                    <p className="text-2xl font-black text-gray-800">
                      {dashboardStats.active}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                    <Award
                      size={24}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Kursus Selesai
                    </p>

                    <p className="text-2xl font-black text-gray-800">
                      {dashboardStats.completed}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                    <Clock
                      size={24}
                      className="text-purple-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Total Jam
                    </p>

                    <p className="text-2xl font-black text-gray-800">
                      {dashboardStats.hours}
                      <span className="ml-1 text-sm font-bold text-gray-500">
                        jam
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 p-5 shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
                  }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                    <Flame
                      size={24}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-600/70">
                      Streak
                    </p>

                    <p className="mt-0.5 text-xl font-black text-orange-600">
                      {dashboardStats.streak} hari 🔥
                    </p>
                  </div>
                </div>
              </div>

              {/* course aktif */}
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800">
                  <PlayCircle
                    size={18}
                    className="text-[#025CB8]"
                  />

                  Kursus Aktif Saya
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {enrolledCourseList.map((courseInfo) => (
                    <div
                      key={courseInfo.id}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex gap-4">
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: courseInfo.bgSoft,
                            color: courseInfo.accent,
                          }}
                        >
                          <BookOpen size={28} />
                        </div>

                        <div className="flex-1">
                          <span className="mb-1 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                            {courseInfo.platform}
                          </span>

                          <h3 className="mb-2 font-bold leading-tight text-gray-800">
                            {courseInfo.title}
                          </h3>

                          <div className="mb-1 flex items-center justify-between text-xs font-bold">
                            <span className="text-gray-500">
                              Progress
                            </span>

                            <span
                              style={{
                                color: courseInfo.accent,
                              }}
                            >
                              {courseInfo.progress}% selesai
                            </span>
                          </div>

                          <ProgressLine
                            percentage={courseInfo.progress}
                            accent={courseInfo.accent}
                          />

                          <p className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock size={10} />

                            Terakhir diakses:
                            {courseInfo.lastAccessed}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex justify-end">
                        <button
                          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
                          style={{
                            background:
                              "linear-gradient(135deg, #025CB8, #62AAEA)",
                          }}
                        >
                          Lanjutkan Belajar

                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                      {profileDetail?.profile?.avatarUrl ? (
                        <img
                          src={profileDetail.profile.avatarUrl}
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

                      <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-[#025CB8]">
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

                        <input
                          type="text"
                          value={careerTarget}
                          onChange={(e) =>
                            setCareerTarget(e.target.value)
                          }
                          placeholder="Contoh: Data Analyst"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-[#025CB8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
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