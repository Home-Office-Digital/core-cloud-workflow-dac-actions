# core-cloud-workflow-dac-actions

This repository contains actions for a full static site build and deployment workflow to GitHub Pages.

- Setup Node and Pages - to set up Node.js and configure GitHub Pages
- Build and upload Pages artifact - to build the site and upload the artifact
- Deploy to GitHub Pages - to deploy the uploaded Pages artifact

There is also one workflow that combines several actions into a self contained workflow.

- build-deploy - will set up, build, upload, and deploy to GitHub Pages

## Pre-requisites

- Valid Node.js project with npm scripts
- Valid build output directory, defaulting to _site
- GitHub Pages enabled in the repository
- Workflow permissions including pages: write and id-token: write

## Workflow Inputs

The reusable workflow supports the following inputs:

- working_directory
  - Type: string
  - Required: false
  - Default: .
  - Description: Directory to run npm build in
- node_version
  - Type: string
  - Required: false
  - Default: 24
  - Description: Node.js version to use for the build
- path
  - Type: string
  - Required: false
  - Default: _site
  - Description: Path to the built site to upload as a Pages artifact

## Turn On GitHub Pages (Deploy From main)

1. Open your repository on GitHub.
2. Go to Settings > Pages.
3. Under Build and deployment, set Source to GitHub Actions.
4. Ensure your workflow is triggered from the main branch.
5. Push changes to main to trigger deployment.

Because this is a reusable workflow (workflow_call), configure the main branch trigger in your caller workflow:

```yml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
```

The deploy job inside this reusable workflow only runs when the ref name is main.

## Usage

Workflow can be used as

```yml
name: build-deploy-pages

on:
  push:
    branches:
      - main

  pull_request:
    branches:
      - main

permissions:
  contents: read
  id-token: write
  pages: write

jobs:
  build-deploy:
    uses: Home-Office-Digital/core-cloud-workflow-dac-actions/.github/workflows/build-deploy.yml@1.0.1
    with:
      working_directory: "."
      node_version: "24"
      path: "_site"
```

The actions can be used in a similar manner as well

```yml
jobs:
  deploy-site:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js and Pages
        uses: Home-Office-Digital/core-cloud-workflow-dac-actions/actions/setup@1.0.1
        with:
          node_version: "20"

      - name: Build and Upload Pages artifact
        uses: Home-Office-Digital/core-cloud-workflow-dac-actions/actions/build@1.0.1
        with:
          path: _site

      - name: Deploy to GitHub Pages
        id: deployment
        uses: Home-Office-Digital/core-cloud-workflow-dac-actions/actions/deploy@1.0.1
```
