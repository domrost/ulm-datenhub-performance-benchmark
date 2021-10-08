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
let prefix = 'post_1u_1s'

let scenarios = {}
let vus = [1, 2, 4, 6, 10, 42]

// scenario factory
vus.forEach(function (value, i) {
  scenarios[`${prefix}_${value}p`] = {
    executor: 'constant-vus',
    startTime: `${i * duration + 3 * pause}s`,
    gracefulStop: `${pause}s`,
    vus: value,
    env: { scenario: `${prefix}_${value}p` },
    duration: `${duration}s`,
  }
});

if (__ENV.scenario) {
  options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
  options.scenarios = scenarios;
}

export default function () {
  
  var url = `https://test-datenhub.ulm.de/api/v1/datasets/${__ENV.DATASET}/resources/test_res_${__ENV.scenario}?primaryKey=id,timestamp`;
  var payload = JSON.stringify({
    id: __VU,
    timestamp: new Date().toISOString(),
    value: 30,
  });
  const options = {
    headers: {
      'Authorization': `${__ENV.AUTH_TOKEN}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
  };
  http.post(url, payload, options);
}
