import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

// Public API — fetch all available products with optional filters
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const category = searchParams.get("category");
        const fabricType = searchParams.get("fabricType");
        const weaveType = searchParams.get("weaveType");
        const color = searchParams.get("color");
        const pattern = searchParams.get("pattern");
        const occasion = searchParams.get("occasion");
        const search = searchParams.get("search");
        const sort = searchParams.get("sort"); // price_asc, price_desc, newest
        const featured = searchParams.get("featured");

        // Build where clause
        const where: any = {
            isAvailable: true,
            seller: {
                isApprovedByAdmin: true,
            },
        };

        if (category) where.category = category;
        if (fabricType) where.fabricType = fabricType;
        if (weaveType) where.weaveType = weaveType;
        if (color) where.color = color;
        if (pattern) where.pattern = pattern;
        if (featured === "true") where.isFeatured = true;
        if (occasion) where.occasion = { has: occasion };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { origin: { contains: search, mode: "insensitive" } },
                { subCategory: { contains: search, mode: "insensitive" } },
            ];
        }

        // Build orderBy
        let orderBy: any = { createdAt: "desc" };
        if (sort === "price_asc") orderBy = { price: "asc" };
        if (sort === "price_desc") orderBy = { price: "desc" };
        if (sort === "newest") orderBy = { createdAt: "desc" };

        const products = await prisma.sellerProducts.findMany({
            where,
            orderBy,
            include: {
                seller: {
                    select: {
                        shopName: true,
                    },
                },
                productReviews: {
                    select: { rating: true },
                },
            },
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
