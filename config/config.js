"use strict";

export let CONFIG = {
  urlTest: "https://test-datenhub.ulm.de",
  urlProd: "https://datenhub.ulm.de",
  platformAPIPath: "/api/v1",
  ckanAPIPath: "/ckan/api/3/action",
  datasetName: "ieseperformancetest",
  resourceName: "dump",
  timestamp: "2021-11-05T13:21:44",
  options: {
    tlsAuth: [
      {
        domains: ['test-datenhub.ulm.de'],
        cert: open(`${__ENV.DATENHUB_CERT_PATH}`), // jshint ignore:line
        key: open(`${__ENV.DATENHUB_KEY_PATH}`), // jshint ignore:line
      },
    ],
    teardownTimeout: '5m',
    scenarios: {}
  }
};