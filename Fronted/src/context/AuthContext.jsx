import { createContext, useState, useEffect } from "react";
import axios from 'axios'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getCurrentUser = async () => {
        try {
            const res = await axios.get('/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    const register = async (formData) => {
        const res = await axios.post('/api/auth/register',  formData, {
            headers: { 'Content-Type' : 'application/json'},
        }
    );
    localStorage.setItem('token', res.data.token);
    await getCurrentUser(); // Immediately update
    };

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', {
            email,
            password,
        });
        //console.log(res.data);
        
        localStorage.setItem('token', res.data.token);
        await getCurrentUser();
    };

    const logout =async () => {
        try {
            await axios.post('/api/auth/logout');
            localStorage.removeItem('token');
            setUser(null);
            
        } catch (error) {
            console.error('Logout error', error)
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getCurrentUser();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider
          value={{user, loading, register, login, logout}}
        >
            {children}
        </AuthContext.Provider>
    );
    
}