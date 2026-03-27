import { NextRequest, NextResponse } from "next/server";
import { lookupPostalCode, isLikelyHDB } from "@/lib/onemap";
import {
  fetchTransactionsByStreet,
  fetchTransactionsByTown,
  inferTownFromStreet,
} from "@/lib/hdb-data";
import { computeValuation } from "@/lib/valuation";

export async function GET(request: NextRequest) {
  const postal = request.nextUrl.searchParams.get("postal");

  if (!postal || !/^\d{6}$/.test(postal)) {
    return NextResponse.json(
      { error: "Please provide a valid 6-digit Singapore postal code." },
      { status: 400 }
    );
  }

  try {
    // 1. Resolve postal code to address via OneMap
    const address = await lookupPostalCode(postal);

    if (!address) {
      return NextResponse.json(
        { error: "Address not found. Please check the postal code." },
        { status: 404 }
      );
    }

    // 2. Check if this is likely HDB
    if (!isLikelyHDB(address)) {
      return NextResponse.json({
        address,
        isHDB: false,
        valuation: null,
        message:
          "This address appears to be a private property. HDB valuation data is not available for private properties at this time.",
      });
    }

    // 3. Fetch HDB resale transactions for this block/street
    let transactions = await fetchTransactionsByStreet(
      address.ROAD_NAME,
      address.BLK_NO
    );

    // 4. If fewer than 10 transactions for this block, widen to entire street
    if (transactions.length < 10) {
      const streetTx = await fetchTransactionsByStreet(address.ROAD_NAME);
      transactions = streetTx;
    }

    // 5. If still fewer than 10 transactions, widen to town
    if (transactions.length < 10) {
      const town = inferTownFromStreet(address.ROAD_NAME);
      if (town) {
        const townTx = await fetchTransactionsByTown(town);
        transactions = townTx;
      }
    }

    // 6. Compute valuation
    const valuation = computeValuation(transactions);

    return NextResponse.json({
      address,
      isHDB: true,
      valuation,
      message: null,
    });
  } catch (err) {
    console.error("Valuation error:", err);
    return NextResponse.json(
      {
        error:
          "Unable to retrieve valuation data. The property data service may be temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
