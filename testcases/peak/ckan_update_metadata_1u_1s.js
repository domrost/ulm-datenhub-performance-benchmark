import http from 'k6/http';
import {HTTP_OPTIONS} from "../../config/httpConfig.js";
import { CONFIG } from '../../config/config.js';
import {getUrl, findOrCreateResource, deleteAllRessources} from "../../util/resources.js";
import {createPeakScenarios} from "./scenarios.js";

export let options = CONFIG.options;

const URL = getUrl();
const CKAN_API_URL = URL + CONFIG.ckanAPIPath;
const DATASET_NAME = CONFIG.datasetName;
const RESOURCE_NAME = CONFIG.resourceName;
let scenarioDuration = 300;
let scenarioPause = 30;
let scenarioNamePrefix = `${__ENV.SYSTEM}_update_metadata_1u_1s`;

let vus = [1, 2, 4, 6, 10, 42];
const csvFile = open(`../../resources/dump.csv`, 'b');


// scenario factory
let scenarios = createPeakScenarios(vus, scenarioNamePrefix, scenarioDuration, scenarioPause);
options.scenarios = scenarios;


export function setup() {
    let resource_id =  findOrCreateResource(CKAN_API_URL, DATASET_NAME, RESOURCE_NAME, csvFile);
    return resource_id;
}

export default function (resource_id) {
    let url = `${CKAN_API_URL}/resource_update`;
    const payload = JSON.stringify({
        id: resource_id,
        name: RESOURCE_NAME,
        format: 'JSON',
    });

    http.post(url, payload, HTTP_OPTIONS);
}

export function teardown() {
    deleteAllRessources(CKAN_API_URL, DATASET_NAME);
}