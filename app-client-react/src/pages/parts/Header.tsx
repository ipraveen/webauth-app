import { useAuth } from '@/context/useAuth';
import { Link } from 'react-router-dom';
export default function Header() {
    const authCtx = useAuth();
    return (
        <header>
            <h1>Welcome, {authCtx.auth?.name}</h1>
            <div className='nav-section'>
                <nav style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/">Home</Link>
                      <Link to="/dashboard">Dashboard</Link>
                    {authCtx.auth?.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
                </nav>
                <button
                    onClick={authCtx.logout}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
