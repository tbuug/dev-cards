import { getCardsCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import CardViewer from '../../../components/CardViewer';

interface Card {
    _id: string;
    front: string;
    back: string;
}

export default async function FoolDeckPage({ params }: { params: Promise<{ id: string }> }) {
    const resolved = await params;
    const deckId = resolved.id;

    try {
        const coll = await getCardsCollection();
        const rawCards = await coll.find({ deckId: new ObjectId(deckId) }).toArray();
        const shuffledCards = [...rawCards].sort(() => Math.random() - 0.5);
        const cards: Card[] = shuffledCards.map(card => ({
            _id: card._id.toString(),
            front: card.front,
            back: card.back,
        }));

        return (
            <div>
                <CardViewer cards={cards} />
            </div>
        );
    } catch (error) {
        return (
            <div>
                <h1>Error loading deck</h1>
                <p>{(error as Error).message}</p>
            </div>
        );
    }
}