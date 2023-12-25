import React, { FC, ReactNode } from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA2vB83NAjrcgOhtndNQ8BiFAVjieCXuEY",
    authDomain: "study-buddy-hungary-9cfff.firebaseapp.com",
    projectId: "study-buddy-hungary-9cfff",
    storageBucket: "study-buddy-hungary-9cfff.appspot.com",
    messagingSenderId: "756536935090",
    appId: "1:756536935090:web:e13722ec6ef5c705fa3fab",
    measurementId: "G-N27RB090DM"
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const UserContext = createContext<User | null>(null);

const useUser = () => useContext(UserContext);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export { useUser, AuthProvider };
