# Product

## Register

product

## Users

Primarily the builder themselves, but the surface is meant to be shown to others (portfolio viewers, potential employers, friends) — not just a private scratch tool. Users arrive to run quick research-style queries against a locally-crawled corpus of Wikipedia articles and expect the results to feel credible and considered, not like a generic dev-tool demo.

## Product Purpose

A from-scratch search engine: a Wikipedia crawler feeds a hand-built inverted index and TF-IDF ranking, queried through a small web UI. Success looks like fast, relevant results presented with the same seriousness as the reference material it searches — it should read as a piece of craft, not a wrapper around someone else's search API.

## Brand Personality

Scholarly, confident, warm. Editorial and calm — an encyclopedic reference tool, not a SaaS dashboard and not a chat interface. Precise without being cold; restrained without being sterile.

## Anti-references

- Generic SaaS/dashboard look — the current shadcn "base-nova" neutral defaults (flat gray cards, zero-radius, zero-chroma neutrals) read as exactly this. Explicitly move away from it.
- AI-chatbot cliché — a centered textarea in a white card reads as a ChatGPT clone. Avoid that composition.

## Design Principles

- Respect the source material: lean into the feel of a serious reference work (Wikipedia, an encyclopedia, a library catalog) rather than dressing the tool as a generic product.
- Typography carries the weight: this is a text-heavy surface (queries, titles, snippets, scores) — hierarchy and type quality do more work than color or chrome.
- Calm confidence over dashboard chrome: avoid unnecessary cards/containers and dense widget layouts; let content and whitespace do the work.
- Show the craft: since this is portfolio-facing, considered small details (motion, empty states, result affordances) matter more than feature breadth.
- Quiet color, considered accents: warmth and confidence come from typography, spacing, and one deliberate accent color — not saturation everywhere.

## Accessibility & Inclusion

Standard good practice: solid contrast ratios, full keyboard navigation, respects `prefers-reduced-motion`. No stricter WCAG level requested.
