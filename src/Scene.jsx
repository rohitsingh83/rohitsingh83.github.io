import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, Float, Stars, Text, MeshDistortMaterial, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { projects, skills, profile } from "./data";

export const SECTION_GAP = 14;
export const PAGES = 4;
const GOLD = "#e2c275";

/* ───────────── camera rig + section tracking ───────────── */
function CameraRig() {
  const scroll = useScroll();
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const last = useRef(-1);
  useFrame((_, dt) => {
    const z = -scroll.offset * SECTION_GAP * (PAGES - 1);
    target.set(pointer.x * 0.9, pointer.y * 0.5, z + 8);
    camera.position.lerp(target, 1 - Math.pow(0.001, dt));
    look.set(pointer.x * 0.3, pointer.y * 0.2, z - 4);
    camera.lookAt(look);
    // expose section + progress to CSS
    const sec = Math.round(scroll.offset * (PAGES - 1));
    if (sec !== last.current) { last.current = sec; document.body.dataset.section = sec; }
    document.documentElement.style.setProperty("--progress", scroll.offset.toFixed(4));
  });
  return null;
}

/* ───────────── hero: liquid gold blob + orbit ring ───────────── */
function Hero() {
  const ring = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ring.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.2;
    ring.current.rotation.z = t * 0.25;
  });
  return (
    <group position={[2.8, 0, -1]}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.5, 24]} />
          <MeshDistortMaterial color={GOLD} roughness={0.25} metalness={0.55} distort={0.22} speed={1.0} />
        </mesh>
      </Float>
      <mesh ref={ring}>
        <torusGeometry args={[2.6, 0.015, 6, 80]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/* ───────────── skills: orbiting words ───────────── */
function SkillsOrbit() {
  const group = useRef();
  useFrame((_, dt) => (group.current.rotation.y += dt * 0.1));
  return (
    <group ref={group} position={[2.6, 0, -SECTION_GAP]}>
      {skills.slice(0, 12).map((s, i) => {
        const n = Math.min(skills.length, 12);
        const phi = Math.acos(-1 + (2 * i) / n);
        const theta = Math.sqrt(n * Math.PI) * phi;
        const r = 3;
        return (
          <Text key={s} position={[r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)]}
            fontSize={0.3} color="#f4f1ea" anchorX="center" anchorY="middle" fillOpacity={0.9}>
            {s}
          </Text>
        );
      })}
      <mesh>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

/* ───────────── project card texture (generated if no image) ───────────── */
function useCardTexture(p) {
  return useMemo(() => {
    if (p.image) {
      const t = new THREE.TextureLoader().load(p.image);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    const c = document.createElement("canvas");
    c.width = 768; c.height = 960;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 768, 960);
    grad.addColorStop(0, "#141a28"); grad.addColorStop(1, "#0a0d14");
    g.fillStyle = grad; g.fillRect(0, 0, 1024, 1280);
    // glow blob
    const rg = g.createRadialGradient(570, 225, 0, 570, 225, 525);
    rg.addColorStop(0, p.color + "66"); rg.addColorStop(1, "transparent");
    g.fillStyle = rg; g.fillRect(0, 0, 768, 960);
    // grid
    g.strokeStyle = "rgba(255,255,255,0.05)"; g.lineWidth = 1.5;
    for (let i = 0; i < 768; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 960); g.stroke(); }
    for (let i = 0; i < 960; i += 64) { g.beginPath(); g.moveTo(0, i); g.lineTo(768, i); g.stroke(); }
    // index
    g.fillStyle = p.color; g.font = "600 36px Inter, sans-serif";
    g.fillText(String(p.index + 1).padStart(2, "0"), 56, 90);
    // big title
    g.fillStyle = "#f4f1ea"; g.font = "700 110px 'Space Grotesk', Inter, sans-serif";
    const words = p.title.split(" ");
    words.forEach((w, i) => g.fillText(w, 50, 750 + i * 115 - (words.length - 1) * 115));
    // tech line
    g.fillStyle = "rgba(244,241,234,0.55)"; g.font = "400 32px Inter, sans-serif";
    g.fillText(p.tech.join("  ·  "), 56, 890);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [p]);
}

/* ───────────── project card ───────────── */
function ProjectCard({ p, index, total, setActive }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const tex = useCardTexture({ ...p, index });
  const { pointer } = useThree();
  const W = 2.4, H = 3;
  const x = (index - (total - 1) / 2) * 3.1;
  const baseZ = -SECTION_GAP * 2 + (index % 2) * 0.4;

  useFrame((_, dt) => {
    const m = ref.current;
    const k = 1 - Math.pow(0.0005, dt);
    const tz = hovered ? baseZ + 1.2 : baseZ;
    const ty = hovered ? 0.3 : 0;
    m.position.z += (tz - m.position.z) * k;
    m.position.y += (ty - m.position.y) * k;
    const rx = hovered ? -pointer.y * 0.35 : 0;
    const ry = hovered ? pointer.x * 0.35 : (index - (total - 1) / 2) * -0.08;
    m.rotation.x += (rx - m.rotation.x) * k;
    m.rotation.y += (ry - m.rotation.y) * k;
  });

  return (
    <group position={[x, 0, baseZ]}>
      <Float speed={1} rotationIntensity={0} floatIntensity={0.35}>
        <group ref={ref}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); setActive(index); document.body.dataset.cursor = "view"; }}
          onPointerOut={() => { setHovered(false); setActive(null); document.body.dataset.cursor = ""; }}
          onClick={(e) => { e.stopPropagation(); window.open(p.link, "_blank"); }}>
          <RoundedBox args={[W, H, 0.06]} radius={0.08} smoothness={2}>
            <meshStandardMaterial color="#0b0e16" roughness={0.4} metalness={0.6} />
          </RoundedBox>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[W - 0.08, H - 0.08]} />
            <meshBasicMaterial map={tex} toneMapped={false} />
          </mesh>
          {/* gold edge glow on hover */}
          <mesh position={[0, 0, -0.04]} scale={hovered ? 1.03 : 1}>
            <planeGeometry args={[W, H]} />
            <meshBasicMaterial color={GOLD} transparent opacity={hovered ? 0.35 : 0} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Projects({ setActive }) {
  return projects.map((p, i) => <ProjectCard key={p.title} p={p} index={i} total={projects.length} setActive={setActive} />);
}

/* ───────────── contact: big outlined name + rings ───────────── */
function Contact() {
  const g = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    g.current.children.forEach((r, i) => {
      r.rotation.x = t * 0.2 * (i + 1) * 0.5;
      r.rotation.y = t * 0.15 * (i + 1) * 0.4;
    });
  });
  return (
    <group position={[2.8, 0, -SECTION_GAP * 3 - 1]}>
      <group ref={g}>
        {[1.4, 1.9, 2.4].map((r, i) => (
          <mesh key={r}>
            <torusGeometry args={[r, 0.012, 6, 60]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.7 - i * 0.2} />
          </mesh>
        ))}
      </group>
      <Text position={[-2.8, -3.2, 1]} fontSize={1.6} anchorX="left" color="#0a0d14" strokeWidth={0.012} strokeColor={GOLD} letterSpacing={-0.04}>
        {profile.name.split(" ")[0].toUpperCase()}
      </Text>
    </group>
  );
}

/* ───────────── dust ───────────── */
function Dust() {
  const count = 220;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = -Math.random() * SECTION_GAP * PAGES;
    }
    return arr;
  }, []);
  const ref = useRef();
  useFrame((_, dt) => (ref.current.rotation.z += dt * 0.01));
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={GOLD} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function Scene({ setActive }) {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.6} color="#fff3dc" />
      <directionalLight position={[-6, -2, 4]} intensity={0.8} color="#8aa0d8" />
      <spotLight position={[0, 6, 4]} angle={0.6} penumbra={1} intensity={40} color={GOLD} />
      <pointLight position={[-6, -3, -20]} intensity={25} color={GOLD} />
      <pointLight position={[5, 3, -30]} intensity={16} color="#6f86c9" />
      <Stars radius={60} depth={50} count={700} factor={2} fade speed={0.3} />
      <Dust />
      <Hero />
      <SkillsOrbit />
      <Projects setActive={setActive} />
      <Contact />
      <fog attach="fog" args={["#0a0d14", 10, 40]} />
    </>
  );
}
