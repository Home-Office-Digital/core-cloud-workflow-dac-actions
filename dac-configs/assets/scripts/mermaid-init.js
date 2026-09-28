// Render Mermaid diagrams client-side.
//
// The govuk-eleventy-plugin renders ```mermaid fenced code blocks as highlighted
// <pre> code. This script finds those blocks, converts them to <div class="mermaid">
// and runs Mermaid over them, so diagrams render visually (matching how the
// previous Just-the-Docs sites rendered them).
//
// Mermaid is loaded from a CDN only on pages that actually contain a diagram.
const MERMAID_CDN =
  "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

function collectMermaidBlocks() {
  const blocks = [];
  document
    .querySelectorAll("pre.app-code__language--mermaid, pre.language-mermaid")
    .forEach((pre) => {
      const code = pre.querySelector("code") || pre;
      blocks.push({ el: pre, text: code.textContent });
    });
  document.querySelectorAll("code.language-mermaid").forEach((code) => {
    const pre = code.closest("pre");
    if (pre && !pre.classList.contains("app-code__language--mermaid")) {
      blocks.push({ el: pre, text: code.textContent });
    }
  });
  return blocks;
}

async function run() {
  const blocks = collectMermaidBlocks();
  if (blocks.length === 0) return;

  blocks.forEach(({ el, text }) => {
    const div = document.createElement("div");
    div.className = "mermaid";
    div.textContent = text;
    el.replaceWith(div);
  });

  try {
    const { default: mermaid } = await import(MERMAID_CDN);
    mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
    await mermaid.run({ querySelector: ".mermaid" });
  } catch (err) {
    // If the CDN is unavailable, leave the diagram source visible as text.
    console.error("Mermaid failed to load; showing diagram source instead.", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run);
} else {
  run();
}
