"use client";

import { Car, MapPin, ShieldCheck } from "lucide-react";

export function HeroScene() {
  return (
    <div className="hero-scene relative isolate min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#153642] shadow-2xl shadow-[#10232b]/20 sm:min-h-[500px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(242,184,75,.28),transparent_34%),linear-gradient(180deg,#1b4a56_0%,#10232b_100%)]" />
      <div className="absolute left-[8%] top-[17%] h-32 w-32 rounded-full bg-[#f7d690]/10 blur-3xl sm:h-52 sm:w-52" />
      <div className="scene-cloud scene-cloud-one" />
      <div className="scene-cloud scene-cloud-two" />
      <div className="absolute bottom-[24%] left-0 right-0 h-28 bg-[#e9e2d2]/10 [clip-path:polygon(0_55%,14%_42%,28%_54%,42%_35%,56%_50%,70%_32%,84%_48%,100%_28%,100%_100%,0_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-[27%] bg-[#172b32]" />
      <div className="absolute bottom-[15%] left-0 right-0 h-2 bg-[#f2b84b]/70" />
      <div className="absolute bottom-[7%] left-0 right-0 h-px bg-white/20" />

      <div className="scene-bus absolute bottom-[28%] left-[-30%] z-10 h-20 w-52 rounded-[1.4rem] bg-[#f2b84b] p-2 shadow-xl sm:h-24 sm:w-64">
        <div className="flex h-10 gap-1 rounded-xl bg-[#204b57] p-1 sm:h-12">
          <span className="flex-1 rounded-lg bg-[#bce3e4]/80" />
          <span className="flex-1 rounded-lg bg-[#bce3e4]/80" />
          <span className="flex-1 rounded-lg bg-[#bce3e4]/80" />
          <span className="flex-1 rounded-lg bg-[#bce3e4]/80" />
        </div>
        <div className="mt-2 flex items-center justify-between px-2 text-xs font-bold text-[#10232b]">
          <span>FAHRSCHULE</span>
          <span>01</span>
        </div>
        <i className="absolute -bottom-3 left-7 h-7 w-7 rounded-full bg-[#10232b] ring-4 ring-[#f2b84b]" />
        <i className="absolute -bottom-3 right-7 h-7 w-7 rounded-full bg-[#10232b] ring-4 ring-[#f2b84b]" />
      </div>

      <div className="scene-person absolute bottom-[28%] left-[45%] z-20 opacity-0">
        <div className="mx-auto h-8 w-8 rounded-full bg-[#f2c6a0]" />
        <div className="h-16 w-12 rounded-t-full bg-[#f2b84b]" />
        <div className="mx-auto flex w-14 justify-between">
          <span className="h-12 w-3 rounded-full bg-[#10232b]" />
          <span className="h-12 w-3 rounded-full bg-[#10232b]" />
        </div>
      </div>

      <div className="scene-building absolute bottom-[26%] right-[8%] z-10 w-40 rounded-t-[1.2rem] bg-[#f7f0df] p-3 text-[#10232b] shadow-2xl sm:w-52">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-[0.2em]">
          <span className="h-2 w-2 rounded-full bg-[#f2b84b]" />
          FAHRSCHULE
        </div>
        <div className="rounded-xl bg-[#b9dfe0] p-3 text-center text-xl font-black tracking-tight">
          BZ UCAR
        </div>
        <div className="mt-3 h-6 rounded bg-[#244e57]" />
        <div className="absolute -bottom-3 left-5 h-6 w-6 rounded-full bg-[#10232b] ring-4 ring-[#f7f0df]" />
        <div className="absolute -bottom-3 right-5 h-6 w-6 rounded-full bg-[#10232b] ring-4 ring-[#f7f0df]" />
      </div>

      <div className="scene-car absolute bottom-[11%] left-[-35%] z-20 h-16 w-44 rounded-[2rem_2rem_.8rem_.8rem] bg-[#e85d4a] shadow-lg sm:h-20 sm:w-56">
        <div className="absolute left-10 top-[-1.2rem] h-8 w-24 rounded-t-[2rem] bg-[#e85d4a] sm:left-12 sm:h-10 sm:w-32" />
        <div className="absolute left-14 top-[-.8rem] h-5 w-16 rounded-t-xl bg-[#b9dfe0] sm:left-16 sm:w-20" />
        <i className="absolute -bottom-3 left-7 h-7 w-7 rounded-full bg-[#10232b] ring-4 ring-[#e85d4a]" />
        <i className="absolute -bottom-3 right-7 h-7 w-7 rounded-full bg-[#10232b] ring-4 ring-[#e85d4a]" />
      </div>

      <div className="absolute left-6 top-6 z-30 max-w-[15rem] text-white sm:left-8 sm:top-8">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f2b84b]">
          <span className="h-2 w-2 rounded-full bg-[#f2b84b]" />
          Deine Reise beginnt
        </p>
        <p className="text-sm leading-relaxed text-white/75">
          Vom ersten Einsteigen bis zur sicheren Fahrt.
        </p>
      </div>
      <div className="absolute bottom-6 left-6 z-30 flex gap-2 text-xs text-white/70 sm:left-8">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Berlin</span>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">seit 2012</span>
      </div>

      <div className="absolute right-5 top-5 z-30 hidden flex-col gap-2 text-right text-xs text-white/70 sm:flex">
        <span className="inline-flex items-center justify-end gap-2"><ShieldCheck size={14} className="text-[#f2b84b]" /> TÜV-geprüft</span>
        <span className="inline-flex items-center justify-end gap-2"><MapPin size={14} className="text-[#f2b84b]" /> Berlin & Umgebung</span>
        <span className="inline-flex items-center justify-end gap-2"><Car size={14} className="text-[#f2b84b]" /> Moderne Fahrzeuge</span>
      </div>
    </div>
  );
}
