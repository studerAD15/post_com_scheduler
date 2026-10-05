/**
 * LoginForm.tsx - Tri-Color Login Panel with 5 Google Fonts.
 * Memoized with React.memo and useCallback handlers.
 */

import React, { useState, useCallback, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginThunk, clearAuthError, selectAuthError, selectAuthStatus } from "./authSlice";
import { Lock, User as UserIcon, Loader2, ArrowRight, Radio, Shield, Sparkles, Eye } from "lucide-react";
import { LoginBackground } from "./LoginBackground";

export const LoginForm: React.FC<{ isModal?: boolean }> = React.memo(({ isModal = false }) => {
  const dispatch = useAppDispatch();
  const authError = useAppSelector(selectAuthError);
  const authStatus = useAppSelector(selectAuthStatus);

  const [username, setUsername] = useState<string>("admin");
  const [password, setPassword] = useState<string>("password123");

  const handleUsernameChange = useCallback(
    (val: string) => {
      setUsername(val);
      if (authError) dispatch(clearAuthError());
    },
    [authError, dispatch]
  );

  const handlePasswordChange = useCallback(
    (val: string) => {
      setPassword(val);
      if (authError) dispatch(clearAuthError());
    },
    [authError, dispatch]
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!username.trim() || !password.trim()) return;
      dispatch(loginThunk({ username, passwordHash: password }));
    },
    [dispatch, username, password]
  );

  const handleQuickFill = useCallback(
    (role: "admin" | "editor" | "viewer") => {
      setUsername(role);
      setPassword("password123");
      if (authError) dispatch(clearAuthError());
    },
    [authError, dispatch]
  );

  const isLoading = authStatus === "loading";
  const isSubmitDisabled = isLoading || !username.trim() || !password.trim();

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${isModal ? "p-0 bg-transparent min-h-0" : "p-4 bg-[#FFFFFF] min-h-screen"}`}>
      {!isModal && <LoginBackground />}
      <div className="relative z-10 card-omni p-6 sm:p-8 max-w-md w-full space-y-6 text-[#0A0A0A] bg-[#FFFFFF] border-2 border-[#0A0A0A] shadow-2xl">
        {/* Header Tile with Omnitrix Logo */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto bg-[#0A0A0A] border-2 border-[#3DDC10] rounded-sm flex items-center justify-center shadow-omni transform rotate-45">
            <Radio className="w-6 h-6 text-[#3DDC10] transform -rotate-45" />
          </div>
          <div>
            <h2 className="text-2xl font-sekuya uppercase font-extrabold text-[#0A0A0A] tracking-wider">
              SYSTEM ACCESS
            </h2>
            <p className="text-xs font-inter font-normal text-[#52525B] mt-1">
              Sign in to manage multi-channel social publications.
            </p>
          </div>
        </div>

        {/* Quick Account Switcher Tiles */}
        <div className="bg-[#F8F9FA] p-4 rounded-sm border border-[#E5E7EB] space-y-2.5">
          <p className="text-[10px] font-mono font-bold text-[#52525B] text-center uppercase tracking-widest flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#3DDC10] rounded-full"></span> QUICK ACCESS ACCOUNTS
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("admin")}
              className="h-9 text-xs inline-flex items-center justify-center gap-1.5 border-2 border-[#0A0A0A] bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A] font-rajdhani font-bold uppercase tracking-wider rounded-sm transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-[#3DDC10]" /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("editor")}
              className="h-9 text-xs inline-flex items-center justify-center gap-1.5 border-2 border-[#0A0A0A] bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A] font-rajdhani font-bold uppercase tracking-wider rounded-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3DDC10]" /> Editor
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("viewer")}
              className="h-9 text-xs inline-flex items-center justify-center gap-1.5 border-2 border-[#0A0A0A] bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A] font-rajdhani font-bold uppercase tracking-wider rounded-sm transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#71717A]" /> Viewer
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {authError && (
          <div className="bg-[#FF7A00]/10 border border-[#FF7A00] p-3 rounded-sm text-xs text-[#FF7A00] font-mono font-bold">
            {authError}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-bold text-[#52525B] uppercase tracking-wider">
              Account Username
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="admin, editor, or viewer"
                className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-[#FFFFFF] border-2 border-[#0A0A0A] text-sm text-[#0A0A0A] placeholder-[#A1A1AA] font-inter focus:outline-none focus:border-[#3DDC10] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-bold text-[#52525B] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-[#FFFFFF] border-2 border-[#0A0A0A] text-sm text-[#0A0A0A] placeholder-[#A1A1AA] font-inter focus:outline-none focus:border-[#3DDC10] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="btn-omni-primary h-11 w-full text-xs flex items-center justify-center gap-2 disabled:opacity-50 border-2 border-[#0A0A0A]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> VERIFYING...
              </>
            ) : (
              <>
                SIGN IN NOW <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-[11px] font-mono text-center text-[#71717A] border-t border-[#E5E7EB] pt-4">
          Demo passcode: <code className="text-[#0A0A0A] font-bold bg-[#3DDC10]/20 px-1.5 py-0.5 rounded-sm border border-[#3DDC10]/40">password123</code>
        </div>
      </div>
    </div>
  );
});
LoginForm.displayName = "LoginForm";

export default LoginForm;
