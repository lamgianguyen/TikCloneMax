// Pino logger. Pretty-prints in dev, JSON in prod. Default singleton; modules
// pull child loggers with `logger.child({ scope: 'me' })` so log lines carry a
// scope tag without each call having to repeat it.

const pino = require('pino');
const { LOG_LEVEL, NODE_ENV } = require('./config');

const isDev = NODE_ENV !== 'production';

const logger = pino({
  level: LOG_LEVEL,
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss.l',
        ignore: 'pid,hostname',
      },
    },
  }),
});

module.exports = logger;
