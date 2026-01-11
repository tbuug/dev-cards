import { NextResponse } from "next/server";
import { getCardsCollection } from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = resolved.id;
    const body = await request.json();
    const cardsColl = await getCardsCollection();
    const card = {
      deckId: new ObjectId(id),
      front: body.front,
      back: body.back,
      time: body.time ? new Date(body.time) : new Date(),
      createdAt: new Date(),
    };
    const result = await cardsColl.insertOne(card);
    return NextResponse.json({ ok: true, insertedId: result.insertedId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
