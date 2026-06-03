// src/pages/auth/profil/index.tsx
import {
  Camera,
  CheckCircle2,
  FileText,
  Loader2,
  User,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import Sidebar from "@/components/common/sidebar";
import {
  getProfileService,
  updateProfileService,
  UpdateProfilePayload,
  UserWithProfile,
} from "@/services/profile.service";

// Daftar pilihan target karir
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
  "Game Developer",
];

// Buat inisial avatar dari nama lengkap
const makeInitialAvatar = (fullName: string) =>
  fullName
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const ProfilSaya = () => {
  const [sidebarMini, setSidebarMini] = useState(false);

  // Avatar upload ref
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // API state
  const [profileDetail, setProfileDetail] = useState<UserWithProfile | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [careerTarget, setCareerTarget] = useState("");
  const [experienceTier, setExperienceTier] = useState("Fresh Graduate (0-1 tahun)");
  const [skillCollection, setSkillCollection] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Load profil dari API
  const loadProfile = async () => {
    try {
      setIsFetchingProfile(true);
      const profileResponse = await getProfileService();
      const currentUser = profileResponse.user;
      setProfileDetail(currentUser);
      setFullName(currentUser.name ?? "");
      setCareerTarget(currentUser.profile?.targetRole ?? "");
      setExperienceTier(
        currentUser.profile?.experienceLevel ?? "Fresh Graduate (0-1 tahun)"
      );
      setSkillCollection(currentUser.profile?.skills ?? []);
    } catch (fetchErr: any) {
      console.error("profile error:", fetchErr);
      setErrorMessage("Profil gagal dimuat. Coba refresh halaman ya.");
    } finally {
      setIsFetchingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Handlers
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleSkillInput = (keyboardEvent: React.KeyboardEvent<HTMLInputElement>) => {
    const cleanSkill = skillInput.trim();
    if (keyboardEvent.key !== "Enter" || !cleanSkill) return;
    keyboardEvent.preventDefault();
    setSkillCollection((prev) =>
      prev.includes(cleanSkill) ? prev : [...prev, cleanSkill]
    );
    setSkillInput("");
  };

  const removeSkillTag = (deletedSkill: string) => {
    setSkillCollection((prev) => prev.filter((s) => s !== deletedSkill));
  };

  const restoreForm = () => {
    if (!profileDetail) return;
    setFullName(profileDetail.name ?? "");
    setCareerTarget(profileDetail.profile?.targetRole ?? "");
    setExperienceTier(
      profileDetail.profile?.experienceLevel ?? "Fresh Graduate (0-1 tahun)"
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
        targetRole: careerTarget,
        experienceLevel: experienceTier || undefined,
        skills: skillCollection,
      };
      const updatedProfile = await updateProfileService(requestBody);
      setProfileDetail(updatedProfile.user);
      setShowSavedAlert(true);
      window.setTimeout(() => setShowSavedAlert(false), 5000);
    } catch (saveErr: any) {
      setErrorMessage(
        saveErr?.response?.data?.message || "Profil gagal disimpan. Coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading State ─────────────────────────────────────────────────────────
  if (isFetchingProfile) {
    return (
      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar collapsed={sidebarMini} setCollapsed={setSidebarMini} />
        <main
          className={`pb-24 pt-[72px] transition-all duration-300 lg:pb-8 lg:pt-0 ${
            sidebarMini ? "lg:ml-[90px]" : "lg:ml-[260px]"
          }`}
        >
          <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-[#025CB8] mb-4" size={48} />
            <p className="text-gray-500 font-semibold animate-pulse">Memuat profil...</p>
          </div>
        </main>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar collapsed={sidebarMini} setCollapsed={setSidebarMini} />

      <div
        className={`pb-24 lg:pb-10 transition-all duration-300 ${
          sidebarMini ? "lg:ml-[90px]" : "lg:ml-[260px]"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 px-5 py-4 backdrop-blur-md lg:px-8">
          <div className="mx-auto max-w-3xl flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <User size={16} className="text-[#025CB8]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Profil Saya</h1>
              <p className="text-xs text-gray-400">Kelola data & informasi akun kamu</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-6 px-5 pt-6 lg:px-8">
          {/* Card Edit Profil */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <h2 className="mb-6 border-b border-gray-100 pb-4 text-xl font-bold text-gray-800">
                Edit Profil Saya
              </h2>

              {/* Alert Sukses */}
              {showSavedAlert && (
                <div className="mb-5 flex items-center justify-between gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-pulse-once">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Profil berhasil disimpan!
                  </span>
                  <button
                    onClick={() => setShowSavedAlert(false)}
                    className="ml-2 text-green-500 hover:text-green-700 transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Alert Error */}
              {!!errorMessage && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              {/* Avatar */}
              <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative">
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
                      style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                    >
                      {makeInitialAvatar(fullName || profileDetail?.name || "U")}
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
                  <h3 className="text-lg font-bold text-gray-800">{fullName}</h3>
                  <p className="mb-1 text-sm text-gray-500">{profileDetail?.email}</p>
                  <p className="text-sm font-medium text-[#025CB8]">
                    {careerTarget || "Belum diisi"}
                  </p>
                </div>
              </div>

              {/* Status CV */}
              <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800">
                      <FileText size={18} className="text-[#025CB8]" />
                      Status Analisis CV
                    </h3>
                    {skillCollection.length > 0 ? (
                      <p className="mt-1 text-xs text-gray-500">
                        CV kamu sudah dianalisis oleh AI. Skill dan role telah disesuaikan.
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-red-500 font-medium">
                        Kamu belum pernah mengunggah CV atau menganalisis skillmu.
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/auth/user-analisis-skill")}
                    className="shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#025CB8] shadow-sm border border-blue-200 transition-colors hover:bg-blue-50"
                  >
                    {skillCollection.length > 0 ? "Perbarui CV" : "Upload CV"}
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-600">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
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
                      onChange={(e) => setCareerTarget(e.target.value)}
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
                      onChange={(e) => setExperienceTier(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-[#025CB8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option>Fresh Graduate (0-1 tahun)</option>
                      <option>Junior (1-3 tahun)</option>
                      <option>Mid (3-5 tahun)</option>
                      <option>Senior (5+ tahun)</option>
                    </select>
                  </div>
                </div>

                {/* Skill Tags */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-gray-600">
                    Skill yang Dimiliki{" "}
                    <span className="ml-1 font-normal text-gray-400">(tekan enter)</span>
                  </label>

                  <div className="flex min-h-[48px] flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all focus-within:border-[#025CB8] focus-within:ring-2 focus-within:ring-blue-100">
                    {skillCollection.map((skillName) => (
                      <span
                        key={skillName}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-700 shadow-sm"
                      >
                        {skillName}
                        <button
                          onClick={() => removeSkillTag(skillName)}
                          className="text-gray-400 transition-colors hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillInput}
                      placeholder={skillCollection.length ? "" : "Tambah skill lalu enter"}
                      className="min-w-[120px] flex-1 bg-transparent text-sm text-gray-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Button */}
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
                style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
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
      </div>
    </div>
  );
};

export default ProfilSaya;