import * as cheerio from "cheerio";
import { ElementType } from "domelementtype";
import * as domhandler from "domhandler";

/**
 * List of tags that are not content tags.
 */
const NON_CONTENT_TAGS = [
  "script",
  "noscript",
  "style",
  "nav",
  "header",
  "footer",
  // "aside",
  "img",
  "svg",
  // "figure",
  // "figcaption",
  "video",
  "audio",
  "form",
  "label",
  "input",
  // "textarea",
  "select",
  "option",
  "button",
  "object",
  "embed",
  "iframe",
  "canvas",
  "map",
  "area",
];

/**
 * Strips non-content tags from the HTML.
 *
 * It mutates the original HTML.
 *
 * @param $ - The cheerio instance
 */
export function stripNonContentTags($: cheerio.Cheerio<domhandler.Element>) {
  for (const tag of NON_CONTENT_TAGS) {
    $.find(tag).remove();
  }

  $.find("*")
    .contents()
    .filter(function () {
      return this.type === ElementType.Comment;
    })
    .remove();
}
