import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileSearch,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import HeaderComponent from "@/layout/header";
import FooterComponent from "@/layout/footer";
import {
  useScrollAnimation,
  animClass,
} from "@/hooks/use-scroll-animation";

const aiHighlights = [
  {
    heading: "Analisis Skill Otomatis",
    description:
      "AI membaca CV dan mengenali skill teknis sampai soft skill secara otomatis.",
    icon: <Sparkles size={22} />,
  },
  {
    heading: "Pemetaan Karir",
    description:
      "Cari posisi kerja yang paling relevan berdasarkan pengalaman dan kemampuan.",
    icon: <Target size={22} />,
  },
  {
    heading: "Rekomendasi Pengembangan",
    description:
      "Dapat insight skill mana yang perlu ditingkatkan buat ngejar karir impian.",
    icon: <Trophy size={22} />,
  },
];

const workflowSteps = [
  {
    title: "Upload CV",
    caption: "Upload file CV format PDF atau DOCX.",
    icon: <FileSearch size={20} />,
  },
  {
    title: "AI Scan CV",
    caption: "Sistem bakal membaca pengalaman, pendidikan, dan skill.",
    icon: <Brain size={20} />,
  },
  {
    title: "Lihat Hasil",
    caption: "Dapat insight skill dan rekomendasi karir.",
    icon: <CheckCircle2 size={20} />,
  },
];

const skillOverview = [
  { skillName: "Frontend Development", percentage: 92 },
  { skillName: "UI/UX Design", percentage: 78 },
  { skillName: "Data Analysis", percentage: 65 },
];

const gradientBlue = "linear-gradient(135deg, #025CB8, #62AAEA)";
const gradientHero = "linear-gradient(135deg, #025CB8, #3B82C4)";

const AnalisisSkill = () => {
  const router = useNavigate();

  const heroAnim = useScrollAnimation();
  const benefitAnim = useScrollAnimation();
  const processAnim = useScrollAnimation();
  const closingAnim = useScrollAnimation();

  const openAnalysisPage = () =>
    router("/auth/user-analisis-skill");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)",
      }}
    >
      <HeaderComponent />

      <main className="flex-1 pt-[100px]">

        {/* hero */}
        <section
          ref={heroAnim.ref}
          className={`max-w-7xl mx-auto px-5 lg:px-8 pb-20 ${animClass(
            heroAnim.isVisible,
            "up"
          )}`}
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-5">
                <Sparkles size={14} className="text-[#025CB8]" />

                <span className="text-xs font-semibold text-[#025CB8]">
                  AI Career Analysis
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-black leading-tight text-gray-800">
                Analisis Skill &
                <span className="block text-[#025CB8]">
                  Potensi Karirmu
                </span>
              </h1>

              <p className="mt-6 text-gray-500 text-lg leading-8 max-w-xl">
                Gunakan AI buat membaca CV, mengenali kemampuan,
                dan bantu nemuin jalur karir yang paling cocok
                sama skill yang kamu punya.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={openAnalysisPage}
                  className="px-7 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  style={{ background: gradientHero }}
                >
                  Mulai Analisis
                  <ArrowRight size={18} />
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheck
                    size={16}
                    className="text-green-500"
                  />
                  Aman & Privat
                </div>
              </div>
            </div>

            {/* preview kanan */}
            <div className="relative">
              <div
                className="rounded-[32px] p-6 shadow-2xl border border-white/60 backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Hasil Analisis AI
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Skill compatibility overview
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Zap
                      size={22}
                      className="text-[#025CB8]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {skillOverview.map(({ skillName, percentage }) => (
                    <div key={skillName}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">
                          {skillName}
                        </span>

                        <span className="text-sm font-bold text-[#025CB8]">
                          {percentage}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full"
                          style={{
                            width: `${percentage}%`,
                            background: gradientBlue,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-sm text-[#025CB8] font-semibold">
                    Rekomendasi AI:
                  </p>

                  <p className="text-xs text-gray-600 mt-1 leading-6">
                    Tingkatkan skill React & TypeScript buat
                    memperbesar peluang jadi Frontend Engineer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* benefit */}
        <section
          ref={benefitAnim.ref}
          className={`max-w-7xl mx-auto px-5 lg:px-8 pb-24 ${animClass(
            benefitAnim.isVisible,
            "up"
          )}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-800">
              Kenapa Pakai AI Kami?
            </h2>

            <p className="text-gray-500 mt-3">
              Analisis modern buat bantu perkembangan karirmu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {aiHighlights.map((featureCard) => (
              <div
                key={featureCard.heading}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white"
                  style={{ background: gradientBlue }}
                >
                  {featureCard.icon}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {featureCard.heading}
                </h3>

                <p className="text-sm text-gray-500 leading-7">
                  {featureCard.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* step */}
        <section
          ref={processAnim.ref}
          className={`max-w-6xl mx-auto px-5 lg:px-8 pb-24 ${animClass(
            processAnim.isVisible,
            "up"
          )}`}
        >
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 lg:p-12">

            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-800">
                Cara Kerjanya
              </h2>

              <p className="text-gray-500 mt-3">
                Tinggal beberapa langkah aja.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {workflowSteps.map((phase, stepIndex) => {
                const isLastStep =
                  stepIndex === workflowSteps.length - 1;

                return (
                  <div
                    key={phase.title}
                    className="text-center relative"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white mb-5"
                      style={{ background: gradientBlue }}
                    >
                      {phase.icon}
                    </div>

                    {!isLastStep && (
                      <div className="absolute top-7 right-[-20px] hidden md:block">
                        <ArrowRight
                          className="text-gray-300"
                          size={24}
                        />
                      </div>
                    )}

                    <h3 className="font-bold text-gray-800 mb-2">
                      {phase.title}
                    </h3>

                    <p className="text-sm text-gray-500 leading-7">
                      {phase.caption}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* closing cta */}
        <section
          ref={closingAnim.ref}
          className={`max-w-6xl mx-auto px-5 lg:px-8 pb-24 ${animClass(
            closingAnim.isVisible,
            "up"
          )}`}
        >
          <div
            className="rounded-[32px] p-10 lg:p-14 text-center shadow-2xl"
            style={{ background: gradientHero }}
          >
            <div className="w-20 h-20 rounded-[24px] bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Sparkles
                size={38}
                className="text-white"
              />
            </div>

            <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
              Siap Mengetahui
              <span className="block">
                Potensi Karirmu?
              </span>
            </h2>

            <p className="text-blue-100 text-lg mt-5 max-w-2xl mx-auto leading-8">
              Upload CV kamu dan biarkan AI bantu menemukan
              skill terbaik sekaligus arah karir yang paling cocok.
            </p>

            <button
              onClick={openAnalysisPage}
              className="mt-8 px-8 py-4 rounded-2xl bg-white text-[#025CB8] font-bold text-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-2"
            >
              Mulai Sekarang
              <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </main>

      <FooterComponent />
    </div>
  );
};

export default AnalisisSkill;