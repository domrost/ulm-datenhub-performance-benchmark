# Datahub benchmarks

k6 is a code centric tool for load testing, performance monitoring and chaos/reliability testing. This repository contains some scenarios that are supposed to be run against the test-datahub of the city of Ulm in Germany. Each scenario has its own `js` file within the [`k6`](./k6) folder. Most scenarios consist of multiple sub-scenarios changing a single variable like the amount of parallel requests.

## Install dependencies and configure

Each flow is supposed to be mostly self-contained and idempotent. GET scenarios will first upload  a [csv dump](k6/dump.csv) into a resource, which subsequently will be queried. POST scenarios will create appropriate resources in the datastore, that subsequently will be appended to. After executing the test, any created data will be purged. To keep your test-data, start the run with the `--no-teardown` option.

Therefore only an existing organization with write access will be assumed.

### k6

To install [k6](https://k6.io/) follow the [documentation](https://k6.io/docs/getting-started/installation/) on their website.

### Authentication

Authentication is twofold. You need your personal mTLS cert and key and an auth token. Set the following environment variables to configure them.

- `AUTH_TOKEN`: Your token representing your use account on the datahub
- `CERT_PATH`: The path to your TLS cert
- `KEY_PATH`: The path to your TLS key

## Run a Benchmark

To run a single k6 test case, invoke k6 with the corresponding file, for example:

```sh
k6 run .js
```

## Test Cases

We differentiate different kinds of test cases:

- "Spec" test cases emulate the requirements defined in the specification (Leistungsverzeichnis). Key factor here is the frequency of requests, i.e. number of requests per time period.
- "Peak" test cases start an increasing number of parallel virtual users, which generate requests as fast as they can and measure the Datenhub's response behavior to that.

### Spec Test Cases

Spec test cases are located in the `spec` folder.

### Peak Test Cases

Peak test cases are located in the `peak` folder.
