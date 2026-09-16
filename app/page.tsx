import Link from "next/link";
import { ArrowDownRight, ArrowRight, Check, MessageCircle } from "lucide-react";
import { BookingForm } from "@/components/home/booking-form";
import { HeroScene } from "@/components/home/hero-scene";

const courses = [
  { number: "01", title: "Klasse B", description: "Dein Weg zum Pkw-F&uuml;hrerschein. Klar strukturiert, flexibel geplant und mit modernen Ausbildungsfahrzeugen.", tone: "lime" },
  { number: "02", title: "Klasse A", description: "Mehr Freiheit auf zwei R&auml;dern. Sicher trainieren, selbstbewusst starten und jede Kurve genie&szlig;en.", tone: "coral" },
  { number: "03", title: "Klasse BE", description: "Mehr M&ouml;glichkeiten im Alltag und Beruf. Anh&auml;nger fahren lernen, ohne Stress und mit System.", tone: "blue" },
];

const benefits = [
  { title: "Pers&ouml;nliche Begleitung", text: "Wir kennen deinen Namen, deinen Fortschritt und dein Ziel." },
  { title: "Dein Rhythmus", text: "Theorie und Fahrstunden passen in deinen Alltag." },
  { title: "Sicher lernen", text: "Ruhige Erkl&auml;rungen, moderne Fahrzeuge und klare Schritte." },
];

export default function Home() {
  return (
    <main className="modern-site overflow-hidden bg-[#fafafa] text-[#09090b]">
      <section className="relative bg-[#09090b] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(239,35,60,.13),transparent_28%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,.08),transparent_25%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-8 lg:pb-28 lg:pt-12">
          <div className="mb-16 flex items-center justify-between border-b border-white/10 pb-5">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ef233c] text-sm font-black text-white">BZ</span>
              <span className="text-sm font-extrabold tracking-[.08em]">UCAR<span className="text-[#ef233c]">.</span></span>
            </Link>
            <div className="hidden items-center gap-8 text-xs font-bold text-white/65 md:flex">
              <Link href="#fuehrerscheine" className="transition hover:text-[#ef233c]">F&uuml;hrerscheine</Link>
              <Link href="#vorteile" className="transition hover:text-[#ef233c]">Informationen</Link>
              <Link href="#termin" className="transition hover:text-[#ef233c]">Kontakt</Link>
            </div>
            <Link href="#termin" className="rounded-full border border-[#ef233c]/50 px-4 py-2 text-xs font-bold text-[#ef233c] transition hover:bg-[#ef233c] hover:text-white">Anfrage senden</Link>
          </div>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div className="max-w-xl">
              <p className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.28em] text-[#ef233c]"><span className="h-2 w-2 rounded-full bg-[#d90429]" /> Fahrschule in Berlin</p>
              <h1 className="text-6xl font-black leading-[.9] tracking-[-.08em] sm:text-8xl">Fahr los.<br /><span className="text-[#ef233c]">Wachs &uuml;ber dich hinaus.</span></h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-white/65">Dein F&uuml;hrerschein ist mehr als ein St&uuml;ck Papier. Er ist der Moment, in dem du selbst entscheidest, wohin es geht.</p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link href="#termin" className="group inline-flex items-center gap-3 rounded-full bg-[#d90429] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#ef233c]">Probestunde buchen <ArrowRight size={17} className="transition group-hover:translate-x-1" /></Link>
                <span className="text-xs font-medium text-white/50">4.9 aus 180+ Bewertungen</span>
              </div>
            </div>
            <div className="relative">
              <HeroScene />
              <div className="absolute -bottom-5 -left-3 hidden rounded-2xl bg-[#ef233c] px-4 py-3 text-white shadow-xl sm:block"><span className="block text-[10px] font-black uppercase tracking-[.16em]">N&auml;chster Schritt</span><span className="mt-1 flex items-center gap-2 text-sm font-bold">Kontakt <ArrowDownRight size={15} /></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e4e4e7] bg-[#ef233c] px-6 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs font-black uppercase tracking-[.14em] text-white">
          <span>12+ Jahre Erfahrung</span><span className="hidden h-1 w-1 rounded-full bg-white sm:block" /><span>Flexible Fahrstunden</span><span className="hidden h-1 w-1 rounded-full bg-white sm:block" /><span>Moderne Fahrzeuge</span><span className="hidden h-1 w-1 rounded-full bg-white sm:block" /><span>Berlin &amp; Umgebung</span>
        </div>
      </section>

      <section id="fuehrerscheine" className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_.65fr] lg:items-end"><div><p className="mb-4 text-[10px] font-black uppercase tracking-[.28em] text-[#d90429]">Dein Weg</p><h2 className="max-w-2xl text-5xl font-black leading-[.95] tracking-[-.07em] sm:text-7xl">Welcher F&uuml;hrerschein<br />passt zu dir?</h2></div><p className="max-w-sm text-sm leading-relaxed text-[#52525b]">Wir finden gemeinsam die passende Ausbildung f&uuml;r deine Ziele und deinen Alltag.</p></div>
          <div className="grid gap-4 md:grid-cols-3">{courses.map((course) => <article key={course.number} className={`course-card course-card-${course.tone} group relative overflow-hidden rounded-[1.75rem] p-7 sm:p-9`}><div className="flex items-start justify-between"><span className="text-sm font-black opacity-50">{course.number}</span><ArrowRight size={20} className="transition group-hover:translate-x-1" /></div><div className="mt-24"><h3 className="text-3xl font-black tracking-[-.05em]">{course.title}</h3><p className="mt-4 max-w-xs text-sm leading-relaxed opacity-75">{course.description}</p><Link href="#termin" className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.12em] underline decoration-2 underline-offset-4">Kontakt</Link></div></article>)}</div>
        </div>
      </section>

      <section id="vorteile" className="bg-[#111113] px-6 py-24 text-white lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          <div><p className="mb-4 text-[10px] font-black uppercase tracking-[.28em] text-[#ef233c]">Warum Bz Ucar?</p><h2 className="text-5xl font-black leading-[.95] tracking-[-.07em] sm:text-7xl">Nicht nur<br /><span className="text-[#d90429]">bestehen.</span><br />Verstehen.</h2><p className="mt-7 max-w-sm text-sm leading-relaxed text-white/60">Eine gute Fahrschule bringt dir nicht nur bei, wie du die Pr&uuml;fung bestehst. Sie gibt dir Sicherheit f&uuml;r alle Wege danach.</p></div>
          <div className="grid gap-0">{benefits.map(({ title, text }, index) => <div key={title} className="grid grid-cols-[3rem_1fr] gap-5 border-t border-white/15 py-7"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#ef233c] text-sm font-black">0{index + 1}</span><div><h3 className="text-xl font-bold">{title}</h3><p className="mt-2 max-w-md text-sm leading-relaxed text-white/55">{text}</p></div></div>)}</div>
        </div>
      </section>

      <section id="termin" className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          <div><p className="mb-4 text-[10px] font-black uppercase tracking-[.28em] text-[#d90429]">Dein erster Schritt</p><h2 className="text-5xl font-black leading-[.95] tracking-[-.07em] sm:text-7xl">Lust auf<br /><span className="text-[#d90429]">F&uuml;hrerschein?</span></h2><p className="mt-7 max-w-sm text-sm leading-relaxed text-[#52525b]">Vereinbare jetzt deine kostenlose Probestunde. Ganz unverbindlich - wir freuen uns auf dich!</p><div className="mt-8 space-y-3 text-sm text-[#3f3f46]"><p className="flex items-center gap-3"><Check size={16} className="text-[#d90429]" /> Pers&ouml;nliche Beratung inklusive</p><p className="flex items-center gap-3"><Check size={16} className="text-[#d90429]" /> Antwort innerhalb von 24 Stunden</p><p className="flex items-center gap-3"><Check size={16} className="text-[#d90429]" /> Keine versteckten Kosten</p></div></div>
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_80px_rgba(16,35,43,.08)] sm:p-10"><BookingForm /></div>
        </div>
      </section>

      <section className="bg-[#d90429] px-6 py-16 text-white lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[.24em] text-white/70">Du hast noch Fragen?</p><h2 className="mt-3 text-3xl font-black tracking-[-.05em] sm:text-4xl">Schreib uns. Wir sind da.</h2></div><Link href="#termin" className="inline-flex items-center gap-3 self-start rounded-full bg-[#09090b] px-6 py-4 text-sm font-bold transition hover:bg-[#27272a]">Kontakt aufnehmen <MessageCircle size={17} /></Link></div></section>
    </main>
  );
}
