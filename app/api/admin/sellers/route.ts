import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middlewares/withUser";
import { prisma } from "@/lib/prisma/client";

// GET: List all seller profiles (admin only)
export async function GET() {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify admin
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { isAdmin: true },
        });

        if (!dbUser?.isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const sellers = await prisma.sellerProfile.findMany({
            include: {
                user: {
                    select: { email: true, userProfile: true },
                },
                sellerAddress: true,
                sellerDocs: true,
            },
            orderBy: { isRequestedForSeller: "desc" },
        });

        return NextResponse.json({ sellers });
    } catch (error) {
        console.error("Error fetching sellers:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Approve or reject a seller (admin only)
export async function POST(req: NextRequest) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { isAdmin: true },
        });

        if (!dbUser?.isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { sellerId, action } = body;

        if (!sellerId || !["approve", "reject"].includes(action)) {
            return NextResponse.json(
                { error: "sellerId and action (approve/reject) are required" },
                { status: 400 }
            );
        }

        if (action === "approve") {
            await prisma.sellerProfile.update({
                where: { id: sellerId },
                data: { isApprovedByAdmin: true },
            });
            return NextResponse.json({ message: "Seller approved successfully" });
        } else {
            // Reject: set both flags to false
            await prisma.sellerProfile.update({
                where: { id: sellerId },
                data: {
                    isApprovedByAdmin: false,
                    isRequestedForSeller: false,
                },
            });
            return NextResponse.json({ message: "Seller application rejected" });
        }
    } catch (error) {
        console.error("Error updating seller:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
