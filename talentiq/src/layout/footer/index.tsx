// src/layout/footer/index.tsx
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logofooter from "@/assets/logofooter.png";

const FooterComponent = () => {
  const platformLinks = [
    { label: "Beranda", path: "/" },
    { label: "Analisis Skill", path: "/analisis-skill" },
    { label: "Jalur Karir", path: "/jalur-karir" },
    { label: "Lowongan Pekerjaan", path: "/lowongan-kerja" },
  ];

  const companyLinks = [
    { label: "Tentang Kami", path: "/" },
    { label: "Blog", path: "/" },
    { label: "Kontak", path: "/" },
    { label: "Privacy Policy", path: "/" },
  ];

  const socialLinks = [
    { icon: <FaInstagram size={22} />, href: "#", label: "Instagram" },
    { icon: <FaXTwitter size={22} />, href: "#", label: "X (Twitter)" },
    { icon: <FaLinkedin size={22} />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="w-full bg-[#025CB8] pt-12 lg:pt-[69px]">
      <div className="w-full px-4 sm:px-8 lg:px-[50px]">

        {/* ── Top Row: Logo desc + 3 kolom link ── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 mb-8">

          {/* Logo + Description — tetap di kiri */}
          <div className="w-full lg:w-[320px] lg:mr-[60px] shrink-0">
            <Link to="/">
              <img
                src={logofooter}
                alt="TalentIQ Logo"
                className="mb-5 h-[40px] object-contain cursor-pointer"
              />
            </Link>
            <p className="text-white text-base leading-8">
              Menghubungkan dunia pendidikan dengan industri melalui pendekatan
              berbasis data dan teknologi AI.
            </p>
          </div>

          {/* 3 kolom link — rata kanan, lurus dengan garis bawah */}
          <div className="flex flex-col sm:flex-row flex-1 justify-end gap-10 sm:gap-16 lg:gap-20">

            {/* Platform */}
            <div className="flex flex-col gap-4 min-w-[140px]">
              <span className="text-white text-lg font-bold">Platform</span>
              {platformLinks.map((item) => (
                <Link key={item.label} to={item.path}>
                  <span className="text-white text-base cursor-pointer hover:text-white/70 transition-colors duration-200 block">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Perusahaan */}
            <div className="flex flex-col gap-4 min-w-[140px]">
              <span className="text-white text-lg font-bold">Perusahaan</span>
              {companyLinks.map((item) => (
                <Link key={item.label} to={item.path}>
                  <span className="text-white text-base cursor-pointer hover:text-white/70 transition-colors duration-200 block">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Ikuti Kami */}
            <div className="flex flex-col gap-4 min-w-[140px]">
              <span className="text-white text-lg font-bold">IKUTI KAMI</span>
              <div className="flex items-center gap-5">
                {socialLinks.map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-colors duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white shrink-0">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-white text-sm cursor-pointer hover:text-white/70 transition-colors duration-200">
                  Hubungi Dukungan
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Divider — full width, lurus dengan konten ── */}
        <div className="w-full bg-white h-[1px] mb-6" />

        {/* ── Copyright Row ── */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-6">
          <span className="text-white text-sm text-center sm:text-left">
            @2026 Platform Talent-IQ AI. Seluruh hak cipta dilindungi oleh undang-undang.
          </span>
          <div className="hidden sm:block flex-1" />
          <div className="flex flex-wrap justify-center gap-4 sm:gap-0">
            {["Kebijakan Privasi", "Ketentuan Layanan", "Komunitas"].map((item) => (
              <span
                key={item}
                className="text-white text-sm sm:ml-[33px] cursor-pointer hover:text-white/70 transition-colors duration-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterComponent;