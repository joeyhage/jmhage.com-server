const isProduction = process.env.NODE_ENV === 'production';

const cors = require('cors');
const debug = require('debug');
const express = require('express');

const corsUtil = require('./util/cors-util');
const mySqlManager = require('./mysql/mysql-manager').mySqlManager();

const error = debug('server:error');
const log = debug('server:log');
log.log = console.log.bind(console);

const app = express();
if (isProduction) {
  app.set('trust proxy', true);
  app.set('trust proxy', 'loopback');
}

const corsWhitelist = corsUtil.corsWhitelist(isProduction);
const corsOptions = corsUtil.corsOptions(corsWhitelist);
const errorMiddleware = require('./middleware/error-middleware').errorMiddleware(error);

const apiRouter = express.Router({});
apiRouter.use('/mail', require('./routes/mail').mailRouter);
apiRouter.use('/happilyeverhage', require('./routes/happilyeverhage').happilyeverhageRouter);

app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', cors(corsOptions), apiRouter);
app.use(errorMiddleware);

process.on('uncaughtException', err => {
  error('Uncaught exception', err);
});

process.on('SIGINT', function () {
  log('Received SIGINT');
  mySqlManager.endPool().then(() => {
  process.exit(0);
  });
});

const port = 3001;
app.listen(port, () => {
  mySqlManager.testPoolConnection();
  log('Listening on port', port);
});
