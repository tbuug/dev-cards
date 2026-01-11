"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react"

type Props = {
    name: string
}

export default function DeckPage() {
    const [values, setValues] = useState<Props>({ name: ""})
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        setSaving(true)
        try {
            const res = await fetch("/api/decks", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)})
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar deck: " + (err as any).message);
        } finally {
            setSaving(false);
            window.location.href = "/";
        }
    }

    return (
        <div>
            <div className="main-container p-6 flex flex-col">
            Deck Name:
            <Input 
                type="text" 
                value={values.name} 
                onChange={(e) => setValues({ ...values, name: e.target.value })} 
                className="mt-2 mb-4 w-full max-w-sm"
            />
        </div>
            <Button className="mt-4" onClick={handleSave} disabled={saving}>
                 {saving ? "Saving..." : "Save"}
            </Button>
        </div>
    )
}