import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logoHeader from "@/assets/logoheader.webp";
import StarBorder from "@/components/StarBorder";

const menuList = [
  { name: "Beranda", url: "/" },
  { name: "Analisis Skill", url: "/analisis-skill" },
  { name: "Jalur Karir", url: "/jalur-karir" },
  { name: "Lowongan Kerja", url: "/lowongan-kerja" },
];

const HeaderComponent = () => {
  const currentRoute = useLocation();
  const redirect = useNavigate();

  const [mobileMenuShown, setMobileMenuShown] = useState(false);
  const [headerCompact, setHeaderCompact] = useState(false);

  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const shrink = window.scrollY > 40;
          setHeaderCompact((prev) => (prev !== shrink ? shrink : prev));
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuShown) setMobileMenuShown(false);
  }, [currentRoute.pathname]);

  const goToLogin = () => redirect("/login");

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 z-50 w-full
          flex justify-center
          px-4 sm:px-8
          transition-[padding-top] duration-500
          ${headerCompact ? "pt-2" : "pt-4"}
        `}
      >
        <div className="relative w-full max-w-7xl">

          {/* ✅ FIX: Hapus transition-all dari glow div
              Glow ini tidak perlu dianimasi, cukup static */}
          <div
            className="absolute inset-0 rounded-[30px] opacity-60 blur-2xl pointer-events-none"
            style={{
              background: "linear-gradient(90deg,#62AAEA,#025CB8,#62AAEA)",
            }}
          />

          <StarBorder
            as="div"
            color="#025cb8"
            speed="2s"
            thickness={2}
            className="w-full rounded-[30px]"
          >
            <div
              className={`
                relative flex items-center
                rounded-[28px]
                border border-white/40
                backdrop-blur-xl
                transform-gpu
                transition-[padding,background-color,box-shadow] duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]
                ${headerCompact
                  ? "px-5 py-3 bg-white/85 shadow-2xl"
                  : "px-6 py-4 bg-white/92 shadow-lg"
                }
              `}
            >
              {/* LOGO */}
              <Link
                to="/"
                className="mr-6 lg:mr-14 shrink-0 flex items-center"
              >
                <img
                  src={logoHeader}
                  alt="TalentIQ AI Logo"
                  width={140}
                  height={50}
                  fetchPriority="high"
                  decoding="async"
                  className={`object-contain ${headerCompact ? "h-7" : "h-8"}`}
                />
              </Link>

              {/* DESKTOP NAV */}
              <nav className="hidden md:flex items-center gap-2 lg:gap-3">
                {menuList.map((navLink) => {
                  const activePage = currentRoute.pathname === navLink.url;

                  return (
                    <Link
                      key={navLink.url}
                      to={navLink.url}
                      className={`
                        relative rounded-xl font-semibold
                        transition-[background-color,color] duration-200
                        ${activePage
                          ? "bg-gradient-to-r from-[#025CB8] to-[#62AAEA] text-white shadow-lg"
                          : "text-gray-600 hover:text-[#025CB8] hover:bg-[#025CB8]/5"
                        }
                        ${headerCompact ? "px-4 py-2 text-sm" : "px-4 py-2.5 text-[15px]"}
                      `}
                    >
                      {navLink.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex-1" />

              {/* RIGHT */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={goToLogin}
                  className="
                    rounded-xl
                    bg-gradient-to-r from-[#025CB8] to-[#62AAEA]
                    text-white font-bold shadow-lg
                    transition-transform duration-200
                    hover:-translate-y-0.5 hover:shadow-2xl
                    active:scale-[0.98]
                  "
                >
                  <span className={`block ${headerCompact ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-sm"}`}>
                    Akun
                  </span>
                </button>
              </div>

              {/* MOBILE BUTTON */}
              <button
                aria-label="toggle navigation"
                onClick={() => setMobileMenuShown((prev) => !prev)}
                className="
                  md:hidden w-11 h-11 rounded-xl
                  flex items-center justify-center
                  bg-[#025CB8]/10 text-[#025CB8]
                  transition-opacity duration-200
                  hover:opacity-70 active:scale-95
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`w-5 h-5 transition-transform duration-300 ${mobileMenuShown ? "rotate-90" : ""}`}
                  aria-hidden="true"
                >
                  {mobileMenuShown ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
          transition-[opacity,transform] duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${headerCompact ? "top-[78px]" : "top-[92px]"}
          ${mobileMenuShown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <div className="max-w-7xl mx-auto overflow-hidden rounded-3xl border border-white/40 bg-white/92 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col gap-2 p-4">
            {menuList.map((navLink) => {
              const currentPage = currentRoute.pathname === navLink.url;

              return (
                <Link
                  key={navLink.url}
                  to={navLink.url}
                  className={`
                    flex items-center justify-between
                    rounded-xl px-4 py-3 font-semibold
                    transition-[background-color,color] duration-200
                    ${currentPage
                      ? "bg-gradient-to-r from-[#025CB8] to-[#62AAEA] text-white"
                      : "text-gray-700 hover:bg-[#025CB8]/5 hover:text-[#025CB8]"
                    }
                  `}
                >
                  <span>{navLink.name}</span>
                  {currentPage && <div className="w-2 h-2 rounded-full bg-white" />}
                </Link>
              );
            })}

            <div className="my-2 h-px bg-gray-100" />

            <button
              onClick={goToLogin}
              className="
                flex items-center justify-center
                rounded-xl py-3 font-bold text-white
                bg-gradient-to-r from-[#025CB8] to-[#62AAEA]
                shadow-md transition-transform duration-200
                hover:shadow-xl hover:-translate-y-0.5
                active:scale-[0.98]
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