import { Navigate } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";

const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
    }

    return children;
};

export default PublicOnlyRoute;
