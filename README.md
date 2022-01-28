# Datahub benchmarks

This repository contains performance test scenarios that are supposed to be run against the data platform "Datenhub" of the city of Ulm in Germany.

## Setup

### Installing k6

k6 is a code-centric tool for load testing, performance monitoring and chaos/reliability testing.
To install [k6](https://k6.io/) follow the [documentation](https://k6.io/docs/getting-started/installation/) on their website.

### Configuration

#### Authentication

Authentication is twofold. You need your personal mTLS cert and key and an auth token.

- `DATENHUB_AUTH_TOKEN`: Your API key token representing your user account on the Datenhub. Find it on your user account page on Datenhub.
- `DATENHUB_CERT_PATH`: The path to your TLS certificate `.pem` file
- `DATENHUB_KEY_PATH`: The path to your TLS key `.pem` file

You can set these as environment variables in your OS or execution environment or provide them to k6 with the k6 `-e` flag when running the scripts, e.g. `-e DATENHUB_KEY_PATH=/path/to/key/file/key.pem`

#### Further Configuration Options

Further common configuration options are available in the [configuration](./config/) folder. Here you can find:

- [config.js](config/config.js): Common configuration options for all scripts
- [httpConfig](config/httpConfig.js): Common header configuration for the HTTP requests

## Running Performance Tests

Each scenario has its own `.js` file in the [testcases](./testcases/) folder. To run a testcase, in a terminal run the `k6 run` command and pass the corresponding file to it. Example:

```sh
run -e DATENHUB_CERT_PATH=/path/to/cert/file/cert.pem -e DATENHUB_KEY_PATH=/path/to/key/file/key.pem -e DATENHUB_AUTH_TOKEN=4f24bbb3-23ff-2725-b192-021c1452c678 ./testcases/spec/spec_III.1_test-datenhub_platform-api_get_1rps_1resource.js
```

## Test Cases

Each test case is supposed to be self-contained and idempotent. GET scenarios will first upload  a [csv dump](k6/dump.csv) into a resource, which subsequently will be queried. POST scenarios will create appropriate resources in the datastore, that subsequently will be appended to. After executing the test, any created data will be purged. To keep your test-data, start the run with the `--no-teardown` flag.

We differentiate different kinds of test cases:

- "Spec" test cases emulate the requirements defined in the specification (Leistungsverzeichnis). Key factor here is the frequency of requests, i.e. number of requests per time period.
- "Peak" test cases start an increasing number of parallel virtual users, which generate requests as fast as they can and measure the Datenhub's response behavior to that.

### Spec Test Cases

Spec test cases are located in the `spec` folder.

### Peak Test Cases

Peak test cases are located in the `peak` folder.
