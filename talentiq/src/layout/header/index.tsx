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

  const isHomePage = pathname === "/";

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
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-500 ease-in-out">

        {/* CONTAINER */}
        <div
          className={`
            flex items-center transition-all duration-500 ease-in-out

            ${isHomePage
              ? (
                scrolled
                  ? "w-[92%] mt-3 px-5 py-2 rounded-2xl bg-white/30 backdrop-blur-md shadow-xl border border-[#025CB8]"
                  : "w-full mt-0 px-4 sm:px-8 lg:px-[50px] py-[15px] rounded-none bg-white/30 backdrop-blur-md"
              )
              : (
                scrolled
                  ? "w-[92%] mt-3 px-5 py-2 rounded-2xl bg-white shadow-xl border border-[#025CB8]"
                  : "w-full mt-0 px-4 sm:px-8 lg:px-[50px] py-[15px] rounded-none bg-white shadow-sm"
              )
            }
          `}
        >
          {/* LOGO */}
          <Link
            to="/"
            className="mr-6 lg:mr-[80px] xl:mr-[150px] shrink-0"
          >
            <img
              src={logoheader}
              alt="TalentIQ Logo"
              className={`
                object-contain cursor-pointer transition-all duration-500
                ${scrolled ? "h-[20px]" : "h-[25px]"}
              `}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <div
                  key={item.path}
                  className="flex flex-col items-center"
                >
                  <Link to={item.path}>
                    <span
                      className={`
                        font-bold cursor-pointer transition-all duration-200 whitespace-nowrap

                        ${isHomePage
                          ? "text-white"
                          : "text-[#025CB8]"
                        }

                        ${scrolled
                          ? "text-sm"
                          : "text-base lg:text-lg"
                        }

                        ${isActive
                          ? "opacity-100"
                          : "opacity-60 hover:opacity-100"
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  </Link>

                  {isActive && (
                    <div
                      className={`
                        w-full h-0.5 mt-[1px] rounded-full

                        ${isHomePage
                          ? "bg-white"
                          : "bg-[#025CB8]"
                        }
                      `}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* AKUN BUTTON */}
          <button
            onClick={() => navigate("/login")}
            className={`
              hidden md:block rounded-[10px] transition-all duration-500

              ${isHomePage
                ? "bg-white/20 border border-white/30"
                : "bg-white"
              }

              ${scrolled
                ? "py-1 px-3"
                : "py-[5px] px-[11px]"
              }
            `}
            style={{
              boxShadow: "0px 4px 4px #00000040",
            }}
          >
            <span
              className={`
                font-bold transition-all duration-500

                ${isHomePage
                  ? "text-white"
                  : "text-[#025CB8]"
                }

                ${scrolled
                  ? "text-sm"
                  : "text-base lg:text-lg"
                }
              `}
            >
              Akun
            </span>
          </button>

          {/* MOBILE BUTTON */}
          <button
            className={`
              md:hidden p-2 rounded-lg

              ${isHomePage
                ? "text-white"
                : "text-[#025CB8]"
              }
            `}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
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
      </header>

      {/* MOBILE DROPDOWN */}
      <div
        className={`
          fixed z-40 left-0 right-0 overflow-hidden
          transition-all duration-300 ease-in-out
          backdrop-blur-md shadow-lg

          ${isHomePage
            ? "bg-black/70"
            : "bg-white/95 border-t border-gray-100"
          }

          ${scrolled
            ? "top-[52px]"
            : "top-[56px]"
          }

          ${menuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0"
          }
        `}
      >
        <div className="flex flex-col px-6 py-4 gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <span
                  className={`
                    block text-lg font-bold py-1 border-b

                    ${isHomePage
                      ? "text-white border-white/20"
                      : "text-[#025CB8] border-gray-100"
                    }

                    ${isActive
                      ? "opacity-100"
                      : "opacity-60"
                    }
                  `}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => navigate("/login")}
            className={`
              mt-2 py-2 px-4 rounded-[10px] self-start

              ${isHomePage
                ? "bg-white/20 border border-white/20"
                : "bg-white"
              }
            `}
            style={{
              boxShadow: "0px 4px 4px #00000040",
            }}
          >
            <span
              className={`
                text-lg font-bold

                ${isHomePage
                  ? "text-white"
                  : "text-[#025CB8]"
                }
              `}
            >
              Akun
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;
// src/layout/header/index.tsx