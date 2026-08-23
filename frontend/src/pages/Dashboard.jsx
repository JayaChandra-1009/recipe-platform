import Navbar from "../components/Navbar.jsx";
import styles from "../css/Dashboard.module.css";
import {useEffect, useState} from "react";
import {getPublicCookbooks, getPublicRecipes} from "../services/api.js";
import Loading from "../components/Loading.jsx";
const Dashboard=()=>{
    const [recipes,setRecipes]= useState([]);
    const [cookbooks,setCookbooks]= useState([]);
    const [loading,setLoading]=useState(true);
    useEffect(() => {
        const fetchData=async ()=>{
            const recipeRes= await getPublicRecipes();
            const cookbooksRes=await getPublicCookbooks();
            setRecipes(recipeRes.data);
            setCookbooks(cookbooksRes.data);
            setLoading(false);
        };
        fetchData();
    }, []);
    const Username=localStorage.getItem('Username');
    return <>
        <Navbar></Navbar>

        {loading? (<Loading></Loading>): (
            <div className={styles.myPage}>
                <div className={styles.myHero}>
                    <h2>Welcome back, {Username} 👋</h2>
                    <p>Discover recipes and cookbooks from the community</p>
                </div>
                <h4 className={styles.mySectionTitle}>Public Recipes</h4>
                <div className={"container"}>
                    <div className={`${styles.myPublicRecipes} row`}>
                        {recipes.slice(0, 9).map((recipe) => (
                            <div key={recipe.id} className="col-md-4 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h5 className="card-title">{recipe.title}</h5>
                                            <span className="badge bg-success">{recipe.dietaryType}</span>
                                        </div>
                                        <p className="card-text text-muted">{recipe.description}</p>
                                        <p className="card-text">
                                            <small className="text-muted">🍴 {recipe.cuisineType}</small>
                                            <small className="text-muted ms-3">⏱ {recipe.cookingTime} mins</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="text-end mt-2 me-3">
                            <a href="/recipes" className="text-decoration-none">View all Recipes →</a>
                        </div>
                    </div>
                </div>
                <h4 className={styles.mySectionTitle}>Public Cookbooks</h4>
                <div className={" container"}>
                    <div className="row">
                        {cookbooks.slice(0, 3).map((cookbook) => (
                            <div key={cookbook.id} className="col-md-4 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h5 className="card-title">{cookbook.name}</h5>
                                        </div>
                                        <p className="card-text text-muted">{cookbook.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="text-end mt-2 me-3">
                            <a href="/cookbooks" className="text-decoration-none">View all Cookbooks →</a>
                        </div>
                    </div>
                </div>
            </div>
        )}


    </>

}
export default Dashboard;