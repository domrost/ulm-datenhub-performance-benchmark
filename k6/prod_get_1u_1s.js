import http from 'k6/http';

export let options = {
  tlsAuth: [
    {
      domains: ['test-datenhub.ulm.de'],
      cert: open(`${__ENV.CERT_PATH}`),
      key: open(`${__ENV.KEY_PATH}`),
    },
  ],
  scenarios: {}, // to be set later
};

let duration = 300
let pause = 30
let prefix = 'get_1u_1s'

let scenarios = {}
let vus = [1, 2, 4, 8, 16, 32, 48]

// scenario factory
vus.forEach(function (value, i) {
  scenarios[`${prefix}_${value}p`] = {
    executor: 'constant-vus',
    startTime: `${i * duration + 2 * pause}s`,
    gracefulStop: `${pause}s`,
    vus: value,
    duration: `${duration}s`,
  }
});

if (__ENV.scenario) {
  options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
  options.scenarios = scenarios;
}

export default function () {
  http.get(`https://datenhub.ulm.de/api/v1/datasets/${__ENV.DATASET}/resources/${__ENV.DATAPOINT_QUERY}'`);
}
