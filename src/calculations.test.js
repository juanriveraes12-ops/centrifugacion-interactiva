import { describe, expect, it } from "vitest";
import { CONSTANTS, calculate, rotation } from "./calculations.js";

describe("modelo de sedimentacion", () => {
  it("convierte 12900 rph en 215 rpm", () => {
    expect(rotation(12900, "rph").rpm).toBeCloseTo(215, 8);
  });

  it("calcula el volumen anular documentado", () => {
    expect(CONSTANTS.volume).toBeCloseTo(1.79624e-5, 10);
  });

  it("predice menor tiempo y mayor caudal para el criterio de corte", () => {
    const conservative = calculate(1820, "conservative");
    const cut = calculate(1820, "cut");
    expect(cut.t).toBeLessThan(conservative.t);
    expect(cut.Q).toBeGreaterThan(conservative.Q);
  });

  it("mantiene la proporcionalidad inversa con la viscosidad", () => {
    const high = calculate(1820, "conservative");
    const low = calculate(910, "conservative");
    expect(low.Q / high.Q).toBeCloseTo(2, 10);
  });
});
