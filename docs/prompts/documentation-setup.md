---
layout: sub-navigation
title: Documentation Setup
order: 3
---

```txt
Please create a scaffolded "docs as code" setup for my product repository.

The product is called [product name], and its main focus is [description]

Use the following file as the template and style guide: https://github.com/Home-Office-Digital/core-cloud-workflow-dac-actions/blob/main/docs/product.md

The generated documentation must strictly follow the same:
- structure
- headings
- formatting conventions
- tone and style
- content patterns

Eleventy heading rule:
- The layout renders H1 from front matter title.
- Do not add a markdown H1 (# ...) in any page body.
- Keep front matter with title for every page.
- Start page body with:
    Description:
    then H2 sections only (## ...), checklist bullets, and links.
- Never include both front matter title and a markdown H1 on the same page.

Please copy the template product.md into the docs folder of this product repository, adapting it for [repository name] where appropriate.

Also create any additional files or folders that are referenced or required by product.md.

Finally, add the docs-as-code GitHub Actions workflow from: https://github.com/Home-Office-Digital/core-cloud-workflow-dac-actions/blob/main.github/workflows/deploy-docs.yml

Place it in this product repository at: .github/workflows/deploy-docs.yml

Do not deploy anything yet and if you think additional files are needed, ask before creating them.

Create scaffold documentation only: use placeholders and checklists, not invented operational details.

Adapt the product name and short description, but leave unknown fields blank.

Keep the documentation consistent with the template style: concise headings, short checklist items, simple links, and no explanatory prose unless the template uses it.

For each linked page, create a matching placeholder page with front matter, a top-level heading, a `Description:` line, and relevant checklist sections based on the link purpose.

Do not add content that has not been provided.

When complete, output only a concise summary of files created and the Git commands needed to commit and push the changes.
```