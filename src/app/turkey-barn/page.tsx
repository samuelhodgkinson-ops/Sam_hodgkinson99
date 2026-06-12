import type { Metadata } from "next";
import { TurkeyBarnGame } from "@/components/turkey/TurkeyBarnGame";

export const metadata: Metadata = {
  title: "Turkey Barn Door | Keep the flock in, earn genetic improvement points",
  description:
    "A simple click-to-shut barn door game. Slam the doors before the turkeys escape to earn genetic improvement points. Let too many out and your farm goes bankrupt.",
};

export default function TurkeyBarnPage() {
  return <TurkeyBarnGame />;
}
