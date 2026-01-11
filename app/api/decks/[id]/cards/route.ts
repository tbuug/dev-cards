import { NextResponse } from "next/server";
import { getCardsCollection } from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = resolved.id;
    const body = await request.json();
    const cardsColl = await getCardsCollection();
    // Support bulk import: accept { cards: [...] } or a single card body
    if (Array.isArray(body?.cards)) {
      const cardDocs = body.cards.map((c: any) => ({
        deckId: new ObjectId(id),
        front: c.front ?? "",
        back: c.back ?? "",
        time: c.time ? new Date(c.time) : new Date(),
        createdAt: new Date(),
      }));
      const result = await cardsColl.insertMany(cardDocs);
      return NextResponse.json({ ok: true, insertedCount: result.insertedCount, insertedIds: result.insertedIds });
    }

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
