"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, Line, OrbitControls } from "@react-three/drei";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const navItems = [
  { label: "Servicios", href: "#services" },
  { label: "The Nexus Path", href: "#methodology" },
  { label: "Prioridad", href: "#contact" }
];

const serviceCards = [
  {
    title: "Desarrollo Cloud",
    description:
      "Arquitecturas resilientes, despliegues de baja latencia y plataformas listas para escalar sin fricción.",
    accent: "from-fuchsia-500/40 to-cyan-400/30",
    size: "lg:col-span-2"
  },
  {
    title: "AI Integration",
    description:
      "Agentes, automatización inteligente y capas de decisión que convierten datos en ventaja operativa real.",
    accent: "from-cyan-400/40 to-blue-500/30",
    size: ""
  },
  {
    title: "UX Disruptivo",
    description:
      "Interfaces premium diseñadas para elevar percepción de marca, conversión y retención desde el primer segundo.",
    accent: "from-violet-500/40 to-fuchsia-500/30",
    size: ""
  }
];

const pathSteps = [
  {
    id: "01",
    title: "Decode",
    text: "Traducimos visión, mercado y restricciones en una arquitectura de oportunidad concreta."
  },
  {
    id: "02",
    title: "Design",
    text: "Definimos flujos, interfaces y narrativa visual con precisión de producto premium."
  },
  {
    id: "03",
    title: "Deploy",
    text: "Construimos con velocidad, observabilidad y una base técnica preparada para crecer."
  },
  {
    id: "04",
    title: "Dominate",
    text: "Iteramos con datos y automatización para convertir el software en una ventaja acumulativa."
  }
];

function StarField() {
  const group = useRef(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const stars = useMemo(() => {
    return Array.from({ length: 140 }, () => {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );
      return {
        position,
        scale: Math.random() * 0.08 + 0.02
      };
    });
  }, []);

  const links = useMemo(() => {
    const result = [];
    for (let i = 0; i < stars.length - 1; i += 7) {
      result.push([stars[i].position.toArray(), stars[i + 1].position.toArray()]);
    }
    return result;
  }, [stars]);

  useEffect(() => {
    const handleMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setPointer({ x, y });
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.18 + state.clock.elapsedTime * 0.02,
      0.03
    );
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.12, 0.03);
  });

  return (
    <group ref={group}>
      {stars.map((star, index) => (
        <mesh key={index} position={star.position} scale={star.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#8b5cf6" : "#38bdf8"} transparent opacity={0.8} />
        </mesh>
      ))}
      {links.map((points, index) => (
        <Line key={index} points={points} color={index % 2 === 0 ? "#38bdf8" : "#8b5cf6"} transparent opacity={0.2} lineWidth={1} />
      ))}
    </group>
  );
}

function HeroObject() {
  const mesh = useRef(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.25;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.4;
  });

  return (
    <Float speed={2.6} rotationIntensity={1.4} floatIntensity={1.6}>
      <group ref={mesh}>
        <Icosahedron args={[1.4, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#b794f4"
            emissive="#2563eb"
            emissiveIntensity={0.8}
            metalness={0.65}
            roughness={0.18}
            wireframe
          />
        </Icosahedron>
        <mesh scale={1.95}>
          <torusGeometry args={[1.3, 0.03, 16, 100]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
        </mesh>
      </group>
    </Float>
  );
}

function Section({ id, eyebrow, title, children, className = "" }) {
  return (
    <motion.section
      id={id}
      className={`mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mb-10 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300/80">{eyebrow}</span>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function ContactForm() {
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo procesar la solicitud.");
      }

      setStatus({ type: "success", message: data.message });
      event.currentTarget.reset();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_30px_120px_rgba(37,99,235,0.18)] backdrop-blur-2xl sm:p-8"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_30%)]" />
      <div className="relative grid gap-5">
        <div>
          <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
            Alta prioridad
          </span>
          <h3 className="mt-4 font-display text-2xl font-semibold text-white">Solicita una conversación ejecutiva</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/68">
            Comparte contexto, objetivos y urgencia. Respondemos con enfoque estratégico, no con plantillas.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="name" required placeholder="Nombre" className="input-shell" />
          <input name="email" required type="email" placeholder="Email corporativo" className="input-shell" />
          <input name="company" placeholder="Empresa" className="input-shell" />
          <select name="service" defaultValue="AI Integration" className="input-shell">
            <option>AI Integration</option>
            <option>Desarrollo Cloud</option>
            <option>UX Disruptivo</option>
          </select>
        </div>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Cuéntanos qué sistema, producto o experiencia quieres convertir en una ventaja real."
          className="input-shell resize-none"
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-sky-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(14,165,233,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Activar contacto prioritario"}
          </button>
          <AnimatePresence mode="wait">
            {status.message ? (
              <motion.p
                key={status.message}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={status.type === "success" ? "text-sm text-cyan-200" : "text-sm text-rose-300"}
              >
                {status.message}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.form>
  );
}

export default function Page() {
  const [activeStep, setActiveStep] = useState(0);
  const { scrollY } = useScroll();
  const navWidth = useTransform(scrollY, [0, 180], ["92%", "76%"]);
  const navBg = useTransform(scrollY, [0, 180], ["rgba(255,255,255,0.1)", "rgba(5,5,5,0.72)"]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) => (current + 1) % pathSteps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(91,33,182,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_28%),linear-gradient(180deg,#050505_0%,#080814_55%,#050505_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-90">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.7} />
          <pointLight position={[3, 3, 4]} intensity={14} color="#60a5fa" />
          <pointLight position={[-3, -2, 2]} intensity={10} color="#a855f7" />
          <Suspense fallback={null}>
            <StarField />
          </Suspense>
        </Canvas>
      </div>

      <motion.header
        style={{ width: navWidth, backgroundColor: navBg }}
        className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center justify-between rounded-full border border-white/12 px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-6"
      >
        <a href="#hero" className="text-sm font-semibold tracking-[0.35em] text-white/90">
          WEBNEX
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link text-sm text-white/75">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-full border border-cyan-300/30 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/10"
        >
          Consultar
        </a>
      </motion.header>

      <section
        id="hero"
        className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/70 backdrop-blur-xl">
            Ultra-Luxury Software Studio
          </span>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            WebNex: Transformando código en ventajas competitivas exponenciales.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Diseñamos ecosistemas digitales donde cloud, inteligencia artificial y experiencia de usuario se fusionan para crear crecimiento, eficiencia y prestigio de marca.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(59,130,246,0.35)] transition hover:scale-[1.02]"
            >
              Reservar estrategia
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white/85 backdrop-blur-xl transition hover:bg-white/10"
            >
              Explorar capacidades
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              ["+140%", "aceleración operacional"],
              ["24/7", "automatización inteligente"],
              ["<90 días", "de visión a despliegue premium"]
            ].map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.12, duration: 0.6 }}
                className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-xl"
              >
                <div className="text-2xl font-semibold text-white">{value}</div>
                <div className="mt-2 text-sm text-white/60">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_100px_rgba(10,10,25,0.45)] backdrop-blur-2xl sm:h-[520px]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.2),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.2),transparent_30%)]" />
          <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[2, 3, 3]} intensity={2.6} color="#60a5fa" />
            <directionalLight position={[-2, -2, -1]} intensity={1.4} color="#c084fc" />
            <Suspense fallback={null}>
              <HeroObject />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.8} />
            </Suspense>
          </Canvas>
          <div className="absolute bottom-5 left-5 right-5 rounded-[1.6rem] border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Interactive Core</p>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Un sistema visual que expresa precisión tecnológica, control dinámico y capacidad de evolución continua.
            </p>
          </div>
        </motion.div>
      </section>

      <Section id="services" eyebrow="Servicios" title="Capacidades diseñadas para mover negocio, no solo software.">
        <div className="grid gap-5 lg:grid-cols-3">
          {serviceCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, duration: 0.7 }}
              viewport={{ once: true, amount: 0.25 }}
              className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl ${card.size}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 transition duration-500 group-hover:opacity-100`} />
              <div className="relative">
                <div className="mb-12 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                  0{index + 1}
                </div>
                <h3 className="font-display text-2xl font-semibold text-white">{card.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/68">{card.description}</p>
                <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                <p className="mt-6 text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                  Precisión técnica + percepción premium
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section id="methodology" eyebrow="The Nexus Path" title="De idea a dominio: un recorrido animado de 0 a 100.">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl">
            <div className="text-sm uppercase tracking-[0.35em] text-white/55">Progress Engine</div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400"
                animate={{ width: `${((activeStep + 1) / pathSteps.length) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <div className="mt-6 text-5xl font-semibold tracking-[-0.05em] text-white">{pathSteps[activeStep].id}</div>
            <div className="mt-3 text-xl font-medium text-cyan-100">{pathSteps[activeStep].title}</div>
            <p className="mt-4 text-sm leading-7 text-white/65">{pathSteps[activeStep].text}</p>
          </div>
          <div className="grid gap-4">
            {pathSteps.map((step, index) => {
              const active = index === activeStep;
              return (
                <motion.div
                  key={step.id}
                  animate={{ scale: active ? 1.02 : 1, opacity: active ? 1 : 0.7 }}
                  transition={{ duration: 0.45 }}
                  className={`rounded-[1.7rem] border p-5 backdrop-blur-2xl ${
                    active
                      ? "border-cyan-300/35 bg-gradient-to-r from-cyan-300/10 to-violet-500/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-sm font-semibold text-white">
                      {step.id}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/65">{step.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section id="contact" eyebrow="Conversión" title="Un punto de contacto diseñado para cerrar atención ejecutiva.">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="self-center">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
              <h3 className="font-display text-2xl font-semibold text-white">Software con impacto de consejo directivo</h3>
              <p className="mt-4 text-sm leading-7 text-white/68">
                Entramos donde el software necesita elevar margen, percepción o velocidad. Cada engagement parte de una hipótesis de negocio y termina con sistemas que operan a favor de la marca.
              </p>
              <div className="mt-8 space-y-4 text-sm text-white/70">
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">Diagnóstico estratégico en menos de 48 horas.</div>
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">Roadmap priorizado por retorno, complejidad y velocidad de ejecución.</div>
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">Arquitectura y experiencia listas para competir en mercados exigentes.</div>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </Section>
    </main>
  );
}
