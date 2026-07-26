"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const TechSphere3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Outer Sphere Wireframe
    const sphereGeo = new THREE.SphereGeometry(1.8, 24, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x008080,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphereMesh);

    // Inner Nodes Ring
    const torusGeo = new THREE.TorusGeometry(1.2, 0.08, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x004d4d,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    group.add(torusMesh);

    // Floating Ring Nodes
    const torus2Geo = new THREE.TorusGeometry(1.5, 0.04, 12, 80);
    const torus2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const torus2Mesh = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2Mesh.rotation.y = Math.PI / 4;
    group.add(torus2Mesh);

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = x * 0.002;
      mouseY = y * 0.002;
    };

    mount.addEventListener("mousemove", onMouseMove);

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      group.rotation.y += 0.005;
      group.rotation.x += 0.002;

      group.rotation.y += (mouseX - group.rotation.y) * 0.05;
      group.rotation.x += (mouseY - group.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mount.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      torus2Geo.dispose();
      torus2Mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-80 sm:h-96 relative flex items-center justify-center overflow-hidden" />
  );
};
