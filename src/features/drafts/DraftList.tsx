/**
 * DraftList.tsx - Tri-Color Balance & 5 Google Fonts Integration for Saved Drafts.
 */

import React, { useState } from "react";
import { Draft } from "../../types/draft";
import { PLATFORM_CONFIGS, PlatformId } from "../../types/platform";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import {
  FileText,
  Clock,
  Edit3,
  Trash2,
  AlertTriangle,
  Loader2,
  Layers,
  Plus,
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

export const DraftList: React.FC<DraftListProps> = ({
  drafts,
  isLoading = false,
  error = null,
  onEditDraft,
  onDeleteDraft,
  onCreateNew,
}) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteTargetId) {
      onDeleteDraft(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm p-10 text-center space-y-4 shadow-card-white">
        <Loader2 className="w-8 h-8 text-[#3DDC10] animate-spin mx-auto" />
        <p className="text-xs font-space uppercase font-bold text-[#0A0A0A]">LOADING SAVED DRAFTS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FFFFFF] border-2 border-[#FF7A00] rounded-sm p-6 text-center space-y-3 shadow-omni-warning">
        <AlertTriangle className="w-8 h-8 text-[#FF7A00] mx-auto" />
        <p className="text-sm font-space uppercase font-bold text-[#FF7A00]">COULD NOT LOAD DRAFTS</p>
        <p className="text-xs text-[#0A0A0A] font-inter">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#3DDC10]" />
          <h2 className="text-xl font-space uppercase font-extrabold text-[#FFFFFF] tracking-wider">
            SAVED DRAFTS <span className="text-[#3DDC10] font-mono">({drafts.length})</span>
          </h2>
        </div>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] font-rajdhani uppercase font-extrabold text-xs tracking-widest transition-all shadow-omni hover:scale-[1.02] border-2 border-[#0A0A0A]"
          >
            <Plus className="w-4 h-4" /> CREATE NEW POST
          </button>
        )}
      </div>

      {/* Empty State */}
      {drafts.length === 0 ? (
        <div className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-dashed border-[#0A0A0A] rounded-sm p-12 text-center space-y-3 shadow-card-white">
          <div className="w-12 h-12 rounded-sm bg-[#0A0A0A] border-2 border-[#3DDC10] flex items-center justify-center mx-auto text-[#3DDC10] shadow-omni">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-space uppercase font-bold text-[#0A0A0A]">NO DRAFTS SAVED</h3>
          <p className="text-xs text-[#71717A] max-w-sm mx-auto font-inter">
            You haven't saved any post drafts yet. Click "Create New Post" to compose and save drafts.
          </p>
        </div>
      ) : (
        /* Tri-Color Draft Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-[#FFFFFF] text-[#0A0A0A] border-2 border-[#0A0A0A] hover:border-[#3DDC10] rounded-sm p-5 flex flex-col justify-between transition-all hover:shadow-card-white group"
            >
              <div className="space-y-3">
                {/* Title & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-space font-bold text-[#0A0A0A] line-clamp-1 group-hover:text-[#3DDC10] transition-colors">
                    {draft.title || "Untitled Post Draft"}
                  </h3>
                  <span className="shrink-0 px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0A0A0A] text-[#3DDC10] border border-[#3DDC10]">
                    DRAFT
                  </span>
                </div>

                {/* Content Snippet */}
                <p className="text-xs font-inter text-[#71717A] line-clamp-2 leading-relaxed">
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
                  <button
                    type="button"
                    onClick={() => onEditDraft(draft)}
                    className="inline-flex items-center gap-1 text-[#0A0A0A] hover:text-[#3DDC10] font-bold px-2.5 py-1 rounded-sm bg-[#F8F9FA] hover:bg-[#0A0A0A] border border-[#0A0A0A] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> EDIT
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(draft.id)}
                    className="inline-flex items-center gap-1 text-[#71717A] hover:text-[#FF7A00] font-bold px-2.5 py-1 rounded-sm hover:bg-[#FF7A00]/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/85 backdrop-blur-md">
          <div className="bg-[#FFFFFF] border-4 border-[#FF7A00] rounded-sm p-6 max-w-sm w-full space-y-4 shadow-omni-warning text-[#0A0A0A]">
            <div className="flex items-center gap-3 text-[#FF7A00]">
              <div className="p-3 rounded-sm bg-[#FF7A00]/10 border border-[#FF7A00]/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-space uppercase font-bold text-[#0A0A0A]">DELETE DRAFT?</h4>
                <p className="text-xs font-inter text-[#71717A]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs font-inter text-[#0A0A0A] bg-[#F8F9FA] p-3 rounded-sm border border-[#0A0A0A]">
              Are you sure you want to delete this draft permanently?
            </p>

            <div className="flex items-center gap-2 pt-2 justify-end font-rajdhani text-xs font-bold uppercase">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-sm bg-[#F8F9FA] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A] transition-colors border border-[#0A0A0A]"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-sm bg-[#FF7A00] hover:bg-[#E06C00] text-[#FFFFFF] transition-all shadow-sm border border-[#0A0A0A]"
              >
                DELETE DRAFT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
