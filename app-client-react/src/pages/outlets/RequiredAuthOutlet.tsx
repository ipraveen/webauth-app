import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import Header from '../parts/Header';

interface Props {
    role?: 'USER' | 'ADMIN';
}

const UserRouteOutlet = ({ role}: Props) => {
    const authCtx = useAuth();

    // if not logged in, redirect to login

    if (authCtx.auth == null) return <Navigate to="/login" replace />;

    if (role && authCtx.auth.role !== role) return <h1>TODO: Access Denied</h1>;

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
