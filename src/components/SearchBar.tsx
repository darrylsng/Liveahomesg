"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        );
        const data = await res.json();
        setSuggestions(data.results ?? []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setQuery(result.ADDRESS);
    setOpen(false);
    if (result.POSTAL) {
      router.push(`/report?postal=${result.POSTAL}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If query looks like a postal code
    const postalMatch = query.trim().match(/^\d{6}$/);
    if (postalMatch) {
      router.push(`/report?postal=${postalMatch[0]}`);
      return;
    }
    // Otherwise use the first suggestion
    if (suggestions.length > 0 && suggestions[0].POSTAL) {
      router.push(`/report?postal=${suggestions[0].POSTAL}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Enter address or 6-digit postal code…"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent text-base"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap"
        >
          Get Valuation
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-3 hover:bg-brand-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="font-medium text-gray-900 text-sm">
                  {r.BLK_NO && `Blk ${r.BLK_NO} `}
                  {r.ROAD_NAME}
                  {r.BUILDING && r.BUILDING !== "NIL" && ` (${r.BUILDING})`}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Singapore {r.POSTAL}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
