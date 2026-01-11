import { NextResponse } from "next/server";
import { getDecksCollection } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = resolved.id;
    const coll = await getDecksCollection();
    const doc = await coll.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ data: doc || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
