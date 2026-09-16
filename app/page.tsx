import Link from "next/link";
import { ArrowRight, Check, Clock3, HeartHandshake, Star, Users } from "lucide-react";
import { BookingForm } from "@/components/home/booking-form";
import { HeroScene } from "@/components/home/hero-scene";

const courses = [
  { label: "Klasse B", title: "Dein Pkw-Führerschein", text: "Flexibel lernen, sicher fahren und mit einem guten Gefühl in die Prüfung.", color: "bg-[#e8f4ee]" },
  { label: "Klasse A", title: "Freiheit auf zwei Rädern", text: "Motorradfahren mit erfahrenen Fahrlehrerinnen und Fahrlehrern.", color: "bg-[#fff2d7]" },
  { label: "Klasse BE", title: "Mehr Platz, mehr Möglichkeiten", text: "Anhänger sicher bewegen – im Alltag und im Beruf.", color: "bg-[#e9eff7]" },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f8f7f2] text-[#10232b]">
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#e8f4ee] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1d5f57]"><span className="h-2 w-2 rounded-full bg-[#e85d4a]" /> Deine Fahrschule in Berlin</p>
          <h1 className="max-w-xl text-5xl font-black leading-[.98] tracking-[-.06em] sm:text-7xl">Sicher ans Ziel.<br /><span className="text-[#e85d4a]">Mit Bz Ucar.</span></h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#557078]">Führerschein machen, Freiheit gewinnen. Wir begleiten dich persönlich, geduldig und mit einem modernen Ausbildungskonzept.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="#termin" className="inline-flex items-center gap-3 rounded-full bg-[#1d5f57] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#174e48]">Probestunde buchen <ArrowRight size={17} /></Link>
            <Link href="#fuehrerscheine" className="text-sm font-bold text-[#1d5f57] underline decoration-[#f2b84b] decoration-2 underline-offset-8">Führerscheine entdecken</Link>
          </div>
          <div className="mt-12 flex items-center gap-8 border-t border-[#dce4dd] pt-6">
            <div><strong className="block text-2xl font-black">4.9/5</strong><span className="flex items-center gap-1 text-xs text-[#6d7d80]"><Star size={12} fill="#f2b84b" className="text-[#f2b84b]" /> aus über 180 Bewertungen</span></div>
            <div><strong className="block text-2xl font-black">12+</strong><span className="text-xs text-[#6d7d80]">Jahre Erfahrung</span></div>
          </div>
        </div>
        <HeroScene />
      </section>

      <section id="fuehrerscheine" className="bg-white px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#e85d4a]">Dein Weg</p><h2 className="text-4xl font-black tracking-[-.04em] sm:text-5xl">Welcher Führerschein<br />passt zu dir?</h2></div><p className="max-w-sm text-sm leading-relaxed text-[#6a7c80]">Wir finden gemeinsam die passende Ausbildung für deine Ziele und deinen Alltag.</p></div>
          <div className="grid gap-5 md:grid-cols-3">{courses.map((course) => <article key={course.label} className={`group rounded-3xl p-7 ${course.color} transition hover:-translate-y-1`}><span className="text-xs font-black uppercase tracking-[.2em] text-[#557078]">{course.label}</span><h3 className="mt-12 text-2xl font-black">{course.title}</h3><p className="mt-3 min-h-14 text-sm leading-relaxed text-[#557078]">{course.text}</p><Link href="#termin" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#1d5f57]">Mehr erfahren <ArrowRight size={15} className="transition group-hover:translate-x-1" /></Link></article>)}</div>
        </div>
      </section>

      <section id="ueber-uns" className="bg-[#10232b] px-6 py-20 text-white lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#f2b84b]">Warum Bz Ucar?</p><h2 className="text-4xl font-black tracking-[-.04em] sm:text-5xl">Lernen, das<br /><span className="text-[#f2b84b]">zu dir passt.</span></h2><p className="mt-6 max-w-md leading-relaxed text-white/65">Wir glauben: Gute Ausbildung beginnt mit Vertrauen. Deshalb nehmen wir uns Zeit, hören zu und bringen dich Schritt für Schritt sicher ans Ziel.</p></div>
          <div className="grid gap-8 sm:grid-cols-2">{[{ icon: HeartHandshake, title: "Persönlich", text: "Fahrlehrer, die dich wirklich kennen und individuell begleiten." }, { icon: Clock3, title: "Flexibel", text: "Theorie und Praxis, die in deinen Alltag und deinen Rhythmus passen." }, { icon: ShieldCheckIcon, title: "Sicher", text: "Moderne Fahrzeuge und eine Ausbildung mit klarer Struktur." }, { icon: Users, title: "Gemeinsam", text: "Eine starke Community, die dich motiviert und unterstützt." }].map(({ icon: Icon, title, text }) => <div key={title} className="border-t border-white/15 pt-5"><Icon className="mb-5 text-[#f2b84b]" size={24} /><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p></div>)}</div>
        </div>
      </section>

      <section id="termin" className="px-6 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#e85d4a]">Dein erster Schritt</p><h2 className="text-4xl font-black tracking-[-.04em] sm:text-5xl">Lust auf<br />Führerschein?</h2><p className="mt-6 max-w-sm leading-relaxed text-[#557078]">Vereinbare jetzt deine kostenlose Probestunde. Ganz unverbindlich – wir freuen uns auf dich!</p><div className="mt-8 space-y-3 text-sm text-[#47616a]"><p className="flex items-center gap-3"><Check size={17} className="text-[#1f8a63]" /> Persönliche Beratung inklusive</p><p className="flex items-center gap-3"><Check size={17} className="text-[#1f8a63]" /> Keine versteckten Kosten</p><p className="flex items-center gap-3"><Check size={17} className="text-[#1f8a63]" /> Antwort innerhalb von 24 Stunden</p></div></div><div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-[#10232b]/5 sm:p-10"><BookingForm /></div></div></section>
    </main>
  );
}

function ShieldCheckIcon(props: { className?: string; size?: number }) {
  return <Check {...props} />;
}
