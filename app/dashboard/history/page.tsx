"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

interface HistoryItem {
  id: string;
  query: string;
  searchedAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/dashboard/search-history")
      .then((res) => setHistory(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-indigo-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search History</h1>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {!loading && history.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No searches yet.</p>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-50">
        {history.map((h) => (
          <Link key={h.id} href={"/search?q=" + encodeURIComponent(h.query)} className="flex items-center justify-between px-5 py-4">
            <span className="flex items-center gap-3 text-sm text-gray-700">
              <Search className="w-4 h-4 text-gray-400" />
              {h.query}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
