import styles from "../css/Login.module.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {register} from "../services/api.js";

const Signup=()=> {
    const [Username,setUsername]=useState('');
    const [Password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [error,setError]=useState('');
    const navigate=useNavigate();

    const handleRegister=async (e)=>{
        e.preventDefault();
        if (Password===confirmPassword){
            if(Password.length<8){
                setPassword('');
                setError("Password should have atleast 8 characters!");
            }
            else if (!/[A-Z]/.test(Password)){
                setPassword('');
                setError("Password should have atleast one Upeercase letter");
            }
            else if(!/[0-9]/.test(Password)){
                setPassword('');
                setError("Password should have atleast one numerical value");
            }
            else if(!/[!@#$%^&*]/.test(Password)){
                setPassword('');
                setError("Password should have atleast one special character");
            }
            else{
                try{
                    await register(Username,Password);
                    navigate('/login');
                }
                catch(err){
                    if (err.response?.status === 400 || err.response?.status === 500) {
                        setUsername('');
                        setPassword('');
                        setConfirmPassword('');
                        setError('Username already exists. Please choose a different one.');
                    }
                    else{
                        setUsername('');
                        setPassword('');
                        setConfirmPassword('');
                        setError('Registration failed. Please try again.');
                    }
                }
            }
        }
        else{
            setConfirmPassword('');
            setError('Passwords do not match');
            return;
        }
    }
    return <div>
        <form className={styles.myLogin} onSubmit={handleRegister}>
            <h1>Register</h1>
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" id="exampleInputUsername"
                value={Username}
                onChange={(e)=>setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1"
                value={Password}
                onChange={(e)=>setPassword(e.target.value)}/>
                <ul className="list-unstyled small text-muted mt-1">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One number</li>
                    <li>One special character (!@#$%^&*)</li>
                </ul>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}/>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div className="mt-3">
                <span>Already have an account? </span>
                <button type={"button"} className="btn btn-link p-0" onClick={() => navigate('/login')}> Login </button>
            </div>

            <button type="submit" className="btn btn-primary">Register User</button>
        </form>
    </div>
}
export default Signup;