import {
  Bookmark,
  Briefcase,
  Building2,
  ChevronDown,
  Filter,
  GraduationCap,
  MapPin,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

import Sidebar from "@/components/common/sidebar";

// dummy data dulu
const recommendedVacancies = [
  {
    id: 1,
    role: "Junior Data Analyst",
    companyName: "PT Tokopedia Tbk",
    accentColor: "#42B549",
    city: "Jakarta",
    workMode: "Hybrid",
    income: "Rp 8.000.000 – 12.000.000 / bulan",
    compatibility: 92,
    matchedStacks: ["Python", "SQL", "Excel"],
  },
  {
    id: 2,
    role: "Data Analyst",
    companyName: "Gojek Indonesia",
    accentColor: "#00AA13",
    city: "Jakarta",
    workMode: "WFO",
    income: "Rp 10.000.000 – 15.000.000 / bulan",
    compatibility: 85,
    matchedStacks: ["SQL", "Data Analysis", "Python"],
  },
  {
    id: 3,
    role: "Data Operations Specialist",
    companyName: "Traveloka",
    accentColor: "#1BA0E2",
    city: "Tangerang",
    workMode: "Remote",
    income: "Rp 7.500.000 – 11.000.000 / bulan",
    compatibility: 88,
    matchedStacks: ["Excel", "SQL", "Communication"],
  },
  {
    id: 4,
    role: "BI Analyst (Junior)",
    companyName: "Shopee",
    accentColor: "#EE4D2D",
    city: "Jakarta",
    workMode: "Hybrid",
    income: "Rp 9.000.000 – 13.000.000 / bulan",
    compatibility: 82,
    matchedStacks: ["SQL", "Python"],
  },
];

const futureTargets = [
  {
    id: 11,
    role: "Senior Data Analyst",
    companyName: "Bank Jago",
    accentColor: "#FF5A00",
    city: "Jakarta",
    workMode: "Hybrid",
    income: "Rp 15.000.000 – 25.000.000 / bulan",
    compatibility: 65,
    currentSkills: ["SQL", "Python"],
    requiredSkills: ["Tableau", "Power BI", "A/B Testing"],
  },
  {
    id: 12,
    role: "Data Scientist",
    companyName: "Ruangguru",
    accentColor: "#3B82F6",
    city: "Remote",
    workMode: "Remote",
    income: "Rp 12.000.000 – 20.000.000 / bulan",
    compatibility: 58,
    currentSkills: ["Python", "SQL"],
    requiredSkills: ["Machine Learning", "Scikit-learn"],
  },
  {
    id: 13,
    role: "Machine Learning Engineer",
    companyName: "Telkomsel",
    accentColor: "#E3000F",
    city: "Jakarta",
    workMode: "WFO",
    income: "Rp 14.000.000 – 22.000.000 / bulan",
    compatibility: 45,
    currentSkills: ["Python"],
    requiredSkills: ["Deep Learning", "TensorFlow", "Cloud (AWS/GCP)"],
  },
  {
    id: 14,
    role: "BI Developer",
    companyName: "Astra International",
    accentColor: "#00529C",
    city: "Jakarta",
    workMode: "Hybrid",
    income: "Rp 11.000.000 – 16.000.000 / bulan",
    compatibility: 72,
    currentSkills: ["SQL", "Excel"],
    requiredSkills: ["Power BI", "Data Warehousing"],
  },
];

const filterButtonStyle =
  "flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition";

const JobCard = ({
  vacancy,
  aspirational = false,
}: {
  vacancy: any;
  aspirational?: boolean;
}) => {
  const isFutureRole = aspirational;

  return (
    <div
      className={`bg-white p-5 rounded-2xl border shadow-sm group flex flex-col relative overflow-hidden transition-all hover:shadow-md
      ${isFutureRole ? "border-gray-200/60" : "border-gray-100"}
    `}
    >
      {isFutureRole && (
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-50 blur-3xl opacity-60 pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-4 relative z-10 mb-4">
        <div className="flex gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm"
            style={{ backgroundColor: vacancy.accentColor }}
          >
            {vacancy.companyName[0]}
          </div>

          <div>
            <h3
              className={`font-bold text-base transition-colors
                ${isFutureRole
                  ? "group-hover:text-orange-600"
                  : "group-hover:text-[#025CB8]"
                }
              `}
            >
              {vacancy.role}
            </h3>

            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <Building2 size={14} />
              {vacancy.companyName}
            </p>
          </div>
        </div>

        <div
          className={`px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap border
            ${isFutureRole
              ? "bg-orange-50 border-orange-200 text-orange-600"
              : "bg-indigo-50 border-indigo-100 text-indigo-700"
            }
          `}
        >
          Match {vacancy.compatibility}%
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600 mb-4 relative z-10">
        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
          <MapPin size={12} />
          {vacancy.city}
        </span>

        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
          <Briefcase size={12} />
          {vacancy.workMode}
        </span>
      </div>

      <p
        className={`text-sm font-bold mb-4 relative z-10 ${isFutureRole ? "text-gray-700" : "text-green-700"
          }`}
      >
        {vacancy.income}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-100 relative z-10">
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Skill Cocok
          </p>

          <div className="flex flex-wrap gap-2">
            {(isFutureRole
              ? vacancy.currentSkills
              : vacancy.matchedStacks
            ).map((skill: string) => (
              <span
                key={skill}
                className="px-2 py-1 rounded-md border border-green-100 bg-green-50 text-green-700 text-[10px] font-bold"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {isFutureRole && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Perlu Dipelajari
            </p>

            <div className="flex flex-wrap gap-2">
              {vacancy.requiredSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md border border-red-100 bg-red-50 text-red-600 text-[10px] font-bold"
                >
                  + {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-6 relative z-10">
        <button
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95
            ${isFutureRole
              ? "bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
              : "bg-[#025CB8] text-white hover:bg-blue-700 shadow-md"
            }
          `}
        >
          {isFutureRole
            ? "Lihat Kursus yang Dibutuhkan"
            : "Lamar Sekarang"}
        </button>

        <button
          className={`p-2.5 rounded-xl border-2 transition-colors
            ${isFutureRole
              ? "border-gray-200 text-gray-400 hover:text-gray-600"
              : "border-gray-200 text-gray-500 hover:text-gray-700"
            }
          `}
        >
          <Bookmark size={18} />
        </button>
      </div>
    </div>
  );
};

const CariLowongan = () => {
  const [keyword, setKeyword] = useState("");
  const [sidebarMini, setSidebarMini] = useState(false);

  const filteredRecommendations = useMemo(() => {
    if (!keyword.trim()) return recommendedVacancies;

    const normalized = keyword.toLowerCase();

    return recommendedVacancies.filter((vacancy) => {
      const searchableContent = [
        vacancy.role,
        vacancy.companyName,
        vacancy.city,
        ...vacancy.matchedStacks,
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalized);
    });
  }, [keyword]);

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar
        collapsed={sidebarMini}
        setCollapsed={setSidebarMini}
      />

      <div
        className={`pb-24 lg:pb-10 transition-all duration-300 ${sidebarMini ? "lg:ml-[90px]" : "lg:ml-[260px]"
          }`}
      >
        {/* top section */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Briefcase
                className="text-[#025CB8]"
                size={22}
              />
              Cari Lowongan Kerja
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={keyword}
                  placeholder="Cari posisi, perusahaan, atau skill..."
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#025CB8] shadow-sm transition-all"
                />
              </div>

              <button className="px-6 py-3 bg-[#025CB8] text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                <Search size={16} />
                Cari
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button className={filterButtonStyle}>
                <MapPin size={14} />
                Lokasi
                <ChevronDown size={14} />
              </button>

              <button className={filterButtonStyle}>
                <Briefcase size={14} />
                Tipe Kerja
                <ChevronDown size={14} />
              </button>

              <button className={filterButtonStyle}>
                <GraduationCap size={14} />
                Level
                <ChevronDown size={14} />
              </button>

              <button className={filterButtonStyle}>
                <Filter size={14} />
                Industri
                <ChevronDown size={14} />
              </button>

              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2" />

              <button className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition flex items-center gap-1">
                <X size={14} />
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Menampilkan 47 lowongan untuk:
                <span className="text-[#025CB8]">
                  {" "}
                  Data Analyst
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Berdasarkan skill kamu:
                <span className="font-semibold text-gray-700">
                  {" "}
                  Python, SQL, Excel
                </span>
              </p>
            </div>

            <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 shadow-sm">
              Urutkan:
              <span className="text-[#025CB8]">
                {" "}
                Paling Relevan
              </span>
            </div>
          </div>

          {/* cocok */}
          <section>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 font-bold text-sm rounded-lg mb-2">
                <Sparkles size={16} />
                Skill Kamu Sudah Mumpuni
              </div>

              <p className="text-sm text-gray-500">
                Kamu memenuhi 80%+ kualifikasi untuk posisi-posisi ini.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRecommendations.map((vacancy) => (
                <JobCard
                  key={vacancy.id}
                  vacancy={vacancy}
                />
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="px-5 py-2 bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 transition shadow-sm">
                Muat Lebih Banyak Lowongan
              </button>
            </div>
          </section>

          {/* garis pembatas */}
          <div className="relative py-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-gray-200" />
            </div>

            <div className="relative bg-[#F7F9FC] px-4 text-sm font-bold text-gray-400">
              — Tingkatkan skill kamu untuk posisi berikut —
            </div>
          </div>

          {/* target berikutnya */}
          <section className="pb-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 font-bold text-sm rounded-lg mb-2">
                <Target size={16} />
                Perlu Tingkatkan Skill Dulu
              </div>

              <p className="text-sm text-gray-500">
                Kamu memenuhi 40-79% kualifikasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {futureTargets.map((vacancy) => (
                <JobCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  aspirational
                />
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="px-5 py-2 bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 transition shadow-sm">
                Muat Lebih Banyak Aspirasi
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CariLowongan;