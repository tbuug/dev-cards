import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="main-container p-6">
      <Button size="lg" aria-label="Submit">
        <PlusCircle /> Create Deck
        
      </Button>
    </div>
  );
}
