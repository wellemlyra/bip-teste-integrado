package com.example.backend.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeneficioResponse {

    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal valor;
    private Boolean ativo;
}
