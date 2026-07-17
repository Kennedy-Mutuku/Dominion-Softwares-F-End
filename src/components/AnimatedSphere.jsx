import { useEffect, useRef } from 'react';
import logo from '../assets/Dominion Sodtwares Logo.png';

const AnimatedSphere = ({ size = 300, variant = 'dark' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;

    const isLight = variant === 'light';
    const wireColor = isLight
      ? (op) => `rgba(255, 95, 0, ${op})`
      : (op) => `rgba(255, 95, 0, ${op})`;
    const nodeColor = isLight
      ? (op) => `rgba(255, 95, 0, ${op})`
      : (op) => `rgba(255, 95, 0, ${op})`;
    const glowCore = isLight ? '#ff5f00' : '#ffffff';
    const trailColor = isLight
      ? (op) => `rgba(255, 95, 0, ${op})`
      : (op) => `rgba(255, 255, 255, ${op})`;

    let rotation = 0;
    let animationId;

    const generateSpherePoints = () => {
      const points = [];
      const latLines = 14;
      const lonLines = 20;

      for (let i = 0; i <= latLines; i++) {
        const lat = (Math.PI * i) / latLines - Math.PI / 2;
        const linePoints = [];
        for (let j = 0; j <= 72; j++) {
          const lon = (2 * Math.PI * j) / 72;
          linePoints.push({ lat, lon });
        }
        points.push({ type: 'lat', points: linePoints });
      }

      for (let i = 0; i < lonLines; i++) {
        const lon = (2 * Math.PI * i) / lonLines;
        const linePoints = [];
        for (let j = 0; j <= 72; j++) {
          const lat = (Math.PI * j) / 72 - Math.PI / 2;
          linePoints.push({ lat, lon });
        }
        points.push({ type: 'lon', points: linePoints });
      }

      return points;
    };

    const project = (lat, lon, rot) => {
      const x = radius * Math.cos(lat) * Math.sin(lon + rot);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.cos(lon + rot);

      const scale = 1 + z / (radius * 3);
      return {
        x: centerX + x * scale,
        y: centerY - y * scale,
        z,
        opacity: 0.1 + 0.9 * ((z + radius) / (2 * radius))
      };
    };

    const sphereLines = generateSpherePoints();

    const generateNodes = () => {
      const nodes = [];
      for (let i = 1; i < 14; i++) {
        const lat = (Math.PI * i) / 14 - Math.PI / 2;
        for (let j = 0; j < 20; j++) {
          const lon = (2 * Math.PI * j) / 20;
          nodes.push({ lat, lon });
        }
      }
      return nodes;
    };

    const nodes = generateNodes();

    const particles = [];
    const maxParticles = 4;

    const createParticle = () => {
      const startLat = (Math.random() - 0.5) * Math.PI;
      const startLon = Math.random() * 2 * Math.PI;
      const endLat = (Math.random() - 0.5) * Math.PI;
      const endLon = startLon + (Math.random() - 0.5) * Math.PI;

      return {
        startLat, startLon, endLat, endLon,
        progress: 0,
        speed: 0.006 + Math.random() * 0.01,
        trail: []
      };
    };

    // Pre-compute text character positions for "DOMINION" and "SOFTWARES"
    const textLine1 = 'DOMINION';
    const textLine2 = 'SOFTWARES';

    const getTextChars = (text, lat, startLon, spread) => {
      const chars = [];
      const totalSpread = spread;
      const step = totalSpread / (text.length - 1 || 1);
      const offset = -totalSpread / 2;
      for (let i = 0; i < text.length; i++) {
        chars.push({
          char: text[i],
          lat,
          lon: startLon + offset + step * i,
        });
      }
      return chars;
    };

    const img = new Image();
    img.src = logo;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);
      rotation += 0.003;

      // Draw spinning logo at the center
      if (img.complete && img.width > 0) {
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Creative 3D spin effect around Y axis matching globe rotation
        // We use Math.abs to ensure it never mirrors/flips backwards, so text is always readable!
        const spinScale = Math.abs(Math.sin(rotation * 2.5)); 
        // Only draw if it's not perfectly edge-on to avoid artifacts
        if (spinScale > 0.05) {
          ctx.scale(spinScale, 1);
          
          const logoWidth = size * 0.35; // 35% of globe size
          const logoHeight = logoWidth * (img.height / img.width);
          
          // Glow effect
          ctx.shadowColor = isLight ? 'rgba(255, 95, 0, 0.4)' : 'rgba(255, 95, 0, 0.8)';
          ctx.shadowBlur = 25;
          ctx.globalAlpha = 0.9;
          
          ctx.drawImage(img, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);
        }
        ctx.restore();
      }

      // Draw wireframe lines
      sphereLines.forEach(line => {
        ctx.beginPath();
        let started = false;
        line.points.forEach(p => {
          const proj = project(p.lat, p.lon, rotation);
          const lineOpacity = isLight ? proj.opacity * 0.35 : proj.opacity * 0.25;
          ctx.strokeStyle = wireColor(lineOpacity);
          if (!started) {
            ctx.moveTo(proj.x, proj.y);
            started = true;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        });
        ctx.lineWidth = isLight ? 0.6 : 0.5;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(node => {
        const proj = project(node.lat, node.lon, rotation);
        if (proj.z > -radius * 0.2) {
          const nodeSize = isLight ? 2 * proj.opacity : 1.5 * proj.opacity;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = nodeColor(proj.opacity * (isLight ? 0.8 : 0.6));
          ctx.fill();
        }
      });

      // ---- Draw "DOMINION" text rotating around the sphere (upper band) ----
      const fontSize = Math.max(11, size * 0.032);
      ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const line1Chars = getTextChars(textLine1, 0.15, 0, Math.PI * 0.75);
      line1Chars.forEach(({ char, lat, lon }) => {
        const proj = project(lat, lon, rotation);
        if (proj.z > 0) {
          const charOpacity = proj.opacity * 0.85;
          // Subtle glow behind each letter
          ctx.fillStyle = isLight
            ? `rgba(255, 95, 0, ${charOpacity * 0.12})`
            : `rgba(255, 95, 0, ${charOpacity * 0.15})`;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, fontSize * 0.7, 0, Math.PI * 2);
          ctx.fill();
          // Letter
          ctx.fillStyle = isLight
            ? `rgba(255, 95, 0, ${charOpacity})`
            : `rgba(255, 95, 0, ${charOpacity})`;
          ctx.fillText(char, proj.x, proj.y);
        }
      });

      // ---- Draw "SOFTWARES" text (lower band) ----
      const line2Chars = getTextChars(textLine2, -0.2, Math.PI, Math.PI * 0.85);
      line2Chars.forEach(({ char, lat, lon }) => {
        const proj = project(lat, lon, rotation);
        if (proj.z > 0) {
          const charOpacity = proj.opacity * 0.75;
          ctx.fillStyle = isLight
            ? `rgba(255, 95, 0, ${charOpacity * 0.12})`
            : `rgba(255, 95, 0, ${charOpacity * 0.15})`;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, fontSize * 0.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = isLight
            ? `rgba(255, 95, 0, ${charOpacity})`
            : `rgba(255, 95, 0, ${charOpacity})`;
          ctx.fillText(char, proj.x, proj.y);
        }
      });

      // Particles
      while (particles.length < maxParticles) {
        particles.push(createParticle());
      }

      particles.forEach((particle, idx) => {
        particle.progress += particle.speed;
        if (particle.progress > 1) {
          particles[idx] = createParticle();
          return;
        }

        const t = particle.progress;
        const lat = particle.startLat + (particle.endLat - particle.startLat) * t;
        const lon = particle.startLon + (particle.endLon - particle.startLon) * t;
        const proj = project(lat, lon, rotation);

        if (proj.z > 0) {
          const gradient = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 10);
          gradient.addColorStop(0, isLight ? 'rgba(255, 95, 0, 0.9)' : 'rgba(255, 255, 255, 0.8)');
          gradient.addColorStop(0.4, 'rgba(255, 95, 0, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 95, 0, 0)');
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = glowCore;
          ctx.fill();

          particle.trail.push({ x: proj.x, y: proj.y });
          if (particle.trail.length > 18) particle.trail.shift();

          particle.trail.forEach((tp, i) => {
            const trailOpacity = (i / particle.trail.length) * 0.6;
            ctx.beginPath();
            ctx.arc(tp.x, tp.y, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = trailColor(trailOpacity);
            ctx.fill();
          });
        }
      });

      // Subtle outer glow
      if (!isLight) {
        const outerGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.3);
        outerGlow.addColorStop(0, 'rgba(255, 95, 0, 0)');
        outerGlow.addColorStop(0.5, 'rgba(255, 95, 0, 0.03)');
        outerGlow.addColorStop(1, 'rgba(255, 95, 0, 0)');
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [size, variant]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="animate-float"
    />
  );
};

export default AnimatedSphere;
