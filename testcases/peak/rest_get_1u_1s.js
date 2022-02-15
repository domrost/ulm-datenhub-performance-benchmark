"use strict";

import http from 'k6/http';
import {findOrCreateResource, deleteResource, getUrl} from '../../util/resources.js';
import { createPeakScenarios } from './scenarios.js';
import { HTTP_OPTIONS } from '../../config/httpConfig.js';
import { CONFIG } from '../../config/config.js';

export let options = CONFIG.options;

const URL = getUrl();
const CKAN_API_URL = URL + CONFIG.ckanAPIPath;
const PLATFORM_API_URL = URL + CONFIG.platformAPIPath;
const DATASET_NAME = CONFIG.datasetName;
const RESOURCE_NAME = CONFIG.resourceName;
const TIMESTAMP = CONFIG.timestamp;

let scenarioDuration = 300;
let scenarioPause = 30;
let scenarioNamePrefix = `${__ENV.SYSTEM}_get_1u_1s`;
let vus = [1, 2, 4, 8, 16, 32, 48];

let scenarios = createPeakScenarios(vus, scenarioNamePrefix, scenarioDuration, scenarioPause);
options.scenarios = scenarios; //jshint ignore: line

let resourceData = open('../../resources/dump.csv', 'b'); // jshint ignore:line

export function setup() {
  let resource_id = findOrCreateResource(CKAN_API_URL, DATASET_NAME, RESOURCE_NAME, resourceData);
  return resource_id;
}

export default function (data) {
  http.get(`${PLATFORM_API_URL}/datasets/${DATASET_NAME}/resources/${RESOURCE_NAME}/?where=timestamp='${TIMESTAMP}'`, HTTP_OPTIONS);
}

export function teardown(data) {
  let resourceID = data;
  deleteResource(CKAN_API_URL, resourceID);
}