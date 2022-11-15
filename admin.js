'use strict';

const path = require('path');
const fs = require('fs-extra');
const { green } = require('chalk');
// eslint-disable-next-line node/no-extraneous-require
const { getConfigUrls } = require('strapi-utils');

const loadConfiguration = require('strapi/lib/core/app-configuration');
const addSlash = require('strapi/lib/utils/addSlash');
/**
 * `$ strapi build`
 */
//module.exports = async ({ clean, optimization }) => {

  //COPY TO NODE MODULES
  let strapiAdminSrc = path.resolve('./src/', 'strapi-admin');
  let strapiAdminNms = path.resolve('./node_modules', 'strapi-admin');

  fs.removeSync(strapiAdminNms);
  fs.copySync(strapiAdminSrc, strapiAdminNms);
  
  console.log('\nCopy admin to node_modules successfully.\n');

  const strapiAdmin = require('strapi-admin');
  
  let clean = true;
  let optimization = true;

  const dir = process.cwd();
  const config = loadConfiguration(dir);

  const { serverUrl, adminPath } = getConfigUrls(config.get('server'), true);

  console.log(`Building your admin UI with ${green(config.environment)} configuration ...`);

  if (clean) {
    strapiAdmin.clean({ dir });
  }

  return strapiAdmin
    .build({
      dir,
      // front end build env is always production for now
      env: 'production',
      optimize: optimization,
      options: {
        backend: serverUrl,
        publicPath: addSlash(adminPath),
      },
    })
    .then(() => {
      process.exit();
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
//};
