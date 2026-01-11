"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ObjectId } from "bson";

type Card = {
    
}

export default function AddCardPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [deck, setDeck] = useState<any>(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/decks/${id}`)
      .then((r) => r.json())
      .then((d) => setDeck(d?.data ?? null))
      .catch((e) => console.error(e));
  }, [id]);

  async function handleCreate() {
    setSaving(true);
    try {
      const res = await fetch(`/api/decks/${id}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deck_id: new ObjectId(id), front, back, time: new Date().toISOString() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");
    //   router.push(`/decks/${id}`);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar card: " + (err as any).message);
    } finally {
      setSaving(false);
    }
  }

  if (deck === null) {
    return <div className="main-container p-6">Carregando...</div>;
  }

  if (!deck) {
    return <div className="main-container p-6">Deck not found.</div>;
  }

  return (
    <div className="main-container p-6">
      <h1 className="text-xl font-bold mb-2">{deck.name ?? "Untitled"}</h1>
      <div className="text-sm text-muted-foreground mb-4">ID: {deck._id?.toString?.() ?? id}</div>
      <div className="flex flex-row gap-4 w-full">
        <div className="w-full">
          <Field>
            <FieldLabel htmlFor="front">Front</FieldLabel>
            <Textarea id="front" placeholder="Frente" className="min-h-[200px]" value={front} onChange={(e) => setFront(e.target.value)} />
            <FieldDescription>Front of the card</FieldDescription>
          </Field>
        </div>

        <div className="w-full">
          <Field>
            <FieldLabel htmlFor="back">Back</FieldLabel>
            <Textarea id="back" placeholder="Verso" className="min-h-[200px]" value={back} onChange={(e) => setBack(e.target.value)} />
            <FieldDescription>Back of the card</FieldDescription>
          </Field>
        </div>
      </div>

      <Button className="mt-6" onClick={handleCreate} disabled={saving || !front.trim() || !back.trim()}>
        {saving ? "Saving..." : "Create Card"}
      </Button>
    </div>
  );
}
