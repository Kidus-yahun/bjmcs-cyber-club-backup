import { siteConfig } from "@/config/site";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowUpRight, Shield, Terminal, Cpu, Lock, Crosshair, ArrowRight, CornerDownRight } from "lucide-react";

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

  let statusText = "ADMISSIONS ACTIVE // REVIEWING CADET SUBMISSIONS";
  if (!isOpen) {
    statusText = "REGISTRATION CLOSED // COHORT LOCKED";
  } else if (isPastDeadline) {
    statusText = "DEADLINE EXPIRED // APPLICATION PORTAL SEALED";
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#090a0d] text-[#f4f3ee]">
      {/* Top Telemetry Dispatch Ticker */}
      <div className="border-b border-[#23262d] bg-[#0c0e12] py-2.5 px-4 sm:px-6 lg:px-8 font-mono text-[11px] text-[#828792]">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ff3700] animate-ping" />
            <span className="text-[#f4f3ee] font-semibold tracking-wider uppercase">
              BGMCS RESEARCH DISPATCH // SYS_VER: 2026.4
            </span>
            <span className="hidden md:inline text-[#3a3f4a]">|</span>
            <span className="hidden md:inline text-[#828792]">
              TOPOLOGY: AIR-GAPPED TRAINING SUBNET &bull; LAT: 11.59 &bull; LON: 37.38
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#ff3700] uppercase font-bold tracking-wider">{statusText}</span>
          </div>
        </div>
      </div>

      {/* Hero Section: Asymmetrical Editorial Masthead */}
      <section className="relative border-b border-[#23262d] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Heavy Editorial Statement (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-8">
              <div className="inline-flex items-center gap-2 border border-[#23262d] bg-[#111317] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#828792] w-fit">
                <span className="text-[#ff3700] font-bold">#</span>
                <span>DISCIPLINE OVER INTUITION</span>
                <span className="text-[#3a3f4a]">&bull;</span>
                <span className="text-[#f4f3ee]">COHORT 2026/27</span>
              </div>

              <div className="space-y-4">
                <h1 className="font-serif-display italic text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.92] text-[#f4f3ee] tracking-tight">
                  Exploits punish bad architecture.
                  <span className="font-sans font-black uppercase text-4xl sm:text-6xl lg:text-[4.6rem] text-[#ff3700] block tracking-tighter not-italic mt-3">
                    Never luck.
                  </span>
                </h1>
                
                <p className="font-sans text-base sm:text-lg text-[#a2a7b2] leading-relaxed max-w-2xl pt-2">
                  <strong className="text-[#f4f3ee] font-semibold">{siteConfig.name}</strong> is an autonomous collegiate offensive research cell and defense laboratory. We discard point-and-click scanners and generic certification quizzes. We dismantle x86_64 binaries, audit memory structures, break weak cryptographic implementations, and build resilient infrastructure under live adversary conditions.
                </p>
              </div>

              {/* Action Buttons & Ledger Status */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {isClosed ? (
                  <span className="inline-flex items-center justify-center border border-[#3a3f4a] bg-[#1a1c22] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#828792] cursor-not-allowed">
                    [APPLICATIONS CLOSED]
                  </span>
                ) : (
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-[#ff3700] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-[#ff5419] transition-all duration-150 shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  >
                    <span>APPLY FOR CADET INTAKE</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center border border-[#23262d] bg-[#111317] px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-wider text-[#f4f3ee] hover:border-[#828792] hover:bg-[#171a21] transition-colors"
                >
                  <span>MEMBER ACCESS // TERMINAL</span>
                </Link>
              </div>

              {/* Live Metric Row */}
              <div className="pt-6 border-t border-[#23262d] grid grid-cols-3 gap-6 font-mono text-xs">
                <div>
                  <div className="text-[#828792] uppercase text-[10px] tracking-wider">// ADMISSION RATE</div>
                  <div className="text-xl font-bold text-[#f4f3ee] mt-1">~14%</div>
                  <div className="text-[10px] text-[#525866]">Curiosity & grit review</div>
                </div>
                <div>
                  <div className="text-[#828792] uppercase text-[10px] tracking-wider">// WEEKLY COMMITMENT</div>
                  <div className="text-xl font-bold text-[#ff3700] mt-1">8+ HRS</div>
                  <div className="text-[10px] text-[#525866]">Hands-on lab work</div>
                </div>
                <div>
                  <div className="text-[#828792] uppercase text-[10px] tracking-wider">// WARGAME EXERCISES</div>
                  <div className="text-xl font-bold text-[#f4f3ee] mt-1">18 / YR</div>
                  <div className="text-[10px] text-[#525866]">Internal & national CTFs</div>
                </div>
              </div>
            </div>

            {/* Right Column: Tactical Dossier Docket (5 cols) */}
            <div className="lg:col-span-5">
              <div className="border border-[#23262d] bg-[#0e1015] p-6 sm:p-8 font-mono relative">
                {/* Visual Docket Header Stamp */}
                <div className="flex items-center justify-between pb-4 border-b border-[#23262d] text-xs">
                  <div className="flex items-center gap-2 text-[#ff3700] font-bold">
                    <Terminal className="h-4 w-4" />
                    <span>DOCKET // BGMCS-SPEC-01</span>
                  </div>
                  <span className="text-[#525866] text-[10px]">CLASSIF: EDUCATIONAL_DEFENSE</span>
                </div>

                <div className="py-5 space-y-4 text-xs">
                  <div className="flex justify-between border-b border-[#1b1e25] pb-2">
                    <span className="text-[#828792]">ORGANIZATION:</span>
                    <span className="text-[#f4f3ee] font-semibold">{siteConfig.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1b1e25] pb-2">
                    <span className="text-[#828792]">OPERATIONAL CADENCE:</span>
                    <span className="text-[#f4f3ee]">3X Weekly Reversing Labs</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1b1e25] pb-2">
                    <span className="text-[#828792]">RANGE ARCHITECTURE:</span>
                    <span className="text-[#f4f3ee]">Isolated QEMU / Proxmox</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1b1e25] pb-2">
                    <span className="text-[#828792]">PRIMARY COMPLIANCE:</span>
                    <span className="text-[#f4f3ee]">Strict Authorization Only</span>
                  </div>
                </div>

                {/* Simulated Binary Telemetry Block */}
                <div className="mt-4 p-4 bg-[#060709] border border-[#1b1e25] text-[11px] leading-relaxed">
                  <div className="text-[#525866] mb-1">// REAL-TIME MEMORY AUDIT PREVIEW</div>
                  <div className="text-[#828792]">
                    0x7fff5fbff820: <span className="text-[#f4f3ee]">48 31 c0 50 48 bf 2f 62</span>
                  </div>
                  <div className="text-[#828792]">
                    0x7fff5fbff828: <span className="text-[#f4f3ee]">69 6e 2f 2f 73 68 57 54</span>
                  </div>
                  <div className="text-[#ff3700] font-bold mt-2">
                    &gt;&gt; STACK_FRAME: ASLR_ACTIVE // NX_PROTECTED
                  </div>
                  <div className="text-[#828792] text-[10px] mt-1">
                    *Cadets build custom ROP chains to bypass mitigations in lab challenges.
                  </div>
                </div>

                {/* Bottom Docket Note */}
                <div className="mt-6 pt-4 border-t border-[#23262d] flex items-center justify-between text-[10px] text-[#828792]">
                  <span>NODE DISPATCH: SECURE</span>
                  <span className="text-[#ff3700]">AUTHENTICATED // BGMCS-LAB</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 1: Research Divisions (Asymmetrical Index Layout - NO symmetrical 4-card grid) */}
      <section id="disciplines" className="border-b border-[#23262d] py-20 lg:py-28 bg-[#090a0d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-[#23262d]">
            <div className="lg:col-span-7">
              <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block mb-2">
                // 01. RESEARCH DIVISIONS
              </span>
              <h2 className="font-serif-display italic text-4xl sm:text-6xl text-[#f4f3ee] tracking-tight">
                Four battlefronts. Zero generic tutorials.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#828792] leading-relaxed">
                We organize all activities into dedicated technical tracks. Cadets specialize, dissect concrete software artifacts, and conduct peer code audits.
              </p>
            </div>
          </div>

          {/* Staggered Asymmetrical Division Ledger */}
          <div className="divide-y divide-[#23262d] border-t border-b border-[#23262d]">
            
            {/* Division 01 */}
            <div className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-[#0e1015] transition-colors px-4 -mx-4">
              <div className="lg:col-span-1 font-mono text-xs font-bold text-[#ff3700]">
                01/
              </div>
              <div className="lg:col-span-4">
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#f4f3ee] tracking-tight">
                  Offensive Security &amp; Exploitation
                </h3>
                <span className="font-mono text-[11px] text-[#ff3700] uppercase tracking-wider block mt-1">
                  [VULNERABILITY RESEARCH // REVERSING]
                </span>
              </div>
              <div className="lg:col-span-5">
                <p className="font-sans text-sm text-[#828792] leading-relaxed">
                  Disassembling stripped binaries, understanding heap allocators, crafting Return-Oriented Programming (ROP) chains, and diagnosing modern browser/kernel attack surfaces.
                </p>
              </div>
              <div className="lg:col-span-2 font-mono text-[11px] text-[#525866] lg:text-right">
                STACK: C &bull; x86_64 &bull; Ghidra &bull; GDB
              </div>
            </div>

            {/* Division 02 */}
            <div className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-[#0e1015] transition-colors px-4 -mx-4">
              <div className="lg:col-span-1 font-mono text-xs font-bold text-[#ff3700]">
                02/
              </div>
              <div className="lg:col-span-4">
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#f4f3ee] tracking-tight">
                  Defensive Architecture &amp; Telemetry
                </h3>
                <span className="font-mono text-[11px] text-[#ff3700] uppercase tracking-wider block mt-1">
                  [SYSTEM HARDENING // INCIDENT RESPONSE]
                </span>
              </div>
              <div className="lg:col-span-5">
                <p className="font-sans text-sm text-[#828792] leading-relaxed">
                  Engineering zero-trust enterprise segmentation, inspecting kernel audit logs via eBPF, threat hunting active adversary footprints, and deploying memory-safe service architectures.
                </p>
              </div>
              <div className="lg:col-span-2 font-mono text-[11px] text-[#525866] lg:text-right">
                STACK: Rust &bull; eBPF &bull; Linux &bull; Suricata
              </div>
            </div>

            {/* Division 03 */}
            <div className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-[#0e1015] transition-colors px-4 -mx-4">
              <div className="lg:col-span-1 font-mono text-xs font-bold text-[#ff3700]">
                03/
              </div>
              <div className="lg:col-span-4">
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#f4f3ee] tracking-tight">
                  Applied Cryptography &amp; Protocols
                </h3>
                <span className="font-mono text-[11px] text-[#ff3700] uppercase tracking-wider block mt-1">
                  [CRYPTANALYSIS // PROTOCOL PROBING]
                </span>
              </div>
              <div className="lg:col-span-5">
                <p className="font-sans text-sm text-[#828792] leading-relaxed">
                  Auditing implementations of key exchange protocols, testing post-quantum algorithms against mathematical lattice attacks, and exposing cache side-channel timing vulnerabilities.
                </p>
              </div>
              <div className="lg:col-span-2 font-mono text-[11px] text-[#525866] lg:text-right">
                STACK: Sage &bull; Python &bull; OpenSSL &bull; Kyber
              </div>
            </div>

            {/* Division 04 */}
            <div className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-[#0e1015] transition-colors px-4 -mx-4">
              <div className="lg:col-span-1 font-mono text-xs font-bold text-[#ff3700]">
                04/
              </div>
              <div className="lg:col-span-4">
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#f4f3ee] tracking-tight">
                  Competitive Wargames &amp; CTF
                </h3>
                <span className="font-mono text-[11px] text-[#ff3700] uppercase tracking-wider block mt-1">
                  [ADVERSARY EMULATION // RED VS BLUE]
                </span>
              </div>
              <div className="lg:col-span-5">
                <p className="font-sans text-sm text-[#828792] leading-relaxed">
                  Real-time attack-defense challenges under tight deadlines. We deploy squads to solve complex reversing, pwn, web exploitation, and hardware fault injection scenarios against regional rivals.
                </p>
              </div>
              <div className="lg:col-span-2 font-mono text-[11px] text-[#525866] lg:text-right">
                FORMAT: DEFCON Quals &bull; Attack-Defense
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 2: The 3-Phase Operational Blueprint (Editorial Magazine-Style Typesetting) */}
      <section id="blueprint" className="border-b border-[#23262d] py-20 lg:py-28 bg-[#0b0c10]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Manifesto Quote (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block">
                // 02. CURRICULUM BLUEPRINT
              </span>
              <blockquote className="font-serif-display italic text-3xl sm:text-5xl text-[#f4f3ee] leading-tight">
                &ldquo;Most computing courses lag years behind the real threat frontier. We bridge that gap before you graduate.&rdquo;
              </blockquote>
              <div className="font-mono text-xs text-[#828792] pt-4 border-t border-[#23262d]">
                METHODOLOGY: ZERO FLUFF &bull; 100% REVERSIBLE ARTIFACTS
              </div>
            </div>

            {/* Right Column: 3 Staggered Operational Phases (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Phase 1 */}
              <div className="border border-[#23262d] bg-[#090a0d] p-8 space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-[#ff3700]">
                  <span className="font-bold">// PHASE 01</span>
                  <span>WEEKS 01 &ndash; 08</span>
                </div>
                <h3 className="font-sans font-bold text-2xl text-[#f4f3ee]">
                  The Rigorous Foundation
                </h3>
                <p className="font-sans text-sm text-[#828792] leading-relaxed">
                  Cadets strip down the operating system. We cover assembly syntax, stack manipulation, pointer arithmetic, socket programming in raw C, and deep packet dissection with Scapy and Wireshark. Automated vulnerability scanners are banned during this phase.
                </p>
                <div className="pt-4 border-t border-[#1b1e25] font-mono text-xs text-[#525866]">
                  BENCHMARK: Build a custom network packet sniffer &amp; parse raw ethernet frames from scratch.
                </div>
              </div>

              {/* Phase 2 */}
              <div className="border border-[#23262d] bg-[#090a0d] p-8 space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-[#ff3700]">
                  <span className="font-bold">// PHASE 02</span>
                  <span>WEEKS 09 &ndash; 18</span>
                </div>
                <h3 className="font-sans font-bold text-2xl text-[#f4f3ee]">
                  Live Adversary Range Engagements
                </h3>
                <p className="font-sans text-sm text-[#828792] leading-relaxed">
                  Students enter the BGMCS Cyber Range—a sandboxed network mirroring corporate infrastructure with Domain Controllers, vulnerable web endpoints, and legacy mainframes. Teams alternate between Red and Blue roles every forty-eight hours.
                </p>
                <div className="pt-4 border-t border-[#1b1e25] font-mono text-xs text-[#525866]">
                  BENCHMARK: Exploit a patched vulnerability, maintain persistence, and document complete remediation timeline.
                </div>
              </div>

              {/* Phase 3 */}
              <div className="border border-[#23262d] bg-[#090a0d] p-8 space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-[#ff3700]">
                  <span className="font-bold">// PHASE 03</span>
                  <span>WEEKS 19 &ndash; 26</span>
                </div>
                <h3 className="font-sans font-bold text-2xl text-[#f4f3ee]">
                  Capstone Research &amp; Responsible Disclosure
                </h3>
                <p className="font-sans text-sm text-[#828792] leading-relaxed">
                  The terminal requirement. Cadets publish an original technical research report, submit an open-source security tool, or discover and ethically report a vulnerability through sanctioned bug bounty channels under mentor oversight.
                </p>
                <div className="pt-4 border-t border-[#1b1e25] font-mono text-xs text-[#525866]">
                  BENCHMARK: Author an in-depth security whitepaper or release an audited defensive open-source tool.
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Section 3: Lab Dossier & Criteria (Utilitarian Technical Specs) */}
      <section id="dossier" className="border-b border-[#23262d] py-20 lg:py-28 bg-[#090a0d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block mb-2">
              // 03. LAB DOSSIER &amp; INTEGRITY STANDARDS
            </span>
            <h2 className="font-serif-display italic text-4xl sm:text-6xl text-[#f4f3ee] tracking-tight">
              Ethical boundaries are non-negotiable.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="border border-[#23262d] bg-[#0c0e12] p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="font-mono text-xs text-[#ff3700] mb-3">// STANDARD 01</div>
                <h3 className="font-sans font-bold text-lg text-[#f4f3ee] mb-2">Authorized Environments Only</h3>
                <p className="font-sans text-sm text-[#828792] leading-relaxed">
                  Club toolsets and exploit payloads must strictly remain within designated BGMCS lab sandboxes. Probing any external system without explicit written permission results in immediate dismissal.
                </p>
              </div>
              <div className="font-mono text-[11px] text-[#525866] pt-4 border-t border-[#1b1e25]">
                ENFORCEMENT: ZERO TOLERANCE
              </div>
            </div>

            <div className="border border-[#23262d] bg-[#0c0e12] p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="font-mono text-xs text-[#ff3700] mb-3">// STANDARD 02</div>
                <h3 className="font-sans font-bold text-lg text-[#f4f3ee] mb-2">Merit-Driven Progression</h3>
                <p className="font-sans text-sm text-[#828792] leading-relaxed">
                  Advancement through divisions depends entirely on lab task submissions, CTF participation, and peer reviews. Inactivity without formal deferral automatically opens your slot to waitlisted applicants.
                </p>
              </div>
              <div className="font-mono text-[11px] text-[#525866] pt-4 border-t border-[#1b1e25]">
                TRACKING: AUTOMATED REPO AUDITS
              </div>
            </div>

            <div className="border border-[#23262d] bg-[#0c0e12] p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="font-mono text-xs text-[#ff3700] mb-3">// STANDARD 03</div>
                <h3 className="font-sans font-bold text-lg text-[#f4f3ee] mb-2">Open Collaboration &amp; Defense</h3>
                <p className="font-sans text-sm text-[#828792] leading-relaxed">
                  We believe offensive knowledge is solely justified when used to engineer unshakeable defense. All internal findings are synthesized into defensive signatures and blue-team playbooks.
                </p>
              </div>
              <div className="font-mono text-[11px] text-[#525866] pt-4 border-t border-[#1b1e25]">
                GOAL: COLLECTIVE HARDENING
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 4: Admissions Intake Ledger (Brutalist Call-To-Action Block) */}
      <section id="admissions" className="py-20 lg:py-28 bg-[#07080a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-[#23262d] bg-[#0a0c10] p-8 sm:p-12 lg:p-16 relative">
            <div className="absolute top-0 right-0 bg-[#ff3700] text-black font-mono text-[11px] font-bold px-4 py-1 uppercase tracking-wider">
              CADET RECRUITMENT 2026/27
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold">
                  // 04. ADMISSIONS LEDGER
                </span>
                <h2 className="font-serif-display italic text-4xl sm:text-6xl text-[#f4f3ee] tracking-tight">
                  Ready to test your limits against real systems?
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#828792] max-w-2xl leading-relaxed">
                  We look for deep curiosity, perseverance, and intellectual honesty. If you are ready to put in eight hours a week breaking and repairing systems, submit your application docket.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4">
                {isClosed ? (
                  <div className="w-full text-center border border-[#3a3f4a] bg-[#1a1c22] py-4 px-6 font-mono text-xs font-bold text-[#828792]">
                    APPLICATIONS SEALED FOR THIS CYCLE
                  </div>
                ) : (
                  <Link
                    href="/register"
                    className="w-full text-center bg-[#ff3700] py-4 px-8 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-[#ff5419] transition-all duration-150 shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  >
                    SUBMIT APPLICATION DOSSIER &rarr;
                  </Link>
                )}

                <div className="font-mono text-[11px] text-[#525866]">
                  CURRENT STATUS: <span className="text-[#f4f3ee]">{statusText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
