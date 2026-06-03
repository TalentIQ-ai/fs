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

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/common/sidebar";
import { updateProfileService, analyzeCvService } from "@/services/profile.service";
import axiosClient from "@/apis/axios-client";

// tipe basic
type CareerLevel = "" | "fresh" | "junior" | "mid" | "senior";

type CvProcessState =
  | "idle"
  | "processing"
  | "success"
  | "cv_not_found";

const careerLevelOptions: {
  value: CareerLevel;
  label: string;
  desc: string;
}[] = [
    {
      value: "fresh",
      label: "Fresh Graduate",
      desc: "0–1 tahun",
    },
    {
      value: "junior",
      label: "Junior",
      desc: "1–3 tahun",
    },
    {
      value: "mid",
      label: "Mid",
      desc: "3–5 tahun",
    },
    {
      value: "senior",
      label: "Senior",
      desc: "5+ tahun",
    },
  ];

const industryChoices = [
  "Teknologi",
  "Keuangan",
  "Kesehatan",
  "E-Commerce",
  "Pendidikan",
  "Manufaktur",
  "Media & Kreatif",
  "Pemerintahan",
];

const SKILLS_BY_INDUSTRY: Record<string, string[]> = {
  "Teknologi": ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "Laravel", "PHP", "Python", "Java", "SQL", "PostgreSQL", "MongoDB", "Git", "Figma", "UI/UX"],
  "Keuangan": ["Accounting", "Financial Modeling", "SAP", "ERP", "Audit", "Excel", "Data Analysis", "Statistics", "Power BI", "Tableau", "Market Research", "Problem Solving"],
  "Kesehatan": ["Healthcare Admin", "Medical Coding", "Public Health", "Communication", "Problem Solving", "Teamwork", "Attention to Detail", "Time Management"],
  "E-Commerce": ["Digital Marketing", "SEO", "SEM", "Google Ads", "Meta Ads", "Content Marketing", "Social Media", "CRM", "Sales", "Business Development", "Google Analytics"],
  "Pendidikan": ["Teaching", "Curriculum Design", "Public Speaking", "Communication", "Leadership", "Notion", "Trello", "English Proficiency"],
  "Manufaktur": ["Operations", "Supply Chain", "Quality Control", "SAP", "ERP", "Project Management", "Agile", "Problem Solving"],
  "Media & Kreatif": ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere Pro", "Canva", "Graphic Design", "Illustration", "Video Editing", "Content Creation", "UI/UX", "Creativity"],
  "Pemerintahan": ["Policy Analysis", "Public Administration", "Research", "Stakeholder Management", "Communication", "Negotiation", "Leadership"]
};

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

const loadingFlow = [
  {
    label: "Mengunggah CV...",
    icon: <Upload size={16} />,
    duration: 500,
  },
  {
    label: "Membaca isi CV...",
    icon: <FileText size={16} />,
    duration: 500,
  },
  {
    label: "Mendeteksi skill & pengalaman...",
    icon: <Sparkles size={16} />,
    duration: 600,
  },
  {
    label: "Validasi data CV...",
    icon: <FileSearch size={16} />,
    duration: 600,
  },
];

const acceptedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// helper kecil
const prettyFileSize = (size: number) => {
  switch (true) {
    case size < 1024:
      return `${size} B`;

    case size < 1024 * 1024:
      return `${(size / 1024).toFixed(1)} KB`;

    default:
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
};

// toggle helper
const updateSelectedValue = (
  currentValue: string[],
  nextValue: string
) =>
  currentValue.includes(nextValue)
    ? currentValue.filter((entry) => entry !== nextValue)
    : [...currentValue, nextValue];

// pilih industri
const IndustryPicker = ({
  activeIndustries,
  onSelect,
}: {
  activeIndustries: string[];
  onSelect: (next: string[]) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {industryChoices.map((industryName) => {
        const isActive =
          activeIndustries.includes(industryName);

        return (
          <button
            key={industryName}
            type="button"
            onClick={() =>
              onSelect(
                updateSelectedValue(
                  activeIndustries,
                  industryName
                )
              )
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200
              ${isActive
                ? "text-white border-transparent"
                : "bg-white text-gray-500 border-gray-200 hover:border-[#025CB8]"
              }`}
            style={
              isActive
                ? {
                  background:
                    "linear-gradient(135deg, #025CB8, #000000)",
                }
                : {}
            }
          >
            {industryName}
          </button>
        );
      })}
    </div>
  );
};

// pilih level exp
const CareerLevelSelector = ({
  currentLevel,
  onPick,
}: {
  currentLevel: CareerLevel;
  onPick: (level: CareerLevel) => void;
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
    {careerLevelOptions.map((careerItem) => {
      const selected =
        currentLevel === careerItem.value;

      return (
        <button
          key={careerItem.value}
          type="button"
          onClick={() => onPick(careerItem.value)}
          className={`rounded-xl border-2 px-3 py-3 text-center transition-all duration-200
            ${selected
              ? "border-[#025CB8] bg-blue-50"
              : "border-gray-200 hover:border-blue-200"
            }`}
        >
          <div
            className={`font-bold text-sm ${selected
              ? "text-[#025CB8]"
              : "text-gray-700"
              }`}
          >
            {careerItem.label}
          </div>

          <div className="text-[10px] text-gray-400 mt-1">
            {careerItem.desc}
          </div>
        </button>
      );
    })}
  </div>
);

// skill picker
const SkillPicker = ({
  selectedSkills,
  onUpdate,
  availableSkills,
}: {
  selectedSkills: string[];
  onUpdate: (next: string[]) => void;
  availableSkills: string[];
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {availableSkills.map((skillName) => {
        const checked =
          selectedSkills.includes(skillName);

        return (
          <button
            key={skillName}
            type="button"
            onClick={() =>
              onUpdate(
                updateSelectedValue(
                  selectedSkills,
                  skillName
                )
              )
            }
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200
              ${checked
                ? "text-white border-transparent"
                : "bg-white border-gray-200 text-gray-600 hover:border-[#025CB8]"
              }`}
            style={
              checked
                ? {
                  background:
                    "linear-gradient(135deg, #025CB8, #000000)",
                }
                : {}
            }
          >
            {skillName}
          </button>
        );
      })}
    </div>
  );
};

// overlay loading
const CvLoadingOverlay = ({
  uploadProgress,
  apiCompleted,
  onFinish,
}: {
  uploadProgress: number;
  apiCompleted: boolean;
  onFinish: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingPercent, setLoadingPercent] = useState(0);

  useEffect(() => {
    let active = true;
    let step = 0;
    let currentPct = 0;

    let step1Timer = 0;
    const step1Duration = 800; // 800ms for reading CV

    const interval = setInterval(() => {
      if (!active) return;

      let targetPct = 0;

      if (uploadProgress < 100) {
        // Step 0: Uploading
        step = 0;
        targetPct = Math.round(uploadProgress * 0.25); // 0% to 25%
      } else if (!apiCompleted) {
        // Upload complete, waiting/processing API
        if (step1Timer < step1Duration) {
          // Step 1: Reading CV (mock animation)
          step = 1;
          step1Timer += 30;
          const ratio = step1Timer / step1Duration;
          targetPct = 25 + Math.round(ratio * 25); // 25% to 50%
        } else {
          // Step 2: Detecting skills (AI processing)
          step = 2;
          targetPct = 70; // holds at 70% during API call
        }
      } else {
        // API Completed
        // Step 3: Validating CV data
        step = 3;
        targetPct = 100;
      }

      setCurrentStep(step);

      // Smoothly interpolate loadingPercent towards targetPct
      if (currentPct < targetPct) {
        const stepSize = step === 3 ? 3 : 1.5;
        currentPct = Math.min(currentPct + stepSize, targetPct);
        setLoadingPercent(Math.round(currentPct));
      }

      // Check for finish completion
      if (apiCompleted && currentPct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (active) onFinish();
        }, 300);
      }
    }, 30);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [uploadProgress, apiCompleted, onFinish]);

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
              className="animate-spin text-white"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Memproses CV
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            AI lagi membaca isi CV kamu...
          </p>
        </div>

        <div className="space-y-3">
          {loadingFlow.map((flowItem, idx) => {
            const activeStep =
              idx === currentStep;

            const completedStep =
              idx < currentStep;

            return (
              <div
                key={flowItem.label}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300
                  ${activeStep
                    ? "bg-blue-50 border border-blue-200"
                    : completedStep
                      ? "opacity-60"
                      : "opacity-30"
                  }`}
              >
                <div
                  className={`${activeStep
                    ? "text-[#025CB8]"
                    : completedStep
                      ? "text-green-500"
                      : "text-gray-300"
                    }`}
                >
                  {completedStep ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    flowItem.icon
                  )}
                </div>

                <span className="text-sm font-medium text-gray-700">
                  {flowItem.label}
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
                width: `${loadingPercent}%`,
                background:
                  "linear-gradient(90deg, #025CB8, #000000)",
              }}
            />
          </div>

          <p className="text-xs text-gray-400 text-center mt-2">
            {loadingPercent}% diproses
          </p>
        </div>
      </div>
    </div>
  );
};

// main page
const AnalisisSkill = () => {
  const navigate = useNavigate();

  const uploadInputRef =
    useRef<HTMLInputElement>(null);

  const [sidebarMini, setSidebarMini] =
    useState(false);

  const [cvFile, setCvFile] =
    useState<File | null>(null);

  const [dragActive, setDragActive] =
    useState(false);

  const [uploadError, setUploadError] =
    useState<string | null>(null);

  const [analysisState, setAnalysisState] =
    useState<CvProcessState>("idle");

  const [showManualForm, setShowManualForm] = useState(false);

  const [careerTarget, setCareerTarget] =
    useState("");

  const [careerLevel, setCareerLevel] =
    useState<CareerLevel>("");

  const [preferredIndustries, setPreferredIndustries] =
    useState<string[]>([]);

  const [manualSkills, setManualSkills] =
    useState("");

  const [selectedSkillTags, setSelectedSkillTags] =
    useState<string[]>([]);

  const [apiCompleted, setApiCompleted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const availableSkills = useMemo(() => {
    if (preferredIndustries.length === 0) {
      // Fallback: gabungan seluruh skill
      return Array.from(new Set(Object.values(SKILLS_BY_INDUSTRY).flat()));
    }
    const skillsSet = new Set<string>();
    preferredIndustries.forEach((ind) => {
      const skills = SKILLS_BY_INDUSTRY[ind] || [];
      skills.forEach((s) => skillsSet.add(s));
    });
    return Array.from(skillsSet);
  }, [preferredIndustries]);

  const verifyFile = useCallback(
    (incomingFile: File) => {
      setUploadError(null);

      const invalidType =
        !acceptedMimeTypes.includes(
          incomingFile.type
        );

      const oversizedFile =
        incomingFile.size >
        5 * 1024 * 1024;

      switch (true) {
        case invalidType:
          setUploadError(
            "Format file belum didukung. Pakai PDF / DOCX ya."
          );
          return;

        case oversizedFile:
          setUploadError(
            "Ukuran file maksimal 5MB."
          );
          return;

        default:
          setCvFile(incomingFile);
      }
    },
    []
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(true);
    },
    []
  );

  const handleDragExit = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
    },
    []
  );

  const handleDropFile = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      setDragActive(false);

      const droppedFile =
        e.dataTransfer.files?.[0];

      droppedFile && verifyFile(droppedFile);
    },
    [verifyFile]
  );

  const handleChooseFile = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const selectedFile =
        e.target.files?.[0];

      selectedFile &&
        verifyFile(selectedFile);

      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
    },
    [verifyFile]
  );

  const startAnalysis = async () => {
    if (!cvFile || !careerTarget) return;

    setAnalysisState("processing");
    setApiCompleted(false);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const response = await analyzeCvService(cvFile, careerTarget, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total) || 0;
        setUploadProgress(percent);
      });
      const { profile } = response.data;
      setCareerLevel((profile.experienceLevel as CareerLevel) || "fresh");
      setSelectedSkillTags(profile.skills || []);
      
      setApiCompleted(true);
    } catch (error: any) {
      console.error("Analysis error:", error);
      setAnalysisState("cv_not_found");
    }
  };

  // finishAnalysis sudah tidak dipakai, dihapus.

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const saveManualData = async () => {
    setSaveError(null);
    setIsSaving(true);
    try {
      const combinedSkills = [
        ...selectedSkillTags,
        ...manualSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ];
      await updateProfileService({
        name: "",
        targetRole: careerTarget,
        experienceLevel: careerLevel,
        skills: combinedSkills,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setSaveError(
        err?.response?.data?.message ||
          "Gagal menyimpan. Coba lagi."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isFormFilled = useMemo(() => {
    return Boolean(
      careerLevel !== "" ||
      preferredIndustries.length > 0 ||
      selectedSkillTags.length > 0 ||
      manualSkills.trim() !== ""
    );
  }, [careerLevel, preferredIndustries, selectedSkillTags, manualSkills]);

  const shouldSaveManual = useMemo(() => {
    return (
      analysisState === "cv_not_found" ||
      (showManualForm && (cvFile === null || isFormFilled))
    );
  }, [analysisState, showManualForm, cvFile, isFormFilled]);

  return (
    <>
      {analysisState === "processing" && (
        <CvLoadingOverlay
          uploadProgress={uploadProgress}
          apiCompleted={apiCompleted}
          onFinish={() => setAnalysisState("success")}
        />
      )}

      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar
          collapsed={sidebarMini}
          setCollapsed={setSidebarMini}
        />

        <div
          className={`pb-24 transition-all duration-300 ${sidebarMini
            ? "lg:ml-[90px]"
            : "lg:ml-[260px]"
            }`}
        >
          {/* topbar */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 py-4">
            <div className="max-w-5xl mx-auto">
              <nav className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                <button
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  className="hover:text-[#025CB8]"
                >
                  Dashboard
                </button>

                <ChevronRight size={12} />

                <span className="font-semibold text-[#025CB8]">
                  Analisis CV
                </span>
              </nav>

              <h1 className="text-2xl font-bold text-gray-800">
                Upload & Analisis CV
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                Upload CV lalu biarkan AI bantu
                analisis skill dan pengalamanmu
              </p>
            </div>
          </div>

          {/* content */}
          <div className="max-w-5xl mx-auto px-5 pt-7">
            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              {/* kiri */}
              {analysisState === "success" ? (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-center p-10 h-fit">
                  <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 bg-green-100">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Analisis CV Berhasil!</h2>
                  <p className="text-gray-500 mb-8">
                    AI telah memproses profil kamu dan menyusun rekomendasi karir.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="px-8 py-4 rounded-2xl text-white font-bold text-base transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, #025CB8, #000000)" }}
                  >
                    Ke Dashboard Sekarang
                  </button>
                </div>
              ) : (
              <div className="space-y-5">
                {/* PILIH TARGET ROLE */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={18} className="text-[#025CB8]" />
                    <h2 className="font-bold text-gray-700">
                      Pilih Target Karir
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Pilih posisi pekerjaan yang ingin Anda tuju agar AI dapat mencocokkan CV Anda dengan akurat.
                  </p>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={careerTarget}
                      onChange={(e) => setCareerTarget(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#025CB8] appearance-none bg-white font-medium text-gray-800"
                    >
                      <option value="">Pilih Posisi yang Diincar...</option>
                      {TARGET_CATEGORIES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm transition-opacity duration-300 ${!careerTarget ? 'opacity-40 pointer-events-none' : ''}`}>
                  <div className="flex items-center gap-2 mb-5">
                    <Upload
                      size={18}
                      className="text-[#025CB8]"
                    />

                    <h2 className="font-bold text-gray-700">
                      Upload CV
                    </h2>
                  </div>

                  {!cvFile ? (
                    <>
                    <div
                      onDragOver={handleDragEnter}
                      onDragLeave={handleDragExit}
                      onDrop={handleDropFile}
                      onClick={() =>
                        uploadInputRef.current?.click()
                      }
                      className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-300 cursor-pointer
                        ${dragActive
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
                        Klik atau drag CV ke sini
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        PDF / DOCX • max 5MB
                      </p>

                      <input
                        ref={uploadInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChooseFile}
                      />
                    </div>

                    {/* Divider + Tombol Isi Manual */}
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 font-semibold">atau</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowManualForm(true)}
                      className="w-full mt-3 py-3 rounded-2xl border-2 border-dashed border-[#025CB8] text-[#025CB8] font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all duration-200"
                    >
                      <Sparkles size={16} />
                      Tidak punya CV? Isi Manual
                    </button>
                    </>
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
                          {cvFile.name}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {prettyFileSize(
                            cvFile.size
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCvFile(null);
                          setAnalysisState("idle");
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

                  {uploadError && (
                    <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      {uploadError}
                    </div>
                  )}
                </div>

                {analysisState === "cv_not_found" && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                          <SearchX
                            size={24}
                            className="text-red-600"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-red-700">
                            CV Tidak Bisa Dibaca
                          </h3>

                          <p className="text-sm text-red-600 mt-2 leading-relaxed">
                            Sistem belum menemukan isi CV
                            yang valid atau format CV agak
                            susah diproses.
                            <br />
                            Upload ulang CV yang lebih
                            jelas atau isi manual skill di
                            bawah ya.
                          </p>

                          <div className="flex flex-wrap gap-3 mt-5">
                            <button
                              type="button"
                              onClick={() =>
                                uploadInputRef.current?.click()
                              }
                              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                              style={{
                                background:
                                  "linear-gradient(135deg, #025CB8, #000000)",
                              }}
                            >
                              Upload CV Lagi
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {(analysisState === "cv_not_found" || showManualForm) && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Sparkles
                            size={18}
                            className="text-[#025CB8]"
                          />

                          <h2 className="font-bold text-gray-700">
                            Lengkapi Profil Secara Manual
                          </h2>
                        </div>
                        {showManualForm && analysisState !== "cv_not_found" && (
                          <button
                            type="button"
                            onClick={() => setShowManualForm(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 leading-relaxed">
                        Silakan lengkapi informasi berikut agar kami tetap bisa menyusun rekomendasi karir dan analisis kesiapan kerja Anda secara akurat.
                      </p>

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
                            value={careerTarget}
                            disabled
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600">
                          Level Pengalaman
                        </label>

                        <CareerLevelSelector
                          currentLevel={
                            careerLevel
                          }
                          onPick={setCareerLevel}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600">
                          Bidang Industri
                        </label>

                        <IndustryPicker
                          activeIndustries={
                            preferredIndustries
                          }
                          onSelect={
                            setPreferredIndustries
                          }
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600">
                          Pilih Skill
                        </label>

                        <SkillPicker
                          selectedSkills={
                            selectedSkillTags
                          }
                          onUpdate={
                            setSelectedSkillTags
                          }
                          availableSkills={
                            availableSkills
                          }
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600">
                          Tambah Skill Manual
                        </label>

                        <textarea
                          rows={4}
                          value={manualSkills}
                          onChange={(e) =>
                            setManualSkills(
                              e.target.value
                            )
                          }
                          placeholder="Contoh: React, Laravel, PostgreSQL..."
                          className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#025CB8] resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error simpan */}
                  {saveError && (
                    <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      {saveError}
                    </div>
                  )}

                <button
                  type="button"
                  onClick={shouldSaveManual ? saveManualData : startAnalysis}
                  disabled={
                    shouldSaveManual
                      ? isSaving || !careerTarget.trim()
                      : !cvFile || !careerTarget.trim()
                  }
                  className={`w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all duration-300
                    ${
                      (shouldSaveManual
                        ? isSaving || !careerTarget.trim()
                        : !cvFile || !careerTarget.trim())
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-[1.01]"
                    }`}
                  style={{
                    background:
                      "linear-gradient(135deg, #025CB8, #000000)",
                  }}
                >
                  {shouldSaveManual ? (
                    isSaving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Simpan Data Analisis
                      </>
                    )
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analisis CV Sekarang
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
              )}

              {/* kanan */}
              <div className="space-y-4">
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
                      Yang Dicek AI
                    </h3>
                  </div>

                  <ul className="space-y-4">
                    {[
                      {
                        icon: <Zap size={14} />,
                        label: "Skill Teknis",
                      },
                      {
                        icon: (
                          <Trophy size={14} />
                        ),
                        label: "Pengalaman Kerja",
                      },
                      {
                        icon: (
                          <GraduationCap
                            size={14}
                          />
                        ),
                        label: "Pendidikan",
                      },
                      {
                        icon: (
                          <CheckCircle2
                            size={14}
                          />
                        ),
                        label: "Sertifikasi",
                      },
                    ].map((infoCard) => (
                      <li
                        key={infoCard.label}
                        className="flex items-center gap-3"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#025CB8]">
                          {infoCard.icon}
                        </div>

                        <span className="text-sm text-gray-600 font-medium">
                          {infoCard.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

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
                    Data CV hanya dipakai buat
                    analisis dan otomatis dihapus
                    setelah proses selesai.
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-xs text-green-700 font-semibold">
                    <ShieldCheck size={13} />
                    SSL Encryption
                  </div>
                </div>

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
                    <li>• Pakai format PDF</li>
                    <li>
                      • Jangan terlalu banyak tabel
                    </li>
                    <li>
                      • Tulis skill dengan jelas
                    </li>
                    <li>
                      • Gunakan bullet point pengalaman
                    </li>
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