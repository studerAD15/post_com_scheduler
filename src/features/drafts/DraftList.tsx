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
      <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm p-5 flex flex-col justify-between transition-all group relative hover:border-[#3DDC10] shadow-card-white">
        <div className="space-y-3.5">
          {/* Author User ID Header Badge */}
          <div className="flex items-center justify-between gap-2 border-b border-[#E5E7EB] pb-2.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <UserCheck className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
              <span className="text-[11px] font-mono font-bold text-[#71717A] truncate">
                AUTHOR:{" "}
                <strong className="text-[#15803D] bg-[#F4F4F5] px-1.5 py-0.5 rounded-sm border border-[#E5E7EB]">
                  {authorName}
                </strong>
              </span>
            </div>

            <span className="badge-omni badge-omni-neutral shrink-0">
              ID: {authorId}
            </span>
          </div>

          {/* Title & Status Badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-sekuya font-bold text-[#0A0A0A] line-clamp-1 group-hover:text-[#15803D] transition-colors">
              {draft.title || "Untitled Post Draft"}
            </h3>
            <span className="badge-omni badge-omni-green shrink-0">
              DRAFT
            </span>
          </div>

          {/* Content Snippet */}
          <p className="text-xs font-inter font-normal text-[#52525B] line-clamp-2 leading-relaxed">
            {draft.content || <span className="italic text-[#71717A]">No post content</span>}
          </p>

          {/* Target Platforms Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {draft.platforms.map((pId: PlatformId) => {
              const IconComp = BRAND_SVGS[pId];
              return (
                <span
                  key={pId}
                  className="badge-omni badge-omni-neutral inline-flex items-center gap-1"
                >
                  <IconComp className="w-3 h-3" />
                  {pId}
                </span>
              );
            })}
          </div>

          {/* ADMIN DRAFT AUDIT TRAIL TIMELINE (Expandable) */}
          {auditTrail.length > 0 && (
            <div className="pt-2 border-t border-[#E5E7EB] space-y-2">
              <button
                type="button"
                onClick={handleToggleAuditClick}
                className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-[#0A0A0A] hover:text-[#15803D] bg-[#F8F9FA] p-2 rounded-sm border border-[#E5E7EB] hover:border-[#0A0A0A] transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#15803D]" />
                  USER ID REVISION TRAIL ({auditTrail.length})
                </span>
                <span>{isAuditExpanded ? "▲ Hide Log" : "▼ View Audit Trail"}</span>
              </button>

              {isAuditExpanded && (
                <div className="bg-[#F8F9FA] text-[#0A0A0A] p-3 rounded-sm space-y-2.5 text-[11px] font-mono border-2 border-[#0A0A0A]">
                  <p className="text-[10px] font-bold text-[#15803D] uppercase border-b border-[#E5E7EB] pb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> USER ID CHANGE TIMELINE
                  </p>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {auditTrail.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-[#FFFFFF] p-2 rounded-sm border border-[#E5E7EB] space-y-1 text-[10px]"
                      >
                        <div className="flex items-center justify-between text-[#15803D]">
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

                        <p className="text-[#0A0A0A] font-inter font-normal">{entry.changesSummary}</p>

                        <div className="flex items-center justify-between text-[9px] text-[#71717A] pt-0.5">
                          <span className="uppercase text-[#C2410C]">
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
        <div className="mt-5 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#71717A] font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#15803D]" />
            {new Date(draft.updatedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <div className="flex items-center gap-2">
            {canEditDraft && (
              <button
                type="button"
                onClick={handleEditClick}
                disabled={isLoading}
                className="btn-omni-secondary h-8 px-3 text-xs inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Edit3 className="w-3.5 h-3.5" /> EDIT
              </button>
            )}
            {canDeleteDraft && (
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isLoading}
                className="btn-omni-ghost h-8 px-3 text-xs text-[#FF7A00] hover:text-[#FF7A00] hover:bg-[#FF7A00]/10 inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
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
        <div className="card-omni p-10 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#3DDC10] animate-spin mx-auto" />
          <p className="text-xs font-space uppercase font-bold text-[#0A0A0A]">
            LOADING SAVED DRAFTS...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-[#FFFFFF] border-2 border-[#FF7A00] rounded-sm p-6 text-center space-y-3 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-[#FF7A00] mx-auto" />
          <p className="text-sm font-space uppercase font-bold text-[#FF7A00]">
            COULD NOT LOAD DRAFTS
          </p>
          <p className="text-xs text-[#52525B] font-inter font-normal">{error}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#FFFFFF] text-[#15803D] flex items-center justify-center border-2 border-[#0A0A0A] shrink-0 shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-sekuya uppercase font-extrabold text-[#0A0A0A] tracking-wider flex items-center gap-2">
                SAVED DRAFTS{" "}
                <span className="text-[#15803D] font-mono">
                  ({filteredDrafts.length})
                </span>
              </h2>
              <p className="text-xs font-inter font-normal text-[#71717A]">
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
              className="btn-omni-primary h-10 px-5 inline-flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> CREATE NEW POST
            </button>
          )}
        </div>

        {/* ADMIN DRAFT USER AUDIT LOG CONSOLE (Visible to Admin Role) */}
        {isAdmin && (
          <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm p-4 sm:p-5 space-y-4 text-[#0A0A0A] shadow-card-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#15803D]" />
                <div>
                  <h3 className="text-xs sm:text-sm font-sekuya uppercase font-extrabold text-[#0A0A0A] tracking-wider">
                    ADMIN DRAFT USER AUDIT CONSOLE
                  </h3>
                  <p className="text-[11px] font-inter font-normal text-[#71717A]">
                    Tracking revisions and edits performed by draft users across different User IDs.
                  </p>
                </div>
              </div>

              {/* Filter by User ID */}
              <div className="flex items-center gap-2 shrink-0">
                <Filter className="w-3.5 h-3.5 text-[#15803D]" />
                <span className="text-[11px] font-mono text-[#52525B]">
                  FILTER USER ID:
                </span>
                <select
                  value={selectedUserIdFilter}
                  onChange={(e) => setSelectedUserIdFilter(e.target.value)}
                  className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-sm px-2.5 py-1 text-xs font-mono font-bold focus:outline-none"
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
              <div className="bg-[#F8F9FA] p-3 rounded-sm border border-[#E5E7EB] space-y-1">
                <span className="text-[#71717A] text-[10px] block font-inter">
                  TOTAL USER REVISIONS
                </span>
                <span className="text-lg font-bold text-[#15803D]">
                  {totalRevisionsCount} Changes
                </span>
              </div>
              <div className="bg-[#F8F9FA] p-3 rounded-sm border border-[#E5E7EB] space-y-1">
                <span className="text-[#71717A] text-[10px] block font-inter">
                  ACTIVE DRAFT AUTHORS
                </span>
                <span className="text-lg font-bold text-[#0A0A0A]">
                  {allUserIds.length} User IDs
                </span>
              </div>
              <div className="bg-[#F8F9FA] p-3 rounded-sm border border-[#E5E7EB] space-y-1">
                <span className="text-[#71717A] text-[10px] block font-inter">
                  RESPONSIBLE POST ROLE
                </span>
                <span className="text-lg font-bold text-[#C2410C]">Editor Only</span>
              </div>
            </div>
          </div>
        )}

        {/* Non-Editor Notice Banner */}
        {!isEditor && (
          <div className="bg-[#FFF7ED] border border-[#FED7AA] border-l-4 border-l-[#FF7A00] p-3.5 rounded-sm text-xs text-[#9A3412] font-inter flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C2410C]" />
              <span>
                ROLE RESTRICTION:{" "}
                <strong className="uppercase text-[#C2410C]">
                  {currentUser?.role}
                </strong>{" "}
                MODE. Editor is the only role responsible for creating, editing, or deleting posts.
              </span>
            </span>
            <span className="badge-omni badge-omni-warning">
              READ-ONLY
            </span>
          </div>
        )}

        {/* Empty State */}
        {filteredDrafts.length === 0 ? (
          <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E5E7EB] rounded-sm p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-sm bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center mx-auto text-[#15803D]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-sekuya uppercase font-bold text-[#0A0A0A]">
              NO DRAFTS FOUND
            </h3>
            <p className="text-xs text-[#71717A] max-w-sm mx-auto font-inter font-normal">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/60 backdrop-blur-sm"
            onClick={() => !isLoading && setDeleteTargetId(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-draft-title"
          >
            <div
              className="bg-[#FFFFFF] border-2 border-[#FF7A00] rounded-sm p-6 max-w-sm w-full space-y-4 shadow-2xl text-[#0A0A0A]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-[#FF7A00]">
                <div className="p-3 rounded-sm bg-[#FFF7ED] border border-[#FED7AA]">
                  <AlertTriangle className="w-6 h-6 text-[#C2410C]" />
                </div>
                <div>
                  <h4 id="delete-draft-title" className="text-base font-sekuya uppercase font-bold text-[#0A0A0A]">
                    DELETE DRAFT?
                  </h4>
                  <p className="text-xs font-inter text-[#71717A]">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="text-xs font-inter text-[#52525B] bg-[#F8F9FA] p-3 rounded-sm border border-[#E5E7EB]">
                Are you sure you want to delete this draft permanently?
              </p>

              <div className="flex items-center gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  disabled={isLoading}
                  className="btn-omni-secondary h-9 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="btn-omni-primary h-9 px-4 !bg-[#FF7A00] hover:!bg-[#E06C00] !border-[#FF7A00] !text-[#FFFFFF] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
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
