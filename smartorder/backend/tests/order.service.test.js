import { describe, expect, it } from 'vitest';
import { getDiscountRate, transitions } from '../src/services/order.service.js';

describe('SmartOrder - reglas de descuento', () => {
  it('aplica 0% por debajo de Q500', () => {
    expect(getDiscountRate(499.99)).toBe(0);
  });

  it('aplica 5% en Q500', () => {
    expect(getDiscountRate(500)).toBe(0.05);
  });

  it('aplica 10% en Q1000', () => {
    expect(getDiscountRate(1000)).toBe(0.10);
  });

  it('aplica 15% en Q2000', () => {
    expect(getDiscountRate(2000)).toBe(0.15);
  });
});

describe('SmartOrder - transiciones', () => {
  it('permite PENDIENTE -> CONFIRMADO', () => {
    expect(transitions.PENDIENTE).toContain('CONFIRMADO');
  });

  it('no permite ENTREGADO -> CANCELADO', () => {
    expect(transitions.ENTREGADO).not.toContain('CANCELADO');
  });
});
