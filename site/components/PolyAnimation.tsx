'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function PolyAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const FACE_LABELS = [
      'Custom Web Development',
      'IT Consulting',
      'SEO',
      'Digital Marketing',
      'Technical Staffing',
      'Support',
      'AI'
    ];

    const scene = new THREE.Scene();

    const getSize = () => {
      const r = container.getBoundingClientRect();
      return {
        w: Math.max(1, r.width),
        h: Math.max(1, r.height)
      };
    };

    let { w: initW, h: initH } = getSize();

    const camera = new THREE.PerspectiveCamera(45, initW / initH, 0.1, 1000);
    // Adjusted camera position to 4.4 for a slightly larger 3D object display
    camera.position.z = 4.4;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initW, initH, false);
    renderer.setClearColor(0x000000, 0);

    const polyGroup = new THREE.Group();
    scene.add(polyGroup);

    const themeColor = new THREE.Color(0x00d2f1);
    const brightNodeColor = new THREE.Color(0x00e7af);

    const centerLight = new THREE.PointLight(themeColor, 0.6, 6);
    centerLight.position.set(0, 0, 0);
    polyGroup.add(centerLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    function makeGlowTexture() {
      const size = 256;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);
      const g = ctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
      );
      g.addColorStop(0.0, 'rgba(0, 231, 175, 0.85)');
      g.addColorStop(0.25, 'rgba(0, 210, 241, 0.45)');
      g.addColorStop(0.6, 'rgba(0, 210, 241, 0.12)');
      g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    }

    const glowSpriteMat = new THREE.SpriteMaterial({
      map: makeGlowTexture(),
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glowSprite = new THREE.Sprite(glowSpriteMat);
    glowSprite.scale.set(2.7, 2.7, 1);
    polyGroup.add(glowSprite);

    const glowSprite2Mat = glowSpriteMat.clone();
    glowSprite2Mat.opacity = 0.35;
    const glowSprite2 = new THREE.Sprite(glowSprite2Mat);
    glowSprite2.scale.set(1.5, 1.5, 1);
    polyGroup.add(glowSprite2);

    // Adjusted icosahedron radius to 1.42 for a larger object while ensuring clean fit
    const baseGeometry = new THREE.IcosahedronGeometry(1.42, 0);

    const glassMaterial = new THREE.MeshPhongMaterial({
      color: themeColor,
      emissive: themeColor,
      emissiveIntensity: 0.04,
      transparent: true,
      opacity: 0.04,
      shininess: 40,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    polyGroup.add(new THREE.Mesh(baseGeometry, glassMaterial));

    const wireframeGeo = new THREE.WireframeGeometry(baseGeometry);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: themeColor,
      linewidth: 3,
      transparent: true,
      opacity: 1.0
    });
    polyGroup.add(new THREE.LineSegments(wireframeGeo, wireframeMat));

    const wireframeGeo2 = new THREE.WireframeGeometry(
      new THREE.IcosahedronGeometry(1.425, 0)
    );
    const wireframeMat2 = new THREE.LineBasicMaterial({
      color: themeColor,
      transparent: true,
      opacity: 0.55
    });
    polyGroup.add(new THREE.LineSegments(wireframeGeo2, wireframeMat2));

    const posAttribute = baseGeometry.attributes.position;
    const vertexMap = new Map();
    const nodeGeometry = new THREE.SphereGeometry(0.014, 12, 12);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: brightNodeColor });

    for (let i = 0; i < posAttribute.count; i++) {
      const x = Number(posAttribute.getX(i).toFixed(4));
      const y = Number(posAttribute.getY(i).toFixed(4));
      const z = Number(posAttribute.getZ(i).toFixed(4));
      const key = `${x},${y},${z}`;
      if (!vertexMap.has(key)) {
        vertexMap.set(key, true);
        const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
        nodeMesh.position.set(x, y, z);
        polyGroup.add(nodeMesh);
      }
    }

    function makeTextTexture(text: string) {
      const size = 512;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);
      ctx.clearRect(0, 0, size, size);

      ctx.font = 'bold 92px "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = 'rgba(0, 231, 175, 0.9)';
      ctx.shadowBlur = 24;

      const maxWidth = size * 0.82;
      const words = text.split(' ');
      const lines: string[] = [];
      let current = '';
      words.forEach(w => {
        const test = current ? current + ' ' + w : w;
        if (ctx.measureText(test).width > maxWidth && current) {
          lines.push(current);
          current = w;
        } else {
          current = test;
        }
      });
      if (current) lines.push(current);

      const lineHeight = 100;
      const startY = size / 2 - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, size / 2, startY + i * lineHeight);
      });

      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      return tex;
    }

    const positions = baseGeometry.attributes.position;
    const faceCount = positions.count / 3;
    const step = Math.max(1, Math.floor(faceCount / FACE_LABELS.length));

    for (let f = 0; f < faceCount; f++) {
      const labelIndex = Math.floor(f / step);
      if (labelIndex >= FACE_LABELS.length) continue;
      if (f % step !== 0) continue;

      const a = new THREE.Vector3().fromBufferAttribute(positions, f * 3 + 0);
      const b = new THREE.Vector3().fromBufferAttribute(positions, f * 3 + 1);
      const c = new THREE.Vector3().fromBufferAttribute(positions, f * 3 + 2);

      const centroid = new THREE.Vector3().add(a).add(b).add(c).multiplyScalar(1 / 3);
      const normal = new THREE.Vector3()
        .subVectors(b, a)
        .cross(new THREE.Vector3().subVectors(c, a))
        .normalize();
      if (normal.dot(centroid) < 0) normal.negate();

      const textMat = new THREE.MeshBasicMaterial({
        map: makeTextTexture(FACE_LABELS[labelIndex]),
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });

      const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), textMat);
      textMesh.position.copy(centroid).addScaledVector(normal, 0.005);
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );
      textMesh.quaternion.copy(quat);

      polyGroup.add(textMesh);
    }

    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let isDragging = false;
    let previousMousePos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) return;
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotY = mouseX * 1.6;
      targetRotX = -mouseY * 1.6;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleGlobalMouseUp = () => { isDragging = false; };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePos.x;
      const deltaY = e.clientY - previousMousePos.y;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      previousMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const touchX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const touchY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        targetRotY = touchX * 1.6;
        targetRotX = -touchY * 1.6;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    function resize() {
      const { w, h } = getSize();
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container);
    else window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    let animFrameId: number;

    function animate() {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const idleRotX = Math.sin(t * 0.4) * 0.2;
      const idleRotY = t * 0.25;

      currentRotX += (targetRotX + idleRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY + idleRotY - currentRotY) * 0.08;

      polyGroup.rotation.x = currentRotX;
      polyGroup.rotation.y = currentRotY;

      centerLight.intensity = 0.55 + Math.sin(t * 2.0) * 0.15;

      glowSpriteMat.opacity = 0.5 + Math.sin(t * 1.5) * 0.15;
      glowSprite.scale.setScalar(2.7 + Math.sin(t * 1.5) * 0.3);

      glowSprite2Mat.opacity = 0.3 + Math.sin(t * 2.5) * 0.15;
      glowSprite2.scale.setScalar(1.5 + Math.sin(t * 2.5) * 0.2);

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      renderer.dispose();
      baseGeometry.dispose();
      glassMaterial.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      wireframeGeo2.dispose();
      wireframeMat2.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="wp-3d-poly-wrapper w-full h-full min-h-[300px] relative overflow-hidden bg-transparent">
      <canvas ref={canvasRef} className="wp-3d-poly-canvas absolute inset-0 w-full h-full bg-transparent z-10" />
    </div>
  );
}
