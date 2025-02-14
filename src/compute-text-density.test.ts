import * as cheerio from "cheerio";
import { expect, test } from "vitest";
import { computeTextDensity } from "./compute-text-density.js";

test("density computation should correct", () => {
  const html = `<body><div>12345<p>67890</p></div></body>`;
  const $ = cheerio.load(html);

  const body = $("body")[0];
  const div = $("div")[0];
  const p = $("p")[0];
  const stats = computeTextDensity(body);

  expect(stats.get(body)!.density).toBe(5);
  expect(stats.get(div)!.density).toBe(10);
  expect(stats.get(p)!.density).toBe(5);
});
