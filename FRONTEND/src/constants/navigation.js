import { APP_ROUTES } from "./routes";

export const GUEST_NAV_ITEMS = [
    { label: "Home", to: APP_ROUTES.HOME },
    { label: "Features", to: APP_ROUTES.FEATURES },
    { label: "FAQ", to: APP_ROUTES.FAQ },
    { label: "GitHub", href: "https://github.com/" },
    { label: "Login", to: APP_ROUTES.LOGIN },
    { label: "Sign Up", to: APP_ROUTES.REGISTER },
];

export const AUTH_NAV_ITEMS = [
    { label: "Home", to: APP_ROUTES.HOME },
    { label: "Dashboard", to: APP_ROUTES.DASHBOARD },
    { label: "My URLs", to: APP_ROUTES.MY_URLS },
    { label: "Analytics", to: APP_ROUTES.ANALYTICS },
    { label: "FAQ", to: APP_ROUTES.FAQ },
];
