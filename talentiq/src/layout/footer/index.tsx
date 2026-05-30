import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import {
  ArrowRight,
  BrainCircuit,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import footerLogo from "@/assets/logofooter.png";

const mainMenus = [
  { text: "Beranda", href: "/" },
  { text: "Analisis Skill", href: "/analisis-skill" },
  { text: "Jalur Karir", href: "/jalur-karir" },
  { text: "Lowongan Kerja", href: "/lowongan-kerja" },
];

const companyMenus = [
  { text: "Tentang Kami", href: "/" },
  { text: "Blog", href: "/" },
  { text: "Kontak", href: "/" },
  { text: "Privacy Policy", href: "/" },
];

const socialMediaList = [
  {
    title: "Instagram",
    url: "#",
    icon: <FaInstagram size={18} />,
  },
  {
    title: "Twitter X",
    url: "#",
    icon: <FaXTwitter size={18} />,
  },
  {
    title: "LinkedIn",
    url: "#",
    icon: <FaLinkedin size={18} />,
  },
];

const contactInfo = [
  {
    title: "Email",
    value: "support@talentiq-ai.com",
    icon: <Mail size={16} />,
  },
  {
    title: "Telepon",
    value: "+62 812-3456-7890",
    icon: <Phone size={16} />,
  },
  {
    title: "Lokasi",
    value: "Indonesia Digital Innovation Center",
    icon: <MapPin size={16} />,
  },
];

const footerLinks = [
  "Kebijakan Privasi",
  "Ketentuan Layanan",
  "Komunitas",
];

const FooterComponent = () => {
  return (
    <footer className="relative overflow-hidden bg-[#061C3D] text-white">

      {/* bg blur biar ga flat */}
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#025CB8]/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-[#62AAEA]/10 blur-[120px]" />

      <div className="relative z-10">

        {/* top cta */}
        <section className="px-4 pt-16 sm:px-8 lg:px-[50px]">
          <div
            className="
              mx-auto max-w-7xl
              rounded-[32px]
              border border-white/10
              bg-gradient-to-r from-[#025CB8] to-[#62AAEA]
              p-8 sm:p-10 lg:p-14
              shadow-2xl
              flex flex-col lg:flex-row items-center gap-10
            "
          >

            <div className="flex-1">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
                <BrainCircuit size={14} className="text-white" />

                <span className="text-xs font-bold text-white/90">
                  AI Career Intelligence
                </span>
              </div>

              <h2 className="mb-4 text-3xl font-black leading-tight sm:text-4xl">
                Bangun Karir Digitalmu

                <span className="block text-blue-100">
                  Bersama TalentIQ AI
                </span>
              </h2>

              <p className="max-w-2xl leading-8 text-white/80">
                Analisis skill, roadmap karir personal, sampai rekomendasi
                lowongan berbasis AI buat bantu kamu berkembang lebih cepat
                di dunia teknologi.
              </p>
            </div>

            <div className="flex w-full flex-col gap-4 lg:w-auto">

              <Link
                to="/analisis-skill"
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl
                  bg-white px-7 py-4
                  font-bold text-[#025CB8]
                  shadow-lg
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:bg-gray-100
                  hover:shadow-2xl
                "
              >
                Mulai Analisis Skill
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/jalur-karir"
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl
                  border border-white/20
                  bg-white/10 px-7 py-4
                  font-bold text-white
                  backdrop-blur-md
                  transition-all duration-300
                  hover:bg-white/20
                "
              >
                Lihat Jalur Karir
              </Link>
            </div>
          </div>
        </section>

        {/* footer utama */}
        <section className="px-4 pb-8 pt-16 sm:px-8 lg:px-[50px]">

          <div className="mx-auto max-w-7xl">

            <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4">

              {/* brand */}
              <div>

                <Link to="/">
                  <img
                    src={footerLogo}
                    alt="TalentIQ AI"
                    className="mb-6 h-[42px] object-contain"
                  />
                </Link>

                <p className="mb-6 text-sm leading-8 text-white/70">
                  Platform AI modern buat bantu generasi digital memahami
                  potensi skill, menentukan arah karir, dan cari peluang kerja
                  yang lebih relevan.
                </p>

                <div className="flex items-center gap-3">
                  {socialMediaList.map((socialAccount) => (
                    <a
                      key={socialAccount.title}
                      href={socialAccount.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialAccount.title}
                      className="
                        flex h-11 w-11 items-center justify-center
                        rounded-xl
                        border border-white/10
                        bg-white/10
                        text-white/80
                        transition-all duration-300
                        hover:bg-[#025CB8]
                        hover:text-white
                      "
                    >
                      {socialAccount.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* platform */}
              <div>
                <h3 className="mb-6 text-lg font-bold">
                  Platform
                </h3>

                <div className="flex flex-col gap-4">
                  {mainMenus.map((menu) => (
                    <Link
                      key={menu.text}
                      to={menu.href}
                      className="
                        text-sm text-white/70
                        transition-colors duration-200
                        hover:text-white
                      "
                    >
                      {menu.text}
                    </Link>
                  ))}
                </div>
              </div>

              {/* perusahaan */}
              <div>
                <h3 className="mb-6 text-lg font-bold">
                  Perusahaan
                </h3>

                <div className="flex flex-col gap-4">
                  {companyMenus.map((companyMenu) => (
                    <Link
                      key={companyMenu.text}
                      to={companyMenu.href}
                      className="
                        text-sm text-white/70
                        transition-colors duration-200
                        hover:text-white
                      "
                    >
                      {companyMenu.text}
                    </Link>
                  ))}
                </div>
              </div>

              {/* kontak */}
              <div>
                <h3 className="mb-6 text-lg font-bold">
                  Hubungi Kami
                </h3>

                <div className="flex flex-col gap-5">

                  {contactInfo.map((contactRow) => (
                    <div
                      key={contactRow.title}
                      className="flex items-start gap-3"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        {contactRow.icon}
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-white/40">
                          {contactRow.title}
                        </p>

                        <p
                          className={`
                            text-sm text-white/80
                            ${contactRow.title === "Lokasi" ? "leading-6" : ""}
                          `}
                        >
                          {contactRow.value}
                        </p>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>

            {/* garis */}
            <div className="mb-6 h-px w-full bg-white/10" />

            {/* footer bawah */}
            <div className="flex flex-col items-center gap-5 lg:flex-row">

              <p className="text-center text-sm text-white/50 lg:text-left">
                © 2026 TalentIQ AI Platform. Seluruh hak cipta dilindungi.
              </p>

              <div className="hidden flex-1 lg:block" />

              <div className="flex flex-wrap items-center justify-center gap-5">
                {footerLinks.map((footerMenu) => (
                  <button
                    key={footerMenu}
                    className="
                      text-sm text-white/50
                      transition-colors duration-200
                      hover:text-white
                    "
                  >
                    {footerMenu}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default FooterComponent;