// src/pages/auth/roadmap-karir/index.tsx
import {
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Database,
  FileCode2,
  LineChart,
  Loader2,
  Lock,
  Target,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import Sidebar from "@/components/common/sidebar";

// ─────────────────────────────────────────────────────────────────────────────
// DATA MOCKS
// ─────────────────────────────────────────────────────────────────────────────
const radarData = [
  { subject: "Analisis Data", current: 70, target: 90, fullMark: 100 },
  { subject: "Visualisasi", current: 40, target: 85, fullMark: 100 },
  { subject: "Machine Learning", current: 20, target: 70, fullMark: 100 },
  { subject: "SQL", current: 80, target: 95, fullMark: 100 },
  { subject: "Python", current: 65, target: 90, fullMark: 100 },
];

const roadmapSteps = [
  {
    id: 1,
    title: "Fondasi Data",
    status: "done",
    duration: "Selesai dalam 6 minggu",
    skills: ["Python Dasar", "SQL Dasar", "Statistika Dasar"],
    coursesCompleted: 2,
    desc: "Membangun pemahaman dasar tentang pengolahan data dan logika pemrograman.",
    icon: <Database size={20} />,
  },
  {
    id: 2,
    title: "Analisis Data",
    status: "active",
    duration: "3 minggu lagi",
    progress: 65,
    skills: ["SQL Lanjutan", "Pandas", "NumPy"],
    activeCourse: "Data Manipulation with Python",
    desc: "Mengolah dan membersihkan dataset menggunakan library manipulasi data.",
    icon: <FileCode2 size={20} />,
  },
  {
    id: 3,
    title: "Visualisasi Data",
    status: "upcoming",
    duration: "Estimasi: 4 minggu",
    skills: ["Tableau", "Power BI", "Matplotlib"],
    recommendedCourses: 3,
    desc: "Membuat dashboard interaktif dan menyampaikan insight secara visual.",
    icon: <LineChart size={20} />,
  },
  {
    id: 4,
    title: "Machine Learning Dasar",
    status: "locked",
    duration: "Estimasi: 6 minggu",
    skills: ["Scikit-learn", "Regresi", "Klasifikasi"],
    desc: "Membangun model prediktif dasar untuk menyelesaikan masalah bisnis.",
    icon: <BrainCircuit size={20} />,
  },
];

const recommendations = [
  "Selesaikan modul 'Data Manipulation with Python' di kursus aktif saat ini.",
  "Mulai biasakan diri mengerjakan dataset sederhana dari Kaggle (misal: Titanic).",
  "Buat 1 proyek analisis data portofolio menggunakan dataset terbuka (open data) pemerintah.",
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-700 ease-out"
      style={{ width: `${value}%`, background: "linear-gradient(90deg, #025CB8, #62AAEA)" }}
    />
  </div>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-lg text-xs font-medium">
        <p className="text-gray-800 font-bold mb-2">{payload[0].payload.subject}</p>
        <p className="text-[#025CB8]">Skill Saat Ini: {payload[0].value}%</p>
        <p className="text-gray-400 mt-1">Target Skill: {payload[1].value}%</p>
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const RoadmapKarir = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar />

      <div className="lg:ml-[260px] pb-24 lg:pb-10">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Compass className="text-[#025CB8]" size={20} />
                Roadmap Karir Kamu
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Berdasarkan analisis AI · Target: <span className="font-semibold text-gray-600">Data Analyst</span> · Estimasi: 6-9 bulan
              </p>
            </div>
            <button className="self-start sm:self-auto px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#025CB8] hover:border-blue-200 transition-colors">
              Ubah Target Karir
            </button>
          </div>
        </div>

        {/* ── CONTENT AREA ────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-6 space-y-6">

          {/* ── STATS CARDS ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Target size={20} className="text-[#025CB8]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Tahapan</p>
                <p className="text-xl font-black text-gray-800">4</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Selesai</p>
                <p className="text-xl font-black text-gray-800">1</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Loader2 size={20} className="text-[#025CB8] animate-spin-slow" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Sedang Berjalan</p>
                <p className="text-xl font-black text-gray-800">1</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Sisa Estimasi</p>
                <p className="text-lg font-black text-gray-800 leading-tight">5-7<span className="text-sm font-bold text-gray-500"> bln</span></p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* ── LEFT: TIMELINE ────────────────────────────────────────── */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-base font-bold text-gray-800 mb-8 flex items-center gap-2">
                <BookOpen size={18} className="text-[#025CB8]" />
                Rencana Pengembangan
              </h2>

              <div className="relative pl-3 sm:pl-4">
                {/* Vertical Line */}
                <div className="absolute top-2 bottom-6 left-[19px] sm:left-[23px] w-[2px] bg-gray-100 z-0"></div>

                <div className="space-y-8 relative z-10">
                  {roadmapSteps.map((step, index) => {
                    const isDone = step.status === "done";
                    const isActive = step.status === "active";
                    const isLocked = step.status === "locked";
                    const isUpcoming = step.status === "upcoming";

                    return (
                      <div key={step.id} className={`relative flex gap-4 sm:gap-6 ${isLocked ? "opacity-50" : ""}`}>
                        {/* Status Icon */}
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300
                          ${isDone ? "bg-green-500 text-white" : 
                            isActive ? "bg-[#025CB8] text-white ring-4 ring-blue-100" : 
                            "bg-gray-100 text-gray-400 border-2 border-white"}`}
                        >
                          {isDone ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={18} /> : step.icon}
                        </div>

                        {/* Content Card */}
                        <div className={`flex-1 rounded-2xl border p-4 sm:p-5 transition-shadow hover:shadow-md
                          ${isActive ? "border-blue-200 bg-blue-50/30" : "border-gray-100 bg-white"}`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="font-bold text-gray-800 text-base">{`Tahap ${step.id}: ${step.title}`}</h3>
                                {/* Badge */}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider
                                  ${isDone ? "bg-green-100 text-green-700" : 
                                    isActive ? "bg-blue-100 text-[#025CB8]" : 
                                    "bg-gray-100 text-gray-500"}`}
                                >
                                  {isDone ? "Selesai" : isActive ? "Sedang Berjalan" : "Belum Dimulai"}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{step.desc}</p>
                            </div>
                            <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <Clock size={12} />
                              {step.duration}
                            </span>
                          </div>

                          {/* Skills Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {step.skills.map(skill => (
                              <span key={skill} className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border
                                ${isDone ? "bg-white border-green-200 text-green-700" : 
                                  isActive ? "bg-white border-blue-200 text-[#025CB8]" : 
                                  "bg-gray-50 border-gray-200 text-gray-500"}`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Specific Status Content */}
                          {isDone && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50/50 p-2.5 rounded-xl">
                              <Trophy size={14} />
                              <span>Telah menyelesaikan {step.coursesCompleted} kursus di tahap ini.</span>
                            </div>
                          )}

                          {isActive && (
                            <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm mt-2">
                              <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-gray-700">{step.activeCourse}</span>
                                <span className="text-[#025CB8]">{step.progress}%</span>
                              </div>
                              <ProgressBar value={step.progress || 0} />
                              <div className="mt-4 flex justify-end">
                                <button className="px-4 py-2 bg-[#025CB8] text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95">
                                  Lanjutkan Belajar
                                </button>
                              </div>
                            </div>
                          )}

                          {isUpcoming && (
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500 font-medium">
                                <Award size={14} className="inline mr-1 mb-0.5" />
                                {step.recommendedCourses} kursus direkomendasikan
                              </span>
                              <button className="px-3 py-1.5 text-[#025CB8] text-xs font-bold hover:bg-blue-50 rounded-lg transition-colors">
                                Mulai Tahap Ini →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── RIGHT: RADAR & RECOMMENDATIONS ────────────────────────── */}
            <div className="w-full lg:w-[320px] space-y-6">
              
              {/* Radar Chart Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <LineChart size={16} className="text-[#025CB8]" />
                  Peta Skill Kamu Saat Ini
                </h2>
                
                <div className="h-[220px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#f3f4f6" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      {/* Target Area (Gray dashed/solid light) */}
                      <Radar
                        name="Target Skill"
                        dataKey="target"
                        stroke="#9ca3af"
                        fill="#f3f4f6"
                        fillOpacity={0.5}
                        strokeDasharray="3 3"
                      />
                      {/* Current Area (Blue) */}
                      <Radar
                        name="Skill Saat Ini"
                        dataKey="current"
                        stroke="#025CB8"
                        fill="#62AAEA"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex items-center justify-center gap-4 mt-2 text-[10px] font-semibold text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#62AAEA] opacity-80" />
                    <span>Saat Ini</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-gray-200 border border-gray-400 border-dashed" />
                    <span>Target Ideal</span>
                  </div>
                </div>
              </div>

              {/* Recommendations Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                   style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)" }}>
                <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BrainCircuit size={16} className="text-purple-500" />
                  Rekomendasi AI Selanjutnya
                </h2>
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-5 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
                        style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}>
                  Buat Rencana Harian
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapKarir;
