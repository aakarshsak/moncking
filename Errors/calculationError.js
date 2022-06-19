class CalculationError extends Error {
    constructor(status) {
      super('Calculation is not processable and should be corrected to proceed.'); 
      this.name = "CalculationError"; 
      this.status = status
    }
}


module.exports = CalculationError;