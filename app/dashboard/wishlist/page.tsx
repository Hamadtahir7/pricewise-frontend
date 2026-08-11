"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { api } from "@/lib/api";

interface WishlistItem {
  id: string;
  product: { id: string; name: string; image: string | null };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/dashboard/wishlist").then((res) => setItems(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-indigo-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h1>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {!loading && items.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
          <Heart className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No saved products yet.</p>
          <Link href="/" className="text-sm text-indigo-700 font-medium mt-2 inline-block">Start searching</Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <Link key={item.id} href={"/search?q=" + encodeURIComponent(item.product.name)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition block">
            <div className="h-32 bg-gray-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
              {item.product.image ? (
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-gray-300 text-xs">no image</span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{item.product.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
