package org.example.daos;

import org.example.models.Recipe;
import org.example.models.User;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

@Component
public class RecipeDao {
    private final JdbcTemplate jdbcTemplate;

    public RecipeDao(DataSource dataSource){
        this.jdbcTemplate=new JdbcTemplate(dataSource);
    }


    private Recipe mapToRecipe(ResultSet resultSet, int rowNumber) throws SQLException{
        Recipe recipe = new Recipe();

        recipe.setId(resultSet.getInt("id"));
        recipe.setTitle(resultSet.getString("title"));
        recipe.setDescription(resultSet.getString("description"));
        recipe.setInstructions(resultSet.getString("instructions"));
        recipe.setCookingTime(resultSet.getInt("cooking_time"));
        recipe.setCuisineType(resultSet.getString("cuisine_type"));
        recipe.setDietaryType(resultSet.getString("dietary_type"));
        recipe.setIsPublic(resultSet.getBoolean("is_public"));
        recipe.setUsername(resultSet.getString("username"));
        recipe.setCreatedAt(resultSet.getDate("created_at"));
        return recipe;
    }

    public List<Recipe> getAll(){
        return jdbcTemplate.query("select * from recipes", this::mapToRecipe);
    }

    public Recipe getById(int id){
        try{
            return jdbcTemplate.queryForObject("select * from recipes where id=?", this::mapToRecipe, id);
        }
        catch (EmptyResultDataAccessException e){
            return null;
        }
    }

    public List<Recipe> getByUsername(String username){
        return jdbcTemplate.query("select * from recipes where username=?", this::mapToRecipe, username);
    }

    public Recipe create(Recipe recipe){
        String sql="insert into recipes (title,description,instructions,cooking_time,cuisine_type,dietary_type,is_public,username) values (?,?,?,?,?,?,?,?)";
        KeyHolder keyHolder=new GeneratedKeyHolder();
        jdbcTemplate.update(connection->{
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1,recipe.getTitle());
            ps.setString(2,recipe.getDescription());
            ps.setString(3,recipe.getInstructions());
            ps.setInt(4,recipe.getCookingTime());
            ps.setString(5,recipe.getCuisineType());
            ps.setString(6,recipe.getDietaryType());
            ps.setBoolean(7,recipe.getIsPublic());
            ps.setString(8,recipe.getUsername());
            return ps;
        },keyHolder);
        recipe.setId(keyHolder.getKey().intValue());
        return recipe;
    }

    public int updateRecipe(Recipe recipe){
        return jdbcTemplate.update("update recipes set title=?,description=?,instructions=?,cooking_time=?,cuisine_type=?,dietary_type=?,is_public=? where id=?",recipe.getTitle(),recipe.getDescription(),recipe.getInstructions(),recipe.getCookingTime(),recipe.getCuisineType(),recipe.getDietaryType(),recipe.getIsPublic(),recipe.getId());
    }

    public int deleteRecipe(int id){
        return jdbcTemplate.update("delete from recipes where id=?",id);
    }


    public List<Recipe> search(String title, Integer cookingTime, String cuisineType){
        String sql="select * from recipes where is_public= true AND title like ? AND cooking_time<= ? And (cuisine_type=? or ?='')";
        return jdbcTemplate.query(sql, this::mapToRecipe,"%"+title+"%",cookingTime,cuisineType,cuisineType);
    }

    public List<Recipe> getPublicRecipes(){
        return jdbcTemplate.query("select * from recipes where is_public= true",this::mapToRecipe);
    }

    public List<Recipe> getSortedRecipes(String sortBy, String order) {
        String sql = "SELECT * FROM recipes WHERE is_public = true " +
                "ORDER BY " + sortBy + " " + order;
        return jdbcTemplate.query(sql, this::mapToRecipe);
    }

}
