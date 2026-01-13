"use server"

import { prisma } from "@/lib/prisma"

export async function getLeadById(id: string) {
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
