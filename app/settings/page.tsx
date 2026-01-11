"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Settings = {
  easy?: number;
  medium?: number;
  hard?: number;
};

export default function SettingsPage() {
  const [values, setValues] = useState<Settings>({ easy: 1, medium: 1, hard: 1 });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  function round(value: number, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  useEffect(() => {
    setLoading(true);
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.data) {
          setValues({
            easy: d.data.easy ?? 1,
            medium: d.data.medium ?? 1,
            hard: d.data.hard ?? 1,
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar configurações: " + (err as any).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="main-container p-6">
      <h2 className="text-lg font-medium mb-4">Multipliers configurations</h2>

      <div className="flex flex-col max-w-md">
        <label>Easy <span className="text-detail">(72h * {values.easy ?? 1} = {round(72*(values.easy ?? 1), 0)} horas)</span></label>
        <div className="flex items-center">
          <Input
            type="number"
            step="any"
            inputMode="decimal"
            value={values.easy ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setValues((prev) => ({ ...prev, easy: v === "" ? undefined : parseFloat(v) }));
            }}
          />
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setValues((p) => ({ ...p, easy: round((p.easy ?? 0) + 0.1, 2) }))
              }
            >
              +0.1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setValues((p) => ({ ...p, easy: round((p.easy ?? 0) - 0.1, 2) }))
              }
            >
              -0.1
            </Button>
          </div>
        </div>

        <label>Medium <span className="text-detail">(48h * {values.medium ?? 1} = {round(48*(values.medium ?? 1), 0)} horas)</span></label>
        <div className="flex items-center">
          <Input
            type="number"
            step="any"
            inputMode="decimal"
            value={values.medium ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setValues((prev) => ({ ...prev, medium: v === "" ? undefined : parseFloat(v) }));
            }}
          />
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setValues((p) => ({ ...p, medium: round((p.medium ?? 0) + 0.1, 2) }))
              }
            >
              +0.1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setValues((p) => ({ ...p, medium: round((p.medium ?? 0) - 0.1, 2) }))
              }
            >
              -0.1
            </Button>
          </div>
        </div>

        <label>Hard <span className="text-detail">(24h * {values.hard ?? 1} = {round(24*(values.hard ?? 1), 0)} horas)</span></label>
        <div className="flex items-center">
          <Input
            type="number"
            step="any"
            inputMode="decimal"
            value={values.hard ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setValues((prev) => ({ ...prev, hard: v === "" ? undefined : parseFloat(v) }));
            }}
          />
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setValues((p) => ({ ...p, hard: round((p.hard ?? 0) + 0.1, 2) }))}
            >
              +0.1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setValues((p) => ({ ...p, hard: round((p.hard ?? 0) - 0.1, 2) }))}
            >
              -0.1
            </Button>
          </div>
        </div>

      </div>
        <Button className="mt-4" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
    </div>
  );
}