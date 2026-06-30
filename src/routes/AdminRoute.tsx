import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
    children: ReactNode;
}

/* =========================
   ADMIN ROUTE (ROLE BASED)
========================= */

const AdminRoute = ({ children }: Props) => {
    const { user, profile, loading } = useAuth();

    /* -------------------------
       LOADING
    ------------------------- */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    /* -------------------------
       NOT LOGGED IN
    ------------------------- */
    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    /* -------------------------
       NOT ADMIN
    ------------------------- */
    if (profile?.role !== "admin") {
        return <Navigate to="/client" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;