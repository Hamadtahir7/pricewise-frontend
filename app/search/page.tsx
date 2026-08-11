"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Star, ShieldCheck, Cpu, Heart, Bell } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";

interface ProductResult {
  title: string;
  price: number | null;
  source: string;
  link: string;
  thumbnail: string;
  rating: number | null;
  delivery: string | null;
}

interface Alternative {
  title: string;
  price: number;
  thumbnail: string;
  link: string;
  similarity: number;
  savings: number;
}

interface HistoryPoint {
  price: number;
  recordedAt: string;
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [altLoading, setAltLoading] = useState(false);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!initialQuery) return;
    setLoading(true);
    setError("");
    api.get("/api/search", { params: { q: initialQuery } })
      .then((res) => setResults(res.data.results || []))
      .catch(() => setError("Could not load results. Try again."))
      .finally(() => setLoading(false));
  }, [initialQuery]);

  const validResults = results.filter(function (r) { return r.price !== null; });
  const sorted = [...validResults].sort(function (a, b) { return (a.price ?? 0) - (b.price ?? 0); });
  const best = sorted[0];
  const others = sorted.slice(1);

 useEffect(() => {
  if (!best) return;

  setAltLoading(true);
  api.get("/api/products/alternatives", { params: { title: best.title, price: best.price } })
    .then((res) => setAlternatives(res.data))
    .catch(() => setAlternatives([]))
    .finally(() => setAltLoading(false));

  api.get("/api/products/price-history", { params: { name: best.title } })
    .then((res) => setHistory(res.data))
    .catch(() => setHistory([]));

  api.get("/api/dashboard/wishlist")
    .then((res) => {
      const alreadySaved = res.data.some((item: any) => item.product.name === best.title);
      setIsSaved(alreadySaved);
    })
    .catch(() => setIsSaved(false));
}, [best?.title]);

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push("/search?q=" + encodeURIComponent(query));
  };

  const ensureProductExists = async () => {
    const res = await api.post("/api/products/find-or-create", {
      name: best.title,
      image: best.thumbnail,
      category: "general",
    });
    return res.data.id as string;
  };

 const handleAddToWishlist = async () => {
  try {
    const productId = await ensureProductExists();
    await api.post("/api/dashboard/wishlist", { productId });
    setIsSaved(true);
    setSavedMsg("Added to wishlist");
    setTimeout(() => setSavedMsg(""), 2500);
  } catch {
    setSavedMsg("Please log in to save items");
    setTimeout(() => setSavedMsg(""), 2500);
  }
};
  const handleSetAlert = async () => {
    if (!targetPrice) return;
    try {
      const productId = await ensureProductExists();
      await api.post("/api/dashboard/alerts", { productId, targetPrice: parseFloat(targetPrice) });
      setSavedMsg("Price alert set");
      setShowAlertForm(false);
      setTargetPrice("");
      setTimeout(() => setSavedMsg(""), 2500);
    } catch {
      setSavedMsg("Please log in to set alerts");
      setTimeout(() => setSavedMsg(""), 2500);
    }
  };

  const chartData = history.length > 0
    ? history.map((h) => ({ label: new Date(h.recordedAt).toLocaleDateString(), price: h.price }))
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm px-5 py-3 mb-4">
          <Search className="w-4 h-4 text-gray-400 mr-3" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }} className="flex-1 outline-none text-sm" />
          <button onClick={handleSearch} className="bg-indigo-800 text-white rounded-full w-8 h-8 flex items-center justify-center">{"->"}</button>
        </div>

        {savedMsg && <div className="bg-emerald-50 text-emerald-800 text-sm px-4 py-2 rounded-lg mb-4 inline-block">{savedMsg}</div>}

        {loading && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
    <div className="lg:col-span-2 space-y-6">
      <div className="border border-gray-100 rounded-2xl p-6">
        <div className="h-5 w-24 bg-gray-100 rounded-full mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-56 bg-gray-100 rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-6 w-full bg-gray-100 rounded" />
            <div className="h-24 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="border border-gray-100 rounded-2xl p-6">
        <div className="h-5 w-32 bg-gray-100 rounded mb-4" />
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    </div>
    <div className="border border-gray-100 rounded-2xl p-6">
      <div className="h-5 w-40 bg-gray-100 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-16 bg-gray-100 rounded-xl" />
        <div className="h-16 bg-gray-100 rounded-xl" />
        <div className="h-16 bg-gray-100 rounded-xl" />
      </div>
    </div>
  </div>
)}
       {error && (
  <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
    <p className="text-sm text-red-600 mb-2">{error}</p>
    <button onClick={() => handleSearch()} className="text-sm font-medium text-red-700 underline">Try again</button>
  </div>
)}

        {!loading && !error && best && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full mb-4">
                  <Cpu className="w-3 h-3" />
                  AI Top Pick
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <img src={best.thumbnail} alt={best.title} className="w-full h-56 object-contain bg-gray-50 rounded-xl" />

                  <div>
                    {best.rating ? (
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={i <= Math.round(best.rating as number) ? "w-4 h-4 fill-amber-400 text-amber-400" : "w-4 h-4 text-gray-300"} />
                        ))}
                      </div>
                    ) : null}

                    <div className="flex items-start justify-between">
                      <h1 className="text-2xl font-bold text-gray-900 mb-3">{best.title}</h1>
                     <button onClick={handleAddToWishlist} className="border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shrink-0 ml-3">
  <Heart className={isSaved ? "w-4 h-4 fill-red-500 text-red-500" : "w-4 h-4 text-gray-500"} />
</button>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Lowest Available Price</p>
                      <p className="text-3xl font-bold text-emerald-700 mt-1">{"$" + (best.price as number).toFixed(2)}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        {"Available at " + best.source}
                      </p>
                      <a href={best.link} target="_blank" rel="noopener noreferrer" className="block text-center bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg py-2.5 mt-4">Buy Now</a>

                      {!showAlertForm ? (
                        <button onClick={() => setShowAlertForm(true)} className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 mt-2 text-sm font-medium text-indigo-800">
                          <Bell className="w-4 h-4" /> Set Price Alert
                        </button>
                      ) : (
                        <div className="mt-3 flex gap-2">
                          <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} placeholder="Target price" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
                          <button onClick={handleSetAlert} className="bg-indigo-800 text-white text-sm px-4 py-2 rounded-lg">Save</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Price History</h2>
                {chartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                      <Line type="monotone" dataKey="price" stroke="#3730a3" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-gray-400">
                    Not enough history yet for this product. Save it to your wishlist or set a price alert so PriceWise AI starts tracking it.
                  </p>
                )}
              </div>

              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Compare Retailers</h2>
                <div className="space-y-3">
                  {others.slice(0, 8).map((r, i) => (
                    <a key={i} href={r.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3 hover:bg-gray-50">
                      <span className="text-sm text-gray-700">{r.source}</span>
                      <span className="text-sm text-gray-500">{r.delivery || "-"}</span>
                      <span className="font-semibold text-gray-900">{"$" + (r.price as number).toFixed(2)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                <Cpu className="w-5 h-5 text-indigo-800" />
                AI-Powered Alternatives
              </h2>

              {altLoading && <p className="text-sm text-gray-400">Finding alternatives...</p>}

              {!altLoading && alternatives.length === 0 && (
                <p className="text-sm text-gray-400">No close alternatives found for this product yet.</p>
              )}

              <div className="space-y-4">
                {alternatives.map((alt, i) => (
                  <a key={i} href={alt.link} target="_blank" rel="noopener noreferrer" className="flex gap-3 border border-gray-100 rounded-xl p-3 hover:bg-gray-50">
                    <img src={alt.thumbnail} alt={alt.title} className="w-14 h-14 object-contain bg-gray-50 rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{alt.title}</p>
                      <span className="inline-block bg-indigo-50 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                        {alt.similarity + "% similar"}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-gray-900 text-sm">{"$" + alt.price.toFixed(2)}</span>
                        {alt.savings > 0 && (
                          <span className="text-emerald-700 text-xs font-medium">{"Save $" + alt.savings.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-gray-500">Loading...</p>}>
      <SearchResultsContent />
    </Suspense>
  );
}
