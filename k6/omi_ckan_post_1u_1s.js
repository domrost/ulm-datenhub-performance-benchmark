import http from 'k6/http';
import exec from 'k6/execution';
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { scenarioFactoryConstant, http_options, wrapSetup, deleteResource } from './helper.js';

export let options = {
  scenarios: {}, // to be set later
};

let url_prefix_setup = 'https://omi-device036.e-technik.uni-ulm.de/api/3/action'
let url_prefix_teardown = 'https://omi-device036.e-technik.uni-ulm.de/api/3/action'
let url_prefix = 'https://omi-device036.e-technik.uni-ulm.de/api/3/action'
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
  var url = `${url_prefix}/datastore_upsert`;
  let resource_id = data[exec.scenario.name]
  var payload = JSON.stringify({
    force: "true",
    resource_id: resource_id,
    method: "insert",
    records: [{
      "id": __VU,
      "timestamp": new Date().toISOString(),
      "value": randomIntBetween(36, 37)
    }]
  });
  http.post(url, payload, http_options);
}

export function teardown(data) {
  console.log("teardown")
  for (var key in data) {
    let resource_id = data[key];
    console.log(`deleting ${resource_id}`)
    deleteResource(url_prefix_teardown, resource_id);
  }
}
