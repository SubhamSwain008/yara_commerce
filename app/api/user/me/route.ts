import { NextResponse } from "next/server";
import { getUser } from "@/lib/middlewares/withUser";
import { prisma } from "@/lib/prisma/client";

// Returns the current user's basic info including isAdmin
export async function GET() {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                isAdmin: true,
                sellerProfile: {
                    select: { isApprovedByAdmin: true },
                },
            },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: dbUser.id,
                email: dbUser.email,
                isAdmin: dbUser.isAdmin,
                isApprovedSeller: dbUser.sellerProfile?.isApprovedByAdmin === true,
            },
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
