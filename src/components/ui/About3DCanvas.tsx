"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";

export interface About3DCanvasRef {
  updateScrollProgress: (progress: number) => void;
}

// Procedurally generate soft, light-toned Cyber Earth Texture
function createCyberEarthTexture(isDark: boolean): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Soft Base
  if (isDark) {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#081020");
    grad.addColorStop(0.5, "#0e1b30");
    grad.addColorStop(1, "#050b18");
    ctx.fillStyle = grad;
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#e2e8f0");
    grad.addColorStop(0.5, "#cbd5e1");
    grad.addColorStop(1, "#f1f5f9");
    ctx.fillStyle = grad;
  }
  ctx.fillRect(0, 0, 1024, 512);

  // Grid Lines
  ctx.strokeStyle = isDark ? "rgba(32, 178, 170, 0.15)" : "rgba(0, 77, 77, 0.12)";
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y < 512; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Continent Landmasses
  ctx.fillStyle = isDark ? "rgba(0, 77, 77, 0.5)" : "rgba(0, 128, 128, 0.35)";
  ctx.strokeStyle = isDark ? "rgba(32, 178, 170, 0.6)" : "rgba(0, 77, 77, 0.5)";
  ctx.lineWidth = 1.5;

  const drawLand = (coords: [number, number][]) => {
    ctx.beginPath();
    coords.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // North America
  drawLand([[150, 80], [280, 70], [340, 160], [260, 260], [200, 240], [140, 160]]);
  // South America
  drawLand([[260, 270], [330, 280], [380, 360], [320, 470], [280, 440], [250, 340]]);
  // Europe
  drawLand([[460, 80], [560, 70], [600, 140], [540, 180], [470, 160]]);
  // Africa
  drawLand([[460, 190], [590, 180], [620, 300], [560, 430], [490, 410], [440, 270]]);
  // Asia
  drawLand([[580, 60], [860, 70], [920, 200], [780, 280], [640, 220], [600, 140]]);
  // Australia
  drawLand([[780, 340], [880, 330], [900, 420], [800, 440]]);

  // Soft City Light Nodes
  const cityCount = 200;
  for (let i = 0; i < cityCount; i++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 512;
    const radius = Math.random() * 2 + 1;
    const isGold = Math.random() > 0.4;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = isDark
      ? (isGold ? "rgba(255, 180, 50, 0.7)" : "rgba(32, 178, 170, 0.75)")
      : (isGold ? "rgba(234, 88, 12, 0.55)" : "rgba(0, 77, 77, 0.6)");
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const About3DCanvas = forwardRef<About3DCanvasRef>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  useImperativeHandle(ref, () => ({
    updateScrollProgress: (progress: number) => {
      scrollProgressRef.current = Math.max(0, Math.min(1, progress));
    }
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isDark = document.documentElement.classList.contains("dark");

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Root Group for Scroll-Linked Docking Transform
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Cyber World Globe Group
    const globeGroup = new THREE.Group();
    rootGroup.add(globeGroup);

    // 1. Soft Translucent 3D Earth Sphere
    const earthGeo = new THREE.SphereGeometry(2.3, 64, 64);
    const earthTex = createCyberEarthTexture(isDark);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.5,
      metalness: 0.1,
      transparent: true,
      opacity: isDark ? 0.55 : 0.35,
      emissive: isDark ? 0x002222 : 0x003333,
      emissiveIntensity: isDark ? 0.3 : 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Lighting for Soft Shading
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.0 : 1.3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x20b2aa, 1.8);
    dirLight1.position.set(5, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffaa00, 1.2);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    // 2. Soft Glowing Atmospheric Halo Envelope
    const atmosGeo = new THREE.SphereGeometry(2.4, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x20b2aa : 0x006666,
      transparent: true,
      opacity: isDark ? 0.18 : 0.12,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // 3. Soft Outer Orbital Neural Network Constellation
    const nodeCount = 120;
    const nodePositions: THREE.Vector3[] = [];
    const positionsArray = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const r = 2.44 + Math.random() * 0.12;

      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      const v = new THREE.Vector3(x, y, z);
      nodePositions.push(v);

      positionsArray[i * 3] = x;
      positionsArray[i * 3 + 1] = y;
      positionsArray[i * 3 + 2] = z;
    }

    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));

    const nodesMat = new THREE.PointsMaterial({
      color: isDark ? 0x38bdf8 : 0x004d4d,
      size: 0.05,
      transparent: true,
      opacity: isDark ? 0.7 : 0.45,
    });

    const networkNodes = new THREE.Points(nodesGeo, nodesMat);
    globeGroup.add(networkNodes);

    // Soft Connecting Synapse Web Lines
    const linePositions: number[] = [];
    const maxDistance = 1.2;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDistance) {
          linePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));

    const linesMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x20b2aa : 0x004d4d,
      transparent: true,
      opacity: isDark ? 0.25 : 0.18,
    });

    const networkLines = new THREE.LineSegments(linesGeo, linesMat);
    globeGroup.add(networkLines);

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Lerp helper
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    // Current interpolation state
    let curX = 0;
    let curY = 0;
    let curScale = 1;
    let curRotY = 0;

    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const p = scrollProgressRef.current; // 0 (Hero) -> 1 (Docked Section 2)
      const isMobile = window.innerWidth < 1024;

      // Target position for Section 1 (Hero centered) vs Section 2 (Docked left)
      const targetX = isMobile ? lerp(0, 0, p) : lerp(0, -3.1, p);
      const targetY = isMobile ? lerp(0, 1.6, p) : lerp(0, 0, p);
      const targetScale = isMobile ? lerp(1.0, 0.5, p) : lerp(1.0, 0.75, p);
      const targetRotY = lerp(0, Math.PI * 2, p);

      // Smooth Lerp
      curX = lerp(curX, targetX, 0.08);
      curY = lerp(curY, targetY, 0.08);
      curScale = lerp(curScale, targetScale, 0.08);
      curRotY = lerp(curRotY, targetRotY, 0.08);

      // Apply root docking transforms
      rootGroup.position.x = curX;
      rootGroup.position.y = curY;
      rootGroup.scale.set(curScale, curScale, curScale);

      // Idle Rotation of Cyber World Globe
      earthMesh.rotation.y += 0.003;
      networkNodes.rotation.y += 0.0035;
      networkLines.rotation.y += 0.0035;
      atmosMesh.rotation.y += 0.002;

      rootGroup.rotation.y = curRotY;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      earthGeo.dispose();
      earthMat.dispose();
      earthTex.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      nodesGeo.dispose();
      nodesMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
});

About3DCanvas.displayName = "About3DCanvas";
