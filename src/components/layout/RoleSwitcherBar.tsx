/**
 * RoleSwitcherBar.tsx - Authenticated Session Header Bar (Role Switcher Removed for Security).
 */

import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentUser, logout } from "../../features/auth/authSlice";
import { Role } from "../../types/auth";
import { LogOut, Shield, Sparkles, Eye, Lock } from "lucide-react";

export const RoleSwitcherBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) return null;

  const ROLE_DESCRIPTIONS: Record<Role, { label: string; icon: React.FC<{ className?: string }> }> = {
    admin: { label: "Admin", icon: Shield },
    editor: { label: "Editor", icon: Sparkles },
    viewer: { label: "Viewer", icon: Eye },
  };

  const RoleIcon = ROLE_DESCRIPTIONS[currentUser.role]?.icon || Shield;

  return (
    <div className="bg-[#0A0A0A] border-b border-[#2A2A2A] sticky top-0 z-40 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* User Info Tile (White badge on black surface) */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#FFFFFF] border-2 border-[#3DDC10] flex items-center justify-center overflow-hidden shrink-0 shadow-omni">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <Shield className="w-4 h-4 text-[#0A0A0A]" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-space uppercase font-bold text-[#FFFFFF] tracking-wider text-xs">
              {currentUser.name}
            </span>
            <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest bg-[#3DDC10] text-[#0A0A0A] flex items-center gap-1">
              <RoleIcon className="w-3 h-3 text-[#0A0A0A]" />
              {ROLE_DESCRIPTIONS[currentUser.role]?.label} MODE
            </span>
          </div>
        </div>

        {/* Read-Only Authenticated Session Badge & Sign Out Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#141414] border border-[#2A2A2A] px-2.5 py-1 rounded-sm text-[11px] font-mono text-[#71717A]">
            <Lock className="w-3 h-3 text-[#3DDC10]" />
            <span>SESSION LOCKED:</span>
            <strong className="text-[#3DDC10] uppercase">{currentUser.role}</strong>
          </div>

          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#FFFFFF] border-2 border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#FF7A00] hover:text-[#FFFFFF] text-xs font-rajdhani uppercase tracking-wider font-bold transition-all shadow-sm"
            title="Sign Out to switch accounts"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
