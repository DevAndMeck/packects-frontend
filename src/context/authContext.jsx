import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const verifyUser = async () => {
    //         try {
                
    //         } catch (error) {
    //             if(error.response && | error.response.data.success){
    //                 setError(error.response.data.error)
    //             }else{
    //                 setError("Server ERror")
    //             }
    //         }
    //     }
    // }, [])

    const login = (user) => {
        setUser(user);
        localStorage.setItem("token", user.token); // Almacena el token si existe
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Exportar como por defecto
export default AuthProvider;

// Exportar useAuth
export const useAuth = () => useContext(AuthContext);
