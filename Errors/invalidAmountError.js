class InvalidAmountError extends Error {
    constructor(message, status) {
      super(message + ' exceeds wallet balance.'); 
      this.name = "InvalidAmountError"; 
      this.status = status
    }
}


module.exports = InvalidAmountError;