package org.humanitarian.donaciones_inventario.mongodb.Controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MongoDBTestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testMongoDBConnection() throws Exception {
        mockMvc.perform(get("/api/mongodb/test-connection"))
                .andExpect(status().isOk());
    }

    @Test
    public void testDatabaseInfo() throws Exception {
        mockMvc.perform(get("/api/mongodb/database-info"))
                .andExpect(status().isOk());
    }
}
