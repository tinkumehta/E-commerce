import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {Navigate} from 'react-router-dom'

export default function ProtectedRoute ({children}) {
    const {user, loading} = useContext(AuthContext);

    if (loading) return <p>Loading...</p>
    if (!user) return<Navigate to='/login' />;

    return children;
}