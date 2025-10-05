import React, { useEffect, useRef, useState, type FormEvent } from 'react';
import z from 'zod';
import { registerSchema as schema } from './schema';
import axios from '@/api/axios';

type UserForm = z.infer<typeof schema>;

const RegisterForm: React.FC = () => {
    const userNameRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<UserForm>({
        name: 'user01',
        email: 'user01@email.com',
        password: 'Abc123',
        confirmPassword: 'Abc123',
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
            const response = await axios.post('/users', JSON.stringify(formData), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            console.log('User registered:', response);
            setSuccess('Registration successful!');
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        userNameRef.current?.focus();
    }, []);

    return (
        <div className="max-w-md mx-auto p-6 shadow-lg rounded-2xl bg-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">Register User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block mb-1 font-medium" htmlFor="name">
                        Name
                    </label>
                    <input
                        ref={userNameRef}
                        type="text"
                        id="name"
                        name="name"
                        autoComplete="off"
                        className="w-full border p-2 rounded-md"
                        value={formData.name}
                        aria-invalid={!!errors.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.join(', ')}</p>}
                </div>

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

                {/* Confirm Password */}
                <div>
                    <label className="block mb-1 font-medium">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="w-full border p-2 rounded-md"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition"
                >
                    Register
                </button>
            </form>

            {success && <p className="text-green-600 text-center mt-4 font-medium">{success}</p>}
        </div>
    );
};

export default RegisterForm;
