class ResponseError extends Error {
  constructor(status, data) {
    data = typeof data === 'string' ? { message: data } : data;

    super(data.message);

    this.status = status;
    this.data = data;
  }
}

module.exports = ResponseError;
