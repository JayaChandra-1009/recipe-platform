import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('Username');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

//New User
export const register = (username, password) =>
    api.post('/api/users', { username, password });
// Auth
export const login = (username, password) =>
    api.post('/auth/login', { username, password });

// Recipes
export const getPublicRecipes = () => api.get('/api/recipes');
export const getMyRecipes = () => api.get('/api/recipes/user');
export const getRecipeById = (id) => api.get(`/api/recipes/${id}`);
export const createRecipe = (recipe) => api.post('/api/recipes', recipe);
export const updateRecipe = (id, recipe) => api.put(`/api/recipes/${id}`, recipe);
export const deleteRecipe = (id) => api.delete(`/api/recipes/${id}`);
export const searchRecipes = (title, cuisineType, maxCookingTime) =>
    api.get(`/api/recipes/search?title=${title}&cuisineType=${cuisineType}&maxCookingTime=${maxCookingTime}`);
export const sortRecipes = (sortBy, order) =>
    api.get(`/api/recipes/sort?sortBy=${sortBy}&order=${order}`);

// Cookbooks
export const getPublicCookbooks = () => api.get('/api/cookbooks');
export const getMyCookbooks = () => api.get('/api/cookbooks/user');
export const getCookbookById = (id) => api.get(`/api/cookbooks/${id}`);
export const createCookbook = (cookbook) => api.post('/api/cookbooks', cookbook);
export const updateCookbook = (id, cookbook) => api.put(`/api/cookbooks/${id}`, cookbook);
export const deleteCookbook = (id) => api.delete(`/api/cookbooks/${id}`);
export const getCookbookRecipes = (id) => api.get(`/api/cookbooks/${id}/recipes`);
export const addRecipeToCookbook = (cookbookId, recipeId) =>
    api.post(`/api/cookbooks/${cookbookId}/cookbook_recipes/${recipeId}`);
export const removeRecipeFromCookbook = (cookbookId, recipeId) =>
    api.delete(`/api/cookbooks/${cookbookId}/cookbook_recipes/${recipeId}`);