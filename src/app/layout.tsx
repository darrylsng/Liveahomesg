import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liveahome.sg – Singapore HDB Property Valuation",
  description:
    "Get an instant, data-driven valuation report for any HDB flat in Singapore. Enter an address or postal code to see estimated market value based on recent resale transactions.",
  keywords: [
    "Singapore property valuation",
    "HDB valuation",
    "HDB resale price",
    "property estimate Singapore",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-700 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M3 12l9-9 9 9v9a1 1 0 01-1 1h-6v-5H9v5H3v-9z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">
                Liveahome
                <span className="text-brand-700">.sg</span>
              </span>
            </a>
            <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
              <a href="/" className="hover:text-brand-700 transition-colors">
                Home
              </a>
              <a
                href="#how-it-works"
                className="hover:text-brand-700 transition-colors"
              >
                How It Works
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-white border-t border-gray-100 py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs text-gray-400 space-y-1">
            <p>
              &copy; {new Date().getFullYear()} Liveahome.sg &mdash; Powered by{" "}
              <a
                href="https://data.gov.sg"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-brand-700"
              >
                data.gov.sg
              </a>{" "}
              (HDB Resale Prices) and{" "}
              <a
                href="https://www.onemap.gov.sg"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-brand-700"
              >
                OneMap
              </a>
              .
            </p>
            <p>
              Valuations are indicative estimates only and should not be relied
              upon as formal property valuations.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
