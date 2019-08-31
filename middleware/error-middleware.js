exports.errorMiddleware = error => {
  return (err, req, res, next) => {
    if (err.code === 'EBADJSON' || err.code === 'ECORS') {
      error(err.code, err);
      return res.sendStatus(400);
    } else if (err.name === 'UnauthorizedError') {
      error(err.name, err);
      return res.status(401).json({
        name: 'Unauthorized',
        message: err.message
      });
    }
    error(err);
    res.sendStatus(500);
  };
};