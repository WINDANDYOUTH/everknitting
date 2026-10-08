import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const read = (path) => readFileSync(path, "utf8");
const locales = ["en", "de", "fr", "es", "it"];
const messages = locales.map((locale) => [locale, JSON.parse(read(`messages/${locale}.json`))]);

function loadData(file) {
  const { outputText } = ts.transpileModule(read(file), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports }, { filename: file });
  return exports;
}

function strings(value) {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

function publicSources(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const path = `${directory}/${item.name}`;
    if (item.isDirectory()) return publicSources(path);
    return /\.(?:ts|tsx|json|mdx)$/.test(path) ? [path] : [];
  });
}

test("old founding years and reply promises are absent from public source", () => {
  for (const path of ["app", "components", "lib", "messages", "content"].flatMap(publicSources)) {
    const text = read(path);
    assert.doesNotMatch(text, /\b(?:1993|2008)\b|30\+\s*(?:years|Jahre|ans|años|anni)|15\+\s*years|last 15 years/i, path);
    assert.doesNotMatch(text, /Instant response|within 15 minutes|respond within 24 hours/i, path);
  }
  assert.match(read("lib/schema.ts"), /foundingDate: "2009"/);
});

test("all locale messages keep the confirmed year, reply window and group capacity", () => {
  for (const [locale, data] of messages) {
    assert.match(data.hero.titleHighlight, /2009/, locale);
    assert.match(data.hero.badges.experience, /2009/, locale);
    assert.match(data.footer.tagline, /2009/, locale);
    assert.match(data.about.heroSubtitle, /2009/, locale);
    assert.match(data.about.storyP2, /2009/, locale);
    assert.match(data.hero.ctaNote, /12–24/, locale);
    assert.match(data.hero.badges.moq, /100/, locale);
    assert.match(data.about.storyP2, /group|Unternehmensgruppe|groupe|grupo|gruppo/, locale);
    assert.match(data.about.storyP2, /10 (?:million|Millionen|millions|millones|milioni)/, locale);
  }
  assert.match(read("app/[locale]/(website)/about-us/page.tsx"), /t\('storyP2'\)/);
  assert.match(read("app/[locale]/(website)/contact-us/page.tsx"), /t\('heroSubtitle'\)/);
  assert.doesNotMatch(read("app/[locale]/(website)/contact-us/page.tsx"), /startup launching your first collection/);
  const audiences = {
    en: "established apparel brands",
    de: "etablierte Bekleidungsmarken",
    fr: "marques de vêtements établies",
    es: "marcas de ropa consolidadas",
    it: "marchi di abbigliamento affermati",
  };
  for (const [locale, data] of messages) {
    assert.ok(data.contact.heroSubtitle.includes(audiences[locale]), locale);
  }
  assert.match(read("components/sections/HeroSection.tsx"), /\{t\("subtitle"\)\}\{" "\}/);
});

test("English commercial references preserve units, negotiability and qualified timings", () => {
  const { COMPANY_FACTS: f } = loadData("lib/company-facts.ts");
  assert.equal(f.foundingYear, "2009");
  assert.equal(f.responseTime, "12–24 hours");
  assert.match(f.audience, /established apparel brands/);
  assert.match(f.moq, /100 pieces per color, per size/);
  assert.match(f.moq, /negotiable.*each project/);
  assert.match(f.sampling, /1–7 days.*subject to/);
  assert.match(f.bulk, /15 days to 2 months/);
  assert.match(f.bulk, /confirmed for each order.*quantity, process and requirements/);
  assert.equal(f.groupCapacity, "Our group has annual production capacity of 10 million pieces.");
});

test("product, service and industry MOQ copy never combines color/size quantities", () => {
  for (const file of ["app/data/products.ts", "app/data/services.ts", "app/data/industries.ts"]) {
    for (const text of strings(loadData(file))) {
      if (!/MOQ|minimum order/i.test(text) || !/\b100\b/.test(text)) continue;
      assert.match(text, /100 (?:pieces|pcs) per color,? per size/i, `${file}: ${text}`);
      assert.match(text, /negotiable|discuss|agreed|confirmed/i, `${file}: ${text}`);
    }
    assert.doesNotMatch(read(file), /(?:7[–-]14|10[–-]15|30[–-]45|30[–-]40|45[–-]60) days/);
  }
});
