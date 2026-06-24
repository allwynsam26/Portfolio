import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo('.exp-title', 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          }
        }
      )

      // Education cards animation
      gsap.fromTo('.anim-edu-card', 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      id="experience" 
      ref={sectionRef}
      className="w-full min-h-screen flex justify-center items-center relative z-10 px-4 md:px-8 py-16 overflow-hidden"
    >
      <div className="glass-panel w-full max-w-[1050px] bg-[#080914]/2 backdrop-blur-2xl border border-white/7 rounded-[32px] p-6 md:p-12 shadow-2xl flex flex-col gap-8">
        <h2 className="exp-title text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent text-left">
          Education History
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* MCA Card */}
          <div className="anim-edu-card bg-white/2 border border-white/6 rounded-[20px] p-5 md:p-6 transition-all duration-300 hover:border-blue-500/30 flex flex-col justify-between gap-3 text-left">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-400 bg-white/4 px-3 py-1 rounded-full w-fit">
                2024 - 2026
              </span>
              <h3 className="font-bold text-white text-lg md:text-xl leading-snug mt-1">
                Master of Computer Applications (MCA)
              </h3>
              <div className="text-xs md:text-sm font-semibold text-blue-500 uppercase tracking-wider">
                Dr. MGR Educational and Research Institute, Chennai
              </div>
            </div>
            <span className="text-xs md:text-sm font-bold text-green-400 mt-2 block">
              CGPA: 8.53
            </span>
          </div>

          {/* BCA Card */}
          <div className="anim-edu-card bg-white/2 border border-white/6 rounded-[20px] p-5 md:p-6 transition-all duration-300 hover:border-blue-500/30 flex flex-col justify-between gap-3 text-left">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-400 bg-white/4 px-3 py-1 rounded-full w-fit">
                2021 - 2024
              </span>
              <h3 className="font-bold text-white text-lg md:text-xl leading-snug mt-1">
                Bachelor of Computer Applications (BCA)
              </h3>
              <div className="text-xs md:text-sm font-semibold text-blue-500 uppercase tracking-wider">
                Dr. MGR Educational and Research Institute, Chennai
              </div>
            </div>
            <span className="text-xs md:text-sm font-bold text-green-400 mt-2 block">
              CGPA: 7.48
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
