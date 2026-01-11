import { NextResponse } from "next/server";
import { getCardsCollection } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(id: string) {
  try {
    const coll = await getCardsCollection();
    const doc = await coll.find().toArray();
    return NextResponse.json({ data: doc || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const coll = await getCardsCollection();
    const update = {
      $set: {
        ...body,
        updatedAt: new Date(),
      },
    };
    await coll.updateOne({ _id: new ObjectId() }, update, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
