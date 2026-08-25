// Stitch part_b_paper sections into paper_draft.md + paper_draft.html.
// Run from repo root: node RESEARCH/publish_pack_v1/build_paper.mjs
// PDF is printed separately via headless Edge (see PEER_OUTREACH / chat notes).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, 'part_b_paper');

const read = (f) => fs.readFileSync(path.join(src, f), 'utf8');

// Strip internal draft plumbing that must not appear in the public paper.
function stripMeta(text, { keepFences = false } = {}) {
  let s = text.split(/\r?\n/).filter((l, i) => !(i < 3 && /^#\s/.test(l))).join('\n');
  const drop = ['Status', 'Claim authority', 'Venue posture', 'Wording', 'Audience', 'Scope'];
  if (!keepFences) drop.push('Label', 'Does not change', 'Authority for main claim');
  for (const k of drop) {
    s = s.replace(new RegExp(String.raw`^\*\*${k}[^\n]*\n?`, 'gm'), '');
  }
  s = s.replace(/^\s*\*Draft[^\n]*\n/, '');            // italic draft notes atop 03/04
  s = s.replace(/^[\s\n]*---\s*\n/, '');               // leading hr left after meta strip
  return s.trim();
}

// Demote every heading one level so inserted section headers own H2.
const demote = (s) => s.replace(/^(#{1,5}) /gm, '#$1 ');

// --- 00: abstract only (title block is handcrafted below)
const abstract = read('00_title_abstract.md').split(/^## Abstract\s*$/m)[1].trim();

// --- 02: split prose from sources; drop internal citation-integrity note
const rw = stripMeta(read('02_related_work.md'));
const [rwBody, rwSources] = rw.split(/^## Sources\s*$/m);
const references = rwSources.split(/^### Citation integrity note/m)[0].trim();

// Shorten repro variant commands so code lines fit the printed page
// (full bundle path is already shown in the first command).
const fitRepro = (s) => s.replace(
  /npm run smoke:eval -- --bundle RESEARCH\/benchmark_pack_v1\/full_120\/full_120_bundle_v1\.json --/g,
  'npm run smoke:eval -- --bundle <bundle> --'
);

const sections = [
  ['1. Introduction', demote(stripMeta(read('01_introduction.md')))],
  ['2. Related work', demote(rwBody.replace(/\n---\s*$/, '').trim())],
  ['3. Methods', demote(stripMeta(read('03_methods.md')))],
  ['4. Results', demote(stripMeta(read('04_results.md')))],
  ['5. Discussion', demote(stripMeta(read('05_discussion.md')))],
  ['Appendix A. Exploratory checks', demote(stripMeta(read('06_appendix_exploratory.md'), { keepFences: true }))],
  ['Appendix B. Reproducibility', fitRepro(demote(stripMeta(read('07_reproducibility.md'))))],
  ['References', references],
];

const AUTHOR = 'Ihor Parinov (TARK AI)';
const ORCID = '0009-0006-9411-8633';
const ORCID_URL = `https://orcid.org/${ORCID}`;
const DATE = 'August 2026';
const VERSION = 'Preprint v1.1';

const mdParts = [
  '# Skip the Roleplay',
  '',
  '### Persona prompting did not improve a real-world AI agent',
  '',
  `**${AUTHOR}** · [ORCID ${ORCID}](${ORCID_URL}) · ${VERSION} · ${DATE}`,
  '',
  '## Abstract',
  '',
  abstract,
  '',
];
for (const [title, body] of sections) {
  mdParts.push(`## ${title}`, '', body, '');
}
const paperMd = mdParts.join('\n');
// paper_draft.md sits one level above part_b_paper, so figure paths need the prefix.
fs.writeFileSync(
  path.join(here, 'paper_draft.md'),
  paperMd.replace(/\]\(figures\//g, '](part_b_paper/figures/'),
  'utf8'
);

// --- HTML
const bodyMd = paperMd.split(/^## Abstract\s*$/m)[1];
let bodyHtml = marked.parse('## Abstract\n' + bodyMd);

// Inline figure SVGs so paper_draft.html stays a single self-contained file
// (and headless Edge printing never depends on relative file resolution).
bodyHtml = bodyHtml.replace(/<img src="figures\/([^"]+\.svg)"[^>]*>/g, (tag, file) => {
  const p = path.join(src, 'figures', file);
  if (!fs.existsSync(p)) {
    console.warn('missing figure:', file, '(run build_figures.mjs first)');
    return tag;
  }
  return `<div class="figure">${fs.readFileSync(p, 'utf8')}</div>`;
});

// marked wraps the replaced <div> in <p>, which is invalid and makes print
// page-breaks worse. Unwrap, then keep figure + caption together.
bodyHtml = bodyHtml.replace(/<p>\s*(<div class="figure">[\s\S]*?<\/div>)\s*<\/p>/g, '$1');
bodyHtml = bodyHtml.replace(
  /(<div class="figure">[\s\S]*?<\/div>)\s*(<p><em>[\s\S]*?<\/em><\/p>)/g,
  '<div class="keep">$1$2</div>'
);

// Keep a heading with the table that immediately follows it. Do not let the
// lead-in <p> match across later sections (a greedy [\s\S]*?<\/p> will).
function wrapHeadingTables(html) {
  const headingRe = /<(h[34])(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi;
  let out = '';
  let last = 0;
  let m;
  while ((m = headingRe.exec(html))) {
    out += html.slice(last, m.index);
    const heading = m[0];
    let i = headingRe.lastIndex;
    const tail = html.slice(i);

    const leadRe = /^(?:\s*<p(?:\s[^>]*)?>(?:(?!<\/p>|<h[1-6]\b|<table\b|<ul\b|<ol\b|<div\b|<hr\b|<pre\b)[\s\S])*<\/p>){0,4}/i;
    const lead = tail.match(leadRe)?.[0] ?? '';
    const afterLead = tail.slice(lead.length);
    const tableMatch = afterLead.match(/^\s*<table\b[\s\S]*?<\/table>/i);
    const subTable = afterLead.match(
      /^\s*<(h4)(?:\s[^>]*)?>[\s\S]*?<\/\1>\s*<table\b[\s\S]*?<\/table>/i
    );

    let extra = '';
    if (tableMatch) extra = tableMatch[0];
    else if (subTable) extra = subTable[0];

    if (!extra) {
      out += heading;
      last = m.index + heading.length;
      headingRe.lastIndex = last;
      continue;
    }

    let block = heading + lead + extra;
    let consumed = lead.length + extra.length;
    if (tableMatch) {
      const more = afterLead.slice(tableMatch[0].length).match(
        /^\s*<p(?:\s[^>]*)?>(?:(?!<\/p>|<h[1-6]\b|<table\b)[\s\S])*<\/p>\s*<table\b[\s\S]*?<\/table>/i
      );
      if (more && more[0].length < 2500) {
        block += more[0];
        consumed += more[0].length;
      }
    }

    const rows = (block.match(/<tr[\s>]/g) || []).length;
    if (rows > 14) {
      out += heading;
      last = m.index + heading.length;
      headingRe.lastIndex = last;
      continue;
    }

    out += `<div class="keep">${block}</div>`;
    last = i + consumed;
    headingRe.lastIndex = last;
  }
  out += html.slice(last);
  return out;
}

bodyHtml = wrapHeadingTables(bodyHtml);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Skip the Roleplay: Persona prompting did not improve a real-world AI agent</title>
<style>
  @page { size: A4; margin: 22mm 20mm; }
  html { font-size: 10.8pt; }
  body {
    font-family: Charter, Georgia, "Times New Roman", serif;
    line-height: 1.5; color: #1a1a1a; max-width: 172mm; margin: 0 auto; padding: 24px 8px;
  }
  .titleblock { text-align: center; margin: 0 0 2.2em; }
  .titleblock h1 { font-size: 1.85rem; margin: 0 0 0.25em; }
  .titleblock .sub { font-size: 1.15rem; font-style: italic; margin: 0 0 0.9em; }
  .titleblock .meta { font-size: 0.92rem; color: #444; }
  h2 { font-size: 1.22rem; margin: 1.8em 0 0.6em; border-bottom: 1px solid #ccc; padding-bottom: 0.15em; }
  h3 { font-size: 1.05rem; margin: 1.4em 0 0.45em; }
  h4 { font-size: 0.98rem; margin: 1.2em 0 0.4em; }
  p, li { text-align: justify; }
  code { font-family: Consolas, "Courier New", monospace; font-size: 0.86em; background: #f4f4f2; padding: 0 3px; border-radius: 2px; }
  pre { background: #f4f4f2; padding: 10px 12px; font-size: 0.85em; white-space: pre-wrap; overflow-wrap: anywhere; }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; margin: 0.8em 0 1.1em; font-size: 0.9em; width: auto; }
  th, td { border: 1px solid #bbb; padding: 4px 9px; vertical-align: top; }
  th { background: #f0f0ee; text-align: left; }
  blockquote { border-left: 3px solid #ccc; margin: 0.8em 0; padding: 0.1em 1em; color: #444; }
  hr { border: 0; border-top: 1px solid #ccc; margin: 1.6em 0; }
  a { color: #17418a; text-decoration: none; overflow-wrap: anywhere; }
  pre { break-inside: avoid; page-break-inside: avoid; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  h2, h3, h4 {
    break-after: avoid;
    page-break-after: avoid;
  }
  h2 + *, h3 + *, h4 + * {
    break-before: avoid;
    page-break-before: avoid;
  }
  .keep {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .figure { text-align: center; margin: 1.1em 0 0.3em; }
  .figure svg { max-width: 100%; height: auto; }
  .keep p em, .figure + p em { display: block; text-align: center; font-size: 0.88em; color: #444; }
</style>
</head>
<body>
  <div class="titleblock">
    <h1>Skip the Roleplay</h1>
    <p class="sub">Persona prompting did not improve a real-world AI agent</p>
    <p class="meta">${AUTHOR} &middot; <a href="${ORCID_URL}">ORCID ${ORCID}</a> &middot; ${VERSION} &middot; ${DATE}</p>
  </div>
${bodyHtml}
</body>
</html>
`;
fs.writeFileSync(path.join(here, 'paper_draft.html'), html, 'utf8');

console.log('Wrote paper_draft.md (%d chars) and paper_draft.html (%d chars)', paperMd.length, html.length);
