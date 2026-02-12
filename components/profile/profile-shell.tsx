export default function ProfileShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                {children}
            </div>
        </div>
    );
}
