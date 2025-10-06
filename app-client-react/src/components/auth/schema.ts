import { z } from 'zod';

const base = {
    email: z.string().email({ message: 'Invalid email address.' }),

    password: z
        .string()
        .min(6, { message: 'Password must be at least 5 characters.' })
        .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter.' })
        .regex(/[0-9]/, { message: 'Password must contain a number.' }),
};

export const signInSchema = z.object(base);

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: 'Name must be at least 2 characters long.' })
            .max(50, { message: 'Name cannot exceed 50 characters.' }),
        ...base,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'], // 👈 attach the error to this field
    });
