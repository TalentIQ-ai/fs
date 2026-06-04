import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  ExternalLink,
  MapPin,
  Search,
  Sparkles,
  Target,
  X,
  Loader2,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { getProfileService, UserWithProfile } from "@/services/profile.service";
import { getJobs, JobVacancy as ApiJobVacancy } from "@/services/job.service";

import Sidebar from "@/components/common/sidebar";

// Removed dummy data

const filterButtonStyle =
  "flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition";

const JobCard = ({
  vacancy,
  aspirational = false,
}: {
  vacancy: any;
  aspirational?: boolean;
}) => {
  const isFutureRole = aspirational;

  return (
    <div
      className={`bg-white p-5 rounded-2xl border shadow-sm group flex flex-col relative overflow-hidden transition-all hover:shadow-md
      ${isFutureRole ? "border-gray-200/60" : "border-gray-100"}
    `}
    >
      {isFutureRole && (
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-50 blur-3xl opacity-60 pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-4 relative z-10 mb-4">
        <div className="flex gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm"
            style={{ backgroundColor: vacancy.accentColor }}
          >
            {vacancy.companyName[0]}
          </div>

          <div>
            <h3
              onClick={() => {
                if (vacancy.url) {
                  window.open(vacancy.url, "_blank", "noopener,noreferrer");
                }
              }}
              title={vacancy.url ? "Klik untuk melihat detail lowongan" : undefined}
              className={`font-bold text-base transition-colors text-gray-800 cursor-pointer hover:underline
                ${isFutureRole
                  ? "group-hover:text-orange-600"
                  : "group-hover:text-[#025CB8]"
                }
              `}
            >
              {vacancy.role}
            </h3>

            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <Building2 size={14} />
              {vacancy.companyName}
            </p>
          </div>
        </div>

        <div
          className={`px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap border
            ${isFutureRole
              ? "bg-orange-50 border-orange-200 text-orange-600"
              : "bg-indigo-50 border-indigo-100 text-indigo-700"
            }
          `}
        >
          Match {vacancy.compatibility}%
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600 mb-4 relative z-10">
        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
          <MapPin size={12} />
          {vacancy.city}
        </span>

        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
          <Briefcase size={12} />
          {vacancy.workMode}
        </span>
      </div>

      <p
        className={`text-sm font-bold mb-4 relative z-10 ${isFutureRole ? "text-gray-700" : "text-green-700"
          }`}
      >
        {vacancy.income}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-100 relative z-10">
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Skill Cocok
          </p>

          <div className="flex flex-wrap gap-2">
            {(vacancy.matchedStacks || []).map((skill: string) => (
              <span
                key={skill}
                className="px-2 py-1 rounded-md border border-green-100 bg-green-50 text-green-700 text-[10px] font-bold"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {isFutureRole && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Perlu Dipelajari
            </p>

            <div className="flex flex-wrap gap-2">
              {vacancy.missingStacks?.map((skill: string) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md border border-red-100 bg-red-50 text-red-600 text-[10px] font-bold"
                >
                  + {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-6 relative z-10">
        <button
          onClick={() => {
            if (isFutureRole) {
              window.location.href = "/auth/roadmap-karir";
            } else {
              if (vacancy.url) {
                window.open(vacancy.url, "_blank", "noopener,noreferrer");
              } else {
                alert("URL lowongan tidak tersedia.");
              }
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 text-white shadow-md hover:shadow-lg hover:opacity-90"
          style={{
            background: isFutureRole
              ? "linear-gradient(135deg, #7C3AED, #6D28D9)"
              : "linear-gradient(135deg, #025CB8, #62AAEA)",
          }}
        >
          {isFutureRole ? (
            <>
              <BookOpen size={15} />
              Lihat Kursus
            </>
          ) : (
            <>
              <ArrowRight size={15} />
              Lamar Sekarang
            </>
          )}
        </button>

        {isFutureRole && vacancy.url && (
          <button
            onClick={() => {
              window.open(vacancy.url, "_blank", "noopener,noreferrer");
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-[#025CB8]/30 text-[#025CB8] hover:bg-blue-50 hover:border-[#025CB8] text-xs font-bold transition-all active:scale-95"
          >
            <ExternalLink size={14} />
            Lihat
          </button>
        )}

        <button
          className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-400 hover:text-[#025CB8] hover:border-blue-200 hover:bg-blue-50 transition-all"
        >
          <Bookmark size={18} />
        </button>
      </div>
    </div>
  );
};

const CariLowongan = () => {
  const [keyword, setKeyword] = useState("");
  const [sidebarMini, setSidebarMini] = useState(false);
  const [profileData, setProfileData] = useState<UserWithProfile | null>(null);
  const [jobsData, setJobsData] = useState<ApiJobVacancy[]>([]);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterWorkMode, setFilterWorkMode] = useState("");
  const [sortOrder, setSortOrder] = useState("Paling Relevan");
  const [loading, setLoading] = useState(true);
  const PAGE_SIZE = 6;
  const [pageReady, setPageReady] = useState(1);
  const [pageFuture, setPageFuture] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileResponse = await getProfileService();
        const profile = profileResponse.user;
        setProfileData(profile);
        
        const jobs = await getJobs(profile.profile?.targetRole || undefined);
        setJobsData(jobs);
      } catch (err) {
        console.error("Error fetching data in job search:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const userSkills = useMemo(() => {
    return profileData?.profile?.skills || [];
  }, [profileData]);

  const targetRole = useMemo(() => {
    return profileData?.profile?.targetRole || "Programmer";
  }, [profileData]);

  const readyJobs = useMemo(() => {
    return jobsData.filter(job => job.compatibility >= 60);
  }, [jobsData]);

  const futureJobs = useMemo(() => {
    return jobsData.filter(job => job.compatibility < 60);
  }, [jobsData]);

  const filteredReadyJobs = useMemo(() => {
    let result = readyJobs;

    setPageReady(1);

    if (keyword.trim()) {
      const normalized = keyword.toLowerCase();
      result = result.filter((vacancy) => {
        const searchableContent = [
          vacancy.role,
          vacancy.companyName,
          vacancy.city,
          ...(vacancy.matchedStacks || []),
          ...(vacancy.missingStacks || []),
        ].join(" ").toLowerCase();
        return searchableContent.includes(normalized);
      });
    }

    if (filterLocation) {
      result = result.filter((job) => job.city.toLowerCase() === filterLocation.toLowerCase());
    }
    if (filterWorkMode) {
      result = result.filter((job) => job.workMode.toLowerCase() === filterWorkMode.toLowerCase());
    }

    if (sortOrder === "Terbaru") {
      result = [...result].sort((a, b) => b.id - a.id);
    } else if (sortOrder === "Gaji Tertinggi") {
      // Mock logic: assume higher compatibility = higher potential salary for now
      // A better way is to parse the `income` string, but string parsing is complex here
      result = [...result].sort((a, b) => b.compatibility - a.compatibility);
    }

    return result;
  }, [keyword, filterLocation, filterWorkMode, sortOrder, readyJobs]);

  const visibleReadyJobs = useMemo(
    () => filteredReadyJobs.slice(0, pageReady * PAGE_SIZE),
    [filteredReadyJobs, pageReady]
  );

  const filteredFutureJobs = useMemo(() => {
    let result = futureJobs;

    setPageFuture(1);

    if (keyword.trim()) {
      const normalized = keyword.toLowerCase();
      result = result.filter((vacancy) => {
        const searchableContent = [
          vacancy.role,
          vacancy.companyName,
          vacancy.city,
          ...(vacancy.matchedStacks || []),
          ...(vacancy.missingStacks || []),
        ].join(" ").toLowerCase();
        return searchableContent.includes(normalized);
      });
    }

    if (filterLocation) {
      result = result.filter((job) => job.city.toLowerCase() === filterLocation.toLowerCase());
    }
    if (filterWorkMode) {
      result = result.filter((job) => job.workMode.toLowerCase() === filterWorkMode.toLowerCase());
    }

    if (sortOrder === "Terbaru") {
      result = [...result].sort((a, b) => b.id - a.id);
    } else if (sortOrder === "Gaji Tertinggi") {
      result = [...result].sort((a, b) => b.compatibility - a.compatibility);
    }

    return result;
  }, [keyword, filterLocation, filterWorkMode, sortOrder, futureJobs]);

  const visibleFutureJobs = useMemo(
    () => filteredFutureJobs.slice(0, pageFuture * PAGE_SIZE),
    [filteredFutureJobs, pageFuture]
  );

  const layoutShift = sidebarMini ? "lg:ml-[90px]" : "lg:ml-[260px]";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC]">
        <Sidebar collapsed={sidebarMini} setCollapsed={setSidebarMini} />
        <main className={`pb-24 lg:pb-10 transition-all duration-300 ${layoutShift}`}>
          <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-[#025CB8] mb-4" size={48} />
            <p className="text-gray-500 font-semibold animate-pulse">Memuat rekomendasi lowongan kerja AI...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar
        collapsed={sidebarMini}
        setCollapsed={setSidebarMini}
      />

      <div
        className={`pb-24 lg:pb-10 transition-all duration-300 ${sidebarMini ? "lg:ml-[90px]" : "lg:ml-[260px]"
          }`}
      >
        {/* top section */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Briefcase
                className="text-[#025CB8]"
                size={22}
              />
              Cari Lowongan Kerja
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={keyword}
                  placeholder="Cari posisi, perusahaan, atau skill..."
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#025CB8] shadow-sm transition-all bg-white"
                />
              </div>

              <button className="px-6 py-3 bg-[#025CB8] text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                <Search size={16} />
                Cari
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="pl-8 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer hover:bg-gray-50"
                >
                  <option value="">Semua Lokasi</option>
                  <option value="Jakarta">Jakarta</option>
                  <option value="Tangerang">Tangerang</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Remote">Remote</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={filterWorkMode}
                  onChange={(e) => setFilterWorkMode(e.target.value)}
                  className="pl-8 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer hover:bg-gray-50"
                >
                  <option value="">Semua Tipe Kerja</option>
                  <option value="WFO">WFO</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2" />

              <button 
                onClick={() => {
                  setFilterLocation("");
                  setFilterWorkMode("");
                  setKeyword("");
                  setSortOrder("Paling Relevan");
                }}
                className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
              >
                <X size={14} />
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Menampilkan {jobsData.length} lowongan untuk:{" "}
                <span className="text-[#025CB8]">
                  {" "}
                  {targetRole}
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Berdasarkan skill kamu:
                {userSkills.length > 0 ? (
                  <span className="font-semibold text-gray-700">
                    {" "}
                    {userSkills.join(", ")}
                  </span>
                ) : (
                  <span className="italic text-gray-400"> (Belum ada data skill)</span>
                )}
              </p>
            </div>

            <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 shadow-sm flex items-center gap-2">
              Urutkan:
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-[#025CB8] font-bold bg-transparent border-none outline-none cursor-pointer appearance-none pr-4"
              >
                <option value="Paling Relevan">Paling Relevan</option>
                <option value="Terbaru">Terbaru</option>
                <option value="Gaji Tertinggi">Gaji Tertinggi</option>
              </select>
            </div>
          </div>

          {userSkills.length === 0 ? (
            /* Empty state jika belum ada CV / skill */
            <section className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-50">
                  <Sparkles size={28} className="text-[#025CB8]" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Maksimalkan Pencarian Kerjamu</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                AI kami belum bisa mencocokkan lowongan dengan kemampuanmu. Silakan upload CV terlebih dahulu agar kami bisa merekomendasikan pekerjaan yang 100% cocok untukmu.
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={() => window.location.href = "/auth/user-analisis-skill"}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
                >
                  Upload CV Sekarang →
                </button>
              </div>
            </section>
          ) : (
            <>
              {/* cocok */}
              <section>
                {(filteredReadyJobs.length > 0 || (keyword || filterLocation || filterWorkMode)) && (
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 font-bold text-sm rounded-lg mb-2">
                      <Sparkles size={16} />
                      Skill Kamu Sudah Mumpuni
                    </div>

                    <p className="text-sm text-gray-500">
                      Kamu memenuhi kualifikasi untuk posisi-posisi ini.
                    </p>
                  </div>
                )}

                {filteredReadyJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                    {visibleReadyJobs.map((vacancy) => (
                      <JobCard key={vacancy.id} vacancy={vacancy} />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center bg-white border border-gray-100 py-10 rounded-2xl shadow-sm text-sm">
                    {keyword || filterLocation || filterWorkMode ? (
                      "Tidak ada lowongan mumpuni yang sesuai dengan kriteria filter/pencarian Anda."
                    ) : (
                      "Belum ada lowongan yang kecocokannya tinggi. Terus tingkatkan skill Anda!"
                    )}
                  </div>
                )}

                {visibleReadyJobs.length < filteredReadyJobs.length && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setPageReady(p => p + 1)}
                      className="px-5 py-2 bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 transition shadow-sm"
                    >
                      Muat Lebih Banyak Lowongan ({filteredReadyJobs.length - visibleReadyJobs.length} tersisa)
                    </button>
                  </div>
                )}
              </section>

              {/* garis pembatas */}
              <div className="relative py-8 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-gray-200" />
                </div>

                <div className="relative bg-[#F7F9FC] px-4 text-sm font-bold text-gray-400">
                  — Tingkatkan skill kamu untuk posisi berikut —
                </div>
              </div>

              {/* target berikutnya */}
              <section className="pb-10">
                {(filteredFutureJobs.length > 0 || (keyword || filterLocation || filterWorkMode)) && (
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 font-bold text-sm rounded-lg mb-2">
                      <Target size={16} />
                      Perlu Tingkatkan Skill Dulu
                    </div>

                    <p className="text-sm text-gray-500">
                      Ada beberapa skill yang masih perlu kamu pelajari.
                    </p>
                  </div>
                )}

                {filteredFutureJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {visibleFutureJobs.map((vacancy) => (
                      <JobCard
                        key={vacancy.id}
                        vacancy={vacancy}
                        aspirational
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center bg-white border border-gray-100 py-10 rounded-2xl shadow-sm text-sm">
                    Tidak ada lowongan aspirasi yang sesuai dengan kriteria filter/pencarian Anda.
                  </div>
                )}

                {visibleFutureJobs.length < filteredFutureJobs.length && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setPageFuture(p => p + 1)}
                      className="px-5 py-2 bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 transition shadow-sm"
                    >
                      Muat Lebih Banyak Aspirasi ({filteredFutureJobs.length - visibleFutureJobs.length} tersisa)
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default CariLowongan;