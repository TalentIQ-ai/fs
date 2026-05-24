// src/pages/auth/lowongan_kerja/index.tsx
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
import { useState } from "react";

import Sidebar from "@/components/common/sidebar";

// ─────────────────────────────────────────────────────────────────────────────
// DATA MOCKS
// ─────────────────────────────────────────────────────────────────────────────
const matchedJobs = [
  {
    id: 1,
    title: "Junior Data Analyst",
    company: "PT Tokopedia Tbk",
    logoColor: "#42B549",
    location: "Jakarta",
    type: "Hybrid",
    salary: "Rp 8.000.000 – 12.000.000 / bulan",
    match: 92,
    matchedSkills: ["Python", "SQL", "Excel"],
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Gojek Indonesia",
    logoColor: "#00AA13",
    location: "Jakarta",
    type: "WFO",
    salary: "Rp 10.000.000 – 15.000.000 / bulan",
    match: 85,
    matchedSkills: ["SQL", "Data Analysis", "Python"],
  },
  {
    id: 3,
    title: "Data Operations Specialist",
    company: "Traveloka",
    logoColor: "#1BA0E2",
    location: "Tangerang",
    type: "Remote",
    salary: "Rp 7.500.000 – 11.000.000 / bulan",
    match: 88,
    matchedSkills: ["Excel", "SQL", "Communication"],
  },
  {
    id: 4,
    title: "BI Analyst (Junior)",
    company: "Shopee",
    logoColor: "#EE4D2D",
    location: "Jakarta",
    type: "Hybrid",
    salary: "Rp 9.000.000 – 13.000.000 / bulan",
    match: 82,
    matchedSkills: ["SQL", "Python"],
  },
];

const aspirationalJobs = [
  {
    id: 11,
    title: "Senior Data Analyst",
    company: "Bank Jago",
    logoColor: "#FF5A00",
    location: "Jakarta",
    type: "Hybrid",
    salary: "Rp 15.000.000 – 25.000.000 / bulan",
    match: 65,
    matchedSkills: ["SQL", "Python"],
    missingSkills: ["Tableau", "Power BI", "A/B Testing"],
  },
  {
    id: 12,
    title: "Data Scientist",
    company: "Ruangguru",
    logoColor: "#3B82F6",
    location: "Remote",
    type: "Remote",
    salary: "Rp 12.000.000 – 20.000.000 / bulan",
    match: 58,
    matchedSkills: ["Python", "SQL"],
    missingSkills: ["Machine Learning", "Scikit-learn"],
  },
  {
    id: 13,
    title: "Machine Learning Engineer",
    company: "Telkomsel",
    logoColor: "#E3000F",
    location: "Jakarta",
    type: "WFO",
    salary: "Rp 14.000.000 – 22.000.000 / bulan",
    match: 45,
    matchedSkills: ["Python"],
    missingSkills: ["Deep Learning", "TensorFlow", "Cloud (AWS/GCP)"],
  },
  {
    id: 14,
    title: "BI Developer",
    company: "Astra International",
    logoColor: "#00529C",
    location: "Jakarta",
    type: "Hybrid",
    salary: "Rp 11.000.000 – 16.000.000 / bulan",
    match: 72,
    matchedSkills: ["SQL", "Excel"],
    missingSkills: ["Power BI", "Data Warehousing"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const CariLowongan = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar />

      <div className="lg:ml-[260px] pb-24 lg:pb-10">
        
        {/* ── HEADER & SEARCH ───────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Briefcase className="text-[#025CB8]" size={22} />
              Cari Lowongan Kerja
            </h1>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari posisi, perusahaan, atau skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#025CB8] shadow-sm transition-all"
                />
              </div>
              <button className="px-6 py-3 bg-[#025CB8] text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                <Search size={16} />
                Cari
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <MapPin size={14} /> Lokasi <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Briefcase size={14} /> Tipe Kerja <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <GraduationCap size={14} /> Level <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter size={14} /> Industri <ChevronDown size={14} />
              </button>
              
              <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>
              
              <button className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1">
                <X size={14} /> Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* ── CONTENT AREA ──────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-6 space-y-10">
          
          {/* Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div>
              <p className="text-sm font-semibold text-gray-800">Menampilkan 47 lowongan untuk: <span className="text-[#025CB8]">Data Analyst</span></p>
              <p className="text-xs text-gray-500 mt-1">Berdasarkan skill kamu: <span className="font-semibold text-gray-700">Python, SQL, Excel</span></p>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 shadow-sm">
              Urutkan: <span className="text-[#025CB8]">Paling Relevan</span>
            </div>
          </div>

          {/* ── SECTION 1: MATCHED JOBS ─────────────────────────────────── */}
          <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 font-bold text-sm rounded-lg mb-2">
                  <Sparkles size={16} />
                  Skill Kamu Sudah Mumpuni
                </div>
                <p className="text-sm text-gray-500">Kamu memenuhi 80%+ kualifikasi untuk posisi-posisi ini. Siap untuk dilamar!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {matchedJobs.map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                           style={{ backgroundColor: job.logoColor }}>
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-base group-hover:text-[#025CB8] transition-colors">{job.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <Building2 size={14} /> {job.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-lg whitespace-nowrap">
                        Match {job.match}%
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold text-gray-600">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><MapPin size={12} /> {job.location}</span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Briefcase size={12} /> {job.type}</span>
                  </div>

                  <p className="text-sm font-bold text-green-700 mb-4">{job.salary}</p>

                  {/* Skills */}
                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Skill Cocok</p>
                    <div className="flex flex-wrap gap-2">
                      {job.matchedSkills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-green-50 text-green-700 text-[11px] font-bold rounded-md border border-green-100">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-6">
                    <button className="flex-1 py-2.5 bg-[#025CB8] text-white text-sm font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all">
                      Lamar Sekarang
                    </button>
                    <button className="p-2.5 bg-white border-2 border-gray-200 text-gray-500 rounded-xl hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                      <Bookmark size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="px-5 py-2 bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                Muat Lebih Banyak Lowongan
              </button>
            </div>
          </div>

          {/* ── DIVIDER ───────────────────────────────────────────────────── */}
          <div className="relative py-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 border-dashed"></div>
            </div>
            <div className="relative bg-[#F7F9FC] px-4 text-sm font-bold text-gray-400">
              — Tingkatkan skill kamu untuk posisi berikut —
            </div>
          </div>

          {/* ── SECTION 2: ASPIRATIONAL JOBS ────────────────────────────── */}
          <div className="pb-10">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 font-bold text-sm rounded-lg mb-2">
                  <Target size={16} />
                  Perlu Tingkatkan Skill Dulu
                </div>
                <p className="text-sm text-gray-500">Kamu memenuhi 40-79% kualifikasi. Tingkatkan skill ini untuk melamar!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {aspirationalJobs.map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow group flex flex-col relative overflow-hidden">
                  
                  {/* Subtle Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none -mr-10 -mt-10"></div>

                  {/* Header */}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                           style={{ backgroundColor: job.logoColor }}>
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-base group-hover:text-orange-600 transition-colors">{job.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <Building2 size={14} /> {job.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="px-2 py-1 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold rounded-lg whitespace-nowrap">
                        Match {job.match}%
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold text-gray-600 relative z-10">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><MapPin size={12} /> {job.location}</span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Briefcase size={12} /> {job.type}</span>
                  </div>

                  <p className="text-sm font-bold text-gray-700 mb-4 relative z-10">{job.salary}</p>

                  {/* Skills Grid */}
                  <div className="mt-auto pt-4 border-t border-gray-100 relative z-10">
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Skill Cocok</p>
                      <div className="flex flex-wrap gap-2">
                        {job.matchedSkills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-md border border-green-100">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Perlu Dipelajari</p>
                      <div className="flex flex-wrap gap-2">
                        {job.missingSkills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-md border border-red-100">
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-6 relative z-10">
                    <button className="flex-1 py-2.5 bg-white border-2 border-orange-500 text-orange-600 text-sm font-bold rounded-xl shadow-sm hover:bg-orange-50 active:scale-95 transition-all">
                      Lihat Kursus yang Dibutuhkan
                    </button>
                    <button className="p-2.5 bg-white border-2 border-gray-200 text-gray-400 rounded-xl hover:border-gray-300 hover:text-gray-600 transition-colors">
                      <Bookmark size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="px-5 py-2 bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                Muat Lebih Banyak Aspirasi
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CariLowongan;
// src/pages/auth/lowongan_kerja/index.tsx