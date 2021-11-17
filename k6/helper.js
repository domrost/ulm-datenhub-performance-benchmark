import http from 'k6/http';

export function scenarioFactoryConstant(vus, prefix, duration, pause) {
  let scenarios = {};
  vus.forEach(function (value, i) {
    scenarios[`${prefix}_${value}p`] = {
      executor: 'constant-vus',
      startTime: `${i * (duration + 2 * pause)}s`,
      gracefulStop: `${pause}s`,
      vus: value,
      duration: `${duration}s`,
    }
  })
  return scenarios;
}

export const http_options = {
  headers: {
    'Authorization': `${__ENV.AUTH_TOKEN}`,
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
};
export const http_options_auth = {
  headers: {
    'Authorization': `${__ENV.AUTH_TOKEN}`
  },
};

export function wrapSetup(url_prefix, vus, prefix, dataset_name) {
  let resources = {}
  for (let index = 0; index < vus.length; index++) {
    let name = `${prefix}_${vus[index]}p`
    let resource_id = getResourceFromDatastore(url_prefix, dataset_name, name)
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

export function wrapImport(url_prefix, dataset_name, dump) {
  let resource_id = getResourceFromDatastore(url_prefix, dataset_name, "dump")
  if (resource_id) {
    console.log(`found resource: ${resource_id}`)
    return resource_id
  } else {
    resource_id = importResource(url_prefix, dump, dataset_name)
    return resource_id
  }
}


export function getResourceFromDatastore(url_prefix, datastore_name, resource_name) {
  var url = `${url_prefix}/package_show?id=${datastore_name}`;
  const res = http.get(url, http_options);
  let obj = res.json().result.resources.find(o => o.name === resource_name);
  if (obj) {
    return obj.id
  } else {
    return undefined
  }
}

export function deleteResource(url_prefix, resource_id) {
  var url = `${url_prefix}/resource_delete`;
  var payload = JSON.stringify({
    id: `${resource_id}`,
  });
  let res = http.post(url, payload, http_options);
}

export function importResource(url_prefix, file, dataset_name) {
  const payload = {
    package_id: dataset_name,
    name: "dump",
    upload: http.file(file, 'dump.csv'),
    selectDatasource: "LINK_OR_UPLOAD",
  };
  const res = http.post(`${url_prefix}/resource_create`, payload, http_options_auth);
  return res.json().result.id
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
  const res = http.post(url, payload, http_options);
  return res.json().result.resource_id
}