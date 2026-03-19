"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Calendar, MapPin, Quote, Play, Pause, BookOpen, HomeIcon, Camera, Gift, MessageCircle, CreditCard, Copy, CalendarDays } from "lucide-react";
import Image from "next/image";
import ParticleBackground from "../components/ParticleBackground";

type Wish = {
  id?: string;
  name: string;
  attendance: string;
  message: string;
  createdAt?: string;
};

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("hadir");
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-04-04T09:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("wedding-wishes");
    if (saved) {
      setWishes(JSON.parse(saved));
    }
  }, []);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => console.log("Audio autoplay prevented"));
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const submitWish = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate slight network delay for effect
    setTimeout(() => {
      const newWish = { id: Date.now().toString(), name, attendance, message };
      const updatedWishes = [newWish, ...wishes];
      setWishes(updatedWishes);
      localStorage.setItem("wedding-wishes", JSON.stringify(updatedWishes));
      
      setName("");
      setAttendance("hadir");
      setMessage("");
      setIsSubmitting(false);
    }, 500);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#3a0d11] text-[#deaf5c] selection:bg-[#deaf5c] selection:text-[#3a0d11] flex justify-center relative overflow-hidden">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src="/wedding-next/JOKOWI - SEVENTEEN JKT48 (COVER AI).mp3" type="audio/mpeg" />
      </audio>

      {/* THREE.JS Particle Background Layer */}
      <ParticleBackground />

      {/* Floating Audio Control (Top Right) */}
      <AnimatePresence>
        {isOpened && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleAudio}
            className="fixed top-6 right-6 lg:right-12 z-50 p-3 bg-[#deaf5c] text-[#3a0d11] rounded-full shadow-xl hover:bg-[#c99a4c] transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation */}
      <AnimatePresence>
        {isOpened && (
          <motion.nav
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#5c141d]/90 backdrop-blur-md px-6 py-3 rounded-full border border-[#deaf5c]/30 shadow-2xl flex items-center space-x-6"
          >
            <button onClick={() => scrollTo("hero")} className="text-[#deaf5c] hover:scale-110 transition-transform"><HomeIcon size={20} /></button>
            <button onClick={() => scrollTo("couple")} className="text-[#deaf5c] hover:scale-110 transition-transform"><Heart size={20} /></button>
            <button onClick={() => scrollTo("event")} className="text-[#deaf5c] hover:scale-110 transition-transform"><Calendar size={20} /></button>
            <button onClick={() => scrollTo("gallery")} className="text-[#deaf5c] hover:scale-110 transition-transform"><Camera size={20} /></button>
            <button onClick={() => scrollTo("gift")} className="text-[#deaf5c] hover:scale-110 transition-transform"><Gift size={20} /></button>
            <button onClick={() => scrollTo("wishes")} className="text-[#deaf5c] hover:scale-110 transition-transform"><MessageCircle size={20} /></button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Desktop Split Container */}
      <div className="flex w-full xl:max-w-[1200px] shadow-2xl">
        {/* Left Side: Desktop Only, Static Bugis Pattern & Content */}
        <div className="hidden lg:flex w-1/2 min-h-screen relative flex-col items-center justify-center p-12 bg-[#5c141d] border-r border-[#deaf5c]/20">
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 0l20 20-20 20L0 20z" fill="none" stroke="%23deaf5c" stroke-width="2"/></svg>')`,
              backgroundSize: '40px 40px'
            }}
          ></div>
          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-xl tracking-widest uppercase">The Wedding Of</h2>
            <h1 className="font-script text-7xl text-[#deaf5c] drop-shadow-lg">Putri & Putra</h1>
            <p className="text-lg opacity-90 mt-4 tracking-wide">Minggu, 28 Desember 2027</p>
          </div>
        </div>

        {/* Right Side / Mobile Full: Scrollable Content */}
        <div className="w-full lg:w-1/2 min-h-screen relative flex justify-center bg-[#5c141d]">
          {/* Mobile Max-Width Container */}
          <div className="w-full max-w-md bg-[#3a0d11] min-h-screen relative overflow-hidden shadow-2xl overflow-y-auto no-scrollbar scroll-smooth">
            
            {/* --- 1. COVER / OPENING SCREEN --- */}
            <AnimatePresence>
              {!isOpened && (
                <motion.div 
                  initial={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
                  // FIX COVER CONSTRAINT: h-[100dvh] instead of min-h-screen guarantees it fits perfectly without scrolling overflow pushing down
                  className="absolute inset-0 h-[100dvh] z-40 bg-[#5c141d] flex flex-col items-center justify-center p-8 text-center overscroll-none"
                >
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 0l20 20-20 20L0 20z" fill="none" stroke="%23deaf5c" stroke-width="2"/></svg>')`,
                      backgroundSize: '40px 40px'
                    }}
                  />
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}
                    transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                    className="relative z-10 space-y-12"
                  >
                    <div>
                      <h2 className="text-sm tracking-[0.2em] uppercase mb-4 text-[#deaf5c]">The Wedding Of</h2>
                      <h1 className="font-script text-6xl text-[#deaf5c]">Putri & Putra</h1>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm italic opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                      <button 
                        onClick={handleOpenInvitation}
                        className="px-8 py-3 bg-[#deaf5c] text-[#3a0d11] rounded-full font-bold uppercase text-sm tracking-wider hover:bg-[#d1a555] transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
                      >
                        <BookOpen size={18} />
                        <span>Buka Undangan</span>
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- 2. MAIN SCROLLABLE CONTENT --- */}
            <div className="pb-32">
              
              {/* Hero Section */}
              <section id="hero" className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center relative border-b-2 border-[#deaf5c]/20">
                <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#deaf5c]/10 to-transparent" />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="space-y-8 z-10 w-full max-w-sm"
                >
                  <Heart className="mx-auto text-[#deaf5c]" size={40} strokeWidth={1.5} />
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-[#deaf5c] drop-shadow-sm">Pernikahan</h2>
                    <div className="space-y-2 py-4">
                      <h3 className="font-script font-bold text-7xl md:text-8xl shadow-sm">Putri</h3>
                      <p className="text-3xl opacity-80 font-script">&</p>
                      <h3 className="font-script font-bold text-7xl md:text-8xl shadow-sm">Putra</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <p className="text-md font-bold tracking-widest opacity-90 text-[#deaf5c]">
                      Minggu, 28 Desember 2027
                    </p>
                    
                    {/* Countdown Timer */}
                    <div className="grid grid-cols-4 gap-2 w-full pt-4">
                      <div className="flex flex-col items-center justify-center py-3 rounded-lg border border-[#deaf5c] bg-[#5c141d]/80 shadow-inner">
                        <span className="text-xl sm:text-2xl font-bold text-[#f9f5f0]">{String(timeLeft.days).padStart(2, '0')}</span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider opacity-80 mt-1">Hari</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 rounded-lg border border-[#deaf5c] bg-[#5c141d]/80 shadow-inner">
                        <span className="text-xl sm:text-2xl font-bold text-[#f9f5f0]">{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider opacity-80 mt-1">Jam</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 rounded-lg border border-[#deaf5c] bg-[#5c141d]/80 shadow-inner">
                        <span className="text-xl sm:text-2xl font-bold text-[#f9f5f0]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider opacity-80 mt-1">Menit</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 rounded-lg border border-[#deaf5c] bg-[#5c141d]/80 shadow-inner">
                        <span className="text-xl sm:text-2xl font-bold text-[#f9f5f0]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider opacity-80 mt-1">Detik</span>
                      </div>
                    </div>

                    {/* Simpan Tanggal Button */}
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert("Fitur simpan ke kalender (misal: link Google Calendar) dapat disematkan di sini.") }}
                      className="inline-flex items-center space-x-2 px-8 py-3 bg-[#deaf5c] text-[#3a0d11] rounded-full font-bold uppercase text-sm tracking-wider hover:bg-[#c99a4c] transition-all transform hover:scale-105"
                    >
                      <CalendarDays size={18} />
                      <span>Simpan Tanggal</span>
                    </a>
                  </div>
                    </motion.div>
              </section>

              {/* Quran Verse Section */}
              <section className="py-20 px-8 text-center border-b-2 border-[#deaf5c]/20 bg-[#5c141d]/50 relative">
                <motion.div
                  initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="space-y-8 max-w-sm mx-auto z-10 relative"
                >
                  <Quote className="mx-auto text-[#deaf5c]/60" size={32} />
                  <h4 className="font-serif text-xl tracking-wider text-[#deaf5c]">QS. Ar-Rum: 21</h4>
                  <p className="text-sm leading-8 italic text-[#f9f5f0]/90 drop-shadow-sm font-light">
                    &quot;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir.&quot;
                  </p>
                </motion.div>
              </section>

              {/* Couple Info Section */}
              <section id="couple" className="py-24 px-8 text-center border-b-2 border-[#deaf5c]/20 relative">
                <motion.div
                  initial={{ opacity: 0, y: 50, rotateX: 20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
                  style={{ perspective: 1000 }}
                  className="space-y-16 z-10 relative"
                >
                  <div className="space-y-4">
                    <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-[#deaf5c] bg-[#5c141d] shadow-2xl">
                      {/* Placeholder Image using UI Avatars */}
                      <img src="https://ui-avatars.com/api/?name=Putri&background=deaf5c&color=3a0d11&size=256" alt="Putri" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-script text-4xl text-[#deaf5c]">Putri Maharani, S.E.</h3>
                    <p className="text-sm opacity-90 text-[#f9f5f0] font-light">Putri dari Bapak Fulan & Ibu Fulanah</p>
                  </div>
                  
                  <div className="text-[#deaf5c]/50">
                    <Heart className="mx-auto" size={24} />
                  </div>

                  <div className="space-y-4">
                    <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-[#deaf5c] bg-[#5c141d] shadow-2xl">
                      {/* Placeholder Image using UI Avatars */}
                      <img src="https://ui-avatars.com/api/?name=Putra&background=deaf5c&color=3a0d11&size=256" alt="Putra" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-script text-4xl text-[#deaf5c]">Putra Pratama, S.T.</h3>
                    <p className="text-sm opacity-90 text-[#f9f5f0] font-light">Putra dari Bapak Fulan & Ibu Fulanah</p>
                  </div>
                </motion.div>
              </section>

              {/* Event Schedule Section */}
              <section id="event" className="py-24 px-8 text-center border-b-2 border-[#deaf5c]/20 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                  className="space-y-16"
                >
                  <h2 className="text-3xl font-serif text-[#deaf5c]">Jadwal Acara</h2>

                  <div className="p-8 border-2 border-[#deaf5c] rounded-t-full rounded-b-md relative overflow-hidden bg-[#3a0d11]/90 shadow-2xl backdrop-blur-sm hover:scale-[1.02] transition-transform">
                    <div className="space-y-6 relative z-10">
                      <h3 className="font-script text-4xl text-[#deaf5c]">Akad Nikah</h3>
                      <div className="flex items-center justify-center space-x-2 text-sm text-[#f9f5f0]/90">
                        <Calendar size={16} />
                        <span>Minggu, 28 Desember 2027</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-[#f9f5f0]/90">
                        <MapPin size={16} />
                        <span>Pukul 09:00 WITA - Selesai</span>
                      </div>
                      <div className="pt-4 border-t border-[#deaf5c]/30">
                        <h4 className="font-bold text-[#f9f5f0]">Gedung Mappanyukki</h4>
                        <p className="text-sm mt-2 text-[#f9f5f0]/80 font-light">Jl. Contoh Alamat No. 123, Kota Makassar</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border-2 border-[#deaf5c] rounded-t-full border-t-0 rounded-b-full relative overflow-hidden bg-[#5c141d]/90 shadow-2xl backdrop-blur-sm hover:scale-[1.02] transition-transform">
                    <div className="space-y-6 relative z-10">
                      <h3 className="font-script text-4xl text-[#deaf5c]">Resepsi</h3>
                      <div className="flex items-center justify-center space-x-2 text-sm text-[#f9f5f0]/90">
                        <Calendar size={16} />
                        <span>Minggu, 28 Desember 2027</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-[#f9f5f0]/90">
                        <MapPin size={16} />
                        <span>Pukul 11:00 WITA - Selesai</span>
                      </div>
                      <div className="pt-4 border-t border-[#deaf5c]/30">
                        <h4 className="font-bold text-[#f9f5f0]">Gedung Mappanyukki</h4>
                        <p className="text-sm mt-2 text-[#f9f5f0]/80 font-light">Jl. Contoh Alamat No. 123, Kota Makassar</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Gallery Section */}
              <section id="gallery" className="py-24 px-8 text-center border-b-2 border-[#deaf5c]/20 bg-[#5c141d]/30 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-serif text-[#deaf5c]">Galeri</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.img whileHover={{ scale: 1.05 }} src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400&h=400" alt="Gallery 1" className="rounded-md object-cover w-full h-40 border-2 border-[#deaf5c]/50 shadow-lg" />
                    <motion.img whileHover={{ scale: 1.05 }} src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=400&h=400" alt="Gallery 2" className="rounded-md object-cover w-full h-40 border-2 border-[#deaf5c]/50 shadow-lg" />
                    <motion.img whileHover={{ scale: 1.05 }} src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400&h=400" alt="Gallery 3" className="rounded-md object-cover w-full h-40 border-2 border-[#deaf5c]/50 shadow-lg" />
                    <motion.img whileHover={{ scale: 1.05 }} src="https://images.unsplash.com/photo-1542042161784-26ab9e041e89?auto=format&fit=crop&q=80&w=400&h=400" alt="Gallery 4" className="rounded-md object-cover w-full h-40 border-2 border-[#deaf5c]/50 shadow-lg" />
                  </div>
                </motion.div>
              </section>

              {/* Wedding Gift Section */}
              <section id="gift" className="py-24 px-8 text-center border-b-2 border-[#deaf5c]/20 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 50, rotateX: -15, filter: "blur(5px)" }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ perspective: 1000 }}
                  className="space-y-10 max-w-sm mx-auto"
                >
                  <div className="space-y-6 text-center">
                    <h2 className="text-4xl font-script text-[#deaf5c]">Wedding Gift</h2>
                    <p className="text-sm text-[#f9f5f0]/90 leading-relaxed font-light">
                      Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.
                      <br /><br />
                      Dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi melalui dibawah ini.
                    </p>
                    <button 
                      onClick={() => setShowGift(!showGift)}
                      className="px-6 py-3 bg-[#deaf5c] text-[#3a0d11] rounded-full font-bold text-sm hover:bg-[#c99a4c] transition-colors inline-flex items-center space-x-2"
                    >
                      <CreditCard size={18} />
                      <span>Klik di Sini</span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {showGift && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="space-y-6 overflow-hidden"
                      >
                         {/* Card BCA */}
                         <div className="bg-[#5c141d]/90 backdrop-blur-sm p-6 rounded-xl border border-[#deaf5c]/50 text-left relative shadow-2xl mt-4">
                            <CreditCard className="absolute top-6 right-6 text-[#deaf5c]/50" size={32} />
                            <h3 className="font-bold text-xl tracking-wider text-[#deaf5c] mb-6 italic">BCA</h3>
                            <div className="space-y-2">
                               <p className="text-[10px] text-[#deaf5c] uppercase tracking-widest">No Rekening</p>
                               <div className="flex items-center justify-between">
                                  <p className="font-bold text-lg tracking-widest text-[#f9f5f0]">123123123</p>
                                  <button onClick={() => { navigator.clipboard.writeText("123123123"); alert("No Rekening Berhasil Disalin"); }} className="px-3 py-1 bg-[#deaf5c] text-[#3a0d11] rounded text-xs font-bold inline-flex items-center space-x-1 hover:bg-[#c99a4c]">
                                    <Copy size={12} /><span>Salin</span>
                                  </button>
                               </div>
                               <p className="text-[10px] text-[#deaf5c] uppercase tracking-widest mt-4">Atas Nama</p>
                               <p className="text-sm italic text-[#f9f5f0]/90">Putri Cantika Sari</p>
                            </div>
                         </div>
                         {/* Card BRI */}
                         <div className="bg-[#5c141d]/90 backdrop-blur-sm p-6 rounded-xl border border-[#deaf5c]/50 text-left relative shadow-2xl">
                            <CreditCard className="absolute top-6 right-6 text-[#deaf5c]/50" size={32} />
                            <h3 className="font-bold text-xl tracking-wider text-[#deaf5c] mb-6 italic">BANK BRI</h3>
                            <div className="space-y-2">
                               <p className="text-[10px] text-[#deaf5c] uppercase tracking-widest">No Rekening</p>
                               <div className="flex items-center justify-between">
                                  <p className="font-bold text-lg tracking-widest text-[#f9f5f0]">321321321</p>
                                  <button onClick={() => { navigator.clipboard.writeText("321321321"); alert("No Rekening Berhasil Disalin"); }} className="px-3 py-1 bg-[#deaf5c] text-[#3a0d11] rounded text-xs font-bold inline-flex items-center space-x-1 hover:bg-[#c99a4c]">
                                    <Copy size={12} /><span>Salin</span>
                                  </button>
                               </div>
                               <p className="text-[10px] text-[#deaf5c] uppercase tracking-widest mt-4">Atas Nama</p>
                               <p className="text-sm italic text-[#f9f5f0]/90">Putra Andika Pratama</p>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </section>

              {/* Guestbook Section */}
              <section id="wishes" className="py-24 px-8 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="space-y-10 max-w-sm mx-auto"
                >
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-serif text-[#deaf5c]">Buku Tamu</h2>
                    <p className="text-sm text-[#f9f5f0]/80 font-light">Kirimkan doa dan ucapan manis untuk kami</p>
                  </div>
                  
                  <form onSubmit={submitWish} className="space-y-4 bg-[#5c141d]/70 backdrop-blur-md p-6 rounded-xl border border-[#deaf5c]/30 shadow-xl">
                    <input 
                      type="text" 
                      placeholder="Nama Anda" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#3a0d11]/80 p-3 rounded border border-[#deaf5c]/50 text-white placeholder-white/40 focus:outline-none focus:border-[#deaf5c]"
                    />
                    <select 
                      value={attendance}
                      onChange={(e) => setAttendance(e.target.value)}
                      className="w-full bg-[#3a0d11]/80 p-3 rounded border border-[#deaf5c]/50 text-white focus:outline-none focus:border-[#deaf5c]"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak_hadir">Tidak Hadir</option>
                      <option value="ragu">Masih Ragu</option>
                    </select>
                    <textarea 
                      placeholder="Pesan & Doa..." 
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#3a0d11]/80 p-3 rounded border border-[#deaf5c]/50 text-white placeholder-white/40 focus:outline-none focus:border-[#deaf5c]"
                    ></textarea>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#deaf5c] text-[#3a0d11] font-bold rounded hover:bg-[#c99a4c] transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                    </button>
                  </form>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pt-4">
                    {wishes.map((wish, idx) => (
                      <div key={wish.id || idx} className="bg-[#3a0d11]/80 backdrop-blur-sm p-4 rounded-lg border border-[#deaf5c]/20 shadow-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-[#f9f5f0]">{wish.name}</h4>
                          <span className={`text-[10px] sm:text-xs px-2 py-1 rounded tracking-wider uppercase ${
                            wish.attendance === "hadir" ? "bg-green-900/50 text-green-200 border border-green-700" :
                            wish.attendance === "tidak_hadir" ? "bg-red-900/50 text-red-200 border border-red-700" : "bg-yellow-900/50 text-yellow-200 border border-yellow-700"
                          }`}>
                            {wish.attendance === "hadir" ? "Hadir" : wish.attendance === "tidak_hadir" ? "Tidak Hadir" : "Ragu"}
                          </span>
                        </div>
                        <p className="text-sm text-[#f9f5f0]/80 leading-relaxed font-light">{wish.message}</p>
                      </div>
                    ))}
                    {wishes.length === 0 && (
                      <p className="text-center text-sm text-[#f9f5f0]/50 py-4 font-light">Belum ada ucapan.</p>
                    )}
                  </div>
                </motion.div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
