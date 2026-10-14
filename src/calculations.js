export function lengthToMeters(value, unit) {
  const numericValue = Number(value);
  if (unit === "cm") return numericValue / 100;
  if (unit === "mm") return numericValue / 1000;
  if (unit === "um") return numericValue / 1e6;
  return numericValue;
}

export function viscosityToSI(value, unit) {
  return unit === "cP" ? Number(value) / 1000 : Number(value);
}

export function rotationToRps(value, unit) {
  const numericValue = Number(value);
  if (unit === "rpm") return numericValue / 60;
  if (unit === "rph") return numericValue / 3600;
  return numericValue;
}

export function flowToSI(value, unit) {
  const numericValue = Number(value);
  if (unit === "Lh") return numericValue / 1000 / 3600;
  if (unit === "mLh") return numericValue / 1e6 / 3600;
  return numericValue;
}

export function validateInputs(input) {
  const errors = [];
  const positiveValues = [
    ["r₁", input.r1], ["r₂", input.r2], ["b", input.L],
    ["Dₚ", input.dp], ["ρₚ", input.rhoP], ["ρ", input.rho],
    ["μ", input.mu], ["g", input.g], ["N", input.rps],
  ];

  positiveValues.forEach(([name, value]) => {
    if (!Number.isFinite(value) || !(value > 0)) errors.push(`${name} debe ser mayor que cero.`);
  });
  if (input.r2 <= input.r1) errors.push("r₂ debe ser mayor que r₁.");
  if (input.rhoP <= input.rho) errors.push("Este modelo de clarificación supone ρₚ > ρ.");
  if (!Number.isFinite(input.rIni) || input.rIni < input.r1 || input.rIni >= input.r2) {
    errors.push("El radio inicial debe cumplir r₁ ≤ r inicial < r₂.");
  }
  return errors;
}

export function calculate(input) {
  const dRho = input.rhoP - input.rho;
  const V = Math.PI * input.L * (input.r2 ** 2 - input.r1 ** 2);
  const K = input.dp ** 2 * dRho * input.omega ** 2 / (18 * input.mu);
  const t = Math.log(input.r2 / input.rIni) / K;
  const u2 = K * input.r2;
  const uavg = (input.r2 - input.rIni) / t;
  const qCap = V / t;
  const qDirect = V * input.omega ** 2 * dRho * input.dp ** 2
    / (18 * input.mu * Math.log(input.r2 / input.rIni));
  const Re = input.rho * u2 * input.dp / input.mu;
  const ac2 = input.omega ** 2 * input.r2;
  const G = ac2 / input.g;
  const ug = input.dp ** 2 * dRho * input.g / (18 * input.mu);
  return { ...input, dRho, V, K, t, u2, uavg, qCap, qDirect, Re, ac2, G, ug };
}
