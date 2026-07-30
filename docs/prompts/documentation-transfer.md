---
layout: sub-navigation
title: Documentation Transfer
order: 4
---

```txt
QA and traceability requirement:

After migration and Markdown restyling, perform a QA pass against the original [product name] [section] Confluence source pages.

For each migrated Confluence page:

Cross-reference the generated Markdown section against the original Confluence page.
Confirm all source headings, tables, commands, code blocks, URLs, diagrams, warnings, notes, examples, and technical values are present.
Confirm restyling did not mutate technical meaning, names, IDs, URLs, commands, configuration values, ports, environment names, permissions, costs, status values, or option outcomes.
Confirm skipped or partially translated Confluence macros are explicitly represented by either:
a preserved rendered image,
a Markdown placeholder,
or a `<!-- REVIEW: @Core-Cloud-Architecture ... -->` comment with the Confluence source URL and what was skipped.

Confirm no skipped macro content was silently dropped.
Confirm no new technical content, inferred recommendations, assumptions, or rewritten guidance was introduced.

Create a final QA summary that includes:
• Source pages checked.
• Markdown sections checked.
• Any mutations found and fixed.
• Any skipped macro/Gliffy/image/Jira/panel/expand/details content and how it is represented.
• Any remaining review comments requiring team follow-up.
• Confirmation that the Confluence PAT/token was not written into the Markdown.
•
If any mismatch or mutation is found, fix it before reporting completion.
```