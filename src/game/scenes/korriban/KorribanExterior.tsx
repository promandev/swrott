"use client";

import { SceneRenderer, SceneLayer } from "../SceneRenderer";
import { Particles, LightRays, FogLayer } from "../particles/Particles";

/**
 * Korriban Academy Exterior — highly detailed 2D parallax scene.
 *
 * 10 parallax layers + rich atmospheric FX faithful to KOTOR's aesthetic:
 *   Sky with twin suns, nebula, and ancient starfield
 *   Three mountain ridges with carved rock faces
 *   Massive Sith Academy pyramid with illuminated windows and spires
 *   Ancient monolithic statues flanking the entrance
 *   Ritual path with glowing rune circles and altar stones
 *   Cracked blood-red earth ground plane
 *   Ornate obelisks with animated Sith glyphs
 *   Dense ember/ash/dust particle layers
 */
export function KorribanExteriorScene() {
  return (
    <SceneRenderer parallax parallaxIntensity={1.4}>

      {/* ═══ L0: Deep void sky ═══════════════════════════════════════════ */}
      <SceneLayer depth={0}>
        {/* Base gradient — deep purple-black night sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #03000a 0%, #0d0218 20%, #1a0520 50%, #280614 75%, #1a040e 100%)",
          }}
        />
        {/* Nebula masses — three overlapping washes */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 72% 18%, rgba(140,20,65,0.45) 0%, transparent 65%),
              radial-gradient(ellipse 50% 40% at 18% 25%, rgba(55,12,90,0.38) 0%, transparent 60%),
              radial-gradient(ellipse 35% 30% at 88% 35%, rgba(90,15,35,0.28) 0%, transparent 55%)
            `,
          }}
        />
        {/* Deep-sky star field — small + medium stars */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.55,
            backgroundImage: `
              radial-gradient(1px 1px at  7% 12%, rgba(255,230,200,0.95) 50%, transparent 50%),
              radial-gradient(1px 1px at 14%  5%, rgba(255,255,255,0.80) 50%, transparent 50%),
              radial-gradient(1.5px 1.5px at 22% 18%, rgba(255,220,200,0.90) 50%, transparent 50%),
              radial-gradient(1px 1px at 31%  9%, rgba(200,200,255,0.70) 50%, transparent 50%),
              radial-gradient(1px 1px at 38% 22%, rgba(255,255,255,0.75) 50%, transparent 50%),
              radial-gradient(2px 2px at 46%  6%, rgba(255,200,180,0.85) 50%, transparent 50%),
              radial-gradient(1px 1px at 54% 16%, rgba(255,255,255,0.65) 50%, transparent 50%),
              radial-gradient(1px 1px at 62%  3%, rgba(200,220,255,0.70) 50%, transparent 50%),
              radial-gradient(1.5px 1.5px at 71% 14%, rgba(255,240,220,0.88) 50%, transparent 50%),
              radial-gradient(1px 1px at 79%  8%, rgba(255,255,240,0.72) 50%, transparent 50%),
              radial-gradient(1px 1px at 87% 20%, rgba(255,200,200,0.68) 50%, transparent 50%),
              radial-gradient(1px 1px at 94% 11%, rgba(200,255,200,0.60) 50%, transparent 50%),
              radial-gradient(1px 1px at  4% 28%, rgba(255,255,255,0.50) 50%, transparent 50%),
              radial-gradient(1px 1px at 27% 31%, rgba(255,240,200,0.55) 50%, transparent 50%),
              radial-gradient(1px 1px at 48% 27%, rgba(255,255,255,0.45) 50%, transparent 50%),
              radial-gradient(1px 1px at 67% 33%, rgba(220,200,255,0.52) 50%, transparent 50%),
              radial-gradient(1px 1px at 83% 29%, rgba(255,255,220,0.48) 50%, transparent 50%),
              radial-gradient(2.5px 2.5px at 35% 8%, rgba(255,220,200,0.95) 50%, transparent 50%),
              radial-gradient(2px 2px at 58% 19%, rgba(255,255,255,0.90) 50%, transparent 50%),
              radial-gradient(1.5px 1.5px at 91% 7%, rgba(200,240,255,0.85) 50%, transparent 50%)
            `,
          }}
        />
        {/* Milky-way style star band */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background:
              "linear-gradient(125deg, transparent 20%, rgba(180,100,160,0.12) 35%, rgba(220,140,180,0.08) 50%, rgba(160,80,140,0.06) 65%, transparent 80%)",
          }}
        />
      </SceneLayer>

      {/* ═══ L1: Twin suns ═══════════════════════════════════════════════ */}
      <SceneLayer depth={0.08}>
        {/* Primary sun — large, blood-orange, partially set */}
        <div className="absolute" style={{ top: "8%", left: "63%" }}>
          <div
            className="rounded-full"
            style={{
              width: 240, height: 240,
              background:
                "radial-gradient(circle, rgba(255,130,60,0.75) 0%, rgba(220,55,20,0.35) 35%, rgba(140,20,10,0.12) 60%, transparent 75%)",
              filter: "blur(14px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 56, height: 56, top: 92, left: 92,
              background:
                "radial-gradient(circle, rgba(255,210,150,1) 0%, rgba(255,150,80,0.8) 55%, transparent 100%)",
              filter: "blur(4px)",
            }}
          />
          {/* Horizontal lens flare streaks */}
          <div
            className="absolute h-px"
            style={{
              width: 400, top: 120, left: -72,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,160,80,0.20) 25%, rgba(255,200,140,0.45) 50%, rgba(255,160,80,0.20) 75%, transparent 100%)",
            }}
          />
          {/* Corona rays */}
          {[20, 55, 100, 145, 200, 250, 310].map((deg) => (
            <div
              key={deg}
              className="absolute"
              style={{
                width: 2, height: 60 + (deg % 40),
                top: 120, left: 119,
                background: "linear-gradient(to top, rgba(255,150,60,0.25), transparent)",
                transform: `rotate(${deg}deg)`,
                transformOrigin: "bottom center",
                filter: "blur(1px)",
              }}
            />
          ))}
        </div>

        {/* Secondary sun — smaller, yellower, higher */}
        <div className="absolute" style={{ top: "12%", left: "53%" }}>
          <div
            className="rounded-full"
            style={{
              width: 120, height: 120,
              background:
                "radial-gradient(circle, rgba(255,210,120,0.88) 0%, rgba(255,160,80,0.32) 42%, transparent 70%)",
              filter: "blur(7px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 28, height: 28, top: 46, left: 46,
              background:
                "radial-gradient(circle, rgba(255,245,210,1) 0%, rgba(255,210,160,0.85) 55%, transparent 100%)",
              filter: "blur(2px)",
            }}
          />
        </div>

        {/* Horizon atmospheric glow */}
        <div
          className="absolute inset-x-0"
          style={{
            bottom: "30%", height: "22%",
            background:
              "linear-gradient(to top, rgba(160,40,15,0.42) 0%, rgba(100,18,10,0.18) 45%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0"
          style={{
            bottom: "30%", height: "10%",
            background:
              "linear-gradient(to top, rgba(220,80,20,0.22) 0%, transparent 100%)",
          }}
        />
      </SceneLayer>

      {/* ═══ L2: Distant mountain range — blue-violet haze ═══════════════ */}
      <SceneLayer depth={0.12}>
        <svg
          viewBox="0 0 1920 340"
          preserveAspectRatio="none"
          className="absolute bottom-[32%] w-full h-[30%]"
          style={{ filter: "blur(2.5px)" }}
        >
          <defs>
            <linearGradient id="farMtn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16062a" />
              <stop offset="60%" stopColor="#0e0420" />
              <stop offset="100%" stopColor="#090215" />
            </linearGradient>
          </defs>
          <path
            d="M0,340 L0,240 Q50,210 100,230 Q180,175 260,205
               Q360,140 460,185 Q550,110 660,165 Q760,95 870,148
               Q950,105 1050,135 Q1150,75 1270,128
               Q1380,88 1490,118 Q1590,68 1720,105
               Q1820,80 1920,118 L1920,340 Z"
            fill="url(#farMtn)"
          />
          {/* Rock ridge lines suggesting layering */}
          <path
            d="M0,260 Q200,245 400,255 Q600,240 800,250 Q1000,238 1200,248 Q1400,235 1600,245 L1920,240"
            fill="none" stroke="#1c0828" strokeWidth="1.2" opacity="0.4"
          />
        </svg>
      </SceneLayer>

      {/* ═══ L2b: Mid mountain range — warmer, more detail ═══════════════ */}
      <SceneLayer depth={0.2}>
        <svg
          viewBox="0 0 1920 420"
          preserveAspectRatio="none"
          className="absolute bottom-[24%] w-full h-[36%]"
        >
          <defs>
            <linearGradient id="midMtn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#120320" />
              <stop offset="55%" stopColor="#0c0218" />
              <stop offset="100%" stopColor="#070112" />
            </linearGradient>
          </defs>
          <path
            d="M0,420 L0,285 Q40,260 90,278 Q155,225 225,258
               Q310,180 410,230 Q490,160 590,205 Q670,138 770,188
               Q860,115 970,165 Q1060,90 1160,145
               Q1250,102 1350,135 Q1450,78 1560,122
               Q1660,88 1760,115 Q1840,82 1920,105 L1920,420 Z"
            fill="url(#midMtn)"
          />
          {/* Cliff face texture — vertical fracture lines */}
          {[180, 340, 520, 710, 920, 1100, 1300, 1490, 1680].map((x, i) => (
            <line
              key={i}
              x1={x} y1={200 + (i % 3) * 20}
              x2={x + (i % 2 === 0 ? 8 : -6)} y2={420}
              stroke="#180530" strokeWidth="1.2" opacity="0.25"
            />
          ))}
          {/* Horizontal strata lines */}
          <path
            d="M0,320 Q300,308 600,315 Q900,305 1200,312 Q1500,302 1920,310"
            fill="none" stroke="#1a0430" strokeWidth="1" opacity="0.3"
          />
          <path
            d="M0,355 Q400,342 800,348 Q1200,338 1920,345"
            fill="none" stroke="#160428" strokeWidth="0.8" opacity="0.2"
          />
        </svg>
      </SceneLayer>

      {/* ═══ L3: Sith Academy — massive, detailed pyramid complex ════════ */}
      <SceneLayer depth={0.32}>
        <svg
          viewBox="0 0 1920 680"
          preserveAspectRatio="none"
          className="absolute bottom-[10%] w-full h-[60%]"
        >
          <defs>
            <linearGradient id="acFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0114" />
              <stop offset="100%" stopColor="#060010" />
            </linearGradient>
            <linearGradient id="acSide" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0c0118" />
              <stop offset="100%" stopColor="#060010" />
            </linearGradient>
            <radialGradient id="entranceGlow" cx="50%" cy="100%" r="80%">
              <stop offset="0%" stopColor="#c41e3a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff3344" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#c41e3a" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* ── Left cliff formation ─────────────────────────────────── */}
          <path
            d="M0,680 L0,195 Q28,172 56,192 L76,148 Q96,118 128,155
               L162,94 Q190,55 235,100 L278,58 Q325,28 378,78
               L418,138 Q448,178 476,158 L505,218 Q522,258 544,238
               L544,680 Z"
            fill="url(#acFill)"
          />
          {/* Left cliff carved detail lines */}
          {[120, 200, 290, 380].map((x, i) => (
            <line key={i} x1={x} y1={100 + i * 25} x2={x + 10} y2={680}
              stroke="#180330" strokeWidth="1.5" opacity="0.22" />
          ))}
          {/* Left cliff ancient carvings */}
          <rect x="150" y="200" width="60" height="80" rx="2" fill="#0a0118" opacity="0.5" />
          <rect x="160" y="212" width="40" height="15" rx="1" fill="#120228" opacity="0.6" />
          <rect x="160" y="235" width="40" height="15" rx="1" fill="#120228" opacity="0.6" />
          <rect x="160" y="258" width="40" height="15" rx="1" fill="#120228" opacity="0.6" />

          {/* ── Main pyramid — 7 stepped terraces ───────────────────── */}
          {/* Shadow side (right) */}
          <path
            d="M960,30 Q1050,52 1110,115 L1145,175 L1178,238
               L1208,300 L1235,378 L1258,680 L960,680 Z"
            fill="#07010e" opacity="0.5"
          />
          {/* Main body */}
          <path
            d="M664,680 L682,398 L712,318 L745,248 L784,188
               L826,134 Q868,62 960,38 Q1052,62 1094,134
               L1136,188 L1175,248 L1208,318 L1238,398 L1256,680 Z"
            fill="url(#acFill)"
          />
          {/* Terrace step lines */}
          {[
            "M708,398 L740,398 L740,358 L784,358 L784,318 L826,318",
            "M1212,398 L1180,398 L1180,358 L1136,358 L1136,318 L1094,318",
          ].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#1a0432" strokeWidth="2" opacity="0.45" />
          ))}
          {/* Additional terrace detail lines */}
          {[
            "M726,358 L762,358", "M726,318 L762,318",
            "M1194,358 L1158,358", "M1194,318 L1158,318",
          ].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#1e0438" strokeWidth="1" opacity="0.3" />
          ))}

          {/* Flanking towers */}
          <rect x="696" y="270" width="22" height="408" rx="2" fill="#090114" />
          <polygon points="696,270 707,238 718,270" fill="#0a0118" />
          <rect x="1202" y="270" width="22" height="408" rx="2" fill="#090114" />
          <polygon points="1202,270 1213,238 1224,270" fill="#0a0118" />

          {/* Tower windows — glowing red */}
          {[300, 340, 380, 420, 460].map((y, i) => (
            <g key={i}>
              <rect x="703" y={y} width="8" height="12" rx="1" fill="#c41e3a" opacity={0.18 + (i % 2) * 0.1} />
              <rect x="703" y={y} width="8" height="12" rx="1" fill="url(#windowGlow)" opacity="0.5" />
              <rect x="1209" y={y} width="8" height="12" rx="1" fill="#c41e3a" opacity={0.18 + (i % 2) * 0.1} />
              <rect x="1209" y={y} width="8" height="12" rx="1" fill="url(#windowGlow)" opacity="0.5" />
            </g>
          ))}

          {/* Pyramid face windows — rows of glowing slits */}
          {[
            { row: 1, y: 200, count: 3, startX: 876 },
            { row: 2, y: 248, count: 5, startX: 836 },
            { row: 3, y: 298, count: 7, startX: 808 },
          ].map(({ row, y, count, startX }) =>
            Array.from({ length: count }).map((_, i) => (
              <g key={`w-${row}-${i}`}>
                <rect
                  x={startX + i * 40} y={y}
                  width={10} height={14} rx="2"
                  fill="#c41e3a" opacity={0.15 + (i % 3) * 0.05}
                />
                <rect
                  x={startX + i * 40} y={y}
                  width={10} height={14} rx="2"
                  fill="url(#windowGlow)" opacity="0.4"
                />
              </g>
            ))
          )}

          {/* Grand central entrance */}
          <rect x="906" y="340" width="108" height="340" rx="4" fill="#050010" />
          {/* Arch */}
          <path d="M906,340 Q960,282 1014,340" fill="#050010" stroke="#c41e3a" strokeWidth="2.5" opacity="0.55" />
          {/* Arch keystone details */}
          <ellipse cx="960" cy="302" rx="8" ry="5" fill="#c41e3a" opacity="0.3" />
          <ellipse cx="960" cy="302" rx="4" ry="2.5" fill="#c41e3a" opacity="0.6" />
          {/* Inner columns */}
          <rect x="918" y="352" width="10" height="330" rx="2" fill="#080018" />
          <rect x="992" y="352" width="10" height="330" rx="2" fill="#080018" />
          {/* Entrance glow fill */}
          <rect x="906" y="340" width="108" height="340" fill="url(#entranceGlow)" />

          {/* Ancient Sith relief carvings on entrance sides */}
          {[-80, 80].map((offset, side) => (
            <g key={side}>
              <rect x={960 + offset - 12} y="370" width="24" height="120" rx="2" fill="#08001a" opacity="0.7" />
              <line x1={960 + offset} y1="380" x2={960 + offset} y2="480" stroke="#180435" strokeWidth="1" opacity="0.4" />
              {[390, 415, 440, 465].map((y, j) => (
                <rect key={j} x={960 + offset - 8} y={y} width={16} height={5} rx="1" fill="#140330" opacity="0.5" />
              ))}
            </g>
          ))}

          {/* Spires — five total */}
          <polygon points="880,134 886,72 892,134"  fill="#070012" />
          <polygon points="920,100 926,42  932,100"  fill="#080014" />
          <polygon points="954,38  960,0   966,38"   fill="#080014" />
          <polygon points="988,100 994,42  1000,100" fill="#080014" />
          <polygon points="1028,134 1034,72 1040,134" fill="#070012" />

          {/* Pinnacle crystal/beacon */}
          <circle cx="960" cy="0" r="4" fill="#c41e3a" opacity="0.8" />
          <circle cx="960" cy="0" r="8" fill="#c41e3a" opacity="0.2"
            style={{ filter: "blur(3px)" }} />

          {/* ── Right cliff with ancient statue silhouette ──────────── */}
          <path
            d="M1376,680 L1376,215 Q1418,172 1462,198
               L1494,128 Q1534,80 1584,118
               L1625,68 Q1674,28 1725,76
               L1764,48 Q1812,18 1862,56
               L1920,62 L1920,680 Z"
            fill="url(#acFill)"
          />
          {/* Broken pillar on right cliff */}
          <rect x="1502" y="128" width="18" height="90" rx="2" fill="#0e0220" opacity="0.65" />
          <rect x="1500" y="125" width="22" height="6" rx="1" fill="#120328" opacity="0.6" />
          <rect x="1652" y="78" width="14" height="58" rx="2" fill="#0e0220" opacity="0.55" />
          {/* Ancient seated statue silhouette on right cliff */}
          <path
            d="M1740,76 L1740,56 Q1748,44 1758,42 Q1768,44 1776,56
               L1776,76 L1800,76 L1800,82 L1716,82 L1716,76 Z"
            fill="#08010e" opacity="0.7"
          />
          {/* Statue body details */}
          <rect x="1748" y="58" width="22" height="18" rx="2" fill="#0a0118" opacity="0.6" />
          <ellipse cx="1759" cy="54" rx="7" ry="8" fill="#0a0118" opacity="0.6" />
        </svg>

        {/* Academy entrance glow — pulsing */}
        <div
          className="absolute animate-pulse"
          style={{
            width: "22%", height: "42%",
            bottom: "10%", left: "39%",
            background:
              "radial-gradient(ellipse 55% 100% at 50% 100%, rgba(196,30,58,0.28) 0%, rgba(196,30,58,0.06) 55%, transparent 72%)",
            animationDuration: "4s",
          }}
        />
        {/* Wider dim glow */}
        <div
          className="absolute"
          style={{
            width: "46%", height: "22%",
            bottom: "10%", left: "27%",
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(110,16,36,0.15) 0%, transparent 60%)",
          }}
        />
        {/* Pinnacle beacon ray */}
        <div
          className="absolute animate-pulse"
          style={{
            width: "2px", height: "35%",
            bottom: "68%", left: "calc(50% - 1px)",
            background:
              "linear-gradient(to top, rgba(196,30,58,0.6), rgba(196,30,58,0.1), transparent)",
            animationDuration: "3.5s",
          }}
        />
      </SceneLayer>

      {/* ═══ L4: Ancient statues / guardians flanking path ═══════════════ */}
      <SceneLayer depth={0.4}>
        <StatueGuardian side="left" />
        <StatueGuardian side="right" />
      </SceneLayer>

      {/* ═══ L5: Ritual path with altar and rune circles ═════════════════ */}
      <SceneLayer depth={0.45}>
        <svg
          viewBox="0 0 1920 240"
          preserveAspectRatio="none"
          className="absolute bottom-[7%] w-full h-[20%]"
        >
          {/* Main stone path tiles */}
          {[820, 868, 916, 964, 1012, 1060].map((x, i) => (
            <rect key={i} x={x} y={60 + (i % 2) * 4} width={44} height={180} rx="2"
              fill="#0e0318" opacity={0.55 + (i % 2) * 0.1} />
          ))}
          {/* Path edge lines */}
          <line x1="820" y1="60" x2="820" y2="240" stroke="#180535" strokeWidth="1.5" opacity="0.35" />
          <line x1="1104" y1="60" x2="1104" y2="240" stroke="#180535" strokeWidth="1.5" opacity="0.35" />

          {/* Altar slab */}
          <rect x="920" y="40" width="80" height="200" rx="3" fill="#110225" opacity="0.8" />
          <rect x="910" y="36" width="100" height="12" rx="2" fill="#150330" opacity="0.7" />
          {/* Altar rune inscription */}
          {[60, 85, 110, 135, 160, 185].map((y, i) => (
            <rect key={i} x="930" y={y} width="40" height="5" rx="1" fill="#1e0440" opacity="0.45" />
          ))}

          {/* Large outer rune circle */}
          <circle cx="960" cy="140" r="55" fill="none" stroke="#c41e3a" strokeWidth="1.2" opacity="0.18" />
          {/* Medium ring */}
          <circle cx="960" cy="140" r="38" fill="none" stroke="#c41e3a" strokeWidth="0.8" opacity="0.12" />
          {/* Inner ring */}
          <circle cx="960" cy="140" r="22" fill="none" stroke="#c41e3a" strokeWidth="0.6" opacity="0.10" />
          {/* Rune spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={angle}
                x1={960 + Math.cos(rad) * 22} y1={140 + Math.sin(rad) * 22}
                x2={960 + Math.cos(rad) * 55} y2={140 + Math.sin(rad) * 55}
                stroke="#c41e3a" strokeWidth="0.5" opacity="0.10"
              />
            );
          })}

          {/* Left ritual stone cluster */}
          <polygon points="260,155 272,122 284,155" fill="#0c0220" opacity="0.70" />
          <polygon points="296,162 306,138 316,162" fill="#0c0220" opacity="0.60" />
          <polygon points="228,170 238,150 248,170" fill="#0c0220" opacity="0.50" />
          <rect x="260" y="155" width="56" height="6" rx="1" fill="#100328" opacity="0.55" />

          {/* Right ritual stone cluster */}
          <polygon points="1604,150 1616,118 1628,150" fill="#0c0220" opacity="0.70" />
          <polygon points="1638,158 1647,136 1656,158" fill="#0c0220" opacity="0.60" />
          <polygon points="1570,162 1580,144 1590,162" fill="#0c0220" opacity="0.50" />
          <rect x="1604" y="150" width="52" height="6" rx="1" fill="#100328" opacity="0.55" />

          {/* Scattered skull/bone shapes */}
          <ellipse cx="400" cy="175" rx="9" ry="6" fill="#0a0215" opacity="0.4" />
          <ellipse cx="1520" cy="180" rx="9" ry="6" fill="#0a0215" opacity="0.4" />
        </svg>

        {/* Ritual circle glow */}
        <div
          className="absolute animate-pulse"
          style={{
            width: "12%", height: "14%",
            bottom: "7%", left: "44%",
            background: "radial-gradient(ellipse, rgba(196,30,58,0.12) 0%, transparent 70%)",
            animationDuration: "5s",
          }}
        />
      </SceneLayer>

      {/* ═══ L6: Cracked red-earth ground plane ══════════════════════════ */}
      <SceneLayer depth={0.55}>
        <svg
          viewBox="0 0 1920 260"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-[22%]"
        >
          <defs>
            <linearGradient id="groundFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c0a12" />
              <stop offset="50%" stopColor="#140810" />
              <stop offset="100%" stopColor="#0c040c" />
            </linearGradient>
          </defs>
          {/* Main terrain shape */}
          <path
            d="M0,260 L0,105 Q55,88 130,112 Q265,64 420,94
               Q562,44 700,82 Q840,52 960,72
               Q1100,44 1248,78 Q1386,52 1524,86
               Q1660,62 1800,96 L1920,72 L1920,260 Z"
            fill="url(#groundFill)"
          />
          {/* Cracked earth texture — irregular lines */}
          <path d="M120,150 Q200,142 260,155 Q330,146 400,158" fill="none" stroke="#1e0c16" strokeWidth="1.2" opacity="0.35" />
          <path d="M580,130 Q660,122 720,134 Q800,126 870,138" fill="none" stroke="#1e0c16" strokeWidth="1" opacity="0.30" />
          <path d="M1050,142 Q1130,135 1190,148 Q1270,140 1340,152" fill="none" stroke="#1e0c16" strokeWidth="1.2" opacity="0.35" />
          <path d="M1500,128 Q1580,120 1650,132 Q1720,124 1800,136" fill="none" stroke="#1e0c16" strokeWidth="1" opacity="0.28" />
          {/* Secondary terrain layer — sand ripples */}
          <path
            d="M0,260 L0,168 Q100,158 220,170 Q380,152 540,165
               Q700,148 860,162 Q1020,145 1180,160
               Q1340,143 1500,158 Q1660,145 1800,160 L1920,152 L1920,260 Z"
            fill="#140810" opacity="0.6"
          />
          {/* Hot ground cracks glowing red */}
          <path d="M300,180 Q310,192 325,185 Q335,196 345,188" fill="none" stroke="rgba(196,30,58,0.15)" strokeWidth="1.5" />
          <path d="M1200,175 Q1215,188 1228,182 Q1240,195 1250,186" fill="none" stroke="rgba(196,30,58,0.12)" strokeWidth="1.2" />
          <path d="M750,190 Q760,202 772,196" fill="none" stroke="rgba(196,30,58,0.10)" strokeWidth="1" />
        </svg>
      </SceneLayer>

      {/* ═══ L7: Foreground obelisks with fire bowls ═════════════════════ */}
      <SceneLayer depth={0.7}>
        <Obelisk side="left" />
        <Obelisk side="right" />
        <FireBowl side="left" />
        <FireBowl side="right" />
      </SceneLayer>

      {/* ═══ L7b: Floating holocron above academy ════════════════════════ */}
      <SceneLayer depth={0.35}>
        <div className="absolute" style={{ top: "14%", left: "49%" }}>
          <div
            className="absolute -inset-8 rounded-full animate-pulse"
            style={{
              background: "radial-gradient(circle, rgba(196,30,58,0.25) 0%, transparent 70%)",
              animationDuration: "3s",
            }}
          />
          <div
            className="w-6 h-6 bg-blood-500 rounded-sm rotate-45 animate-pulse"
            style={{
              boxShadow:
                "0 0 22px 7px rgba(196,30,58,0.75), 0 0 55px 18px rgba(196,30,58,0.35), 0 0 90px 35px rgba(196,30,58,0.12)",
              animationDuration: "2.5s",
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-blood-500/60 via-blood-500/18 to-transparent"
            style={{ top: "100%", height: 100 }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-t from-blood-500/35 to-transparent"
            style={{ bottom: "100%", height: 48 }}
          />
        </div>
      </SceneLayer>

      {/* ═══ FX: Atmospheric effects ══════════════════════════════════════ */}
      <Particles preset="embers" count={45} />
      <Particles preset="ash"    count={20} />
      <Particles preset="dust"   count={22} />
      <LightRays color="rgba(196, 30, 58, 0.045)" angle={-18} count={5} />
      <LightRays color="rgba(255, 150, 80, 0.025)" angle={28} count={3} />
      {/* Fog hugs the horizon band (FogLayer masks it) so foreground and sky
          keep their detail — distance haze, not a flat wash. */}
      <FogLayer color="rgba(30, 6, 10, 0.22)"  speed={45} direction="left"  />
      <FogLayer color="rgba(60, 10, 22, 0.14)" speed={68} direction="right" />
      <FogLayer color="rgba(100, 28, 148, 0.08)" speed={88} direction="left"  />
      {/* Low ground fog — thin wisp at the very bottom only */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          bottom: 0, height: "10%",
          background:
            "linear-gradient(to top, rgba(20,4,12,0.32) 0%, rgba(20,4,12,0.10) 50%, transparent 100%)",
        }}
      />

      {/* ═══ Vignette & top darkening ════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(3,0,8,0.5)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-black/40 to-transparent" />
    </SceneRenderer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Ornate Sith obelisk with animated rune glyphs
// ═══════════════════════════════════════════════════════════════════════════

function Obelisk({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute bottom-[5%] flex flex-col items-center"
      style={{ [isLeft ? "left" : "right"]: "4%" }}
    >
      <div className="relative">
        {/* Main obelisk body */}
        <div
          className="w-5 sm:w-8 h-52 sm:h-80"
          style={{
            clipPath: "polygon(18% 100%, 82% 100%, 60% 0%, 40% 0%)",
            background:
              "linear-gradient(to right, #050010, #0c0220 35%, #10032a 50%, #0c0220 65%, #050010)",
          }}
        />
        {/* Edge highlight lines */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(18% 100%, 24% 100%, 44% 0%, 40% 0%)",
            background: "linear-gradient(to bottom, rgba(30,4,60,0.6), transparent)",
            opacity: 0.4,
          }}
        />
        {/* Carved rune lines */}
        <div className="absolute inset-0 flex flex-col items-center justify-around py-6 opacity-70">
          <RuneGlyph delay={0}   shape="horizontal" />
          <RuneGlyph delay={1.2} shape="diamond" />
          <RuneGlyph delay={2.5} shape="horizontal" />
          <RuneGlyph delay={3.8} shape="dot" />
          <RuneGlyph delay={0.8} shape="horizontal" />
        </div>
      </div>
      {/* Stepped base */}
      <div className="w-8 sm:w-12 h-2.5 sm:h-4 bg-[#080118] rounded-sm -mt-px" />
      <div className="w-10 sm:w-16 h-1.5 sm:h-2.5 bg-[#060012] rounded-sm -mt-px" />
      {/* Ground glow */}
      <div
        className="absolute -bottom-3 w-16 sm:w-28 h-6 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(196,30,58,0.22) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

function RuneGlyph({ delay, shape }: { delay: number; shape: "horizontal" | "diamond" | "dot" }) {
  if (shape === "diamond") {
    return (
      <div
        className="w-2 sm:w-3 h-2 sm:h-3 rotate-45 animate-pulse"
        style={{
          background: "rgba(196,30,58,0.5)",
          boxShadow: "0 0 6px 2px rgba(196,30,58,0.35)",
          animationDuration: "3.5s",
          animationDelay: `${delay}s`,
        }}
      />
    );
  }
  if (shape === "dot") {
    return (
      <div
        className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full animate-pulse"
        style={{
          background: "rgba(196,30,58,0.6)",
          boxShadow: "0 0 5px 2px rgba(196,30,58,0.4)",
          animationDuration: "4s",
          animationDelay: `${delay}s`,
        }}
      />
    );
  }
  return (
    <div
      className="w-2 sm:w-3 h-3 sm:h-5 rounded-sm animate-pulse"
      style={{
        background:
          "linear-gradient(to bottom, rgba(196,30,58,0.55), rgba(196,30,58,0.18))",
        boxShadow: "0 0 8px 2px rgba(196,30,58,0.3)",
        animationDuration: "3.5s",
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Ancient fire bowl / brazier — foreground light source
// ═══════════════════════════════════════════════════════════════════════════

function FireBowl({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute bottom-[5%]"
      style={{ [isLeft ? "left" : "right"]: isLeft ? "12%" : "11%" }}
    >
      {/* Flame glow */}
      <div
        className="absolute animate-pulse"
        style={{
          width: 60, height: 80,
          bottom: 20, left: -16,
          background:
            "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(255,100,30,0.45) 0%, rgba(196,30,58,0.18) 50%, transparent 80%)",
          animationDuration: "1.8s",
          filter: "blur(4px)",
        }}
      />
      {/* Bowl body */}
      <svg viewBox="0 0 30 40" style={{ width: 30, height: 40 }} aria-hidden="true">
        <path d="M4,24 Q15,30 26,24 L24,38 L6,38 Z" fill="#0c0220" stroke="#180438" strokeWidth="0.6" />
        <rect x="12" y="38" width="6" height="8" rx="1" fill="#0a0118" />
        <rect x="10" y="44" width="10" height="3" rx="1" fill="#080014" />
        {/* Flame */}
        <path d="M10,24 Q12,14 15,10 Q18,14 20,24" fill="rgba(255,100,30,0.6)" />
        <path d="M12,24 Q14,17 15,13 Q16,17 18,24" fill="rgba(255,160,40,0.7)" />
        <circle cx="15" cy="10" r="3" fill="rgba(255,210,80,0.5)" />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Ancient guardian statue silhouette
// ═══════════════════════════════════════════════════════════════════════════

function StatueGuardian({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute bottom-[10%]"
      style={{ [isLeft ? "left" : "right"]: isLeft ? "19%" : "18%", opacity: 0.45 }}
    >
      <svg
        viewBox="0 0 50 120"
        style={{ width: 40, height: 96 }}
        aria-hidden="true"
      >
        {/* Pedestal */}
        <rect x="8" y="108" width="34" height="12" rx="1" fill="#0c0220" />
        <rect x="12" y="104" width="26" height="6" rx="1" fill="#0e0228" />
        {/* Body / robes */}
        <path d="M16,50 L10,108 L40,108 L34,50 Z" fill="#0a0118" />
        {/* Torso */}
        <path d="M18,26 L32,26 L34,52 L16,52 Z" fill="#0c021e" />
        {/* Head */}
        <ellipse cx="25" cy="18" rx="9" ry="11" fill="#0a011a" />
        {/* Crown/helmet spikes */}
        <polygon points="21,8 25,0 29,8" fill="#0c0220" />
        {/* Arm raised holding staff */}
        <path d="M32,30 L44,12 L46,14 L35,33 Z" fill="#0a0118" />
        {/* Staff */}
        <line x1="45" y1="13" x2="48" y2="2" stroke="#0e0228" strokeWidth="2" />
        <polygon points="45,13 48,2 50,4 47,15" fill="#0c0220" />
        {/* Eye slit glow */}
        <rect x="19" y="18" width="12" height="2" rx="1" fill="#c41e3a" opacity="0.3" />
      </svg>
    </div>
  );
}
