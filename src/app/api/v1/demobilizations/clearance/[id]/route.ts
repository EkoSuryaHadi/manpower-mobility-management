import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isCleared } = await req.json();

    const updated = await prisma.clearanceItem.update({
      where: { id: params.id },
      data: {
        isCleared,
        clearedAt: isCleared ? new Date() : null,
        clearedBy: isCleared ? "Site Administrator" : null,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error("Clearance item error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
