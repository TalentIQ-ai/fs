// src/pages/lowongan_kerja/index.tsx
import { useState } from "react";
import HeaderComponent from "@/layout/header";
import FooterComponent from "@/layout/footer";
import { useScrollAnimation, animClass } from "@/hooks/use-scroll-animation";

const jobs = [
  { id: 1, title: "AI Engineer", company: "PT Mencari Cinta Sejati", type: "Remote", location: "Jakarta, Indonesia", time: "3 hari yang lalu", image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/ynrvbh81_expires_30_days.png" },
  { id: 2, title: "Data Scientist", company: "PT Jaya", type: "Full Time", location: "Bandung, Indonesia", time: "1 hari yang lalu", image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/vwduqjia_expires_30_days.png" },
  { id: 3, title: "IT Support", company: "PT Mencari Cinta Sejati", type: "Remote", location: "Jakarta, Indonesia", time: "2 hari yang lalu", image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/65inp3wt_expires_30_days.png" },
  { id: 4, title: "Full Stack Developer", company: "PT Lorem Ipsum", type: "Full Time", location: "Surabaya, Indonesia", time: "3 jam yang lalu", image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/cvssz671_expires_30_days.png" },
  { id: 5, title: "Network Support", company: "PT Cahaya Ilahi", type: "Full Time", location: "Bali, Indonesia", time: "9 jam yang lalu", image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7UFjhTHX6R/9ulmqsvk_expires_30_days.png" },
];

const JobCard = ({ job, index }: { job: typeof jobs[0]; index: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`flex flex-col sm:flex-row gap-6 bg-gradient-to-b from-[#025CB8] to-[#62AAEA]
                  border-2 border-[#025CB8] rounded-2xl p-6 sm:p-8 shadow-lg
                  ${animClass(isVisible, "up", index * 80)}`}
    >
      <img
        src={job.image}
        alt={job.title}
        className="w-full sm:w-[160px] md:w-[200px] h-[180px] sm:h-[160px] md:h-[200px] rounded-xl object-cover shrink-0"
      />
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div>
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{job.title}</h2>
          <p className="text-white text-base mb-2">{job.company} — {job.type}</p>
          <p className="text-white text-base mb-4">📍 {job.location}</p>
          <p className="text-white text-base font-semibold underline">Login untuk melihat slip gaji</p>
        </div>
        <div className="flex flex-row items-center justify-between sm:hidden">
          <span className="text-white text-sm">{job.time}</span>
          <button className="bg-white hover:bg-gray-100 transition-all text-[#025CB8] font-bold text-sm px-4 py-2 rounded-xl shadow-md">
            Selengkapnya →
          </button>
        </div>
      </div>
      {/* Desktop: time + button */}
      <div className="hidden sm:flex flex-col justify-between items-end shrink-0">
        <span className="text-white text-base">{job.time}</span>
        <button className="bg-white hover:bg-gray-100 transition-all text-[#025CB8] font-bold text-base px-6 py-3 rounded-xl shadow-md">
          Selengkapnya →
        </button>
      </div>
    </div>
  );
};

export default function LowonganKerja() {
  const [searchJob, setSearchJob] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchJob.toLowerCase()) &&
      job.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderComponent />

      <div className="px-4 sm:px-8 lg:px-[50px] pt-[100px] pb-10 flex-1">

        {/* Search */}
        <div
          ref={headerRef}
          className={`flex flex-col sm:flex-row flex-wrap gap-4 mb-10 ${animClass(headerVisible, "up")}`}
        >
          <div className="flex flex-1 min-w-[200px] items-center bg-[#00000010] rounded-xl border border-[#025CB8] overflow-hidden">
            <input
              type="text"
              placeholder="Masukkan nama lowongan kerja"
              value={searchJob}
              onChange={(e) => setSearchJob(e.target.value)}
              className="w-full bg-transparent px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg outline-none text-[#025CB8]"
            />
          </div>
          <div className="flex flex-1 min-w-[200px] items-center bg-[#00000010] rounded-xl border border-[#025CB8] overflow-hidden">
            <input
              type="text"
              placeholder="Masukkan kota atau wilayah"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full bg-transparent px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg outline-none text-[#025CB8]"
            />
          </div>
          <button className="bg-[#025CB8] hover:bg-[#014a94] transition-all text-white text-base sm:text-lg font-semibold px-8 py-3 sm:py-4 rounded-xl shadow-md">
            Cari
          </button>
        </div>

        <h1 className="text-[#025CB8] text-3xl sm:text-5xl font-bold mb-8">Lowongan Kerja</h1>

        {/* Job Cards */}
        <div className="flex flex-col gap-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center text-[#424752] text-lg py-20">
              Tidak ada lowongan yang sesuai dengan pencarian Anda.
            </div>
          ) : (
            filteredJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center sm:justify-end gap-3 mt-10">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`px-5 py-3 rounded-lg font-bold shadow-md text-white ${page === 1 ? "bg-[#025CB8]" : "bg-[#025CB880] hover:bg-[#025CB8] transition-colors duration-200"
                }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      <FooterComponent />
    </div>
  );
}