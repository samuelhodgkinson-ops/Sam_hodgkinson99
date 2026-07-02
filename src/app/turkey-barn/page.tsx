import type { Metadata } from "next";
import { TurkeyBarnGame } from "@/components/turkey/TurkeyBarnGame";

export const metadata: Metadata = {
  title: "Barn Door Keeper | Arrow-key game across six levels",
  description:
    "Drive your keeper with the arrow keys and slam pens shut before the animals escape. Seven levels — turkeys, hens, chickens, salmon, shrimp, pigs and the office floor. Points accumulate across every level and land on the leaderboard.",
};

export default function TurkeyBarnPage() {
  return <TurkeyBarnGame />;
}
