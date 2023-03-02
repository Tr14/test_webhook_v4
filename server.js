'use strict';

const path = require('path');
const cluster = require('cluster');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const execa = require('execa');

const { logger } = require('strapi-utils');
const loadConfiguration = require('strapi/lib/core/app-configuration');
const strapi = require('strapi');

/**
 * `$ strapi develop`
 *
 */
//COPY strapi TO NODE MODULES
// let strapiadminsrc = path.resolve('./src/', 'strapi-admin');
// let strapiadminnms = path.resolve('./node_modules', 'strapi-admin');

// fs.removesync(strapiadminnms);
// fs.copysync(strapiadminsrc, strapiadminnms);
// console.log('\ncopy admin to node_modules successfully.\n');

let strapisrc = path.resolve('./src/strapi', 'lib');
let strapinms = path.resolve('./node_modules/strapi', 'lib');

fs.removeSync(strapinms);
fs.copySync(strapisrc, strapinms);
console.log('\ncopy core to node_modules successfully.\n');

// let strapidatabase = path.resolve('./src/strapi-database', 'lib');
// let strapidatabasenms = path.resolve('./node_modules/strapi-database', 'lib');

// fs.removesync(strapidatabasenms);
// fs.copysync(strapidatabase, strapidatabasenms);
// console.log('\ncopy database to node_modules successfully.\n');

// let strapiconnector = path.resolve('./src/strapi-connector-mongoose', 'lib');
// let strapiconnectornms = path.resolve('./node_modules/strapi-connector-mongoose', 'lib');

// fs.removesync(strapiconnectornms);
// fs.copysync(strapiconnector, strapiconnectornms);
// console.log('\ncopy connector mongoose to node_modules successfully.\n');


	let build = false;
	let watchAdmin = false;
	
  const dir = process.cwd();
  const config = loadConfiguration(dir);

  const adminWatchIgnoreFiles = config.get('server.admin.watchIgnoreFiles', []);

  // Don't run the build process if the admin is in watch mode
  if (build && !watchAdmin && !fs.existsSync(path.join(dir, 'build'))) {
    try {
      execa.shellSync('npm run -s build -- --no-optimization', {
        stdio: 'inherit',
      });
    } catch (err) {
      process.exit(1);
    }
  }

  try {
    if (cluster.isMaster) {
      if (watchAdmin) {
        try {
          execa('npm', ['run', '-s', 'strapi', 'watch-admin'], {
            stdio: 'inherit',
          });
        } catch (err) {
          process.exit(1);
        }
      }

      cluster.on('message', (worker, message) => {
        switch (message) {
          case 'reload':
            logger.info('The server is restarting\n');
            worker.send('isKilled');
            break;
          case 'kill':
            worker.kill();
            cluster.fork();
            break;
          case 'stop':
            worker.kill();
            process.exit(1);
          default:
            return;
        }
      });

      cluster.fork();
    }

    if (cluster.isWorker) {
      const strapiInstance = strapi({
        dir,
        autoReload: true,
        serveAdminPanel: watchAdmin ? false : true,
      });

      // watchFileChanges({
      //   dir,
      //   strapiInstance,
      //   watchIgnoreFiles: adminWatchIgnoreFiles,
      // });

      process.on('message', message => {
        switch (message) {
          case 'isKilled':
            strapiInstance.server.destroy(() => {
              process.send('kill');
            });
            break;
          default:
          // Do nothing.
        }
      });

      return strapiInstance.start();
    }
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }

/**
 * Init file watching to auto restart strapi app
 * @param {Object} options - Options object
 * @param {string} options.dir - This is the path where the app is located, the watcher will watch the files under this folder
 * @param {Strapi} options.strapi - Strapi instance
 * @param {array} options.watchIgnoreFiles - Array of custom file paths that should not be watched
 */
function watchFileChanges({ dir, strapiInstance, watchIgnoreFiles }) {
  const restart = () => {
    if (strapiInstance.reload.isWatching && !strapiInstance.reload.isReloading) {
      strapiInstance.reload.isReloading = true;
      strapiInstance.reload();
    }
  };

  const watcher = chokidar.watch(dir, {
    ignoreInitial: true,
    ignored: [
      /(^|[/\\])\../, // dot files
      /tmp/,
      '**/admin',
      '**/admin/**',
      'extensions/**/admin',
      'extensions/**/admin/**',
      '**/documentation',
      '**/documentation/**',
      '**/node_modules',
      '**/node_modules/**',
      '**/plugins.json',
      '**/index.html',
      '**/public',
      '**/public/**',
      '**/cypress',
      '**/cypress/**',
      '**/*.db*',
      '**/exports/**',
      ...watchIgnoreFiles,
    ],
  });

  watcher
    .on('add', path => {
      strapiInstance.log.info(`File created: ${path}`);
      restart();
    })
    .on('change', path => {
      strapiInstance.log.info(`File changed: ${path}`);
      restart();
    })
    .on('unlink', path => {
      strapiInstance.log.info(`File deleted: ${path}`);
      restart();
    });
}
