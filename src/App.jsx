import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import Scene, { PAGES } from "./Scene";
import { profile, projects, skills } from "./data";

const SECTIONS = ["Intro", "About", "Work", "Contact"];

/* ───────── preloader ───────── */
function Loader({ done }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + Math.random() * 9);
      setN(Math.floor(v));
      if (v >= 100) { clearInterval(id); setTimeout(done, 400); }
    }, 60);
    return () => clearInterval(id);
  }, [done]);
  return (
    <div className={`loader ${n >= 100 ? "out" : ""}`}>
      <span className="loader-num">{String(n).padStart(3, "0")}</span>
      <span className="loader-bar"><i style={{ transform: `scaleX(${n / 100})` }} /></span>
    </div>
  );
}

/* ───────── custom cursor ───────── */
function Cursor() {
  const dot = useRef(), ring = useRef();
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    let x = 0, y = 0, rx = 0, ry = 0, raf;
    const move = (e) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      dot.current.style.transform = `translate(${x}px,${y}px)`;
      ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    loop();
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return (<><div className="cur-dot" ref={dot} /><div className="cur-ring" ref={ring}><span>view</span></div></>);
}

/* ───────── local time ───────── */
function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }));
    f(); const id = setInterval(f, 10000); return () => clearInterval(id);
  }, []);
  return <span className="clock">{profile.location.split(",")[0]} · {t}</span>;
}

/* ───────── split text for reveal ───────── */
const Split = ({ text, as: Tag = "h1", className = "" }) => (
  <Tag className={`split ${className}`} aria-label={text}>
    {text.split(" ").map((w, i) => (
      <span className="w" key={i}><span style={{ "--i": i }}>{w}</span></span>
    ))}
  </Tag>
);

/* ───────── html overlay ───────── */
function Overlay({ active }) {
  const p = active != null ? projects[active] : null;
  return (
    <Scroll html style={{ width: "100%" }}>
      <section className="page" data-i="0">
        <div className="content">
          <p className="eyebrow">{profile.role}</p>
          <Split text={profile.name} />
          <p className="lead">{profile.tagline}</p>
          <div className="row">
            <a className="btn" href="#" onClick={(e) => { e.preventDefault(); scrollToSection(2); }}>See work</a>
            <a className="link" href="/Rohit_Singh_AI_Engineer_Resume.pdf" target="_blank" rel="noreferrer">Resume (PDF) ↗</a>
            <a className="link" href={`mailto:${profile.email}`}>Get in touch →</a>
          </div>
        </div>
        <div className="marquee"><div>{[...skills, ...skills].map((s, i) => <span key={i}>{s}<i>✦</i></span>)}</div></div>
      </section>

      <section className="page" data-i="1">
        <div className="content">
          <p className="eyebrow">About</p>
          <Split as="h3" text="Applied AI. Algorithmic rigor. Real products." />
          <p className="lead">{profile.about}</p>
          <ul className="facts">
            <li><b>{projects.length - 1}+</b><span>projects shipped</span></li>
            <li><b>{skills.length}</b><span>tools learned</span></li>
            <li><b>2nd yr</b><span>CS student</span></li>
          </ul>
        </div>
      </section>

      <section className="page" data-i="2">
        <div className="content top">
          <p className="eyebrow">Selected work</p>
          <Split as="h3" text="Things I've built." />
          <p className="lead small">Hover a card · click to open</p>
        </div>
        <div className={`project-info ${p ? "on" : ""}`}>
          {p && (<>
            <span className="idx">{String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
            <h4>{p.title}</h4>
            <p>{p.description}</p>
            <div className="tags">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
          </>)}
        </div>
        <ol className="project-list">
          {projects.map((pr, i) => (
            <li key={pr.title} className={i === active ? "on" : ""}>
              <a href={pr.link} target="_blank" rel="noreferrer">{pr.title}</a>
            </li>
          ))}
        </ol>
      </section>

      <section className="page" data-i="3">
        <div className="content">
          <p className="eyebrow">Contact</p>
          <Split as="h3" text="Let's build something together." />
          <a className="email" href={`mailto:${profile.email}`}>{profile.email}</a>
          <nav className="socials">
            {profile.socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}
          </nav>
          <p className="hint">Designed & built by {profile.name} · © {new Date().getFullYear()}</p>
        </div>
      </section>
    </Scroll>
  );
}

function scrollToSection(i) {
  const el = [...document.querySelectorAll(".scroll-root div")].find((d) => /auto|scroll/.test(d.style.overflow));
  if (el) el.scrollTo({ top: (el.scrollHeight - el.clientHeight) * (i / (PAGES - 1)), behavior: "smooth" });
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(null);
  const [section, setSection] = useState(0);

  useEffect(() => {
    const obs = new MutationObserver(() => setSection(Number(document.body.dataset.section || 0)));
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-section"] });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {!loaded && <Loader done={() => setLoaded(true)} />}
      <Cursor />
      <header className={`nav ${loaded ? "in" : ""}`}>
        <span className="logo">{profile.name.split(" ")[0].toLowerCase()}<i>.</i></span>
        <Clock />
        <span className="avail"><i />Open to internships</span>
      </header>
      <aside className={`dots ${loaded ? "in" : ""}`}>
        {SECTIONS.map((s, i) => (
          <button key={s} className={i === section ? "on" : ""} onClick={() => scrollToSection(i)}><em>{s}</em><b /></button>
        ))}
      </aside>
      <div className="progress"><i /></div>
      <div className={`scroll-root ${loaded ? "in" : ""}`}>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.4]} gl={{ antialias: false, powerPreference: "high-performance" }}>
          <color attach="background" args={["#0a0d14"]} />
          <Suspense fallback={null}>
            <ScrollControls pages={PAGES} damping={0.3}>
              <Scene setActive={setActive} />
              <Overlay active={active} />
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
