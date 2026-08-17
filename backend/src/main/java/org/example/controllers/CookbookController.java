package org.example.controllers;

import org.example.daos.CookbookDao;
import org.example.models.Cookbook;
import org.example.models.CookbookRecipes;
import org.example.models.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cookbooks")
public class CookbookController {

    @Autowired
    private CookbookDao cookbookDao;

    @GetMapping
    public List<Cookbook> getAll() {
        return cookbookDao.getAll();
    }

    @GetMapping("/{id}")
    public Cookbook getById(@PathVariable int id) {
        Cookbook cookbook= cookbookDao.getById(id);
        if (cookbook == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Cookbook with ID: "+id+" not found");
        }
        return cookbook;


    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/user")
    public List<Cookbook> getByUsername(Principal principal) {
        return cookbookDao.getByUsername(principal.getName());
    }

    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Cookbook create(@RequestBody Cookbook cookbook, Principal principal) {

        cookbook.setUsername(principal.getName());
        return cookbookDao.create(cookbook);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public Cookbook update(@RequestBody Cookbook cookbook, @PathVariable int id,Principal principal) {
        Cookbook existing = cookbookDao.getById(id);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cookbook not found");
        }
        if (!existing.getUsername().equals(principal.getName()) && !isAdmin(principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this cookbook");
        }
        cookbook.setId(id);
        int rowsAffected = cookbookDao.update(cookbook);
        if (rowsAffected ==1) {
            return cookbookDao.getById(id);
        }
        else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cookbook not found");
        }
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public int delete(@PathVariable int id, Principal principal) {
        Cookbook existing = cookbookDao.getById(id);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cookbook not found");
        }
        if (!existing.getUsername().equals(principal.getName()) && !isAdmin(principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this cookbook");
        }
        int rowsAffected = cookbookDao.delete(id);
        if (rowsAffected ==1) {
            return rowsAffected;
        }
        else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cookbook with ID: "+id+" not found");
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{cookbookId}/cookbook_recipes/{recipeId}")
    public int addRecipes(@PathVariable int cookbookId, @PathVariable int recipeId,Principal principal) {
        Cookbook existing = cookbookDao.getById(cookbookId);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cookbook not found");
        }
        if (!existing.getUsername().equals(principal.getName()) && !isAdmin(principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this cookbook");
        }
        return cookbookDao.addRecipe(cookbookId, recipeId);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{cookbookId}/cookbook_recipes/{recipeId}")
    public int removeRecipes(@PathVariable int cookbookId, @PathVariable int recipeId,Principal principal) {
        Cookbook existing = cookbookDao.getById(cookbookId);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cookbook not found");
        }
        if (!existing.getUsername().equals(principal.getName()) && !isAdmin(principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this cookbook");
        }
        return cookbookDao.removeRecipe(cookbookId,recipeId);
    }

    @GetMapping("/{cookbookId}/recipes")
    public List<Recipe> getAllRecipes(@PathVariable int cookbookId) {
        return cookbookDao.getAllRecipes(cookbookId);
    }

    private boolean isAdmin(Principal principal) {
        return ((Authentication) principal).getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
    }
}
