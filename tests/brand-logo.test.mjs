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
  const html = renderToStaticMarkup(React.createElement(BrandLogo, { width: 250, priority: true }));
  assert.match(html, /style="width:250px"/);
  assert.equal(imageCalls.length, 2);
  assert.deepEqual(imageCalls.map((p) => p.src), ["/brand/everknitting-horizontal-cocoa.svg", "/brand/everknitting-horizontal-white.svg"]);
  for (const p of imageCalls) {
    assert.equal(p.alt, "Ever Knitting");
    assert.equal(p.width, 1288);
    assert.equal(p.height, 256);
    assert.equal(p.priority, true);
  }
  assert.equal(imageCalls[0].className, "block h-auto w-full dark:hidden");
  assert.equal(imageCalls[1].className, "hidden h-auto w-full dark:block");
});

test("footer uses the approved wider size without priority preloading", () => {
  imageCalls.length = 0;
  const html = renderToStaticMarkup(React.createElement(BrandLogo, { width: 256 }));
  assert.match(html, /style="width:256px"/);
  assert.ok(imageCalls.every((p) => p.priority === false));
});

test("approved concept A assets stay byte-identical", () => {
  const hashes = JSON.parse(readFileSync("tests/fixtures/brand-a-sha256.json", "utf8"));
  for (const [file, expected] of Object.entries(hashes)) {
    const bytes = readFileSync(file);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected, file);
    if (file.endsWith(".svg")) {
      const svg = bytes.toString("utf8");
      assert.doesNotMatch(svg, /<script|<foreignObject|<text\b|<image\b|\shref=/i, file);
      if (!file.includes("favicon") && !file.includes("app-icon")) {
        assert.doesNotMatch(svg, /<rect\b/i, file);
      }
    }
  }
});

test("header and footer use legible combined logos and native aspect ratios", () => {
  const header = readFileSync("components/sections/Header.tsx", "utf8");
  const footer = readFileSync("components/sections/Footer.tsx", "utf8");
  assert.match(header, /<BrandLogo width=\{250\} priority \/>/);
  assert.match(footer, /<BrandLogo width=\{256\} \/>/);
  assert.match(header, /h-\[72px\] sm:h-\[90px\]/);
  for (const variant of ["cocoa", "black", "white"]) {
    const svg = readFileSync(`public/brand/everknitting-horizontal-${variant}.svg`, "utf8");
    assert.match(svg, /viewBox="0 0 1288 256"/);
  }
});

test("favicon, app icons and SEO raster have their declared dimensions", () => {
  for (const [file, width, height] of [
    ["favicon-16x16.png", 16, 16], ["favicon-32x32.png", 32, 32],
    ["favicon-48x48.png", 48, 48], ["apple-touch-icon.png", 180, 180],
    ["icon-192.png", 192, 192], ["icon-512.png", 512, 512],
    ["logo.png", 1200, 239],
  ]) {
    const png = readFileSync(`public/${file}`);
    assert.equal(png.readUInt32BE(16), width, file);
    assert.equal(png.readUInt32BE(20), height, file);
  }
  const ico = readFileSync("app/favicon.ico");
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 3);
  for (const [index, size] of [16, 32, 48].entries()) {
    assert.equal(ico[6 + index * 16], size);
    assert.equal(ico[7 + index * 16], size);
  }
});

test("metadata and manifest reference installed brand assets", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");
  for (const url of ["/favicon.svg", "/favicon-32x32.png", "/favicon-16x16.png", "/apple-touch-icon.png", "/site.webmanifest"]) {
    assert.ok(layout.includes(`"${url}"`), url);
    assert.ok(readFileSync(`public${url}`).length > 0, url);
  }
  const manifest = JSON.parse(readFileSync("public/site.webmanifest", "utf8"));
  assert.equal(manifest.theme_color, "#4C352B");
  assert.equal(manifest.display, "browser");
  for (const icon of manifest.icons) assert.ok(readFileSync(`public${icon.src}`).length > 0);
  const schema = readFileSync("lib/schema.ts", "utf8");
  assert.match(schema, /url: `\$\{BASE_URL\}\/logo.png`,\s+width: 1200,\s+height: 239/);
});

test("existing public logo URLs use the approved artwork", () => {
  const cocoa = readFileSync("public/brand/everknitting-horizontal-cocoa.svg", "utf8");
  assert.equal(readFileSync("public/logo.svg", "utf8"), cocoa);
  assert.equal(readFileSync("public/brand/ever-knitting-cocoa.svg", "utf8"), cocoa);
  assert.equal(readFileSync("public/brand/ever-knitting-white.svg", "utf8"),
    readFileSync("public/brand/everknitting-horizontal-white.svg", "utf8"));
});

test("tablet navigation uses the drawer and the logo can fit narrow viewports", () => {
  const header = readFileSync("components/sections/Header.tsx", "utf8");
  assert.match(header, /window.innerWidth < 1280/);
  assert.match(header, /if \(!mobile\) \{\s+setMobileMenuOpen\(false\);\s+setHidden\(false\);/);
  assert.match(header, /hidden xl:flex flex-1/);
  assert.match(header, /xl:hidden p-2/);
  assert.match(header, /flex min-w-0 flex-col justify-center/);
  assert.match(source, /inline-block max-w-full shrink-0/);
  assert.doesNotMatch(header, /(?:shadow-2xl|backdrop-blur-sm) lg:hidden/);
});

test("header keeps theme-aware logo contrast over light and dark page heroes", () => {
  const header = readFileSync("components/sections/Header.tsx", "utf8");
  assert.match(header, /\? "bg-background\/90 backdrop-blur-md shadow-sm border-b border-border\/40"\s+: "bg-background\/90 backdrop-blur-md"/);
  assert.doesNotMatch(header, /"bg-transparent"/);
});
