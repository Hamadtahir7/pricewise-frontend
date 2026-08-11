const STEPS = [
  { step: "1", title: "Search a product", desc: "Type the name of anything you want to buy." },
  { step: "2", title: "See real prices", desc: "PriceWise AI pulls live listings from multiple stores and shows you the lowest price first." },
  { step: "3", title: "Compare alternatives", desc: "Our AI finds similar products that could save you even more." },
  { step: "4", title: "Save or get alerted", desc: "Add it to your wishlist or set a target price and we'll notify you when it drops." },
  { step: "5", title: "Buy with confidence", desc: "Click through to the store and complete your purchase, knowing you got the best deal." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-4 text-center">How It Works</h1>
        <p className="text-gray-500 text-center mb-12">
          From search to savings in five simple steps.
        </p>

        <div className="space-y-6">
          {STEPS.map((s) => (
            <div key={s.step} className="flex gap-4 border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-indigo-800 text-white flex items-center justify-center font-semibold shrink-0">
                {s.step}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
