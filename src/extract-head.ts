import * as cheerio from "cheerio";

export function extractTitle($: cheerio.CheerioAPI): string | undefined {
  const title = $("title").first().text();

  return title.trim().length > 0 ? title : undefined;
}

export function extractDescription($: cheerio.CheerioAPI): string | undefined {
  const description = $("meta[name='description']").first().attr("content");

  if (description == null) {
    return undefined;
  }

  return description.trim().length > 0 ? description : undefined;
}
