import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUserState] = useState(JSON.parse(localStorage.getItem('chatapp')) || null)

    const setAuthUser = (user) => {
        setAuthUserState(user);
        if (user) {
            localStorage.setItem('chatapp', JSON.stringify(user));
        } else {
            localStorage.removeItem('chatapp');
        }
    };

    return <AuthContext.Provider value={{ authUser, setAuthUser }}>
        {children}
    </AuthContext.Provider>
}