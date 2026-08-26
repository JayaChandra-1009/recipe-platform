import Navbar from "../components/Navbar.jsx";
import dashStyles from "../css/Dashboard.module.css";
import commonStyles from "../css/Common.module.css";
import { useEffect, useState } from "react";
import { getPublicCookbooks, getPublicRecipes } from "../services/api.js";
import Loading from "../components/Loading.jsx";

const Dashboard = () => {
    const [recipes, setRecipes] = useState([]);
    const [cookbooks, setCookbooks] = useState([]);
    const [loading, setLoading] = useState(true);

    /* Fetch public recipes and cookbooks on page load */
    useEffect(() => {
        const fetchData = async () => {
            const recipeRes = await getPublicRecipes();
            const cookbooksRes = await getPublicCookbooks();
            setRecipes(recipeRes.data);
            setCookbooks(cookbooksRes.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const username = localStorage.getItem('Username');

    /* Returns the correct badge color based on dietary type */
    const getBadgeClass = (dietaryType) => {
        if (dietaryType === 'NON_VEGETARIAN') return 'badge bg-danger';
        if (dietaryType === 'VEGAN') return 'badge bg-info text-dark';
        return 'badge bg-success';
    };

    return (
        <>
            <Navbar />
            {loading ? <Loading /> : (
                <div className={commonStyles.myPage}>
                    {/* Hero welcome banner */}
                    <div className={dashStyles.myHero}>
                        <h2>Welcome back, {username} 👋</h2>
                        <p>Discover recipes and cookbooks from the community</p>
                    </div>

                    {/* Public recipes preview - shows first 6 only */}
                    <div className="container">
                        <h4 className={commonStyles.mySectionTitle}>Public Recipes</h4>
                        <div className="row">
                            {recipes.slice(0, 6).map((recipe) => (
                                <div key={recipe.id} className={`col-md-4 mb-3 ${commonStyles.myCard}`}>
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <h5 className="card-title">{recipe.title}</h5>
                                                <span className={getBadgeClass(recipe.dietaryType)}>
                                                    {recipe.dietaryType}
                                                </span>
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
                        </div>
                        <div className="text-end mt-2 mb-4">
                            <a href="/recipes" className="text-decoration-none">View all Recipes →</a>
                        </div>

                        {/* Public cookbooks preview - shows first 3 only */}
                        <h4 className={commonStyles.mySectionTitle}>Public Cookbooks</h4>
                        <div className="row">
                            {cookbooks.slice(0, 3).map((cookbook) => (
                                <div key={cookbook.id} className={`col-md-4 mb-3 ${commonStyles.myCard}`}>
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{cookbook.name}</h5>
                                            <p className="card-text text-muted">{cookbook.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-end mt-2 mb-4">
                            <a href="/cookbooks" className="text-decoration-none">View all Cookbooks →</a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;