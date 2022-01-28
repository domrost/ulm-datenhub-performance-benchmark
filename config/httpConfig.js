"use strict";

export const HTTP_OPTIONS = {
  headers: {
    'Authorization': `${__ENV.DATENHUB_AUTH_TOKEN}`, // jshint ignore:line
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
};

export const HTTP_OPTIONS_AUTH = {
  headers: {
    'Authorization': `${__ENV.DATENHUB_AUTH_TOKEN}` // jshint ignore:line
  },
};