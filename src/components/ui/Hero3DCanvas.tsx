"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect if dark mode is active on mount
    const isDark = document.documentElement.classList.contains("dark");

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Outer 3D Wireframe Icosahedron Geometry
    const geometry = new THREE.IcosahedronGeometry(2.3, 2);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x20b2aa : 0x004d4d,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.3 : 0.4,
    });
    const icosahedron = new THREE.Mesh(geometry, wireframeMat);
    mainGroup.add(icosahedron);

    // 2. Middle Torus Accent Ring
    const torusGeo = new THREE.TorusGeometry(3.1, 0.03, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x006666,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45,
    });
    const torusRing = new THREE.Mesh(torusGeo, torusMat);
    torusRing.rotation.x = Math.PI / 4;
    mainGroup.add(torusRing);

    // 3. Inner Core Geometry
    const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x004d4d : 0x0f172a,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.45 : 0.55,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerCore);

    // 4. Floating 3D Particle Field
    const particleCount = 180;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = (Math.random() - 0.5) * 18;
      positions[i + 2] = (Math.random() - 0.5) * 18;
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: isDark ? 0x38bdf8 : 0x004d4d,
      size: isDark ? 0.05 : 0.05,
      transparent: true,
      opacity: isDark ? 0.5 : 0.6,
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    mainGroup.add(particleSystem);

    // Mouse Interaction - Ultra Delicate Multipliers
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      // Whisper-gentle mouse response
      mouseX = (e.clientX - windowHalfX) * 0.00004;
      mouseY = (e.clientY - windowHalfY) * 0.00004;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop - Ultra-Slow Ambient Float
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera target inertia
      targetX += (mouseX - targetX) * 0.01;
      targetY += (mouseY - targetY) * 0.01;

      // Ultra-slow rotation speeds (nearly frozen, subtle ambient drift)
      mainGroup.rotation.y += 0.0002;
      mainGroup.rotation.x += 0.0001;
      torusRing.rotation.z += 0.00015;
      innerCore.rotation.y -= 0.0003;

      mainGroup.rotation.y = targetX + mainGroup.rotation.y;
      mainGroup.rotation.x = targetY + mainGroup.rotation.x;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      wireframeMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-75 dark:opacity-85 overflow-hidden"
    />
  );
};
