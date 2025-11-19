"use client";

import Globe from "react-globe.gl";
import { useRef, useEffect } from "react";

export default function VelricGlobe() {
  const globeRef = useRef<any>(null);

  // ⭐ Generate stable points ONCE
  const points = useRef(
    [...Array(1500)].map(() => ({
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
      size: 0.45
    }))
  ).current;

  // ⭐ Auto-rotate (right → left)
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = -0.7;

    // Zoom limits
    globe.controls().minDistance = 300;
    globe.controls().maxDistance = 550;

    // Camera start zoom
    globe.camera().position.z = 375;
  }, []);

  // ⭐ Stripe-style arc data
  const arcsData = [
  // Top hemisphere pair 1
  { startLat: 40, startLng: -20, endLat: 10, endLng: 60 },
  
  // Top hemisphere pair 2
  { startLat: 100, startLng: 120, endLat: 5, endLng: -80 },

  // Bottom hemisphere pair 1
  { startLat: -100, startLng: -40, endLat: -5, endLng: 80 },

  // Bottom hemisphere pair 2
  { startLat: -30, startLng: 130, endLat: 20, endLng: -120 },

  // Diagonal cross-hemisphere arc
  { startLat: 25, startLng: 20, endLat: -20, endLng: -60 }
];


  return (
    <div className="w-full h-[450px] flex items-center justify-center">
      <Globe
        ref={globeRef}
        width={600}
        height={600}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"

        // ⭐ Purple glowing dots (now stable!)
        pointsData={points}
        pointAltitude={0.01}
        pointColor={() => "#a26fff"}

        // ⭐ Stripe-style arcs
        arcsData={arcsData}
        arcColor={() => ["#b075ff", "#8f40ff"]}
        arcAltitude={0.28}
        arcStroke={1.1}
        arcDashLength={0.45}
        arcDashGap={0.2}
        arcDashAnimateTime={1600}
        arcDashInitialGap={() => Math.random()}
      />
    </div>
  );
}
