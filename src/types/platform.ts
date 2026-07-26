/**
 * platform.ts - Strict domain types for social platforms & publishing constraints.
 */

export type PlatformId = "twitter" | "instagram" | "linkedin" | "facebook";

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  color: string;
  badgeBg: string;
  maxChars: number;
  maxMediaCount: number;
  allowedMediaTypes: string[]; // e.g. ["image/jpeg", "image/png", "video/mp4"]
  allowedMediaExtensions: string[];
  hashtagLimit: number;
  description: string;
}

export const PLATFORM_CONFIGS: Record<PlatformId, PlatformConfig> = {
  twitter: {
    id: "twitter",
    name: "Twitter / X",
    color: "#00e676",
    badgeBg: "bg-omni-500/10 text-omni-300 border-omni-500/30",
    maxChars: 280,
    maxMediaCount: 4,
    allowedMediaTypes: ["image/jpeg", "image/png", "image/gif", "video/mp4"],
    allowedMediaExtensions: ["JPG", "PNG", "GIF", "MP4"],
    hashtagLimit: 30,
    description: "Short posts, max 280 chars & up to 4 images/videos.",
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    color: "#7c4dff",
    badgeBg: "bg-accent/10 text-purple-300 border-accent/30",
    maxChars: 2200,
    maxMediaCount: 10,
    allowedMediaTypes: ["image/jpeg", "image/png", "video/mp4"],
    allowedMediaExtensions: ["JPG", "PNG", "MP4"],
    hashtagLimit: 30,
    description: "Visual posts, max 2200 chars & up to 10 images/videos.",
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    color: "#00c765",
    badgeBg: "bg-omni-600/10 text-omni-100 border-omni-600/30",
    maxChars: 3000,
    maxMediaCount: 9,
    allowedMediaTypes: ["image/jpeg", "image/png", "application/pdf", "video/mp4"],
    allowedMediaExtensions: ["JPG", "PNG", "PDF", "MP4"],
    hashtagLimit: 100,
    description: "Professional posts, max 3000 chars & document attachments.",
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    color: "#5dffb0",
    badgeBg: "bg-omni-300/10 text-omni-300 border-omni-300/30",
    maxChars: 63206,
    maxMediaCount: 10,
    allowedMediaTypes: ["image/jpeg", "image/png", "image/gif", "video/mp4"],
    allowedMediaExtensions: ["JPG", "PNG", "GIF", "MP4"],
    hashtagLimit: 50,
    description: "Long-form updates, max 63k chars & multi-media.",
  },
};
