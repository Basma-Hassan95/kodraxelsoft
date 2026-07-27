"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const Admin3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isDark = document.documentElement.classList.contains("dark");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Quantum Grid Floor
    const gridHelper = new THREE.GridHelper(
      30,
      30,
      isDark ? 0x20b2aa : 0x004d4d,
      isDark ? 0x112233 : 0xcbd5e1
    );
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Floating Quantum Nodes Point Cloud
    const nodeCount = 100;
    const nodesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = Math.random() * 8 - 1;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    nodesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const nodesMat = new THREE.PointsMaterial({
      color: isDark ? 0x38bdf8 : 0x004d4d,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });

    const quantumNodes = new THREE.Points(nodesGeo, nodesMat);
    scene.add(quantumNodes);

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      gridHelper.rotation.y = elapsedTime * 0.02;
      quantumNodes.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      nodesGeo.dispose();
      nodesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40 dark:opacity-30"
    />
  );
};
