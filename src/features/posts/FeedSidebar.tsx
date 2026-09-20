/**
 * FeedSidebar.tsx - Compact, Balanced Sidebar for the Feed / All Posts Tab.
 * Provides quick telemetry counters, upcoming scheduled queue snippet,
 * and interactive platform filter shortcuts without causing vertical layout imbalance.
 */

import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectPostMetrics, selectUpcomingScheduledPosts } from "./postsSelectors";
import { selectActivePlatformFilter, setPlatformFilter } from "../platforms/platformSlice";
import { publishPostThunk } from "./postsSlice";
import { PLATFORM_CONFIGS, PlatformId } from "../../types/platform";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import { usePermission } from "../auth/usePermission";
import {
  Clock,
  CheckCircle2,
  FileText,
  Layers,
  Send,
  Calendar,
  BarChart3,
  Filter,
  ArrowRight,
} from "lucide-react";

export interface FeedSidebarProps {
  onNavigateTab: (tab: "composer" | "feed" | "drafts" | "calendar" | "analytics" | "activity") => void;
  onOpenScheduleModal?: (post: any) => void;
}

const BRAND_SVGS: Record<PlatformId, React.FC<{ className?: string }>> = {
  twitter: (props) => <TwitterIcon {...props} />,
  instagram: (props) => <InstagramIcon {...props} />,
  linkedin: (props) => <LinkedInIcon {...props} />,
  facebook: (props) => <FacebookIcon {...props} />,
};

export const FeedSidebar: React.FC<FeedSidebarProps> = React.memo(({ onNavigateTab }) => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(selectPostMetrics);
  const upcomingPosts = useAppSelector(selectUpcomingScheduledPosts);
  const activeFilter = useAppSelector(selectActivePlatformFilter);
  const canPublish = usePermission("publish_post");
  const canViewAnalytics = usePermission("view_analytics");

  const handlePlatformClick = useCallback(
    (pId: PlatformId | "all") => {
      dispatch(setPlatformFilter(pId));
    },
    [dispatch]
  );

  const handlePublishPost = useCallback(
    (postId: string) => {
      dispatch(publishPostThunk(postId));
    },
    [dispatch]
  );

  return (
    <aside className="space-y-4 lg:sticky lg:top-36">
      {/* 1. Quick Metrics Mini-Board */}
      <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm p-4 space-y-3 shadow-card-white">
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-2.5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#3DDC10]" />
            <h3 className="text-xs font-space uppercase font-bold text-[#0A0A0A] tracking-wider">
              TELEMETRY OVERVIEW
            </h3>
          </div>
          {canViewAnalytics && (
            <button
              type="button"
              onClick={() => onNavigateTab("analytics")}
              className="text-[10px] font-mono text-[#0A0A0A] hover:text-[#3DDC10] flex items-center gap-1 font-bold uppercase transition-colors"
            >
              FULL BOARD <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 4 Mini KPI Badges */}
        <div className="grid grid-cols-2 gap-2">
          {/* Total */}
          <div className="bg-[#0A0A0A] text-[#FFFFFF] p-2.5 rounded-sm border border-[#3DDC10] space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-rajdhani font-bold text-[#3DDC10] uppercase">
                TOTAL
              </span>
              <Layers className="w-3 h-3 text-[#3DDC10]" />
            </div>
            <p className="text-xl font-mono font-bold">{metrics.total}</p>
          </div>

          {/* Published */}
          <div className="bg-[#0A0A0A] text-[#FFFFFF] p-2.5 rounded-sm border border-[#3DDC10] space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-rajdhani font-bold text-[#3DDC10] uppercase">
                LIVE
              </span>
              <CheckCircle2 className="w-3 h-3 text-[#3DDC10]" />
            </div>
            <p className="text-xl font-mono font-bold text-[#3DDC10]">
              {metrics.byStatus.published}
            </p>
          </div>

          {/* Scheduled */}
          <div className="bg-[#F8F9FA] text-[#0A0A0A] p-2.5 rounded-sm border border-[#FF7A00] space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-rajdhani font-bold text-[#FF7A00] uppercase">
                QUEUED
              </span>
              <Clock className="w-3 h-3 text-[#FF7A00]" />
            </div>
            <p className="text-xl font-mono font-bold text-[#FF7A00]">
              {metrics.byStatus.scheduled}
            </p>
          </div>

          {/* Drafts */}
          <div className="bg-[#F8F9FA] text-[#0A0A0A] p-2.5 rounded-sm border border-[#0A0A0A] space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-rajdhani font-bold text-[#71717A] uppercase">
                DRAFTS
              </span>
              <FileText className="w-3 h-3 text-[#0A0A0A]" />
            </div>
            <p className="text-xl font-mono font-bold text-[#0A0A0A]">
              {metrics.byStatus.draft}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Channel Filter Widget */}
      <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm p-4 space-y-3 shadow-card-white">
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-2.5">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#3DDC10]" />
            <h3 className="text-xs font-space uppercase font-bold text-[#0A0A0A] tracking-wider">
              CHANNEL QUICK FILTER
            </h3>
          </div>
          {activeFilter !== "all" && (
            <button
              type="button"
              onClick={() => handlePlatformClick("all")}
              className="text-[10px] font-mono text-[#FF7A00] hover:underline font-bold uppercase"
            >
              RESET
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((pId) => {
            const cfg = PLATFORM_CONFIGS[pId];
            const IconComp = BRAND_SVGS[pId];
            const count = metrics.byPlatform[pId] || 0;
            const isSelected = activeFilter === pId;

            return (
              <button
                key={pId}
                type="button"
                onClick={() => handlePlatformClick(isSelected ? "all" : pId)}
                className={`flex items-center justify-between p-2 rounded-sm border transition-all text-left ${
                  isSelected
                    ? "bg-[#0A0A0A] text-[#FFFFFF] border-[#3DDC10] shadow-sm"
                    : "bg-[#F8F9FA] text-[#0A0A0A] border-[#0A0A0A] hover:border-[#3DDC10]"
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#3DDC10]" : "text-[#0A0A0A]"}`} />
                  <span className="text-[11px] font-rajdhani font-bold uppercase truncate">
                    {cfg.name.split(" ")[0]}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                    isSelected ? "bg-[#3DDC10] text-[#0A0A0A]" : "bg-[#0A0A0A] text-[#3DDC10]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Upcoming Queue Snippet */}
      <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm p-4 space-y-3 shadow-card-white">
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-2.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF7A00]" />
            <h3 className="text-xs font-space uppercase font-bold text-[#0A0A0A] tracking-wider">
              UPCOMING QUEUE ({upcomingPosts.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("calendar")}
            className="text-[10px] font-mono text-[#0A0A0A] hover:text-[#3DDC10] flex items-center gap-1 font-bold uppercase transition-colors"
          >
            CALENDAR <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {upcomingPosts.length === 0 ? (
          <div className="p-4 bg-[#F8F9FA] border border-dashed border-[#0A0A0A] rounded text-center space-y-1">
            <Calendar className="w-5 h-5 text-[#71717A] mx-auto" />
            <p className="text-[11px] font-space text-[#71717A] uppercase font-bold">
              No scheduled posts
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingPosts.slice(0, 3).map((post) => {
              const scheduledDate = post.scheduledAt ? new Date(post.scheduledAt) : new Date();
              return (
                <div
                  key={post.id}
                  className="bg-[#F8F9FA] border border-[#0A0A0A] rounded-sm p-2.5 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold text-[#FF7A00] bg-[#FF7A00]/10 px-1.5 py-0.5 rounded border border-[#FF7A00]/40">
                      {scheduledDate.toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      {post.platforms.map((pId) => {
                        const IconComp = BRAND_SVGS[pId];
                        return (
                          <span
                            key={pId}
                            className="inline-flex items-center p-0.5 rounded bg-[#0A0A0A] text-[#3DDC10]"
                            title={pId}
                          >
                            <IconComp className="w-2.5 h-2.5" />
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <p className="font-space font-bold text-[#0A0A0A] text-xs truncate">
                    {post.title}
                  </p>

                  {canPublish && (
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handlePublishPost(post.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-rajdhani font-extrabold uppercase px-2 py-0.5 rounded bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] border border-[#0A0A0A]"
                      >
                        <Send className="w-2.5 h-2.5" /> Publish Now
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
});

FeedSidebar.displayName = "FeedSidebar";
export default FeedSidebar;
