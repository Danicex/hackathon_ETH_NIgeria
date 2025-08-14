import axios from 'axios';
import React, {  createContext, useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


const GlobalContext = createContext();

export function AppDataProvider ({ children }){
    const  navigate = useNavigate()
    const [projectInfo, setProjectInfo] = useState(
        JSON.parse(localStorage.getItem("project_info")) || {
            name: "no project",
            date: "no time",
            author: "no user address",
            hash: "x0napt0898u879hbjhbuc",
        }
    );
   const [walletAdd, setWalletAdd] = useState(localStorage.getItem('wallet') || '')
    const [userData, setUserData] = useState(localStorage.getItem('user_data') || {})
    
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    //const api_endpoint = 'http://127.0.0.1:8000'
    const api_endpoint = 'https://learnmax-backend.onrender.com/'
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.className = theme;
    }, [theme]);

 
    return (
        <GlobalContext.Provider value={{
            theme,
            setTheme,
            api_endpoint,
            walletAdd,
            setWalletAdd,
            projectInfo,
            setProjectInfo,
            userData
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useMyContext() {
    return useContext(GlobalContext);
}