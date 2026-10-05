/**
 * ErrorBoundary.tsx - Industrial Omnitrix Theme System Error Boundary.
 * Catches unhandled client-side render exceptions and renders a fail-safe recovery console.
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Trash2, ShieldAlert } from "lucide-react";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error("[Omnitrix System Error]", error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleResetState = (): void => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#0A0A0A] flex items-center justify-center p-4 selection:bg-[#3DDC10] selection:text-[#0A0A0A]">
          <div className="max-w-lg w-full bg-[#FFFFFF] border-4 border-[#0A0A0A] rounded-sm p-6 sm:p-8 space-y-6 shadow-omni">
            {/* Header */}
            <div className="flex items-center gap-3 border-b-2 border-[#0A0A0A] pb-4">
              <div className="w-12 h-12 rounded-sm bg-[#FF7A00]/10 border-2 border-[#FF7A00] text-[#FF7A00] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-space font-extrabold uppercase text-[#0A0A0A] tracking-wider">
                  OMNITRIX SYSTEM OVERLOAD
                </h1>
                <p className="text-xs font-mono text-[#C2410C] mt-0.5">
                  CORE RUNTIME EXCEPTION DETECTED
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="bg-[#F8F9FA] border-2 border-[#0A0A0A] rounded-sm p-4 space-y-2 font-mono text-xs">
              <p className="text-[#C2410C] font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {this.state.error?.name || "ApplicationError"}:{" "}
                {this.state.error?.message || "An unexpected client-side error occurred."}
              </p>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[10px] text-[#52525B] max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 font-rajdhani text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-sm bg-[#3DDC10] hover:bg-[#34C20C] text-[#0A0A0A] font-extrabold flex items-center justify-center gap-2 border-2 border-[#0A0A0A] transition-all shadow-omni cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> RECALIBRATE / RELOAD
              </button>
              <button
                type="button"
                onClick={this.handleResetState}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-sm bg-[#FFFFFF] hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-[#FFFFFF] flex items-center justify-center gap-2 border-2 border-[#0A0A0A] transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-[#FF7A00]" /> RESET CACHED STATE
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
