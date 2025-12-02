package com.example.ejb;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "BENEFICIO")
public class Beneficio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NOME", nullable = false, length = 100)
    private String nome;

    @Column(name = "DESCRICAO", length = 255)
    private String descricao;

    @Column(name = "VALOR", nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Column(name = "ATIVO")
    private Boolean ativo = Boolean.TRUE;

    @Version
    @Column(name = "VERSION")
    private Long version;

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public Long getVersion() {
        return version;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}
