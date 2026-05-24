// src/layout/footer/index.tsx
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  ArrowRight,
  BrainCircuit,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import logofooter from "@/assets/logofooter.png";

const FooterComponent = () => {
  const platformLinks = [
    { label: "Beranda", path: "/" },
    { label: "Analisis Skill", path: "/analisis-skill" },
    { label: "Jalur Karir", path: "/jalur-karir" },
    { label: "Lowongan Kerja", path: "/lowongan-kerja" },
  ];

  const companyLinks = [
    { label: "Tentang Kami", path: "/" },
    { label: "Blog", path: "/" },
    { label: "Kontak", path: "/" },
    { label: "Privacy Policy", path: "/" },
  ];

  const socialLinks = [
    {
      icon: <FaInstagram size={18} />,
      href: "#",
      label: "Instagram",
    },
    {
      icon: <FaXTwitter size={18} />,
      href: "#",
      label: "X (Twitter)",
    },
    {
      icon: <FaLinkedin size={18} />,
      href: "#",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#061C3D] text-white">
      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#025CB8]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#62AAEA]/10 rounded-full blur-[120px]" />

      <div className="relative z-10">

        {/* ───────────────── CTA SECTION ───────────────── */}
        <div className="px-4 sm:px-8 lg:px-[50px] pt-16">
          <div
            className="
              max-w-7xl mx-auto
              rounded-[32px]
              border border-white/10
              bg-gradient-to-r from-[#025CB8] to-[#62AAEA]
              p-8 sm:p-10 lg:p-14
              shadow-2xl
              flex flex-col lg:flex-row items-center gap-10
            "
          >
            {/* LEFT */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full mb-5">
                <BrainCircuit size={14} className="text-white" />
                <span className="text-xs font-bold text-white/90">
                  AI Career Intelligence
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
                Bangun Karir Digitalmu
                <span className="block text-blue-100">
                  Bersama TalentIQ AI
                </span>
              </h2>

              <p className="text-white/80 leading-8 max-w-2xl">
                Analisis skill, roadmap karir personal, dan rekomendasi
                lowongan kerja berbasis AI untuk membantu kamu berkembang
                lebih cepat di industri teknologi.
              </p>
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-auto flex flex-col gap-4">
              <Link
                to="/analisis-skill"
                className="
                  bg-white text-[#025CB8]
                  hover:bg-gray-100
                  font-bold
                  px-7 py-4
                  rounded-2xl
                  flex items-center justify-center gap-2
                  transition-all duration-300
                  shadow-lg hover:shadow-2xl hover:-translate-y-1
                "
              >
                Mulai Analisis Skill
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/jalur-karir"
                className="
                  bg-white/10 backdrop-blur-md
                  border border-white/20
                  hover:bg-white/20
                  text-white font-bold
                  px-7 py-4 rounded-2xl
                  flex items-center justify-center gap-2
                  transition-all duration-300
                "
              >
                Lihat Jalur Karir
              </Link>
            </div>
          </div>
        </div>

        {/* ───────────────── MAIN FOOTER ───────────────── */}
        <div className="px-4 sm:px-8 lg:px-[50px] pt-16 pb-8">
          <div className="max-w-7xl mx-auto">

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">

              {/* BRAND */}
              <div>
                <Link to="/">
                  <img
                    src={logofooter}
                    alt="TalentIQ AI"
                    className="h-[42px] object-contain mb-6"
                  />
                </Link>

                <p className="text-white/70 text-sm leading-8 mb-6">
                  Platform AI modern untuk membantu generasi digital
                  memahami potensi skill, menentukan arah karir,
                  dan menemukan peluang kerja terbaik.
                </p>

                {/* Social */}
                <div className="flex items-center gap-3">
                  {socialLinks.map(({ icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        w-11 h-11 rounded-xl
                        bg-white/10
                        border border-white/10
                        flex items-center justify-center
                        text-white/80
                        hover:bg-[#025CB8]
                        hover:text-white
                        transition-all duration-300
                      "
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* PLATFORM */}
              <div>
                <h3 className="text-lg font-bold mb-6">
                  Platform
                </h3>

                <div className="flex flex-col gap-4">
                  {platformLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className="
                        text-white/70
                        hover:text-white
                        transition-colors duration-200
                        text-sm
                      "
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* COMPANY */}
              <div>
                <h3 className="text-lg font-bold mb-6">
                  Perusahaan
                </h3>

                <div className="flex flex-col gap-4">
                  {companyLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className="
                        text-white/70
                        hover:text-white
                        transition-colors duration-200
                        text-sm
                      "
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CONTACT */}
              <div>
                <h3 className="text-lg font-bold mb-6">
                  Hubungi Kami
                </h3>

                <div className="flex flex-col gap-5">

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Mail size={16} />
                    </div>

                    <div>
                      <p className="text-xs text-white/40 mb-1">
                        Email
                      </p>
                      <p className="text-sm text-white/80">
                        support@talentiq-ai.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Phone size={16} />
                    </div>

                    <div>
                      <p className="text-xs text-white/40 mb-1">
                        Telepon
                      </p>
                      <p className="text-sm text-white/80">
                        +62 812-3456-7890
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin size={16} />
                    </div>

                    <div>
                      <p className="text-xs text-white/40 mb-1">
                        Lokasi
                      </p>
                      <p className="text-sm text-white/80 leading-6">
                        Indonesia Digital Innovation Center
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 mb-6" />

            {/* Bottom */}
            <div className="flex flex-col lg:flex-row items-center gap-5">

              <p className="text-white/50 text-sm text-center lg:text-left">
                © 2026 TalentIQ AI Platform. Seluruh hak cipta dilindungi.
              </p>

              <div className="hidden lg:block flex-1" />

              <div className="flex flex-wrap items-center justify-center gap-5">
                {[
                  "Kebijakan Privasi",
                  "Ketentuan Layanan",
                  "Komunitas",
                ].map((item) => (
                  <button
                    key={item}
                    className="
                      text-white/50
                      hover:text-white
                      text-sm
                      transition-colors duration-200
                    "
                  >
                    {item}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;