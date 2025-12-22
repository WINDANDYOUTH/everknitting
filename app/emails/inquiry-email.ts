// app/emails/inquiry-email.ts
type Inquiry = {
  name?: string;
  email?: string;
  company?: string;
  productType?: string;
  material?: string;
  gauge?: string;
  quantity?: string;
  message?: string;
  // Optional extras:
  pageUrl?: string; // where the form was submitted (if you pass it)
  submittedAt?: string; // ISO or formatted date
};

const BRAND = {
  navy: "#2B3942",
  navyDeep: "#1E2A33",
  cashmere: "#EDE6D8",
  copper: "#B87333",
  wool: "#6F7477",
};

export function renderInquiryEmailHTML(data: Inquiry) {
  const safe = (v?: string) => escapeHtml((v ?? "").trim()) || "-";

  const rows: Array<[string, string]> = [
    ["Name", safe(data.name)],
    ["Email", safe(data.email)],
    ["Company / Brand", safe(data.company)],
    ["Product Type", safe(data.productType)],
    ["Material", safe(data.material)],
    ["Gauge", safe(data.gauge)],
    ["Quantity", safe(data.quantity)],
    ["Submitted At", safe(data.submittedAt)],
    ["Page", data.pageUrl ? `<a href="${escapeAttr(data.pageUrl)}" style="color:${BRAND.copper};text-decoration:none;">${escapeHtml(data.pageUrl)}</a>` : "-"],
  ];

  const message = escapeHtml(data.message || "-");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>New Inquiry — Ever Knitting</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.navyDeep};">
  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    New inquiry received — Ever Knitting Company Limited
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${BRAND.navyDeep};padding:0;margin:0;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <!-- Container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;border-collapse:collapse;">
          <!-- Header -->
          <tr>
            <td style="padding:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:18px 20px;border-radius:18px 18px 0 0;background:${BRAND.navy};">
                    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;letter-spacing:0.2px;">
                      <div style="color:${BRAND.cashmere};font-size:14px;opacity:0.85;">
                        Ever Knitting Company Limited
                      </div>
                      <div style="color:${BRAND.cashmere};font-size:20px;font-weight:700;line-height:1.2;margin-top:6px;">
                        New Inquiry — Start Your Project
                      </div>
                      <div style="color:${BRAND.wool};font-size:12px;line-height:1.4;margin-top:8px;">
                        Premium Cashmere &amp; Knitwear Manufacturer Since 1993
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Accent bar -->
                <tr>
                  <td style="height:4px;background:${BRAND.copper};"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="background:${BRAND.navy};padding:20px;border-radius:0 0 18px 18px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <!-- Summary chips -->
                <tr>
                  <td style="padding:0 0 14px 0;">
                    ${chip("Reply in 12–24h")}
                    ${chip("NDA Available")}
                    ${chip("OEM / ODM")}
                    ${chip("1.5gg–16gg")}
                  </td>
                </tr>

                <!-- Details table -->
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:rgba(237,230,216,0.04);border:1px solid rgba(111,116,119,0.35);border-radius:14px;">
                      ${rows
                        .filter(([_, v]) => v && v !== "-")
                        .map(([k, v]) => detailRow(k, v))
                        .join("")}
                    </table>
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="padding:16px 0 0 0;">
                    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:${BRAND.cashmere};font-size:14px;font-weight:700;margin-bottom:8px;">
                      Requirements / Message
                    </div>
                    <div style="background:rgba(237,230,216,0.04);border:1px solid rgba(111,116,119,0.35);border-radius:14px;padding:14px;">
                      <div style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;color:${BRAND.cashmere};font-size:13px;line-height:1.6;white-space:pre-wrap;">
                        ${message}
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- CTA row -->
                <tr>
                  <td style="padding:18px 0 0 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                      <tr>
                        <td style="padding-right:10px;">
                          ${primaryButton(
                            data.email ? `mailto:${escapeAttr(data.email)}?subject=${encodeURIComponent("Re: Ever Knitting Inquiry")}` : "#",
                            "Reply to Buyer"
                          )}
                        </td>
                        <td>
                          ${secondaryButton("mailto:info@everknitting.com", "Forward to Team")}
                        </td>
                      </tr>
                    </table>
                    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:${BRAND.wool};font-size:12px;line-height:1.5;margin-top:10px;">
                      Tip: Ask for target price, quantity per color/size, and reference links to speed up quoting.
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:18px 0 0 0;">
                    <div style="border-top:1px solid rgba(111,116,119,0.35);padding-top:14px;">
                      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:${BRAND.wool};font-size:12px;line-height:1.6;">
                        Ever Knitting Company Limited • Factory-direct knitwear OEM/ODM • Since 1993
                        <br/>
                        This message was generated from your website inquiry form.
                      </div>
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function chip(text: string) {
  return `<span style="
    display:inline-block;
    font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
    font-size:12px;
    color:${BRAND.cashmere};
    border:1px solid rgba(111,116,119,0.45);
    background:rgba(237,230,216,0.04);
    padding:6px 10px;
    border-radius:999px;
    margin:0 8px 8px 0;
  ">${escapeHtml(text)}</span>`;
}

function detailRow(label: string, valueHtml: string) {
  return `<tr>
    <td style="padding:10px 12px;border-bottom:1px solid rgba(111,116,119,0.25);width:180px;vertical-align:top;">
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;font-size:12px;color:${BRAND.wool};">
        ${escapeHtml(label)}
      </div>
    </td>
    <td style="padding:10px 12px;border-bottom:1px solid rgba(111,116,119,0.25);vertical-align:top;">
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;font-size:13px;color:${BRAND.cashmere};">
        ${valueHtml}
      </div>
    </td>
  </tr>`;
}

function primaryButton(href: string, text: string) {
  return `<a href="${escapeAttr(href)}" style="
    display:inline-block;
    font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
    font-size:13px;
    font-weight:700;
    color:${BRAND.navyDeep};
    background:${BRAND.copper};
    padding:10px 14px;
    border-radius:14px;
    text-decoration:none;
  ">${escapeHtml(text)}</a>`;
}

function secondaryButton(href: string, text: string) {
  return `<a href="${escapeAttr(href)}" style="
    display:inline-block;
    font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
    font-size:13px;
    font-weight:700;
    color:${BRAND.cashmere};
    background:rgba(237,230,216,0.06);
    border:1px solid rgba(111,116,119,0.45);
    padding:10px 14px;
    border-radius:14px;
    text-decoration:none;
  ">${escapeHtml(text)}</a>`;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(input: string) {
  // stricter for attributes/href
  return escapeHtml(input).replaceAll("`", "&#096;");
}
