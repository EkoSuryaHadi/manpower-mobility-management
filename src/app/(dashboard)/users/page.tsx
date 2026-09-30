import React from "react";
import { prisma } from "@/lib/prisma";
import { UserManagementClient } from "./UserManagementClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let initialUsers: any[] = [];
  let companies: any[] = [];

  try {
    initialUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        company: true,
      },
    });

    companies = await prisma.company.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        type: true,
      },
    });
  } catch (error) {
    console.error("Error loading users:", error);
  }

  return <UserManagementClient initialUsers={initialUsers} companies={companies} />;
}
