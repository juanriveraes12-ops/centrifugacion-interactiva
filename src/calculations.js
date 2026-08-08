export const CONSTANTS = {
  r1: 3.52e-3,
  r2: 6.58e-3,
  rm: (3.52e-3 + 6.58e-3) / 2,
  height: 0.185,
  dp: 8.85e-5,
  rhoP: 1256,
  rhoL: 968,
  deltaRho: 288,
  rotationValue: 12900,
  volume: Math.PI * 0.185 * (6.58e-3 ** 2 - 3.52e-3 ** 2),
};

export function rotation(value = CONSTANTS.rotationValue, unit = "rph") {
  const rps = unit === "rph" ? value / 3600 : value / 60;
  const omega = 2 * Math.PI * rps;
  return { rps, rpm: rps * 60, omega };
}

export function calculate(muCp, criterion, rot = rotation()) {
  const mu = muCp / 1000;
  const K = CONSTANTS.dp ** 2 * CONSTANTS.deltaRho * rot.omega ** 2 / (18 * mu);
  const ri = criterion === "conservative" ? CONSTANTS.r1 : CONSTANTS.rm;
  const t = Math.log(CONSTANTS.r2 / ri) / K;

  return {
    mu,
    K,
    ri,
    t,
    uAvg: (CONSTANTS.r2 - ri) / t,
    uWall: K * CONSTANTS.r2,
    Q: CONSTANTS.volume / t,
  };
}
