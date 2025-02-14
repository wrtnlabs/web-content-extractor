import * as cheerio from "cheerio";
import { stripNonContentTags } from "./strip-non-content-tags.js";
import { computeTextDensity } from "./compute-text-density.js";
import { extractContentFromTextDensityMap } from "./extract-content.js";
import { extractText } from "./extract-text.js";

/**
 * Extracts content from an HTML string.
 *
 * @param html - The HTML string to extract content from
 *
 * @returns The extracted content
 */
export function extractContent(html: string): string {
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

  return text.trim();
}
