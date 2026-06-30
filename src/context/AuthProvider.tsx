import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/* =========================
   TYPES
========================= */

type Role = "admin" | "client";

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    role: Role;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;

    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string, fullName?: string) => Promise<any>;
    signOut: () => Promise<void>;
    forgotPassword: (email: string) => Promise<any>;

    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface Props {
    children: ReactNode;
}

/* =========================
   PROVIDER
========================= */

export const AuthProvider = ({ children }: Props) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    /* -------------------------
       FETCH PROFILE
    ------------------------- */
    const fetchProfile = async (userId: string) => {
        try {
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            setProfile(data ?? null);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setProfile(null);
        }
    };

    /* -------------------------
       INIT AUTH
    ------------------------- */
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            const { data } = await supabase.auth.getSession();

            if (!mounted) return;

            const session = data.session;

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user.id);
            }

            setLoading(false);
        };

        init();

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    // Don't block on profile fetch
                    fetchProfile(session.user.id).catch(err =>
                        console.error("Profile fetch error:", err)
                    );
                } else {
                    setProfile(null);
                }

                setLoading(false);
            }
        );

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    /* =========================
       AUTH FUNCTIONS
    ========================= */

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return { error };

        // 🔥 force sync session immediately
        setSession(data.session);
        setUser(data.user);

        // Fetch profile after login and WAIT for it
        if (data.user) {
            await fetchProfile(data.user.id);
        }

        return { data, error };
    };

    const signUp = async (email: string, password: string, fullName?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) return { data, error };

        // Update profile with full name if provided
        if (data.user && fullName) {
            await supabase
                .from("profiles")
                .update({ full_name: fullName })
                .eq("id", data.user.id);
        }

        return { data, error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
    };

    const forgotPassword = async (email: string) => {
        const { data, error } =
            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/login`,
            });

        return { data, error };
    };

    const refreshUser = async () => {
        const { data } = await supabase.auth.getSession();

        setSession(data.session);
        setUser(data.session?.user ?? null);

        if (data.session?.user) {
            await fetchProfile(data.session.user.id);
        }
    };


    /* =========================
       CONTEXT VALUE
    ========================= */

    const value = useMemo(
        () => ({
            user,
            session,
            profile,
            loading,
            signIn,
            signUp,
            signOut,
            forgotPassword,
            refreshUser,
        }),
        [user, session, profile, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

/* =========================
   HOOK
========================= */

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuthContext must be used inside AuthProvider."
        );
    }

    return context;
};