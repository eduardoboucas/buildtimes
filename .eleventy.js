const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const moment = require("moment");
const slugify = require("@sindresorhus/slugify");
const striptags = require('striptags');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

function createExcerpt(value, maxLength) {
  const bits = value.split('<!--more-->');

  if (bits.length === 1) {
    const terminator = value.length > maxLength ? '…' : '';

    return value.substring(0, maxLength) + terminator;
  }

  return bits[0];
}

module.exports = eleventyConfig => {
  eleventyConfig.addCollection("homepage", collection => {
    const posts = collection
      .getAllSorted()
      .filter(item => {
        const { data } = item;

        if (!data.tags || data.queued) {
          return false;
        }

        if (!data.tags.includes("blog")) {
          return false;
        }

        item.data.page.metaTag = striptags(
          createExcerpt(item.template.frontMatter.content, 200).replace(/\n/g, '')
        );

        return true;
      })
      .reverse();

    const internalPosts = posts.filter(post => post.data.layout === "post");

    internalPosts.forEach((post, index) => {
      if (internalPosts[index - 1]) {
        post.data.page.next = {
          title: internalPosts[index - 1].data.title,
          url: internalPosts[index - 1].data.page.url
        };
      }
      
      if (internalPosts[index + 1]) {
        post.data.page.previous = {
          title: internalPosts[index + 1].data.title,
          url: internalPosts[index + 1].data.page.url
        };
      }
    });

    return posts;
  });

  eleventyConfig.addCollection("series", collection => {
    let previousItem;

    return collection.getAllSorted().filter(item => {
      if (item.data.series) {
        if (previousItem && previousItem.data.series === item.data.series) {
          previousItem.data.nextInSeries = item;
        }

        previousItem = item;
      } else {
        previousItem = undefined;
      }

      return item.data.series;
    });
  });

  eleventyConfig.addLiquidFilter("feature_title", title => {
    const MIN_LENGTH = 10;
    const MAX_LENGTH = 20;

    if (!title) return "";

    let currentLine = "";
    let lines = [];
    let words = title.split(" ");

    words.forEach(word => {
      if (currentLine.length + word.length <= MAX_LENGTH) {
        currentLine += word + " ";
      } else {
        lines.push(currentLine);

        currentLine = word + " ";
      }
    });

    if (currentLine.length < MIN_LENGTH) {
      lines[lines.length - 1] += currentLine;
    } else {
      lines.push(currentLine);
    }

    return `
      <span class="feature-title__full">${title}</span>

      ${lines
        .map(
          line => `
        <span aria-hidden="true" class="feature-title__part">${line.slice(
          0,
          -1
        )}</span>
      `
        )
        .join("")}
    `;
  });

  eleventyConfig.addLiquidFilter("fullDate", date => {
    const momentDate =
      typeof date === "number" ? moment(new Date(date * 1000)) : moment(date);

    return momentDate.format("MMMM Do, YYYY");
  });

  eleventyConfig.addLiquidFilter("excerpt", value => {
    const allowedTags = ['code', 'em', 'strong'];
    const excerpt = createExcerpt(value, 200);

    return striptags(excerpt, allowedTags);
  });

  const markdownItOptions = { html: true };
  const markdownItAnchorOptions = {
    permalinkClass: "heading-anchor",
    level: 1,
    permalink: true,
    permalinkBefore: true,
    slugify
  };
  const markdownItPlugin = markdownIt(markdownItOptions).use(
    markdownItAnchor,
    markdownItAnchorOptions
  );

  eleventyConfig.addLiquidFilter("markdownify", text => markdownItPlugin.render(text));

  eleventyConfig.setLibrary("md", markdownItPlugin);

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("posts");

  eleventyConfig.addPlugin(syntaxHighlight);

  return {
    passthroughFileCopy: true
  };
};
