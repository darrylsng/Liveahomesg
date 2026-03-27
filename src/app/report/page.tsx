import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ValuationReport from "@/components/ValuationReport";
import SearchBar from "@/components/SearchBar";

interface PageProps {
  searchParams: { postal?: string };
}

async function fetchValuation(postal: string) {
  // Build the absolute URL for the API (required in server components)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/valuation?postal=${postal}`, {
    next: { revalidate: 1800 }, // cache 30 min
  });

  if (res.status === 404) return null;

  const data = await res.json();
  return data;
}

async function ReportContent({ postal }: { postal: string }) {
  const data = await fetchValuation(postal);

  if (!data) {
    notFound();
  }

  if (data.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="font-semibold text-red-800 text-lg mb-2">
          Unable to Load Valuation
        </h3>
        <p className="text-red-600 text-sm">{data.error}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-brand-700 underline hover:no-underline"
        >
          Try another address
        </Link>
      </div>
    );
  }

  return (
    <ValuationReport
      address={data.address}
      valuation={data.valuation}
      isHDB={data.isHDB}
      message={data.message}
    />
  );
}

function ReportSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-20" />
          ))}
        </div>
      </div>
      <div className="bg-gray-200 rounded-2xl h-48" />
      <div className="bg-gray-200 rounded-2xl h-64" />
      <div className="bg-gray-200 rounded-2xl h-72" />
    </div>
  );
}

export default function ReportPage({ searchParams }: PageProps) {
  const postal = searchParams.postal;

  if (!postal || !/^\d{6}$/.test(postal)) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Invalid Postal Code
        </h1>
        <p className="text-gray-500 mb-6">
          Please enter a valid 6-digit Singapore postal code.
        </p>
        <Link href="/" className="text-brand-700 underline hover:no-underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Search bar at top */}
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Address breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          Postal Code {postal}
        </span>
      </div>

      <Suspense fallback={<ReportSkeleton />}>
        <ReportContent postal={postal} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ searchParams }: PageProps) {
  const postal = searchParams.postal;
  return {
    title: postal
      ? `Valuation Report – Singapore ${postal} | Liveahome.sg`
      : "Valuation Report | Liveahome.sg",
  };
}
