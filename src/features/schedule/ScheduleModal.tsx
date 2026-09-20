/**
 * ScheduleModal.tsx - Tri-Color Date & Time Picker Modal with 5 Google Fonts.
 * Memoized with React.memo and stable useCallback handlers.
 */

import React, { useState, useCallback, useEffect } from "react";
import { PlatformId } from "../../types/platform";
import { TwitterIcon, InstagramIcon, LinkedInIcon, FacebookIcon } from "../../components/common/BrandIcons";
import { Calendar, X, CheckCircle2, AlertCircle } from "lucide-react";

export interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSchedule: (scheduledIsoString: string) => void;
  postTitle?: string;
  platforms?: PlatformId[];
}

const BRAND_SVGS: Record<PlatformId, React.FC<{ className?: string }>> = {
  twitter: (props) => <TwitterIcon {...props} />,
  instagram: (props) => <InstagramIcon {...props} />,
  linkedin: (props) => <LinkedInIcon {...props} />,
  facebook: (props) => <FacebookIcon {...props} />,
};

export const ScheduleModal: React.FC<ScheduleModalProps> = React.memo(
  ({
    isOpen,
    onClose,
    onConfirmSchedule,
    postTitle = "Untitled Post",
    platforms = ["twitter"] as PlatformId[],
  }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDateStr = tomorrow.toISOString().split("T")[0];

    const [date, setDate] = useState<string>(defaultDateStr);
    const [time, setTime] = useState<string>("09:00");
    const [error, setError] = useState<string | null>(null);

    // Close on Escape key
    useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const handleConfirm = useCallback(() => {
      try {
        const combinedDateTime = new Date(`${date}T${time}:00`);
        if (isNaN(combinedDateTime.getTime())) {
          setError("Please select a valid date and time.");
          return;
        }

        if (combinedDateTime.getTime() <= Date.now()) {
          setError("The scheduled time must be set in the future.");
          return;
        }

        setError(null);
        onConfirmSchedule(combinedDateTime.toISOString());
        onClose();
      } catch {
        setError("Invalid date selection.");
      }
    }, [date, time, onConfirmSchedule, onClose]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/85 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-modal-title"
      >
        <div
          className="bg-[#FFFFFF] text-[#0A0A0A] border-4 border-[#0A0A0A] rounded-sm p-6 max-w-md w-full space-y-5 shadow-card-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#3DDC10]" />
              <h3 id="schedule-modal-title" className="text-base font-space uppercase font-bold text-[#0A0A0A] tracking-wider">
                SCHEDULE PUBLICATION
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="text-[#71717A] hover:text-[#0A0A0A] p-1 rounded-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Post Brief Summary */}
          <div className="bg-[#F8F9FA] p-3.5 rounded-sm border-2 border-[#0A0A0A] space-y-1.5">
            <p className="text-[10px] font-space font-bold uppercase tracking-widest text-[#71717A]">
              POST PREVIEW:
            </p>
            <p className="text-sm font-space font-bold text-[#0A0A0A] truncate">
              {postTitle}
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              {platforms.map((pId) => {
                const IconComp = BRAND_SVGS[pId];
                return (
                  <span
                    key={pId}
                    className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm bg-[#0A0A0A] text-[#3DDC10] border border-[#0A0A0A]"
                  >
                    <IconComp className="w-3 h-3" />
                    {pId}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Date & Time Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-space font-bold uppercase tracking-widest text-[#0A0A0A]">
                PUBLISHING DATE
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full px-3 py-2.5 rounded-sm bg-[#F8F9FA] border-2 border-[#0A0A0A] text-xs font-mono text-[#0A0A0A] focus:outline-none focus:border-[#3DDC10]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-space font-bold uppercase tracking-widest text-[#0A0A0A]">
                PUBLISHING TIME
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full px-3 py-2.5 rounded-sm bg-[#F8F9FA] border-2 border-[#0A0A0A] text-xs font-mono text-[#0A0A0A] focus:outline-none focus:border-[#3DDC10]"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-mono text-[#FF7A00] font-bold bg-[#FF7A00]/10 border border-[#FF7A00] p-2.5 rounded-sm flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
            </p>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#0A0A0A] font-rajdhani text-xs font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm bg-[#F8F9FA] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A] transition-colors border border-[#0A0A0A]"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] font-extrabold transition-all shadow-sm border border-[#0A0A0A]"
            >
              <CheckCircle2 className="w-4 h-4" /> CONFIRM SCHEDULE
            </button>
          </div>
        </div>
      </div>
    );
  }
);
ScheduleModal.displayName = "ScheduleModal";

export default ScheduleModal;
