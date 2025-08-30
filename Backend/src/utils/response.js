class ResponseFormatter {
  static success(data, message = 'Success', statusCode = 200) {
    return {
      success: true,
      message,
      data,
      statusCode
    };
  }

  static error(message = 'Error occurred', statusCode = 500, errors = null) {
    return {
      success: false,
      message,
      errors,
      statusCode
    };
  }

  static paginated(data, page, limit, total, message = 'Success') {
    return {
      success: true,
      message,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = ResponseFormatter;
