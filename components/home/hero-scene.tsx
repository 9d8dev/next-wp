"use client";

import { ArrowUpRight, Car, MapPin, ShieldCheck } from "lucide-react";

export function HeroScene() {
  return (
    <div className="hero-scene relative isolate min-h-[430px] overflow-hidden rounded-[2.25rem] bg-[#0d2730] shadow-2xl shadow-[#10232b]/20 sm:min-h-[540px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_15%,rgba(242,184,75,.3),transparent_25%),linear-gradient(135deg,#153f4a_0%,#0d2730_64%,#081a20_100%)]" />
      <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border border-[#f2b84b]/20 sm:h-[30rem] sm:w-[30rem]" />
      <div className="absolute -right-8 -top-16 h-64 w-64 rounded-full border border-[#f2b84b]/10 sm:h-96 sm:w-96" />
      <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-[#102b32]" />
      <div className="absolute bottom-[30%] left-0 right-0 h-px bg-white/10" />
      <div className="absolute bottom-[17%] left-0 right-0 h-px bg-[#f2b84b]/60" />
      <div className="absolute bottom-0 left-1/2 h-20 w-[130%] -translate-x-1/2 rounded-[50%] border-t border-white/10 bg-[#0b2026]" />
      <div className="scene-city absolute bottom-[29%] left-0 right-0 h-28 opacity-70 sm:h-40" />

      <div className="scene-route absolute bottom-[34%] left-[23%] z-10 text-[#f2b84b]">
        <span className="absolute -left-2 -top-2 h-5 w-5 rounded-full border border-[#f2b84b]/60" />
        <span className="absolute left-1 top-1 h-2 w-2 rounded-full bg-[#f2b84b]" />
        <svg className="h-24 w-28 overflow-visible" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          <path d="M5 78C30 78 22 24 56 24C82 24 68 78 115 78" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" />
          <path d="m108 70 8 8-8 8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="scene-bus absolute bottom-[33%] left-[-38%] z-20 w-48 sm:w-60">
        <svg viewBox="0 0 240 92" className="drop-shadow-2xl" aria-label="Ankommender Fahrschulbus">
          <rect x="4" y="8" width="232" height="70" rx="17" fill="#f2b84b" />
          <rect x="15" y="19" width="192" height="31" rx="8" fill="#123a45" />
          <path d="M26 24h32v21H26zM64 24h32v21H64zM102 24h32v21h-32zM140 24h32v21h-32z" fill="#acd7d7" opacity=".85" />
          <path d="M181 24h18v21h-18z" fill="#acd7d7" opacity=".5" />
          <text x="18" y="67" fill="#10232b" fontSize="10" fontWeight="800" letterSpacing="2">FAHRSCHULE BZ UCAR</text>
          <circle cx="45" cy="82" r="10" fill="#071b21" stroke="#f2b84b" strokeWidth="4" />
          <circle cx="194" cy="82" r="10" fill="#071b21" stroke="#f2b84b" strokeWidth="4" />
        </svg>
      </div>

      <div className="scene-person absolute bottom-[31%] left-[43%] z-20 opacity-0">
        <div className="mx-auto h-7 w-7 rounded-full bg-[#e9b18f]" />
        <div className="h-14 w-10 rounded-t-full bg-[#f2b84b]" />
        <div className="mx-auto flex w-12 justify-between">
          <span className="h-11 w-2.5 rounded-full bg-[#10232b]" /><span className="h-11 w-2.5 rounded-full bg-[#10232b]" />
        </div>
      </div>

      <div className="scene-building absolute bottom-[29%] right-[8%] z-10 w-36 sm:w-48">
        <div className="relative rounded-t-[1.1rem] bg-[#f8f1df] p-3 text-[#10232b] shadow-2xl">
          <div className="mb-2 flex items-center gap-2 text-[9px] font-black tracking-[0.18em]"><span className="h-2 w-2 rounded-full bg-[#e85d4a]" /> FAHRSCHULE</div>
          <div className="rounded-lg bg-[#a8d5d5] px-2 py-3 text-center text-lg font-black tracking-tight sm:text-2xl">BZ UCAR</div>
          <div className="mt-3 grid h-10 grid-cols-3 gap-1 rounded bg-[#204854] p-1"><i /><i /><i /></div>
        </div>
      </div>

      <div className="scene-car absolute bottom-[10%] left-[-35%] z-20 w-52 sm:w-64">
        <svg viewBox="0 0 260 100" className="drop-shadow-2xl" aria-label="Ausbildungsfahrzeug">
          <path d="M23 68h214c8 0 13-7 10-14l-10-22c-3-6-9-9-16-9h-84l-27-17H78c-8 0-14 5-18 12L46 32 22 42c-9 4-8 26 1 26Z" fill="#e85d4a" />
          <path d="m78 21 25 16h94l-8-12c-2-3-6-4-10-4H78Z" fill="#a8d5d5" />
          <path d="M45 48h165" stroke="#ff9b82" strokeWidth="3" />
          <circle cx="65" cy="76" r="14" fill="#071b21" stroke="#e85d4a" strokeWidth="6" /><circle cx="204" cy="76" r="14" fill="#071b21" stroke="#e85d4a" strokeWidth="6" />
          <text x="125" y="63" fill="#fff" fontSize="10" fontWeight="800" textAnchor="middle">B • UCAR</text>
        </svg>
      </div>

      <div className="absolute left-6 top-6 z-30 max-w-[17rem] text-white sm:left-8 sm:top-8">
        <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#f2b84b]">
          <span className="h-2 w-2 rounded-full bg-[#f2b84b]" />
          Deine Reise beginnt
        </p>
        <p className="text-base font-medium leading-relaxed text-white/80">
          Vom ersten Einsteigen bis zur sicheren Fahrt.
        </p>
      </div>
      <div className="absolute bottom-5 left-6 z-30 flex items-center gap-3 text-xs text-white/70 sm:bottom-7 sm:left-8">
        <span className="rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">Berlin</span>
        <span className="flex items-center gap-1.5"><ArrowUpRight size={13} className="text-[#f2b84b]" /> Deine Route</span>
      </div>

      <div className="absolute right-5 top-5 z-30 hidden flex-col gap-2 text-right text-xs text-white/70 sm:flex">
        <span className="inline-flex items-center justify-end gap-2"><ShieldCheck size={14} className="text-[#f2b84b]" /> TÜV-geprüft</span>
        <span className="inline-flex items-center justify-end gap-2"><MapPin size={14} className="text-[#f2b84b]" /> Berlin & Umgebung</span>
        <span className="inline-flex items-center justify-end gap-2"><Car size={14} className="text-[#f2b84b]" /> Moderne Fahrzeuge</span>
      </div>
    </div>
  );
}
