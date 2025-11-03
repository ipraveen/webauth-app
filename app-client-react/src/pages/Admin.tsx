import { useAuth } from '@/auth/hooks/useAuth';
import axios from '@/api/axios';
import { useState, useEffect } from 'react';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const authCtx = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/users');

                setUsers(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch user data.');
                setUsers([]);
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (users.length === 0) {
        return <div>No users found.</div>;
    }

    return (
        <div>
            <h1> 👨‍💼 Admin</h1>

            <table className="w-full border-collapse border border-gray-400 bg-white">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border border-gray-300">Name</th>
                        <th className="p-2 border border-gray-300">Email</th>
                        <th className="p-2 border border-gray-300">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="p-2 border border-gray-300">{user.name}</td>
                            <td className="p-2 border border-gray-300">{user.email}</td>
                            <td className="p-2 border border-gray-300">{user.roles}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default Admin;
