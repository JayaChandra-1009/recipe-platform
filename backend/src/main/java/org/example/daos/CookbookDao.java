package org.example.daos;

import org.example.models.Cookbook;
import org.example.models.CookbookRecipes;
import org.example.models.Recipe;
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
public class CookbookDao {
    private final JdbcTemplate jdbcTemplate;

    public CookbookDao(DataSource dataSource) {
        this.jdbcTemplate=new JdbcTemplate(dataSource);
    }

    private Cookbook mapToCookbook(ResultSet resultSet, int rowNumber) throws SQLException {

        Cookbook cookbook=new Cookbook();

        cookbook.setId(resultSet.getInt("id"));
        cookbook.setName(resultSet.getString("name"));
        cookbook.setDescription(resultSet.getString("description"));
        cookbook.setIsPublic(resultSet.getBoolean("is_public"));
        cookbook.setUsername(resultSet.getString("username"));
        cookbook.setCreatedAt(resultSet.getDate("created_at"));
        return cookbook;

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

    public List<Cookbook> getAll(){
        return jdbcTemplate.query("select * from cookbooks",this::mapToCookbook);
    }

    public Cookbook getById(int id){
        try {
            return jdbcTemplate.queryForObject("select * from cookbooks where id=?", this::mapToCookbook, id);
        }
        catch (EmptyResultDataAccessException e){
            return null;
        }
    }

    public List<Cookbook> getByUsername(String username){
        return jdbcTemplate.query("select * from cookbooks where username=?", this::mapToCookbook,username);
    }

    public Cookbook create(Cookbook cookbook){
        String sql= "insert into cookbooks (name,description,is_public,username) values (?,?,?,?)";
        KeyHolder keyHolder=new GeneratedKeyHolder();
        jdbcTemplate.update(connection->{
            PreparedStatement ps= connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1,cookbook.getName());
            ps.setString(2,cookbook.getDescription());
            ps.setBoolean(3,cookbook.getIsPublic());
            ps.setString(4,cookbook.getUsername());
            return ps;
        },keyHolder);
        cookbook.setId(keyHolder.getKey().intValue());
        return cookbook;
    }

    public int update(Cookbook cookbook){
        return jdbcTemplate.update("update cookbooks set name=?,description=?,is_public=? where id=? ",cookbook.getName(),cookbook.getDescription(),cookbook.getIsPublic(),cookbook.getId());
    }

    public int delete(int id){
        return jdbcTemplate.update("delete from cookbooks where id=?",id);
    }

    public int addRecipe(int cookbookId, int recipeId){
        return jdbcTemplate.update("insert into cookbook_recipes (cookbook_id,recipe_id) values (?,?)",cookbookId,recipeId);
    }

    public int removeRecipe(int cookbookId, int recipeId){
        return jdbcTemplate.update("delete from cookbook_recipes where cookbook_id=? and recipe_id=?",cookbookId,recipeId);
    }

    public List<Recipe> getAllRecipes(int cookbookId){
        return jdbcTemplate.query("select r.* from recipes r join cookbook_recipes cr on r.id=cr.recipe_id where cr.cookbook_id=?", this::mapToRecipe,cookbookId);
    }


}
