"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let googleScriptPromise = null;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M21.8 12.23c0-.7-.06-1.37-.18-2.01H12v3.8h5.5a4.7 4.7 0 0 1-2.04 3.09v2.56h3.3c1.94-1.79 3.04-4.44 3.04-7.44Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.07-.91 6.76-2.47l-3.3-2.56c-.92.62-2.08.99-3.46.99-2.66 0-4.91-1.8-5.72-4.22H2.88v2.64A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.28 13.74a6.02 6.02 0 0 1 0-3.48V7.62H2.88a10 10 0 0 0 0 8.76l3.4-2.64Z"
        fill="#FBBC04"
      />
      <path
        d="M12 6.04c1.5 0 2.85.52 3.91 1.54l2.93-2.93C17.06 2.99 14.75 2 12 2a10 10 0 0 0-9.12 5.62l3.4 2.64c.81-2.42 3.06-4.22 5.72-4.22Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function loadGoogleScript() {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google Sign-In solo funciona en el navegador.")
    );
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        `script[src="${GOOGLE_SCRIPT_SRC}"]`
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.google), {
          once: true,
        });
        existingScript.addEventListener(
          "error",
          () => reject(new Error("No se pudo cargar Google Sign-In.")),
          { once: true }
        );
        return;
      }

      const script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = () =>
        reject(new Error("No se pudo cargar Google Sign-In."));

      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
}

export default function GoogleAuthButton({
  mode = "login",
  onCredential,
  disabled = false,
  className,
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const containerRef = useRef(null);
  const [scriptLoading, setScriptLoading] = useState(!!clientId);
  const [scriptError, setScriptError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!clientId || !containerRef.current) {
      return undefined;
    }

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !containerRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: ({ credential }) => {
            if (!credential || typeof onCredential !== "function") {
              return;
            }

            onCredential(credential);
          },
        });

        containerRef.current.innerHTML = "";

        const parentWidth = containerRef.current.parentElement?.clientWidth ?? 320;
        const buttonWidth = Math.max(220, Math.min(360, parentWidth - 8));

        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          text: mode === "register" ? "signup_with" : "continue_with",
          shape: "pill",
          width: buttonWidth,
          logo_alignment: "left",
        });

        setScriptError("");
        setScriptLoading(false);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        console.error(error);
        setScriptError("Google no está disponible en este momento.");
        setScriptLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, mode, onCredential]);

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-dashed border-[#D4E2EA] bg-white px-4 text-sm font-medium text-[#687280] opacity-70",
          className
        )}
      >
        <GoogleIcon />
        Google pendiente de configurar
      </button>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-sm",
        disabled && "pointer-events-none opacity-60",
        className
      )}
    >
      {scriptLoading && (
        <div className="flex h-11 items-center justify-center gap-2 text-sm text-[#687280]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparando Google...
        </div>
      )}

      <div ref={containerRef} className={cn(scriptLoading && "hidden")} />

      {scriptError && (
        <p className="px-3 pb-2 text-xs text-[#E5533D]">{scriptError}</p>
      )}
    </div>
  );
}
