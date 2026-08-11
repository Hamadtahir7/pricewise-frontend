"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { api } from "@/lib/api";

interface AlertItem {
  id: string;
  targetPrice: number;
  status: string;
  product: { id: string; name: string };
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/dashboard/alerts").then((res) => setAlerts(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-indigo-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Price Alerts</h1>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {!loading && alerts.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No active alerts yet.</p>
          <Link href="/" className="text-sm text-indigo-700 font-medium mt-2 inline-block">Search a product to set one</Link>
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((a) => (
          <Link key={a.id} href={"/search?q=" + encodeURIComponent(a.product.name)} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm hover:shadow-md transition block">
            <div>
              <p className="text-sm font-semibold text-gray-900">{a.product.name}</p>
              <p className="text-xs text-gray-500">{"Target price: $" + a.targetPrice}</p>
            </div>
            <span className="bg-indigo-50 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">{a.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
