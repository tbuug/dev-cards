import { NextResponse } from "next/server";
import { getDecksCollection, getCardsCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type IncomingCard = {
  front?: string;
  back?: string;
  time?: string | number | null;
  [k: string]: any;
};

type IncomingDeck = {
  name?: string;
  description?: string;
  cards?: IncomingCard[];
  [k: string]: any;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const decksPayload: IncomingDeck[] = Array.isArray(body)
      ? body
      : Array.isArray(body?.decks)
      ? body.decks
      : [];

    if (!decksPayload.length) {
      return NextResponse.json({ error: "No decks found in payload" }, { status: 400 });
    }

    const decksCol = await getDecksCollection();
    const cardsCol = await getCardsCollection();

    let decksCreated = 0;
    let cardsCreated = 0;
    const details: Array<{ deckName: string; deckId: string; cardsInserted: number }> = [];

    for (const d of decksPayload) {
      const deckDoc: any = {
        name: d.name ?? "Untitled",
        description: d.description ?? null,
        createdAt: new Date(),
      };

      const deckInsert = await decksCol.insertOne(deckDoc);
      decksCreated++;
      const deckId = deckInsert.insertedId as ObjectId;

      const cards = Array.isArray(d.cards) ? d.cards : [];
      if (cards.length) {
        const cardDocs = cards.map((c) => ({
          deckId,
          front: c.front ?? "",
          back: c.back ?? "",
          time: c.time ?? null,
          createdAt: new Date(),
        }));
        const r = await cardsCol.insertMany(cardDocs);
        cardsCreated += r.insertedCount ?? Object.keys(r.insertedIds || {}).length;
        details.push({ deckName: deckDoc.name, deckId: deckId.toString(), cardsInserted: r.insertedCount ?? 0 });
      } else {
        details.push({ deckName: deckDoc.name, deckId: deckId.toString(), cardsInserted: 0 });
      }
    }

    return NextResponse.json({ decksCreated, cardsCreated, details }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
