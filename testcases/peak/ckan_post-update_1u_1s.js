import http from 'k6/http';
import exec from 'k6/execution';
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import {HTTP_OPTIONS} from "../../config/httpConfig.js";
import {CONFIG} from "../../config/config.js"
import {getUrl, wrapSetup, deleteAllRessources} from "../../util/resources.js";
import {createPeakScenarios} from "./scenarios.js";


export let options = CONFIG.options;

const URL = getUrl();
const CKAN_API_URL = URL + CONFIG.ckanAPIPath;
const DATASET_NAME = CONFIG.datasetName;
let scenarioDuration = 300;
let scenarioPause = 30;
let scenarioNamePrefix = `${__ENV.SYSTEM}_ckan_post-update_1u_1s`

let vus = [1, 2, 4,6,10,42]
let scenarios = createPeakScenarios(vus, scenarioNamePrefix, scenarioDuration, scenarioPause)
options.scenarios = scenarios;


export function setup() {
  let resources =  wrapSetup(CKAN_API_URL, vus, scenarioNamePrefix, DATASET_NAME)
  return resources
}

export default function (data) {
  var url_upsert = `${CKAN_API_URL}/datastore_upsert`;
  var url_update = `${CKAN_API_URL}/resource_update`;
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
  http.post(url_upsert, payload, HTTP_OPTIONS);
  payload = JSON.stringify({
    id: resource_id,
    name: exec.scenario.name,
    description: `last modified ${timestamp.substring(0, 19)}`,
    last_modified: timestamp.substring(0, 19)
  });
  http.post(url_update, payload, HTTP_OPTIONS);
}

export function teardown() {
  deleteAllRessources(CKAN_API_URL, DATASET_NAME);
}

