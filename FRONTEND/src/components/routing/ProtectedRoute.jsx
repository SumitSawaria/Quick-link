import { Navigate, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../Loading";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isBootstrapping } = useAuth();
    const location = useLocation();

    if (isBootstrapping) {
        return (
            <div className="mx-auto mt-24 max-w-4xl px-4">
                <Loading label="Restoring your session" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={APP_ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
    }

    return children;
};

export default ProtectedRoute;
