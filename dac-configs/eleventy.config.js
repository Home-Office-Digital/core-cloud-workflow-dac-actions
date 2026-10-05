import fs from "node:fs/promises";
import path from "node:path";
import commonJs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { rollup } from "rollup";
import { govukEleventyPlugin } from "@x-govuk/govuk-eleventy-plugin";
import { sortCollection, smart } from "@x-govuk/govuk-eleventy-plugin/filters";

// Override the default plugin behaviour when showing sub pages in the nav bar.
// Recursive version: supports arbitrary nesting depth (section > child >
// grandchild > great-grandchild > ...) so the sidebar renders the full tree.
// Each item carries `current` (is this the page), `parent` (is the current page
// this item or a descendant — i.e. expand its children) and `hasChildren`.
// Paired with the recursing sub-navigation macro in _includes.
function isCurrentOrDescendantPage(pageUrl, navigationUrl) {
    if (typeof pageUrl !== "string") {
        return false;
    }
    return pageUrl === navigationUrl || pageUrl.startsWith(`${navigationUrl}/`);
}

// Does pageUrl match this item or any item nested beneath it?
function subtreeContainsPage(item, pageUrl) {
    if (!pageUrl) {
        return false;
    }
    if (item.url === pageUrl) {
        return true;
    }
    return (item.children || []).some((child) => subtreeContainsPage(child, pageUrl));
}

function mapNavigationItem(item, pageUrl, sort) {
    const isCurrentPage = Boolean(pageUrl && item.url === pageUrl);
    const containsPage = (item.children || []).some((child) =>
        subtreeContainsPage(child, pageUrl)
    );
    const isCurrentSection =
        isCurrentPage || containsPage || isCurrentOrDescendantPage(pageUrl, item.url);

    return {
        current: isCurrentPage,
        // `parent` drives whether the template expands this item's children.
        parent: isCurrentSection,
        hasChildren: Boolean(item.children && item.children.length > 0),
        href: item.url,
        text: smart(item.title),
        theme: item.data?.theme,
        children: item.children
            ? sortCollection(item.children, sort).map((child) =>
                mapNavigationItem(child, pageUrl, sort)
            )
            : false,
    };
}

function itemsFromNavigationFixed(eleventyNavigation, pageUrl = false, sort = false) {
    const navigationData = sortCollection(eleventyNavigation, sort);
    return navigationData.map((item) => mapNavigationItem(item, pageUrl, sort));
}

export default function eleventyConfigSetup(eleventyConfig) {

    const [githubRepositoryOwner, githubRepositoryName] = (process.env.GITHUB_REPOSITORY || '').split('/');
    const repoOwner = process.env.REPO_OWNER || githubRepositoryOwner || 'Home-Office-Digital';
    const repoName = process.env.REPO_NAME || githubRepositoryName || process.env.npm_package_name || '';
    const productName = process.env.PRODUCT_NAME || repoName || 'Documentation';

    // whether to turn \n into <br> inside paragraphs
    // mainly useful if your site has postal addresses or poems
    const markdownBreaks = process.env.MARKDOWN_BREAKS === 'true';

    /** This should match the public site URL when the docs are deployed.
      * For example when using a GitHub action to deploy to GitHub pages:
      * 
      * ```javascript
      * const url = process.env.GITHUB_ACTIONS
      *    ? `https://ukhomeoffice.github.io/${repoName}/`
      *    : '/';
      */
    const url = '/';

        /** If the site is not hosted in the root of the host domain, this should be
      * the path to the root of the site.
      * 
      * For example when using a GitHub action to deploy to GitHub pages:
      * 
      * ```javascript
      * const pathPrefix = process.env.GITHUB_ACTIONS
      *    ? `/${repoName}/`
      *    : '/';
      */
    const pathPrefix = '/';

    eleventyConfig.addPassthroughCopy({ "assets/logos": "assets/logos"});
    eleventyConfig.addPassthroughCopy({ "assets/images": "assets/images"});
    eleventyConfig.addPassthroughCopy({ "assets/scripts": "assets/scripts"});

    // Set dir config BEFORE adding the plugin so getLayoutTemplates can detect user layout overrides
    eleventyConfig.dir = {
        input: './',
        includes: '_includes',
    };

    const xgovukPluginOptions = {
        // Home Office branding
        stylesheets: ['/styles/base.css'],

        markdown: {
            breaks: markdownBreaks,
        },

        // Load the plugin's own application.js (defines the <app-search> search
        // component) AND the Mermaid renderer. NOTE: setting `scripts` disables
        // the plugin's built-in application.js generation, so we regenerate it
        // ourselves in the eleventy.after hook below (see generateApplicationJs).
        scripts: ['/assets/application.js', '/assets/scripts/mermaid-init.js'],

        templates: {
            searchIndex: {
                permalink: '/search.json'
            }
        },
        icons: {
            mask: '/assets/logos/ho-mask-icon.svg',
            shortcut: '/assets/logos/ho-favicon.ico',
            touch: '/assets/logos/ho-apple-touch-icon.png'
        },
        opengraphImageUrl: '/assets/logos/ho-opengraph-image.png',
        homeKey: 'Home',
        header: {
            logotype: {
                html:
                    '<span class="govuk-header__logotype">' +
                    '  <img src="/assets/logos/ho_logo.svg" height="34px" alt="Home Office Logo">' +
                    '  <span class="govuk-header__logotype-text">Home Office</span>' +
                    '</span>'
            },
            productName,
            organisationName: 'Home Office',
            search: {
                label: 'Search site',
                indexPath: '/search.json',
                sitemapPath: '/sitemap.html'
            }
        },
        footer: {
            copyright: {
                html: `© <a class="govuk-footer__link" href="https://github.com/${repoOwner}/${repoName}/blob/main/LICENSE.md">Crown Copyright (Home Office)</a>`
            },
        },
        pathPrefix,
        url,
    }

    eleventyConfig.addPlugin(govukEleventyPlugin, xgovukPluginOptions);

    eleventyConfig.addPlugin((cfg) => {
        cfg.addFilter('itemsFromNavigation', itemsFromNavigationFixed);
    });

    // Because we set `scripts` above (to add the Mermaid renderer), the plugin
    // skips generating its own application.js — the file that registers the
    // <app-search> search component. Regenerate it here so search still works.
    eleventyConfig.on('eleventy.after', async ({ dir }) => {
        const outputDir = dir?.output || '_site';
        const pluginSrc = path.join(
            'node_modules', '@x-govuk', 'govuk-eleventy-plugin', 'src', 'application.js'
        );
        try {
            const bundle = await rollup({
                input: pluginSrc,
                context: 'window',
                plugins: [nodeResolve(), commonJs(), terser({ format: { comments: false } })],
            });
            const { output } = await bundle.generate({ format: 'es' });
            await bundle.close();
            await fs.mkdir(path.join(outputDir, 'assets'), { recursive: true });
            await fs.writeFile(path.join(outputDir, 'assets', 'application.js'), output[0].code);
        } catch (error) {
            console.error('Failed to generate application.js:', error);
        }
    });

    return {
        pathPrefix,
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        dir: eleventyConfig.dir,
    }
}
