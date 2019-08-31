const jwks = require('jwks-rsa');
const jwt = require('express-jwt');

exports.jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://jmhage-general.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://www.jmhage.com/api/happilyeverhage/admin',
  issuer: 'https://jmhage-general.auth0.com/',
  algorithms: ['RS256']
});
