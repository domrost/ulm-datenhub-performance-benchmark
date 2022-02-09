"use strict";

import http from 'k6/http';
import { HTTP_OPTIONS, HTTP_OPTIONS_AUTH } from '../config/httpConfig.js';
import {CONFIG} from "../config/config.js";

export function findOrCreateResource(CKANURL, datasetName, resourceName, data) {
  console.log("calling findResource")
  let resourceID = findResource(CKANURL, datasetName, resourceName);
  console.log("find resource terminated");
  if (resourceID) {
    console.log(`Found resource: ${resourceID}`);
    return resourceID;
  } else {
    resourceID = createResource(CKANURL, datasetName, resourceName, data);
    console.log(`Created resouce: ${resourceID}`);
    return resourceID;
  }
}

export function deleteResource(CKANURL, resourceID) {
  var url = `${CKANURL}/resource_delete`;
  var payload = JSON.stringify({
    id: `${resourceID}`,
  });
  let res = http.post(url, payload, HTTP_OPTIONS);

  if (res.status !== 200) {
    console.log(`Error in deleteResource: Server returned HTTP ${res.status}: ${res.status_text}`);
  }
}

export function deleteAllRessources(CKANURL, datasetName) {
  let resources = getAllResources(CKANURL, datasetName);

  if (resources) {
    resources.forEach(resource => {
      deleteResource(CKANURL, resource.id);
    });
  }
}

export function findResource(CKANURL, datasetName, resourceName) {
  let resources = getAllResources(CKANURL, datasetName);

  let obj = resources.find(o => o.name === resourceName);
  if (obj) {
    return obj.id;
  } else {
    return undefined;
  }
}

function getAllResources(CKANURL, datasetName) {
  let url = `${CKANURL}/package_show?id=${datasetName}`;
  const res = http.get(url, HTTP_OPTIONS);

  if (res.status !== 200) {
    console.log(`Error in getAllResources: Server returned HTTP ${res.status}: ${res.status_text}`);
    return undefined;
  }

  return res.json().result.resources;
}

export function createResource(CKANURL, datasetName, resourceName, data) {
  const payload = {
    package_id: datasetName,
    name: resourceName,
    upload: http.file(data, 'dump.csv'),
    selectDatasource: "LINK_OR_UPLOAD",
  };

  const res = http.post(`${CKANURL}/resource_create`, payload, HTTP_OPTIONS_AUTH);
  if (res.status !== 200) {
    console.log(`Error in createResource: Server returned HTTP ${res.status}: ${res.status_text}`);
    return undefined;
  }

  return res.json().result.id;
}


export function getUrl() {
  if(__ENV.SYSTEM === 'dev') {
    return CONFIG.urlDev;
  }
  else if(__ENV.SYSTEM === 'dev_tunnel') {
    return CONFIG.urlDevTunnel;
  }
  else if(__ENV.SYSTEM === 'prod') {
    return CONFIG.urlProd;
  }
  else if (__ENV.SYSTEM === 'omi') {
    return CONFIG.urlOmi;
  }
  else {
    return CONFIG.urlTest;
  }
}

export function createDatastore(url_prefix, name, dataset_name) {
  var url = `${url_prefix}/datastore_create`;
  var payload = JSON.stringify({
    force: "true",
    resource: {
      package_id: dataset_name,
      description: "Created via setup api",
      name: `${name}`,
      selectDatasource: "LINK_OR_UPLOAD",
      format: "json",
      resource_type: "json"
    },
    primary_key: [
      "id",
      "timestamp"
    ],
    fields: [
      {
        id: "id",
        type: "int"
      },
      {
        id: "timestamp",
        type: "timestamp"
      },
      {
        id: "value",
        type: "int"
      }
    ]
  });
  const res = http.post(url, payload, HTTP_OPTIONS);
  return res.json().result.resource_id
}

export function wrapSetup(url_prefix, vus, prefix, dataset_name) {
  let resources = {}
  for (let index = 0; index < vus.length; index++) {
    let name = `${prefix}_${vus[index]}p`
    let resource_id = findResource(url_prefix, dataset_name, name)
    if (resource_id) {
      console.log(`found resource ${name}: ${resource_id}`)
    } else {
      console.log(`creating resource ${name}`)
      resource_id = createDatastore(url_prefix, name, dataset_name)
    }
    resources[name] = resource_id
  }
  console.log(`resource list: ${JSON.stringify(resources)}`)
  return resources
}
