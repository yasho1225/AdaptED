import type { Metadata } from "next";
import { PitchDeck } from "@/components/pitch/pitch-deck";

export const metadata: Metadata = {
  title: "AdaptED Pitch Deck",
  description:
    "One lesson. Every learner. — AdaptED pitch presentation for hackathons and demos.",
};

export default function PitchPage() {
  return <PitchDeck />;
}
