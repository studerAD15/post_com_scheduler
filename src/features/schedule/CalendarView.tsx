/**
 * CalendarView.tsx - Full-Fledged Interactive Calendar Grid (Month & Week Views).
 * Features HTML5 Drag-and-Drop rescheduling, Reselect parametric selectors,
 * RBAC permission checks, keyboard navigation, and Omnitrix design tokens.
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectPostsGroupedByDate } from "../posts/postsSelectors";
import { selectAllPosts, schedulePostThunk, publishPostThunk, deletePostThunk } from "../posts/postsSlice";
import { usePermission } from "../auth/usePermission";
import { Post, PostStatus } from "../../types/post";
import { PlatformId, PLATFORM_CONFIGS } from "../../types/platform";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  Send,
  Edit3,
  Trash2,
  X,
  GripVertical,
  CheckCircle2,
} from "lucide-react";

export interface CalendarViewProps {
  onPublishNow?: (postId: string) => void;
  onEditPost?: (post: Post) => void;
  onReschedulePost?: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
  onCreatePostForDate?: (dateStr: string) => void;
}

const BRAND_SVGS: Record<PlatformId, React.FC<{ className?: string }>> = {
  twitter: (props) => <TwitterIcon {...props} />,
  instagram: (props) => <InstagramIcon {...props} />,
  linkedin: (props) => <LinkedInIcon {...props} />,
  facebook: (props) => <FacebookIcon {...props} />,
};

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface CalendarDay {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

/**
 * Format Date to YYYY-MM-DD ISO string using local timezone
 */
function toLocalDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ----------------------------------------------------------------------
// Memoized Sub-Component: PostChip
// ----------------------------------------------------------------------
export interface PostChipProps {
  post: Post;
  canSchedule: boolean;
  onSelectPost: (post: Post) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, post: Post) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
}

export const PostChip: React.FC<PostChipProps> = React.memo(
  ({ post, canSchedule, onSelectPost, onDragStart, onDragEnd, isDragging }) => {
    const isDraggable = canSchedule && (post.status === "draft" || post.status === "scheduled");

    const formattedTime = useMemo(() => {
      const targetIso = post.scheduledAt || post.createdAt;
      try {
        return new Date(targetIso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } catch {
        return "";
      }
    }, [post.scheduledAt, post.createdAt]);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectPost(post);
      },
      [onSelectPost, post]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onSelectPost(post);
        }
      },
      [onSelectPost, post]
    );

    const handleDragStartLocal = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        if (!isDraggable) {
          e.preventDefault();
          return;
        }
        onDragStart(e, post);
      },
      [isDraggable, onDragStart, post]
    );

    const statusBadgeStyle =
      post.status === "published"
        ? "bg-[#3DDC10]/20 text-[#15803D] border-[#3DDC10]"
        : post.status === "scheduled"
        ? "bg-[#FF7A00]/20 text-[#C2410C] border-[#FF7A00]"
        : "bg-[#F4F4F5] text-[#52525B] border-[#E5E7EB]";

    return (
      <div
        draggable={isDraggable}
        onDragStart={handleDragStartLocal}
        onDragEnd={onDragEnd}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${post.title}, ${post.status}, scheduled at ${formattedTime}`}
        className={`group relative bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] hover:border-[#15803D] rounded-sm p-1.5 transition-all text-xs shadow-sm flex flex-col gap-1 select-none focus:outline-none focus:ring-2 focus:ring-[#3DDC10] ${
          isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        } ${isDragging ? "opacity-40 border-dashed border-[#15803D]" : ""}`}
      >
        <div className="flex items-center justify-between gap-1">
          <span
            className={`px-1 py-0.2 text-[9px] font-mono font-bold uppercase rounded border ${statusBadgeStyle}`}
          >
            {post.status.substring(0, 3)}
          </span>
          <span className="text-[10px] font-mono text-[#71717A] shrink-0">{formattedTime}</span>
        </div>

        <p className="font-space text-[11px] font-bold text-[#0A0A0A] truncate leading-snug">
          {post.title || "Untitled Post"}
        </p>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1">
            {post.platforms.map((pId) => {
              const IconComp = BRAND_SVGS[pId];
              return IconComp ? (
                <span key={pId} className="text-[#0A0A0A]" title={pId}>
                  <IconComp className="w-3 h-3" />
                </span>
              ) : null;
            })}
          </div>

          {isDraggable && (
            <span className="text-[#71717A] group-hover:text-[#15803D] transition-colors">
              <GripVertical className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    );
  }
);
PostChip.displayName = "PostChip";

// ----------------------------------------------------------------------
// Memoized Sub-Component: DayCell (Month View Grid Cell)
// ----------------------------------------------------------------------
export interface DayCellProps {
  date: Date;
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  posts: Post[];
  maxChips?: number;
  canCreate: boolean;
  canSchedule: boolean;
  isDragTarget: boolean;
  onSelectDay: (dateStr: string, posts: Post[]) => void;
  onSelectPost: (post: Post) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, post: Post) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, dateStr: string) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetDateStr: string) => void;
  draggedPostId: string | null;
}

export const DayCell: React.FC<DayCellProps> = React.memo(
  ({
    dateStr,
    dayNumber,
    isCurrentMonth,
    isToday,
    isWeekend,
    posts,
    maxChips = 3,
    canCreate,
    canSchedule,
    isDragTarget,
    onSelectDay,
    onSelectPost,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    draggedPostId,
  }) => {
    const visibleChips = posts.slice(0, maxChips);
    const overflowCount = posts.length - maxChips;

    const handleCellClick = useCallback(
      (e: React.MouseEvent) => {
        // Open day detail or create flow
        if ((e.target as HTMLElement).closest("[role='button']")) return;
        onSelectDay(dateStr, posts);
      },
      [dateStr, onSelectDay, posts]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          if ((e.target as HTMLElement).closest("[role='button']") !== e.currentTarget) return;
          e.preventDefault();
          onSelectDay(dateStr, posts);
        }
      },
      [dateStr, onSelectDay, posts]
    );

    const handleDragOverLocal = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        onDragOver(e, dateStr);
      },
      [dateStr, onDragOver]
    );

    const handleDropLocal = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        onDrop(e, dateStr);
      },
      [dateStr, onDrop]
    );

    return (
      <div
        onClick={handleCellClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOverLocal}
        onDragLeave={onDragLeave}
        onDrop={handleDropLocal}
        tabIndex={0}
        role="button"
        aria-label={`${dateStr}, ${posts.length} posts scheduled`}
        className={`min-h-[110px] p-2 border-2 rounded-sm flex flex-col justify-between transition-all focus:outline-none focus:ring-1 focus:ring-[#3DDC10] ${
          isCurrentMonth ? "bg-[#FFFFFF] border-[#E5E7EB]" : "bg-[#F8F9FA] border-[#E5E7EB] text-[#A1A1AA]"
        } ${isToday ? "border-[#3DDC10] ring-1 ring-[#3DDC10] bg-[#3DDC10]/10" : ""} ${
          isDragTarget ? "border-2 border-[#15803D] bg-[#3DDC10]/15 shadow-md scale-[1.01]" : ""
        }`}
      >
        {/* Cell Header: Day number + Add affordance */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-1 mb-1">
          <span
            className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm ${
              isToday
                ? "bg-[#3DDC10] text-[#0A0A0A]"
                : isCurrentMonth
                ? "text-[#0A0A0A]"
                : "text-[#A1A1AA]"
            }`}
          >
            {dayNumber}
          </span>

          {canCreate && (
            <span
              title="Add post for this date"
              className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-0.5 text-[#71717A] hover:text-[#0A0A0A] transition-opacity cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Chips Stack */}
        <div className="flex-1 space-y-1 overflow-hidden">
          {visibleChips.map((post) => (
            <PostChip
              key={post.id}
              post={post}
              canSchedule={canSchedule}
              onSelectPost={onSelectPost}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedPostId === post.id}
            />
          ))}

          {overflowCount > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectDay(dateStr, posts);
              }}
              className="w-full text-center py-0.5 text-[10px] font-mono font-bold text-[#C2410C] bg-[#FFF7ED] hover:bg-[#FFEDD5] rounded border border-[#FED7AA] transition-colors"
            >
              +{overflowCount} MORE
            </button>
          )}
        </div>
      </div>
    );
  }
);
DayCell.displayName = "DayCell";

// ----------------------------------------------------------------------
// Memoized Sub-Component: WeekColumn (Week View Agenda Column)
// ----------------------------------------------------------------------
export interface WeekColumnProps {
  date: Date;
  dateStr: string;
  dayNumber: number;
  dayName: string;
  isToday: boolean;
  posts: Post[];
  canCreate: boolean;
  canSchedule: boolean;
  isDragTarget: boolean;
  onSelectDay: (dateStr: string, posts: Post[]) => void;
  onSelectPost: (post: Post) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, post: Post) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, dateStr: string) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetDateStr: string) => void;
  draggedPostId: string | null;
}

export const WeekColumn: React.FC<WeekColumnProps> = React.memo(
  ({
    dateStr,
    dayNumber,
    dayName,
    isToday,
    posts,
    canCreate,
    canSchedule,
    isDragTarget,
    onSelectDay,
    onSelectPost,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    draggedPostId,
  }) => {
    const handleColumnClick = useCallback(
      (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("[role='button']")) return;
        onSelectDay(dateStr, posts);
      },
      [dateStr, onSelectDay, posts]
    );

    const handleDragOverLocal = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        onDragOver(e, dateStr);
      },
      [dateStr, onDragOver]
    );

    const handleDropLocal = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        onDrop(e, dateStr);
      },
      [dateStr, onDrop]
    );

    return (
      <div
        onClick={handleColumnClick}
        onDragOver={handleDragOverLocal}
        onDragLeave={onDragLeave}
        onDrop={handleDropLocal}
        className={`min-h-[350px] bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm p-3 flex flex-col space-y-3 transition-all ${
          isToday ? "border-[#3DDC10] shadow-md bg-[#3DDC10]/5" : ""
        } ${isDragTarget ? "border-2 border-[#15803D] bg-[#3DDC10]/15 scale-[1.01]" : ""}`}
      >
        {/* Day Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
          <div>
            <span className="text-[10px] font-space font-extrabold uppercase text-[#71717A] block">
              {dayName}
            </span>
            <span
              className={`font-mono text-sm font-bold ${
                isToday ? "text-[#15803D] bg-[#F4F4F5] border border-[#3DDC10] px-1.5 py-0.5 rounded-sm" : "text-[#0A0A0A]"
              }`}
            >
              {dayNumber}
            </span>
          </div>

          <span className="badge-omni badge-omni-neutral">
            {posts.length} POSTS
          </span>
        </div>

        {/* Full Posts Stack */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {posts.length === 0 ? (
            <div className="py-8 text-center text-xs font-inter font-normal text-[#71717A] border border-dashed border-[#E5E7EB] rounded-sm bg-[#F8F9FA]">
              No posts scheduled
            </div>
          ) : (
            posts.map((post) => (
              <PostChip
                key={post.id}
                post={post}
                canSchedule={canSchedule}
                onSelectPost={onSelectPost}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isDragging={draggedPostId === post.id}
              />
            ))
          )}
        </div>
      </div>
    );
  }
);
WeekColumn.displayName = "WeekColumn";

// ----------------------------------------------------------------------
// Memoized Sub-Component: DayDetailPanel
// ----------------------------------------------------------------------
export interface DayDetailPanelProps {
  isOpen: boolean;
  dateStr: string;
  posts: Post[];
  onClose: () => void;
  onPublishNow?: (postId: string) => void;
  onEditPost?: (post: Post) => void;
  onReschedulePost?: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
  canPublish: boolean;
  canEdit: boolean;
  canSchedule: boolean;
  canDelete: boolean;
}

export const DayDetailPanel: React.FC<DayDetailPanelProps> = React.memo(
  ({
    isOpen,
    dateStr,
    posts,
    onClose,
    onPublishNow,
    onEditPost,
    onReschedulePost,
    onDeletePost,
    canPublish,
    canEdit,
    canSchedule,
    canDelete,
  }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`Posts for ${dateStr}`}
          className="bg-[#FFFFFF] text-[#0A0A0A] border-4 border-[#0A0A0A] rounded-sm p-6 max-w-xl w-full space-y-5 shadow-card-white max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 shrink-0">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#15803D]" />
              <h3 className="text-base font-sekuya uppercase font-bold text-[#0A0A0A] tracking-wider">
                POSTS FOR {dateStr} ({posts.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-[#71717A] hover:text-[#0A0A0A] p-1 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3DDC10]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {posts.length === 0 ? (
              <div className="bg-[#F8F9FA] border border-dashed border-[#E5E7EB] rounded-sm p-8 text-center space-y-2">
                <Clock className="w-8 h-8 text-[#71717A] mx-auto" />
                <p className="text-xs font-space uppercase font-bold text-[#0A0A0A]">
                  NO POSTS SCHEDULED ON THIS DAY
                </p>
              </div>
            ) : (
              posts.map((post) => {
                const targetTime = post.scheduledAt || post.createdAt;
                const formattedTimeStr = new Date(targetTime).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={post.id}
                    className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-sm p-4 space-y-3 shadow-sm hover:border-[#0A0A0A] transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            post.status === "published"
                              ? "badge-omni badge-omni-green"
                              : post.status === "scheduled"
                              ? "badge-omni badge-omni-warning"
                              : "badge-omni badge-omni-neutral"
                          }
                        >
                          {post.status}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#71717A]">
                          {formattedTimeStr}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {post.platforms.map((pId) => {
                          const IconComp = BRAND_SVGS[pId];
                          return IconComp ? (
                            <span
                              key={pId}
                              className="px-1.5 py-0.5 rounded-sm bg-[#FFFFFF] text-[#0A0A0A] text-[9px] font-mono font-bold uppercase flex items-center gap-1 border border-[#E5E7EB]"
                            >
                              <IconComp className="w-3 h-3" />
                              {pId}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-sekuya font-bold text-[#0A0A0A]">
                        {post.title || "Untitled Post"}
                      </h4>
                      <p className="text-xs font-inter font-normal text-[#52525B] mt-1 line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* RBAC Gated Action Controls */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
                      {canPublish && post.status !== "published" && onPublishNow && (
                        <button
                          type="button"
                          onClick={() => {
                            onPublishNow(post.id);
                            onClose();
                          }}
                          className="btn-omni-primary h-8 px-3 text-xs inline-flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" /> PUBLISH NOW
                        </button>
                      )}

                      {canSchedule && post.status !== "published" && onReschedulePost && (
                        <button
                          type="button"
                          onClick={() => {
                            onReschedulePost(post);
                            onClose();
                          }}
                          className="btn-omni-secondary h-8 px-3 text-xs text-[#FF7A00] border-[#FF7A00]/40 hover:border-[#FF7A00] inline-flex items-center gap-1.5"
                        >
                          <Clock className="w-3.5 h-3.5" /> RESCHEDULE
                        </button>
                      )}

                      {canEdit && onEditPost && (
                        <button
                          type="button"
                          onClick={() => {
                            onEditPost(post);
                            onClose();
                          }}
                          className="btn-omni-secondary h-8 px-3 text-xs inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> EDIT
                        </button>
                      )}

                      {canDelete && onDeletePost && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete post "${post.title}"?`)) {
                              onDeletePost(post.id);
                              onClose();
                            }
                          }}
                          className="btn-omni-ghost h-8 px-3 text-xs text-[#FF4D4D] hover:bg-[#FF4D4D]/10 inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> DELETE
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }
);
DayDetailPanel.displayName = "DayDetailPanel";

// ----------------------------------------------------------------------
// Main Component: CalendarView
// ----------------------------------------------------------------------
export const CalendarView: React.FC<CalendarViewProps> = React.memo(
  ({ onPublishNow, onEditPost, onReschedulePost, onDeletePost, onCreatePostForDate }) => {
    const dispatch = useAppDispatch();
    const postsGroupedByDate = useAppSelector(selectPostsGroupedByDate);
    const allPosts = useAppSelector(selectAllPosts);

    // Permission checks
    const canCreate = usePermission("create_post");
    const canEdit = usePermission("edit_post");
    const canDelete = usePermission("delete_post");
    const canSchedule = usePermission("schedule_post");
    const canPublish = usePermission("publish_post");

    // Local Component State
    const [viewMode, setViewMode] = useState<"month" | "week">("month");
    const [focusedDate, setFocusedDate] = useState<Date>(() => new Date());

    // Filters
    const [platformFilter, setPlatformFilter] = useState<"all" | PlatformId>("all");
    const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");

    // Drag-and-Drop Local State
    const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
    const [dragOverDateStr, setDragOverDateStr] = useState<string | null>(null);

    // Day Detail Panel State
    const [selectedDayDetail, setSelectedDayDetail] = useState<{
      isOpen: boolean;
      dateStr: string;
      posts: Post[];
    }>({
      isOpen: false,
      dateStr: "",
      posts: [],
    });

    // ------------------------------------------------------------------
    // Computed Grid Data Models
    // ------------------------------------------------------------------

    // Month grid generation
    const monthGrid = useMemo(() => {
      const year = focusedDate.getFullYear();
      const month = focusedDate.getMonth();

      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);

      const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
      const daysInMonth = lastDayOfMonth.getDate();

      const todayStr = toLocalDateStr(new Date());

      const days: CalendarDay[] = [];

      // Leading days from previous month
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const d = new Date(year, month - 1, prevMonthLastDay - i);
        const dateStr = toLocalDateStr(d);
        days.push({
          date: d,
          dateStr,
          dayNumber: d.getDate(),
          isCurrentMonth: false,
          isToday: dateStr === todayStr,
          isWeekend: d.getDay() === 0 || d.getDay() === 6,
        });
      }

      // Days of current month
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const dateStr = toLocalDateStr(d);
        days.push({
          date: d,
          dateStr,
          dayNumber: day,
          isCurrentMonth: true,
          isToday: dateStr === todayStr,
          isWeekend: d.getDay() === 0 || d.getDay() === 6,
        });
      }

      // Trailing days from next month to complete 7-column grid
      const totalCells = days.length > 35 ? 42 : 35;
      const trailingCount = totalCells - days.length;
      for (let day = 1; day <= trailingCount; day++) {
        const d = new Date(year, month + 1, day);
        const dateStr = toLocalDateStr(d);
        days.push({
          date: d,
          dateStr,
          dayNumber: day,
          isCurrentMonth: false,
          isToday: dateStr === todayStr,
          isWeekend: d.getDay() === 0 || d.getDay() === 6,
        });
      }

      // Chunk into weeks of 7
      const weeks: CalendarDay[][] = [];
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
      }

      const monthName = focusedDate.toLocaleString(undefined, { month: "long" }).toUpperCase();

      return { weeks, year, monthName };
    }, [focusedDate]);

    // Week grid generation
    const weekGrid = useMemo(() => {
      const d = new Date(focusedDate);
      const dayOfWeek = d.getDay();
      const sunday = new Date(d);
      sunday.setDate(d.getDate() - dayOfWeek);

      const todayStr = toLocalDateStr(new Date());

      const days: CalendarDay[] = [];
      for (let i = 0; i < 7; i++) {
        const curr = new Date(sunday);
        curr.setDate(sunday.getDate() + i);
        const dateStr = toLocalDateStr(curr);
        days.push({
          date: curr,
          dateStr,
          dayNumber: curr.getDate(),
          isCurrentMonth: true,
          isToday: dateStr === todayStr,
          isWeekend: curr.getDay() === 0 || curr.getDay() === 6,
        });
      }

      const startDateStr = days[0].date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const endDateStr = days[6].date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return { days, startDateStr, endDateStr };
    }, [focusedDate]);

    // Filter posts for day lookup
    const filteredGroupedPosts = useMemo(() => {
      const filteredMap: Record<string, Post[]> = {};

      Object.entries(postsGroupedByDate).forEach(([dateStr, posts]) => {
        const matching = posts.filter((post) => {
          const matchesPlatform =
            platformFilter === "all" || post.platforms.includes(platformFilter);
          const matchesStatus = statusFilter === "all" || post.status === statusFilter;
          return matchesPlatform && matchesStatus;
        });

        if (matching.length > 0) {
          filteredMap[dateStr] = matching;
        }
      });

      return filteredMap;
    }, [postsGroupedByDate, platformFilter, statusFilter]);

    // Total post count across visible view
    const totalVisiblePosts = useMemo(() => {
      return Object.values(filteredGroupedPosts).reduce((acc, list) => acc + list.length, 0);
    }, [filteredGroupedPosts]);

    // ------------------------------------------------------------------
    // Event Handlers
    // ------------------------------------------------------------------
    const handlePrev = useCallback(() => {
      setFocusedDate((prev) => {
        const next = new Date(prev);
        if (viewMode === "month") {
          next.setMonth(next.getMonth() - 1);
        } else {
          next.setDate(next.getDate() - 7);
        }
        return next;
      });
    }, [viewMode]);

    const handleNext = useCallback(() => {
      setFocusedDate((prev) => {
        const next = new Date(prev);
        if (viewMode === "month") {
          next.setMonth(next.getMonth() + 1);
        } else {
          next.setDate(next.getDate() + 7);
        }
        return next;
      });
    }, [viewMode]);

    const handleToday = useCallback(() => {
      setFocusedDate(new Date());
    }, []);

    const handleSelectDay = useCallback(
      (dateStr: string, posts: Post[]) => {
        if (posts.length > 0) {
          setSelectedDayDetail({
            isOpen: true,
            dateStr,
            posts,
          });
        } else if (canCreate && onCreatePostForDate) {
          onCreatePostForDate(dateStr);
        }
      },
      [canCreate, onCreatePostForDate]
    );

    const handleSelectPost = useCallback(
      (post: Post) => {
        const targetIso = post.scheduledAt || post.createdAt;
        const dateStr = targetIso.split("T")[0];
        const dayPosts = filteredGroupedPosts[dateStr] || [post];
        setSelectedDayDetail({
          isOpen: true,
          dateStr,
          posts: dayPosts,
        });
      },
      [filteredGroupedPosts]
    );

    const handleCloseDetail = useCallback(() => {
      setSelectedDayDetail({ isOpen: false, dateStr: "", posts: [] });
    }, []);

    // ------------------------------------------------------------------
    // HTML5 Drag-and-Drop Handlers
    // ------------------------------------------------------------------
    const handleDragStart = useCallback(
      (e: React.DragEvent<HTMLDivElement>, post: Post) => {
        if (!canSchedule || post.status === "published") return;
        setDraggedPostId(post.id);
        e.dataTransfer.setData("text/plain", post.id);
        e.dataTransfer.effectAllowed = "move";
      },
      [canSchedule]
    );

    const handleDragOver = useCallback(
      (e: React.DragEvent<HTMLDivElement>, targetDateStr: string) => {
        if (!draggedPostId || !canSchedule) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOverDateStr !== targetDateStr) {
          setDragOverDateStr(targetDateStr);
        }
      },
      [canSchedule, dragOverDateStr, draggedPostId]
    );

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    }, []);

    const handleDragEnd = useCallback(() => {
      setDraggedPostId(null);
      setDragOverDateStr(null);
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>, targetDateStr: string) => {
        e.preventDefault();
        setDragOverDateStr(null);

        const postId = draggedPostId || e.dataTransfer.getData("text/plain");
        if (!postId || !canSchedule) return;

        const targetPost = allPosts.find((p) => p.id === postId);
        if (!targetPost) return;

        // Disallow dragging published posts
        if (targetPost.status === "published") return;

        // Determine existing time component
        const existingIso = targetPost.scheduledAt || targetPost.createdAt;
        let timePart = "09:00:00";
        try {
          const d = new Date(existingIso);
          const hrs = String(d.getHours()).padStart(2, "0");
          const mins = String(d.getMinutes()).padStart(2, "0");
          const secs = String(d.getSeconds()).padStart(2, "0");
          timePart = `${hrs}:${mins}:${secs}`;
        } catch {
          // fallback
        }

        const currentPostDateStr = existingIso.split("T")[0];
        if (currentPostDateStr === targetDateStr) {
          // Same date drop - no-op
          setDraggedPostId(null);
          return;
        }

        const newScheduledDateTime = new Date(`${targetDateStr}T${timePart}`);
        if (isNaN(newScheduledDateTime.getTime())) {
          setDraggedPostId(null);
          return;
        }

        dispatch(
          schedulePostThunk({
            id: postId,
            scheduledAt: newScheduledDateTime.toISOString(),
          })
        );

        setDraggedPostId(null);
      },
      [allPosts, canSchedule, dispatch, draggedPostId]
    );

    // Default handlers for post actions
    const defaultPublishNow = useCallback(
      (postId: string) => {
        if (onPublishNow) onPublishNow(postId);
        else dispatch(publishPostThunk(postId));
      },
      [dispatch, onPublishNow]
    );

    const defaultDeletePost = useCallback(
      (postId: string) => {
        if (onDeletePost) onDeletePost(postId);
        else dispatch(deletePostThunk(postId));
      },
      [dispatch, onDeletePost]
    );

    return (
      <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm p-4 sm:p-6 space-y-5 shadow-card-white">
        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          {/* Header Title + Month/Week Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#FFFFFF] text-[#15803D] border-2 border-[#0A0A0A] flex items-center justify-center font-bold shadow-sm shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-sekuya uppercase font-extrabold text-[#0A0A0A] tracking-wider flex items-center gap-2">
                {viewMode === "month"
                  ? `${monthGrid.monthName} ${monthGrid.year}`
                  : `${weekGrid.startDateStr} – ${weekGrid.endDateStr}`}
              </h2>
              <p className="text-xs font-inter font-normal text-[#71717A]">
                Drag &amp; drop post chips between day cells to reschedule instantly across channels.
              </p>
            </div>
          </div>

          {/* Navigation Controls + View Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Prev / Today / Next Buttons */}
            <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 border border-[#E5E7EB] rounded-sm font-rajdhani text-xs font-bold uppercase">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-sm text-[#71717A] hover:bg-[#FFFFFF] hover:text-[#0A0A0A] transition-colors"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="px-3 py-1.5 rounded-sm text-[#0A0A0A] hover:bg-[#FFFFFF] transition-colors"
              >
                TODAY
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-sm text-[#71717A] hover:bg-[#FFFFFF] hover:text-[#0A0A0A] transition-colors"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Month / Week View Segmented Toggle (Reusing MainLayout button style) */}
            <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 rounded-sm border border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-rajdhani uppercase tracking-wider font-extrabold transition-all ${
                  viewMode === "month"
                    ? "bg-[#3DDC10] text-[#0A0A0A] shadow-sm"
                    : "text-[#71717A] hover:text-[#0A0A0A]"
                }`}
              >
                MONTH
              </button>
              <button
                type="button"
                onClick={() => setViewMode("week")}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-rajdhani uppercase tracking-wider font-extrabold transition-all ${
                  viewMode === "week"
                    ? "bg-[#3DDC10] text-[#0A0A0A] shadow-sm"
                    : "text-[#71717A] hover:text-[#0A0A0A]"
                }`}
              >
                WEEK
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar (Platform & Status Filters) */}
        <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-sm p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-inter">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-[#52525B] uppercase font-mono">
              <Filter className="w-3.5 h-3.5 text-[#15803D]" /> FILTER CALENDAR:
            </span>

            {/* Platform Filter */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as any)}
              className="px-2.5 py-1 bg-[#FFFFFF] border-2 border-[#0A0A0A] text-[#0A0A0A] rounded-sm text-xs font-mono font-bold focus:outline-none"
            >
              <option value="all">ALL PLATFORMS</option>
              <option value="twitter">Twitter / X</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1 bg-[#FFFFFF] border-2 border-[#0A0A0A] text-[#0A0A0A] rounded-sm text-xs font-mono font-bold focus:outline-none"
            >
              <option value="all">ALL STATUSES</option>
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="text-[11px] font-mono text-[#71717A] font-bold">
            Showing <strong className="text-[#15803D]">{totalVisiblePosts}</strong> visible posts
          </div>
        </div>

        {/* Calendar Grid Section */}
        {viewMode === "month" ? (
          /* Month View Grid */
          <div className="space-y-1">
            {/* Weekday Column Headers */}
            <div className="grid grid-cols-7 gap-1 text-center border-b border-[#E5E7EB] pb-2 text-xs font-mono font-bold uppercase tracking-wider text-[#71717A]">
              {WEEKDAY_NAMES.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Month Weeks Stack */}
            <div className="space-y-1">
              {monthGrid.weeks.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-cols-7 gap-1">
                  {week.map((day) => (
                    <DayCell
                      key={day.dateStr}
                      date={day.date}
                      dateStr={day.dateStr}
                      dayNumber={day.dayNumber}
                      isCurrentMonth={day.isCurrentMonth}
                      isToday={day.isToday}
                      isWeekend={day.isWeekend}
                      posts={filteredGroupedPosts[day.dateStr] || []}
                      canCreate={canCreate}
                      canSchedule={canSchedule}
                      isDragTarget={dragOverDateStr === day.dateStr}
                      onSelectDay={handleSelectDay}
                      onSelectPost={handleSelectPost}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      draggedPostId={draggedPostId}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Week View Agenda Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {weekGrid.days.map((day, idx) => (
              <WeekColumn
                key={day.dateStr}
                date={day.date}
                dateStr={day.dateStr}
                dayNumber={day.dayNumber}
                dayName={WEEKDAY_NAMES[idx]}
                isToday={day.isToday}
                posts={filteredGroupedPosts[day.dateStr] || []}
                canCreate={canCreate}
                canSchedule={canSchedule}
                isDragTarget={dragOverDateStr === day.dateStr}
                onSelectDay={handleSelectDay}
                onSelectPost={handleSelectPost}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                draggedPostId={draggedPostId}
              />
            ))}
          </div>
        )}

        {/* Day Detail Popover Panel */}
        <DayDetailPanel
          isOpen={selectedDayDetail.isOpen}
          dateStr={selectedDayDetail.dateStr}
          posts={selectedDayDetail.posts}
          onClose={handleCloseDetail}
          onPublishNow={defaultPublishNow}
          onEditPost={onEditPost}
          onReschedulePost={onReschedulePost}
          onDeletePost={defaultDeletePost}
          canPublish={canPublish}
          canEdit={canEdit}
          canSchedule={canSchedule}
          canDelete={canDelete}
        />
      </div>
    );
  }
);
CalendarView.displayName = "CalendarView";

export default CalendarView;
