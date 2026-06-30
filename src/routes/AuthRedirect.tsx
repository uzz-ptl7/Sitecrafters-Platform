import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
    children: ReactNode;
}

const ADMIN_EMAIL = "admin@sitecrafters.com";

const AuthRedirect = ({ children }: Props) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (loading) return;

        const isAuthPage =
            location.pathname.startsWith("/auth");

        if (!user) return;

        // If logged in → block auth pages
        if (isAuthPage) {
            if (user.email === ADMIN_EMAIL) {
                navigate("/admin", { replace: true });
            } else {
                navigate("/client", { replace: true });
            }
        }
    }, [user, loading, location.pathname, navigate]);

    return <>{children}</>;
};

export default AuthRedirect;