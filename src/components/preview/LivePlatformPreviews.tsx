/**
 * LivePlatformPreviews.tsx - Real-time native card previews for selected social platforms.
 *
 * Renders live platform preview cards (Twitter/X, Instagram, LinkedIn, Facebook) simultaneously
 * with authentic platform layout, typography, character truncation alerts, and hashtag rendering.
 */

import React, { useState } from "react";
import { PlatformId } from "../../types/platform";
import { MediaAttachment } from "../../types/post";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../common/BrandIcons";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Share,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Send,
  Globe,
  ImageIcon,
  AlertTriangle,
} from "lucide-react";

export interface LivePlatformPreviewsProps {
  content: string;
  media: MediaAttachment[];
  selectedPlatforms: PlatformId[];
}

export const LivePlatformPreviews: React.FC<LivePlatformPreviewsProps> = ({
  content,
  media,
  selectedPlatforms,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<PlatformId>(
    selectedPlatforms[0] || "twitter"
  );

  // Keep activePreviewTab in sync with selected platforms
  const currentTab = selectedPlatforms.includes(activePreviewTab)
    ? activePreviewTab
    : selectedPlatforms[0] || "twitter";

  if (selectedPlatforms.length === 0) {
    return (
      <div className="bg-[#141414] border border-[#2A2A2A] rounded p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center mx-auto text-[#A0A0A0]">
          <ImageIcon className="w-6 h-6" />
        </div>
        <p className="text-xs font-display uppercase tracking-widest text-[#A0A0A0]">
          NO PLATFORMS SELECTED
        </p>
        <p className="text-xs text-[#666666]">
          Select one or more social platforms above to see real-time native previews.
        </p>
      </div>
    );
  }

  // Format hashtags as styled span links
  const renderFormattedText = (text: string, hashtagColorClass: string = "text-[#3DDC10]") => {
    if (!text) return <span className="text-[#666666] italic">Start typing your post content...</span>;

    const parts = text.split(/(\s+)/);
    return parts.map((part, idx) => {
      if (part.startsWith("#") && part.length > 1) {
        return (
          <span key={idx} className={`font-semibold ${hashtagColorClass}`}>
            {part}
          </span>
        );
      }
      if (part.startsWith("@") && part.length > 1) {
        return (
          <span key={idx} className="font-semibold text-[#3DDC10]">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded p-4 sm:p-5 space-y-4 shadow-lg">
      
      {/* Preview Header Bar with Hazard Accent */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#3DDC10]"></div>
          <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#F5F5F5]">
            LIVE NATIVE PREVIEWS
          </h3>
        </div>

        {/* Platform Switcher Chips inside Preview Header */}
        <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded border border-[#2A2A2A]">
          {selectedPlatforms.map((pId) => {
            const isActive = currentTab === pId;
            return (
              <button
                key={pId}
                type="button"
                onClick={() => setActivePreviewTab(pId)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-display uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-[#3DDC10] text-[#0A0A0A] font-bold"
                    : "text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1C1C1C]"
                }`}
              >
                {pId === "twitter" && <TwitterIcon className="w-3 h-3" />}
                {pId === "instagram" && <InstagramIcon className="w-3 h-3" />}
                {pId === "linkedin" && <LinkedInIcon className="w-3 h-3" />}
                {pId === "facebook" && <FacebookIcon className="w-3 h-3" />}
                <span>{pId}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Preview Card */}
      <div className="space-y-4">

        {/* 1. TWITTER / X CARD PREVIEW */}
        {currentTab === "twitter" && (
          <div className="bg-[#000000] border border-[#333333] rounded-lg p-4 font-sans text-white text-sm space-y-3 shadow-md">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1D9BF0] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  AC
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[#E7E9EA] text-sm hover:underline cursor-pointer">
                      Aditya Chhikara
                    </span>
                    <span className="text-[#71767B] text-xs">@adityachhikara · Just now</span>
                  </div>
                  <span className="text-[11px] text-[#71767B]">Posting via OmniPost</span>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-[#71767B]" />
            </div>

            {/* Content */}
            <div className="text-[#E7E9EA] leading-normal whitespace-pre-wrap break-words text-sm font-normal">
              {renderFormattedText(content, "text-[#1D9BF0]")}
            </div>

            {/* Truncation warning if over 280 chars */}
            {content.length > 280 && (
              <div className="bg-[#FF7A00]/10 border border-[#FF7A00]/40 p-2.5 rounded text-xs text-[#FF7A00] flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>EXCEEDS TWITTER LIMIT: Post will be truncated at 280 chars ({content.length - 280} over).</span>
              </div>
            )}

            {/* Media Attachment Grid */}
            {media.length > 0 && (
              <div className={`grid gap-1 rounded-2xl overflow-hidden border border-[#2F3336] ${
                media.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}>
                {media.slice(0, 4).map((item, i) => (
                  <div key={i} className="h-44 bg-[#16181C] flex items-center justify-center overflow-hidden">
                    {item.type.startsWith("image/") ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-[#71767B] text-xs">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 text-[#1D9BF0]" />
                        {item.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex items-center justify-between text-[#71767B] pt-2 border-t border-[#2F3336] text-xs">
              <span className="flex items-center gap-1.5 hover:text-[#1D9BF0] cursor-pointer">
                <MessageCircle className="w-4 h-4" /> 12
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#00BA7C] cursor-pointer">
                <Repeat2 className="w-4 h-4" /> 4
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#F91880] cursor-pointer">
                <Heart className="w-4 h-4" /> 38
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#1D9BF0] cursor-pointer">
                <Bookmark className="w-4 h-4" />
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#1D9BF0] cursor-pointer">
                <Share className="w-4 h-4" />
              </span>
            </div>
          </div>
        )}

        {/* 2. INSTAGRAM CARD PREVIEW */}
        {currentTab === "instagram" && (
          <div className="bg-[#000000] border border-[#262626] rounded-lg max-w-sm mx-auto font-sans text-white text-sm overflow-hidden shadow-md">
            {/* Header */}
            <div className="p-3 flex items-center justify-between border-b border-[#262626]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">
                    AC
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-xs text-white tracking-tight">adityachhikara</span>
                  <span className="block text-[10px] text-[#A8A8A8]">Original Audio</span>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-white" />
            </div>

            {/* Media Aspect Container */}
            <div className="aspect-square bg-[#121212] flex items-center justify-center overflow-hidden border-b border-[#262626]">
              {media.length > 0 && media[0].type.startsWith("image/") ? (
                <img src={media[0].url} alt="Instagram Media" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-[#A8A8A8]">
                  <InstagramIcon className="w-10 h-10 mx-auto mb-2 text-[#E1306C]" />
                  <p className="text-xs font-semibold text-white">Visual Media Preview</p>
                  <p className="text-[10px] mt-1">Images or 4:5 videos will fill this feed card.</p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="p-3 space-y-2.5">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer" />
                  <MessageCircle className="w-5 h-5 hover:text-gray-400 cursor-pointer" />
                  <Send className="w-5 h-5 hover:text-gray-400 cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 hover:text-gray-400 cursor-pointer" />
              </div>

              <p className="text-xs font-semibold text-white">Liked by omnitrix_fan and 842 others</p>

              {/* Caption with truncation */}
              <div className="text-xs text-white leading-normal">
                <span className="font-semibold mr-1">adityachhikara</span>
                {content.length > 125 ? (
                  <>
                    {renderFormattedText(content.substring(0, 125), "text-[#0095F6]")}
                    <span className="text-[#A8A8A8] cursor-pointer"> ...more</span>
                  </>
                ) : (
                  renderFormattedText(content, "text-[#0095F6]")
                )}
              </div>

              <p className="text-[10px] text-[#A8A8A8] uppercase tracking-wide">2 HOURS AGO</p>
            </div>
          </div>
        )}

        {/* 3. LINKEDIN CARD PREVIEW */}
        {currentTab === "linkedin" && (
          <div className="bg-[#1B1F23] border border-[#38434F] rounded-lg p-4 font-sans text-white text-sm space-y-3 shadow-md">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  AC
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white leading-tight">Aditya Chhikara</h4>
                  <p className="text-[11px] text-[#A0A0A0] leading-tight">Product Lead &amp; Automation Architect</p>
                  <p className="text-[10px] text-[#A0A0A0] flex items-center gap-1 mt-0.5">
                    1m · <Globe className="w-3 h-3" />
                  </p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-[#A0A0A0]" />
            </div>

            {/* Post Content */}
            <div className="text-[#E8E8E8] text-xs leading-relaxed whitespace-pre-wrap break-words">
              {content.length > 200 ? (
                <>
                  {renderFormattedText(content.substring(0, 200), "text-[#70B5F9]")}
                  <span className="text-[#70B5F9] font-semibold cursor-pointer"> ...see more</span>
                </>
              ) : (
                renderFormattedText(content, "text-[#70B5F9]")
              )}
            </div>

            {/* Media Attachment */}
            {media.length > 0 && (
              <div className="rounded border border-[#38434F] bg-[#14181B] h-48 flex items-center justify-center overflow-hidden">
                {media[0].type.startsWith("image/") ? (
                  <img src={media[0].url} alt="LinkedIn Media" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <LinkedInIcon className="w-8 h-8 text-[#0A66C2] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-white">{media[0].name}</p>
                  </div>
                )}
              </div>
            )}

            {/* Reaction Count Bar */}
            <div className="flex items-center justify-between text-[11px] text-[#A0A0A0] pt-2 border-t border-[#38434F]">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-[#0A66C2] text-[10px] flex items-center justify-center text-white">👍</span>
                <span>42 reactions</span>
              </span>
              <span>8 comments · 2 reposts</span>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-4 gap-1 text-[11px] text-[#A0A0A0] pt-1 border-t border-[#38434F]">
              <button className="flex items-center justify-center gap-1 py-1.5 hover:bg-[#283038] rounded">
                <ThumbsUp className="w-3.5 h-3.5" /> Like
              </button>
              <button className="flex items-center justify-center gap-1 py-1.5 hover:bg-[#283038] rounded">
                <MessageSquare className="w-3.5 h-3.5" /> Comment
              </button>
              <button className="flex items-center justify-center gap-1 py-1.5 hover:bg-[#283038] rounded">
                <Repeat2 className="w-3.5 h-3.5" /> Repost
              </button>
              <button className="flex items-center justify-center gap-1 py-1.5 hover:bg-[#283038] rounded">
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        )}

        {/* 4. FACEBOOK CARD PREVIEW */}
        {currentTab === "facebook" && (
          <div className="bg-[#242526] border border-[#3E4042] rounded-lg p-4 font-sans text-white text-sm space-y-3 shadow-md">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#0866FF] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  AC
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#E4E6EB]">Aditya Chhikara</h4>
                  <p className="text-[11px] text-[#B0B3B8] flex items-center gap-1">
                    Just now · 🌎
                  </p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-[#B0B3B8]" />
            </div>

            {/* Post Content */}
            <div className="text-[#E4E6EB] text-xs leading-relaxed whitespace-pre-wrap">
              {renderFormattedText(content, "text-[#4599FF]")}
            </div>

            {/* Media Attachment */}
            {media.length > 0 && (
              <div className="rounded bg-[#18191A] border border-[#3E4042] h-48 flex items-center justify-center overflow-hidden">
                {media[0].type.startsWith("image/") ? (
                  <img src={media[0].url} alt="Facebook Attachment" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4 text-[#B0B3B8]">
                    <FacebookIcon className="w-8 h-8 text-[#0866FF] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-white">{media[0].name}</p>
                  </div>
                )}
              </div>
            )}

            {/* Reaction Stats */}
            <div className="flex items-center justify-between text-[11px] text-[#B0B3B8] pt-2 border-t border-[#3E4042]">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-[#0866FF] text-[9px] flex items-center justify-center text-white">👍</span>
                <span>128</span>
              </span>
              <span>14 Comments · 6 Shares</span>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-3 gap-1 text-xs text-[#B0B3B8] pt-1 border-t border-[#3E4042]">
              <button className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-[#3A3B3C] rounded font-semibold">
                <ThumbsUp className="w-4 h-4" /> Like
              </button>
              <button className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-[#3A3B3C] rounded font-semibold">
                <MessageSquare className="w-4 h-4" /> Comment
              </button>
              <button className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-[#3A3B3C] rounded font-semibold">
                <Share className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
