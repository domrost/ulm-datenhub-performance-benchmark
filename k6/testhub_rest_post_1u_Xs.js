// deprecated

import http from 'k6/http';
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

// import os from 'https://github.com/oscmejia/os-utils';

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
let prefix = 'post_1u'

let scenarios = {}
let vus = [6,10]

// scenario factory
vus.forEach(function (value, i) {
  scenarios[`${prefix}_${value}s_${value}p`] = {
    executor: 'constant-vus',
    gracefulStop: `${pause}s`,
    vus: value,
    env: { scenario: `${prefix}_${value}s_${value}p`, prefix: `${prefix}_${value}s` },
    startTime: `${i * duration + 3 * pause}s`,
    duration: `${duration}s`,
  }
});

if (__ENV.scenario) {
  options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
  options.scenarios = scenarios;
}

export default function () {
  
  var url = `https://test-datenhub.ulm.de/api/v1/datasets/${__ENV.DATASET}/resources/test_res_${__ENV.prefix}_${__VU}p?primaryKey=id,timestamp`;
  var payload = JSON.stringify({
    id: __VU,
    timestamp: new Date().toISOString(),
    value: randomIntBetween(36, 37),
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
