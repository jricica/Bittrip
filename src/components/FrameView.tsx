import React from "react";

const budget = [
  { item: "Uber", amount: "$50" },
  { item: "Avianca", amount: "$150" },
  { item: "Airbnb", amount: "$200" },
];

export default function FrameView() {
  const city = "Medellín";
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Viaje a {city}</h1>
        <ul className="text-left space-y-1">
          {budget.map((b) => (
            <li key={b.item} className="flex justify-between">
              <span>{b.item}</span>
              <span>{b.amount}</span>
            </li>
          ))}
        </ul>
        <a
          href="https://bittrip.app/create?city=medellin"
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Planear viaje
        </a>
      </div>
    </main>
  );
}
