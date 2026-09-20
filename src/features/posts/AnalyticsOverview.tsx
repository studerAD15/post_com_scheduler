import React, { useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectPostMetrics,
  selectPostingFrequencyOverTime,
  selectUpcomingScheduledPosts,
} from "./postsSelectors";
import { selectActivePlatformFilter, setPlatformFilter } from "../platforms/platformSlice";
import { selectCurrentUser } from "../auth/authSlice";
import { PLATFORM_CONFIGS, PlatformId } from "../../types/platform";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import {
  BarChart3,
  Layers,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Check,
  Activity,
  TrendingUp,
  Eye,
  Zap,
  Radio,
  Users,
} from "lucide-react";

const BRAND_SVGS: Record<PlatformId, React.FC<{ className?: string }>> = {
  twitter: (props) => <TwitterIcon {...props} />,
  instagram: (props) => <InstagramIcon {...props} />,
  linkedin: (props) => <LinkedInIcon {...props} />,
  facebook: (props) => <FacebookIcon {...props} />,
};

// Extended mock analytics telemetry for detailed Viewer inspection
const PLATFORM_TELEMETRY: Record<
  PlatformId,
  { impressions: string; engagement: string; followers: string; avgReach: string; status: string }
> = {
  twitter: { impressions: "48.5K", engagement: "5.4%", followers: "14.2K", avgReach: "3.2K/post", status: "ACTIVE" },
  instagram: { impressions: "82.1K", engagement: "7.8%", followers: "28.6K", avgReach: "6.8K/post", status: "ACTIVE" },
  linkedin: { impressions: "34.9K", engagement: "6.2%", followers: "9.8K", avgReach: "2.9K/post", status: "ACTIVE" },
  facebook: { impressions: "29.4K", engagement: "4.1%", followers: "18.1K", avgReach: "2.1K/post", status: "ACTIVE" },
};

function getDonutSlices(draft: number, scheduled: number, published: number) {
  const total = draft + scheduled + published || 1;
  const draftPct = Math.round((draft / total) * 100);
  const schedPct = Math.round((scheduled / total) * 100);
  const pubPct = Math.round((published / total) * 100);

  const circ = 251.2;
  const draftStroke = (draftPct / 100) * circ;
  const schedStroke = (schedPct / 100) * circ;
  const pubStroke = (pubPct / 100) * circ;

  return { draftPct, schedPct, pubPct, draftStroke, schedStroke, pubStroke, circ };
}

interface PlatformTelemetryCardProps {
  pId: PlatformId;
  count: number;
  totalPosts: number;
  isSelected: boolean;
  onPlatformClick: (pId: PlatformId) => void;
}

const PlatformTelemetryCard: React.FC<PlatformTelemetryCardProps> = React.memo(
  ({ pId, count, totalPosts, isSelected, onPlatformClick }) => {
    const cfg = PLATFORM_CONFIGS[pId];
    const percentage = totalPosts > 0 ? Math.round((count / totalPosts) * 100) : 0;
    const IconComp = BRAND_SVGS[pId];
    const telemetry = PLATFORM_TELEMETRY[pId];

    const handleClick = useCallback(() => {
      onPlatformClick(pId);
    }, [onPlatformClick, pId]);

    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full text-left bg-[#141414] text-[#FFFFFF] border-2 rounded-sm p-3.5 space-y-3 transition-all shadow-md group cursor-pointer focus:outline-none ${
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
              {count} posts
            </span>
          </div>
        </div>

        {/* Progress Bar Track & Fill */}
        <div className="space-y-1">
          <div className="w-full bg-[#0A0A0A] border border-[#2A2A2A] h-2 rounded-sm overflow-hidden p-[1px]">
            <div
              className={`h-full rounded-sm transition-all duration-500 ${
                isSelected ? "bg-[#3DDC10] shadow-[0_0_10px_#3DDC10]" : "bg-[#3DDC10]"
              }`}
              style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#71717A] min-w-0">
            <span className="truncate min-w-0">Channel Share</span>
            <span className="font-bold text-[#3DDC10] shrink-0 ml-1">{percentage}%</span>
          </div>
        </div>

        {/* Detailed Telemetry Stats Grid for Viewer */}
        <div className="pt-2 border-t border-[#2A2A2A] grid grid-cols-2 gap-1.5 text-[10px] font-mono">
          <div className="bg-[#0A0A0A] p-1.5 rounded border border-[#2A2A2A]">
            <span className="text-[#71717A] block">IMPRESSIONS</span>
            <span className="font-bold text-[#FFFFFF]">{telemetry.impressions}</span>
          </div>
          <div className="bg-[#0A0A0A] p-1.5 rounded border border-[#2A2A2A]">
            <span className="text-[#71717A] block">ENGAGEMENT</span>
            <span className="font-bold text-[#3DDC10]">{telemetry.engagement}</span>
          </div>
          <div className="bg-[#0A0A0A] p-1.5 rounded border border-[#2A2A2A]">
            <span className="text-[#71717A] block">AUDIENCE</span>
            <span className="font-bold text-[#FFFFFF]">{telemetry.followers}</span>
          </div>
          <div className="bg-[#0A0A0A] p-1.5 rounded border border-[#2A2A2A]">
            <span className="text-[#71717A] block">REACH/POST</span>
            <span className="font-bold text-[#FF7A00]">{telemetry.avgReach}</span>
          </div>
        </div>
      </button>
    );
  }
);
PlatformTelemetryCard.displayName = "PlatformTelemetryCard";

export const AnalyticsOverview: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(selectPostMetrics);
  const frequencyData = useAppSelector(selectPostingFrequencyOverTime);
  const upcomingScheduled = useAppSelector(selectUpcomingScheduledPosts);
  const activeFilter = useAppSelector(selectActivePlatformFilter);
  const currentUser = useAppSelector(selectCurrentUser);

  const isViewer = currentUser?.role === "viewer";

  const handlePlatformClick = useCallback(
    (pId: PlatformId) => {
      if (activeFilter === pId) {
        dispatch(setPlatformFilter("all"));
      } else {
        dispatch(setPlatformFilter(pId));
      }
    },
    [activeFilter, dispatch]
  );

  const handleResetFilter = useCallback(() => {
    dispatch(setPlatformFilter("all"));
  }, [dispatch]);

  // Find top platform by count (Memoized)
  const sortedPlatforms = useMemo(() => {
    return (Object.keys(PLATFORM_CONFIGS) as PlatformId[]).sort(
      (a, b) => (metrics.byPlatform[b] || 0) - (metrics.byPlatform[a] || 0)
    );
  }, [metrics.byPlatform]);

  const topPlatform = sortedPlatforms[0];
  const topPlatformCount = metrics.byPlatform[topPlatform] || 0;

  // Donut SVG slice math (Memoized)
  const donut = useMemo(() => {
    return getDonutSlices(
      metrics.byStatus.draft,
      metrics.byStatus.scheduled,
      metrics.byStatus.published
    );
  }, [metrics.byStatus.draft, metrics.byStatus.scheduled, metrics.byStatus.published]);

  // Max frequency count for SVG bar chart scaling (Memoized)
  const maxFreqCount = useMemo(() => {
    return Math.max(...frequencyData.map((d) => d.total), 1);
  }, [frequencyData]);

  return (
    <div className="analytics-card-container bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm p-4 sm:p-6 space-y-6 text-[#0A0A0A] shadow-card-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#0A0A0A] pb-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-sm bg-[#0A0A0A] text-[#3DDC10] flex items-center justify-center shadow-omni shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-space uppercase font-extrabold text-[#0A0A0A] tracking-wider truncate">
                ANALYTICS &amp; TELEMETRY BOARD
              </h2>
              {isViewer && (
                <span className="px-2 py-0.5 rounded-sm bg-[#3DDC10] text-[#0A0A0A] font-mono font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 shrink-0">
                  <Eye className="w-3 h-3" /> VIEWER LENS
                </span>
              )}
            </div>
            <p className="text-xs font-inter text-[#71717A] truncate">
              Detailed post distribution, audience engagement, and multi-channel publication metrics.
            </p>
          </div>
        </div>

        {activeFilter !== "all" && (
          <button
            type="button"
            onClick={handleResetFilter}
            className="flex items-center gap-1.5 text-xs font-mono font-bold bg-[#0A0A0A] text-[#3DDC10] px-3 py-1.5 rounded border border-[#3DDC10] hover:bg-[#3DDC10] hover:text-[#0A0A0A] transition-colors shrink-0 self-start sm:self-auto"
            title="Reset platform filter"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="uppercase">{activeFilter} ACTIVE</span>
            <span className="ml-1 text-xs font-extrabold">×</span>
          </button>
        )}
      </div>

      {/* Primary KPI Metrics Row */}
      <div className="analytics-metrics-grid grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Publications */}
        <div className="bg-[#0A0A0A] text-[#FFFFFF] border-2 border-[#3DDC10] rounded-sm p-3.5 space-y-1.5 shadow-omni relative overflow-hidden group">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-rajdhani uppercase font-bold text-[#3DDC10] tracking-wider flex items-center gap-1.5 min-w-0 truncate">
              <Layers className="w-3.5 h-3.5 shrink-0 text-[#3DDC10]" />
              <span className="truncate">TOTAL POSTS</span>
            </p>
            <span className="w-2 h-2 bg-[#3DDC10] rounded-full animate-ping shrink-0"></span>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#FFFFFF]">
            {metrics.total}
          </p>
          <p className="text-[10px] font-mono text-[#71717A]">Active campaign items</p>
        </div>

        {/* Drafts */}
        <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm p-3.5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-rajdhani uppercase font-bold text-[#71717A] tracking-wider flex items-center gap-1.5 min-w-0 truncate">
              <FileText className="w-3.5 h-3.5 shrink-0 text-[#0A0A0A]" />
              <span className="truncate">SAVED DRAFTS</span>
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#0A0A0A]">
            {metrics.byStatus.draft}
          </p>
          <p className="text-[10px] font-mono text-[#71717A]">Pending editor review</p>
        </div>

        {/* Scheduled */}
        <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#FF7A00] rounded-sm p-3.5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-rajdhani uppercase font-bold text-[#FF7A00] tracking-wider flex items-center gap-1.5 min-w-0 truncate">
              <Clock className="w-3.5 h-3.5 shrink-0 text-[#FF7A00]" />
              <span className="truncate">SCHEDULED</span>
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#FF7A00]">
            {metrics.byStatus.scheduled}
          </p>
          <p className="text-[10px] font-mono text-[#FF7A00]/80 font-bold">Auto-dispatch queue</p>
        </div>

        {/* Published */}
        <div className="bg-[#0A0A0A] text-[#FFFFFF] border-2 border-[#3DDC10] rounded-sm p-3.5 space-y-1.5 shadow-omni relative overflow-hidden group">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-rajdhani uppercase font-bold text-[#3DDC10] tracking-wider flex items-center gap-1.5 min-w-0 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#3DDC10]" />
              <span className="truncate">PUBLISHED</span>
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#3DDC10]">
            {metrics.byStatus.published}
          </p>
          <p className="text-[10px] font-mono text-[#3DDC10]/80 font-bold">Live across channels</p>
        </div>
      </div>

      {/* VIEWER ENHANCED TELEMETRY METRICS (Engagement & Reach Overview) */}
      <div className="bg-[#0A0A0A] text-[#FFFFFF] border-2 border-[#3DDC10] p-4 rounded-sm space-y-4 shadow-omni">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#3DDC10]" />
            <h3 className="text-xs sm:text-sm font-space uppercase font-extrabold text-[#FFFFFF] tracking-wider">
              MULTI-CHANNEL AUDIENCE REACH &amp; ENGAGEMENT
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#3DDC10] bg-[#141414] px-2 py-0.5 rounded border border-[#3DDC10]/40">
            LIVE ANALYTICAL FEED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-[#141414] border border-[#2A2A2A] p-3 rounded-sm space-y-1">
            <p className="text-[10px] font-mono text-[#71717A] uppercase flex items-center justify-center gap-1">
              <Eye className="w-3 h-3 text-[#3DDC10]" /> EST. TOTAL IMPRESSIONS
            </p>
            <p className="text-xl font-mono font-extrabold text-[#3DDC10]">194.9K</p>
            <p className="text-[10px] font-mono text-[#3DDC10]">+14.2% vs last week</p>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] p-3 rounded-sm space-y-1">
            <p className="text-[10px] font-mono text-[#71717A] uppercase flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-[#FF7A00]" /> AVG. ENGAGEMENT RATE
            </p>
            <p className="text-xl font-mono font-extrabold text-[#FF7A00]">6.1%</p>
            <p className="text-[10px] font-mono text-[#FF7A00]">+0.8% benchmark surge</p>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] p-3 rounded-sm space-y-1">
            <p className="text-[10px] font-mono text-[#71717A] uppercase flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-[#FFFFFF]" /> COMBINED AUDIENCE
            </p>
            <p className="text-xl font-mono font-extrabold text-[#FFFFFF]">70.7K</p>
            <p className="text-[10px] font-mono text-[#71717A]">across 4 platforms</p>
          </div>
        </div>
      </div>

      {/* RICH VISUAL ANALYTICS DASHBOARD GRID (Frequency Chart + Status Donut + Upcoming Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
        {/* 1. POSTING FREQUENCY OVER TIME (SVG BAR CHART) */}
        <div className="bg-[#0A0A0A] text-[#FFFFFF] border-2 border-[#3DDC10] p-4 rounded-sm space-y-3 shadow-omni flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#3DDC10]" />
              <h3 className="text-xs sm:text-sm font-space uppercase font-bold text-[#FFFFFF] tracking-wider">
                POSTING FREQUENCY OVER TIME
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#3DDC10] bg-[#141414] px-2 py-0.5 rounded border border-[#3DDC10]/40">
              7-DAY WINDOW
            </span>
          </div>

          {/* SVG Bar Graph */}
          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 bg-[#141414] border border-[#2A2A2A] rounded p-3">
            {frequencyData.map((d) => {
              const heightPct = d.total > 0 ? Math.max(Math.round((d.total / maxFreqCount) * 100), 12) : 6;
              const pubPct = d.total > 0 ? (d.published / d.total) * 100 : 0;
              const schedPct = d.total > 0 ? (d.scheduled / d.total) * 100 : 0;

              return (
                <div key={`${d.dayLabel}-${d.dateStr}`} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[9px] font-mono text-[#3DDC10] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    {d.total}
                  </div>
                  <div className="w-full max-w-[28px] bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm overflow-hidden flex flex-col justify-end p-[1px]" style={{ height: `${heightPct}%` }}>
                    {d.total > 0 ? (
                      <>
                        <div
                          className="w-full bg-[#3DDC10] transition-all rounded-sm"
                          style={{ height: `${pubPct}%` }}
                          title={`${d.published} Published`}
                        />
                        <div
                          className="w-full bg-[#FF7A00] transition-all rounded-sm"
                          style={{ height: `${schedPct}%` }}
                          title={`${d.scheduled} Scheduled`}
                        />
                      </>
                    ) : (
                      <div
                        className="w-full bg-[#2A2A2A] h-full rounded-sm"
                        title="0 Posts"
                      />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-[#71717A] uppercase">{d.dayLabel}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A] pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#3DDC10] rounded-sm"></span> Published
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#FF7A00] rounded-sm"></span> Scheduled
            </span>
          </div>
        </div>

        {/* 2. STATUS BREAKDOWN (DONUT SVG CHART) */}
        <div className="bg-[#0A0A0A] text-[#FFFFFF] border-2 border-[#3DDC10] p-4 rounded-sm space-y-3 shadow-omni flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#3DDC10]" />
              <h3 className="text-xs sm:text-sm font-space uppercase font-bold text-[#FFFFFF] tracking-wider">
                POST STATUS BREAKDOWN
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#FFFFFF] bg-[#141414] px-2 py-0.5 rounded border border-[#2A2A2A] shrink-0">
              RATIO DISTRIBUTION
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 bg-[#141414] border border-[#2A2A2A] rounded p-4">
            {/* SVG Donut Chart */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#2A2A2A" strokeWidth="12" fill="transparent" />
                {/* Published Slice (Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3DDC10"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${donut.pubStroke} ${donut.circ}`}
                  strokeDashoffset="0"
                />
                {/* Scheduled Slice (Orange) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#FF7A00"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${donut.schedStroke} ${donut.circ}`}
                  strokeDashoffset={`-${donut.pubStroke}`}
                />
                {/* Draft Slice (White) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#FFFFFF"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${donut.draftStroke} ${donut.circ}`}
                  strokeDashoffset={`-${donut.pubStroke + donut.schedStroke}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-mono font-bold text-[#3DDC10]">{metrics.total}</span>
                <span className="text-[8px] font-mono text-[#71717A] uppercase">TOTAL</span>
              </div>
            </div>

            {/* Legend Stats */}
            <div className="space-y-2 text-xs font-mono w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4 bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A]">
                <span className="flex items-center gap-1.5 text-[#3DDC10]">
                  <span className="w-2.5 h-2.5 bg-[#3DDC10] rounded-full"></span> PUBLISHED
                </span>
                <span className="font-bold text-[#FFFFFF]">{metrics.byStatus.published} ({donut.pubPct}%)</span>
              </div>

              <div className="flex items-center justify-between gap-4 bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A]">
                <span className="flex items-center gap-1.5 text-[#FF7A00]">
                  <span className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full"></span> SCHEDULED
                </span>
                <span className="font-bold text-[#FFFFFF]">{metrics.byStatus.scheduled} ({donut.schedPct}%)</span>
              </div>

              <div className="flex items-center justify-between gap-4 bg-[#0A0A0A] p-2 rounded border border-[#2A2A2A]">
                <span className="flex items-center gap-1.5 text-[#FFFFFF]">
                  <span className="w-2.5 h-2.5 bg-[#FFFFFF] rounded-full"></span> DRAFTS
                </span>
                <span className="font-bold text-[#FFFFFF]">{metrics.byStatus.draft} ({donut.draftPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. UPCOMING SCHEDULED POSTS READ-ONLY SUMMARY LIST */}
      <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] p-4 rounded-sm space-y-3 shadow-card-white">
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF7A00]" />
            <h3 className="text-xs sm:text-sm font-space uppercase font-bold text-[#0A0A0A] tracking-wider">
              UPCOMING SCHEDULED POSTS SUMMARY (READ-ONLY)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#0A0A0A] bg-[#F8F9FA] px-2 py-0.5 rounded border border-[#0A0A0A] font-bold">
            {upcomingScheduled.length} QUEUED
          </span>
        </div>

        {upcomingScheduled.length === 0 ? (
          <p className="text-xs font-inter text-[#71717A] italic py-2 text-center bg-[#F8F9FA] rounded border border-dashed border-[#0A0A0A]">
            No upcoming scheduled posts currently in queue.
          </p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {upcomingScheduled.map((post) => (
              <div
                key={post.id}
                className="bg-[#F8F9FA] border-2 border-[#0A0A0A] rounded-sm p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-inter"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#FF7A00] bg-[#FF7A00]/10 px-2 py-0.5 rounded border border-[#FF7A00]/40">
                      {new Date(post.scheduledAt!).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <h4 className="font-space font-bold text-[#0A0A0A] truncate max-w-xs">{post.title}</h4>
                  </div>
                  <p className="text-[11px] text-[#71717A] truncate">{post.content}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {post.platforms.map((pId) => {
                    const IconComp = BRAND_SVGS[pId];
                    return (
                      <span
                        key={pId}
                        className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#0A0A0A] text-[#3DDC10]"
                      >
                        <IconComp className="w-3 h-3" />
                        {pId}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PLATFORM ACTIVITY & TELEMETRY BREAKDOWN SECTION */}
      <div className="pt-1 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-space uppercase font-bold text-[#0A0A0A] tracking-wider flex items-center gap-2 truncate min-w-0">
            <span className="w-2.5 h-2.5 bg-[#3DDC10] rounded-full animate-pulse shrink-0"></span>
            <span className="truncate">DETAILED PLATFORM BREAKDOWN &amp; METRICS</span>
          </h3>
          <span className="text-[10px] font-mono text-[#71717A] shrink-0">
            {Object.keys(PLATFORM_CONFIGS).length} Channels Tracked
          </span>
        </div>

        {/* Responsive Activity Cards Grid with Telemetry details */}
        <div className="analytics-platform-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((pId) => (
            <PlatformTelemetryCard
              key={pId}
              pId={pId}
              count={metrics.byPlatform[pId] || 0}
              totalPosts={metrics.total}
              isSelected={activeFilter === pId}
              onPlatformClick={handlePlatformClick}
            />
          ))}
        </div>
      </div>

      {/* Analytics Insight Footer Bar */}
      <div className="pt-2 border-t-2 border-[#0A0A0A]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#71717A]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#3DDC10]" />
          <span>
            TOP CHANNEL: <strong className="text-[#0A0A0A] uppercase">{PLATFORM_CONFIGS[topPlatform]?.name || "N/A"}</strong> ({topPlatformCount} posts)
          </span>
        </div>
        <span className="text-[10px] text-[#71717A]">
          {activeFilter !== "all" ? "Filtered Feed Active" : "Click any channel card above to filter"}
        </span>
      </div>
    </div>
  );
});

AnalyticsOverview.displayName = "AnalyticsOverview";
export default AnalyticsOverview;
