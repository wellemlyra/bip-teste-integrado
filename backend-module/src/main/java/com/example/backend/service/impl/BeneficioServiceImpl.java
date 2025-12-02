package com.example.backend.service.impl;

import com.example.backend.domain.Beneficio;
import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferRequest;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.BeneficioRepository;
import com.example.backend.service.BeneficioService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BeneficioServiceImpl implements BeneficioService {

    private final BeneficioRepository repository;

    @Override
    public List<BeneficioResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BeneficioResponse findById(Long id) {
        Beneficio beneficio = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Benefício não encontrado: " + id));
        return toResponse(beneficio);
    }

    @Override
    @Transactional
    public BeneficioResponse create(BeneficioRequest request) {
        Beneficio entity = Beneficio.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .valor(request.getValor())
                .ativo((request.getAtivo() != null ? request.getAtivo() : Boolean.TRUE))
                .build();
        Beneficio saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public BeneficioResponse update(Long id, BeneficioRequest request) {
        Beneficio entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Benefício não encontrado: " + id));

        entity.setNome(request.getNome());
        entity.setDescricao(request.getDescricao());
        entity.setValor(request.getValor());
        entity.setAtivo((request.getAtivo() != null ? request.getAtivo() : Boolean.TRUE));

        Beneficio saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Beneficio entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Benefício não encontrado: " + id));
        // Deleção lógica para preservar histórico
        entity.setAtivo(Boolean.FALSE);
        repository.save(entity);
    }

    @Override
    @Transactional
    public void transfer(TransferRequest request) {
        if (request.getFromId().equals(request.getToId())) {
            throw new BusinessException("Origem e destino não podem ser o mesmo benefício");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Valor da transferência deve ser maior que zero");
        }

        Beneficio from = repository.findById(request.getFromId())
                .orElseThrow(() -> new ResourceNotFoundException("Benefício de origem não encontrado: " + request.getFromId()));
        Beneficio to = repository.findById(request.getToId())
                .orElseThrow(() -> new ResourceNotFoundException("Benefício de destino não encontrado: " + request.getToId()));

        if (Boolean.FALSE.equals(from.getAtivo()) || Boolean.FALSE.equals(to.getAtivo())) {
            throw new BusinessException("Benefícios inativos não podem participar de transferências");
        }

        BigDecimal saldoAtual = from.getValor();
        if (saldoAtual.compareTo(request.getAmount()) < 0) {
            throw new BusinessException("Saldo insuficiente para transferência");
        }

        from.setValor(saldoAtual.subtract(request.getAmount()));
        to.setValor(to.getValor().add(request.getAmount()));

        // JPA fará o flush no commit; @Version em Beneficio cuida do optimistic locking
        repository.save(from);
        repository.save(to);
    }

    private BeneficioResponse toResponse(Beneficio entity) {
        return BeneficioResponse.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .descricao(entity.getDescricao())
                .valor(entity.getValor())
                .ativo(entity.getAtivo())
                .build();
    }
}
