import { getDecksCollection } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

type Props = {
  params: { id: string };
};

export default async function DeckDetailPage({ params }: Props) {
  const { id } = await params;
  let deck: any = null;

  try {
    const coll = await getDecksCollection();
    deck = await coll.findOne({ _id: new ObjectId(id) });
  } catch (err) {
    console.error(err);
  }

  if (!deck) {
    return <div className="main-container p-6">Deck not found.</div>;
  }

  return (
    <div className="main-container p-6">
      <h1 className="text-xl font-bold mb-2">{deck.name ?? "Untitled"}</h1>
      <div className="text-sm text-muted-foreground mb-4">ID: {deck._id.toString()}</div>
      <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">{JSON.stringify(deck, null, 2)}</pre>
    </div>
  );
}
