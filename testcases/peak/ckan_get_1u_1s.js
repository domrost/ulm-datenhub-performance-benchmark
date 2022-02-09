import http from 'k6/http';
import { createPeakScenarios} from './scenarios.js';
import {deleteResource, findOrCreateResource, getUrl} from "../../util/resources.js";
import {CONFIG} from "../../config/config.js";

export let options = CONFIG.options;

const URL = getUrl();
const CKAN_API_URL = URL + CONFIG.ckanAPIPath;
const DATASET_NAME = CONFIG.datasetName;
const RESOURCE_NAME = CONFIG.resourceName;
const TIMESTAMP = CONFIG.timestamp;

let scenarioDuation = 300;
let scenarioPause = 30;
let sceanrioNamePrefix = `${__ENV.SYSTEM}_ckan_get_1u_1s`;
let vus = [1,2,4,8,16,32,48];

let scenarios = createPeakScenarios(vus, sceanrioNamePrefix, scenarioDuation, scenarioPause);
options.scenarios = scenarios; //jshint ignore: line

let resourceData = open('../../resources/dump.csv', 'b'); // jshint ignore:line


export function setup() {
  let resource_id = findOrCreateResource(CKAN_API_URL, DATASET_NAME, RESOURCE_NAME, resourceData)
  return resource_id
}

export default function (data) {
  let resource_id = data;
  let sql_query = encodeURIComponent(`SELECT * from "${resource_id}" WHERE timestamp='${TIMESTAMP}'`)
  http.get(`${CKAN_API_URL}/datastore_search_sql?sql=${sql_query}`);
}

export function teardown(data) {
  let resource_id = data
  deleteResource(CKAN_API_URL, resource_id);
}