import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black text-white px-4"
      role="alert"
    >
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>

        <p className="text-xl text-slate-300 mb-6">
          Oops! Page not found
        </p>

        <Link
          to="/"
          className="text-cyan-400 hover:text-purple-400 underline transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;