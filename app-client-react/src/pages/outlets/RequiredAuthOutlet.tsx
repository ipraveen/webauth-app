import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import Header from '../parts/Header';

interface Props {
    allowedRoles?: string[];
}

const UserRouteOutlet = ({ allowedRoles = ['USER'] }: Props) => {
    const authCtx = useAuth();
    const location = useLocation();

    // if not logged in, redirect to login

    if (authCtx.auth == null) return <Navigate to="/login" state={{ from: location }} replace />;

    const isAuthGood = allowedRoles.some(role => authCtx.auth?.roles.includes(role))

    if (!isAuthGood) return <h1>TODO: Access Denied</h1>;

    // else, render the requested route
    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default UserRouteOutlet;
