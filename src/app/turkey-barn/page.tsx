import type { Metadata } from "next";
import { TurkeyBarnGame } from "@/components/turkey/TurkeyBarnGame";

export const metadata: Metadata = {
  title: "Barn Door Keeper | Arrow-key game across six levels",
  description:
    "Drive your keeper with the arrow keys and slam pens shut before the animals escape. Six levels — turkeys, hens, chickens, salmon, shrimp and the office floor. Earn genetic improvement points or go bankrupt.",
};

export default function TurkeyBarnPage() {
  return <TurkeyBarnGame />;
}
