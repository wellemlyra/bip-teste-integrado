package com.example.backend.service;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferRequest;
import com.example.backend.exception.BusinessException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class BeneficioServiceTest {

    @Autowired
    private BeneficioService service;

    @Test
    void shouldListInitialSeedData() {
        List<BeneficioResponse> beneficios = service.findAll();
        assertFalse(beneficios.isEmpty(), "Seed de benefícios deveria estar carregada");
    }

    @Test
    void shouldCreateAndFetchBeneficio() {
        BeneficioRequest request = BeneficioRequest.builder()
                .nome("Novo Beneficio")
                .descricao("Teste")
                .valor(new BigDecimal("123.45"))
                .build();

        BeneficioResponse created = service.create(request);

        assertNotNull(created.getId());
        assertEquals("Novo Beneficio", created.getNome());

        BeneficioResponse loaded = service.findById(created.getId());
        assertEquals(created.getId(), loaded.getId());
    }

    @Test
    void shouldTransferAmountBetweenBeneficios() {
        // assumindo seed: A = 1000, B = 500
        List<BeneficioResponse> beneficios = service.findAll();
        BeneficioResponse from = beneficios.get(0);
        BeneficioResponse to = beneficios.get(1);

        BigDecimal amount = new BigDecimal("100.00");

        TransferRequest transfer = TransferRequest.builder()
                .fromId(from.getId())
                .toId(to.getId())
                .amount(amount)
                .build();

        service.transfer(transfer);

        BeneficioResponse updatedFrom = service.findById(from.getId());
        BeneficioResponse updatedTo = service.findById(to.getId());

        assertEquals(from.getValor().subtract(amount), updatedFrom.getValor());
        assertEquals(to.getValor().add(amount), updatedTo.getValor());
    }

    @Test
    void shouldNotAllowTransferWithInsufficientBalance() {
        List<BeneficioResponse> beneficios = service.findAll();
        BeneficioResponse from = beneficios.get(0);
        BeneficioResponse to = beneficios.get(1);

        BigDecimal amount = from.getValor().add(BigDecimal.ONE);

        TransferRequest transfer = TransferRequest.builder()
                .fromId(from.getId())
                .toId(to.getId())
                .amount(amount)
                .build();

        assertThrows(BusinessException.class, () -> service.transfer(transfer));
    }
}
