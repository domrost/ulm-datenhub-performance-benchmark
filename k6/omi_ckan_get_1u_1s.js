import http from 'k6/http';

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
  http.get(`https://omi-device036.e-technik.uni-ulm.de/api/3/action/datastore_search?resource_id=${__ENV.RESOURCE_ID}&limit=1`);
}
