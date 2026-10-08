import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");

const source = readFileSync("components/ui/BrandLogo.tsx", "utf8");
const { outputText } = ts.transpileModule(source, {
  fileName: "BrandLogo.tsx",
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
  },
});
const loaded = { exports: {} };
const imageCalls = [];
const evaluate = vm.runInNewContext(
  `(function(require, module, exports) { ${outputText}\n })`,
  {},
);
evaluate((id) => id === "next/image" ? (props) => {
  imageCalls.push(props);
  const { priority, unoptimized, ...imageProps } = props;
  assert.equal(unoptimized, true);
  assert.equal(typeof priority, "boolean");
  return React.createElement("img", imageProps);
} : require(id), loaded, loaded.exports);
const { BrandLogo } = loaded.exports;

test("header logo has accessible text, native proportions and theme variants", () => {
  imageCalls.length = 0;
  const html = renderToStaticMarkup(React.createElement(BrandLogo, { width: 180, priority: true }));
  assert.match(html, /style="width:180px"/);
  assert.equal(imageCalls.length, 2);
  assert.deepEqual(imageCalls.map((p) => p.src), ["/brand/ever-knitting-cocoa.svg", "/brand/ever-knitting-white.svg"]);
  for (const p of imageCalls) {
    assert.equal(p.alt, "Ever Knitting");
    assert.equal(p.width, 644);
    assert.equal(p.height, 256);
    assert.equal(p.priority, true);
  }
  assert.equal(imageCalls[0].className, "block h-auto w-full dark:hidden");
  assert.equal(imageCalls[1].className, "hidden h-auto w-full dark:block");
});

test("footer uses the approved wider size without priority preloading", () => {
  imageCalls.length = 0;
  const html = renderToStaticMarkup(React.createElement(BrandLogo, { width: 216 }));
  assert.match(html, /style="width:216px"/);
  assert.ok(imageCalls.every((p) => p.priority === false));
});

test("approved SVG artwork stays byte-identical, transparent and self-contained", () => {
  const files = [
    ["cocoa", "bed2cc8959d6e86afa058ee93a690a34342ee8c519cba0d2473969b8f237367a"],
    ["white", "136cfffed8bd02c19d0cf43f6a6aa60afd6ecd8f2b5f317da8f7a60640eace73"],
  ];
  for (const [variant, expected] of files) {
    const bytes = readFileSync(`public/brand/ever-knitting-${variant}.svg`);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected);
    const svg = bytes.toString("utf8");
    assert.match(svg, /viewBox="0 0 644 256"/);
    assert.doesNotMatch(svg, /<script|<foreignObject|<text\b|<image\b|<rect\b|\shref=/i);
  }
});

test("header and footer select their approved sizes", () => {
  const header = readFileSync("components/sections/Header.tsx", "utf8");
  const footer = readFileSync("components/sections/Footer.tsx", "utf8");
  assert.match(header, /<BrandLogo width=\{180\} priority \/>/);
  assert.match(footer, /<BrandLogo width=\{216\} \/>/);
  // A 180px lockup is 71.6px high. The tagline becomes visible at sm, so
  // that breakpoint needs room too, not only the previous md breakpoint.
  assert.match(header, /h-\[72px\] sm:h-\[90px\]/);
});
