/**
 * RoleSwitcherBar.tsx - Authenticated Session Header Bar (Role Switcher Removed for Security).
 * Memoized with React.memo and useCallback handlers.
 */

import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentUser, logout } from "../../features/auth/authSlice";
import { Role } from "../../types/auth";
import { LogOut, Shield, Sparkles, Eye, Lock } from "lucide-react";

export const RoleSwitcherBar: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  if (!currentUser) return null;

  const ROLE_DESCRIPTIONS: Record<Role, { label: string; icon: React.FC<{ className?: string }> }> = {
    admin: { label: "Admin", icon: Shield },
    editor: { label: "Editor", icon: Sparkles },
    viewer: { label: "Viewer", icon: Eye },
  };

  const RoleIcon = ROLE_DESCRIPTIONS[currentUser.role]?.icon || Shield;

  return (
    <div className="bg-[#FFFFFF] border-b border-[#E5E7EB] px-4 py-2 text-xs text-[#0A0A0A]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* User Info Tile */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#FFFFFF] border-2 border-[#3DDC10] flex items-center justify-center overflow-hidden shrink-0 shadow-omni">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <Shield className="w-4 h-4 text-[#0A0A0A]" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-space uppercase font-bold text-[#0A0A0A] tracking-wider text-xs">
              {currentUser.name}
            </span>
            <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest bg-[#3DDC10] text-[#0A0A0A] flex items-center gap-1">
              <RoleIcon className="w-3 h-3 text-[#0A0A0A]" />
              {ROLE_DESCRIPTIONS[currentUser.role]?.label} MODE
            </span>
          </div>
        </div>

        {/* Active Authenticated Session Badge & Sign Out Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-sm px-3 py-1 text-xs">
            <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#3DDC10]" /> ACTIVE ROLE:
            </span>
            <span
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-rajdhani uppercase tracking-wider font-extrabold ${
                currentUser.role === "admin"
                  ? "bg-[#3DDC10] text-[#0A0A0A]"
                  : currentUser.role === "editor"
                  ? "bg-[#3DDC10]/20 text-[#0A0A0A] border border-[#3DDC10]/50"
                  : "bg-[#F4F4F5] text-[#0A0A0A] border border-[#E5E7EB]"
              }`}
            >
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{ROLE_DESCRIPTIONS[currentUser.role]?.label}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#FFFFFF] border-2 border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#FF7A00] hover:text-[#FFFFFF] text-xs font-rajdhani uppercase tracking-wider font-bold transition-all shadow-sm"
            title="Sign Out to switch user account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>
    </div>
  );
});
RoleSwitcherBar.displayName = "RoleSwitcherBar";

export default RoleSwitcherBar;
