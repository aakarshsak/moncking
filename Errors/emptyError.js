class EmptyError extends Error {
    constructor(message, status) {
      super('No ' + message + ' found.'); 
      this.name = "EmptyError"; 
      this.status = status
    }
}


module.exports = EmptyError;