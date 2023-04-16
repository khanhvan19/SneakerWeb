class UnauthError extends Error {
    constructor(message) {
        super();
        this.status = 401;
        this.message = message;
    }
}

module.exports = UnauthError;
