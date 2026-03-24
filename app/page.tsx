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

  // Lock body scroll when invitation is closed
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpened]);

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
    const fetchWishes = async () => {
      try {
        const response = await fetch("/wedding-next/api/wishes");
        if (response.ok) {
          const data = await response.json();
          setWishes(data);
        }
      } catch (error) {
        console.error("Error fetching wishes:", error);
      }
    };
    fetchWishes();
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
    
    const newWishData = { name, attendance, message };
    
    try {
      const response = await fetch("/wedding-next/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWishData),
      });

      if (response.ok) {
        const savedWish = await response.json();
        setWishes([savedWish, ...wishes]);
        setName("");
        setAttendance("hadir");
        setMessage("");
      }
    } catch (error) {
      console.error("Error submitting wish:", error);
      alert("Gagal mengirim ucapan, silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#3a0d11] text-[#deaf5c] selection:bg-[#deaf5c] selection:text-[#3a0d11] flex justify-center relative overflow-hidden">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src="/wedding-next/De Umelo Ko Tania Idi - Dianty Oslan ( Cover Music Video ).mp3" type="audio/mpeg" />
      </audio>

      {/* Global Background Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay scale-105"
          style={{ backgroundImage: 'url("/wedding-next/wedding_background_premium.png")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#3a0d11]/80 via-[#5c141d]/70 to-[#3a0d11]/90"></div>
      </div>

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
      <div className="flex w-full xl:max-w-[1200px] shadow-2xl relative z-10">
        {/* Left Side: Desktop Only */}
        <div className="hidden lg:flex w-1/2 min-h-screen relative flex-col items-center justify-center p-12 bg-[#5c141d] border-r border-[#deaf5c]/20 overflow-hidden">
           <div 
             className="absolute inset-x-0 bottom-0 h-96 bg-[url('/wedding-next/wedding_background_premium.png')] bg-contain bg-bottom bg-no-repeat opacity-20 pointer-events-none"
           ></div>
           <div className="relative z-10 text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-xl tracking-[0.3em] uppercase opacity-80 font-light text-[#f9f5f0]">The Wedding Of</h2>
                <div className="w-12 h-px bg-[#deaf5c] mx-auto opacity-50"></div>
                <h1 className="font-script text-8xl text-[#deaf5c] drop-shadow-2xl">
                  Putri Aurelia & Riswandi
                </h1>
                <p className="text-2xl opacity-90 tracking-[0.2em] font-light text-[#f9f5f0]">Sabtu, 04 April 2026</p>
              </motion.div>
           </div>
        </div>

        {/* Right Side / Mobile Full: Scrollable Content */}
        <div className="w-full lg:w-1/2 min-h-screen relative flex justify-center bg-[#5c141d]">
          {/* Mobile Max-Width Container */}
          <div className={`w-full max-w-md bg-transparent h-[100dvh] relative shadow-2xl no-scrollbar scroll-smooth ${isOpened ? "overflow-y-auto" : "overflow-hidden"}`}>
            
            {/* Dedicated Background Layer for Mobile Content */}
            {isOpened && (
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div 
                  className="fixed inset-0 lg:absolute bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay scale-110"
                  style={{ backgroundImage: 'url("/wedding-next/wedding_background_premium.png")' }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#3a0d11]/90 via-[#5c141d]/80 to-[#3a0d11]/90 backdrop-blur-[2px]"></div>
              </div>
            )}
            
            {/* --- 1. COVER / OPENING SCREEN --- */}
            <AnimatePresence>
              {!isOpened && (
                <motion.div 
                  initial={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
                  className="absolute inset-0 h-[100dvh] z-40 bg-[#3a0d11] flex flex-col items-center justify-between p-8 text-center overscroll-none overflow-hidden"
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/wedding-next/WhatsApp Image 2026-03-14 at 09.57.42.jpeg"
                      alt="Wedding Background"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3a0d11] via-[#3a0d11]/60 to-transparent" />
                  </div>

                  <div className="relative z-20 flex flex-col h-full justify-end pb-12 space-y-12 w-full">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h2 className="text-sm tracking-[0.2em] uppercase text-[#f3f4f6]">The Wedding Of</h2>
                      <h1 className="font-script text-6xl text-[#deaf5c] drop-shadow-2xl">Putri Aurelia & Riswandi</h1>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-8"
                    >
                      <div className="space-y-1">
                        <p className="text-sm tracking-wide text-[#f3f4f6]">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                        <p className="text-[10px] italic text-[#f3f4f6]/70">*Mohon maaf jika ada kesalahan dalam penulisan nama / gelar.</p>
                      </div>

                      <button 
                        onClick={handleOpenInvitation}
                        className="px-10 py-4 bg-[#deaf5c] text-[#3a0d11] rounded-full font-bold uppercase text-sm tracking-widest hover:bg-[#d1a555] transition-all transform hover:scale-105 flex items-center justify-center space-x-3 mx-auto shadow-2xl"
                      >
                        <BookOpen size={20} />
                        <span>Buka Undangan</span>
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- 2. MAIN SCROLLABLE CONTENT --- */}
            <div className="pb-32">
              
              {/* Hero Section */}
              <section id="hero" className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center relative border-b-2 border-[#deaf5c]/20">
                <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#deaf5c]/10 to-transparent" />
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2 }}
                  className="space-y-8 z-10 w-full max-w-sm"
                >
                  <Heart className="mx-auto text-[#deaf5c]" size={40} />
                  <div className="space-y-4">
                    <h2 className="text-md font-bold uppercase tracking-[0.2em] text-[#deaf5c]">Pernikahan</h2>
                    <div className="space-y-2 py-4">
                      <h3 className="font-script text-7xl text-[#deaf5c]">Putri Aurelia</h3>
                      <p className="text-3xl opacity-80 font-script">&</p>
                      <h3 className="font-script text-7xl text-[#deaf5c]">Riswandi</h3>
                    </div>
                    <p className="text-sm font-bold tracking-[0.2em] opacity-90 text-[#deaf5c]">Sabtu, 04 April 2026</p>
                    
                    {/* Countdown Timer */}
                    <div className="grid grid-cols-4 gap-2 w-full pt-4">
                      <div className="flex flex-col items-center justify-center py-3 rounded-lg border border-[#deaf5c] bg-[#5c141d]/80">
                        <span className="text-xl font-bold text-[#f9f5f0]">{String(timeLeft.days).padStart(2, '0')}</span>
                        <span className="text-[10px] uppercase opacity-80">Hari</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 rounded-lg border border-[#deaf5c] bg-[#5c141d]/80">
                        <span className="text-xl font-bold text-[#f9f5f0]">{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-[10px] uppercase opacity-80">Jam</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 rounded-lg border border-[#deaf5c] bg-[#5c141d]/80">
                        <span className="text-xl font-bold text-[#f9f5f0]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="text-[10px] uppercase opacity-80">Menit</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 rounded-lg border border-[#deaf5c] bg-[#5c141d]/80">
                        <span className="text-xl font-bold text-[#f9f5f0]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="text-[10px] uppercase opacity-80">Detik</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-10"
                >
                   <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#deaf5c] to-transparent"></div>
                </motion.div>
              </section>

              {/* Quran Verse */}
              <section className="py-20 px-8 text-center border-b-2 border-[#deaf5c]/20 bg-[#5c141d]/30">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6 max-w-sm mx-auto"
                >
                  <Quote className="mx-auto text-[#deaf5c]/50" size={32} />
                  <p className="text-sm leading-relaxed italic text-[#f9f5f0]/90">
                    &quot;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...&quot;
                  </p>
                  <h4 className="font-serif text-[#deaf5c]">QS. Ar-Rum: 21</h4>
                </motion.div>
              </section>

              {/* Couple Info */}
              <section id="couple" className="py-24 px-6 text-center border-b-2 border-[#deaf5c]/20 relative">
                <div className="max-w-md mx-auto space-y-24">
                  {/* Bride */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                  >
                    <div className="relative aspect-[3/4] max-w-[280px] mx-auto">
                      <div className="absolute -inset-4 border border-[#deaf5c]/30 rounded-t-full -z-10 bg-gradient-to-b from-[#5c141d]/40 to-transparent"></div>
                      <div className="absolute -inset-2 border-2 border-[#deaf5c]/60 rounded-t-full"></div>
                      <div className="w-full h-full overflow-hidden rounded-t-full border-4 border-[#deaf5c] shadow-2xl bg-[#5c141d]">
                        <img 
                          src="/wedding-next/WhatsApp Image 2026-03-14 at 09.57.42.jpeg" 
                          alt="Putri Aurelia" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-script text-5xl text-[#deaf5c]">Putri Aurelia</h3>
                      <p className="text-xs uppercase tracking-widest text-[#f9f5f0]/80 px-4">
                        Putri pertama dari bpk Rustang dan ibu Hermawati
                      </p>
                    </div>
                  </motion.div>

                  {/* Groom */}
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                  >
                    <div className="relative aspect-[3/4] max-w-[280px] mx-auto">
                      <div className="absolute -inset-4 border border-[#deaf5c]/30 rounded-t-full -z-10 bg-gradient-to-b from-[#5c141d]/40 to-transparent"></div>
                      <div className="absolute -inset-2 border-2 border-[#deaf5c]/60 rounded-t-full"></div>
                      <div className="w-full h-full overflow-hidden rounded-t-full border-4 border-[#deaf5c] shadow-2xl bg-[#5c141d]">
                        <img 
                          src="/wedding-next/WhatsApp Image 2026-03-14 at 09.58.01.jpeg" 
                          alt="Riswandi" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-script text-5xl text-[#deaf5c]">Riswandi</h3>
                      <p className="text-xs uppercase tracking-widest text-[#f9f5f0]/80 px-4">
                         Putra Dari Bapak Fulan & Ibu Fulanah
                      </p>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Event Schedule */}
              <section id="event" className="py-24 px-6 text-center border-b-2 border-[#deaf5c]/20 bg-[#5c141d]/20">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-12"
                >
                  <h2 className="text-3xl font-serif text-[#deaf5c]">Jadwal Acara</h2>
                  <div className="space-y-8">
                    {/* Akad */}
                    <div className="relative p-8 rounded-t-[100px] border-2 border-[#deaf5c]/50 bg-[#5c141d]/80 overflow-hidden shadow-2xl mx-auto max-w-sm">
                       <div className="absolute inset-0 bg-[url('/wedding-next/wedding_background_premium.png')] bg-cover opacity-10 mix-blend-overlay"></div>
                       <div className="relative z-10 space-y-4">
                          <h3 className="font-script text-4xl text-[#deaf5c]">Akad Nikah</h3>
                          <p className="text-sm font-bold text-[#f9f5f0]">Sabtu, 04 April 2026</p>
                          <p className="text-xs text-[#f9f5f0]/80 italic">10:00 WITA - Selesai</p>
                          <div className="pt-4 border-t border-[#deaf5c]/30">
                            <p className="text-sm font-bold">Kediaman Mempelai Wanita</p>
                            <p className="text-xs text-[#f9f5f0]/70 mt-1">Pammase, desa selli, kec bengo, kab bone</p>
                          </div>
                       </div>
                    </div>
                    {/* Resepsi */}
                    <div className="relative p-8 rounded-t-[100px] border-2 border-[#deaf5c]/50 bg-[#5c141d]/80 overflow-hidden shadow-2xl mx-auto max-w-sm">
                       <div className="absolute inset-0 bg-[url('/wedding-next/wedding_background_premium.png')] bg-cover opacity-10 mix-blend-overlay"></div>
                       <div className="relative z-10 space-y-4">
                          <h3 className="font-script text-4xl text-[#deaf5c]">Resepsi</h3>
                          <p className="text-sm font-bold text-[#f9f5f0]">Sabtu, 04 April 2026</p>
                          <p className="text-xs text-[#f9f5f0]/80 italic">10:00 WITA - Selesai</p>
                          <div className="pt-4 border-t border-[#deaf5c]/30">
                            <p className="text-sm font-bold">Kediaman Mempelai Wanita</p>
                            <p className="text-xs text-[#f9f5f0]/70 mt-1">Pammase, desa selli, kec bengo, kab bone</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Gallery */}
              <section id="gallery" className="py-24 px-6 text-center border-b-2 border-[#deaf5c]/20">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-script text-[#deaf5c]">Galeri</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <img src="/wedding-next/WhatsApp Image 2026-03-14 at 09.57.42.jpeg" className="rounded-lg object-cover w-full h-40 border border-[#deaf5c]/30" alt="Gallery" />
                    <img src="/wedding-next/WhatsApp Image 2026-03-14 at 09.58.01.jpeg" className="rounded-lg object-cover w-full h-40 border border-[#deaf5c]/30" alt="Gallery" />
                    <img src="/wedding-next/WhatsApp Image 2026-03-14 at 09.58.33.jpeg" className="rounded-lg object-cover w-full h-40 border border-[#deaf5c]/30" alt="Gallery" />
                    <img src="/wedding-next/WhatsApp Image 2026-03-14 at 09.58.58.jpeg" className="rounded-lg object-cover w-full h-40 border border-[#deaf5c]/30" alt="Gallery" />
                    <img src="/wedding-next/WhatsApp Image 2026-03-14 at 09.59.19.jpeg" className="rounded-lg object-cover w-full h-40 border border-[#deaf5c]/30" alt="Gallery" />
                    <img src="/wedding-next/WhatsApp Image 2026-03-14 at 09.59.35.jpeg" className="rounded-lg object-cover w-full h-40 border border-[#deaf5c]/30" alt="Gallery" />
                  </div>
                </motion.div>
              </section>

              {/* Wedding Gift */}
              <section id="gift" className="py-24 px-6 text-center border-b-2 border-[#deaf5c]/20 bg-[#5c141d]/10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <h2 className="text-4xl font-script text-[#deaf5c]">Wedding Gift</h2>
                  <p className="text-sm text-[#f9f5f0]/80 px-4">
                    Jika memberi adalah ungkapan tanda kasih, Anda dapat memberi melalui dibawah ini.
                  </p>
                  <button 
                    onClick={() => setShowGift(!showGift)}
                    className="px-8 py-3 bg-[#deaf5c] text-[#3a0d11] rounded-full font-bold uppercase text-xs"
                  >
                    Kirim Hadiah
                  </button>

                  <AnimatePresence>
                    {showGift && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 pt-8 overflow-hidden"
                      >
                         <div className="bg-[#5c141d] p-8 rounded-t-[80px] border-2 border-[#deaf5c]/50 text-center space-y-4 shadow-2xl relative overflow-hidden max-w-xs mx-auto">
                            <h3 className="font-bold text-[#deaf5c]">BANK BSI</h3>
                            <p className="text-lg font-bold">7174100505</p>
                            <p className="text-xs text-[#f9f5f0]">a.n Nurindah</p>
                            <button onClick={() => { navigator.clipboard.writeText("7174100505"); alert("Disalin!"); }} className="text-[10px] bg-[#deaf5c] text-[#3a0d11] px-4 py-1 rounded-full font-bold">SALIN</button>
                         </div>
                         <div className="bg-[#5c141d] p-8 rounded-t-[80px] border-2 border-[#deaf5c]/50 text-center space-y-4 shadow-2xl relative overflow-hidden max-w-xs mx-auto">
                            <h3 className="font-bold text-[#deaf5c]">DANA</h3>
                            <p className="text-lg font-bold">089604436922</p>
                            <p className="text-xs text-[#f9f5f0]">a.n Putri Aurelia</p>
                            <button onClick={() => { navigator.clipboard.writeText("089604436922"); alert("Disalin!"); }} className="text-[10px] bg-[#deaf5c] text-[#3a0d11] px-4 py-1 rounded-full font-bold">SALIN</button>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </section>

              {/* Guestbook */}
              <section id="wishes" className="py-24 px-6 text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-12"
                >
                  <h2 className="text-3xl font-serif text-[#deaf5c]">Buku Tamu</h2>
                  <div className="bg-[#5c141d]/80 p-8 rounded-t-[50px] border-2 border-[#deaf5c]/50 shadow-2xl max-w-sm mx-auto">
                    <form onSubmit={submitWish} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Nama"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#3a0d11]/50 border border-[#deaf5c]/30 rounded-full px-6 py-2 text-sm text-[#f9f5f0] focus:outline-none placeholder-[#deaf5c]/40"
                        required
                      />
                      <select
                        value={attendance}
                        onChange={(e) => setAttendance(e.target.value)}
                        className="w-full bg-[#3a0d11]/50 border border-[#deaf5c]/30 rounded-full px-6 py-2 text-sm text-[#f9f5f0] focus:outline-none"
                      >
                        <option value="hadir">Hadir</option>
                        <option value="tidak_hadir">Tidak Hadir</option>
                        <option value="ragu">Ragu</option>
                      </select>
                      <textarea
                        placeholder="Ucapan & Doa"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-[#3a0d11]/50 border border-[#deaf5c]/30 rounded-2xl px-6 py-3 text-sm text-[#f9f5f0] focus:outline-none placeholder-[#deaf5c]/40 min-h-[100px]"
                        required
                      ></textarea>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#deaf5c] text-[#3a0d11] font-bold py-3 rounded-full text-sm hover:scale-105 transition-transform"
                      >
                        {isSubmitting ? "Mengirim..." : "Kirim"}
                      </button>
                    </form>

                    <div className="mt-8 space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pt-4">
                      {wishes.map((wish, idx) => (
                        <div key={wish.id || idx} className="bg-[#3a0d11]/40 p-4 rounded-xl border border-[#deaf5c]/20 text-left">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-[#deaf5c] text-sm">{wish.name}</h4>
                            <span className="text-[8px] bg-[#deaf5c]/10 text-[#deaf5c] px-2 py-0.5 rounded-full uppercase leading-none">{wish.attendance}</span>
                          </div>
                          <p className="text-xs text-[#f9f5f0]/80 italic">"{wish.message}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                <div className="absolute inset-x-0 bottom-0 h-40 bg-[url('/wedding-next/wedding_background_premium.png')] bg-contain bg-bottom bg-no-repeat opacity-30 pointer-events-none -z-10"></div>
              </section>

              <footer className="py-12 text-center opacity-50">
                 <p className="text-[10px] tracking-widest uppercase text-[#f9f5f0]">Putri Aurelia & Riswandi &bull; 2026</p>
              </footer>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
