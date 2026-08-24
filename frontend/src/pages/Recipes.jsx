import Navbar from "../components/Navbar.jsx";
import {useEffect, useState} from "react";
import styles from "../css/Dashboard.module.css";
import Loading from "../components/Loading.jsx";
import {createRecipe, deleteRecipe, getMyRecipes, getPublicRecipes, updateRecipe} from "../services/api.js";

const Recipes = () => {
    const [activeTab, setActiveTab] = useState("mine");
    const [publicRecipes, setPublicRecipes] = useState([]);
    const [myRecipes, setMyRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    const [publicSearchTerm, setPublicSearchTerm] = useState('');
    const [publicSortBy, setPublicSortBy] = useState('title');
    const [publicOrder, setPublicOrder] = useState('ASC');

    const filteredRecipes = myRecipes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [sortBy, setSortBy] = useState('title');
    const [order, setOrder] = useState('ASC');
    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
        if (sortBy === 'title') {
            return order === 'ASC'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        } else {
            return order === 'ASC'
                ? a.cookingTime - b.cookingTime
                : b.cookingTime - a.cookingTime;
        }
    });
    const [newRecipe, setNewRecipe] = useState({
        title: '',
        description: '',
        instructions: '',
        cookingTime: '',
        cuisineType: '',
        dietaryType: 'VEGETARIAN',
        isPublic: true
    });

    const handleDelete = async (id) => {
        await deleteRecipe(id);
        setMyRecipes(myRecipes.filter(r => r.id !== id));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const res = await createRecipe(newRecipe);
        setMyRecipes([...myRecipes, res.data]);
        setShowForm(false);
        setNewRecipe({
            title: '', description: '', instructions: '',
            cookingTime: '', cuisineType: '', dietaryType: 'VEGETARIAN', isPublic: true
        });
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setShowForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateRecipe(editingRecipe.id, editingRecipe);
        setMyRecipes(myRecipes.map(r => r.id === editingRecipe.id ? editingRecipe : r));
        setEditingRecipe(null);
        setShowForm(false);
    };

    const filteredPublicRecipes = publicRecipes.filter(r =>
        r.title.toLowerCase().includes(publicSearchTerm.toLowerCase())
    );

    const sortedPublicRecipes = [...filteredPublicRecipes].sort((a, b) => {
        if (publicSortBy === 'title') {
            return publicOrder === 'ASC'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        } else {
            return publicOrder === 'ASC'
                ? a.cookingTime - b.cookingTime
                : b.cookingTime - a.cookingTime;
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            const publicRes = await getPublicRecipes();
            const myRes = await getMyRecipes();
            setPublicRecipes(publicRes.data);
            setMyRecipes(myRes.data);
            setLoading(false);
        };
        fetchData();
    }, []);
    return <>
        <Navbar></Navbar>
        <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === 'public' ? 'active' : ''}`}
                    onClick={() => setActiveTab('public')}>
                    All Public Recipes
                </button>
            </li>
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === 'mine' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mine')}>
                    My Recipes
                </button>
            </li>
        </ul>
        {activeTab === "public" && (loading ? (<Loading></Loading>) : (
            <>
                <h4 className={styles.mySectionTitle}>Public Recipes</h4>
                <div className="d-flex gap-2 mb-3">
                    <input className="form-control" placeholder="Search public recipes..."
                           value={publicSearchTerm}
                           onChange={e => setPublicSearchTerm(e.target.value)}/>
                    <select className="form-select w-auto"
                            value={publicSortBy} onChange={e => setPublicSortBy(e.target.value)}>
                        <option value="title">Title</option>
                        <option value="cookingTime">Cooking Time</option>
                    </select>
                    <select className="form-select w-auto"
                            value={publicOrder} onChange={e => setPublicOrder(e.target.value)}>
                        <option value="ASC">A → Z</option>
                        <option value="DESC">Z → A</option>
                    </select>
                </div>
                <div className={"container"}>
                    <div className={`${styles.myPublicRecipes} row`}>
                        {sortedPublicRecipes.map((recipe) => (
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
                    </div>
                </div>

            </>
        ))}

        {activeTab === "mine" && (
            loading ? <Loading/> : (
                <>
                    <div className="container mt-3">


                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className={styles.mySectionTitle}>My Recipes</h4>
                            {!showForm && (
                                <button
                                    className="btn btn-success"
                                    onClick={() => setShowForm(true)}>
                                    + Add Recipe
                                </button>
                            )}
                        </div>
                        {showForm && (
                            <div className="card mt-3 p-3 mb-4">
                                <h5>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h5>
                                <form onSubmit={editingRecipe ? handleUpdate : handleCreate}>
                                    <div className="row mb-2">
                                        <div className="col-md-6">
                                            <input className="form-control" placeholder="Title" required
                                                   value={editingRecipe ? editingRecipe.title : newRecipe.title}
                                                   onChange={e => editingRecipe
                                                       ? setEditingRecipe({...editingRecipe, title: e.target.value})
                                                       : setNewRecipe({...newRecipe, title: e.target.value})}/>
                                        </div>
                                        <div className="col-md-6">
                                            <input className="form-control" placeholder="Description"
                                                   value={editingRecipe ? editingRecipe.description : newRecipe.description}
                                                   onChange={e => editingRecipe
                                                       ? setEditingRecipe({
                                                           ...editingRecipe,
                                                           description: e.target.value
                                                       })
                                                       : setNewRecipe({...newRecipe, description: e.target.value})}/>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                <textarea className="form-control" placeholder="Instructions" required
                          value={editingRecipe ? editingRecipe.instructions : newRecipe.instructions}
                          onChange={e => editingRecipe
                              ? setEditingRecipe({...editingRecipe, instructions: e.target.value})
                              : setNewRecipe({...newRecipe, instructions: e.target.value})}/>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-md-4">
                                            <input className="form-control" type="number"
                                                   placeholder="Cooking time (mins)"
                                                   value={editingRecipe ? editingRecipe.cookingTime : newRecipe.cookingTime}
                                                   onChange={e => editingRecipe
                                                       ? setEditingRecipe({
                                                           ...editingRecipe,
                                                           cookingTime: e.target.value
                                                       })
                                                       : setNewRecipe({...newRecipe, cookingTime: e.target.value})}/>
                                        </div>
                                        <div className="col-md-4">
                                            <input className="form-control" placeholder="Cuisine type (e.g. ITALIAN)"
                                                   value={editingRecipe ? editingRecipe.cuisineType : newRecipe.cuisineType}
                                                   onChange={e => editingRecipe
                                                       ? setEditingRecipe({
                                                           ...editingRecipe,
                                                           cuisineType: e.target.value
                                                       })
                                                       : setNewRecipe({...newRecipe, cuisineType: e.target.value})}/>
                                        </div>
                                        <div className="col-md-4">
                                            <select className="form-select"
                                                    value={editingRecipe ? editingRecipe.dietaryType : newRecipe.dietaryType}
                                                    onChange={e => editingRecipe
                                                        ? setEditingRecipe({
                                                            ...editingRecipe,
                                                            dietaryType: e.target.value
                                                        })
                                                        : setNewRecipe({...newRecipe, dietaryType: e.target.value})}>
                                                <option value="VEGETARIAN">Vegetarian</option>
                                                <option value="VEGAN">Vegan</option>
                                                <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox"
                                               checked={editingRecipe ? editingRecipe.isPublic : newRecipe.isPublic}
                                               onChange={e => editingRecipe
                                                   ? setEditingRecipe({...editingRecipe, isPublic: e.target.checked})
                                                   : setNewRecipe({...newRecipe, isPublic: e.target.checked})}/>
                                        <label className="form-check-label">Make public</label>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-success">
                                            {editingRecipe ? 'Update Recipe' : 'Save Recipe'}
                                        </button>
                                        <button type="button" className="btn btn-secondary"
                                                onClick={() => {
                                                    setShowForm(false);
                                                    setEditingRecipe(null);
                                                }}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}


                        <div className="d-flex gap-2 mb-3">
                            <input className="form-control" placeholder="Search my recipes..."
                                   value={searchTerm}
                                   onChange={e => setSearchTerm(e.target.value)}/>
                            <select className="form-select w-auto"
                                    value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="title">Title</option>
                                <option value="cookingTime">Cooking Time</option>
                            </select>
                            <select className="form-select w-auto"
                                    value={order} onChange={e => setOrder(e.target.value)}>
                                <option value="ASC">A → Z</option>
                                <option value="DESC">Z → A</option>
                            </select>
                        </div>


                        <div className="row">
                            {sortedRecipes.map((recipe) => (
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
                                                <small
                                                    className="text-muted ms-3">{recipe.isPublic ? '🌍 Public' : '🔒 Private'}</small>
                                            </p>
                                        </div>
                                        <div className="card-footer d-flex gap-2">
                                            <button
                                                className="btn btn-primary btn-sm flex-fill"
                                                onClick={() => handleEdit(recipe)}>
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm flex-fill"
                                                onClick={() => handleDelete(recipe.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )
        )}
    </>

}
export default Recipes;