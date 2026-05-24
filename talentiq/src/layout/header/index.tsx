// src/layout/header/index.tsx

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logoheader from "@/assets/logoheader.png";
import StarBorder from "@/components/StarBorder";

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center px-4 sm:px-8 pt-4">

        {/* OUTER GLOW */}
        <div className="relative w-full max-w-7xl">

          {/* GLOW EFFECT */}
          <div
            className="
              absolute inset-0
              rounded-[28px]
              blur-2xl
              opacity-70
              pointer-events-none
            "
            style={{
              background:
                "linear-gradient(90deg, #62AAEA, #025CB8, #62AAEA)",
            }}
          />

          {/* STAR BORDER */}
          <StarBorder
            as="div"
            color="#025cb8"
            speed="2s"
            thickness={2}
            className="w-full rounded-[30px]"
          >
            {/* MAIN CONTAINER */}
            <div
              className={`
                flex items-center
                rounded-[26px]
                transition-all duration-300

                ${scrolled
                  ? "bg-white/95 backdrop-blur-xl px-5 py-3"
                  : "bg-white/90 backdrop-blur-xl px-6 py-4"
                }
              `}
            >
              {/* LOGO */}
              <Link
                to="/"
                className="shrink-0 mr-6 lg:mr-14 flex items-center"
              >
                <img
                  src={logoheader}
                  alt="TalentIQ AI"
                  className={`
                    object-contain transition-all duration-300
                    ${scrolled ? "h-[22px]" : "h-[28px]"}
                  `}
                />
              </Link>

              {/* DESKTOP NAV */}
              <nav className="hidden md:flex items-center gap-2 lg:gap-3">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        relative px-4 py-2 rounded-xl
                        font-semibold transition-all duration-300

                        ${isActive
                          ? "bg-gradient-to-r from-[#025CB8] to-[#62AAEA] text-white shadow-lg"
                          : "text-gray-600 hover:text-[#025CB8] hover:bg-[#025CB8]/5"
                        }

                        ${scrolled ? "text-sm" : "text-[15px]"}
                      `}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex-1" />

              {/* RIGHT ACTION */}
              <div className="hidden md:flex items-center gap-3">

                {/* ACCOUNT BUTTON */}
                <button
                  onClick={() => navigate("/login")}
                  className="
                    bg-gradient-to-r
                    from-[#025CB8]
                    to-[#62AAEA]
                    hover:from-[#0147A0]
                    hover:to-[#025CB8]
                    text-white
                    font-bold
                    rounded-xl
                    transition-all duration-300
                    shadow-lg
                    hover:shadow-2xl
                    hover:-translate-y-0.5
                  "
                >
                  <span
                    className={`
                      block
                      ${scrolled
                        ? "px-4 py-2 text-sm"
                        : "px-5 py-2.5 text-sm"
                      }
                    `}
                  >
                    Akun
                  </span>
                </button>
              </div>

              {/* MOBILE BUTTON */}
              <button
                className="
                  md:hidden
                  w-11 h-11
                  flex items-center justify-center
                  rounded-xl
                  bg-[#025CB8]/10
                  text-[#025CB8]
                  hover:bg-[#025CB8]/15
                  transition-all duration-300
                "
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </StarBorder>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`
          fixed left-0 right-0 z-40 px-4 sm:px-8
          transition-all duration-300 ease-in-out

          ${menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
          }

          ${scrolled ? "top-[78px]" : "top-[86px]"}
        `}
      >
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col p-4 gap-2">

            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center justify-between
                    px-4 py-3 rounded-xl
                    font-semibold transition-all duration-300

                    ${isActive
                      ? "bg-gradient-to-r from-[#025CB8] to-[#62AAEA] text-white"
                      : "text-gray-700 hover:bg-[#025CB8]/5 hover:text-[#025CB8]"
                    }
                  `}
                >
                  <span>{item.label}</span>

                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}

            <div className="h-px bg-gray-100 my-2" />

            <button
              onClick={() => navigate("/login")}
              className="
                flex items-center justify-center
                bg-gradient-to-r
                from-[#025CB8]
                to-[#62AAEA]
                hover:from-[#0147A0]
                hover:to-[#025CB8]
                text-white
                font-bold
                py-3 rounded-xl
                transition-all duration-300
                shadow-md
              "
            >
              Masuk ke Akun
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;