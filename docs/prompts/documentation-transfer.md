---
layout: sub-navigation
title: Documentation Transfer
order: 4
---

```txt
Please migrate content from confluence on [product name] [section] into the [section].md file
You may:

Reorganise migrated content into clearer Markdown sections and subsections.
Convert flattened Confluence panels, page properties, option blocks, and macro output into Markdown tables, lists, blockquotes, or fenced code blocks.
Fix awkward converted headings such as "Example structure:" by turning them into appropriate Markdown headings or labels.
Split large code/configuration macros into smaller labelled code blocks where this improves readability.
Preserve all original wording, values, commands, URLs, examples, diagrams, warnings, and technical details.
Add review comments where source content appears inconsistent, duplicated, incomplete, or cannot be translated cleanly.


You must not:

Invent, infer, summarise, or add new technical content.
Correct source technical values unless explicitly marked as a review comment.
Remove source content because it looks messy.
Rewrite content for style beyond Markdown formatting and structure.

Issue:
• If unable to translate a confluence macro into markdown, then please leave a comment pointing back to the its location in confluence with a brief description of what it was meant to show and a tag for relevant team to review
• If content is unclear or appears wrong in Confluence, preserve it and add:
• <!-- REVIEW: @Core-Cloud-Architecture - Brief reason and source Confluence URL -->

Confluence Access:

Use the following Confluence Personal Access Token for authentication which is located in .env: CONFLUENCE_PAT
Use the following Confluence Url and Space which is located in .env: CONFLUENCE_URL

Output Requirements:

A summary of what was pulled and created 
Any missed or Marco/giffy content skipped
```