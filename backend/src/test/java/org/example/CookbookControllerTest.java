package org.example;


import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CookbookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @Order(1)
    void getAll_returns200() throws Exception {
        mockMvc.perform(get("/api/cookbooks"))
                .andExpect(status().isOk());
    }

    @Test
    @Order(2)
    void getById_returns200() throws Exception {
        mockMvc.perform(get("/api/cookbooks/2"))
                .andExpect(status().isOk());
    }

    @Test
    @Order(3)
    void getById_returns404() throws Exception {
        mockMvc.perform(get("/api/cookbooks/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(4)
    void create_withoutToken_returns401() throws Exception {
        mockMvc.perform(post("/api/cookbooks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test Cookbook\",\"description\":\"Test Description\",\"isPublic\":true}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(5)
    void delete_withoutToken_returns401() throws Exception {
        mockMvc.perform(delete("/api/cookbooks/2"))
                .andExpect(status().isUnauthorized());
    }

}
