import { describe, expect, it } from "vitest";
import {
  calculate,
  flowToSI,
  lengthToMeters,
  rotationToRps,
  validateInputs,
  viscosityToSI,
} from "./calculations.js";

const sample = {
  r1: 3.52e-3,
  r2: 6.58e-3,
  rIni: 3.52e-3,
  L: 0.185,
  dp: 8.85e-5,
  rhoP: 1256,
  rho: 968,
  mu: 1.82,
  g: 9.81,
  rps: 12900 / 3600,
  omega: 2 * Math.PI * (12900 / 3600),
};

describe("laboratorio de centrifugación", () => {
  it("convierte las unidades de entrada al SI", () => {
    expect(lengthToMeters(88.5, "um")).toBeCloseTo(8.85e-5, 12);
    expect(viscosityToSI(1820, "cP")).toBeCloseTo(1.82, 12);
    expect(rotationToRps(12900, "rph")).toBeCloseTo(12900 / 3600, 12);
    expect(flowToSI(1, "Lh")).toBeCloseTo(1 / 3.6e6, 15);
  });

  it("reproduce el volumen anular del caso base", () => {
    expect(calculate(sample).V).toBeCloseTo(1.79624e-5, 10);
  });

  it("calcula resultados físicos positivos", () => {
    const result = calculate(sample);
    expect(result.t).toBeGreaterThan(0);
    expect(result.qCap).toBeGreaterThan(0);
    expect(result.Re).toBeGreaterThan(0);
  });

  it("rechaza geometría y densidades incompatibles", () => {
    expect(validateInputs({ ...sample, r2: sample.r1, rhoP: sample.rho })).toEqual(
      expect.arrayContaining([
        "r₂ debe ser mayor que r₁.",
        "Este modelo de clarificación supone ρₚ > ρ.",
      ]),
    );
  });
});
