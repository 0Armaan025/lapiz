import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  useTexture,
  Float,
  Environment,
  Text,
  Trail,
  Sparkles,
  ContactShadows
} from "@react-three/drei";

// Use slightly smaller, optimized image sizes
const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=300&q=80",
  "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=300&q=80",
  "https://images.unsplash.com/photo-1637055159652-2b8837731f00?w=300&q=80",
  "https://plus.unsplash.com/premium_photo-1671229652411-4468b946b787?w=300&q=80",
];

const KITE_URL = "https://images.unsplash.com/photo-1595839072560-bac90c191b40?w=400&q=80";

/** * OPTIMIZED CARD: Using MeshPhysicalMaterial instead of Transmission 
 */
function Card({ position, rotation, imageUrl, index }: any) {
  const texture = useTexture(imageUrl);

  // Set anisotropy once to keep text/images sharp at an angle
  useMemo(() => {
    if (texture) texture.anisotropy = 16;
  }, [texture]);

  return (
    <group position={position} rotation={rotation}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
        {/* Main Card Frame */}
        <mesh castShadow>
          <planeGeometry args={[4, 3.5]} />
          <meshPhysicalMaterial
            map={texture as any}
            roughness={0.2}
            metalness={0.1}
            clearcoat={1} // The "Premium" gloss without the lag
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Simple Label */}
        <Text
          position={[0, -2, 0.01]}
          fontSize={0.25}
          color="white"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        >
          {`COLLECTION / 0${index + 1}`}
        </Text>
      </Float>
    </group>
  );
}

/** * MINIMALIST KITE: Focused on the Trail 
 */
function Kite({ kiteRef }: { kiteRef: React.RefObject<THREE.Group> }) {
  const texture = useTexture(KITE_URL);

  return (
    <group ref={kiteRef}>
      {/* The Trail is the primary "High End" visual effect */}
      <Trail
        width={1.2}
        length={5}
        color="#ffffff"
        attenuation={(t) => t * t}
      >
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial
            map={texture}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Trail>

      {/* Minimal Cross Frame */}
      <mesh scale={[0.02, 1.5, 0.02]}>
        <boxGeometry />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh scale={[1.2, 0.02, 0.02]} position={[0, 0.2, 0]}>
        <boxGeometry />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
}

export default function OptimizedScene() {
  const kiteRef = useRef<THREE.Group>(null);
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const bgColor = "#0a0a0a"; // Deep dark for a premium "City at Night" feel

  // Reduced count to 25 for smoother performance
  const cards = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      position: [
        i % 2 === 0 ? -5 - Math.random() * 2 : 5 + Math.random() * 2,
        -1 + Math.random(),
        -i * 10
      ] as [number, number, number],
      rotation: [0, i % 2 === 0 ? 0.3 : -0.3, 0] as [number, number, number],
      imageUrl: IMAGE_URLS[i % IMAGE_URLS.length],
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const kite = kiteRef.current;
    const cam = camRef.current;
    if (!kite || !cam) return;

    // Movement Physics
    const zPos = -t * 6;
    kite.position.set(Math.sin(t) * 3, 2 + Math.cos(t * 0.5), zPos - 10);
    kite.rotation.z = Math.sin(t) * 0.2;

    // Camera: Locked Chase
    cam.position.lerp(new THREE.Vector3(0, 1, zPos + 5), 0.1);
    cam.lookAt(0, 0, zPos - 15);
  });

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 5, 40]} />

      {/* High-quality lighting with low overhead */}
      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, -10]} intensity={1} color="#4488ff" />

      <PerspectiveCamera makeDefault ref={camRef} fov={60} far={100} />

      <Kite kiteRef={kiteRef} />

      <group>
        {cards.map((card) => (
          <Card key={card.id} {...card} index={card.id} />
        ))}
      </group>

      {/* Subtle Atmosphere */}
      <Sparkles count={100} scale={20} size={2} speed={0.3} opacity={0.2} />

      {/* Shadow Floor for grounding */}
      <ContactShadows
        position={[0, -4, 0]}
        scale={100}
        blur={3}
        far={10}
        opacity={0.4}
      />

      {/* Floating "City" Grid */}
      <gridHelper args={[200, 40, "#222", "#111"]} position={[0, -4, 0]} />
    </>
  );
}
