import Bunyan from 'bunyan';

import config from '../config';

export const logger = new Bunyan({
  name: 'TodoApp',
  serializers: Bunyan.stdSerializers,
  streams: [{
    level: config.env === 'development' ? 'debug' : 'info',
    stream: process.stdout,
  }],
});
