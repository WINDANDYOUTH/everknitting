# Micro CRM Architecture Design

This document outlines the architecture and requirements for the internal Micro CRM system for Ever Knitting.

## 1. System Goals

- **Lead Management**: Capture and organize B2B leads.
- **Activity Tracking**: Log emails, calls, and meetings.
- **Investment Control**: Track sample and quotation costs per lead.
- **Analytics**: Measure development effectiveness (Conversion Rates).

## 2. Tech Stack Recommendations

| Component          | Recommendation            | Reason                                                                                             |
| ------------------ | ------------------------- | -------------------------------------------------------------------------------------------------- |
| **Database**       | **Supabase** (PostgreSQL) | Robust, relational, comes with a built-in Table Editor UI (great fallback), Free tier is generous. |
| **Authentication** | **Clerk**                 | Fastest implementation, handles UI components (Login/Profile), secure.                             |
| **ORM**            | **Prisma**                | Best type-safety for TypeScript, easy schema management.                                           |
| **UI Framework**   | **Shadcn/ui**             | Already in project, clean, professional look.                                                      |

## 3. Data Model (Schema)

### `Lead`

- `id`: UUID
- `companyName`: String
- `contactName`: String
- `email`: String (Unique)
- `status`: Enum (NEW, CONTACTED, QUALIFIED, SAMPLE_SENT, NEGOTIATION, WON, LOST)
- `source`: String (e.g., "Alibaba", "Exhibition", "Website")
- `createdAt`: DateTime

### `Interaction` (Outreach / Follow-up)

- `id`: UUID
- `leadId`: Relation -> Lead
- `type`: Enum (EMAIL, CALL, MEETING, WHATSAPP)
- `notes`: Text
- `date`: DateTime

### `SampleRequest`

- `id`: UUID
- `leadId`: Relation -> Lead
- `items`: JSON (List of styles/yarns)
- `cost`: Float
- `status`: Enum (PREPARING, SENT, DELIVERED)
- `trackingNumber`: String

### `Quotation`

- `id`: UUID
- `leadId`: Relation -> Lead
- `totalAmount`: Float
- `currency`: String (USD/EUR)
- `status`: Enum (DRAFT, SENT, ACCEPTED, REJECTED)

## 4. Required External Tools & Preparation

Please prepare the following to proceed with the full functionality:

1.  **Supabase Project**:
    - Go to [Supabase](https://supabase.com/) and create a new project.
    - **Get needed keys**: `DATABASE_URL`, `DIRECT_URL`.
2.  **Clerk Account**:
    - Go to [Clerk](https://clerk.com/) and create an application.
    - **Get needed keys**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`.

## 5. Folder Structure (Planned)

```
/app
  /dashboard           # Protected Route Group
    layout.tsx         # Admin Sidebar & Auth Check
    page.tsx           # Dashboard Overview (KPIs)
    /leads
      page.tsx         # List of Leads (Data Table)
      [id]/page.tsx    # Lead Detail View (Timeline, Quick Actions)
    /samples
      page.tsx         # Sample Requests Tracker
    /quotations
      page.tsx         # Quotations Tracker
```
