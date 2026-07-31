export const validate = (schema, property = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    const err = new Error('Validation failed');
    err.statusCode = 422;
    err.errors = details;
    return next(err);
  }

  req[property] = value;
  next();
};
