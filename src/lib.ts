import * as cheerio from "cheerio";
import { computeTextDensity } from "./compute-text-density.js";
import { extractContentFromTextDensityMap } from "./extract-content.js";
import { extractDescription, extractTitle } from "./extract-head.js";
import { extractLink, Link } from "./extract-link.js";
import { extractText } from "./extract-text.js";
import { stripNonContentTags } from "./strip-non-content-tags.js";

/**
 * The extracted content.
 */
export interface ExtractedContent {
  /**
   * The title of the page.
   */
  title?: string;

  /**
   * The description of the page.
   */
  description?: string;

  /**
   * The content of the page.
   */
  content: string;

  /**
   * The list of content HTMLs.
   *
   * Each element is the fragment (HTML subtree) serialized as a string that is
   * part of the `content`.
   *
   * It is useful if you need to access to the original HTML of the content
   * you extracted.
   */
  contentHtmls: string[];

  /**
   * The links in the page.
   */
  links: Link[];
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
    .sort((a, b) => map.get(a)!.order - map.get(b)!.order)
    .map((node) => extractText(node))
    .filter((str) => str.length !== 0)
    .join(" ");

  const content = text.trim();

  const contentHtmls = contents.map((node) =>
    cheerio.load(node, null, false).html()
  );
  const links = extractLink(contents);

  const title = extractTitle($);
  const description = extractDescription($);

  return { title, description, content, contentHtmls, links };
}
