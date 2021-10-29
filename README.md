# Datahub benchmarks

k6 is a code centric tool for load testing, performance monitoring and chaos/reliability testing. This repository contains some scenarios that are supposed to be run against the test-datahub of the city of Ulm in Germany. Each scenario has its own `js` file within the [`k6`](./k6) folder. Most scenarios consist of multiple sub-scenarios changing a single variable like the amount of parallel requests.

## Install dependencies and configure

### k6

To install [k6](https://k6.io/) follow the [documentation](https://k6.io/docs/getting-started/installation/) on their website.

### authentication

Authentication is twofold. You need you personal mTLS cert and key and an auth token. Set the following environment variables to configure them.

* `AUTH_TOKEN`: Your token representing your use account on the datahub
* `CERT_PATH`: The path to your TLS cert
* `KEY_PATH`: The path to your TLS key

### Dataset configuration

* `DATASET`: The name of the dataset you've created manually
* `DATAPOINT_QUERY`: The resource/datapoint query for get requests e.g. `sorrir?limit=1&offset=0&where=timestamp%3D'2021-10-04T15%3A07%3A24.202000Z`

## Run a benchmark flow

To run a single k6 scenario invoke the following using the scenario name

```sh
flow="$FILENAME" # e.g. post_1u_1s
mkdir -p results/${flow}
k6 run  k6/${flow}.js -o csv=results/${flow}/data.csv
```

If you have multiple ip address and want to simulate multiple sensors change to the following:

```sh
flow="$FILENAME" # e.g. post_1u_Xs
mkdir -p results/${flow}
k6 run --local-ips=$LIST_OF_IP k6/${flow}.js -o csv=results/${flow}/data.csv
```

## Naming convention

Since these benchmarks are supposed to be picked up by other tools for external processing, the following arbitrary naming convention has been implemented:

`${HTTP_METHOD}_${USERS}u_${SENSORS}s_${PARALLEL}p`

## Scenario description

* `get_1u_1s`: Get requests of a single user simulating a single sensor in a single dataset requesting a single datapoint as fast as possible. The amount of parallel requests is changed as follow: `[1, 2, 4, 8, 16, 32, 48]`
* `post_1u_1s`: Post requests of a single user simulating a single sensor in a single dataset appending a single datapoint as fast as possible. The amount of parallel requests is changed as follow: `[1, 2, 4, 6, 10, 42]`
* `post_1u_Xs`: 
* `prod_get_1u_1s`: Same as `get_1u_1s` but with a fixed preconfigured public datapoint on the production system.

# Deployments

## CKAN

Contains a test-deployment for a raw CKAN with minimal configuration. Tools required are

* `helm`
* `kustomize`

To deploy, adapt the [`values.yaml`](deploy/ckan/values.yaml) and run `kustomize build deploy/ckan --enable-helm | k apply -f -`

## k6

* Add benchmark file (flow) to the [base](deploy/k6/base/kustomization.yaml)
* Create an [overlay](deploy/k6/overlays)
* Set the flow literal in this new overlay. [Example] (deploy/k6/overlays/testhub/example/kustomization.yaml)

`kustomize build deploy/k6/overlays/testhub/example --load-restrictor LoadRestrictionsNone`