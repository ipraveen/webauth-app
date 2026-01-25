import { useAuth } from '@/auth/hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Header() {
    const authCtx = useAuth();
    
    return (
        <header>
            <div className='flex flex-col'>
                <Link to="/">Store</Link>
                <small className='text-xs text-gray-300'>Welcome, {authCtx.auth?.name}</small>
            </div>

            <div className="nav-section">
                <nav style={{ display: 'flex', gap: '1rem' }}>
                    {authCtx.auth?.roles.includes('ADMIN') && <Link to="/admin">Admin</Link>}
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
