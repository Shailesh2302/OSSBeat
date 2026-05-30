"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/useReveal";

const ROWS = 14;
const TEXT_ROWS = 7;
const GAP = 3;
const CELL_MAX = 10;

const LETTERS: Record<string, number[][]> = {
  S: [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,1],[0,0,0,0,1],[1,1,1,1,1],[0,0,0,0],[0,0,0,0]],
  T: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0],[0,0,0,0]],
  A: [[0,1,1,1,0],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[0,0,0,0],[0,0,0,0]],
  R: [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,1,0],[1,0,0,0,1],[0,0,0,0],[0,0,0,0]],
  O: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],[0,0,0,0],[0,0,0,0]],
  U: [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],[0,0,0,0],[0,0,0,0]],
  E: [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,1,1,1],[0,0,0,0],[0,0,0,0]],
  N: [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1],[0,0,0,0],[0,0,0,0]],
  Y: [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0],[0,0,0,0]],
  C: [[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[0,1,1,1,1],[0,0,0,0],[0,0,0,0]],
  P: [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[0,0,0,0],[0,0,0,0]],
  J: [[0,0,0,1,1],[0,0,0,0,1],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],[0,0,0,0],[0,0,0,0]],
};

function buildGrid(text: string) {
  const textOffset = Math.floor((ROWS - TEXT_ROWS) / 2);
  let textCols = 0;
  for (const ch of text) textCols += ch === " " ? 3 : 6;
  const cols = textCols + 6;
  const startCol = Math.floor((cols - textCols) / 2);
  const grid = Array.from({ length: ROWS }, () => Array(cols).fill(0));
  let col = startCol;

  for (const ch of text) {
    if (ch === " ") { col += 3; continue; }
    const letter = LETTERS[ch];
    if (!letter) { col += 6; continue; }
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 5; c++) {
        if (letter[r]?.[c]) {
          const tr = textOffset + r;
          const tc = col + c;
          if (tr >= 0 && tr < ROWS && tc >= 0 && tc < cols && grid[tr]) grid[tr][tc] = 1;
        }
      }
    }
    col += 6;
  }

  return { grid, cols };
}

export default function OpenSourceJourneyChart() {
  const { grid, cols } = buildGrid("START YOUR OPEN SOURCE JOURNEY");
  const { ref, inView } = useScrollReveal({ margin: "-50px" });

  return (
    <div ref={ref} className="w-full border border-border bg-card overflow-hidden">
      <div
        className="grid justify-center p-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: GAP,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.5s ease-out",
        }}
      >
        {grid.flat().map((cell, i) => (
          <div
            key={i}
            className="aspect-square"
            style={{ maxWidth: CELL_MAX, maxHeight: CELL_MAX }}
          >
            <div
              className={`w-full h-full ${cell ? "bg-foreground" : "bg-muted"}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
