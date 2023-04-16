class ValidationError extends Error {
    constructor(err) {
        super();
        this.status = 422;
        this.errorObj = err.errors;
    }
}

module.exports = ValidationError;
