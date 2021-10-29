# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.194.0/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 16, 14, 12
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

ENV K6_RELEASE=0.34.1

# [Optional] Uncomment this section to install additional OS packages.
# ADD package-lock.json /opt/

# get k6
RUN wget -c "https://github.com/grafana/k6/releases/download/v${K6_RELEASE}/k6-v${K6_RELEASE}-linux-amd64.tar.gz" -O - | tar -xz && \
    mv k6-v${K6_RELEASE}-linux-amd64/k6 /usr/bin/k6

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"

