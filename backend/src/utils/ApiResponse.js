export class ApiResponse {
  static success(res, { statusCode = 200, message = 'Success', data = null, meta = undefined }) {
    const body = {
      success: true,
      message,
      data,
    };
    if (meta !== undefined) body.meta = meta;
    return res.status(statusCode).json(body);
  }

  static created(res, { message = 'Created', data = null }) {
    return this.success(res, { statusCode: 201, message, data });
  }

  static fail(res, { statusCode = 400, message = 'Request failed', errors = null }) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
