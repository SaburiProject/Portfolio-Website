

import React, { useState, useEffect, useRef, CSSProperties, ReactNode, memo, useCallback } from 'react';
// FIX: The 'motion' component factory is exported from 'framer-motion', not 'motion'. This change corrects the import to provide both `motion` and `animate`.
import { animate, motion } from 'framer-motion';
// FIX: Import global type definitions to make custom JSX elements available and fix JSX-related type errors.
import './types';
// React Icons for tech stack logos
import { FaPython, FaNode, FaTools } from 'react-icons/fa';
import { SiLangchain, SiHuggingface, SiFastapi, SiOpenai } from 'react-icons/si';
import Contact from './components/Contact';


// --- UTILITY FUNCTIONS ---
function cn(...inputs: (string | undefined | null | false | 0 | { [key: string]: any })[]): string {
  return inputs
    .flat()
    .filter((x) => x !== null && x !== undefined && typeof x !== 'boolean')
    .map((x) => {
      if (typeof x === 'object') {
        return Object.keys(x)
          .filter((key) => x[key])
          .join(' ');
      }
      return x;
    })
    .join(' ');
}


// --- STYLES ---
const GlobalStyles = () => (
  <style>{`
    :root {
        --dark-bg: #05060f;
        --glow-accent: #D8ECF8;
        --glow-color-1: rgba(216, 236, 248, 0.5);
        --glow-color-2: rgba(56, 189, 248, 0.3);
    }
    html { scroll-behavior: smooth; }
    body {
        font-family: 'Inter', sans-serif;
        color: var(--glow-accent);
        overflow-x: hidden;
    }
    .header {
        position: sticky; top: 0; z-index: 50;
        transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
    }
    .header-scrolled {
        background-color: rgba(5, 6, 15, 0.5);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
    .nav-indicator {
        position: absolute; left: 0; bottom: -10px; height: 4px;
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        background: radial-gradient(circle at center, var(--glow-accent) 0%, transparent 80%);
        border-radius: 9999px;
        box-shadow: 0 0 15px 2px var(--glow-accent);
    }
    #hero { min-height: 100vh; display: flex; align-items: center; }
    .glowing-button {
        background: linear-gradient(45deg, var(--glow-color-1), var(--glow-color-2));
        box-shadow: 0 0 20px 0px var(--glow-color-2);
        transition: all 0.3s ease;
    }
    .glowing-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 30px 5px var(--glow-color-2);
    }
    .glowing-button-secondary {
        background-color: transparent; border: 1px solid var(--glow-accent);
        box-shadow: 0 0 15px 0px rgba(216, 236, 248, 0.2);
        transition: all 0.3s ease;
    }
    .glowing-button-secondary:hover {
         background-color: rgba(216, 236, 248, 0.1);
         box-shadow: 0 0 20px 2px rgba(216, 236, 248, 0.3);
    }
    .animate-on-scroll { opacity: 0; transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
    .fade-in { transform: translateY(30px); }
    .slide-in-left { transform: translateX(-50px); }
    .slide-in-right { transform: translateX(-50px); }
    .is-visible { opacity: 1; transform: translate(0, 0); }
    .glass-card {
        background: rgba(216, 236, 248, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(216, 236, 248, 0.1);
    }
    .aceternity-timeline { position: relative; max-width: 48rem; margin: 0 auto; padding-left: 1.5rem; }
    .aceternity-timeline::before, .aceternity-timeline::after {
        content: ''; position: absolute; left: 0px; top: 10px; width: 2px;
    }
    .aceternity-timeline::before {
        background-color: rgba(216, 236, 248, 0.1); height: calc(100% - 20px);
    }
    .aceternity-timeline::after {
        background: linear-gradient(to bottom, var(--glow-color-2) 0%, var(--glow-color-1) 50%, var(--glow-color-2) 100%);
        box-shadow: 0 0 8px 0px var(--glow-color-2);
        height: var(--timeline-progress, 0%); max-height: calc(100% - 20px);
        transition: height 0.1s linear;
    }
    .timeline-item { position: relative; padding-left: 2rem; padding-bottom: 3rem; }
    .timeline-item:last-child { padding-bottom: 0; }
    .timeline-item::before {
        content: ''; position: absolute; left: -8px; top: 8px;
        width: 18px; height: 18px; background-color: var(--dark-bg);
        border: 3px solid var(--glow-color-2); border-radius: 50%;
        z-index: 1; box-shadow: 0 0 15px 3px var(--glow-color-2);
    }
    @property --gradient-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
    @property --gradient-angle-offset { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
    @property --gradient-percent { syntax: "<percentage>"; initial-value: 5%; inherits: false; }
    @property --gradient-shine { syntax: "<color>"; initial-value: white; inherits: false; }
    .shiny-cta {
        --shiny-cta-bg: #05060f; --shiny-cta-bg-subtle: #1a1818; --shiny-cta-fg: #ffffff;
        --shiny-cta-highlight: #3b82f6; --shiny-cta-highlight-subtle: #8484ff;
        --animation: gradient-angle linear infinite; --duration: 3s; --shadow-size: 2px;
        --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);
        isolation: isolate; position: relative; overflow: hidden; cursor: pointer;
        outline-offset: 4px; padding: 0.75rem 1.5rem; font-family: "Inter", sans-serif;
        font-size: 1rem; line-height: 1.2; font-weight: 500; border: 1px solid transparent;
        border-radius: 360px; color: var(--shiny-cta-fg);
        background: linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
          conic-gradient(
            from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
            transparent, var(--shiny-cta-highlight) var(--gradient-percent),
            var(--shiny-cta-shine) calc(var(--gradient-percent) * 2),
            var(--shiny-cta-highlight) calc(var(--gradient-percent) * 3),
            transparent calc(var(--gradient-percent) * 4)
          ) border-box;
        box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle);
        transition: var(--transition); transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine;
        text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;
    }
    .shiny-cta::before, .shiny-cta::after, .shiny-cta span::before {
      content: ""; pointer-events: none; position: absolute; inset-inline-start: 50%;
      inset-block-start: 50%; translate: -50% -50%; z-index: -1;
    }
    .shiny-cta:active { translate: 0 1px; }
    .shiny-cta::before {
      --size: calc(100% - var(--shadow-size) * 3); --position: 2px; --space: calc(var(--position) * 2);
      width: var(--size); height: var(--size);
      background: radial-gradient( circle at var(--position) var(--position), white calc(var(--position) / 4), transparent 0) padding-box;
      background-size: var(--space) var(--space); background-repeat: space;
      mask-image: conic-gradient(from calc(var(--gradient-angle) + 45deg), black, transparent 10% 90%, black);
      border-radius: inherit; opacity: 0.4; z-index: -1;
    }
    .shiny-cta::after {
      --animation: shimmer linear infinite; width: 100%; aspect-ratio: 1;
      background: linear-gradient(-50deg, transparent, var(--shiny-cta-highlight), transparent);
      mask-image: radial-gradient(circle at bottom, transparent 40%, black); opacity: 0.6;
    }
    .shiny-cta span { z-index: 1; }
    .shiny-cta span::before {
      --size: calc(100% + 1rem); width: var(--size); height: var(--size);
      box-shadow: inset 0 -1ex 2rem 4px var(--shiny-cta-highlight); opacity: 0;
      transition: opacity var(--transition); animation: calc(var(--duration) * 1.5) breathe linear infinite;
    }
    .shiny-cta, .shiny-cta::before, .shiny-cta::after {
      animation: var(--animation) var(--duration), var(--animation) calc(var(--duration) / 0.4) reverse paused;
      animation-composition: add;
    }
    .shiny-cta:is(:hover, :focus-visible) {
      --gradient-percent: 20%; --gradient-angle-offset: 95deg; --gradient-shine: var(--shiny-cta-highlight-subtle);
    }
    .shiny-cta:is(:hover, :focus-visible), .shiny-cta:is(:hover, :focus-visible)::before, .shiny-cta:is(:hover, :focus-visible)::after {
      animation-play-state: running;
    }
    .shiny-cta:is(:hover, :focus-visible) span::before { opacity: 1; }
    @keyframes gradient-angle { to { --gradient-angle: 360deg; } }
    @keyframes shimmer { to { rotate: 360deg; } }
    @keyframes breathe { from, to { scale: 1; } 50% { scale: 1.2; } }
    .perspective-distant { perspective: 800px; }
    .transform-3d { transform-style: preserve-3d; }
    @property --shine-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
    @keyframes shine { to { --shine-angle: 360deg; } }
    #comet-card-motion {
        --shine-angle: 0deg; --shine-color-1: #A07CFE; --shine-color-2: #FE8FB5; --shine-color-3: #FFBE7B;
        border: 2px solid transparent;
        background: linear-gradient(#1F2121, #1F2121) padding-box,
          conic-gradient(from var(--shine-angle), transparent 25%, var(--shine-color-1), var(--shine-color-2), var(--shine-color-3), transparent 75%) border-box;
        animation: shine 5s linear infinite;
    }
    @keyframes star-btn { 100% { offset-distance: 100%; } }
    .animate-star-btn { animation: star-btn var(--duration, 3s) linear infinite; }
  `}</style>
);


// --- BEAMS BACKGROUND ---

interface Beam {
  x: number; y: number; width: number; length: number; angle: number;
  speed: number; opacity: number; hue: number; pulse: number; pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle: angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

function BeamsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const MINIMUM_BEAMS = 20;

  const intensity = "strong";
  const opacityMap = { subtle: 0.7, medium: 0.85, strong: 1 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      const totalBeams = MINIMUM_BEAMS * 1.5;
      beamsRef.current = Array.from({ length: totalBeams }, () => createBeam(canvas.width, canvas.height));
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam;
      const column = index % 3;
      const spacing = canvas.width / 3;
      beam.y = canvas.height + 100;
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = 190 + (index * 70) / totalBeams;
      beam.opacity = 0.2 + Math.random() * 0.1;
      return beam;
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);
      const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity];
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
      gradient.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`);
      gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`);
      gradient.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }

    function animateBeams() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(35px)";
      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }
        drawBeam(ctx, beam);
      });
      animationFrameRef.current = requestAnimationFrame(animateBeams);
    }

    animateBeams();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [intensity]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-neutral-950">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ filter: "blur(15px)" }} />
      <motion.div
        className="absolute inset-0 bg-neutral-950/5"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        style={{ backdropFilter: "blur(50px)" }}
      />
    </div>
  );
}

// --- ORBITING SKILLS ---
// Type Definitions
type IconType = 'python' | 'langchain' | 'openai' | 'pinecone' | 'fastapi' | 'huggingface' | 'n8n';
type GlowColor = 'cyan' | 'purple';
interface SkillIconProps { type: IconType; }
interface SkillConfig {
  id: string; orbitRadius: number; size: number; speed: number;
  iconType: IconType; phaseShift: number; glowColor: GlowColor; label: string;
}
interface OrbitingSkillProps { config: SkillConfig; angle: number; }
interface GlowingOrbitPathProps { radius: number; glowColor?: GlowColor; animationDelay?: number; }

// SVG Icon Components
const iconComponents: Record<IconType, { component: () => React.JSX.Element; color: string }> = {
  python: {
    component: () => <FaPython className="w-full h-full" style={{ color: '#3776AB' }} />,
    color: '#3776AB'
  },
  langchain: {
    component: () => <SiLangchain className="w-full h-full" style={{ color: '#8A55E1' }} />,
    color: '#8A55E1'
  },
  openai: {
    component: () => <SiOpenai className="w-full h-full" style={{ color: '#FFD21E' }} />,
    color: '#FFD21E'
  },
  pinecone: {
    component: () => <FaTools className="w-full h-full" style={{ color: '#00BFA5' }} />,
    color: '#00BFA5'
  },
  fastapi: {
    component: () => <SiFastapi className="w-full h-full" style={{ color: '#089083' }} />,
    color: '#089083'
  },
  huggingface: {
    component: () => <SiHuggingface className="w-full h-full" style={{ color: '#FFD21E' }} />,
    color: '#FFD21E'
  },
  n8n: {
    component: () => <FaNode className="w-full h-full" style={{ color: '#8A55E1' }} />,
    color: '#8A55E1'
  },
};

// Memoized Icon Component
const SkillIcon = memo(({ type }: SkillIconProps) => {
  const IconComponent = iconComponents[type]?.component;
  return IconComponent ? <IconComponent /> : null;
});
SkillIcon.displayName = 'SkillIcon';

// Configuration for the Orbiting Skills
const skillsConfig: SkillConfig[] = [
  // Inner Orbit
  { id: 'python', orbitRadius: 100, size: 45, speed: 1, iconType: 'python', phaseShift: 0, glowColor: 'cyan', label: 'Python' },
  { id: 'langchain', orbitRadius: 100, size: 40, speed: 1, iconType: 'langchain', phaseShift: (2 * Math.PI) / 3, glowColor: 'cyan', label: 'LangChain' },
  { id: 'fastapi', orbitRadius: 100, size: 40, speed: 1, iconType: 'fastapi', phaseShift: (4 * Math.PI) / 3, glowColor: 'cyan', label: 'FastAPI' },
  // Outer Orbit
  { id: 'openai', orbitRadius: 180, size: 50, speed: -0.6, iconType: 'openai', phaseShift: 0, glowColor: 'purple', label: 'OpenAI' },
  { id: 'pinecone', orbitRadius: 180, size: 45, speed: -0.6, iconType: 'pinecone', phaseShift: Math.PI / 2, glowColor: 'purple', label: 'Pinecone' },
  { id: 'huggingface', orbitRadius: 180, size: 40, speed: -0.6, iconType: 'huggingface', phaseShift: Math.PI, glowColor: 'purple', label: 'Hugging Face' },
  { id: 'n8n', orbitRadius: 180, size: 40, speed: -0.6, iconType: 'n8n', phaseShift: (3 * Math.PI) / 2, glowColor: 'purple', label: 'n8n' },
];

// Memoized Orbiting Skill Component
const OrbitingSkill = memo(({ config, angle }: OrbitingSkillProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, iconType, label } = config;
  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
      style={{
        width: `${size}px`, height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-full p-2 bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${isHovered ? 'scale-125 shadow-2xl' : 'shadow-lg hover:shadow-xl'}`}
        style={{ boxShadow: isHovered ? `0 0 30px ${iconComponents[iconType]?.color}40, 0 0 60px ${iconComponents[iconType]?.color}20` : undefined }}
      >
        <SkillIcon type={iconType} />
        {isHovered && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900/95 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap pointer-events-none">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingSkill.displayName = 'OrbitingSkill';

// Optimized Orbit Path Component
const GlowingOrbitPath = memo(({ radius, glowColor = 'cyan', animationDelay = 0 }: GlowingOrbitPathProps) => {
  const glowColors = {
    cyan: { primary: 'rgba(6, 182, 212, 0.4)', secondary: 'rgba(6, 182, 212, 0.2)', border: 'rgba(6, 182, 212, 0.3)' },
    purple: { primary: 'rgba(147, 51, 234, 0.4)', secondary: 'rgba(147, 51, 234, 0.2)', border: 'rgba(147, 51, 234, 0.3)' }
  };
  const colors = glowColors[glowColor] || glowColors.cyan;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{ width: `${radius * 2}px`, height: `${radius * 2}px`, animationDelay: `${animationDelay}s` }}
    >
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: `radial-gradient(circle, transparent 30%, ${colors.secondary} 70%, ${colors.primary} 100%)`,
          boxShadow: `0 0 60px ${colors.primary}, inset 0 0 60px ${colors.secondary}`,
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: `${animationDelay}s`,
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid ${colors.border}`, boxShadow: `inset 0 0 20px ${colors.secondary}` }}
      />
    </div>
  );
});
GlowingOrbitPath.displayName = 'GlowingOrbitPath';

// Main Skills Component
function OrbitingSkills() {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    let animationFrameId: number;
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setTime(prevTime => prevTime + deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const orbitConfigs: Array<{ radius: number; glowColor: GlowColor; delay: number }> = [
    { radius: 100, glowColor: 'cyan', delay: 0 },
    { radius: 180, glowColor: 'purple', delay: 1.5 }
  ];

  return (
    <div className="w-full flex items-center justify-center overflow-hidden">
      <div
        className="relative w-[calc(100vw-40px)] h-[calc(100vw-40px)] md:w-[450px] md:h-[450px] flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center z-10 relative shadow-2xl">
          <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-xl animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
              </defs>
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
        </div>
        {orbitConfigs.map((config) => (
          <GlowingOrbitPath
            key={`path-${config.radius}`}
            radius={config.radius}
            glowColor={config.glowColor}
            animationDelay={config.delay}
          />
        ))}
        {skillsConfig.map((config) => {
          const angle = time * config.speed + (config.phaseShift || 0);
          return (
            <OrbitingSkill
              key={config.id}
              config={config}
              angle={angle}
            />
          );
        })}
      </div>
    </div>
  );
}


// --- REUSABLE COMPONENTS ---

interface StarBackgroundProps { color?: string; }

function StarBackground({ color }: StarBackgroundProps) {
  return (
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_408_119)">
        <path d="M32.34 26.68C32.34 26.3152 32.0445 26.02 31.68 26.02C31.3155 26.02 31.02 26.3152 31.02 26.68C31.02 27.0448 31.3155 27.34 31.68 27.34C32.0445 27.34 32.34 27.0448 32.34 26.68Z" fill="black" />
        <path fillRule="evenodd" clipRule="evenodd" d="M56.1 3.96C56.4645 3.96 56.76 4.25519 56.76 4.62C56.76 4.98481 56.4645 5.28 56.1 5.28C55.9131 5.28 55.7443 5.20201 55.624 5.07762C55.5632 5.01446 55.5147 4.93904 55.4829 4.8559C55.4552 4.78243 55.44 4.70315 55.44 4.62C55.44 4.5549 55.4494 4.49174 55.4668 4.43244C55.4906 4.35188 55.5292 4.27775 55.5795 4.21329C55.7004 4.05926 55.8885 3.96 56.1 3.96ZM40.26 17.16C40.6245 17.16 40.92 17.4552 40.92 17.82C40.92 18.1848 40.6245 18.48 40.26 18.48C39.8955 18.48 39.6 18.1848 39.6 17.82C39.6 17.4552 39.8955 17.16 40.26 17.16ZM74.58 5.28C74.7701 5.28 74.9413 5.36057 75.0618 5.48882C75.073 5.50043 75.0837 5.51268 75.094 5.52557C75.1088 5.54426 75.1231 5.56359 75.1359 5.58357L75.1479 5.60291L75.1595 5.62353C75.1711 5.64481 75.1814 5.66672 75.1906 5.68928C75.2226 5.76662 75.24 5.85106 75.24 5.94C75.24 6.1585 75.1336 6.3525 74.9699 6.47238C74.9158 6.51234 74.8555 6.54393 74.7908 6.56584C74.7247 6.58775 74.6538 6.6 74.58 6.6C74.2156 6.6 73.92 6.30481 73.92 5.94C73.92 5.87684 73.929 5.8156 73.9455 5.7576C73.9596 5.70862 73.979 5.66221 74.0032 5.61903C74.0657 5.50688 74.1595 5.41471 74.2728 5.35541C74.3647 5.30707 74.4691 5.28 74.58 5.28ZM21.66 33.52C22.0245 33.52 22.32 33.8152 22.32 34.18C22.32 34.5448 22.0245 34.84 21.66 34.84C21.2955 34.84 21 34.5448 21 34.18C21 33.8152 21.2955 33.52 21.66 33.52ZM8.16 32.86C8.16 32.4952 7.8645 32.2 7.5 32.2C7.1355 32.2 6.84 32.4952 6.84 32.86C6.84 33.2248 7.1355 33.52 7.5 33.52C7.8645 33.52 8.16 33.2248 8.16 32.86ZM7.5 23.68C7.8645 23.68 8.16 23.9752 8.16 24.34C8.16 24.7048 7.8645 25 7.5 25C7.1355 25 6.84 24.7048 6.84 24.34C6.84 23.9752 7.1355 23.68 7.5 23.68ZM19.32 18.48C19.32 18.1152 19.0245 17.82 18.66 17.82C18.2955 17.82 18 18.1152 18 18.48C18 18.8448 18.2955 19.14 18.66 19.14C19.0245 19.14 19.32 18.8448 19.32 18.48ZM5.66 11.84C6.0245 11.84 6.32001 12.1352 6.32001 12.5C6.32001 12.8648 6.0245 13.16 5.66 13.16C5.2955 13.16 5 12.8648 5 12.5C5 12.1352 5.2955 11.84 5.66 11.84ZM35.16 35.5C35.16 35.1352 34.8645 34.84 34.5 34.84C34.1355 34.84 33.84 35.1352 33.84 35.5C33.84 35.8648 34.1355 36.16 34.5 36.16C34.8645 36.16 35.16 35.8648 35.16 35.5ZM53.5 36.18C53.8645 36.18 54.16 36.4752 54.16 36.84C54.16 37.2048 53.8645 37.5 53.5 37.5C53.1355 37.5 52.84 37.2048 52.84 36.84C52.84 36.4752 53.1355 36.18 53.5 36.18ZM48.5 28.66C48.5 28.2952 48.2045 28 47.84 28C47.4755 28 47.18 28.2952 47.18 28.66C47.18 29.0248 47.4755 29.32 47.84 29.32C48.2045 29.32 48.5 29.0248 48.5 28.66ZM60.34 27.34C60.7045 27.34 61 27.6352 61 28C61 28.3648 60.7045 28.66 60.34 28.66C59.9755 28.66 59.68 28.3648 59.68 28C59.68 27.6352 59.9755 27.34 60.34 27.34ZM56.284 16.5C56.284 16.1352 55.9885 15.84 55.624 15.84C55.2595 15.84 54.964 16.1352 54.964 16.5C54.964 16.8648 55.2595 17.16 55.624 17.16C55.9885 17.16 56.284 16.8648 56.284 16.5ZM46.2 7.26C46.2 6.89519 45.9045 6.6 45.54 6.6C45.5174 6.6 45.4953 6.60129 45.4733 6.60387L45.453 6.60579L45.4124 6.61225L45.3857 6.61804L45.3845 6.61836C45.3675 6.62277 45.3504 6.62721 45.3341 6.63287C45.2522 6.65929 45.1774 6.70184 45.1134 6.75597C45.0627 6.79916 45.0186 6.84943 44.9828 6.90551C44.9178 7.00799 44.88 7.12981 44.88 7.26C44.88 7.62481 45.1755 7.92 45.54 7.92C45.7372 7.92 45.9141 7.83363 46.0353 7.69635C46.0808 7.64478 46.1182 7.58613 46.1459 7.52232C46.1807 7.4424 46.2 7.35346 46.2 7.26ZM33 9.34C33 8.9752 32.7045 8.68 32.34 8.68C31.9755 8.68 31.68 8.9752 31.68 9.34C31.68 9.7048 31.9755 10 32.34 10C32.7045 10 33 9.7048 33 9.34ZM16 4.8559C16.3645 4.8559 16.66 5.1511 16.66 5.5159C16.66 5.8807 16.3645 6.1759 16 6.1759C15.6355 6.1759 15.34 5.8807 15.34 5.5159C15.34 5.1511 15.6355 4.8559 16 4.8559ZM69.66 21.16C69.66 20.7952 69.3645 20.5 69 20.5C68.6355 20.5 68.34 20.7952 68.34 21.16C68.34 21.5248 68.6355 21.82 69 21.82C69.3645 21.82 69.66 21.5248 69.66 21.16ZM80.52 15.18C80.52 14.8152 80.2245 14.52 79.86 14.52C79.4956 14.52 79.2 14.8152 79.2 15.18C79.2 15.5448 79.4956 15.84 79.86 15.84C80.2245 15.84 80.52 15.5448 80.52 15.18ZM78.16 34.84C78.16 34.4752 77.5 34.18 77.5 34.18C77.5 34.18 76.84 34.4752 76.84 34.84C76.84 35.2048 77.1355 35.5 77.5 35.5C77.8645 35.5 78.16 35.2048 78.16 34.84ZM85.66 24.34C86.0245 24.34 86.32 24.6352 86.32 25C86.32 25.3648 86.0245 25.66 85.66 25.66C85.2955 25.66 85 25.3648 85 25C85 24.6352 85.2955 24.34 85.66 24.34ZM91.32 10C91.32 9.6352 91.0245 9.34 90.66 9.34C90.2955 9.34 90 9.6352 90 10C90 10.3648 90.2955 10.66 90.66 10.66C91.0245 10.66 91.32 10.3648 91.32 10ZM138.6 0H0V46.2H138.6V0ZM92.64 34.84C92.64 34.4752 91.98 34.18 91.98 34.18C91.98 34.18 91.32 34.4752 91.32 34.84C91.32 35.2048 91.6155 35.5 91.98 35.5C92.3445 35.5 92.64 35.2048 92.64 34.84Z" fill={color || "currentColor"} />
      </g>
      <defs><clipPath id="clip0_408_119"><rect width="100" height="40" fill="white" /></clipPath></defs>
    </svg>
  );
}

type StarButtonProps = {
  children: ReactNode;
  lightWidth?: number;
  duration?: number;
  lightColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function StarButton({ children, lightWidth = 110, duration = 3, lightColor = "#FAFAFA", backgroundColor = "currentColor", borderWidth = 2, className, ...props }: StarButtonProps) {
  const pathRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = pathRef.current;
    if (!button) return;

    const updatePath = () => {
      if (button.offsetWidth > 0) {
        button.style.setProperty("--path", `path('M 0 0 H ${button.offsetWidth} V ${button.offsetHeight} H 0 V 0')`);
      }
    };

    updatePath();

    const resizeObserver = new ResizeObserver(updatePath);
    resizeObserver.observe(button);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <button style={{ "--duration": `${duration}s`, "--light-width": `${lightWidth}px`, "--light-color": lightColor, "--border-width": `${borderWidth}px`, isolation: "isolate" } as CSSProperties} ref={pathRef} className={cn("relative z-[3] overflow-hidden h-10 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 group/star-button", className)} {...props}>
      <div className="absolute aspect-square inset-0 animate-star-btn bg-[radial-gradient(ellipse_at_center,var(--light-color),transparent,transparent)]" style={{ offsetPath: "var(--path)", offsetDistance: "0%", width: "var(--light-width)" } as CSSProperties} />
      <div className="absolute inset-0 dark:border-white/15 border-black/10 z-[4] overflow-hidden rounded-[inherit] dark:text-black text-white" style={{ borderWidth: "var(--border-width)" }} aria-hidden="true">
        <StarBackground color={backgroundColor} />
      </div>
      <span className="z-10 relative bg-gradient-to-t dark:from-white dark:to-neutral-300 from-black to-neutral-400 inline-block text-transparent bg-clip-text">
        {children}
      </span>
    </button>
  );
}

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}
const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
            Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )`
                  : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
                radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
                radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%), 
                radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #dd7bbb 0%,
                  #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
                  #5a922c calc(50% / var(--repeating-conic-gradient-times)), 
                  #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
                  #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
                )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

// --- PAGE COMPONENTS ---

const navItems = [
  { href: '#about', text: 'About' },
  { href: '#skills', text: 'Skills' },
  { href: '#work-experience', text: 'Experience' },
  { href: '#/all-projects', text: 'Projects' },
  { href: '#contact', text: 'Contact Me' },
];

function PortfolioPage({ navigateTo }: { navigateTo: (path: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreSummaryVisible, setIsMoreSummaryVisible] = useState(false);
  const navMenuRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const currentActiveLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    // Regular Page Logic
    const header = document.getElementById('header');

    const moveIndicator = (element: HTMLElement | null) => {
      if (!element || !indicatorRef.current) return;
      indicatorRef.current.style.width = `${element.offsetWidth}px`;
      indicatorRef.current.style.left = `${element.offsetLeft}px`;
      element.classList.add('text-sky-300');
    };

    setTimeout(() => {
      const firstLink = navLinksRef.current[0];
      if (firstLink) {
        currentActiveLinkRef.current = firstLink;
        moveIndicator(firstLink);
      }
    }, 100);

    const handleNavLinkEnter = (e: MouseEvent) => {
      navLinksRef.current.forEach(l => l?.classList.remove('text-sky-300'));
      moveIndicator(e.target as HTMLElement);
    };

    const handleNavMenuLeave = () => {
      navLinksRef.current.forEach(l => l?.classList.remove('text-sky-300'));
      moveIndicator(currentActiveLinkRef.current);
    };

    navLinksRef.current.forEach(link => link?.addEventListener('mouseenter', handleNavLinkEnter));
    navMenuRef.current?.addEventListener('mouseleave', handleNavMenuLeave);

    const handleScroll = () => {
      if (header) {
        header.classList.toggle('header-scrolled', window.scrollY > 50);
      }
    };
    window.addEventListener('scroll', handleScroll);

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => animationObserver.observe(el));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const id = entry.target.getAttribute('id');
          let activeLink;
          if (id === 'projects') {
            activeLink = navLinksRef.current.find(link => link?.getAttribute('href') === '#/all-projects');
          } else {
            activeLink = navLinksRef.current.find(link => link?.getAttribute('href') === `#${id}`);
          }

          if (activeLink) {
            currentActiveLinkRef.current = activeLink;
            navLinksRef.current.forEach(l => l?.classList.remove('text-sky-300'));
            moveIndicator(activeLink);
          }
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));

    const timeline = document.querySelector('.aceternity-timeline') as HTMLElement;
    const handleTimelineScroll = () => {
      if (!timeline) return;
      const timelineRect = timeline.getBoundingClientRect();
      const progressPercent = Math.max(0, Math.min(100, ((window.innerHeight / 2) - timelineRect.top) / timelineRect.height * 100));
      timeline.style.setProperty('--timeline-progress', `${progressPercent}%`);
    };
    window.addEventListener('scroll', handleTimelineScroll);
    window.addEventListener('resize', handleTimelineScroll);
    handleTimelineScroll();

    const resumeBtn = document.getElementById('resume-btn');
    const splineContainer = document.getElementById('spline-container');
    const resumeBtnPlaceholder = document.getElementById('resume-btn-placeholder');
    const handleResumeButtonScroll = () => {
      if (!resumeBtn || !splineContainer || !resumeBtnPlaceholder) return;
      const progress = Math.max(0, Math.min(1, window.scrollY / (document.getElementById('hero')!.offsetHeight * 0.8)));

      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const easedProgress = easeInOutCubic(progress);

      const startRect = splineContainer.getBoundingClientRect();
      const endRect = resumeBtnPlaceholder.getBoundingClientRect();

      // Ensure button is visible
      resumeBtn.style.visibility = 'visible';

      const startX = startRect.right - resumeBtn.offsetWidth - 20;
      const startY = startRect.bottom - resumeBtn.offsetHeight - 20;

      if (endRect.width === 0) {
        // Mobile: Keep it at the start position (on the spline container)
        resumeBtn.style.transform = `translate(${startX}px, ${startY}px)`;
        return;
      }

      const endX = endRect.left;
      const endY = endRect.top;
      resumeBtn.style.transform = `translate(${startX + (endX - startX) * easedProgress}px, ${startY + (endY - startY) * easedProgress}px)`;
    };
    setTimeout(() => {
      handleResumeButtonScroll();
      window.addEventListener('scroll', handleResumeButtonScroll);
      window.addEventListener('resize', handleResumeButtonScroll);
    }, 500);

    const cometCardContainer = document.getElementById('comet-card-container');
    const cometCardMotion = document.getElementById('comet-card-motion');
    const cometGlare = document.getElementById('comet-glare');
    const handleCometMouseMove = (e: MouseEvent) => {
      if (!cometCardContainer || !cometCardMotion || !cometGlare) return;
      const rect = cometCardContainer.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      cometCardMotion.style.transition = 'transform 0.1s linear, box-shadow 0.1s linear';
      cometCardMotion.style.transform = `rotateX(${yPct * -17.5}deg) rotateY(${xPct * 17.5}deg) translateX(${xPct * 20}px) translateY(${yPct * -20}px) scale(1.05) translateZ(50px)`;
      cometCardMotion.style.boxShadow = "rgba(0, 0, 0, 0.29) 0px 21px 46px 0px";
      cometGlare.style.background = `radial-gradient(circle at ${xPct * 50 + 50}% ${yPct * 50 + 50}%, rgba(255, 255, 255, 0.9) 10%, transparent 80%)`;
    };
    const handleCometMouseLeave = () => {
      if (!cometCardMotion || !cometGlare) return;
      cometCardMotion.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease-out';
      cometCardMotion.style.transform = 'none';
      cometCardMotion.style.boxShadow = "none";
      cometGlare.style.background = 'none';
    };
    cometCardContainer?.addEventListener('mousemove', handleCometMouseMove);
    cometCardContainer?.addEventListener('mouseleave', handleCometMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleTimelineScroll);
      window.removeEventListener('resize', handleTimelineScroll);
      window.removeEventListener('scroll', handleResumeButtonScroll);
      window.removeEventListener('resize', handleResumeButtonScroll);
      navMenuRef.current?.removeEventListener('mouseleave', handleNavMenuLeave);
      navLinksRef.current.forEach(link => {
        if (link) link.removeEventListener('mouseenter', handleNavLinkEnter)
      });
      cometCardContainer?.removeEventListener('mousemove', handleCometMouseMove);
      cometCardContainer?.removeEventListener('mouseleave', handleCometMouseLeave);
      document.querySelectorAll('.animate-on-scroll').forEach(el => animationObserver.unobserve(el));
      document.querySelectorAll('section[id]').forEach(section => sectionObserver.unobserve(section));
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const button = (e.target as HTMLFormElement).querySelector('button');
    button?.classList.add('animate-bounce');
    setTimeout(() => button?.classList.remove('animate-bounce'), 1000);
  };

  return (
    <>
      <header id="header" className="header py-4 px-8">
        <nav className="container mx-auto flex justify-between items-center">
          <a href="#hero" className="text-2xl font-bold tracking-wider">SB</a>
          <div id="nav-menu" ref={navMenuRef} className="hidden md:flex relative gap-8 font-medium">
            {navItems.map((item, index) => {
              const isAppRoute = item.href.startsWith('#/');
              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (isAppRoute) {
                  e.preventDefault();
                  const path = item.href.substring(2);
                  navigateTo(path);
                }
              };

              return (
                <a
                  key={item.href}
                  href={item.href}
                  ref={el => { navLinksRef.current[index] = el; }}
                  onClick={isAppRoute ? handleClick : undefined}
                  className="nav-link hover:text-sky-300 transition-colors"
                >
                  {item.text}
                </a>
              );
            })}
            <span id="nav-indicator" ref={indicatorRef} className="nav-indicator"></span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div id="resume-btn-placeholder" className="shiny-cta font-semibold" style={{ padding: '0.5rem 1rem', visibility: 'hidden' }}>
              <span><i className="ph ph-download-simple text-lg"></i> Download Resume</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-2xl"><i className="ph ph-list"></i></button>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex flex-col items-center justify-center">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-3xl text-white"><i className="ph ph-x"></i></button>
          {navItems.map((item) => {
            const isAppRoute = item.href.startsWith('#/');
            const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (isAppRoute) {
                e.preventDefault();
                const path = item.href.substring(2);
                navigateTo(path);
              }
              setIsMobileMenuOpen(false);
            };
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={handleClick}
                className="mobile-nav-link text-3xl font-bold my-4 text-white"
              >
                {item.text}
              </a>
            );
          })}

          <a
            href="https://drive.google.com/uc?export=download&id=1Cq5MVi-D_uD4XSxAYxAFNkDFSiP9VJKz"
            className="mobile-nav-link text-3xl font-bold my-4 text-sky-300 flex items-center gap-2"
          >
            <i className="ph ph-download-simple"></i> Resume
          </a>
        </div>
      )}

      <main>
        <section id="hero" className="relative overflow-hidden px-8">
          <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center min-h-screen pt-16 md:pt-0 z-10 relative">
            <div className="text-center md:text-left animate-on-scroll fade-in">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">Generative <br />AI Developer</h1>
              <p className="text-lg text-slate-300 max-w-md mx-auto md:mx-0 mb-8">AI Developer specializing in building and deploying end-to-end Generative AI solutions. Proven ability to create production-grade automation tools and full-stack AI applications using Python, LangChain, and GPT-4.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="#contact" className="glowing-button font-semibold text-white py-3 px-8 rounded-full inline-block">Contact Me</a>
                <StarButton onClick={() => document.getElementById('projects')?.scrollIntoView()}>View Projects</StarButton>
              </div>
            </div>
            <div id="spline-container" className="relative h-[50vh] md:h-[70vh] animate-on-scroll fade-in" style={{ transitionDelay: '200ms' }}>
              <spline-viewer url="https://prod.spline.design/UyZ6uRwwHxBuYKiY/scene.splinecode"></spline-viewer>
            </div>
          </div>
        </section>

        <section id="about" className="py-24 px-8">
          <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll slide-in-left flex justify-center items-center">
              <div id="comet-card-container" className="perspective-distant transform-3d">
                <div id="comet-card-motion" className="relative rounded-2xl">
                  <div className="w-80 cursor-pointer flex-col items-stretch rounded-[14px] p-2 saturate-0 md:p-4 relative z-10">
                    <div className="mx-2 flex-1">
                      <div className="relative mt-2 aspect-[3/4] w-full">
                        <img loading="lazy" className="absolute inset-0 h-full w-full rounded-[16px] object-cover" alt="Saburi Rane Headshot" src="/assets/about-photo.png" />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-shrink-0 items-center justify-center space-x-6 p-4">
                      <a href="https://github.com/SaburiProject" target="_blank" className="text-3xl text-slate-400 hover:text-sky-300 transition-all hover:scale-110"><i className="ph ph-github-logo"></i></a>
                      <a href="https://www.linkedin.com/in/saburirane" target="_blank" className="text-3xl text-slate-400 hover:text-sky-300 transition-all hover:scale-110"><i className="ph ph-linkedin-logo"></i></a>
                      <a href="https://wa.me/917972758287?text=Hello%20Saburi,%20I%20would%20like%20to%20contact%20you%20about%20your%20service" target="_blank" className="text-3xl text-slate-400 hover:text-sky-300 transition-all hover:scale-110"><i className="ph ph-whatsapp-logo"></i></a>
                    </div>
                  </div>
                  <div id="comet-glare" className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[16px] mix-blend-overlay" style={{ opacity: 0.6 }}></div>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll slide-in-right text-center md:text-left">
              <div id="about-text-container">
                <h2 className="text-4xl font-bold mb-4">Professional Summary</h2>
                <p id="about-paragraph" className="text-lg text-slate-300 mb-4">As an AI Engineer and Machine Learning Specialist, I bring a unique blend of theoretical knowledge and practical experience in developing intelligent systems. My expertise spans across Large Language Models (LLMs), Retrieval-Augmented Generation (RAG) systems, and scalable machine learning architectures.</p>
                <div id="more-summary" className={cn("transition-all duration-500 ease-in-out", isMoreSummaryVisible ? '' : 'hidden')}>
                  <p className="text-lg text-slate-300 mb-4">I specialize in fine-tuning state-of-the-art models like Meta's Llama, implementing efficient training techniques such as LoRA and quantization, and building robust AI-powered applications. My work focuses on bridging the gap between cutting-edge research and practical, production-ready solutions.</p>
                  <p className="text-lg text-slate-300 mb-8">With a strong foundation in cloud computing, particularly AWS and GCP, and extensive experience with frameworks like TensorFlow, PyTorch, and LangChain, I'm passionate about creating AI solutions that make a real impact on businesses and users alike.</p>
                </div>
                <button onClick={() => navigateTo('about')} id="show-more-btn" className="font-semibold text-sky-300 hover:text-sky-200 transition-colors">Show More...</button>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-24 px-8">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 animate-on-scroll fade-in">Skills</h2>
            <OrbitingSkills />
          </div>
        </section>

        <section id="work-experience" className="py-24 px-8">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 animate-on-scroll fade-in">Career Journey</h2>
            <div className="aceternity-timeline">
              <div className="timeline-item animate-on-scroll fade-in">
                <div className="flex gap-6 md:gap-8">
                  <div className="flex-shrink-0"><p className="text-5xl font-bold text-slate-400/80 -mt-1">2024</p></div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Freelance Developer</h3>
                    <p className="text-sky-300/80 mb-4 text-sm">2024 - Present</p>
                    <p className="text-slate-300 mb-6 max-w-2xl">Developed bespoke web applications and interactive experiences for various clients, focusing on creating responsive, high-performance sites using modern frameworks.</p>
                    <ul className="text-slate-300 list-disc list-inside space-y-2 max-w-2xl">
                      <li>Managed end-to-end project lifecycle from concept to deployment.</li>
                      <li>Specialized in creating dynamic user interfaces with React.</li>
                      <li>Integrated various third-party APIs for enhanced functionality.</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="timeline-item animate-on-scroll fade-in">
                <div className="flex gap-6 md:gap-8">
                  <div className="flex-shrink-0"><p className="text-5xl font-bold text-slate-400/80 -mt-1">2025</p></div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">AI Developer @ American Hairline</h3>
                    <p className="text-sky-300/80 mb-4 text-sm">Jan 2025 - Sep 2025</p>
                    <p className="text-slate-300 mb-6 max-w-2xl">Key accomplishments in this role include architecting production-grade AI automation solutions and deploying a full-stack AI Support Chat Widget.</p>
                    <ul className="text-slate-300 list-disc list-inside space-y-2 max-w-2xl">
                      <li>Reduced content creation effort by over 80% with the AutoBlogGen system.</li>
                      <li>Implemented advanced RAG pipelines using Pinecone & HuggingFace.</li>
                      <li>Designed and deployed intuitive user interfaces for AI tools.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="py-24 px-8">
          <div className="container mx-auto space-y-24">
            <h2 className="text-4xl font-bold text-center mb-12 animate-on-scroll fade-in">Featured Work</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-xl overflow-hidden animate-on-scroll slide-in-left"><img src="/assets/projects/crm-call-report-automation.png" alt="CRM Audio Call Automation Screenshot" className="w-full h-full object-cover" /></div>
              <div className="animate-on-scroll slide-in-right">
                <h3 className="text-3xl font-bold mb-3">CRM Audio Call Automation</h3>
                <p className="text-slate-300 mb-4">Automates the generation of insightful reports from audio call recordings and seamlessly integrates them into CRM systems.</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-white/10 text-sm py-1 px-3 rounded-full">Speech-to-Text</span>
                  <span className="bg-white/10 text-sm py-1 px-3 rounded-full">Automation</span>
                  <span className="bg-white/10 text-sm py-1 px-3 rounded-full">CRM</span>
                  <span className="bg-white/10 text-sm py-1 px-3 rounded-full">NLP</span>
                </div>
                <StarButton onClick={() => window.open('https://github.com/SaburiProject/crm-audio-call-report-automation', '_blank')}>View Project</StarButton>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll slide-in-left md:order-2"><img src="/assets/projects/ai-customer-support-widget.png" alt="AI Customer Support Widget Screenshot" className="rounded-xl overflow-hidden w-full h-full object-cover" /></div>
              <div className="animate-on-scroll slide-in-right md:order-1">
                <h3 className="text-3xl font-bold mb-3">Full-Stack AI Support Chatbot</h3>
                <p className="text-slate-300 mb-4">An intelligent, full-stack support widget built with OpenAI and LangChain, featuring lead capture and 24/7 automated assistance.</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-white/10 text-sm py-1 px-3 rounded-full">OpenAI</span>
                  <span className="bg-white/10 text-sm py-1 px-3 rounded-full">LangChain</span>
                  <span className="bg-white/10 text-sm py-1 px-3 rounded-full">Pinecone</span>
                  <span className="bg-white/10 text-sm py-1 px-3 rounded-full">FastAPI</span>
                </div>
                <StarButton onClick={() => window.open('https://github.com/SaburiProject/ai-customer-support-widget', '_blank')}>View Project</StarButton>
              </div>
            </div>
            <div className="text-center animate-on-scroll fade-in">
              <StarButton onClick={() => navigateTo('all-projects')}>View All Projects</StarButton>
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <a href="https://drive.google.com/uc?export=download&id=1Cq5MVi-D_uD4XSxAYxAFNkDFSiP9VJKz" id="resume-btn" download className="shiny-cta" style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, willChange: 'transform', visibility: 'hidden', backgroundColor: 'rgba(5, 6, 15, 0.95)', backdropFilter: 'blur(10px)' }}>
        <span><i className="ph ph-download-simple text-lg"></i> Download Resume</span>
      </a>

      <footer className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-white/10 px-6 py-12 lg:py-16 mt-24">
        <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4 animate-on-scroll fade-in">
            <h2 className="text-2xl font-bold tracking-wider">SB</h2>
            <p className="text-slate-400 text-sm md:mt-0">© 2025 Saburi Rane. All rights reserved.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
            <div className="animate-on-scroll fade-in" style={{ transitionDelay: '100ms' }}>
              <h3 className="text-sm font-semibold">Navigation</h3>
              <ul className="text-slate-400 mt-4 space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#work-experience" className="hover:text-white transition-colors">Experience</a></li>
                <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
              </ul>
            </div>
            <div className="animate-on-scroll fade-in" style={{ transitionDelay: '200ms' }}>
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="text-slate-400 mt-4 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Blog (Coming Soon)</a></li>
                <li><a href="https://docs.google.com/document/d/1gNKYQAhwA90B9LLiYb6Sl-vB2zLs0rtC/edit?usp=sharing&ouid=116354631516096491724&rtpof=true&sd=true" target="_blank" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="animate-on-scroll fade-in" style={{ transitionDelay: '300ms' }}>
              <h3 className="text-sm font-semibold">Social Links</h3>
              <ul className="text-slate-400 mt-4 space-y-2 text-sm">
                <li><a href="https://github.com/SaburiProject" target="_blank" className="hover:text-white inline-flex items-center gap-2 transition-colors"><i className="ph-fill ph-github-logo"></i> Github</a></li>
                <li><a href="https://www.linkedin.com/in/saburirane" target="_blank" className="hover:text-white inline-flex items-center gap-2 transition-colors"><i className="ph-fill ph-linkedin-logo"></i> LinkedIn</a></li>
                <li><a href="https://wa.me/917972758287?text=Hello%20Saburi,%20I%20would%20like%20to%20contact%20you%20about%20your%20service" target="_blank" className="hover:text-white inline-flex items-center gap-2 transition-colors"><i className="ph-fill ph-whatsapp-logo"></i> WhatsApp</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function AboutPage({ navigateTo }: { navigateTo: (path: string) => void }) {
  return (
    <div className="container mx-auto px-8 py-24 pt-32 min-h-screen max-w-5xl">
      {/* Header with Greeting and Photo */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Hi, I'm Saburi <span className="wave">👋</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            AI Developer with expertise in Generative AI, Machine Learning, and building production-grade AI solutions.
            I love solving complex problems and creating innovative AI-driven products.
          </p>
        </div>
        <div className="flex-shrink-0">
          <img
            src="/assets/about-photo.png"
            alt="Saburi Rane"
            className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-2 border-sky-300 shadow-lg"
          />
        </div>
      </div>

      <article className="prose prose-invert max-w-none">
        {/* About Section */}
        <h2 className="text-4xl font-bold mb-6 mt-12">About</h2>
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          AI Developer with a strong foundation in Generative AI and Machine Learning, holding an MCA with an 8.00 CGPA.
          I specialize in developing end-to-end AI solutions using Python, LangChain, GPT-4, and RAG methodologies.
          I have a proven ability to build and deploy production-grade automation tools and full-stack AI applications
          and am eager to apply strong analytical and problem-solving skills to create innovative AI-driven products.
        </p>

        {/* Tech Stack Section */}
        <h2 className="text-4xl font-bold mb-6 mt-12">Tech Stack (Skills)</h2>
        <p className="text-slate-300 mb-6">Here is a list of my technical skills as listed on my resume:</p>
        <ul className="text-slate-300 space-y-4 mb-8">
          <li className="flex gap-3">
            <span className="text-sky-300">•</span>
            <span><strong>Generative AI & ML</strong>: Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), LangChain, GPT-4, Llama3.1, HuggingFace, Pinecone, OpenAI API, Whisper, Q-Learning, DQN, MADDPG</span>
          </li>
          <li className="flex gap-3">
            <span className="text-sky-300">•</span>
            <span><strong>Programming & Databases</strong>: Python, C, C++, Java, SQL, FastAPI</span>
          </li>
          <li className="flex gap-3">
            <span className="text-sky-300">•</span>
            <span><strong>Data & Frontend</strong>: Pandas, NumPy, Matplotlib, Tableau, HTML, CSS, JavaScript</span>
          </li>
          <li className="flex gap-3">
            <span className="text-sky-300">•</span>
            <span><strong>Tools & Platforms</strong>: Git, n8n, Google Workspace (Sheets, Docs, Gmail APIs), Microsoft Office Suite</span>
          </li>
        </ul>

        {/* Work Experience Section */}
        <h2 className="text-4xl font-bold mb-6 mt-12">Work Experience</h2>
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-2">American Hairline</h3>
          <p className="text-sky-300 mb-4">Mumbai, Maharashtra</p>
          <h4 className="text-xl font-semibold mb-4">Artificial Intelligence Developer (Jan 2025–Sep 2025)</h4>
          <ul className="text-slate-300 space-y-3 ml-4">
            <li className="flex gap-3">
              <span className="text-sky-300">•</span>
              <span>Architected and developed production-grade AI solutions for internal automation, leveraging Python, FastAPI, and OpenAI GPT-4.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-300">•</span>
              <span>Engineered "AutoBlogGen," an automated blog generation system using GPT-4 and Google Workspace, which reduced manual content creation efforts by over 80%.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-300">•</span>
              <span>Implemented RAG techniques with Pinecone and HuggingFace to build contextual AI pipelines for intelligent applications.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-300">•</span>
              <span>Developed and deployed a full-stack AI Support Chat Widget using OpenAI, LangChain, and Pinecone, including a lead capture mechanism.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-300">•</span>
              <span>Automated cross-platform workflows using n8n, integrating systems from YouTube comment replies to Instagram DMs and blog publishing.</span>
            </li>
          </ul>
        </div>

        {/* Education Section */}
        <h2 className="text-4xl font-bold mb-6 mt-12">Education</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Late Bhausaheb Hiray College | Mumbai University</h3>
            <ul className="text-slate-300 space-y-2 ml-4">
              <li><strong>Degree</strong>: Master of Computer Applications (MCA)</li>
              <li><strong>Graduation</strong>: Jul 2025</li>
              <li><strong>CGPA</strong>: 8.00</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Annasaheb Vartak College | Mumbai University</h3>
            <ul className="text-slate-300 space-y-2 ml-4">
              <li><strong>Degree</strong>: Bachelor of Science in Computer Science (B.Sc. CS)</li>
              <li><strong>Graduation</strong>: Apr 2022</li>
              <li><strong>CGPA</strong>: 6.78</li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <h2 className="text-4xl font-bold mb-6 mt-12">Contact</h2>
        <ul className="text-slate-300 space-y-3 mb-12">
          <li className="flex gap-3">
            <span className="text-sky-300">•</span>
            <span><strong>Location</strong>: Mumbai City (Andheri)</span>
          </li>
          <li className="flex gap-3">
            <span className="text-sky-300">•</span>
            <span><strong>Phone</strong>: 7972758287</span>
          </li>
          <li className="flex gap-3">
            <span className="text-sky-300">•</span>
            <span><strong>Email</strong>: saburirane62@gmail.com</span>
          </li>
          <li className="flex gap-3">
            <span className="text-sky-300">•</span>
            <span><strong>Links</strong>: <a href="https://www.linkedin.com/in/saburirane" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-sky-200">LinkedIn</a> & <a href="https://github.com/SaburiProject" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-sky-200">GitHub</a></span>
          </li>
        </ul>
      </article>

      <footer className="text-center mt-24 mb-12">
        <button onClick={() => navigateTo('')} className="glowing-button-secondary font-semibold text-white py-3 px-8 rounded-full inline-block">Back to Home</button>
      </footer>
    </div>
  );
}

const allProjectsData = [
  {
    title: 'AI Customer Support Widget',
    description: 'An intelligent, full-stack support widget built with OpenAI and LangChain, featuring lead capture and 24/7 automated assistance.',
    image: 'ai-customer-support-widget.png',
    tags: ['OpenAI', 'LangChain', 'Pinecone', 'FastAPI'],
    category: 'LLM',
    icon: 'ph-chats-circle',
    githubUrl: 'https://github.com/SaburiProject/ai-customer-support-widget',
  },
  {
    title: 'CRM Call Report Automation',
    description: 'Automates the generation of insightful reports from audio call recordings and seamlessly integrates them into CRM systems.',
    image: 'crm-call-report-automation.png',
    tags: ['Speech-to-Text', 'Automation', 'CRM', 'NLP'],
    category: 'Automation',
    icon: 'ph-phone-call',
    githubUrl: 'https://github.com/SaburiProject/crm-audio-call-report-automation',
  },
  {
    title: 'Blog Automation Bot',
    description: 'A full-cycle automation system using LLMs to manage workflow and generate content, significantly reducing content creation efforts.',
    image: 'blog-automation-bot.png',
    tags: ['GPT-4', 'n8n', 'Automation', 'Content Generation'],
    category: 'Automation',
    icon: 'ph-robot',
    githubUrl: 'https://github.com/SaburiProject/blog-automation-bot',
  },
  {
    title: 'Video Transcript Search Engine',
    description: 'Creates searchable, semantic vector embeddings from video transcripts using Pinecone for efficient information retrieval.',
    image: 'video-transcript-search-engine.png',
    tags: ['Pinecone', 'Embeddings', 'RAG', 'Video Processing'],
    category: 'RAG',
    icon: 'ph-magnifying-glass',
    githubUrl: 'https://github.com/SaburiProject/video-transcript-pinecone-embeddings',
  },
  {
    title: 'Candidate Insights API',
    description: 'A powerful API designed to extract, analyze, and structure key insights from candidate resumes and profiles.',
    image: 'candidate-insights-api.png',
    tags: ['API', 'NLP', 'Data Extraction', 'FastAPI'],
    category: 'NLP',
    icon: 'ph-user-list',
    githubUrl: 'https://github.com/SaburiProject/candidate-insights-api',
  },
  {
    title: 'Pinecone Uploader Utility',
    description: 'A streamlined command-line utility for efficiently batch-uploading documents and vector embeddings to Pinecone.',
    image: 'pinecone-uploader-utility.png',
    tags: ['Pinecone', 'Vector DB', 'CLI', 'Python'],
    category: 'Automation',
    icon: 'ph-upload-simple',
    githubUrl: 'https://github.com/SaburiProject/Pinicone-uploder',
  },
  {
    title: 'YouTube Auto-Reply Bot',
    description: 'Leverages NLP to understand comment sentiment and context, generating and posting relevant replies automatically.',
    image: 'youtube-auto-reply-bot.png',
    tags: ['YouTube API', 'NLP', 'Automation', 'Python'],
    category: 'Automation',
    icon: 'ph-youtube-logo',
    githubUrl: 'https://github.com/SaburiProject/Youtube-reply',
  },
  {
    title: 'Email Automation API',
    description: 'A robust API for automating complex email workflows, including parsing, categorization, and intelligent response generation.',
    image: 'email-automation-api.png',
    tags: ['API', 'Email', 'Automation', 'NLP'],
    category: 'Automation',
    icon: 'ph-envelope',
    githubUrl: 'https://github.com/SaburiProject/email_automation_api',
  }
];

const projectCategories = ['All Projects', 'LLM', 'NLP', 'RAG', 'Automation'];

function AllProjectsPage({ navigateTo }: { navigateTo: (path: string) => void }) {
  const [activeCategory, setActiveCategory] = useState('All Projects');

  const filteredProjects = activeCategory === 'All Projects'
    ? allProjectsData
    : allProjectsData.filter(p => p.category === activeCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Trigger animations
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animationObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const projectCards = document.querySelectorAll('.project-card-container');
    projectCards.forEach(card => animationObserver.observe(card));

    return () => animationObserver.disconnect();
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-8 py-24 pt-32 min-h-screen">
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">All Projects</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">A collection of my work in AI, web development, and beyond.</p>
        <div className="flex justify-center flex-wrap gap-4 mt-8">
          {projectCategories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'font-semibold text-white py-2 px-6 rounded-full transition-all duration-300',
                activeCategory === category
                  ? 'glowing-button'
                  : 'bg-white/10 hover:bg-white/20'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <div
            key={index}
            className="relative project-card-container animate-on-scroll fade-in"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <GlowingEffect disabled={false} className="rounded-2xl" />
            <div
              className="relative glass-card p-6 rounded-2xl flex flex-col h-full"
            >
              {project.image && (
                <div className="mb-4">
                  <img src={`/assets/projects/${project.image}`} alt={project.title} className="w-full h-40 md:h-48 object-cover rounded-md" />
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <i className={`ph ${project.icon} text-4xl text-sky-300`}></i>
                <h3 className="text-2xl font-bold">{project.title}</h3>
              </div>
              <p className="text-slate-300 mb-6 flex-grow">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => <span key={tag} className="bg-white/10 text-sm py-1 px-3 rounded-full">{tag}</span>)}
              </div>
              <div className="flex gap-4 mt-auto">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="glowing-button-secondary font-semibold text-white py-2 px-6 rounded-full text-center flex-1">View Code</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="glowing-button font-semibold text-white py-2 px-6 rounded-full text-center flex-1 opacity-50 cursor-not-allowed">Live Demo</a>
              </div>
            </div>
          </div>
        ))}
      </main>

      <footer className="text-center mt-24">
        <button onClick={() => navigateTo('')} className="glowing-button-secondary font-semibold text-white py-3 px-8 rounded-full inline-block">Back to Home</button>
      </footer>
    </div>
  );
}


// --- MAIN APP COMPONENT ---

function App() {
  const [route, setRoute] = useState(window.location.hash.substring(2));

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.substring(2));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = `#/${path}`;
    setRoute(path);
  };

  return (
    <>
      <GlobalStyles />
      <BeamsBackground />
      {route === 'all-projects'
        ? <AllProjectsPage navigateTo={navigateTo} />
        : route === 'about'
          ? <AboutPage navigateTo={navigateTo} />
          : <PortfolioPage navigateTo={navigateTo} />
      }
    </>
  );
}

export default App;