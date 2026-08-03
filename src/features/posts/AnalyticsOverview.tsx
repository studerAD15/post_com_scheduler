/**
 * AnalyticsOverview.tsx - High-Performance Analytics Card & Activity Breakdown.
 *
 * Solves text overflow & narrow grid bugs via Container Queries and resilient Flex layouts.
 * Supports interactive filtering by clicking platform cards.
 */

import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectPostMetrics } from "./postsSelectors";
import { selectActivePlatformFilter, setPlatformFilter } from "../platforms/platformSlice";
import { PLATFORM_CONFIGS, PlatformId } from "../../types/platform";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import { BarChart3, Layers, CheckCircle2, Clock, FileText, Filter, Check, Activity } from "lucide-react";

const BRAND_SVGS: Record<PlatformId, React.FC<{ className?: string }>> = {
  twitter: (props) => <TwitterIcon {...props} />,
  instagram: (props) => <InstagramIcon {...props} />,
  linkedin: (props) => <LinkedInIcon {...props} />,
  facebook: (props) => <FacebookIcon {...props} />,
};

export const AnalyticsOverview: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(selectPostMetrics);
  const activeFilter = useAppSelector(selectActivePlatformFilter);

  const handlePlatformClick = (pId: PlatformId) => {
    if (activeFilter === pId) {
      dispatch(setPlatformFilter("all"));
    } else {
      dispatch(setPlatformFilter(pId));
    }
  };

  // Find top platform by count
  const sortedPlatforms = (Object.keys(PLATFORM_CONFIGS) as PlatformId[]).sort(
    (a, b) => (metrics.byPlatform[b] || 0) - (metrics.byPlatform[a] || 0)
  );
  const topPlatform = sortedPlatforms[0];
  const topPlatformCount = metrics.byPlatform[topPlatform] || 0;

  return (
    <div className="analytics-card-container bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm p-4 sm:p-6 space-y-5 text-[#0A0A0A] shadow-card-white">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-3.5 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-sm bg-[#0A0A0A] text-[#3DDC10] flex items-center justify-center shadow-omni shrink-0">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-space uppercase font-bold text-[#0A0A0A] tracking-wider truncate">
              ANALYTICS &amp; METRICS
            </h2>
            <p className="text-[11px] font-inter text-[#71717A] truncate">
              Real-time channel statistics and publication breakdown.
            </p>
          </div>
        </div>

        {activeFilter !== "all" && (
          <button
            onClick={() => dispatch(setPlatformFilter("all"))}
            className="flex items-center gap-1 text-[10px] font-mono font-bold bg-[#0A0A0A] text-[#3DDC10] px-2 py-1 rounded border border-[#3DDC10] hover:bg-[#3DDC10] hover:text-[#0A0A0A] transition-colors shrink-0"
            title="Reset platform filter"
          >
            <Filter className="w-3 h-3" />
            <span className="uppercase">{activeFilter} ACTIVE</span>
            <span className="ml-1 text-xs">×</span>
          </button>
        )}
      </div>

      {/* Main Metric Tiles (Resilient Container-Aware Grid) */}
      <div className="analytics-metrics-grid grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Total Posts */}
        <div className="bg-[#0A0A0A] text-[#FFFFFF] border-2 border-[#3DDC10] rounded-sm p-3.5 space-y-1 shadow-omni relative overflow-hidden group hover:border-[#3DDC10] transition-all">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-rajdhani uppercase font-bold text-[#3DDC10] tracking-wider flex items-center gap-1.5 min-w-0 truncate">
              <Layers className="w-3.5 h-3.5 shrink-0 text-[#3DDC10]" />
              <span className="truncate">TOTAL POSTS</span>
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#FFFFFF]">
            {metrics.total}
          </p>
        </div>

        {/* Drafts */}
        <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm p-3.5 space-y-1 shadow-sm hover:border-[#0A0A0A] transition-all">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-rajdhani uppercase font-bold text-[#71717A] tracking-wider flex items-center gap-1.5 min-w-0 truncate">
              <FileText className="w-3.5 h-3.5 shrink-0 text-[#0A0A0A]" />
              <span className="truncate">DRAFTS</span>
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#0A0A0A]">
            {metrics.byStatus.draft}
          </p>
        </div>

        {/* Scheduled */}
        <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#FF7A00] rounded-sm p-3.5 space-y-1 shadow-sm hover:border-[#FF7A00] transition-all">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-rajdhani uppercase font-bold text-[#FF7A00] tracking-wider flex items-center gap-1.5 min-w-0 truncate">
              <Clock className="w-3.5 h-3.5 shrink-0 text-[#FF7A00]" />
              <span className="truncate">SCHEDULED</span>
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#FF7A00]">
            {metrics.byStatus.scheduled}
          </p>
        </div>

        {/* Published */}
        <div className="bg-[#0A0A0A] text-[#FFFFFF] border-2 border-[#3DDC10] rounded-sm p-3.5 space-y-1 shadow-omni relative overflow-hidden group hover:border-[#3DDC10] transition-all">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-rajdhani uppercase font-bold text-[#3DDC10] tracking-wider flex items-center gap-1.5 min-w-0 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#3DDC10]" />
              <span className="truncate">PUBLISHED</span>
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#3DDC10]">
            {metrics.byStatus.published}
          </p>
        </div>
      </div>

      {/* PLATFORM ACTIVITY BREAKDOWN SECTION */}
      <div className="pt-1 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-space uppercase font-bold text-[#0A0A0A] tracking-wider flex items-center gap-2 truncate min-w-0">
            <span className="w-2.5 h-2.5 bg-[#3DDC10] rounded-full animate-pulse shrink-0"></span>
            <span className="truncate">PLATFORM ACTIVITY BREAKDOWN</span>
          </h3>
          <span className="text-[10px] font-mono text-[#71717A] shrink-0">
            {Object.keys(PLATFORM_CONFIGS).length} Channels Active
          </span>
        </div>

        {/* Responsive Activity Tiles with Container Queries & Click-to-Filter */}
        <div className="analytics-platform-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((pId) => {
            const cfg = PLATFORM_CONFIGS[pId];
            const count = metrics.byPlatform[pId] || 0;
            const percentage = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
            const IconComp = BRAND_SVGS[pId];
            const isSelected = activeFilter === pId;

            return (
              <button
                type="button"
                key={pId}
                onClick={() => handlePlatformClick(pId)}
                className={`w-full text-left bg-[#141414] text-[#FFFFFF] border-2 rounded-sm p-3 space-y-2.5 transition-all shadow-md group cursor-pointer focus:outline-none ${
                  isSelected
                    ? "border-[#3DDC10] bg-[#12220E] shadow-omni scale-[1.01]"
                    : "border-[#2A2A2A] hover:border-[#3DDC10]/70 hover:bg-[#1A1A1A]"
                }`}
                title={`Click to filter by ${cfg.name}`}
              >
                {/* Header Row: Icon + Name + Count Badge */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-sm border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isSelected
                          ? "bg-[#3DDC10] text-[#0A0A0A] border-[#3DDC10]"
                          : "bg-[#0A0A0A] border-[#3DDC10]/50 text-[#3DDC10]"
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-rajdhani uppercase font-bold text-[#FFFFFF] tracking-wider truncate min-w-0 flex-1">
                      {cfg.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-auto">
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#3DDC10] text-[#0A0A0A] flex items-center justify-center text-[9px] font-bold">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-sm border ${
                        isSelected
                          ? "bg-[#3DDC10] text-[#0A0A0A] border-[#3DDC10]"
                          : "bg-[#0A0A0A] text-[#3DDC10] border-[#3DDC10]/40"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                </div>

                {/* Progress Bar Track & Fill */}
                <div className="space-y-1">
                  <div className="w-full bg-[#0A0A0A] border border-[#2A2A2A] h-2 rounded-sm overflow-hidden p-[1px]">
                    <div
                      className={`h-full rounded-sm transition-all duration-500 ${
                        isSelected
                          ? "bg-[#3DDC10] shadow-[0_0_10px_#3DDC10]"
                          : "bg-[#3DDC10]"
                      }`}
                      style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-[#71717A] min-w-0">
                    <span className="truncate min-w-0">Share of total</span>
                    <span className="font-bold text-[#3DDC10] shrink-0 ml-1">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytics Insight Footer Bar */}
      <div className="pt-1 border-t border-[#0A0A0A]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#71717A]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#3DDC10]" />
          <span>
            TOP CHANNEL: <strong className="text-[#0A0A0A] uppercase">{PLATFORM_CONFIGS[topPlatform]?.name || "N/A"}</strong> ({topPlatformCount} posts)
          </span>
        </div>
        <span className="text-[10px] text-[#71717A]">
          {activeFilter !== "all" ? "Filtered Feed View Active" : "Click platform card to filter feed"}
        </span>
      </div>
    </div>
  );
});

AnalyticsOverview.displayName = "AnalyticsOverview";
export default AnalyticsOverview;
