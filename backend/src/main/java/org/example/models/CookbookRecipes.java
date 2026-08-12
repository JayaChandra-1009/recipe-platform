package org.example.models;

public class CookbookRecipes {
    private int cookbookId;

    private int recipeId;

    public CookbookRecipes(){};

    public CookbookRecipes(int cookbookId,int recipeId){
        this.cookbookId=cookbookId;
        this.recipeId=recipeId;
    }

    public int getCookbookId() {
        return cookbookId;
    }

    public void setCookbookId(int cookbookId) {
        this.cookbookId = cookbookId;
    }

    public int getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(int recipeId) {
        this.recipeId = recipeId;
    }
}
