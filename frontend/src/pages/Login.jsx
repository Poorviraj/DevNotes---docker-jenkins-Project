import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await API.post('/auth/login', form);
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-slate-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-slate-800">Welcome Back</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-700 transition"
                >
                    Login
                </button>
                <p className="text-sm text-slate-500 mt-4 text-center">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-slate-800 font-medium">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;