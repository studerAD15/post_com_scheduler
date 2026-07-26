/**
 * RoleSwitcherBar.tsx - Tri-Color Account Switcher Bar with Rajdhani font.
 */

import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentUser, switchRoleThunk, logout } from "../../features/auth/authSlice";
import { Role } from "../../types/auth";
import { LogOut, Shield, Sparkles, Eye } from "lucide-react";

export const RoleSwitcherBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) return null;

  const handleRoleChange = (role: Role) => {
    dispatch(switchRoleThunk(role));
  };

  const ROLE_DESCRIPTIONS: Record<Role, { label: string; icon: React.FC<{ className?: string }> }> = {
    admin: { label: "Admin", icon: Shield },
    editor: { label: "Editor", icon: Sparkles },
    viewer: { label: "Viewer", icon: Eye },
  };

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
            <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest bg-[#3DDC10] text-[#0A0A0A]">
              {ROLE_DESCRIPTIONS[currentUser.role]?.label} MODE
            </span>
          </div>
        </div>

        {/* Account Switcher Tiles using Rajdhani Font */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#71717A] uppercase hidden md:inline">
            ACCOUNT VIEW:
          </span>
          <div className="flex items-center bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm p-1 gap-1">
            {(["admin", "editor", "viewer"] as Role[]).map((r) => {
              const isActive = currentUser.role === r;
              const RoleIcon = ROLE_DESCRIPTIONS[r].icon;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-rajdhani uppercase tracking-wider font-bold transition-all ${
                    isActive
                      ? "bg-[#3DDC10] text-[#0A0A0A] shadow-sm scale-[1.02]"
                      : "text-[#0A0A0A] hover:bg-[#F8F9FA] hover:text-[#3DDC10]"
                  }`}
                >
                  <RoleIcon className="w-3.5 h-3.5" />
                  <span>{ROLE_DESCRIPTIONS[r].label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="p-1.5 rounded-sm text-[#71717A] hover:text-[#FF7A00] hover:bg-[#FF7A00]/10 transition-colors ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
