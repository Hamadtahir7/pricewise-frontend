import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold text-indigo-900 mb-4">Pricing</h1>
        <p className="text-gray-500 mb-10">PriceWise AI is free to use, always.</p>

        <div className="border border-gray-100 rounded-2xl p-8 shadow-sm text-left">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Free</h2>
          <p className="text-3xl font-bold text-emerald-700 mb-6">$0<span className="text-sm text-gray-400 font-normal"> / forever</span></p>

          <ul className="space-y-3 mb-6">
            {["Unlimited searches", "Price comparisons across stores", "AI-powered alternatives", "Wishlist and price alerts", "Price history tracking"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-emerald-600" />
                {f}
              </li>
            ))}
          </ul>

          <Link href="/login" className="block text-center bg-indigo-800 hover:bg-indigo-900 text-white rounded-lg py-2.5 text-sm font-medium">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
