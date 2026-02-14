import { NextResponse } from "next/server";
import { getUser } from "@/lib/middlewares/withUser";
import { prisma } from "@/lib/prisma/client";

export async function POST(req: Request) {
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const body = await req.json();
        const productId: string = body.productId;
        const quantity: number = Math.max(1, Number(body.quantity || 1));

        const product = await prisma.sellerProducts.findUnique({ where: { id: productId } });
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
        if (!product.isAvailable || (product.stock ?? 0) < 1) return NextResponse.json({ error: "Product not available" }, { status: 400 });

        // find or create cart
        let cart = await prisma.cart.findUnique({ where: { userId: dbUser.id } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId: dbUser.id } });
        }

        // upsert cart item
        const existing = await prisma.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId } } });
        let item;
        if (existing) {
            const newQty = existing.quantity + quantity;
            item = await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } });
        } else {
            item = await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
        }

        const full = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } });
        return NextResponse.json({ success: true, item, cart: full });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const cart = await prisma.cart.findUnique({ where: { userId: dbUser.id }, include: { items: { include: { product: true } } } });
        return NextResponse.json({ success: true, cart });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const body = await req.json();
        const { productId, quantity } = body;
        if (!productId || typeof quantity !== "number") return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

        const cart = await prisma.cart.findUnique({ where: { userId: dbUser.id } });
        if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

        const existing = await prisma.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId } } });
        if (!existing) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });

        if (quantity <= 0) {
            await prisma.cartItem.delete({ where: { id: existing.id } });
            return NextResponse.json({ success: true, removed: true });
        }

        const updated = await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity } });
        return NextResponse.json({ success: true, item: updated });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const url = new URL(req.url);
        const productId = url.searchParams.get("productId");
        if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

        const cart = await prisma.cart.findUnique({ where: { userId: dbUser.id } });
        if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

        const existing = await prisma.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId } } });
        if (!existing) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });

        await prisma.cartItem.delete({ where: { id: existing.id } });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
    }
}
