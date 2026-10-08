import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");

// Only mocked email is reachable from these tests. No credentials or real
// service requests are used, including the exact-limit attachment fixtures.
function loadTs(file, mocks = {}, env = {}, globals = {}) {
  const { outputText } = ts.transpileModule(readFileSync(resolve(file), "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: file,
  });
  const loaded = { exports: {} };
  const evaluate = vm.runInNewContext(
    `(function(require, module, exports, process) { ${outputText}\n })`,
    { console: { error() {}, warn() {} }, Error, ...globals },
    { filename: file },
  );
  evaluate((id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    throw new Error(`Unexpected module access in attachment test: ${id}`);
  }, loaded, loaded.exports, { env });
  return loaded.exports;
}

const limits = loadTs("lib/inquiry-attachments.ts");
const limit = limits.MAX_TOTAL_ATTACHMENT_SIZE;
const attachment = (size = 3, overrides = {}) => ({
  filename: "project.pdf",
  contentType: "application/pdf",
  base64: Buffer.alloc(size, 97).toString("base64"),
  size,
  ...overrides,
});
const parse = (items) => limits.parseInquiryAttachments(JSON.stringify(items));

function actionHarness(options = {}) {
  const calls = [];
  const templateCalls = [];
  let constructed = 0;
  const env = options.env ?? {
    RESEND_API_KEY: "unit-test-not-a-real-key",
    RESEND_FROM: "sender@example.test",
    INQUIRY_TO: "recipient@example.test",
  };
  const actions = loadTs("app/actions/send-inquiry.ts", {
    "resend": { Resend: class {
      constructor(key) {
        assert.equal(key, env.RESEND_API_KEY);
        constructed++;
        this.emails = { send: async (payload) => {
          calls.push(payload);
          if (options.throwError) throw new Error("Mock provider unavailable");
          return { error: options.error ?? null, data: { id: "mock-id" } };
        } };
      }
    } },
    "@/app/emails/inquiry-email": { renderInquiryEmailHTML: (data) => {
      templateCalls.push(data);
      return "<p>Mock inquiry</p>";
    } },
    "@/lib/inquiry-attachments": limits,
  }, env);
  return { ...actions, calls, templateCalls, constructed: () => constructed };
}

function form(attachments, extra = {}) {
  const data = new FormData();
  Object.entries({
    name: "Test User", email: "user@example.test", company: "Example Test",
    productType: "Cardigan", message: "Sample inquiry", _timestamp: String(Date.now() - 5000),
    ...extra,
  }).forEach(([key, value]) => data.set(key, value));
  if (attachments !== undefined) data.set("attachments", typeof attachments === "string" || attachments instanceof Blob ? attachments : JSON.stringify(attachments));
  return data;
}

async function assertRejectedBeforeSend(value) {
  const h = actionHarness();
  const result = await h.sendInquiryWithAttachments(null, form(value));
  assert.equal(result.ok, false);
  assert.ok(result.message);
  assert.equal(h.constructed(), 0, "invalid attachments must fail before loading provider");
  assert.equal(h.calls.length, 0);
}

test("shared limits retain binary MB and five-file policy", () => {
  assert.equal(limit, 10_485_760);
  assert.equal(limits.MAX_ATTACHMENT_SIZE, limit);
  assert.equal(limits.MAX_ATTACHMENT_FILES, 5);
  assert.equal(limits.ATTACHMENT_LIMIT_LABEL, "10MB");
});

test("canonical Base64 decoded sizes match independently decoded bytes", () => {
  for (let size = 0; size < 300; size++) {
    const item = attachment(size);
    const result = parse([item]);
    assert.equal(result.ok, true, `size ${size}`);
    assert.equal(result.attachments[0].size, Buffer.from(item.base64, "base64").length);
  }
});

test("one exact-limit file and multiple files totaling the limit reach mocked Resend", async () => {
  for (const sizes of [[limit - 1], [limit], [6 * 1024 * 1024, 4 * 1024 * 1024], Array(5).fill(limit / 5)]) {
    const items = sizes.map((size, i) => attachment(size, { filename: `project-${i}.pdf` }));
    const h = actionHarness();
    const result = await h.sendInquiryWithAttachments(null, form(items));
    assert.equal(result.ok, true);
    assert.match(result.message, /12–24 hours/);
    assert.equal(h.calls.length, 1);
    assert.equal(h.calls[0].attachments.length, sizes.length);
    h.calls[0].attachments.forEach((actual, i) => {
      assert.equal(actual.content, items[i].base64);
      assert.equal(Buffer.from(actual.content, "base64").length, sizes[i]);
      assert.equal(actual.filename, items[i].filename);
    });
    assert.equal(h.calls[0].from, "sender@example.test");
    assert.equal(h.calls[0].to[0], "recipient@example.test");
    assert.equal(h.calls[0].replyTo, "user@example.test");
    assert.equal(h.templateCalls[0].attachmentCount, sizes.length);
  }
});

test("actual decoded sizes reject one byte over even with forged metadata", async () => {
  for (const item of [attachment(limit + 1), attachment(limit + 1, { size: limit }), attachment(limit + 3, { size: 1 })]) {
    await assertRejectedBeforeSend([item]);
  }
  await assertRejectedBeforeSend([attachment(limit), attachment(1)]);
});

test("malformed JSON, invalid shapes, invalid metadata and six files never send", async () => {
  const cases = [
    "{", "null", "true", "12", '"text"', "{}", '[null]', '[[]]',
    [attachment(3, { size: "3" })], [attachment(3, { size: -1 })],
    [attachment(3, { size: 1.5 })], [attachment(3, { size: null })],
    [attachment(3, { size: Number.MAX_SAFE_INTEGER + 1 })],
    [attachment(3, { size: 2 })], [attachment(3, { size: 4 })],
    [attachment(3, { base64: null })], [attachment(3, { filename: 5 })],
    [attachment(3, { filename: " " })], [attachment(3, { filename: "a".repeat(256) })],
    [attachment(3, { filename: "../a.pdf" })], [attachment(3, { filename: "a\\b.pdf" })],
    [attachment(3, { filename: "a\n.pdf" })], [attachment(3, { contentType: "application/x-msdownload" })],
    [attachment(3, { contentType: null })], Array(6).fill(attachment()),
    new Blob(["[]"], { type: "application/json" }),
  ];
  for (const value of cases) await assertRejectedBeforeSend(value);
});

test("invalid Base64, noncanonical padding and data URLs never send", async () => {
  for (const base64 of ["a", "YQ", "YQ=", "YQ===", "Y Q==", "YQ==\n", "YQ==YQ==", "====", "!!!!", "data:application/pdf;base64,YQ==", "-_==", "YR==", "YWJ=", "漢字漢字"]) {
    await assertRejectedBeforeSend([attachment(1, { base64 })]);
  }
});

test("oversized attachment JSON is rejected before JSON parsing", () => {
  const result = limits.parseInquiryAttachments(" ".repeat(limits.INQUIRY_ACTION_BODY_SIZE_LIMIT + 1));
  assert.equal(result.ok, false);
  assert.match(result.message, /10MB/);
});

test("all existing allowed MIME types remain accepted", () => {
  for (const contentType of limits.ALLOWED_ATTACHMENT_TYPES) {
    assert.equal(parse([attachment(1, { contentType })]).ok, true, contentType);
    assert.equal(limits.attachmentMetadataError("project.pdf", contentType, limit), null);
  }
});

test("omitted, empty and empty-array optional attachments preserve no-attachment delivery", async () => {
  for (const value of [undefined, "", []]) {
    const h = actionHarness();
    const result = await h.sendInquiryWithAttachments(null, form(value));
    assert.equal(result.ok, true);
    assert.equal(h.calls.length, 1);
    assert.equal(h.calls[0].attachments, undefined);
    assert.equal(h.templateCalls[0].attachmentCount, 0);
  }
});

test("anti-spam and required inquiry validation still run before any delivery", async () => {
  for (const extra of [
    { _website: "spam" }, { _timestamp: String(Date.now()) },
    { _timestamp: String(Date.now() - 3_700_000) },
    { email: "not-an-email" }, { email: "a@b" }, { productType: "", message: "" },
    { message: "casino" }, { message: "https://a https://b https://c https://d" },
    { message: "x".repeat(5001) },
  ]) {
    const h = actionHarness();
    assert.equal((await h.sendInquiryWithAttachments(null, form([attachment()], extra))).ok, false);
    assert.equal(h.calls.length, 0);
  }
});

test("missing configuration and provider failures remain clear failures", async () => {
  for (const missing of ["RESEND_API_KEY", "RESEND_FROM", "INQUIRY_TO"]) {
    const env = { RESEND_API_KEY: "mock", RESEND_FROM: "sender@example.test", INQUIRY_TO: "recipient@example.test" };
    delete env[missing];
    const h = actionHarness({ env });
    const result = await h.sendInquiryWithAttachments(null, form([attachment()]));
    assert.equal(result.ok, false);
    assert.match(result.message, /configuration error/);
    assert.equal(h.calls.length, 0);
  }
  for (const options of [{ error: { message: "maximum size exceeded" } }, { error: { message: "provider unavailable" } }, { throwError: true }]) {
    const h = actionHarness(options);
    const result = await h.sendInquiryWithAttachments(null, form([attachment()]));
    assert.equal(result.ok, false);
    assert.match(result.message, /info@everknitting.com/);
    assert.equal(h.calls.length, 1);
  }
});

test("transport configuration fits exact-limit Base64, JSON and multipart overhead", async () => {
  const config = loadTs("next.config.ts", {
    "next-intl/plugin": () => (config) => config,
    "./lib/inquiry-attachments": limits,
  }).default;
  const transportLimit = config.experimental.serverActions.bodySizeLimit;
  assert.equal(transportLimit, 16 * 1024 * 1024);
  // Serialize a realistic React Server Action FormData envelope, with all fields
  // at their visible maximum lengths, including Unicode and five long filenames.
  const fields = form(Array(5).fill(attachment(limit / 5, { filename: "項".repeat(251) + ".pdf" })), {
    name: "名".repeat(100), email: `${"a".repeat(187)}@example.test`,
    company: "社".repeat(200), productType: "衣".repeat(200),
    gauge: "針".repeat(100), quantity: "数".repeat(300), message: "編".repeat(5000),
  });
  const envelope = new FormData();
  for (const [key, value] of fields) envelope.set(`1_${key}`, value);
  envelope.set("0", '[null,"$K1"]');
  const request = new Request("http://localhost:3000/en/contact-us", { method: "POST", body: envelope });
  const body = await request.arrayBuffer();
  assert.ok(body.byteLength > limit, "Base64 cannot fit a 10 MiB transport cap");
  assert.ok(body.byteLength < transportLimit, `serialized request ${body.byteLength} must fit`);
});

// This source-level guard is intentionally version-specific: next-on-pages runs
// Edge routes, where Next 15.2.9 does not enforce the Node transport setting.
// The action validation above must remain the actual decoded-file boundary.
test("pinned Next runtime behavior and Edge contact route are documented accurately", () => {
  assert.equal(require("next/package.json").version, "15.2.9");
  const handler = readFileSync(require.resolve("next/dist/server/app-render/action-handler"), "utf8");
  const edgeStart = handler.lastIndexOf("process.env.NEXT_RUNTIME === 'edge'", handler.indexOf("TODO: add body limit"));
  const nodeStart = handler.indexOf("process.env.NEXT_RUNTIME !== 'edge'", edgeStart);
  const edge = handler.slice(edgeStart, nodeStart);
  assert.match(edge, /TODO: add body limit/);
  assert.match(edge, /req\.request\.formData\(\)/);
  assert.doesNotMatch(edge, /bodySizeLimitBytes/);
  assert.match(handler.slice(nodeStart), /Body exceeded/);
  assert.match(readFileSync("app/[locale]/(website)/contact-us/page.tsx", "utf8"), /runtime = 'edge'/);
});

function componentHarness() {
  const React = require("react");
  const slots = [];
  let cursor = 0;
  const readers = [];
  const submissions = [];
  const analytics = [];
  let result = { ok: true, message: "Sent!" };
  let resetCount = 0;
  let tree;
  const formNode = {
    values: { email: "user@example.test", productType: "Cardigan", message: "Sample inquiry" },
    reset() { resetCount++; },
  };
  const inputNode = { value: "fake-selected-file", click() {} };
  const hooks = {
    ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === "function" ? initial() : initial;
      return [slots[index], (value) => { slots[index] = typeof value === "function" ? value(slots[index]) : value; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useCallback(fn) { return fn; },
  };
  class MockFileReader {
    readAsDataURL(file) { this.file = file; readers.push(this); }
  }
  class MockFormData extends FormData {
    constructor(node) {
      super();
      for (const [key, value] of Object.entries(node.values)) this.set(key, value);
    }
  }
  const component = loadTs("components/sections/ContactForm.tsx", {
    "react": hooks,
    "react/jsx-runtime": require("react/jsx-runtime"),
    "lucide-react": Object.fromEntries(["Loader2", "CheckCircle", "AlertCircle", "Upload", "X", "FileText", "Mail", "AlertTriangle"].map((name) => [name, name])),
    "@/app/actions/send-inquiry": { sendInquiryWithAttachments: async (_previous, data) => {
      submissions.push(data);
      const response = await result;
      if (response instanceof Error) throw response;
      return response;
    } },
    "@/components/analytics": { trackFormSubmission: (data) => analytics.push(data) },
    "@/lib/utils": { cn: (...values) => values.filter(Boolean).join(" ") },
    "@/lib/inquiry-attachments": limits,
  }, {}, { FileReader: MockFileReader, FormData: MockFormData });
  const nodes = (value) => {
    if (Array.isArray(value)) return value.flatMap(nodes);
    if (!value || typeof value !== "object") return [];
    return [value, ...nodes(value.props?.children)];
  };
  const find = (predicate) => {
    const node = nodes(tree).find(predicate);
    assert.ok(node, "Expected component node");
    return node;
  };
  const render = () => {
    cursor = 0;
    tree = component.ContactForm();
    find((node) => node.type === "form").props.ref.current = formNode;
    find((node) => node.props?.type === "file").props.ref.current = inputNode;
    return tree;
  };
  const visibleText = (value) => {
    if (Array.isArray(value)) return value.map(visibleText).join("");
    if (typeof value === "string" || typeof value === "number") return String(value);
    return value?.props ? visibleText(value.props.children) : "";
  };
  render();
  return {
    render, find, visibleText: () => visibleText(tree), readers, submissions, analytics, inputNode,
    resetCount: () => resetCount,
    setResult: (value) => { result = value; },
    select: (files) => find((node) => node.props?.type === "file").props.onChange({ target: { files } }),
    submit: () => find((node) => node.type === "form").props.onSubmit({ preventDefault() {}, currentTarget: formNode }),
    finishRead(index, error) {
      if (error) readers[index].onerror(error);
      else {
        readers[index].result = `data:${readers[index].file.type};base64,YQ==`;
        readers[index].onload();
      }
    },
  };
}

const browserFile = (size = 1, name = "project.pdf", type = "application/pdf") => ({ size, name, type });

test("visible upload instructions share the 10MB total and single-file allowance", () => {
  const h = componentHarness();
  assert.match(h.visibleText(), /Max 10MB total per inquiry.*Up to 5 files/);
  assert.match(h.visibleText(), /A single file can use the full 10MB limit/);
  assert.doesNotMatch(h.visibleText(), /5MB\/file/);
  assert.equal(h.find((node) => node.props?.name === "quantity").props.placeholder, "Quantity per color and size, color count, and size range");
});

test("client accepts one full-limit file, blocks concurrent selection and submission while reading", async () => {
  const h = componentHarness();
  const selection = h.select([browserFile(limit)]);
  assert.equal(h.readers.length, 1);
  await h.select([browserFile(1, "second.pdf")]);
  await h.submit();
  assert.equal(h.readers.length, 1);
  assert.equal(h.submissions.length, 0);
  h.render();
  assert.equal(h.find((node) => node.props?.type === "submit").props.disabled, true);
  assert.equal(h.find((node) => node.props?.type === "file").props.disabled, true);
  h.finishRead(0);
  await selection;
  h.render();
  assert.equal(h.inputNode.value, "", "the same file can be selected again after removal");
  assert.equal(h.find((node) => node.props?.type === "submit").props.disabled, false);
  assert.match(h.visibleText(), /1\/5 files.*10.0 MB\/10.0 MB/);
  await h.select([browserFile(1, "second.pdf")]);
  h.render();
  assert.match(h.visibleText(), /Total size would exceed 10MB limit/);
  assert.equal(h.readers.length, 1);
});

test("client rejects over-limit files and unsupported types before reading", async () => {
  const h = componentHarness();
  await h.select([browserFile(limit + 1), browserFile(1, "app.exe", "application/x-msdownload")]);
  h.render();
  assert.match(h.visibleText(), /File exceeds the 10MB limit/);
  assert.match(h.visibleText(), /File type not supported/);
  assert.equal(h.readers.length, 0);
});

test("client shares 10MB between multiple files and preserves the five-file cap", async () => {
  const h = componentHarness();
  const selection = h.select(Array.from({ length: 6 }, (_, i) => browserFile(limit / 5, `project-${i}.pdf`)));
  for (let i = 0; i < 5; i++) {
    h.finishRead(i);
    await Promise.resolve();
  }
  await selection;
  h.render();
  assert.equal(h.readers.length, 5);
  assert.match(h.visibleText(), /5\/5 files.*10.0 MB\/10.0 MB/);
  assert.match(h.visibleText(), /Maximum 5 files allowed/);
});

test("read failures unlock controls and removal allows a same-file retry", async () => {
  const h = componentHarness();
  let selection = h.select([browserFile()]);
  h.finishRead(0, new Error("Mock read failure"));
  await selection;
  h.render();
  assert.match(h.visibleText(), /Failed to read/);
  assert.equal(h.find((node) => node.props?.type === "submit").props.disabled, false);
  selection = h.select([browserFile()]);
  h.finishRead(1);
  await selection;
  h.render();
  h.find((node) => node.props?.["aria-label"] === "Remove project.pdf").props.onClick({ stopPropagation() {} });
  h.render();
  assert.doesNotMatch(h.visibleText(), /1\/5 files/);
  selection = h.select([browserFile()]);
  h.finishRead(2);
  await selection;
  h.render();
  assert.match(h.visibleText(), /1\/5 files/);
});

test("duplicate submit is prevented; provider failure preserves attachments; success resets and tracks once", async () => {
  const h = componentHarness();
  const selection = h.select([browserFile()]);
  h.finishRead(0);
  await selection;
  h.render();
  let resolveResult;
  h.setResult(new Promise((resolve) => { resolveResult = resolve; }));
  const pending = h.submit();
  await h.submit();
  assert.equal(h.submissions.length, 1);
  h.render();
  assert.equal(h.find((node) => node.props?.type === "submit").props.disabled, true);
  assert.equal(h.find((node) => node.props?.["aria-label"] === "Remove project.pdf").props.disabled, true);
  resolveResult({ ok: false, message: "Mock provider error" });
  await pending;
  h.render();
  assert.match(h.visibleText(), /Mock provider error/);
  assert.match(h.visibleText(), /1\/5 files/);
  assert.equal(h.resetCount(), 0);
  assert.equal(h.analytics.length, 0);
  h.setResult(new Error("Mock transport rejected"));
  await h.submit();
  h.render();
  assert.match(h.visibleText(), /Failed to send/);
  assert.match(h.visibleText(), /1\/5 files/);
  h.setResult({ ok: true, message: "Sent!" });
  await h.submit();
  h.render();
  assert.doesNotMatch(h.visibleText(), /1\/5 files/);
  assert.equal(h.resetCount(), 1);
  assert.equal(h.analytics.length, 1);
  const attachmentData = JSON.parse(h.submissions[2].get("attachments"));
  assert.equal(attachmentData[0].filename, "project.pdf");
  assert.equal(attachmentData[0].size, 1);
});
