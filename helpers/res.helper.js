class ResHandler {
    setSuccess(statusCode, message, data) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.success = true;
      this.type = 'success';
    }
   
    setError(statusCode, message) {
      this.statusCode = statusCode;
      this.message = message;
      this.success = false;
      this.type = 'error';
    }
  
    send(res) {
      const result = {
        status: this.statusCode,
        message: this.message,
        success: this.success, 
        data: this.data,
      };
      return this.type === 'success'
        ? res.status(this.statusCode).json(result)
        : res.status(this.statusCode).json({
            status: this.type,
            message: this.message,
          });
    }
  }
  
  module.exports = ResHandler;
  