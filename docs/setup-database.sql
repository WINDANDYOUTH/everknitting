-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if needed (Be careful with production data!)
-- DROP TABLE IF EXISTS "Quotation";
-- DROP TABLE IF EXISTS "SampleRequest";
-- DROP TABLE IF EXISTS "Interaction";
-- DROP TABLE IF EXISTS "FollowUp";
-- DROP TABLE IF EXISTS "Lead";
-- DROP TYPE IF EXISTS "LeadStatus";
-- DROP TYPE IF EXISTS "Priority";
-- DROP TYPE IF EXISTS "InteractionType";
-- DROP TYPE IF EXISTS "SampleStatus";
-- DROP TYPE IF EXISTS "QuotationStatus";

-- Create Lead Types
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'SAMPLE_SENT', 'NEGOTIATION', 'WON', 'LOST');
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- Create Lead Table
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "country" TEXT,
    "source" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Lead_email_key" ON "Lead"("email");

-- Create Interaction Types
CREATE TYPE "InteractionType" AS ENUM ('EMAIL', 'CALL', 'MEETING', 'WHATSAPP', 'LINKEDIN', 'OTHER');

-- Create Interaction Table
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "leadId" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL,
    "template" TEXT,
    "channel" TEXT,
    "notes" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create FollowUp Table
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "leadId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Sample Types
CREATE TYPE "SampleStatus" AS ENUM ('PREPARING', 'SENT', 'DELIVERED', 'CANCELLED');

-- Create SampleRequest Table
CREATE TABLE "SampleRequest" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "leadId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "cost" DECIMAL(65,30),
    "probability" INTEGER,
    "status" "SampleStatus" NOT NULL DEFAULT 'PREPARING',
    "trackingNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SampleRequest_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "SampleRequest" ADD CONSTRAINT "SampleRequest_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Quotation Types
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- Create Quotation Table
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "leadId" TEXT NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "validUntil" TIMESTAMP(3),
    "items" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Trigger to update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lead_updated_at
    BEFORE UPDATE ON "Lead"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
