import http from 'k6/http';
import { scenarioFactoryConstant, wrapImport, deleteResource } from './helper.js';

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

let url_prefix_setup = 'https://test-datenhub.ulm.de/ckan/api/3/action'
let url_prefix_teardown = 'https://test-datenhub.ulm.de/ckan/api/3/action'
let url_prefix = 'https://test-datenhub.ulm.de/ckan/api/3/action'
let dataset_name = __ENV.DATASET_NAME
let timestamp = '2021-11-05T13:20:44'
let duration = 300
let pause = 30
let prefix = 'get_1u_1s'

let vus = [1, 2, 4, 8, 16, 32, 48]
let scenarios = scenarioFactoryConstant(vus, prefix, duration, pause)
const dump = open('./dump.csv', 'b');


if (__ENV.scenario) {
  options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
  options.scenarios = scenarios;
}

export function setup() {
  let resource_id = wrapImport(url_prefix_setup, dataset_name, dump)
  return resource_id
}

export default function (data) {
  let resource_id = data
  let sql_query = encodeURIComponent(`SELECT * from "${resource_id}" WHERE timestamp='${timestamp}'`)
  http.get(`${url_prefix}/datastore_search_sql?sql=${sql_query}`);
}

export function teardown(data) {
  let resource_id = data
  deleteResource(url_prefix_teardown, resource_id);
}