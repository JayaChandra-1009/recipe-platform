import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Recipes from './pages/Recipes';
import Cookbooks from './pages/Cookbooks';
import Signup from "./pages/Signup.jsx";
import {useState} from "react";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/recipes" element={isLoggedIn ? <Recipes /> : <Navigate to="/login" />} />
                <Route path="/cookbooks" element={isLoggedIn ? <Cookbooks /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;