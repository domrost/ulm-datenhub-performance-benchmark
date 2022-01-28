"use strict";

import http from 'k6/http';
import { findOrCreateResource, deleteResource } from '../../util/resources.js';
import { createPeakScenarios } from './scenarios.js';
import { HTTP_OPTIONS } from '../../config/httpConfig.js';
import { CONFIG } from '../../config/config.js';

export let options = CONFIG.options;

const CKAN_API_URL = CONFIG.urlTest + CONFIG.ckanAPIPath;
const PLATFORM_API_URL = CONFIG.urlTest + CONFIG.platformAPIPath;
const DATASET_NAME = CONFIG.datasetName;
const RESOURCE_NAME = CONFIG.resourceName;
const TIMESTAMP = CONFIG.timestamp;

let scenarioDuration = 300;
let scenarioPause = 30;
let scenarioNamePrefix = 'get_1u_1s';
let vus = [1, 2, 4, 8, 16, 32, 48];

let scenarios = createPeakScenarios(vus, scenarioNamePrefix, scenarioDuration, scenarioPause);
options.scenarios = scenarios; //jshint ignore: line

let resourceData = open('../example_data/dump.csv', 'b'); // jshint ignore:line

export function setup() {
  let resource_id = findOrCreateResource(CKAN_API_URL, DATASET_NAME, resourceData);
  return resource_id;
}

export default function (data) {
  let resource_id = data;
  http.get(`${PLATFORM_API_URL}/datasets/${DATASET_NAME}/resources/${RESOURCE_NAME}/?where=timestamp='${TIMESTAMP}'`, HTTP_OPTIONS);
}

export function teardown(data) {
  let resourceID = data;
  deleteResource(CONFIG.urlPrefixTeardown, resourceID);
}