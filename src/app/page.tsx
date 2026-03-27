import SearchBar from "@/components/SearchBar";

const POPULAR_SEARCHES = [
  { label: "Tampines Ave 4", postal: "520804" },
  { label: "Ang Mo Kio Ave 3", postal: "560101" },
  { label: "Woodlands Ave 6", postal: "730601" },
  { label: "Jurong West St 52", postal: "640501" },
  { label: "Punggol Drive", postal: "828764" },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Enter Address or Postal Code",
    description:
      "Type any Singapore HDB address or 6-digit postal code into the search bar.",
  },
  {
    step: "2",
    title: "We Fetch Real Transaction Data",
    description:
      "We query the official HDB Resale Flat Prices dataset from data.gov.sg for recent comparable transactions in the area.",
  },
  {
    step: "3",
    title: "Receive Your Valuation Report",
    description:
      "Get an instant estimated market value range, price-per-m² breakdown, trend chart, and a table of comparable transactions.",
  },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2 2H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
      </svg>
    ),
    title: "Official Government Data",
    description:
      "Valuations are based on the HDB Resale Flat Prices dataset published by the Housing & Development Board on data.gov.sg.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>
    ),
    title: "Comparable Sales Method",
    description:
      "We use the industry-standard comparable sales approach — median price per m² from recent transactions applied to your flat's floor area.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6.1-4.72 7.72L13 17.71v4.04l.71-.4C17.62 19.66 21 15.05 21 12c0-5.18-3.94-9.45-9-9.95zM11 2.05C5.95 2.55 2 6.82 2 12c0 3.05 3.38 7.66 7.29 9.35L11 21.75V2.05zm-2 15.6C6.37 16.52 4 14.36 4 12c0-3.39 2.44-6.26 5.71-6.91l-.71 12.56z" />
      </svg>
    ),
    title: "Instant & Free",
    description:
      "No registration required. Get your valuation report in seconds, completely free of charge.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
    title: "Detailed Transaction History",
    description:
      "Browse the full list of recent resale transactions in your area, including storey range, floor area, and price per m².",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
            Singapore HDB Valuation
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            What Is Your HDB Flat Worth?
          </h1>
          <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
            Get an instant, data-driven valuation report based on official HDB
            resale transaction data. Enter your address or postal code below.
          </p>

          <SearchBar />

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="text-brand-200 text-xs mr-1">Try:</span>
            {POPULAR_SEARCHES.map((s) => (
              <a
                key={s.postal}
                href={`/report?postal=${s.postal}`}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Why Use Liveahome.sg?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-brand-200 hover:bg-brand-50 transition-colors"
              >
                <div className="text-brand-700 mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            How It Works
          </h2>
          <div className="space-y-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-700 text-white font-bold text-lg flex items-center justify-center shadow">
                  {step.step}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> Valuations provided by Liveahome.sg
            are indicative estimates based on publicly available HDB resale
            transaction data. They do not constitute a formal property valuation
            by a licensed valuer. Actual transaction prices may differ
            materially. Please engage a licensed property valuer for formal
            valuations required for financial, legal, or mortgage purposes.
          </div>
        </div>
      </section>
    </>
  );
}
