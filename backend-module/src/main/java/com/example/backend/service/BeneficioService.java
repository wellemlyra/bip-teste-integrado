package com.example.backend.service;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferRequest;

import java.util.List;

public interface BeneficioService {

    List<BeneficioResponse> findAll();

    BeneficioResponse findById(Long id);

    BeneficioResponse create(BeneficioRequest request);

    BeneficioResponse update(Long id, BeneficioRequest request);

    void delete(Long id);

    void transfer(TransferRequest request);
}
