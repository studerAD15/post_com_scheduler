/**
 * AnalyticsOverview.tsx - Rebuilt Platform Activity Breakdown & Metrics.
 *
 * Uses tri-color equal balance (White + Black + Omnitrix Green) and 5 distinct Google Fonts.
 * Completely eliminates text overflow and layout bugs in the platform breakdown grid.
 */

import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectPostMetrics } from "./postsSelectors";
import { PLATFORM_CONFIGS, PlatformId } from "../../types/platform";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import { BarChart3, Layers, CheckCircle2, Clock, FileText } from "lucide-react";

const BRAND_SVGS: Record<PlatformId, React.FC<{ className?: string }>> = {
  twitter: (props) => <TwitterIcon {...props} />,
  instagram: (props) => <InstagramIcon {...props} />,
  linkedin: (props) => <LinkedInIcon {...props} />,
  facebook: (props) => <FacebookIcon {...props} />,
};

export const AnalyticsOverview: React.FC = React.memo(() => {
  const metrics = useAppSelector(selectPostMetrics);

  return (
    <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm p-5 sm:p-7 space-y-6 text-[#0A0A0A] shadow-card-white">
      
      {/* Header Bar using Space Grotesk */}
      <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[#0A0A0A] text-[#3DDC10] flex items-center justify-center shadow-omni">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-space uppercase font-bold text-[#0A0A0A] tracking-wider">
              ANALYTICS &amp; METRICS
            </h2>
            <p className="text-xs font-inter text-[#71717A]">
              Real-time channel statistics and publication breakdown.
            </p>
          </div>
        </div>
      </div>

      {/* Main Metric Tiles (White Cards with Black/Green Accents) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0A0A0A] text-[#FFFFFF] border-2 border-[#3DDC10] rounded-sm p-4 space-y-1 shadow-omni">
          <p className="text-[11px] font-rajdhani uppercase font-bold text-[#3DDC10] tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> TOTAL POSTS
          </p>
          <p className="text-3xl font-mono font-bold text-[#FFFFFF]">
            {metrics.total}
          </p>
        </div>

        <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm p-4 space-y-1 shadow-sm">
          <p className="text-[11px] font-rajdhani uppercase font-bold text-[#71717A] tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#0A0A0A]" /> DRAFTS
          </p>
          <p className="text-3xl font-mono font-bold text-[#0A0A0A]">
            {metrics.byStatus.draft}
          </p>
        </div>

        <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#FF7A00] rounded-sm p-4 space-y-1 shadow-sm">
          <p className="text-[11px] font-rajdhani uppercase font-bold text-[#FF7A00] tracking-widest flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> SCHEDULED
          </p>
          <p className="text-3xl font-mono font-bold text-[#FF7A00]">
            {metrics.byStatus.scheduled}
          </p>
        </div>

        <div className="bg-[#0A0A0A] text-[#FFFFFF] border-2 border-[#3DDC10] rounded-sm p-4 space-y-1 shadow-omni">
          <p className="text-[11px] font-rajdhani uppercase font-bold text-[#3DDC10] tracking-widest flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC10]" /> PUBLISHED
          </p>
          <p className="text-3xl font-mono font-bold text-[#3DDC10]">
            {metrics.byStatus.published}
          </p>
        </div>
      </div>

      {/* REBUILT PLATFORM ACTIVITY BREAKDOWN SECTION (Zero Overflow, Responsive Tiles) */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-space uppercase font-bold text-[#0A0A0A] tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#3DDC10]"></span>
            PLATFORM ACTIVITY BREAKDOWN
          </h3>
          <span className="text-[11px] font-mono text-[#71717A]">
            {Object.keys(PLATFORM_CONFIGS).length} Channels Active
          </span>
        </div>

        {/* Clean Responsive Tiles Grid with No Text Overflow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((pId) => {
            const cfg = PLATFORM_CONFIGS[pId];
            const count = metrics.byPlatform[pId] || 0;
            const percentage = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
            const IconComp = BRAND_SVGS[pId];

            return (
              <div
                key={pId}
                className="bg-[#141414] text-[#FFFFFF] border-2 border-[#2A2A2A] hover:border-[#3DDC10] rounded-sm p-4 space-y-3 transition-all shadow-md group"
              >
                {/* Header Row: Icon + Name + Count Badge */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-sm bg-[#0A0A0A] border border-[#3DDC10]/50 text-[#3DDC10] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-rajdhani uppercase font-bold text-[#FFFFFF] tracking-wider truncate">
                      {cfg.name}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#3DDC10] bg-[#0A0A0A] px-2 py-0.5 rounded-sm border border-[#3DDC10]/40 shrink-0">
                    {count}
                  </span>
                </div>

                {/* Progress Bar Track & Fill */}
                <div className="space-y-1">
                  <div className="w-full bg-[#0A0A0A] border border-[#2A2A2A] h-2 rounded-sm overflow-hidden p-[1px]">
                    <div
                      className="bg-[#3DDC10] h-full rounded-sm transition-all duration-500"
                      style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-[#71717A]">
                    <span>Share of total</span>
                    <span className="font-bold text-[#3DDC10]">{percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
