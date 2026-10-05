/**
 * UnauthorizedView.tsx - Tri-color restricted access page with 5 fonts.
 */

import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const UnauthorizedView: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#FFFFFF]">
      <div className="bg-[#FFFFFF] text-[#0A0A0A] border-4 border-[#FF7A00] rounded-sm p-8 max-w-md w-full text-center space-y-5 shadow-omni-warning">
        <div className="w-16 h-16 rounded-sm bg-[#FF7A00]/10 border-2 border-[#FF7A00] text-[#FF7A00] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-space uppercase font-extrabold text-[#0A0A0A] tracking-wider">
            ACCESS RESTRICTED
          </h2>
          <p className="text-xs font-inter text-[#71717A] leading-relaxed">
            Your current account view does not have permission to execute commands in this section.
          </p>
        </div>

        <div className="bg-[#F8F9FA] p-3.5 rounded-sm border-2 border-[#0A0A0A] text-xs font-inter text-[#0A0A0A]">
          Use the account switcher in the top navigation bar to switch to an <strong className="text-[#0A0A0A] bg-[#FFFFFF] border border-[#0A0A0A] px-1.5 py-0.5 rounded-sm">Admin</strong> or <strong className="text-[#0A0A0A] bg-[#FFFFFF] border border-[#0A0A0A] px-1.5 py-0.5 rounded-sm">Editor</strong> account.
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] font-rajdhani font-extrabold uppercase text-xs tracking-widest transition-all shadow-omni hover:scale-[1.02] border-2 border-[#0A0A0A]"
        >
          <ArrowLeft className="w-4 h-4" /> RETURN TO DASHBOARD
        </Link>
      </div>
    </div>
  );
};
