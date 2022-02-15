import http from 'k6/http';
import exec from 'k6/execution';
import {HTTP_OPTIONS} from "../../config/httpConfig.js";
import {deleteAllRessources, getUrl, randomIntBetween} from "../../util/resources.js";
import {CONFIG} from "../../config/config.js";
import {createPeakScenarios} from "./scenarios.js";

export let options = CONFIG.options;

const URL = getUrl();
const CKAN_API_URL = URL + CONFIG.ckanAPIPath;
const PLATFORM_API_URL = URL + CONFIG.platformAPIPath;
const DATASET_NAME = CONFIG.datasetName;

let scenarioDuration = 300;
let scenarioPause = 30;
let scenarioNamePrefix = `${__ENV.SYSTEM}_post_1u_1s`;

let vus = [1, 2, 4, 8, 16, 32, 48];

let scenarios = createPeakScenarios(vus, scenarioNamePrefix, scenarioDuration, scenarioPause);
options.scenarios = scenarios; //jshint ignore: line


export default function () {
  var url = `${PLATFORM_API_URL}/datasets/${DATASET_NAME}/resources/${exec.scenario.name}?primaryKey=id,timestamp`;
  var payload = JSON.stringify({
    id: __VU,
    timestamp: new Date().toISOString(),
    value: randomIntBetween(36, 37),
  });
  http.post(url, payload, HTTP_OPTIONS);
}

export function teardown() {
  deleteAllRessources(CKAN_API_URL, DATASET_NAME);
}