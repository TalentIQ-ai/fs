// src/pages/analisis_skill/index.tsx
import HeaderComponent from "@/layout/header";
import FooterComponent from "@/layout/footer";
import { useScrollAnimation, animClass } from "@/hooks/use-scroll-animation";

const dataTes = [
  { title: "Tes Kepribadian", description: "Tes Kepribadian dalam konteks IT dirancang untuk mengukur efektivitas kolaborasi dalam lingkungan kerja Agile dan pola pikir pemecahan masalah (problem-solving). Instrumen ini membantu mengidentifikasi bagaimana Anda berinteraksi dalam tim teknis dan pendekatan Anda terhadap tantangan logika yang kompleks.", reverse: false },
  { title: "Tes Gaya Kerja", description: "Psikotes ini mengevaluasi gaya kerja Anda dalam metodologi pengembangan perangkat lunak seperti Scrum dan Agile. Fokus utama adalah pada kemampuan kolaborasi dalam tim pengembang, manajemen sprint, serta tingkat adaptabilitas terhadap perubahan teknologi dan stack yang digunakan.", reverse: true },
  { title: "Tes Minat dan Bakat", description: "Mengukur preferensi dan potensi teknis Anda dalam berbagai bidang spesialisasi IT. Instrumen ini membantu menentukan apakah bakat alami Anda lebih condong ke arah Artificial Intelligence (AI), Cybersecurity, Cloud Architecture, atau Fullstack Development untuk memaksimalkan potensi karir Anda.", reverse: false },
  { title: "Tes Biometrik", description: "Tes inovatif yang menganalisis tingkat fokus dan manajemen beban kognitif (cognitive load) saat menangani tugas pemrograman yang kompleks atau desain arsitektur sistem.", reverse: true },
  { title: "Tes Kepemimpinan", description: "Berfokus pada kompetensi sebagai Tech Lead dan pimpinan tim teknis. Tes ini mengevaluasi kemampuan Anda dalam membimbing pengembang junior dan menyusun roadmap proyek.", reverse: false },
];

const TesItem = ({ item, index }: { item: typeof dataTes[0]; index: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 ${item.reverse ? "lg:flex-row-reverse" : ""
        } ${animClass(isVisible, item.reverse ? "right" : "left", index * 50)}`}
    >
      <div
        className="w-full lg:w-[400px] h-[200px] sm:h-[275px] rounded-[10px] shrink-0"
        style={{ background: "linear-gradient(180deg, #025CB8, #62AAEA)" }}
      />
      <div className="flex flex-col gap-4 flex-1">
        <h2 className="text-[#025CB8] text-2xl sm:text-[32px] font-bold">{item.title}</h2>
        <p className="text-[#424752] text-sm sm:text-base leading-8">{item.description}</p>
      </div>
    </div>
  );
};

const AnalisisSkill = () => {
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #D9E7F6, #FFFFFF)" }}>
      <HeaderComponent />

      <div className="w-full max-w-[1240px] mx-auto pt-[100px] pb-16 px-4 sm:px-8 flex-1">

        {/* Tes Items */}
        <div className="flex flex-col gap-16 sm:gap-[100px]">
          {dataTes.map((item, index) => (
            <TesItem key={index} item={item} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`flex flex-col items-center bg-[#025CB8] mt-16 sm:mt-[150px] py-10 sm:py-[50px] px-6 sm:px-10 rounded-[10px] ${animClass(ctaVisible, "up")}`}
          style={{ boxShadow: "0px 4px 10px #00000040" }}
        >
          <h2 className="text-white text-2xl sm:text-[40px] font-bold text-center mb-5">
            Siap Mengetahui Skor Karir Anda?
          </h2>
          <p className="text-[#D7E3FF] text-sm sm:text-lg text-center max-w-[700px] leading-8 mb-7">
            Analisis skill berbasis AI untuk membantu menentukan arah karir terbaik sesuai kemampuan
            dan potensi Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <button className="bg-white py-4 px-8 rounded-xl" style={{ boxShadow: "0px 4px 6px #0000001A" }}>
              <span className="text-[#025CB8] text-lg sm:text-xl font-semibold">Mulai Analisis Skill</span>
            </button>
            <span className="text-white text-sm">Waktu pengerjaan rata-rata: 25 Menit</span>
          </div>
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default AnalisisSkill;