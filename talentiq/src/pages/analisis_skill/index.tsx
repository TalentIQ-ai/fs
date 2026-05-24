// src/pages/analisis_skill/index.tsx
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

import HeaderComponent from "@/layout/header";
import FooterComponent from "@/layout/footer";
import { useScrollAnimation, animClass } from "@/hooks/use-scroll-animation";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Analisis Skill Otomatis",
    desc: "AI membaca CV dan mengidentifikasi skill teknis maupun soft skill secara otomatis.",
    icon: <Sparkles size={22} />,
  },
  {
    title: "Pemetaan Karir",
    desc: "Menentukan kecocokan posisi kerja berdasarkan pengalaman dan kemampuan.",
    icon: <Target size={22} />,
  },
  {
    title: "Rekomendasi Pengembangan",
    desc: "Mendapatkan saran skill yang perlu ditingkatkan untuk karir impianmu.",
    icon: <Trophy size={22} />,
  },
];

const analysisSteps = [
  {
    title: "Upload CV",
    desc: "Unggah file CV format PDF atau DOCX.",
    icon: <FileSearch size={20} />,
  },
  {
    title: "AI Membaca CV",
    desc: "Sistem menganalisis pengalaman, pendidikan, dan skill.",
    icon: <Brain size={20} />,
  },
  {
    title: "Hasil Analisis",
    desc: "Dapatkan insight skill dan rekomendasi karir.",
    icon: <CheckCircle2 size={20} />,
  },
];

const AnalisisSkill = () => {
  const navigate = useNavigate();

  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: featureRef, isVisible: featureVisible } = useScrollAnimation();
  const { ref: stepRef, isVisible: stepVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)",
      }}
    >
      <HeaderComponent />

      <div className="flex-1 pt-[100px]">
        {/* HERO */}
        <section
          ref={heroRef}
          className={`max-w-7xl mx-auto px-5 lg:px-8 pb-20
          ${animClass(heroVisible, "up", 0)}`}
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* LEFT */}
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
                Gunakan AI untuk membaca CV, mengidentifikasi kemampuan,
                dan menemukan jalur karir terbaik sesuai skill yang kamu miliki.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() => navigate("/auth/user-analisis-skill")}
                  className="px-7 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #025CB8, #3B82C4)",
                  }}
                >
                  Mulai Analisis
                  <ArrowRight size={18} />
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheck size={16} className="text-green-500" />
                  Aman & Privat
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <div
                className="rounded-[32px] p-6 shadow-2xl border border-white/60 backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
                }}
              >
                {/* fake analysis preview */}
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
                    <Zap size={22} className="text-[#025CB8]" />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Frontend Development", value: "92%" },
                    { label: "UI/UX Design", value: "78%" },
                    { label: "Data Analysis", value: "65%" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-[#025CB8]">
                          {item.value}
                        </span>
                      </div>

                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full"
                          style={{
                            width: item.value,
                            background:
                              "linear-gradient(90deg, #025CB8, #62AAEA)",
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
                    Tingkatkan skill React & TypeScript untuk memperbesar peluang
                    menjadi Frontend Engineer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          ref={featureRef}
          className={`max-w-7xl mx-auto px-5 lg:px-8 pb-24
          ${animClass(featureVisible, "up", 0)}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-800">
              Kenapa Menggunakan AI Kami?
            </h2>
            <p className="text-gray-500 mt-3">
              Analisis modern untuk membantu perkembangan karirmu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #025CB8, #62AAEA)",
                  }}
                >
                  {item.icon}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 leading-7">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* STEPS */}
        <section
          ref={stepRef}
          className={`max-w-6xl mx-auto px-5 lg:px-8 pb-24
          ${animClass(stepVisible, "up", 0)}`}
        >
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-800">
                Cara Kerjanya
              </h2>
              <p className="text-gray-500 mt-3">
                Hanya butuh beberapa langkah sederhana.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {analysisSteps.map((step, idx) => (
                <div key={step.title} className="text-center relative">
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white mb-5"
                    style={{
                      background:
                        "linear-gradient(135deg, #025CB8, #62AAEA)",
                    }}
                  >
                    {step.icon}
                  </div>

                  <div className="absolute top-7 right-[-20px] hidden md:block">
                    {idx !== analysisSteps.length - 1 && (
                      <ArrowRight className="text-gray-300" size={24} />
                    )}
                  </div>

                  <h3 className="font-bold text-gray-800 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-7">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          ref={ctaRef}
          className={`max-w-6xl mx-auto px-5 lg:px-8 pb-24
          ${animClass(ctaVisible, "up", 0)}`}
        >
          <div
            className="rounded-[32px] p-10 lg:p-14 text-center shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, #025CB8, #3B82C4)",
            }}
          >
            <div className="w-20 h-20 rounded-[24px] bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Sparkles size={38} className="text-white" />
            </div>

            <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
              Siap Mengetahui
              <span className="block">Potensi Karirmu?</span>
            </h2>

            <p className="text-blue-100 text-lg mt-5 max-w-2xl mx-auto leading-8">
              Upload CV kamu dan biarkan AI membantu menemukan skill terbaik
              serta arah karir yang paling cocok.
            </p>

            <button
              onClick={() => navigate("/auth/user-analisis-skill")}
              className="mt-8 px-8 py-4 rounded-2xl bg-white text-[#025CB8] font-bold text-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-2"
            >
              Mulai Sekarang
              <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </div>

      <FooterComponent />
    </div>
  );
};

export default AnalisisSkill;