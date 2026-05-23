// src/pages/auth/profil/index.tsx
import {
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  Clock,
  Flame,
  PlayCircle,
  Star,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/common/sidebar";

// ─────────────────────────────────────────────────────────────────────────────
// DATA MOCKS
// ─────────────────────────────────────────────────────────────────────────────
const activeCourses = [
  {
    id: 1,
    title: "SQL untuk Analisis Data",
    platform: "Dicoding",
    progress: 65,
    lastAccessed: "2 hari lalu",
    color: "#025CB8",
    bg: "#EFF6FF",
  },
  {
    id: 2,
    title: "Data Manipulation with Python",
    platform: "Coursera",
    progress: 30,
    lastAccessed: "Hari ini",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

const recommendedCourses = [
  {
    id: 1,
    title: "Belajar Tableau dari Nol",
    category: "Visualisasi Data",
    platform: "Udemy",
    duration: "4.5 jam",
    rating: 4.8,
    badge: "Direkomendasikan AI",
    badgeColor: "bg-indigo-100 text-indigo-700",
    color: "#4F46E5",
  },
  {
    id: 2,
    title: "Machine Learning Dasar",
    category: "Machine Learning",
    platform: "Coursera",
    duration: "12 jam",
    rating: 4.9,
    badge: "Populer",
    badgeColor: "bg-green-100 text-green-700",
    color: "#10B981",
  },
  {
    id: 3,
    title: "Python untuk Data Science",
    category: "Pemrograman",
    platform: "Dicoding",
    duration: "15 jam",
    rating: 4.7,
    badge: "",
    color: "#F59E0B",
  },
  {
    id: 4,
    title: "Advanced SQL & Database",
    category: "Database",
    platform: "Udacity",
    duration: "8 jam",
    rating: 4.6,
    badge: "",
    color: "#EF4444",
  },
  {
    id: 5,
    title: "Statistics for Data Science",
    category: "Matematika",
    platform: "edX",
    duration: "20 jam",
    rating: 4.8,
    badge: "Direkomendasikan AI",
    badgeColor: "bg-indigo-100 text-indigo-700",
    color: "#025CB8",
  },
  {
    id: 6,
    title: "Storytelling with Data",
    category: "Komunikasi",
    platform: "Skillshare",
    duration: "3 jam",
    rating: 4.9,
    badge: "Populer",
    badgeColor: "bg-green-100 text-green-700",
    color: "#8B5CF6",
  },
];

const mockUser = {
  name: "Budi Santoso",
  email: "budi.santoso@example.com",
  targetRole: "Data Analyst",
  experienceLevel: "Junior (1-3 tahun)",
  skills: ["Python", "SQL", "Excel", "Data Analysis", "Communication"],
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const ProgressBar = ({ value, color = "#025CB8" }: { value: number; color?: string }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-700 ease-out"
      style={{ width: `${value}%`, background: color }}
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const ProfilKursus = () => {
  const [activeTab, setActiveTab] = useState<"progress" | "profil">("progress");

  // Form states
  const [name, setName] = useState(mockUser.name);
  const [targetRole, setTargetRole] = useState(mockUser.targetRole);
  const [expLevel, setExpLevel] = useState(mockUser.experienceLevel);
  const [skills, setSkills] = useState(mockUser.skills);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill.trim() !== "") {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar />

      <div className="lg:ml-[260px] pb-24 lg:pb-10">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 lg:px-8 py-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-[#025CB8]" size={20} />
                Progress Skill & Kursus Kamu
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Pantau perkembangan belajarmu dan temukan kursus baru
              </p>
            </div>
            
            {/* Tabs Selector */}
            <div className="flex p-1 bg-gray-100 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("progress")}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "progress"
                    ? "bg-white text-[#025CB8] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Progress Kursus
              </button>
              <button
                onClick={() => setActiveTab("profil")}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "profil"
                    ? "bg-white text-[#025CB8] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Profil Saya
              </button>
            </div>
          </div>
        </div>

        {/* ── CONTENT AREA ────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-5 lg:px-8 pt-6 space-y-8">

          {activeTab === "progress" ? (
            <>
              {/* ── STATS CARDS ──────────────────────────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <PlayCircle size={24} className="text-[#025CB8]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Kursus Aktif</p>
                    <p className="text-2xl font-black text-gray-800">2</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Award size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Kursus Selesai</p>
                    <p className="text-2xl font-black text-gray-800">5</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Total Jam Belajar</p>
                    <p className="text-2xl font-black text-gray-800">34<span className="text-sm font-bold text-gray-500"> jam</span></p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
                     style={{ background: "linear-gradient(135deg, #FFF7ED, #FFEDD5)" }}>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Flame size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-600/70 font-bold uppercase tracking-wider">Streak Belajar</p>
                    <p className="text-xl font-black text-orange-600 mt-0.5">7 hari 🔥</p>
                  </div>
                </div>
              </div>

              {/* ── ACTIVE COURSES ────────────────────────────────────────────── */}
              <div>
                <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PlayCircle size={18} className="text-[#025CB8]" />
                  Kursus Aktif Saya
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeCourses.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                             style={{ backgroundColor: course.bg, color: course.color }}>
                          <BookOpen size={28} />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 mb-1">
                            {course.platform}
                          </span>
                          <h3 className="font-bold text-gray-800 leading-tight mb-2">{course.title}</h3>
                          
                          {/* Progress */}
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span style={{ color: course.color }}>{course.progress}% selesai</span>
                          </div>
                          <ProgressBar value={course.progress} color={course.color} />
                          <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                            <Clock size={10} />
                            Terakhir diakses: {course.lastAccessed}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-5 flex justify-end">
                        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm hover:-translate-y-0.5 transition-transform"
                                style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}>
                          Lanjutkan Belajar
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── RECOMMENDED COURSES ───────────────────────────────────────── */}
              <div>
                <div className="mb-5">
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <Target size={18} className="text-[#025CB8]" />
                    Kursus yang Direkomendasikan AI
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Berdasarkan skill gap kamu sebagai calon {mockUser.targetRole}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendedCourses.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer flex flex-col">
                      {/* Thumbnail Placeholder */}
                      <div className="h-32 w-full flex items-center justify-center relative"
                           style={{ backgroundColor: `${course.color}15` }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm"
                             style={{ color: course.color }}>
                          <BookOpen size={24} />
                        </div>
                        {course.badge && (
                          <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm ${course.badgeColor}`}>
                            {course.badge}
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          {course.category}
                        </span>
                        <h3 className="font-bold text-gray-800 text-sm leading-tight mb-3 group-hover:text-[#025CB8] transition-colors">
                          {course.title}
                        </h3>
                        
                        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-600">{course.platform}</span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Clock size={10} /> {course.duration}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-600 text-xs font-bold">
                            <Star size={12} className="fill-amber-500" />
                            {course.rating}
                          </div>
                        </div>

                        <button className="w-full mt-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 group-hover:bg-[#025CB8] group-hover:text-white group-hover:border-[#025CB8] transition-colors">
                          Lihat Kursus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ── PROFIL SAYA ──────────────────────────────────────────────── */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Edit Profil Saya</h2>
                  
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl text-white font-bold shadow-md"
                           style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}>
                        BS
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-[#025CB8] hover:border-blue-200 shadow-sm transition-colors">
                        <Camera size={14} />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-bold text-gray-800">{name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{targetRole}</p>
                      <button className="text-xs font-semibold text-[#025CB8] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        Ubah Foto Profil
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Lengkap</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#025CB8] transition-all bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Email (Read-only)</label>
                        <input
                          type="email"
                          value={mockUser.email}
                          readOnly
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Posisi yang Diincar</label>
                        <input
                          type="text"
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#025CB8] transition-all bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Level Pengalaman</label>
                        <select
                          value={expLevel}
                          onChange={(e) => setExpLevel(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#025CB8] transition-all bg-gray-50 focus:bg-white appearance-none"
                        >
                          <option value="Fresh Graduate (0-1 tahun)">Fresh Graduate (0-1 tahun)</option>
                          <option value="Junior (1-3 tahun)">Junior (1-3 tahun)</option>
                          <option value="Mid (3-5 tahun)">Mid (3-5 tahun)</option>
                          <option value="Senior (5+ tahun)">Senior (5+ tahun)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">
                        Skill yang Dimiliki
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#025CB8] focus-within:ring-2 focus-within:ring-blue-100 transition-all flex flex-wrap gap-2">
                        {skills.map(skill => (
                          <span key={skill} className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
                            {skill}
                            <button onClick={() => handleRemoveSkill(skill)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={handleAddSkill}
                          placeholder="Ketik skill & tekan Enter"
                          className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors">
                    Batal
                  </button>
                  <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:-translate-y-0.5 transition-all"
                          style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}>
                    Simpan Perubahan
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
