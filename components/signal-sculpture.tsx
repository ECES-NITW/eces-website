"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function prefersReducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

export function SignalSculpture() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(0, 0, 10);
    const core = new THREE.Group(); scene.add(core);
    const outerGeometry = new THREE.IcosahedronGeometry(1.7, 1);
    const outerLines = new THREE.LineSegments(new THREE.EdgesGeometry(outerGeometry), new THREE.LineBasicMaterial({ color: 0x70cbff, transparent: true, opacity: .52 }));
    core.add(outerLines);
    const innerGeometry = new THREE.IcosahedronGeometry(1.02, 2);
    const inner = new THREE.Mesh(innerGeometry, new THREE.MeshPhongMaterial({ color: 0x064d99, emissive: 0x08245b, shininess: 110, flatShading: true, transparent: true, opacity: .88 }));
    core.add(inner);
    const innerWire = new THREE.LineSegments(new THREE.EdgesGeometry(innerGeometry), new THREE.LineBasicMaterial({ color: 0x6ad5ff, transparent: true, opacity: .42 }));
    core.add(innerWire);
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.35 + i * .24, .018, 8, 160), new THREE.MeshBasicMaterial({ color: i === 1 ? 0x84efff : 0x398dfc, transparent: true, opacity: i === 1 ? .8 : .5 }));
      ring.rotation.set(.3 + i * .78, .4 + i * .55, i * .35);
      core.add(ring); rings.push(ring);
    }
    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < 11; i++) {
      const angle = i / 11 * Math.PI * 2;
      const node = new THREE.Mesh(new THREE.SphereGeometry(i % 4 === 0 ? .075 : .045, 10, 10), new THREE.MeshBasicMaterial({ color: i % 4 === 0 ? 0xd7f8ff : 0x64bdff }));
      node.position.set(Math.cos(angle) * 2.4, Math.sin(angle) * 1.7, Math.sin(angle * 2) * .9);
      core.add(node); nodes.push(node);
    }
    const light = new THREE.PointLight(0x70cfff, 65); light.position.set(2, 3, 5); scene.add(light);
    const back = new THREE.PointLight(0x2153e9, 35); back.position.set(-4, -2, -3); scene.add(back);
    let width = 0, height = 0, raf = 0, time = 0;
    let pointerX = 0, pointerY = 0;
    const reduced = prefersReducedMotion();
    const resize = () => {
      width = mount.clientWidth; height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height; camera.updateProjectionMatrix();
    };
    const move = (event: PointerEvent) => {
      const box = mount.getBoundingClientRect();
      pointerX = ((event.clientX - box.left) / box.width - .5) * .55;
      pointerY = ((event.clientY - box.top) / box.height - .5) * .4;
    };
    const render = () => {
      time += reduced ? 0 : .007;
      core.rotation.y += ((time * .32 + pointerX) - core.rotation.y) * .035;
      core.rotation.x += ((.1 - pointerY) - core.rotation.x) * .035;
      rings[0].rotation.z = time * .3;
      rings[1].rotation.x = 1.08 + time * .22;
      rings[2].rotation.y = .65 - time * .18;
      inner.rotation.y = -time * .23;
      inner.rotation.x = time * .12;
      outerLines.rotation.y = time * .12;
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(render);
    };
    resize(); render();
    window.addEventListener("resize", resize); mount.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener("resize", resize); mount.removeEventListener("pointermove", move);
      mount.removeChild(renderer.domElement); renderer.dispose();
      scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) { object.geometry.dispose(); const material = object.material; if (Array.isArray(material)) material.forEach(item => item.dispose()); else material.dispose(); } });
      outerGeometry.dispose(); innerGeometry.dispose();
    };
  }, []);
  return <div ref={mountRef} className="signal-sculpture" role="img" aria-label="Animated three-dimensional signal sculpture with illuminated rings and a faceted core" />;
}
