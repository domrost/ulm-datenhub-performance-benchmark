"use strict";

import { CONFIG } from '../../config/config.js';
import { deleteAllRessources } from '../../util/resources.js';

export let options = CONFIG.options;

const CKAN_API_URL = CONFIG.urlTest + CONFIG.ckanAPIPath;
const PLATFORM_API_URL = CONFIG.urlTest + CONFIG.platformAPIPath;
const DATASET_NAME = CONFIG.datasetName;
const MAX_VUs = 100;

export default function (data) {
  console.log('iteration');
}

export function teardown(data) {
  deleteAllRessources(CKAN_API_URL, DATASET_NAME);
}