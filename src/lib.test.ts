import { expect, test } from "vitest";
import { extractContent } from "./lib.js";

test("content should be extracted correctly #1", () => {
  const html = `<html><body><h1>Hello, world!</h1></body></html>`;
  const text = extractContent(html);

  expect(text).toStrictEqual({
    content: "Hello, world!",
    links: [],
  });
});

test("content should be extracted correctly #2", () => {
  const html = `<html><body><nav><ul><li><a href="/">Home</a></li><li><a href="/about">About</a></li></ul></nav><h1>Hello, world!</h1><p>This is a test.</p></body></html>`;
  const text = extractContent(html);

  expect(text).toStrictEqual({
    content: "Hello, world! This is a test.",
    links: [],
  });
});

test("content should be extracted correctly #2", () => {
  const html = `<html><body><h1>Hello, world!</h1><p>This is a test.</p><p>And here is my blog: <a href="https://example.com">My Blog Link</a></p></body></html>`;
  const text = extractContent(html);

  expect(text).toStrictEqual({
    content: "Hello, world! This is a test. And here is my blog: My Blog Link",
    links: [{ url: "https://example.com", content: "My Blog Link" }],
  });
});
