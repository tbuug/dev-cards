import { NextResponse } from "next/server";
import { getSettingsCollection } from "../../../lib/mongodb";

export async function GET() {
  try {
    const coll = await getSettingsCollection();
    const doc = await coll.findOne({ _id: "singleton" });
    return NextResponse.json({ data: doc || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const coll = await getSettingsCollection();
    const update = {
      $set: {
        ...body,
        updatedAt: new Date(),
      },
    };
    await coll.updateOne({ _id: "singleton" }, update, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
