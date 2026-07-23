"use client";

import dynamic from "next/dynamic";

// Client component — game landing is fully interactive (3D, audio, animations).
const LandingClient = dynamic(
  () => import("./LandingClient").then((m) => m.LandingClient),
  { ssr: false },
);

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-void-950">
      <LandingClient />
    </main>
  );
}
