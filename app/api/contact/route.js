import { NextResponse } from "next/server";

export async function POST(request) {
  const payload = await request.json();
  const { name, email, message, service } = payload;

  if (!name || !email || !message) {
    return NextResponse.json(
      { message: "Faltan campos obligatorios para activar la solicitud prioritaria." },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 900));

  return NextResponse.json({
    ok: true,
    message: `Solicitud recibida para ${service || "servicios estratégicos"}. WebNex responderá a ${email} con prioridad.`
  });
}
