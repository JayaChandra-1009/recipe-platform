import Navbar from "../components/Navbar.jsx";
import commonStyles from "../css/Common.module.css";
import { useEffect, useState } from "react";
import {
    addRecipeToCookbook, createCookbook, deleteCookbook,
    getCookbookRecipes, getMyCookbooks, getPublicCookbooks,
    removeRecipeFromCookbook, updateCookbook
} from "../services/api.js";
import { getMyRecipes } from '../services/api.js';

const Cookbooks = () => {
    const [publicCookbooks, setPublicCookbooks] = useState([]);
    const [myCookbooks, setMyCookbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mine');
    const [showForm, setShowForm] = useState(false);
    const [editingCookbook, setEditingCookbook] = useState(null);
    const [newCookbook, setNewCookbook] = useState({ name: '', description: '', isPublic: true });
    const [cookbookRecipes, setCookbookRecipes] = useState({});
    const [selectedRecipe, setSelectedRecipe] = useState({});
    const [allMyRecipes, setAllMyRecipes] = useState([]);

    /* Fetch all data on page load including recipes inside each cookbook */
    useEffect(() => {
        const fetchData = async () => {
            const publicRes = await getPublicCookbooks();
            const myRes = await getMyCookbooks();
            const recipesRes = await getMyRecipes();
            setAllMyRecipes(recipesRes.data);
            setPublicCookbooks(publicRes.data);
            setMyCookbooks(myRes.data);
            setLoading(false);
            const recipesMap = {};
            for (const cb of myRes.data) {
                const r = await getCookbookRecipes(cb.id);
                recipesMap[cb.id] = r.data;
            }
            setCookbookRecipes(recipesMap);
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        await deleteCookbook(id);
        setMyCookbooks(myCookbooks.filter(c => c.id !== id));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const res = await createCookbook(newCookbook);
        setMyCookbooks([...myCookbooks, res.data]);
        setShowForm(false);
        setNewCookbook({ name: '', description: '', isPublic: true });
    };

    const handleEdit = (cookbook) => {
        setEditingCookbook(cookbook);
        setShowForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateCookbook(editingCookbook.id, editingCookbook);
        setMyCookbooks(myCookbooks.map(c => c.id === editingCookbook.id ? editingCookbook : c));
        setEditingCookbook(null);
        setShowForm(false);
    };

    /* Add a recipe to a cookbook using the dropdown selection */
    const handleAddRecipe = async (cookbookId) => {
        const recipeId = selectedRecipe[cookbookId];
        if (!recipeId) return;
        await addRecipeToCookbook(cookbookId, recipeId);
        const res = await getCookbookRecipes(cookbookId);
        setCookbookRecipes({ ...cookbookRecipes, [cookbookId]: res.data });
        setSelectedRecipe({ ...selectedRecipe, [cookbookId]: '' });
    };

    const handleRemoveRecipe = async (cookbookId, recipeId) => {
        await removeRecipeFromCookbook(cookbookId, recipeId);
        setCookbookRecipes({
            ...cookbookRecipes,
            [cookbookId]: cookbookRecipes[cookbookId].filter(r => r.id !== recipeId)
        });
    };

    return (
        <>
            <Navbar />
            <div className={commonStyles.myPage}>
                <div className="container pt-3">
                    {/* Tab switcher between public and my cookbooks */}
                    <ul className="nav nav-tabs mb-3">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'public' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('public')}>
                                All Public Cookbooks
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'mine' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('mine')}>
                                My Cookbooks
                            </button>
                        </li>
                    </ul>

                    {/* All public cookbooks tab */}
                    {activeTab === 'public' && (
                        loading ? <p>Loading...</p> : (
                            <>
                                <h4 className={commonStyles.mySectionTitle}>Public Cookbooks</h4>
                                <div className="row">
                                    {publicCookbooks.map(cookbook => (
                                        <div key={cookbook.id} className={`col-md-6 mb-3 ${commonStyles.myCard}`}>
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <h5 className="card-title">{cookbook.name}</h5>
                                                    <p className="card-text text-muted">{cookbook.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )
                    )}

                    {/* My cookbooks tab with create, edit, delete and recipe management */}
                    {activeTab === 'mine' && (
                        loading ? <p>Loading...</p> : (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className={commonStyles.mySectionTitle}>My Cookbooks</h4>
                                    {!showForm && (
                                        <button className="btn btn-success" onClick={() => setShowForm(true)}>
                                            + Add Cookbook
                                        </button>
                                    )}
                                </div>

                                {/* Create or edit cookbook form */}
                                {showForm && (
                                    <div className="card p-3 mb-4">
                                        <form onSubmit={editingCookbook ? handleUpdate : handleCreate}>
                                            <h5 className="mb-3">
                                                {editingCookbook ? 'Edit Cookbook' : 'Add New Cookbook'}
                                            </h5>
                                            <div className="row mb-2">
                                                <div className="col-md-6">
                                                    <input className="form-control" placeholder="Cookbook name" required
                                                           value={editingCookbook ? editingCookbook.name : newCookbook.name}
                                                           onChange={e => editingCookbook
                                                               ? setEditingCookbook({ ...editingCookbook, name: e.target.value })
                                                               : setNewCookbook({ ...newCookbook, name: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <input className="form-control" placeholder="Description" required
                                                           value={editingCookbook ? editingCookbook.description : newCookbook.description}
                                                           onChange={e => editingCookbook
                                                               ? setEditingCookbook({ ...editingCookbook, description: e.target.value })
                                                               : setNewCookbook({ ...newCookbook, description: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="checkbox"
                                                       checked={editingCookbook ? editingCookbook.isPublic : newCookbook.isPublic}
                                                       onChange={e => editingCookbook
                                                           ? setEditingCookbook({ ...editingCookbook, isPublic: e.target.checked })
                                                           : setNewCookbook({ ...newCookbook, isPublic: e.target.checked })} />
                                                <label className="form-check-label">Make public</label>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button type="submit" className="btn btn-success">
                                                    {editingCookbook ? 'Update Cookbook' : 'Save Cookbook'}
                                                </button>
                                                <button type="button" className="btn btn-secondary"
                                                        onClick={() => { setShowForm(false); setEditingCookbook(null); }}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Cookbook cards showing recipes inside each cookbook */}
                                <div className="row">
                                    {myCookbooks.map(cookbook => (
                                        <div key={cookbook.id} className={`col-md-6 mb-3 ${commonStyles.myCard}`}>
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <h5 className="card-title">{cookbook.name}</h5>
                                                    <p className="text-muted">{cookbook.description}</p>

                                                    {/* Recipe list inside this cookbook with add and remove */}
                                                    <div className="border rounded p-2 mb-3 bg-light">
                                                        <small className="text-muted fw-bold d-block mb-2">
                                                            Recipes in this cookbook:
                                                        </small>
                                                        {(cookbookRecipes[cookbook.id] || []).map(recipe => (
                                                            <div key={recipe.id}
                                                                 className="d-flex justify-content-between align-items-center py-1 border-bottom">
                                                                <span style={{ fontSize: '13px' }}>{recipe.title}</span>
                                                                <button className="btn btn-link btn-sm text-danger p-0"
                                                                        onClick={() => handleRemoveRecipe(cookbook.id, recipe.id)}>
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <div className="d-flex gap-2 mt-2">
                                                            <select className="form-select form-select-sm"
                                                                    value={selectedRecipe[cookbook.id] || ''}
                                                                    onChange={e => setSelectedRecipe({
                                                                        ...selectedRecipe,
                                                                        [cookbook.id]: e.target.value
                                                                    })}>
                                                                <option value="">Add a recipe...</option>
                                                                {allMyRecipes
                                                                    .filter(r => !(cookbookRecipes[cookbook.id] || [])
                                                                        .some(cr => cr.id === r.id))
                                                                    .map(r => (
                                                                        <option key={r.id} value={r.id}>{r.title}</option>
                                                                    ))}
                                                            </select>
                                                            <button className="btn btn-primary btn-sm"
                                                                    onClick={() => handleAddRecipe(cookbook.id)}>
                                                                Add
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-primary btn-sm flex-fill"
                                                                onClick={() => handleEdit(cookbook)}>Edit</button>
                                                        <button className="btn btn-danger btn-sm flex-fill"
                                                                onClick={() => handleDelete(cookbook.id)}>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default Cookbooks;