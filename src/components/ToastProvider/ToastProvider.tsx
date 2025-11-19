"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import * as Toast from "@radix-ui/react-toast";
import "./ToastProvider.scss";

type ToastType = "success" | "error";

type ToastMessage = {
  type: ToastType;
  title: string;
  description?: string;
};

type ToastContextValue = {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<ToastMessage | null>(null);

  function show(type: ToastType, title: string, description?: string) {
    setMessage({ type, title, description });
    setOpen(false);
    setTimeout(() => setOpen(true), 10);
  }

  const success = (title: string, description?: string) =>
    show("success", title, description);

  const error = (title: string, description?: string) =>
    show("error", title, description);

  return (
    <ToastContext.Provider value={{ success, error }}>
      <Toast.Provider swipeDirection="right">
        {children}

        <Toast.Root
          className={`
            ToastRoot
            ${message?.type === "success" ? "toast-success" : ""}
            ${message?.type === "error" ? "toast-error" : ""}
          `}
          open={open}
          onOpenChange={setOpen}
        >
          {message && (
            <>
              <Toast.Title>{message.title}</Toast.Title>
              {message.description && (
                <Toast.Description>{message.description}</Toast.Description>
              )}
            </>
          )}
        </Toast.Root>

        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
