"use client";

import Link from "next/link";
import { Plus, Settings, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  return (
    <div className="w-full border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-semibold">
            Dev Cards
          </Link>
        </div>

        <nav>
          <ul className="flex items-center gap-2">
            <li>
              <Button asChild size="sm">
                <Link href="/" className="inline-flex items-center gap-2">
                  Home
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild size="sm">
                <Link href="/settings" className="inline-flex items-center gap-2">
                  Settings
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}