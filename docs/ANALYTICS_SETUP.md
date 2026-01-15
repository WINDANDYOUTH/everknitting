# Analytics & Webmaster Tools Setup Guide

This document explains how to configure Google Analytics 4 (GA4), Google Tag Manager (GTM), Bing Webmaster Tools, and other analytics platforms for Ever Knitting.

## Architecture Overview

We use **Google Tag Manager (GTM)** as the central hub for all analytics and tracking. This approach offers:

- ✅ **Centralized management**: Add/remove/modify tags without code changes
- ✅ **Future-proof**: Easy to add Bing, Facebook Pixel, LinkedIn Insight, etc.
- ✅ **Version control**: GTM provides versioning and rollback
- ✅ **No developer needed**: Marketing team can manage tags independently

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR WEBSITE                           │
│                 (Google Tag Manager)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │   GA4    │    │   Bing   │    │ Facebook │
    │          │    │ Webmaster│    │  Pixel   │
    └──────────┘    └──────────┘    └──────────┘
```

## Step 1: Set Up Google Tag Manager

### 1.1 Create GTM Account

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click "Create Account"
3. Fill in:
   - **Account Name**: `Ever Knitting`
   - **Country**: Select your country
4. Create Container:
   - **Container name**: `everknitting.com`
   - **Target platform**: `Web`
5. Accept Terms of Service

### 1.2 Get Your GTM ID

After creating the container, you'll see a code snippet. Look for the ID that starts with `GTM-` (e.g., `GTM-XXXXXXX`).

### 1.3 Add GTM ID to Environment

Add to your `.env` and `.env.local` files:

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**Important**: Also add this to your Cloudflare Pages environment variables:

1. Go to Cloudflare Dashboard → Pages → ever-knitting → Settings → Environment variables
2. Add `NEXT_PUBLIC_GTM_ID` with your GTM ID

## Step 2: Set Up Google Analytics 4 in GTM

### 2.1 Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" (gear icon)
3. Click "Create Property"
4. Fill in property details:
   - **Property name**: `Ever Knitting Website`
   - **Time zone**: Your business timezone
   - **Currency**: Your business currency
5. Click "Create"

### 2.2 Create Web Data Stream

1. In the new property, click "Data Streams"
2. Click "Add stream" → "Web"
3. Enter your website URL
4. Enable "Enhanced measurement" (tracks page views, scrolls, outbound clicks, etc.)
5. Copy the **Measurement ID** (e.g., `G-XXXXXXXXXX`)

### 2.3 Connect GA4 to GTM

In Google Tag Manager:

1. Click "Tags" → "New"
2. Click "Tag Configuration"
3. Select "Google Analytics: GA4 Configuration"
4. Enter your Measurement ID (`G-XXXXXXXXXX`)
5. Click "Triggering"
6. Select "All Pages"
7. Name your tag: `GA4 - Configuration`
8. Click "Save"

### 2.4 Publish GTM Container

1. Click "Submit" in the top right
2. Add version name: `v1.0 - GA4 Setup`
3. Click "Publish"

## Step 3: Track "Request Quotation" Events

### Understanding How It Works

Before we configure GTM, let's understand the data flow:

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Your Website      │───▶│  Google Tag Manager │───▶│   Google Analytics  │
│                     │    │                     │    │        (GA4)        │
│ User clicks         │    │ 1. Listens for      │    │                     │
│ "Request Quote"     │    │    'request_        │    │ Records event as    │
│         │           │    │    quotation'       │    │ 'generate_lead'     │
│         ▼           │    │    event            │    │ with all your       │
│ Code pushes event   │    │                     │    │ custom parameters   │
│ to dataLayer:       │    │ 2. Reads variables  │    │                     │
│ {                   │    │    (source,         │    │                     │
│   event: '...',     │    │    product_type)    │    │                     │
│   source: 'hero',   │    │                     │    │                     │
│   product_type:     │    │ 3. Sends to GA4     │    │                     │
│     'cashmere'      │    │    with parameters  │    │                     │
│ }                   │    │                     │    │                     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

**In simple terms:**

1. Your website code pushes an event to GTM's "dataLayer" (like putting a letter in a mailbox)
2. GTM listens for specific events and reads the data you sent
3. GTM forwards this to GA4 with the parameters you configure

---

### Option A: Track via GTM (Recommended)

Best for marketing teams who want flexibility without code changes.

#### 3A.1 Create Data Layer Variables (Detailed Walkthrough)

**What are Data Layer Variables?**
These tell GTM where to find the data your website sends. When your website pushes `{ source: "hero_cta" }`, GTM needs a variable configured to read that `source` value.

**Step-by-Step:**

1. **Open GTM and go to Variables**

   - Log in to [tagmanager.google.com](https://tagmanager.google.com)
   - Select your "Ever Knitting" container
   - In the left sidebar, click **"Variables"**

2. **Create the first variable (event_category)**
   - Scroll down to the "User-Defined Variables" section
   - Click the **"New"** button
3. **Configure the variable**
   - Click on the pencil icon or the **"Variable Configuration"** box
   - In the "Choose variable type" panel that slides in from the right, scroll down
   - Under **"Page Variables"**, click **"Data Layer Variable"**
4. **Set the variable name**

   - In the **"Data Layer Variable Name"** field, type exactly:
     ```
     event_category
     ```
   - Leave "Data Layer Version" as "Version 2"
   - Leave "Set Default Value" unchecked (or set a default if you want)

5. **Name and save the variable**

   - At the top of the screen, click **"Untitled Variable"**
   - Type: `DLV - Event Category`
   - Click **"Save"** (top right)

6. **Repeat for the other variables:**

   | Variable Name (in GTM) | Data Layer Variable Name |
   | ---------------------- | ------------------------ |
   | `DLV - Event Category` | `event_category`         |
   | `DLV - Event Label`    | `event_label`            |
   | `DLV - Product Type`   | `product_type`           |
   | `DLV - Page URL`       | `page_url`               |

   **To create each one:**

   - Go to Variables → User-Defined Variables → New
   - Variable Type: Data Layer Variable
   - Enter the "Data Layer Variable Name" from the table above
   - Name it with the "Variable Name" from the table above
   - Save

**After completing this step, you should see all 4 variables listed under "User-Defined Variables":**

```
┌──────────────────────────────────────────────────────────┐
│ User-Defined Variables                                   │
├──────────────────────────────────────────────────────────┤
│ DLV - Event Category          Data Layer Variable        │
│ DLV - Event Label             Data Layer Variable        │
│ DLV - Product Type            Data Layer Variable        │
│ DLV - Page URL                Data Layer Variable        │
└──────────────────────────────────────────────────────────┘
```

---

#### 3A.2 Create Custom Event Trigger (Detailed Walkthrough)

**What is a Trigger?**
A trigger tells GTM WHEN to fire a tag. We want our GA4 tag to fire whenever the website sends a `request_quotation` event.

**Step-by-Step:**

1. **Navigate to Triggers**

   - In the left sidebar, click **"Triggers"**
   - Click the **"New"** button

2. **Configure the trigger**

   - Click on the **"Trigger Configuration"** box
   - In the panel that slides in, scroll down to **"Other"**
   - Click **"Custom Event"**

3. **Set the event name**

   - In the **"Event name"** field, type exactly:
     ```
     request_quotation
     ```
   - This MUST match exactly what your website code sends (it's case-sensitive!)
   - Leave "Use regex matching" unchecked
   - Keep "This trigger fires on" set to **"All Custom Events"**

4. **Name and save the trigger**
   - Click **"Untitled Trigger"** at the top
   - Type: `CE - Request Quotation`
   - Click **"Save"**

**Your trigger configuration should look like this:**

```
┌──────────────────────────────────────────────────────────┐
│ Trigger Configuration                                     │
├──────────────────────────────────────────────────────────┤
│ Trigger Type:      Custom Event                          │
│ Event name:        request_quotation                     │
│ This trigger fires on: All Custom Events                 │
└──────────────────────────────────────────────────────────┘
```

---

#### 3A.3 Create GA4 Event Tag (Detailed Walkthrough)

**What is a Tag?**
A tag is the actual tracking code that sends data to GA4 (or other platforms). We'll create a tag that fires when the trigger we just created is activated.

**Step-by-Step:**

1. **Navigate to Tags**

   - In the left sidebar, click **"Tags"**
   - Click the **"New"** button

2. **Configure the tag type**

   - Click on the **"Tag Configuration"** box
   - In the panel that slides in, under "Featured", you should see:
     - **"Google Analytics: GA4 Event"** ← Click this one

   (If you don't see it, search for "GA4 Event" in the search box)

3. **Link to your GA4 Configuration**

   - Under **"Configuration Tag"**, you need to select your GA4 Configuration tag
   - Click the dropdown and select: `GA4 - Configuration` (the tag you created earlier in Step 2.3)

   **Alternative method (if you don't see it):**

   - Instead of "Configuration Tag", you might see "Measurement ID"
   - Enter your GA4 Measurement ID directly: `G-XXXXXXXXXX`

4. **Set the Event Name**

   - In the **"Event Name"** field, type:
     ```
     generate_lead
     ```
   - This is the event name that will appear in GA4 reports
   - We use `generate_lead` because it's a GA4 recommended event for lead generation

5. **Add Event Parameters** (This is the key part!)

   - Click on **"Event Parameters"** to expand the section
   - Click **"Add Row"** button to add each parameter:

   | Parameter Name   | Value                      |
   | ---------------- | -------------------------- |
   | `event_category` | `{{DLV - Event Category}}` |
   | `source`         | `{{DLV - Event Label}}`    |
   | `product_type`   | `{{DLV - Product Type}}`   |
   | `page_url`       | `{{DLV - Page URL}}`       |

   **How to enter each parameter:**

   - In the **"Parameter Name"** field (left column), type the parameter name (e.g., `event_category`)
   - In the **"Value"** field (right column), click the brick icon (🧱) OR type `{{`
   - Select the corresponding variable from the list (e.g., `DLV - Event Category`)
   - The field should show `{{DLV - Event Category}}` with special formatting

   **Your parameters section should look like this:**

   ```
   ┌─────────────────────────────────────────────────────────┐
   │ Event Parameters                                         │
   ├──────────────────────┬──────────────────────────────────┤
   │ Parameter Name       │ Value                             │
   ├──────────────────────┼──────────────────────────────────┤
   │ event_category       │ {{DLV - Event Category}}         │
   │ source               │ {{DLV - Event Label}}            │
   │ product_type         │ {{DLV - Product Type}}           │
   │ page_url             │ {{DLV - Page URL}}               │
   └──────────────────────┴──────────────────────────────────┘
   ```

6. **Set the Trigger**

   - Scroll down and click on the **"Triggering"** section
   - Click anywhere in the box that says "Choose a trigger..."
   - In the panel that appears, click on: `CE - Request Quotation`

7. **Name and save the tag**
   - Click **"Untitled Tag"** at the top
   - Type: `GA4 - Request Quotation Event`
   - Click **"Save"**

---

#### 3A.4 Test Your Configuration

**Before publishing, always test!**

1. **Enter Preview Mode**

   - In GTM, click the **"Preview"** button (top right, next to Submit)
   - Enter your website URL (e.g., `https://everknitting.com`)
   - Click **"Connect"**
   - A new browser tab opens with your website + Tag Assistant panel

2. **Trigger the event on your website**

   - On your website, click any "Request a Quote" button
   - Look at the Tag Assistant panel at the bottom

3. **Verify the event was captured**

   - In Tag Assistant, look for `request_quotation` in the left sidebar under "Summary"
   - Click on it to see which tags fired
   - Your `GA4 - Request Quotation Event` should appear under "Tags Fired"

4. **Check the data**
   - Click on the tag to see what data was sent
   - Verify that `event_category`, `source`, `product_type`, and `page_url` have values

**If something isn't working:**

- Check that the Data Layer Variable names EXACTLY match what your code sends
- Check that the Custom Event name EXACTLY matches (case-sensitive)
- Make sure you selected the correct trigger for your tag

---

#### 3A.5 Publish Your Changes

Once testing is successful:

1. Click **"Submit"** (top right)
2. Enter a version name: `v1.1 - Added Request Quotation Tracking`
3. Optionally add a description of what changed
4. Click **"Publish"**

**Your quotation tracking is now live!** 🎉

---

### Option B: Track via Code

The analytics components are already set up. Use them in your forms/buttons:

```tsx
import { trackQuotationRequest } from "@/components/analytics";

// In your component
const handleRequestQuote = () => {
  trackQuotationRequest({
    source: "hero_cta",
    productType: "cashmere sweater",
  });
  // ... rest of your logic
};

<button onClick={handleRequestQuote}>Request a Quote</button>;
```

## Step 4: Verify Setup

### 4.1 Use GTM Preview Mode

1. In GTM, click "Preview" in top right
2. Enter your website URL
3. Browse your site - Tag Assistant will show which tags fire

### 4.2 Use GA4 Realtime Report

1. Go to Google Analytics → Reports → Realtime
2. Browse your website in another tab
3. You should see realtime visitors
4. Check Events section for your custom events

### 4.3 Chrome Extension (Optional)

Install [Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) to debug tags.

## Step 5: Add Bing Webmaster Tools

### 5.1 Create Bing Webmaster Account

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with Microsoft account
3. Add your site URL

### 5.2 Verify via Meta Tag

Bing will give you a verification code. Add it to your `app/layout.tsx`:

```tsx
// In the <head> section
<meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
```

Or add via GTM:

1. Go to GTM → Tags → New
2. Tag Type: "Custom HTML"
3. HTML: `<meta name="msvalidate.01" content="YOUR_CODE">`
4. Trigger: All Pages
5. Advanced Settings → Tag firing options: "Once per page"

### 5.3 Add Bing UET Tag (For Ads Tracking)

If using Bing Ads:

1. In GTM → Tags → New
2. Tag Type: "Bing Ads Universal Event Tracking"
3. Enter your UET Tag ID
4. Trigger: All Pages

## Step 6: Add Other Webmaster Tools

### Google Search Console

Already connected if you have GA4. If not:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property
3. Verify using GA4 or add meta tag:

```tsx
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

### Yandex Webmaster (For Russian Market)

```tsx
<meta name="yandex-verification" content="YOUR_VERIFICATION_CODE" />
```

### Baidu Webmaster (For Chinese Market)

```tsx
<meta name="baidu-site-verification" content="YOUR_VERIFICATION_CODE" />
```

## Events Reference

### Pre-built Events

| Event Name          | Description                | Usage                    |
| ------------------- | -------------------------- | ------------------------ |
| `request_quotation` | User requests a quote      | Quote forms, CTA buttons |
| `form_submission`   | Any form is submitted      | Contact forms            |
| `cta_click`         | CTA button clicked         | Track engagement         |
| `section_view`      | Section scrolled into view | Scroll depth             |

### GA4 Recommended Events for B2B

Consider also tracking:

- `generate_lead` - When a lead form is submitted
- `page_view` - Automatic with enhanced measurement
- `scroll` - Automatic with enhanced measurement
- `click` - Outbound link clicks (automatic)
- `file_download` - Catalog/brochure downloads

## Troubleshooting

### Tags Not Firing

1. Check if `NEXT_PUBLIC_GTM_ID` is set
2. Check browser console for errors
3. Use GTM Preview mode
4. Ensure container is published

### Events Not Showing in GA4

1. GA4 has 24-48 hour latency for reports
2. Use Realtime report for testing
3. Check Debug View in GA4

### Consent Mode (GDPR)

For EU visitors, consider implementing consent mode:

- [GTM Consent Mode](https://support.google.com/tagmanager/answer/10718549)
- Use a consent management platform (CMP) like Cookiebot or OneTrust

## File Structure

```
components/analytics/
├── index.ts              # Exports all analytics utilities
├── GoogleTagManager.tsx  # GTM script components
└── events.ts             # Event tracking functions
```

## Environment Variables

| Variable                        | Description                     | Required |
| ------------------------------- | ------------------------------- | -------- |
| `NEXT_PUBLIC_GTM_ID`            | Google Tag Manager container ID | Yes      |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 ID (for direct integration) | No       |
| `BING_SITE_VERIFICATION`        | Bing verification code          | No       |

---

_Last updated: January 2026_
