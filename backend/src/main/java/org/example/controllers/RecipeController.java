package org.example.controllers;

import org.example.daos.RecipeDao;
import org.example.models.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeDao recipeDao;

    @GetMapping
    public List<Recipe> getAll(){
        return recipeDao.getPublicRecipes();
    }

    @GetMapping("/{id}")
    public Recipe getById(@PathVariable  int id){
        Recipe recipe = recipeDao.getById(id);
        if (recipe == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found");
        }
        return recipe;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/user")
    public List<Recipe> getByUser(Principal principal) {
        return recipeDao.getByUsername(principal.getName());
    }

    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Recipe create(@RequestBody Recipe recipe, Principal principal){
        recipe.setUsername(principal.getName());
        return recipeDao.create(recipe);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public Recipe updateRecipe(@RequestBody Recipe recipe, @PathVariable int id,Principal principal){
        Recipe existing = recipeDao.getById(id);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found");
        }
        if (!existing.getUsername().equals(principal.getName()) && !isAdmin(principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this recipe");
        }

        recipe.setId(id);
        int rows = recipeDao.updateRecipe(recipe);
        if (rows == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found");
        }
        return recipeDao.getById(id);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public int deleteRecipe(@PathVariable int id, Principal principal){
        Recipe existing = recipeDao.getById(id);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found");
        }
        if (!existing.getUsername().equals(principal.getName()) && !isAdmin(principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this recipe");
        }

        int rowsAffected = recipeDao.deleteRecipe(id);
        if(rowsAffected == 1){
            return rowsAffected;
        }
        else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe with ID:"+id+" not found");
        }
    }

    @GetMapping("/search")
    public List<Recipe> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String cuisineType,
            @RequestParam(required = false) Integer maxCookingTime) {

        if (title == null) title = "";
        if (cuisineType == null) cuisineType = "";
        if (maxCookingTime == null) maxCookingTime = Integer.MAX_VALUE;

        return recipeDao.search(title, maxCookingTime, cuisineType);
    }


    @GetMapping("/sort")
    public List<Recipe> getSortedRecipes(@RequestParam(required = false) String sortBy,@RequestParam(required = false) String order){
        List<String> allowedFields = List.of("title", "cooking_time");
        List<String> allowedOrders = List.of("ASC", "DESC");
        if (sortBy == null || !allowedFields.contains(sortBy)) sortBy = "title";
        if (order == null || !allowedOrders.contains(order.toUpperCase())) order = "ASC";
        return recipeDao.getSortedRecipes(sortBy, order);
    }

    private boolean isAdmin(Principal principal) {
        return ((Authentication) principal).getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
    }

}
