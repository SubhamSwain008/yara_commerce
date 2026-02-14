import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

// Public API — fetch a single product by ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const product = await prisma.sellerProducts.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        shopName: true,
                        sellerAddress: {
                            select: { city: true, state: true },
                        },
                    },
                },
                productReviews: {
                    include: {
                        user: {
                            select: {
                                userProfile: {
                                    select: { firstName: true, lastName: true },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Only show products from approved sellers that are available
        if (!product.isAvailable) {
            return NextResponse.json({ error: "Product not available" }, { status: 404 });
        }

        // Calculate average rating
        const avgRating =
            product.productReviews.length > 0
                ? product.productReviews.reduce((sum, r) => sum + r.rating, 0) /
                product.productReviews.length
                : null;

        return NextResponse.json({ product, avgRating });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
