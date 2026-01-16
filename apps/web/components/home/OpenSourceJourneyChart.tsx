import React from "react";

/* ---------------- CONFIG ---------------- */

const ROWS = 14;            // double height
const TEXT_ROWS = 7;
const GAP = 3;
const CELL_MAX = 10;

/* ---------------- LETTER MAP ---------------- */
/* 7 rows × 5 columns per letter */

const LETTERS: Record<string, number[][]> = {
  S: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  T: [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  A: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  R: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  O: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  U: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  E: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  N: [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  Y: [
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  C: [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,1],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  P: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  J: [
    [0,0,0,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
};

/* ---------------- GRID BUILDER ---------------- */

function buildGrid(text: string) {
  const textOffset = Math.floor((ROWS - TEXT_ROWS) / 2);

  let textCols = 0;
  for (const ch of text) {
    textCols += ch === " " ? 3 : 6;
  }

  const cols = textCols + 6;
  const startCol = Math.floor((cols - textCols) / 2);

  const grid = Array.from({ length: ROWS }, () =>
    Array(cols).fill(0)
  );

  let col = startCol;

  for (const ch of text) {
    if (ch === " ") {
      col += 3;
      continue;
    }

    const letter = LETTERS[ch];
    if (!letter) {
      col += 6; // safety fallback
      continue;
    }

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 5; c++) {
        if (letter[r][c]) {
          grid[textOffset + r][col + c] = 1;
        }
      }
    }

    col += 6;
  }

  return { grid, cols };
}

/* ---------------- COMPONENT ---------------- */

export default function OpenSourceJourneyChart() {
  const { grid, cols } = buildGrid(
    "START YOUR OPEN SOURCE JOURNEY"
  );

  return (
    <div className="w-full bg-neutral-950 rounded-xl p-1 overflow-hidden">
      <div
        className="grid justify-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: GAP,
        }}
      >
        {grid.flat().map((cell, i) => (
          <div
            key={i}
            className={`aspect-square rounded-sm ${
              cell ? "bg-white" : "bg-neutral-900"
            }`}
            style={{ maxWidth: CELL_MAX, maxHeight: CELL_MAX }}
          />
        ))}
      </div>
    </div>
  );
}
