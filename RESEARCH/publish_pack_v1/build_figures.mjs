// Generates the paper figures as standalone SVG files (no chart library).
// Numbers are hard-coded from the locked claim tables in 04_results.md and
// 06_appendix_exploratory.md. If those tables change, update here too.
// Run: node RESEARCH/publish_pack_v1/build_figures.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, 'part_b_paper', 'figures');
fs.mkdirSync(outDir, { recursive: true });

const FONT = 'Georgia, "Times New Roman", serif';
const INK = '#1a1a1a';
const MUTED = '#555';
const GRID = '#ddd';

function svgDoc(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="max-width:100%;height:auto" font-family='${FONT}'>
<rect x="0" y="0" width="${w}" height="${h}" fill="white"/>
${body}
</svg>
`;
}

function write(name, content) {
  fs.writeFileSync(path.join(outDir, name), content, 'utf8');
  console.log('wrote', name);
}

// ---------------------------------------------------------------- fig 1: flow
function flowFig() {
  const h = 168;
  const boxH = 74;
  const boxY = 30;
  const midY = boxY + boxH / 2;
  const boxes = [
    { w: 132, title: 'Customer message', sub: ['one fixed turn'] },
    { w: 158, title: 'System prompt', sub: ['dense task rules', '+ A1/A2/A3 block'] },
    { w: 208, title: 'Tool loop vs fixtures', sub: ['service_check', 'check_slots', 'book_slot'], mono: true },
    { w: 150, title: 'Final JSON answer', sub: ['status, fields,', 'exact reply phrase'] },
    { w: 158, title: 'Deterministic grader', sub: ['compare to gold', 'pass / fail'] },
  ];
  const gap = 34;
  const totalW = boxes.reduce((s, b) => s + b.w, 0) + gap * (boxes.length - 1) + 20;
  let x = 10;
  let b = '';
  boxes.forEach((box, i) => {
    b += `<rect x="${x}" y="${boxY}" width="${box.w}" height="${boxH}" rx="6" fill="#f6f6f4" stroke="#999"/>`;
    b += `<text x="${x + box.w / 2}" y="${boxY + 22}" font-size="13" font-weight="bold" text-anchor="middle" fill="${INK}">${box.title}</text>`;
    box.sub.forEach((line, j) => {
      const fam = box.mono ? ' font-family="Consolas, monospace"' : '';
      b += `<text x="${x + box.w / 2}" y="${boxY + 39 + j * 15}" font-size="11"${fam} text-anchor="middle" fill="${MUTED}">${line}</text>`;
    });
    if (i < boxes.length - 1) {
      const ax = x + box.w;
      b += `<line x1="${ax + 5}" y1="${midY}" x2="${ax + gap - 9}" y2="${midY}" stroke="${INK}" stroke-width="1.5"/>`;
      b += `<path d="M ${ax + gap - 9} ${midY - 4} L ${ax + gap - 2} ${midY} L ${ax + gap - 9} ${midY + 4} Z" fill="${INK}"/>`;
    }
    x += box.w + gap;
  });
  b += `<text x="${10 + 132 + gap + 158 + gap + 104}" y="${boxY + boxH + 20}" font-size="11" font-style="italic" text-anchor="middle" fill="${MUTED}">families stop at different depths</text>`;
  return svgDoc(totalW, h, b);
}

// --------------------------------------------------------------- fig 2: bars
function barsFig() {
  const w = 720, h = 330;
  const m = { l: 62, r: 20, t: 26, b: 66 };
  const y0 = 80, y1 = 100;
  const plotW = w - m.l - m.r;
  const plotH = h - m.t - m.b;
  const y = (v) => m.t + plotH * (1 - (v - y0) / (y1 - y0));
  const groups = [
    { label: 'Instant (B1)', vals: [89.2, 89.4, 86.9] },
    { label: 'Thinking (B2)', vals: [96.7, 97.2, 96.9] },
  ];
  const styles = ['A1 task-only', 'A2 + role', 'A3 + competencies'];
  const colors = ['#9aa0a6', '#3d6b9a', '#6e5a86'];
  let b = '';
  for (let v = y0; v <= y1; v += 5) {
    b += `<line x1="${m.l}" y1="${y(v)}" x2="${w - m.r}" y2="${y(v)}" stroke="${GRID}"/>`;
    b += `<text x="${m.l - 8}" y="${y(v) + 4}" font-size="12" text-anchor="end" fill="${MUTED}">${v}</text>`;
  }
  b += `<text x="${m.l - 44}" y="${m.t - 10}" font-size="12" fill="${MUTED}">Pass %</text>`;
  const groupW = plotW / groups.length;
  const barW = 58, gap = 20;
  const clusterW = 3 * barW + 2 * gap;
  groups.forEach((g, gi) => {
    const cx = m.l + groupW * gi + groupW / 2;
    g.vals.forEach((v, i) => {
      const bx = cx - clusterW / 2 + i * (barW + gap);
      b += `<rect x="${bx}" y="${y(v)}" width="${barW}" height="${y(y0) - y(v)}" fill="${colors[i]}"/>`;
      b += `<text x="${bx + barW / 2}" y="${y(v) - 7}" font-size="12" text-anchor="middle" fill="${INK}">${v}</text>`;
    });
    b += `<text x="${cx}" y="${h - m.b + 24}" font-size="13" text-anchor="middle" fill="${INK}">${g.label}</text>`;
  });
  b += `<line x1="${m.l}" y1="${y(y0)}" x2="${w - m.r}" y2="${y(y0)}" stroke="${MUTED}"/>`;
  styles.forEach((s, i) => {
    const lx = m.l + 30 + i * 200;
    const ly = h - 16;
    b += `<rect x="${lx}" y="${ly - 11}" width="13" height="13" fill="${colors[i]}"/>`;
    b += `<text x="${lx + 19}" y="${ly}" font-size="12" fill="${INK}">${s}</text>`;
  });
  return svgDoc(w, h, b);
}

// ------------------------------------------------------------- forest plots
function forestFig({ rows, xMin, xMax, ticks, xLabel }) {
  const w = 720;
  const m = { l: 200, r: 34, t: 18, b: 52 };
  const rowH = 30;
  const h = m.t + rows.length * rowH + m.b;
  const plotW = w - m.l - m.r;
  const x = (v) => m.l + plotW * ((v - xMin) / (xMax - xMin));
  let b = '';
  b += `<line x1="${x(0)}" y1="${m.t}" x2="${x(0)}" y2="${h - m.b}" stroke="#b33b3b" stroke-dasharray="4 3"/>`;
  b += `<line x1="${m.l}" y1="${h - m.b}" x2="${w - m.r}" y2="${h - m.b}" stroke="${MUTED}"/>`;
  ticks.forEach((t) => {
    b += `<line x1="${x(t)}" y1="${h - m.b}" x2="${x(t)}" y2="${h - m.b + 5}" stroke="${MUTED}"/>`;
    b += `<text x="${x(t)}" y="${h - m.b + 20}" font-size="12" text-anchor="middle" fill="${MUTED}">${t > 0 ? '+' + t : t}</text>`;
  });
  b += `<text x="${(m.l + w - m.r) / 2}" y="${h - 8}" font-size="12" text-anchor="middle" fill="${MUTED}">${xLabel}</text>`;
  rows.forEach((r, i) => {
    const cy = m.t + i * rowH + rowH / 2;
    if (r.group) {
      b += `<text x="10" y="${cy + 4}" font-size="13" font-weight="bold" fill="${INK}">${r.group}</text>`;
      return;
    }
    const col = r.hurt ? '#a33131' : '#2f5d8a';
    b += `<text x="${m.l - 12}" y="${cy + 4}" font-size="12" text-anchor="end" fill="${INK}">${r.label}</text>`;
    b += `<line x1="${x(r.lo)}" y1="${cy}" x2="${x(r.hi)}" y2="${cy}" stroke="${col}" stroke-width="2"/>`;
    b += `<line x1="${x(r.lo)}" y1="${cy - 5}" x2="${x(r.lo)}" y2="${cy + 5}" stroke="${col}" stroke-width="2"/>`;
    b += `<line x1="${x(r.hi)}" y1="${cy - 5}" x2="${x(r.hi)}" y2="${cy + 5}" stroke="${col}" stroke-width="2"/>`;
    b += `<circle cx="${x(r.mean)}" cy="${cy}" r="4.5" fill="${col}"/>`;
  });
  return svgDoc(w, h, b);
}

const lunaRows = [
  { group: 'Instant (B1)' },
  { label: 'A2 \u2212 A1', mean: 0.3, lo: -3.9, hi: 4.7 },
  { label: 'A3 \u2212 A2', mean: -2.5, lo: -7.5, hi: 2.2 },
  { label: 'A3 \u2212 A1', mean: -2.2, lo: -8.3, hi: 3.9 },
  { group: 'Thinking (B2)' },
  { label: 'A2 \u2212 A1', mean: 0.6, lo: -2.2, hi: 3.3 },
  { label: 'A3 \u2212 A2', mean: -0.3, lo: -3.3, hi: 2.2 },
  { label: 'A3 \u2212 A1', mean: 0.3, lo: -2.2, hi: 2.5 },
  { group: 'Pooled' },
  { label: 'A2 \u2212 A1', mean: 0.4, lo: -2.4, hi: 3.2 },
  { label: 'A3 \u2212 A2', mean: -1.4, lo: -4.4, hi: 1.5 },
  { label: 'A3 \u2212 A1', mean: -1.0, lo: -4.6, hi: 2.8 },
];

const miniRows = [
  { label: 'A2 \u2212 A1', mean: 3.9, lo: -1.7, hi: 9.4 },
  { label: 'A3 \u2212 A2', mean: -4.2, lo: -9.4, hi: 0.8 },
  { label: 'A3 \u2212 A1', mean: -0.3, lo: -5.0, hi: 4.4 },
  { label: 'longer persona \u2212 A1', mean: -8.6, lo: -14.7, hi: -2.8, hurt: true },
];

write('fig1_exam_flow.svg', flowFig());
write('fig2_pass_rates.svg', barsFig());
write('fig3_contrasts.svg', forestFig({
  rows: lunaRows, xMin: -10, xMax: 10, ticks: [-10, -5, 0, 5, 10],
  xLabel: 'Difference in pass rate (pp), 95% CI',
}));
write('fig4_mini_contrasts.svg', forestFig({
  rows: miniRows, xMin: -16, xMax: 12, ticks: [-15, -10, -5, 0, 5, 10],
  xLabel: 'Difference in pass rate (pp), 95% CI',
}));
