import { siteConfig } from "@/config/site";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Terminal, Shield, Cpu, Lock, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  let settings = null;
  try {
    settings = await db.registrationSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error("Failed to fetch registration settings:", error);
  }

  const isOpen = settings?.isOpen ?? false;
  const isPastDeadline = settings?.deadline ? new Date() > settings?.deadline : false;
  const isClosed = !isOpen || isPastDeadline;

  let statusText = "APPLICATIONS OPEN // 2026/27";
  if (!isOpen) {
    statusText = "REGISTRATION CLOSED";
  } else if (isPastDeadline) {
    statusText = "DEADLINE PASSED";
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#090a0d] text-[#f4f3ee]">
      {/* Top Status Strip */}
      <div className="border-b border-[#23262d] bg-[#0c0e12] py-2 px-4 sm:px-6 lg:px-8 font-mono text-[11px] text-[#828792]">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ff3700]" />
            <span className="text-[#f4f3ee] font-semibold uppercase tracking-wider">
              {siteConfig.name} &bull; STUDENT CYBERSECURITY INITIATIVE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#ff3700] uppercase font-bold tracking-wider">{statusText}</span>
          </div>
        </div>
      </div>

      {/* Hero Section: Simple, High-Taste Editorial Asymmetry */}
      <section className="relative border-b border-[#23262d] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left: Punchy statement, clear & approachable */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="inline-flex items-center gap-2 border border-[#23262d] bg-[#111317] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#828792] w-fit">
                <span className="text-[#ff3700] font-bold">&bull;</span>
                <span>STUDENT TECH &amp; CYBER CLUB</span>
                <span className="text-[#3a3f4a]">&bull;</span>
                <span className="text-[#f4f3ee]">ACADEMIC YEAR 2026/27</span>
              </div>

              <div className="space-y-4">
                <h1 className="font-serif-display italic text-5xl sm:text-7xl lg:text-[5.2rem] leading-[0.95] text-[#f4f3ee] tracking-tight">
                  Building young minds to defend
                  <span className="font-sans font-black uppercase text-4xl sm:text-6xl lg:text-[4.4rem] text-[#ff3700] block tracking-tighter not-italic mt-2">
                    our digital world.
                  </span>
                </h1>
                
                <p className="font-sans text-base sm:text-lg text-[#a2a7b2] leading-relaxed max-w-xl">
                  <strong className="text-[#f4f3ee] font-semibold">{siteConfig.name}</strong> empowers students with practical computing, ethical hacking fundamentals, and hands-on defense skills in safe, supervised environments.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {isClosed ? (
                  <span className="inline-flex items-center justify-center border border-[#3a3f4a] bg-[#1a1c22] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#828792] cursor-not-allowed">
                    [REGISTRATION CLOSED]
                  </span>
                ) : (
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-[#ff3700] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-[#ff5419] transition-all duration-150 shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  >
                    <span>JOIN THE CLUB</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center border border-[#23262d] bg-[#111317] px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-wider text-[#f4f3ee] hover:border-[#828792] hover:bg-[#171a21] transition-colors"
                >
                  <span>MEMBER LOGIN</span>
                </Link>
              </div>

              {/* High-level metrics: Clean & Easy for leadership to read */}
              <div className="pt-6 border-t border-[#23262d] grid grid-cols-3 gap-6 font-mono text-xs">
                <div>
                  <div className="text-[#828792] uppercase text-[10px] tracking-wider">// PRACTICAL LABS</div>
                  <div className="text-xl font-bold text-[#f4f3ee] mt-1">100%</div>
                  <div className="text-[10px] text-[#525866]">Hands-on projects</div>
                </div>
                <div>
                  <div className="text-[#828792] uppercase text-[10px] tracking-wider">// ETHICAL CODE</div>
                  <div className="text-xl font-bold text-[#ff3700] mt-1">STRICT</div>
                  <div className="text-[10px] text-[#525866]">Supervised practice</div>
                </div>
                <div>
                  <div className="text-[#828792] uppercase text-[10px] tracking-wider">// TEAM WORK</div>
                  <div className="text-xl font-bold text-[#f4f3ee] mt-1">COLLAB</div>
                  <div className="text-[10px] text-[#525866]">Peer mentorship</div>
                </div>
              </div>
            </div>

            {/* Right: Clean Club Card */}
            <div className="lg:col-span-5">
              <div className="border border-[#23262d] bg-[#0e1015] p-6 sm:p-8 font-mono">
                <div className="flex items-center justify-between pb-4 border-b border-[#23262d] text-xs">
                  <div className="flex items-center gap-2 text-[#ff3700] font-bold">
                    <Shield className="h-4 w-4" />
                    <span>CLUB OVERVIEW</span>
                  </div>
                  <span className="text-[#525866] text-[10px]">VERIFIED 2026/27</span>
                </div>

                <div className="py-5 space-y-3.5 text-xs">
                  <div className="flex justify-between border-b border-[#1b1e25] pb-2">
                    <span className="text-[#828792]">NAME:</span>
                    <span className="text-[#f4f3ee] font-semibold">{siteConfig.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1b1e25] pb-2">
                    <span className="text-[#828792]">FOCUS:</span>
                    <span className="text-[#f4f3ee]">Cybersecurity &amp; Programming</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1b1e25] pb-2">
                    <span className="text-[#828792]">SAFETY:</span>
                    <span className="text-[#f4f3ee]">Dedicated Sandbox Environment</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1b1e25] pb-2">
                    <span className="text-[#828792]">GOAL:</span>
                    <span className="text-[#f4f3ee]">Future Tech Leadership</span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#060709] border border-[#1b1e25] text-xs">
                  <div className="text-[#ff3700] font-semibold mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>SCHOOL &amp; STUDENT BENEFITS</span>
                  </div>
                  <p className="text-[#828792] text-[11px] leading-relaxed mt-1">
                    Fosters critical problem-solving, digital safety awareness, and collaborative engineering skills that prepare students for university and STEM careers.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 1: Core Tracks (Clear & concise) */}
      <section id="disciplines" className="border-b border-[#23262d] py-16 lg:py-20 bg-[#090a0d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-12 pb-6 border-b border-[#23262d]">
            <div className="lg:col-span-7">
              <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block mb-1">
                // 01. LEARNING TRACKS
              </span>
              <h2 className="font-serif-display italic text-3xl sm:text-5xl text-[#f4f3ee] tracking-tight">
                What students learn.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#828792]">
                Curated curriculum designed to take curious students from foundational computer concepts to advanced technical competence.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#23262d] border-t border-b border-[#23262d]">
            
            {/* Track 01 */}
            <div className="py-6 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center hover:bg-[#0e1015] transition-colors px-4 -mx-4">
              <div className="lg:col-span-1 font-mono text-xs font-bold text-[#ff3700]">01/</div>
              <div className="lg:col-span-4">
                <h3 className="font-sans font-bold text-lg text-[#f4f3ee]">Security &amp; Ethical Hacking</h3>
                <span className="font-mono text-[10px] text-[#828792] uppercase block mt-0.5">Foundations &amp; Analysis</span>
              </div>
              <div className="lg:col-span-5 text-sm text-[#828792]">
                Understanding vulnerabilities, safe testing, and how modern software systems protect user data.
              </div>
              <div className="lg:col-span-2 font-mono text-[11px] text-[#525866] lg:text-right">
                PRACTICAL LABS
              </div>
            </div>

            {/* Track 02 */}
            <div className="py-6 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center hover:bg-[#0e1015] transition-colors px-4 -mx-4">
              <div className="lg:col-span-1 font-mono text-xs font-bold text-[#ff3700]">02/</div>
              <div className="lg:col-span-4">
                <h3 className="font-sans font-bold text-lg text-[#f4f3ee]">Networks &amp; Infrastructure</h3>
                <span className="font-mono text-[10px] text-[#828792] uppercase block mt-0.5">Defensive Architecture</span>
              </div>
              <div className="lg:col-span-5 text-sm text-[#828792]">
                Learning how the internet works, inspecting network packets, configuring firewalls, and server hardening.
              </div>
              <div className="lg:col-span-2 font-mono text-[11px] text-[#525866] lg:text-right">
                LINUX &bull; NETWORKING
              </div>
            </div>

            {/* Track 03 */}
            <div className="py-6 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center hover:bg-[#0e1015] transition-colors px-4 -mx-4">
              <div className="lg:col-span-1 font-mono text-xs font-bold text-[#ff3700]">03/</div>
              <div className="lg:col-span-4">
                <h3 className="font-sans font-bold text-lg text-[#f4f3ee]">Applied Programming &amp; Logic</h3>
                <span className="font-mono text-[10px] text-[#828792] uppercase block mt-0.5">Software Engineering</span>
              </div>
              <div className="lg:col-span-5 text-sm text-[#828792]">
                Writing clean, reliable scripts in Python and C to automate security tasks and solve logic challenges.
              </div>
              <div className="lg:col-span-2 font-mono text-[11px] text-[#525866] lg:text-right">
                PYTHON &bull; C
              </div>
            </div>

            {/* Track 04 */}
            <div className="py-6 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center hover:bg-[#0e1015] transition-colors px-4 -mx-4">
              <div className="lg:col-span-1 font-mono text-xs font-bold text-[#ff3700]">04/</div>
              <div className="lg:col-span-4">
                <h3 className="font-sans font-bold text-lg text-[#f4f3ee]">Team Competitions &amp; CTFs</h3>
                <span className="font-mono text-[10px] text-[#828792] uppercase block mt-0.5">Collaborative Challenges</span>
              </div>
              <div className="lg:col-span-5 text-sm text-[#828792]">
                Participating as a school squad in friendly regional and student Capture-The-Flag wargames.
              </div>
              <div className="lg:col-span-2 font-mono text-[11px] text-[#525866] lg:text-right">
                TEAMWORK &bull; CTFS
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 2: 3-Phase Progression (Simplified & Clear) */}
      <section id="blueprint" className="border-b border-[#23262d] py-16 lg:py-20 bg-[#0b0c10]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block">
                // 02. STUDENT ROADMAP
              </span>
              <h2 className="font-serif-display italic text-3xl sm:text-5xl text-[#f4f3ee] leading-tight">
                Clear steps from day one to capstone.
              </h2>
              <p className="font-sans text-sm text-[#828792] leading-relaxed">
                Structured in progressive phases so any motivated student can build confidence at their own pace.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-[#23262d] bg-[#090a0d] p-6 space-y-3">
                <div className="font-mono text-xs font-bold text-[#ff3700]">// 01. FUNDAMENTALS</div>
                <h3 className="font-sans font-bold text-lg text-[#f4f3ee]">Learn The Basics</h3>
                <p className="font-sans text-xs text-[#828792] leading-relaxed">
                  Computer systems, Linux commands, internet protocols, and basic programming.
                </p>
              </div>

              <div className="border border-[#23262d] bg-[#090a0d] p-6 space-y-3">
                <div className="font-mono text-xs font-bold text-[#ff3700]">// 02. LABS</div>
                <h3 className="font-sans font-bold text-lg text-[#f4f3ee]">Supervised Practice</h3>
                <p className="font-sans text-xs text-[#828792] leading-relaxed">
                  Real-world scenario simulations inside safe, isolated school sandboxes.
                </p>
              </div>

              <div className="border border-[#23262d] bg-[#090a0d] p-6 space-y-3">
                <div className="font-mono text-xs font-bold text-[#ff3700]">// 03. CAPSTONE</div>
                <h3 className="font-sans font-bold text-lg text-[#f4f3ee]">Project &amp; Presentation</h3>
                <p className="font-sans text-xs text-[#828792] leading-relaxed">
                  Showcasing a team project, tool, or defensive study to peers and teachers.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 3: Ethics & Safety (Crucial for principals) */}
      <section id="dossier" className="border-b border-[#23262d] py-16 lg:py-20 bg-[#090a0d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block mb-1">
              // 03. ETHICS &amp; SCHOOL SAFETY
            </span>
            <h2 className="font-serif-display italic text-3xl sm:text-5xl text-[#f4f3ee] tracking-tight">
              Responsible learning at all times.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="border border-[#23262d] bg-[#0c0e12] p-6 space-y-3">
              <div className="font-mono text-xs text-[#ff3700] font-bold">// SAFETY FIRST</div>
              <h3 className="font-sans font-bold text-base text-[#f4f3ee]">Sandboxed Labs Only</h3>
              <p className="font-sans text-xs text-[#828792] leading-relaxed">
                All activities take place within school-approved isolated networks. Safety and containment are absolute priorities.
              </p>
            </div>

            <div className="border border-[#23262d] bg-[#0c0e12] p-6 space-y-3">
              <div className="font-mono text-xs text-[#ff3700] font-bold">// ETHICAL CONDUCT</div>
              <h3 className="font-sans font-bold text-base text-[#f4f3ee]">Honor Code &amp; Respect</h3>
              <p className="font-sans text-xs text-[#828792] leading-relaxed">
                Every member signs a strict academic code of ethics. Skills are taught strictly for constructive defense and education.
              </p>
            </div>

            <div className="border border-[#23262d] bg-[#0c0e12] p-6 space-y-3">
              <div className="font-mono text-xs text-[#ff3700] font-bold">// MENTORSHIP</div>
              <h3 className="font-sans font-bold text-base text-[#f4f3ee]">Faculty Oversight</h3>
              <p className="font-sans text-xs text-[#828792] leading-relaxed">
                Club activities run under the supervision and guidance of school advisors and experienced student leaders.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section 4: Join / CTA Section */}
      <section id="admissions" className="py-16 lg:py-20 bg-[#07080a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-[#23262d] bg-[#0a0c10] p-8 sm:p-12 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold">
                  // 04. GET INVOLVED
                </span>
                <h2 className="font-serif-display italic text-3xl sm:text-5xl text-[#f4f3ee] tracking-tight">
                  Ready to explore cybersecurity?
                </h2>
                <p className="font-sans text-sm text-[#828792] max-w-xl leading-relaxed">
                  Whether you are an absolute beginner or already coding, {siteConfig.name} offers a welcoming place to grow, build, and collaborate.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3">
                {isClosed ? (
                  <div className="w-full text-center border border-[#3a3f4a] bg-[#1a1c22] py-3.5 px-6 font-mono text-xs font-bold text-[#828792]">
                    APPLICATIONS CURRENTLY CLOSED
                  </div>
                ) : (
                  <Link
                    href="/register"
                    className="w-full text-center bg-[#ff3700] py-3.5 px-8 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-[#ff5419] transition-all duration-150 shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  >
                    APPLY TO JOIN THE CLUB &rarr;
                  </Link>
                )}

                <div className="font-mono text-[11px] text-[#525866]">
                  STATUS: <span className="text-[#f4f3ee]">{statusText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

