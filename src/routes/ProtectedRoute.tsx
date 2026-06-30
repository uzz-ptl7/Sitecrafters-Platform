import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/* =========================
   PROTECTED ROUTE
   (AUTH ONLY - NOT ROLE BASED)
========================= */

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading, profile } = useAuth();
    const location = useLocation();

    /* -------------------------
       LOADING STATE
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
        return (
            <Navigate
                to="/auth/login"
                replace
                state={{ from: location }}
            />
        );
    }

    /* -------------------------
       PROFILE NOT READY (safety)
    ------------------------- */
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading profile...
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;