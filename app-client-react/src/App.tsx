import RegisterForm from '@/components/auth/Register';
import SignIn from '@/components/auth/SignIn';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard.tsx';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/context/AuthProvider.tsx';
import RequiredAuthOutlet from '@/pages/outlets/RequiredAuthOutlet';
import Home from './pages/Home';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<SignIn />} />
                    <Route path="/register" element={<RegisterForm />} />

                    <Route element={<RequiredAuthOutlet />}>
                        <Route path="/" element={<Home />} />
                         <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                    <Route element={<RequiredAuthOutlet role='ADMIN' />}>
                        <Route path="/admin" element={<Admin />} />
                    </Route>

                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
