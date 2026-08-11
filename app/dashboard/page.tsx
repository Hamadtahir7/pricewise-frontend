"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Heart, Bell, History, Settings, ArrowRight, Search } from "lucide-react";
import { api } from "@/lib/api";

interface WishlistItem {
  id: string;
  product: { id: string; name: string; image: string | null };
}

interface PriceAlertItem {
  id: string;
  targetPrice: number;
  product: { id: string; name: string };
}

interface SearchHistoryItem {
  id: string;
  query: string;
}
const getInitials = (name: string) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0][0].toUpperCase();
};



export default function DashboardPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [alerts, setAlerts] = useState<PriceAlertItem[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    api.get("/api/auth/me").then((res) => setUserName(res.data.name)).catch(() => {});
  }, []);

  useEffect(() => {
    Promise.all([
      api.get("/api/dashboard/wishlist"),
      api.get("/api/dashboard/alerts"),
      api.get("/api/dashboard/search-history"),
    ])
      .then(([w, a, h]) => {
        setWishlist(w.data);
        setAlerts(a.data);
        setHistory(h.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between py-6 px-4">
        <div>
          <div className="text-xl font-bold text-indigo-900 px-2 mb-8">PriceWise AI</div>
          <nav className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-900 font-medium text-sm">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </div>
            <Link href="/dashboard/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 text-sm hover:bg-gray-50">
              <Heart className="w-4 h-4" />
              Wishlist
            </Link>
            <Link href="/dashboard/alerts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 text-sm hover:bg-gray-50">
              <Bell className="w-4 h-4" />
              Price Alerts
            </Link>
            <Link href="/dashboard/history" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 text-sm hover:bg-gray-50">
              <History className="w-4 h-4" />
              Search History
            </Link>
          </nav>
        </div>
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 text-sm hover:bg-gray-50">
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="w-9 h-9 rounded-full bg-indigo-800 text-white flex items-center justify-center text-sm font-semibold">
  {getInitials(userName)}
</div>
        </div>

        {loading && (
  <div className="animate-pulse">
    <div className="h-5 w-32 bg-gray-100 rounded mb-4" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="h-32 bg-gray-100 rounded-xl mb-3" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 h-48" />
      <div className="bg-white border border-gray-100 rounded-2xl p-6 h-48" />
    </div>
  </div>
)}

        {!loading && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Saved Products</h2>
              <Link href="/dashboard/wishlist" className="text-sm text-indigo-700 font-medium">View All</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {wishlist.length === 0 ? (
                <div className="col-span-full bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
  <Heart className="w-8 h-8 text-gray-300 mx-auto mb-3" />
  <p className="text-sm text-gray-500 mb-1">No saved products yet</p>
  <p className="text-xs text-gray-400 mb-4">Search for something you're eyeing and save it here to track its price.</p>
  <Link href="/" className="inline-block bg-indigo-800 text-white text-sm px-4 py-2 rounded-lg font-medium">Start Searching</Link>
</div>
              ) : (
                wishlist.map((w) => (
                  <Link key={w.id} href={"/search?q=" + encodeURIComponent(w.product.name)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition block">
                    <div className="h-32 bg-gray-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
                      {w.product.image ? (
                        <img src={w.product.image} alt={w.product.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-gray-300 text-xs">no image</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{w.product.name}</h3>
                  </Link>
                ))
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Active Price Alerts</h2>
                <div className="space-y-3">
                  {alerts.length === 0 ? (
                    <div className="text-center py-6">
  <Bell className="w-6 h-6 text-gray-300 mx-auto mb-2" />
  <p className="text-sm text-gray-400">No active alerts yet</p>
</div>
                  ) : (
                    alerts.map((a) => (
                      <Link key={a.id} href={"/search?q=" + encodeURIComponent(a.product.name)} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3 hover:bg-gray-50 block">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{a.product.name}</p>
                          <p className="text-xs text-gray-500">{"Target: $" + a.targetPrice}</p>
                        </div>
                        <span className="bg-indigo-50 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">Tracking</span>
                      </Link>
                    ))
                  )}
                </div>
                <button className="w-full mt-4 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-indigo-800">
                  Add New Alert
                </button>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Recent Searches</h2>
                </div>
                <div className="space-y-1">
                  {history.length === 0 ? (
                   <div className="text-center py-6">
  <Search className="w-6 h-6 text-gray-300 mx-auto mb-2" />
  <p className="text-sm text-gray-400">No searches yet</p>
</div>
                  ) : (
                    history.map((h) => (
                      <Link key={h.id} href={"/search?q=" + encodeURIComponent(h.query)} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <span className="flex items-center gap-3 text-sm text-gray-700">
                          <Search className="w-4 h-4 text-gray-400" />
                          {h.query}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
