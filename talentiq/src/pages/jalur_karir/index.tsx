// src/pages/jalur_karir/index.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Lock, Sparkles, Target, BookOpen,
  CheckCircle2, Clock, BrainCircuit, ChevronRight,
} from "lucide-react";
import HeaderComponent from "@/layout/header";
import FooterComponent from "@/layout/footer";
import { useScrollAnimation, animClass } from "@/hooks/use-scroll-animation";

// ── Data ──────────────────────────────────────────────────────────────────────
const allCards = [
  {
    tag: "Gaji Tinggi",
    img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/ysqq6gmp_expires_30_days.png",
    title: "Fullstack Web Developer",
    desc: "Membangun ekosistem web end-to-end. Sangat krusial bagi startup dan korporasi yang melakukan transformasi digital.",
    skills: ["HTML, CSS, modern JS", "React / Vue / Next.js", "Node.js & Database"],
    estimasi: "6–9 bulan",
    level: "Junior → Senior",
  },
  {
    tag: "Kreatif",
    img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/4gquxufv_expires_30_days.png",
    title: "UI/UX Designer",
    desc: "Menciptakan pengalaman pengguna yang intuitif. Fokus pada riset, prototyping, dan desain visual bermakna.",
    skills: ["Design Thinking & Research", "Wireframing & Figma", "Prototyping & Testing"],
    estimasi: "4–6 bulan",
    level: "Junior → Mid",
  },
  {
    tag: "Rekomendasi AI",
    img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/aodhzoyr_expires_30_days.png",
    title: "Data Scientist",
    desc: "Mengolah data mentah menjadi wawasan strategis menggunakan algoritma machine learning dan statistika.",
    skills: ["Python & SQL", "Matematika & Statistika", "Machine Learning Models"],
    estimasi: "8–12 bulan",
    level: "Junior → Senior",
  },
  {
    tag: "Trend Mobile",
    img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/vyqusck2_expires_30_days.png",
    title: "Mobile App Developer",
    desc: "Membangun aplikasi performa tinggi untuk Android dan iOS dengan antarmuka responsif dan fungsionalitas native.",
    skills: ["Kotlin / Swift Fundamentals", "Flutter / React Native", "App Store Optimization"],
    estimasi: "5–8 bulan",
    level: "Junior → Mid",
  },
  {
    tag: "Proteksi",
    img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/go6xhlpa_expires_30_days.png",
    title: "Cybersecurity Analyst",
    desc: "Menjaga keamanan aset digital perusahaan dari serangan siber. Krusial di era data privasi ini.",
    skills: ["Networking Fundamentals", "Ethical Hacking & Pen-test", "Security Compliance"],
    estimasi: "6–10 bulan",
    level: "Junior → Senior",
  },
  {
    tag: "Infrastruktur",
    img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/b8ioyb9j_expires_30_days.png",
    title: "Cloud Solutions Architect",
    desc: "Merancang infrastruktur cloud yang skalabel dan efisien menggunakan AWS, GCP, atau Azure.",
    skills: ["Linux & Virtualization", "Docker & Kubernetes", "Cloud Providers (AWS/GCP)"],
    estimasi: "9–12 bulan",
    level: "Mid → Senior",
  },
];

// Pratinjau roadmap tahapan (versi publik — locked)
const roadmapPreview = [
  { id: 1, title: "Fondasi", desc: "Dasar-dasar bahasa pemrograman & logika", status: "preview" },
  { id: 2, title: "Inti Skill", desc: "Penguasaan skill utama bidang karir", status: "preview" },
  { id: 3, title: "Proyek Nyata", desc: "Praktik dengan studi kasus industri", status: "locked" },
  { id: 4, title: "Siap Kerja", desc: "Portofolio & persiapan melamar", status: "locked" },
];

// ── Career Card ───────────────────────────────────────────────────────────────
const CareerCard = ({
  card,
  delay,
  onRoadmapClick,
}: {
  card: typeof allCards[0];
  delay: number;
  onRoadmapClick: () => void;
}) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg
                  transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col
                  ${animClass(isVisible, "up", delay)}`}
    >
      {/* Top gradient bar — sama dengan roadmap user */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#025CB8] to-[#62AAEA]" />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #62AAEA, #025CB8)" }}
            >
              <img src={card.img} className="w-5 h-5 object-fill" alt={card.tag} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">{card.title}</h3>
              <span className="text-[11px] font-semibold text-[#025CB8] bg-[#025CB8]/8 px-2 py-0.5 rounded-full">
                {card.tag}
              </span>
            </div>
          </div>
        </div>

        {/* Desc */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{card.desc}</p>

        {/* Info row */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {card.estimasi}
          </span>
          <span className="flex items-center gap-1">
            <Target size={12} /> {card.level}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-2 mb-5">
          {card.skills.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#025CB8] shrink-0" />
              <span className="text-gray-600 text-xs">{s}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* Pratinjau Roadmap — terkunci, mirip tampilan user */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
            <BookOpen size={11} /> Pratinjau Roadmap
          </p>
          <div className="space-y-2">
            {roadmapPreview.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.status === "preview"
                  ? "bg-[#025CB8] text-white"
                  : "bg-gray-100 text-gray-400"
                  }`}>
                  {step.status === "locked"
                    ? <Lock size={10} />
                    : <span className="text-[9px] font-bold">{step.id}</span>
                  }
                </div>
                <div className={`flex-1 text-xs ${step.status === "locked" ? "text-gray-300" : "text-gray-600"}`}>
                  <span className="font-semibold">{step.title}</span>
                  {step.status !== "locked" && (
                    <span className="text-gray-400"> — {step.desc}</span>
                  )}
                  {step.status === "locked" && (
                    <span className="text-gray-300"> — 🔒 Login untuk lihat</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onRoadmapClick}
          className="mt-auto w-full flex items-center justify-center gap-2
                     bg-gradient-to-r from-[#025CB8] to-[#62AAEA]
                     hover:from-[#0147A0] hover:to-[#025CB8]
                     text-white text-sm font-bold py-2.5 rounded-xl
                     transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Lihat Roadmap Lengkap
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ── Login Prompt Modal ─────────────────────────────────────────────────────────
const LoginPromptModal = ({
  onClose,
  onLogin,
  onRegister,
}: {
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header — gradien sama dengan roadmap user */}
      <div className="bg-gradient-to-r from-[#025CB8] to-[#62AAEA] px-6 pt-8 pb-10 text-center">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <BrainCircuit size={26} className="text-white" />
        </div>
        <h2 className="text-white text-xl font-bold mb-1">Roadmap Karir Personal</h2>
        <p className="text-white/80 text-sm">
          Masuk untuk mendapatkan roadmap yang disesuaikan dengan skill dan tujuan karir kamu!
        </p>
      </div>

      {/* Fitur Preview — mirip step card di roadmap user */}
      <div className="px-6 pt-2 pb-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 space-y-3">
          {[
            { icon: <Target size={15} className="text-[#025CB8]" />, color: "bg-blue-50", label: "Roadmap personal berdasarkan skill saat ini" },
            { icon: <BookOpen size={15} className="text-green-600" />, color: "bg-green-50", label: "Kursus yang direkomendasikan AI per tahap" },
            { icon: <Sparkles size={15} className="text-purple-500" />, color: "bg-purple-50", label: "Progress tracking & analisis skill gap visual" },
            { icon: <CheckCircle2 size={15} className="text-orange-500" />, color: "bg-orange-50", label: "Estimasi waktu & milestone yang realistis" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`${f.color} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}>
                {f.icon}
              </div>
              <p className="text-gray-700 text-sm">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 flex flex-col gap-3">
        <button
          onClick={onLogin}
          className="w-full bg-[#025CB8] hover:bg-[#0147A0] text-white font-bold py-3 rounded-xl transition-colors duration-200 shadow-md"
        >
          Masuk & Lihat Roadmap Saya
        </button>
        <button
          onClick={onRegister}
          className="w-full border-2 border-[#025CB8] text-[#025CB8] hover:bg-blue-50 font-bold py-3 rounded-xl transition-colors duration-200"
        >
          Daftar Gratis — Mulai Sekarang
        </button>
        <button onClick={onClose} className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
          Lanjut lihat-lihat dulu
        </button>
      </div>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const JalurKarir = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: bannerRef, isVisible: bannerVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  // useState import

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <HeaderComponent />

      {/* ── HERO ── */}
      <div className="flex flex-col items-center px-4 sm:px-8 pt-[100px]">
        <div
          ref={heroRef}
          className={`flex flex-col items-center w-full max-w-[1210px] py-16 sm:py-24 px-6
                      rounded-2xl border border-[#025CB8] ${animClass(heroVisible, "up", 0)}`}
          style={{ background: "linear-gradient(180deg, #00458D, #00458D00)" }}
        >
          <div className="flex items-center mb-6 gap-2 bg-white/10 px-3 py-1 rounded-full">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/zv3i8izk_expires_30_days.png"
              className="w-3 h-[13px] object-fill" alt="AI"
            />
            <span className="text-white/80 text-xs font-medium">Didukung oleh AI Presisi</span>
          </div>
          <h1 className="text-[#191C21] text-2xl sm:text-[40px] font-bold text-center max-w-[681px] mb-5 leading-snug">
            Navigasi Masa Depan Karir IT Anda dengan TALENTIQ AI
          </h1>
          <p className="text-white text-sm sm:text-lg text-center max-w-[753px] leading-8 mb-8">
            Temukan peta jalan karir yang dipersonalisasi. Kami menganalisis tren industri global
            untuk membantu Anda menguasai keahlian yang paling dibutuhkan saat ini.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white text-[#025CB8] font-bold px-8 py-3.5 rounded-xl
                       hover:bg-gray-50 transition-colors duration-200 shadow-lg"
          >
            Lihat Roadmap Personal Saya <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ── FEATURE BANNER — mirip card statistik di roadmap user ── */}
      <div className="flex justify-center px-4 sm:px-8 mt-8">
        <div
          ref={bannerRef}
          className={`w-full max-w-[1210px] ${animClass(bannerVisible, "up", 100)}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Target size={20} className="text-[#025CB8]" />, bg: "bg-blue-50", num: "6+", label: "Jalur Karir IT" },
              { icon: <BookOpen size={20} className="text-green-600" />, bg: "bg-green-50", num: "4", label: "Tahap per Roadmap" },
              { icon: <Sparkles size={20} className="text-purple-500" />, bg: "bg-purple-50", num: "AI", label: "Analisis Skill Gap" },
              { icon: <Clock size={20} className="text-orange-500" />, bg: "bg-orange-50", num: "≤12", label: "Bulan Estimasi" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-xl font-black text-gray-800">{s.num}</p>
                  <p className="text-xs text-gray-400 font-medium leading-tight">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CAREER CARDS ── */}
      <div className="flex justify-center px-4 sm:px-8 mt-8 mb-10 sm:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-[1210px]">
          {allCards.map((card, i) => (
            <CareerCard
              key={card.title}
              card={card}
              delay={(i % 3) * 100}
              onRoadmapClick={() => setShowModal(true)}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM CTA — sama dengan CTA di roadmap user ── */}
      <div className="flex justify-center px-4 sm:px-8 pb-16 sm:pb-24">
        <div
          ref={ctaRef}
          className={`w-full max-w-[1210px] ${animClass(ctaVisible, "up", 0)}`}
        >
          <div
            className="flex flex-col lg:flex-row items-center bg-[#025CB8] p-8 sm:p-[50px]
                        rounded-2xl border border-[#D9D9D9] gap-8"
            style={{ boxShadow: "0px 4px 10px #00000080" }}
          >
            <div className="flex-1 flex flex-col items-start">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-bold px-3 py-1 rounded-full mb-4">
                <BrainCircuit size={13} /> Fitur Eksklusif Member
              </span>
              <h2 className="text-white text-2xl sm:text-[36px] font-bold mb-4 leading-snug">
                Belum yakin jalur mana yang tepat untuk Anda?
              </h2>
              <p className="text-[#C6D8FF] text-sm sm:text-base mb-6 leading-8">
                Gunakan AI Career Assessment kami untuk menganalisis minat dan bakat Anda.
                Dapatkan roadmap personal dengan 4 tahap terstruktur, estimasi waktu, dan
                kursus yang direkomendasikan — semua dalam 5 menit.
              </p>
              {/* Preview tahapan — mirip timeline di roadmap user */}
              <div className="flex items-center gap-2 flex-wrap mb-8">
                {["Fondasi", "Inti Skill", "Proyek", "Siap Kerja"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[9px] font-bold text-white">
                        {i + 1}
                      </div>
                      <span className="text-white text-xs font-semibold">{step}</span>
                    </div>
                    {i < 3 && <ChevronRight size={14} className="text-white/40" />}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-white text-[#025CB8] font-bold
                           px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors
                           duration-200 shadow-lg hover:shadow-xl"
              >
                Mulai Tes Gratis <ArrowRight size={16} />
              </button>
            </div>

            {/* Right side — preview card roadmap */}
            <div className="w-full lg:w-80 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shrink-0">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-4">
                Pratinjau Roadmap Member
              </p>
              <div className="space-y-3">
                {[
                  { step: 1, title: "Fondasi Data", done: true, progress: 100 },
                  { step: 2, title: "Analisis Data", done: false, progress: 65 },
                  { step: 3, title: "Visualisasi", done: false, progress: 0, locked: true },
                  { step: 4, title: "Machine Learning", done: false, progress: 0, locked: true },
                ].map((s) => (
                  <div key={s.step} className={`flex items-center gap-3 ${s.locked ? "opacity-40" : ""}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${s.done ? "bg-green-400 text-white" : s.locked ? "bg-white/20 text-white/50" : "bg-white text-[#025CB8]"
                      }`}>
                      {s.done ? "✓" : s.locked ? "🔒" : s.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold">{s.title}</p>
                      {!s.locked && s.progress > 0 && (
                        <div className="mt-1 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    {!s.locked && (
                      <span className="text-white/60 text-[10px] shrink-0">
                        {s.progress > 0 ? `${s.progress}%` : "Belum"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-[10px] text-center mt-4">
                🔒 Tahap 3 & 4 tersedia setelah login
              </p>
            </div>
          </div>
        </div>
      </div>

      <FooterComponent />

      {/* ── Modal ── */}
      {showModal && (
        <LoginPromptModal
          onClose={() => setShowModal(false)}
          onLogin={() => navigate("/login")}
          onRegister={() => navigate("/register")}
        />
      )}
    </div>
  );
};

export default JalurKarir;