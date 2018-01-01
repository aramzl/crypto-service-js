'use strict';

require('newrelic');

const config = require('./config/config');
const express = require('express');
const app = exports.app = express();
const _ = require('lodash');
const schedulers = require('./app/schedulers');
const dataService = require('./app/services/dataService');

require('./config/express')(app);

const logger = require('./app/utils/logger');
const secretAttributes = { oAuthCosumerKey: '******', inrixConsumerId: '*****', inrixVendorId: '*****' };
const attributesOnly = _.omit(config, _.isFunction);
const maskedAttributesOnly = _.assignInWith(attributesOnly, secretAttributes, (srcValue, objValue) => {
  return _.isUndefined(srcValue) ? srcValue : objValue;
});
logger.info('%s initialized', config.name, { config: maskedAttributesOnly });

schedulers.init();

app.listen(config.port, () => {
  logger.info('%s listening on port %d', config.name, config.port);
  dataService.listen();
});
