import ProfileShell from "@/components/profile/profile-shell";
import ProfileDetails from "@/components/profile/profile-details";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    // create supabase server client and get authenticated user
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        // If unauthenticated, redirect to login
        redirect("/login");
    }

    const profile = await prisma.user.findUnique({ where: { id: user.id } });

    if (!profile) {
        return (
            <ProfileShell>
                <div className="text-center">Profile not found.</div>
            </ProfileShell>
        );
    }

    return (
        <ProfileShell>
            <ProfileDetails profile={profile} />
        </ProfileShell>
    );
}
