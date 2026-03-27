export interface OneMapResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

interface OneMapResponse {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: OneMapResult[];
}

const ONEMAP_BASE = "https://www.onemap.gov.sg/api/common/elastic/search";

export async function searchAddress(query: string): Promise<OneMapResult[]> {
  if (!query || query.trim().length < 3) return [];

  const params = new URLSearchParams({
    searchVal: query.trim(),
    returnGeom: "Y",
    getAddrDetails: "Y",
    pageNum: "1",
  });

  const res = await fetch(`${ONEMAP_BASE}?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`OneMap API error: ${res.status}`);
  }

  const data: OneMapResponse = await res.json();
  return data.results ?? [];
}

export async function lookupPostalCode(
  postalCode: string
): Promise<OneMapResult | null> {
  const results = await searchAddress(postalCode);
  // Return first result that matches the postal code exactly
  const exact = results.find((r) => r.POSTAL === postalCode);
  return exact ?? results[0] ?? null;
}

/** Determine whether an address is likely an HDB flat based on block/building info */
export function isLikelyHDB(result: OneMapResult): boolean {
  const building = result.BUILDING?.toUpperCase() ?? "";
  const blk = result.BLK_NO ?? "";

  // Private condo/apartment buildings usually have a proper building name
  const privateKeywords = [
    "CONDOMINIUM",
    "RESIDENCES",
    "SUITES",
    "TOWERS",
    "HEIGHTS",
    "COURT",
    "GARDENS",
    "LODGE",
    "MANSION",
    "VILLA",
    "TERRACE",
    "WALK",
    "GROVE",
    "HILL",
    "VALE",
    "CREST",
    "RIDGE",
    "VIEW",
  ];

  if (
    building &&
    building !== "NIL" &&
    privateKeywords.some((kw) => building.includes(kw))
  ) {
    return false;
  }

  // HDB blocks are purely numeric or numeric with a letter (e.g. "123A")
  if (/^\d+[A-Z]?$/.test(blk)) {
    return true;
  }

  return true; // default to HDB for unknown
}
