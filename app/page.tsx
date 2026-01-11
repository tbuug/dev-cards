"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type DeckItem = {
  _id?: string;
  name?: string;
  [k: string]: any;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<DeckItem[]>([]);

  useEffect(() => {
    setLoading(true)
    fetch("/api/decks")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setValues(d as DeckItem[]);
        else if (Array.isArray(d?.data)) setValues(d.data as DeckItem[]);
        else if (d?.data && typeof d.data === "object") setValues([d.data as DeckItem]);
        else setValues([]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [])

  return (
    <div className="main-container p-6">
      <h2 className="text-lg font-medium mb-4">Lista de decks</h2>

      <div className="flex flex-row gap-2 mb-6 ">
        {values.map((deck, i) => (
          <div key={deck._id ?? i} className="p-3 border rounded cursor-pointer hover:bg-gray-50 w-1/4">
            <div className="font-semibold">{deck.name ?? "Untitled"}</div>
            <div className="text-sm text-muted-foreground">{deck._id ?? "-"}</div>
          </div>
        ))}
      </div>

      <Button size="lg" aria-label="Submit">
        <Link href="/deck" className="inline-flex items-center gap-2">
          <PlusCircle /> Create Deck
        </Link>
      </Button>
    </div>
  );
}
