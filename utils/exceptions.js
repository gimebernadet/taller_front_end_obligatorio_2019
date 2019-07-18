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
        this.status = 404
        super(`Resource ${resource} was not found.`);
        this.data = {
            resource
        };
    }
}

class MethodNotAllowed extends DomainError {
    constructor(reason) {
        this.status = 405
        super(`Method Not Allowed.`);
        this.reason = reason;
    }
}

class InternalError extends DomainError {
    constructor(error) {
        super(error.message);
        this.status = 500;
        this.data = {
            error
        };
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
    ResourceNotFoundError,
    InternalError,

};