import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Search,
  Clock,
  Sparkles,
  Target,
  Lock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";

import HeaderComponent from "@/layout/header";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { getPublicJobs, PublicJob } from "@/services/job.service";

const animClass = (
  isVisible: boolean,
  direction: "up" | "down",
  _delay: number,
  _duration = 300
) => {
  const base = "transition-all duration-300 ease-out";
  const hidden = direction === "up"
    ? "opacity-0 translate-y-10"
    : "opacity-0 -translate-y-10";

  return `${base} ${isVisible ? "opacity-100 translate-x-0 translate-y-0" : hidden}`;
};

const getBadgeStyle = (jobType: string) => {
  const t = jobType?.toLowerCase() || "";
  if (t.includes("remote"))    return "bg-blue-50 text-blue-600 border-blue-100";
  if (t.includes("hybrid"))    return "bg-purple-50 text-purple-600 border-purple-100";
  if (t.includes("full"))      return "bg-green-50 text-green-700 border-green-100";
  return "bg-gray-100 text-gray-600 border-gray-200";
};

const JobTypePill = ({ type }: { type: string }) => (
  <span
    className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${getBadgeStyle(type)}`}
  >
    {type || "Hybrid"}
  </span>
);

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
    <div className="h-1 w-full bg-gray-200 animate-pulse" />
    <div className="p-5 sm:p-6 space-y-3 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-gray-100 rounded-full w-24" />
        <div className="h-5 bg-gray-100 rounded-full w-16" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="flex gap-1.5">
        <div className="h-5 bg-gray-100 rounded-full w-16" />
        <div className="h-5 bg-gray-100 rounded-full w-14" />
        <div className="h-5 bg-gray-100 rounded-full w-12" />
      </div>
      <div className="h-10 bg-gray-200 rounded-xl mt-4" />
    </div>
  </div>
);

// ── Vacancy card ──────────────────────────────────────────────────────────────
type VacancyCardProps = {
  vacancy: PublicJob;
  animationDelay: number;
  openModal: () => void;
};

const VacancyCard = ({ vacancy, animationDelay, openModal }: VacancyCardProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`
        bg-white rounded-2xl border border-gray-100 overflow-hidden group
        shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1
        flex flex-col
        ${animClass(isVisible, "up", animationDelay)}
      `}
    >
      <div className="h-1 w-full bg-gradient-to-r from-[#025CB8] to-[#62AAEA]" />

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* top content — grows to fill space */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center
                         text-white font-bold text-sm shrink-0 shadow-sm"
              style={{ backgroundColor: vacancy.logoColor }}
            >
              {vacancy.logoInitials}
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-base sm:text-lg leading-tight
                           text-gray-900 group-hover:text-[#025CB8]
                           transition-colors"
              >
                {vacancy.title}
              </h3>

              <p className="text-sm text-gray-500 mt-0.5">
                {vacancy.company}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} className="text-gray-400" />
              {vacancy.location}
            </span>

            <JobTypePill type={vacancy.workType} />

            <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
              <Clock size={12} />
              {vacancy.postedAt}
            </span>
          </div>

          <p className="text-[#025CB8] font-bold text-sm mb-4">
            {vacancy.salary}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {vacancy.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full font-medium
                           bg-[#025CB8]/8 text-[#025CB8]
                           border border-[#025CB8]/15"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* bottom — always pinned */}
        <div className="mt-5">
          <div className="h-px bg-gray-100 mb-4" />

          <button
            onClick={openModal}
            className="w-full flex items-center justify-center gap-2
                       bg-gradient-to-r from-[#025CB8] to-[#62AAEA]
                       hover:from-[#0147A0] hover:to-[#025CB8]
                       text-white text-sm font-bold py-2.5 rounded-xl
                       transition-all duration-200 shadow-sm"
          >
            Selengkapnya
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Auth popup ────────────────────────────────────────────────────────────────
type AuthPopupProps = {
  closePopup: () => void;
  redirectLogin: () => void;
  redirectRegister: () => void;
};

const AuthPopup = ({ closePopup, redirectLogin, redirectRegister }: AuthPopupProps) => (
  <div
    onClick={closePopup}
    className="fixed inset-0 z-50 flex items-center justify-center
               bg-black/50 backdrop-blur-sm p-4"
  >
    <div
      onClick={(event) => event.stopPropagation()}
      className="bg-white rounded-2xl shadow-2xl
                 w-full max-w-md overflow-hidden"
    >
      <div className="bg-gradient-to-r from-[#025CB8] to-[#62AAEA] px-6 pt-8 pb-10 text-center">
        <div
          className="w-14 h-14 bg-white/20 rounded-full flex
                     items-center justify-center mx-auto mb-4"
        >
          <Lock size={26} className="text-white" />
        </div>

        <p className="text-white/80 text-sm">
          Login dulu buat lihat detail lowongan, analisis skill,
          sampai apply langsung.
        </p>
      </div>

      <div className="px-6 pt-2 pb-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 space-y-3">
          {[
            {
              icon: <Sparkles size={16} className="text-green-600" />,
              text: "Lowongan otomatis sesuai skill",
              bg: "bg-green-50",
            },
            {
              icon: <Target size={16} className="text-orange-500" />,
              text: "Skill gap & target karir",
              bg: "bg-orange-50",
            },
            {
              icon: <Briefcase size={16} className="text-[#025CB8]" />,
              text: "Apply & simpan lowongan favorit",
              bg: "bg-blue-50",
            },
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className={`${feature.bg} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}
              >
                {feature.icon}
              </div>

              <p className="text-sm text-gray-700">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col gap-3">
        <button
          onClick={redirectLogin}
          className="w-full bg-[#025CB8] hover:bg-[#0147A0]
                     text-white font-bold py-3 rounded-xl
                     transition-colors duration-200 shadow-md"
        >
          Masuk ke Akun
        </button>

        <button
          onClick={redirectRegister}
          className="w-full border-2 border-[#025CB8]
                     text-[#025CB8] hover:bg-blue-50
                     font-bold py-3 rounded-xl transition-colors"
        >
          Daftar Gratis Sekarang
        </button>

        <button
          onClick={closePopup}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Lanjut lihat-lihat dulu
        </button>
      </div>
    </div>
  </div>
);

// ── Premium Banner ────────────────────────────────────────────────────────────
const PremiumBanner = ({
  isLoggedIn,
  onLogin,
  onGoToDashboard,
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
  onGoToDashboard: () => void;
}) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`rounded-2xl overflow-hidden mb-10 ${animClass(isVisible, "up", 0)}`}
    >
      <div className="bg-gradient-to-r from-[#025CB8] to-[#62AAEA] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
              {isLoggedIn ? (
                <>
                  Lihat lowongan yang{" "}
                  <span className="underline decoration-white/60">
                    cocok dengan skill kamu!
                  </span>
                </>
              ) : (
                <>
                  Mau tahu lowongan mana yang{" "}
                  <span className="underline decoration-white/60">
                    cocok sama skill kamu?
                  </span>
                </>
              )}
            </h3>

            <p className="text-white/80 text-sm leading-relaxed">
              {isLoggedIn ? (
                "TalentIQ AI telah menganalisis profil dan mencocokkan skill kamu dengan lowongan kerja yang tersedia secara real-time."
              ) : (
                "Setelah login, TalentIQ AI bakal otomatis nyocokin skill kamu dan nampilin lowongan yang udah cocok maupun yang masih perlu upgrade skill."
              )}
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={isLoggedIn ? onGoToDashboard : onLogin}
              className="flex items-center justify-center gap-2
                         bg-white text-[#025CB8] font-bold
                         px-6 py-3 rounded-xl hover:bg-gray-50
                         transition-colors duration-200 shadow-md"
            >
              {isLoggedIn ? "Pergi ke Dashboard" : "Masuk & Analisis Skill"}
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-4 text-white/70 text-xs">
              <span className="flex items-center gap-1">
                <Sparkles size={11} />
                Cocok = ✅
              </span>

              <span>|</span>

              <span className="flex items-center gap-1">
                <Target size={11} />
                Aspirasi = 🎯
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 9;
const DEBOUNCE_MS = 500;

const WORK_TYPE_OPTIONS = [
  { label: "Semua",     value: "" },
  { label: "Remote",    value: "Remote" },
  { label: "Hybrid",    value: "Hybrid" },
  { label: "Full Time", value: "Full Time" },
  { label: "WFO",       value: "WFO" },
] as const;

export default function LowonganKerja() {
  const navigate = useNavigate();

  const [keyword, setKeyword]           = useState("");
  const [locationKw, setLocationKw]     = useState("");
  const [workType, setWorkType]         = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const [jobs, setJobs]             = useState<PublicJob[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs]   = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);

  // debounce refs
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchJobs = useCallback(async (kw: string, loc: string, wt: string, page: number) => {
    try {
      setLoading(true);
      setError(false);
      const res = await getPublicJobs({
        keyword:  kw  || undefined,
        location: loc || undefined,
        workType: wt  || undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      setJobs(res.data);
      setTotalPages(res.totalPages);
      setTotalJobs(res.total);
    } catch (err) {
      console.error("Error fetching public jobs:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchJobs("", "", "", 1);
  }, [fetchJobs]);

  // Debounced search when keyword or location changes
  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchJobs(val, locationKw, workType, 1), DEBOUNCE_MS);
  };

  const handleLocationChange = (val: string) => {
    setLocationKw(val);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchJobs(keyword, val, workType, 1), DEBOUNCE_MS);
  };

  const handleWorkTypeChange = (val: string) => {
    setWorkType(val);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchJobs(keyword, locationKw, val, 1);
  };

  const handleReset = () => {
    setKeyword("");
    setLocationKw("");
    setWorkType("");
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchJobs("", "", "", 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchJobs(keyword, locationKw, workType, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount = [keyword, locationKw, workType].filter(Boolean).length;

  const {
    ref: headingRef,
    isVisible: headingVisible,
  } = useScrollAnimation();

  // Build page numbers to show (max 5 visible)
  const pageNumbers = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, currentPage - 2);
    const end   = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderComponent />

      <div
        className="px-4 sm:px-8 lg:px-[50px]
                   pt-[100px] pb-10 flex-1
                   max-w-7xl mx-auto w-full"
      >
        {/* heading */}
        <div
          ref={headingRef}
          className={`mb-6 ${animClass(headingVisible, "up", 0)}`}
        >
          <h1 className="text-[#025CB8] text-3xl sm:text-5xl font-bold mb-2">
            Lowongan Kerja
          </h1>

          {isLoggedIn ? (
            <p className="text-gray-500 text-sm sm:text-base">
              Jelajahi ribuan lowongan yang dianalisis otomatis sesuai dengan skill kamu.
            </p>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">
              Jelajahi ribuan lowongan atau{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#025CB8] font-semibold underline hover:no-underline"
              >
                masuk
              </button>{" "}
              buat lihat lowongan yang paling relate sama skill kamu.
            </p>
          )}
        </div>

        {/* search */}
        <div
          className={`flex flex-col sm:flex-row flex-wrap gap-3 mb-6
            ${animClass(headingVisible, "up", 80)}`}
        >
          <div
            className="flex flex-1 min-w-[200px] items-center
                       bg-white rounded-xl border border-gray-200
                       shadow-sm overflow-hidden
                       focus-within:border-[#025CB8] transition-colors"
          >
            <Search size={18} className="ml-4 text-gray-400 shrink-0" />

            <input
              type="text"
              value={keyword}
              placeholder="Masukkan nama lowongan kerja"
              onChange={(e) => handleKeywordChange(e.target.value)}
              className="flex-1 px-3 py-3 sm:py-4 bg-transparent
                         outline-none text-sm sm:text-base text-gray-700"
            />
          </div>

          <div
            className="flex flex-1 min-w-[200px] items-center
                       bg-white rounded-xl border border-gray-200
                       shadow-sm overflow-hidden
                       focus-within:border-[#025CB8] transition-colors"
          >
            <MapPin size={18} className="ml-4 text-gray-400 shrink-0" />

            <input
              type="text"
              value={locationKw}
              placeholder="Masukkan kota atau wilayah"
              onChange={(e) => handleLocationChange(e.target.value)}
              className="flex-1 px-3 py-3 sm:py-4 bg-transparent
                         outline-none text-sm sm:text-base text-gray-700"
            />
          </div>

          <button
            onClick={() => { if (debounceRef.current) clearTimeout(debounceRef.current); fetchJobs(keyword, locationKw, workType, 1); setCurrentPage(1); }}
            className="bg-[#025CB8] hover:bg-[#014a94]
                       transition-all text-white font-bold
                       px-8 py-3 sm:py-4 rounded-xl shadow-md
                       flex items-center gap-2 text-sm sm:text-base"
          >
            <Search size={16} />
            Cari
          </button>
        </div>

        {/* filter bar */}
        <div className={`flex flex-wrap items-center gap-2 mb-6 ${animClass(headingVisible, "up", 120)}`}>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold mr-1">
            <SlidersHorizontal size={14} />
            Filter:
          </div>

          {WORK_TYPE_OPTIONS.map((opt) => {
            const isActive = workType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleWorkTypeChange(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#025CB8] text-white border-[#025CB8] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#025CB8]/40 hover:text-[#025CB8] hover:bg-blue-50"
                  }`}
              >
                {opt.label}
              </button>
            );
          })}

          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition-all ml-auto"
            >
              <X size={12} />
              Reset ({activeFilterCount})
            </button>
          )}
        </div>

        <PremiumBanner
          isLoggedIn={isLoggedIn}
          onLogin={() => navigate("/login")}
          onGoToDashboard={() => navigate("/dashboard")}
        />

        {/* count + active tags */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div
            className="flex items-center gap-2
                       bg-[#025CB8]/10 text-[#025CB8]
                       px-3 py-1.5 rounded-lg
                       text-sm font-bold"
          >
            <Briefcase size={15} />
            {workType || "Semua"} Lowongan
          </div>

          {keyword && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              <Search size={11} />
              {keyword}
              <button onClick={() => handleKeywordChange("")} className="ml-0.5 hover:text-red-500 transition-colors">
                <X size={11} />
              </button>
            </span>
          )}
          {locationKw && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              <MapPin size={11} />
              {locationKw}
              <button onClick={() => handleLocationChange("")} className="ml-0.5 hover:text-red-500 transition-colors">
                <X size={11} />
              </button>
            </span>
          )}

          <span className="text-sm text-gray-400 ml-auto">
            {loading ? "Memuat..." : `${totalJobs.toLocaleString("id-ID")} lowongan ditemukan`}
          </span>
        </div>

        {/* error state */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-gray-500 font-semibold">Gagal memuat data lowongan.</p>
            <button
              onClick={() => fetchJobs(keyword, locationKw, workType, currentPage)}
              className="mt-4 px-5 py-2.5 bg-[#025CB8] text-white font-bold rounded-xl text-sm hover:bg-[#014a94] transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* loading skeleton */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* empty state */}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-center text-gray-400 text-lg py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p>Tidak ada lowongan yang sesuai pencarian.</p>
          </div>
        )}

        {/* job cards */}
        {!loading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {jobs.map((vacancy, idx) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                animationDelay={idx * 80}
                openModal={() => {
                  if (isLoggedIn) {
                    if (vacancy.url) {
                      window.open(vacancy.url, "_blank", "noopener,noreferrer");
                    } else {
                      navigate("/auth/lowongan_kerja");
                    }
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* bottom CTA */}
        <div
          className="bg-gradient-to-r from-gray-900 to-[#025CB8]
                     rounded-2xl p-6 sm:p-8 mb-8
                     flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-1">
              Lihat lowongan yang{" "}
              <span className="text-[#62AAEA]">✅ cocok</span> dan{" "}
              <span className="text-orange-300">🎯 aspirasi</span> kamu
            </h3>

            <p className="text-white/70 text-sm">
              AI bakal otomatis mencocokkan skill kamu
              dengan ribuan lowongan.
            </p>
          </div>

          <button
            onClick={() => navigate(isLoggedIn ? "/auth/lowongan_kerja" : "/login")}
            className="flex items-center gap-2 bg-white text-[#025CB8]
                       font-bold px-6 py-3 rounded-xl hover:bg-gray-100
                       transition-colors duration-200 shadow-md"
          >
            {isLoggedIn ? "Pergi ke Dashboard" : "Masuk Sekarang"}
            <ArrowRight size={16} />
          </button>
        </div>

        {/* pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center sm:justify-end items-center gap-2 pb-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500
                         hover:bg-[#025CB8] hover:text-white hover:border-[#025CB8]
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>

            {pageNumbers.map((pageNumber) => {
              const isActive = pageNumber === currentPage;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200
                    ${isActive
                      ? "bg-[#025CB8] text-white shadow-md"
                      : "bg-white text-gray-500 border border-gray-200 hover:bg-[#025CB8] hover:text-white"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500
                         hover:bg-[#025CB8] hover:text-white hover:border-[#025CB8]
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {isAuthModalOpen && (
        <AuthPopup
          closePopup={() => setIsAuthModalOpen(false)}
          redirectLogin={() => navigate("/login")}
          redirectRegister={() => navigate("/register")}
        />
      )}
    </div>
  );
}