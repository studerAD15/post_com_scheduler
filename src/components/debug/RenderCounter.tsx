/**
 * RenderCounter.tsx - Omnitrix active sync indicator.
 */

import React, { useRef } from "react";

export interface RenderCounterProps {
  name: string;
  className?: string;
}

export const RenderCounter: React.FC<RenderCounterProps> = ({ name, className = "" }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-[#3DDC10]/10 text-[#3DDC10] border border-[#3DDC10]/30 uppercase ${className}`}
      title={`Live Status for ${name}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC10] animate-ping"></span>
      SYNC ACTIVE
    </div>
  );
};
