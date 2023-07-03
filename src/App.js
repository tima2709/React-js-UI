import React, {useEffect, useState} from 'react';
import './styles/app.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./componets/UI/Navbar/Navbar";
import AppRouter from "./componets/AppRouter";
import {AuthContext} from "./context";

const App = () => {
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (localStorage.getItem('auth')) {
            setIsAuth(true)
        }
        setIsLoading(false)
    },[])
    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth,
            isLoading,
        }}>
            <BrowserRouter>
                <Navbar/>
                <AppRouter/>
            </BrowserRouter>
        </AuthContext.Provider>

    );
};

export default App;

