"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLogin, useNotify } from "react-admin";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const MICROSOFT_SESSION_ERROR =
  "Não foi possível validar sua sessão Microsoft. Entre novamente.";

export default function CustomLoginPage() {
  const login = useLogin();
  const notify = useNotify();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"infodive" | "partner">("infodive");
  const [loading, setLoading] = useState(false);
  const attemptMade = useRef(false);

  // Form de parceiro
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerAccessKey, setPartnerAccessKey] = useState("");

  // Quando o usuário é autenticado com sucesso pelo Microsoft Entra ID via NextAuth
  useEffect(() => {
    if (status === "authenticated" && session && !attemptMade.current) {
      const rawIdToken = (session as any).idToken;
      const idToken = typeof rawIdToken === "string" ? rawIdToken.trim() : "";

      attemptMade.current = true;

      if (!idToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setLoading(false);
        notify(MICROSOFT_SESSION_ERROR, { type: "error" });
        void signOut({ redirect: false }).catch(() => undefined);
        return;
      }

      setLoading(true);
      login({ username: idToken })
        .then(() => {
          window.location.href = "/";
        })
        .catch((error) => {
          const errorMsg = error?.message || "Acesso negado. Conta sem permissão.";
          notify(errorMsg, { type: "error" });
          setLoading(false);
        });
    }
  }, [status, session, login, notify]);

  const handleMicrosoftLogin = () => {
    attemptMade.current = false;
    setLoading(true);
    signIn("azure-ad", { callbackUrl: "/" });
  };

  const handlePartnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail || !partnerAccessKey) {
      notify("Preencha o e-mail e a chave de acesso.", { type: "warning" });
      return;
    }
    setLoading(true);
    login({ username: partnerEmail, password: partnerAccessKey })
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        const errorMsg = error?.message || "Chave de acesso ou e-mail de parceiro inválido.";
        notify(errorMsg, { type: "error" });
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 font-sans text-slate-100">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        
        {/* Logo Oficial Infodive */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative w-44 h-12 flex items-center justify-center">
            <Image
              src="/logo-infodive.png"
              alt="Infodive Logo"
              width={180}
              height={50}
              priority
              className="object-contain"
            />
          </div>
          <div className="text-center pt-1">
            <h1 className="text-base font-semibold text-slate-100 tracking-tight">Painel Administrativo</h1>
            <p className="text-xs text-slate-400">Gestão de Conteúdo e Serviços</p>
          </div>
        </div>

        {/* Abas de Seleção de Tipo de Login */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab("infodive")}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-medium transition-all ${
              activeTab === "infodive"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Infodive (SSO)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("partner")}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-medium transition-all ${
              activeTab === "partner"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Parceiros / Blog
          </button>
        </div>

        {/* Conteúdo da Aba 1: Microsoft SSO */}
        {activeTab === "infodive" && (
          <div className="space-y-4 pt-1">
            <button
              type="button"
              disabled={loading}
              onClick={handleMicrosoftLogin}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 text-sm"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21" fill="none">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                  </svg>
                  <span>Entrar com Microsoft</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500">
              Acesso total para colaboradores <span className="text-slate-400 font-medium">@infodive.com.br</span>
            </p>
          </div>
        )}

        {/* Conteúdo da Aba 2: Login de Parceiros */}
        {activeTab === "partner" && (
          <form onSubmit={handlePartnerLogin} className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                E-mail do Editor / Agência
              </label>
              <input
                type="email"
                required
                placeholder="redacao@agencia.com.br"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Chave de Acesso do Parceiro
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={partnerAccessKey}
                onChange={(e) => setPartnerAccessKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl text-xs shadow-md transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Acessar Módulo Blog"}
            </button>

            <p className="text-[11px] text-center text-slate-500">
              Acesso restrito para editores e agências de conteúdo
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
