"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { AdminStaticCardsProvider } from "@/components/admin/AdminStaticCardsContext";

type DialogTone = "danger" | "info" | "success";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: DialogTone;
};

type AlertOptions = {
  title?: string;
  message: string;
  tone?: DialogTone;
  okLabel?: string;
};

type AdminUiContextValue = {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
  alert: (options: AlertOptions | string) => Promise<void>;
};

const AdminUiContext = createContext<AdminUiContextValue | null>(null);

export function useAdminUi() {
  const ctx = useContext(AdminUiContext);
  if (!ctx) {
    throw new Error("useAdminUi must be used within AdminUiProvider");
  }
  return ctx;
}

type PendingConfirm = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

type PendingAlert = AlertOptions & {
  resolve: () => void;
};

function normalizeConfirm(input: ConfirmOptions | string): ConfirmOptions {
  if (typeof input === "string") return { message: input, tone: "danger" };
  return { tone: "danger", ...input };
}

function normalizeAlert(input: AlertOptions | string): AlertOptions {
  if (typeof input === "string") return { message: input, tone: "info" };
  return { tone: "info", ...input };
}

function toneStyles(tone: DialogTone) {
  if (tone === "danger") {
    return {
      iconWrap: "bg-rose-500/15 text-rose-500 border-rose-500/30",
      Icon: AlertTriangle,
      confirmBtn:
        "bg-rose-600 hover:bg-rose-500 text-white border-rose-500/40",
    };
  }
  if (tone === "success") {
    return {
      iconWrap: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
      Icon: CheckCircle2,
      confirmBtn:
        "bg-[#226263] hover:bg-[#1a4f50] text-white border-[#004d4d]/40",
    };
  }
  return {
    iconWrap: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
    Icon: Info,
    confirmBtn:
      "bg-[#226263] hover:bg-[#1a4f50] text-white border-[#004d4d]/40",
  };
}

export function AdminUiProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [confirmState, setConfirmState] = useState<PendingConfirm | null>(null);
  const [alertState, setAlertState] = useState<PendingAlert | null>(null);
  const confirmRef = useRef<PendingConfirm | null>(null);
  const alertRef = useRef<PendingAlert | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirm = useCallback((input: ConfirmOptions | string) => {
    const opts = normalizeConfirm(input);
    return new Promise<boolean>((resolve) => {
      const pending = { ...opts, resolve };
      confirmRef.current = pending;
      setConfirmState(pending);
    });
  }, []);

  const alert = useCallback((input: AlertOptions | string) => {
    const opts = normalizeAlert(input);
    return new Promise<void>((resolve) => {
      const pending = { ...opts, resolve };
      alertRef.current = pending;
      setAlertState(pending);
    });
  }, []);

  const closeConfirm = useCallback((value: boolean) => {
    confirmRef.current?.resolve(value);
    confirmRef.current = null;
    setConfirmState(null);
  }, []);

  const closeAlert = useCallback(() => {
    alertRef.current?.resolve();
    alertRef.current = null;
    setAlertState(null);
  }, []);

  useEffect(() => {
    if (!confirmState && !alertState) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (confirmState) closeConfirm(false);
        else if (alertState) closeAlert();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmState, alertState, closeConfirm, closeAlert]);

  const value = useMemo(() => ({ confirm, alert }), [confirm, alert]);

  const activeConfirm = confirmState;
  const activeAlert = alertState;
  const confirmTone = toneStyles(activeConfirm?.tone || "danger");
  const alertTone = toneStyles(activeAlert?.tone || "info");
  const ConfirmIcon = confirmTone.Icon;
  const AlertIcon = alertTone.Icon;

  const dialogs =
    mounted &&
    (activeConfirm || activeAlert) &&
    createPortal(
      <>
        {activeConfirm && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            role="presentation"
            onClick={() => closeConfirm(false)}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="admin-confirm-title"
              aria-describedby="admin-confirm-desc"
              className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-white dark:bg-[#0f1524] shadow-[0_24px_80px_-24px_rgba(0,77,77,0.55)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#004d4d] via-cyan-400 to-[#004d4d]" />
              <div className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center ${confirmTone.iconWrap}`}
                  >
                    <ConfirmIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3
                      id="admin-confirm-title"
                      className="text-base font-extrabold text-slate-900 dark:text-white"
                    >
                      {activeConfirm.title || "Please confirm"}
                    </h3>
                    <p
                      id="admin-confirm-desc"
                      className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                    >
                      {activeConfirm.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => closeConfirm(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => closeConfirm(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  >
                    {activeConfirm.cancelLabel || "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={() => closeConfirm(true)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border ${confirmTone.confirmBtn}`}
                  >
                    {activeConfirm.confirmLabel || "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeAlert && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            role="presentation"
            onClick={closeAlert}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-alert-title"
              aria-describedby="admin-alert-desc"
              className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-white dark:bg-[#0f1524] shadow-[0_24px_80px_-24px_rgba(0,77,77,0.55)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#004d4d] via-cyan-400 to-[#004d4d]" />
              <div className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center ${alertTone.iconWrap}`}
                  >
                    <AlertIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3
                      id="admin-alert-title"
                      className="text-base font-extrabold text-slate-900 dark:text-white"
                    >
                      {activeAlert.title ||
                        (activeAlert.tone === "success"
                          ? "Success"
                          : activeAlert.tone === "danger"
                            ? "Something went wrong"
                            : "Notice")}
                    </h3>
                    <p
                      id="admin-alert-desc"
                      className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                    >
                      {activeAlert.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeAlert}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={closeAlert}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border ${alertTone.confirmBtn}`}
                  >
                    {activeAlert.okLabel || "OK"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>,
      document.body
    );

  return (
    <AdminStaticCardsProvider>
      <AdminUiContext.Provider value={value}>
        {children}
        {dialogs}
      </AdminUiContext.Provider>
    </AdminStaticCardsProvider>
  );
}
