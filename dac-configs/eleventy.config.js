import { govukEleventyPlugin } from "@x-govuk/govuk-eleventy-plugin";
import { sortCollection, smart } from "@x-govuk/govuk-eleventy-plugin/filters";

// Override the default plugins behaviour when showing sub pages in the nav bar
// Supports 3-level nesting (parent > child > grandchild)
// Adds hasChildren flag for CSS indicators on collapsed items
function itemsFromNavigationFixed(eleventyNavigation, pageUrl = false, sort = false) {
    const navigationItems = [];
    const navigationData = sortCollection(eleventyNavigation, sort);

    navigationData.forEach((item) => {
        const isCurrentPage = pageUrl && item.url === pageUrl;
        const isChildPage = pageUrl && item.children?.some((child) => child.url === pageUrl);
        const isGrandchildPage = pageUrl && item.children?.some((child) =>
            child.children?.some((grandchild) => grandchild.url === pageUrl)
        );
        const isCurrentSection = isCurrentPage || isChildPage || isGrandchildPage ||
            (pageUrl && pageUrl.startsWith(item.url));

        const navigationItem = {
            current: isCurrentPage,
            parent: isCurrentSection,
            hasChildren: item.children && item.children.length > 0,
            href: item.url,
            text: smart(item.title),
            theme: item.data?.theme,
            children: item.children
                ? sortCollection(item.children, sort).map((child) => {
                    const isChildCurrent = pageUrl && child.url === pageUrl;
                    const isChildParent = child.children?.some((gc) => gc.url === pageUrl) ||
                        (pageUrl && pageUrl.startsWith(child.url));
                    return {
                        current: isChildCurrent,
                        parent: isChildParent || isChildCurrent,
                        hasChildren: child.children && child.children.length > 0,
                        href: child.url,
                        text: smart(child.title),
                        children: child.children
                            ? sortCollection(child.children, sort).map((grandchild) => ({
                                current: pageUrl && grandchild.url === pageUrl,
                                href: grandchild.url,
                                text: smart(grandchild.title)
                            }))
                            : false
                    };
                })
                : false
        };

        if (!isCurrentPage) {
            navigationItem.href = item.url;
        }

        navigationItems.push(navigationItem);
    });

    return navigationItems;
}

export default function eleventyConfigSetup(eleventyConfig) {

    const [githubRepositoryOwner, githubRepositoryName] = (process.env.GITHUB_REPOSITORY || '').split('/');
    const repoOwner = process.env.REPO_OWNER || githubRepositoryOwner || 'Home-Office-Digital';
    const repoName = process.env.REPO_NAME || githubRepositoryName || process.env.npm_package_name || '';
    const productName = process.env.PRODUCT_NAME || repoName || 'Documentation';

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

    const xgovukPluginOptions = {
        // Home Office branding
        stylesheets: ['/styles/base.css'],
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

    return {
        pathPrefix,
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        dir: {
            // The folder where all your content will live:
            input: './',
            includes: '_includes',
        }
    }
}
