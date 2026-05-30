import { useMemo, useState } from "react";
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
} from "lucide-react";

import HeaderComponent from "@/layout/header";
import {
  useScrollAnimation,
  animClass,
} from "@/hooks/use-scroll-animation";

// dummy data dulu, nanti tinggal ganti API
const vacancyList = [
  {
    id: 1,
    title: "AI Engineer",
    company: "PT Mencari Cinta Sejati",
    logo: "MC",
    logoColor: "#025CB8",
    type: "Remote",
    location: "Jakarta, Indonesia",
    time: "3 hari yang lalu",
    salary: "Rp 12.000.000 – 18.000.000",
    tags: ["Python", "TensorFlow", "NLP"],
    image:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/ynrvbh81_expires_30_days.png",
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "PT Jaya",
    logo: "PJ",
    logoColor: "#42B549",
    type: "Full Time",
    location: "Bandung, Indonesia",
    time: "1 hari yang lalu",
    salary: "Rp 10.000.000 – 15.000.000",
    tags: ["Python", "SQL", "Machine Learning"],
    image:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/vwduqjia_expires_30_days.png",
  },
  {
    id: 3,
    title: "IT Support",
    company: "PT Mencari Cinta Sejati",
    logo: "MC",
    logoColor: "#EE4D2D",
    type: "Remote",
    location: "Jakarta, Indonesia",
    time: "2 hari yang lalu",
    salary: "Rp 5.000.000 – 8.000.000",
    tags: ["Networking", "Troubleshooting", "Linux"],
    image:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/65inp3wt_expires_30_days.png",
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "PT Lorem Ipsum",
    logo: "LI",
    logoColor: "#1BA0E2",
    type: "Full Time",
    location: "Surabaya, Indonesia",
    time: "3 jam yang lalu",
    salary: "Rp 9.000.000 – 14.000.000",
    tags: ["React", "Node.js", "PostgreSQL"],
    image:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/cvssz671_expires_30_days.png",
  },
  {
    id: 5,
    title: "Network Support",
    company: "PT Cahaya Ilahi",
    logo: "CI",
    logoColor: "#FF5A00",
    type: "Full Time",
    location: "Bali, Indonesia",
    time: "9 jam yang lalu",
    salary: "Rp 6.000.000 – 9.000.000",
    tags: ["Cisco", "CCNA", "Monitoring"],
    image:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/9ulmqsvk_expires_30_days.png",
  },
];

const getBadgeStyle = (jobType: string) => {
  switch (jobType) {
    case "Remote":
      return "bg-blue-50 text-blue-600 border-blue-100";

    case "Hybrid":
      return "bg-purple-50 text-purple-600 border-purple-100";

    case "Full Time":
      return "bg-green-50 text-green-700 border-green-100";

    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const JobTypePill = ({ type }: { type: string }) => (
  <span
    className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${getBadgeStyle(
      type
    )}`}
  >
    {type}
  </span>
);

type VacancyCardProps = {
  vacancy: typeof vacancyList[0];
  animationDelay: number;
  openModal: () => void;
};

const VacancyCard = ({
  vacancy,
  animationDelay,
  openModal,
}: VacancyCardProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`
        bg-white rounded-2xl border border-gray-100 overflow-hidden group
        shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1
        ${animClass(isVisible, "up", animationDelay)}
      `}
    >
      <div className="h-1 w-full bg-gradient-to-r from-[#025CB8] to-[#62AAEA]" />

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center
                       text-white font-bold text-sm shrink-0 shadow-sm"
            style={{ backgroundColor: vacancy.logoColor }}
          >
            {vacancy.logo}
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

          <JobTypePill type={vacancy.type} />

          <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Clock size={12} />
            {vacancy.time}
          </span>
        </div>

        <p className="text-[#025CB8] font-bold text-sm mb-4">
          {vacancy.salary} / bulan
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {vacancy.tags.map((techStack) => (
            <span
              key={techStack}
              className="text-xs px-2 py-0.5 rounded-full font-medium
                         bg-[#025CB8]/8 text-[#025CB8]
                         border border-[#025CB8]/15"
            >
              {techStack}
            </span>
          ))}
        </div>

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
  );
};

type AuthPopupProps = {
  closePopup: () => void;
  redirectLogin: () => void;
  redirectRegister: () => void;
};

const AuthPopup = ({
  closePopup,
  redirectLogin,
  redirectRegister,
}: AuthPopupProps) => (
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

        <h2 className="text-white text-xl font-bold mb-1">
          Fitur Eksklusif Member
        </h2>

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

const PremiumBanner = ({ onLogin }: { onLogin: () => void }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`rounded-2xl overflow-hidden mb-10 ${animClass(
        isVisible,
        "up",
        0
      )}`}
    >
      <div className="bg-gradient-to-r from-[#025CB8] to-[#62AAEA] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <div
              className="inline-flex items-center gap-2 bg-white/20
                         text-white text-xs font-bold
                         px-3 py-1 rounded-full mb-3"
            >
              <Sparkles size={13} />
              Fitur Eksklusif Member
            </div>

            <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
              Mau tahu lowongan mana yang{" "}
              <span className="underline decoration-white/60">
                cocok sama skill kamu?
              </span>
            </h3>

            <p className="text-white/80 text-sm leading-relaxed">
              Setelah login, TalentIQ AI bakal otomatis nyocokin skill kamu
              dan nampilin lowongan yang udah cocok maupun yang masih perlu upgrade skill.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onLogin}
              className="flex items-center justify-center gap-2
                         bg-white text-[#025CB8] font-bold
                         px-6 py-3 rounded-xl hover:bg-gray-50
                         transition-colors duration-200 shadow-md"
            >
              Masuk & Analisis Skill
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

export default function LowonganKerja() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [regionKeyword, setRegionKeyword] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const {
    ref: headingRef,
    isVisible: headingVisible,
  } = useScrollAnimation();

  const visibleVacancies = useMemo(() => {
    return vacancyList.filter(({ title, location }) => {
      const matchTitle = title
        .toLowerCase()
        .includes(keyword.toLowerCase());

      const matchLocation = location
        .toLowerCase()
        .includes(regionKeyword.toLowerCase());

      return matchTitle && matchLocation;
    });
  }, [keyword, regionKeyword]);

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
              onChange={(e) => setKeyword(e.target.value)}
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
              value={regionKeyword}
              placeholder="Masukkan kota atau wilayah"
              onChange={(e) => setRegionKeyword(e.target.value)}
              className="flex-1 px-3 py-3 sm:py-4 bg-transparent
                         outline-none text-sm sm:text-base text-gray-700"
            />
          </div>

          <button
            className="bg-[#025CB8] hover:bg-[#014a94]
                       transition-all text-white font-bold
                       px-8 py-3 sm:py-4 rounded-xl shadow-md
                       flex items-center gap-2 text-sm sm:text-base"
          >
            <Search size={16} />
            Cari
          </button>
        </div>

        <PremiumBanner onLogin={() => navigate("/login")} />

        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex items-center gap-2
                       bg-[#025CB8]/10 text-[#025CB8]
                       px-3 py-1.5 rounded-lg
                       text-sm font-bold"
          >
            <Briefcase size={15} />
            Semua Lowongan
          </div>

          <span className="text-sm text-gray-400">
            {visibleVacancies.length} lowongan ditemukan
          </span>
        </div>

        {!visibleVacancies.length ? (
          <div className="text-center text-gray-400 text-lg py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p>Tidak ada lowongan yang sesuai pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {visibleVacancies.map((vacancy, idx) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                animationDelay={idx * 80}
                openModal={() => setIsAuthModalOpen(true)}
              />
            ))}
          </div>
        )}

        {/* bawah */}
        <div
          className="bg-gradient-to-r from-gray-900 to-[#025CB8]
                     rounded-2xl p-6 sm:p-8 mb-8
                     flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="flex-1 text-center sm:text-left">
            <p
              className="text-white/70 text-xs font-bold
                         uppercase tracking-wider mb-1"
            >
              Untuk Member TalentIQ AI
            </p>

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
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-white text-[#025CB8]
                       font-bold px-6 py-3 rounded-xl hover:bg-gray-100
                       transition-colors duration-200 shadow-md"
          >
            Masuk Sekarang
            <ArrowRight size={16} />
          </button>
        </div>

        {/* pagination dummy */}
        <div className="flex justify-center sm:justify-end gap-3">
          {[1, 2, 3].map((pageNumber) => {
            const isActive = pageNumber === 1;

            return (
              <button
                key={pageNumber}
                className={`px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition-colors duration-200
                  ${isActive
                    ? "bg-[#025CB8] text-white shadow-md"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-[#025CB8] hover:text-white"
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
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