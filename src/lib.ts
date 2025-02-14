import * as cheerio from "cheerio";
import { ElementType } from "domelementtype";
import { computeTextDensity } from "./compute-text-density.js";
import { extractContentFromTextDensityMap } from "./extract-content.js";
import { extractText } from "./extract-text.js";
import { stripNonContentTags } from "./strip-non-content-tags.js";

/**
 * The extracted content.
 */
export interface ExtractedContent {
  /**
   * The content of the page.
   */
  content: string;

  /**
   * The links in the page.
   */
  links: string[];
}

/**
 * Extracts content from an HTML string.
 *
 * @param html - The HTML string to extract content from
 *
 * @returns The extracted content
 */
export function extractContent(html: string): ExtractedContent {
  const $ = cheerio.load(html);
  const body = $("body");

  stripNonContentTags(body);

  const root = body[0];
  const map = computeTextDensity(root);

  const contents = extractContentFromTextDensityMap(root, map);
  const text = contents
    .map((node) => extractText(node))
    .filter((str) => str.length !== 0)
    .join(" ");

  const content = text.trim();
  let links = [];

  for (const content of contents) {
    if (content.type !== ElementType.Tag) {
      continue;
    }

    if (content.name !== "a") {
      continue;
    }

    const link = content.attribs.href.trim();

    if (link.length === 0) {
      continue;
    }

    links.push(link);
  }

  return { content, links };
}
