import { NextResponse } from "next/server";

export async function POST(request) {
  const payload = await request.json();
  const { name, business, hasWebsite, goal, contact } = payload;

  if (!name || !business || !goal || !contact) {
    return NextResponse.json(
      { message: "Completa los campos principales para activar tu consulta gratuita." },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 900));

  return NextResponse.json({
    ok: true,
    message: `Recibimos tu solicitud para ${business}. Te escribiremos a ${contact} en menos de 24 horas para hablar sobre ${goal.toLowerCase()}. ${hasWebsite ? `Estado actual: ${hasWebsite}.` : ""}`.trim()
  });
}
