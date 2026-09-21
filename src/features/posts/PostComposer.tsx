/**
 * PostComposer.tsx - Tri-Color Balance (White + Black + Omnitrix Green) & 5 Fonts Integration.
 * Memoized with React.memo and stable useCallback handlers.
 */

import React, { useState, useMemo, useCallback, ChangeEvent } from "react";
import {
  PLATFORM_CONFIGS,
  PlatformId,
  PlatformConfig,
} from "../../types/platform";
import { MediaAttachment, PostStatus } from "../../types/post";
import { validatePost, extractHashtags } from "../../utils/validationEngine";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import { LivePlatformPreviews } from "../../components/preview/LivePlatformPreviews";
import {
  Image as ImageIcon,
  X,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Hash,
  Send,
  Calendar,
  Save,
  Zap,
} from "lucide-react";
import { usePermission } from "../auth/usePermission";

export interface PostComposerProps {
  initialTitle?: string;
  initialContent?: string;
  initialPlatforms?: PlatformId[];
  initialMedia?: MediaAttachment[];
  initialStatus?: PostStatus;
  initialScheduledAt?: string | null;
  onSaveDraft?: (postData: {
    title: string;
    content: string;
    platforms: PlatformId[];
    media: MediaAttachment[];
  }) => void;
  onSchedule?: (postData: {
    title: string;
    content: string;
    platforms: PlatformId[];
    media: MediaAttachment[];
    scheduledAt: string;
  }) => void;
  onPublish?: (postData: {
    title: string;
    content: string;
    platforms: PlatformId[];
    media: MediaAttachment[];
  }) => void;
  isSubmitting?: boolean;
}

const BRAND_SVGS: Record<PlatformId, React.FC<{ className?: string }>> = {
  twitter: (props) => <TwitterIcon {...props} />,
  instagram: (props) => <InstagramIcon {...props} />,
  linkedin: (props) => <LinkedInIcon {...props} />,
  facebook: (props) => <FacebookIcon {...props} />,
};

export const PostComposer: React.FC<PostComposerProps> = React.memo(
  ({
    initialTitle = "",
    initialContent = "",
    initialPlatforms = ["twitter", "linkedin"] as PlatformId[],
    initialMedia = [],
    onSaveDraft,
    onSchedule,
    onPublish,
    isSubmitting = false,
  }) => {
    const canCreate = usePermission("create_post");
    const canManageDrafts = usePermission("manage_drafts");
    const canSchedule = usePermission("schedule_post");
    const canPublish = usePermission("publish_post");

    const [title, setTitle] = useState<string>(initialTitle);
    const [content, setContent] = useState<string>(initialContent);
    const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(initialPlatforms);
    const [media, setMedia] = useState<MediaAttachment[]>(initialMedia);

    // Dynamic real-time validation across selected platforms
    const validationResults = useMemo(() => {
      return validatePost(content, media, selectedPlatforms);
    }, [content, media, selectedPlatforms]);

    // Overall validity check
    const isOverallValid = useMemo(() => {
      if (selectedPlatforms.length === 0) return false;
      if (!content.trim()) return false;
      return Object.values(validationResults).every((res) => res.isValid);
    }, [selectedPlatforms, content, validationResults]);

    // Check if any platform is over limit
    const hasOverLimitError = useMemo(() => {
      return Object.values(validationResults).some((res) => res.warningState === "over-limit");
    }, [validationResults]);

    // Toggle platform selection
    const handlePlatformToggle = useCallback((platformId: PlatformId) => {
      setSelectedPlatforms((prev: PlatformId[]) =>
        prev.includes(platformId)
          ? prev.filter((id) => id !== platformId)
          : [...prev, platformId]
      );
    }, []);

    // File attachment handler
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const files = Array.from(e.target.files);

      const newAttachments: MediaAttachment[] = files.map((file) => ({
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        type: file.type || "image/jpeg",
        size: file.size,
        url: URL.createObjectURL(file),
      }));

      setMedia((prev) => [...prev, ...newAttachments]);
      e.target.value = "";
    }, []);

    const handleRemoveMedia = useCallback((id: string) => {
      setMedia((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const handleSaveDraftClick = useCallback(() => {
      if (onSaveDraft) {
        onSaveDraft({ title, content, platforms: selectedPlatforms, media });
      }
    }, [onSaveDraft, title, content, selectedPlatforms, media]);

    const handlePublishClick = useCallback(() => {
      if (isOverallValid && onPublish) {
        onPublish({ title, content, platforms: selectedPlatforms, media });
      }
    }, [isOverallValid, onPublish, title, content, selectedPlatforms, media]);

    const handleScheduleClick = useCallback(() => {
      if (isOverallValid && onSchedule) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        onSchedule({
          title,
          content,
          platforms: selectedPlatforms,
          media,
          scheduledAt: tomorrow.toISOString(),
        });
      }
    }, [isOverallValid, onSchedule, title, content, selectedPlatforms, media]);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: COMPOSER PANEL */}
        <div
          className={`lg:col-span-7 bg-[#FFFFFF] text-[#0A0A0A] border-2 rounded-sm p-5 sm:p-7 space-y-6 shadow-card-white transition-all ${
            hasOverLimitError ? "border-[#FF7A00] shadow-omni-warning" : "border-[#0A0A0A]"
          }`}
        >
          {/* Header Bar using Orbitron + Inter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#0A0A0A] pb-4">
            <div>
              <h2 className="text-xl font-sekuya uppercase font-extrabold text-[#0A0A0A] flex items-center gap-2 tracking-wider">
                <Zap className="w-5 h-5 text-[#3DDC10] fill-[#3DDC10]" />
                POST COMPOSER
              </h2>
              <p className="text-xs text-[#71717A] font-switzer mt-0.5">
                Draft and format your content for multiple channels simultaneously.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isOverallValid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-wider bg-[#0A0A0A] text-[#3DDC10] border border-[#3DDC10]">
                  <CheckCircle2 className="w-4 h-4 text-[#3DDC10]" /> READY
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-wider bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/40">
                  <AlertCircle className="w-4 h-4" /> CHECK RULES
                </span>
              )}
            </div>
          </div>

          {!canCreate && (
            <div className="bg-[#FFFFFF] border-2 border-[#FF7A00] p-3.5 rounded-sm text-xs font-space text-[#0A0A0A] flex items-center gap-2 shadow-omni-warning">
              <AlertTriangle className="w-4 h-4 text-[#FF7A00] shrink-0" />
              <span>
                EDITOR ROLE RESTRICTION: Only users with the <strong className="text-[#3DDC10] uppercase">Editor</strong> role are responsible for creating, editing, scheduling, and publishing posts.
              </span>
            </div>
          )}

          {/* Target Platforms Brand Selector Chips */}
          <div className="space-y-2.5">
            <label className="block text-xs font-space font-bold uppercase tracking-widest text-[#0A0A0A]">
              SELECT TARGET CHANNELS <span className="text-[#FF7A00]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((platformId) => {
                const config: PlatformConfig = PLATFORM_CONFIGS[platformId];
                const isSelected = selectedPlatforms.includes(platformId);
                const IconComponent = BRAND_SVGS[platformId];

                return (
                  <button
                    key={platformId}
                    type="button"
                    onClick={() => handlePlatformToggle(platformId)}
                    className={`flex items-center gap-3 p-3 rounded-sm border-2 transition-all text-left ${
                      isSelected
                        ? "bg-[#0A0A0A] border-[#3DDC10] text-[#FFFFFF] shadow-omni scale-[1.02]"
                        : "bg-[#F8F9FA] border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#FFFFFF] hover:border-[#3DDC10]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "bg-[#3DDC10] text-[#0A0A0A] font-bold"
                          : "bg-[#0A0A0A] text-[#FFFFFF]"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-rajdhani uppercase font-bold truncate tracking-wider">{config.name}</p>
                      <p className="text-[10px] font-mono truncate opacity-75">
                        {config.maxChars} chars
                      </p>
                    </div>

                    <div
                      className={`w-3.5 h-3.5 rounded-sm border transition-all flex items-center justify-center ${
                        isSelected
                          ? "bg-[#3DDC10] border-[#3DDC10] text-[#0A0A0A]"
                          : "border-[#0A0A0A] bg-[#FFFFFF]"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedPlatforms.length === 0 && (
              <p className="text-xs text-[#FF7A00] font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> Please select at least one channel.
              </p>
            )}
          </div>

          {/* Campaign Title Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-space font-bold uppercase tracking-widest text-[#0A0A0A]">
              POST TITLE / CAMPAIGN REF
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Omni Launch Announcement"
              className="w-full px-4 py-2.5 rounded-sm bg-[#F8F9FA] border-2 border-[#0A0A0A] text-[#0A0A0A] placeholder-[#71717A] text-sm font-inter focus:outline-none focus:border-[#3DDC10] transition-all"
            />
          </div>

          {/* Post Content Textarea */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-space font-bold uppercase tracking-widest text-[#0A0A0A]">
                POST CONTENT <span className="text-[#FF7A00]">*</span>
              </label>
              <span className="text-xs text-[#0A0A0A] font-mono flex items-center gap-1 font-bold">
                <Hash className="w-3.5 h-3.5 text-[#3DDC10]" /> Hashtags:{" "}
                {extractHashtags(content).length}
              </span>
            </div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post message here... Add #hashtags or @mentions..."
              className="w-full p-4 rounded-sm bg-[#F8F9FA] border-2 border-[#0A0A0A] text-[#0A0A0A] placeholder-[#71717A] text-sm leading-relaxed focus:outline-none focus:border-[#3DDC10] transition-all resize-y font-inter"
            />
          </div>

          {/* Media Attachments Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-space font-bold uppercase tracking-widest text-[#0A0A0A] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#3DDC10]" /> MEDIA ATTACHMENTS ({media.length})
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-rajdhani font-bold uppercase tracking-wider bg-[#0A0A0A] text-[#3DDC10] hover:bg-[#3DDC10] hover:text-[#0A0A0A] border border-[#0A0A0A] transition-all shadow-sm">
                <ImageIcon className="w-3.5 h-3.5" /> ATTACH FILE
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif,video/mp4,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {media.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8F9FA] p-3 rounded-sm border-2 border-[#0A0A0A]">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-sm bg-[#FFFFFF] border border-[#0A0A0A] p-2 flex flex-col justify-between overflow-hidden shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono text-[#0A0A0A] font-bold truncate max-w-[100px]">
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#71717A] hover:text-[#FF7A00] p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="h-20 rounded-sm bg-[#0A0A0A] flex items-center justify-center overflow-hidden border border-[#0A0A0A]">
                      {item.type.startsWith("image/") ? (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-2">
                          <ImageIcon className="w-5 h-5 mx-auto text-[#3DDC10]" />
                          <span className="text-[10px] text-[#FFFFFF] uppercase font-mono">
                            {item.type.split("/")[1] || "FILE"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform Character Diagnostics Tiles */}
          {selectedPlatforms.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-sekuya font-bold uppercase tracking-widest text-[#0A0A0A]">
                CHARACTER LIMIT DIAGNOSTICS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedPlatforms.map((platformId) => {
                  const res = validationResults[platformId];
                  const config = PLATFORM_CONFIGS[platformId];
                  if (!res) return null;

                  let borderStyle = "border-[#0A0A0A]";
                  let badgeStyle = "text-[#3DDC10] bg-[#0A0A0A] border-[#0A0A0A]";
                  if (res.warningState === "warning") {
                    badgeStyle = "text-[#FF7A00] bg-[#0A0A0A] border-[#FF7A00]";
                  } else if (res.warningState === "over-limit") {
                    borderStyle = "border-[#FF7A00]";
                    badgeStyle = "text-[#FFFFFF] bg-[#FF7A00] border-[#FF7A00]";
                  }

                  return (
                    <div
                      key={platformId}
                      className={`bg-[#F8F9FA] border-2 ${borderStyle} rounded-sm p-3.5 space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-rajdhani font-bold uppercase text-[#0A0A0A] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#3DDC10]"></span>
                          {config.name}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border ${badgeStyle}`}>
                          {res.charCount} / {res.maxChars}
                        </span>
                      </div>

                      {res.errors.length > 0 && (
                        <div className="space-y-1">
                          {res.errors.map((err, idx) => (
                            <p key={idx} className="text-[11px] font-mono text-[#FF7A00] font-bold flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {err}
                            </p>
                          ))}
                        </div>
                      )}

                      {res.isValid && res.warnings.length === 0 && (
                        <p className="text-[11px] font-mono text-[#0A0A0A] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC10]" /> Limits verified.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Footer Bar (Desktop) */}
          {canCreate && (
            <div className="hidden sm:flex border-t-2 border-[#0A0A0A] pt-4 items-center justify-between gap-3">
              {canManageDrafts && (
                <button
                  type="button"
                  onClick={handleSaveDraftClick}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-[#0A0A0A] hover:bg-[#141414] text-[#FFFFFF] font-rajdhani font-bold text-xs uppercase tracking-wider transition-all border-2 border-[#0A0A0A] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 text-[#3DDC10]" /> SAVE DRAFT
                </button>
              )}

              <div className="flex items-center gap-3 ml-auto">
                {canSchedule && (
                  <button
                    type="button"
                    onClick={handleScheduleClick}
                    disabled={!isOverallValid || isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-[#0A0A0A] text-[#3DDC10] hover:bg-[#3DDC10] hover:text-[#0A0A0A] border-2 border-[#0A0A0A] font-rajdhani font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Calendar className="w-4 h-4" /> SCHEDULE POST
                  </button>
                )}

                {canPublish && (
                  <button
                    type="button"
                    onClick={handlePublishClick}
                    disabled={!isOverallValid || isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] font-rajdhani font-extrabold text-xs uppercase tracking-widest transition-all shadow-omni hover:scale-[1.02] border-2 border-[#0A0A0A] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" /> PUBLISH NOW
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE PLATFORM PREVIEW PANEL */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <LivePlatformPreviews
            content={content}
            media={media}
            selectedPlatforms={selectedPlatforms}
          />
        </div>

        {/* STICKY ACTION BAR FOR MOBILE */}
        {canCreate && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t-4 border-[#3DDC10] p-3 flex items-center justify-between gap-2 shadow-card-white">
            {canManageDrafts && (
              <button
                type="button"
                onClick={handleSaveDraftClick}
                disabled={isSubmitting}
                className="flex-1 py-2 px-2 rounded-sm bg-[#0A0A0A] text-[#FFFFFF] font-rajdhani font-bold text-xs uppercase border border-[#0A0A0A] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Draft
              </button>
            )}
            {canSchedule && (
              <button
                type="button"
                onClick={handleScheduleClick}
                disabled={!isOverallValid || isSubmitting}
                className="flex-1 py-2 px-2 rounded-sm bg-[#0A0A0A] text-[#3DDC10] border border-[#0A0A0A] font-rajdhani font-bold text-xs uppercase disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Schedule
              </button>
            )}
            {canPublish && (
              <button
                type="button"
                onClick={handlePublishClick}
                disabled={!isOverallValid || isSubmitting}
                className="flex-1 py-2 px-2 rounded-sm bg-[#3DDC10] text-[#0A0A0A] font-rajdhani font-extrabold text-xs uppercase shadow-omni disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Publish
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);
PostComposer.displayName = "PostComposer";

export default PostComposer;
