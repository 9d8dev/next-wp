"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "sending" | "success" | "error";

const initialForm = { name: "", email: "", phone: "", license: "B", date: "", message: "" };

export function BookingForm() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Bitte prüfe deine Angaben.");
      setState("success");
      setForm(initialForm);
    } catch (submissionError) {
      setState("error");
      setError(submissionError instanceof Error ? submissionError.message : "Die Anfrage konnte nicht gesendet werden.");
    }
  }

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  if (state === "success") {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl bg-[#e8f4ee] p-8 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f8a63] text-2xl text-white">✓</span>
        <h3 className="text-2xl font-bold text-[#10232b]">Danke für deine Anfrage!</h3>
        <p className="mt-3 max-w-sm text-[#47616a]">Wir melden uns schnellstmöglich persönlich bei dir, um deinen Termin zu bestätigen.</p>
        <button className="mt-6 text-sm font-bold text-[#1f6b58] underline underline-offset-4" onClick={() => setState("idle")}>Weitere Anfrage senden</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#29444d]">Vor- und Nachname *
          <input required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="z. B. Elif Yılmaz" className="form-field" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#29444d]">E-Mail-Adresse *
          <input required type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="du@beispiel.de" className="form-field" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#29444d]">Telefonnummer *
          <input required type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+49 170 1234567" className="form-field" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#29444d]">Führerscheinklasse
          <select value={form.license} onChange={(event) => updateField("license", event.target.value)} className="form-field">
            <option value="B">Klasse B (Pkw)</option><option value="A">Klasse A (Motorrad)</option><option value="BE">Klasse BE (Anhänger)</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-[#29444d]">Wunschtermin für die Probestunde *
        <input required type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} min={new Date().toISOString().split("T")[0]} className="form-field" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[#29444d]">Nachricht (optional)
        <textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} placeholder="Was möchtest du uns noch mitteilen?" rows={3} className="form-field resize-none" />
      </label>
      {state === "error" && <p role="alert" className="rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#a53b2d]">{error}</p>}
      <button disabled={state === "sending"} className="mt-2 rounded-full bg-[#1d5f57] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#174e48] disabled:cursor-wait disabled:opacity-60" type="submit">
        {state === "sending" ? "Wird gesendet …" : "Probestunde anfragen"}
      </button>
      <p className="text-xs leading-relaxed text-[#6a7c80]">Mit dem Absenden stimmst du der Verarbeitung deiner Daten zur Terminvereinbarung zu. Es erfolgt noch keine verbindliche Buchung.</p>
    </form>
  );
}
