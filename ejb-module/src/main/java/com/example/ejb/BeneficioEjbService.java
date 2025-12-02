package com.example.ejb;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.OptimisticLockException;
import jakarta.persistence.PersistenceContext;

import java.math.BigDecimal;

@Stateless
public class BeneficioEjbService {

    @PersistenceContext
    private EntityManager em;

    /**
     * Transfere valor entre dois benefícios de forma consistente.
     *
     * Regras:
     * - fromId != toId
     * - ambos devem existir e estar ativos
     * - amount > 0
     * - from.valor >= amount
     * - locking para evitar lost update
     *
     * Em caso de erro de regra de negócio ou concorrência -> rollback.
     */
    public void transfer(Long fromId, Long toId, BigDecimal amount) throws SaldoInsuficienteException {

        if (fromId == null || toId == null) {
            throw new IllegalArgumentException("IDs de origem e destino são obrigatórios");
        }

        if (fromId.equals(toId)) {
            throw new IllegalArgumentException("Origem e destino não podem ser o mesmo benefício");
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor da transferência deve ser maior que zero");
        }

        // Lock pessimista garante que ninguém mais mexe nesses registros enquanto transfiro
        Beneficio from = em.find(Beneficio.class, fromId, LockModeType.PESSIMISTIC_WRITE);
        Beneficio to   = em.find(Beneficio.class, toId, LockModeType.PESSIMISTIC_WRITE);

        if (from == null || to == null) {
            throw new IllegalArgumentException("Benefício de origem e/ou destino não encontrado(s)");
        }

        if (Boolean.FALSE.equals(from.getAtivo()) || Boolean.FALSE.equals(to.getAtivo())) {
            throw new IllegalStateException("Benefício inativo não pode participar de transferência");
        }

        BigDecimal saldoAtual = from.getValor();

        if (saldoAtual.compareTo(amount) < 0) {
            // lançar exceção de negócio -> marcado com @ApplicationException(rollback = true)
            throw new SaldoInsuficienteException("Saldo insuficiente para transferência");
        }

        // Débito/crédito
        from.setValor(saldoAtual.subtract(amount));
        to.setValor(to.getValor().add(amount));

        try {
            em.merge(from);
            em.merge(to);
        } catch (OptimisticLockException e) {
            // Em cenários de optimistic locking, garantir rollback consistente
            throw new RuntimeException("Falha de concorrência ao transferir benefício", e);
        }
    }

    /**
     * Método auxiliar para testes, permitindo injeção manual do EntityManager
     * fora de um container EJB.
     */
    void setEntityManager(EntityManager em) {
        this.em = em;
    }
}
