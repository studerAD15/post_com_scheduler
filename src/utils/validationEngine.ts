/**
 * validationEngine.ts - Reusable multi-platform validation logic.
 *
 * All platform constraints, character counts, hashtag limits, and media
 * validations are evaluated cleanly with explicit generic types and no `any`.
 */

import { PLATFORM_CONFIGS, PlatformId } from "../types/platform";
import { MediaAttachment, ValidationResult, WarningState } from "../types/post";

/**
 * Extracts hashtags from raw post content.
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  return text.match(hashtagRegex) || [];
}

/**
 * Calculates character percentage and warning classification.
 */
export function getWarningState(charCount: number, maxChars: number): WarningState {
  if (maxChars <= 0) return "safe";
  const percentage = (charCount / maxChars) * 100;
  if (percentage > 100) return "over-limit";
  if (percentage >= 80) return "warning";
  return "safe";
}

/**
 * Validates a post content and media payload against a single platform.
 */
export function validateSinglePlatform(
  platformId: PlatformId,
  content: string,
  media: MediaAttachment[]
): ValidationResult {
  const config = PLATFORM_CONFIGS[platformId];
  const charCount = content.length;
  const remainingChars = config.maxChars - charCount;
  const charPercentage = Math.min(100, Math.round((charCount / config.maxChars) * 100));
  const warningState = getWarningState(charCount, config.maxChars);

  const hashtags = extractHashtags(content);
  const hashtagCount = hashtags.length;

  const errors: string[] = [];
  const warnings: string[] = [];

  // Character limit validation
  if (charCount > config.maxChars) {
    errors.push(
      `Exceeds maximum character limit by ${charCount - config.maxChars} characters.`
    );
  } else if (warningState === "warning") {
    warnings.push(
      `Approaching character limit (${remainingChars} characters left).`
    );
  }

  // Hashtag validation
  if (hashtagCount > config.hashtagLimit) {
    errors.push(
      `Hashtag count (${hashtagCount}) exceeds ${config.name}'s limit of ${config.hashtagLimit}.`
    );
  }

  // Media count validation
  if (media.length > config.maxMediaCount) {
    errors.push(
      `Attached ${media.length} media items, but ${config.name} allows a maximum of ${config.maxMediaCount}.`
    );
  }

  // Media type validation
  for (const item of media) {
    if (!config.allowedMediaTypes.includes(item.type)) {
      errors.push(
        `File "${item.name}" (${item.type || "unknown"}) is not supported by ${config.name}. Allowed: ${config.allowedMediaExtensions.join(", ")}.`
      );
    }
  }

  const isValid = errors.length === 0;

  return {
    platformId,
    isValid,
    charCount,
    maxChars: config.maxChars,
    remainingChars,
    charPercentage,
    warningState,
    hashtagCount,
    maxHashtags: config.hashtagLimit,
    errors,
    warnings,
  };
}

/**
 * Generic multi-platform validator.
 * Accepts a list of targeted platform IDs and evaluates rules per platform.
 */
export function validatePost<T extends PlatformId>(
  content: string,
  media: MediaAttachment[],
  platformIds: T[]
): Record<T, ValidationResult> {
  const results = {} as Record<T, ValidationResult>;
  for (const id of platformIds) {
    results[id] = validateSinglePlatform(id, content, media);
  }
  return results;
}
