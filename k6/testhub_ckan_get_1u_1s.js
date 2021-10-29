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
  // http.get(`https://test-datenhub.ulm.de/ckan/api/3/action/datastore_search?resource_id=${__ENV.RESOURCE_ID}&limit=1`); // med
  // let query = console.log(encodeURIComponent("2021-10-04T21:16:21"))
  let ts = "2021-10-26T14:15:10.200000"
  let sql_query = encodeURIComponent(`SELECT * from "${__ENV.RESOURCE_ID}" WHERE timestamp='${ts}'`)
  http.get(`https://test-datenhub.ulm.de/ckan/api/3/action/datastore_search_sql?sql=${sql_query}`);
}
