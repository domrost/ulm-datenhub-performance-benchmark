import http from 'k6/http';
import exec from 'k6/execution';
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import {HTTP_OPTIONS} from "../../config/httpConfig.js";
import {CONFIG} from "../../config/config.js";
import {deleteAllRessources, getUrl, wrapSetup} from "../../util/resources.js";
import {createPeakScenarios} from "./scenarios.js";


export let options = CONFIG.options;

const URL = getUrl();
const CKAN_API_URL = URL + CONFIG.ckanAPIPath;
const DATASET_NAME = CONFIG.datasetName;
const scenarioDuration = 300;
let scenarioPause = 30;
let scenarioNamePrefix = `${__ENV.SYSTEM}_ckan_post_1u_1s`;

let vus = [1, 2, 4,8,16,32,48];
let scenarios = createPeakScenarios(vus, scenarioNamePrefix, scenarioDuration, scenarioPause);
options.scenarios = scenarios;

export function setup() {
  let resources =  wrapSetup(CKAN_API_URL, vus, scenarioNamePrefix, DATASET_NAME)
  return resources
}

export default function (data) {
  var url = `${CKAN_API_URL}/datastore_upsert`;
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
  http.post(url, payload, HTTP_OPTIONS);
}

export function teardown() {
  deleteAllRessources(CKAN_API_URL, DATASET_NAME);
}

