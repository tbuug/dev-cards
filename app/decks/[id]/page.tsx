import FoolPracticeButton from "@/components/FoolPracticeButton";
import { getCardsCollection, getDecksCollection } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

type Props = {
  params: { id: string };
};

export default async function DeckDetailPage({ params }: Props) {
  const { id } = await params;
  let deck: any = null;
  let cards: any[] = [];

  try {
    const coll = await getDecksCollection();
    deck = await coll.findOne({ _id: new ObjectId(id) });
  } catch (err) {
    console.error(err);
  }

//   try {
//     const coll = await getCardsCollection();
//     cards = await coll.find({ deckId: new ObjectId(id) }).toArray();
//   } catch (err) {
//     console.error(err);
//   }

  if (!deck) {
    return <div className="main-container p-6">Deck not found.</div>;
  }

  return (
    <div className="main-container p-6">
      <h1 className="text-xl font-bold mb-2">{deck.name ?? "Untitled"}</h1>
      <div className="text-sm text-muted-foreground mb-4">ID: {deck._id.toString()}</div>
    <FoolPracticeButton deckId={deck._id.toString()}/>

      
    </div>
  );
}
