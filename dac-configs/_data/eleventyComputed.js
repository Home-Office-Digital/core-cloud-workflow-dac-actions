import EleventyNavigation from "@11ty/eleventy-navigation";

// this file must be called eleventyComputed.js
// so it runs when every page is built rather than at the start

export default {
  options: {
    serviceNavigation: (data) => {
      // get navbar contents from top level of site's navigation tree
      const topLevel = EleventyNavigation.navigation.find(data.collections.navigation, data.options.homeKey);
      if (topLevel.length === 0) {
        return;
      }
      return {
        ...data.options.serviceNavigation,
        navigation: topLevel.map((item) => ({
          href: item.url,
          text: item.text || item.title
        }))
      };
    }
  }
};
