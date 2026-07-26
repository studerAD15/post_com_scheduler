/**
 * MainLayout.tsx - Tri-Color Balance (White + Black + Omnitrix Green) & 5 Unique Fonts.
 */

import React from "react";
import { RoleSwitcherBar } from "./RoleSwitcherBar";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { usePermission } from "../../features/auth/usePermission";
import {
  PenTool,
  Layers,
  Calendar,
  BarChart3,
  ListFilter,
  Radio,
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
  const user = useAppSelector(selectCurrentUser);
  const canCreate = usePermission("create_post");
  const canManageDrafts = usePermission("manage_drafts");
  const canViewAnalytics = usePermission("view_analytics");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#0A0A0A] font-inter flex flex-col selection:bg-[#3DDC10] selection:text-[#0A0A0A]">
      {/* Top Account View Switcher */}
      <RoleSwitcherBar />

      {/* Main Tri-Color Header (White Container Panel with Black Borders & Green Highlights) */}
      <header className="border-b-4 border-[#3DDC10] bg-[#FFFFFF] sticky top-10 z-30 shadow-card-white">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo Badge & Branding (Orbitron + Space Grotesk) */}
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

          {/* Navigation Tabs (Rajdhani Font) */}
          <nav className="flex items-center gap-1.5 bg-[#0A0A0A] p-1.5 rounded-sm border-2 border-[#0A0A0A] overflow-x-auto w-full md:w-auto">
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
      <footer className="border-t-2 border-[#0A0A0A] bg-[#FFFFFF] py-4 px-4 text-center text-xs text-[#0A0A0A]">
        <p className="font-orbitron font-extrabold text-[#0A0A0A] tracking-widest uppercase text-[11px] flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-[#3DDC10] rounded-full"></span>
          OMNITRIX MULTI-CHANNEL SCHEDULING PLATFORM
          <span className="w-2 h-2 bg-[#3DDC10] rounded-full"></span>
        </p>
      </footer>
    </div>
  );
};
