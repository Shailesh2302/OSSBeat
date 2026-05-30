"use client";

import React from "react";
import { motion } from "framer-motion";

/* ---------------- CONFIG ---------------- */

const ROWS = 14;
const TEXT_ROWS = 7;
const GAP = 3;
const CELL_MAX = 10;

/* ---------------- LETTER MAP ---------------- */

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
      col += 6;
      continue;
    }

    for (let r = 0; r < 7; r++) {
      const row = letter[r];
      if (!row) continue;

      for (let c = 0; c < 5; c++) {
        if (!row[c]) continue;
        const targetRow = grid[textOffset + r];
        if (!targetRow) continue;
        const targetIdx = col + c;
        if (targetIdx < 0 || targetIdx >= targetRow.length) continue;

        targetRow[targetIdx] = 1;
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
    <div className="w-full border border-border bg-card overflow-hidden">
      <motion.div
        className="grid justify-center p-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: GAP,
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.005 } },
        }}
      >
        {grid.flat().map((cell, i) => (
          <motion.div
            key={i}
            className="aspect-square"
            style={{ maxWidth: CELL_MAX, maxHeight: CELL_MAX }}
            variants={{
              hidden: { opacity: 0, scale: 0.5 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.4, ease: "backOut" }}
          >
            <div
              className={`w-full h-full ${
                cell ? "bg-foreground" : "bg-muted"
              }`}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
