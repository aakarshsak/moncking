class InvalidRequestError extends Error {
    constructor(message, status) {
      super(message); 
      this.name = "InvalidRequestError"; 
      this.status = status
    }
}


module.exports = InvalidRequestError;