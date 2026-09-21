/**
 * ActivityLogView.tsx - Admin Activity Log & Audit Trail Console.
 * Displays searchable & filterable audit timeline, draft ID history lookup,
 * and user action summary cards styled in Omnitrix dark/hazard aesthetic.
 * Optimized with React.memo, ActivityLogRow item component, and memoized selectors.
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAllActivities,
  selectUserActionStats,
  selectFilteredActivities,
  fetchActivitiesThunk,
  resetActivities,
} from "./activitySlice";
import { ActivityActionType, ActivityLogEntry } from "../../types/activity";
import {
  Shield,
  Search,
  Filter,
  History,
  UserCheck,
  Calendar,
  Clock,
  Send,
  Trash2,
  Edit3,
  PlusCircle,
  RotateCcw,
  Users,
} from "lucide-react";

const ACTION_CONFIGS: Record<
  ActivityActionType,
  { label: string; bg: string; text: string; border: string; icon: React.FC<{ className?: string }> }
> = {
  created: {
    label: "CREATED",
    bg: "bg-[#3DDC10]/10",
    text: "text-[#3DDC10]",
    border: "border-[#3DDC10]/40",
    icon: (props) => <PlusCircle {...props} />,
  },
  edited: {
    label: "EDITED",
    bg: "bg-[#FFFFFF]/10",
    text: "text-[#FFFFFF]",
    border: "border-[#FFFFFF]/40",
    icon: (props) => <Edit3 {...props} />,
  },
  scheduled: {
    label: "SCHEDULED",
    bg: "bg-[#FF7A00]/10",
    text: "text-[#FF7A00]",
    border: "border-[#FF7A00]/40",
    icon: (props) => <Clock {...props} />,
  },
  published: {
    label: "PUBLISHED",
    bg: "bg-[#3DDC10]/20",
    text: "text-[#3DDC10]",
    border: "border-[#3DDC10]",
    icon: (props) => <Send {...props} />,
  },
  deleted: {
    label: "DELETED",
    bg: "bg-[#FF4D4D]/10",
    text: "text-[#FF4D4D]",
    border: "border-[#FF4D4D]/40",
    icon: (props) => <Trash2 {...props} />,
  },
};

interface ActivityLogRowProps {
  entry: ActivityLogEntry;
}

/**
 * Memoized Individual Activity Log Row Component
 */
const ActivityLogRow: React.FC<ActivityLogRowProps> = React.memo(({ entry }) => {
  const cfg = ACTION_CONFIGS[entry.actionType] || ACTION_CONFIGS.edited;
  const ActionIcon = cfg.icon;

  return (
    <div className="relative bg-[#0A0A0A] text-[#FFFFFF] border-2 border-[#2A2A2A] hover:border-[#3DDC10] rounded-sm p-4 space-y-2.5 transition-all shadow-md group">
      {/* Timeline Bullet Pin */}
      <div className="absolute -left-[25px] top-4 w-4 h-4 rounded-full bg-[#3DDC10] border-2 border-[#0A0A0A] shadow-omni"></div>

      {/* Top Meta Line: Action Badge + Target ID + User Info + Timestamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2A2A] pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${cfg.bg} ${cfg.text} ${cfg.border}`}
          >
            <ActionIcon className="w-3 h-3" />
            {cfg.label}
          </span>

          <span className="text-[11px] font-mono text-[#3DDC10] bg-[#141414] px-2 py-0.5 rounded border border-[#2A2A2A] font-bold">
            {entry.targetType.toUpperCase()}: {entry.targetId}
          </span>

          {entry.title && (
            <span className="text-xs font-space font-bold text-[#FFFFFF] truncate max-w-xs">
              "{entry.title}"
            </span>
          )}
        </div>

        <span className="text-[10px] font-mono text-[#71717A] shrink-0 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#3DDC10]" />
          {new Date(entry.timestamp).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>

      {/* Summary Text */}
      <p className="text-xs font-inter text-[#FFFFFF] leading-relaxed">
        {entry.summary}
      </p>

      {/* User Attribution Footer */}
      <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#71717A]">
        <span className="flex items-center gap-1.5 text-[#3DDC10]">
          <UserCheck className="w-3.5 h-3.5 text-[#3DDC10]" />
          PERFORMED BY: <strong className="text-[#FFFFFF] uppercase">{entry.userName}</strong> ({entry.userId})
        </span>
        <span className="uppercase text-[#FF7A00] font-bold">ROLE: {entry.userRole}</span>
      </div>
    </div>
  );
});
ActivityLogRow.displayName = "ActivityLogRow";

export const ActivityLogView: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const activities = useAppSelector(selectAllActivities);
  const userStats = useAppSelector(selectUserActionStats);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserFilter, setSelectedUserFilter] = useState("all");
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>("all");
  const [targetIdLookup, setTargetIdLookup] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"all" | "draft" | "post">("all");

  useEffect(() => {
    dispatch(fetchActivitiesThunk());
  }, [dispatch]);

  // Memoized filter criteria object
  const filterCriteria = useMemo(
    () => ({
      searchQuery,
      targetIdLookup,
      selectedUserFilter,
      selectedActionFilter,
      selectedTypeFilter,
    }),
    [searchQuery, targetIdLookup, selectedUserFilter, selectedActionFilter, selectedTypeFilter]
  );

  // Memoized filtered activities using Redux selector
  const filteredActivities = useAppSelector((state) =>
    selectFilteredActivities(state, filterCriteria)
  );

  const handleResetLog = useCallback(() => {
    if (window.confirm("Reset Activity Log to default initial seed events?")) {
      dispatch(resetActivities());
    }
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setTargetIdLookup("");
    setSelectedUserFilter("all");
    setSelectedActionFilter("all");
    setSelectedTypeFilter("all");
  }, []);

  const isFilterActive =
    Boolean(searchQuery) ||
    Boolean(targetIdLookup) ||
    selectedUserFilter !== "all" ||
    selectedActionFilter !== "all" ||
    selectedTypeFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0A0A0A] border-2 border-[#3DDC10] rounded-sm p-5 space-y-4 shadow-omni text-[#FFFFFF]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#3DDC10] text-[#0A0A0A] flex items-center justify-center font-bold shadow-omni shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-sekuya uppercase font-extrabold text-[#FFFFFF] tracking-wider">
                  SYSTEM ACTIVITY &amp; AUDIT TRAIL
                </h2>
                <span className="bg-[#3DDC10] text-[#0A0A0A] font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs font-switzer text-[#71717A]">
                Comprehensive audit trail tracking draft creation, post modifications, scheduling, and deletions.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetLog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#141414] hover:bg-[#2A2A2A] text-[#3DDC10] border border-[#3DDC10]/50 text-xs font-mono font-bold transition-colors shrink-0 self-start sm:self-auto"
            title="Reset log entries"
          >
            <RotateCcw className="w-3.5 h-3.5" /> RESET AUDIT LOG
          </button>
        </div>

        {/* User Action Summary Cards Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-space font-bold uppercase tracking-wider text-[#3DDC10]">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> ACTIONS PER USER SUMMARY
            </span>
            <span className="text-[10px] font-mono text-[#71717A]">
              {userStats.length} Active Contributors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {userStats.map((stat) => (
              <div
                key={stat.userId}
                className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-3.5 space-y-2 text-xs font-mono relative overflow-hidden group hover:border-[#3DDC10] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#FFFFFF] truncate flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#3DDC10]" />
                    {stat.userName}
                  </span>
                  <span className="text-[10px] bg-[#3DDC10] text-[#0A0A0A] px-1.5 py-0.5 rounded uppercase font-extrabold">
                    {stat.userRole}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[11px] text-center pt-1 border-t border-[#2A2A2A]">
                  <div className="bg-[#0A0A0A] p-1.5 rounded border border-[#2A2A2A]">
                    <span className="text-[#71717A] text-[9px] block">TOTAL</span>
                    <span className="font-bold text-[#3DDC10]">{stat.total}</span>
                  </div>
                  <div className="bg-[#0A0A0A] p-1.5 rounded border border-[#2A2A2A]">
                    <span className="text-[#71717A] text-[9px] block">CREATED</span>
                    <span className="font-bold text-[#FFFFFF]">{stat.created}</span>
                  </div>
                  <div className="bg-[#0A0A0A] p-1.5 rounded border border-[#2A2A2A]">
                    <span className="text-[#71717A] text-[9px] block">PUBLISHED</span>
                    <span className="font-bold text-[#FF7A00]">{stat.published}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter & Lookup Controls Bar */}
      <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm p-4 space-y-3 shadow-card-white text-[#0A0A0A]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-space">
          {/* General Search */}
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
              SEARCH LOG ENTRIES
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search copy, user, or action..."
                className="w-full pl-9 pr-3 py-2 bg-[#F8F9FA] border-2 border-[#0A0A0A] rounded-sm text-xs font-inter focus:outline-none focus:border-[#3DDC10]"
              />
            </div>
          </div>

          {/* Specific Draft / Post ID Lookup */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
              LOOKUP DRAFT / POST ID
            </label>
            <div className="relative">
              <History className="w-4 h-4 text-[#3DDC10] absolute left-3 top-2.5" />
              <input
                type="text"
                value={targetIdLookup}
                onChange={(e) => setTargetIdLookup(e.target.value)}
                placeholder="e.g. draft-101 or post-1"
                className="w-full pl-9 pr-3 py-2 bg-[#F8F9FA] border-2 border-[#0A0A0A] rounded-sm text-xs font-mono focus:outline-none focus:border-[#3DDC10]"
              />
            </div>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
              FILTER BY USER
            </label>
            <select
              value={selectedUserFilter}
              onChange={(e) => setSelectedUserFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F9FA] border-2 border-[#0A0A0A] rounded-sm text-xs font-mono font-bold focus:outline-none focus:border-[#3DDC10]"
            >
              <option value="all">ALL USERS</option>
              {userStats.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.userName} ({u.userId})
                </option>
              ))}
            </select>
          </div>

          {/* Action Type Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
              FILTER BY ACTION TYPE
            </label>
            <select
              value={selectedActionFilter}
              onChange={(e) => setSelectedActionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F9FA] border-2 border-[#0A0A0A] rounded-sm text-xs font-mono font-bold focus:outline-none focus:border-[#3DDC10]"
            >
              <option value="all">ALL ACTION TYPES</option>
              <option value="created">CREATED</option>
              <option value="edited">EDITED</option>
              <option value="scheduled">SCHEDULED</option>
              <option value="published">PUBLISHED</option>
              <option value="deleted">DELETED</option>
            </select>
          </div>
        </div>

        {isFilterActive && (
          <div className="flex items-center justify-between text-xs font-mono bg-[#F8F9FA] p-2 rounded border border-[#0A0A0A] pt-2">
            <span className="text-[#0A0A0A] font-bold">
              Active Filtered Results: {filteredActivities.length} / {activities.length} entries
            </span>
            <button
              onClick={handleClearFilters}
              className="text-[#FF7A00] font-bold underline hover:text-[#0A0A0A]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Activity Timeline List */}
      <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm p-5 space-y-4 shadow-card-white text-[#0A0A0A]">
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-3">
          <h3 className="text-base font-sekuya uppercase font-bold text-[#0A0A0A] flex items-center gap-2">
            <History className="w-5 h-5 text-[#3DDC10]" />
            AUDIT TRAIL TIMELINE ({filteredActivities.length})
          </h3>
          {targetIdLookup && (
            <span className="text-xs font-mono bg-[#0A0A0A] text-[#3DDC10] px-2.5 py-1 rounded border border-[#3DDC10]">
              LOOKUP ID: {targetIdLookup}
            </span>
          )}
        </div>

        {filteredActivities.length === 0 ? (
          <div className="bg-[#F8F9FA] border-2 border-dashed border-[#0A0A0A] rounded-sm p-10 text-center space-y-2">
            <Filter className="w-8 h-8 text-[#71717A] mx-auto" />
            <p className="text-xs font-space uppercase font-bold text-[#0A0A0A]">
              NO AUDIT ENTRIES FOUND MATCHING FILTERS
            </p>
          </div>
        ) : (
          <div className="relative pl-4 border-l-2 border-[#0A0A0A] space-y-4">
            {filteredActivities.map((entry) => (
              <ActivityLogRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
ActivityLogView.displayName = "ActivityLogView";

export default ActivityLogView;
