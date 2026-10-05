/**
 * LandingPage.tsx - High-Impact 3D Omnitrix Marketing Landing Page.
 *
 * Light / Tri-Color White Background Theme (Clean White + Deep Black + Hazard Green).
 * Strictly zero "//" anywhere in user-facing UI.
 *
 * FEATURES:
 * 1. 3D Omnitrix Hero Dial: GPU-accelerated CSS 3D perspective with mouse parallax,
 *    multi-layered hazard rings, and pulsing green core aura on crisp white background.
 * 2. 8 Real-World Feature Showcase Cards (1:1 with app modules):
 *    - Compose & Publish, Schedule, Drafts, Live Feed, Analytics, RBAC, AI Assistant, Tactile Cursor.
 *    - 3D tilt-on-hover physics with single-accent neon glow.
 * 3. 10 Alien Hero Transformation Showcase: Interactive previews of the animated alien copilot roster.
 * 4. Honest Demo Onboarding Modal: Explains role-based demo system with 1-click launch for
 *    Editor, Admin, and Viewer seeded accounts.
 * 5. Integrated Sign In Modal: Seamlessly triggers the authenticated workspace.
 * 6. Typography: Strictly Sekuya for all headings, Switzer for body copy.
 */

import React, { useState, useRef, useCallback } from "react";
import { useAppDispatch } from "../../app/hooks";
import { loginThunk } from "../auth/authSlice";
import { ALIEN_REGISTRY, AlienAvatarConfig } from "../assistant/alienRegistry";
import { LoginForm } from "../auth/LoginForm";
import {
  Send,
  Calendar,
  FileText,
  Radio,
  BarChart3,
  Shield,
  Sparkles,
  MousePointer,
  Check,
  ArrowRight,
  Lock,
  X,
  ChevronRight,
  Zap,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.FC<{ className?: string }>;
  badge: string;
  title: string;
  description: string;
  bullets: string[];
}

const FeatureCard3D: React.FC<FeatureCardProps> = ({
  icon: Icon,
  badge,
  title,
  description,
  bullets,
}) => {
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 10, y: x * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : "perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)",
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
        willChange: "transform",
      }}
      className="relative p-6 rounded-sm bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] hover:border-[#3DDC10] transition-colors duration-200 flex flex-col justify-between group shadow-sm hover:shadow-omni"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3DDC10] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="space-y-4">
        {/* Header with Icon and Badge */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-sm bg-[#0A0A0A] border border-[#3DDC10]/40 text-[#3DDC10] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Icon className="w-6 h-6" />
          </div>
          <span className="badge-omni badge-omni-neutral">
            {badge}
          </span>
        </div>

        {/* Title and Description */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-sekuya text-[#0A0A0A] tracking-wide group-hover:text-[#3DDC10] transition-colors">
            {title}
          </h3>
          <p className="text-xs font-inter font-normal text-[#52525B] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bullet Points */}
        <ul className="space-y-1.5 pt-2 border-t border-[#E5E7EB]">
          {bullets.map((b, idx) => (
            <li key={idx} className="flex items-center gap-2 text-[11px] font-inter font-normal text-[#27272A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC10] shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between text-[11px] font-mono text-[#71717A] group-hover:text-[#3DDC10] transition-colors border-t border-[#E5E7EB]">
        <span>OMNIPOST PROTOCOL</span>
        <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Hero Dial 3D Parallax state
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroTilt, setHeroTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroTilt({ x: -y * 14, y: x * 14 });
  };

  const handleHeroMouseLeave = () => {
    setHeroTilt({ x: 0, y: 0 });
  };

  // 1-Click Launch Handlers for Demo Accounts
  const handleLaunchRole = useCallback(
    (role: "admin" | "editor" | "viewer") => {
      dispatch(loginThunk({ username: role, passwordHash: "password123" }));
      setIsDemoModalOpen(false);
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0A0A0A] font-inter selection:bg-[#3DDC10] selection:text-[#0A0A0A] relative overflow-x-hidden">
      {/* Background Architectural Blueprint Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient Green Aura Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3DDC10]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[300px] bg-[#3DDC10]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo with Omnitrix Diamond Crest */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#0A0A0A] border-2 border-[#3DDC10] flex items-center justify-center shadow-omni transform rotate-45">
              <Radio className="w-5 h-5 text-[#3DDC10] transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sekuya text-xl text-[#0A0A0A] tracking-wider leading-none">
                  OMNIPOST
                </span>
                <span className="badge-omni badge-omni-green text-[9px] px-1.5 py-0.5">
                  v2.5
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">
                SOCIAL TRANSMISSION ENGINE
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Clean, No //) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-rajdhani font-bold tracking-wider text-[#52525B]">
            <a href="#features" className="hover:text-[#3DDC10] transition-colors">
              FEATURES
            </a>
            <a href="#aliens" className="hover:text-[#3DDC10] transition-colors">
              ALIEN COPILOTS
            </a>
            <a href="#rbac" className="hover:text-[#3DDC10] transition-colors">
              ROLE GOVERNANCE
            </a>
            <a href="#demo" className="hover:text-[#3DDC10] transition-colors">
              DEMO ARCHITECTURE
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="h-9 px-4 rounded-sm border-2 border-[#0A0A0A] bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-xs font-rajdhani font-bold uppercase tracking-wider text-[#0A0A0A] transition-all"
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="h-9 px-4 rounded-sm bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] border-2 border-[#0A0A0A] font-rajdhani font-bold uppercase tracking-wider text-xs shadow-omni hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-[#0A0A0A]" />
              TRY DEMO
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION WITH 3D OMNITRIX DIAL */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Text Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="badge-omni badge-omni-green rounded-full px-3.5 py-1 text-xs border border-[#3DDC10] bg-[#3DDC10]/10 text-[#0A0A0A] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#3DDC10] animate-ping" />
              OMNITRIX LEVEL SOCIAL DEPLOYMENT PLATFORM
            </div>

            <h1 className="font-sekuya text-3xl sm:text-5xl lg:text-6xl text-[#0A0A0A] leading-tight tracking-wide">
              COMMAND YOUR SOCIAL BROADCASTS WITH{" "}
              <span className="text-[#3DDC10] drop-shadow-[0_0_12px_rgba(61,220,16,0.35)]">
                HEROIC PRECISION
              </span>
            </h1>

            <p className="text-sm sm:text-base font-inter font-normal text-[#52525B] max-w-2xl leading-relaxed tracking-[-0.01em]">
              Seamlessly orchestrate Twitter/X, LinkedIn, Instagram, and Facebook transmissions.
              Backed by role-based duty segregation, interactive calendar slot locking, and 10 animated
              Ben 10 alien AI copilots ready to guide your campaigns.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(true)}
                className="h-11 px-6 bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] border-2 border-[#0A0A0A] font-rajdhani font-bold uppercase tracking-wider text-sm rounded-sm shadow-omni hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-2.5"
              >
                <Zap className="w-4 h-4 fill-[#0A0A0A]" />
                LAUNCH DEMO CONSOLE
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="h-11 px-6 bg-[#FFFFFF] hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-[#FFFFFF] border-2 border-[#0A0A0A] font-rajdhani font-bold uppercase tracking-wider text-sm rounded-sm transition-all flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#3DDC10]" />
                SIGN IN WITH CREDENTIALS
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E5E7EB]">
              <div>
                <span className="font-sekuya text-xl sm:text-2xl text-[#0A0A0A] block">4 CHANNELS</span>
                <span className="text-[10px] font-mono text-[#71717A] uppercase font-bold">Twitter • IN • IG • FB</span>
              </div>
              <div>
                <span className="font-sekuya text-xl sm:text-2xl text-[#0A0A0A] block">10 ALIEN HEROES</span>
                <span className="text-[10px] font-mono text-[#71717A] uppercase font-bold">AI Copilot Forms</span>
              </div>
              <div>
                <span className="font-sekuya text-xl sm:text-2xl text-[#0A0A0A] block">60+ FPS</span>
                <span className="text-[10px] font-mono text-[#71717A] uppercase font-bold">Tactile Cursor</span>
              </div>
              <div>
                <span className="font-sekuya text-xl sm:text-2xl text-[#0A0A0A] block">ZERO DATA LOSS</span>
                <span className="text-[10px] font-mono text-[#71717A] uppercase font-bold">Auto-Saving Drafts</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Layered Omnitrix Hero Dial */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div
              style={{
                transform: `perspective(900px) rotateX(${heroTilt.x}deg) rotateY(${heroTilt.y}deg)`,
                transition: "transform 0.15s ease-out",
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
              className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] flex items-center justify-center select-none"
            >
              {/* Outer Radiating Pulse Waves */}
              <div className="absolute inset-0 rounded-full border border-[#3DDC10]/30 animate-ping pointer-events-none" />
              <div className="absolute -inset-6 rounded-full border border-[#3DDC10]/20 pointer-events-none" />

              {/* Layer 1: Outer Gunmetal Beveled Ring */}
              <div
                style={{ transform: "translateZ(20px)" }}
                className="absolute inset-0 rounded-full bg-[#181818] border-4 border-[#0A0A0A] shadow-2xl flex items-center justify-center"
              >
                {/* Dial Tick Marks */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <div
                    key={deg}
                    style={{ transform: `rotate(${deg}deg) translateY(-135px)` }}
                    className="absolute w-1 h-3 bg-[#404040] rounded-full"
                  />
                ))}
              </div>

              {/* Layer 2: Hazard Ring with Omnitrix Green Accents */}
              <div
                style={{ transform: "translateZ(45px)" }}
                className="absolute w-[230px] h-[230px] sm:w-[290px] sm:h-[290px] rounded-full bg-[#0A0A0A] border-4 border-[#3DDC10] shadow-[0_0_30px_#3DDC10] flex items-center justify-center"
              >
                {/* Four Cardinal Omnitrix Push Buttons */}
                <div className="absolute top-2 w-5 h-2 bg-[#3DDC10] rounded-sm shadow-omni" />
                <div className="absolute bottom-2 w-5 h-2 bg-[#3DDC10] rounded-sm shadow-omni" />
                <div className="absolute left-2 h-5 w-2 bg-[#3DDC10] rounded-sm shadow-omni" />
                <div className="absolute right-2 h-5 w-2 bg-[#3DDC10] rounded-sm shadow-omni" />

                {/* Layer 3: Central Omnitrix Core Hourglass Symbol */}
                <div
                  style={{ transform: "translateZ(70px)" }}
                  className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full bg-[#141414] border-4 border-[#0A0A0A] flex items-center justify-center overflow-hidden shadow-inner"
                >
                  {/* Glowing Green Hourglass Silhouette */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-[#3DDC10] drop-shadow-[0_0_12px_#3DDC10]"
                  >
                    {/* Upper Triangle */}
                    <polygon points="12,12 88,12 50,50" fill="#3DDC10" />
                    {/* Lower Triangle */}
                    <polygon points="12,88 88,88 50,50" fill="#3DDC10" />
                    {/* Central Core Divider */}
                    <circle cx="50" cy="50" r="14" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="3" />
                  </svg>

                  {/* Core Status Center Indicator */}
                  <div className="absolute w-4 h-4 rounded-full bg-[#3DDC10] animate-pulse shadow-[0_0_10px_#3DDC10]" />
                </div>
              </div>

              {/* Status Floating Pill (No //) */}
              <div
                style={{ transform: "translateZ(90px)" }}
                className="absolute -bottom-4 bg-[#0A0A0A] border-2 border-[#3DDC10] px-4 py-1 rounded-full text-[10px] font-mono text-[#3DDC10] font-bold uppercase tracking-widest shadow-omni flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC10] animate-ping" />
                CORE ACTIVE • ROTATE 3D
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. EIGHT 1:1 FEATURE SHOWCASE CARDS */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-[#F8F9FA] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Section Header (No //) */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="badge-omni badge-omni-green inline-block">
              ARCHITECTURAL CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-sekuya text-[#0A0A0A] tracking-wide">
              EVERY TAB ENGINEERED FOR DOMINANCE
            </h2>
            <p className="text-xs sm:text-sm font-inter font-normal text-[#52525B]">
              Explore the 8 integrated modules powering the OmniPost multi-channel broadcasting matrix.
            </p>
          </div>

          {/* 8 Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Post Composer */}
            <FeatureCard3D
              icon={Send}
              badge="COMPOSER"
              title="Compose & Multi-Publish"
              description="Unified authoring canvas for Twitter/X, LinkedIn, Instagram, and Facebook with real-time constraint validation."
              bullets={[
                "Real-time character quota counters",
                "Cross-channel media attachments",
                "1-click instant broadcast dispatch",
              ]}
            />

            {/* Feature 2: Schedule & Calendar */}
            <FeatureCard3D
              icon={Calendar}
              badge="SCHEDULE"
              title="Tactical Schedule Calendar"
              description="Lock in transmission time slots with visual day/week/month views and instant slot rescheduling."
              bullets={[
                "Interactive date & time picker",
                "Visual queue countdown tracking",
                "Chronological broadcast ordering",
              ]}
            />

            {/* Feature 3: Smart Drafts */}
            <FeatureCard3D
              icon={FileText}
              badge="DRAFTS"
              title="Zero-Loss Draft Repository"
              description="Automatic draft persistence with multi-revision history, status flags, and seamless promote-to-publish workflows."
              bullets={[
                "Local & server synchronized storage",
                "Instant reload into live composer",
                "Complete revision audit trail",
              ]}
            />

            {/* Feature 4: Live Social Feed */}
            <FeatureCard3D
              icon={Radio}
              badge="FEED"
              title="Consolidated Social Stream"
              description="Monitor all published transmissions, scheduled broadcasts, and platform distributions in one unified feed."
              bullets={[
                "Platform icon badge indicators",
                "Direct post deletion & management",
                "Live publication status tags",
              ]}
            />

            {/* Feature 5: Telemetry Analytics */}
            <FeatureCard3D
              icon={BarChart3}
              badge="ANALYTICS"
              title="Mission Telemetry & KPIs"
              description="Inspect platform distribution ratios, scheduling velocity, engagement KPIs, and broadcast performance."
              bullets={[
                "Platform distribution breakdown",
                "Total transmissions aggregate",
                "High-velocity scheduling trends",
              ]}
            />

            {/* Feature 6: Strict RBAC */}
            <FeatureCard3D
              icon={Shield}
              badge="RBAC"
              title="Enterprise Role Governance"
              description="Duty segregation enforced across Admin, Editor, and Viewer clearances with Spring Security 6."
              bullets={[
                "Admin: Security audit & activity logs",
                "Editor: Full authoring & scheduling",
                "Viewer: Read-only strategic telemetry",
              ]}
            />

            {/* Feature 7: Omnitrix AI Assistant */}
            <FeatureCard3D
              icon={Sparkles}
              badge="AI COPILOT"
              title="10-Alien Omnitrix Assistant"
              description="Context-aware AI copilot offering transmission timing protocols, platform limits, and tactical role guidance."
              bullets={[
                "10 animated Ben 10 alien heroes",
                "Docked right panel with contained scroll",
                "Local knowledge + Spring Boot proxy",
              ]}
            />

            {/* Feature 8: Tactile Cursor */}
            <FeatureCard3D
              icon={MousePointer}
              badge="HARDWARE"
              title="Tactile Omnitrix Cursor"
              description="Hardware-accelerated target reticle with smooth 60fps+ tracking, snappy tab snapping, and click feedback."
              bullets={[
                "Zero-lag single rAF loop",
                "Tab focus re-synchronization",
                "GPU translate3d positioning",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. 10 ALIEN HERO COPILOTS ROSTER PREVIEW */}
      {/* ========================================================================= */}
      <section id="aliens" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12 bg-[#FFFFFF]">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="badge-omni badge-omni-green inline-block">
            DNA MATRIX TRANSFORMATIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-sekuya text-[#0A0A0A] tracking-wide">
            10 BATTLE-READY ALIEN COPILOTS
          </h2>
          <p className="text-xs sm:text-sm font-inter font-normal text-[#52525B]">
            Choose your copilot's DNA transformation form to activate custom animations, voice personas, and tactical insights.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ALIEN_REGISTRY.map((alien: AlienAvatarConfig) => {
            const AlienIcon = alien.Component;
            return (
              <div
                key={alien.id}
                className="p-4 rounded-sm bg-[#FFFFFF] border-2 border-[#0A0A0A] hover:border-[#3DDC10] transition-colors group flex flex-col items-center text-center space-y-3 shadow-sm hover:shadow-omni"
              >
                <div className="w-16 h-16 rounded-sm bg-[#F4F4F5] border border-[#E5E7EB] p-2 flex items-center justify-center shadow-sm group-hover:border-[#3DDC10]/60">
                  <AlienIcon className="w-full h-full transform group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="font-sekuya text-sm text-[#0A0A0A] group-hover:text-[#3DDC10] transition-colors">
                    {alien.name}
                  </h4>
                  <span className="badge-omni badge-omni-green mt-1">
                    {alien.element}
                  </span>
                  <span className="text-[9px] font-mono text-[#71717A] uppercase block truncate mt-1">
                    {alien.species.split(" ")[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ROLE-BASED ACCESS & DEMO ONBOARDING */}
      {/* ========================================================================= */}
      <section id="rbac" className="py-20 bg-[#F8F9FA] border-t border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="badge-omni badge-omni-green inline-block">
              ROLE SEPARATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-sekuya text-[#0A0A0A] tracking-wide">
              CLEAR-CUT ENTERPRISE GOVERNANCE
            </h2>
            <p className="text-xs sm:text-sm font-inter font-normal text-[#52525B]">
              Test any role instantly in our sandbox environment without creating new credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Editor Role Card (Elevated Recommended Role) */}
            <div className="p-6 rounded-sm bg-[#FFFFFF] border-2 border-[#3DDC10] space-y-4 shadow-omni text-[#0A0A0A] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sekuya text-lg text-[#0A0A0A]">EDITOR</span>
                  <span className="badge-omni badge-omni-green">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-xs font-inter font-normal leading-relaxed text-[#52525B]">
                  Content deployment specialist. Full authoring canvas, multi-channel scheduling, and draft management.
                </p>
                <ul className="space-y-1.5 text-xs font-inter text-[#27272A] pt-2 border-t border-[#E5E7EB]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" /> Create, edit, publish posts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" /> Interactive scheduling calendar
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" /> Save and revise drafts
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchRole("editor")}
                className="w-full h-10 bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] border-2 border-[#0A0A0A] font-rajdhani font-bold uppercase text-xs tracking-wider rounded-sm shadow-omni hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                LAUNCH AS EDITOR →
              </button>
            </div>

            {/* Admin Role Card */}
            <div className="p-6 rounded-sm bg-[#FFFFFF] border-2 border-[#0A0A0A] hover:border-[#3DDC10]/60 space-y-4 transition-colors text-[#0A0A0A] flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sekuya text-lg text-[#0A0A0A]">ADMIN</span>
                  <span className="badge-omni badge-omni-neutral bg-[#0A0A0A] text-[#FFFFFF]">
                    GOVERNANCE
                  </span>
                </div>
                <p className="text-xs font-inter font-normal leading-relaxed text-[#52525B]">
                  Security and system oversight. Exclusive access to the system Activity Log and draft revision audits.
                </p>
                <ul className="space-y-1.5 text-xs font-inter text-[#27272A] pt-2 border-t border-[#E5E7EB]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" /> Inspect system Activity Log
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" /> Full draft audit inspection
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" /> High-level analytics review
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchRole("admin")}
                className="w-full h-10 bg-[#FFFFFF] hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-[#FFFFFF] border-2 border-[#0A0A0A] font-rajdhani font-bold uppercase text-xs tracking-wider rounded-sm transition-all flex items-center justify-center gap-2"
              >
                LAUNCH AS ADMIN →
              </button>
            </div>

            {/* Viewer Role Card */}
            <div className="p-6 rounded-sm bg-[#FFFFFF] border-2 border-[#0A0A0A] hover:border-[#3DDC10]/60 space-y-4 transition-colors text-[#0A0A0A] flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sekuya text-lg text-[#0A0A0A]">VIEWER</span>
                  <span className="badge-omni badge-omni-muted bg-[#F4F4F5] text-[#71717A] border-[#E5E7EB]">
                    READ-ONLY
                  </span>
                </div>
                <p className="text-xs font-inter font-normal leading-relaxed text-[#52525B]">
                  Observer clearance. View published feeds, scheduled timelines, and high-level campaign metrics in read-only mode.
                </p>
                <ul className="space-y-1.5 text-xs font-inter text-[#27272A] pt-2 border-t border-[#E5E7EB]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" /> View Feed transmissions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" /> Review saved drafts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" /> Explore analytics dashboards
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchRole("viewer")}
                className="w-full h-10 bg-[#FFFFFF] hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-[#FFFFFF] border-2 border-[#0A0A0A] font-rajdhani font-bold uppercase text-xs tracking-wider rounded-sm transition-all flex items-center justify-center gap-2"
              >
                LAUNCH AS VIEWER →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-10 border-t border-[#E5E7EB] bg-[#FFFFFF] text-xs font-mono text-[#71717A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#0A0A0A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3DDC10] animate-pulse" />
            <span>OMNITRIX NETWORK STATUS: ONLINE</span>
          </div>
          <div className="text-center sm:text-right text-[#71717A]">
            <span>OMNIPOST v2.5 • REACT 19 + SPRING BOOT 3 RBAC SUITE</span>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 7. HONEST SIGN-UP / DEMO ONBOARDING MODAL */}
      {/* ========================================================================= */}
      {isDemoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsDemoModalOpen(false)}
        >
          <div
            className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm max-w-lg w-full p-6 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-[#0A0A0A] border border-[#3DDC10] text-[#3DDC10] flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-[#3DDC10]" />
                </div>
                <div>
                  <h3 className="font-sekuya text-lg text-[#0A0A0A]">
                    TRY OMNIPOST DEMO
                  </h3>
                  <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider font-bold">
                    NO REGISTRATION REQUIRED • 1-CLICK INSTANT ACCESS
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(false)}
                className="text-[#71717A] hover:text-[#0A0A0A] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-inter font-normal text-[#27272A]">
              <p className="leading-relaxed">
                OmniPost uses an authentic Spring Boot 3 enterprise RBAC model. To let you experience
                all duty segregations instantly, choose one of the seeded access credentials below:
              </p>

              {/* 3 Role Selection Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleLaunchRole("editor")}
                  className="w-full p-3 bg-[#FFFFFF] border-2 border-[#3DDC10] rounded-sm flex items-center justify-between hover:bg-[#3DDC10] hover:text-[#0A0A0A] group transition-all shadow-sm"
                >
                  <div className="text-left">
                    <span className="font-sekuya text-sm block text-[#0A0A0A] group-hover:text-[#0A0A0A]">
                      1. EDITOR (RECOMMENDED)
                    </span>
                    <span className="text-[10px] font-mono text-[#52525B] group-hover:text-[#0A0A0A]">
                      Full compose, calendar scheduling, publish & draft controls
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[#3DDC10] group-hover:text-[#0A0A0A]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchRole("admin")}
                  className="w-full p-3 bg-[#FFFFFF] border-2 border-[#0A0A0A] hover:border-[#3DDC10] rounded-sm flex items-center justify-between hover:bg-[#0A0A0A] hover:text-[#FFFFFF] transition-all shadow-sm group"
                >
                  <div className="text-left">
                    <span className="font-sekuya text-sm block text-[#0A0A0A] group-hover:text-[#FFFFFF]">
                      2. ADMIN
                    </span>
                    <span className="text-[10px] font-mono text-[#52525B] group-hover:text-[#D4D4D8]">
                      Audit activity logs, inspect revision trails, and overview telemetry
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[#0A0A0A] group-hover:text-[#FFFFFF]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchRole("viewer")}
                  className="w-full p-3 bg-[#FFFFFF] border-2 border-[#0A0A0A] hover:border-[#3DDC10] rounded-sm flex items-center justify-between hover:bg-[#0A0A0A] hover:text-[#FFFFFF] transition-all shadow-sm group"
                >
                  <div className="text-left">
                    <span className="font-sekuya text-sm block text-[#0A0A0A] group-hover:text-[#FFFFFF]">
                      3. VIEWER
                    </span>
                    <span className="text-[10px] font-mono text-[#52525B] group-hover:text-[#D4D4D8]">
                      Read-only social feeds, scheduled timelines, and analytics
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[#0A0A0A] group-hover:text-[#FFFFFF]" />
                </button>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-sm border border-[#E5E7EB] text-[11px] font-mono text-[#52525B] flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" />
                <span>Password for all demo accounts: <code className="bg-[#3DDC10]/20 text-[#0A0A0A] px-1.5 py-0.5 rounded font-bold border border-[#3DDC10]/40">password123</code></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SIGN IN MODAL */}
      {/* ========================================================================= */}
      {isLoginModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close modal X button */}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-sm bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] border-2 border-[#0A0A0A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <LoginForm isModal={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
