"use strict";

export function createPeakScenarios(vus, scenarioNamePrefix, duration, pause) {
  let scenarios = {};
  vus.forEach(function (scenarioVUs, i) {
    scenarios[`${scenarioNamePrefix}_${scenarioVUs}p`] = {
      executor: 'constant-vus',
      startTime: `${i * (duration + 2 * pause) + 2*pause}s`,
      gracefulStop: `${pause}s`,
      vus: scenarioVUs,
      duration: `${duration}s`,
    };
  });
  return scenarios;
}