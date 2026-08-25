import styles from "../css/Login.module.css";
import { useNavigate } from 'react-router-dom';
import {useState} from "react";
import {login} from "../services/api.js";
const Login=()=>{
    const navigate = useNavigate();
    const [Username,setUsername]=useState("");
    const [Password,setPassword]=useState("");
    const [error,setError]=useState('');
    const handleLogin=async(e)=>{
        e.preventDefault();
        try{
            const response= await login(Username,Password);
            localStorage.setItem('token',response.data.accessToken.token);
            localStorage.setItem('Username',Username);
            window.location.href = '/dashboard';
        }
        catch{
            setError("Invalid Username or Password");
        }
    }
    return <div >
        <form className={styles.myLogin} onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" placeholder="Enter Username"
                       value={Username}
                       onChange={(e) => setUsername(e.target.value)}
                       required/>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Enter the Password"
                       value={Password}
                       onChange={(e) => setPassword(e.target.value)}
                       required />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="mt-3">

                <span>Don&apos;t have an account? </span>
                <button
                    type={"button"}
                    className="btn btn-link p-0"
                    onClick={() => navigate('/signup')}>
                    Sign Up
                </button>
            </div>
            <button type="submit" className="btn btn-primary"
            >Login</button>
        </form>
    </div>

}
export default Login;