export interface HDBTransaction {
  month: string; // "2024-03"
  town: string;
  flat_type: string; // "4 ROOM"
  block: string;
  street_name: string;
  storey_range: string; // "04 TO 06"
  floor_area_sqm: string;
  flat_model: string;
  lease_commence_date: string;
  remaining_lease: string;
  resale_price: string;
}

interface CKANResponse {
  success: boolean;
  result: {
    total: number;
    records: HDBTransaction[];
  };
}

// HDB Resale Flat Prices – Jan 2017 to present
// Source: https://data.gov.sg/dataset/resale-flat-prices
// NOTE: If this resource_id returns no results, check data.gov.sg for the latest ID.
const RESOURCE_ID = "f1765b54-a209-4718-8d38-a39237f502b3";
const CKAN_API = "https://data.gov.sg/api/action/datastore_search";

export async function fetchTransactionsByStreet(
  streetName: string,
  block?: string,
  limit = 200
): Promise<HDBTransaction[]> {
  // Normalise street name to uppercase to match the dataset
  const street = streetName.toUpperCase().trim();

  const filters: Record<string, string> = { street_name: street };
  if (block) filters.block = block.toUpperCase().trim();

  const params = new URLSearchParams({
    resource_id: RESOURCE_ID,
    filters: JSON.stringify(filters),
    limit: String(limit),
    sort: "month desc",
  });

  const res = await fetch(`${CKAN_API}?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`data.gov.sg API error: ${res.status}`);
  }

  const data: CKANResponse = await res.json();

  if (!data.success) {
    throw new Error("data.gov.sg returned success=false");
  }

  return data.result.records ?? [];
}

export async function fetchTransactionsByTown(
  town: string,
  flatType?: string,
  limit = 500
): Promise<HDBTransaction[]> {
  const filters: Record<string, string> = { town: town.toUpperCase().trim() };
  if (flatType) filters.flat_type = flatType.toUpperCase().trim();

  const params = new URLSearchParams({
    resource_id: RESOURCE_ID,
    filters: JSON.stringify(filters),
    limit: String(limit),
    sort: "month desc",
  });

  const res = await fetch(`${CKAN_API}?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`data.gov.sg API error: ${res.status}`);
  }

  const data: CKANResponse = await res.json();

  if (!data.success) {
    throw new Error("data.gov.sg returned success=false");
  }

  return data.result.records ?? [];
}

/** Filter transactions to the last N months from the most recent record */
export function filterRecentTransactions(
  transactions: HDBTransaction[],
  months = 24
): HDBTransaction[] {
  if (transactions.length === 0) return [];

  // Find most recent month in dataset
  const sortedMonths = transactions
    .map((t) => t.month)
    .sort()
    .reverse();
  const latestMonth = sortedMonths[0]; // e.g. "2024-11"

  const [yr, mo] = latestMonth.split("-").map(Number);
  const cutoff = new Date(yr, mo - 1 - months, 1);

  return transactions.filter((t) => {
    const [y, m] = t.month.split("-").map(Number);
    return new Date(y, m - 1, 1) >= cutoff;
  });
}

/** Extract the mid-storey from a range like "04 TO 06" */
export function storeyMidpoint(storeyRange: string): number {
  const match = storeyRange.match(/(\d+)\s+TO\s+(\d+)/i);
  if (match) {
    return (parseInt(match[1]) + parseInt(match[2])) / 2;
  }
  return 5;
}

/** Map a street name to an HDB town (best-effort) */
export function inferTownFromStreet(streetName: string): string | null {
  const s = streetName.toUpperCase();

  const prefixMap: [string, string][] = [
    ["ANG MO KIO", "ANG MO KIO"],
    ["BEDOK", "BEDOK"],
    ["BISHAN", "BISHAN"],
    ["BUKIT BATOK", "BUKIT BATOK"],
    ["BUKIT MERAH", "BUKIT MERAH"],
    ["BUKIT PANJANG", "BUKIT PANJANG"],
    ["BUKIT TIMAH", "BUKIT TIMAH"],
    ["CHOA CHU KANG", "CHOA CHU KANG"],
    ["CLEMENTI", "CLEMENTI"],
    ["GEYLANG", "GEYLANG"],
    ["HOUGANG", "HOUGANG"],
    ["JURONG EAST", "JURONG EAST"],
    ["JURONG WEST", "JURONG WEST"],
    ["KALLANG", "KALLANG/WHAMPOA"],
    ["WHAMPOA", "KALLANG/WHAMPOA"],
    ["MARINE PARADE", "MARINE PARADE"],
    ["PASIR RIS", "PASIR RIS"],
    ["PUNGGOL", "PUNGGOL"],
    ["QUEENSTOWN", "QUEENSTOWN"],
    ["QUEENSWAY", "QUEENSTOWN"],
    ["SEMBAWANG", "SEMBAWANG"],
    ["SENGKANG", "SENGKANG"],
    ["SERANGOON", "SERANGOON"],
    ["TAMPINES", "TAMPINES"],
    ["TOA PAYOH", "TOA PAYOH"],
    ["WOODLANDS", "WOODLANDS"],
    ["YISHUN", "YISHUN"],
    ["COMMONWEALTH", "QUEENSTOWN"],
    ["DOVER", "QUEENSTOWN"],
    ["TELOK BLANGAH", "BUKIT MERAH"],
    ["HENDERSON", "BUKIT MERAH"],
    ["REDHILL", "BUKIT MERAH"],
    ["TECK WHYE", "CHOA CHU KANG"],
    ["YUNG SHING", "CHOA CHU KANG"],
    ["PANDAN", "JURONG EAST"],
    ["CHINESE GARDEN", "JURONG EAST"],
    ["BOON LAY", "JURONG WEST"],
    ["YUAN CHING", "JURONG WEST"],
    ["TAMAN JURONG", "JURONG WEST"],
    ["PASIR PANJANG", "CLEMENTI"],
    ["WEST COAST", "CLEMENTI"],
  ];

  for (const [prefix, town] of prefixMap) {
    if (s.includes(prefix)) return town;
  }

  return null;
}
