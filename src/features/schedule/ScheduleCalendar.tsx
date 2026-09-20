/**
 * ScheduleCalendar.tsx - Tri-Color Balance & 5 Google Fonts Integration for Timeline.
 * Includes memoized item components for calendar row rendering.
 */

import React, { useCallback } from "react";
import { Post } from "../../types/post";
import { PLATFORM_CONFIGS, PlatformId } from "../../types/platform";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import { Calendar as CalendarIcon, Clock, Send } from "lucide-react";
import { usePermission } from "../auth/usePermission";

export interface ScheduleCalendarProps {
  scheduledPosts: Post[];
  onPublishNow?: (postId: string) => void;
}

const BRAND_SVGS: Record<PlatformId, React.FC<{ className?: string }>> = {
  twitter: (props) => <TwitterIcon {...props} />,
  instagram: (props) => <InstagramIcon {...props} />,
  linkedin: (props) => <LinkedInIcon {...props} />,
  facebook: (props) => <FacebookIcon {...props} />,
};

interface ScheduledPostItemProps {
  post: Post;
  canPublish: boolean;
  onPublishNow?: (postId: string) => void;
}

/**
 * Memoized Individual Scheduled Post Row Component
 */
const ScheduledPostItem: React.FC<ScheduledPostItemProps> = React.memo(
  ({ post, canPublish, onPublishNow }) => {
    const scheduledDate = post.scheduledAt ? new Date(post.scheduledAt) : new Date();

    const handlePublishClick = useCallback(() => {
      if (onPublishNow) onPublishNow(post.id);
    }, [onPublishNow, post.id]);

    return (
      <div className="bg-[#F8F9FA] border-2 border-[#0A0A0A] hover:border-[#3DDC10] rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:shadow-md">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/40 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FF7A00]" />
              {scheduledDate.toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <h4 className="text-sm font-space font-bold text-[#0A0A0A] truncate">
              {post.title}
            </h4>
          </div>

          <p className="text-xs font-inter text-[#71717A] line-clamp-1 leading-relaxed">
            {post.content}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {post.platforms.map((pId: PlatformId) => {
              const IconComp = BRAND_SVGS[pId];
              return (
                <span
                  key={pId}
                  className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm bg-[#0A0A0A] text-[#3DDC10] border border-[#0A0A0A]"
                >
                  <IconComp className="w-3 h-3" />
                  {pId}
                </span>
              );
            })}
          </div>
        </div>

        {canPublish && onPublishNow && (
          <button
            type="button"
            onClick={handlePublishClick}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] font-rajdhani text-xs font-extrabold uppercase tracking-widest transition-all shrink-0 shadow-sm border border-[#0A0A0A]"
          >
            <Send className="w-3.5 h-3.5" /> PUBLISH NOW
          </button>
        )}
      </div>
    );
  }
);
ScheduledPostItem.displayName = "ScheduledPostItem";

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = React.memo(
  ({ scheduledPosts, onPublishNow }) => {
    const canPublish = usePermission("publish_post");

    return (
      <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm p-5 sm:p-7 space-y-5 shadow-card-white">
        {/* Header Bar using Space Grotesk */}
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#3DDC10]" />
            <h2 className="text-xl font-space uppercase font-extrabold text-[#0A0A0A] tracking-wider">
              SCHEDULE CALENDAR ({scheduledPosts.length})
            </h2>
          </div>
        </div>

        {/* Timeline Tile List */}
        {scheduledPosts.length === 0 ? (
          <div className="bg-[#F8F9FA] border-2 border-dashed border-[#0A0A0A] rounded-sm p-10 text-center space-y-2">
            <Clock className="w-8 h-8 text-[#71717A] mx-auto" />
            <p className="text-xs font-space uppercase font-bold text-[#0A0A0A]">
              NO SCHEDULED POSTS QUEUED
            </p>
            <p className="text-[11px] font-inter text-[#71717A]">
              Use the Post Creator to schedule content for future automatic publishing across your channels.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledPosts.map((post) => (
              <ScheduledPostItem
                key={post.id}
                post={post}
                canPublish={canPublish}
                onPublishNow={onPublishNow}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
ScheduleCalendar.displayName = "ScheduleCalendar";

export default ScheduleCalendar;
