"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const leadSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  country: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "SAMPLE_SENT", "NEGOTIATION", "WON", "LOST"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  owner: z.string().optional(),
})

export async function createLead(formData: FormData) {
  const data = {
    companyName: formData.get("companyName") as string,
    contactName: formData.get("contactName") as string,
    email: formData.get("email") as string,
    country: formData.get("country") as string,
    source: formData.get("source") as string,
    status: formData.get("status") as any,
    priority: formData.get("priority") as any || "MEDIUM",
    owner: formData.get("owner") as string,
  }

  const validated = leadSchema.parse(data)

  await prisma.lead.create({
    data: {
      companyName: validated.companyName,
      contactName: validated.contactName || null,
      email: validated.email || null,
      country: validated.country || null,
      source: validated.source || null,
      status: validated.status || "NEW",
      priority: validated.priority,
      owner: validated.owner || null,
    },
  })

  revalidatePath("/dashboard/leads")
  redirect("/dashboard/leads")
}

export async function getLeads() {
  return await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  })
}
