/**
 * PostList.tsx - Tri-Color Balance & 5 Google Fonts Integration.
 */

import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectFilteredPostsByPlatform } from "./postsSelectors";
import { deletePostThunk, publishPostThunk } from "./postsSlice";
import { selectActivePlatformFilter, setPlatformFilter } from "../platforms/platformSlice";
import { PLATFORM_CONFIGS, PlatformId } from "../../types/platform";
import { Post } from "../../types/post";
import { usePermission } from "../auth/usePermission";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import {
  FileText,
  Clock,
  CheckCircle2,
  Trash2,
  Send,
  Calendar,
  Filter,
  ListFilter,
} from "lucide-react";

export interface PostListProps {
  onEditPost?: (post: Post) => void;
  onOpenScheduleModal?: (post: Post) => void;
}

const BRAND_SVGS: Record<PlatformId, React.FC<{ className?: string }>> = {
  twitter: (props) => <TwitterIcon {...props} />,
  instagram: (props) => <InstagramIcon {...props} />,
  linkedin: (props) => <LinkedInIcon {...props} />,
  facebook: (props) => <FacebookIcon {...props} />,
};

export const PostList: React.FC<PostListProps> = React.memo(
  ({ onEditPost, onOpenScheduleModal }) => {
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectFilteredPostsByPlatform);
    const activeFilter = useAppSelector(selectActivePlatformFilter);

    const canDelete = usePermission("delete_post");
    const canSchedule = usePermission("schedule_post");
    const canPublish = usePermission("publish_post");

    const handleFilterChange = (filter: PlatformId | "all") => {
      dispatch(setPlatformFilter(filter));
    };

    return (
      <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm p-5 sm:p-7 space-y-6 shadow-card-white">
        
        {/* Header Bar using Space Grotesk + Rajdhani */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#0A0A0A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-[#3DDC10]" />
              <h2 className="text-xl font-space uppercase font-bold text-[#0A0A0A] tracking-wider">
                ALL POSTS ({posts.length})
              </h2>
            </div>
            <p className="text-xs font-inter text-[#71717A] mt-0.5">
              View and manage published or scheduled posts across your social channels.
            </p>
          </div>

          {/* Industrial Platform Filter Chips using Rajdhani */}
          <div className="flex items-center gap-1 bg-[#0A0A0A] p-1.5 rounded-sm border border-[#0A0A0A] overflow-x-auto">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-3 py-1 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                activeFilter === "all"
                  ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni"
                  : "text-[#FFFFFF] hover:text-[#3DDC10]"
              }`}
            >
              ALL CHANNELS
            </button>
            {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((pId) => (
              <button
                key={pId}
                onClick={() => handleFilterChange(pId)}
                className={`px-2.5 py-1 rounded-sm text-xs font-rajdhani uppercase tracking-widest font-bold transition-all shrink-0 ${
                  activeFilter === pId
                    ? "bg-[#3DDC10] text-[#0A0A0A] shadow-omni"
                    : "text-[#FFFFFF] hover:text-[#3DDC10]"
                }`}
              >
                {pId}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Cards Grid */}
        {posts.length === 0 ? (
          <div className="bg-[#F8F9FA] border-2 border-dashed border-[#0A0A0A] rounded-sm p-10 text-center space-y-2">
            <Filter className="w-8 h-8 text-[#71717A] mx-auto" />
            <p className="text-xs font-space uppercase font-bold text-[#0A0A0A]">
              NO POSTS FOUND FOR THIS CHANNEL.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              let statusBadge = "bg-[#0A0A0A] text-[#71717A] border-[#0A0A0A]";
              let statusIcon = <FileText className="w-3.5 h-3.5" />;
              if (post.status === "scheduled") {
                statusBadge = "bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]";
                statusIcon = <Clock className="w-3.5 h-3.5 text-[#FF7A00]" />;
              } else if (post.status === "published") {
                statusBadge = "bg-[#0A0A0A] text-[#3DDC10] border-[#3DDC10]";
                statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC10]" />;
              }

              return (
                <div
                  key={post.id}
                  className="bg-[#F8F9FA] text-[#0A0A0A] border-2 border-[#0A0A0A] hover:border-[#3DDC10] rounded-sm p-5 space-y-3 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-space font-bold text-[#0A0A0A]">
                        {post.title}
                      </h3>
                      {post.authorName && (
                        <span className="text-[11px] font-mono text-[#71717A]">
                          Posted by: {post.authorName}
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-sm border ${statusBadge}`}
                    >
                      {statusIcon} {post.status}
                    </span>
                  </div>

                  <p className="text-sm font-inter text-[#0A0A0A] leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#0A0A0A]/20 text-xs">
                    {/* Brand Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {post.platforms.map((pId: PlatformId) => {
                        const IconComp = BRAND_SVGS[pId];
                        return (
                          <span
                            key={pId}
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-sm bg-[#0A0A0A] text-[#3DDC10] border border-[#0A0A0A]"
                          >
                            <IconComp className="w-3 h-3" />
                            {pId}
                          </span>
                        );
                      })}
                    </div>

                    {/* Action buttons using Rajdhani */}
                    <div className="flex items-center gap-2 font-rajdhani text-xs font-bold">
                      {post.status !== "published" && canSchedule && onOpenScheduleModal && (
                        <button
                          type="button"
                          onClick={() => onOpenScheduleModal(post)}
                          className="inline-flex items-center gap-1 text-[#0A0A0A] hover:text-[#3DDC10] uppercase px-3 py-1 rounded-sm bg-[#FFFFFF] border border-[#0A0A0A] hover:bg-[#0A0A0A] transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" /> SCHEDULE
                        </button>
                      )}

                      {post.status !== "published" && canPublish && (
                        <button
                          type="button"
                          onClick={() => dispatch(publishPostThunk(post.id))}
                          className="inline-flex items-center gap-1 text-[#0A0A0A] bg-[#3DDC10] hover:bg-[#34C20C] font-extrabold uppercase px-3 py-1 rounded-sm border border-[#0A0A0A] transition-colors shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" /> PUBLISH
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => dispatch(deletePostThunk(post.id))}
                          className="inline-flex items-center gap-1 text-[#71717A] hover:text-[#FF7A00] uppercase px-2.5 py-1 rounded-sm hover:bg-[#FF7A00]/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> DELETE
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);
