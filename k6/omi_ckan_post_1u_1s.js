import http from 'k6/http';
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

export let options = {
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
  var url = `https://omi-device036.e-technik.uni-ulm.de/api/3/action/datastore_upsert`;
  var payload = JSON.stringify({
    force: "true",
    resource_id: __ENV.RESOURCE_ID,
    method: "insert",
    records: [{
      "id": __VU,
      "timestamp": new Date().toISOString(),
      "value": randomIntBetween(36, 37)
    }]
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
