---
homepage: true
layout: sub-navigation
title: Workflow Actions Overview
order: 1
---

## Overview

This repository provides reusable GitHub Actions for building and deploying a static documentation site to GitHub Pages.

The primary entry point is a reusable workflow that orchestrates all steps end-to-end.

The reusable workflow is backed by three composite actions:

1. Setup Node and Pages
2. Build and upload Pages artifact
3. Deploy to GitHub Pages

## Before You Can Deploy

Make sure GitHub Pages is configured to deploy from GitHub Actions:

1. Open your repository on GitHub.
2. Go to Settings > Pages.
3. Under Build and deployment, set Source to GitHub Actions.
4. Ensure your workflow runs on main for production deployments.


### Prompt

You can use the following prompt to create the necessary documentation files.
Please fill in the place holders for [product name], [description], and [repository name]!

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

Review the output to see if it worked as expected.

An example video of using the prompt
<video controls width="100%" preload="metadata">
	<source src="./assets/images/prompt-guidance.mp4" type="video/mp4" />
	Your browser does not support the video tag.
</video>

## How The Workflow And Actions Work

### 1. Reusable Workflow

The reusable workflow executes setup and build in the build job, then runs deploy in a second job.

The deploy job only runs when the ref name is main.

Workflow file: `.github/workflows/build-deploy.yml`

### 2. Setup

The setup action:

1. Installs and configures Node.js for the selected version.
2. Installs project dependencies through the shared Node/npm setup action.
3. Configures GitHub Pages.

Action file: `actions/setup/action.yml`

### 3. Build

The build action:

1. Copies preset DAC configuration files into the caller repository working directory.
2. Runs the project build using the shared Node/npm build action.
3. Uploads the generated site directory as a GitHub Pages artifact (default `_site`).
4. Supports optional `product_name` input to override the header product title.

Action file: `actions/build/action.yml`

### 4. Deploy

The deploy action:

1. Deploys the uploaded artifact to GitHub Pages.
2. Returns the deployed page URL as output.

Action file: `actions/deploy/action.yml`

## Preset DAC Config And Home Office Branding Defaults

The key behavior is in the build action copy step. Before build, it copies everything from `dac-configs` into the calling repository working directory.

This gives consumers a shared default DAC setup, including Home Office branding.

### Included Presets

1. Eleventy configuration in `dac-configs/eleventy.config.js`
2. Shared styling overrides in `dac-configs/styles/base.scss`
3. Branding assets in `dac-configs/assets/logos`

### Home Office Defaults

The DAC Eleventy preset defines:

1. Home Office logo and logotype in the header.
2. `organisationName` set to Home Office.
3. Home Office favicon, mask icon, apple touch icon, and Open Graph image.
4. Footer copyright text linked to the repository license path.

### Images

If your site includes custom images, add them to `assets/images` in your repository.

The DAC configuration passes through `assets/images`, so those images are included in the built site output.

### Repository Defaults For Links And Paths

Repository metadata is resolved in this order:

1. Explicit workflow inputs (`repo_owner`, `repo_name`)
2. `GITHUB_REPOSITORY` from GitHub Actions
3. Fallback defaults (`Home-Office-Digital` for owner, package name or empty for name)

Product name is resolved in this order:

1. Explicit workflow input (`product_name`)
2. Derived repository name from workflow metadata
3. Fallback default (`Documentation`)

In most cases, consumers do not need to set `repo_owner`, `repo_name`, or `product_name` manually.

