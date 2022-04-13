"use strict";

export let CONFIG = {
  urlDev: "https://dev-datenhub.ulm.de",
  urlTest: "https://test-datenhub.ulm.de",
  urlProd: "https://datenhub.ulm.de",
  urlDevTunnel: "http://192.168.31.230",
  urlOmi: "https://omi-device036.e-technik.uni-ulm.de",
  urlInt: "http://citysens-int.dev.exxcellent.de",
  platformAPIPath: "/api/v1",
  ckanAPIPath: "/ckan/api/3/action",
  datasetName: "performancetest",
  resourceName: "dump",
  timestamp: "2021-11-05T13:21:44",
  options: {
    tlsAuth: [
      {
        domains: ['test-datenhub.ulm.de', 'dev-datenhub.ulm.de'],
        cert: open(`${__ENV.DATENHUB_CERT_PATH}`), // jshint ignore:line
        key: open(`${__ENV.DATENHUB_KEY_PATH}`), // jshint ignore:line
      },
    ],
    thresholds: {},
    summaryTrendStats: [ 'avg', 'min', 'med', 'max', 'p(50)', 'p(90)', 'p(95)'],
    teardownTimeout: '15m',
    setupTimeout: '30m',
    scenarios: {}
  }
};