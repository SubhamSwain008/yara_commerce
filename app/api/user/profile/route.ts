import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function GET() {
    try {
        const supabase = await createClient();

        // get authenticated user
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // fetch user profile from DB
        const profile = await prisma.user.findUnique({
            where: { id: user.id },

        });
        if (!profile) { return NextResponse.json({ error: "Profile not found" }, { status: 404 }); }

        return NextResponse.json({ profile });
    }
    catch (error) { console.error("Error fetching user profile:", error); return NextResponse.json({ error: "Internal Server Error" }, { status: 500 }); }
}

export async function POST() {
    try {
        const supabase = await createClient();

        // get authenticated user
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // parse and validate body
        // read request body from arguments[0] (route handlers sometimes receive the Request as first arg)
        // this keeps the handler compatible with Next.js route.Request injection
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const reqArg = arguments[0] as Request | undefined;
        let payload: any = {};
        if (reqArg) {
            try {
                payload = await reqArg.json();
            } catch (e) {
                payload = {};
            }
        }

        const allowedGender = ["MALE", "FEMALE", "OTHER"];

        const data: any = {};
        if (typeof payload.firstName === "string") data.firstName = payload.firstName;
        if (typeof payload.lastName === "string") data.lastName = payload.lastName;
        if (typeof payload.phone === "string") data.phone = payload.phone;
        if (payload.age !== undefined) {
            const age = parseInt(String(payload.age), 10);
            if (!Number.isNaN(age)) data.age = age;
        }
        if (payload.height !== undefined) {
            const h = parseFloat(String(payload.height));
            if (!Number.isNaN(h)) data.height = h;
        }
        if (payload.weight !== undefined) {
            const w = parseFloat(String(payload.weight));
            if (!Number.isNaN(w)) data.weight = w;
        }
        if (typeof payload.gender === "string" && allowedGender.includes(payload.gender)) {
            data.gender = payload.gender;
        }

        // upsert profile for the user
        const updated = await prisma.userProfile.upsert({
            where: { userId: user.id },
            update: data,
            create: {
                userId: user.id,
                ...data,
            },
        });

        return NextResponse.json({ profile: updated });
    } catch (err) {
        console.error("Error updating user profile:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


