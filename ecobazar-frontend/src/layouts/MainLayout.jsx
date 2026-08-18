import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <>
            {/* Navbar এখানে আসবে */}

            <main>
                <Outlet />
            </main>

            {/* Newsletter এখানে আসবে */}

            {/* Footer এখানে আসবে */}
        </>
    );
}