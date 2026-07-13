"use client";

import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("@/components/AdminApp"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600 font-sans">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="text-sm font-medium">Carregando painel administrativo...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <AdminApp />;
}
