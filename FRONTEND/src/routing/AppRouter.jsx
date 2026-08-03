import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Loading from "../components/Loading";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import PublicOnlyRoute from "../components/routing/PublicOnlyRoute";
import { APP_ROUTES } from "../constants/routes";

const Home = lazy(() => import("../pages/Home"));
const Features = lazy(() => import("../pages/Features"));
const Faq = lazy(() => import("../pages/Faq"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const MyUrls = lazy(() => import("../pages/MyUrls"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRouter = () => {
    return (
        <Suspense fallback={<Loading label="Loading page" />}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path={APP_ROUTES.FEATURES} element={<Features />} />
                    <Route path={APP_ROUTES.FAQ} element={<Faq />} />
                    <Route
                        path={APP_ROUTES.LOGIN}
                        element={
                            <PublicOnlyRoute>
                                <Login />
                            </PublicOnlyRoute>
                        }
                    />
                    <Route
                        path={APP_ROUTES.REGISTER}
                        element={
                            <PublicOnlyRoute>
                                <Register />
                            </PublicOnlyRoute>
                        }
                    />
                    <Route
                        path={APP_ROUTES.FORGOT_PASSWORD}
                        element={
                            <PublicOnlyRoute>
                                <ForgotPassword />
                            </PublicOnlyRoute>
                        }
                    />
                    <Route path={APP_ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
                    <Route path={APP_ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
                    <Route
                        path={APP_ROUTES.DASHBOARD}
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={APP_ROUTES.MY_URLS}
                        element={
                            <ProtectedRoute>
                                <MyUrls />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={APP_ROUTES.ANALYTICS}
                        element={
                            <ProtectedRoute>
                                <Analytics />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={APP_ROUTES.PROFILE}
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;