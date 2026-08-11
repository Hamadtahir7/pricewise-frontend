import { Search, Bell, Cpu, TrendingUp, Heart, ShieldCheck } from "lucide-react";

const FEATURES = [
  { icon: Search, title: "Smart Search", desc: "Search any product by name and instantly compare prices across multiple stores." },
  { icon: Cpu, title: "AI-Powered Alternatives", desc: "Get similar products with better value, ranked by similarity and savings." },
  { icon: TrendingUp, title: "Price History", desc: "See how a product's price has moved over time before you decide to buy." },
  { icon: Bell, title: "Price Alerts", desc: "Set a target price and get notified the moment it drops." },
  { icon: Heart, title: "Wishlist", desc: "Save products you're watching and track them all in one dashboard." },
  { icon: ShieldCheck, title: "Verified Pricing", desc: "Prices pulled from real store listings, so you always see accurate, current data." },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-4 text-center">Features</h1>
        <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          Everything PriceWise AI does to help you find the best deal, in one place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-indigo-800" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
