"use server"

import { requireCrmUser } from "@/lib/crm-auth"

export async function getLeadById(id: string) {
  await requireCrmUser()
  const { prisma } = await import("@/lib/prisma")
  return await prisma.lead.findUnique({
    where: { id },
    include: {
      interactions: {
        orderBy: { date: "desc" },
      },
      followUps: {
        orderBy: { date: "desc" },
      },
      samples: {
        orderBy: { createdAt: "desc" },
      },
    }
  })
}
