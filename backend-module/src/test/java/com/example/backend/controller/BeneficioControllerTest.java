package com.example.backend.controller;

import com.example.backend.dto.BeneficioResponse;
import com.example.backend.service.BeneficioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BeneficioController.class)
class BeneficioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BeneficioService service;

    @Test
    @DisplayName("Deve listar benefícios via API")
    void shouldListBeneficios() throws Exception {
        BeneficioResponse response = BeneficioResponse.builder()
                .id(1L)
                .nome("Beneficio A")
                .descricao("Desc")
                .valor(new BigDecimal("100.00"))
                .ativo(true)
                .build();

        Mockito.when(service.findAll()).thenReturn(Collections.singletonList(response));

        mockMvc.perform(get("/api/v1/beneficios")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].nome", is("Beneficio A")));
    }
}
