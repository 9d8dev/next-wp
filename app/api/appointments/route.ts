import { NextResponse } from "next/server";

const requiredFields = ["name", "email", "phone", "license", "date"] as const;

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload || requiredFields.some((field) => typeof payload[field] !== "string" || !payload[field])) {
    return NextResponse.json({ message: "Bitte fülle alle Pflichtfelder aus." }, { status: 400 });
  }

  // TODO: WordPress REST endpoint, SMTP and calendar credentials belong in server-only env vars.
  // Example boundary: POST `${WORDPRESS_URL}/wp-json/bz-ucar/v1/appointments`.
  if (!process.env.WORDPRESS_URL || !process.env.APPOINTMENT_API_TOKEN) {
    return NextResponse.json(
      { message: "Die Terminannahme ist noch nicht konfiguriert. Bitte ruf uns direkt an: 030 123 45 67." },
      { status: 503 },
    );
  }

  // TODO: Send the validated payload to WordPress, notify via SMTP and persist admin tracking ID.
  return NextResponse.json({ message: "Anfrage erfolgreich übermittelt." }, { status: 202 });
}
