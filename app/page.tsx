"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic } from "lucide-react";
import { api } from "@/lib/api";

const CATEGORIES = ["Electronics", "Fashion", "Groceries", "Gaming", "Home Appliances"];

interface Deal {
  title: string;
  price: number;
  thumbnail: string;
  source: string;
  link: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/products/trending")
      .then((res) => setDeals(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push("/search?q=" + encodeURIComponent(query));
  };

  const handleCategoryClick = (category: string) => {
    router.push("/search?q=" + encodeURIComponent(category));
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto text-center px-6 pt-20 pb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 leading-tight">
          Compare Prices with AI Precision
        </h1>
        <p className="text-gray-500 mt-4 text-lg">
          Experience effortless clarity in your shopping. Let our AI synthesize the best deals across the web, ensuring you never overpay.
        </p>

        <div className="mt-8 flex items-center bg-white border border-gray-200 rounded-full shadow-md px-5 py-4">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder="Search any product..."
            className="flex-1 outline-none text-sm placeholder:text-gray-400"
          />
          <Mic className="w-5 h-5 text-gray-400 ml-3 cursor-pointer" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-sm px-4 py-2 rounded-full transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Trending Deals</h2>
        </div>

        {loading && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="h-40 bg-gray-100" />
        <div className="p-4">
          <div className="h-4 bg-gray-100 rounded w-full mb-2" />
          <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
          <div className="h-8 bg-gray-100 rounded" />
        </div>
      </div>
    ))}
  </div>
)}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative bg-gray-50 h-40 flex items-center justify-center">
                <img src={deal.thumbnail} alt={deal.title} className="w-full h-full object-contain" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{deal.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-indigo-900 font-bold">{"$" + deal.price.toFixed(2)}</span>
                </div>
<a href={deal.link} target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-indigo-900 text-white text-sm py-2 rounded-lg font-medium">View Deal</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-indigo-50 border-t-4 border-indigo-800">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-bold text-indigo-900">PriceWise AI</div>
            <div className="text-xs text-gray-500">(c) 2026 PriceWise AI. Precision financial empowerment.</div>
          </div>
          <div className="flex gap-6 text-sm text-gray-600 underline">
            <a href="#">About</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
