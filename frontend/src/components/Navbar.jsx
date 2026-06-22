import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <Link to="/" className="text-xl font-bold tracking-tight">
                DevNotes
            </Link>
            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-300">Hi, {user.name}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md text-sm transition"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;