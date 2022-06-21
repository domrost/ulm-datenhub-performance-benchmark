"use strict";

import { check } from "k6";
import exec from 'k6/execution';
import http from 'k6/http';
import { CONFIG } from '../../config/config.js';
import { HTTP_OPTIONS } from '../../config/httpConfig.js';
import {deleteAllRessources, getUrl, randomIntBetween} from '../../util/resources.js';

export let options = CONFIG.options;

const URL = getUrl();
const CKAN_API_URL = URL + CONFIG.ckanAPIPath;
const PLATFORM_API_URL = URL + CONFIG.platformAPIPath;
const DATASET_NAME = CONFIG.datasetName;
const MAX_VUs = 100;
const NUMBER_DATASETS = 10; //Assumption: all datasets exist and their name is DATASET_NAME<number>
const RESSOURCES_PER_DATASET = 1; //1 ressource per dataset

let scenarios = {
  spec_III_3: {
    executor: "constant-arrival-rate",
    duration: "5m",
    preAllocatedVUs: 30,
    maxVUs: MAX_VUs,
    rate: 20,
    timeUnit: "1s",
    startTime: "1m"
  }
};

let thresholds = {
  'http_req_duration{scenario:spec_III_3}': [
    `max>=0`,
  ],
  'http_req_failed{scenario:spec_III_3}': [
  ],
};

options.scenarios = scenarios;
options.thresholds = thresholds;

export function setup() {
  for(let i=0; i < NUMBER_DATASETS; i++) {
    deleteAllRessources(CKAN_API_URL, `${DATASET_NAME}${i}`);
  }

  for(let i=1; i <= (NUMBER_DATASETS * RESSOURCES_PER_DATASET); i++) {
    let datasetNumber = i % NUMBER_DATASETS;
    let ressourceNumber = i % (NUMBER_DATASETS * RESSOURCES_PER_DATASET); //necessary to create the datasets 0.. instead 1..
    console.log(`initialize ${ressourceNumber}th ressource in dataset ${datasetNumber}`);
    let url = `${PLATFORM_API_URL}/datasets/${DATASET_NAME}${datasetNumber}/resources/${ressourceNumber}?primaryKey=id,timestamp`;
    var payload = JSON.stringify({
      id: 1000,
      timestamp: new Date().toISOString(),
      value: randomIntBetween(36, 37),
    });
    let res = http.post(url, payload, HTTP_OPTIONS);
    check(res, {
      'is status 200 or 201': (r) => r.status === 200 || r.status === 201,
    });
    if (res.status !== 200 && res.status !== 201) {
      console.log(`Response check failed: ${res.status_text}`);
    }
  }
}

export default function (data) {
  const VU_ID = exec.vu.idInInstance;
  const datasetNumber = VU_ID % NUMBER_DATASETS;
  const resourceNumber = VU_ID % (NUMBER_DATASETS * RESSOURCES_PER_DATASET);

  let url = `${PLATFORM_API_URL}/datasets/${DATASET_NAME}${datasetNumber}/resources/${resourceNumber}?primaryKey=id,timestamp`;
  var payload = JSON.stringify({
    id: VU_ID,
    timestamp: new Date().toISOString(),
    value: randomIntBetween(36, 37),
  });
  let res = http.post(url, payload, HTTP_OPTIONS);

  check(res, {
    'is status 200 or 201': (r) => r.status === 200 || r.status === 201,
  });
  if (res.status !== 200 && res.status !== 201) {
    console.log(`Response check failed: ${res.status_text}`);
  }
}

export function teardown(data) {
  for(let i=0; i < NUMBER_DATASETS; i++) {
    deleteAllRessources(CKAN_API_URL, `${DATASET_NAME}${i}`);
  }
}