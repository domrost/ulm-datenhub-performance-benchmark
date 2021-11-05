import http from 'k6/http';
import exec from 'k6/execution';
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { scenarioFactoryConstant, http_options, getResourceFromDatastore, deleteResource } from './helper.js';

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

let url_prefix_teardown = 'https://test-datenhub.ulm.de/ckan/api/3/action'
let url_prefix = 'https://test-datenhub.ulm.de/api/v1'
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


export default function () {
  var url = `${url_prefix}/datasets/${dataset_name}/resources/${exec.scenario.name}?primaryKey=id,timestamp`;
  var payload = JSON.stringify({
    id: __VU,
    timestamp: new Date().toISOString(),
    value: randomIntBetween(36, 37),
  });
  http.post(url, payload, http_options);
}

export function teardown(data) {
  let resources = {}
  for (let index = 0; index < vus.length; index++) {
    let name = `${prefix}_${vus[index]}p`
    let resource_id = getResourceFromDatastore(url_prefix_teardown, dataset_name, name)
    if (resource_id) {
      console.log(`found resource ${name}: ${resource_id}`)
      resources[name] = resource_id
    } 
  }
  console.log("teardown")
  for (var key in resources) {
    let resource_id = resources[key];
    console.log(`deleting ${resource_id}`)
    deleteResource(url_prefix_teardown, resource_id);
  }
}

