import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Sparkles,
  Target,
  BookOpen,
  CheckCircle2,
  Clock,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";

import HeaderComponent from "@/layout/header";
import FooterComponent from "@/layout/footer";
import {
  useScrollAnimation,
  animClass,
} from "@/hooks/use-scroll-animation";

// daftar role karir
const careerTracks: CareerTrack[] = [
  {
    badge: "Gaji Tinggi",
    logo:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/ysqq6gmp_expires_30_days.png",
    roleName: "Fullstack Web Developer",
    summary:
      "Membangun ekosistem web end-to-end. Sangat krusial bagi startup dan korporasi yang melakukan transformasi digital.",
    skillStack: [
      "HTML, CSS, modern JS",
      "React / Vue / Next.js",
      "Node.js & Database",
    ],
    duration: "6–9 bulan",
    careerStage: "Junior → Senior",
  },

  {
    badge: "Kreatif",
    logo:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/4gquxufv_expires_30_days.png",
    roleName: "UI/UX Designer",
    summary:
      "Menciptakan pengalaman pengguna yang intuitif. Fokus pada riset, prototyping, dan desain visual bermakna.",
    skillStack: [
      "Design Thinking & Research",
      "Wireframing & Figma",
      "Prototyping & Testing",
    ],
    duration: "4–6 bulan",
    careerStage: "Junior → Mid",
  },

  {
    badge: "Rekomendasi AI",
    logo:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/aodhzoyr_expires_30_days.png",
    roleName: "Data Scientist",
    summary:
      "Mengolah data mentah menjadi wawasan strategis menggunakan algoritma machine learning dan statistika.",
    skillStack: [
      "Python & SQL",
      "Matematika & Statistika",
      "Machine Learning Models",
    ],
    duration: "8–12 bulan",
    careerStage: "Junior → Senior",
  },

  {
    badge: "Trend Mobile",
    logo:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/vyqusck2_expires_30_days.png",
    roleName: "Mobile App Developer",
    summary:
      "Membangun aplikasi performa tinggi untuk Android dan iOS dengan antarmuka responsif dan fungsionalitas native.",
    skillStack: [
      "Kotlin / Swift Fundamentals",
      "Flutter / React Native",
      "App Store Optimization",
    ],
    duration: "5–8 bulan",
    careerStage: "Junior → Mid",
  },

  {
    badge: "Proteksi",
    logo:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/go6xhlpa_expires_30_days.png",
    roleName: "Cybersecurity Analyst",
    summary:
      "Menjaga keamanan aset digital perusahaan dari serangan siber. Krusial di era data privasi ini.",
    skillStack: [
      "Networking Fundamentals",
      "Ethical Hacking & Pen-test",
      "Security Compliance",
    ],
    duration: "6–10 bulan",
    careerStage: "Junior → Senior",
  },

  {
    badge: "Infrastruktur",
    logo:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/b8ioyb9j_expires_30_days.png",
    roleName: "Cloud Solutions Architect",
    summary:
      "Merancang infrastruktur cloud yang skalabel dan efisien menggunakan AWS, GCP, atau Azure.",
    skillStack: [
      "Linux & Virtualization",
      "Docker & Kubernetes",
      "Cloud Providers (AWS/GCP)",
    ],
    duration: "9–12 bulan",
    careerStage: "Mid → Senior",
  },
];

// preview roadmap
const roadmapStages = [
  {
    stepNo: 1,
    headline: "Fondasi",
    detail: "Dasar-dasar bahasa pemrograman & logika",
    access: "open",
  },

  {
    stepNo: 2,
    headline: "Inti Skill",
    detail: "Penguasaan skill utama bidang karir",
    access: "open",
  },

  {
    stepNo: 3,
    headline: "Proyek Nyata",
    detail: "Praktik dengan studi kasus industri",
    access: "locked",
  },

  {
    stepNo: 4,
    headline: "Siap Kerja",
    detail: "Portofolio & persiapan melamar",
    access: "locked",
  },
];

type CareerTrack = {
  badge: string;
  logo: string;
  roleName: string;
  summary: string;
  skillStack: string[];
  duration: string;
  careerStage: string;
};

type CareerBoxProps = {
  careerInfo: CareerTrack;
  animDelay: number;
  onOpenRoadmap: () => void;
};

const CareerBox = ({
  careerInfo,
  onOpenRoadmap,
}: CareerBoxProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden
                  flex flex-col shadow-sm hover:shadow-xl
                  transition-all duration-300 hover:-translate-y-1
                  ${animClass(isVisible, "up")}`}
    >
      <div className="h-1.5 bg-gradient-to-r from-[#025CB8] to-[#62AAEA]" />

      <div className="p-5 flex flex-col flex-1">

        {/* top */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #62AAEA, #025CB8)",
              }}
            >
              <img
                src={careerInfo.logo}
                alt={careerInfo.badge}
                className="w-5 h-5 object-fill"
              />
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">
                {careerInfo.roleName}
              </h3>

              <span className="text-[11px] font-semibold text-[#025CB8]
                               bg-[#025CB8]/10 px-2 py-0.5 rounded-full">
                {careerInfo.badge}
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {careerInfo.summary}
        </p>

        {/* meta */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {careerInfo.duration}
          </span>

          <span className="flex items-center gap-1">
            <Target size={12} />
            {careerInfo.careerStage}
          </span>
        </div>

        {/* skills */}
        <div className="flex flex-col gap-2 mb-5">
          {careerInfo.skillStack.map((skillLabel) => (
            <div
              key={skillLabel}
              className="flex items-center gap-2"
            >
              <CheckCircle2
                size={13}
                className="text-[#025CB8] shrink-0"
              />

              <span className="text-xs text-gray-600">
                {skillLabel}
              </span>
            </div>
          ))}
        </div>

        <div className="h-px bg-gray-100 mb-4" />

        {/* roadmap mini */}
        <div className="mb-5">
          <p
            className="text-[10px] uppercase tracking-wider
                       text-gray-400 font-bold flex items-center gap-1 mb-3"
          >
            <BookOpen size={11} />
            Preview Roadmap
          </p>

          <div className="space-y-2">
            {roadmapStages.map((phase) => {
              const isLocked = phase.access === "locked";

              return (
                <div
                  key={phase.stepNo}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0
                    ${isLocked
                        ? "bg-gray-100 text-gray-400"
                        : "bg-[#025CB8] text-white"
                      }`}
                  >
                    {isLocked ? (
                      <Lock size={10} />
                    ) : (
                      <span className="text-[9px] font-bold">
                        {phase.stepNo}
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex-1 text-xs ${isLocked
                      ? "text-gray-300"
                      : "text-gray-600"
                      }`}
                  >
                    <span className="font-semibold">
                      {phase.headline}
                    </span>

                    <span>
                      {isLocked
                        ? " — 🔒 Login untuk lihat"
                        : ` — ${phase.detail}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onOpenRoadmap}
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

type ModalProps = {
  closeModal: () => void;
  gotoLogin: () => void;
  gotoRegister: () => void;
};

const CareerModal = ({
  closeModal,
  gotoLogin,
  gotoRegister,
}: ModalProps) => {
  const featureHighlights = useMemo(
    () => [
      {
        icon: (
          <Target
            size={15}
            className="text-[#025CB8]"
          />
        ),
        box: "bg-blue-50",
        text: "Roadmap personal berdasarkan skill saat ini",
      },

      {
        icon: (
          <BookOpen
            size={15}
            className="text-green-600"
          />
        ),
        box: "bg-green-50",
        text: "Kursus yang direkomendasikan AI per tahap",
      },

      {
        icon: (
          <Sparkles
            size={15}
            className="text-purple-500"
          />
        ),
        box: "bg-purple-50",
        text: "Progress tracking & analisis skill gap visual",
      },

      {
        icon: (
          <CheckCircle2
            size={15}
            className="text-orange-500"
          />
        ),
        box: "bg-orange-50",
        text: "Estimasi waktu & milestone yang realistis",
      },
    ],
    []
  );

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
                 flex items-center justify-center p-4"
    >
      <div
        onClick={(ev) => ev.stopPropagation()}
        className="bg-white rounded-2xl overflow-hidden
                   shadow-2xl w-full max-w-md"
      >
        {/* top */}
        <div className="bg-gradient-to-r from-[#025CB8] to-[#62AAEA]
                        px-6 pt-8 pb-10 text-center">
          <div
            className="w-14 h-14 rounded-full bg-white/20
                       flex items-center justify-center mx-auto mb-4"
          >
            <BrainCircuit
              size={26}
              className="text-white"
            />
          </div>

          <h2 className="text-white text-xl font-bold mb-1">
            Roadmap Karir Personal
          </h2>

          <p className="text-white/80 text-sm">
            Masuk untuk mendapatkan roadmap yang disesuaikan
            dengan skill dan tujuan karir kamu!
          </p>
        </div>

        {/* body */}
        <div className="px-6 pt-2 pb-4 -mt-6">
          <div
            className="bg-white rounded-2xl border border-gray-100
                       shadow-md p-5 space-y-3"
          >
            {featureHighlights.map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-3"
              >
                <div
                  className={`${feature.box}
                  w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}
                >
                  {feature.icon}
                </div>

                <p className="text-sm text-gray-700">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* actions */}
        <div className="px-6 pb-6 flex flex-col gap-3">
          <button
            onClick={gotoLogin}
            className="w-full bg-[#025CB8] hover:bg-[#0147A0]
                       text-white font-bold py-3 rounded-xl
                       transition-colors duration-200 shadow-md"
          >
            Masuk & Lihat Roadmap Saya
          </button>

          <button
            onClick={gotoRegister}
            className="w-full border-2 border-[#025CB8]
                       text-[#025CB8] hover:bg-blue-50
                       font-bold py-3 rounded-xl
                       transition-colors duration-200"
          >
            Daftar Gratis — Mulai Sekarang
          </button>

          <button
            onClick={closeModal}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Lanjut lihat-lihat dulu
          </button>
        </div>
      </div>
    </div>
  );
};

const JalurKarir = () => {
  const navigate = useNavigate();

  const [isPromptOpen, setIsPromptOpen] =
    useState(false);

  const {
    ref: heroSectionRef,
    isVisible: heroShown,
  } = useScrollAnimation();

  const {
    ref: statBannerRef,
    isVisible: statBannerShown,
  } = useScrollAnimation();

  const {
    ref: ctaSectionRef,
    isVisible: ctaShown,
  } = useScrollAnimation();

  const statCards = [
    {
      icon: (
        <Target
          size={20}
          className="text-[#025CB8]"
        />
      ),
      bg: "bg-blue-50",
      value: "6+",
      label: "Jalur Karir IT",
    },

    {
      icon: (
        <BookOpen
          size={20}
          className="text-green-600"
        />
      ),
      bg: "bg-green-50",
      value: "4",
      label: "Tahap per Roadmap",
    },

    {
      icon: (
        <Sparkles
          size={20}
          className="text-purple-500"
        />
      ),
      bg: "bg-purple-50",
      value: "AI",
      label: "Analisis Skill Gap",
    },

    {
      icon: (
        <Clock
          size={20}
          className="text-orange-500"
        />
      ),
      bg: "bg-orange-50",
      value: "≤12",
      label: "Bulan Estimasi",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <HeaderComponent />

      {/* hero */}
      <section className="flex flex-col items-center px-4 sm:px-8 pt-[100px]">
        <div
          ref={heroSectionRef}
          className={`w-full max-w-[1210px]
          rounded-2xl border border-[#025CB8]
          flex flex-col items-center py-16 sm:py-24 px-6
          ${animClass(heroShown, "up")}`}
          style={{
            background:
              "linear-gradient(180deg, #00458D, #00458D00)",
          }}
        >
          <div
            className="flex items-center gap-2 bg-white/10
                       px-3 py-1 rounded-full mb-6"
          >
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/zv3i8izk_expires_30_days.png"
              alt="AI"
              className="w-3 h-[13px] object-fill"
            />

            <span className="text-white/80 text-xs font-medium">
              Didukung oleh AI Presisi
            </span>
          </div>

          <h1
            className="text-[#191C21] text-2xl sm:text-[40px]
                       font-bold text-center leading-snug
                       max-w-[681px] mb-5"
          >
            Navigasi Masa Depan Karir IT Anda
            dengan TALENTIQ AI
          </h1>

          <p
            className="text-white text-sm sm:text-lg
                       text-center leading-8
                       max-w-[753px] mb-8"
          >
            Temukan peta jalan karir yang dipersonalisasi.
            Kami menganalisis tren industri global
            untuk membantu Anda menguasai keahlian
            yang paling dibutuhkan saat ini.
          </p>

          <button
            onClick={() => setIsPromptOpen(true)}
            className="flex items-center gap-2 bg-white
                       text-[#025CB8] font-bold
                       px-8 py-3.5 rounded-xl
                       hover:bg-gray-50 transition-colors
                       duration-200 shadow-lg"
          >
            Lihat Roadmap Personal Saya
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* stats */}
      <section className="flex justify-center px-4 sm:px-8 mt-8">
        <div
          ref={statBannerRef}
          className={`w-full max-w-[1210px]
          ${animClass(statBannerShown, "up")}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-gray-100
                           shadow-sm p-4 flex items-center gap-3"
              >
                <div
                  className={`${stat.bg}
                  w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}
                >
                  {stat.icon}
                </div>

                <div>
                  <p className="text-xl font-black text-gray-800">
                    {stat.value}
                  </p>

                  <p className="text-xs text-gray-400 font-medium leading-tight">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* card list */}
      <section className="flex justify-center px-4 sm:px-8 mt-8 mb-10 sm:mb-16">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                     gap-5 w-full max-w-[1210px]"
        >
          {careerTracks.map((track, idx) => (
            <CareerBox
              key={track.roleName}
              careerInfo={track}
              animDelay={(idx % 3) * 100}
              onOpenRoadmap={() =>
                setIsPromptOpen(true)
              }
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex justify-center px-4 sm:px-8 pb-16 sm:pb-24">
        <div
          ref={ctaSectionRef}
          className={`w-full max-w-[1210px]
          ${animClass(ctaShown, "up")}`}
        >
          <div
            className="bg-[#025CB8] rounded-2xl border border-[#D9D9D9]
                       p-8 sm:p-[50px]
                       flex flex-col lg:flex-row items-center gap-8"
            style={{
              boxShadow: "0px 4px 10px #00000080",
            }}
          >
            <div className="flex-1 flex flex-col items-start">

              <h2
                className="text-white text-2xl sm:text-[36px]
                           font-bold leading-snug mb-4"
              >
                Belum yakin jalur mana yang tepat untuk Anda?
              </h2>

              <p
                className="text-[#C6D8FF] text-sm sm:text-base
                           leading-8 mb-6"
              >
                Gunakan AI Career Assessment kami untuk
                menganalisis minat dan bakat Anda.
                Dapatkan roadmap personal dengan 4 tahap
                terstruktur, estimasi waktu, dan kursus
                yang direkomendasikan — semua dalam 5 menit.
              </p>

              <div className="flex items-center gap-2 flex-wrap mb-8">
                {["Fondasi", "Inti Skill", "Proyek", "Siap Kerja"]
                  .map((phaseName, phaseIdx) => (
                    <div
                      key={phaseName}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="flex items-center gap-1.5
                                   bg-white/10 px-3 py-1.5 rounded-lg"
                      >
                        <div
                          className="w-4 h-4 rounded-full
                                     bg-white/30
                                     flex items-center justify-center
                                     text-[9px] font-bold text-white"
                        >
                          {phaseIdx + 1}
                        </div>

                        <span className="text-white text-xs font-semibold">
                          {phaseName}
                        </span>
                      </div>

                      {phaseIdx < 3 && (
                        <ChevronRight
                          size={14}
                          className="text-white/40"
                        />
                      )}
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setIsPromptOpen(true)}
                className="flex items-center gap-2 bg-white
                           text-[#025CB8] font-bold
                           px-8 py-3.5 rounded-xl
                           hover:bg-gray-50 transition-colors
                           duration-200 shadow-lg hover:shadow-xl"
              >
                Mulai Tes Gratis
                <ArrowRight size={16} />
              </button>
            </div>

            {/* preview kanan */}
            <div
              className="w-full lg:w-80 shrink-0
                         bg-white/10 backdrop-blur-sm
                         border border-white/20
                         rounded-2xl p-5"
            >
              <p
                className="text-white/60 text-[10px]
                           uppercase tracking-wider
                           font-bold mb-4"
              >
                Pratinjau Roadmap Member
              </p>

              <div className="space-y-3">
                {[
                  {
                    no: 1,
                    title: "Fondasi Data",
                    done: true,
                    progress: 100,
                  },

                  {
                    no: 2,
                    title: "Analisis Data",
                    done: false,
                    progress: 65,
                  },

                  {
                    no: 3,
                    title: "Visualisasi",
                    done: false,
                    progress: 0,
                    locked: true,
                  },

                  {
                    no: 4,
                    title: "Machine Learning",
                    done: false,
                    progress: 0,
                    locked: true,
                  },
                ].map((roadmapItem) => {
                  const badgeStyle =
                    roadmapItem.done
                      ? "bg-green-400 text-white"
                      : roadmapItem.locked
                        ? "bg-white/20 text-white/50"
                        : "bg-white text-[#025CB8]";

                  return (
                    <div
                      key={roadmapItem.no}
                      className={`flex items-center gap-3 ${roadmapItem.locked
                        ? "opacity-40"
                        : ""
                        }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full
                        flex items-center justify-center
                        text-xs font-bold shrink-0 ${badgeStyle}`}
                      >
                        {roadmapItem.done
                          ? "✓"
                          : roadmapItem.locked
                            ? "🔒"
                            : roadmapItem.no}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold">
                          {roadmapItem.title}
                        </p>

                        {!roadmapItem.locked &&
                          roadmapItem.progress > 0 && (
                            <div
                              className="mt-1 h-1 bg-white/20
                                         rounded-full overflow-hidden"
                            >
                              <div
                                className="h-full bg-white rounded-full"
                                style={{
                                  width: `${roadmapItem.progress}%`,
                                }}
                              />
                            </div>
                          )}
                      </div>

                      {!roadmapItem.locked && (
                        <span className="text-white/60 text-[10px] shrink-0">
                          {roadmapItem.progress > 0
                            ? `${roadmapItem.progress}%`
                            : "Belum"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-white/40 text-[10px] text-center mt-4">
                🔒 Tahap 3 & 4 tersedia setelah login
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterComponent />

      {isPromptOpen && (
        <CareerModal
          closeModal={() => setIsPromptOpen(false)}
          gotoLogin={() => navigate("/login")}
          gotoRegister={() => navigate("/register")}
        />
      )}
    </div>
  );
};

export default JalurKarir;