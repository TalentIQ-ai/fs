// src/pages/auth/user-analisis-skill/index.tsx
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
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

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type ExperienceLevel = "" | "fresh" | "junior" | "mid" | "senior";

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; desc: string }[] = [
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

const LOADING_STEPS = [
  { text: "Membaca CV...", icon: <FileText size={16} />, duration: 1500 },
  { text: "Mengidentifikasi skill...", icon: <Sparkles size={16} />, duration: 2000 },
  { text: "Membandingkan dengan data industri...", icon: <Zap size={16} />, duration: 2000 },
  { text: "Selesai!", icon: <CheckCircle2 size={16} />, duration: 800 },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// ─────────────────────────────────────────────────────────────────────────────
// INDUSTRY BADGE MULTISELECT
// ─────────────────────────────────────────────────────────────────────────────
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
    <div className="flex flex-wrap gap-2 mt-1">
      {INDUSTRY_OPTIONS.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 select-none
              ${
                active
                  ? "text-white border-transparent shadow-md scale-105"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-[#025CB8]"
              }`}
            style={
              active
                ? { background: "linear-gradient(135deg, #025CB8, #3B82C4)" }
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

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE SELECTOR
// ─────────────────────────────────────────────────────────────────────────────
const ExperienceSelector = ({
  value,
  onChange,
}: {
  value: ExperienceLevel;
  onChange: (v: ExperienceLevel) => void;
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
    {EXPERIENCE_OPTIONS.map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 text-center transition-all duration-200
            ${
              active
                ? "border-[#025CB8] bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"
            }`}
        >
          <span
            className={`text-sm font-bold ${active ? "text-[#025CB8]" : "text-gray-700"}`}
          >
            {opt.label}
          </span>
          <span className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</span>
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOADING OVERLAY
// ─────────────────────────────────────────────────────────────────────────────
const LoadingOverlay = ({ onDone }: { onDone: () => void }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let currentStep = 0;
    let currentProgress = 0;
    const totalDuration = LOADING_STEPS.reduce((a, s) => a + s.duration, 0);

    const advanceStep = () => {
      if (currentStep >= LOADING_STEPS.length - 1) {
        setDone(true);
        setTimeout(onDone, 1000);
        return;
      }
      currentStep++;
      setStep(currentStep);
    };

    // Progress animation
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / totalDuration) * 100), 98);
      currentProgress = pct;
      setProgress(pct);
    }, 50);

    // Step timers
    let cumulative = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    LOADING_STEPS.forEach((s, idx) => {
      if (idx === 0) return; // step 0 is initial
      cumulative += LOADING_STEPS[idx - 1].duration;
      timers.push(setTimeout(advanceStep, cumulative));
    });

    return () => {
      clearInterval(progressInterval);
      timers.forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* Animated icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full opacity-30 animate-ping"
            style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
          />
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
          >
            {done ? (
              <CheckCircle2 size={36} className="text-white" />
            ) : (
              <Loader2 size={36} className="text-white animate-spin" />
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {LOADING_STEPS.map((s, idx) => {
            const isActive = idx === step;
            const isDone = idx < step || done;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${
                  isActive
                    ? "bg-blue-50 border border-blue-200"
                    : isDone
                    ? "opacity-50"
                    : "opacity-30"
                }`}
              >
                <span
                  className={`flex-shrink-0 ${
                    isDone ? "text-green-500" : isActive ? "text-[#025CB8]" : "text-gray-300"
                  }`}
                >
                  {isDone ? <CheckCircle2 size={16} /> : s.icon}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-[#025CB8]" : isDone ? "text-gray-500" : "text-gray-300"
                  }`}
                >
                  {s.text}
                </span>
                {isActive && !done && (
                  <Loader2 size={13} className="ml-auto text-[#025CB8] animate-spin flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-2">
          <div
            className="h-2.5 rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${done ? 100 : progress}%`,
              background: "linear-gradient(90deg, #025CB8, #62AAEA)",
            }}
          />
        </div>
        <p className="text-xs text-gray-400 font-medium">
          {done ? "100% — Analisis selesai!" : `${progress}% diproses`}
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const AnalisisSkill = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Form state
  const [targetPosition, setTargetPosition] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [knownSkills, setKnownSkills] = useState("");

  // Loading state
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ── File validation ────────────────────────────────────────────────────────
  const validateAndSetFile = useCallback((file: File) => {
    setFileError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Format tidak didukung. Gunakan PDF atau DOCX.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Ukuran file melebihi 5MB.");
      return;
    }
    setUploadedFile(file);
  }, []);

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

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
      // reset so same file can re-trigger
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [validateAndSetFile]
  );

  // ── Analysis submit ────────────────────────────────────────────────────────
  const handleAnalyze = () => {
    if (!uploadedFile) return;
    setIsAnalyzing(true);
  };

  const handleAnalysisDone = () => {
    setIsAnalyzing(false);
    navigate("/dashboard");
  };

  const canAnalyze = !!uploadedFile;

  // ── File extension badge ───────────────────────────────────────────────────
  const getExtColor = (name: string) => {
    if (name.endsWith(".pdf")) return { bg: "#FEF2F2", text: "#DC2626" };
    return { bg: "#EFF6FF", text: "#025CB8" };
  };

  return (
    <>
      {isAnalyzing && <LoadingOverlay onDone={handleAnalysisDone} />}

      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar />

        <div className="lg:ml-[260px] pb-24 lg:pb-10">

          {/* ── STICKY HEADER ─────────────────────────────────────────────── */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 lg:px-8 py-4">
            <div className="max-w-5xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="hover:text-[#025CB8] transition-colors font-medium"
                >
                  Dashboard
                </button>
                <ChevronRight size={12} />
                <span className="text-[#025CB8] font-semibold">Analisis CV</span>
              </nav>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-lg font-bold text-gray-800">
                    Unggah &amp; Analisis CV Kamu
                  </h1>
                  <p className="text-sm text-gray-400 mt-0.5">
                    AI kami akan membaca CV kamu dan mengidentifikasi skill yang kamu miliki
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full flex-shrink-0">
                  <ShieldCheck size={13} className="text-green-500" />
                  <span className="font-medium text-green-700">Aman &amp; Privat</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
          <div className="max-w-5xl mx-auto px-5 lg:px-8 pt-7">
            <div className="flex flex-col lg:flex-row gap-6">

              {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
              <div className="flex-1 space-y-5">

                {/* ── UPLOAD ZONE ─────────────────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Upload size={15} className="text-[#025CB8]" />
                    Upload CV Kamu
                  </h2>

                  {!uploadedFile ? (
                    // Drop zone
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
                        flex flex-col items-center justify-center py-14 px-6 text-center group
                        ${
                          isDragging
                            ? "border-[#025CB8] bg-blue-50 scale-[1.01]"
                            : fileError
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-gray-50 hover:border-[#025CB8] hover:bg-blue-50/50"
                        }`}
                    >
                      {/* Animated background blob */}
                      <div
                        className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
                          isDragging ? "opacity-10" : "opacity-0"
                        }`}
                        style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                      />

                      {/* Upload icon */}
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                          isDragging
                            ? "scale-110 shadow-lg"
                            : "group-hover:scale-105 group-hover:shadow-md"
                        }`}
                        style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}
                      >
                        {isDragging ? (
                          <Sparkles size={30} className="text-[#025CB8]" />
                        ) : (
                          <Upload size={30} className="text-[#025CB8]" />
                        )}
                      </div>

                      <p className="text-gray-700 font-semibold text-base mb-1">
                        {isDragging
                          ? "Lepaskan file di sini!"
                          : "Seret CV kamu ke sini, atau klik untuk memilih file"}
                      </p>
                      <p className="text-xs text-gray-400 mb-5">
                        Format yang didukung:{" "}
                        <span className="font-semibold text-gray-500">PDF, DOCX</span>
                        {" "}(Maks. 5MB)
                      </p>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-5 py-2.5 rounded-xl border-2 border-[#025CB8] text-[#025CB8] text-sm font-semibold
                          hover:bg-[#025CB8] hover:text-white transition-all duration-200 active:scale-95"
                      >
                        Pilih File
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileInput}
                      />
                    </div>
                  ) : (
                    // File preview card
                    <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-4 flex items-center gap-4">
                      {/* File icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ background: getExtColor(uploadedFile.name).bg }}
                      >
                        <FileText
                          size={22}
                          style={{ color: getExtColor(uploadedFile.name).text }}
                        />
                      </div>

                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {uploadedFile.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">
                            {formatBytes(uploadedFile.size)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                            <CheckCircle2 size={12} />
                            Siap dianalisis
                          </span>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          setFileError(null);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400
                          hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* Error message */}
                  {fileError && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      {fileError}
                    </div>
                  )}
                </div>

                {/* ── FORM TAMBAHAN ────────────────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                  <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Info size={15} className="text-[#025CB8]" />
                    Informasi Tambahan
                    <span className="text-[10px] font-normal text-gray-400 ml-1">
                      (opsional, membantu analisis lebih akurat)
                    </span>
                  </h2>

                  {/* Posisi target */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Posisi / Jabatan yang Diincar
                    </label>
                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        value={targetPosition}
                        onChange={(e) => setTargetPosition(e.target.value)}
                        placeholder="Contoh: Data Analyst, Backend Developer, UI/UX Designer"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                          placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200
                          focus:border-[#025CB8] transition-all duration-200 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Level pengalaman */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Level Pengalaman
                    </label>
                    <ExperienceSelector
                      value={experienceLevel}
                      onChange={setExperienceLevel}
                    />
                  </div>

                  {/* Bidang industri */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Bidang Industri yang Diminati{" "}
                      {selectedIndustries.length > 0 && (
                        <span className="text-[#025CB8] font-bold">
                          ({selectedIndustries.length} dipilih)
                        </span>
                      )}
                    </label>
                    <IndustryMultiSelect
                      selected={selectedIndustries}
                      onChange={setSelectedIndustries}
                    />
                  </div>

                  {/* Skill yang diketahui */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Skill yang Kamu Tahu Dimiliki{" "}
                      <span className="text-gray-400 font-normal">(opsional)</span>
                    </label>
                    <textarea
                      value={knownSkills}
                      onChange={(e) => setKnownSkills(e.target.value)}
                      rows={3}
                      placeholder="Contoh: Python, SQL, Excel, komunikasi publik, manajemen proyek..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700
                        placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200
                        focus:border-[#025CB8] transition-all duration-200 bg-gray-50 focus:bg-white
                        resize-none leading-relaxed"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Pisahkan dengan koma. AI akan memverifikasi dari CV kamu.
                    </p>
                  </div>
                </div>

                {/* ── ACTION BUTTONS ───────────────────────────────────── */}
                <div className="flex flex-col items-center gap-3 pb-2">
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold
                      transition-all duration-300 shadow-lg
                      ${
                        canAnalyze
                          ? "text-white hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                      }`}
                    style={
                      canAnalyze
                        ? { background: "linear-gradient(135deg, #025CB8, #3B82C4)" }
                        : {}
                    }
                  >
                    {canAnalyze ? (
                      <>
                        <Sparkles size={18} className="animate-pulse" />
                        Analisis Sekarang
                        <ArrowRight size={18} />
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Upload CV terlebih dahulu
                      </>
                    )}
                  </button>

                  {!canAnalyze && (
                    <p className="text-xs text-gray-400 text-center">
                      Upload file CV kamu (PDF/DOCX) untuk mengaktifkan tombol analisis
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#025CB8] transition-colors font-medium"
                  >
                    Lewati, analisis manual
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* ── RIGHT PANEL (info) ──────────────────────────────────── */}
              <div className="lg:w-72 space-y-4">

                {/* Card — Apa yang dianalisis AI */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                    >
                      <Sparkles size={15} className="text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-700">
                      Apa yang Dianalisis AI?
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { icon: <Zap size={14} />, label: "Skill Teknis", desc: "Bahasa pemrograman, tools, framework" },
                      { icon: <Trophy size={14} />, label: "Pengalaman Kerja", desc: "Durasi, posisi, dan tanggung jawab" },
                      { icon: <GraduationCap size={14} />, label: "Pendidikan", desc: "Jurusan, universitas, IPK" },
                      { icon: <CheckCircle2 size={14} />, label: "Sertifikasi", desc: "Lisensi dan kualifikasi profesional" },
                    ].map((item) => (
                      <li key={item.label} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-[#025CB8] mt-0.5">
                          {item.icon}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card — Privasi */}
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                      <Lock size={14} className="text-green-600" />
                    </div>
                    <h3 className="text-sm font-bold text-green-800">Privasi Kamu Aman</h3>
                  </div>
                  <p className="text-xs text-green-700 leading-relaxed">
                    CV kamu hanya digunakan untuk analisis dan{" "}
                    <span className="font-semibold">tidak dibagikan ke pihak ketiga</span>.
                    Data dienkripsi dan dihapus otomatis setelah 24 jam.
                  </p>
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] text-green-600 font-semibold">
                    <ShieldCheck size={11} />
                    <span>Enkripsi SSL 256-bit</span>
                  </div>
                </div>

                {/* Card — Tips */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Info size={14} className="text-amber-600" />
                    </div>
                    <h3 className="text-sm font-bold text-amber-800">Tips CV Terbaik</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {[
                      "Gunakan format ATS-friendly (tidak banyak tabel/kolom)",
                      "Sertakan kata kunci skill secara eksplisit",
                      "Tulis deskripsi pekerjaan dengan bullet points",
                    ].map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-[11px] text-amber-700">
                        <span className="flex-shrink-0 mt-0.5 text-amber-500">•</span>
                        {tip}
                      </li>
                    ))}
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