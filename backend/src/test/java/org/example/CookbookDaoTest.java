package org.example;

import org.example.daos.CookbookDao;
import org.example.daos.RecipeDao;
import org.example.models.Cookbook;
import org.example.models.CookbookRecipes;
import org.example.models.Recipe;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CookbookDaoTest {

    @Autowired
    private CookbookDao cookbookDao;
    @Autowired
    private RecipeDao recipeDao;
    private static int created_cookbookId;
    private static int created_recipeId;

    @BeforeEach
    void setup(){}

    @Test
    @Order(1)
    void create_savesCookbook(){
        Cookbook cookbook = new Cookbook();
        cookbook.setName("Cookbook");
        cookbook.setDescription("Description");
        cookbook.setIsPublic(true);
        cookbook.setUsername("admin");
        Cookbook created= cookbookDao.create(cookbook);

        Recipe recipe = new Recipe();
        recipe.setTitle("Test Recipe");
        recipe.setDescription("Test Description");
        recipe.setInstructions("Test Instructions");
        recipe.setCookingTime(30);
        recipe.setCuisineType("ITALIAN");
        recipe.setDietaryType("VEGETARIAN");
        recipe.setIsPublic(true);
        recipe.setUsername("admin");
        recipeDao.create(recipe);
        created_recipeId = recipe.getId();

        assertNotNull(created);
        assertEquals("Cookbook",created.getName());
        assertTrue(created.getId()>0);
        created_cookbookId = cookbook.getId();

    }

    @Test
    @Order(2)
    void getById_returnsCookbook(){
        Cookbook cookbook = cookbookDao.getById(created_cookbookId);
        assertNotNull(cookbook);
        assertEquals("Cookbook",cookbook.getName());
    }

    @Test
    @Order(3)
    void getById_returnsNull(){
        Cookbook cookbook = cookbookDao.getById(9999);
        assertNull(cookbook);
    }

    @Test
    @Order(4)
    void getAll_returnsAllCookbooks(){
        List<Cookbook> cookbooks = cookbookDao.getAll();
        assertNotNull(cookbooks);
        assertFalse(cookbooks.isEmpty());
    }

    @Test
    @Order(5)
    void update_updateCookbook(){
        Cookbook cookbook = cookbookDao.getById(created_cookbookId);
        cookbook.setDescription("Updated Description");
        cookbookDao.update(cookbook);
        Cookbook updated = cookbookDao.getById(created_cookbookId);
        assertEquals("Updated Description",updated.getDescription());
    }


    @Test
    @Order(6)
    void addRecipe_returnsCookbookRecipe(){
        int rows=cookbookDao.addRecipe(created_cookbookId, created_recipeId);
        assertEquals(1,rows);
    }

    @Test
    @Order(7)
    void getAllRecipes_returnsRecipesInCookbook() {
        List<Recipe> recipes = cookbookDao.getAllRecipes(created_cookbookId);
        assertNotNull(recipes);
        assertFalse(recipes.isEmpty());
    }
    @Test
    @Order(8)
    void removeRecipe_removesCookbookRecipe(){
        int rows= cookbookDao.removeRecipe(created_cookbookId, created_recipeId);
        assertEquals(1,rows);
    }

    @Test
    @Order(9)
    void delete_deleteCookbook(){
        cookbookDao.delete(created_cookbookId);
        Cookbook deleted = cookbookDao.getById(created_cookbookId);
        assertNull(deleted);
    }
}
