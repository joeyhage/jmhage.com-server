const createError = require('http-errors');

exports.corsWhitelist = isProduction => {
  if (isProduction) {
    return [
      'https://www.jmhage.com/',
      'https://www.jmhage.com',
      'https://www.adeeperloveretreat.com/',
      'https://www.adeeperloveretreat.com',
      'https://www.happilyeverhage.com/',
      'https://www.happilyeverhage.com',
      'https://portal.happilyeverhage.com/',
      'https://portal.happilyeverhage.com'
    ];
  }
};

exports.corsOptions = whitelist => ({
  origin: (origin, callback) => {
    if (!whitelist || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(createError(400, 'Bad request. Not allowed by CORS.', {
        code: 'ECORS'
      }));
    }
  },
  methods: 'POST'
});