// src/pages/home.tsx
import { useNavigate } from "react-router-dom";
import { useScrollAnimation, animClass } from "@/hooks/use-scroll-animation";
import bgHero from "@/assets/bg.jpg";
import bg1 from "@/assets/bg1.jpg";

// ── Animated Section Wrapper ──────────────────────────────────────────────────
const AnimSection = ({
  children,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade";
  delay?: number;
  className?: string;
}) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={`${animClass(isVisible, direction)} ${className}`}>
      {children}
    </div>
  );
};

// ── Feature Card ──────────────────────────────────────────────────────────────
const FeatureCard = ({
  feature,
}: {
  feature: { title: string; desc: string; path: string; img: string };
  delay: number;
}) => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`${animClass(isVisible, "up")}`}
    >
      <button
        onClick={() => navigate(feature.path)}
        className="flex w-full flex-col items-start py-8 px-6 rounded-[10px] border-0 text-left
                   cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl
                   focus:outline-none focus:ring-4 focus:ring-white/50 h-full"
        style={{ background: "linear-gradient(180deg, #025CB8, #62AAEA)" }}
      >
        <img src={feature.img} className="w-12 h-12 mb-6 object-fill" alt={feature.title} />
        <span className="text-white text-xl lg:text-2xl mb-3 font-semibold">{feature.title}</span>
        <span className="text-white text-sm lg:text-base mb-6 leading-7">{feature.desc}</span>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-white/80 text-sm font-medium">Selengkapnya</span>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white/80">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Analisis Skill",
      desc: "Pemetaan mendalam terhadap kompetensi teknis dan soft skills Anda melalui penilaian berbasis AI yang objektif.",
      path: "/analisis-skill",
      img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/td3zvffq_expires_30_days.png",
    },
    {
      title: "Jalur Karir",
      desc: "Rekomendasi langkah karir selanjutnya berdasarkan data pasar tenaga kerja real-time dan aspirasi pribadi Anda.",
      path: "/jalur-karir",
      img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/rn7ixpy3_expires_30_days.png",
    },
    {
      title: "Lowongan Pekerjaan",
      desc: "Cari lowongan yang benar-benar sesuai dengan profil dan spesifikasi keahlian Anda.",
      path: "/lowongan-kerja",
      img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/7lcsjx5k_expires_30_days.png",
    },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen">

      <div className="w-full pt-[20px] md:pt-[0px]" style={{ background: "linear-gradient(180deg, #ffffff)" }}>
        <div className="flex flex-col items-center">

          {/* ── HERO ── */}
          <section
            className="w-full relative overflow-hidden"
            style={{
              backgroundImage: `url(${bgHero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-[50px] py-16 md:py-24">

              <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-8">

                {/* LEFT */}
                <AnimSection
                  direction="left"
                  className="flex flex-col items-start w-full lg:max-w-[520px]"
                >
                  <button className="flex items-center bg-white/20 backdrop-blur-md py-1 px-3 mb-4 gap-2 rounded-[30px] border-0">
                    <img
                      src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/z72i6j9m_expires_30_days.png"
                      className="w-4 h-4 object-fill"
                      alt="AI"
                    />

                    <span className="text-white text-sm">
                      AI-Powered Career Intelligence
                    </span>
                  </button>

                  <h1 className="text-white text-3xl sm:text-4xl lg:text-[40px] font-bold mb-4 leading-[1.3]">
                    Masa Depan Karir Anda,<br />
                    Terukur dan Terarah.
                  </h1>

                  <p className="text-white/90 text-base lg:text-lg mb-6 leading-8 max-w-[500px]">
                    TalentIQ AI menggunakan algoritma kecerdasan buatan tingkat lanjut
                    untuk menganalisis keahlian Anda, memetakan jalur karir yang optimal,
                    dan menghubungkan Anda dengan peluang kerja terbaik.
                  </p>

                </AnimSection>

                {/* Right */}
                <AnimSection direction="right" delay={150} className="w-full lg:w-auto flex justify-center">
                  <div className="flex flex-col shrink-0 items-center relative">
                    <div
                      className="flex flex-col items-start bg-cover bg-center rounded-[20px] w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[430px] lg:h-[430px]"
                      style={{ backgroundImage: "url(https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/mjsm7op3_expires_30_days.png)" }}
                    >
                      <span className="text-black text-3xl lg:text-5xl font-bold p-8">Statistik</span>
                    </div>
                    {/* Floating Card */}
                    <div
                      className="flex flex-col items-start bg-white absolute bottom-[-30px] left-2 py-4 px-5 gap-2 rounded-xl"
                      style={{ boxShadow: "0px 4px 6px #0000001A" }}
                    >
                      <div className="flex items-center gap-2">
                        <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/kit608t2_expires_30_days.png" className="w-5 h-3 object-fill" alt="Insight" />
                        <span className="text-[#0061A4] text-xs font-bold">AI INSIGHT</span>
                      </div>
                      <span className="text-[#191C21] text-sm w-[200px] sm:w-[240px] leading-5">
                        Keahlian 'Data Analytics' Anda memiliki kecocokan 94% dengan tren industri 2026.
                      </span>
                    </div>
                  </div>
                </AnimSection>
              </div>
            </div>
          </section>

          {/* ── WHY ── */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-[50px] pt-16 pb-16 md:pb-24 text-center">
            <AnimSection direction="up">
              <h2 className="text-[#191C21] text-2xl sm:text-[32px] font-bold mb-6">Kenapa Talentiq-AI?</h2>
              <p className="text-[#424752] text-sm sm:text-base leading-8 max-w-[900px] mx-auto">
                Talentiq-AI membantu kamu memahami kemampuan dan potensi karir dengan lebih cepat, akurat,
                dan berbasis data industri nyata. Dengan analisis AI yang cerdas, kamu bisa mengetahui skill
                yang perlu ditingkatkan, mendapatkan rekomendasi karir yang sesuai, serta roadmap pembelajaran
                yang jelas untuk mencapai pekerjaan impianmu. Jadi, kamu nggak perlu bingung menentukan arah
                karir karena semua insight diberikan secara terarah dan relevan dengan kebutuhan dunia kerja saat ini.
              </p>
            </AnimSection>
          </section>

          {/* ── CV SCAN ── */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-[50px] pb-16 md:pb-24">
            <AnimSection direction="up">
              <h2 className="text-[#191C21] text-2xl sm:text-[32px] font-bold text-center mb-8 max-w-[900px] mx-auto leading-snug">
                Bukan sekadar cari kerja. Kami bantu rancang ekosistem pertumbuhan karir Anda yang
                berkelanjutan lewat analisis data yang presisi.
              </h2>
            </AnimSection>

            <AnimSection direction="up" delay={150}>
              <div
                className="relative overflow-hidden rounded-[20px]"
                style={{
                  backgroundImage: `url(${bg1})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  boxShadow: "0px 4px 10px #00000080",
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Content */}
                <button
                  className="relative z-10 flex flex-col items-center justify-center w-full py-16 sm:py-[81px]
                   border border-solid border-white/20 hover:border-[#025CB8]
                   transition-colors duration-300"
                >
                  <img
                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/urvgnt1g_expires_30_days.png"
                    className="w-16 sm:w-20 h-auto mb-10 sm:mb-[68px] object-fill"
                    alt="CV"
                  />

                  <span className="text-white text-3xl sm:text-[50px] text-center px-4 font-bold">
                    Scan CV Anda
                  </span>

                  <p className="text-white/80 text-center mt-4 max-w-[600px] px-4 leading-7">
                    Upload CV Anda dan biarkan AI menganalisis kemampuan,
                    kecocokan industri, dan rekomendasi karir terbaik untuk masa depan Anda.
                  </p>
                </button>
              </div>
            </AnimSection>
          </section>

          {/* ── FEATURES ── */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-[50px] pb-20 md:pb-[120px] text-center">
            <AnimSection direction="up">
              <h2 className="text-[#191C21] text-2xl sm:text-[32px] font-bold mb-4">
                Bagaimana Kami Membantu Anda?
              </h2>
              <p className="text-[#424752] text-sm sm:text-base mb-10 max-w-[600px] mx-auto">
                Kami tidak sekadar mencari pekerjaan; kami merancang ekosistem pertumbuhan karir yang
                berkelanjutan menggunakan data dan presisi.
              </p>
            </AnimSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <FeatureCard key={feature.title} feature={feature} delay={i * 100} />
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Home;