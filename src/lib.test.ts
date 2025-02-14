import { expect, test } from "vitest";
import { extractContent } from "./lib.js";

test("content should be extracted correctly #1", () => {
  const html = `<html><body><h1>Hello, world!</h1></body></html>`;
  const text = extractContent(html);

  expect(text).toBe("Hello, world!");
});

test("content should be extracted correctly #2", () => {
  const html = `<html><body><nav><ul><li><a href="/">Home</a></li><li><a href="/about">About</a></li></ul></nav><h1>Hello, world!</h1><p>This is a test.</p></body></html>`;
  const text = extractContent(html);

  expect(text).toBe("Hello, world! This is a test.");
});
