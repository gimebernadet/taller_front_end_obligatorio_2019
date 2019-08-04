class DomainError extends Error {
    constructor(message) {
        super(message);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        this.isOperational = true;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor);
    }
}

class ResourceNotFoundError extends DomainError {
    constructor(resource) {
        super(`Resource ${resource} was not found.`);
        this.status = 404
        this.data = {
            resource
        };
    }
}

class MethodNotAllowed extends DomainError {
    constructor(reason) {
        super(`Method Not Allowed.`);
        this.status = 405
        this.reason = reason;
    }
}

class BadRequest extends DomainError {
    constructor(reason) {
        super(`Bad Request.`);
        this.status = 400
        this.reason = reason;
    }
}

class TransactionError extends Error {
    constructor(error) {
        super(error.message);
        const isValidationError = error.name === 'ValidationError';
        this.name = isValidationError ? 'BadRequest' : 'InternalServerError';
        this.isOperational = true;
        this.status = isValidationError ? 400 : 500;
        this.data = {
            error
        };

        Error.captureStackTrace(this, this.constructor);
    }
}

class LoginError extends DomainError {
    constructor(message) {
        super(message);
        this.status = 401
    }
}

module.exports = {
    DomainError,
    LoginError,
    MethodNotAllowed,
    BadRequest,
    ResourceNotFoundError,
    TransactionError
};