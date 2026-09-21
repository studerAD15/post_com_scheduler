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
    <div className={`relative overflow-hidden flex items-center justify-center p-4 bg-[#0A0A0A] ${isModal ? "min-h-0" : "min-h-screen"}`}>
      {!isModal && <LoginBackground />}
      <div className="relative z-10 bg-[#FFFFFF] text-[#0A0A0A] border-4 border-[#0A0A0A] rounded-sm p-6 sm:p-8 max-w-md w-full shadow-card-white space-y-6">
        {/* Header Tile with Omnitrix Logo */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto bg-[#0A0A0A] border-2 border-[#3DDC10] rounded-sm flex items-center justify-center shadow-omni transform rotate-45">
            <Radio className="w-6 h-6 text-[#3DDC10] transform -rotate-45" />
          </div>
          <div>
            <h2 className="text-2xl font-sekuya uppercase font-extrabold text-[#0A0A0A] tracking-wider">
              SYSTEM ACCESS
            </h2>
            <p className="text-xs font-switzer text-[#71717A] mt-1">
              Sign in to manage multi-channel social publications.
            </p>
          </div>
        </div>

        {/* Quick Account Switcher Tiles (Space Grotesk + Rajdhani) */}
        <div className="bg-[#F8F9FA] p-4 rounded-sm border-2 border-[#0A0A0A] space-y-2.5">
          <p className="text-[10px] font-space font-extrabold text-[#0A0A0A] text-center uppercase tracking-widest flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#3DDC10] rounded-full"></span> QUICK ACCESS ACCOUNTS
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("admin")}
              className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-sm bg-[#0A0A0A] text-[#3DDC10] hover:bg-[#3DDC10] hover:text-[#0A0A0A] border border-[#0A0A0A] text-xs font-rajdhani font-bold uppercase transition-all"
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("editor")}
              className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-sm bg-[#0A0A0A] text-[#3DDC10] hover:bg-[#3DDC10] hover:text-[#0A0A0A] border border-[#0A0A0A] text-xs font-rajdhani font-bold uppercase transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Editor
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("viewer")}
              className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-sm bg-[#0A0A0A] text-[#FFFFFF] hover:bg-[#3DDC10] hover:text-[#0A0A0A] border border-[#0A0A0A] text-xs font-rajdhani font-bold uppercase transition-all"
            >
              <Eye className="w-3.5 h-3.5" /> Viewer
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {authError && (
          <div className="bg-[#FF7A00]/10 border-2 border-[#FF7A00] p-3 rounded-sm text-xs text-[#FF7A00] font-mono font-bold">
            {authError}
          </div>
        )}

        {/* Form Inputs (Space Grotesk + Inter) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-space font-bold text-[#0A0A0A] uppercase tracking-wider">
              Account Username
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#0A0A0A] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="admin, editor, or viewer"
                className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-[#F8F9FA] border-2 border-[#0A0A0A] text-sm text-[#0A0A0A] placeholder-[#71717A] font-switzer focus:outline-none focus:border-[#3DDC10] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-space font-bold text-[#0A0A0A] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#0A0A0A] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-[#F8F9FA] border-2 border-[#0A0A0A] text-sm text-[#0A0A0A] placeholder-[#71717A] font-switzer focus:outline-none focus:border-[#3DDC10] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full py-3 px-4 rounded-sm bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] font-rajdhani font-extrabold text-sm uppercase tracking-widest border-2 border-[#0A0A0A] transition-all shadow-omni hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
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

        <div className="text-[11px] font-mono text-center text-[#71717A] border-t-2 border-[#0A0A0A] pt-4">
          Demo passcode: <code className="text-[#0A0A0A] font-bold bg-[#3DDC10] px-1 rounded-sm">password123</code>
        </div>
      </div>
    </div>
  );
});
LoginForm.displayName = "LoginForm";

export default LoginForm;
