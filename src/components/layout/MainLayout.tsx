/**
 * MainLayout.tsx - Tri-Color Balance (White + Black + Omnitrix Green) & 5 Unique Fonts.
 * Includes Local Storage & API Health badge with data reset controls.
 */

import React, { useState, useEffect } from "react";
import { RoleSwitcherBar } from "./RoleSwitcherBar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { usePermission } from "../../features/auth/usePermission";
import { resetPostsThunk, selectAllPosts } from "../../features/posts/postsSlice";
import { resetDraftsThunk, selectAllDrafts } from "../../features/drafts/draftsSlice";
import { getStorageStats } from "../../utils/storage";
import { isOmnitrixMuted, setOmnitrixMuted } from "../omnitrix/soundEngine";
import {
  PenTool,
  Layers,
  Calendar,
  BarChart3,
  ListFilter,
  Radio,
  HardDrive,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";

export interface MainLayoutProps {
  children?: React.ReactNode;
  activeTab: "composer" | "feed" | "drafts" | "calendar" | "analytics";
  onTabChange: (tab: "composer" | "feed" | "drafts" | "calendar" | "analytics") => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const posts = useAppSelector(selectAllPosts);
  const drafts = useAppSelector(selectAllDrafts);

  const canCreate = usePermission("create_post");
  const canManageDrafts = usePermission("manage_drafts");
  const canViewAnalytics = usePermission("view_analytics");

  const [stats, setStats] = useState({ postsCount: 0, draftsCount: 0, bytesUsed: 0 });
  const [isResetting, setIsResetting] = useState(false);
  const [muted, setMuted] = useState<boolean>(() => isOmnitrixMuted());

  useEffect(() => {
    setStats(getStorageStats());
  }, [posts, drafts]);

  const handleResetData = async () => {
    if (window.confirm("Reset all Local Storage data to initial seed posts and drafts?")) {
      setIsResetting(true);
      await Promise.all([dispatch(resetPostsThunk()), dispatch(resetDraftsThunk())]);
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#0A0A0A] font-inter flex flex-col selection:bg-[#3DDC10] selection:text-[#0A0A0A]">
      {/* Top Account View Switcher */}
      <RoleSwitcherBar />

      {/* Main Tri-Color Header (White Container Panel with Black Borders & Green Highlights) */}
      <header className="border-b-4 border-[#3DDC10] bg-[#FFFFFF] sticky top-10 z-30 shadow-card-white">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Logo Badge & Branding (Orbitron + Space Grotesk) */}
          <div className="flex items-center justify-between lg:justify-start gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <div className="w-10 h-10 bg-[#0A0A0A] border-2 border-[#3DDC10] rounded-sm flex items-center justify-center shadow-omni transform rotate-45">
                  <Radio className="w-5 h-5 text-[#3DDC10] transform -rotate-45" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-orbitron font-extrabold tracking-widest text-[#0A0A0A] uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#3DDC10] animate-ping rounded-full"></span>
                  OMNITRIX SOCIAL SUITE
                </span>
                <h1 className="text-xl font-space font-extrabold text-[#0A0A0A] uppercase tracking-wider">
                  POST MANAGER <span className="text-[#3DDC10] bg-[#0A0A0A] px-1.5 py-0.5 rounded-sm">&amp; SCHEDULER</span>
                </h1>
              </div>
            </div>

            {/* Storage Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-[#0A0A0A] text-[#FFFFFF] px-2.5 py-1.5 rounded-sm border border-[#3DDC10] text-[11px] font-mono">
              <HardDrive className="w-3.5 h-3.5 text-[#3DDC10]" />
              <span>
                STORAGE: <strong className="text-[#3DDC10]">{stats.postsCount}</strong> POSTS /{" "}
                <strong className="text-[#3DDC10]">{stats.draftsCount}</strong> DRAFTS
              </span>
              <button
                onClick={handleResetData}
                disabled={isResetting}
                title="Reset Local Storage data to defaults"
                className="ml-1 text-[#FFFFFF] hover:text-[#3DDC10] transition-colors p-0.5 rounded focus:outline-none"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin text-[#3DDC10]" : ""}`} />
              </button>
            </div>

            {/* Omnitrix Sound Mute Toggle */}
            <button
              onClick={() => {
                const nextMuted = !muted;
                setMuted(nextMuted);
                setOmnitrixMuted(nextMuted);
              }}
              title={muted ? "Unmute Omnitrix SFX" : "Mute Omnitrix SFX"}
              className="hidden sm:flex items-center gap-1.5 bg-[#0A0A0A] hover:bg-[#141414] text-[#FFFFFF] px-2.5 py-1.5 rounded-sm border border-[#2A2A2A] hover:border-[#3DDC10] text-[11px] font-mono transition-colors"
            >
              {muted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span className="text-[#FF7A00]">SFX: MUTED</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#3DDC10]" />
                  <span className="text-[#3DDC10]">SFX: ACTIVE</span>
                </>
              )}
            </button>
          </div>

          {/* Navigation Tabs (Rajdhani Font) */}
          <nav className="flex items-center gap-1.5 bg-[#0A0A0A] p-1.5 rounded-sm border-2 border-[#0A0A0A] overflow-x-auto w-full lg:w-auto">
            <button
              onClick={() => onTabChange("feed")}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                activeTab === "feed"
                  ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                  : "text-[#FFFFFF] hover:text-[#3DDC10] hover:bg-[#141414]"
              }`}
            >
              <ListFilter className="w-4 h-4" /> ALL POSTS
            </button>

            {canCreate && (
              <button
                onClick={() => onTabChange("composer")}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                  activeTab === "composer"
                    ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                    : "text-[#FFFFFF] hover:text-[#3DDC10] hover:bg-[#141414]"
                }`}
              >
                <PenTool className="w-4 h-4" /> CREATE POST
              </button>
            )}

            {canManageDrafts && (
              <button
                onClick={() => onTabChange("drafts")}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                  activeTab === "drafts"
                    ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                    : "text-[#FFFFFF] hover:text-[#3DDC10] hover:bg-[#141414]"
                }`}
              >
                <Layers className="w-4 h-4" /> SAVED DRAFTS
              </button>
            )}

            <button
              onClick={() => onTabChange("calendar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                activeTab === "calendar"
                  ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                  : "text-[#FFFFFF] hover:text-[#3DDC10] hover:bg-[#141414]"
              }`}
            >
              <Calendar className="w-4 h-4" /> CALENDAR
            </button>

            {canViewAnalytics && (
              <button
                onClick={() => onTabChange("analytics")}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                  activeTab === "analytics"
                    ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                    : "text-[#FFFFFF] hover:text-[#3DDC10] hover:bg-[#141414]"
                }`}
              >
                <BarChart3 className="w-4 h-4" /> ANALYTICS
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {children}
      </main>

      {/* Tri-Color Footer (White Background with Black Text and Green Accent) */}
      <footer className="border-t-2 border-[#0A0A0A] bg-[#FFFFFF] py-4 px-4 text-center text-xs text-[#0A0A0A] flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <p className="font-orbitron font-extrabold text-[#0A0A0A] tracking-widest uppercase text-[11px] flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-[#3DDC10] rounded-full"></span>
          OMNITRIX MULTI-CHANNEL SCHEDULING PLATFORM
        </p>
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#0A0A0A]">
          <span>PERSISTENCE: LOCALSTORAGE</span>
          <span>•</span>
          <span>API: TYPED CLIENT</span>
        </div>
      </footer>
    </div>
  );
};
