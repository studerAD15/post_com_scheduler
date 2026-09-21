import React, { useState, useCallback, useMemo } from "react";
import { Draft } from "../../types/draft";
import { PLATFORM_CONFIGS, PlatformId } from "../../types/platform";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../auth/authSlice";
import { usePermission } from "../auth/usePermission";
import {
  FileText,
  Clock,
  Edit3,
  Trash2,
  AlertTriangle,
  Loader2,
  Layers,
  Plus,
  Shield,
  UserCheck,
  History,
  Filter,
  Lock,
} from "lucide-react";

export interface DraftListProps {
  drafts: Draft[];
  isLoading?: boolean;
  error?: string | null;
  onEditDraft: (draft: Draft) => void;
  onDeleteDraft: (draftId: string) => void;
  onCreateNew?: () => void;
}

const BRAND_SVGS: Record<PlatformId, React.FC<{ className?: string }>> = {
  twitter: (props) => <TwitterIcon {...props} />,
  instagram: (props) => <InstagramIcon {...props} />,
  linkedin: (props) => <LinkedInIcon {...props} />,
  facebook: (props) => <FacebookIcon {...props} />,
};

interface DraftCardItemProps {
  draft: Draft;
  canEditDraft: boolean;
  canDeleteDraft: boolean;
  isAuditExpanded: boolean;
  isLoading?: boolean;
  onToggleAudit: (draftId: string) => void;
  onEditDraft: (draft: Draft) => void;
  onPromptDelete: (draftId: string) => void;
}

/**
 * Memoized Individual Draft Card Item
 */
const DraftCardItem: React.FC<DraftCardItemProps> = React.memo(
  ({
    draft,
    canEditDraft,
    canDeleteDraft,
    isAuditExpanded,
    isLoading = false,
    onToggleAudit,
    onEditDraft,
    onPromptDelete,
  }) => {
    const authorId = draft.authorId || "usr-editor-01";
    const authorName = draft.authorName || "Alex Rivers";
    const auditTrail = draft.auditTrail || [];

    const handleEditClick = useCallback(() => {
      onEditDraft(draft);
    }, [onEditDraft, draft]);

    const handleDeleteClick = useCallback(() => {
      onPromptDelete(draft.id);
    }, [onPromptDelete, draft.id]);

    const handleToggleAuditClick = useCallback(() => {
      onToggleAudit(draft.id);
    }, [onToggleAudit, draft.id]);

    return (
      <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] hover:border-[#3DDC10] rounded-sm p-5 flex flex-col justify-between transition-all hover:shadow-card-white group relative">
        <div className="space-y-3.5">
          {/* Author User ID Header Badge */}
          <div className="flex items-center justify-between gap-2 border-b border-[#0A0A0A]/10 pb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <UserCheck className="w-3.5 h-3.5 text-[#3DDC10] shrink-0" />
              <span className="text-[11px] font-mono font-bold text-[#0A0A0A] truncate">
                AUTHOR:{" "}
                <strong className="text-[#3DDC10] bg-[#0A0A0A] px-1.5 py-0.5 rounded">
                  {authorName}
                </strong>
              </span>
            </div>

            <span className="text-[10px] font-mono bg-[#F8F9FA] border border-[#0A0A0A] text-[#0A0A0A] px-2 py-0.5 rounded font-bold uppercase shrink-0">
              ID: {authorId}
            </span>
          </div>

          {/* Title & Status Badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-sekuya font-bold text-[#0A0A0A] line-clamp-1 group-hover:text-[#3DDC10] transition-colors">
              {draft.title || "Untitled Post Draft"}
            </h3>
            <span className="shrink-0 px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0A0A0A] text-[#3DDC10] border border-[#3DDC10]">
              DRAFT
            </span>
          </div>

          {/* Content Snippet */}
          <p className="text-xs font-switzer text-[#71717A] line-clamp-2 leading-relaxed">
            {draft.content || <span className="italic text-[#71717A]">No post content</span>}
          </p>

          {/* Target Platforms Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {draft.platforms.map((pId: PlatformId) => {
              const IconComp = BRAND_SVGS[pId];
              return (
                <span
                  key={pId}
                  className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm bg-[#0A0A0A] text-[#3DDC10] border border-[#0A0A0A]"
                >
                  <IconComp className="w-3 h-3" />
                  {pId}
                </span>
              );
            })}
          </div>

          {/* ADMIN DRAFT AUDIT TRAIL TIMELINE (Expandable) */}
          {auditTrail.length > 0 && (
            <div className="pt-2 border-t border-[#0A0A0A]/10 space-y-2">
              <button
                type="button"
                onClick={handleToggleAuditClick}
                className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-[#0A0A0A] hover:text-[#3DDC10] bg-[#F8F9FA] p-2 rounded border border-[#0A0A0A] transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#3DDC10]" />
                  USER ID REVISION TRAIL ({auditTrail.length})
                </span>
                <span>{isAuditExpanded ? "▲ Hide Log" : "▼ View Audit Trail"}</span>
              </button>

              {isAuditExpanded && (
                <div className="bg-[#0A0A0A] text-[#FFFFFF] p-3 rounded-sm space-y-2.5 text-[11px] font-mono border border-[#3DDC10]">
                  <p className="text-[10px] font-bold text-[#3DDC10] uppercase border-b border-[#2A2A2A] pb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> USER ID CHANGE TIMELINE
                  </p>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {auditTrail.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-[#141414] p-2 rounded border border-[#2A2A2A] space-y-1 text-[10px]"
                      >
                        <div className="flex items-center justify-between text-[#3DDC10]">
                          <span className="font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#3DDC10] rounded-full"></span>
                            {entry.name} ({entry.userId})
                          </span>
                          <span className="text-[#71717A]">
                            {new Date(entry.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <p className="text-[#FFFFFF]">{entry.changesSummary}</p>

                        <div className="flex items-center justify-between text-[9px] text-[#71717A] pt-0.5">
                          <span className="uppercase text-[#FF7A00]">
                            ACTION: {entry.action}
                          </span>
                          <span className="uppercase">ROLE: {entry.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-3 border-t-2 border-[#0A0A0A]/10 flex items-center justify-between text-[11px] text-[#71717A] font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#3DDC10]" />
            {new Date(draft.updatedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <div className="flex items-center gap-2 font-rajdhani text-xs font-bold uppercase">
            {canEditDraft && (
              <button
                type="button"
                onClick={handleEditClick}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-[#0A0A0A] hover:text-[#3DDC10] font-bold px-2.5 py-1 rounded-sm bg-[#F8F9FA] hover:bg-[#0A0A0A] border border-[#0A0A0A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Edit3 className="w-3.5 h-3.5" /> EDIT
              </button>
            )}
            {canDeleteDraft && (
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-[#71717A] hover:text-[#FF7A00] font-bold px-2.5 py-1 rounded-sm hover:bg-[#FF7A00]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" /> DELETE
              </button>
            )}
            {!canEditDraft && !canDeleteDraft && (
              <span className="text-[10px] font-mono text-[#71717A] italic">
                (Read-Only View)
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);
DraftCardItem.displayName = "DraftCardItem";

export const DraftList: React.FC<DraftListProps> = React.memo(
  ({
    drafts,
    isLoading = false,
    error = null,
    onEditDraft,
    onDeleteDraft,
    onCreateNew,
  }) => {
    const currentUser = useAppSelector(selectCurrentUser);
    const canCreate = usePermission("create_post");
    const canManageDrafts = usePermission("manage_drafts");
    const canEditDraft = usePermission("edit_post");
    const canDeleteDraft = usePermission("delete_post");

    const isAdmin = currentUser?.role === "admin";
    const isEditor = currentUser?.role === "editor";

    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [selectedUserIdFilter, setSelectedUserIdFilter] = useState<string>("all");
    const [expandedAuditDraftId, setExpandedAuditDraftId] = useState<string | null>(null);

    const confirmDelete = useCallback(() => {
      if (deleteTargetId) {
        onDeleteDraft(deleteTargetId);
        setDeleteTargetId(null);
      }
    }, [deleteTargetId, onDeleteDraft]);

    const handlePromptDelete = useCallback((draftId: string) => {
      setDeleteTargetId(draftId);
    }, []);

    const handleToggleAudit = useCallback((draftId: string) => {
      setExpandedAuditDraftId((prev) => (prev === draftId ? null : draftId));
    }, []);

    // Dismiss delete modal on Escape
    React.useEffect(() => {
      if (!deleteTargetId) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isLoading) {
          setDeleteTargetId(null);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [deleteTargetId, isLoading]);

    // Collect all unique user IDs across drafts and audit trails (Memoized)
    const allUserIds = useMemo(() => {
      return Array.from(
        new Set(
          drafts.flatMap((d) => [
            d.authorId || "usr-editor-01",
            ...(d.auditTrail?.map((a) => a.userId) || []),
          ])
        )
      );
    }, [drafts]);

    // Total user revisions across all drafts (Memoized)
    const totalRevisionsCount = useMemo(() => {
      return drafts.reduce((acc, d) => acc + (d.auditTrail?.length || 1), 0);
    }, [drafts]);

    // Filter drafts based on selected user ID for Admin audit view (Memoized)
    const filteredDrafts = useMemo(() => {
      if (selectedUserIdFilter === "all") return drafts;
      return drafts.filter(
        (d) =>
          d.authorId === selectedUserIdFilter ||
          d.auditTrail?.some((a) => a.userId === selectedUserIdFilter)
      );
    }, [drafts, selectedUserIdFilter]);

    if (isLoading && drafts.length === 0) {
      return (
        <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm p-10 text-center space-y-4 shadow-card-white">
          <Loader2 className="w-8 h-8 text-[#3DDC10] animate-spin mx-auto" />
          <p className="text-xs font-space uppercase font-bold text-[#0A0A0A]">
            LOADING SAVED DRAFTS...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-[#FFFFFF] border-2 border-[#FF7A00] rounded-sm p-6 text-center space-y-3 shadow-omni-warning">
          <AlertTriangle className="w-8 h-8 text-[#FF7A00] mx-auto" />
          <p className="text-sm font-space uppercase font-bold text-[#FF7A00]">
            COULD NOT LOAD DRAFTS
          </p>
          <p className="text-xs text-[#0A0A0A] font-inter">{error}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#0A0A0A] text-[#3DDC10] flex items-center justify-center border border-[#3DDC10] shrink-0 shadow-omni">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-sekuya uppercase font-extrabold text-[#FFFFFF] tracking-wider flex items-center gap-2">
                SAVED DRAFTS{" "}
                <span className="text-[#3DDC10] font-mono">
                  ({filteredDrafts.length})
                </span>
              </h2>
              <p className="text-xs font-switzer text-[#71717A]">
                {isAdmin
                  ? "Admin User Audit Console: Inspecting draft activity across User IDs."
                  : isEditor
                  ? "Editor Post Manager: Exclusive authority to compose, modify, and publish drafts."
                  : "Viewer Read-Only View: Inspecting saved post drafts."}
              </p>
            </div>
          </div>

          {canCreate && onCreateNew && (
            <button
              onClick={onCreateNew}
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] font-rajdhani uppercase font-extrabold text-xs tracking-widest transition-all shadow-omni hover:scale-[1.02] border-2 border-[#0A0A0A] shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> CREATE NEW POST
            </button>
          )}
        </div>

        {/* ADMIN DRAFT USER AUDIT LOG CONSOLE (Visible to Admin Role) */}
        {isAdmin && (
          <div className="bg-[#0A0A0A] border-2 border-[#3DDC10] rounded-sm p-4 sm:p-5 space-y-4 text-[#FFFFFF] shadow-omni">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2A2A] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#3DDC10]" />
                <div>
                  <h3 className="text-xs sm:text-sm font-sekuya uppercase font-extrabold text-[#FFFFFF] tracking-wider">
                    ADMIN DRAFT USER AUDIT CONSOLE
                  </h3>
                  <p className="text-[11px] font-mono text-[#71717A]">
                    Tracking revisions and edits performed by draft users across different User IDs.
                  </p>
                </div>
              </div>

              {/* Filter by User ID */}
              <div className="flex items-center gap-2 shrink-0">
                <Filter className="w-3.5 h-3.5 text-[#3DDC10]" />
                <span className="text-[11px] font-mono text-[#71717A]">
                  FILTER USER ID:
                </span>
                <select
                  value={selectedUserIdFilter}
                  onChange={(e) => setSelectedUserIdFilter(e.target.value)}
                  className="bg-[#141414] text-[#3DDC10] border border-[#3DDC10]/60 rounded px-2.5 py-1 text-xs font-mono font-bold focus:outline-none"
                >
                  <option value="all">ALL USER IDs ({allUserIds.length})</option>
                  {allUserIds.map((uId) => (
                    <option key={uId} value={uId}>
                      {uId}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-[#141414] p-3 rounded border border-[#2A2A2A] space-y-1">
                <span className="text-[#71717A] text-[10px] block">
                  TOTAL USER REVISIONS
                </span>
                <span className="text-lg font-bold text-[#3DDC10]">
                  {totalRevisionsCount} Changes
                </span>
              </div>
              <div className="bg-[#141414] p-3 rounded border border-[#2A2A2A] space-y-1">
                <span className="text-[#71717A] text-[10px] block">
                  ACTIVE DRAFT AUTHORS
                </span>
                <span className="text-lg font-bold text-[#FFFFFF]">
                  {allUserIds.length} User IDs
                </span>
              </div>
              <div className="bg-[#141414] p-3 rounded border border-[#2A2A2A] space-y-1">
                <span className="text-[#71717A] text-[10px] block">
                  RESPONSIBLE POST ROLE
                </span>
                <span className="text-lg font-bold text-[#FF7A00]">Editor Only</span>
              </div>
            </div>
          </div>
        )}

        {/* Non-Editor Notice Banner */}
        {!isEditor && (
          <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] border-l-8 border-l-[#FF7A00] p-3.5 rounded-sm text-xs text-[#0A0A0A] font-space flex items-center justify-between shadow-card-white">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF7A00]" />
              <span>
                ROLE RESTRICTION:{" "}
                <strong className="uppercase text-[#FF7A00]">
                  {currentUser?.role}
                </strong>{" "}
                MODE. Editor is the only role responsible for creating, editing, or deleting posts.
              </span>
            </span>
            <span className="text-[10px] font-mono font-bold bg-[#0A0A0A] text-[#3DDC10] px-2 py-0.5 rounded">
              READ-ONLY
            </span>
          </div>
        )}

        {/* Empty State */}
        {filteredDrafts.length === 0 ? (
          <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-dashed border-[#0A0A0A] rounded-sm p-12 text-center space-y-3 shadow-card-white">
            <div className="w-12 h-12 rounded-sm bg-[#0A0A0A] border-2 border-[#3DDC10] flex items-center justify-center mx-auto text-[#3DDC10] shadow-omni">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-sekuya uppercase font-bold text-[#0A0A0A]">
              NO DRAFTS FOUND
            </h3>
            <p className="text-xs text-[#71717A] max-w-sm mx-auto font-switzer">
              {selectedUserIdFilter !== "all"
                ? `No draft activity recorded for User ID "${selectedUserIdFilter}".`
                : "No post drafts stored in the platform queue."}
            </p>
          </div>
        ) : (
          /* Tri-Color Draft Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDrafts.map((draft) => (
              <DraftCardItem
                key={draft.id}
                draft={draft}
                canEditDraft={canEditDraft}
                canDeleteDraft={canDeleteDraft}
                isAuditExpanded={expandedAuditDraftId === draft.id}
                isLoading={isLoading}
                onToggleAudit={handleToggleAudit}
                onEditDraft={onEditDraft}
                onPromptDelete={handlePromptDelete}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTargetId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/85 backdrop-blur-md"
            onClick={() => !isLoading && setDeleteTargetId(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-draft-title"
          >
            <div
              className="bg-[#FFFFFF] border-4 border-[#FF7A00] rounded-sm p-6 max-w-sm w-full space-y-4 shadow-omni-warning text-[#0A0A0A]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-[#FF7A00]">
                <div className="p-3 rounded-sm bg-[#FF7A00]/10 border border-[#FF7A00]/40">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 id="delete-draft-title" className="text-base font-sekuya uppercase font-bold text-[#0A0A0A]">
                    DELETE DRAFT?
                  </h4>
                  <p className="text-xs font-switzer text-[#71717A]">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="text-xs font-switzer text-[#0A0A0A] bg-[#F8F9FA] p-3 rounded-sm border border-[#0A0A0A]">
                Are you sure you want to delete this draft permanently?
              </p>

              <div className="flex items-center gap-2 pt-2 justify-end font-rajdhani text-xs font-bold uppercase">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-sm bg-[#F8F9FA] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A] transition-colors border border-[#0A0A0A] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-sm bg-[#FF7A00] hover:bg-[#E06C00] text-[#FFFFFF] transition-all shadow-sm border border-[#0A0A0A] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  DELETE DRAFT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
DraftList.displayName = "DraftList";

export default DraftList;
