/**
 * MainLayout.tsx - Tri-Color Balance (White + Black + Omnitrix Green) & 5 Unique Fonts.
 * Includes Local Storage & API Health badge with data reset controls.
 * Memoized with React.memo and stable useCallback handlers.
 */

import React, { useState, useEffect, useCallback } from "react";
import { RoleSwitcherBar } from "./RoleSwitcherBar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { usePermission } from "../../features/auth/usePermission";
import { resetPostsThunk, selectAllPosts } from "../../features/posts/postsSlice";
import { resetDraftsThunk, selectAllDrafts } from "../../features/drafts/draftsSlice";
import { selectIsAssistantOpen } from "../../features/assistant/assistantSlice";
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
  Shield,
} from "lucide-react";

export interface MainLayoutProps {
  children?: React.ReactNode;
  activeTab: "composer" | "feed" | "drafts" | "calendar" | "analytics" | "activity";
  onTabChange: (tab: "composer" | "feed" | "drafts" | "calendar" | "analytics" | "activity") => void;
}

export const MainLayout: React.FC<MainLayoutProps> = React.memo(
  ({ children, activeTab, onTabChange }) => {
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectAllPosts);
    const drafts = useAppSelector(selectAllDrafts);
    const isAssistantOpen = useAppSelector(selectIsAssistantOpen);

    const canCreate = usePermission("create_post");
    const canManageDrafts = usePermission("manage_drafts");
    const canViewDraftAudit = usePermission("view_draft_audit");
    const canViewAnalytics = usePermission("view_analytics");
    const canViewActivityLog = usePermission("view_activity_log");

    const [stats, setStats] = useState({ postsCount: 0, draftsCount: 0, bytesUsed: 0 });
    const [isResetting, setIsResetting] = useState(false);
    const [muted, setMuted] = useState<boolean>(() => isOmnitrixMuted());

    useEffect(() => {
      setStats(getStorageStats());
    }, [posts, drafts]);

    const handleResetData = useCallback(async () => {
      if (window.confirm("Reset all Local Storage data to initial seed posts and drafts?")) {
        setIsResetting(true);
        await Promise.all([dispatch(resetPostsThunk()), dispatch(resetDraftsThunk())]);
        setIsResetting(false);
      }
    }, [dispatch]);

    const handleToggleMute = useCallback(() => {
      setMuted((prevMuted) => {
        const nextMuted = !prevMuted;
        setOmnitrixMuted(nextMuted);
        return nextMuted;
      });
    }, []);

    const handleTabFeed = useCallback(() => onTabChange("feed"), [onTabChange]);
    const handleTabComposer = useCallback(() => onTabChange("composer"), [onTabChange]);
    const handleTabDrafts = useCallback(() => onTabChange("drafts"), [onTabChange]);
    const handleTabCalendar = useCallback(() => onTabChange("calendar"), [onTabChange]);
    const handleTabAnalytics = useCallback(() => onTabChange("analytics"), [onTabChange]);
    const handleTabActivity = useCallback(() => onTabChange("activity"), [onTabChange]);

    return (
      <div
        className={`min-h-screen bg-[#FFFFFF] text-[#0A0A0A] font-inter flex flex-col selection:bg-[#3DDC10] selection:text-[#0A0A0A] transition-[margin] duration-300 ${
          isAssistantOpen ? "xl:mr-[420px]" : "mr-0"
        }`}
      >
        {/* Unified Sticky Header Container (Role Switcher + Navigation Header) */}
        <div className="sticky top-0 z-40 shadow-sm">
          <RoleSwitcherBar />
          {/* Main Header (Clean White Surface with Hazard Green Underline) */}
          <header className="border-b border-[#E5E7EB] bg-[#FFFFFF]/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Logo Badge & Branding */}
              <div className="flex items-center justify-between lg:justify-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                    <div className="w-9 h-9 bg-[#0A0A0A] border-2 border-[#3DDC10] rounded-sm flex items-center justify-center shadow-omni transform rotate-45">
                      <Radio className="w-4 h-4 text-[#3DDC10] transform -rotate-45" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#71717A] uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#3DDC10] animate-ping rounded-full"></span>
                      OMNITRIX SOCIAL SUITE
                    </span>
                    <h1 className="text-lg font-sekuya font-bold text-[#0A0A0A] uppercase tracking-wider">
                      POST MANAGER <span className="text-[#3DDC10]">&amp; SCHEDULER</span>
                    </h1>
                  </div>
                </div>

              {/* Storage Badge */}
              <div className="hidden sm:flex items-center gap-2 bg-[#FFFFFF] text-[#0A0A0A] px-2.5 py-1.5 rounded-sm border-2 border-[#0A0A0A] text-[11px] font-mono">
                <HardDrive className="w-3.5 h-3.5 text-[#3DDC10]" />
                <span>
                  STORAGE: <strong className="text-[#0A0A0A]">{stats.postsCount}</strong> POSTS /{" "}
                  <strong className="text-[#0A0A0A]">{stats.draftsCount}</strong> DRAFTS
                </span>
                <button
                  onClick={handleResetData}
                  disabled={isResetting}
                  title="Reset Local Storage data to defaults"
                  className="ml-1 text-[#0A0A0A] hover:text-[#3DDC10] transition-colors p-0.5 rounded focus:outline-none"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin text-[#3DDC10]" : ""}`} />
                </button>
              </div>

              {/* Omnitrix Sound Mute Toggle */}
              <button
                onClick={handleToggleMute}
                title={muted ? "Unmute Omnitrix SFX" : "Mute Omnitrix SFX"}
                className="hidden sm:flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#0A0A0A] px-2.5 py-1.5 rounded-sm border-2 border-[#0A0A0A] hover:border-[#3DDC10] text-[11px] font-mono transition-colors"
              >
                {muted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#FF7A00]" />
                    <span className="text-[#FF7A00]">SFX: MUTED</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#3DDC10]" />
                    <span className="text-[#0A0A0A]">SFX: ACTIVE</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigation Tabs (Rajdhani Font) */}
            <nav className="flex items-center gap-1.5 bg-[#F8F9FA] p-1.5 rounded-sm border-2 border-[#0A0A0A] overflow-x-auto w-full lg:w-auto">
              <button
                onClick={handleTabFeed}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                  activeTab === "feed"
                    ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                    : "text-[#0A0A0A] hover:text-[#3DDC10] hover:bg-[#FFFFFF]"
                }`}
              >
                <ListFilter className="w-4 h-4" /> ALL POSTS
              </button>

              {canCreate && (
                <button
                  onClick={handleTabComposer}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                    activeTab === "composer"
                      ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                      : "text-[#0A0A0A] hover:text-[#3DDC10] hover:bg-[#FFFFFF]"
                  }`}
                >
                  <PenTool className="w-4 h-4" /> CREATE POST
                </button>
              )}

              {(canManageDrafts || canViewDraftAudit) && (
                <button
                  onClick={handleTabDrafts}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                    activeTab === "drafts"
                      ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                      : "text-[#0A0A0A] hover:text-[#3DDC10] hover:bg-[#FFFFFF]"
                  }`}
                >
                  <Layers className="w-4 h-4" /> SAVED DRAFTS
                </button>
              )}

              <button
                onClick={handleTabCalendar}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                  activeTab === "calendar"
                    ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                    : "text-[#0A0A0A] hover:text-[#3DDC10] hover:bg-[#FFFFFF]"
                }`}
              >
                <Calendar className="w-4 h-4" /> CALENDAR
              </button>

              {canViewAnalytics && (
                <button
                  onClick={handleTabAnalytics}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                    activeTab === "analytics"
                      ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                      : "text-[#0A0A0A] hover:text-[#3DDC10] hover:bg-[#FFFFFF]"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> ANALYTICS
                </button>
              )}

              {canViewActivityLog && (
                <button
                  onClick={handleTabActivity}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                    activeTab === "activity"
                      ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni scale-[1.02]"
                      : "text-[#0A0A0A] hover:text-[#3DDC10] hover:bg-[#FFFFFF]"
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#3DDC10]" /> ACTIVITY LOG
                </button>
              )}
            </nav>
          </div>
        </header>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
          {children}
        </main>

        {/* Omnitrix Themed Footer */}
        <footer className="border-t border-[#E5E7EB] bg-[#FFFFFF] py-4 px-4 text-center text-xs text-[#71717A] w-full">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
            <p className="font-orbitron font-extrabold text-[#0A0A0A] tracking-widest uppercase text-[11px] flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-[#3DDC10] rounded-full"></span>
              OMNITRIX MULTI-CHANNEL SCHEDULING PLATFORM
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#71717A]">
              <span>PERSISTENCE: LOCALSTORAGE</span>
              <span>•</span>
              <span>API: TYPED CLIENT</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }
);
MainLayout.displayName = "MainLayout";

export default MainLayout;
