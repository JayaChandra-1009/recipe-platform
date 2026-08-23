import {NavLink, useNavigate} from "react-router-dom";

const Navbar=()=> {
    const navigate=useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('Username');
        navigate('/login');
    };
    return <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <NavLink className="navbar-brand fs-4 fw-bold" to="/dashboard">
                Recipe Platform
            </NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" aria-current="page" to="/dashboard">Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link " to="/recipes">My Recipes</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/cookbooks">My Cookbooks</NavLink>
                    </li>
                </ul>
                <button className="btn btn-outline-light ms-auto" onClick={handleLogout} >
                    Logout
                </button>
            </div>
        </div>
    </nav>
}
export default Navbar;