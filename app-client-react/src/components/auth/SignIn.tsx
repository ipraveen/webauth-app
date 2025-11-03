import React, { useEffect, useRef, useState, type FormEvent } from 'react';
import z from 'zod';
import { signInSchema as schema } from './schema';
import axios from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';

type SignInForm = z.infer<typeof schema>;

const SignIn: React.FC = () => {
    const userNameRef = useRef<HTMLInputElement>(null);
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignInForm>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [success, setSuccess] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        try {
            schema.parse(formData);
            setErrors({});
        } catch (e) {
            const error = e as never as typeof z.ZodError;

            if (error instanceof z.ZodError) {
                const flattened = z.flattenError(error);
                setErrors(flattened.fieldErrors);
            }
        }
    }, [formData]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', JSON.stringify(formData), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            console.log('SignIn:', response);
            if (response?.data) {
                setAuth(response.data);
                localStorage.setItem('AUTH_STATE', JSON.stringify(response.data));
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        userNameRef.current?.focus();
    }, []);

    return (
        <div className="max-w-md mx-auto p-6 shadow-lg rounded-2xl bg-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">SignIn</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full border p-2 rounded-md"
                        value={formData.email}
                        autoComplete="off"
                        onChange={handleChange}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.join(', ')}</p>}
                </div>

                {/* Password */}
                <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full border p-2 rounded-md"
                        value={formData.password}
                        autoComplete="off"
                        onChange={handleChange}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.join(', ')}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition"
                >
                    SignIn
                </button>
            </form>

            {success && <p className="text-green-600 text-center mt-4 font-medium">{success}</p>}
        </div>
    );
};

export default SignIn;
