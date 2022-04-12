import http from 'k6/http';

import exec from 'k6/execution';

import { check } from "k6";

import { sleep } from "k6";

import { CONFIG } from "../../config/config.js";
import {deleteAllRessources, getUrl} from "../../util/resources.js";
import {HTTP_OPTIONS_AUTH} from "../../config/httpConfig.js";


const URL = getUrl();
const CKAN_API_URL = URL + CONFIG.ckanAPIPath;
const DATASET_NAME = CONFIG.datasetName;
const RESOURCE_NAME = CONFIG.resourceName;
const TIMESTAMP = CONFIG.timestamp;

export const options = {
    scenarios: {
        contacts: {
            executor: 'shared-iterations',
            vus: 1,
            iterations: 100,
            maxDuration: '3000s',
        },
    },
    tlsAuth: [
        {
            domains: ['test-datenhub.ulm.de', 'dev-datenhub.ulm.de'],
            cert: open(`${__ENV.DATENHUB_CERT_PATH}`), // jshint ignore:line
            key: open(`${__ENV.DATENHUB_KEY_PATH}`), // jshint ignore:line
        },
    ]
};


export default function () {
    console.log(exec.vu.iterationInInstance);

    let number = exec.vu.iterationInInstance % 5;
    console.log(number);

    const payload = {
        package_id: `${DATASET_NAME}${number}`,
        name: exec.vu.iterationInInstance,
        selectDatasource: "API"
    };

    let res = http.post(`${CKAN_API_URL}/resource_create`, payload, HTTP_OPTIONS_AUTH);
    check(res, {
        'is status 200 or 201': (r) => r.status === 200 || r.status === 201,
    });
    if (res.status !== 200 && res.status !== 201) {
        console.log(`Response check failed: ${res.status_text}`);
    }
    // We're injecting a processing pause for illustrative purposes only!
    // Each iteration will be ~515ms, therefore ~2 iterations/second per VU maximum throughput.
}

export function teardown() {
    deleteAllRessources(CKAN_API_URL, `${DATASET_NAME}0`)
}