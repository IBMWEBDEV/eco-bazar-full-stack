import { Outlet } from "react-router-dom";

export default function AccountLayout() {
    return (
        <div className="min-h-screen">
            {/* Account Header এখানে আসবে */}

            <div className="container px-4 py-8 mx-auto">
                <div className="flex gap-6">
                    {/* Sidebar এখানে আসবে */}

                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}