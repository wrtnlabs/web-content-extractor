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
  "img",
  "svg",
  "video",
  "audio",
  "form",
  "label",
  "input",
  "select",
  "option",
  "button",
  "object",
  "embed",
  "iframe",
  "canvas",
  "map",
  "area",
  "picture",
  "source",
  "track",
  "wbr",
  "slot",
  "template",
  "datalist",
];

/**
 * Strips non-content tags from the HTML.
 *
 * It mutates the original HTML.
 *
 * @param $ - The cheerio instance
 */
export function stripNonContentTags($: cheerio.CheerioAPI) {
  for (const tag of NON_CONTENT_TAGS) {
    $(tag).remove();
  }

  $("*")
    .contents()
    .filter(function () {
      return this.type === ElementType.Comment;
    })
    .remove();
}
