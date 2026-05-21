// src/pages/jalur_karir/index.tsx
import HeaderComponent from "@/layout/header";
import FooterComponent from "@/layout/footer";
import { useScrollAnimation, animClass } from "@/hooks/use-scroll-animation";

const allCards = [
  { tag: "Gaji Tinggi", img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/ysqq6gmp_expires_30_days.png", title: "Fullstack Web Developer", desc: "Membangun ekosistem web end-to-end. Peran ini sangat krusial bagi startup dan korporasi besar yang melakukan transformasi digital.", skills: ["HTML, CSS, modern JS", "React / Vue / Next.js", "Node.js & Database"] },
  { tag: "Kreatif", img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/4gquxufv_expires_30_days.png", title: "UI/UX Designer", desc: "Menciptakan pengalaman pengguna yang intuitif. Fokus pada riset, prototyping, dan desain visual yang bermakna.", skills: ["Design Thinking & Research", "Wireframing & Figma", "Prototyping & Testing"] },
  { tag: "Rekomendasi AI", img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/aodhzoyr_expires_30_days.png", title: "Data Scientist", desc: "Mengolah data mentah menjadi wawasan strategis menggunakan algoritma machine learning dan statistika tingkat lanjut.", skills: ["Python & SQL", "Matematika & Statistika", "Machine Learning Models"] },
  { tag: "Trend Mobile", img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/vyqusck2_expires_30_days.png", title: "Mobile App Developer", desc: "Membangun aplikasi performa tinggi untuk Android dan iOS. Fokus pada antarmuka responsif dan fungsionalitas device-native.", skills: ["Kotlin / Swift Fundamentals", "Flutter / React Native", "App Store Optimization"] },
  { tag: "Proteksi", img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/go6xhlpa_expires_30_days.png", title: "Cybersecurity Analyst", desc: "Menjaga keamanan aset digital perusahaan dari serangan siber. Peran yang sangat krusial di era data privasi ini.", skills: ["Networking Fundamentals", "Ethical Hacking & Pen-test", "Security Compliance"] },
  { tag: "Infrastruktur", img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/b8ioyb9j_expires_30_days.png", title: "Cloud Solutions Architect", desc: "Merancang infrastruktur cloud yang skalabel dan efisien menggunakan platform seperti AWS, GCP, atau Azure.", skills: ["Linux & Virtualization", "Docker & Kubernetes", "Cloud Providers (AWS/GCP)"] },
];

const CareerCard = ({ card, delay }: { card: typeof allCards[0]; delay: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`flex flex-col items-start pt-[30px] rounded-[17px] ${animClass(isVisible, "up", delay)}`}
      style={{ background: "linear-gradient(180deg, #62AAEA, #1483D7)" }}
    >
      <div className="flex justify-between items-center w-full mb-6 px-6">
        <img src={card.img} className="w-5 h-5 object-fill" alt={card.tag} />
        <span className="text-[#001D36] text-xs">{card.tag}</span>
      </div>
      <span className="text-[#191C21] text-xl font-semibold mb-2 ml-6">{card.title}</span>
      <span className="text-white text-sm leading-6 mb-6 mx-6">{card.desc}</span>
      <div className="space-y-3 ml-6 mb-6">
        {card.skills.map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className="bg-white w-2 h-2 rounded-full shrink-0" />
            <span className="text-white text-sm">{s}</span>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center mb-8">
        <span className="text-white text-sm cursor-pointer hover:underline">Lihat Roadmap Lengkap</span>
      </div>
    </div>
  );
};

const JalurKarir = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #D9E7F6, #FFFFFF)" }}>
      <HeaderComponent />

      {/* HERO */}
      <div className="flex flex-col items-center px-4 sm:px-8 pt-[100px]">
        <div
          ref={heroRef}
          className={`flex flex-col items-center w-full max-w-[1210px] py-16 sm:py-32 px-6 rounded-[10px] border border-[#025CB8] ${animClass(heroVisible, "up")}`}
          style={{ background: "linear-gradient(180deg, #00458D, #00458D00)" }}
        >
          <div className="flex items-center mb-6 gap-2">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/zv3i8izk_expires_30_days.png" className="w-3 h-[13px] object-fill" alt="AI" />
            <span className="text-[#001D36] text-xs">Didukung oleh AI Presisi</span>
          </div>
          <h1 className="text-[#191C21] text-2xl sm:text-[40px] font-bold text-center max-w-[681px] mb-5 leading-snug">
            Navigasi Masa Depan Karir IT Anda dengan TALENTIQ AI
          </h1>
          <p className="text-white text-sm sm:text-lg text-center max-w-[753px] leading-8">
            Temukan peta jalan karir yang dipersonalisasi. Kami menganalisis tren industri global untuk
            membantu Anda menguasai keahlian yang paling dibutuhkan saat ini.
          </p>
        </div>
      </div>

      {/* ALL CAREER CARDS */}
      <div className="flex justify-center px-4 sm:px-8 mt-10 mb-16 sm:mb-[100px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-[1210px]">
          {allCards.map((card, i) => (
            <CareerCard key={card.title} card={card} delay={(i % 3) * 100} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center px-4 sm:px-8 pb-16 sm:pb-32">
        <div
          ref={ctaRef}
          className={`flex flex-col lg:flex-row items-start bg-[#025CB8] w-full max-w-[1210px] p-8 sm:p-[50px] rounded-[10px] border border-[#D9D9D9] gap-8 ${animClass(ctaVisible, "up")}`}
          style={{ boxShadow: "0px 4px 10px #00000080" }}
        >
          <div className="flex-1 flex flex-col items-start">
            <h2 className="text-white text-2xl sm:text-[40px] font-bold mb-5 leading-snug">
              Belum yakin jalur mana yang tepat untuk Anda?
            </h2>
            <p className="text-[#C6D8FF] text-sm sm:text-base mb-8 leading-8">
              Gunakan AI Career Assessment kami untuk menganalisis minat dan bakat Anda dalam 5 menit.
            </p>
            <button className="bg-white py-3.5 px-8 rounded-xl" style={{ boxShadow: "0px 4px 6px #0000001A" }}>
              <span className="text-[#025CB8] text-lg sm:text-2xl">Mulai Tes Gratis</span>
            </button>
          </div>
          <div className="bg-[#D9D9D9] w-full lg:w-80 h-[200px] lg:h-[254px] rounded-[10px]" />
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default JalurKarir;