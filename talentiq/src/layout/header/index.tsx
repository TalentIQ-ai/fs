// src/layout/header/index.tsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoheader from "@/assets/logoheader.png";


const navItems = [
  { label: "Beranda", path: "/" },
  { label: "Analisis Skill", path: "/analisis-skill" },
  { label: "Jalur Karir", path: "/jalur-karir" },
  { label: "Lowongan Kerja", path: "/lowongan-kerja" },
];

const HeaderComponent = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── Wrapper posisi fixed, full width ── */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-500 ease-in-out">

        {/* ── Inner box: mengecil saat scroll ── */}
        <div
          className={`
            flex items-center transition-all duration-500 ease-in-out
            ${scrolled
              /* Sesudah scroll: kotak lebih kecil, melayang, rounded, shadow kuat */
              ? "w-[92%] mt-3 px-5 py-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl"
              /* Sebelum scroll: full width, persegi, shadow ringan */
              : "w-full mt-0 px-4 sm:px-8 lg:px-[50px] py-[15px] rounded-none bg-white shadow-sm"
            }
          `}
        >
          {/* Logo */}
          <Link to="/" className="mr-6 lg:mr-[80px] xl:mr-[150px] shrink-0">
            <img
              src={logoheader}
              alt="TalentIQ Logo"
              className={`object-contain cursor-pointer transition-all duration-500 ${scrolled ? "h-[20px]" : "h-[25px]"
                }`}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <div key={item.path} className="flex flex-col items-center">
                  <Link to={item.path}>
                    <span
                      className={`text-[#025CB8] font-bold cursor-pointer transition-all duration-200 whitespace-nowrap ${scrolled ? "text-sm" : "text-base lg:text-lg"
                        } ${isActive ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                    >
                      {item.label}
                    </span>
                  </Link>
                  {isActive && (
                    <div className="bg-[#025CB8] w-full h-0.5 mt-[1px] rounded-full" />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Akun Button */}
          <button
            onClick={() => navigate("/login")}
            className={`hidden md:block bg-white rounded-[10px] transition-all duration-500 ${scrolled ? "py-1 px-3" : "py-[5px] px-[11px]"
              }`}
            style={{ boxShadow: "0px 4px 4px #00000040" }}
          >
            <span
              className={`text-[#025CB8] font-bold transition-all duration-500 ${scrolled ? "text-sm" : "text-base lg:text-lg"
                }`}
            >
              Akun
            </span>
          </button>

          {/* Hamburger Mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-[#025CB8]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile Dropdown — di luar inner box ── */}
      <div
        className={`fixed z-40 left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out
          bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg
          ${scrolled ? "top-[52px]" : "top-[56px]"}
          ${menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="flex flex-col px-6 py-4 gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <span className={`block text-[#025CB8] text-lg font-bold py-1 border-b border-gray-100 ${isActive ? "opacity-100" : "opacity-60"
                  }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button
            className="mt-2 bg-white py-2 px-4 rounded-[10px] self-start"
            style={{ boxShadow: "0px 4px 4px #00000040" }}
          >
            <span className="text-[#025CB8] text-lg font-bold">Akun</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;