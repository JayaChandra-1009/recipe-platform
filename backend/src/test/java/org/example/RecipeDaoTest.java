package org.example;

import org.example.daos.RecipeDao;
import org.example.models.Recipe;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RecipeDaoTest {

    @Autowired
    private RecipeDao recipeDao;

    private static int createdRecipeId;

    @BeforeEach
    void setup(){}

    @Test
    @Order(1)
    void create_savesRecipe(){
        Recipe recipe = new Recipe();
        recipe.setTitle("Test Recipe");
        recipe.setDescription("Test Description");
        recipe.setInstructions("Test Instructions");
        recipe.setCookingTime(30);
        recipe.setCuisineType("ITALIAN");
        recipe.setDietaryType("VEGETARIAN");
        recipe.setIsPublic(true);
        recipe.setUsername("admin");

        Recipe created= recipeDao.create(recipe);

        assertNotNull(created);
        assertTrue(created.getId()>0);
        assertEquals("Test Recipe", created.getTitle());
        createdRecipeId=created.getId();
    }

    @Test
    @Order(2)
    void getById_returnRecipe(){
        Recipe recipe=recipeDao.getById(createdRecipeId);
        assertNotNull(recipe);
        assertEquals("Test Recipe", recipe.getTitle());
    }

    @Test
    @Order(3)
    void getById_returnNull(){
        Recipe recipe=recipeDao.getById(9999);
        assertNull(recipe);
    }

    @Test
    @Order(4)
    void getAll_returnList(){
        List<Recipe> recipes=recipeDao.getAll();
        assertNotNull(recipes);
        assertFalse(recipes.isEmpty());
    }

    @Test
    @Order(5)
    void getPublicRecipes_returnsOnlyPublic() {
        List<Recipe> recipes = recipeDao.getPublicRecipes();
        assertNotNull(recipes);
        assertTrue(recipes.stream().allMatch(Recipe::getIsPublic));
    }

    @Test
    @Order(6)
    void update_updatesRecipe() {
        Recipe recipe=recipeDao.getById(createdRecipeId);
        recipe.setTitle("Updated Title");
        recipeDao.updateRecipe(recipe);
        Recipe updated= recipeDao.getById(createdRecipeId);
        assertEquals("Updated Title", updated.getTitle());
    }

    @Test
    @Order(7)
    void search_findsByTitle() {
        List<Recipe> byTitle = recipeDao.search("Updated", Integer.MAX_VALUE, "");
        assertFalse(byTitle.isEmpty());
        assertTrue(byTitle.stream().allMatch(r -> r.getTitle().contains("Updated")));
    }

    @Test
    @Order(8)
    void delete_removesRecipe() {
        int rows = recipeDao.deleteRecipe(createdRecipeId);
        assertEquals(1, rows);
        Recipe deleted = recipeDao.getById(createdRecipeId);
        assertNull(deleted);
    }

    @Test
    @Order(9)
    void getSortedRecipes_sortsByTitleASC() {
        List<Recipe> results = recipeDao.getSortedRecipes("title", "ASC");
        assertFalse(results.isEmpty());

        for (int i = 0; i < results.size() - 1; i++) {
            String current = results.get(i).getTitle();
            String next = results.get(i + 1).getTitle();
            assertTrue(current.compareToIgnoreCase(next) <= 0);
        }
    }

    @Test
    @Order(10)
    void getSortedRecipes_sortsByTitleDESC() {
        List<Recipe> results = recipeDao.getSortedRecipes("title", "DESC");
        assertFalse(results.isEmpty());

        for (int i = 0; i < results.size() - 1; i++) {
            String current = results.get(i).getTitle();
            String next = results.get(i + 1).getTitle();
            assertTrue(current.compareToIgnoreCase(next) >= 0);
        }
    }

    @Test
    @Order(11)
    void getSortedRecipes_sortsByCookingTimeASC() {
        List<Recipe> results = recipeDao.getSortedRecipes("cooking_time", "ASC");
        assertFalse(results.isEmpty());

        for (int i = 0; i < results.size() - 1; i++) {
            int current= results.get(i).getCookingTime();
            int next=results.get(i+1).getCookingTime();
            assertTrue(current <= next);
        }
    }

    @Test
    @Order(12)
    void getSortedRecipes_sortsByCookingTimeDESC() {
        List<Recipe> results = recipeDao.getSortedRecipes("cooking_time", "DESC");
        assertFalse(results.isEmpty());

        for (int i = 0; i < results.size() - 1; i++) {
            int current= results.get(i).getCookingTime();
            int next=results.get(i+1).getCookingTime();
            assertTrue(current >= next);
        }
    }
}
