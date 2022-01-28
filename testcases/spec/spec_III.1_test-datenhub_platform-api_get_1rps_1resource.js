"use strict";

import { check } from 'k6';
import http from 'k6/http';
import { CONFIG } from '../../config/config.js';
import { HTTP_OPTIONS } from '../../config/httpConfig.js';
import { deleteResource, findOrCreateResource } from '../../util/resources.js';

export let options = CONFIG.options;

let scenarios = {
  spec_III_1: {
    executor: "constant-arrival-rate",
    duration: "1m",
    preAllocatedVUs: 5,
    rate: 1,
    timeUnit: "1s",
    startTime: "10s"
  }
};
options.scenarios = scenarios;

const CKAN_API_URL = CONFIG.urlTest + CONFIG.ckanAPIPath;
const PLATFORM_API_URL = CONFIG.urlTest + CONFIG.platformAPIPath;
const DATASET_NAME = CONFIG.datasetName;
const RESOURCE_NAME = CONFIG.resourceName;
const TIMESTAMP = CONFIG.timestamp;

let resourceData = open('../../example_data/dump.csv', 'b'); //jshint ignore: line

export function setup() {
  let resource_id = findOrCreateResource(CKAN_API_URL, DATASET_NAME, RESOURCE_NAME, resourceData);
  return resource_id;
}

export default function (data) {
  let res = http.get(`${PLATFORM_API_URL}/datasets/${DATASET_NAME}/resources/${RESOURCE_NAME}/?where=timestamp='${TIMESTAMP}'`, HTTP_OPTIONS);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  if (res.status !== 200) {
    console.log(`Response check failed: ${res.status_text}`);
  }
}

export function teardown(data) {
  let resourceID = data;
  deleteResource(CKAN_API_URL, resourceID);
}