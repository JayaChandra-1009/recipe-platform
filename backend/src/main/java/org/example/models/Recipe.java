package org.example.models;

import java.util.Date;

public class Recipe {
    private int id;

    private String title;

    private String description;

    private String instructions;

    private int cookingTime;

    private String cuisineType;

    private String dietaryType;

    private boolean isPublic;

    private String username;

    private Date createdAt;

    public Recipe(){}

    public Recipe(int id, String title, String description, String instructions, int cookingTime, String cuisineType, String dietaryType, boolean isPublic, String username, Date createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.instructions = instructions;
        this.cookingTime = cookingTime;
        this.cuisineType = cuisineType;
        this.dietaryType = dietaryType;
        this.isPublic = isPublic;
        this.username = username;
        this.createdAt = createdAt;
    }

    public int getId() {return id;}

    public String getTitle() {return title;}

    public String getDescription() {return description;}

    public String getInstructions() {return instructions;}

    public int getCookingTime() {return cookingTime;}

    public String getCuisineType() {return cuisineType;}

    public String getDietaryType() {return dietaryType;}

    public boolean getIsPublic() {return isPublic;}

    public String getUsername() {return username;}

    public Date getCreatedAt() {return createdAt;}

    public void setId(int id) {this.id = id;}
    public void setTitle(String title) {this.title = title;}

    public void setDescription(String description) {this.description = description;}

    public void setInstructions(String instructions) {this.instructions = instructions;}

    public void setCookingTime(int cookingTime) {this.cookingTime = cookingTime;}

    public void setCuisineType(String cuisineType){this.cuisineType = cuisineType;}

    public void setDietaryType(String dietaryType) {this.dietaryType = dietaryType;}

    public void setIsPublic(boolean isPublic){this.isPublic=isPublic;}

    public void setUsername(String username){this.username=username;}

    public void setCreatedAt(Date createdAt){this.createdAt=createdAt;}

}