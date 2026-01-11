"use client";

import { Button } from "@/components/ui/button";

export default function DeckBackButton({ label = "Fool Review", deckId}: { label?: string , deckId: string }) {
  return (
    <Button variant="outline" size="sm" className="mb-4" onClick={() => window.location.href = `/decks/fool/${deckId}`}>
      {label}
    </Button>
  );
}