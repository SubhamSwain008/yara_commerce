interface Profile {
    id: string;
    email: string;
    name?: string | null;
    isAdmin?: boolean;
    isSeller?: boolean;
}

export default function ProfileDetails({ profile }: { profile: Profile }) {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Profile</h1>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{profile.email}</div>
                </div>

                <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium">{profile.name ?? "—"}</div>
                </div>



                <div>
                    <div className="text-sm text-gray-500">Seller</div>
                    <div className="font-medium">{profile.isSeller ? "Yes" : "No"}</div>
                </div>
            </div>
        </div>
    );
}
