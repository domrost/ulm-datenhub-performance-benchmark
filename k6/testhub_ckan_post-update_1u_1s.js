import http from 'k6/http';
import exec from 'k6/execution';
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { scenarioFactoryConstant, http_options, wrapSetup, deleteResource } from './helper.js';


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
let duration = 300
let pause = 30
let prefix = 'post_1u_1s'

let vus = [1, 2, 4, 6, 10, 42]
let scenarios = scenarioFactoryConstant(vus, prefix, duration, pause)


if (__ENV.scenario) {
  options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
  options.scenarios = scenarios;
}

export function setup() {
  let resources =  wrapSetup(url_prefix_setup, vus, prefix, dataset_name)
  return resources
}

export default function (data) {
  var url_upsert = `${url_prefix}/datastore_upsert`;
  var url_update = `${url_prefix}/resource_update`;
  let resource_id = data[exec.scenario.name]
  let timestamp = new Date().toISOString()
  var payload = JSON.stringify({
    force: "true",
    resource_id: resource_id,
    method: "insert",
    records: [{
      "id": __VU,
      "timestamp": timestamp,
      "value": randomIntBetween(36, 37)
    }]
  });
  http.post(url_upsert, payload, http_options);
  payload = JSON.stringify({
    id: resource_id,
    name: exec.scenario.name,
    description: `last modified ${timestamp.substring(0, 19)}`,
    last_modified: timestamp.substring(0, 19)
  });
  http.post(url_update, payload, http_options);
}

export function teardown(data) {
  console.log("teardown")
  for (var key in data) {
    let resource_id = data[key];
    console.log(`deleting ${resource_id}`)
    deleteResource(url_prefix_teardown, resource_id);
  }
}

