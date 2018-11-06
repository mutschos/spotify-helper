const server = require('./dist/server');
const logger = require('winston');

// log level
logger.level = 'debug';

const port = 8888;

const { app } = server.Server.bootstrap(port);

/**
 * Start Express server
 */
app.listen(port, () => {
  logger.debug(`js module is running at http://localhost:${port}`);
  logger.debug('Press CTRL-C to stop');
});
