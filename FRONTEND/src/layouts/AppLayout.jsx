import { Outlet } from "react-router-dom";
import MainNavbar from "../components/layout/MainNavbar";
import MainFooter from "../components/layout/MainFooter";

const AppLayout = () => {
    return (
        <div className="min-h-screen text-slate-100">
            <MainNavbar />
            <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <Outlet />
            </main>
            <MainFooter />
        </div>
    );
};

export default AppLayout;
