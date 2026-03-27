import { NextRequest, NextResponse } from "next/server";
import { searchAddress } from "@/lib/onemap";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchAddress(q.trim());
    // Deduplicate by postal code and return top 8
    const seen = new Set<string>();
    const deduped = results.filter((r) => {
      if (!r.POSTAL || seen.has(r.POSTAL)) return false;
      seen.add(r.POSTAL);
      return true;
    });

    return NextResponse.json({ results: deduped.slice(0, 8) });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: "Address search failed. Please try again." },
      { status: 500 }
    );
  }
}
