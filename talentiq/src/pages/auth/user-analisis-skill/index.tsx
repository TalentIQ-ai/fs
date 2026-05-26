// src/pages/auth/user-analisis-skill/index.tsx

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  FileText,
  SearchX,
  GraduationCap,
  Info,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Trophy,
  Upload,
  User,
  X,
  Zap,
} from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/common/sidebar";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type ExperienceLevel = "" | "fresh" | "junior" | "mid" | "senior";

type AnalyzeStatus =
  | "idle"
  | "processing"
  | "success"
  | "cv_not_found";

const EXPERIENCE_OPTIONS: {
  value: ExperienceLevel;
  label: string;
  desc: string;
}[] = [
    { value: "fresh", label: "Fresh Graduate", desc: "0–1 tahun" },
    { value: "junior", label: "Junior", desc: "1–3 tahun" },
    { value: "mid", label: "Mid", desc: "3–5 tahun" },
    { value: "senior", label: "Senior", desc: "5+ tahun" },
  ];

const INDUSTRY_OPTIONS = [
  "Teknologi",
  "Keuangan",
  "Kesehatan",
  "E-Commerce",
  "Pendidikan",
  "Manufaktur",
  "Media & Kreatif",
  "Pemerintahan",
];

const SKILL_OPTIONS = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Laravel",
  "PHP",
  "Python",
  "Java",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Git",
  "Figma",
  "UI/UX",
  "Public Speaking",
  "Leadership",
];

const LOADING_STEPS = [
  {
    text: "Mengunggah CV...",
    icon: <Upload size={16} />,
    duration: 1200,
  },
  {
    text: "Membaca isi CV...",
    icon: <FileText size={16} />,
    duration: 1600,
  },
  {
    text: "Mencari skill & pengalaman...",
    icon: <Sparkles size={16} />,
    duration: 1700,
  },
  {
    text: "Memvalidasi data CV...",
    icon: <FileSearch size={16} />,
    duration: 1500,
  },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// ─────────────────────────────────────────────────────────────
// INDUSTRY SELECT
// ─────────────────────────────────────────────────────────────
const IndustryMultiSelect = ({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (val: string[]) => void;
}) => {
  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {INDUSTRY_OPTIONS.map((opt) => {
        const active = selected.includes(opt);

        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200
              ${active
                ? "text-white border-transparent"
                : "bg-white text-gray-500 border-gray-200 hover:border-[#025CB8]"
              }`}
            style={
              active
                ? {
                  background:
                    "linear-gradient(135deg, #025CB8, #000000)",
                }
                : {}
            }
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// EXPERIENCE SELECTOR
// ─────────────────────────────────────────────────────────────
const ExperienceSelector = ({
  value,
  onChange,
}: {
  value: ExperienceLevel;
  onChange: (v: ExperienceLevel) => void;
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
    {EXPERIENCE_OPTIONS.map((opt) => {
      const active = value === opt.value;

      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-xl border-2 px-3 py-3 text-center transition-all duration-200
            ${active
              ? "border-[#025CB8] bg-blue-50"
              : "border-gray-200 hover:border-blue-200"
            }`}
        >
          <div
            className={`font-bold text-sm ${active ? "text-[#025CB8]" : "text-gray-700"
              }`}
          >
            {opt.label}
          </div>

          <div className="text-[10px] text-gray-400 mt-1">
            {opt.desc}
          </div>
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────
// SKILL CHECKBOX
// ─────────────────────────────────────────────────────────────
const SkillCheckbox = ({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (val: string[]) => void;
}) => {
  const toggle = (skill: string) => {
    if (selected.includes(skill)) {
      onChange(selected.filter((s) => s !== skill));
    } else {
      onChange([...selected, skill]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {SKILL_OPTIONS.map((skill) => {
        const active = selected.includes(skill);

        return (
          <button
            key={skill}
            type="button"
            onClick={() => toggle(skill)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200
              ${active
                ? "text-white border-transparent"
                : "bg-white border-gray-200 text-gray-600 hover:border-[#025CB8]"
              }`}
            style={
              active
                ? {
                  background:
                    "linear-gradient(135deg, #025CB8, #000000)",
                }
                : {}
            }
          >
            {skill}
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// LOADING OVERLAY
// ─────────────────────────────────────────────────────────────
const LoadingOverlay = ({
  onDone,
}: {
  onDone: () => void;
}) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentStep = 0;

    const totalDuration = LOADING_STEPS.reduce(
      (a, b) => a + b.duration,
      0
    );

    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      const pct = Math.min(
        Math.round((elapsed / totalDuration) * 100),
        98
      );

      setProgress(pct);
    }, 60);

    let cumulative = 0;

    const timers: ReturnType<typeof setTimeout>[] = [];

    LOADING_STEPS.forEach((s, idx) => {
      if (idx === 0) return;

      cumulative += LOADING_STEPS[idx - 1].duration;

      timers.push(
        setTimeout(() => {
          currentStep++;
          setStep(currentStep);
        }, cumulative)
      );
    });

    const finishTimer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      onDone();
    }, totalDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(finishTimer);
      timers.forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-7">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5"
            style={{
              background:
                "linear-gradient(135deg, #025CB8, #000000)",
            }}
          >
            <Loader2
              size={35}
              className="text-white animate-spin"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Memproses CV
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            AI sedang membaca dan menganalisis CV kamu
          </p>
        </div>

        <div className="space-y-3">
          {LOADING_STEPS.map((item, idx) => {
            const active = idx === step;
            const done = idx < step;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300
                  ${active
                    ? "bg-blue-50 border border-blue-200"
                    : done
                      ? "opacity-60"
                      : "opacity-30"
                  }`}
              >
                <div
                  className={`${active
                    ? "text-[#025CB8]"
                    : done
                      ? "text-green-500"
                      : "text-gray-300"
                    }`}
                >
                  {done ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    item.icon
                  )}
                </div>

                <span className="text-sm font-medium">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #025CB8, #000000)",
              }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-2 text-center">
            {progress}% diproses
          </p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const AnalisisSkill = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] =
    useState<File | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [fileError, setFileError] = useState<string | null>(
    null
  );

  const [analyzeStatus, setAnalyzeStatus] =
    useState<AnalyzeStatus>("idle");

  const [targetPosition, setTargetPosition] = useState("");

  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("");

  const [selectedIndustries, setSelectedIndustries] =
    useState<string[]>([]);

  const [knownSkills, setKnownSkills] = useState("");

  const [selectedSkills, setSelectedSkills] = useState<
    string[]
  >([]);

  // FILE VALIDATION
  const validateAndSetFile = useCallback((file: File) => {
    setFileError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError(
        "Format file tidak didukung. Gunakan PDF / DOCX."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("Ukuran file maksimal 5MB.");
      return;
    }

    setUploadedFile(file);
  }, []);

  // DRAG DROP
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      setIsDragging(false);

      const file = e.dataTransfer.files[0];

      if (file) validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) validateAndSetFile(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [validateAndSetFile]
  );

  // ANALYZE
  const handleAnalyze = () => {
    if (!uploadedFile) return;

    setAnalyzeStatus("processing");
  };

  const handleAnalysisDone = () => {
    setAnalyzeStatus("cv_not_found");
  };

  const canAnalyze = !!uploadedFile;

  return (
    <>
      {analyzeStatus === "processing" && (
        <LoadingOverlay onDone={handleAnalysisDone} />
      )}

      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div className={`pb-24 transition-all duration-300 ${collapsed ? "lg:ml-[90px]" : "lg:ml-[260px]"
          }`}>
          {/* HEADER */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 py-4">
            <div className="max-w-5xl mx-auto">
              <nav className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="hover:text-[#025CB8]"
                >
                  Dashboard
                </button>

                <ChevronRight size={12} />

                <span className="text-[#025CB8] font-semibold">
                  Analisis CV
                </span>
              </nav>

              <h1 className="text-2xl font-bold text-gray-800">
                Upload & Analisis CV
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                Upload CV kamu dan biarkan AI menganalisis
                skill serta pengalaman kerja
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="max-w-5xl mx-auto px-5 pt-7">
            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              {/* LEFT */}
              <div className="space-y-5">
                {/* UPLOAD CARD */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <Upload
                      size={18}
                      className="text-[#025CB8]"
                    />

                    <h2 className="font-bold text-gray-700">
                      Upload CV
                    </h2>
                  </div>

                  {!uploadedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer
                        ${isDragging
                          ? "border-[#025CB8] bg-blue-50"
                          : "border-gray-200 hover:border-[#025CB8]"
                        }`}
                    >
                      <div
                        className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
                        style={{
                          background:
                            "linear-gradient(135deg, #025CB8, #000000)",
                        }}
                      >
                        <Upload
                          size={30}
                          className="text-white"
                        />
                      </div>

                      <p className="font-semibold text-gray-700">
                        Klik atau drag file CV ke sini
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        PDF / DOCX • Maksimal 5MB
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInput}
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #025CB8, #000000)",
                        }}
                      >
                        <FileText
                          size={22}
                          className="text-white"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-700">
                          {uploadedFile.name}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {formatBytes(uploadedFile.size)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          setAnalyzeStatus("idle");
                        }}
                        className="w-8 h-8 rounded-lg hover:bg-red-100 flex items-center justify-center"
                      >
                        <X
                          size={15}
                          className="text-red-500"
                        />
                      </button>
                    </div>
                  )}

                  {fileError && (
                    <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      {fileError}
                    </div>
                  )}
                </div>

                {/* WARNING CV NOT FOUND */}
                {analyzeStatus === "cv_not_found" && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        <SearchX
                          size={24}
                          className="text-red-600"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-700">
                          CV Tidak Dapat Dibaca
                        </h3>

                        <p className="text-sm text-red-600 mt-2 leading-relaxed">
                          Sistem tidak menemukan isi CV yang
                          valid atau format CV sulit diproses.
                          <br />
                          Silakan upload ulang CV yang lebih
                          jelas atau isi skill secara manual di
                          bawah.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-5">
                          <button
                            type="button"
                            onClick={() =>
                              fileInputRef.current?.click()
                            }
                            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                            style={{
                              background:
                                "linear-gradient(135deg, #025CB8, #000000)",
                            }}
                          >
                            Upload CV Lagi
                          </button>

                          <button
                            type="button"
                            className="px-4 py-2 rounded-xl border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-100"
                          >
                            Isi Skill Manual
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                  <h2 className="font-bold text-gray-700">
                    Informasi Tambahan
                  </h2>

                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Posisi yang Diincar
                    </label>

                    <div className="relative mt-2">
                      <User
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={targetPosition}
                        onChange={(e) =>
                          setTargetPosition(e.target.value)
                        }
                        placeholder="Frontend Developer"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#025CB8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Level Pengalaman
                    </label>

                    <ExperienceSelector
                      value={experienceLevel}
                      onChange={setExperienceLevel}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Bidang Industri
                    </label>

                    <IndustryMultiSelect
                      selected={selectedIndustries}
                      onChange={setSelectedIndustries}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Pilih Skill yang Kamu Miliki
                    </label>

                    <SkillCheckbox
                      selected={selectedSkills}
                      onChange={setSelectedSkills}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Tambahkan Skill Manual
                    </label>

                    <textarea
                      rows={4}
                      value={knownSkills}
                      onChange={(e) =>
                        setKnownSkills(e.target.value)
                      }
                      placeholder="Contoh: React, Laravel, PostgreSQL..."
                      className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#025CB8] resize-none"
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className={`w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all duration-300
                    ${canAnalyze
                      ? "hover:scale-[1.01]"
                      : "opacity-50 cursor-not-allowed"
                    }`}
                  style={{
                    background:
                      "linear-gradient(135deg, #025CB8, #000000)",
                  }}
                >
                  <Sparkles size={18} />
                  Analisis CV Sekarang
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                {/* AI ANALYSIS */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #025CB8, #000000)",
                      }}
                    >
                      <Sparkles
                        size={16}
                        className="text-white"
                      />
                    </div>

                    <h3 className="font-bold text-gray-700">
                      Yang Dianalisis AI
                    </h3>
                  </div>

                  <ul className="space-y-4">
                    {[
                      {
                        icon: <Zap size={14} />,
                        title: "Skill Teknis",
                      },
                      {
                        icon: <Trophy size={14} />,
                        title: "Pengalaman Kerja",
                      },
                      {
                        icon: (
                          <GraduationCap size={14} />
                        ),
                        title: "Pendidikan",
                      },
                      {
                        icon: (
                          <CheckCircle2 size={14} />
                        ),
                        title: "Sertifikasi",
                      },
                    ].map((item) => (
                      <li
                        key={item.title}
                        className="flex items-center gap-3"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#025CB8]">
                          {item.icon}
                        </div>

                        <span className="text-sm text-gray-600 font-medium">
                          {item.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PRIVACY */}
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock
                      size={16}
                      className="text-green-600"
                    />

                    <h3 className="font-bold text-green-700">
                      Privasi Aman
                    </h3>
                  </div>

                  <p className="text-sm text-green-700 leading-relaxed">
                    Data CV hanya digunakan untuk analisis dan
                    akan dihapus otomatis setelah proses selesai.
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-xs text-green-700 font-semibold">
                    <ShieldCheck size={13} />
                    SSL Encryption
                  </div>
                </div>

                {/* TIPS */}
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Info
                      size={16}
                      className="text-yellow-600"
                    />

                    <h3 className="font-bold text-yellow-700">
                      Tips CV ATS
                    </h3>
                  </div>

                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• Gunakan format PDF</li>
                    <li>• Hindari tabel terlalu banyak</li>
                    <li>• Tambahkan skill secara jelas</li>
                    <li>• Gunakan bullet point pengalaman</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalisisSkill;