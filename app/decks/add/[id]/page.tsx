"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

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
  const [importing, setImporting] = useState(false);
  let fileInputRef: HTMLInputElement | null = null;

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
        body: JSON.stringify({ front, back, time: new Date().toISOString() }),
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

  async function handleImportFile(e: any) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImporting(true);
    try {
      const text = await f.text();
      const parsed = JSON.parse(text);
      let cards: any[] = [];
      if (Array.isArray(parsed)) {
        // array of cards
        cards = parsed;
      } else if (Array.isArray(parsed?.cards)) {
        cards = parsed.cards;
      } else if (parsed?.decks && Array.isArray(parsed.decks)) {
        // if user passed full decks payload, try to find matching deck by name
        // default: take first deck's cards
        const match = parsed.decks.find((d: any) => d.name && d.name === deck.name) || parsed.decks[0];
        cards = Array.isArray(match?.cards) ? match.cards : [];
      }

      if (!cards.length) {
        alert("Nenhum card encontrado no arquivo para importar.");
        return;
      }

      // normalize cards to {front, back, time}
      const payload = { cards: cards.map((c: any) => ({ front: c.front ?? c.Front ?? "", back: c.back ?? c.Back ?? "", time: c.time ?? c.createdAt ?? null })) };

      const res = await fetch(`/api/decks/${id}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || JSON.stringify(json));
      alert(`Importados ${json.insertedCount ?? json.insertedIds ? Object.keys(json.insertedIds || {}).length : 0} cards com sucesso.`);
      router.push(`/decks/${id}`);
    } catch (err: any) {
      console.error(err);
      alert("Erro ao importar: " + (err?.message ?? String(err)));
    } finally {
      setImporting(false);
      if (fileInputRef) fileInputRef.value = "";
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

      <div className="flex items-center gap-3 mt-6">
        <Button onClick={handleCreate} disabled={saving || !front.trim() || !back.trim()}>
          {saving ? "Saving..." : "Create Card"}
        </Button>

        <input
          type="file"
          accept="application/json"
          className="hidden"
          ref={(r) => (fileInputRef = r)}
          onChange={handleImportFile}
        />

        <Button variant="ghost" onClick={() => fileInputRef?.click()} disabled={importing}>
          {importing ? "Importando..." : "Importar JSON para este deck"}
        </Button>
      </div>
    </div>
  );
}
